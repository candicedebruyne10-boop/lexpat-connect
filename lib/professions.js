import { shortageJobs2026 } from "./shortageJobs2026";

const REGION_LABEL_BY_ID = {
  bruxelles: "Bruxelles-Capitale",
  wallonie: "Wallonie",
  flandre: "Flandre"
};

const REGION_TRANSLATIONS_EN = {
  "Bruxelles-Capitale": "Brussels-Capital Region",
  Wallonie: "Walloon Region",
  Flandre: "Flemish Region"
};

const GROUP_TRANSLATIONS_EN = {
  "Commerce, vente et grande distribution": "Commerce, sales and retail",
  "Comptabilité, finance, assurances, droit et immobilier": "Accounting, finance, insurance, law and real estate",
  "Construction et travaux publics": "Construction and public works",
  Construction: "Construction",
  "Enseignement et formation": "Education and training",
  Horeca: "Hotels, restaurants and cafes",
  "Informatique et télécommunications": "IT and telecommunications",
  "Métiers administratifs": "Administrative professions",
  "Métiers techniques et de l’industrie": "Technical and industrial professions",
  "Santé et action sociale": "Health and social work",
  "Services à la personne, sécurité, nettoyage et recyclage": "Personal services, security, cleaning and recycling",
  "Transports et logistique": "Transport and logistics",
  "Liste régionale": "Regional list",
  "Conduite de véhicules et de machines": "Functions related to driving vehicles and machinery",
  "Entretien de véhicules et de machines": "Functions related to maintaining vehicles and machinery",
  "Installation, montage et entretien d’installations électriques, électroniques et sanitaires":
    "Functions related to installing, assembling, and maintaining electrical, electronic, and sanitary installations",
  "Fonctions relatives aux soins": "Functions related to care",
  "Autres fonctions techniques et de construction": "Other technical and construction functions",
  Autre: "Other"
};

const SECTOR_TRANSLATIONS_EN = {
  "Commerce et vente": "Commerce and sales",
  "Comptabilité, finance et immobilier": "Accounting, finance and real estate",
  "Construction et travaux publics": "Construction and public works",
  "Éducation et formation": "Education and training",
  Horeca: "Hotels, restaurants and cafes",
  "Industrie et maintenance": "Industry and maintenance",
  "Santé et action sociale": "Health and social work",
  "Services à la personne et sécurité": "Personal services and security",
  "Technologies et informatique": "Technology and IT",
  "Transport et logistique": "Transport and logistics",
  "Autre secteur": "Other sector"
};

