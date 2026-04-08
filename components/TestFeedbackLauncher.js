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
          <circle cx="9.5" cy="12" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="9" cy="15" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="12" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="0.85" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
