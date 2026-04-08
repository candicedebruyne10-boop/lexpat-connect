const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "LEXPAT Connect";
pptx.subject = "Partner overview";
pptx.title = "LEXPAT Connect — Partner Overview";
pptx.lang = "fr-BE";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "fr-BE"
};

const C = {
  navy: "1E2F86",
  navyDark: "102347",
  teal: "57B7AF",
  tealDark: "2B8F88",
  ink: "0F172A",
  slate: "5F7086",
  line: "DCE6EF",
  white: "FFFFFF",
  blueSoft: "EEF4FF",
  tealSoft: "ECFAF8",
  sandSoft: "FFF7E8",
  bg: "F8FBFF",
  greenSoft: "F0FDF8"
};

function bg(slide, color = C.white) {
  slide.background = { color };
}

function footer(slide, label = "LEXPAT Connect — overview partenaire") {
  slide.addText(label, {
    x: 0.6,
    y: 6.78,
    w: 6,
    h: 0.14,
    fontSize: 8.5,
    color: C.slate,
    margin: 0
  });
}

function header(slide, kicker, title, text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 0.36,
    w: 2.25,
    h: 0.34,
    rectRadius: 0.08,
    line: { color: C.blueSoft, transparency: 100 },
    fill: { color: C.blueSoft }
  });
  slide.addText(kicker, {
    x: 0.74,
    y: 0.45,
    w: 1.95,
    h: 0.1,
    fontSize: 8.5,
    bold: true,
    color: C.navy,
    align: "center",
    margin: 0
  });
  slide.addText(title, {
    x: 0.58,
    y: 0.9,
    w: 10.7,
    h: 0.72,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0
  });
  slide.addText(text, {
    x: 0.6,
    y: 1.6,
    w: 10.4,
    h: 0.56,
    fontSize: 11,
    color: C.slate,
    margin: 0
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6,
    y: 0.8,
    w: 11.1,
    h: 0,
    line: { color: C.line, pt: 1 }
  });
}

function metric(slide, x, y, w, label, value, tone = "blue") {
  const fill = tone === "teal" ? C.tealSoft : tone === "sand" ? C.sandSoft : C.blueSoft;
  const color = tone === "teal" ? C.tealDark : tone === "sand" ? "B7791F" : C.navy;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 1.15,
    rectRadius: 0.08,
    line: { color: fill, transparency: 100 },
    fill: { color: fill }
  });
  slide.addText(label, {
    x: x + 0.18, y: y + 0.18, w: w - 0.36, h: 0.18,
    fontSize: 9, bold: true, color, margin: 0
  });
  slide.addText(String(value), {
    x: x + 0.18, y: y + 0.46, w: w - 0.36, h: 0.34,
    fontFace: "Aptos Display", fontSize: 22, bold: true, color: C.ink, margin: 0
  });
}

function card(slide, { x, y, w, h, title, text, fill = C.white, titleColor = C.navy }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    line: { color: C.line, pt: 1 },
    fill: { color: fill },
    shadow: { type: "outer", color: "CBD5E1", angle: 45, blur: 1, distance: 1, opacity: 0.1 }
  });
  slide.addText(title, {
    x: x + 0.22, y: y + 0.18, w: w - 0.44, h: 0.36,
    fontFace: "Aptos Display", fontSize: 15, bold: true, color: titleColor, margin: 0
  });
  slide.addText(text, {
    x: x + 0.22, y: y + 0.62, w: w - 0.44, h: h - 0.8,
    fontSize: 10.5, color: C.slate, margin: 0
  });
}

function bullets(slide, { x, y, w, h, title, lines, fill = C.white, titleColor = C.navy }) {
  card(slide, { x, y, w, h, title, text: "", fill, titleColor });
  slide.addText(
    lines.map((line) => ({ text: line, options: { bullet: { indent: 10 } } })),
    {
      x: x + 0.22,
      y: y + 0.62,
      w: w - 0.4,
      h: h - 0.8,
      fontSize: 10.5,
      color: C.slate,
      margin: 0.02,
      paraSpaceAfterPt: 7
    }
  );
}

