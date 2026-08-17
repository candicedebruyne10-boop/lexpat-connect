/**
 * Bouton info « Pourquoi la Flandre est différente ».
 *
 * Utilisé sur la page Métiers en pénurie (FR + EN) et dans le simulateur
 * d'éligibilité. Repose sur <details>/<summary> : pas de JavaScript, donc
 * utilisable tel quel dans un composant serveur comme dans un composant client,
 * et le contenu reste lisible même si le JS ne se charge pas.
 *
 * @param {"fr"|"en"} lang
 * @param {string} className - classes utilitaires de positionnement
 */

const COPY = {
  fr: {
    button: "Pourquoi cette région diffère",
    title: "Pourquoi la Flandre est différente",
    paragraphs: [
      "Bruxelles et la Wallonie publient une liste unique, à valeur indicative. La Flandre en applique deux, et c'est celle où figure le métier qui détermine la procédure : dispense pure et simple du test du marché de l'emploi, ou publication obligatoire pendant 9 semaines.",
      "Un métier absent des deux listes n'ouvre pas droit au permis unique économique en Flandre, quelle que soit la durée de publication de l'offre.",
    ],
    lists: [
      {
        name: "Métiers en pénurie moyennement qualifiés",
        detail:
          "Arrêté ministériel du 1er décembre 2025, en vigueur depuis le 1er janvier 2026. Dispense totale du test du marché de l'emploi : aucune publication d'offre ni justification de refus de candidats locaux n'est exigée.",
      },
      {
        name: "Métiers en pénurie VDAB",
        detail:
          "Knelpuntberoepen 2026, publiés le 1er février 2026. Conditions cumulatives : qualification de niveau 3 ou 4, offre publiée 9 semaines sur VDAB et EURES dans les 4 mois précédant la demande, médiation active du VDAB et refus motivés des candidats locaux et européens.",
      },
    ],
    footer:
      "Cette page est une information générale et ne constitue pas un avis juridique.",
  },
  en: {
    button: "Why this region differs",
    title: "Why Flanders is different",
    paragraphs: [
      "Brussels and Wallonia publish a single, indicative list. Flanders applies two, and the list a job appears on determines the procedure: outright exemption from the labour market test, or a mandatory 9-week publication.",
      "A job on neither list gives no access to the economic single permit in Flanders, however long the vacancy is advertised.",
    ],
    lists: [
      {
        name: "Medium-skilled shortage occupations",
        detail:
          "Ministerial Decree of 1 December 2025, in force since 1 January 2026. Full exemption from the labour market test: no vacancy publication and no justification for rejecting local candidates are required.",
      },
      {
        name: "VDAB shortage occupations",
        detail:
          "Knelpuntberoepen 2026, published on 1 February 2026. Cumulative conditions: level 3 or 4 qualification, vacancy advertised for 9 weeks on VDAB and EURES within the 4 months preceding the application, active VDAB mediation, and reasoned rejection of local and European candidates.",
      },
    ],
    footer:
      "This page is general information and does not constitute legal advice.",
  },
};

export default function FlandreRegimeInfo({ lang = "fr", className = "" }) {
  const t = COPY[lang] || COPY.fr;

  return (
    <details className={`group ${className}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-[#c9d9ec] bg-white px-4 py-2 text-[13px] font-semibold text-[#1d3b8b] transition hover:border-[#57b7af] hover:text-[#2f9f97] [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none"
        >
          i
        </span>
        {t.button}
        <span
          aria-hidden="true"
          className="text-[#8fa6c2] transition group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="mt-3 rounded-[20px] border border-[#d4e2f2] bg-[#f4f8fd] p-5">
        <h3 className="text-base font-semibold text-[#1E3A78]">{t.title}</h3>

        {t.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-2 text-sm leading-7 text-[#4a6b99]">
            {paragraph}
          </p>
        ))}

        <dl className="mt-4 space-y-3">
          {t.lists.map((item, index) => (
            <div
              key={item.name}
              className={`rounded-[14px] border p-4 ${
                index === 0
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-[#d4e8e6] bg-white"
              }`}
            >
              <dt
                className={`text-sm font-semibold ${
                  index === 0 ? "text-amber-800" : "text-[#1E3A78]"
                }`}
              >
                {index === 0 ? "✦ " : "● "}
                {item.name}
              </dt>
              <dd
                className={`mt-1.5 text-[13px] leading-6 ${
                  index === 0 ? "text-amber-800/90" : "text-[#607089]"
                }`}
              >
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs leading-5 text-[#8298b3]">{t.footer}</p>
      </div>
    </details>
  );
}
