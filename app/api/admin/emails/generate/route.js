import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import { generateEmail } from "../../../../../lib/email-generator";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((e) => e.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const body = await request.json().catch(() => ({}));
    const result = await generateEmail({
      prompt:   body.prompt   || "",
      audience: body.audience || "employer",
      locale:   body.locale   || "fr",
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
