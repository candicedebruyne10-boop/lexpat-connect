import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../lib/supabase/server";
import { Resend } from "resend";
import { computeMatchScore, normalizeRegion } from "../../../lib/matching";
import { findSectorForProfession, parseRegionSelection, stringifyRegionSelection } from "../../../lib/professions";
import { getNotificationRecipient, getSenderAddress } from "../../../lib/email-routing";
import { newOfferEmailHtml, newOfferMatchEmailHtml } from "../../../lib/email-templates";

const regionToDb = {
  "Bruxelles-Capitale": "brussels",
  Wallonie: "wallonia",
  Flandre: "flanders",
  "Plusieurs régions": "multi_region"
};

/**
 * POST /api/offers
 * Saves an employer offer to the DB.
 * Body: { title, shortage_job, shortage_job_other, sector, region, contract_type, urgency, description }
 */
export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();
    const shortageJob = body.shortage_job || "";
    const shortageJobOther = body.shortage_job_other || "";
    const normalizedTitle = (shortageJob === "Autre profession" ? shortageJobOther : shortageJob) || body.title || "";
    const normalizedSector = body.sector || findSectorForProfession(body.region, shortageJob) || null;
    const selectedRegions = parseRegionSelection(body.region || body.regions);
    const normalizedRegion =
      selectedRegions.length > 1
        ? "multi_region"
        : regionToDb[selectedRegions[0]] || null;

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
        title:         normalizedTitle,
        sector:        normalizedSector,
        region:        normalizedRegion,
        shortage_job:  shortageJob || null,
        shortage_job_other: shortageJob === "Autre profession" ? shortageJobOther || null : null,
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

    // 3. Generate simple matches + notify matched workers (best-effort)
    runMatchingForOffer(supabase, {
      id: offer.id,
      sector: normalizedSector,
      region: offer.region,
      jobTitle: normalizedTitle,
      contractType: body.contract_type,
      urgency: body.urgency
    }).catch(() => {});

    // 4. Send notification email to LEXPAT (best-effort, non-blocking)
    sendNotificationEmail(body).catch(() => {});

    return NextResponse.json({
      ok: true,
      offerId: offer.id,
      offer: {
        ...offer,
        region: offer.region
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

async function runMatchingForOffer(supabase, offer) {
  const { data: workers, error: workersError } = await supabase
    .from("worker_profiles")
    .select("id, user_id, full_name, target_job, target_sector, preferred_region, experience_level, profile_visibility")
    .neq("profile_visibility", "hidden");

  if (workersError || !workers?.length) return;

  const matchedWorkers = workers
    .map((worker) => ({
      worker,
      job_offer_id: offer.id,
      worker_profile_id: worker.id,
      score: computeMatchScore({
        profile_visibility: worker.profile_visibility,
        job_title: worker.target_job,
        sector: worker.target_sector,
        region: worker.preferred_region,
        experience: worker.experience_level
      }, {
        job_title: offer.jobTitle,
        sector: offer.sector,
        region: normalizeRegion(offer.region)
      }),
      status: "new"
    }))
    .filter((match) => match.score >= 40);

  if (!matchedWorkers.length) return;

  // Insérer les matches en base
  await supabase
    .from("matches")
    .upsert(
      matchedWorkers.map(({ job_offer_id, worker_profile_id, score, status }) => ({
        job_offer_id, worker_profile_id, score, status
      })),
      { onConflict: "job_offer_id,worker_profile_id" }
    );

  // Notifier les travailleurs correspondants par email (best-effort)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = getSenderAddress();

  for (const { worker } of matchedWorkers) {
    if (!worker.user_id) continue;

    // Récupérer l'email depuis auth.users via l'admin API
    const { data: authUser } = await supabase.auth.admin.getUserById(worker.user_id).catch(() => ({ data: null }));
    const workerEmail = authUser?.user?.email;
    if (!workerEmail) continue;

    await resend.emails.send({
      from,
      to: workerEmail,
      subject: `[LEXPAT Connect] Une offre correspond à votre profil — ${offer.jobTitle}`,
      html: newOfferMatchEmailHtml({
        jobTitle: offer.jobTitle,
        companyName: null, // anonymisé volontairement
        sector: offer.sector,
        region: normalizeRegion(offer.region),
        contractType: offer.contractType,
        urgency: offer.urgency
      })
    }).catch(() => {});
  }
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
        ...offer
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
  const from = getSenderAddress();
  const to = getNotificationRecipient();

  const regionDisplay = stringifyRegionSelection(body.region || body.regions, "Plusieurs régions") || "-";
  const title = body.title || body.shortage_job || "Poste non précisé";

  await resend.emails.send({
    from, to,
    subject: `[LEXPAT Connect] Nouvelle offre : ${title}`,
    html: newOfferEmailHtml({
      title,
      sector: body.sector || "-",
      region: regionDisplay,
      contract: body.contract_type || "-",
      urgency: body.urgency || "-",
      description: body.description || "",
      companyName: body.companyName || null
    })
  });
}
