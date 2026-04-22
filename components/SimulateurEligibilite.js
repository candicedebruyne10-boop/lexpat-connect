"use client";

import { useState } from "react";
import RegionSelector from "./RegionSelector";
import {
  getProfessionGroupsForRegions,
  parseRegionSelection,
  sectorOptions,
} from "../lib/professions";

/* ── Nationalités UE / EEE / Suisse (noms FR — valeurs canoniques) ──────── */
const EU_NATIONALITIES = new Set([
  "Allemagne","Autriche","Belgique","Bulgarie","Chypre","Croatie","Danemark",
  "Espagne","Estonie","Finlande","France","Grèce","Hongrie","Irlande","Italie",
  "Lettonie","Lituanie","Luxembourg","Malte","Pays-Bas","Pologne","Portugal",
  "République tchèque","Roumanie","Slovaquie","Slovénie","Suède",
  "Islande","Liechtenstein","Norvège","Suisse",
  // Royaume-Uni : post-Brexit, les ressortissants britanniques ont besoin d'un permis
  // en Belgique. Laissé hors de l'exemption UE/EEE.
]);

/* ── Liste complète des pays (valeur = nom FR, affichage bilingue) ────────── */
// value stockée = toujours le nom FR (pour compatibilité EU_NATIONALITIES check)
// affichage = nom FR ou EN selon locale
const COUNTRIES = [
  { fr: "Afghanistan",              en: "Afghanistan" },
  { fr: "Afrique du Sud",           en: "South Africa" },
  { fr: "Albanie",                  en: "Albania" },
  { fr: "Algérie",                  en: "Algeria" },
  { fr: "Allemagne",                en: "Germany" },
  { fr: "Andorre",                  en: "Andorra" },
  { fr: "Angola",                   en: "Angola" },
  { fr: "Antigua-et-Barbuda",       en: "Antigua and Barbuda" },
  { fr: "Arabie saoudite",          en: "Saudi Arabia" },
  { fr: "Argentine",                en: "Argentina" },
  { fr: "Arménie",                  en: "Armenia" },
  { fr: "Australie",                en: "Australia" },
  { fr: "Autriche",                 en: "Austria" },
  { fr: "Azerbaïdjan",              en: "Azerbaijan" },
  { fr: "Bahamas",                  en: "Bahamas" },
  { fr: "Bahreïn",                  en: "Bahrain" },
  { fr: "Bangladesh",               en: "Bangladesh" },
  { fr: "Barbade",                  en: "Barbados" },
  { fr: "Belgique",                 en: "Belgium" },
  { fr: "Belize",                   en: "Belize" },
  { fr: "Bénin",                    en: "Benin" },
  { fr: "Bhoutan",                  en: "Bhutan" },
  { fr: "Biélorussie",              en: "Belarus" },
  { fr: "Bolivie",                  en: "Bolivia" },
  { fr: "Bosnie-Herzégovine",       en: "Bosnia and Herzegovina" },
  { fr: "Botswana",                 en: "Botswana" },
  { fr: "Brésil",                   en: "Brazil" },
  { fr: "Brunéi",                   en: "Brunei" },
  { fr: "Bulgarie",                 en: "Bulgaria" },
  { fr: "Burkina Faso",             en: "Burkina Faso" },
  { fr: "Burundi",                  en: "Burundi" },
  { fr: "Cambodge",                 en: "Cambodia" },
  { fr: "Cameroun",                 en: "Cameroon" },
  { fr: "Canada",                   en: "Canada" },
  { fr: "Cap-Vert",                 en: "Cape Verde" },
  { fr: "Chili",                    en: "Chile" },
  { fr: "Chine",                    en: "China" },
  { fr: "Chypre",                   en: "Cyprus" },
  { fr: "Colombie",                 en: "Colombia" },
  { fr: "Comores",                  en: "Comoros" },
  { fr: "Congo (RDC)",              en: "Congo (DRC)" },
  { fr: "Congo (Rép.)",             en: "Congo (Republic)" },
  { fr: "Corée du Nord",            en: "North Korea" },
  { fr: "Corée du Sud",             en: "South Korea" },
  { fr: "Costa Rica",               en: "Costa Rica" },
  { fr: "Côte d'Ivoire",            en: "Ivory Coast" },
  { fr: "Croatie",                  en: "Croatia" },
  { fr: "Cuba",                     en: "Cuba" },
  { fr: "Danemark",                 en: "Denmark" },
  { fr: "Djibouti",                 en: "Djibouti" },
  { fr: "Dominique",                en: "Dominica" },
  { fr: "Égypte",                   en: "Egypt" },
  { fr: "Émirats arabes unis",      en: "United Arab Emirates" },
  { fr: "Équateur",                 en: "Ecuador" },
  { fr: "Érythrée",                 en: "Eritrea" },
  { fr: "Espagne",                  en: "Spain" },
  { fr: "Eswatini",                 en: "Eswatini" },
  { fr: "Estonie",                  en: "Estonia" },
  { fr: "États-Unis",               en: "United States" },
  { fr: "Éthiopie",                 en: "Ethiopia" },
  { fr: "Fidji",                    en: "Fiji" },
  { fr: "Finlande",                 en: "Finland" },
  { fr: "France",                   en: "France" },
  { fr: "Gabon",                    en: "Gabon" },
  { fr: "Gambie",                   en: "Gambia" },
  { fr: "Géorgie",                  en: "Georgia" },
  { fr: "Ghana",                    en: "Ghana" },
  { fr: "Grèce",                    en: "Greece" },
  { fr: "Grenade",                  en: "Grenada" },
  { fr: "Guatemala",                en: "Guatemala" },
  { fr: "Guinée",                   en: "Guinea" },
  { fr: "Guinée-Bissau",            en: "Guinea-Bissau" },
  { fr: "Guinée équatoriale",       en: "Equatorial Guinea" },
  { fr: "Guyana",                   en: "Guyana" },
  { fr: "Haïti",                    en: "Haiti" },
  { fr: "Honduras",                 en: "Honduras" },
  { fr: "Hongrie",                  en: "Hungary" },
  { fr: "Îles Marshall",            en: "Marshall Islands" },
  { fr: "Îles Salomon",             en: "Solomon Islands" },
  { fr: "Inde",                     en: "India" },
  { fr: "Indonésie",                en: "Indonesia" },
  { fr: "Irak",                     en: "Iraq" },
  { fr: "Iran",                     en: "Iran" },
  { fr: "Irlande",                  en: "Ireland" },
  { fr: "Islande",                  en: "Iceland" },
  { fr: "Israël",                   en: "Israel" },
  { fr: "Italie",                   en: "Italy" },
  { fr: "Jamaïque",                 en: "Jamaica" },
  { fr: "Japon",                    en: "Japan" },
  { fr: "Jordanie",                 en: "Jordan" },
  { fr: "Kazakhstan",               en: "Kazakhstan" },
  { fr: "Kenya",                    en: "Kenya" },
  { fr: "Kirghizstan",              en: "Kyrgyzstan" },
  { fr: "Kiribati",                 en: "Kiribati" },
  { fr: "Kosovo",                   en: "Kosovo" },
  { fr: "Koweït",                   en: "Kuwait" },
  { fr: "Laos",                     en: "Laos" },
  { fr: "Lesotho",                  en: "Lesotho" },
  { fr: "Lettonie",                 en: "Latvia" },
  { fr: "Liban",                    en: "Lebanon" },
  { fr: "Libéria",                  en: "Liberia" },
  { fr: "Liechtenstein",            en: "Liechtenstein" },
  { fr: "Libye",                    en: "Libya" },
  { fr: "Lituanie",                 en: "Lithuania" },
  { fr: "Luxembourg",               en: "Luxembourg" },
  { fr: "Macédoine du Nord",        en: "North Macedonia" },
  { fr: "Madagascar",               en: "Madagascar" },
  { fr: "Malaisie",                 en: "Malaysia" },
  { fr: "Malawi",                   en: "Malawi" },
  { fr: "Maldives",                 en: "Maldives" },
  { fr: "Mali",                     en: "Mali" },
  { fr: "Malte",                    en: "Malta" },
  { fr: "Maroc",                    en: "Morocco" },
  { fr: "Maurice",                  en: "Mauritius" },
  { fr: "Mauritanie",               en: "Mauritania" },
  { fr: "Mexique",                  en: "Mexico" },
  { fr: "Micronésie",               en: "Micronesia" },
  { fr: "Moldavie",                 en: "Moldova" },
  { fr: "Monaco",                   en: "Monaco" },
  { fr: "Mongolie",                 en: "Mongolia" },
  { fr: "Monténégro",               en: "Montenegro" },
  { fr: "Mozambique",               en: "Mozambique" },
  { fr: "Myanmar",                  en: "Myanmar" },
  { fr: "Namibie",                  en: "Namibia" },
  { fr: "Nauru",                    en: "Nauru" },
  { fr: "Népal",                    en: "Nepal" },
  { fr: "Nicaragua",                en: "Nicaragua" },
  { fr: "Niger",                    en: "Niger" },
  { fr: "Nigeria",                  en: "Nigeria" },
  { fr: "Norvège",                  en: "Norway" },
  { fr: "Nouvelle-Zélande",         en: "New Zealand" },
  { fr: "Oman",                     en: "Oman" },
  { fr: "Ouganda",                  en: "Uganda" },
  { fr: "Ouzbékistan",              en: "Uzbekistan" },
  { fr: "Pakistan",                 en: "Pakistan" },
  { fr: "Palaos",                   en: "Palau" },
  { fr: "Palestine",                en: "Palestine" },
  { fr: "Panama",                   en: "Panama" },
  { fr: "Papouasie-Nouvelle-Guinée",en: "Papua New Guinea" },
  { fr: "Paraguay",                 en: "Paraguay" },
  { fr: "Pays-Bas",                 en: "Netherlands" },
  { fr: "Pérou",                    en: "Peru" },
  { fr: "Philippines",              en: "Philippines" },
  { fr: "Pologne",                  en: "Poland" },
  { fr: "Portugal",                 en: "Portugal" },
  { fr: "Qatar",                    en: "Qatar" },
  { fr: "République centrafricaine",en: "Central African Republic" },
  { fr: "République dominicaine",   en: "Dominican Republic" },
  { fr: "République tchèque",       en: "Czech Republic" },
  { fr: "Roumanie",                 en: "Romania" },
  { fr: "Royaume-Uni",              en: "United Kingdom" },
  { fr: "Russie",                   en: "Russia" },
  { fr: "Rwanda",                   en: "Rwanda" },
  { fr: "Saint-Kitts-et-Nevis",     en: "Saint Kitts and Nevis" },
  { fr: "Saint-Marin",              en: "San Marino" },
  { fr: "Saint-Vincent-et-les-Grenadines", en: "Saint Vincent and the Grenadines" },
  { fr: "Sainte-Lucie",             en: "Saint Lucia" },
  { fr: "Salvador",                 en: "El Salvador" },
  { fr: "Samoa",                    en: "Samoa" },
  { fr: "Sao Tomé-et-Principe",     en: "São Tomé and Príncipe" },
  { fr: "Sénégal",                  en: "Senegal" },
  { fr: "Serbie",                   en: "Serbia" },
  { fr: "Seychelles",               en: "Seychelles" },
  { fr: "Sierra Leone",             en: "Sierra Leone" },
  { fr: "Singapour",                en: "Singapore" },
  { fr: "Slovaquie",                en: "Slovakia" },
  { fr: "Slovénie",                 en: "Slovenia" },
  { fr: "Somalie",                  en: "Somalia" },
  { fr: "Soudan",                   en: "Sudan" },
  { fr: "Soudan du Sud",            en: "South Sudan" },
  { fr: "Sri Lanka",                en: "Sri Lanka" },
  { fr: "Suède",                    en: "Sweden" },
  { fr: "Suisse",                   en: "Switzerland" },
  { fr: "Suriname",                 en: "Suriname" },
  { fr: "Syrie",                    en: "Syria" },
  { fr: "Tadjikistan",              en: "Tajikistan" },
  { fr: "Taïwan",                   en: "Taiwan" },
  { fr: "Tanzanie",                 en: "Tanzania" },
  { fr: "Tchad",                    en: "Chad" },
  { fr: "Thaïlande",                en: "Thailand" },
  { fr: "Timor oriental",           en: "Timor-Leste" },
  { fr: "Togo",                     en: "Togo" },
  { fr: "Tonga",                    en: "Tonga" },
  { fr: "Trinité-et-Tobago",        en: "Trinidad and Tobago" },
  { fr: "Tunisie",                  en: "Tunisia" },
  { fr: "Turkménistan",             en: "Turkmenistan" },
  { fr: "Turquie",                  en: "Turkey" },
  { fr: "Tuvalu",                   en: "Tuvalu" },
  { fr: "Ukraine",                  en: "Ukraine" },
  { fr: "Uruguay",                  en: "Uruguay" },
  { fr: "Vanuatu",                  en: "Vanuatu" },
  { fr: "Vatican",                  en: "Vatican City" },
  { fr: "Venezuela",                en: "Venezuela" },
  { fr: "Vietnam",                  en: "Vietnam" },
  { fr: "Yémen",                    en: "Yemen" },
  { fr: "Zambie",                   en: "Zambia" },
  { fr: "Zimbabwe",                 en: "Zimbabwe" },
];

