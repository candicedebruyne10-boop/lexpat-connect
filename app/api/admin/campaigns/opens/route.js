/**
 * GET /api/admin/campaigns/opens?campaign_id=xxx
 * Retourne la liste des contacts qui ont ouvert l'email d'une campagne.
 */

import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map(e => e.toLowerCase());

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const isAdmin =
      ADMIN_EMAILS.includes((user.email || "").toLowerCase()) ||
      (await getServiceClient()
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(r => r.data?.role === "admin"));

    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaign_id") || "";

    if (!campaignId) {
      return NextResponse.json({ error: "campaign_id requis." }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("email_opens")
      .select("email, opened_at")
      .eq("campaign_id", campaignId)
      .order("opened_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ opens: data || [] });
  } catch (err) {
    return NextResponse.json({ opens: [], error: err.message }, { status: 500 });
  }
}
