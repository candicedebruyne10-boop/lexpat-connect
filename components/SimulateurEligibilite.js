"use client";

import { useState } from "react";
import RegionSelector from "./RegionSelector";
import {
  getProfessionGroupsForRegions,
  parseRegionSelection,
  sectorOptions,
} from "../lib/professions";

/* ── Nationalités UE / EEE / Suisse ─────────────────────────────────────── */
const EU_NATIONALITIES = new Set([
  "Allemagne","Autriche","Belgique","Bulgarie","Chypre","Croatie","Danemark",
  "Espagne","Estonie","Finlande","France","Grèce","Hongrie","Irlande","Italie",
  "Lettonie","Lituanie","Luxembourg","Malte","Pays-Bas","Pologne","Portugal",
  "République tchèque","Roumanie","Slovaquie","Slovénie","Suède",
  "Islande","Liechtenstein","Norvège","Suisse","Royaume-Uni",
]);

/* ── Seuils salariaux 2026 ───────────────────────────────────────────────── */
/** RMMMG au 1er avril 2026 (temps plein, 18 ans et +) */
const RMMMG = 2189.81;

/**
 * Seuils THQ mensuels bruts par région — 2026
 * Bruxelles : 3 703,44 €/mois
 * Wallonie   : 3 703,44 €/mois (référence fédérale identique)
 * Flandre    : 50 310 €/an ÷ 12 ≈ 4 192,50 €/mois
 */
const THQ_THRESHOLDS = {
  bruxelles: 3703.44,
  wallonie:  3703.44,
  flandre:   4192.50,
};

function getTHQThreshold(region) {
  const labels = parseRegionSelection(region).map((r) => r.toLowerCase());
  if (labels.some((r) => r.includes("flandre"))) return THQ_THRESHOLDS.flandre;
  if (labels.some((r) => r.includes("bruxelles"))) return THQ_THRESHOLDS.bruxelles;
  if (labels.some((r) => r.includes("wallonie") || r.includes("wallonne"))) return THQ_THRESHOLDS.wallonie;
  // Multi-région : seuil le plus conservateur
  return Math.min(...Object.values(THQ_THRESHOLDS));
}

/** Délai légal minimum de publication pour le test marché */
function getMarketTestDuration(region) {
  const labels = parseRegionSelection(region).map((r) => r.toLowerCase());
  if (labels.some((r) => r.includes("flandre"))) return { weeks: 9, label: "9 semaines", platform: "VDAB" };
  if (labels.some((r) => r.includes("bruxelles"))) return { weeks: 5, label: "5 semaines", platform: "Actiris" };
  return { weeks: 5, label: "5 semaines", platform: "Forem" };
}

const DIPLOMA_OPTIONS = [
  "Pas de diplôme / CESS non obtenu",
  "CESS (secondaire supérieur)",
  "Bachelier (bac+3)",
  "Master / Licence (bac+5)",
  "Doctorat",
];

