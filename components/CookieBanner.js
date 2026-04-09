"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { detectLocaleFromPathname, localizeHref } from "../lib/i18n";
import {
  ANALYTICS_CONSENT_EVENT,
  COOKIE_KEY,
  COOKIE_MAX_AGE,
  STORAGE_KEY,
  readCookieConsent
} from "../lib/analytics-consent";

function persistConsent(consent) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
  }

  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(consent))}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  }
}

export default function CookieBanner() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPathname(pathname);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const copy = useMemo(
    () =>
      locale === "en"
        ? {
            eyebrow: "Cookies",
            title: "A simple and transparent choice",
            description:
              "We use essential cookies to keep the site secure and functional. You can also allow audience measurement cookies to help us improve LEXPAT Connect.",
            essentialTitle: "Essential cookies",
            essentialDescription:
              "Always active. They keep navigation, security, authentication and forms working properly.",
            analyticsTitle: "Audience measurement",
            analyticsDescription:
              "Optional. Helps us understand usage and improve the experience.",
            active: "Always active",
            more: "Read the cookie policy",
            decline: "Decline",
            accept: "Accept",
            customize: "Customize",
            save: "Save my choices"
          }
        : {
            eyebrow: "Cookies",
            title: "Un choix simple et transparent",
            description:
              "Nous utilisons des cookies essentiels pour faire fonctionner le site en toute securite. Vous pouvez aussi autoriser des cookies de mesure d'audience pour nous aider a ameliorer LEXPAT Connect.",
            essentialTitle: "Cookies essentiels",
            essentialDescription:
              "Toujours actifs. Ils assurent la navigation, la securite, l'authentification et le bon fonctionnement des formulaires.",
            analyticsTitle: "Mesure d'audience",
            analyticsDescription:
              "Optionnelle. Elle nous aide a comprendre l'usage du site et a ameliorer l'experience.",
            active: "Toujours actif",
            more: "Voir la politique cookies",
            decline: "Refuser",
            accept: "Accepter",
            customize: "Personnaliser",
            save: "Enregistrer mes choix"
          },
    [locale]
  );

  useEffect(() => {
    let parsedLocal = null;

    try {
      const localConsent =
        typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      parsedLocal = localConsent ? JSON.parse(localConsent) : null;
    } catch {
      parsedLocal = null;
    }

    const parsedCookie = readCookieConsent();
    const existingConsent = parsedLocal || parsedCookie;

    if (existingConsent) {
      setAnalyticsEnabled(Boolean(existingConsent.analytics));
      setVisible(false);
    } else {
      setVisible(true);
    }

    setMounted(true);
  }, []);

  if (!mounted || !visible) {
    return null;
  }

  function saveConsent(consent) {
    persistConsent(consent);
    setAnalyticsEnabled(Boolean(consent.analytics));
    setVisible(false);
    setShowPreferences(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[#d8e4ef] bg-white/95 shadow-[0_28px_80px_rgba(17,39,87,0.18)] backdrop-blur-xl">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-[#dbe8f1] bg-[#f7fbfd] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#57b7af]">
              {copy.eyebrow}
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-[#1E3A78]">
                {copy.title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#607086] sm:text-[15px]">
                {copy.description}
              </p>
            </div>
            <Link
              href={localizeHref("/cookies", locale)}
              className="inline-flex text-sm font-semibold text-[#204E97] transition hover:text-[#57b7af]"
            >
              {copy.more}
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    necessary: true,
                    analytics: false,
                    updatedAt: new Date().toISOString()
                  })
                }
                className="rounded-full border border-[#d8e4ef] px-5 py-3 text-sm font-semibold text-[#607086] transition hover:border-[#c6d7e5] hover:text-[#1E3A78]"
              >
                {copy.decline}
              </button>
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    necessary: true,
                    analytics: true,
                    updatedAt: new Date().toISOString()
                  })
                }
                className="rounded-full bg-[#1E3A78] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,58,120,0.25)] transition hover:bg-[#204E97]"
              >
                {copy.accept}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowPreferences((current) => !current)}
              className="w-full rounded-full border border-[#d8e4ef] bg-[#f8fbfd] px-5 py-3 text-sm font-semibold text-[#1E3A78] transition hover:border-[#cde2df] hover:text-[#57b7af] lg:ml-auto lg:w-auto"
            >
              {copy.customize}
            </button>
          </div>
        </div>

        {showPreferences ? (
          <div className="border-t border-[#edf1f5] bg-[#fbfdff] px-5 py-5 sm:px-7">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[22px] border border-[#e4edf4] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[#1E3A78]">
                      {copy.essentialTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#607086]">
                      {copy.essentialDescription}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eef6f4] px-3 py-1 text-xs font-semibold text-[#57b7af]">
                    {copy.active}
                  </span>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#e4edf4] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[#1E3A78]">
                      {copy.analyticsTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#607086]">
                      {copy.analyticsDescription}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={analyticsEnabled}
                    onClick={() => setAnalyticsEnabled((current) => !current)}
                    className={`relative inline-flex h-8 w-14 flex-shrink-0 rounded-full transition ${
                      analyticsEnabled ? "bg-[#57b7af]" : "bg-[#d5deea]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_4px_10px_rgba(17,39,87,0.15)] transition ${
                        analyticsEnabled ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    necessary: true,
                    analytics: analyticsEnabled,
                    updatedAt: new Date().toISOString()
                  })
                }
                className="rounded-full bg-[#204E97] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E3A78]"
              >
                {copy.save}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
