/**
 * Générateur d'emails IA — LEXPAT Connect
 * Génère un email professionnel (sujet + corps) à partir d'un prompt libre,
 * avec contexte complet du site et des problématiques de recrutement international.
 *
 * Priorité : Claude (Haiku) → OpenAI (GPT-4o-mini) → fallback local
 */

// ── Contexte site ─────────────────────────────────────────────────────────────

const SITE_CONTEXT = `
LEXPAT Connect est une plateforme belge de mise en relation entre :
- des EMPLOYEURS BELGES qui veulent recruter des travailleurs internationaux qualifiés dans les métiers en pénurie
- des TRAVAILLEURS INTERNATIONAUX qui souhaitent travailler en Belgique dans leur domaine de compétence

Fondatrice : Candice, avocate spécialisée en droit de l'immigration (cabinet LEXPAT à Bruxelles).

FONCTIONNEMENT :
- Les travailleurs créent un profil gratuit et le rendent visible (base de profils accessible aux employeurs)
- Les employeurs accèdent à la base de profils, publient des offres, et peuvent contacter les candidats
- Un simulateur gratuit permet de vérifier en 3 minutes si un poste est éligible à un permis unique
- Le cabinet LEXPAT intervient ensuite sur le volet juridique si nécessaire

CONCEPTS CLÉS À MAÎTRISER :
- Permis unique (single permit) : autorisation combinée de séjour + travail pour les ressortissants hors UE
- Test du marché de l'emploi (arbeidsmarkttoets) : obligation de prouver l'absence de candidat local/européen avant de recruter hors UE
- Listes de pénurie : Actiris (Bruxelles), Le Forem (Wallonie), VDAB (Flandre) — publiées annuellement
- Dispense totale du test marché : 21 professions de l'AM du 1er décembre 2025 (Flandre) — recrutement hors UE direct
- Test marché 9 semaines : 227 autres knelpuntberoepen VDAB — publication VDAB + EURES obligatoire
- Secteurs en pénurie : construction, santé, IT, transport/logistique, industrie, hôtellerie/restauration

TON & VALEURS :
- Expert, professionnel, jamais agressif commercialement
- Clarté juridique sans jargon excessif
- Proximité et confiance (Candice est avocate, pas simple plateforme tech)
- Gratuité pour les travailleurs, accès payant ou par contact pour les employeurs

URLS CLÉS :
- Simulateur : lexpat-connect.be/simulateur-eligibilite
- Base de profils : lexpat-connect.be/base-de-profils
- Métiers en pénurie : lexpat-connect.be/metiers-en-penurie
- Contact : lexpat-connect.be/contact
- Inscription : lexpat-connect.be/inscription
`;

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildEmailPrompt({ prompt, audience, locale }) {
  const lang = locale === "en" ? "anglais" : "français";
  const audienceLabel =
    audience === "employer"  ? "un employeur belge"
    : audience === "worker"  ? "un travailleur international"
    : "un contact externe (partenaire, journaliste, cabinet RH, etc.)";

  return [
    `Rédige un email professionnel en ${lang} pour LEXPAT Connect.`,
    `Destinataire : ${audienceLabel}.`,
    "",
    "CONSIGNE DE L'EXPÉDITEUR (Candice / LEXPAT Connect) :",
    prompt,
    "",
    "RÈGLES DE RÉDACTION :",
    "- Longueur : 150 à 250 mots pour le corps (ni trop court, ni trop long)",
    "- Ton : professionnel, chaleureux, expert — jamais agressif ou trop commercial",
    "- Commencer directement par la salutation (ex: Bonjour, Madame, Monsieur...)",
    "- Ne pas utiliser de placeholders comme [Nom] — utiliser des formules génériques",
    "- Terminer par une signature sobre : 'Candice | LEXPAT Connect | lexpat-connect.be'",
    "- Inclure un appel à l'action clair mais non pressant",
    "",
    "RÉPONSE : retourne UNIQUEMENT un objet JSON valide, sans markdown ni commentaire :",
    '{"subject": "Sujet de l\'email ici", "body": "Corps complet de l\'email ici"}',
  ].join("\n");
}

