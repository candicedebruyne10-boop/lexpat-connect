"use client";

/**
 * Onglets de la Région flamande : « Professions en pénurie » / « Fonctions
 * moyennement qualifiées ».
 *
 * Les libellés sont ceux de la réglementation flamande et ne doivent pas être
 * reformulés : « fonction moyennement qualifiée » est la catégorie de l'arrêté
 * ministériel, distincte de la liste des professions en pénurie du VDAB.
 *
 * Les panneaux sont rendus côté serveur et passés en props (`panelShortage`,
 * `panelMediumSkilled`) : ce composant ne gère que l'état de l'onglet actif,
 * pour éviter d'embarquer les 228 métiers dans le bundle client.
 */

import { useState } from "react";

import FlandreRegimeBanner from "./FlandreRegimeBanner";

export default function FlandreTabs({
  lang = "fr",
  shortageLabel,
  shortageCount,
  shortageSource,
  shortageRegime,
  panelShortage,
  mediumSkilledLabel,
  mediumSkilledCount,
  mediumSkilledSource,
  mediumSkilledRegime,
  panelMediumSkilled,
  info,
}) {
  const [active, setActive] = useState("shortage");

  const tabs = [
    {
      id: "shortage",
      label: shortageLabel,
      count: shortageCount,
      source: shortageSource,
      regime: shortageRegime,
      panel: panelShortage,
      accent: false,
    },
    {
      id: "mediumSkilled",
      label: mediumSkilledLabel,
      count: mediumSkilledCount,
      source: mediumSkilledSource,
      regime: mediumSkilledRegime,
      panel: panelMediumSkilled,
      accent: true,
    },
  ];

  const current = tabs.find((tab) => tab.id === active) || tabs[0];

  return (
    <div className="mt-5">
      {info}

      <div
        role="tablist"
        aria-label={shortageLabel}
        className="mt-5 flex flex-wrap gap-2 border-b border-[#e2ecf6]"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`flandre-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`flandre-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`-mb-px flex items-center gap-2 rounded-t-[14px] border-b-2 px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? tab.accent
                    ? "border-amber-400 bg-amber-50/60 text-amber-800"
                    : "border-[#57b7af] bg-[#f0faf9] text-[#1E3A78]"
                  : "border-transparent text-[#7d93ad] hover:text-[#1E3A78]"
              }`}
            >
              <span aria-hidden="true">{tab.accent ? "✦" : "●"}</span>
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  selected
                    ? tab.accent
                      ? "bg-amber-100 text-amber-800"
                      : "bg-[#dcf1ef] text-[#2f7f78]"
                    : "bg-[#eef3f9] text-[#8298b3]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`flandre-panel-${current.id}`}
        aria-labelledby={`flandre-tab-${current.id}`}
        className={`rounded-b-[24px] rounded-tr-[24px] border border-t-0 p-5 md:p-6 ${
          current.accent ? "border-amber-200 bg-amber-50/30" : "border-[#dbe8f4]"
        }`}
      >
        <FlandreRegimeBanner
          regime={current.accent ? "mediumSkilled" : "shortage"}
          lang={lang}
        />
        <p className="mt-3 text-[13px] leading-6 text-[#8298b3]">{current.source}</p>
        <div className="mt-5">{current.panel}</div>
      </div>
    </div>
  );
}
