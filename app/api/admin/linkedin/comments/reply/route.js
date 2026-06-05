import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../../lib/supabase/server";
import { LINKEDIN_API_VERSION } from "../../../../../../lib/linkedin-marketing";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((e) => e.toLowerCase());

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
    const { postUrn, commentUrn, replyText, author } = body;

    if (!postUrn || !commentUrn || !replyText?.trim() || !author) {
      throw new Error("Paramètres manquants : postUrn, commentUrn, replyText, author requis.");
    }

    const { data: connection } = await supabase
      .from("linkedin_admin_connections")
      .select("access_token")
      .eq("created_by", user.id)
      .maybeSingle();

    if (!connection?.access_token) {
      throw new Error("Aucune connexion LinkedIn active.");
    }

    const token = connection.access_token;

    // Poster la réponse au commentaire
    const res = await fetch(
      `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments/${encodeURIComponent(commentUrn)}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Linkedin-Version": LINKEDIN_API_VERSION,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actor: author,
          message: { text: replyText.trim() },
        }),
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.message || data.error || `Erreur LinkedIn ${res.status}`;
      throw new Error(msg);
    }

    return NextResponse.json({ ok: true, replyId: data.id || null });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
