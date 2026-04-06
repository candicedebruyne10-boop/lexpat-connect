"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavAuth, { NavAuthMobile } from "./NavAuth";
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
    { href: "/employeurs", label: copy.nav.employers, color: "blue" },
    { href: "/travailleurs", label: copy.nav.workers, color: "teal" },
    { href: "/permis-unique", label: copy.nav.immigration, color: "slate" }
  ];

  const navDropdowns = {
    "/employeurs": {
      color: "blue",
      items: [
        {
          href: "/employeurs",
          label: copy.nav.recruit,
          description: locale === "en" ? "Submit your hiring need" : "Déposez votre besoin de recrutement",
          icon: "arrow"
        },
        {
          href: "/base-de-profils",
          label: copy.nav.candidates,
          description: locale === "en" ? "Browse international candidates" : "Parcourez les candidats internationaux",
          icon: "search"
        }
      ]
    },
    "/travailleurs": {
      color: "teal",
      items: [
        {
          href: "/travailleurs",
          label: copy.nav.apply,
          description: locale === "en" ? "Make your profile visible to Belgian employers" : "Rendez votre profil visible aux employeurs belges",
          icon: "star"
        },
        {
          href: "/offres-d-emploi",
          label: copy.nav.offers,
          description: locale === "en" ? "Browse open positions in Belgium" : "Consultez les postes ouverts en Belgique",
          icon: "doc"
        }
      ]
    },
    "/permis-unique": {
      color: "slate",
      items: [
        {
          href: "/permis-unique",
          label: copy.nav.permitGuide,
          description: locale === "en" ? "Conditions, procedure and permit types" : "Conditions, procédure, types de permis",
          icon: "doc"
        },
        {
          href: "/travailleurs-hautement-qualifies",
          label: copy.nav.hqWorkers,
          description: locale === "en" ? "Salary thresholds and EU Blue Card" : "Seuils de salaire, Carte Bleue Européenne",
          icon: "star"
        },
        {
          href: "/metiers-en-penurie",
          label: copy.nav.shortageJobs,
          description: locale === "en" ? "Occupations that can support a single permit" : "Professions ouvrant droit au permis unique",
          icon: "pin"
        },
        {
          href: "/securite-conformite",
          label: copy.nav.compliance,
          description: locale === "en" ? "GDPR, personal data and process security" : "RGPD, données personnelles, sécurisation",
          icon: "globe"
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
        <div className="container-shell flex min-h-[72px] items-center lg:min-h-[88px]">
          <div className="flex w-full items-center justify-between gap-4">
            <Link href={localizeHref("/", locale)} className="flex items-center gap-3 lg:gap-4">
              <span className="relative inline-flex h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-[#d9e9f1] bg-white shadow-[0_10px_24px_rgba(17,39,87,0.08)] lg:h-[72px] lg:w-[72px]">
                <Image
                  src="/logo-lexpat-connect.png"
                  alt="Logo LEXPAT Connect"
                  fill
                  className="object-cover p-[5px]"
                  sizes="(min-width: 1024px) 72px, 56px"
                />
              </span>
              <span className="leading-tight">
                <span className="font-heading block text-[20px] font-bold tracking-[0.08em] text-[#1E3A78] lg:text-[24px]">
                  LEXPAT
                </span>
                <span className="block text-[15px] font-normal tracking-[0.03em] text-[#6d7b8d] lg:text-[18px]">
                  Connect
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-3 lg:flex">
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
              <div className="mx-1 h-5 w-px bg-[#e3eaf1]" />
              <NavAuth />
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
              <NavAuthMobile />
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#c8d8ee] bg-white text-[#1E3A78] shadow-[0_8px_20px_rgba(29,59,139,0.06)]">
                <span className="flex flex-col gap-1">
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                </span>
              </div>
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-1 text-sm font-medium text-[#607086] lg:hidden">
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
                  className="whitespace-nowrap rounded-full border border-[#e3eaf1] bg-white px-4 py-2 transition hover:border-[#cde2df] hover:text-[#57b7af]"
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
                  <Image src="/logo-lexpat-connect.png" alt="Logo LEXPAT Connect" fill className="object-cover" sizes="48px" />
                </span>
                <div className="leading-none">
                  <p className="text-xl font-black tracking-[0.06em] text-[#1E2F86]">LEXPAT</p>
                  <p className="mt-1 text-lg font-light tracking-[-0.02em] text-[#7CCDC7]">Connect</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#607086]">
                {copy.footer.brandText}
              </p>
            </div>

            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">{copy.footer.employers}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/employeurs", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.recruit}</Link>
                <Link href={localizeHref("/base-de-profils", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.availableCandidates}</Link>
                <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.shortageJobs}</Link>
              </div>
              <p className="mt-6 font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">{copy.footer.workers}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/travailleurs", locale)} className="block transition hover:text-[#57B7AF]">{copy.footer.apply}</Link>
                <Link href={localizeHref("/offres-d-emploi", locale)} className="block transition hover:text-[#57B7AF]">{copy.footer.offers}</Link>
              </div>
            </div>

            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">{copy.footer.quickActions}</p>
              <div className="mt-4 space-y-3 text-sm text-[#607086]">
                <Link href={localizeHref("/employeurs", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.postNeed}</Link>
                <Link href={localizeHref("/travailleurs", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.makeVisible}</Link>
                <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.shortageJobs}</Link>
                <Link href={localizeHref("/permis-unique", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.understandPermit}</Link>
                <Link href={localizeHref("/connexion", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.signIn}</Link>
                <Link href={localizeHref("/inscription", locale)} className="block transition hover:text-[#1E3A78]">{copy.footer.createAccount}</Link>
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
