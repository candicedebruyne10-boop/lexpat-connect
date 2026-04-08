"use client";

import Link from "next/link";
import Image from "next/image";
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
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-3 rounded-full border border-[#bfe8e2] bg-[linear-gradient(135deg,rgba(30,58,120,0.98),rgba(87,183,175,0.98))] px-3 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(29,59,139,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(29,59,139,0.28)]"
    >
      <span className="rounded-full bg-white/95 p-1.5 shadow-[0_6px_16px_rgba(17,39,87,0.18)]">
      <span className="relative inline-flex h-11 w-11 overflow-hidden rounded-full border border-[#d9e9f1] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
        <Image
          src="/persobug3.jpeg"
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </span>
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
