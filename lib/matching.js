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

export function sameSector(workerSector, offerSector) {
  return normalizeValue(workerSector) && normalizeValue(workerSector) === normalizeValue(offerSector);
}

export function sameRegion(workerRegion, offerRegion) {
  const normalizedWorker = normalizeRegion(workerRegion);
  const normalizedOffer = normalizeRegion(offerRegion);

  if (!normalizedWorker || !normalizedOffer) return false;
  if (normalizedWorker === "Plusieurs régions" || normalizedOffer === "Plusieurs régions") return true;

  return normalizedWorker === normalizedOffer;
}

export function computeMatchScore(worker, offer) {
  let score = 0;

  if (normalizeValue(worker.profile_visibility) === "visible") score += 20;
  if (sameSector(worker.sector, offer.sector)) score += 40;
  if (sameRegion(worker.region, offer.region)) score += 25;
  if (normalizeValue(worker.experience)) score += 15;

  return Math.min(score, 100);
}

