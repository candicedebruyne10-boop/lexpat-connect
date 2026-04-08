import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../lib/supabase/server";
import { normalizeRegion } from "../../../../lib/matching";

/**
 * GET /api/public/profiles
 * Profils anonymisés, accessibles sans authentification.
 * Aucune donnée identifiante n'est exposée (pas de nom, pas d'email, pas d'ID stable).
 * Objectif : convaincre les employeurs visiteurs de créer un compte.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("id, target_job, target_sector, preferred_region, experience_level, languages, updated_at")
      .eq("profile_visibility", "visible")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const profiles = (data || []).map((p, i) => ({
      // Pas d'ID réel exposé publiquement
      index:      i + 1,
      jobTitle:   p.target_job     || "Métier non précisé",
      sector:     p.target_sector  || "Non renseigné",
      region:     normalizeRegion(p.preferred_region),
      experience: p.experience_level || "Non renseignée",
      languages:  Array.isArray(p.languages)
                    ? p.languages.join(", ")
                    : (p.languages || "Non renseignées"),
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
