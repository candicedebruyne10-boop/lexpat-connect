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
      <p className="text-[11px] leading-5 text-[#8a9bb0]">
        {helperText || "Vous pouvez sélectionner une, deux ou trois régions."}
      </p>
    </div>
  );
}
