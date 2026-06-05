import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import { LINKEDIN_API_VERSION } from "../../../../../lib/linkedin-marketing";

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

function liHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Linkedin-Version": LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

// Normalise un ID de post en URN complet
function toPostUrn(raw) {
  if (!raw) return null;
  const s = raw.trim();
  if (s.startsWith("urn:li:")) return s;
  // URL LinkedIn → extraire l'ID
  const urlMatch = s.match(/activity-(\d+)/);
  if (urlMatch) return `urn:li:activity:${urlMatch[1]}`;
  // ID brut → essayer ugcPost puis share
  return `urn:li:ugcPost:${s}`;
}

async function suggestReply(commentText, authorName) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const prompt = `Tu es Candice Debruyne, fondatrice de LEXPAT Connect (plateforme belge de recrutement international + cabinet d'avocats LEXPAT).
Quelqu'un a commenté ton post LinkedIn :

Auteur : ${authorName}
Commentaire : "${commentText}"

Rédige une réponse courte (2-3 phrases max), naturelle, professionnelle et engageante.
- Travailleur cherchant travail en Belgique → dirige vers lexpat-connect.be/travailleurs
- Employeur/RH → dirige vers lexpat-connect.be/base-de-profils ou le simulateur
- Question permis unique → réponse experte courte + simulateur
- Termine par une question pour l'engagement
- URL en texte simple, pas de lien
- UNIQUEMENT le texte de réponse, sans guillemets ni introduction.`;

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }],
        }),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      const text = data.content?.[0]?.text?.trim();
      if (text) return text;
    } catch { /* fallback */ }
  }
  return `Merci ${authorName} pour votre commentaire ! Testez notre simulateur gratuit sur lexpat-connect.be. Vous recrutez hors UE ou cherchez à travailler en Belgique ?`;
}

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const url = new URL(request.url);
    const rawPostId = url.searchParams.get("postId");

    if (!rawPostId) {
      throw new Error("Paramètre postId manquant. Sélectionnez un post depuis l'historique.");
    }

    const { data: connection } = await supabase
      .from("linkedin_admin_connections")
      .select("access_token, linkedin_member_id, member_urn")
      .eq("created_by", user.id)
      .maybeSingle();

    if (!connection?.access_token) {
      throw new Error("Aucune connexion LinkedIn active. Connectez votre compte d'abord.");
    }

    const token = connection.access_token;
    const authorUrn = connection.member_urn || (connection.linkedin_member_id ? `urn:li:person:${connection.linkedin_member_id}` : null);
    const postUrn = toPostUrn(rawPostId);

    // Récupérer les commentaires du post
    const commentsRes = await fetch(
      `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments?count=20`,
      { headers: liHeaders(token), cache: "no-store" }
    );
    const commentsData = await commentsRes.json().catch(() => ({}));

    if (!commentsRes.ok) {
      const msg = commentsData.message || commentsData.error || `Erreur LinkedIn ${commentsRes.status}`;
      throw new Error(`Impossible de lire les commentaires : ${msg}`);
    }

    const rawComments = commentsData.elements || [];
    const allComments = [];

    for (const c of rawComments) {
      const commenterUrn = c.actor || "";
      if (authorUrn && commenterUrn === authorUrn) continue; // ignorer ses propres commentaires

      const commentText = c.message?.text || "";
      if (!commentText.trim()) continue;

      const commentId = c.id || "";
      const commenterName = c.actor?.split(":").pop() || "Quelqu'un";
      const createdAt = c.created?.time ? new Date(c.created.time).toISOString() : null;
      const suggestion = await suggestReply(commentText, commenterName);

      allComments.push({
        id: commentId,
        postUrn,
        postSnippet: rawPostId,
        commentText,
        commenterUrn,
        commenterName,
        createdAt,
        suggestion,
      });
    }

    return NextResponse.json({ ok: true, comments: allComments, total: allComments.length });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
