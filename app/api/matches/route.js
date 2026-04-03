import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

/**
 * GET /api/matches
 * Returns matches for the authenticated user (employer or worker).
 * Query param: ?role=employer | ?role=worker
 */
export async function GET(request) {
  try {
    await getUserFromRequest(request);
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
    await getUserFromRequest(request);
    return NextResponse.json({ error: "Le matching détaillé n'est pas encore activé." }, { status: 501 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
