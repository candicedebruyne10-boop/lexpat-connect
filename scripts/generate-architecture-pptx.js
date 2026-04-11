const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "LEXPAT Connect";
pptx.subject = "Architecture business";
pptx.title = "LEXPAT Connect — Architecture Business";
pptx.lang = "fr-BE";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "fr-BE"
};

const C = {
  navy: "1E2F86",
  navyDark: "102347",
  teal: "7CCDC7",
  tealDark: "2B8F88",
  ink: "0F172A",
  slate: "5F7086",
  slateSoft: "EAF0F6",
  line: "DCE6EF",
  white: "FFFFFF",
  blueSoft: "EEF4FF",
  tealSoft: "ECFAF8",
  sandSoft: "FFF7E8",
  bg: "F8FBFF"
};

function fullBleedBackground(slide, color = C.white) {
  slide.background = { color };
}

function addTopRule(slide) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6,
    y: 0.78,
    w: 11.2,
    h: 0,
    line: { color: C.line, pt: 1.1 }
  });
}

function addSectionBand(slide, text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 0.34,
    w: 2.4,
    h: 0.38,
    rectRadius: 0.08,
    line: { color: C.blueSoft, transparency: 100 },
    fill: { color: C.blueSoft }
  });
  slide.addText(text, {
    x: 0.78,
    y: 0.43,
    w: 2,
    h: 0.14,
    fontSize: 8.5,
    bold: true,
    color: C.navy,
    margin: 0,
    align: "center"
  });
}

function addHeader(slide, title, subtitle, kicker = null) {
  if (kicker) {
    slide.addText(kicker, {
      x: 0.62,
      y: 0.34,
      w: 2.2,
      h: 0.28,
      fontSize: 8.5,
      bold: true,
      color: C.navy,
      margin: 0,
      breakLine: false
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.56,
      y: 0.27,
      w: 2.05,
      h: 0.34,
      rectRadius: 0.08,
      line: { color: C.blueSoft, transparency: 100 },
      fill: { color: C.blueSoft }
    });
  }

  slide.addText(title, {
    x: 0.56,
    y: kicker ? 0.8 : 0.42,
    w: 10.8,
    h: 0.72,
    fontFace: "Aptos Display",
    fontSize: 23,
    bold: true,
    color: C.ink,
    margin: 0
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.58,
      y: kicker ? 1.55 : 1.18,
      w: 10.6,
      h: 0.55,
      fontFace: "Aptos",
      fontSize: 11,
      color: C.slate,
      margin: 0
    });
  }

  addTopRule(slide);
}

function addMetric(slide, x, y, w, title, value, tone = "blue") {
  const fill = tone === "teal" ? C.tealSoft : tone === "sand" ? C.sandSoft : C.blueSoft;
  const color = tone === "teal" ? C.tealDark : tone === "sand" ? "B7791F" : C.navy;

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 1.15,
    rectRadius: 0.08,
    line: { color: fill, transparency: 100 },
    fill: { color: fill }
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.18,
    w: w - 0.36,
    h: 0.2,
    fontSize: 9,
    bold: true,
    color,
    margin: 0
  });
  slide.addText(String(value), {
    x: x + 0.18,
    y: y + 0.46,
    w: w - 0.36,
    h: 0.35,
    fontFace: "Aptos Display",
    fontSize: 22,
    bold: true,
    color: C.ink,
    margin: 0
  });
}

function addCard(slide, { x, y, w, h, title, text, fill = C.white, titleColor = C.navy, bodyColor = C.slate }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: C.line, pt: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "CBD5E1", angle: 45, blur: 1, distance: 1, opacity: 0.1 }
  });
  slide.addText(title, {
    x: x + 0.22,
    y: y + 0.18,
    w: w - 0.44,
    h: 0.34,
    fontFace: "Aptos Display",
    fontSize: 15,
    bold: true,
    color: titleColor,
    margin: 0
  });
  slide.addText(text, {
    x: x + 0.22,
    y: y + 0.62,
    w: w - 0.44,
    h: h - 0.78,
    fontSize: 10.5,
    color: bodyColor,
    margin: 0
  });
}