const JOB_TRANSLATIONS_EN = {
  "Conseiller technico-commercial / Conseillère technico-commerciale": "Technical Sales Advisor",
  "Conseiller technique pour le support à la clientèle / Conseillère technique pour le support à la clientèle": "Technical Advisor for Customer Support",
  "Responsable de rayon produits alimentaires": "Food Department Manager",
  "Analyste financier / Analyste financière": "Financial Analyst",
  "Chef comptable / Cheffe comptable": "Chief Accountant",
  Comptable: "Accountant",
  "Conseiller en assurances / Conseillère en assurances": "Insurance Advisor",
  "Expert-comptable / Experte comptable": "Chartered Accountant",
  "Syndic d’immeubles": "Property Manager",
  "Chargé d’études techniques du bâtiment / Chargée d’études techniques du bâtiment": "Building Technical Researcher",
  "Chef de chantier / Cheffe de chantier": "Site Manager",
  "Coffreur-ferrailleur / Coffreuse-ferrailleuse": "Formwork carpenter / steel fixer",
  "Conducteur de chantier / Conductrice de chantier": "Construction Site Supervisor",
  "Conducteur de grue à tour / Conductrice de grue à tour": "Tower crane operator",
  "Conducteur de grue mobile / Conductrice de grue mobile": "Mobile crane operator",
  "Conducteur d’engins de chantier / Conductrice d’engins de chantier": "Construction equipment operator",
  "Couvreur de toits inclinés / Couvreuse de toits inclinés": "Pitched roof roofer",
  "Couvreur de toits plats / Couvreuse de toits plats": "Flat roof roofer",
  "Électricien installateur industriel / Électricienne installatrice industrielle": "Industrial electrician installer",
  "Électricien installateur résidentiel / Électricienne installatrice résidentielle": "Residential electrician installer",
  "Installateur de réseaux de communication de données / Installatrice de réseaux de communication de données": "Communications network technician",
  "Maçon / Maçonne": "Bricklayer",
  "Menuisier d’extérieur / Menuisière d’extérieur": "Exterior construction carpenter",
  "Menuisier d’intérieur / Menuisière d’intérieur": "Interior construction carpenter",
  "Métreur / Métreuse": "Quantity Surveyor",
  "Ouvrier de voirie / Ouvrière de voirie": "Road construction worker",
  "Responsable de l’entretien des bâtiments et infrastructures": "Building and Infrastructure Maintenance Manager",
  "Technicien de maintenance de brûleurs / Technicienne de maintenance de brûleurs": "Heating system maintenance technician",
  "Technicien de maintenance en systèmes de chauffage / Technicienne de maintenance en systèmes de chauffage": "Heating systems maintenance technician",
  "Coordinateur pédagogique / Coordinatrice pédagogique": "Educational coordinator",
  "Éducateur dans un établissement scolaire / Éducatrice dans un établissement scolaire": "Educator in a school",
  "Enseignant dans l’enseignement secondaire / Enseignante dans l’enseignement secondaire": "Secondary school teacher",
  "Enseignant dans l’enseignement maternel ou primaire / Enseignante dans l’enseignement maternel ou primaire": "Nursery or primary school teacher",
  "Formateur pour adultes / Formatrice pour adultes": "Adult trainer",
  "Moniteur d’auto-école / Monitrice d’auto-école": "Driving instructor",
  "Assistant de direction d’hôtel-restaurant / Assistante de direction d’hôtel-restaurant": "Hotel and restaurant management assistant",
  "Analyste-développeur TIC / Analyste-développeuse TIC": "ICT analyst-developer",
  "Business Analyst TIC": "ICT business analyst",
  "Responsable de département informatique": "IT Department Manager",
  "Assistant de direction / Assistante de direction": "Executive Assistant",
  "Manager des ressources humaines / Manageuse des ressources humaines": "Human Resources Manager",
  "Dessinateur-concepteur en électricité et électronique / Dessinatrice-conceptrice en électricité et électronique": "Electrical and electronic design draughtsperson",
  "Dessinateur-concepteur mécanique / Dessinatrice-conceptrice mécanique": "Mechanical design draughtsperson",
  "Électricien de maintenance / Électricienne de maintenance": "Maintenance electrician",
  "Expert en sécurité, hygiène et environnement / Experte en sécurité, hygiène et environnement": "Safety, health and environment expert",
  "Inspecteur de conformité / Inspectrice de conformité": "Compliance inspector",
  "Installateur d’ascenseurs / Installatrice d’ascenseurs": "Elevator installer",
  "Mécanicien de maintenance / Mécanicienne de maintenance": "Maintenance mechanic",
  "Responsable contrôle qualité en industrie": "Quality control manager in industry",
  "Responsable de maintenance industrielle": "Industrial maintenance manager",
  "Responsable des méthodes de production et de l’industrialisation": "Production Methods and Industrialisation Manager",
  "Responsable du planning et de la gestion de la production": "Production Planning and Management Manager",
  "Technicien de maintenance d’ascenseurs / Technicienne de maintenance d’ascenseurs": "Elevator maintenance technician",
  "Technicien de maintenance en équipements industriels / Technicienne de maintenance en équipements industriels": "Industrial equipment maintenance technician",
  "Technicien en automatisation industrielle / Technicienne en automatisation industrielle": "Industrial automation technician",
  "Technicien en froid et climatisation / Technicienne en froid et climatisation": "Refrigeration and air-conditioning technician",
  "Technicien en sécurité, hygiène et environnement / Technicienne en sécurité, hygiène et environnement": "Safety, health and environment technician",
  "Aide-soignant / Aide-soignante": "Healthcare assistant",
  "Ambulancier-secouriste / Ambulancière-secouriste": "Paramedic",
  "Assistant social / Assistante sociale": "Social worker",
  "Conseiller emploi / Conseillère emploi": "Employment advisor",
  "Conseiller en aide sociale / Conseillère en aide sociale": "Social welfare advisor",
  "Éducateur-accompagnateur / Éducatrice-accompagnatrice": "Educator-accompanist",
  Ergothérapeute: "Occupational therapist",
  "Infirmier / Infirmière": "Nurse",
  "Infirmier en chef / Infirmière en chef": "Head nurse",
  "Infirmier social / Infirmière sociale": "Social nurse",
  "Infirmier spécialisé au bloc opératoire / Infirmière spécialisée au bloc opératoire": "Operating theatre nurse",
  "Infirmier spécialisé en pédiatrie / Infirmière spécialisée en pédiatrie": "Paediatric nurse",
  Logopède: "Speech therapist",
  Médecin: "Doctor",
  "Moniteur-animateur dans l’économie sociale / Monitrice-animatrice dans l’économie sociale": "Instructor-facilitator in the social economy",
  "Pharmacien / Pharmacienne": "Pharmacist",
  "Puériculteur / Puéricultrice": "Childcare worker",
  "Responsable de garderie": "Daycare manager",
  "Technologue de laboratoire médical": "Medical laboratory technologist",
  "Technologue en imagerie médicale": "Medical imaging technologist",
  "Agent de gardiennage / Agente de gardiennage": "Security guard",
  "Agent de la sécurité publique / Agente de la sécurité publique": "Public security officer",
  "Acheteur / Acheteuse": "Purchaser",
  "Conducteur d’autobus / Conductrice d’autobus": "Bus driver",
  "Conducteur de camion avec remorque / Conductrice de camion avec remorque": "Truck driver with trailer",
  "Conducteur de poids lourd multibennes / Conductrice de poids lourd multibennes": "Multi-skip truck driver",
  "Responsable des achats": "Head of procurement",
  "Conducteur / Conductrice de chantier": "Construction Site Supervisor",
  "Monteur / Monteuse de structures métalliques lourdes": "Heavy steel structure assembler",
  "Installateur / Installatrice sanitaire": "Sanitary installer (plumber)",
  "Monteur / Monteuse d’installations de chauffage central": "Central heating installer",
  "Menuisier / Menuisière de chantier d’extérieur": "Exterior construction carpenter",
  "Menuisier / Menuisière de chantier d’intérieur": "Interior construction carpenter",
  "Carreleur / Carreleuse": "Tiler",
  "Couvreur / Couvreuse de toits inclinés": "Pitched roof roofer",
  "Maçon / Maçonne qualifiée": "Qualified bricklayer / mason",
  "Poseur / Poseuse de conduites d’eaux": "Water pipe layer",
  "Chef / Cheffe de partie": "Chef de partie",
  "Technicien / Technicienne en processus et méthodes de production": "Production process and methods technician",
  "Conducteur / Conductrice d’installation en industrie chimique": "Chemical plant operator",
  "Conducteur / Conductrice de machine de fabrication de produits textiles": "Textile manufacturing machine operator",
  "Chef / Cheffe d'équipe en industrie de production": "Production team leader",
  "Tôlier industriel / Tôlière industrielle": "Industrial sheet metal worker",
  "Régleur-opérateur / Régleuse-opératrice machines-outils CN": "CNC machine tool setter-operator",
  "Régleur-opérateur / Régleuse-opératrice machines-outils conventionnelles": "Conventional machine tool setter-operator",
  "Assembleur / Assembleuse d'éléments de structure métallique": "Metal structure assembler",
  "Soudeur / Soudeuse TIG": "TIG welder",
  "Tuyauteur / Tuyauteuse": "Pipe fitter",
  "Électromécanicien / Électromécanicienne de maintenance industrielle": "Industrial maintenance electromechanic",
  "Technicien / Technicienne de maintenance en électronique industrielle": "Industrial electronics maintenance technician",
  "Technicien / Technicienne en froid et climatisation": "Refrigeration and air-conditioning technician",
  "Technicien / Technicienne de réseaux de communication et en système de sécurité": "Communication networks and security systems technician",
  "Technicien / Technicienne de maintenance en système de chauffage": "Heating systems maintenance technician",
  "Électricien / Électricienne de maintenance": "Maintenance electrician",
  "Mécanicien / Mécanicienne de maintenance": "Maintenance mechanic",
  "Mécanicien / Mécanicienne de maintenance d’engins de chantier, agricoles et levage": "Construction, agricultural and lifting equipment maintenance mechanic",
  "Mécanicien / Mécanicienne pour camions et véhicules utilitaires lourds (+ 3,5T)": "Heavy truck and commercial vehicle mechanic (+3.5T)",
  "Mécanicien / Mécanicienne pour voitures et véhicules légers (- 3,5T)": "Car and light vehicle mechanic (-3.5T)",
  "Technicien / Technicienne automobile": "Automotive technician",
  "Tôlier / Tôlière en carrosserie": "Bodywork sheet metal worker",
  "Préparateur / Préparatrice en carrosserie": "Bodywork preparer",
  "Peintre en carrosserie": "Bodywork painter",
  "Matelot dans la navigation intérieure": "Inland waterways sailor (deckhand)",
  "Conducteur / Conductrice de poids-lourd permis C": "Heavy truck driver - Category C license",
  "Conducteur / Conductrice de poids-lourd permis CE - multibennes": "Heavy truck driver - Category CE license (skip loader / multi-skip)",
  "Conducteur / Conductrice de poids-lourd permis CE": "Heavy truck driver - Category CE license",
  "Conducteur / Conductrice d’autocar": "Coach driver",
  "Enseignant, dans les limites de la liste des fonctions en pénurie de main-d’œuvre dans l’enseignement établie par la Communauté française": "Teacher (within the shortage occupation list for teaching established by the French Community)",
  "Conducteur d'engins de terrassement": "Earthmoving machinery operator",
  "Batelier-pilote de navigation intérieure / Matelot de navigation intérieure": "Inland waterway skipper-mate / inland waterway deckhand",
  "Mécanicien de maintenance de véhicules utilitaires lourds": "Maintenance mechanic of heavy commercial vehicles",
  "Technicien de voitures particulières et de véhicules utilitaires légers": "Passenger car and light commercial vehicle technician",
  "Technicien de machines de chantier, agricoles et de levage": "Construction, agricultural and lifting machinery technician",
  "Préparateur / Tôlier en carrosserie": "Bodywork prepper / panel beater",
  "Électrotechnicien et mécanicien": "Electrotechnician and mechanic",
  "Monteur en techniques d'installation": "Installation techniques fitter",
  "Technicien frigoriste": "Refrigeration technician",
  Tuyauteur: "Pipefitter",
  "Technicien de communication de données et de réseaux": "Data communication and network technician",
  "Aide-soignant": "Healthcare assistant",
  "Aide à domicile": "Caregiver",
  "Régleur-opérateur en tôlerie / usinage": "Sheet metal / machining setter-operator",
  "Coffreur-bétonneur": "Formworker-concrete worker",
  Maçon: "Mason",
  "Calculateur construction / préparateur de travaux": "Construction estimator / work preparer",
  Couvreur: "Roofer",
  "Opérateur de processus industrie chimique": "Chemical industry process operator",
  Désamianteur: "Asbestos remover",
  Diamantaire: "Diamond worker",
  "Autre profession": "Other occupation"
};

