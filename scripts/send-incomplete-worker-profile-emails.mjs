import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { workerVisibilityPriorityEmailHtml } from "../lib/email-templates.js";

const REFERRAL_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REMINDER_MODE = process.argv.includes("--reminder");
const TARGET_EMAIL = process.env.TARGET_EMAIL?.trim().toLowerCase() || null;

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function resolvePublicSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://lexpat-connect.be";
  if (raw.includes("localhost") || raw.includes("127.0.0.1")) {
    return "https://lexpat-connect.be";
  }
  return raw.replace(/\/$/, "");
}

function generateReferralCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += REFERRAL_CHARS[Math.floor(Math.random() * REFERRAL_CHARS.length)];
  }
  return `LP-${code}`;
}

async function ensureReferralCode(supabase, profile) {
  if (profile.referral_code) return profile.referral_code;

  let attempts = 0;
  while (attempts < 10) {
    const code = generateReferralCode();
    const { error } = await supabase
      .from("worker_profiles")
      .update({ referral_code: code })
      .eq("id", profile.id)
      .is("referral_code", null);

    if (!error) return code;
    attempts += 1;
  }

  throw new Error(`Unable to generate referral code for worker profile ${profile.id}`);
}

async function main() {
  const supabase = createServiceClient();
  const resend = new Resend(getEnv("RESEND_API_KEY"));
  const from = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";
  const baseUrl = resolvePublicSiteUrl();

  const { data: profiles, error } = await supabase
    .from("worker_profiles")
    .select("id, user_id, full_name, target_job, target_sector, profile_visibility, referral_code")
    .eq("profile_visibility", "hidden");

  if (error) {
    throw error;
  }

  const sentRecipients = [];
  const failedRecipients = [];

  for (const profile of profiles || []) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
    if (userError || !userData?.user?.email) continue;
    if (TARGET_EMAIL && userData.user.email.toLowerCase() !== TARGET_EMAIL) continue;

    const locale = userData.user.user_metadata?.preferred_locale === "en" ? "en" : "fr";
    const profileUrl = `${baseUrl}${locale === "en" ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;
    const referralCode = await ensureReferralCode(supabase, profile);
    const referralUrl = `${baseUrl}${locale === "en" ? "/en/inscription" : "/inscription"}?ref=${encodeURIComponent(referralCode)}`;

    const response = await resend.emails.send({
      from,
      to: userData.user.email,
      subject: locale === "en"
        ? (REMINDER_MODE ? "Reminder: make your profile visible before Monday" : "Make your profile visible before Monday")
        : (REMINDER_MODE ? "Rappel : rendez votre profil visible avant lundi" : "Rendez votre profil visible avant lundi"),
      html: workerVisibilityPriorityEmailHtml({
        locale,
        recipientName: profile.full_name || userData.user.user_metadata?.full_name || "",
        profileUrl,
        referralUrl,
        recipientEmail: userData.user.email,
        reminder: REMINDER_MODE
      })
    });

    if (response?.error) {
      failedRecipients.push({
        email: userData.user.email,
        locale,
        error: response.error.message || "Unknown Resend error"
      });
      continue;
    }

    sentRecipients.push({
      email: userData.user.email,
      locale,
      id: response?.data?.id || null
    });
  }

  console.log(JSON.stringify({
    mode: REMINDER_MODE ? "reminder" : "initial",
    targetEmail: TARGET_EMAIL,
    sent: sentRecipients.length,
    failed: failedRecipients.length,
    recipients: sentRecipients,
    failures: failedRecipients
  }, null, 2));
}

main().catch((error) => {
  console.error("[send-incomplete-worker-profile-emails] Failed:", error);
  process.exit(1);
});
