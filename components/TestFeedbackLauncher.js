"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { detectLocaleFromPathname, localizeHref } from "../lib/i18n";

export default function TestFeedbackLauncher() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPathname(pathname);
  const isEn = locale === "en";

  if (pathname.includes("/retours-test")) return null;

  return (
    <Link
      href={localizeHref("/retours-test", locale)}
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2.5 rounded-full border border-[#8ed7d0] bg-[linear-gradient(135deg,rgba(30,58,120,0.96),rgba(87,183,175,0.96))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(29,59,139,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(29,59,139,0.28)]"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 text-white">
          <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.12" />
          <circle cx="9" cy="10" r="2.1" fill="currentColor" />
          <circle cx="15" cy="10" r="2.1" fill="currentColor" />
          <circle cx="9.4" cy="9.4" r="0.55" fill="#ffffff" />
          <circle cx="15.4" cy="9.4" r="0.55" fill="#ffffff" />
          <path d="M8.8 14.7c1 .95 2 1.35 3.2 1.35 1.2 0 2.2-.4 3.2-1.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
