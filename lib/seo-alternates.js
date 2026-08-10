/**
 * Table de correspondance FR ↔ EN pour les balises canonical et hreflang.
 *
 * Pourquoi : sans hreflang, Google traite /employeurs et /en/employeurs comme
 * deux pages concurrentes en doublon et n'en indexe qu'une seule. C'est la
 * cause principale du motif « Détectée, actuellement non indexée » en
 * Search Console.
 *
 * Règle à respecter : les balises alternate doivent être IDENTIQUES sur les
 * deux versions d'une paire, et chaque page doit se déclarer elle-même.
 * Un hreflang non réciproque est purement et simplement ignoré par Google.
 *
 * Pour ajouter une page : ajouter une entrée ici, puis dans le fichier page.js
 *   import { alternatesFor } from "<chemin>/lib/seo-alternates";
 *   export const metadata = { ..., alternates: alternatesFor("/ma-route") };
 *
 * Ne PAS référencer ici les pages en noindex (/securite-conformite), les pages
 * privées (/admin, /messagerie, espaces membres) ni les alias de redirection.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

/**
 * Clé = route FR (la version de référence).
 * Valeur = route EN, ou null si la page n'existe qu'en français.
 */
export const ROUTE_PAIRS = {
  "/": "/en",

  // Employeurs
  "/employeurs": "/en/employeurs",
  "/employeurs/anvers-metiers-en-penurie":
    "/en/employeurs/anvers-metiers-en-penurie",
  "/employeurs/bruges-metiers-en-penurie":
    "/en/employeurs/bruges-metiers-en-penurie",
  "/employeurs/gand-metiers-en-penurie":
    "/en/employeurs/gand-metiers-en-penurie",
  "/employeurs/liege-metiers-en-penurie":
    "/en/employeurs/liege-metiers-en-penurie",
  "/recrutement-international": "/en/recrutement-international",
  "/base-de-profils": "/en/base-de-profils",

  // Travailleurs
  "/travailleurs": "/en/travailleurs",
  "/permis-unique": "/en/permis-unique",
  "/metiers-en-penurie": "/en/metiers-en-penurie",
  "/simulateur-eligibilite": "/en/simulateur-eligibilite",
  "/offres-d-emploi": "/en/offres-d-emploi",

  // Institutionnel
  "/histoire-de-la-fondatrice": "/en/histoire-de-la-fondatrice",
  "/contact": "/en/contact",

  // Légal
  "/mentions-legales": "/en/mentions-legales",
  "/politique-de-confidentialite": "/en/politique-de-confidentialite",
  "/conditions-utilisation": "/en/conditions-utilisation",
  "/cookies": "/en/cookies",

  // FR uniquement — pas encore de version anglaise
  "/devenir-belge/schema-interactif": null,
};

/** Index inverse : route EN → route FR. */
const EN_TO_FR = Object.entries(ROUTE_PAIRS).reduce((acc, [fr, en]) => {
  if (en) acc[en] = fr;
  return acc;
}, {});

const abs = (path) => `${SITE_URL}${path === "/" ? "/" : path}`;

/**
 * Construit l'objet `alternates` attendu par la metadata Next.js.
 *
 * @param {string} route - Route de la page courante, FR ou EN, sans domaine
 *                         ni slash final (ex. "/employeurs", "/en/employeurs").
 * @returns {{canonical: string, languages: Record<string, string>}}
 */
export function alternatesFor(route) {
  const isEn = route === "/en" || route.startsWith("/en/");
  const frRoute = isEn ? EN_TO_FR[route] : route;

  if (!frRoute) {
    // Route absente de la table : on pose au moins une canonique
    // auto-référente plutôt que de laisser la page sans balise.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[seo-alternates] Route non déclarée dans ROUTE_PAIRS : ${route}`
      );
    }
    return { canonical: abs(route) };
  }

  const enRoute = ROUTE_PAIRS[frRoute];

  // Page sans équivalent anglais : canonique seule, pas de hreflang.
  // Déclarer un hreflang vers une page inexistante est pire que rien.
  if (!enRoute) {
    return { canonical: abs(frRoute) };
  }

  return {
    canonical: abs(isEn ? enRoute : frRoute),
    languages: {
      fr: abs(frRoute),
      en: abs(enRoute),
      // x-default : version servie aux visiteurs dont la langue ne correspond
      // à aucune des deux. Le FR est la version de référence du site.
      "x-default": abs(frRoute),
    },
  };
}
