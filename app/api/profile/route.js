import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

/**
 * POST /api/profile
 * Saves worker profile fields to worker_profiles.
 * Body: { job_title, sector, region, experience, languages, description }
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();

    const { error } = await supabase
      .from("worker_profiles")
      .update({
        job_title:   body.job_title,
        sector:      body.sector,
        region:      body.region,
        experience:  body.experience,
        languages:   body.languages,
        description: body.description,
        full_name:   body.full_name,
        profile_visibility: body.profile_visibility || "review"
      })
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
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

    return NextResponse.json({ profile: data || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
