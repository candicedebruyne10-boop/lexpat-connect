/**
 * Rendu des groupes de métiers en pénurie, partagé par la page FR et la page EN.
 *
 * La Flandre a son propre rendu : deux listes distinctes plutôt qu'une seule
 * grille, parce que les deux régimes flamands n'ouvrent pas les mêmes droits.
 * Voir splitFlandreGroups() dans lib/flandreKnelpuntberoepen.js pour la règle
 * de répartition.
 */

import { splitFlandreGroups } from "../lib/flandreKnelpuntberoepen";
import { translateGroupTitle, translateProfessionLabel } from "../lib/professions";
import FlandreRegimeInfo from "./FlandreRegimeInfo";

const COPY = {
  fr: {
    mbBadge: "Liste 1",
    mbTitle: "Métiers en pénurie moyennement qualifiés",
    mbSource: "Arrêté ministériel du 1er décembre 2025",
    mbRegime: "Dispense du test du marché de l'emploi",
    vdabBadge: "Liste 2",
    vdabTitle: "Métiers en pénurie VDAB",
    vdabSource: "Knelpuntberoepen 2026, publiés le 1er février 2026",
    vdabRegime:
      "Qualification de niveau 3 ou 4, et offre publiée 9 semaines sur VDAB et EURES",
    count: (n) => `${n} métier${n > 1 ? "s" : ""}`,
  },
  en: {
    mbBadge: "List 1",
    mbTitle: "Medium-skilled shortage occupations",
    mbSource: "Ministerial Decree of 1 December 2025",
    mbRegime: "Exemption from the labour market test",
    vdabBadge: "List 2",
    vdabTitle: "VDAB shortage occupations",
    vdabSource: "Knelpuntberoepen 2026, published on 1 February 2026",
    vdabRegime:
      "Level 3 or 4 qualification, and vacancy advertised for 9 weeks on VDAB and EURES",
    count: (n) => `${n} occupation${n > 1 ? "s" : ""}`,
  },
};

/**
 * Grille de groupes thématiques. `accent` bascule les puces en ambre.
 *
 * `translateGroup` permet à la page EN d'injecter sa propre table de traduction,
 * plus complète que translateGroupTitle() pour certains intitulés néerlandais.
 */
export function GroupGrid({
  groups,
  style,
  lang = "fr",
  accent = false,
  translateGroup,
}) {
  const groupLabel = translateGroup || ((title) => translateGroupTitle(title, lang));

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {groups.map((group) => (
        <section
          key={group.title}
          className={`rounded-[26px] border p-5 ${
            accent ? "border-amber-200 bg-amber-50/50" : `${style.soft} ${style.border}`
          }`}
        >
          <h4 className="text-lg font-semibold text-[#1E3A78]">
            {groupLabel(group.title)}
          </h4>
          <ul className="mt-4 space-y-2.5">
            {group.jobs.map((job) => (
              <li
                key={job}
                className="flex items-start gap-3 text-sm leading-6 text-[#334155]"
              >
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                    accent
                      ? "bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.20)]"
                      : style.dot
                  }`}
                />
                <span className="flex-1">{translateProfessionLabel(job, lang)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** En-tête d'une des deux listes flamandes. */
function ListHeader({ badge, title, source, regime, count, accent }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${
            accent
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-[#d4e8e6] bg-[#f0faf9] text-[#57b7af]"
          }`}
        >
          {accent ? "✦ " : "● "}
          {badge} · {count}
        </span>
        <h3 className="mt-2.5 text-xl font-semibold tracking-tight text-[#1E3A78]">
          {title}
        </h3>
        <p className="mt-1 text-[13px] leading-6 text-[#8298b3]">{source}</p>
        <p
          className={`mt-1.5 text-sm font-medium leading-6 ${
            accent ? "text-amber-700" : "text-[#57b7af]"
          }`}
        >
          {regime}
        </p>
      </div>
    </div>
  );
}

/** Les deux listes flamandes, précédées du bouton info. */
export function FlandreLists({ region, style, lang = "fr", translateGroup }) {
  const t = COPY[lang] || COPY.fr;
  const { mbGroups, vdabGroups, mbCount, vdabCount } = splitFlandreGroups(region.groups);

  return (
    <>
      <div className="mt-5">
        <FlandreRegimeInfo lang={lang} />
      </div>

      <div className="mt-6 rounded-[28px] border border-amber-200 bg-amber-50/30 p-5 md:p-6">
        <ListHeader
          accent
          badge={t.mbBadge}
          title={t.mbTitle}
          source={t.mbSource}
          regime={t.mbRegime}
          count={t.count(mbCount)}
        />
        <div className="mt-5">
          <GroupGrid
            groups={mbGroups}
            style={style}
            lang={lang}
            translateGroup={translateGroup}
            accent
          />
        </div>
      </div>

      <div className={`mt-6 rounded-[28px] border p-5 md:p-6 ${style.border}`}>
        <ListHeader
          badge={t.vdabBadge}
          title={t.vdabTitle}
          source={t.vdabSource}
          regime={t.vdabRegime}
          count={t.count(vdabCount)}
        />
        <div className="mt-5">
          <GroupGrid
            groups={vdabGroups}
            style={style}
            lang={lang}
            translateGroup={translateGroup}
          />
        </div>
      </div>
    </>
  );
}
