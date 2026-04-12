import { Resend } from "resend";
import { getSenderAddress } from "./email-routing";
import { normalizeRegion, normalizeValue } from "./matching";
import { newEmployerMatchDigestEmailHtml, newWorkerMatchDigestEmailHtml } from "./email-templates";
import { isUnsubscribed } from "./email-unsubscribe";

const NOTIFICATION_WINDOW_MS = 12 * 60 * 60 * 1000;
const MIN_MATCH_SCORE = 40;
const HIGH_SCORE_THRESHOLD = 75;

function resolveLocale(value) {
  return value === "en" ? "en" : "fr";
}

function buildAbsoluteUrl(pathname = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
  return `${base}${pathname}`;
}

function localizePath(pathname = "/", locale = "fr") {
  if (locale !== "en") return pathname;
  if (pathname === "/") return "/en";
  return pathname.startsWith("/en") ? pathname : `/en${pathname}`;
}

function buildPreferenceLinks(role, locale) {
  const spacePath = role === "employer" ? "/employeurs/espace" : "/travailleurs/espace";
  return {
    primarySpaceUrl: buildAbsoluteUrl(localizePath(spacePath, locale)),
    preferencesUrl: buildAbsoluteUrl(localizePath(spacePath, locale)),
    simulatorUrl: buildAbsoluteUrl(localizePath("/simulateur-eligibilite", locale)),
    legalSupportUrl: buildAbsoluteUrl(localizePath("/accompagnement-juridique", locale))
  };
}

function mapExperienceLabel(value, locale = "fr") {
  if (!value) return locale === "en" ? "Not provided" : "Non renseignée";

  const labels = {
    "Moins d'1 an": { en: "Less than 1 year", fr: "Moins d'1 an" },
    "1 à 3 ans": { en: "1 to 3 years", fr: "1 à 3 ans" },
    "3 à 5 ans": { en: "3 to 5 years", fr: "3 à 5 ans" },
    "5 à 10 ans": { en: "5 to 10 years", fr: "5 à 10 ans" },
    "10 ans et plus": { en: "10+ years", fr: "10 ans et plus" }
  };

  return labels[value]?.[locale] || value;
}

function mapAvailabilityLabel(value, locale = "fr") {
  if (!value) return locale === "en" ? "To confirm" : "À confirmer";
  return value;
}

function mapRegionLabel(value, locale = "fr") {
  const normalized = normalizeRegion(value);
  if (locale !== "en") return normalized || "Belgique";

  const map = {
    "Bruxelles-Capitale": "Brussels-Capital Region",
    Wallonie: "Wallonia",
    Flandre: "Flanders",
    "Plusieurs régions": "Multiple regions"
  };

  return map[normalized] || normalized || "Belgium";
}

function mapContractLabel(value, locale = "fr") {
  if (!value) return locale === "en" ? "Not provided" : "Non renseigné";

  const map = {
    CDI: { fr: "CDI", en: "Permanent contract" },
    CDD: { fr: "CDD", en: "Fixed-term contract" },
    Intérim: { fr: "Intérim", en: "Temporary agency contract" }
  };

  return map[value]?.[locale] || value;
}

function mapUrgencyLabel(value, locale = "fr") {
  if (!value) return locale === "en" ? "Standard" : "Normale";

  const map = {
    Normal: { fr: "Normale", en: "Standard" },
    Normale: { fr: "Normale", en: "Standard" },
    Élevée: { fr: "Élevée", en: "High" },
    High: { fr: "Élevée", en: "High" },
    Urgent: { fr: "Urgent", en: "Urgent" }
  };

  return map[value]?.[locale] || value;
}