const cover = pptx.addSlide();
bg(cover, C.bg);
cover.addText("LEXPAT", {
  x: 0.72, y: 0.82, w: 5.2, h: 0.8,
  fontFace: "Aptos Display", fontSize: 36, bold: true, color: C.navy, margin: 0
});
cover.addText("Connect", {
  x: 0.72, y: 1.58, w: 4.4, h: 0.9,
  fontSize: 32, color: C.teal, margin: 0
});
cover.addText("Overview partenaire / investisseur", {
  x: 0.74, y: 3.02, w: 6.1, h: 0.42,
  fontSize: 18, bold: true, color: C.ink, margin: 0
});
cover.addText(
  "Comment la plateforme attire, qualifie et active employeurs et talents, avant relais juridique à forte valeur.",
  {
    x: 0.74, y: 3.48, w: 6.2, h: 0.7,
    fontSize: 11.5, color: C.slate, margin: 0
  }
);
cover.addShape(pptx.ShapeType.roundRect, {
  x: 7.0, y: 0.72, w: 4.8, h: 5.8,
  rectRadius: 0.12,
  line: { color: C.line, pt: 1 },
  fill: { color: C.white }
});
cover.addShape(pptx.ShapeType.rect, {
  x: 7.0, y: 0.72, w: 4.8, h: 1.24,
  line: { color: C.navyDark, transparency: 100 },
  fill: { color: C.navyDark }
});
cover.addText("Pourquoi c'est intéressant", {
  x: 7.32, y: 1.05, w: 3.8, h: 0.2,
  fontSize: 14, bold: true, color: C.white, margin: 0
});
metric(cover, 7.36, 1.76, 1.95, "Funnels", 2, "blue");
metric(cover, 9.45, 1.76, 1.95, "Public views", 3, "teal");
metric(cover, 7.36, 3.08, 1.95, "Member spaces", 2, "sand");
metric(cover, 9.45, 3.08, 1.95, "Data core", 9, "blue");
bullets(cover, {
  x: 7.34, y: 4.34, w: 4.06, h: 1.7, title: "Thèse",
  fill: C.blueSoft,
  lines: [
    "Le matching crée l'intérêt",
    "La donnée crée la continuité",
    "Le juridique monétise la complexité"
  ]
});
footer(cover);

const value = pptx.addSlide();
bg(value, C.white);
header(value, "POSITIONNEMENT", "La plateforme répond à un double problème", "Les employeurs peinent à identifier rapidement des talents internationaux pertinents. Les travailleurs ont du mal à se rendre lisibles et crédibles pour le marché belge.");
card(value, {
  x: 0.62, y: 2.02, w: 3.45, h: 3.9,
  title: "Côté employeur",
  fill: C.blueSoft,
  text: "Accéder à des profils déjà structurés\nVoir rapidement secteurs, régions, expérience et langues\nEntrer en relation seulement quand le matching est confirmé"
});
card(value, {
  x: 4.28, y: 2.02, w: 3.45, h: 3.9,
  title: "Côté travailleur",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  text: "Rendre un profil compréhensible pour un recruteur belge\nSe positionner sur les métiers en pénurie\nAccéder à des opportunités concrètes avant toute étape juridique"
});
card(value, {
  x: 7.94, y: 2.02, w: 3.45, h: 3.9,
  title: "Côté cabinet",
  fill: C.greenSoft,
  titleColor: C.tealDark,
  text: "Intervenir plus tard, sur les dossiers où la complexité juridique est réelle\nSéparer clairement la plateforme de matching du traitement juridique\nCréer un relais à forte valeur et à forte confiance"
});
footer(value);

