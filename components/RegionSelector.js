"use client";

import { useState } from "react";
import { coreRegionOptions } from "../lib/professions";

export default function RegionSelector({
  value = [],
  onChange,
  helperText,
  locale = "fr"
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const selectedRegions = Array.isArray(value) ? value : [];
  const regionLabels = locale === "en"
    ? {
        "Bruxelles-Capitale": "Brussels-Capital",
        Wallonie: "Wallonia",
        Flandre: "Flanders"
      }
    : {};

  function toggleRegion(region) {
    const next = selectedRegions.includes(region)
      ? selectedRegions.filter((item) => item !== region)
      : [...selectedRegions, region];

    onChange(next);
  }

  const infoTitle = locale === "en" ? "How do you choose the competent region?" : "Comment choisir la région compétente ?";
  const infoItems = locale === "en"
    ? [
        {
          label: "Belgian establishment unit:",
          text: "first choose the region of the Belgian site where the work will mainly be organised."
        },
        {
          label: "Registered office:",
          text: "if the main place of work is unclear, use the region where the company's registered office is located."
        },
        {
          label: "Actual place of activity:",
          text: "if there is no Belgian establishment or registered office, choose the region where the activities will actually be carried out."
        }
      ]
    : [
        {
          label: "Unité d'établissement :",
          text: "choisissez d'abord la région de l'implantation belge où le travail sera principalement organisé."
        },
        {
          label: "Siège social :",
          text: "si le lieu principal de travail n'est pas clair, retenez la région du siège social de l'entreprise."
        },
        {
          label: "Lieu d'activité réel :",
          text: "en l'absence d'implantation ou de siège en Belgique, choisissez la région où les activités seront concrètement exercées."
        }
      ];

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 text-[11px] leading-5 text-[#6f8198]">
        <p className="max-w-[44rem]">
          {helperText !== null && (helperText || (locale === "en"
            ? "You can select one, two or all three regions."
            : "Vous pouvez sélectionner une, deux ou trois régions."))}
        </p>
        <div className="group relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setInfoOpen((open) => !open)}
            aria-expanded={infoOpen}
            aria-label={locale === "en" ? "How to choose the competent region" : "Comment choisir la région compétente"}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#cfe0ec] bg-white text-[12px] font-bold text-[#1d3b8b] shadow-[0_4px_12px_rgba(29,59,139,0.08)] transition hover:border-[#57b7af] hover:text-[#57b7af]"
          >
            i
          </button>
          <div className="pointer-events-none absolute right-0 top-8 z-20 hidden w-[23rem] rounded-2xl border border-[#dce7ef] bg-white p-4 text-left text-[12px] leading-6 text-[#4f6178] shadow-[0_18px_40px_rgba(15,23,42,0.12)] group-hover:block group-focus-within:block max-[767px]:hidden">
            <p className="font-semibold text-[#1d3b8b]">{infoTitle}</p>
            <ul className="mt-2 space-y-2">
              {infoItems.map((item) => (
                <li key={item.label}>
                  <span className="font-semibold text-[#17345d]">{item.label}</span> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {infoOpen ? (
        <div className="rounded-2xl border border-[#dce7ef] bg-white p-4 text-[12px] leading-6 text-[#4f6178] shadow-[0_14px_32px_rgba(15,23,42,0.08)] md:hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[#1d3b8b]">{infoTitle}</p>
              <ul className="mt-2 space-y-2">
                {infoItems.map((item) => (
                  <li key={item.label}>
                    <span className="font-semibold text-[#17345d]">{item.label}</span> {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="rounded-full border border-[#dce7ef] px-2 py-1 text-[11px] font-semibold text-[#607086]"
            >
              {locale === "en" ? "Close" : "Fermer"}
            </button>
          </div>
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        {coreRegionOptions.map((region) => {
          const active = selectedRegions.includes(region);
          return (
            <button
              key={region}
              type="button"
              onClick={() => toggleRegion(region)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? "border-[#57b7af] bg-[#eef9f8] text-[#1d3b8b] shadow-[0_6px_18px_rgba(87,183,175,0.14)]"
                  : "border-[#dce7ef] bg-white text-[#516276] hover:border-[#b7d7d2] hover:bg-[#f8fcfb]"
              }`}
            >
              {regionLabels[region] || region}
            </button>
          );
        })}
      </div>
    </div>
  );
}
