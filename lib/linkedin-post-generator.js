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
    : "\n\n#RecrutementInternational #PermisUnique #Belgique #RH";

  const t = (topic || "").toLowerCase();
  const isSimulateur = t.includes("simulateur") || t.includes("eligible") || t.includes("possible");
  const isPenurie    = t.includes("penurie") || t.includes("pénurie") || t.includes("liste");
  const isTravailleur = t.includes("travailleur") || t.includes("profil") || t.includes("candidat");
  const ctaFinal = cta || "Répondez à ce post ou écrivez-moi directement.";
  const offerFinal = offer || "LEXPAT Connect — la plateforme qui connecte employeurs belges et travailleurs internationaux qualifiés.";

  if (isSimulateur) {
    return `Vous recrutez hors UE en Belgique ?

Avant de lancer le moindre processus, une question s'impose :
👉 Ce poste figure-t-il sur les listes de pénurie 2026 ?

Sans cette réponse, vous risquez des mois de procédure pour rien.

${offerFinal}

Notre simulateur gratuit vérifie votre poste en 3 minutes :
✅ Éligibilité sur les listes Actiris, Forem et VDAB 2026
✅ Procédure applicable selon votre région
✅ Délais réels et prochaines étapes

${ctaFinal}${hashtagLine}`;
  }

  if (isPenurie) {
    return `📋 Les listes de pénurie 2026 sont publiées.

Ce que ça change pour votre recrutement international :

→ Actiris (Bruxelles) : 65 métiers en pénurie
→ Forem (Wallonie) : 94 métiers en pénurie
→ VDAB (Flandre) : 109 métiers en pénurie

Un poste sur la liste = procédure simplifiée.
Un poste hors liste = test du marché obligatoire.

La subtilité que beaucoup ignorent : le niveau de qualification du candidat change tout.

${offerFinal}

${ctaFinal}${hashtagLine}`;
  }

  if (isTravailleur) {
    return `Des employeurs belges cherchent exactement votre profil. En ce moment.

Le problème ? Ils ne savent pas que vous existez.

LEXPAT Connect rend vos compétences visibles auprès des entreprises belges qui recrutent hors UE.

→ Créez votre profil en 5 minutes
→ Rendez-le visible
→ Les employeurs qui cherchent votre métier vous trouvent

Gratuit pour les travailleurs. Toujours.

${ctaFinal}${hashtagLine}`;
  }

  // Post générique amélioré
  return `${topic ? topic + "\n\n" : ""}Pour ${audience || "les employeurs belges"}, recruter hors UE en 2026 implique de naviguer entre listes de pénurie, tests du marché et permis unique.

${offerFinal}

3 choses que beaucoup ignorent encore :
→ Les listes de pénurie varient par région (Bruxelles ≠ Wallonie ≠ Flandre)
→ Le niveau de qualification du candidat change la procédure
→ Une vérification préalable évite des mois de délai inutiles

${ctaFinal}${hashtagLine}`;
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
