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
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2.5 rounded-full border border-[#8ed7d0] bg-[linear-gradient(135deg,rgba(30,58,120,0.96),rgba(87,183,175,0.96))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(29,59,139,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(29,59,139,0.28)]"
    >
      <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-full border border-white/25 bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <Image
          src="/persobug.jpeg"
          alt=""
          fill
          sizes="36px"
          className="object-cover"
        />
      </span>
      <span>{isEn ? "Report a bug" : "Signaler un bug"}</span>
    </Link>
  );
}