function normalizeLanguages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapLanguagesLabel(value, locale = "fr") {
  const list = normalizeLanguages(value);
  if (!list.length) return locale === "en" ? "To confirm" : "À confirmer";

  const map = {
    français: { fr: "Français", en: "French" },
    french: { fr: "Français", en: "French" },
    anglais: { fr: "Anglais", en: "English" },
    english: { fr: "Anglais", en: "English" },
    néerlandais: { fr: "Néerlandais", en: "Dutch" },
    dutch: { fr: "Néerlandais", en: "Dutch" },
    arabe: { fr: "Arabe", en: "Arabic" },
    arabic: { fr: "Arabe", en: "Arabic" }
  };

  return list
    .map((item) => map[normalizeValue(item)]?.[locale] || item)
    .join(locale === "en" ? ", " : ", ");
}

function getBelgiumEligibilityLabel(score, locale = "fr") {
  if (score < HIGH_SCORE_THRESHOLD) return null;
  return locale === "en"
    ? "Single permit likely feasible"
    : "Permis unique probablement faisable";
}

async function getLatestNotificationLog(supabase, recipientEmail, notificationType) {
  const { data } = await supabase
    .from("match_notification_logs")
    .select("sent_at")
    .eq("recipient_email", String(recipientEmail).toLowerCase().trim())
    .eq("notification_type", notificationType)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.sent_at ? new Date(data.sent_at) : null;
}

async function logNotification(supabase, { recipientEmail, recipientRole, notificationType, locale, relatedCount, payload }) {
  await supabase.from("match_notification_logs").insert({
    recipient_email: String(recipientEmail).toLowerCase().trim(),
    recipient_role: recipientRole,
    notification_type: notificationType,
    locale,
    related_count: relatedCount,
    payload
  });
}

function canSendNow(lastSentAt) {
  return !lastSentAt || Date.now() - lastSentAt.getTime() >= NOTIFICATION_WINDOW_MS;
}

function getSinceDate(lastSentAt) {
  return lastSentAt ? lastSentAt.toISOString() : new Date(Date.now() - NOTIFICATION_WINDOW_MS).toISOString();
}

function buildEmployerDigestRows(rows, locale) {
  return rows.map(({ match, worker }) => ({
    title: worker.target_job || (locale === "en" ? "New worker" : "Nouveau travailleur"),
    location: mapRegionLabel(worker.preferred_region, locale),
    experience: mapExperienceLabel(worker.experience_level, locale),
    languages: mapLanguagesLabel(worker.languages, locale),
    availability: mapAvailabilityLabel(worker.availability, locale),
    score: match.score,
    eligibilityLabel: getBelgiumEligibilityLabel(match.score, locale)
  }));
}

function buildWorkerDigestRows(rows, locale) {
  return rows.map(({ match, offer }) => ({
    title: offer.title || (locale === "en" ? "New opportunity" : "Nouvelle opportunité"),
    company: locale === "en" ? "Belgian employer" : "Employeur belge",
    sector: offer.sector || (locale === "en" ? "Sector to confirm" : "Secteur à confirmer"),
    location: mapRegionLabel(offer.region, locale),
    contractType: mapContractLabel(offer.contract_type, locale),
    urgency: mapUrgencyLabel(offer.urgency, locale),
    score: match.score,
    eligibilityLabel: getBelgiumEligibilityLabel(match.score, locale)
  }));
}

