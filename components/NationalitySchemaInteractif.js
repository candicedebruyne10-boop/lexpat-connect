"use client";

import { useMemo, useState } from "react";

const OPTIONS = {
  age: [
    { value: "minor", label: "Moins de 18 ans" },
    { value: "adult", label: "18 ans ou plus" },
  ],
  yesNo: [
    { value: "yes", label: "Oui" },
    { value: "no", label: "Non" },
  ],
  years: [
    { value: "less5", label: "Moins de 5 ans" },
    { value: "five", label: "5 à 9 ans" },
    { value: "ten", label: "10 ans ou plus" },
  ],
};

const BASE_DOCUMENTS = [
  "Acte de naissance, avec légalisation/apostille et traduction si nécessaire",
  "Certificat de résidence avec historique des adresses",
  "Copie recto verso de la carte de séjour, certifiée conforme",
  "Preuve du paiement du droit d'enregistrement",
];

const PROCEDURES = {
  minor: {
    title: "Nationalité belge avant 18 ans",
    article: "Attribution de la nationalité belge",
    status: "orientation",
    intro:
      "Pour un mineur, on parle le plus souvent d'attribution de la nationalité. La base dépend de la naissance, de l'adoption, de l'apatridie, de la situation des parents et du lien avec la Belgique.",
    conditions: [
      "Vérifier si l'un des parents est belge ou le devient",
      "Vérifier le lieu de naissance, l'adoption éventuelle et la résidence en Belgique",
      "Faire identifier l'article exact par le cabinet LEXPAT",
    ],
    documents: [
      "Acte de naissance de l'enfant",
      "Preuves de filiation ou d'adoption",
      "Preuves de nationalité ou de résidence des parents",
      "Documents administratifs demandés selon la situation",
    ],
    next:
      "La situation d'un mineur doit être analysée avec les parents par le cabinet LEXPAT. Le simulateur adulte ne suffit pas.",
  },
  bornBelgium: {
    title: "Déclaration de nationalité pour personne née en Belgique",
    article: "Article 12bis, §1, 1° CNB",
    status: "likely",
    intro:
      "Cette voie vise les personnes majeures nées en Belgique et qui y ont toujours séjourné légalement depuis leur naissance.",
    conditions: [
      "Avoir au moins 18 ans",
      "Être né en Belgique",
      "Avoir toujours eu sa résidence principale et légale en Belgique",
      "Disposer d'un titre de séjour à durée illimitée au moment de la demande",
    ],
    documents: BASE_DOCUMENTS,
    next: "Faire vérifier par le cabinet LEXPAT la liste précise des pièces et l'absence d'interruption de séjour.",
  },
  fiveYears: {
    title: "Déclaration après 5 ans de séjour légal",
    article: "Article 12bis, §1, 2° CNB",
    status: "likely",
    intro:
      "Cette voie concerne les majeurs qui totalisent 5 ans de séjour légal ininterrompu et qui prouvent la langue, l'intégration sociale et la participation économique.",
    conditions: [
      "Avoir au moins 18 ans",
      "Avoir 5 ans de séjour légal ininterrompu",
      "Disposer d'un titre de séjour à durée illimitée",
      "Prouver la connaissance d'une langue nationale",
      "Prouver l'intégration sociale",
      "Prouver la participation économique, par exemple 468 jours de travail ou 6 trimestres de cotisations comme indépendant",
    ],
    documents: [
      ...BASE_DOCUMENTS,
      "Preuve de langue ou preuve couvrant automatiquement la langue",
      "Diplôme, formation professionnelle, parcours d'intégration ou preuve de travail ininterrompu",
      "Comptes individuels, fiches utiles ou attestations de cotisations sociales",
    ],
    next: "Rassembler les preuves de langue, d'intégration et de participation économique avant le dépôt.",
  },
  spouseOrParent: {
    title: "Déclaration comme conjoint d'un Belge ou parent d'un enfant belge mineur",
    article: "Article 12bis, §1, 3° CNB",
    status: "likely",
    intro:
      "Cette voie allège la participation économique, mais exige toujours le séjour légal, le titre illimité, la langue et l'intégration sociale.",
    conditions: [
      "Avoir au moins 18 ans",
      "Avoir 5 ans de séjour légal ininterrompu",
      "Disposer d'un titre de séjour à durée illimitée",
      "Être marié à une personne belge avec vie conjugale en Belgique depuis au moins 3 ans, ou être parent/adoptant d'un enfant belge mineur",
      "Prouver la connaissance d'une langue nationale",
      "Prouver l'intégration sociale",
    ],
    documents: [
      ...BASE_DOCUMENTS,
      "Preuve de nationalité belge du conjoint ou de l'enfant",
      "Acte de mariage ou acte de naissance de l'enfant",
      "Preuve de vie conjugale si la demande repose sur le mariage",
      "Preuve de langue et d'intégration sociale",
    ],
    next: "Faire vérifier par LEXPAT la durée de vie conjugale, la filiation et les pièces à préparer.",
  },
  disabilityPension: {
    title: "Déclaration en cas de handicap, invalidité ou âge de la pension",
    article: "Article 12bis, §1, 4° CNB",
    status: "likely",
    intro:
      "Cette voie concerne les personnes majeures avec 5 ans de séjour légal ininterrompu qui ne peuvent pas exercer d'activité économique en raison d'un handicap ou d'une invalidité, ou qui ont atteint l'âge de la pension.",
    conditions: [
      "Avoir au moins 18 ans",
      "Avoir 5 ans de séjour légal ininterrompu",
      "Disposer d'un titre de séjour à durée illimitée",
      "Prouver le handicap, l'invalidité ou l'âge de la pension",
    ],
    documents: [
      ...BASE_DOCUMENTS,
      "Attestation officielle de handicap ou d'invalidité, ou preuve de l'âge de la pension",
    ],
    next: "Faire vérifier les attestations médicales/sociales par le cabinet LEXPAT avant le dépôt.",
  },
  tenYears: {
    title: "Déclaration après 10 ans de séjour légal",
    article: "Article 12bis, §1, 5° CNB",
    status: "likely",
    intro:
      "Cette voie concerne les majeurs qui résident légalement en Belgique depuis 10 ans sans interruption. Elle repose surtout sur la langue et la participation à la communauté d'accueil.",
    conditions: [
      "Avoir au moins 18 ans",
      "Avoir 10 ans de séjour légal ininterrompu",
      "Disposer d'un titre de séjour à durée illimitée",
      "Prouver la connaissance d'une langue nationale",
      "Justifier sa participation à la vie de sa communauté d'accueil",
    ],
    documents: [
      ...BASE_DOCUMENTS,
      "Preuve de connaissance d'une langue nationale",
      "Éléments de participation économique, sociale, associative, culturelle ou locale",
    ],
    next: "Préparer un dossier cohérent de participation à la communauté d'accueil, pas seulement une pièce isolée.",
  },
  notReady: {
    title: "La déclaration semble prématurée",
    article: "Orientation générale",
    status: "blocked",
    intro:
      "D'après vos réponses, une condition de base manque probablement pour une déclaration de nationalité belge.",
    conditions: [
      "Avoir 18 ans pour les déclarations adultes",
      "Avoir un séjour légal suffisant et ininterrompu",
      "Disposer d'un titre de séjour à durée illimitée au moment de la demande",
      "Identifier les preuves de langue, d'intégration, de travail ou de participation selon la voie choisie",
    ],
    documents: BASE_DOCUMENTS,
    next:
      "Attendre que la condition manquante soit remplie ou demander une analyse individuelle si votre situation est particulière.",
  },
  missingEvidence: {
    title: "Une voie existe peut-être, mais il manque des preuves",
    article: "Dossier à compléter",
    status: "warning",
    intro:
      "Vous semblez proche d'une procédure, mais une ou plusieurs preuves indispensables manquent encore.",
    conditions: [
      "Vérifier la preuve de langue",
      "Vérifier la preuve d'intégration sociale",
      "Vérifier les jours de travail, cotisations sociales ou éléments de participation",
      "Confirmer que le titre de séjour est bien à durée illimitée",
    ],
    documents: [
      ...BASE_DOCUMENTS,
      "Attestations de langue, diplôme, formation ou parcours d'intégration",
      "Preuves de travail ou de cotisations sociales",
      "Tout élément montrant la participation à la communauté d'accueil",
    ],
    next: "Lister les preuves manquantes avec LEXPAT afin de sécuriser le dossier avant le dépôt.",
  },
};

