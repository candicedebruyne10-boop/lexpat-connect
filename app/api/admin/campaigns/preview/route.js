/**
 * GET /api/admin/campaigns/preview?template=visibility_initial&locale=fr
 *
 * Retourne le HTML rendu d'un template pour prévisualisation.
 * Utilise des données fictives pour le contact.
 */

import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import {
  workerVisibilityPriorityEmailHtml,
  workerProfileIncompleteEmailHtml,
  workerCompleteProfileEmailHtml,
  employerPublishOfferEmailHtml,
  inactivityReminderEmailHtml,
  genericCampaignEmailHtml,
  customCampaignEmailHtml,
} from "../../../../../lib/email-templates";

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

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const url       = new URL(request.url);
    const template  = url.searchParams.get("template")   || "visibility_initial";
    const locale    = url.searchParams.get("locale")     || "fr";
    const customHtml= url.searchParams.get("custom_html") || "";

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
    const isEn    = locale === "en";

    // Contact fictif pour la prévisualisation
    const demoContact = {
      name:         isEn ? "Marie Dupont" : "Marie Dupont",
      email:        "marie.dupont@example.com",
      type:         "worker",
      locale,
      referral_code: "LP-DEMO01",
    };

    const profileUrl  = `${baseUrl}${isEn ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;
    const referralUrl = `${baseUrl}${isEn ? "/en/inscription" : "/inscription"}?ref=LP-DEMO01`;

    let html = "";

    if (template === "visibility_initial" || template === "visibility_reminder") {
      html = workerVisibilityPriorityEmailHtml({
        locale,
        recipientName: demoContact.name,
        profileUrl,
        referralUrl,
        recipientEmail: demoContact.email,
        reminder: template === "visibility_reminder",
      });
    } else if (template === "complete_profile") {
      html = workerProfileIncompleteEmailHtml({
        locale,
        recipientName: demoContact.name,
        profileUrl,
        recipientEmail: demoContact.email,
      });
    } else if (template === "employer_publish_offer") {
      html = employerPublishOfferEmailHtml({
        locale,
        recipientName: demoContact.name,
        companyName: "Acme SA",
        spaceUrl: `${baseUrl}${isEn ? "/en/employeurs/espace" : "/employeurs/espace"}`,
        recipientEmail: demoContact.email,
      });
    } else if (template === "inactivity_reminder") {
      html = inactivityReminderEmailHtml({
        locale,
        recipientName: demoContact.name,
        profileUrl,
        recipientEmail: demoContact.email,
      });
    } else if (template === "custom") {
      const bodyText = (customHtml || "Bonjour {{name}},\n\nVoici votre message personnalisé.\n\nVotre espace : {{profile_url}}\n\nVotre lien d'affiliation : {{referral_url}}")
        .replace(/\{\{name\}\}/g, demoContact.name)
        .replace(/\{\{email\}\}/g, demoContact.email)
        .replace(/\{\{profile_url\}\}/g, profileUrl)
        .replace(/\{\{referral_url\}\}/g, referralUrl);
      html = customCampaignEmailHtml({ locale, bodyText, recipientEmail: demoContact.email });
    } else {
      html = genericCampaignEmailHtml({
        locale,
        recipientName: demoContact.name,
        spaceUrl: profileUrl,
        recipientEmail: demoContact.email,
      });
    }

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
