function pickFirst(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function hasWorkerVisibilityRequirements(profile = {}) {
  const job = pickFirst(profile.target_job, profile.job_title, profile.jobTitle);
  const sector = pickFirst(profile.target_sector, profile.sector, profile.targetSector);
  return Boolean(job && sector);
}

export function getEffectiveWorkerProfileVisibility(profile = {}) {
  if (!hasWorkerVisibilityRequirements(profile)) return "hidden";
  return profile.profile_visibility || "visible";
}
