import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../lib/supabase/server";

/**
 * GET /api/public/profiles-count
 * Public — no auth required.
 * Returns the count of profiles that are actually shown on /base-de-profils:
 *   - profile_visibility = 'visible'
 *   - target_job non null/empty  (getEffectiveWorkerProfileVisibility requirement)
 *   - target_sector non null/empty  (same)
 * Cache: 60 s on CDN so the homepage stays fast.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("target_job, target_sector")
      .eq("profile_visibility", "visible")
      .not("target_job", "is", null)
      .neq("target_job", "")
      .not("target_sector", "is", null)
      .neq("target_sector", "");

    if (error) throw error;

    const count = (data || []).length;

    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    // Never expose error details publicly — return a safe fallback
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
