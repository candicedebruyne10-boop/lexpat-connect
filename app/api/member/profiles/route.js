import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";
import { getEffectiveWorkerProfileVisibility } from "../../../../lib/worker-profile-visibility";

/**
 * GET /api/member/profiles
 * Retourne les profils travailleurs visibles (profile_visibility = 'visible').
 * Accessible à tout membre connecté (employeurs et travailleurs).
 * Le flag `featured: true` est ajouté aux profils qui ont partagé leur lien d'affiliation.
 */
export async function GET(request) {
  try {
    const { supabase } = await getUserFromRequest(request);
    const serviceSupabase = getServiceClient();

    // Récupérer les referrer_user_ids via le service client (contourne RLS)
    const { data: referrals } = await serviceSupabase
      .from("referrals")
      .select("referrer_user_id")
      .not("referrer_user_id", "is", null);

    const featuredIds = new Set(
      (referrals || []).map((r) => r.referrer_user_id).filter(Boolean)
    );

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("id, user_id, full_name, target_job, target_sector, preferred_region, experience_level, languages, profile_visibility, updated_at")
      .eq("profile_visibility", "visible")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Profils anonymisés : aucune donnée identifiante n'est exposée.
    // L'objectif est d'inciter les employeurs à déposer une offre pour être mis en relation.
    const profiles = (data || [])
      .filter((p) => getEffectiveWorkerProfileVisibility(p) === "visible")
      .map((p, i) => ({
        id:         p.id,
        index:      i + 1,
        jobTitle:   p.target_job || "Métier non renseigné",
        sector:     p.target_sector || "Non renseigné",
        region:     normalizeRegion(p.preferred_region),
        experience: p.experience_level || "Non renseignée",
        languages:  Array.isArray(p.languages)
                      ? p.languages.join(", ")
                      : (p.languages || "Non renseignées"),
        updatedAt:  p.updated_at,
        featured:   featuredIds.has(p.user_id),
      }));

    return NextResponse.json({
      summary: {
        total:    profiles.length,
        sectors:  new Set(profiles.map((p) => p.sector)).size,
        regions:  new Set(profiles.map((p) => p.region)).size,
      },
      rows: profiles,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Impossible de charger les profils." },
      { status: 401 }
    );
  }
}
