import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

/**
 * GET /api/matches
 * Returns matches for the authenticated user (employer or worker).
 * Query param: ?role=employer | ?role=worker
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "worker";

    if (role === "employer") {
      // Get employer's offer IDs
      const { data: membership } = await supabase
        .from("employer_members")
        .select("employer_profile_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!membership) return NextResponse.json({ matches: [] });

      const { data: offers } = await supabase
        .from("offers")
        .select("id")
        .eq("employer_profile_id", membership.employer_profile_id)
        .eq("status", "active");

      if (!offers?.length) return NextResponse.json({ matches: [] });

      const offerIds = offers.map((o) => o.id);

      const { data: matches } = await supabase
        .from("matches")
        .select(`
          id, score, status, created_at,
          offer:offers(id, title, sector, region),
          worker:worker_profiles(id, full_name, job_title, sector, region, experience)
        `)
        .in("offer_id", offerIds)
        .order("score", { ascending: false })
        .limit(20);

      return NextResponse.json({ matches: matches || [] });
    }

    // Worker: get their matches
    const { data: workerProfile } = await supabase
      .from("worker_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!workerProfile) return NextResponse.json({ matches: [] });

    const { data: matches } = await supabase
      .from("matches")
      .select(`
        id, score, status, created_at,
        offer:offers(id, title, sector, region, contract_type, urgency)
      `)
      .eq("worker_profile_id", workerProfile.id)
      .order("score", { ascending: false })
      .limit(20);

    return NextResponse.json({ matches: matches || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * PATCH /api/matches
 * Update a match status (employer confirms contact, worker consents).
 * Body: { matchId, status }
 */
export async function PATCH(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { matchId, status } = await request.json();

    const allowed = ["contacted", "consented", "rejected"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const { error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", matchId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
