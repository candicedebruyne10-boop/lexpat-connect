import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

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

function workerProfileIncompleteEmailHtml({ locale = "fr", recipientName, profileUrl }) {
  const isEn = locale === "en";

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
                  <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:#1E3A78;">${isEn ? "Your profile is saved, but not yet visible" : "Votre profil est enregistré, mais pas encore visible"}</h1>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn ? `Hello${recipientName ? ` ${escapeHtml(recipientName)}` : ""},` : `Bonjour${recipientName ? ` ${escapeHtml(recipientName)}` : ""},`}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "Your LEXPAT Connect profile has been saved. It cannot be published to employers yet because some key matching information is still missing."
                    : "Votre profil LEXPAT Connect a bien été enregistré. Il ne peut pas encore être publié auprès des employeurs, car certaines informations clés pour le matching sont encore manquantes."}</p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "To make your profile visible, please add at least your target job and your target sector."
                    : "Pour rendre votre profil visible, merci de renseigner au minimum votre métier recherché et votre secteur visé."}</p>
                  <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#3d5066;">${isEn
                    ? "You can also improve your visibility by adding your preferred region, experience level and a short presentation."
                    : "Vous pouvez aussi améliorer votre visibilité en ajoutant votre région souhaitée, votre niveau d’expérience et une courte présentation."}</p>
                  <a href="${profileUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#1E3A78 0%,#204E97 100%);border-radius:10px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">${isEn ? "Complete my profile" : "Compléter mon profil"}</a>
                  <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#3d5066;">${isEn
                    ? 'If you have a technical issue, contact us at <a href="mailto:contact@lexpat-connect.be" style="color:#204E97;text-decoration:none;">contact@lexpat-connect.be</a>.'
                    : 'Si vous rencontrez une difficulté technique, vous pouvez nous écrire à <a href="mailto:contact@lexpat-connect.be" style="color:#204E97;text-decoration:none;">contact@lexpat-connect.be</a>.'}</p>
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
    .select("id, user_id, full_name, target_job, target_sector, profile_visibility")
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

    recipients.push({
      email: userData.user.email,
      locale,
      fullName: profile.full_name || userData.user.user_metadata?.full_name || ""
    });

    await resend.emails.send({
      from,
      to: userData.user.email,
      subject: locale === "en"
        ? "Complete your profile to make it visible"
        : "Complétez votre profil pour le rendre visible",
      html: workerProfileIncompleteEmailHtml({
        locale,
        recipientName: profile.full_name || userData.user.user_metadata?.full_name || "",
        profileUrl
      })
    });
  }

  console.log(JSON.stringify({
    sent: recipients.length,
    recipients: recipients.map((item) => ({ email: item.email, locale: item.locale }))
  }, null, 2));
}

main().catch((error) => {
  console.error("[send-incomplete-worker-profile-emails] Failed:", error);
  process.exit(1);
});