const NATIONALITIES = [
  "Albanie","Algérie","Angola","Bangladesh","Bénin","Bolivie","Botswana",
  "Brésil","Burkina Faso","Burundi","Cameroun","Cap-Vert","Chine","Colombie",
  "Congo (RDC)","Congo (Rep.)","Côte d'Ivoire","Cuba","Égypte","Éthiopie",
  "Gabon","Ghana","Guatemala","Guinée","Haïti","Honduras","Inde","Indonésie",
  "Iran","Irak","Jamaïque","Jordanie","Kazakhstan","Kenya","Kosovo","Liban",
  "Libye","Madagascar","Malawi","Mali","Maroc","Mauritanie","Mexique",
  "Moldavie","Mongolie","Mozambique","Myanmar","Népal","Nicaragua","Niger",
  "Nigeria","Ouganda","Pakistan","Palestine","Panama","Paraguay","Pérou",
  "Philippines","Rwanda","Sénégal","Sierra Leone","Somalie","Soudan",
  "Sri Lanka","Syrie","Tanzanie","Tchad","Thaïlande","Togo","Tunisie",
  "Turquie","Ukraine","Vietnam","Yémen","Zambie","Zimbabwe",
  ...Array.from(EU_NATIONALITIES),
].sort();

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n) {
  return Number(n).toLocaleString("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isTHQQualified(data) {
  const sal = Number(data.salary) || 0;
  const hasGoodDiploma = ["Master / Licence (bac+5)", "Doctorat"].includes(data.diploma);
  return data.isHQ && hasGoodDiploma && sal >= getTHQThreshold(data.region);
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
function computeEligibility(data) {
  const {
    nationality, region, profession, salary, isHQ, diploma, contractType,
    fullTime, experience,
    offerPublished, euresPublished, candidatesRefused,
  } = data;

  const regionLabels   = parseRegionSelection(region);
  const regionName     = regionLabels[0] || "la région sélectionnée";
  const sal            = Number(salary) || 0;
  const expYears       = Number(experience) || 0;
  const positives      = [];
  const warnings       = [];
  const nextSteps      = [];

  /* ── Branche 1 : UE / EEE / Suisse ───────────────────────────────────── */
  if (EU_NATIONALITIES.has(nationality)) {
    return {
      verdict:    "EU_EXEMPT",
      label:      "Aucune démarche d'autorisation requise",
      color:      "teal",
      procedure:  "Libre circulation",
      delay:      "Aucun permis requis",
      complexity: "Faible",
      positives:  ["Ressortissant UE/EEE/CH : libre circulation garantie par les traités européens. Aucun permis de travail ni d'autorisation préalable n'est requis pour exercer une activité salariée en Belgique."],
      warnings:   [],
      nextSteps:  ["Vérifier que le candidat dispose bien d'un titre de séjour valide si nécessaire.", "S'assurer que le contrat respecte le droit belge du travail (CCT, barèmes sectoriels)."],
    };
  }

  const thqThreshold = getTHQThreshold(region);
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
      verdict:    "BLOCKED",
      label:      "Dossier irrecevable en l'état",
      color:      "red",
      procedure:  "Condition salariale non remplie",
      delay:      "—",
      complexity: "Bloquant",
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
    positives.push(`Niveau de diplôme (${diploma}) et salaire (${fmt(sal)} €/mois) atteignent les critères du régime hautement qualifié pour ${regionName} — seuil applicable : ${fmt(thqThreshold)} €/mois.`);
    positives.push("Ce régime dispense entièrement de l'examen du marché de l'emploi : aucune publication d'offre ni justification de refus de candidats locaux n'est exigée.");
    positives.push("Délai légal de traitement : 4 mois maximum (réduit à 3 mois pour la Carte Bleue Européenne).");
    if (contractType === "CDI") positives.push("Contrat CDI : élément favorable à l'instruction.");
    if (expYears >= 6) positives.push(`Expérience professionnelle significative (${expYears}+ ans) : renforce la crédibilité du profil auprès de l'autorité compétente.`);
    if (contractType === "CDD") warnings.push("Un CDD est possible en régime THQ, mais sa durée doit justifier la période de séjour demandée.");
    return {
      verdict:    "THQ_FAVORABLE",
      label:      "Profil favorable — orientation vers la voie THQ",
      color:      "green",
      procedure:  "Permis unique — voie Travailleur Hautement Qualifié",
      delay:      "4 mois max (3 mois Carte Bleue UE)",
      complexity: "Modérée",
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
        verdict:    "SHORTAGE_FAVORABLE",
        label:      "Situation favorable à une analyse approfondie",
        color:      "green",
        procedure:  "Permis unique — métier en pénurie / dispense Flandre",
        delay:      "4 mois max",
        complexity: "Modérée",
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
        verdict:    "SHORTAGE_FAVORABLE",
        label:      "Situation favorable à une analyse approfondie",
        color:      "green",
        procedure:  `Permis unique — métier en pénurie (${marketTest.platform})`,
        delay:      "4 mois max",
        complexity: "Modérée",
        positives,
        warnings,
        nextSteps:  [
          "Documenter et archiver formellement tous les refus de candidats locaux (motifs écrits obligatoires).",
          "S'assurer que la durée de publication atteint bien ${marketTest.label} avant l'introduction.",
          "Consulter un juriste pour préparer et valider le dossier complet.",
        ],
      };
    }

    warnings.push(`La publication de l'offre sur ${marketTest.platform} pendant au minimum ${marketTest.label} est requise avant de pouvoir introduire la demande.`);
    if (!euresPublished) warnings.push("La publication sur EURES est fortement recommandée pour étayer la preuve du test marché.");
    return {
      verdict:    "PENDING_STEPS",
      label:      "Dossier à sécuriser avant introduction",
      color:      "orange",
      procedure:  `Permis unique — métier en pénurie (${marketTest.platform})`,
      delay:      "4 mois max (après test marché)",
      complexity: "Modérée",
      positives,
      warnings,
      nextSteps:  [
        `Publier l'offre sur ${marketTest.platform} et EURES pendant ${marketTest.label} minimum.`,
        "Documenter les candidatures reçues et les motifs de refus.",
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

  const marketTestFull    = offerPublished && euresPublished && Number(candidatesRefused) >= 3;
  const marketTestPartial = offerPublished && (euresPublished || Number(candidatesRefused) >= 1);

  if (marketTestFull) {
    positives.push("Les trois composantes du test marché sont engagées : publication régionale, EURES et candidats locaux documentés.");
    if (contractType === "CDI") positives.push("Contrat CDI : élément favorable à l'instruction.");
    if (expYears >= 3) positives.push("L'expérience du candidat renforce l'argumentation sur l'inadéquation des profils locaux.");
    return {
      verdict:    "CLASSIC_FAVORABLE",
      label:      "Dossier favorable — à consolider avec un juriste",
      color:      "green",
      procedure:  "Permis unique classique",
      delay:      "4 mois max",
      complexity: "Élevée",
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
      verdict:    "PENDING_STEPS",
      label:      "Dossier à sécuriser avant introduction",
      color:      "orange",
      procedure:  "Permis unique classique",
      delay:      "4 mois max (après test marché complet)",
      complexity: "Élevée",
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
    verdict:    "UNCERTAIN",
    label:      "Situation juridiquement plus incertaine",
    color:      "red",
    procedure:  "Permis unique classique",
    delay:      "Indéterminé",
    complexity: "Très élevée",
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
function StepBar({ current, total }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done   = n < current;
          const active = n === current;
          return (
            <div key={n} className="flex items-center flex-1">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                done    ? "bg-[#57B7AF] text-white" :
                active  ? "bg-[#1E3A78] text-white ring-4 ring-[#1E3A78]/20" :
                          "border-2 border-[#dce8f5] bg-white text-[#8a9bb0]"
              }`}>
                {done ? "✓" : n}
              </div>
              {n < total && (
                <div className={`flex-1 mx-1 h-1 rounded-full ${done ? "bg-[#57B7AF]" : "bg-[#edf1f5]"}`} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[#8a9bb0] text-right">Étape {current} sur {total}</p>
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
  nationality: "", residence: "", diploma: "", experience: "",
  // Step 3
  salary: "", isHQ: false,
  // Step 4
  offerPublished: false, euresPublished: false, candidatesRefused: "0",
};

export default function SimulateurEligibilite() {
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
      setResult(computeEligibility(data));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    // THQ validé après étape 3 — sauter étape 4 (test marché non requis)
    if (step === 3 && isTHQQualified(data)) {
      setResult(computeEligibility(data));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    // Métier en pénurie en Flandre après étape 3 — dispense totale du test marché
    if (step === 3 && isShortageJob(data) && isFlandre(data.region)) {
      setResult(computeEligibility(data));
      setStep(TOTAL_STEPS + 1);
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setResult(computeEligibility(data));
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

  const professionGroups = getProfessionGroupsForRegions(data.region);
  const regionLabels     = parseRegionSelection(data.region);
  const thqThreshold     = data.region ? getTHQThreshold(data.region) : null;
  const marketTest       = data.region ? getMarketTestDuration(data.region) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-[32px] border border-[#e4edf4] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">

        {/* ── ÉTAPES 1–4 ─────────────────────────────────────────────────── */}
        {step <= TOTAL_STEPS && (
          <>
            <StepBar current={step} total={TOTAL_STEPS} />

            {/* ÉTAPE 1 — Contexte de l'emploi */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">Contexte de l'emploi</h2>
                <p className="text-sm text-[#607086]">Indiquez la région, le métier et le type de contrat proposé.</p>

                <label>
                  <FieldLabel required>Région de recrutement</FieldLabel>
                  <RegionSelector
                    value={regionLabels}
                    onChange={(v) => set("region", v)}
                    helperText="Sélectionnez la région où le travailleur sera basé."
                  />
                </label>

                <label>
                  <FieldLabel required>Métier recherché</FieldLabel>
                  {data.region ? (
                    <select
                      className="field-input"
                      value={data.profession}
                      onChange={(e) => set("profession", e.target.value)}
                      required
                    >
                      <option value="" disabled>Sélectionnez le métier visé</option>
                      {professionGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((job) => (
                            <option key={`${group.label}-${job}`} value={job}>{job}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
                      Sélectionnez d'abord une région pour choisir un métier
                    </div>
                  )}
                  {data.region && regionLabels.length === 1 && (
                    <p className="mt-1.5 text-xs text-[#57b7af]">
                      Liste officielle des métiers en pénurie pour {regionLabels[0]} — mise à jour 2026
                    </p>
                  )}
                </label>

                {data.profession === "Autre profession" && (
                  <label>
                    <FieldLabel required>Précisez l'intitulé du poste</FieldLabel>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Ex. : Technicien CVC"
                      value={data.sector}
                      onChange={(e) => set("sector", e.target.value)}
                    />
                  </label>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <FieldLabel>Type de contrat</FieldLabel>
                    <select className="field-input" value={data.contractType} onChange={(e) => set("contractType", e.target.value)}>
                      <option value="">Sélectionnez</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Temps de travail</FieldLabel>
                    <select className="field-input" value={data.fullTime} onChange={(e) => set("fullTime", e.target.value)}>
                      <option value="">Sélectionnez</option>
                      <option value="full">Temps plein</option>
                      <option value="partial">Temps partiel</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — Profil du candidat */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">Profil du candidat</h2>
                <p className="text-sm text-[#607086]">Ces informations permettent de détecter si un permis de travail est requis.</p>

                <label>
                  <FieldLabel required>Nationalité</FieldLabel>
                  <select className="field-input" value={data.nationality} onChange={(e) => set("nationality", e.target.value)} required>
                    <option value="" disabled>Sélectionnez la nationalité</option>
                    <optgroup label="Hors UE / EEE">
                      {NATIONALITIES.filter((n) => !EU_NATIONALITIES.has(n)).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </optgroup>
                    <optgroup label="UE / EEE / Suisse — libre circulation">
                      {NATIONALITIES.filter((n) => EU_NATIONALITIES.has(n)).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </optgroup>
                  </select>
                  {EU_NATIONALITIES.has(data.nationality) && (
                    <p className="mt-1.5 text-xs text-[#57b7af] font-semibold">
                      ✓ Ressortissant UE/EEE/CH — aucun permis de travail requis. Résultat disponible à l'étape suivante.
                    </p>
                  )}
                </label>

                <label>
                  <FieldLabel>Pays de résidence actuel</FieldLabel>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="Ex. : Maroc, Sénégal, Inde…"
                    value={data.residence}
                    onChange={(e) => set("residence", e.target.value)}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <FieldLabel>Niveau de diplôme</FieldLabel>
                    <select className="field-input" value={data.diploma} onChange={(e) => set("diploma", e.target.value)}>
                      <option value="">Sélectionnez</option>
                      {DIPLOMA_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </label>
                  <label>
                    <FieldLabel>Années d'expérience</FieldLabel>
                    <select className="field-input" value={data.experience} onChange={(e) => set("experience", e.target.value)}>
                      <option value="">Sélectionnez</option>
                      <option value="0">Moins d'1 an</option>
                      <option value="1">1 à 2 ans</option>
                      <option value="3">3 à 5 ans</option>
                      <option value="6">6 à 10 ans</option>
                      <option value="11">Plus de 10 ans</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — Conditions salariales */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">Conditions salariales</h2>
                <p className="text-sm text-[#607086]">Le salaire est un critère légal déterminant dans l'instruction du permis unique.</p>

                <label>
                  <FieldLabel required>Salaire mensuel brut (€)</FieldLabel>
                  <input
                    className="field-input"
                    type="number"
                    min="0"
                    step="50"
                    placeholder="Ex. : 2800"
                    value={data.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    required
                  />
                  <p className="mt-1.5 text-xs text-[#8a9bb0]">
                    Minimum légal (RMMMG au 1er avril 2026) : {fmt(RMMMG)} €/mois
                    {thqThreshold && ` · Seuil THQ pour ${regionLabels[0] || "cette région"} : ${fmt(thqThreshold)} €/mois`}
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
                      <p className="text-sm font-semibold text-[#1E3A78]">Travailleur hautement qualifié (THQ)</p>
                      <p className="mt-1 text-xs text-[#607086]">
                        Cochez si le poste relève d'une fonction hautement qualifiée : <strong>cadre dirigeant, ingénieur spécialisé, chercheur, médecin, expert IT, juriste senior</strong>, etc.
                      </p>
                      <p className="mt-1 text-xs text-[#607086]">
                        Conditions cumulatives : <strong>diplôme Master ou Doctorat</strong>
                        {thqThreshold
                          ? ` + salaire ≥ ${fmt(thqThreshold)} €/mois (seuil ${regionLabels[0] || "régional"} 2026).`
                          : "."
                        }
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#1E3A78]">
                        ✦ Si ces critères sont réunis, le profil est entièrement dispensé du test du marché de l'emploi.
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
                        ? "✓ Critères THQ validés — vous passerez directement au résultat sans test marché."
                        : !hasGoodDiploma
                          ? `⚠ Diplôme insuffisant pour le THQ (Master ou Doctorat requis).`
                          : `⚠ Salaire (${fmt(sal)} €) inférieur au seuil THQ de ${fmt(thqThreshold)} €/mois — voie classique.`
                      }
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ÉTAPE 4 — Test du marché de l'emploi */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#1E3A78]">Test du marché de l'emploi</h2>
                {marketTest && (
                  <div className="rounded-[12px] border border-[#dce8f5] bg-[#f0f6ff] px-4 py-3 text-xs text-[#1E3A78]">
                    <strong>Règle pour {regionLabels[0] || "cette région"} :</strong> publication obligatoire pendant{" "}
                    <strong>{marketTest.label} minimum</strong> sur {marketTest.platform}
                    {!isFlandre(data.region) && " (+ EURES recommandé)"} avant d'introduire le dossier.
                  </div>
                )}

                <div className="space-y-3">
                  <div className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1E3A78]"
                        checked={data.offerPublished} onChange={(e) => set("offerPublished", e.target.checked)} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A78]">
                          Offre publiée sur {marketTest ? marketTest.platform : "la plateforme régionale"}
                        </p>
                        <p className="mt-0.5 text-xs text-[#607086]">
                          Publication sur la plateforme régionale compétente pendant la durée requise.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="rounded-[16px] border border-[#dce8f5] bg-[#f5f8ff] p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1E3A78]"
                        checked={data.euresPublished} onChange={(e) => set("euresPublished", e.target.checked)} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A78]">Offre publiée sur EURES</p>
                        <p className="mt-0.5 text-xs text-[#607086]">Portail européen de la mobilité professionnelle — renforce la preuve du test marché.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <label>
                  <FieldLabel>Candidats locaux / européens refusés</FieldLabel>
                  <select className="field-input" value={data.candidatesRefused} onChange={(e) => set("candidatesRefused", e.target.value)}>
                    <option value="0">0 — pas encore lancé</option>
                    <option value="1">1 à 2 candidats</option>
                    <option value="3">3 à 5 candidats</option>
                    <option value="6">6 ou plus</option>
                  </select>
                  <p className="mt-1.5 text-xs text-[#8a9bb0]">
                    Les refus motivés doivent être documentés et justifiés pour figurer au dossier.
                  </p>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={back}
                  className="rounded-2xl border border-[#dce8f5] px-5 py-2.5 text-sm font-semibold text-[#607086] transition hover:border-[#1E3A78] hover:text-[#1E3A78]">
                  ← Retour
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
                {step === TOTAL_STEPS ? "Voir le résultat →" : "Étape suivante →"}
              </button>
            </div>
          </>
        )}

        {/* ── RÉSULTAT ─────────────────────────────────────────────────── */}
        {step === TOTAL_STEPS + 1 && result && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#57B7AF]">Résultat de votre simulation</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1E3A78]">{data.profession || "Votre poste"}</h2>
              <p className="text-sm text-[#607086]">{parseRegionSelection(data.region)[0] || "Belgique"}</p>
            </div>

            {/* Badge verdict */}
            <VerdictBadge label={result.label} color={result.color} />

            {/* Métriques légales */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Procédure",      value: result.procedure },
                { label: "Délai légal max",value: result.delay },
                { label: "Complexité",     value: result.complexity },
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
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#065f46]">Ce qui plaide en faveur du dossier</p>
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
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#92400e]">Ce qui fragilise le dossier ou reste à vérifier</p>
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
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1E3A78]">Prochaines étapes recommandées</p>
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
              <p className="font-bold text-[#1E3A78] mb-1">Orientation initiale — pas un avis juridique</p>
              <p>Ce résultat constitue une orientation initiale basée sur les informations déclarées. Il ne remplace pas une analyse juridique individualisée. Une vérification complémentaire peut être nécessaire selon la région, le poste et la situation personnelle du candidat.</p>
              <p className="mt-2">Les règles d'immigration économique en Belgique varient selon des critères qui ne peuvent pas tous être captés par un simulateur. Nous recommandons de consulter un professionnel agréé avant d'introduire toute démarche.</p>
            </div>

            {/* Lead capture */}
            {!sent ? (
              <div className="rounded-[20px] border-2 border-[#1E3A78] bg-[#f5f8ff] p-5">
                <p className="text-sm font-bold text-[#1E3A78]">Sécuriser ce recrutement avec LEXPAT</p>
                <p className="mt-1 text-xs text-[#607086]">Recevez une analyse juridique personnalisée par notre cabinet.</p>
                <form onSubmit={submitLead} className="mt-4 space-y-3">
                  <input className="field-input" type="email" required placeholder="Email professionnel *"
                    value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="field-input" type="text" placeholder="Entreprise"
                      value={lead.company} onChange={(e) => setLead((l) => ({ ...l, company: e.target.value }))} />
                    <input className="field-input" type="tel" placeholder="Téléphone"
                      value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button type="submit" disabled={!lead.email || sending}
                      className="flex-1 rounded-[14px] py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1E3A78, #204E97)" }}>
                      {sending ? "Envoi…" : "Réserver une analyse juridique →"}
                    </button>
                    <a href="/employeurs"
                      className="flex-1 rounded-[14px] border border-[#dce8f5] py-3 text-center text-sm font-semibold text-[#607086] transition hover:border-[#1E3A78] hover:text-[#1E3A78]">
                      Déposer l'offre sur LEXPAT Connect
                    </a>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-[20px] border border-[#6ee7b7] bg-[#f0fdf4] p-5 text-center">
                <p className="text-lg font-bold text-[#065f46]">✓ Demande envoyée</p>
                <p className="mt-1 text-sm text-[#065f46]">L'équipe LEXPAT vous contactera dans les meilleurs délais.</p>
              </div>
            )}

            <div className="text-center">
              <button onClick={reset} className="text-sm text-[#8a9bb0] underline transition hover:text-[#1E3A78] hover:no-underline">
                Recommencer une simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
