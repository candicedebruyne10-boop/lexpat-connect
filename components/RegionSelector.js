"use client";

import { coreRegionOptions } from "../lib/professions";

export default function RegionSelector({
  value = [],
  onChange,
  helperText
}) {
  const selectedRegions = Array.isArray(value) ? value : [];

  function toggleRegion(region) {
    const next = selectedRegions.includes(region)
      ? selectedRegions.filter((item) => item !== region)
      : [...selectedRegions, region];

    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 rounded-2xl border border-[#dce7ef] bg-[#f8fbfd] px-4 py-3 text-[11px] leading-5 text-[#6f8198]">
        <p className="max-w-[44rem]">
          {helperText || "Vous pouvez sélectionner une, deux ou trois régions."}
        </p>
        <div className="group relative flex-shrink-0">
          <button
            type="button"
            aria-label="Comment choisir la région compétente"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#cfe0ec] bg-white text-[12px] font-bold text-[#1d3b8b] shadow-[0_4px_12px_rgba(29,59,139,0.08)] transition hover:border-[#57b7af] hover:text-[#57b7af]"
          >
            i
          </button>
          <div className="pointer-events-none absolute right-0 top-8 z-20 hidden w-[23rem] rounded-2xl border border-[#dce7ef] bg-white p-4 text-left text-[12px] leading-6 text-[#4f6178] shadow-[0_18px_40px_rgba(15,23,42,0.12)] group-hover:block group-focus-within:block">
            <p className="font-semibold text-[#1d3b8b]">Comment choisir la région compétente ?</p>
            <ul className="mt-2 space-y-2">
              <li>
                <span className="font-semibold text-[#17345d]">Unité d&apos;établissement :</span> choisissez d&apos;abord la région de l&apos;implantation belge où le travail sera principalement organisé.
              </li>
              <li>
                <span className="font-semibold text-[#17345d]">Siège social :</span> si le lieu principal de travail n&apos;est pas clair, retenez la région du siège social de l&apos;entreprise.
              </li>
              <li>
                <span className="font-semibold text-[#17345d]">Lieu d&apos;activité réel :</span> en l&apos;absence d&apos;implantation ou de siège en Belgique, choisissez la région où les activités seront concrètement exercées.
              </li>
            </ul>
          </div>
        </div>
      </div>
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
              {region}
            </button>
          );
        })}
      </div>
    </div>
  );
}
