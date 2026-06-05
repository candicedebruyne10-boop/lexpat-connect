import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";

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

    const { commentText, authorName } = await request.json().catch(() => ({}));
    if (!commentText?.trim()) throw new Error("Texte du commentaire manquant.");

    const name = authorName?.trim() || "cette personne";

    const prompt = `Tu es Candice Debruyne, fondatrice de LEXPAT Connect (plateforme belge de recrutement international + cabinet d'avocats LEXPAT).
Quelqu'un a commenté ton post LinkedIn :

Auteur : ${name}
Commentaire : "${commentText}"

Rédige une réponse courte (2-3 phrases max), naturelle, professionnelle et engageante.
- Travailleur cherchant travail en Belgique → dirige vers lexpat-connect.be/travailleurs
- Employeur/RH → dirige vers lexpat-connect.be/base-de-profils ou le simulateur
- Question permis unique → réponse experte courte + invite à tester le simulateur
- Termine par une question pour maintenir l'engagement
- URL en texte simple, pas de lien cliquable
- UNIQUEMENT le texte de réponse, sans guillemets ni introduction.`;

    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (anthropicKey) {
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
      // Remonter l'erreur Anthropic pour diagnostic
      if (!res.ok) {
        const errMsg = data.error?.message || data.error?.type || `Anthropic error ${res.status}`;
        return NextResponse.json({ error: `Clé Anthropic : ${errMsg}`, mode: "error" }, { status: 500 });
      }
      const text = data.content?.[0]?.text?.trim();
      if (text) return NextResponse.json({ ok: true, suggestion: text, mode: "claude" });
    } else {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY non configurée dans Vercel.", mode: "error" }, { status: 500 });
    }

    // Fallback (ne devrait pas arriver si la clé est configurée)
    const suggestion = `Merci ${name} pour votre commentaire ! N'hésitez pas à tester notre simulateur gratuit sur lexpat-connect.be — réponse en 3 minutes. Vous recrutez hors UE ou cherchez à travailler en Belgique ?`;
    return NextResponse.json({ ok: true, suggestion, mode: "fallback" });

  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