/* ── Seuils salariaux 2026 ───────────────────────────────────────────────── */
/** RMMMG au 1er avril 2026 (temps plein, 18 ans et +) */
const RMMMG = 2189.81;

/**
 * Seuils THQ mensuels bruts par région — 2026 (valeurs confirmées)
 * Bruxelles : 3 703,44 €/mois  (44 441,28 €/an)
 * Wallonie   : 4 076,00 €/mois  (48 912 €/an)
 * Flandre    : 4 435,00 €/mois  (53 220 €/an)
 */
const THQ_THRESHOLDS = {
  bruxelles: 3703.44,
  wallonie:  4076.00,
  flandre:   4435.00,
};

/**
 * Seuils réduits pour travailleurs de moins de 30 ans (réduction à 80%)
 * Bruxelles : pas de réduction spécifique prévue
 * Wallonie   : 3 260,80 €/mois  (incluant infirmiers et enseignants)
 * Flandre    : 3 548,00 €/mois
 */
const THQ_THRESHOLDS_YOUNG = {
  bruxelles: 3703.44,  // pas de réduction confirmée pour Bruxelles
  wallonie:  3260.80,
  flandre:   3548.00,
};

const REGION_LABELS_EN = {
  "Bruxelles-Capitale": "Brussels-Capital",
  Wallonie: "Wallonia",
  Flandre: "Flanders",
};

const DIPLOMA_OPTIONS_EN = [
  { value: "Pas de diplôme / CESS non obtenu", label: "No diploma / upper secondary not completed" },
  { value: "CESS (secondaire supérieur)", label: "Upper secondary diploma" },
  { value: "Bachelier (bac+3)", label: "Bachelor's degree" },
  { value: "Master / Licence (bac+5)", label: "Master's degree" },
  { value: "Doctorat", label: "Doctorate" },
];

function getTHQThreshold(region, youngWorker = false) {
  const labels = parseRegionSelection(region).map((r) => r.toLowerCase());
  const thresholds = youngWorker ? THQ_THRESHOLDS_YOUNG : THQ_THRESHOLDS;
  if (labels.some((r) => r.includes("flandre"))) return thresholds.flandre;
  if (labels.some((r) => r.includes("bruxelles"))) return thresholds.bruxelles;
  if (labels.some((r) => r.includes("wallonie") || r.includes("wallonne"))) return thresholds.wallonie;
  // Multi-région : seuil le plus conservateur
  return Math.min(...Object.values(thresholds));
}

/** Délai légal minimum de publication pour le test marché */
function getMarketTestDuration(region) {
  const labels = parseRegionSelection(region).map((r) => r.toLowerCase());
  if (labels.some((r) => r.includes("flandre"))) return {
    weeks: 9, label: "9 semaines", platform: "VDAB",
    timing: "dans les 4 mois précédant la demande",
    note: "Une médiation active par le VDAB est également requise pendant cette période.",
  };
  if (labels.some((r) => r.includes("bruxelles"))) return {
    weeks: 5, label: "5 semaines", platform: "Actiris",
    timing: null, note: null,
  };
  return {
    weeks: 5, label: "5 semaines", platform: "Forem",
    timing: null,
    note: "Alternative possible : attestation de gestion active du dossier par le Forem.",
  };
}

