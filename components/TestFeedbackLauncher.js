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
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-[#dce8f5] bg-white/95 px-3 py-2 text-xs font-semibold text-[#1E3A78] shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#bcd0ec] hover:text-[#1E3A78]"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#eef4ff] text-[11px]">
        !
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