const QUESTIONS = [
  {
    key: "age",
    label: "Quel âge a la personne concernée ?",
    help: "Les procédures sont différentes pour les mineurs et pour les majeurs.",
    options: OPTIONS.age,
  },
  {
    key: "unlimitedResidence",
    label: "La personne a-t-elle un titre de séjour à durée illimitée ?",
    help: "La plupart des déclarations adultes exigent ce titre au moment de la demande.",
    options: OPTIONS.yesNo,
    show: (answers) => answers.age === "adult",
  },
  {
    key: "bornAndAlwaysBelgium",
    label: "Est-elle née en Belgique et y a-t-elle toujours résidé légalement ?",
    help: "Cette situation peut ouvrir une voie spécifique sans devoir prouver langue, intégration ou travail.",
    options: OPTIONS.yesNo,
    show: (answers) => answers.age === "adult" && answers.unlimitedResidence === "yes",
  },
  {
    key: "legalYears",
    label: "Depuis combien de temps réside-t-elle légalement en Belgique sans interruption ?",
    help: "La durée de séjour oriente vers les voies de 5 ans ou de 10 ans.",
    options: OPTIONS.years,
    show: (answers) =>
      answers.age === "adult" &&
      answers.unlimitedResidence === "yes" &&
      answers.bornAndAlwaysBelgium === "no",
  },
  {
    key: "disabilityPension",
    label: "Est-elle handicapée, invalide ou à l'âge de la pension ?",
    help: "Cette situation peut ouvrir une voie avec 5 ans de séjour légal.",
    options: OPTIONS.yesNo,
    show: (answers) => ["five", "ten"].includes(answers.legalYears),
  },
  {
    key: "spouseOrBelgianChild",
    label: "Est-elle mariée à un Belge depuis au moins 3 ans de vie conjugale, ou parent d'un enfant belge mineur ?",
    help: "Cette voie ne demande pas la même preuve de participation économique que la voie générale de 5 ans.",
    options: OPTIONS.yesNo,
    show: (answers) =>
      ["five", "ten"].includes(answers.legalYears) && answers.disabilityPension === "no",
  },
  {
    key: "language",
    label: "Peut-elle prouver la connaissance d'une langue nationale ?",
    help: "Français, néerlandais ou allemand. Certaines preuves d'intégration peuvent aussi couvrir la langue.",
    options: OPTIONS.yesNo,
    show: (answers) =>
      ["five", "ten"].includes(answers.legalYears) && answers.disabilityPension === "no",
  },
  {
    key: "integration",
    label: "Peut-elle prouver son intégration sociale ?",
    help: "Par exemple diplôme reconnu, formation professionnelle, parcours d'intégration ou travail ininterrompu selon le cas.",
    options: OPTIONS.yesNo,
    show: (answers) =>
      answers.legalYears === "five" &&
      answers.disabilityPension === "no" &&
      answers.language === "yes",
  },
  {
    key: "economic",
    label: "Peut-elle prouver une participation économique suffisante ?",
    help: "La voie générale de 5 ans demande notamment 468 jours de travail ou 6 trimestres de cotisations sociales.",
    options: OPTIONS.yesNo,
    show: (answers) =>
      answers.legalYears === "five" &&
      answers.disabilityPension === "no" &&
      answers.spouseOrBelgianChild === "no" &&
      answers.language === "yes" &&
      answers.integration === "yes",
  },
  {
    key: "community",
    label: "Peut-elle justifier une participation à la communauté d'accueil ?",
    help: "La voie de 10 ans accepte des éléments économiques, sociaux, associatifs, culturels ou locaux.",
    options: OPTIONS.yesNo,
    show: (answers) =>
      answers.legalYears === "ten" &&
      answers.disabilityPension === "no" &&
      answers.spouseOrBelgianChild === "no" &&
      answers.language === "yes",
  },
];

