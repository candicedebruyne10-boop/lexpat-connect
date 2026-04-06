export function detectLocaleFromPathname(pathname = "") {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

export function stripLocalePrefix(pathname = "/") {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname || "/";
}

export function localizeHref(href = "/", locale = "fr") {
  if (!href || href.startsWith("#") || href.startsWith("http")) {
    return href;
  }

  if (locale !== "en") {
    return href;
  }

  if (href === "/") return "/en";
  if (href.startsWith("/en")) return href;

  return `/en${href}`;
}

export function switchLocalePath(pathname = "/", targetLocale = "fr") {
  const stripped = stripLocalePrefix(pathname);
  return localizeHref(stripped, targetLocale);
}

export const siteCopy = {
  fr: {
    nav: {
      home: "Accueil",
      employers: "Employeurs",
      workers: "Travailleurs",
      immigration: "Immigration",
      messaging: "Messagerie",
      cabinet: "Cabinet LEXPAT",
      recruit: "Je recrute",
      candidates: "Candidats disponibles",
      apply: "Je postule",
      offers: "Offres d'emploi",
      permitGuide: "Guide permis unique",
      hqWorkers: "Travailleurs hautement qualifiés",
      shortageJobs: "Métiers en pénurie",
      compliance: "Conformité & sécurité"
    },
    auth: {
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      signOut: "Déconnexion",
      employerSpace: "Mon espace employeur",
      workerSpace: "Mon espace travailleur",
      mobileSpace: "Espace"
    },
    footer: {
      brandText:
        "Une plateforme pensée pour connecter les employeurs belges aux travailleurs internationaux dans les métiers en pénurie, de façon plus claire, plus rapide et plus lisible.",
      employers: "Employeurs",
      workers: "Travailleurs",
      quickActions: "Actions rapides",
      cabinet: "Cabinet LEXPAT",
      recruit: "Je recrute",
      availableCandidates: "Candidats disponibles",
      shortageJobs: "Métiers en pénurie",
      apply: "Je postule",
      offers: "Offres d'emploi",
      postNeed: "Déposer un besoin de recrutement",
      makeVisible: "Rendre mon profil visible",
      understandPermit: "Comprendre le permis unique",
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      founderStory: "L’histoire de la fondatrice",
      cabinetText:
        "Un relais juridique distinct lorsque la mise en relation débouche sur une question de permis unique, de droit au travail ou de sécurisation du recrutement.",
      cabinetCta: "Voir l'accompagnement",
      bottom:
        "LEXPAT Connect — Plateforme de mise en relation pour métiers en pénurie en Belgique."
    },
    legalLinks: {
      legal: "Mentions légales",
      privacy: "Confidentialité",
      cookies: "Cookies",
      terms: "Conditions d’utilisation",
      security: "Sécurité & conformité",
      feedback: "Retours testeurs",
      admin: "Admin"
    },
    language: {
      fr: "FR",
      en: "EN"
    }
  },
  en: {
    nav: {
      home: "Home",
      employers: "Employers",
      workers: "Workers",
      immigration: "Immigration",
      messaging: "Messaging",
      cabinet: "LEXPAT Law Firm",
      recruit: "I am hiring",
      candidates: "Available candidates",
      apply: "I am applying",
      offers: "Job openings",
      permitGuide: "Single permit guide",
      hqWorkers: "Highly qualified workers",
      shortageJobs: "Shortage occupations",
      compliance: "Compliance & security"
    },
    auth: {
      signIn: "Sign in",
      createAccount: "Create an account",
      signOut: "Sign out",
      employerSpace: "My employer space",
      workerSpace: "My worker space",
      mobileSpace: "Space"
    },
    footer: {
      brandText:
        "A platform designed to connect Belgian employers with international workers in shortage occupations, in a clearer, faster and more readable way.",
      employers: "Employers",
      workers: "Workers",
      quickActions: "Quick actions",
      cabinet: "LEXPAT Law Firm",
      recruit: "I am hiring",
      availableCandidates: "Available candidates",
      shortageJobs: "Shortage occupations",
      apply: "I am applying",
      offers: "Job openings",
      postNeed: "Submit a hiring need",
      makeVisible: "Make my profile visible",
      understandPermit: "Single permit guide",
      signIn: "Sign in",
      createAccount: "Create an account",
      founderStory: "The founder’s story",
      cabinetText:
        "A separate legal relay when a match leads to a single permit, right-to-work or recruitment compliance issue.",
      cabinetCta: "View legal support",
      bottom:
        "LEXPAT Connect — Matching platform for shortage occupations in Belgium."
    },
    legalLinks: {
      legal: "Legal notice",
      privacy: "Privacy",
      cookies: "Cookies",
      terms: "Terms of use",
      security: "Security & compliance",
      feedback: "Tester feedback",
      admin: "Admin"
    },
    language: {
      fr: "FR",
      en: "EN"
    }
  }
};
