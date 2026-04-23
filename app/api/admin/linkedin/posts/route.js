import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import { createLinkedInPost } from "../../../../../lib/linkedin-marketing";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((email) => email.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const body = await request.json().catch(() => ({}));
    const { author, commentary, lifecycleState = "PUBLISHED" } = body;

    if (!author) throw new Error("Auteur LinkedIn manquant.");
    if (!commentary?.trim()) throw new Error("Texte du post requis.");

    const { data: connection, error: connectionError } = await supabase
      .from("linkedin_admin_connections")
      .select("access_token")
      .eq("created_by", user.id)
      .maybeSingle();

    if (connectionError) throw connectionError;
    if (!connection?.access_token) throw new Error("Aucune connexion LinkedIn active pour cet admin.");

    const created = await createLinkedInPost(connection.access_token, {
      author,
      commentary: commentary.trim(),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState,
      isReshareDisabledByAuthor: false,
    });

    return NextResponse.json({
      ok: true,
      postId: created.restliId || created.data.id || null,
      post: created.data,
    });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
