const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

// ─── Pages publiques indexables ────────────────────────────────────────────────
// Exclues : /admin, /connexion, /inscription, /espace, /rejoindre, /messagerie,
//           /candidatures, /auth/session, /retours-test, /securite-conformite

// IMPORTANT : n'inclure ici QUE des URLs qui existent réellement (pas de redirects).
// Les redirects gaspillent le crawl budget et nuisent à l'indexation.
// URLs exclues car elles redirigent :
//   /liste-metiers-penurie          → /metiers-en-penurie
//   /travailleurs-hautement-qualifies → /travailleurs#qualifies
//   /accompagnement-juridique       → /permis-unique
//   /revenir-en-belgique-apres-un-retour → /travailleurs#retour
//   /en/returning-to-belgium-after-leaving → /en/workers#retour

const publicRoutes = [
  // ── Accueil ────────────────────────────────────────────────────────────────
  { path: "/",                                      priority: 1.0,  changeFrequency: "weekly"  },
  { path: "/en",                                    priority: 1.0,  changeFrequency: "weekly"  },

  // ── Employeurs ─────────────────────────────────────────────────────────────
  { path: "/employeurs",                            priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/en/employeurs",                         priority: 0.9,  changeFrequency: "weekly"  },

  // Pages régionales employeurs (SEO local)
  { path: "/employeurs/liege-metiers-en-penurie",   priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/liege-metiers-en-penurie",  priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/anvers-metiers-en-penurie",  priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/anvers-metiers-en-penurie", priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/gand-metiers-en-penurie",    priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/gand-metiers-en-penurie",  priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/bruges-metiers-en-penurie",  priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/bruges-metiers-en-penurie", priority: 0.85, changeFrequency: "monthly" },

  // Recrutement international
  { path: "/recrutement-international",             priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/recrutement-international",          priority: 0.85, changeFrequency: "monthly" },

  // ── Travailleurs ───────────────────────────────────────────────────────────
  { path: "/travailleurs",                          priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/en/travailleurs",                       priority: 0.9,  changeFrequency: "weekly"  },

  // ── Immigration & métiers ──────────────────────────────────────────────────
  { path: "/permis-unique",                         priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/permis-unique",                      priority: 0.85, changeFrequency: "monthly" },
  { path: "/metiers-en-penurie",                    priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/metiers-en-penurie",                 priority: 0.85, changeFrequency: "monthly" },

  // ── Outils & simulateurs ───────────────────────────────────────────────────
  { path: "/devenir-belge/schema-interactif",       priority: 0.75, changeFrequency: "yearly"  },
  { path: "/simulateur-eligibilite",                priority: 0.8,  changeFrequency: "monthly" },
  { path: "/en/simulateur-eligibilite",             priority: 0.8,  changeFrequency: "monthly" },
  { path: "/offres-d-emploi",                       priority: 0.75, changeFrequency: "daily"   },
  { path: "/en/offres-d-emploi",                    priority: 0.75, changeFrequency: "daily"   },
  { path: "/base-de-profils",                       priority: 0.75, changeFrequency: "weekly"  },
  { path: "/en/base-de-profils",                    priority: 0.75, changeFrequency: "weekly"  },

  // ── À propos & contact ─────────────────────────────────────────────────────
  { path: "/histoire-de-la-fondatrice",             priority: 0.6,  changeFrequency: "yearly"  },
  { path: "/en/histoire-de-la-fondatrice",          priority: 0.6,  changeFrequency: "yearly"  },
  { path: "/contact",                               priority: 0.6,  changeFrequency: "yearly"  },
  { path: "/en/contact",                            priority: 0.6,  changeFrequency: "yearly"  },

  // ── Légal (priorité basse — contenu faible) ────────────────────────────────
  { path: "/mentions-legales",                      priority: 0.2,  changeFrequency: "yearly"  },
  { path: "/politique-de-confidentialite",          priority: 0.2,  changeFrequency: "yearly"  },
  { path: "/conditions-utilisation",                priority: 0.2,  changeFrequency: "yearly"  },
  { path: "/cookies",                               priority: 0.1,  changeFrequency: "yearly"  },
];

export default function sitemap() {
  const now = new Date().toISOString();
  return publicRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