function addBulletsCard(slide, options) {
  const { x, y, w, h, title, lines, fill = C.white, titleColor = C.navy } = options;
  addCard(slide, { x, y, w, h, title, text: "", fill, titleColor });
  slide.addText(
    lines.map((line) => ({ text: line, options: { bullet: { indent: 10 } } })),
    {
      x: x + 0.22,
      y: y + 0.62,
      w: w - 0.42,
      h: h - 0.8,
      fontSize: 10.5,
      color: C.slate,
      margin: 0.02,
      paraSpaceAfterPt: 6
    }
  );
}

function addCompactListCard(slide, { x, y, w, h, title, lines, fill = C.white, titleColor = C.navy, bodyColor = C.slate }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: C.line, pt: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "CBD5E1", angle: 45, blur: 1, distance: 1, opacity: 0.1 }
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.18,
    w: w - 0.36,
    h: 0.28,
    fontFace: "Aptos Display",
    fontSize: 12.5,
    bold: true,
    color: titleColor,
    margin: 0
  });
  slide.addText(
    lines.map((line) => ({ text: line, options: { bullet: { indent: 8 } } })),
    {
      x: x + 0.16,
      y: y + 0.52,
      w: w - 0.28,
      h: h - 0.66,
      fontSize: 8.2,
      color: bodyColor,
      margin: 0.01,
      paraSpaceAfterPt: 2.5
    }
  );
}

function addFlowArrow(slide, x, y, w) {
  slide.addShape(pptx.ShapeType.chevron, {
    x,
    y,
    w,
    h: 0.32,
    line: { color: C.blueSoft, transparency: 100 },
    fill: { color: C.blueSoft }
  });
}

function addStepCard(slide, { x, y, w, h, step, title, lines, fill = C.white, bandColor = C.navy }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: C.line, pt: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "CBD5E1", angle: 45, blur: 1, distance: 1, opacity: 0.1 }
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.18,
    y: y + 0.18,
    w: 0.58,
    h: 0.32,
    rectRadius: 0.08,
    line: { color: bandColor, transparency: 100 },
    fill: { color: bandColor }
  });
  slide.addText(step, {
    x: x + 0.18,
    y: y + 0.27,
    w: 0.58,
    h: 0.1,
    fontSize: 8.5,
    bold: true,
    color: C.white,
    margin: 0,
    align: "center"
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.65,
    w: w - 0.36,
    h: 0.38,
    fontFace: "Aptos Display",
    fontSize: 15,
    bold: true,
    color: C.ink,
    margin: 0
  });
  slide.addText(
    lines.map((line) => ({ text: line, options: { bullet: { indent: 10 } } })),
    {
      x: x + 0.18,
      y: y + 1.12,
      w: w - 0.34,
      h: h - 1.28,
      fontSize: 10.5,
      color: C.slate,
      margin: 0.02,
      paraSpaceAfterPt: 6
    }
  );
}

function addFooter(slide, label = "LEXPAT Connect — Architecture business") {
  slide.addText(label, {
    x: 0.6,
    y: 6.78,
    w: 5.2,
    h: 0.14,
    fontSize: 8.5,
    color: C.slate,
    margin: 0
  });
}

