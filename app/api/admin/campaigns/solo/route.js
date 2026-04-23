/**
 * POST /api/admin/campaigns/solo
 * Envoie un email individuel à n'importe quelle adresse depuis l'admin.
 *
 * Body JSON :
 *   { email, prenom?, societe?, subject, body }
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import { customCampaignEmailHtml } from "../../../../../lib/email-templates";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map(e => e.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

function applyVariables(template, contact) {
  return template
    .replace(/\{\{prenom\}\}/gi,  contact.prenom  || "")
    .replace(/\{\{nom\}\}/gi,     contact.nom     || "")
    .replace(/\{\{societe\}\}/gi, contact.societe || "")
    .replace(/\{\{email\}\}/gi,   contact.email   || "");
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const { email, prenom = "", societe = "", subject, body: bodyTpl } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: "Le sujet est obligatoire." }, { status: 400 });
    }
    if (!bodyTpl?.trim()) {
      return NextResponse.json({ error: "Le corps du message est obligatoire." }, { status: 400 });
    }

    const contact = { email, prenom, societe, nom: "" };
    const bodyText = applyVariables(bodyTpl, contact);
    const subjectFinal = applyVariables(subject, contact);

    const html = customCampaignEmailHtml({
      locale: "fr",
      bodyText,
      recipientEmail: email,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from   = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: subjectFinal,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, to: email });
  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
