import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";
import { normalizeRegion } from "../../../lib/matching";

const allowedStatuses = new Set(["new", "reviewed", "contacted", "interested", "rejected", "legal_review"]);

/**
 * GET /api/matches
 * Returns matches for the authenticated user (employer or worker).
 * Query param: ?role=employer | ?role=worker
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const role = new URL(request.url).searchParams.get("role");

    if (role === "employer") {
      const { data: membership } = await supabase
        .from("employer_members")
        .select("employer_profile_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!membership) return NextResponse.json({ matches: [] });

      const { data: offers } = await supabase
        .from("job_offers")
        .select("id, title, sector, region, contract_type, urgency")
        .eq("employer_profile_id", membership.employer_profile_id);

      const offerIds = (offers || []).map((offer) => offer.id);
      if (!offerIds.length) return NextResponse.json({ matches: [] });

      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("id, job_offer_id, worker_profile_id, score, status, created_at, updated_at")
        .in("job_offer_id", offerIds)
        .order("score", { ascending: false });

      if (matchesError || !matches?.length) return NextResponse.json({ matches: [] });

      const workerIds = [...new Set(matches.map((match) => match.worker_profile_id))];
      const { data: workers } = await supabase
        .from("worker_profiles")
        .select("id, full_name, job_title, sector, region, experience, languages, profile_visibility")
        .in("id", workerIds);

      return NextResponse.json({
        matches: hydrateMatches(matches, offers || [], workers || [])
      });
    }

    if (role === "worker") {
      const { data: worker } = await supabase
        .from("worker_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!worker) return NextResponse.json({ matches: [] });

      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("id, job_offer_id, worker_profile_id, score, status, created_at, updated_at")
        .eq("worker_profile_id", worker.id)
        .order("score", { ascending: false });

      if (matchesError || !matches?.length) return NextResponse.json({ matches: [] });

      const offerIds = [...new Set(matches.map((match) => match.job_offer_id))];
      const { data: offers } = await supabase
        .from("job_offers")
        .select("id, title, sector, region, contract_type, urgency")
        .in("id", offerIds);

      return NextResponse.json({
        matches: hydrateMatches(matches, offers || [], [])
      });
    }

    return NextResponse.json({ matches: [] });
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

    if (!matchId || !allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Statut de match invalide." }, { status: 400 });
    }

    const { data: match } = await supabase
      .from("matches")
      .select("id, job_offer_id, worker_profile_id")
      .eq("id", matchId)
      .maybeSingle();

    if (!match) {
      return NextResponse.json({ error: "Match introuvable." }, { status: 404 });
    }

    const [{ data: membership }, { data: worker }] = await Promise.all([
      supabase
        .from("employer_members")
        .select("employer_profile_id")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("worker_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()
    ]);

    let canUpdate = false;

    if (membership) {
      const { data: offer } = await supabase
        .from("job_offers")
        .select("id")
        .eq("id", match.job_offer_id)
        .eq("employer_profile_id", membership.employer_profile_id)
        .maybeSingle();
      canUpdate = Boolean(offer);
    }

    if (!canUpdate && worker) {
      canUpdate = worker.id === match.worker_profile_id;
    }

    if (!canUpdate) {
      return NextResponse.json({ error: "Accès refusé à ce match." }, { status: 403 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", matchId)
      .select("id, status")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, match: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

function hydrateMatches(matches, offers, workers) {
  const offerMap = new Map(offers.map((offer) => [
    offer.id,
    {
      ...offer,
      region: normalizeRegion(offer.region)
    }
  ]));
  const workerMap = new Map(workers.map((worker) => [
    worker.id,
    {
      ...worker,
      region: normalizeRegion(worker.region)
    }
  ]));

  return matches.map((match) => ({
    ...match,
    offer: offerMap.get(match.job_offer_id) || null,
    worker: workerMap.get(match.worker_profile_id) || null
  }));
}
