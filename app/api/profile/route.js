import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";
import { normalizeRegion, computeMatchScore } from "../../../lib/matching";
import { parseRegionSelection } from "../../../lib/professions";
import { Resend } from "resend";
import { getSenderAddress } from "../../../lib/email-routing";
import { newWorkerMatchEmailHtml, workerProfileIncompleteEmailHtml } from "../../../lib/email-templates";
import { isUnsubscribed } from "../../../lib/email-unsubscribe";

const regionToDb = {
  "Bruxelles-Capitale": "brussels",
  Wallonie: "wallonia",
  Flandre: "flanders",
  "Plusieurs régions": "multi_region",
  "Toute la Belgique": "multi_region"
};

export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();
    const locale = body.preferred_locale === "en" ? "en" : "fr";
    const selectedJobOption = body.job_option || body.profession || body.job_title || "";
    const otherJobTitle = body.job_title_other || body.otherProfession || "";
    const finalJobTitle =
      selectedJobOption === "Autre profession"
        ? otherJobTitle || ""
        : selectedJobOption || "";
    const selectedRegions = parseRegionSelection(body.region || body.regions);
    const normalizedRegion =
      selectedRegions.length > 1
        ? "multi_region"
        : regionToDb[selectedRegions[0]] || null;
    const languages = Array.isArray(body.languages)
      ? body.languages
      : String(body.languages || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    // A profile can only be visible if the two fields required for matching are present
    const hasRequiredFields = !!(finalJobTitle?.trim() && body.sector?.trim());
    const effectiveProfileVisibility = hasRequiredFields
      ? (body.profile_visibility || "visible")
      : "hidden";

    const { data: previousProfile } = await supabase
      .from("worker_profiles")
      .select("id, profile_visibility")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = await supabase
      .from("worker_profiles")
      .upsert(
        {
          user_id: user.id,
          target_job: finalJobTitle || null,
          target_job_other: selectedJobOption === "Autre profession" ? otherJobTitle || null : null,
          target_sector: body.sector || null,
          preferred_region: normalizedRegion,
          experience_level: body.experience || null,
          languages,
          summary: body.description || null,
          full_name: body.full_name || null,
          profile_visibility: effectiveProfileVisibility
        },
        { onConflict: "user_id" }
      );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        preferred_locale: locale,
        match_alerts_enabled: body.match_alerts_enabled !== false
      }
    }).catch(() => {});

    const shouldSendIncompleteProfileEmail =
      effectiveProfileVisibility === "hidden" &&
      previousProfile?.profile_visibility !== "hidden";

    if (shouldSendIncompleteProfileEmail && user.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const profileUrlBase = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
      const profileUrl = `${profileUrlBase}${locale === "en" ? "/en/travailleurs/espace" : "/travailleurs/espace"}`;

      resend.emails.send({
        from: getSenderAddress(),
        to: user.email,
        subject: locale === "en"
          ? "Complete your profile to make it visible"
          : "Complétez votre profil pour le rendre visible",
        html: workerProfileIncompleteEmailHtml({
          locale,
          recipientName: body.full_name || user.user_metadata?.full_name || "",
          profileUrl
        })
      }).catch(() => {});
    }

    // Notifier les employeurs dont les offres correspondent à ce profil (best-effort, non-bloquant)
    if (effectiveProfileVisibility === "visible") {
      notifyMatchingEmployers({
        userId: user.id,
        targetJob: finalJobTitle,
        sector: body.sector || null,
        region: normalizedRegion,
        experience: body.experience || null
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, forced_hidden: !hasRequiredFields, profile_visibility: effectiveProfileVisibility });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * Cherche les offres actives qui correspondent au profil travailleur
 * et envoie un email de notification aux employeurs concernés.
 */
async function notifyMatchingEmployers({ userId, targetJob, sector, region, experience }) {
  if (!targetJob) return;

  const supabase = getServiceClient();

  // Récupérer toutes les offres publiées avec les infos de l'employeur
  const { data: offers } = await supabase
    .from("job_offers")
    .select("id, title, sector, region, employer_profile_id")
    .eq("status", "published");

  if (!offers?.length) return;

  const matchedRows = [];

  const workerForMatch = {
    profile_visibility: "visible",
    job_title: targetJob,
    sector,
    region,
    experience
  };

  for (const offer of offers) {
    const score = computeMatchScore(workerForMatch, {
      job_title: offer.title,
      sector: offer.sector,
      region: offer.region
    });

    if (score < 40) continue;
    matchedRows.push({
      job_offer_id: offer.id,
      worker_profile_id: null,
      score,
      status: "new"
    });
  }

  if (!matchedRows.length) return;

  const { data: worker } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!worker?.id) return;

  await supabase
    .from("matches")
    .upsert(
      matchedRows.map((row) => ({
        ...row,
        worker_profile_id: worker.id
      })),
      { onConflict: "job_offer_id,worker_profile_id" }
    );

  // Notifier les employeurs par email (best-effort)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = getSenderAddress();

  for (const row of matchedRows) {
    const { data: members } = await supabase
      .from("employer_members")
      .select("work_email")
      .eq("employer_profile_id",
        (await supabase.from("job_offers").select("employer_profile_id").eq("id", row.job_offer_id).maybeSingle()).data?.employer_profile_id
      );

    const offer = offers.find((o) => o.id === row.job_offer_id);

    for (const member of members || []) {
      if (!member.work_email) continue;
      const unsubbed = await isUnsubscribed(member.work_email).catch(() => false);
      if (unsubbed) continue;
      await resend.emails.send({
        from,
        to: member.work_email,
        subject: `[LEXPAT Connect] Un nouveau candidat correspond à votre offre "${offer?.title}"`,
        html: newWorkerMatchEmailHtml({
          targetJob,
          sector,
          region: normalizeRegion(region),
          experience,
          offerTitle: offer?.title,
          recipientEmail: member.work_email
        })
      }).catch(() => {});
    }
  }
}

/**
 * GET /api/profile
 * Returns the worker profile for the authenticated user.
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    const { data } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      profile: data
        ? {
            ...data,
            job_title: data.target_job || "",
            job_option: data.target_job_other ? "Autre profession" : data.target_job || "",
            otherProfession: data.target_job_other || "",
            sector: data.target_sector || "",
            region: normalizeRegion(data.preferred_region),
            regions: parseRegionSelection(data.preferred_region),
            experience: data.experience_level || "",
            languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "",
            description: data.summary || "",
            preferred_locale: user.user_metadata?.preferred_locale === "en" ? "en" : "fr",
            match_alerts_enabled: user.user_metadata?.match_alerts_enabled !== false
          }
        : null
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * DELETE /api/profile
 * Deletes the worker profile of the authenticated user.
 */
export async function DELETE(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    const { error } = await supabase
      .from("worker_profiles")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
