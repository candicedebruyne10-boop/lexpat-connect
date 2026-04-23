function cleanList(value) {
  return String(value || "")
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPrompt(input) {
  return [
    "Redige un post LinkedIn organique en francais pour LEXPAT Connect.",
    "LEXPAT Connect est une plateforme belge qui connecte les employeurs belges avec des travailleurs internationaux qualifies, et les guide dans la procedure de permis unique.",
    "Objectif: produire un texte pret a publier, naturel, sans ton publicitaire agressif, avec un angle expert.",
    "Contraintes:",
    "- 700 caracteres max",
    "- 1 accroche forte en ouverture",
    "- 2 a 4 paragraphes courts",
    "- terminer par un CTA simple",
    "- ajouter 3 a 5 hashtags maximum si pertinents",
    "- retourner UNIQUEMENT le texte final du post, sans introduction ni commentaire",
    "",
    `Sujet: ${input.topic || ""}`,
    `Audience: ${input.audience || ""}`,
    `Offre / message a mettre en avant: ${input.offer || ""}`,
    `Ton: ${input.tone || ""}`,
    `Mots-cles: ${input.keywords || ""}`,
    `Call to action: ${input.cta || ""}`,
  ].join("\n");
}

// ── Claude (Anthropic) ────────────────────────────────────────────────────────

async function generateWithClaude(input) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      system: "Tu es un copywriter B2B francophone specialise LinkedIn. Tu livres uniquement le texte final du post, sans introduction ni commentaire.",
      messages: [{ role: "user", content: buildPrompt(input) }],
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Claude API error ${response.status}`);
  }

  return data.content?.[0]?.text?.trim() || null;
}

// ── OpenAI (fallback) ─────────────────────────────────────────────────────────

async function generateWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = buildPrompt(input);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Tu es un copywriter B2B francophone specialise LinkedIn. Tu livres uniquement le texte final du post." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI generation failed.");
  }

  return data.choices?.[0]?.message?.content?.trim() || null;
}

// ── Fallback local ────────────────────────────────────────────────────────────

function buildFallbackPost({ topic, audience, offer, tone, keywords, cta }) {
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

// ── Export principal ──────────────────────────────────────────────────────────

export async function generateLinkedInPost(input) {
  // 1. Claude en priorité
  try {
    const result = await generateWithClaude(input);
    if (result) return { text: result, mode: "claude" };
  } catch {
    // passe à OpenAI
  }

  // 2. OpenAI en fallback
  try {
    const result = await generateWithOpenAI(input);
    if (result) return { text: result, mode: "openai" };
  } catch {
    // passe au générateur local
  }

  // 3. Générateur local (toujours disponible)
  return { text: buildFallbackPost(input), mode: "fallback" };
}
