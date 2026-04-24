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

/**
 * Construit un prompt DALL-E 3 en accord avec l'identité visuelle LEXPAT Connect.
 * Le style est inspiré de : fond navy #060c26, accents teal #57B7AF, carte Belgique,
 * lignes de connexion lumineuses, esthétique tech premium.
 */
function buildImagePrompt(topic, tone, audience) {
  const topicLower = (topic || "").toLowerCase();

  // Contexte thématique selon le sujet
  let themeHint = "international talent recruitment, professional networking, Belgium";
  if (topicLower.includes("simulateur") || topicLower.includes("eligible") || topicLower.includes("possible")) {
    themeHint = "digital eligibility check tool, glowing data interface, Belgium silhouette with decision paths";
  } else if (topicLower.includes("penurie") || topicLower.includes("pénurie") || topicLower.includes("liste")) {
    themeHint = "shortage jobs in Belgium, talent demand visualization, glowing Belgian map with job title labels floating above cities";
  } else if (topicLower.includes("travailleur") || topicLower.includes("profil") || topicLower.includes("candidat")) {
    themeHint = "international professional arriving in Belgium, hopeful journey, diverse talent silhouette against Belgian skyline";
  } else if (topicLower.includes("permis") || topicLower.includes("immigration")) {
    themeHint = "official permit document, Belgian flag, legal pathway, professional guidance, secure journey";
  }

  const toneMap = {
    expert: "authoritative corporate, clean data-driven aesthetic",
    warm: "warm yet professional, human connection, soft light",
    direct: "bold, high-contrast, impactful typography style",
    premium: "luxury corporate, deep shadows, gold and teal accents",
  };
  const visualTone = toneMap[tone] || toneMap.expert;

  return [
    `Professional LinkedIn post cover image for LEXPAT Connect, a Belgian platform connecting employers with international workers in shortage occupations.`,
    `Theme: ${themeHint}.`,
    `Visual style: dark navy blue (#060c26) background with glowing teal-aqua (#57B7AF) network connection lines radiating from Belgium. Belgium map outline prominently featured, glowing from within. Cinematic depth of field, premium tech corporate aesthetic. ${visualTone}.`,
    `Lighting: dramatic blue-teal rim light, soft particle effects, constellation-like network nodes.`,
    `Composition: wide landscape format (16:9), Belgium centered or slightly left, international city skylines subtly visible in the far background (London, Paris, New York silhouettes).`,
    `Text area: leave clean space in upper third for text overlay. No text in the image itself.`,
    `Ultra high definition, photorealistic rendering, 4K quality, cinematic composition.`,
    audience ? `Target audience visual feel: ${audience}.` : "",
  ].filter(Boolean).join(" ");
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const body = await request.json().catch(() => ({}));
    const { topic, tone, audience, commentary } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY manquant — configurez-le dans Vercel.");

    const prompt = buildImagePrompt(topic || commentary?.slice(0, 120) || "", tone, audience);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
        response_format: "b64_json",
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || `OpenAI error ${response.status}`);
    }

    const b64 = data.data?.[0]?.b64_json;
    if (!b64) throw new Error("Aucune image retournée par DALL-E.");

    return NextResponse.json({
      ok: true,
      dataUrl: `data:image/png;base64,${b64}`,
      revisedPrompt: data.data?.[0]?.revised_prompt || null,
    });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