const cover = pptx.addSlide();
fullBleedBackground(cover, C.bg);
cover.addShape(pptx.ShapeType.roundRect, {
  x: 7.05,
  y: 0.72,
  w: 4.72,
  h: 5.74,
  rectRadius: 0.12,
  line: { color: C.line, pt: 1 },
  fill: { color: C.white },
  shadow: { type: "outer", color: "CBD5E1", angle: 45, blur: 1, distance: 1, opacity: 0.12 }
});
cover.addShape(pptx.ShapeType.rect, {
  x: 7.05,
  y: 0.72,
  w: 4.72,
  h: 1.18,
  line: { color: C.navyDark, transparency: 100 },
  fill: {
    color: C.navyDark,
    transparency: 0
  }
});
cover.addText("LEXPAT", {
  x: 0.72,
  y: 0.78,
  w: 5.8,
  h: 0.84,
  fontFace: "Aptos Display",
  fontSize: 36,
  bold: true,
  color: C.navy,
  margin: 0
});
cover.addText("Connect", {
  x: 0.72,
  y: 1.58,
  w: 4.6,
  h: 0.95,
  fontFace: "Aptos",
  fontSize: 33,
  color: C.teal,
  margin: 0
});
cover.addText("Plateforme, acquisition et exécution", {
  x: 0.75,
  y: 3.02,
  w: 5.8,
  h: 0.42,
  fontSize: 18,
  bold: true,
  color: C.ink,
  margin: 0
});
cover.addText(
  "Une lecture stratégique de la plateforme : comment LEXPAT Connect attire, qualifie, active et sécurise la mise en relation avant relais juridique.",
  {
    x: 0.75,
    y: 3.5,
    w: 5.8,
    h: 0.62,
    fontSize: 11.5,
    color: C.slate,
    margin: 0
  }
);
cover.addText("Executive summary", {
  x: 7.38,
  y: 1.06,
  w: 3.65,
  h: 0.28,
  fontSize: 14,
  bold: true,
  color: C.white,
  margin: 0
});
addMetric(cover, 7.42, 1.68, 1.9, "Funnels", 2, "blue");
addMetric(cover, 9.46, 1.68, 1.9, "Data core", 9, "teal");
addMetric(cover, 7.42, 3.02, 1.9, "Admin hub", "1", "sand");
addMetric(cover, 9.46, 3.02, 1.9, "Member spaces", 2, "blue");
addBulletsCard(cover, {
  x: 7.4,
  y: 4.28,
  w: 4.0,
  h: 1.66,
  title: "Thèse produit",
  fill: C.blueSoft,
  lines: [
    "Le matching crée la valeur avant le juridique",
    "La donnée est structurée pour être réutilisable",
    "La messagerie intervient au bon moment",
    "Le cabinet transforme l'intérêt en dossier sécurisé"
  ]
});
addFooter(cover);

const overview = pptx.addSlide();
fullBleedBackground(overview, C.white);
addSectionBand(overview, "VUE GLOBALE");
addHeader(overview, "Vue d'ensemble du produit", "Le produit se compose aujourd'hui de 52 pages applicatives : vitrine FR, vitrine EN, espaces membres, pages système, couche légale et contenus éditoriaux encore en prépublication.");
addMetric(overview, 0.65, 1.75, 1.7, "Pages totales", 52, "blue");
addMetric(overview, 2.55, 1.75, 1.7, "Routes FR", 29, "teal");
addMetric(overview, 4.45, 1.75, 1.7, "Routes EN", 23, "sand");
addMetric(overview, 6.35, 1.75, 1.7, "Espaces membres", 4, "blue");
addMetric(overview, 8.25, 1.75, 1.7, "Interne / QA", 4, "teal");
addMetric(overview, 10.15, 1.75, 1.2, "Pages retour", 2, "sand");
addBulletsCard(overview, {
  x: 0.65,
  y: 3.2,
  w: 3.45,
  h: 3.1,
  title: "Pages publiques FR",
  fill: C.blueSoft,
  lines: [
    "Accueil",
    "Employeurs",
    "Travailleurs",
    "Simulateur d'éligibilité",
    "Métiers en pénurie",
    "Permis unique",
    "Accompagnement juridique",
    "Sécurité & conformité",
    "Travailleurs hautement qualifiés",
    "Base de profils",
    "Offres d'emploi",
    "Candidatures",
    "Histoire de la fondatrice",
    "Contact"
  ]
});
addBulletsCard(overview, {
  x: 4.3,
  y: 3.2,
  w: 3.55,
  h: 3.1,
  title: "Pages membres & système",
  lines: [
    "Connexion",
    "Inscription",
    "Session auth",
    "Espace employeur",
    "Espace travailleur",
    "Messagerie",
    "Admin",
    "Retours testeurs"
  ]
});
addBulletsCard(overview, {
  x: 8.05,
  y: 3.2,
  w: 3.65,
  h: 3.1,
  title: "Confiance & contenus sensibles",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Mentions légales",
    "Politique de confidentialité",
    "Cookies",
    "Conditions d'utilisation",
    "Pages FR + EN sur le retour après départ",
    "Contenus juridiques éditoriaux"
  ]
});
addFooter(overview);