function localizeRegionName(label, locale = "fr") {
  if (!label) return locale === "en" ? "Belgium" : "Belgique";
  return locale === "en" ? (REGION_LABELS_EN[label] || label) : label;
}

function localizeMarketTest(marketTest, locale = "fr") {
  if (locale !== "en" || !marketTest) return marketTest;
  const labelMap = {
    "9 semaines": "9 weeks",
    "5 semaines": "5 weeks",
  };
  const timingMap = {
    "dans les 4 mois précédant la demande": "within the 4 months preceding the application",
  };
  const noteMap = {
    "Une médiation active par le VDAB est également requise pendant cette période.": "Active mediation by the VDAB is also required during that period.",
    "Alternative possible : attestation de gestion active du dossier par le Forem.": "Possible alternative: formal proof that the file was actively handled by Le Forem.",
  };
  return {
    ...marketTest,
    label: labelMap[marketTest.label] || marketTest.label,
    timing: timingMap[marketTest.timing] || marketTest.timing,
    note: noteMap[marketTest.note] || marketTest.note,
  };
}

const DIPLOMA_OPTIONS = [
  "Pas de diplôme / CESS non obtenu",
  "CESS (secondaire supérieur)",
  "Bachelier (bac+3)",
  "Master / Licence (bac+5)",
  "Doctorat",
];

