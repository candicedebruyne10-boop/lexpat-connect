"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavDropdown from "./NavDropdown";
import NavAuth, { NavAuthMobile } from "./NavAuth";
import {
  detectLocaleFromPathname,
  localizeHref,
  switchLocalePath,
  siteCopy,
} from "../lib/i18n";

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "/";
  const locale   = detectLocaleFromPathname(pathname);
  const copy     = siteCopy[locale];
  const isEn     = locale === "en";

  /* ── Navigation principale ─────────────────────────────────────────────── */
  const navigation = [
    { href: "/",              label: isEn ? "Home"        : "Accueil" },
    { href: "/employeurs",    label: isEn ? "Employers"   : "Employeurs",   color: "blue" },
    { href: "/travailleurs",  label: isEn ? "Workers"     : "Travailleurs",  color: "teal" },
    { href: "/permis-unique", label: isEn ? "Immigration" : "Immigration" },
    { href: "/recrutement-international", label: isEn ? "Cities & sectors" : "Villes & secteurs", color: "slate" },
    { href: "/simulateur-eligibilite", label: isEn ? "Simulator 2026" : "Simulateur 2026", highlight: true },
  ];

  const navDropdowns = {
    "/employeurs": {
      color: "blue",
      items: [
        {
          href: "/employeurs/espace",
          label: isEn ? "My employer space"   : "Mon espace employeur",
          description: isEn ? "Dashboard, openings and matched profiles" : "Tableau de bord, offres et profils matchés",
          icon: "star",
        },
        {
          href: "/employeurs",
          label: isEn ? "Post a job need"     : "Je recrute",
          description: isEn ? "Submit a need, let the engine match" : "Déposez un besoin, le moteur s'occupe du matching",
          icon: "doc",
        },
        {
          href: "/base-de-profils",
          label: isEn ? "Available candidates" : "Candidats disponibles",
          description: isEn ? "Browse qualified international profiles" : "Parcourez les profils qualifiés disponibles",
          icon: "search",
        },
      ],
    },
    "/recrutement-international": {
      color: "slate",
      items: [
        {
          href: "/recrutement-international",
          label: isEn ? "International recruitment" : "Recrutement international",
          description: isEn ? "6 in 10 Belgian companies already recruit internationally" : "6 entreprises sur 10 recrutent déjà des profils étrangers",
          icon: "globe",
        },
        {
          href: "/employeurs/liege-metiers-en-penurie",
          label: "Liège",
          description: isEn ? "Shortage occupations in Liège" : "Métiers en pénurie à Liège",
          icon: "pin",
        },
        {
          href: "/employeurs/anvers-metiers-en-penurie",
          label: isEn ? "Antwerp" : "Anvers",
          description: isEn ? "Shortage occupations in Antwerp" : "Métiers en pénurie à Anvers",
          icon: "pin",
        },
        {
          href: "/employeurs/gand-metiers-en-penurie",
          label: isEn ? "Ghent" : "Gand",
          description: isEn ? "Shortage occupations in Ghent" : "Métiers en pénurie à Gand",
          icon: "pin",
        },
        {
          href: "/employeurs/bruges-metiers-en-penurie",
          label: "Bruges",
          description: isEn ? "Shortage occupations in Bruges" : "Métiers en pénurie à Bruges",
          icon: "pin",
        },
      ],
    },
    "/travailleurs": {
      color: "teal",
      items: [
        {
          href: "/travailleurs/espace",
          label: isEn ? "My worker space"    : "Mon espace travailleur",
          description: isEn ? "Profile, matches and applications" : "Profil, matchs et candidatures",
          icon: "star",
        },
        {
          href: "/travailleurs",
          label: isEn ? "I'm looking for work" : "Je postule",
          description: isEn ? "How LEXPAT Connect works for you" : "Comment fonctionne LEXPAT Connect",
          icon: "arrow",
        },
        {
          href: "/offres-d-emploi",
          label: isEn ? "Job listings"       : "Offres d'emploi",
          description: isEn ? "Shortage jobs open to international recruitment" : "Postes en pénurie ouverts au recrutement international",
          icon: "doc",
        },
      ],
    },
    "/permis-unique": {
      color: "slate",
      items: [
        {
          href: "/permis-unique",
          label: isEn ? "Single permit guide" : "Permis unique",
          description: isEn ? "Conditions, process and permit categories" : "Conditions, procédure et catégories de permis",
          icon: "doc",
        },
        {
          href: "/travailleurs-hautement-qualifies",
          label: isEn ? "Highly qualified workers" : "Travailleurs hautement qualifiés",
          description: isEn ? "Salary thresholds and EU Blue Card" : "Seuils salariaux et Carte bleue européenne",
          icon: "star",
        },
        {
          href: "/metiers-en-penurie",
          label: isEn ? "Shortage jobs"      : "Métiers en pénurie",
          description: isEn ? "Occupations opening faster international recruitment" : "Professions ouvrant des voies de recrutement international plus rapides",
          icon: "pin",
        },
        {
          href: "/revenir-en-belgique-apres-un-retour",
          label: isEn ? "Return guarantees" : "Garanties de retour",
          description: isEn ? "What happens if a worker leaves Belgium and hopes to come back later" : "Ce qu'il faut vérifier avant de quitter la Belgique en espérant y revenir plus tard",
          icon: "globe",
        },
      ],
    },
  };

  const legalLinks = [
    { href: "/mentions-legales",             label: copy.legalLinks.legal    },
    { href: "/politique-de-confidentialite", label: copy.legalLinks.privacy  },
    { href: "/cookies",                      label: copy.legalLinks.cookies  },
    { href: "/conditions-utilisation",       label: copy.legalLinks.terms    },
    { href: "/securite-conformite",          label: copy.legalLinks.security },
  ];

  return (
    <div className="shell">
      {/* ── HEADER ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#edf1f5] bg-white/95 backdrop-blur-xl">
        <div className="container-shell flex min-h-[64px] items-center justify-between gap-3 py-2.5 lg:min-h-[74px] lg:gap-4 lg:py-2.5">

          {/* Logo LEXPAT Connect */}
          <Link href={localizeHref("/", locale)} className="flex items-center gap-3">
            <span className="relative inline-flex h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[#d9e9f1] bg-white shadow-[0_6px_18px_rgba(17,39,87,0.08)]">
              <Image
                src="/logo-lexpat-connect.png"
                alt="LEXPAT Connect"
                fill
                className="object-cover p-[5px]"
                sizes="48px"
              />
            </span>
            <span className="leading-tight">
              <span className="font-heading block text-[18px] font-bold tracking-[0.07em] text-[#1E3A78] lg:text-[22px]">
                LEXPAT
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">
                Connect
              </span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-0.5 text-[15px] font-medium text-[#607086] lg:flex">
            {navigation.map((item) => {
              const dd = navDropdowns[item.href];
              if (dd) {
                return (
                  <NavDropdown
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    label={item.label}
                    items={dd.items.map((sub) => ({ ...sub, href: localizeHref(sub.href, locale) }))}
                    color={dd.color}
                  />
                );
              }
              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    className="whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(233,30,140,0.22)] transition hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(233,30,140,0.32)]"
                    style={{ background: "linear-gradient(135deg, #e91e8c, #c2177e)" }}
                  >
                    ✦ {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={localizeHref(item.href, locale)}
                  className="whitespace-nowrap rounded-full px-2.5 py-1.5 transition hover:bg-[#f6f8fb] hover:text-[#1E3A78]"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sélecteur de langue + auth desktop */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <div className="flex items-center divide-x divide-[#dce8f5] overflow-hidden rounded-full border border-[#dce8f5] bg-white text-[11px] font-bold shadow-[0_4px_10px_rgba(15,23,42,0.03)]">
              <Link
                href={switchLocalePath(pathname, "fr")}
                className={`px-2.5 py-1.5 transition ${locale === "fr" ? "bg-[#1E3A78] text-white" : "text-[#607086] hover:text-[#1E3A78]"}`}
              >
                FR
              </Link>
              <Link
                href={switchLocalePath(pathname, "en")}
                className={`px-2.5 py-1.5 transition ${locale === "en" ? "bg-[#1E3A78] text-white" : "text-[#607086] hover:text-[#1E3A78]"}`}
              >
                EN
              </Link>
            </div>
            <NavAuth />
          </div>

          {/* Mobile : langue + auth */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <div className="flex items-center divide-x divide-[#dce8f5] overflow-hidden rounded-full border border-[#dce8f5] bg-white text-[11px] font-bold">
              <Link
                href={switchLocalePath(pathname, "fr")}
                className={`px-2.5 py-1 transition ${locale === "fr" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
              >
                FR
              </Link>
              <Link
                href={switchLocalePath(pathname, "en")}
                className={`px-2.5 py-1 transition ${locale === "en" ? "bg-[#1E3A78] text-white" : "text-[#607086]"}`}
              >
                EN
              </Link>
            </div>
            <NavAuthMobile />
          </div>
        </div>

        {/* Nav mobile */}
        <nav className="border-t border-[#f0f4f8] px-4 py-2.5 text-sm font-medium text-[#607086] lg:hidden">
          <div className="space-y-2">
          {navigation.filter((item) => item.highlight).map((item) => (
            <Link
              key={item.href}
              href={localizeHref(item.href, locale)}
              className="flex w-full items-center justify-center rounded-full px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(233,30,140,0.22)]"
              style={{ background: "linear-gradient(135deg, #e91e8c, #c2177e)" }}
            >
              ✦ {item.label}
            </Link>
          ))}
          <div className="flex flex-wrap items-start gap-2">
          {navigation.filter((item) => !item.highlight).map((item) => {
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
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#e3eaf1] bg-white px-3 py-2 text-xs font-semibold text-center transition hover:border-[#c5d4f3] hover:text-[#1E3A78]"
              >
                {item.label}
              </Link>
            );
          })}
          </div>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-[#edf1f5] bg-[#f8fafb]">
        <div className="container-shell py-12">
          <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-12 lg:items-stretch">

            {/* Col 1 — Brand */}
            <div className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:col-span-4">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full border border-[#d9e9f1] bg-white">
                  <Image src="/logo-lexpat-connect.png" alt="LEXPAT Connect" fill className="object-cover" sizes="40px" />
                  </span>
                  <div>
                    <p className="font-heading text-base font-bold tracking-[0.06em] text-[#1E3A78]">LEXPAT</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#57B7AF]">Connect</p>
                  </div>
                </div>
                <p className="max-w-[330px] text-sm leading-7 text-[#607086]">
                  {isEn
                    ? "A platform connecting Belgian employers with international workers in shortage occupations, clearly and efficiently."
                    : "Une plateforme pensée pour connecter les employeurs belges aux travailleurs internationaux dans les métiers en pénurie, de façon plus claire, plus rapide et plus lisible."}
                </p>
                <div className="rounded-[18px] border border-[#e3ebf3] bg-[#f8fbfd] p-4 text-sm leading-6 text-[#607086]">
                  <p className="mb-2 font-semibold text-[#1E3A78]">
                    {isEn ? "After the match" : "Après la mise en relation"}
                  </p>
                  <p className="leading-6">
                    {isEn
                      ? "If a recruitment involves a single permit or economic immigration question, the LEXPAT firm can take over."
                      : "Si un recrutement suppose un permis unique ou une question d'immigration économique, le cabinet LEXPAT peut ensuite prendre le relais."}
                  </p>
                </div>
              </div>
            </div>

            {/* Col 2 — Employeurs + Travailleurs */}
            <div className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:col-span-3">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">
                    {isEn ? "Employers" : "Employeurs"}
                  </p>
                  <div className="space-y-3 text-sm text-[#607086]">
                    <Link href={localizeHref("/employeurs", locale)} className="block transition hover:text-[#1E3A78]">
                      {isEn ? "I'm hiring" : "Je recrute"}
                    </Link>
                    <Link href={localizeHref("/base-de-profils", locale)} className="block transition hover:text-[#1E3A78]">
                      {isEn ? "Available candidates" : "Candidats disponibles"}
                    </Link>
                    <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">
                      {isEn ? "Shortage jobs" : "Métiers en pénurie"}
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">
                    {isEn ? "Workers" : "Travailleurs"}
                  </p>
                  <div className="space-y-3 text-sm text-[#607086]">
                    <Link href={localizeHref("/travailleurs", locale)} className="block transition hover:text-[#57B7AF]">
                      {isEn ? "I'm applying" : "Je postule"}
                    </Link>
                    <Link href={localizeHref("/offres-d-emploi", locale)} className="block transition hover:text-[#57B7AF]">
                      {isEn ? "Job listings" : "Offres d'emploi"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3 — Actions rapides */}
            <div className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:col-span-2">
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">
                  {isEn ? "Quick actions" : "Actions rapides"}
                </p>
                <div className="space-y-3 text-sm text-[#607086]">
                  <Link href={localizeHref("/employeurs", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Post a recruitment need" : "Déposer un besoin de recrutement"}
                  </Link>
                  <Link href={localizeHref("/travailleurs", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Make my profile visible" : "Rendre mon profil visible"}
                  </Link>
                  <Link href={localizeHref("/metiers-en-penurie", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Shortage jobs" : "Métiers en pénurie"}
                  </Link>
                  <Link href={localizeHref("/permis-unique", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Understand the single permit" : "Comprendre le permis unique"}
                  </Link>
                  <Link href={localizeHref("/connexion", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Sign in" : "Se connecter"}
                  </Link>
                  <Link href={localizeHref("/inscription", locale)} className="block transition hover:text-[#1E3A78]">
                    {isEn ? "Create an account" : "Créer un compte"}
                  </Link>
                </div>
              </div>
            </div>

            {/* Col 4 — Cabinet LEXPAT */}
            <div className="rounded-[28px] border border-[#dce7f2] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:col-span-3">
              <div className="flex h-full flex-col justify-between gap-5">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">
                    {isEn ? "LEXPAT Law Firm" : "Cabinet LEXPAT"}
                  </p>
                  <p className="max-w-[300px] text-sm leading-7 text-[#607086]">
                    {isEn
                      ? "A distinct legal relay when a match leads to a single permit, work law, or recruitment security question."
                      : "Un relais juridique distinct lorsque la mise en relation débouche sur une question de permis unique, de droit au travail ou de sécurisation du recrutement."}
                  </p>
                </div>
                <div>
                  <Link
                    href={localizeHref("/accompagnement-juridique", locale)}
                    className="secondary-button inline-flex min-w-[220px] justify-center text-center"
                  >
                    {isEn ? "View the support" : "Voir l'accompagnement"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Barre légale */}
          <div className="mt-10 border-t border-[#edf1f5] pt-6">
            <div className="flex flex-col gap-4 rounded-[24px] border border-[#edf3f7] bg-white px-5 py-4 text-sm text-[#6d7b8d] shadow-[0_10px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <Link
                href={localizeHref("/histoire-de-la-fondatrice", locale)}
                className="font-bold text-[#1E3A78] transition hover:text-[#57B7AF] hover:underline"
              >
                {isEn ? "The founder's story" : "L'histoire de la fondatrice"}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {legalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href, locale)}
                    className="inline-flex rounded-full border border-transparent px-3 py-1.5 transition hover:border-[#dce7ef] hover:bg-[#f0f4f8] hover:text-[#1E3A78]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={localizeHref("/admin", locale)}
                  aria-label={isEn ? "Open admin" : "Ouvrir l'administration"}
                  title={isEn ? "Admin access" : "Accès administration"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#a5b2c4] transition hover:border-[#dce7ef] hover:bg-[#f0f4f8] hover:text-[#1E3A78]"
                >
                  <span aria-hidden="true" className="text-[13px] leading-none">🔒</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