function normalizeGroupToSector(groupTitle) {
  const label = String(groupTitle || "").toLowerCase();

  if (label.includes("sant") || label.includes("social")) return "Santé et action sociale";
  if (label.includes("construction") || label.includes("bâtiment") || label.includes("voirie")) return "Construction et travaux publics";
  if (label.includes("transport") || label.includes("logistique") || label.includes("navigation")) return "Transport et logistique";
  if (label.includes("industrie") || label.includes("technique") || label.includes("maintenance") || label.includes("automatisation")) return "Industrie et maintenance";
  if (label.includes("informatique") || label.includes("tic") || label.includes("telecommunication") || label.includes("numérique")) return "Technologies et informatique";
  if (label.includes("enseignement") || label.includes("formation") || label.includes("pedagog")) return "Éducation et formation";
  if (label.includes("commerce") || label.includes("vente") || label.includes("distribution")) return "Commerce et vente";
  if (label.includes("comptabil") || label.includes("finance") || label.includes("assurance") || label.includes("immobilier") || label.includes("droit")) {
    return "Comptabilité, finance et immobilier";
  }
  if (label.includes("horeca")) return "Horeca";
  if (label.includes("service") || label.includes("sécurité") || label.includes("securite") || label.includes("nettoyage")) {
    return "Services à la personne et sécurité";
  }

  return groupTitle;
}

