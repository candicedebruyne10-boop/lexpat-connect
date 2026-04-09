"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import {
  ANALYTICS_CONSENT_EVENT,
  readStoredConsent
} from "../lib/analytics-consent";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function hasAnalyticsConsent() {
  return Boolean(readStoredConsent()?.analytics);
}

export default function ConsentAwareAnalytics() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [googleAnalyticsReady, setGoogleAnalyticsReady] = useState(false);

  useEffect(() => {
    function syncConsent() {
      setAnalyticsEnabled(hasAnalyticsConsent());
    }

    syncConsent();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("consent", "update", {
      analytics_storage: analyticsEnabled ? "granted" : "denied"
    });
  }, [analyticsEnabled]);

  useEffect(() => {
    if (
      !analyticsEnabled ||
      !measurementId ||
      !googleAnalyticsReady ||
      typeof window === "undefined" ||
      typeof window.gtag !== "function"
    ) {
      return;
    }

    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [analyticsEnabled, googleAnalyticsReady, pathname, searchParams]);

  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      <VercelAnalytics />
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
            onLoad={() => setGoogleAnalyticsReady(true)}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
              window.gtag('js', new Date());
              window.gtag('consent', 'default', { analytics_storage: 'granted' });
              window.gtag('config', '${measurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
