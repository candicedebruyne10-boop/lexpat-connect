import { normalizeRegion } from "./matching";
import { getServiceClient } from "./supabase/server";

const REGION_LABELS = {
  "Bruxelles-Capitale": "Brussels-Capital",
  Wallonie: "Wallonia",
  Flandre: "Flanders",
  "Plusieurs régions": "Multiple regions"
};

const CONTRACT_LABELS = {
  CDI: "Permanent contract",
  CDD: "Fixed-term contract",
  Freelance: "Freelance",
  "Temps plein": "Full-time",
  "Temps partiel": "Part-time"
};

const URGENCY_LABELS = {
  "Élevée": "High",
  Moyenne: "Medium",
  Faible: "Low"
};

const STATUS_LABELS = {
  published: { fr: "Publiée", en: "Published" },
  submitted: { fr: "Soumise", en: "Submitted" },
  reviewing: { fr: "En revue", en: "In review" },
  shortlisted: { fr: "Présélectionnée", en: "Shortlisted" },
  contacted: { fr: "Contactée", en: "Contacted" },
  rejected: { fr: "Refusée", en: "Rejected" },
  hired: { fr: "Finalisée", en: "Completed" },
  matched: { fr: "Match confirmé", en: "Confirmed match" }
};

const EXPERIENCE_LABELS = {
  "0 à 2 ans": "0 to 2 years",
  "3 à 5 ans": "3 to 5 years",
  "5 à 10 ans": "5 to 10 years",
  "10 ans et plus": "10+ years",
  "Débutant": "Entry level",
  "Intermédiaire": "Intermediate",
  "Confirmé": "Experienced",
  "Senior": "Senior"
};

const LANGUAGE_LABELS = {
  Français: "French",
  Anglais: "English",
  Néerlandais: "Dutch",
  Allemand: "German"
};

function localize(value, map, locale) {
  if (!value) return locale === "en" ? "Not provided" : "Non renseigné";
  return locale === "en" ? map[value] || value : value;
}

function localizeStatus(value, locale) {
  if (!value) return locale === "en" ? "Not provided" : "Non renseigné";
  return STATUS_LABELS[value]?.[locale] || value;
}

function localizeRegion(value, locale) {
  const region = normalizeRegion(value);
  return locale === "en" ? REGION_LABELS[region] || region : region;
}

function localizeLanguages(value, locale) {
  if (!value) return [];
  const labels = Array.isArray(value) ? value : String(value).split(",");
  return labels.map((item) => {
    const label = item.trim();
    return locale === "en" ? LANGUAGE_LABELS[label] || label : label;
  }).filter(Boolean);
}

function buildAnonymousLabel(worker, index, locale) {
  const suffix = String(index + 1).padStart(2, "0");
  const job = worker.target_job || (locale === "en" ? "Profile" : "Profil");
  return locale === "en" ? `${job} · Candidate ${suffix}` : `${job} · Candidat ${suffix}`;
}

export async function getPublicOffersData(locale = "fr") {
  const supabase = getServiceClient();
  const offersResponse = await supabase
    .from("job_offers")
    .select("id, title, sector, region, contract_type, urgency, status, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (offersResponse.error) throw offersResponse.error;

  const rows = (offersResponse.data || []).map((offer) => ({
    id: offer.id,
    title: offer.title || (locale === "en" ? "Job opening" : "Offre d'emploi"),
    eyebrow: offer.sector || (locale === "en" ? "Sector not provided" : "Secteur non renseigné"),
    companyName: offer.sector || (locale === "en" ? "Sector not provided" : "Secteur non renseigné"),
    region: localizeRegion(offer.region, locale),
    contractType: localize(offer.contract_type, CONTRACT_LABELS, locale),
    urgency: localize(offer.urgency, URGENCY_LABELS, locale),
    status: localizeStatus(offer.status, locale)
  }));

  return {
    summary: {
      total: rows.length,
      sectors: new Set(rows.map((row) => row.eyebrow)).size,
      regions: new Set(rows.map((row) => row.region)).size
    },
    rows
  };
}

export async function getPublicApplicationsData(locale = "fr") {
  const supabase = getServiceClient();
  const [applicationsResponse, offersResponse, employersResponse, workersResponse] = await Promise.all([
    supabase
      .from("job_applications")
      .select("id, job_offer_id, worker_profile_id, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("job_offers")
      .select("id, employer_profile_id, title"),
    supabase
      .from("employer_profiles")
      .select("id, company_name"),
    supabase
      .from("worker_profiles")
      .select("id, target_job, target_sector, preferred_region, experience_level, languages")
  ]);

  if (applicationsResponse.error) throw applicationsResponse.error;
  if (offersResponse.error) throw offersResponse.error;
  if (employersResponse.error) throw employersResponse.error;
  if (workersResponse.error) throw workersResponse.error;

  const offerMap = new Map((offersResponse.data || []).map((offer) => [offer.id, offer]));
  const employerMap = new Map((employersResponse.data || []).map((employer) => [employer.id, employer.company_name]));
  const workerMap = new Map((workersResponse.data || []).map((worker) => [worker.id, worker]));

  const rows = (applicationsResponse.data || []).map((application, index) => {
    const offer = offerMap.get(application.job_offer_id);
    const worker = workerMap.get(application.worker_profile_id) || {};
    return {
      id: application.id,
      title: buildAnonymousLabel(worker, index, locale),
      eyebrow: worker.target_sector || (locale === "en" ? "Sector not provided" : "Secteur non renseigné"),
      companyName: locale === "en" ? "Protected identity" : "Identité protégée",
      region: localizeRegion(worker.preferred_region, locale),
      experience: localize(worker.experience_level, EXPERIENCE_LABELS, locale),
      languages: localizeLanguages(worker.languages, locale),
      targetOffer: offer?.title || (locale === "en" ? "Role not provided" : "Poste non renseigné"),
      employerName: offer ? employerMap.get(offer.employer_profile_id) || (locale === "en" ? "Belgian employer" : "Employeur belge") : (locale === "en" ? "Belgian employer" : "Employeur belge"),
      status: application.status === "shortlisted" ? localizeStatus("matched", locale) : localizeStatus(application.status, locale)
    };
  });

  return {
    summary: {
      total: rows.length,
      sectors: new Set(rows.map((row) => row.eyebrow)).size,
      regions: new Set(rows.map((row) => row.region)).size
    },
    rows
  };
}
