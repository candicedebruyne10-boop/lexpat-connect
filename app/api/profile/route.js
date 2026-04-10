import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";
import { normalizeRegion, computeMatchScore } from "../../../lib/matching";
import { parseRegionSelection } from "../../../lib/professions";
import { notifyEmployersForNewWorker } from "../../../lib/match-notifications";

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
          profile_visibility: body.profile_visibility || "review"
        },
        { onConflict: "user_id" }
      );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        preferred_locale: body.preferred_locale === "en" ? "en" : "fr",
        match_alerts_enabled: body.match_alerts_enabled !== false
      }
    }).catch(() => {});

    // Notifier les employeurs dont les offres correspondent à ce profil (best-effort, non-bloquant)
    if (body.profile_visibility === "visible") {
      notifyMatchingEmployers({
        userId: user.id,
        targetJob: finalJobTitle,
        sector: body.sector || null,
        region: normalizedRegion,
        experience: body.experience || null
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
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

  await notifyEmployersForNewWorker({
    supabase,
    workerProfileId: worker.id
  });
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
