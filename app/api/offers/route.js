import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";
import { Resend } from "resend";
import { computeMatchScore, normalizeRegion } from "../../../lib/matching";

const regionToDb = {
  "Bruxelles-Capitale": "brussels",
  Wallonie: "wallonia",
  Flandre: "flanders",
  "Plusieurs régions": "multi_region"
};

const regionFromDb = {
  brussels: "Bruxelles-Capitale",
  wallonia: "Wallonie",
  flanders: "Flandre",
  multi_region: "Plusieurs régions"
};

/**
 * POST /api/offers
 * Saves an employer offer to the DB.
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

    // 2. Insert the offer in the real employer schema
    const { data: offer, error: offerError } = await supabase
      .from("job_offers")
      .insert({
        employer_profile_id: membership.employer_profile_id,
        title:         body.title,
        sector:        body.sector,
        region:        regionToDb[body.region] || null,
        contract_type: body.contract_type,
        urgency:       body.urgency,
        missions:      body.description,
        status:        "published"
      })
      .select("id, title, sector, region, contract_type, urgency, status, created_at")
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: offerError?.message || "Erreur création offre." }, { status: 500 });
    }

    // 3. Generate simple matches for the new offer (best-effort)
    runMatchingForOffer(supabase, {
      id: offer.id,
      sector: body.sector,
      region: regionFromDb[offer.region] || offer.region
    }).catch(() => {});

    // 4. Send notification email to LEXPAT (best-effort, non-blocking)
    sendNotificationEmail(body).catch(() => {});

    return NextResponse.json({
      ok: true,
      offerId: offer.id,
      offer: {
        ...offer,
        region: regionFromDb[offer.region] || offer.region
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

async function runMatchingForOffer(supabase, offer) {
  const { data: workers, error: workersError } = await supabase
    .from("worker_profiles")
    .select("id, full_name, job_title, sector, region, experience, profile_visibility")
    .neq("profile_visibility", "hidden");

  if (workersError || !workers?.length) return;

  const rows = workers
    .map((worker) => ({
      job_offer_id: offer.id,
      worker_profile_id: worker.id,
      score: computeMatchScore(worker, {
        sector: offer.sector,
        region: normalizeRegion(offer.region)
      }),
      status: "new"
    }))
    .filter((match) => match.score >= 40);

  if (!rows.length) return;

  await supabase
    .from("matches")
    .upsert(rows, { onConflict: "job_offer_id,worker_profile_id" });
}

/**
 * GET /api/offers
 * Returns all offers for the authenticated employer.
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
      .from("job_offers")
      .select("id, title, sector, region, contract_type, urgency, status, created_at")
      .eq("employer_profile_id", membership.employer_profile_id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      offers: (offers || []).map((offer) => ({
        ...offer,
        region: regionFromDb[offer.region] || offer.region
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
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
