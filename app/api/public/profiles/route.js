import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";
import { getEffectiveWorkerProfileVisibility } from "../../../../lib/worker-profile-visibility";

/**
 * GET /api/public/profiles
 * Profils anonymisés, accessibles sans authentification.
 * Aucune donnée identifiante n'est exposée (pas de nom, pas d'email, pas d'ID stable).
 * Le flag `featured: true` est ajouté aux profils qui ont partagé leur lien d'affiliation
 * (referrer_user_id présent dans la table referrals) — même logique que la homepage.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();

    // 1. Récupérer les user_ids des profils qui ont partagé leur lien
    const { data: referrals } = await supabase
      .from("referrals")
      .select("referrer_user_id")
      .not("referrer_user_id", "is", null);

    const featuredIds = new Set(
      (referrals || []).map((r) => r.referrer_user_id).filter(Boolean)
    );

    // 2. Récupérer les profils visibles
    const { data, error } = await supabase
      .from("worker_profiles")
      .select("id, user_id, target_job, target_sector, preferred_region, experience_level, languages, updated_at")
      .eq("profile_visibility", "visible")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const profiles = (data || [])
      .filter((p) => getEffectiveWorkerProfileVisibility(p) === "visible")
      .map((p, i) => ({
        // Pas d'ID réel exposé publiquement
        index:      i + 1,
        jobTitle:   p.target_job     || "Métier non précisé",
        sector:     p.target_sector  || "Non renseigné",
        region:     normalizeRegion(p.preferred_region),
        experience: p.experience_level || "Non renseignée",
        languages:  Array.isArray(p.languages)
                      ? p.languages.join(", ")
                      : (p.languages || "Non renseignées"),
        featured:   featuredIds.has(p.user_id),
      }));

    return NextResponse.json({
      summary: {
        total:   profiles.length,
        sectors: new Set(profiles.map((p) => p.sector)).size,
        regions: new Set(profiles.map((p) => p.region)).size,
      },
      rows: profiles,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Impossible de charger les profils." },
      { status: 500 }
    );
  }
}
