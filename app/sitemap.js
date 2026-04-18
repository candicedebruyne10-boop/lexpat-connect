const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

// ─── Pages publiques indexables ────────────────────────────────────────────────
// Exclues : /admin, /connexion, /inscription, /espace, /rejoindre, /messagerie,
//           /candidatures, /auth/session, /retours-test, /securite-conformite

const publicRoutes = [
  // Accueil
  { path: "/",                                      priority: 1.0,  changeFrequency: "weekly"  },
  { path: "/en",                                    priority: 1.0,  changeFrequency: "weekly"  },

  // Travailleurs
  { path: "/travailleurs",                          priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/en/travailleurs",                       priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/travailleurs-hautement-qualifies",      priority: 0.8,  changeFrequency: "monthly" },
  { path: "/en/travailleurs-hautement-qualifies",   priority: 0.8,  changeFrequency: "monthly" },

  // Employeurs
  { path: "/employeurs",                            priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/en/employeurs",                         priority: 0.9,  changeFrequency: "weekly"  },

  // Pages régionales employeurs
  { path: "/employeurs/liege-metiers-en-penurie",          priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/liege-metiers-en-penurie",        priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/anvers-metiers-en-penurie",          priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/anvers-metiers-en-penurie",       priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/gand-metiers-en-penurie",            priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/gand-metiers-en-penurie",         priority: 0.85, changeFrequency: "monthly" },
  { path: "/employeurs/bruges-metiers-en-penurie",          priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/employeurs/bruges-metiers-en-penurie",       priority: 0.85, changeFrequency: "monthly" },

  // Recrutement international
  { path: "/recrutement-international",               priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/recrutement-international",            priority: 0.85, changeFrequency: "monthly" },

  // Métiers en pénurie
  { path: "/metiers-en-penurie",                    priority: 0.85, changeFrequency: "monthly" },
  { path: "/en/metiers-en-penurie",                 priority: 0.85, changeFrequency: "monthly" },
  { path: "/liste-metiers-penurie",                 priority: 0.75, changeFrequency: "monthly" },
  { path: "/en/liste-metiers-penurie",              priority: 0.75, changeFrequency: "monthly" },

  // Permis unique & accompagnement
  { path: "/permis-unique",                         priority: 0.8,  changeFrequency: "monthly" },
  { path: "/en/permis-unique",                      priority: 0.8,  changeFrequency: "monthly" },
  { path: "/accompagnement-juridique",              priority: 0.8,  changeFrequency: "monthly" },
  { path: "/en/accompagnement-juridique",           priority: 0.8,  changeFrequency: "monthly" },

  // Retour en Belgique
  { path: "/revenir-en-belgique-apres-un-retour",   priority: 0.7,  changeFrequency: "monthly" },
  { path: "/en/returning-to-belgium-after-leaving", priority: 0.7,  changeFrequency: "monthly" },

  // Offres & profils
  { path: "/offres-d-emploi",                       priority: 0.75, changeFrequency: "daily"   },
  { path: "/en/offres-d-emploi",                    priority: 0.75, changeFrequency: "daily"   },
  { path: "/base-de-profils",                       priority: 0.75, changeFrequency: "weekly"  },
  { path: "/en/base-de-profils",                    priority: 0.75, changeFrequency: "weekly"  },

  // Simulateur
  { path: "/simulateur-eligibilite",                priority: 0.7,  changeFrequency: "monthly" },
  { path: "/en/simulateur-eligibilite",             priority: 0.7,  changeFrequency: "monthly" },

  // À propos
  { path: "/histoire-de-la-fondatrice",             priority: 0.6,  changeFrequency: "yearly"  },
  { path: "/en/histoire-de-la-fondatrice",          priority: 0.6,  changeFrequency: "yearly"  },

  // Contact
  { path: "/contact",                               priority: 0.6,  changeFrequency: "yearly"  },
  { path: "/en/contact",                            priority: 0.6,  changeFrequency: "yearly"  },

  // Légal
  { path: "/mentions-legales",                      priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/en/mentions-legales",                   priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/politique-de-confidentialite",          priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/en/politique-de-confidentialite",       priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/conditions-utilisation",                priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/en/conditions-utilisation",             priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/cookies",                               priority: 0.2,  changeFrequency: "yearly"  },
  { path: "/en/cookies",                            priority: 0.2,  changeFrequency: "yearly"  },
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
