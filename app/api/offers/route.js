import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";
import { Resend } from "resend";

/**
 * POST /api/offers
 * Saves an employer offer to the DB, then triggers matching.
 * Body: { title, sector, region, contract_type, urgency, description }
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();

    // 1. Find the employer_profile_id for this user
    const { data: membership, error: memberError } = await supabase
      .from("employer_members")
      .select("employer_profile_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (memberError || !membership) {
      return NextResponse.json({ error: "Espace employeur introuvable." }, { status: 404 });
    }

    // 2. Insert the offer
    const { data: offer, error: offerError } = await supabase
      .from("offers")
      .insert({
        employer_profile_id: membership.employer_profile_id,
        title:         body.title,
        sector:        body.sector,
        region:        body.region,
        contract_type: body.contract_type,
        urgency:       body.urgency,
        description:   body.description,
        status:        "active"
      })
      .select("id")
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: offerError?.message || "Erreur création offre." }, { status: 500 });
    }

    // 3. Trigger matching asynchronously (fire-and-forget)
    runMatching(offer.id, body.sector, body.region, supabase);

    // 4. Send notification email to LEXPAT (best-effort, non-blocking)
    sendNotificationEmail(body).catch(() => {});

    return NextResponse.json({ ok: true, offerId: offer.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * GET /api/offers
 * Returns all active offers for the authenticated employer.
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    const { data: membership } = await supabase
      .from("employer_members")
      .select("employer_profile_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) return NextResponse.json({ offers: [] });

    const { data: offers } = await supabase
      .from("offers")
      .select("id, title, sector, region, contract_type, urgency, status, created_at")
      .eq("employer_profile_id", membership.employer_profile_id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ offers: offers || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// ─── Matching engine ──────────────────────────────────────────

async function runMatching(offerId, offerSector, offerRegion, supabase) {
  try {
    // Fetch all visible worker profiles
    const { data: workers } = await supabase
      .from("worker_profiles")
      .select("id, sector, region, experience")
      .in("profile_visibility", ["visible", "review"]);

    if (!workers?.length) return;

    const matchRows = workers
      .map((w) => ({
        offer_id:          offerId,
        worker_profile_id: w.id,
        score:             computeScore(w, offerSector, offerRegion),
        status:            "pending"
      }))
      .filter((m) => m.score >= 40); // Minimum: sector must match

    if (matchRows.length === 0) return;

    await supabase
      .from("matches")
      .upsert(matchRows, { onConflict: "offer_id,worker_profile_id", ignoreDuplicates: false });
  } catch {
    // Matching is best-effort — never block the offer creation
  }
}

function computeScore(worker, offerSector, offerRegion) {
  let score = 10; // base

  // Sector match: +40 pts (most important)
  if (worker.sector && offerSector && normalize(worker.sector) === normalize(offerSector)) {
    score += 40;
  }

  // Region match: +30 pts
  if (worker.region && offerRegion) {
    const wRegion = normalize(worker.region);
    const oRegion = normalize(offerRegion);
    if (wRegion === oRegion || oRegion === "toute-la-belgique" || wRegion === "toute-la-belgique") {
      score += 30;
    }
  }

  // Experience: +20 pts if filled
  if (worker.experience) score += 20;

  return Math.min(score, 100);
}

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[éèê]/g, "e").replace(/[àâ]/g, "a");
}

async function sendNotificationEmail(body) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const to = process.env.CONTACT_EMAIL || "lexpat@lexpat.be";

  await resend.emails.send({
    from, to,
    subject: `[LEXPAT Connect] Nouvelle offre : ${body.title}`,
    html: `<p>Secteur: ${body.sector || "-"} | Région: ${body.region || "-"} | Urgence: ${body.urgency || "-"}</p><p>${body.description || ""}</p>`
  });
}