function buildRegionData() {
  return shortageJobs2026.map((region) => {
    const label = REGION_LABEL_BY_ID[region.id] || region.label;
    const groups = region.groups.map((group) => ({
      label: group.title,
      options: group.jobs
    }));

    const flatJobs = region.groups.flatMap((group) => group.jobs);
    const sectorMap = Object.fromEntries(
      region.groups.flatMap((group) =>
        group.jobs.map((job) => [job, normalizeGroupToSector(group.title)])
      )
    );

    return {
      id: region.id,
      label,
      groups: [...groups, { label: "Autre", options: ["Autre profession"] }],
      flatJobs: [...flatJobs, "Autre profession"],
      sectorMap
    };
  });
}

const regionData = buildRegionData();

export const coreRegionOptions = ["Bruxelles-Capitale", "Wallonie", "Flandre"];

export const groupedProfessionOptions = regionData.map((region) => ({
  label: region.label,
  options: region.flatJobs
}));

export const groupedProfessionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.groups])
);

export const professionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.flatJobs])
);

export const professionSectorByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.sectorMap])
);

export const sectorOptions = [
  "Commerce et vente",
  "Comptabilité, finance et immobilier",
  "Construction et travaux publics",
  "Éducation et formation",
  "Horeca",
  "Industrie et maintenance",
  "Santé et action sociale",
  "Services à la personne et sécurité",
  "Technologies et informatique",
  "Transport et logistique",
  "Autre secteur"
];

