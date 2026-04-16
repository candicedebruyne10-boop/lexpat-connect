import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";
import { workerVisibilityPriorityEmailHtml } from "../../../../lib/email-templates";
import { buildReferralUrl, generateUniqueReferralCode } from "../../../../lib/referral";

const ADMIN_EMAILS = ["lexpat@lexpat.be", "contact@lexpat-connect.be"];

function isAdmin(user) {
  return ADMIN_EMAILS.includes((user.email || "").toLowerCase());
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    if (!isAdmin(user)) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const reminder = body.reminder === true;
    const dryRun  = body.dry_run  === true; // true = simule sans envoyer

    const supabase = getServiceClient();
    const resend   = new Resend(process.env.RESEND_API_KEY);
    const from     = process.env.RESEND_FROM_EMAIL || "contact@lexpat-connect.be";
    const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

    // 1. Récupère tous les profils masqués
    const { data: profiles, error } = await supabase
      .from("worker_profiles")
      .select("id, user_id, full_name, referral_code")
      .eq("profile_visibility", "hidden");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const sent    = [];
    const skipped = [];
    const failed  = [];

    for (const profile of profiles || []) {
      // 2. Récupère l'email du compte auth
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(profile.user_id);

      if (userError || !userData?.user?.email) {
        skipped.push({ id: profile.id, reason: "no email" });
        continue;
      }

      const email  = userData.user.email;
      const locale = userData.user.user_metadata?.preferred_locale === "en" ? "en" : "fr";

      // 3. Assure un code de parrainage
      let code = profile.referral_code;
      if (!code) {
        try {
          code = await generateUniqueReferralCode(supabase);
          await supabase
            .from("worker_profiles")
            .update({ referral_code: code })
            .eq("id", profile.id);
        } catch {
          skipped.push({ email, reason: "referral code failed" });
          continue;
        }
      }

      const profileUrl   = `${baseUrl}${locale === "en" ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;
      const referralUrl  = buildReferralUrl(code, locale);
      const recipientName = profile.full_name || userData.user.user_metadata?.full_name || "";
      const subject = locale === "en"
        ? (reminder ? "Reminder: make your profile visible before Monday" : "Make your profile visible before Monday")
        : (reminder ? "Rappel : rendez votre profil visible avant lundi" : "Rendez votre profil visible avant lundi");

      // 4. Envoi (ou simulation si dry_run)
      if (dryRun) {
        sent.push({ email, locale, dry: true });
        continue;
      }

      const { error: sendError } = await resend.emails.send({
        from,
        to: email,
        subject,
        html: workerVisibilityPriorityEmailHtml({
          locale,
          recipientName,
          profileUrl,
          referralUrl,
          recipientEmail: email,
          reminder,
        }),
      });

      if (sendError) {
        failed.push({ email, error: sendError.message });
      } else {
        sent.push({ email, locale });
      }
    }

    return NextResponse.json({
      ok: true,
      dry_run: dryRun,
      reminder,
      total_hidden: (profiles || []).length,
      sent: sent.length,
      skipped: skipped.length,
      failed: failed.length,
      recipients: sent,
      failures: failed,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
