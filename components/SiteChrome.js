"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import {
  detectLocaleFromPathname,
  localizeHref,
  siteCopy,
  switchLocalePath
} from "../lib/i18n";

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPathname(pathname);
  const copy = siteCopy[locale];

  const navigation = [
    { href: "/", label: copy.nav.home },
    { href: "/histoire-de-la-fondatrice", label: copy.nav.about },
    { href: "/permis-unique", label: copy.nav.services, color: "blue" },
    { href: "/accompagnement-juridique", label: copy.nav.legalSupport },
    { href: "/contact", label: copy.nav.contact }
  ];

  const navDropdowns = {
    "/permis-unique": {
      color: "blue",
      items: [
        {
          href: "/permis-unique",
          label: copy.nav.permitGuide,
          description: locale === "en" ? "Conditions, process and permit categories" : "Conditions, procédure et catégories de permis",
          icon: "doc"
        },
        {
          href: "/travailleurs-hautement-qualifies",
          label: copy.nav.hqWorkers,
          description: locale === "en" ? "Salary thresholds and EU Blue Card" : "Seuils salariaux et Carte bleue européenne",
          icon: "star"
        }
      ,
        {
          href: "/metiers-en-penurie",
          label: copy.nav.shortageJobs,
          description: locale === "en" ? "Occupations opening faster international recruitment paths" : "Professions ouvrant des voies de recrutement international plus rapides",
          icon: "pin"
        },
        {
          href: "/securite-conformite",
          label: copy.nav.compliance,
          description: locale === "en" ? "GDPR, personal data and process security" : "RGPD, données personnelles et sécurité des processus",
          icon: "globe"
        },
        {
          href: "/contact",
          label: copy.nav.family,
          description: locale === "en" ? "Contact the firm for family reunification and nationality matters" : "Contacter le cabinet pour le regroupement familial et la nationalité",
          icon: "arrow"
        }
      ]
    }
  };

  const legalLinks = [
    { href: "/mentions-legales", label: copy.legalLinks.legal },
    { href: "/politique-de-confidentialite", label: copy.legalLinks.privacy },
    { href: "/cookies", label: copy.legalLinks.cookies },
    { href: "/conditions-utilisation", label: copy.legalLinks.terms },
    { href: "/securite-conformite", label: copy.legalLinks.security },
    { href: "/retours-test", label: copy.legalLinks.feedback },
    { href: "/admin", label: copy.legalLinks.admin }
  ];

  return (
    <div className="shell">
      <header className="sticky top-0 z-40 border-b border-[#edf1f5] bg-white/92 backdrop-blur-xl">
        <div className="container-shell flex min-h-[72px] flex-col justify-center py-3 lg:min-h-[88px] lg:flex-row lg:items-center lg:py-0">
          <div className="flex w-full items-center justify-between gap-4">
            <Link href={localizeHref("/", locale)} className="flex items-center gap-3 lg:gap-4">
              <span className="relative inline-flex h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-[#d9e9f1] bg-white shadow-[0_10px_24px_rgba(17,39,87,0.08)] lg:h-[72px] lg:w-[72px]">
                <Image
                  src="/logo-lexpat-connect.png"
                  alt="Logo LEXPAT"
                  fill
                  className="object-cover p-[5px]"
                  sizes="(min-width: 1024px) 72px, 56px"
                />
              </span>
              <span className="leading-tight">
                <span className="font-heading block text-[20px] font-bold tracking-[0.08em] text-[#1E3A78] lg:text-[25px]">
                  LEXPAT
                </span>
                <span className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-[#B5121B] lg:text-[14px]">
                  Cabinet d'avocats
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-4 lg:flex">
              <nav className="flex items-center gap-5 text-[13px] font-medium text-[#607086]">
                {navigation.map((item) => {
                  const dd = navDropdowns[item.href];
                  return dd ? (
                    <NavDropdown
                      key={item.href}
                      href={localizeHref(item.href, locale)}
                      label={item.label}
                      items={dd.items.map((sub) => ({ ...sub, href: localizeHref(sub.href, locale) }))}
                      color={dd.color}
                    />
                  ) : (
                    <Link key={item.href} href={localizeHref(item.href, locale)} className="whitespace-nowrap transition hover:text-[#1E3A78]">
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="ml-1 mr-2 flex items-center gap-1 rounded-full border border-[#e3eaf1] bg-white p-1">
                <Link
                  href={switchLocalePath(pathname, "fr")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${locale === "fr" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
                >
                  {copy.language.fr}
                </Link>
                <Link
                  href={switchLocalePath(pathname, "en")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${locale === "en" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
                >
                  {copy.language.en}
                </Link>
              </div>
              <Link
                href={localizeHref("/contact", locale)}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#B5121B] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(181,18,27,0.2)] transition hover:-translate-y-0.5 hover:bg-[#991219]"
              >
                {locale === "en" ? "Book an appointment" : "Prendre un rendez-vous"}
              </Link>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex items-center gap-1 rounded-full border border-[#e3eaf1] bg-white p-1">
                <Link
                  href={switchLocalePath(pathname, "fr")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${locale === "fr" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
                >
                  FR
                </Link>
                <Link
                  href={switchLocalePath(pathname, "en")}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${locale === "en" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
                >
                  EN
                </Link>
              </div>
              <Link
                href={localizeHref("/contact", locale)}
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-[16px] bg-[#B5121B] px-4 py-2 text-xs font-bold text-white shadow-[0_10px_24px_rgba(181,18,27,0.18)]"
              >
                {locale === "en" ? "Contact" : "Contact"}
              </Link>
            </div>
          </div>

          <nav className="mt-4 flex w-full flex-wrap gap-2 overflow-x-auto pb-1 text-sm font-medium text-[#607086] lg:hidden">
            {navigation.map((item) => {
              const dd = navDropdowns[item.href];
              return dd ? (
                <NavDropdown
                  key={item.href}
                  href={localizeHref(item.href, locale)}
                  label={item.label}
                  items={dd.items.map((sub) => ({ ...sub, href: localizeHref(sub.href, locale) }))}
                  color={dd.color}
                  mobile
                />
              ) : (
                <Link
                  key={item.href}
                  href={localizeHref(item.href, locale)}
                  className="whitespace-nowrap rounded-full border border-[#e3eaf1] bg-white px-4 py-2 transition hover:border-[#d9c4c7] hover:text-[#B5121B]"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-[#edf1f5] bg-white/90">
        <div className="container-shell py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex h-12 w-12 overflow-hidden rounded-[18px] border border-[#d9e9f1] bg-white shadow-[0_6px_16px_rgba(17,39,87,0.08)]">
                  <Image src="/logo-lexpat-connect.png" alt="Logo LEXPAT" fill className="object-cover" sizes="48px" />
                </span>
                <div className="leading-none">
                  <p className="text-xl font-black tracking-[0.06em] text-[#1E2F86]">LEXPAT</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#B5121B]">Cabinet d'avocats</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#607086]">
                {copy.footer.brandText}
              </p>
            </div>

            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">{copy.footer.employers}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/histoire-de-la-fondatrice", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.recruit}</Link>
                <Link href={localizeHref("/contact", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.availableCandidates}</Link>
                <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.shortageJobs}</Link>
              </div>
              <p className="mt-6 font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">{copy.footer.workers}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/permis-unique", locale)} className="block transition hover:text-[#57B7AF]">{copy.footer.apply}</Link>
                <Link href={localizeHref("/contact", locale)} className="block transition hover:text-[#57B7AF]">{copy.footer.offers}</Link>
              </div>
            </div>

            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">{copy.footer.quickActions}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/contact", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.postNeed}</Link>
                <Link href={localizeHref("/accompagnement-juridique", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.makeVisible}</Link>
                <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.shortageJobs}</Link>
                <Link href={localizeHref("/permis-unique", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.understandPermit}</Link>
                <Link href={localizeHref("/histoire-de-la-fondatrice", locale)} className="block text-sm text-[#607086] transition hover:text-[#204E97]">
                  {copy.footer.founderStory}
                </Link>
              </div>
            </div>

            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">{copy.footer.cabinet}</p>
              <p className="mt-4 text-sm leading-7 text-[#607086]">
                {copy.footer.cabinetText}
              </p>
              <div className="mt-5">
                <Link href={localizeHref("/accompagnement-juridique", locale)} className="secondary-button text-center">
                  {copy.footer.cabinetCta}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#edf1f5] pt-6">
            <div className="flex flex-col gap-4 rounded-[24px] border border-[#edf3f7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-5 py-4 text-sm text-[#6d7b8d] shadow-[0_10px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <p className="leading-7">
                {copy.footer.bottom}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    className="inline-flex rounded-full border border-transparent px-3 py-1.5 transition hover:border-[#dce7ef] hover:bg-white hover:text-[#1E3A78]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