// ── Claude ────────────────────────────────────────────────────────────────────

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
      max_tokens: 900,
      system: `Tu es l'assistante rédactrice de Candice, fondatrice de LEXPAT Connect. Tu connais parfaitement le site, ses audiences et le droit belge de l'immigration. Voici le contexte complet :\n${SITE_CONTEXT}\n\nTu réponds UNIQUEMENT avec un JSON valide : {"subject": "...", "body": "..."}`,
      messages: [{ role: "user", content: buildEmailPrompt(input) }],
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Claude API error ${response.status}`);

  const raw = data.content?.[0]?.text?.trim() || "";
  // Extraire le JSON même si Claude ajoute un peu de texte autour
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Claude n'a pas retourné de JSON valide");

  const parsed = JSON.parse(match[0]);
  if (!parsed.subject || !parsed.body) throw new Error("Champs subject/body manquants");
  return parsed;
}

// ── OpenAI (fallback) ─────────────────────────────────────────────────────────

async function generateWithOpenAI(input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Tu es l'assistante rédactrice de Candice, fondatrice de LEXPAT Connect. Contexte :\n${SITE_CONTEXT}\n\nRéponds UNIQUEMENT avec {"subject": "...", "body": "..."}`,
        },
        { role: "user", content: buildEmailPrompt(input) },
      ],
      max_tokens: 800,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || "OpenAI generation failed.");

  const raw = data.choices?.[0]?.message?.content?.trim() || "";
  const parsed = JSON.parse(raw);
  if (!parsed.subject || !parsed.body) throw new Error("Champs subject/body manquants");
  return parsed;
}

// ── Fallback local ────────────────────────────────────────────────────────────

function buildFallbackEmail({ prompt, audience, locale }) {
  const isEn = locale === "en";
  const isEmployer = audience === "employer";
  const isWorker   = audience === "worker";

  if (isEn) {
    return {
      subject: isEmployer
        ? "LEXPAT Connect — International talent for your shortage positions"
        : "Your profile on LEXPAT Connect",
      body: `Dear,\n\nThank you for your interest in LEXPAT Connect.\n\n${prompt}\n\nWe would be happy to discuss how LEXPAT Connect can support your needs. Our platform connects Belgian employers with qualified international workers in shortage occupations, with full legal security.\n\nFeel free to reach out or visit lexpat-connect.be for more information.\n\nBest regards,\nCandice | LEXPAT Connect | lexpat-connect.be`,
    };
  }

  return {
    subject: isEmployer
      ? "LEXPAT Connect — Des profils qualifiés pour vos métiers en pénurie"
      : isWorker
      ? "Votre profil LEXPAT Connect"
      : "LEXPAT Connect — Collaboration",
    body: `Bonjour,\n\nMerci de votre intérêt pour LEXPAT Connect.\n\n${prompt}\n\nNous serions ravis d'échanger sur la façon dont LEXPAT Connect peut répondre à vos besoins. Notre plateforme met en relation des employeurs belges avec des travailleurs internationaux qualifiés dans les métiers en pénurie, dans un cadre juridique sécurisé.\n\nN'hésitez pas à nous contacter ou à consulter lexpat-connect.be pour plus d'informations.\n\nCordialement,\nCandice | LEXPAT Connect | lexpat-connect.be`,
  };
}

// ── Export principal ──────────────────────────────────────────────────────────

export async function generateEmail(input) {
  // 1. Claude en priorité
  try {
    const result = await generateWithClaude(input);
    if (result) return { ...result, mode: "claude" };
  } catch {
    // passe à OpenAI
  }

  // 2. OpenAI en fallback
  try {
    const result = await generateWithOpenAI(input);
    if (result) return { ...result, mode: "openai" };
  } catch {
    // passe au générateur local
  }

  // 3. Fallback local
  return { ...buildFallbackEmail(input), mode: "fallback" };
}
