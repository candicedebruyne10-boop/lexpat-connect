/**
 * Bandeau de conséquence pratique, affiché en tête de chaque onglet flamand
 * et dans le simulateur d'éligibilité.
 *
 * Raison d'être : les deux onglets affichent les mêmes catégories de métiers
 * (Construction, Industrie…), donc rien ne distingue visuellement les deux
 * régimes. Ce qui change pour un employeur, ce n'est pas la liste — c'est
 * l'obligation de publier l'offre ou non. C'est cette phrase-là qui doit
 * sauter aux yeux, pas le libellé de l'onglet.
 *
 * @param {"mediumSkilled"|"shortage"} regime
 * @param {"fr"|"en"} lang
 */

const COPY = {
  fr: {
    mediumSkilled: {
      kicker: "Fonctions moyennement qualifiées",
      headline: "Aucune publication d'offre requise",
      points: [
        "Dispense du test du marché de l'emploi",
        "Aucune justification de refus de candidats locaux",
        "Le dossier peut être déposé immédiatement",
      ],
    },
    shortage: {
      kicker: "Professions en pénurie",
      headline: "Offre à publier 9 semaines sur VDAB et EURES",
      points: [
        "Dans les 4 mois précédant la demande, avec médiation active du VDAB",
        "Refus des candidats locaux et européens à motiver par écrit",
        "Qualification de niveau 3 ou 4 exigée",
      ],
    },
  },
  en: {
    mediumSkilled: {
      kicker: "Medium-skilled functions",
      headline: "No vacancy publication required",
      points: [
        "Exemption from the labour market test",
        "No justification needed for rejecting local candidates",
        "The application can be filed immediately",
      ],
    },
    shortage: {
      kicker: "Shortage occupations",
      headline: "Vacancy must be advertised for 9 weeks on VDAB and EURES",
      points: [
        "Within the 4 months preceding the application, with active VDAB mediation",
        "Rejection of local and European candidates must be justified in writing",
        "Level 3 or 4 qualification required",
      ],
    },
  },
};

export default function FlandreRegimeBanner({
  regime = "shortage",
  lang = "fr",
  className = "",
}) {
  const t = (COPY[lang] || COPY.fr)[regime];
  const exempt = regime === "mediumSkilled";

  return (
    <div
      className={`rounded-[20px] border-2 p-5 md:p-6 ${
        exempt
          ? "border-emerald-300 bg-emerald-50"
          : "border-[#f0b429] bg-[#fffaf0]"
      } ${className}`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
          exempt ? "text-emerald-700" : "text-[#a86a00]"
        }`}
      >
        {t.kicker}
      </p>

      <p
        className={`mt-2 text-xl font-bold leading-snug md:text-2xl ${
          exempt ? "text-emerald-900" : "text-[#7a4b00]"
        }`}
      >
        {exempt ? "✓ " : "⏱ "}
        {t.headline}
      </p>

      <ul className="mt-3 space-y-1.5">
        {t.points.map((point) => (
          <li
            key={point}
            className={`flex items-start gap-2 text-sm leading-6 ${
              exempt ? "text-emerald-800" : "text-[#8a5a00]"
            }`}
          >
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
