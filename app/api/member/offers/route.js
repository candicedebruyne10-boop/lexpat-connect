import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";

export async function GET(request) {
  try {
    const { supabase } = await getUserFromRequest(request);

    const [offersResponse, employersResponse] = await Promise.all([
      supabase
        .from("job_offers")
        .select("id, employer_profile_id, title, sector, region, contract_type, urgency, status, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      supabase
        .from("employer_profiles")
        .select("id, company_name")
    ]);

    if (offersResponse.error) throw offersResponse.error;
    if (employersResponse.error) throw employersResponse.error;

    const employerMap = new Map((employersResponse.data || []).map((employer) => [employer.id, employer.company_name]));
    const offers = (offersResponse.data || []).map((offer) => ({
      id: offer.id,
      title: offer.title,
      companyName: employerMap.get(offer.employer_profile_id) || "Entreprise non renseignée",
      sector: offer.sector || "Non renseigné",
      region: normalizeRegion(offer.region),
      contractType: offer.contract_type || "Non renseigné",
      urgency: offer.urgency || "Non renseignée",
      status: offer.status,
      createdAt: offer.created_at
    }));

    return NextResponse.json({
      summary: {
        total: offers.length,
        urgent: offers.filter((offer) => offer.urgency === "Élevée").length,
        sectors: new Set(offers.map((offer) => offer.sector)).size
      },
      rows: offers
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Impossible de charger les offres." }, { status: 401 });
  }
}