// COUNTRIES remplace NATIONALITIES — liste complète triée par nom FR
// Les valeurs stockées restent les noms FR pour compatibilité avec EU_NATIONALITIES

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n) {
  return Number(n).toLocaleString("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isTHQQualified(data) {
  const sal = Number(data.salary) || 0;
  const hasGoodDiploma = ["Master / Licence (bac+5)", "Doctorat"].includes(data.diploma);
  const youngWorker = data.age === "under30";
  return data.isHQ && hasGoodDiploma && sal >= getTHQThreshold(data.region, youngWorker);
}

function isShortageJob(data) {
  const groups = getProfessionGroupsForRegions(data.region);
  const allJobs = groups.flatMap((g) => g.options);
  return data.profession && data.profession !== "Autre profession" && allJobs.includes(data.profession);
}

function isFlandre(region) {
  return parseRegionSelection(region).some((r) => r.toLowerCase().includes("flandre"));
}

/* ── Moteur d'éligibilité — arbre de décision conditionnel ─────────────── */
function computeEligibility(data, locale = "fr") {
  if (locale === "en") {
    const frResult = computeEligibility(data, "fr");
    const regionName = localizeRegionName(parseRegionSelection(data.region)[0], "en");
    const youngWorker = data.age === "under30";
    const threshold = data.region ? getTHQThreshold(data.region, youngWorker) : null;
    const marketTest = localizeMarketTest(data.region ? getMarketTestDuration(data.region) : null, "en");
    const salary = Number(data.salary) || 0;

    const base = {
      ...frResult,
      complexity:
        frResult.complexity === "Faible" ? "Low" :
        frResult.complexity === "Modérée" ? "Moderate" :
        frResult.complexity === "Élevée" ? "High" :
        frResult.complexity === "Très élevée" ? "Very high" :
        frResult.complexity === "Bloquant" ? "Blocking" :
        frResult.complexity,
      delay:
        frResult.delay === "Aucun permis requis" ? "No permit required" :
        frResult.delay === "4 mois max" ? "Up to 4 months" :
        frResult.delay === "4 mois max (après test marché)" ? "Up to 4 months (after labour market test)" :
        frResult.delay === "4 mois max (après test marché complet)" ? "Up to 4 months (after a complete labour market test)" :
        frResult.delay === "Indéterminé" ? "Undetermined" :
        frResult.delay,
      permitDuration:
        frResult.permitDuration === "Sans objet" ? "Not applicable" :
        frResult.permitDuration === "3 ans max (renouvelable)" ? "Up to 3 years (renewable)" :
        frResult.permitDuration === "1 an max (renouvelable)" ? "Up to 1 year (renewable)" :
        frResult.permitDuration === "1 an max (si accordé)" ? "Up to 1 year (if granted)" :
        frResult.permitDuration,
    };

    switch (frResult.verdict) {
      case "EU_EXEMPT":
        return {
          ...base,
          label: "No work authorization required",
          procedure: "Free movement",
          positives: [
            "EU, EEA and Swiss nationals can work in Belgium without a single permit.",
          ],
          warnings: [],
          nextSteps: [
            "Check residence and registration formalities if relevant.",
            "Make sure the employment contract complies with Belgian labour law.",
          ],
        };
      case "BLOCKED":
        return {
          ...base,
          label: "File blocked in its current state",
          procedure: "Salary condition not met",
          warnings: [
            `The proposed salary (${fmt(salary)} €/month) is below the current legal minimum threshold.`,
            "The file should not be introduced before the remuneration is corrected.",
          ],
          nextSteps: [
            "Review the salary package to meet at least the legal minimum.",
            "Check whether a higher sectoral salary scale applies.",
          ],
        };
      case "THQ_FAVORABLE":
        return {
          ...base,
          label: "Favourable profile — highly qualified route",
          procedure: "Single permit — highly qualified worker route",
          positives: [
            `The salary and degree appear to meet the highly qualified route for ${regionName}.`,
            threshold ? `Indicative regional threshold: ${fmt(threshold)} €/month.` : "The regional threshold appears to be met.",
            "This route is exempt from the labour market test.",
          ],
          warnings: frResult.warnings.length ? ["A final legal check remains advisable before filing."] : [],
          nextSteps: [
            "Gather and verify diplomas and supporting documents.",
            "Prepare the employment contract with the gross monthly salary clearly stated.",
            "Validate the file with counsel before introduction.",
          ],
        };
      case "SHORTAGE_FAVORABLE":
        return {
          ...base,
          label: "Favourable situation for further legal review",
          procedure: frResult.procedure.includes("Flandre")
            ? "Single permit — shortage occupation / Flemish exemption"
            : `Single permit — shortage occupation${marketTest ? ` (${marketTest.platform})` : ""}`,
          positives: [
            "The role appears on an official shortage occupation list or benefits from a favourable regional route.",
            frResult.procedure.includes("Flandre")
              ? "In Flanders, shortage occupations may benefit from a full labour market test exemption."
              : `In ${regionName}, the file benefits from a lighter labour market test framework.`,
          ],
          warnings: frResult.warnings.length ? ["A final legal validation remains advisable before filing."] : [],
          nextSteps: [
            "Check the exact job title against the applicable regional list.",
            "Prepare the file and supporting documents.",
            "Validate the strategy with counsel before filing.",
          ],
        };
      case "CLASSIC_FAVORABLE":
        return {
          ...base,
          label: "Favourable file — to be consolidated with counsel",
          procedure: "Standard single permit",
          positives: [
            "The labour market test has already been started in a useful way.",
            "The basic salary condition appears to be met.",
          ],
          warnings: ["The standard route remains document-heavy and should be carefully prepared."],
          nextSteps: [
            "Make sure all publication evidence is archived.",
            "Document local candidate refusals in writing.",
            "Have the full file reviewed by counsel before filing.",
          ],
        };
      case "PENDING_STEPS":
        return {
          ...base,
          label: "File to secure before filing",
          procedure: frResult.procedure.includes("classique") ? "Standard single permit" : `Single permit — shortage occupation${marketTest ? ` (${marketTest.platform})` : ""}`,
          positives: frResult.positives.length ? ["Some useful preparatory steps have already been completed."] : [],
          warnings: [
            marketTest ? `A publication period of at least ${marketTest.label} on ${marketTest.platform} is still required or must be completed.` : "Further labour market test steps are still required.",
            "The file should be strengthened before any introduction.",
          ],
          nextSteps: [
            "Complete the labour market test and supporting evidence.",
            "Document refusals and publication history carefully.",
            "Review the file with counsel before going further.",
          ],
        };
      default:
        return {
          ...base,
          label: "More legally uncertain situation",
          procedure: frResult.procedure.includes("classique") ? "Standard single permit" : base.procedure,
          positives: frResult.positives.length ? ["Some elements may still support the file."] : [],
          warnings: [
            "The current information points to a fragile or incomplete file.",
            "A legal review is strongly recommended before any next step.",
          ],
          nextSteps: [
            "Start or complete the labour market test if applicable.",
            "Clarify the salary, contract and supporting documents.",
            "Request a legal review before filing.",
          ],
        };
    }
  }

  const {
    nationality, region, profession, salary, isHQ, diploma, contractType,
    fullTime, experience, age,
    offerPublished, euresPublished, candidatesRefused,
  } = data;

  const regionLabels   = parseRegionSelection(region);
  const regionName     = regionLabels[0] || "la région sélectionnée";
  const sal            = Number(salary) || 0;
  const expYears       = Number(experience) || 0;
  const youngWorker    = age === "under30";
  const positives      = [];
  const warnings       = [];
  const nextSteps      = [];

  /* ── Branche 1 : UE / EEE / Suisse ───────────────────────────────────── */
  if (EU_NATIONALITIES.has(nationality)) {
    return {
      verdict:       "EU_EXEMPT",
      label:         "Aucune démarche d'autorisation requise",
      color:         "teal",
      procedure:     "Libre circulation",
      delay:         "Aucun permis requis",
      permitDuration:"Sans objet",
      complexity:    "Faible",
      positives:  ["Ressortissant UE/EEE/CH : libre circulation garantie par les traités européens. Aucun permis de travail ni d'autorisation préalable n'est requis pour exercer une activité salariée en Belgique."],
      warnings:   [],
      nextSteps:  ["Vérifier que le candidat dispose bien d'un titre de séjour valide si nécessaire.", "S'assurer que le contrat respecte le droit belge du travail (CCT, barèmes sectoriels)."],
    };
  }

  const thqThreshold = getTHQThreshold(region, youngWorker);
  const marketTest   = getMarketTestDuration(region);
  const hasGoodDiploma = ["Master / Licence (bac+5)", "Doctorat"].includes(diploma);
  const thqOk        = isHQ && hasGoodDiploma && sal >= thqThreshold;
  const shortage     = isShortageJob(data);
  const flandre      = isFlandre(region);

  /* ── Vérification préalable : salaire minimum légal ─────────────────── */
  if (sal > 0 && sal < RMMMG) {
    warnings.push(
      `Le salaire proposé (${fmt(sal)} €/mois) est inférieur au RMMMG légal en vigueur depuis le 1er avril 2026 : ${fmt(RMMMG)} €/mois bruts pour un temps plein. ` +
      `La rémunération d'un travailleur étranger doit impérativement atteindre ce minimum. En l'état, le dossier ne peut pas être introduit.`
    );
    if (fullTime === "partial") warnings.push("Pour un temps partiel, le RMMMG est calculé au prorata des heures. Vérifiez que le salaire équivaut bien au RMMMG temps plein proraté.");
    return {
      verdict:       "BLOCKED",
      label:         "Dossier irrecevable en l'état",
      color:         "red",
      procedure:     "Condition salariale non remplie",
      delay:         "—",
      permitDuration:"—",
      complexity:    "Bloquant",
      positives:  [],
      warnings,
      nextSteps:  ["Revoir la grille salariale pour atteindre au minimum le RMMMG (2 189,81 €/mois bruts au 1er avril 2026).", "Consulter le cabinet LEXPAT pour identifier si une convention collective sectorielle impose un barème supérieur."],
    };
  }

  /* Avertissement temps partiel */
  if (fullTime === "partial") {
    warnings.push(`Temps partiel : assurez-vous que la rémunération rapportée à un équivalent temps plein atteint bien le RMMMG de ${fmt(RMMMG)} €/mois.`);
  }

  /* ── Branche 2 : Travailleur hautement qualifié (THQ) ────────────────── */
  if (thqOk) {
    positives.push(`Niveau de diplôme (${diploma}) et salaire (${fmt(sal)} €/mois) atteignent les critères du régime hautement qualifié pour ${regionName} — seuil applicable : ${fmt(thqThreshold)} €/mois${youngWorker ? " (seuil jeune travailleur -30 ans)" : ""}.`);
    positives.push("Ce régime dispense entièrement de l'examen du marché de l'emploi : aucune publication d'offre ni justification de refus de candidats locaux n'est exigée.");
    positives.push("Délai légal de traitement : 4 mois maximum.");
    if (youngWorker) positives.push("Travailleur de moins de 30 ans : le seuil salarial réduit s'applique pour les régions Flandre et Wallonie.");
    if (contractType === "CDI") positives.push("Contrat CDI : élément favorable à l'instruction.");
    if (expYears >= 6) positives.push(`Expérience professionnelle significative (${expYears}+ ans) : renforce la crédibilité du profil auprès de l'autorité compétente.`);
    if (contractType === "CDD") warnings.push("Un CDD est possible en régime THQ, mais sa durée doit justifier la période de séjour demandée.");
    return {
      verdict:       "THQ_FAVORABLE",
      label:         "Profil favorable — orientation vers la voie THQ",
      color:         "green",
      procedure:     "Permis unique — voie Travailleur Hautement Qualifié",
      delay:         "4 mois max",
      permitDuration:"3 ans max (renouvelable)",
      complexity:    "Modérée",
      positives,
      warnings,
      nextSteps:  [
        "Rassembler et faire authentifier les diplômes (reconnaissance éventuelle via NARIC).",
        "Préparer le contrat de travail mentionnant explicitement le salaire mensuel brut.",
        "Constituer le dossier de demande de permis unique auprès de l'autorité régionale compétente.",
        "Une vérification juridique complémentaire reste recommandée selon le profil exact du candidat.",
      ],
    };
  }

  /* Signaler pourquoi THQ refusé si la case était cochée */
  if (isHQ) {
    if (!hasGoodDiploma)
      warnings.push(`Le régime THQ requiert un diplôme Master ou Doctorat. Le niveau indiqué ("${diploma || "non renseigné"}") ne permet pas d'accéder à cette voie — le dossier sera orienté vers la procédure classique.`);
    else if (sal < thqThreshold)
      warnings.push(`Le salaire indiqué (${fmt(sal)} €) est inférieur au seuil THQ de ${fmt(thqThreshold)} €/mois pour ${regionName}. Le profil ne peut pas bénéficier de la dispense de test marché — voie classique applicable.`);
  }

  /* Salaire OK */
  positives.push(`Salaire de ${fmt(sal)} €/mois ≥ RMMMG légal (${fmt(RMMMG)} €). La condition salariale de base est respectée.`);
  if (expYears >= 3) positives.push(`Expérience de ${expYears}+ ans : élément de nature à renforcer la pertinence du recrutement aux yeux de l'autorité d'instruction.`);

  /* ── Branche 3 : Métier en pénurie ───────────────────────────────────── */
  if (shortage) {
    positives.push(`"${profession}" figure sur la liste officielle des métiers en pénurie pour ${regionName} (2026) — cela influence favorablement la procédure.`);

    /* Flandre : dispense totale */
    if (flandre) {
      positives.push("En Flandre, les métiers en pénurie (knelpuntberoepen) ouvrent droit à une dispense totale de l'examen du marché de l'emploi.");
      positives.push("Délai légal de traitement : 4 mois maximum.");
      if (contractType === "CDI") positives.push("Contrat CDI : élément favorable.");
      if (contractType === "CDD") warnings.push("CDD : vérifier que la durée est compatible avec la période de séjour demandée.");
      return {
        verdict:       "SHORTAGE_FAVORABLE",
        label:         "Situation favorable à une analyse approfondie",
        color:         "green",
        procedure:     "Permis unique — métier en pénurie / dispense Flandre",
        delay:         "4 mois max",
        permitDuration:"1 an max (renouvelable)",
        complexity:    "Modérée",
        positives,
        warnings,
        nextSteps:  [
          "Vérifier que l'intitulé exact du poste correspond bien à la liste VDAB des knelpuntberoepen.",
          "Préparer le dossier de demande de permis unique avec les documents requis.",
          "Consulter un juriste pour valider les conditions spécifiques du dossier avant introduction.",
        ],
      };
    }

    /* Bruxelles / Wallonie : test marché allégé */
    positives.push(
      `À ${regionName}, le métier en pénurie facilite la procédure, mais une publication minimale de ` +
      `${marketTest.label} sur ${marketTest.platform} reste requise avant l'introduction du dossier.`
    );

    const marketDone = offerPublished && (Number(candidatesRefused) >= 1 || euresPublished);
    if (marketDone) {
      positives.push("Les démarches de test marché ont été engagées : publication effectuée et candidats locaux documentés.");
      if (contractType === "CDI") positives.push("Contrat CDI : élément favorable.");
      return {
        verdict:       "SHORTAGE_FAVORABLE",
        label:         "Situation favorable à une analyse approfondie",
        color:         "green",
        procedure:     `Permis unique — métier en pénurie (${marketTest.platform})`,
        delay:         "4 mois max",
        permitDuration:"1 an max (renouvelable)",
        complexity:    "Modérée",
        positives,
        warnings,
        nextSteps:  [
          "Documenter et archiver formellement tous les refus de candidats locaux (motifs écrits obligatoires).",
          `S'assurer que la durée de publication atteint bien ${marketTest.label} avant l'introduction.`,
          "Consulter un juriste pour préparer et valider le dossier complet.",
        ],
      };
    }

    warnings.push(`La publication de l'offre sur ${marketTest.platform} pendant au minimum ${marketTest.label} est requise avant de pouvoir introduire la demande.`);
    if (!euresPublished) warnings.push("La publication sur EURES est fortement recommandée pour étayer la preuve du test marché.");
    return {
      verdict:       "PENDING_STEPS",
      label:         "Dossier à sécuriser avant introduction",
      color:         "orange",
      procedure:     `Permis unique — métier en pénurie (${marketTest.platform})`,
      delay:         "4 mois max (après test marché)",
      permitDuration:"1 an max (renouvelable)",
      complexity:    "Modérée",
      positives,
      warnings,
      nextSteps:  [
        `Publier l'offre sur ${marketTest.platform} et EURES pendant ${marketTest.label} minimum.`,
        "Documenter les candidatures reçues et les motifs de refus.",
        ...(marketTest.note ? [`${marketTest.note}`] : []),
        "Une fois le test marché complété, constituer le dossier avec l'accompagnement d'un juriste.",
      ],
    };
  }

  /* ── Branche 4 : Permis unique classique ────────────────────────────── */
  warnings.push(
    `"${profession || "Ce métier"}" ne figure pas sur la liste des métiers en pénurie pour ${regionName} — ` +
    `l'examen complet du marché de l'emploi est obligatoire avant toute introduction de dossier.`
  );
  warnings.push(
    `Durée minimale de publication imposée : ${marketTest.label} sur ${marketTest.platform} + EURES, ` +
    `avec justification écrite des refus de candidats locaux et européens.`
  );
  if (marketTest.timing) {
    warnings.push(`Flandre : cette publication doit avoir eu lieu ${marketTest.timing}. ${marketTest.note || ""}`);
  }
  if (marketTest.note && !marketTest.timing) {
    warnings.push(marketTest.note);
  }
  /* Flandre : exigence 80% FTE pour permis classique */
  if (flandre && data.fullTime === "partial") {
    warnings.push("En Flandre, le contrat doit représenter au minimum 80 % d'un temps plein pour l'obtention d'un permis unique classique. Un temps partiel inférieur à ce seuil est un motif de refus.");
  }

  const marketTestFull    = offerPublished && euresPublished && Number(candidatesRefused) >= 3;
  const marketTestPartial = offerPublished && (euresPublished || Number(candidatesRefused) >= 1);

  if (marketTestFull) {
    positives.push("Les trois composantes du test marché sont engagées : publication régionale, EURES et candidats locaux documentés.");
    if (contractType === "CDI") positives.push("Contrat CDI : élément favorable à l'instruction.");
    if (expYears >= 3) positives.push("L'expérience du candidat renforce l'argumentation sur l'inadéquation des profils locaux.");
    return {
      verdict:       "CLASSIC_FAVORABLE",
      label:         "Dossier favorable — à consolider avec un juriste",
      color:         "green",
      procedure:     "Permis unique classique",
      delay:         "4 mois max",
      permitDuration:"1 an max (renouvelable)",
      complexity:    "Élevée",
      positives,
      warnings,
      nextSteps:  [
        "Vérifier que la durée effective de publication atteint bien le minimum légal requis.",
        "Constituer et archiver formellement tous les justificatifs de refus.",
        "Faire analyser le dossier complet par un juriste avant introduction.",
        "Une vérification complémentaire peut être nécessaire selon la région, le poste et la situation individuelle du candidat.",
      ],
    };
  }

  if (marketTestPartial) {
    positives.push("Certaines démarches de test marché ont été engagées — c'est un point de départ.");
    warnings.push(`Il manque des éléments pour constituer un dossier solide : compléter la publication (${marketTest.label} minimum) et documenter les refus motivés.`);
    return {
      verdict:       "PENDING_STEPS",
      label:         "Dossier à sécuriser avant introduction",
      color:         "orange",
      procedure:     "Permis unique classique",
      delay:         "4 mois max (après test marché complet)",
      permitDuration:"1 an max (renouvelable)",
      complexity:    "Élevée",
      positives,
      warnings,
      nextSteps:  [
        `Compléter la publication sur ${marketTest.platform} et EURES jusqu'à ${marketTest.label} minimum.`,
        "Collecter et archiver les refus motivés de candidats locaux et européens.",
        "Consulter un juriste pour évaluer la solidité du dossier avant introduction.",
      ],
    };
  }

  warnings.push("Aucune démarche de test marché n'a encore été engagée. Ce prérequis est obligatoire et doit précéder toute introduction de dossier.");
  return {
    verdict:       "UNCERTAIN",
    label:         "Situation juridiquement plus incertaine",
    color:         "red",
    procedure:     "Permis unique classique",
    delay:         "Indéterminé",
    permitDuration:"1 an max (si accordé)",
    complexity:    "Très élevée",
    positives,
    warnings,
    nextSteps:  [
      `Engager immédiatement le test marché : publication sur ${marketTest.platform} et EURES.`,
      `Respecter la durée minimale de ${marketTest.label} avant toute introduction.`,
      "Ne pas introduire de dossier sans avoir complété et documenté le test marché.",
      "Consulter le cabinet LEXPAT pour une analyse juridique de la situation avant d'aller plus loin.",
    ],
  };
}

/* ── Composant StepBar ───────────────────────────────────────────────────── */
function StepBar({ current, total, locale = "fr" }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done   = n < current;
          const active = n === current;
          return (
            <div key={n} className="flex items-center flex-1">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition sm:h-8 sm:w-8 sm:text-sm ${
                done    ? "bg-[#57B7AF] text-white" :
                active  ? "bg-[#1E3A78] text-white ring-2 ring-[#1E3A78]/15 sm:ring-4 sm:ring-[#1E3A78]/20" :
                          "border-2 border-[#dce8f5] bg-white text-[#8a9bb0]"
              }`}>
                {done ? "✓" : n}
              </div>
              {n < total && (
                <div className={`mx-1 h-1 flex-1 rounded-full ${done ? "bg-[#57B7AF]" : "bg-[#edf1f5]"}`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-right text-[11px] text-[#8a9bb0] sm:text-xs">
        {locale === "en" ? "Step" : "Étape"} {current}/{total}
      </p>
    </div>
  );
}

/* ── Champs réutilisables ────────────────────────────────────────────────── */
function FieldLabel({ children, required }) {
  return (
    <span className="mb-2 block text-sm font-semibold text-[#17345d]">
      {children}{required && " *"}
    </span>
  );
}

/* ── Verdict badge ───────────────────────────────────────────────────────── */
const VERDICT_STYLES = {
  green:  { bg: "bg-[#d1fae5]", text: "text-[#065f46]", border: "border-[#6ee7b7]", dot: "bg-[#10b981]" },
  orange: { bg: "bg-[#fff7ed]", text: "text-[#92400e]", border: "border-[#fed7aa]", dot: "bg-[#f59e0b]" },
  red:    { bg: "bg-[#fef2f2]", text: "text-[#991b1b]", border: "border-[#fecaca]", dot: "bg-[#ef4444]" },
  teal:   { bg: "bg-[#f0fdfa]", text: "text-[#134e4a]", border: "border-[#99f6e4]", dot: "bg-[#14b8a6]" },
};

function VerdictBadge({ label, color }) {
  const s = VERDICT_STYLES[color] || VERDICT_STYLES.orange;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

/* ── Composant principal ─────────────────────────────────────────────────── */
const TOTAL_STEPS = 4;

const INIT = {
  // Step 1
  region: "", profession: "", sector: "", contractType: "", fullTime: "",
  // Step 2
  nationality: "", residence: "", diploma: "", experience: "", age: "",
  // Step 3
  salary: "", isHQ: false,
  // Step 4
  offerPublished: false, euresPublished: false, candidatesRefused: "0",
};

export default function SimulateurEligibilite({ locale = "fr" }) {
  const isEn = locale === "en";
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState(INIT);
  const [result, setResult]   = useState(null);
  const [lead, setLead]       = useState({ email: "", company: "", phone: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  function set(key, value) {
    setData((d) => {
      const next = { ...d, [key]: value };
      if (key === "region") next.profession = "";
      return next;
    });
  }

  function next() {
    // UE/EEE/CH — sauter étapes 3 et 4
    if (step === 2 && EU_NATIONALITIES.has(data.nationality)) {
      setResult(computeEligibility(data, locale));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    // THQ validé après étape 3 — sauter étape 4 (test marché non requis)
    if (step === 3 && isTHQQualified(data)) {
      setResult(computeEligibility(data, locale));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    // Métier en pénurie en Flandre après étape 3 — dispense totale du test marché
    if (step === 3 && isShortageJob(data) && isFlandre(data.region)) {
      setResult(computeEligibility(data, locale));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setResult(computeEligibility(data, locale));
      setStep(TOTAL_STEPS + 1);
    }
  }

  function back()  { setStep((s) => Math.max(1, s - 1)); }
  function reset() { setStep(1); setData(INIT); setResult(null); setSent(false); }

  async function submitLead(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/eligibility-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, result, formData: data }),
      });
      setSent(true);
    } catch (_) {}
    setSending(false);
  }

  const professionGroups = getProfessionGroupsForRegions(data.region, locale);
  const regionLabels     = parseRegionSelection(data.region);
  const youngWorkerUI    = data.age === "under30";
  const thqThreshold     = data.region ? getTHQThreshold(data.region, youngWorkerUI) : null;
  const marketTest       = localizeMarketTest(data.region ? getMarketTestDuration(data.region) : null, locale);
  const displayedRegionLabels = regionLabels.map((label) => localizeRegionName(label, locale));
  const diplomaOptions = isEn ? DIPLOMA_OPTIONS_EN : DIPLOMA_OPTIONS.map((d) => ({ value: d, label: d }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <div className="rounded-[28px] border border-[#e4edf4] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:rounded-[32px] sm:p-8">

        {/* ── ÉTAPES 1–4 ─────────────────────────────────────────────────── */}
        {step <= TOTAL_STEPS && (
          <>
            <StepBar current={step} total={TOTAL_STEPS} locale={locale} />

            {/* ÉTAPE 1 — Contexte de l'emploi */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">{isEn ? "Job context" : "Contexte de l'emploi"}</h2>
                <p className="text-sm text-[#607086]">{isEn ? "Indicate the region, job title and contract type offered." : "Indiquez la région, le métier et le type de contrat proposé."}</p>

                <label>
                  <FieldLabel required>{isEn ? "Recruitment region" : "Région de recrutement"}</FieldLabel>
                  <RegionSelector
                    value={regionLabels}
                    onChange={(v) => set("region", v)}
                    helperText={isEn ? "Select the region where the worker will mainly be based." : "Sélectionnez la région où le travailleur sera basé."}
                    locale={locale}
                  />
                </label>

                <label>
                  <FieldLabel required>{isEn ? "Target occupation" : "Métier recherché"}</FieldLabel>
                  {data.region ? (
                    <select
                      className="field-input"
                      value={data.profession}
                      onChange={(e) => set("profession", e.target.value)}
                      required
                    >
                      <option value="" disabled>{isEn ? "Select the target occupation" : "Sélectionnez le métier visé"}</option>
                      {professionGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((job) => (
                            <option key={`${group.label}-${job.value}`} value={job.value}>{job.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
                      {isEn ? "Select a region first to choose an occupation" : "Sélectionnez d'abord une région pour choisir un métier"}
                    </div>
                  )}
                  {data.region && regionLabels.length === 1 && (
                    <p className="mt-1.5 text-xs text-[#57b7af]">
                      {isEn
                        ? `Official shortage occupation list for ${displayedRegionLabels[0]} — 2026 update`
                        : `Liste officielle des métiers en pénurie pour ${regionLabels[0]} — mise à jour 2026`}
                    </p>
                  )}
                </label>

                {data.profession === "Autre profession" && (
                  <label>
                    <FieldLabel required>{isEn ? "Specify the job title" : "Précisez l'intitulé du poste"}</FieldLabel>
                    <input
                      className="field-input"
                      type="text"
                      placeholder={isEn ? "E.g. HVAC technician" : "Ex. : Technicien CVC"}
                      value={data.sector}
                      onChange={(e) => set("sector", e.target.value)}
                    />
                  </label>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <FieldLabel>{isEn ? "Contract type" : "Type de contrat"}</FieldLabel>
                    <select className="field-input" value={data.contractType} onChange={(e) => set("contractType", e.target.value)}>
                      <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                      <option value="CDI">{isEn ? "Permanent contract" : "CDI"}</option>
                      <option value="CDD">{isEn ? "Fixed-term contract" : "CDD"}</option>
                    </select>
                  </label>
                  <label>
                    <FieldLabel>{isEn ? "Working time" : "Temps de travail"}</FieldLabel>
                    <select className="field-input" value={data.fullTime} onChange={(e) => set("fullTime", e.target.value)}>
                      <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                      <option value="full">{isEn ? "Full-time" : "Temps plein"}</option>
                      <option value="partial">{isEn ? "Part-time" : "Temps partiel"}</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — Profil du candidat */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">{isEn ? "Candidate profile" : "Profil du candidat"}</h2>
                <p className="text-sm text-[#607086]">{isEn ? "These details help determine whether a work authorization is required." : "Ces informations permettent de détecter si un permis de travail est requis."}</p>

                <label>
                  <FieldLabel required>{isEn ? "Nationality" : "Nationalité"}</FieldLabel>
                  <select className="field-input" value={data.nationality} onChange={(e) => set("nationality", e.target.value)} required>
                    <option value="" disabled>{isEn ? "Select nationality" : "Sélectionnez la nationalité"}</option>
                    <optgroup label={isEn ? "EU / EEA / Switzerland — free movement" : "UE / EEE / Suisse — libre circulation"}>
                      {COUNTRIES.filter((c) => EU_NATIONALITIES.has(c.fr)).map((c) => (
                        <option key={c.fr} value={c.fr}>{isEn ? c.en : c.fr}</option>
                      ))}
                    </optgroup>
                    <optgroup label={isEn ? "Non-EU / EEA — work permit required" : "Hors UE / EEE — permis requis"}>
                      {COUNTRIES.filter((c) => !EU_NATIONALITIES.has(c.fr)).map((c) => (
                        <option key={c.fr} value={c.fr}>{isEn ? c.en : c.fr}</option>
                      ))}
                    </optgroup>
                  </select>
                  {EU_NATIONALITIES.has(data.nationality) && (
                    <p className="mt-1.5 text-xs text-[#57b7af] font-semibold">
                      {isEn ? "✓ EU/EEA/Swiss national — no work authorization required. Result available at the next step." : "✓ Ressortissant UE/EEE/CH — aucun permis de travail requis. Résultat disponible à l'étape suivante."}
                    </p>
                  )}
                </label>

                <label>
                  <FieldLabel>{isEn ? "Current country of residence" : "Pays de résidence actuel"}</FieldLabel>
                  <input
                    className="field-input"
                    type="text"
                    placeholder={isEn ? "E.g. Morocco, Senegal, India..." : "Ex. : Maroc, Sénégal, Inde…"}
                    value={data.residence}
                    onChange={(e) => set("residence", e.target.value)}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <FieldLabel>{isEn ? "Degree level" : "Niveau de diplôme"}</FieldLabel>
                    <select className="field-input" value={data.diploma} onChange={(e) => set("diploma", e.target.value)}>
                      <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                      {diplomaOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>{isEn ? "Years of experience" : "Années d'expérience"}</FieldLabel>
                    <select className="field-input" value={data.experience} onChange={(e) => set("experience", e.target.value)}>
                      <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                      <option value="0">{isEn ? "Less than 1 year" : "Moins d'1 an"}</option>
                      <option value="1">{isEn ? "1 to 2 years" : "1 à 2 ans"}</option>
                      <option value="3">{isEn ? "3 to 5 years" : "3 à 5 ans"}</option>
                      <option value="6">{isEn ? "6 to 10 years" : "6 à 10 ans"}</option>
                      <option value="11">{isEn ? "More than 10 years" : "Plus de 10 ans"}</option>
                    </select>
                  </label>
                </div>

                <label>
                  <FieldLabel>{isEn ? "Candidate age" : "Âge du candidat"}</FieldLabel>
                  <select className="field-input" value={data.age} onChange={(e) => set("age", e.target.value)}>
                    <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                    <option value="under30">{isEn ? "Under 30" : "Moins de 30 ans"}</option>
                    <option value="30plus">{isEn ? "30 or older" : "30 ans ou plus"}</option>
                  </select>
                  <p className="mt-1.5 text-xs text-[#8a9bb0]">
                    {isEn ? "In Flanders and Wallonia, a reduced salary threshold applies to highly qualified workers under 30." : "En Flandre et en Wallonie, un seuil salarial réduit s'applique pour les travailleurs de moins de 30 ans dans la voie hautement qualifiée."}
                  </p>
                </label>
              </div>
            )}

            {/* ÉTAPE 3 — Conditions salariales */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">{isEn ? "Salary conditions" : "Conditions salariales"}</h2>
                <p className="text-sm text-[#607086]">{isEn ? "Salary is a key legal criterion in single permit cases." : "Le salaire est un critère légal déterminant dans l'instruction du permis unique."}</p>

                <label>
                  <FieldLabel required>{isEn ? "Gross monthly salary (€)" : "Salaire mensuel brut (€)"}</FieldLabel>
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    step="50"
                    placeholder={isEn ? "E.g. 2800" : "Ex. : 2800"}
                    value={data.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    required
                  />
                  <p className="mt-1.5 text-xs text-[#8a9bb0]">
                    {isEn ? `Legal minimum (as of 1 April 2026): ${fmt(RMMMG)} €/month` : `Minimum légal (RMMMG au 1er avril 2026) : ${fmt(RMMMG)} €/mois`}
                    {thqThreshold && (isEn
                      ? ` · HQ threshold for ${displayedRegionLabels[0] || "this region"}: ${fmt(thqThreshold)} €/month`
                      : ` · Seuil THQ pour ${regionLabels[0] || "cette région"} : ${fmt(thqThreshold)} €/mois`)}
                  </p>
                </label>

                <div className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[#1E3A78]"
                      checked={data.isHQ}
                      onChange={(e) => set("isHQ", e.target.checked)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1E3A78]">{isEn ? "Highly qualified worker (HQ)" : "Travailleur hautement qualifié (THQ)"}</p>
                      <p className="mt-1 text-xs text-[#607086]">
                        {isEn
                          ? <>Tick this box if the role is a highly qualified function: <strong>senior executive, specialised engineer, researcher, doctor, IT expert, senior lawyer</strong>, etc.</>
                          : <>Cochez si le poste relève d'une fonction hautement qualifiée : <strong>cadre dirigeant, ingénieur spécialisé, chercheur, médecin, expert IT, juriste senior</strong>, etc.</>}
                      </p>
                      <p className="mt-1 text-xs text-[#607086]">
                        {isEn ? <><strong>Combined conditions:</strong> <strong>Master's degree or Doctorate</strong></> : <>Conditions cumulatives : <strong>diplôme Master ou Doctorat</strong></>}
                        {thqThreshold
                          ? isEn
                            ? ` + salary ≥ ${fmt(thqThreshold)} €/month (${displayedRegionLabels[0] || "regional"} threshold for 2026).`
                            : ` + salaire ≥ ${fmt(thqThreshold)} €/mois (seuil ${regionLabels[0] || "régional"} 2026).`
                          : "."
                        }
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#1E3A78]">
                        {isEn ? "✦ If these criteria are met, the profile is fully exempt from the labour market test." : "✦ Si ces critères sont réunis, le profil est entièrement dispensé du test du marché de l'emploi."}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Indicateur THQ en temps réel */}
                {data.isHQ && data.salary && data.diploma && (() => {
                  const sal = Number(data.salary);
                  const hasGoodDiploma = ["Master / Licence (bac+5)", "Doctorat"].includes(data.diploma);
                  const qualifies = hasGoodDiploma && sal >= thqThreshold;
                  return (
                    <div className={`rounded-[12px] border px-4 py-3 text-xs font-medium ${
                      qualifies
                        ? "border-[#6ee7b7] bg-[#f0fdf4] text-[#065f46]"
                        : "border-[#fed7aa] bg-[#fff7ed] text-[#92400e]"
                    }`}>
                      {qualifies
                        ? (isEn ? "✓ HQ criteria validated — you will go straight to the result without a labour market test." : "✓ Critères THQ validés — vous passerez directement au résultat sans test marché.")
                        : !hasGoodDiploma
                          ? (isEn ? "⚠ Degree level insufficient for the HQ route (Master's degree or Doctorate required)." : `⚠ Diplôme insuffisant pour le THQ (Master ou Doctorat requis).`)
                          : (isEn ? `⚠ Salary (${fmt(sal)} €) below the HQ threshold of ${fmt(thqThreshold)} €/month — standard route.` : `⚠ Salaire (${fmt(sal)} €) inférieur au seuil THQ de ${fmt(thqThreshold)} €/mois — voie classique.`)
                      }
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ÉTAPE 4 — Test du marché de l'emploi */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">{isEn ? "Labour market test" : "Test du marché de l'emploi"}</h2>
                {marketTest && (
                  <div className="rounded-[12px] border border-[#dce8f5] bg-[#f0f6ff] px-4 py-3 text-xs text-[#1E3A78] space-y-1">
                    <p><strong>{isEn ? `Rule for ${displayedRegionLabels[0] || "this region"}:` : `Règle pour ${regionLabels[0] || "cette région"} :`}</strong> {isEn ? "publication required for at least" : "publication obligatoire pendant"}{" "}
                    <strong>{marketTest.label}</strong> {isEn ? "on" : "sur"} {marketTest.platform}
                    {!isFlandre(data.region) && (isEn ? " (+ EURES recommended)" : " (+ EURES recommandé)")} {isEn ? "before filing the application." : "avant d'introduire le dossier."}</p>
                    {marketTest.timing && (
                      <p className="text-[#8a9bb0]">{isEn ? "Flanders: this publication must have taken place" : "Flandre : cette publication doit avoir eu lieu"} <strong>{marketTest.timing}</strong>.</p>
                    )}
                    {marketTest.note && (
                      <p className="text-[#57B7AF] font-medium">{marketTest.note}</p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1E3A78]"
                        checked={data.offerPublished} onChange={(e) => set("offerPublished", e.target.checked)} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A78]">
                          {isEn ? `Opening published on ${marketTest ? marketTest.platform : "the regional platform"}` : `Offre publiée sur ${marketTest ? marketTest.platform : "la plateforme régionale"}`}
                        </p>
                        <p className="mt-0.5 text-xs text-[#607086]">
                          {isEn ? "Published on the competent regional platform for the required duration." : "Publication sur la plateforme régionale compétente pendant la durée requise."}
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1E3A78]"
                        checked={data.euresPublished} onChange={(e) => set("euresPublished", e.target.checked)} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A78]">{isEn ? "Opening published on EURES" : "Offre publiée sur EURES"}</p>
                        <p className="mt-0.5 text-xs text-[#607086]">{isEn ? "European job mobility portal — strengthens the labour market test evidence." : "Portail européen de la mobilité professionnelle — renforce la preuve du test marché."}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <label>
                  <FieldLabel>{isEn ? "Rejected local / EU candidates" : "Candidats locaux / européens refusés"}</FieldLabel>
                  <select className="field-input" value={data.candidatesRefused} onChange={(e) => set("candidatesRefused", e.target.value)}>
                    <option value="0">{isEn ? "0 — not started yet" : "0 — pas encore lancé"}</option>
                    <option value="1">{isEn ? "1 to 2 candidates" : "1 à 2 candidats"}</option>
                    <option value="3">{isEn ? "3 to 5 candidates" : "3 à 5 candidats"}</option>
                    <option value="6">{isEn ? "6 or more" : "6 ou plus"}</option>
                  </select>
                  <p className="mt-1.5 text-xs text-[#8a9bb0]">
                    {isEn ? "Reasoned refusals should be documented and justified in the file." : "Les refus motivés doivent être documentés et justifiés pour figurer au dossier."}
                  </p>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={back}
                  className="rounded-2xl border border-[#dce8f5] px-5 py-2.5 text-sm font-semibold text-[#607086] transition hover:border-[#1E3A78] hover:text-[#1E3A78]">
                  {isEn ? "← Back" : "← Retour"}
                </button>
              ) : <div />}
              <button
                type="button"
                onClick={next}
                disabled={
                  (step === 1 && (!data.region || !data.profession)) ||
                  (step === 2 && !data.nationality) ||
                  (step === 3 && !data.salary)
                }
                className="rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #1E3A78, #204E97)" }}
              >
                {step === TOTAL_STEPS ? (isEn ? "View result →" : "Voir le résultat →") : (isEn ? "Next step →" : "Étape suivante →")}
              </button>
            </div>
          </>
        )}

        {/* ── RÉSULTAT ─────────────────────────────────────────────────── */}
        {step === TOTAL_STEPS + 1 && result && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#57B7AF]">{isEn ? "Your simulation result" : "Résultat de votre simulation"}</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1E3A78]">{data.profession || (isEn ? "Your role" : "Votre poste")}</h2>
              <p className="text-sm text-[#607086]">{displayedRegionLabels[0] || (isEn ? "Belgium" : "Belgique")}</p>
            </div>

            {/* Badge verdict */}
            <VerdictBadge label={result.label} color={result.color} />

            {/* Métriques légales */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: isEn ? "Procedure" : "Procédure",        value: result.procedure },
                { label: isEn ? "Permit duration" : "Durée du permis",  value: result.permitDuration },
                { label: isEn ? "Legal max delay" : "Délai légal max",  value: result.delay },
                { label: isEn ? "Complexity" : "Complexité",       value: result.complexity },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-3 text-center">
                  <p className="text-xs text-[#8a9bb0]">{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#1E3A78] leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Ce qui plaide en faveur du dossier */}
            {result.positives.length > 0 && (
              <div className="rounded-[16px] border border-[#6ee7b7] bg-[#f0fdf4] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#065f46]">{isEn ? "What supports the file" : "Ce qui plaide en faveur du dossier"}</p>
                <ul className="space-y-2">
                  {result.positives.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#065f46]">
                      <span className="mt-1 shrink-0 text-[#10b981]">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ce qui fragilise ou manque */}
            {result.warnings.length > 0 && (
              <div className="rounded-[16px] border border-[#fed7aa] bg-[#fff7ed] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#92400e]">{isEn ? "What weakens the file or still needs checking" : "Ce qui fragilise le dossier ou reste à vérifier"}</p>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#92400e]">
                      <span className="mt-1 shrink-0">⚠</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prochaines étapes recommandées */}
            {result.nextSteps && result.nextSteps.length > 0 && (
              <div className="rounded-[16px] border border-[#c7d7f0] bg-[#f0f5ff] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1E3A78]">{isEn ? "Recommended next steps" : "Prochaines étapes recommandées"}</p>
                <ol className="space-y-2">
                  {result.nextSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#1E3A78]">
                      <span className="mt-0.5 shrink-0 text-xs font-bold text-[#57B7AF]">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Mention de prudence juridique */}
            <div className="rounded-[14px] border-l-4 border-[#1E3A78] bg-[#f0f5ff] px-4 py-4 text-xs text-[#607086] leading-relaxed">
              <p className="font-bold text-[#1E3A78] mb-1">{isEn ? "Initial guidance — not legal advice" : "Orientation initiale — pas un avis juridique"}</p>
              <p>{isEn ? "This result is an initial orientation based on the information entered. It does not replace individual legal advice, does not by itself create an attorney-client relationship and does not validate a real file." : "Ce résultat constitue une orientation initiale basée sur les informations déclarées. Il ne remplace pas une analyse juridique individualisée, ne crée pas à lui seul une relation avocat-client et ne vaut pas validation d'un dossier concret."}</p>
              <p className="mt-2">{isEn ? "Belgian economic immigration rules depend on criteria that cannot all be captured by a simulator. No filing should be made on this basis alone without prior professional verification." : "Les règles d'immigration économique en Belgique varient selon des critères qui ne peuvent pas tous être captés par un simulateur. Aucune démarche ne devrait être engagée sur cette seule base sans vérification professionnelle préalable."}</p>
            </div>

            {/* Lead capture */}
            {!sent ? (
              <div className="rounded-[20px] border-2 border-[#1E3A78] bg-[#f5f8ff] p-5">
                <p className="text-sm font-bold text-[#1E3A78]">{isEn ? "Secure this recruitment with LEXPAT" : "Sécuriser ce recrutement avec LEXPAT"}</p>
                <p className="mt-1 text-xs text-[#607086]">{isEn ? "Receive a tailored legal review from our firm." : "Recevez une analyse juridique personnalisée par notre cabinet."}</p>
                <form onSubmit={submitLead} className="mt-4 space-y-3">
                  <input className="field-input" type="email" required placeholder={isEn ? "Business email *" : "Email professionnel *"}
                    value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="field-input" type="text" placeholder={isEn ? "Company" : "Entreprise"}
                      value={lead.company} onChange={(e) => setLead((l) => ({ ...l, company: e.target.value }))} />
                    <input className="field-input" type="tel" placeholder={isEn ? "Phone" : "Téléphone"}
                      value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button type="submit" disabled={!lead.email || sending}
                      className="flex-1 rounded-[14px] py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1E3A78, #204E97)" }}>
                      {sending ? (isEn ? "Sending..." : "Envoi…") : (isEn ? "Book a legal review →" : "Réserver une analyse juridique →")}
                    </button>
                    <a href="/employeurs"
                      className="flex-1 rounded-[14px] border border-[#dce8f5] py-3 text-center text-sm font-semibold text-[#607086] transition hover:border-[#1E3A78] hover:text-[#1E3A78]">
                      {isEn ? "Post the opening on LEXPAT Connect" : "Déposer l'offre sur LEXPAT Connect"}
                    </a>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-[20px] border border-[#6ee7b7] bg-[#f0fdf4] p-5 text-center">
                <p className="text-lg font-bold text-[#065f46]">{isEn ? "✓ Request sent" : "✓ Demande envoyée"}</p>
                <p className="mt-1 text-sm text-[#065f46]">{isEn ? "The LEXPAT team will contact you shortly." : "L'équipe LEXPAT vous contactera dans les meilleurs délais."}</p>
              </div>
            )}

            <div className="text-center">
              <button onClick={reset} className="text-sm text-[#8a9bb0] underline transition hover:text-[#1E3A78] hover:no-underline">
                {isEn ? "Start a new simulation" : "Recommencer une simulation"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
