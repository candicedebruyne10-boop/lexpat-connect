import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";

function buildAnonymousLabel(row, index) {
  const suffix = String(index + 1).padStart(2, "0");
  const job = row.target_job || "Profil";
  return `${job} · Candidat ${suffix}`;
}

export async function GET(request) {
  try {
    const { supabase } = await getUserFromRequest(request);

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

    const applications = (applicationsResponse.data || []).map((application, index) => {
      const offer = offerMap.get(application.job_offer_id);
      const worker = workerMap.get(application.worker_profile_id) || {};

      return {
        id: application.id,
        candidateLabel: buildAnonymousLabel(worker, index),
        sector: worker.target_sector || "Non renseigné",
        region: normalizeRegion(worker.preferred_region),
        experience: worker.experience_level || "Non renseignée",
        languages: Array.isArray(worker.languages) ? worker.languages.join(", ") : "Non renseignées",
        offerTitle: offer?.title || "Offre non renseignée",
        companyName: offer ? employerMap.get(offer.employer_profile_id) || "Entreprise non renseignée" : "Entreprise non renseignée",
        status: application.status,
        createdAt: application.created_at
      };
    });

    return NextResponse.json({
      summary: {
        total: applications.length,
        shortlisted: applications.filter((application) => application.status === "shortlisted").length,
        sectors: new Set(applications.map((application) => application.sector)).size
      },
      rows: applications
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Impossible de charger les candidatures." }, { status: 401 });
  }
}
