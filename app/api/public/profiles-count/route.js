import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../lib/supabase/server";

/**
 * GET /api/public/profiles-count
 * Public — no auth required.
 * Returns the current count of visible worker profiles.
 * Cache: 60 s on CDN so the homepage stays fast.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();

    const { count, error } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_visibility", "visible");

    if (error) throw error;

    return NextResponse.json(
      { count: count ?? 0 },
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