function getVisibleQuestions(answers) {
  return QUESTIONS.filter((question) => !question.show || question.show(answers));
}

function getResultKey(answers) {
  if (answers.age === "minor") return "minor";
  if (!answers.age) return null;
  if (answers.unlimitedResidence === "no") return "notReady";
  if (!answers.unlimitedResidence) return null;
  if (answers.bornAndAlwaysBelgium === "yes") return "bornBelgium";
  if (!answers.bornAndAlwaysBelgium) return null;
  if (answers.legalYears === "less5") return "notReady";
  if (!answers.legalYears) return null;
  if (answers.disabilityPension === "yes") return "disabilityPension";
  if (!answers.disabilityPension) return null;
  if (!answers.spouseOrBelgianChild) return null;
  if (!answers.language) return null;
  if (answers.language === "no") return "missingEvidence";

  if (answers.spouseOrBelgianChild === "yes") {
    if (!answers.integration) return null;
    return answers.integration === "yes" ? "spouseOrParent" : "missingEvidence";
  }

  if (answers.legalYears === "ten") {
    if (!answers.community) return null;
    return answers.community === "yes" ? "tenYears" : "missingEvidence";
  }

  if (!answers.integration) return null;
  if (answers.integration === "no") return "missingEvidence";
  if (!answers.economic) return null;
  return answers.economic === "yes" ? "fiveYears" : "missingEvidence";
}

