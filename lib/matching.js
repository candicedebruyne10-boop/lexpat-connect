const REGION_ALIASES = {
  brussels: "Bruxelles-Capitale",
  wallonia: "Wallonie",
  flanders: "Flandre",
  multi_region: "Plusieurs régions",
  "bruxelles-capitale": "Bruxelles-Capitale",
  bruxelles: "Bruxelles-Capitale",
  wallonie: "Wallonie",
  flandre: "Flandre",
  "plusieurs régions": "Plusieurs régions",
  "toute la belgique": "Plusieurs régions"
};

export function normalizeValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function normalizeRegion(value) {
  const normalized = normalizeValue(value);
  return REGION_ALIASES[normalized] || String(value || "").trim();
}

function parseRegions(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return [];
  if (normalized.includes("|")) {
    return normalized.split("|").map((item) => normalizeRegion(item.trim())).filter(Boolean);
  }
  if (normalized.includes(",")) {
    return normalized.split(",").map((item) => normalizeRegion(item.trim())).filter(Boolean);
  }
  return [normalizeRegion(normalized)];
}

export function sameSector(workerSector, offerSector) {
  return normalizeValue(workerSector) && normalizeValue(workerSector) === normalizeValue(offerSector);
}

export function sameJobTitle(workerJobTitle, offerJobTitle) {
  return normalizeValue(workerJobTitle) && normalizeValue(workerJobTitle) === normalizeValue(offerJobTitle);
}

export function sameRegion(workerRegion, offerRegion) {
  const workerRegions = parseRegions(workerRegion);
  const offerRegions = parseRegions(offerRegion);

  if (!workerRegions.length || !offerRegions.length) return false;
  if (workerRegions.includes("Plusieurs régions") || offerRegions.includes("Plusieurs régions")) return true;

  return workerRegions.some((workerValue) => offerRegions.includes(workerValue));
}

export function computeMatchScore(worker, offer) {
  let score = 0;

  if (normalizeValue(worker.profile_visibility) === "visible") score += 10;
  if (sameJobTitle(worker.job_title, offer.job_title)) score += 45;
  if (sameSector(worker.sector, offer.sector)) score += 20;
  if (sameRegion(worker.region, offer.region)) score += 15;
  if (normalizeValue(worker.experience)) score += 10;

  return Math.min(score, 100);
}