const inventory = pptx.addSlide();
fullBleedBackground(inventory, C.bg);
addSectionBand(inventory, "INVENTAIRE DES ROUTES");
addHeader(inventory, "Liste actuelle des pages du site", "Inventaire complet des routes page.js présentes dans l'application, y compris les espaces membres, les pages internes et la page encore non publique sur le retour dans le pays d'origine.");
addCompactListCard(inventory, {
  x: 0.58,
  y: 1.72,
  w: 2.7,
  h: 4.95,
  title: "FR — vitrine & juridique",
  fill: C.white,
  lines: [
    "/",
    "/employeurs",
    "/travailleurs",
    "/simulateur-eligibilite",
    "/metiers-en-penurie",
    "/liste-metiers-penurie",
    "/permis-unique",
    "/travailleurs-hautement-qualifies",
    "/accompagnement-juridique",
    "/securite-conformite",
    "/offres-d-emploi",
    "/candidatures",
    "/base-de-profils",
    "/contact",
    "/histoire-de-la-fondatrice",
    "/employeurs/liege-metiers-en-penurie",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/cookies",
    "/conditions-utilisation"
  ]
});
addCompactListCard(inventory, {
  x: 3.48,
  y: 1.72,
  w: 2.7,
  h: 4.95,
  title: "FR — comptes & interne",
  fill: C.blueSoft,
  titleColor: C.navy,
  lines: [
    "/connexion",
    "/inscription",
    "/auth/session",
    "/employeurs/espace",
    "/travailleurs/espace",
    "/messagerie",
    "/admin",
    "/retours-test",
    "/revenir-en-belgique-apres-un-retour",
    "Page éditoriale créée mais encore non promue publiquement"
  ]
});
addCompactListCard(inventory, {
  x: 6.38,
  y: 1.72,
  w: 2.7,
  h: 4.95,
  title: "EN — public pages",
  fill: C.white,
  lines: [
    "/en",
    "/en/employeurs",
    "/en/travailleurs",
    "/en/simulateur-eligibilite",
    "/en/metiers-en-penurie",
    "/en/permis-unique",
    "/en/travailleurs-hautement-qualifies",
    "/en/accompagnement-juridique",
    "/en/securite-conformite",
    "/en/offres-d-emploi",
    "/en/candidatures",
    "/en/base-de-profils",
    "/en/contact",
    "/en/histoire-de-la-fondatrice",
    "/en/mentions-legales",
    "/en/politique-de-confidentialite",
    "/en/cookies",
    "/en/conditions-utilisation"
  ]
});
addCompactListCard(inventory, {
  x: 9.28,
  y: 1.72,
  w: 2.14,
  h: 4.95,
  title: "EN — comptes & spécifique",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "/en/connexion",
    "/en/inscription",
    "/en/messagerie",
    "/en/retours-test",
    "/en/returning-to-belgium-after-leaving",
    "Version EN de la page retour au pays d'origine",
    "52 pages applicatives au total"
  ]
});
addFooter(inventory);

