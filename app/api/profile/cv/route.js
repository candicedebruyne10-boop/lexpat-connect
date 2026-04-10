import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";

/**
 * POST /api/profile/cv
 * Saves the structured CV data (formation, expériences, compétences, etc.)
 * into the worker_profiles.cv_data JSONB column.
 *
 * Requires (one-time manual setup in Supabase):
 *   ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS cv_data JSONB DEFAULT '{}'::jsonb;
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();
    const { cv_data } = body;

    if (!cv_data || typeof cv_data !== "object") {
      return NextResponse.json({ error: "Données CV invalides." }, { status: 400 });
    }

    const { error } = await supabase
      .from("worker_profiles")
      .update({ cv_data })
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[profile/cv]", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur lors de la sauvegarde." },
      { status: 401 }
    );
  }
}
