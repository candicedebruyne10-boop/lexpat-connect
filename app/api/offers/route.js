import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";
import { Resend } from "resend";
import { computeMatchScore, normalizeRegion } from "../../../lib/matching";
import { findSectorForProfession, parseRegionSelection, stringifyRegionSelection } from "../../../lib/professions";
import { getNotificationRecipient, getSenderAddress } from "../../../lib/email-routing";
import { newOfferEmailHtml, offerPublishedConfirmationEmailHtml } from "../../../lib/email-templates";
import { notifyWorkersForNewOffer } from "../../../lib/match-notifications";

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

    // 4. Send notification emails (best-effort, non-blocking)
    sendNotificationEmails({ user, body }).catch(() => {});

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

  await notifyWorkersForNewOffer({ supabase, offerId: offer.id });
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
      .select("id, title, sector, region, contract_type, urgency, status, created_at, missions, shortage_job, shortage_job_other")
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

export async function PUT(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();
    const offerId = body.id;

    if (!offerId) {
      return NextResponse.json({ error: "Offre introuvable." }, { status: 400 });
    }

    const shortageJob = body.shortage_job || "";
    const shortageJobOther = body.shortage_job_other || "";
    const normalizedTitle = (shortageJob === "Autre profession" ? shortageJobOther : shortageJob) || body.title || "";
    const normalizedSector = body.sector || findSectorForProfession(body.region, shortageJob) || null;
    const selectedRegions = parseRegionSelection(body.region || body.regions);
    const normalizedRegion =
      selectedRegions.length > 1
        ? "multi_region"
        : regionToDb[selectedRegions[0]] || null;

    const { data: membership, error: memberError } = await supabase
      .from("employer_members")
      .select("employer_profile_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (memberError || !membership) {
      return NextResponse.json({ error: "Espace employeur introuvable." }, { status: 404 });
    }

    const { data: offer, error: offerError } = await supabase
      .from("job_offers")
      .update({
        title: normalizedTitle,
        sector: normalizedSector,
        region: normalizedRegion,
        shortage_job: shortageJob || null,
        shortage_job_other: shortageJob === "Autre profession" ? shortageJobOther || null : null,
        contract_type: body.contract_type || null,
        urgency: body.urgency || null,
        missions: body.description || null
      })
      .eq("id", offerId)
      .eq("employer_profile_id", membership.employer_profile_id)
      .select("id, title, sector, region, contract_type, urgency, status, created_at, missions, shortage_job, shortage_job_other")
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: offerError?.message || "Erreur de mise à jour." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, offer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get("id");

    if (!offerId) {
      return NextResponse.json({ error: "Offre introuvable." }, { status: 400 });
    }

    const { data: membership, error: memberError } = await supabase
      .from("employer_members")
      .select("employer_profile_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (memberError || !membership) {
      return NextResponse.json({ error: "Espace employeur introuvable." }, { status: 404 });
    }

    const { error } = await supabase
      .from("job_offers")
      .delete()
      .eq("id", offerId)
      .eq("employer_profile_id", membership.employer_profile_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

async function sendNotificationEmails({ user, body }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = getSenderAddress();
  const internalRecipient = getNotificationRecipient();
  const locale = user?.user_metadata?.preferred_locale === "en" ? "en" : "fr";

  const regionDisplay = stringifyRegionSelection(body.region || body.regions, "Plusieurs régions") || "-";
  const title = body.title || body.shortage_job || "Poste non précisé";

  await resend.emails.send({
    from, to: internalRecipient,
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

  if (user?.email) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
    const employerSpaceUrl = `${baseUrl}${locale === "en" ? "/en/employeurs/espace" : "/employeurs/espace"}`;

    await resend.emails.send({
      from,
      to: user.email,
      subject: locale === "en"
        ? "Your opening is now live on LEXPAT Connect"
        : "Votre offre est maintenant publiée sur LEXPAT Connect",
      html: offerPublishedConfirmationEmailHtml({
        locale,
        title,
        sector: body.sector || "-",
        region: regionDisplay,
        contract: body.contract_type || "-",
        urgency: body.urgency || "-",
        profileUrl: employerSpaceUrl,
        recipientEmail: user.email
      })
    }).catch(() => {});
  }
}
