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

// Génère une suggestion de réponse via Claude ou fallback
async function suggestReply(commentText, authorName) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const prompt = `Tu es Candice Debruyne, fondatrice de LEXPAT Connect (plateforme belge de recrutement international + cabinet d'avocats LEXPAT).
Quelqu'un a commenté ton post LinkedIn :

Auteur : ${authorName}
Commentaire : "${commentText}"

Rédige une réponse courte (2-3 phrases max), naturelle, professionnelle et engageante.
- Si c'est un travailleur cherchant du travail en Belgique → dirige vers lexpat-connect.be/travailleurs
- Si c'est un employeur ou RH → dirige vers lexpat-connect.be/base-de-profils ou le simulateur
- Si c'est une question sur le permis unique → réponse experte courte + invite à tester le simulateur
- Termine par une question pour maintenir l'engagement
- Ne mets PAS de lien clickable, juste l'URL en texte
- Réponds UNIQUEMENT avec le texte de la réponse, sans guillemets ni introduction.`;

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
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

  // Fallback générique
  return `Merci ${authorName} pour votre commentaire ! N'hésitez pas à tester notre simulateur gratuit sur lexpat-connect.be pour voir si votre situation est éligible. Vous recrutez hors UE ou vous cherchez à travailler en Belgique ?`;
}

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const { data: connection } = await supabase
      .from("linkedin_admin_connections")
      .select("access_token, linkedin_member_id")
      .eq("created_by", user.id)
      .maybeSingle();

    if (!connection?.access_token) {
      throw new Error("Aucune connexion LinkedIn active. Connectez votre compte d'abord.");
    }

    const token = connection.access_token;
    const authorUrn = connection.linkedin_member_id
      ? `urn:li:person:${connection.linkedin_member_id}`
      : null;

    if (!authorUrn) {
      throw new Error("Profil LinkedIn non trouvé. Reconnectez votre compte.");
    }

    // 1. Récupérer les posts récents — ugcPosts ET shares (posts publiés directement sur LinkedIn)
    const [ugcRes, sharesRes] = await Promise.all([
      fetch(
        `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodeURIComponent(authorUrn)})&count=5&sortBy=LAST_MODIFIED`,
        { headers: liHeaders(token), cache: "no-store" }
      ),
      fetch(
        `https://api.linkedin.com/v2/shares?q=owners&owners=List(${encodeURIComponent(authorUrn)})&count=5&sortBy=LAST_MODIFIED`,
        { headers: liHeaders(token), cache: "no-store" }
      ),
    ]);

    const ugcData = await ugcRes.json().catch(() => ({}));
    const sharesData = await sharesRes.json().catch(() => ({}));

    // Fusionner et dédupliquer par ID
    const allPosts = [
      ...(ugcData.elements || []),
      ...(sharesData.elements || []),
    ].filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);

    const posts = allPosts.slice(0, 5);

    if (posts.length === 0) {
      return NextResponse.json({ ok: true, comments: [], message: "Aucun post récent trouvé. Vérifiez que votre compte LinkedIn est bien connecté." });
    }

    // 2. Pour chaque post, récupérer les commentaires
    const allComments = [];

    for (const post of posts.slice(0, 3)) {
      const postUrn = post.id;
      const postText =
        post.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text ||
        post.text?.text ||
        "";
      const postSnippet = postText.slice(0, 80) + (postText.length > 80 ? "…" : "");

      try {
        const commentsRes = await fetch(
          `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments?count=20`,
          { headers: liHeaders(token), cache: "no-store" }
        );
        const commentsData = await commentsRes.json().catch(() => ({}));
        const comments = commentsData.elements || [];

        for (const c of comments) {
          // Ignorer les commentaires de l'auteur lui-même
          const commenterUrn = c.actor || "";
          if (commenterUrn === authorUrn) continue;

          const commentText = c.message?.text || "";
          const commentUrn = c.id || "";
          const authorName = c.actor?.split(":").pop() || "Quelqu'un";
          const createdAt = c.created?.time ? new Date(c.created.time).toISOString() : null;

          // Générer suggestion IA
          const suggestion = await suggestReply(commentText, authorName);

          allComments.push({
            id: commentUrn,
            postUrn,
            postSnippet,
            commentText,
            commenterUrn,
            commenterName: authorName,
            createdAt,
            suggestion,
          });
        }
      } catch { /* skip post si erreur */ }
    }

    return NextResponse.json({ ok: true, comments: allComments });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