function statusClasses(status) {
  if (status === "likely") return "border-[#57b7af] bg-[#edf9f7] text-[#176a65]";
  if (status === "warning") return "border-[#e9c46a] bg-[#fff8e6] text-[#8a6410]";
  if (status === "blocked") return "border-[#e8a5bc] bg-[#fff0f5] text-[#9b2454]";
  return "border-[#bfd2ed] bg-[#f4f8ff] text-[#1d3b8b]";
}

export default function NationalitySchemaInteractif() {
  const [answers, setAnswers] = useState({});

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const resultKey = getResultKey(answers);
  const result = resultKey ? PROCEDURES[resultKey] : null;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / Math.max(visibleQuestions.length, 1)) * 100);

  function answerQuestion(key, value) {
    const questionIndex = QUESTIONS.findIndex((question) => question.key === key);
    const nextAnswers = {};

    QUESTIONS.slice(0, questionIndex + 1).forEach((question) => {
      if (question.key === key) {
        nextAnswers[question.key] = value;
      } else if (answers[question.key]) {
        nextAnswers[question.key] = answers[question.key];
      }
    });

    setAnswers(nextAnswers);
  }

  return (
    <section className="bg-[#f7fbff] px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-[#dbe8f7] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#e6eef8] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#57b7af]">
                Schéma interactif
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">
                Trouver la voie possible vers la nationalité belge
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="inline-flex items-center justify-center rounded-xl border border-[#c9d9ef] px-4 py-2 text-sm font-bold text-[#1d3b8b] transition hover:border-[#1d3b8b] hover:bg-[#f4f8ff]"
            >
              Recommencer
            </button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf3fb]">
            <div
              className="h-full rounded-full bg-[#57b7af] transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="mt-6 space-y-5">
            {visibleQuestions.map((question, index) => {
              const selected = answers[question.key];

              return (
                <div
                  key={question.key}
                  className="rounded-xl border border-[#e0eaf6] bg-[#fbfdff] p-4"
                >
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d3b8b] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold leading-6 text-[#1e3357]">
                        {question.label}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#607086]">{question.help}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => answerQuestion(question.key, option.value)}
                            className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                              selected === option.value
                                ? "border-[#57b7af] bg-[#eaf7f5] text-[#176a65] shadow-sm"
                                : "border-[#d8e4f2] bg-white text-[#1d3b8b] hover:border-[#57b7af]"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-[#dbe8f7] bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-6 lg:self-start">
          {result ? (
            <>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClasses(
                  result.status
                )}`}
              >
                Résultat
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#1d3b8b]">
                {result.title}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#57b7af]">{result.article}</p>
              <p className="mt-4 text-sm leading-7 text-[#607086]">{result.intro}</p>

              <div className="mt-6">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#1e3357]">
                  Conditions à vérifier
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.conditions.map((condition) => (
                    <li key={condition} className="flex gap-2 text-sm leading-6 text-[#4d5f78]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#57b7af]" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#1e3357]">
                  Pièces fréquentes
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.documents.map((document) => (
                    <li key={document} className="flex gap-2 text-sm leading-6 text-[#4d5f78]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e91e8c]" />
                      <span>{document}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-[#d8e4f2] bg-[#f8fbff] p-4">
                <p className="text-sm font-bold text-[#1d3b8b]">Prochaine étape</p>
                <p className="mt-2 text-sm leading-6 text-[#607086]">{result.next}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.lexpat.be"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#1d3b8b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17306f]"
                >
                  Contacter le cabinet LEXPAT
                </a>
                <a
                  href="https://www.lexpat.be"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#c9d9ef] px-5 py-3 text-sm font-bold text-[#1d3b8b] transition hover:border-[#1d3b8b]"
                >
                  Aller sur lexpat.be
                </a>
              </div>
            </>
          ) : (
            <div className="flex min-h-[360px] flex-col justify-center">
              <span className="inline-flex w-fit rounded-full border border-[#bfd2ed] bg-[#f4f8ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1d3b8b]">
                En cours
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#1d3b8b]">
                Répondez aux questions pour obtenir une orientation
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#607086]">
                Le résultat affichera la procédure la plus probable, les conditions à vérifier et les pièces souvent demandées.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
    </section>
  );
}
