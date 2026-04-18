"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { detectLocaleFromPathname, localizeHref } from "../lib/i18n";

export default function TestFeedbackLauncher() {
  const pathname = usePathname() || "/";
  const locale   = detectLocaleFromPathname(pathname);
  const isEn     = locale === "en";
  const label    = isEn ? "Report a bug" : "Signaler un bug";

  const [expanded, setExpanded] = useState(false);

  if (pathname.includes("/retours-test")) return null;

  return (
    <Link
      href={localizeHref("/retours-test", locale)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      title={label}
      aria-label={label}
      style={{
        position: "fixed",
        bottom: 80,          /* au-dessus des CTAs fixes */
        right: 16,
        zIndex: 40,
        display: "inline-flex",
        alignItems: "center",
        gap: 0,
        borderRadius: 999,
        border: "1px solid #79d8d0",
        background: "linear-gradient(135deg,#244892 0%,#5fc8be 100%)",
        boxShadow: "0 10px 24px rgba(29,59,139,0.22)",
        padding: expanded ? "6px 14px 6px 6px" : "6px",
        textDecoration: "none",
        transition: "padding 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        transform: expanded ? "translateY(-2px)" : "none",
      }}
    >
      {/* Icône coccinelle */}
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.12)",
        flexShrink: 0,
      }}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20" height="20"
          fill="none"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 7.5 7.4 5.7M15 7.5l1.6-1.8" />
          <path d="M8.2 9.1c0-2.2 1.7-4.1 3.8-4.1s3.8 1.9 3.8 4.1" />
          <path d="M12 8.6v9.2" />
          <path d="M7.3 10.4 5.2 9.2M7.1 13.4 4.8 13.4M7.6 16.2 5.7 17.4" />
          <path d="M16.7 10.4 18.8 9.2M16.9 13.4 19.2 13.4M16.4 16.2 18.3 17.4" />
          <path d="M12 19.2c-3.2 0-5.8-2.4-5.8-5.5v-.2c0-2.1 1.2-3.7 2.9-4.6 1-.5 1.9-.7 2.9-.7s2 .2 2.9.7c1.7.9 2.9 2.5 2.9 4.6v.2c0 3.1-2.6 5.5-5.8 5.5Z" />
          <circle cx="9.5" cy="12" r="0.85" fill="white" stroke="none" />
          <circle cx="9"   cy="15" r="0.85" fill="white" stroke="none" />
          <circle cx="14.5" cy="12" r="0.85" fill="white" stroke="none" />
          <circle cx="15"  cy="15" r="0.85" fill="white" stroke="none" />
        </svg>
      </span>

      {/* Texte — visible uniquement au survol */}
      <span style={{
        maxWidth: expanded ? 140 : 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontSize: 13,
        fontWeight: 600,
        color: "white",
        marginLeft: expanded ? 8 : 0,
        transition: "max-width 0.2s ease, margin-left 0.2s ease",
      }}>
        {label}
      </span>
    </Link>
  );
}
