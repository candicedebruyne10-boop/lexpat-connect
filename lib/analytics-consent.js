export const STORAGE_KEY = "lexpat-cookie-consent";
export const COOKIE_KEY = "lexpat_cookie_consent";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
export const ANALYTICS_CONSENT_EVENT = "lexpat-analytics-consent-changed";

function parseConsent(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function readCookieConsent() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]+)`));
  if (!match) return null;

  return parseConsent(decodeURIComponent(match[1]));
}

export function readStoredConsent() {
  const localConsent =
    typeof window !== "undefined" ? parseConsent(window.localStorage.getItem(STORAGE_KEY)) : null;

  return localConsent || readCookieConsent();
}