export async function notifyWorkersForNewOffer({ supabase, offerId }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !offerId) return;

  const resend = new Resend(apiKey);
  const from = getSenderAddress();

  const { data: offer } = await supabase
    .from("job_offers")
    .select("id, title, sector, region, contract_type, urgency, status")
    .eq("id", offerId)
    .maybeSingle();

  if (!offer || offer.status !== "published") return;

  const { data: matches } = await supabase
    .from("matches")
    .select("id, worker_profile_id, score, created_at")
    .eq("job_offer_id", offerId)
    .gte("score", MIN_MATCH_SCORE);

  if (!matches?.length) return;

  const workerIds = [...new Set(matches.map((match) => match.worker_profile_id))];
  const { data: workers } = await supabase
    .from("worker_profiles")
    .select("id, user_id, email, target_job, preferred_region, experience_level, languages, availability")
    .in("id", workerIds);

  if (!workers?.length) return;

  const workerMap = new Map(workers.map((worker) => [worker.id, worker]));

  for (const worker of workers) {
    if (!worker.match_alerts_enabled) continue;

    const authUser = worker.user_id
      ? await supabase.auth.admin.getUserById(worker.user_id).catch(() => ({ data: null }))
      : { data: null };
    const recipientEmail = authUser?.data?.user?.email || worker.email;
    const userMetadata = authUser?.data?.user?.user_metadata || {};
    if (!recipientEmail) continue;
    if (userMetadata.match_alerts_enabled === false) continue;
    if (await isUnsubscribed(recipientEmail).catch(() => false)) continue;

    const locale = resolveLocale(userMetadata.preferred_locale);
    const notificationType = "worker_new_offers";
    const lastSentAt = await getLatestNotificationLog(supabase, recipientEmail, notificationType);
    if (!canSendNow(lastSentAt)) continue;

    const sinceDate = getSinceDate(lastSentAt);
    const { data: digestMatches } = await supabase
      .from("matches")
      .select("id, job_offer_id, worker_profile_id, score, created_at")
      .eq("worker_profile_id", worker.id)
      .gte("score", MIN_MATCH_SCORE)
      .gte("created_at", sinceDate)
      .order("score", { ascending: false });

    if (!digestMatches?.length) continue;

    const offerIds = [...new Set(digestMatches.map((match) => match.job_offer_id))];
    const { data: digestOffers } = await supabase
      .from("job_offers")
      .select("id, title, sector, region, contract_type, urgency, status")
      .in("id", offerIds)
      .eq("status", "published");

    const offerMap = new Map((digestOffers || []).map((row) => [row.id, row]));
    const items = digestMatches
      .map((match) => ({ match, offer: offerMap.get(match.job_offer_id) }))
      .filter((row) => row.offer)
      .slice(0, 3);

    if (!items.length) continue;

    const summaryRows = buildWorkerDigestRows(items, locale);
    const links = buildPreferenceLinks("worker", locale);
    const subject =
      locale === "en"
        ? items.length > 1
          ? `${items.length} new opportunities match your profile on LEXPAT Connect`
          : "A new opportunity matches your profile on LEXPAT Connect"
        : items.length > 1
          ? `${items.length} nouvelles opportunités correspondent à votre profil sur LEXPAT Connect`
          : "Une nouvelle opportunité correspond à votre profil sur LEXPAT Connect";

    await resend.emails.send({
      from,
      to: recipientEmail,
      subject,
      html: newWorkerMatchDigestEmailHtml({
        locale,
        rows: summaryRows,
        profileTitle: worker.target_job,
        primaryCtaUrl: links.primarySpaceUrl,
        simulatorUrl: links.simulatorUrl,
        legalSupportUrl: links.legalSupportUrl,
        preferencesUrl: links.preferencesUrl,
        recipientEmail
      })
    }).catch(() => {});

    await logNotification(supabase, {
      recipientEmail,
      recipientRole: "worker",
      notificationType,
      locale,
      relatedCount: summaryRows.length,
      payload: { worker_profile_id: worker.id, offer_ids: items.map((item) => item.offer.id) }
    }).catch(() => {});
  }
}

