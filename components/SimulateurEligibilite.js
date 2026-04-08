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
    offerPublished, euresPublished, candidatesRefused,
  } = data;

  const regionLabels  = parseRegionSelection(region);
  const regionName    = regionLabels[0] || "la région sélectionnée";
  const sal           = Number(salary) || 0;
  const positives     = [];
  const warnings      = [];

  /* ── Branche 1 : UE / EEE / Suisse ───────────────────────────────────── */
  if (EU_NATIONALITIES.has(nationality)) {
    return {
      verdict:    "EU_EXEMPT",
      label:      "Ressortissant UE / EEE / CH",
      color:      "teal",
      procedure:  "Libre circulation",
      delay:      "Aucun permis requis",
      complexity: "Faible",
      positives:  ["Libre circulation : aucun permis de travail n'est requis pour exercer une activité salariée en Belgique."],
      warnings:   [],
    };
  }

  const thqThreshold = getTHQThreshold(region);
  const marketTest   = getMarketTestDuration(region);
  const hasGoodDiploma = ["Master / Licence (bac+5)", "Doctorat"].includes(diploma);
  const thqOk        = isHQ && hasGoodDiploma && sal >= thqThreshold;
  const shortage     = isShortageJob(data);
  const flandre      = isFlandre(region);

  /* ── Vérification préalable : salaire minimum légal ─────────────────── */
  if (sal < RMMMG) {
    warnings.push(
      `Salaire proposé (${fmt(sal)} €/mois) inférieur au RMMMG légal en vigueur depuis le 1er avril 2026 : ${fmt(RMMMG)} €/mois. ` +
      `La rémunération doit atteindre ce minimum pour tout travailleur étranger. Le dossier ne peut pas être introduit en l'état.`
    );
    return {
      verdict:    "BLOCKED",
      label:      "Salaire sous le minimum légal",
      color:      "red",
      procedure:  "Dossier irrecevable",
      delay:      "—",
      complexity: "Bloquant",
      positives:  [],
      warnings,
    };
  }

  /* ── Branche 2 : Travailleur hautement qualifié (THQ) ────────────────── */
  if (thqOk) {
    positives.push(
      `Profil THQ validé : ${diploma} + salaire de ${fmt(sal)} €/mois ≥ seuil ${fmt(thqThreshold)} €/mois pour ${regionName}.`
    );
    positives.push("Dispensé de l'examen du marché de l'emploi — aucune publication d'offre ni justification de refus n'est requise.");
    positives.push("Délai légal de traitement : 4 mois maximum (réduit à 3 mois pour la Carte Bleue Européenne).");
    if (contractType === "CDI") positives.push("Contrat CDI : facteur favorable à l'instruction du dossier.");
    if (contractType === "CDD") warnings.push("Un CDD est acceptable pour le régime THQ, mais la durée doit être suffisante pour justifier le séjour demandé.");
    return {
      verdict:    "ELIGIBLE_DIRECT",
      label:      "Éligible — profil THQ dispensé",
      color:      "green",
      procedure:  "Permis unique — voie THQ",
      delay:      "4 mois max (3 mois Carte Bleue UE)",
      complexity: "Modérée",
      positives,
      warnings,
    };
  }

  /* Signaler pourquoi THQ refusé si la case était cochée */
  if (isHQ) {
    if (!hasGoodDiploma)
      warnings.push(`Le régime THQ exige un diplôme Master ou Doctorat. Le niveau "${diploma || "non renseigné"}" n'ouvre pas droit à cette voie.`);
    else if (sal < thqThreshold)
      warnings.push(`Le salaire (${fmt(sal)} €) est inférieur au seuil THQ de ${fmt(thqThreshold)} €/mois pour ${regionName}. Le dossier sera traité en voie classique.`);
  }

  /* Salaire au-dessus du RMMMG ✓ */
  positives.push(`Salaire de ${fmt(sal)} €/mois ≥ RMMMG légal (${fmt(RMMMG)} €). Condition de base respectée.`);

  /* ── Branche 3 : Métier en pénurie ───────────────────────────────────── */
  if (shortage) {
    positives.push(`"${profession}" figure sur la liste officielle des métiers en pénurie pour ${regionName} (2026).`);

    /* Flandre : dispense totale du test marché pour les knelpuntberoepen */
    if (flandre) {
      positives.push("En Flandre, les métiers en pénurie (knelpuntberoepen) sont entièrement dispensés du test du marché de l'emploi.");
      positives.push("Délai légal de traitement : 4 mois maximum.");
      if (contractType === "CDI") positives.push("Contrat CDI : facteur favorable.");
      if (contractType === "CDD") warnings.push("CDD : la durée doit être suffisante pour couvrir la période du permis demandé.");
      return {
        verdict:    "ELIGIBLE_DIRECT",
        label:      "Éligible — métier en pénurie (Flandre)",
        color:      "green",
        procedure:  "Permis unique — métier en pénurie / dispense Flandre",
        delay:      "4 mois max",
        complexity: "Modérée",
        positives,
        warnings,
      };
    }

    /* Bruxelles / Wallonie : test marché allégé (5 semaines) */
    positives.push(
      `À ${regionName}, les métiers en pénurie facilitent la procédure mais une publication minimale de ` +
      `${marketTest.label} sur ${marketTest.platform} reste requise avant l'introduction du dossier.`
    );

    const marketDone = offerPublished && (Number(candidatesRefused) >= 1 || euresPublished);
    if (marketDone) {
      positives.push("Test marché engagé : publication effectuée et candidats locaux documentés.");
      if (contractType === "CDI") positives.push("Contrat CDI : facteur favorable.");
      return {
        verdict:    "ELIGIBLE_DIRECT",
        label:      "Éligible — risque maîtrisé",
        color:      "green",
        procedure:  `Permis unique — métier en pénurie (${marketTest.platform})`,
        delay:      "4 mois max",
        complexity: "Modérée",
        positives,
        warnings,
      };
    }

    warnings.push(`Publication de l'offre requise pendant ${marketTest.label} minimum sur ${marketTest.platform} avant introduction.`);
    if (!euresPublished) warnings.push("Publication EURES recommandée pour renforcer la preuve du test marché.");
    return {
      verdict:    "MARKET_TEST_REQUIRED",
      label:      "Test marché à compléter",
      color:      "orange",
      procedure:  `Permis unique — métier en pénurie (${marketTest.platform})`,
      delay:      "4 mois max (après test marché)",
      complexity: "Modérée",
      positives,
      warnings,
    };
  }

  /* ── Branche 4 : Permis unique classique — test marché complet ──────── */
  warnings.push(
    `"${profession || "Ce métier"}" ne figure pas sur la liste des métiers en pénurie — ` +
    `l'examen complet du marché de l'emploi est obligatoire.`
  );
  warnings.push(
    `Durée minimale de publication : ${marketTest.label} sur ${marketTest.platform} + EURES, ` +
    `avec justification des refus de candidats locaux et européens.`
  );

  const marketTestFull    = offerPublished && euresPublished && Number(candidatesRefused) >= 3;
  const marketTestPartial = offerPublished && (euresPublished || Number(candidatesRefused) >= 1);

  if (marketTestFull) {
    positives.push("Test marché complet : publication régionale + EURES + candidats locaux documentés.");
    if (contractType === "CDI") positives.push("Contrat CDI : facteur favorable.");
    return {
      verdict:    "ELIGIBLE_DIRECT",
      label:      "Éligible — test marché satisfait",
      color:      "green",
      procedure:  "Permis unique classique",
      delay:      "4 mois max",
      complexity: "Élevée",
      positives,
      warnings,
    };
  }

  if (marketTestPartial) {
    positives.push("Test marché partiellement engagé.");
    warnings.push(`Complétez la procédure : ${marketTest.label} de publication + documentation des refus de candidats locaux/européens.`);
    return {
      verdict:    "MARKET_TEST_REQUIRED",
      label:      "Test marché à compléter",
      color:      "orange",
      procedure:  "Permis unique classique",
      delay:      "4 mois max (après test marché complet)",
      complexity: "Élevée",
      positives,
      warnings,
    };
  }

  warnings.push("Aucune démarche de test marché engagée. Ce prérequis est obligatoire et doit précéder l'introduction du dossier.");
  return {
    verdict:    "HIGH_RISK",
    label:      "Test marché non engagé",
    color:      "red",
    procedure:  "Permis unique classique",
    delay:      "Indéterminé",
    complexity: "Très élevée",
    positives,
    warnings,
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
                      <p className="mt-0.5 text-xs text-[#607086]">
                        Requiert : diplôme Master ou Doctorat
                        {thqThreshold
                          ? ` + salaire ≥ ${fmt(thqThreshold)} €/mois pour ${regionLabels[0] || "cette région"}.`
                          : "."
                        }
                        {" "}Le profil THQ est entièrement dispensé du test du marché de l'emploi.
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

            {/* Points favorables */}
            {result.positives.length > 0 && (
              <div className="rounded-[16px] border border-[#6ee7b7] bg-[#f0fdf4] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#065f46]">Points favorables</p>
                <ul className="space-y-2">
                  {result.positives.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#065f46]">
                      <span className="mt-1 shrink-0 text-[#10b981]">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Points d'attention */}
            {result.warnings.length > 0 && (
              <div className="rounded-[16px] border border-[#fed7aa] bg-[#fff7ed] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#92400e]">Points d'attention</p>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#92400e]">
                      <span className="mt-1 shrink-0">⚠</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mention légale */}
            <p className="rounded-[12px] bg-[#f5f8ff] px-4 py-3 text-xs text-[#8a9bb0] leading-relaxed">
              <strong className="text-[#607086]">Avertissement</strong> — Cette simulation est fournie à titre indicatif et ne constitue pas un avis juridique. Les règles d'immigration économique varient selon la situation individuelle. Consultez un professionnel agréé avant toute démarche.
            </p>

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