const routing = pptx.addSlide();
fullBleedBackground(routing, C.bg);
addSectionBand(routing, "PAGES & CTA");
addHeader(routing, "Parcours d'entrée et mécanique de conversion", "La navigation est pensée comme un double funnel employeur / travailleur, renforcé par un simulateur et des vitrines publiques qui réduisent la friction d'entrée.");
addStepCard(routing, {
  x: 0.62,
  y: 1.82,
  w: 3.55,
  h: 4.7,
  step: "01",
  title: "Homepage / positioning",
  fill: C.white,
  lines: [
    "Hero premium de positionnement",
    "Double entrée employeur / travailleur",
    "Teaser simulateur 2026",
    "Captures réelles des espaces de matching",
    "Guide métiers en pénurie",
    "Teaser sécurité & conformité",
    "Comment ça marche",
    "CTA : Je recrute -> /employeurs",
    "CTA : Je postule -> /travailleurs"
  ]
});
addStepCard(routing, {
  x: 4.43,
  y: 1.82,
  w: 3.35,
  h: 4.7,
  step: "02",
  title: "Employer funnel",
  fill: C.blueSoft,
  bandColor: C.navy,
  lines: [
    "Bénéfices du parcours employeur",
    "Profils publics anonymisés",
    "Aperçu espace employeur",
    "Formulaire de besoin de recrutement",
    "CTA : Déposer un besoin -> #formulaire",
    "CTA : Déposer une offre -> /employeurs",
    "CTA : Voir le relais juridique -> /accompagnement-juridique"
  ]
});
addStepCard(routing, {
  x: 8.03,
  y: 1.82,
  w: 3.67,
  h: 4.7,
  step: "03",
  title: "Worker funnel",
  fill: C.tealSoft,
  bandColor: C.tealDark,
  lines: [
    "Bénéfices du parcours talent",
    "Offres publiques visibles sans compte",
    "Aperçu espace travailleur",
    "Formulaire candidat",
    "CTA : Créer mon profil -> #formulaire",
    "CTA : Voir les métiers recherchés -> /metiers-en-penurie",
    "CTA : Voir les offres -> /offres-d-emploi",
    "CTA : Voir le relais juridique -> /accompagnement-juridique"
  ]
});
addFooter(routing);

const forms = pptx.addSlide();
fullBleedBackground(forms, C.white);
addSectionBand(forms, "FORMULAIRES");
addHeader(forms, "Formulaires publics : capter sans surcharger", "Les formulaires publics captent juste assez d'information pour qualifier un lead, déclencher une réponse et nourrir la suite du parcours sans créer de friction excessive.");
addBulletsCard(forms, {
  x: 0.62,
  y: 1.82,
  w: 5.35,
  h: 4.72,
  title: "Formulaire employeur",
  fill: C.blueSoft,
  lines: [
    "Nom du contact, entreprise, email professionnel, téléphone",
    "Région concernée",
    "Secteur + autre secteur si nécessaire",
    "Métier recherché + autre profession si nécessaire",
    "Type de contrat, nombre d'heures, lieu de travail",
    "Missions principales",
    "Compétences recherchées",
    "Bouton : Envoyer le besoin -> /api/forms",
    "Notification email via Resend -> contact@lexpat-connect.be"
  ]
});
addBulletsCard(forms, {
  x: 6.22,
  y: 1.82,
  w: 5.48,
  h: 4.72,
  title: "Formulaire travailleur",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Nom complet, email, téléphone, pays de résidence",
    "Région souhaitée en Belgique",
    "Secteur visé + autre secteur si nécessaire",
    "Métier recherché + autre profession si nécessaire",
    "Disponibilité et langues parlées",
    "Statut administratif",
    "Compétences principales",
    "Message complémentaire",
    "Bouton : Envoyer mon profil -> /api/forms",
    "Notification email via Resend -> contact@lexpat-connect.be"
  ]
});
addFooter(forms);

