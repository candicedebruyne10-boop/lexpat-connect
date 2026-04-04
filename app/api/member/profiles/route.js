import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";

/**
 * GET /api/member/profiles
 * Retourne les profils travailleurs visibles (profile_visibility = 'visible').
 * Accessible à tout membre connecté (employeurs et travailleurs).
 */
export async function GET(request) {
  try {
    const { supabase } = await getUserFromRequest(request);

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("id, full_name, job_title, sector, region, experience, languages, profile_visibility, updated_at")
      .eq("profile_visibility", "visible")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Profils anonymisés : aucune donnée identifiante n'est exposée.
    // L'objectif est d'inciter les employeurs à déposer une offre pour être mis en relation.
    const profiles = (data || []).map((p, i) => ({
      id:         p.id,
      index:      i + 1,
      sector:     p.sector     || "Non renseigné",
      region:     normalizeRegion(p.region),
      experience: p.experience || "Non renseignée",
      languages:  Array.isArray(p.languages)
                    ? p.languages.join(", ")
                    : (p.languages || "Non renseignées"),
      updatedAt:  p.updated_at,
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