const model = pptx.addSlide();
bg(model, C.bg);
header(model, "BUSINESS MODEL", "Une mécanique simple : acquisition, activation, conversion", "Le site n'est pas seulement une vitrine. Il fonctionne comme une machine de capture et d'orchestration qui prépare ensuite des mises en relation et des dossiers à valeur ajoutée.");
bullets(model, {
  x: 0.62, y: 2.02, w: 3.3, h: 4.1,
  title: "1. Acquisition",
  fill: C.white,
  lines: [
    "Homepage premium",
    "Pages employeurs et travailleurs",
    "Simulateur d'éligibilité",
    "Vitrines publiques d'offres et candidatures"
  ]
});
bullets(model, {
  x: 4.18, y: 2.02, w: 3.3, h: 4.1,
  title: "2. Activation",
  fill: C.blueSoft,
  lines: [
    "Formulaires publics",
    "Création de compte",
    "Espaces membres différenciés",
    "Matching automatique"
  ]
});
bullets(model, {
  x: 7.74, y: 2.02, w: 3.58, h: 4.1,
  title: "3. Conversion à valeur",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Messagerie après match confirmé",
    "Mise en relation qualifiée",
    "Relais cabinet sur permis unique / droit au travail",
    "Pilotage global via l'admin"
  ]
});
footer(model);

const moat = pptx.addSlide();
bg(moat, C.white);
header(moat, "AVANTAGE STRUCTUREL", "Ce qui rend le modèle intéressant", "La valeur ne vient pas d'un seul écran, mais de l'enchaînement cohérent entre visibilité publique, profondeur membre, data structurée et séparation nette du juridique.");
bullets(moat, {
  x: 0.62, y: 2.02, w: 3.45, h: 4.2,
  title: "Produit",
  fill: C.blueSoft,
  lines: [
    "Double funnel employeur / travailleur",
    "Pages publiques qui réduisent la friction",
    "Expérience membre plus riche après connexion"
  ]
});
bullets(moat, {
  x: 4.28, y: 2.02, w: 3.45, h: 4.2,
  title: "Donnée",
  fill: C.white,
  lines: [
    "Profils, offres, candidatures, matches, conversations, messages",
    "Réutilisation de la donnée dans plusieurs vues",
    "Lecture admin consolidée"
  ]
});
bullets(moat, {
  x: 7.94, y: 2.02, w: 3.45, h: 4.2,
  title: "Confiance",
  fill: C.tealSoft,
  titleColor: C.tealDark,
  lines: [
    "Candidatures anonymisées publiquement",
    "Messagerie seulement après validation",
    "Cabinet distinct, activé ensuite"
  ]
});
footer(moat);

const close = pptx.addSlide();
bg(close, C.bg);
header(close, "LECTURE FINALE", "LEXPAT Connect est une couche d'orchestration", "La plateforme capte, qualifie et orchestre la relation. Le cabinet intervient ensuite sur la partie complexe. Cette séparation rend le modèle plus clair, plus crédible et plus extensible.");
card(close, {
  x: 0.8, y: 2.2, w: 10.2, h: 2.3,
  title: "En une phrase",
  fill: C.white,
  text: "LEXPAT Connect combine acquisition ciblée, matching structuré, messagerie contrôlée et relais juridique à forte valeur, dans un même système lisible."
});
bullets(close, {
  x: 0.8, y: 4.8, w: 10.2, h: 1.45,
  title: "Ce qu'un partenaire doit retenir",
  fill: C.blueSoft,
  lines: [
    "Le produit est déjà structuré comme une machine de conversion, pas comme un simple site vitrine.",
    "La donnée accumulée devient un actif produit, relationnel et opérationnel.",
    "Le relais juridique s'active là où la valeur économique et la confiance sont les plus fortes."
  ]
});
footer(close, "LEXPAT Connect — partner & investor overview");

const outputDir = path.join(process.cwd(), "..", "LEXPAT-Connect-assets-source", "exports");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "LEXPAT-Connect-Partner-Overview.pptx");
pptx.writeFile({ fileName: outputPath });
console.log(outputPath);