const accounts = pptx.addSlide();
fullBleedBackground(accounts, C.bg);
addSectionBand(accounts, "COMPTES & REDIRECTIONS");
addHeader(accounts, "Création de compte, connexion et redirections", "Le compte sert de bascule entre la vitrine publique et l'expérience propriétaire. Supabase Auth gère l'identité, puis le site oriente vers l'espace à forte valeur du bon rôle.");
addBulletsCard(accounts, {
  x: 0.62,
  y: 1.82,
  w: 3.45,
  h: 4.78,
  title: "Page /inscription",
  fill: C.white,
  lines: [
    "Choix du rôle : travailleur ou employeur",
    "Prénom, nom",
    "Entreprise si rôle employeur",
    "Email, mot de passe",
    "Bouton : Créer mon compte",
    "Redirection vers bootstrap utilisateur"
  ]
});
addBulletsCard(accounts, {
  x: 4.32,
  y: 1.82,
  w: 3.05,
  h: 4.78,
  title: "Page /connexion",
  fill: C.blueSoft,
  lines: [
    "Email, mot de passe",
    "Bouton : Se connecter",
    "Lecture du rôle",
    "Retour vers next= si prévu",
    "Sinon redirection vers l'espace du rôle"
  ]
});
addBulletsCard(accounts, {
  x: 7.62,
  y: 1.82,
  w: 4.08,
  h: 4.78,
  title: "Activation post-auth",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Employeur -> /employeurs/espace",
    "Travailleur -> /travailleurs/espace",
    "Messagerie -> /messagerie après match confirmé",
    "Admin -> /admin",
    "Les boutons verrouillés utilisent next= pour revenir au bon contenu",
    "Exemple : permis unique membre -> retour sur la section débloquée"
  ]
});
addFooter(accounts);

const employerSpace = pptx.addSlide();
fullBleedBackground(employerSpace, C.white);
addSectionBand(employerSpace, "ESPACE EMPLOYEUR");
addHeader(employerSpace, "Espace employeur : piloter le recrutement", "L'espace employeur sert à passer d'un besoin exprimé à un pipeline clair : structurer l'entreprise, publier des offres, lire les profils correspondants et ouvrir la conversation.");
addBulletsCard(employerSpace, {
  x: 0.62,
  y: 1.82,
  w: 3.45,
  h: 4.75,
  title: "Pilotage quotidien",
  fill: C.blueSoft,
  lines: [
    "Tableau de bord",
    "Mon entreprise",
    "Mes offres",
    "Profils correspondants",
    "Messagerie",
    "Cartes de synthèse cliquables",
    "Statut matching actif"
  ]
});
addBulletsCard(employerSpace, {
  x: 4.32,
  y: 1.82,
  w: 3.55,
  h: 4.75,
  title: "Socle entreprise",
  lines: [
    "Nom de l'entreprise",
    "Secteur principal",
    "Personne de contact",
    "Email professionnel, téléphone, site web",
    "Région principale",
    "Description de l'entreprise",
    "Bouton : Enregistrer l'entreprise -> /api/employer-profile"
  ]
});
addBulletsCard(employerSpace, {
  x: 8.12,
  y: 1.82,
  w: 3.58,
  h: 4.75,
  title: "Machine à opportunités",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Titre du poste",
    "Secteur",
    "Région",
    "Type de contrat",
    "Urgence",
    "Description",
    "Bouton : Ajouter une offre / Publier -> /api/offers",
    "Déclenche le matching automatiquement",
    "Alimente aussi la vitrine publique /offres-d-emploi"
  ]
});
addFooter(employerSpace);

const workerSpace = pptx.addSlide();
fullBleedBackground(workerSpace, C.bg);
addSectionBand(workerSpace, "ESPACE TRAVAILLEUR");
addHeader(workerSpace, "Espace travailleur : devenir visible et exploitable", "L'espace travailleur transforme un profil dispersé en candidature lisible : données de matching, CV, opportunités et ouverture de la messagerie au bon moment.");
addBulletsCard(workerSpace, {
  x: 0.62,
  y: 1.82,
  w: 3.35,
  h: 4.8,
  title: "Suivi du parcours",
  fill: C.white,
  lines: [
    "Tableau de bord",
    "Mes matchs",
    "Mon profil",
    "Mon CV",
    "Messagerie",
    "Cartes : opportunités, visibilité, progression"
  ]
});
addBulletsCard(workerSpace, {
  x: 4.2,
  y: 1.82,
  w: 3.72,
  h: 4.8,
  title: "Socle candidat",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Nom complet",
    "Secteur",
    "Région souhaitée",
    "Métier en pénurie",
    "Expérience",
    "Langues",
    "Description / présentation",
    "Visibilité du profil",
    "Bouton : Enregistrer -> /api/profile",
    "Alimente aussi la vitrine publique /candidatures"
  ]
});
addBulletsCard(workerSpace, {
  x: 8.17,
  y: 1.82,
  w: 3.53,
  h: 4.8,
  title: "CV & interactions",
  fill: C.white,
  lines: [
    "Sections CV : formation, expériences, certificats, compétences",
    "Vue Mes matchs : offres remontées avec score",
    "Le contact employeur reste protégé avant validation",
    "Messagerie ouverte après match confirmé"
  ]
});
addFooter(workerSpace);