export function translateRegionLabel(label, locale = "fr") {
  if (locale !== "en") return label;
  return REGION_TRANSLATIONS_EN[label] || label;
}

export function translateGroupTitle(label, locale = "fr") {
  if (locale !== "en") return label;
  return GROUP_TRANSLATIONS_EN[label] || label;
}

export function translateSectorLabel(label, locale = "fr") {
  if (locale !== "en") return label;
  return SECTOR_TRANSLATIONS_EN[label] || label;
}

export function translateProfessionLabel(label, locale = "fr") {
  if (locale !== "en") return label;
  return JOB_TRANSLATIONS_EN[label] || label;
}

export function getSectorOptions(locale = "fr") {
  return sectorOptions.map((option) => ({
    value: option,
    label: translateSectorLabel(option, locale)
  }));
}

export const workerRegionOptions = [...coreRegionOptions, "Toute la Belgique"];
export const employerRegionOptions = [...coreRegionOptions, "Plusieurs régions"];

export function parseRegionSelection(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  const normalized = String(value || "").trim();
  if (!normalized) return [];
  if (normalized === "Toute la Belgique" || normalized === "Plusieurs régions") {
    return coreRegionOptions;
  }

  if (normalized.includes("|")) {
    return normalized.split("|").map((item) => item.trim()).filter(Boolean);
  }

  if (normalized.includes(",")) {
    return normalized.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [normalized];
}

export function stringifyRegionSelection(value, fallbackLabel = "Plusieurs régions") {
  const selections = parseRegionSelection(value);

  if (!selections.length) return "";
  if (selections.length === 1) return selections[0];
  if (selections.length === coreRegionOptions.length) {
    return fallbackLabel;
  }

  return selections.join(" | ");
}

export function getProfessionGroupsForRegions(value, locale = "fr") {
  const selections = parseRegionSelection(value);
  if (!selections.length) return [];

  const groupsMap = new Map();

  selections.forEach((regionLabel) => {
    const regionGroups = groupedProfessionOptionsByRegion[regionLabel] || [];
    regionGroups.forEach((group) => {
      const current = groupsMap.get(group.label) || new Set();
      group.options.forEach((option) => current.add(option));
      groupsMap.set(group.label, current);
    });
  });

  return Array.from(groupsMap.entries()).map(([label, options]) => ({
    label: translateGroupTitle(label, locale),
    options: Array.from(options).map((option) => ({
      value: option,
      label: translateProfessionLabel(option, locale)
    }))
  }));
}

export function findSectorForProfession(regionLabel, professionLabel) {
  if (!regionLabel || !professionLabel || professionLabel === "Autre profession") {
    return "";
  }

  const selections = parseRegionSelection(regionLabel);

  for (const selectedRegion of selections) {
    const derived = professionSectorByRegion[selectedRegion]?.[professionLabel];
    if (derived) return derived;
  }

  return "";
}
