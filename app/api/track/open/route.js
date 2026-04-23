/**
 * GET /api/track/open?c={campaignId}&e={email}
 *
 * Pixel de tracking d'ouverture d'email.
 * Retourne un GIF 1×1 transparent et enregistre l'ouverture dans Supabase.
 *
 * Table requise (à créer si elle n'existe pas) :
 *   create table if not exists email_opens (
 *     id          uuid default gen_random_uuid() primary key,
 *     campaign_id text not null,
 *     email       text not null,
 *     opened_at   timestamptz default now(),
 *     user_agent  text,
 *     unique(campaign_id, email)
 *   );
 *   create index if not exists idx_email_opens_campaign on email_opens(campaign_id);
 */

import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../lib/supabase/server";

// GIF 1×1 transparent (Base64)
const PIXEL_B64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const PIXEL     = Buffer.from(PIXEL_B64, "base64");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("c") || "";
  const email      = searchParams.get("e") || "";

  if (campaignId && email && email.includes("@")) {
    try {
      const supabase = getServiceClient();
      // upsert : on ignore les doublons (même campagne + email = 1 seule ouverture)
      await supabase.from("email_opens").upsert(
        {
          campaign_id: campaignId,
          email:       email.toLowerCase(),
          opened_at:   new Date().toISOString(),
          user_agent:  request.headers.get("user-agent") || null,
        },
        { onConflict: "campaign_id,email", ignoreDuplicates: false }
      );
    } catch {
      // fail silently — le pixel est toujours retourné
    }
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      "Content-Type":  "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma":        "no-cache",
      "Expires":       "0",
    },
  });
}
