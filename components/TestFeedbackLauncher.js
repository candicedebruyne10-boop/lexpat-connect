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
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-3 rounded-full border border-[#79d8d0] bg-[linear-gradient(135deg,#244892_0%,#5fc8be_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(29,59,139,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(29,59,139,0.28)]"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
          <path d="M8.7 14.1c.8 1 1.94 1.5 3.3 1.5s2.5-.5 3.3-1.5" />
        </svg>
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
