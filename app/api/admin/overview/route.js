import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";
import { getEffectiveWorkerProfileVisibility } from "../../../../lib/worker-profile-visibility";

const fallbackAdminEmails = ["contact@lexpat-connect.be"];

function isAdminEmail(user) {
  const allowed = [process.env.CONTACT_EMAIL, ...fallbackAdminEmails]
    .filter(Boolean)
    .map((email) => email.toLowerCase());
  return allowed.includes((user.email || "").toLowerCase());
}

async function assertAdminAccess(supabase, user) {
  if (isAdminEmail(user)) return true;

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return roleRow?.role === "admin";
}

function hydrateWorkers(workers, referralCounts = new Map()) {
  return workers.map((worker) => ({
    id: worker.id,
    fullName: worker.full_name || "Nom non renseigné",
    targetJob: worker.target_job || "Poste non renseigné",
    targetSector: worker.target_sector || "Secteur non renseigné",
    preferredRegion: normalizeRegion(worker.preferred_region),
    experienceLevel: worker.experience_level || "Non renseigné",
    profileVisibility: getEffectiveWorkerProfileVisibility(worker),
    activeReferralLinks: referralCounts.get(worker.user_id) || 0,
    createdAt: worker.created_at
  }));
}

function hydrateOffers(offers, companies) {
  const companyMap = new Map(companies.map((company) => [company.id, company]));

  return offers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    companyName: companyMap.get(offer.employer_profile_id)?.company_name || "Entreprise non renseignée",
    sector: offer.sector || "Non renseigné",
    region: normalizeRegion(offer.region),
    contractType: offer.contract_type || "Non renseigné",
    urgency: offer.urgency || "Non renseigné",
    status: offer.status,
    publishedAt: offer.published_at,
    createdAt: offer.created_at
  }));
}

function hydrateApplications(applications, offers, workers, companies) {
  const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
  const workerMap = new Map(workers.map((worker) => [worker.id, worker]));
  const companyMap = new Map(companies.map((company) => [company.id, company.company_name]));

  return applications.map((application) => {
    const offer = offerMap.get(application.job_offer_id);
    const worker = workerMap.get(application.worker_profile_id);

    return {
      id: application.id,
      offerTitle: offer?.title || "Offre supprimée",
      companyName: offer ? companyMap.get(offer.employer_profile_id) || "Entreprise non renseignée" : "Entreprise inconnue",
      candidateName: worker?.full_name || "Nom non renseigné",
      candidateJob: worker?.target_job || "Métier non renseigné",
      candidateSector: worker?.target_sector || "Secteur non renseigné",
      candidateRegion: normalizeRegion(worker?.preferred_region),
      status: application.status,
      createdAt: application.created_at
    };
  });
}

function hydrateMatches(matches, offers, workers, companies) {
  const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
  const workerMap = new Map(workers.map((worker) => [worker.id, worker]));
  const companyMap = new Map(companies.map((company) => [company.id, company.company_name]));

  return matches.map((match) => {
    const offer = offerMap.get(match.job_offer_id);
    const worker = workerMap.get(match.worker_profile_id);

    return {
      id: match.id,
      offerTitle: offer?.title || "Offre supprimée",
      companyName: offer ? companyMap.get(offer.employer_profile_id) || "Entreprise non renseignée" : "Entreprise inconnue",
      candidateName: worker?.full_name || "Nom non renseigné",
      candidateJob: worker?.target_job || "Métier non renseigné",
      candidateSector: worker?.target_sector || "Secteur non renseigné",
      candidateRegion: normalizeRegion(worker?.preferred_region),
      score: match.score,
      status: match.status,
      createdAt: match.created_at,
      updatedAt: match.updated_at
    };
  });
}

export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const canAccess = await assertAdminAccess(supabase, user);

    if (!canAccess) {
      return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
    }

    const [
      offersResponse,
      applicationsResponse,
      matchesResponse,
      workersResponse,
      companiesResponse,
      referralsResponse
    ] = await Promise.all([
      supabase
        .from("job_offers")
        .select("id, employer_profile_id, title, sector, region, contract_type, urgency, status, published_at, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("job_applications")
        .select("id, job_offer_id, worker_profile_id, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("matches")
        .select("id, job_offer_id, worker_profile_id, score, status, created_at, updated_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("worker_profiles")
        .select("id, user_id, full_name, target_job, target_sector, preferred_region, experience_level, profile_visibility, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("employer_profiles")
        .select("id, company_name"),
      supabase
        .from("referrals")
        .select("referrer_user_id, status")
        .neq("status", "invalid")
    ]);

    if (offersResponse.error) throw offersResponse.error;
    if (applicationsResponse.error) throw applicationsResponse.error;
    if (matchesResponse.error) throw matchesResponse.error;
    if (workersResponse.error) throw workersResponse.error;
    if (companiesResponse.error) throw companiesResponse.error;
    if (referralsResponse.error) throw referralsResponse.error;

    const offers = offersResponse.data || [];
    const applications = applicationsResponse.data || [];
    const matches = matchesResponse.data || [];
    const workers = workersResponse.data || [];
    const companies = companiesResponse.data || [];
    const referrals = referralsResponse.data || [];
    const referralCounts = referrals.reduce((map, referral) => {
      const key = referral.referrer_user_id;
      if (!key) return map;
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map());

    return NextResponse.json({
      summary: {
        offers: offers.length,
        publishedOffers: offers.filter((offer) => offer.status === "published").length,
        workers: workers.length,
        visibleWorkers: workers.filter((w) => getEffectiveWorkerProfileVisibility(w) === "visible").length,
        matches: matches.length,
        newMatches: matches.filter((match) => match.status === "new").length
      },
      offers: hydrateOffers(offers, companies),
      workers: hydrateWorkers(workers, referralCounts),
      applications: hydrateApplications(applications, offers, workers, companies),
      matches: hydrateMatches(matches, offers, workers, companies)
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Impossible de charger le tableau de bord admin." }, { status: 500 });
  }
}