export async function notifyEmployersForNewWorker({ supabase, workerProfileId }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !workerProfileId) return;

  const resend = new Resend(apiKey);
  const from = getSenderAddress();

  const { data: matchRows } = await supabase
    .from("matches")
    .select("id, job_offer_id, worker_profile_id, score, created_at")
    .gte("score", MIN_MATCH_SCORE);

  if (!matchRows?.length) return;

  const offerIds = [...new Set(matchRows.map((row) => row.job_offer_id))];
  const { data: offers } = await supabase
    .from("job_offers")
    .select("id, employer_profile_id, title, sector, region, status")
    .in("id", offerIds)
    .eq("status", "published");

  if (!offers?.length) return;

  const offersByEmployer = offers.reduce((acc, offer) => {
    const current = acc.get(offer.employer_profile_id) || [];
    current.push(offer);
    acc.set(offer.employer_profile_id, current);
    return acc;
  }, new Map());

  const employerProfileIds = [...offersByEmployer.keys()];
  const { data: members } = await supabase
    .from("employer_members")
    .select("id, employer_profile_id, user_id, work_email")
    .in("employer_profile_id", employerProfileIds);

  if (!members?.length) return;

  const offerMap = new Map(offers.map((offer) => [offer.id, offer]));

  for (const member of members) {
    if (!member.work_email) continue;
    const authUser = member.user_id
      ? await supabase.auth.admin.getUserById(member.user_id).catch(() => ({ data: null }))
      : { data: null };
    const userMetadata = authUser?.data?.user?.user_metadata || {};
    if (userMetadata.match_alerts_enabled === false) continue;
    if (await isUnsubscribed(member.work_email).catch(() => false)) continue;

    const locale = resolveLocale(userMetadata.preferred_locale);
    const notificationType = "employer_new_workers";
    const lastSentAt = await getLatestNotificationLog(supabase, member.work_email, notificationType);
    if (!canSendNow(lastSentAt)) continue;

    const sinceDate = getSinceDate(lastSentAt);
    const employerOfferIds = (offersByEmployer.get(member.employer_profile_id) || []).map((offer) => offer.id);
    if (!employerOfferIds.length) continue;

    const employerMatches = matchRows
      .filter((row) => employerOfferIds.includes(row.job_offer_id))
      .filter((row) => new Date(row.created_at).toISOString() >= sinceDate)
      .sort((a, b) => b.score - a.score);

    if (!employerMatches.length) continue;

    const workerIds = [...new Set(employerMatches.map((row) => row.worker_profile_id))];
    const { data: workers } = await supabase
      .from("worker_profiles")
      .select("id, target_job, preferred_region, experience_level, languages, availability, profile_visibility")
      .in("id", workerIds)
      .eq("profile_visibility", "visible");

    const workerMap = new Map((workers || []).map((row) => [row.id, row]));
    const dedupedWorkers = [];
    const seenWorkers = new Set();
    for (const match of employerMatches) {
      if (seenWorkers.has(match.worker_profile_id)) continue;
      const worker = workerMap.get(match.worker_profile_id);
      if (!worker) continue;
      seenWorkers.add(match.worker_profile_id);
      dedupedWorkers.push({ match, worker });
      if (dedupedWorkers.length >= 3) break;
    }

    if (!dedupedWorkers.length) continue;

    const summaryRows = buildEmployerDigestRows(dedupedWorkers, locale);
    const links = buildPreferenceLinks("employer", locale);
    const subject =
      locale === "en"
        ? dedupedWorkers.length > 1
          ? `${dedupedWorkers.length} new workers match your search on LEXPAT Connect`
          : "A new worker matches your search on LEXPAT Connect"
        : dedupedWorkers.length > 1
          ? `${dedupedWorkers.length} nouveaux travailleurs correspondent à votre recherche sur LEXPAT Connect`
          : "Un nouveau travailleur correspond à votre recherche sur LEXPAT Connect";

    await resend.emails.send({
      from,
      to: member.work_email,
      subject,
      html: newEmployerMatchDigestEmailHtml({
        locale,
        rows: summaryRows,
        matchedOfferTitle: offerMap.get(dedupedWorkers[0].match.job_offer_id)?.title || null,
        primaryCtaUrl: links.primarySpaceUrl,
        simulatorUrl: links.simulatorUrl,
        legalSupportUrl: links.legalSupportUrl,
        preferencesUrl: links.preferencesUrl,
        recipientEmail: member.work_email
      })
    }).catch(() => {});

    await logNotification(supabase, {
      recipientEmail: member.work_email,
      recipientRole: "employer",
      notificationType,
      locale,
      relatedCount: summaryRows.length,
      payload: { employer_profile_id: member.employer_profile_id, worker_profile_ids: dedupedWorkers.map((item) => item.worker.id) }
    }).catch(() => {});
  }
}
