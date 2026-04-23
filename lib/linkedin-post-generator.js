function cleanList(value) {
  return String(value || "")
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildFallbackPost({
  topic,
  audience,
  offer,
  tone,
  keywords,
  cta,
}) {
  const keywordList = cleanList(keywords);
  const hashtagLine = keywordList.length
    ? `\n\n${keywordList.map((word) => (word.startsWith("#") ? word : `#${word.replace(/\s+/g, "")}`)).join(" ")}`
    : "";

  const tonePrefix = {
    expert: "Point de vue terrain",
    warm: "Retour d'experience",
    direct: "Message direct",
    premium: "Perspective haut de gamme",
  }[tone] || "Analyse";

  return `${tonePrefix}.\n\n${topic}\n\nPour ${audience || "les entreprises et professionnels concernes"}, le vrai enjeu n'est pas seulement de recruter, mais de rendre le parcours clair, rapide et securise.\n\n${offer || "Chez LEXPAT Connect, nous aidons a structurer ce passage entre besoin terrain, matching et cadre juridique."}\n\n${cta || "Si vous voulez que je vous montre comment on peut l'appliquer a votre situation, ecrivez-moi."}${hashtagLine}`;
}

async function generateWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const prompt = [
    "Redige un post LinkedIn organique en francais pour LEXPAT Connect.",
    "Objectif: produire un texte pret a publier, naturel, sans ton publicitaire agressif, avec un angle expert.",
    "Contraintes:",
    "- 700 caracteres max",
    "- 1 accroche forte",
    "- 2 a 4 paragraphes courts",
    "- terminer par un CTA simple",
    "- ajouter 3 a 5 hashtags maximum si pertinents",
    "",
    `Sujet: ${input.topic || ""}`,
    `Audience: ${input.audience || ""}`,
    `Offre / message a mettre en avant: ${input.offer || ""}`,
    `Ton: ${input.tone || ""}`,
    `Mots-cles: ${input.keywords || ""}`,
    `Call to action: ${input.cta || ""}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      instructions: "Tu es un copywriter B2B francophone specialise LinkedIn. Tu livres uniquement le texte final du post.",
      max_output_tokens: 500,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI generation failed.");
  }

  return data.output_text?.trim() || null;
}

export async function generateLinkedInPost(input) {
  try {
    const aiResult = await generateWithOpenAI(input);
    if (aiResult) return { text: aiResult, mode: "openai" };
  } catch {
    // Fallback below keeps the admin usable even if the AI provider is not configured.
  }

  return {
    text: buildFallbackPost(input),
    mode: "fallback",
  };
}
