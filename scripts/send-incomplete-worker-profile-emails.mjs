import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const REFERRAL_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REMINDER_MODE = process.argv.includes("--reminder");

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

function escapeHtml(value) {
  if (!value) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function workerVisibilityPriorityEmailHtml({ locale = "fr", recipientName, profileUrl, referralUrl, reminder = false }) {
  const isEn = locale === "en";
  const title = isEn
    ? reminder
      ? "Reminder: make your profile visible before Monday"
      : "Make your profile visible before Monday"
    : reminder
      ? "Rappel : rendez votre profil visible avant lundi"
      : "Rendez votre profil visible avant lundi";

  return `<!DOCTYPE html>
  <html lang="${locale}">
    <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f4f7fb;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#1E3A78 0%,#204E97 100%);padding:28px 40px;">
                  <div style="font-size:22px;font-weight:800;color:#ffffff;">LEXPAT</div>
                  <div style="font-size:12px;font-weight:700;letter-spacing:3px;color:#57B7AF;">CONNECT</div>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 40px;">
                  <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:#1E3A78;">${escapeHtml(title)}</h1>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn ? `Hello${recipientName ? ` ${escapeHtml(recipientName)}` : ""},` : `Bonjour${recipientName ? ` ${escapeHtml(recipientName)}` : ""},`}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "Thank you for signing up. Thank you as well for your trust."
                    : "Merci pour votre inscription. Merci aussi pour votre confiance."}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "You are one of the first talents in our community on LEXPAT Connect."
                    : "Vous faites partie des premiers talents de notre communauté sur LEXPAT Connect."}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "Your account is active, but your profile is not yet visible."
                    : "Votre compte est bien créé, mais votre profil n’est pas encore visible."}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "To be part of the first selection, please complete your profile and make it visible before Monday."
                    : "Pour faire partie de la première sélection, merci de compléter votre profil et de le rendre visible avant lundi."}</p>
                  <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "Visible profiles will be highlighted first to the first pilot employers."
                    : "Les profils visibles seront mis en avant en priorité auprès des premiers employeurs pilotes."}</p>
                  <a href="${profileUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#1E3A78 0%,#204E97 100%);border-radius:10px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">${isEn ? "Complete and publish my profile" : "Compléter et rendre visible mon profil"}</a>
                  <div style="margin:28px 0 0;padding-top:24px;border-top:1px solid #e6edf5;">
                    <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                      ? "You can also share your personal referral link with 3 qualified contacts in your field:"
                      : "Vous pouvez aussi partager votre lien personnel de référencement à 3 contacts qualifiés de votre domaine :"}</p>
                    <div style="margin:0 0 16px;padding:14px 16px;border:1px solid #dce7f2;border-radius:12px;background:#f8fbff;font-size:13px;line-height:1.8;color:#1E3A78;word-break:break-all;">${escapeHtml(referralUrl)}</div>
                    <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                      ? "If 3 qualified people sign up through your link, your profile will be highlighted in priority."
                      : "Si 3 personnes qualifiées s’inscrivent via votre lien, votre profil sera mis en avant en priorité."}</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                      ? 'Once your profile is visible, you can simply reply to this email.'
                      : 'Une fois votre profil rendu visible, vous pouvez simplement répondre à cet email.'}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

async function main() {
  const supabase = createServiceClient();
  const resend = new Resend(getEnv("RESEND_API_KEY"));
  const from = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

  const { data: profiles, error } = await supabase
    .from("worker_profiles")
    .select("id, user_id, full_name, target_job, target_sector, profile_visibility, referral_code")
    .eq("profile_visibility", "hidden");

  if (error) {
    throw error;
  }

  const recipients = [];

  for (const profile of profiles || []) {
    const hasRequiredFields = !!(profile.target_job?.trim() && profile.target_sector?.trim());
    if (hasRequiredFields) continue;

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
    if (userError || !userData?.user?.email) continue;

    const locale = userData.user.user_metadata?.preferred_locale === "en" ? "en" : "fr";
    const profileUrl = `${baseUrl}${locale === "en" ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;
    const referralCode = await ensureReferralCode(supabase, profile);
    const referralUrl = `${baseUrl}${locale === "en" ? "/en/inscription" : "/inscription"}?ref=${encodeURIComponent(referralCode)}`;

    recipients.push({
      email: userData.user.email,
      locale,
      fullName: profile.full_name || userData.user.user_metadata?.full_name || ""
    });

    await resend.emails.send({
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
        reminder: REMINDER_MODE
      })
    });
  }

  console.log(JSON.stringify({
    mode: REMINDER_MODE ? "reminder" : "initial",
    sent: recipients.length,
    recipients: recipients.map((item) => ({ email: item.email, locale: item.locale }))
  }, null, 2));
}

main().catch((error) => {
  console.error("[send-incomplete-worker-profile-emails] Failed:", error);
  process.exit(1);
});
