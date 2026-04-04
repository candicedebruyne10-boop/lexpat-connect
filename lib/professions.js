import { shortageJobs2026 } from "./shortageJobs2026";

const REGION_LABEL_BY_ID = {
  bruxelles: "Bruxelles-Capitale",
  wallonie: "Wallonie",
  flandre: "Flandre"
};

function normalizeGroupToSector(groupTitle) {
  const label = String(groupTitle || "").toLowerCase();

  if (label.includes("sant") || label.includes("social")) return "Santé et action sociale";
  if (label.includes("construction") || label.includes("bâtiment") || label.includes("voirie")) return "Construction et travaux publics";
  if (label.includes("transport") || label.includes("logistique") || label.includes("navigation")) return "Transport et logistique";
  if (label.includes("industrie") || label.includes("technique") || label.includes("maintenance") || label.includes("automatisation")) return "Industrie et maintenance";
  if (label.includes("informatique") || label.includes("tic") || label.includes("telecommunication") || label.includes("numérique")) return "Technologies et informatique";
  if (label.includes("enseignement") || label.includes("formation") || label.includes("pedagog")) return "Éducation et formation";
  if (label.includes("commerce") || label.includes("vente") || label.includes("distribution")) return "Commerce et vente";
  if (label.includes("comptabil") || label.includes("finance") || label.includes("assurance") || label.includes("immobilier") || label.includes("droit")) {
    return "Comptabilité, finance et immobilier";
  }
  if (label.includes("horeca")) return "Horeca";
  if (label.includes("service") || label.includes("sécurité") || label.includes("securite") || label.includes("nettoyage")) {
    return "Services à la personne et sécurité";
  }

  return groupTitle;
}

function buildRegionData() {
  return shortageJobs2026.map((region) => {
    const label = REGION_LABEL_BY_ID[region.id] || region.label;
    const groups = region.groups.map((group) => ({
      label: group.title,
      options: group.jobs
    }));

    const flatJobs = region.groups.flatMap((group) => group.jobs);
    const sectorMap = Object.fromEntries(
      region.groups.flatMap((group) =>
        group.jobs.map((job) => [job, normalizeGroupToSector(group.title)])
      )
    );

    return {
      id: region.id,
      label,
      groups: [...groups, { label: "Autre", options: ["Autre profession"] }],
      flatJobs: [...flatJobs, "Autre profession"],
      sectorMap
    };
  });
}

const regionData = buildRegionData();

export const coreRegionOptions = ["Bruxelles-Capitale", "Wallonie", "Flandre"];

export const groupedProfessionOptions = regionData.map((region) => ({
  label: region.label,
  options: region.flatJobs
}));

export const groupedProfessionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.groups])
);

export const professionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.flatJobs])
);

export const professionSectorByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.sectorMap])
);

export const sectorOptions = [
  "Commerce et vente",
  "Comptabilité, finance et immobilier",
  "Construction et travaux publics",
  "Éducation et formation",
  "Horeca",
  "Industrie et maintenance",
  "Santé et action sociale",
  "Services à la personne et sécurité",
  "Technologies et informatique",
  "Transport et logistique",
  "Autre secteur"
];

export const workerRegionOptions = [...coreRegionOptions, "Toute la Belgique"];
export const employerRegionOptions = [...coreRegionOptions, "Plusieurs régions"];

export function parseRegionSelection(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  const normalized = String(value || "").trim();
  if (!normalized) return [];
  if (normalized === "Toute la Belgique" || normalized === "Plusieurs régions") {
    return coreRegionOptions;
  }

  if (normalized.includes("|")) {
    return normalized.split("|").map((item) => item.trim()).filter(Boolean);
  }

  if (normalized.includes(",")) {
    return normalized.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [normalized];
}

export function stringifyRegionSelection(value, fallbackLabel = "Plusieurs régions") {
  const selections = parseRegionSelection(value);

  if (!selections.length) return "";
  if (selections.length === 1) return selections[0];
  if (selections.length === coreRegionOptions.length) {
    return fallbackLabel;
  }

  return selections.join(" | ");
}

export function getProfessionGroupsForRegions(value) {
  const selections = parseRegionSelection(value);
  if (!selections.length) return [];

  const groupsMap = new Map();

  selections.forEach((regionLabel) => {
    const regionGroups = groupedProfessionOptionsByRegion[regionLabel] || [];
    regionGroups.forEach((group) => {
      const current = groupsMap.get(group.label) || new Set();
      group.options.forEach((option) => current.add(option));
      groupsMap.set(group.label, current);
    });
  });

  return Array.from(groupsMap.entries()).map(([label, options]) => ({
    label,
    options: Array.from(options)
  }));
}

export function findSectorForProfession(regionLabel, professionLabel) {
  if (!regionLabel || !professionLabel || professionLabel === "Autre profession") {
    return "";
  }

  const selections = parseRegionSelection(regionLabel);

  for (const selectedRegion of selections) {
    const derived = professionSectorByRegion[selectedRegion]?.[professionLabel];
    if (derived) return derived;
  }

  return "";
}
