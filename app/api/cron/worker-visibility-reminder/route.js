import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "../../../../lib/supabase/server";
import { getSenderAddress } from "../../../../lib/email-routing";
import { isUnsubscribed } from "../../../../lib/email-unsubscribe";
import { generateUniqueReferralCode, buildReferralUrl } from "../../../../lib/referral";
import { WorkerVisibilityEmail } from "../../../../emails/WorkerVisibilityEmail.jsx";

const ONE_TIME_REMINDER_DATE = "2026-04-17";

function isAuthorized(request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (userAgent.startsWith("vercel-cron/")) return true;

  const token = request.nextUrl.searchParams.get("token");
  return !!(process.env.CRON_SECRET && token === process.env.CRON_SECRET);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestedDate = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Brussels" });
  if (requestedDate !== ONE_TIME_REMINDER_DATE) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `One-time reminder is only allowed on ${ONE_TIME_REMINDER_DATE}.`,
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }

  const supabase = getServiceClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

  const { data: profiles, error } = await supabase
    .from("worker_profiles")
    .select("id, user_id, full_name, profile_visibility, referral_code")
    .eq("profile_visibility", "hidden");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sent = [];
  const failed = [];

  for (const profile of profiles || []) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
    if (userError || !userData?.user?.email) continue;

    const unsubscribed = await isUnsubscribed(userData.user.email).catch(() => false);
    if (unsubscribed) continue;

    let referralCode = profile.referral_code;
    if (!referralCode) {
      referralCode = await generateUniqueReferralCode(supabase);
      const { error: updateError } = await supabase
        .from("worker_profiles")
        .update({ referral_code: referralCode })
        .eq("id", profile.id);

      if (updateError) continue;
    }

    const locale = userData.user.user_metadata?.preferred_locale === "en" ? "en" : "fr";
    const profileUrl = `${baseUrl}${locale === "en" ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;
    const referralUrl = buildReferralUrl(referralCode, locale);

    const response = await resend.emails.send({
      from: getSenderAddress(),
      to: userData.user.email,
      subject: locale === "en"
        ? "Reminder: make your profile visible before Monday"
        : "Rappel : rendez votre profil visible avant lundi",
      react: <WorkerVisibilityEmail
        recipientName={profile.full_name || userData.user.user_metadata?.full_name || ""}
        profileUrl={profileUrl}
        referralUrl={referralUrl}
        recipientEmail={userData.user.email}
        reminder={true}
      />
    }).catch((error) => ({ error }));

    if (response?.error) {
      failed.push({
        email: userData.user.email,
        error: response.error.message || "Unknown Resend error"
      });
      continue;
    }

    sent.push({
      email: userData.user.email,
      id: response?.data?.id || null
    });
  }

  return NextResponse.json({
    ok: true,
    reminder: true,
    sent: sent.length,
    failed: failed.length,
    recipients: sent,
    failures: failed
  });
}
