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
import FlandreTabs from "./FlandreTabs";

const COPY = {
  fr: {
    shortage: "Professions en pénurie",
    shortageSource: "Liste VDAB des knelpuntberoepen 2026, publiée le 1er février 2026",
    shortageRegime:
      "Qualification de niveau 3 ou 4, et offre publiée 9 semaines sur VDAB et EURES dans les 4 mois précédant la demande",
    mediumSkilled: "Fonctions moyennement qualifiées",
    mediumSkilledSource:
      "Arrêté ministériel du 1er décembre 2025, en vigueur depuis le 1er janvier 2026",
    mediumSkilledRegime: "Dispense du test du marché de l'emploi",
  },
  en: {
    shortage: "Shortage occupations",
    shortageSource: "VDAB knelpuntberoepen 2026 list, published on 1 February 2026",
    shortageRegime:
      "Level 3 or 4 qualification, and vacancy advertised for 9 weeks on VDAB and EURES within the 4 months preceding the application",
    mediumSkilled: "Medium-skilled functions",
    mediumSkilledSource:
      "Ministerial Decree of 1 December 2025, in force since 1 January 2026",
    mediumSkilledRegime: "Exemption from the labour market test",
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

/** Les deux listes flamandes, en onglets, précédées du bouton info. */
export function FlandreLists({ region, style, lang = "fr", translateGroup }) {
  const t = COPY[lang] || COPY.fr;
  const { mbGroups, vdabGroups, mbCount, vdabCount } = splitFlandreGroups(region.groups);

  return (
    <FlandreTabs
      info={<FlandreRegimeInfo lang={lang} />}
      shortageLabel={t.shortage}
      shortageCount={vdabCount}
      shortageSource={t.shortageSource}
      shortageRegime={t.shortageRegime}
      panelShortage={
        <GroupGrid
          groups={vdabGroups}
          style={style}
          lang={lang}
          translateGroup={translateGroup}
        />
      }
      mediumSkilledLabel={t.mediumSkilled}
      mediumSkilledCount={mbCount}
      mediumSkilledSource={t.mediumSkilledSource}
      mediumSkilledRegime={t.mediumSkilledRegime}
      panelMediumSkilled={
        <GroupGrid
          groups={mbGroups}
          style={style}
          lang={lang}
          translateGroup={translateGroup}
          accent
        />
      }
    />
  );
}