const memberViews = pptx.addSlide();
fullBleedBackground(memberViews, C.white);
addSectionBand(memberViews, "VUES MEMBRES & ADMIN");
addHeader(memberViews, "Pages de lecture : public, membre, admin", "Une fois les données produites, le produit les redistribue selon trois niveaux de valeur : visibilité publique, profondeur membre et supervision admin.");
addBulletsCard(memberViews, {
  x: 0.62,
  y: 1.82,
  w: 3.45,
  h: 4.76,
  title: "Public layer",
  fill: C.blueSoft,
  lines: [
    "/offres-d-emploi : vitrine publique des besoins",
    "/candidatures : vitrine publique des profils anonymisés",
    "/base-de-profils : vue réservée au parcours employeur connecté",
    "Les CTA poussent vers inscription / connexion",
    "La version anglaise reprend les mêmes vitrines"
  ]
});
addBulletsCard(memberViews, {
  x: 4.32,
  y: 1.82,
  w: 3.35,
  h: 4.76,
  title: "Operations layer",
  lines: [
    "Cartes de synthèse",
    "Recherche globale",
    "Onglets : Offres, Candidatures, Matchings",
    "Lecture consolidée du flux plateforme",
    "Réservé à l'administratrice"
  ]
});
addBulletsCard(memberViews, {
  x: 7.92,
  y: 1.82,
  w: 3.78,
  h: 4.76,
  title: "Data layer",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "worker_profiles",
    "employer_profiles",
    "employer_members",
    "job_offers",
    "job_applications",
    "matches",
    "conversations",
    "messages",
    "test_feedback"
  ]
});
addFooter(memberViews);

const governance = pptx.addSlide();
fullBleedBackground(governance, C.bg);
addSectionBand(governance, "GOUVERNANCE");
addHeader(governance, "Plateforme et cabinet : deux rôles bien distincts", "L'avantage compétitif repose sur une articulation claire : la plateforme capte et qualifie la demande ; le cabinet intervient ensuite sur les sujets à forte valeur juridique.");
addCard(governance, {
  x: 0.7,
  y: 1.9,
  w: 5.15,
  h: 3.85,
  title: "Plateforme = moteur de croissance",
  fill: C.blueSoft,
  text: "Attirer les employeurs et les talents\nStructurer les profils et les offres\nProduire des matchings et des vues membres\nMontrer des données publiques utiles sans exposer l'identité\nPiloter les flux via /admin"
});
addCard(governance, {
  x: 6.05,
  y: 1.9,
  w: 5.15,
  h: 3.85,
  title: "Cabinet = moteur de sécurisation",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  text: "Permis unique\nDroit au travail\nImmigration économique\nSécurisation du dossier après mise en relation\nTraitement séparé du matching"
});
addBulletsCard(governance, {
  x: 0.7,
  y: 5.98,
  w: 10.5,
  h: 0.92,
  title: "Lecture stratégique",
  fill: C.white,
  lines: [
    "LEXPAT Connect fonctionne comme une couche d'acquisition, de qualification et d'orchestration ; le cabinet ajoute ensuite la couche de sécurisation juridique là où la valeur est la plus forte."
  ]
});
addFooter(governance, "LEXPAT Connect — acquisition, matching, orchestration et relais juridique");

const outputDir = path.join(process.cwd(), "..", "LEXPAT-Connect-assets-source", "exports");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "LEXPAT-Connect-Architecture-Business.pptx");
pptx.writeFile({ fileName: outputPath });
console.log(outputPath);
