"use client";

import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useMemo, useState, useEffect } from "react";
import { localizeHref } from "../lib/i18n";
import HeroVideo from "./HeroVideo";

/* ── Palette officielle LEXPAT Connect ── */
const EMPLOYER = {
  primary:   "#1E3A78",   // Bleu foncé principal
  secondary: "#204E97",   // Bleu moyen
  soft:      "#eef1fb",   // Fond doux
  border:    "rgba(30,58,120,0.16)"
};

const TALENT = {
  primary:   "#57B7AF",   // Turquoise talents
  secondary: "#4aa9a2",   // Hover
  soft:      "#eaf4f3",   // Fond doux
  border:    "rgba(87,183,175,0.22)"
};

function BriefcaseIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 9.5A1.5 1.5 0 0 1 5.5 8h13A1.5 1.5 0 0 1 20 9.5v8A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TalentIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.5 18.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StepIcon({ index, className = "h-5 w-5" }) {
  const paths = [
    <path key="a" d="M5 7.5h14M7 12h10M9 16.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
    <path key="b" d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="c" d="M12 4.5v6m0 0 3-3m-3 3-3-3M6 14.5h12v4H6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ];

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {paths[index]}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO PREMIUM — Section 1
   Dark blue full-bleed, punch headline, 2 CTA cards embedded in hero
   ───────────────────────────────────────────────────────────────────────────── */
/* Villes belges + points de connexion internationaux visibles sur la carte */
const CITY_DOTS = [
  /* ── Belgique ── */
  { city: "Bruxelles",  left: "54%", top: "40%", delay: "0s"    },
  { city: "Anvers",     left: "58%", top: "28%", delay: "0.4s"  },
  { city: "Gand",       left: "48%", top: "34%", delay: "0.8s"  },
  { city: "Liège",      left: "63%", top: "44%", delay: "1.2s"  },
  { city: "Mons",       left: "50%", top: "58%", delay: "0.6s"  },
  { city: "Bruges",     left: "43%", top: "28%", delay: "1.0s"  },
  { city: "Namur",      left: "59%", top: "54%", delay: "1.4s"  },
  /* ── Connexions internationales ── */
  { city: "Londres",    left: "40%", top: "18%", delay: "1.6s"  },
  { city: "Paris",      left: "50%", top: "76%", delay: "1.8s"  },
  { city: "New York",   left: "76%", top: "14%", delay: "2.0s"  },
  { city: "Dubaï",      left: "70%", top: "52%", delay: "2.2s"  },
  { city: "Mumbai",     left: "73%", top: "62%", delay: "2.4s"  },
];

function CityDot({ left, top, delay = "0s" }) {
  return (
    <div className="pointer-events-none absolute" style={{ left, top }}>
      {/* Halo externe — pulsation bleue */}
      <div
        className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#59B9B1]/25 [animation-duration:2.2s]"
        style={{ animationDelay: delay }}
      />
      {/* Anneau intermédiaire */}
      <div
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#59B9B1]/40 [animation-duration:2.2s]"
        style={{ animationDelay: delay }}
      />
      {/* Point central bleu */}
      <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9de8e2] shadow-[0_0_8px_3px_rgba(89,185,177,0.70)]" />
    </div>
  );
}

export function HeroPremium({ primaryHref, secondaryHref, locale = "fr", showProofCard = false }) {
  // Live profile count — fetched from public API, refreshed every 5 minutes
  const [liveCount, setLiveCount] = useState(null);
  useEffect(() => {
    if (!showProofCard) return;
    const fetchCount = () => {
      fetch("/api/public/profiles-count")
        .then(r => r.json())
        .then(d => { if (d.count > 0) setLiveCount(d.count); })
        .catch(() => {}); // silent fallback — static copy.proof.count stays visible
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [showProofCard]);
  const copy = locale === "en"
    ? {
        badge: "Belgium · shortage occupations · international recruitment",
        title1: "Hire the qualified",
        title2: "international talent",
        title3: "you need.",
        desc: "Profiles available now for your shortage occupations in Belgium — quickly and with full legal security.",
        subline: "Qualified profiles are already available on the platform.",
        primary: "See available profiles",
        secondary: "Test feasibility",
        workerHref: "/en/travailleurs",
        workerLink: "You are a worker? Apply here →",
        hub: "Belgium · International hub",
        proof: {
          count: "21",
          label: "profiles available today",
          categories: "Developers · Technicians · Healthcare · Construction",
          location: "Available for Belgium",
          cta: "See profiles →",
        },
      }
    : {
        badge: "Belgique · Métiers en pénurie · Recrutement international",
        title1: "Recrutez les talents",
        title2: "internationaux qualifiés",
        title3: "dont vous avez besoin.",
        desc: "Des profils disponibles dès maintenant pour vos métiers en pénurie en Belgique — rapidement et en toute sécurité légale.",
        subline: "Des profils qualifiés sont déjà disponibles sur la plateforme.",
        primary: "Voir les profils disponibles",
        secondary: "Tester la faisabilité",
        workerHref: "/travailleurs",
        workerLink: "Vous êtes travailleur ? Postulez ici →",
        hub: "Belgique · Hub international",
        proof: {
          count: "21",
          label: "profils disponibles aujourd'hui",
          categories: "Développeurs · Techniciens · Soins · Construction",
          location: "Disponibles pour la Belgique",
          cta: "Voir les profils →",
        },
      };
  return (
    <section className="relative overflow-hidden bg-[#060c26]">

      {/* ══ DESKTOP : carte pleine fenêtre, texte en haut à gauche ══ */}
      <div className="hidden lg:block">
        <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
          <Image
            src="/hero-image.jpg"
            alt="Carte mondiale et Belgique — connexions LEXPAT Connect"
            fill
            priority
            quality={84}
            className="object-contain bg-[#060c26]"
            style={{ objectPosition: 'right center' }}
            sizes="100vw"
          />
          {/* Voile sombre à gauche */}
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,12,38,0.96)_0%,rgba(6,12,38,0.88)_24%,rgba(6,12,38,0.50)_46%,rgba(6,12,38,0.08)_70%,transparent_100%)]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,rgba(6,12,38,0.65),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(6,12,38,0.65),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_45%_at_28%_50%,rgba(89,185,177,0.20),transparent_70%)]" />

          {/* Points lumineux sur chaque ville */}
          {CITY_DOTS.map((dot) => (
            <CityDot key={dot.city} {...dot} />
          ))}

          {/* Texte — badge en haut, titre+CTAs en bas */}
          <div className="relative z-10 flex h-full">
            <div className="flex h-full w-full max-w-[520px] flex-col justify-between px-10 pb-24 pt-10 xl:px-14 xl:pt-12">
              <HeroContentDesktop primaryHref={primaryHref} secondaryHref={secondaryHref} copy={copy} />
            </div>
          </div>

          {/* Hub badge — remonté pour ne pas chevaucher la proof bar */}
          <div className="absolute bottom-20 right-8 z-10 whitespace-nowrap rounded-full border border-[#59B9B1]/30 bg-[#060c26]/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9dd4d0] backdrop-blur-sm">
            {copy.hub}
          </div>

          {/* ── Proof bar — absolute bottom, full width, toujours visible ── */}
          {showProofCard && copy.proof && (
            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.09] bg-[rgba(6,12,38,0.62)] backdrop-blur-md">
              <div className="flex items-center gap-4 px-10 py-3.5 xl:px-14">
                {/* Stat */}
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-2xl font-black text-white tabular-nums leading-none">
                    {liveCount !== null ? liveCount : copy.proof.count}
                  </span>
                  <span className="text-sm font-semibold text-white/80">{copy.proof.label}</span>
                </div>
                {/* Séparateur */}
                <div className="h-4 w-px shrink-0 bg-white/[0.15]" />
                {/* Catégories */}
                <p className="flex-1 text-[11px] font-medium tracking-wide text-[#9dd4d0]/70 hidden sm:block">
                  {copy.proof.categories}
                </p>
                {/* Localisation */}
                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 hidden xl:block">
                  {copy.proof.location}
                </p>
                {/* CTA */}
                <Link
                  href={primaryHref}
                  onClick={() => track("Proof Bar CTA Clicked", { destination: primaryHref })}
                  className="ml-auto shrink-0 rounded-xl bg-[#57b7af] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(87,183,175,0.30)] transition hover:bg-[#3fa099] hover:shadow-[0_6px_18px_rgba(87,183,175,0.42)] hover:-translate-y-px"
                >
                  {copy.proof.cta}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ MOBILE : texte puis carte en bas ══ */}
      <div className="lg:hidden">
        <div className="relative px-6 pb-6 pt-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#1d3b8b]/30 blur-3xl" />
          <HeroContent primaryHref={primaryHref} secondaryHref={secondaryHref} copy={copy} />
        </div>

        {/* Proof card mobile — entre texte et carte carte */}
        {showProofCard && copy.proof && (
          <div className="mx-6 mb-5 flex items-center gap-4 rounded-2xl border border-white/[0.10] bg-white/[0.07] px-5 py-3.5 backdrop-blur-sm">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tabular-nums leading-none">
                  {liveCount !== null ? liveCount : copy.proof.count}
                </span>
                <span className="text-xs font-semibold text-white/80">{copy.proof.label}</span>
              </div>
              <p className="mt-1 text-[10px] text-[#9dd4d0]/65">{copy.proof.categories}</p>
            </div>
            <Link
              href={primaryHref}
              onClick={() => track("Proof Bar CTA Clicked", { destination: primaryHref })}
              className="shrink-0 rounded-xl bg-[#57b7af] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#3fa099]"
            >
              {copy.proof.cta}
            </Link>
          </div>
        )}

        {/* Carte mobile */}
        <div className="relative mx-4 mb-10 h-56 overflow-hidden rounded-[28px] border border-[#59B9B1]/20 shadow-[0_0_48px_rgba(89,185,177,0.18)]">
          <Image
            src="/hero-image.jpg"
            alt="Carte mondiale et Belgique — connexions LEXPAT Connect"
            fill
            priority
            quality={84}
            className="object-contain object-center bg-[#060c26]"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,rgba(6,12,38,0.95),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(6,12,38,0.85),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_28%_50%,rgba(89,185,177,0.28),transparent_70%)]" />

          {CITY_DOTS.map((dot) => (
            <CityDot key={dot.city} {...dot} />
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#59B9B1]/30 bg-[#060c26]/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9dd4d0] backdrop-blur-sm">
            {copy.hub}
          </div>
        </div>
      </div>

    </section>
  );
}

/* Contenu desktop — badge en haut, titre majestueux + CTAs en bas */
function HeroContentDesktop({ primaryHref, secondaryHref, copy }) {
  return (
    <>
      {/* Badge ancré en haut */}
      <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/[0.14] bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.20em] text-[#9dd4d0] backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57B7AF]" />
        {copy.badge}
      </div>

      {/* Titre + description + CTAs ancrés en bas */}
      <div>
        <h1 className="font-heading text-[clamp(2.1rem,3.2vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white">
          {copy.title1}<br />
          <span className="text-[#57B7AF]">{copy.title2}</span><br />
          {copy.title3}
        </h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-white/[0.62]">
          {copy.desc}
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href={primaryHref}
            onClick={() => track("Hero CTA Clicked", { cta: copy.primary, destination: primaryHref })}
            className="inline-flex h-14 items-center justify-center rounded-2xl px-6 text-base font-bold text-white transition hover:-translate-y-0.5"
            style={{ background: EMPLOYER.primary, boxShadow: "0 16px 48px rgba(23,58,138,0.32)" }}
          >
            {copy.primary}
          </Link>
          <Link
            href={secondaryHref}
            onClick={() => track("Hero CTA Clicked", { cta: copy.secondary, destination: secondaryHref })}
            className="inline-flex h-14 items-center justify-center rounded-2xl px-6 text-base font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: "#57B7AF", boxShadow: "0 12px 32px rgba(87,183,175,0.38)" }}
          >
            {copy.secondary}
          </Link>
        </div>
        {copy.workerLink && (
          <p className="mt-4">
            <Link href={copy.workerHref} className="text-xs text-white/40 transition hover:text-white/65">{copy.workerLink}</Link>
          </p>
        )}
      </div>
    </>
  );
}

/* Contenu mobile */
function HeroContent({ primaryHref, secondaryHref, copy }) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.08] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9dd4d0] backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57B7AF]" />
        {copy.badge}
      </div>

      <h1 className="font-heading mt-8 text-[clamp(2.2rem,7vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white">
        {copy.title1}<br />
        <span className="text-[#57B7AF]">{copy.title2}</span><br />
        {copy.title3}
      </h1>

      <p className="mt-5 text-base leading-relaxed text-white/[0.62]">
        {copy.desc}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={primaryHref}
          onClick={() => track("Hero CTA Clicked", { cta: copy.primary, destination: primaryHref })}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold text-white transition hover:-translate-y-0.5 sm:w-auto sm:px-7"
          style={{ background: EMPLOYER.primary, boxShadow: "0 16px 48px rgba(23,58,138,0.32)" }}
        >
          {copy.primary}
        </Link>
        <Link
          href={secondaryHref}
          onClick={() => track("Hero CTA Clicked", { cta: copy.secondary, destination: secondaryHref })}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl text-base font-semibold text-white transition hover:-translate-y-0.5 sm:w-auto sm:px-7"
          style={{ background: "#57B7AF", boxShadow: "0 12px 32px rgba(87,183,175,0.38)" }}
        >
          {copy.secondary}
        </Link>
      </div>

      {copy.workerLink && (
        <p className="mt-4">
          <Link href={copy.workerHref} className="text-xs text-white/40 transition hover:text-white/65">{copy.workerLink}</Link>
        </p>
      )}
    </div>
  );
}
const ENTRY_CARDS = [
  {
    icon: BriefcaseIcon,
    title: "J'ai un poste à pourvoir",
    text: "Accédez directement à des profils qualifiés disponibles dans les métiers en pénurie en Belgique. Des talents internationaux sont visibles dès maintenant.",
    href: "/base-de-profils",
    cta: "Voir les profils disponibles",
    colors: EMPLOYER
  },
  {
    icon: TalentIcon,
    title: "Je cherche un emploi en Belgique",
    text: "Vous avez une expérience dans un métier en pénurie et souhaitez travailler en Belgique ? Créez votre profil et faites-vous repérer par les employeurs belges.",
    href: "/travailleurs",
    cta: "Créer mon profil",
    colors: TALENT
  }
];

export function DualEntry({ locale = "fr" }) {
  const cards = locale === "en"
    ? [
        {
          icon: BriefcaseIcon,
          title: "I have a position to fill",
          text: "Access qualified profiles available right now for shortage occupations in Belgium. International talent is visible on the platform today.",
          href: "/base-de-profils",
          cta: "See available profiles",
          colors: EMPLOYER
        },
        {
          icon: TalentIcon,
          title: "I am looking for a job in Belgium",
          text: "Do you have experience in a shortage occupation and want to work in Belgium? Create your profile and get noticed by Belgian employers.",
          href: "/travailleurs",
          cta: "Create my profile",
          colors: TALENT
        }
      ]
    : ENTRY_CARDS;
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
            {locale === "en" ? "Two paths" : "Deux parcours"}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
            {locale === "en" ? "Choose your entry point" : "Choisissez votre entrée"}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="flex flex-col rounded-[32px] border bg-white p-8 shadow-[0_18px_52px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:p-10"
                style={{
                  background: `linear-gradient(180deg, #ffffff 0%, ${card.colors.soft} 100%)`,
                  borderColor: card.colors.border
                }}
              >
                <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#1E3A78] sm:text-[2rem]">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#607086]">
                  {card.text}
                </p>
                <div className="mt-auto pt-8">
                  <Link
                    href={localizeHref(card.href, locale)}
                    className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                    style={{
                      background: card.colors.primary,
                      boxShadow:
                        card.colors === EMPLOYER
                          ? "0 14px 34px rgba(23,58,138,0.24)"
                          : "0 14px 34px rgba(89,185,177,0.28)"
                    }}
                  >
                    {card.cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ShortageJobsQuickLink({ locale = "fr" }) {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="rounded-[32px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-[#e9f8f5] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {locale === "en" ? "Employer guide" : "Guide employeur"}
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#1E3A78] sm:text-3xl">
              {locale === "en"
                ? "Understand which shortage occupations really matter for your recruitment"
                : "Vérifiez si votre recrutement concerne un métier en pénurie"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#607086]">
              {locale === "en"
                ? "A single page helps you read the official regional lists, understand their impact on the single permit and spot the most promising sectors."
                : "Cette page vous aide à lire les listes régionales officielles, à voir si votre poste y figure et à comprendre ce que cela change pour le permis unique."}
            </p>
          </div>
          <div className="mt-6 flex-shrink-0 lg:mt-0">
            <Link
              href={localizeHref("/metiers-en-penurie", locale)}
              className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[#173A8A] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_36px_rgba(23,58,138,0.28)] transition hover:bg-[#153374]"
            >
              {locale === "en" ? "Read the shortage occupations guide" : "Vérifier les métiers en pénurie"}
            </Link>
            <p className="mt-3 text-xs leading-6 text-[#6c7b8f]">
              {locale === "en"
                ? "Ideal for quickly checking whether your position can rely on an official regional shortage list."
                : "Utile pour savoir rapidement si votre poste concerne un métier repris sur une liste régionale officielle."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SecurityComplianceTeaser() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[34px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(103,190,182,0.12),transparent_68%)]" />
          <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-[#d7e8e6] bg-[#f6fbfb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#255c8f]">
              Sécurité & conformité
              </p>
              <h2 className="mt-4 max-w-3xl text-2xl font-bold tracking-[-0.04em] text-[#0f214b] sm:text-3xl">
                Une architecture conçue pour séparer le mise en relation professionnelle du traitement juridique
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607086] sm:text-[0.98rem]">
                Données hébergées en Europe, partage limité avant mise en relation et relais juridique distinct uniquement quand le recrutement l’exige.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full border border-[rgba(23,58,138,0.16)] bg-[#eef4ff] px-3.5 py-1.5 text-xs font-semibold text-[#1E3A78]">
                  Hébergement UE
                </span>
                <span className="inline-flex rounded-full border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-3.5 py-1.5 text-xs font-semibold text-[#2f9f97]">
                  Consentement avant transfert
                </span>
                <span className="inline-flex rounded-full border border-[rgba(39,79,150,0.16)] bg-[#f4f7fe] px-3.5 py-1.5 text-xs font-semibold text-[#204E97]">
                  Relais juridique séparé
                </span>
              </div>
            </div>

            <div className="mt-6 flex-shrink-0 lg:mt-0">
              <Link
                href={localizeHref("/securite-conformite", locale)}
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-[#d6dfef] bg-white px-7 py-4 text-base font-semibold text-[#1E3A78] shadow-[0_12px_28px_rgba(23,58,138,0.08)] transition hover:-translate-y-0.5 hover:border-[#b7c8e3] hover:bg-[#f5f9ff]"
              >
                Comprendre notre architecture RGPD
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Vous publiez votre besoin ou votre profil",
    text: "Quelques minutes suffisent. Employeurs et travailleurs renseignent l’essentiel — pas plus.",
    accent: EMPLOYER,
    iconIndex: 0
  },
  {
    num: "02",
    title: "Vous entrez en contact",
    text: "Employeur et travailleur se retrouvent directement. Pas d’intermédiaire, pas de délai inutile.",
    accent: TALENT,
    iconIndex: 1
  },
  {
    num: "03",
    title: "On s’occupe des démarches si besoin",
    text: "Permis de travail, titre de séjour, paperasse administrative — LEXPAT prend le relais si le dossier le demande.",
    accent: EMPLOYER,
    iconIndex: 2
  }
];

export function HowItWorksPremium({ locale = "fr" }) {
  const steps = locale === "en"
    ? [
        {
          num: "01",
          title: "You publish your need or your profile",
          text: "A few minutes are enough. Employers and workers provide the essentials — nothing more.",
          accent: EMPLOYER,
          iconIndex: 0
        },
        {
          num: "02",
          title: "You get in touch",
          text: "Employer and worker can connect directly. No intermediary, no unnecessary delay.",
          accent: TALENT,
          iconIndex: 1
        },
        {
          num: "03",
          title: "We handle the formalities if needed",
          text: "Work permits, residence status and administrative paperwork — LEXPAT takes over if the case requires it.",
          accent: EMPLOYER,
          iconIndex: 2
        }
      ]
    : HOW_IT_WORKS;
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[40px] border border-[#e2ecf4] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10 lg:p-14">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-[#f8fbff] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
              {locale === "en" ? "3 steps" : "3 étapes"}
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
              {locale === "en" ? "How it works" : "Comment ça marche"}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.num}
                className="rounded-[30px] border bg-white p-7 text-left shadow-[0_14px_36px_rgba(15,23,42,0.04)]"
                style={{ borderColor: step.accent.border }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: step.accent.soft, color: step.accent.primary }}
                  >
                    <StepIcon index={step.iconIndex} className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold tracking-[0.16em]" style={{ color: step.accent.primary }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-[#1E3A78]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#607086]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PresentationVideoSection({ locale = "fr" }) {
  return (
    <section className="py-2 sm:py-4 lg:py-6">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
              {locale === "en" ? "Presentation" : "Présentation"}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
              {locale === "en" ? "Emily guides you through LEXPAT Connect" : "Emily vous guide sur LEXPAT Connect"}
            </h2>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[#dfe9f2] bg-white p-2 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:p-2.5">
            {/* HeroVideo : la vidéo ne charge QUE si l'utilisateur clique → LCP non bloqué */}
            <HeroVideo
              src={locale === "en" ? "/presentation-lexpat-connect-en.mp4" : "/presentation-lexpat-connect.mp4"}
              poster="/presentation-lexpat-connect-poster.webp"
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const JOB_SECTORS = [
  { id: "software", label: "Software Engineer", region: "Bruxelles", color: EMPLOYER },
  { id: "infirmier", label: "Infirmier", region: "Wallonie", color: TALENT },
  { id: "electricien", label: "Électricien", region: "Flandre", color: EMPLOYER },
  { id: "data", label: "Data Scientist", region: "Anvers", color: TALENT },
  { id: "biotech", label: "Biotech Specialist", region: "Liège", color: EMPLOYER }
];

export function JobSectors({ locale = "fr" } = {}) {
  const jobs = locale === "en"
    ? [
        { id: "software", label: "Software Engineer", region: "Brussels", color: EMPLOYER },
        { id: "nurse", label: "Nurse", region: "Wallonia", color: TALENT },
        { id: "electrician", label: "Electrician", region: "Flanders", color: EMPLOYER },
        { id: "data", label: "Data Scientist", region: "Antwerp", color: TALENT },
        { id: "biotech", label: "Biotech Specialist", region: "Liège", color: EMPLOYER }
      ]
    : JOB_SECTORS;
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
            {locale === "en" ? "Shortage occupations" : "Métiers en pénurie"}
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
            {locale === "en" ? "The most in-demand occupations in Belgium" : "Les métiers les plus recherchés en Belgique"}
          </h2>
          <p className="mx-auto mt-4 text-base leading-7 text-[#607086]">
            {locale === "en"
              ? "These roles appear on the official regional lists and can support simpler international recruitment."
              : "Ces fonctions figurent sur les listes officielles régionales et ouvrent la voie à un recrutement international plus simple."}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-[28px] border bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(15,23,42,0.09)]"
              style={{ borderColor: job.color.border }}
            >
              <span
                className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{
                  background: job.color.soft,
                  border: `1px solid ${job.color.border}`,
                  color: job.color.primary
                }}
              >
                {job.region}
              </span>
              <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-[#1E3A78]">
                {job.label}
              </h3>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={localizeHref("/metiers-en-penurie", locale)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#d4dff2] bg-white px-7 py-3.5 text-sm font-bold text-[#1d3b8b] shadow-[0_8px_24px_rgba(29,59,139,0.08)] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] hover:shadow-[0_12px_32px_rgba(29,59,139,0.14)]"
          >
            {locale === "en" ? "See all shortage occupations" : "Voir tous les métiers en pénurie"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONVERSION BAR — Barre de stats animées sous le hero
   ───────────────────────────────────────────────────────────────────────────── */
import AnimatedStat from "./AnimatedStat";

export function ConversionBar({ locale = "fr" }) {
  const isEn = locale === "en";
  const stats = [
    {
      target: 30,
      prefix: "+",
      suffix: isEn ? " yrs" : " ans",
      label: isEn ? "of expertise in economic immigration" : "d'expertise en immigration économique",
    },
    {
      target: 10000,
      prefix: "+",
      suffix: "",
      label: isEn ? "cases successfully handled" : "dossiers traités avec succès",
    },
    {
      target: 1500,
      prefix: "+",
      suffix: "",
      label: isEn ? "directly actionable profiles" : "profils directement actionnables",
    },
  ];

  return (
    <div className="border-y border-[#dce8f5] bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)]">
      <div className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,56px)] py-10">
        <p className="mb-6 text-center text-[13px] font-semibold text-[#607086]">
          {isEn
            ? "The international recruitment platform with integrated legal expertise"
            : "La plateforme de recrutement international avec expertise juridique intégrée"}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-[20px] border border-[#d8e9f7] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b0cff5] hover:shadow-[0_16px_40px_rgba(30,58,120,0.10)]"
            >
              <div>
                <div className="font-[Montserrat,sans-serif] text-[clamp(24px,3vw,32px)] font-extrabold leading-none text-[#1E3A78] transition-all duration-300 group-hover:text-[#57B7AF] origin-left">
                  <AnimatedStat
                    target={s.target}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    locale={locale}
                  />
                </div>
                <div className="mt-1 text-[13px] leading-snug text-[#607086] transition-colors duration-300 group-hover:text-[#1E3A78]">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED PROFILES — Profils affiliés + complets mis en avant sur la homepage
   Reçoit `profiles` (tableau anonymisé) depuis un Server Component.
   ───────────────────────────────────────────────────────────────────────────── */
export function FeaturedProfiles({ profiles = [], totalOnline = 0, locale = "fr" }) {
  if (!profiles.length) return null;
  const isEn = locale === "en";

  const copy = {
    live:    isEn ? "Featured profiles"              : "Profils mis en avant",
    title:   isEn ? "Candidates available now"       : "Des candidats disponibles maintenant",
    sub:     isEn
      ? `A selection from the ${totalOnline > 0 ? totalOnline : "active"} profiles online — and a pool of 1,500+ reachable quickly via our partners.`
      : `Une sélection parmi les ${totalOnline > 0 ? totalOnline : ""} profils en ligne — et un vivier de +1 500 accessibles rapidement via nos partenaires.`,
    seeAll:  isEn ? `See all ${totalOnline > 0 ? totalOnline : ""} profiles →` : `Voir les ${totalOnline > 0 ? totalOnline : ""} profils →`,
    permit:  isEn ? "Single permit required"         : "Permis unique requis",
    avail:   isEn ? "Available now"                  : "Disponible",
    cta:     isEn ? "View"                           : "Voir",
    footer:  isEn
      ? `${totalOnline > 0 ? totalOnline : ""} profiles online · 1,500+ reachable via partners`
      : `${totalOnline > 0 ? totalOnline : ""} profils en ligne · +1 500 accessibles via partenaires`,
    viewAll: isEn ? "See all available profiles"     : "Voir tous les profils disponibles",
  };

  // Couleurs d'avatars cycliques
  const avatarColors = [
    "linear-gradient(135deg,#1E3A78,#204E97)",
    "linear-gradient(135deg,#57B7AF,#3fa099)",
    "linear-gradient(135deg,#204E97,#57B7AF)",
  ];

  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[40px] border border-[#e2ecf4] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10 lg:p-14">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#cde2df] bg-[#eaf4f3] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" />
                {copy.live}
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#607086]">{copy.sub}</p>
            </div>
            <Link
              href={isEn ? "/en/base-de-profils" : "/base-de-profils"}
              className="shrink-0 text-sm font-bold text-[#1E3A78] transition hover:text-[#57b7af]"
            >
              {copy.seeAll}
            </Link>
          </div>

          {/* Profile cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p, i) => {
              const initials = (p.jobTitle || "").slice(0, 2).toUpperCase() || "??";
              return (
                <article
                  key={i}
                  className="rounded-[28px] border border-[#e3eaf1] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#cde2df] hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
                >
                  {/* Top */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[13px] font-extrabold text-white"
                      style={{ background: avatarColors[i % avatarColors.length] }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold leading-snug text-[#1E3A78]">{p.jobTitle}</p>
                      <p className="mt-0.5 text-[12px] text-[#8a9bb0]">{p.sector} · {p.region}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.experience && (
                      <span className="inline-flex rounded-full border border-[rgba(30,58,120,0.16)] bg-[#eef1fb] px-2.5 py-1 text-[11px] font-semibold text-[#1E3A78]">
                        {p.experience}
                      </span>
                    )}
                    <span className="inline-flex rounded-full border border-[rgba(87,183,175,0.22)] bg-[#eaf4f3] px-2.5 py-1 text-[11px] font-semibold text-[#57b7af]">
                      {copy.permit}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#16a34a]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                      {copy.avail}
                    </span>
                    <Link
                      href={isEn ? "/en/base-de-profils" : "/base-de-profils"}
                      className="text-[12px] font-bold text-[#57b7af] transition hover:text-[#3fa099]"
                    >
                      {copy.cta} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA bas */}
          <div className="mt-8 text-center">
            <Link
              href={isEn ? "/en/base-de-profils" : "/base-de-profils"}
              className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[#1E3A78] px-9 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(23,58,138,0.28)] transition hover:bg-[#153374] hover:-translate-y-0.5"
            >
              {copy.viewAll} →
            </Link>
            <p className="mt-3 text-xs text-[#8a9bb0]">{copy.footer}</p>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEXPAT RELAY — Section 5
   Discreet, premium, strategic — appears AFTER the match
   ───────────────────────────────────────────────────────────────────────────── */
export function LexpatStrip({ locale = "fr" }) {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="rounded-[32px] border border-[#e5edf4] bg-[linear-gradient(150deg,#fafcfd,#f2f7fb)] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="flex items-start gap-5">
            {/* LC logo mark */}
            <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#eef7fb,#dff4f1)] text-[13px] font-extrabold tracking-[0.18em] text-[#1d3b8b] shadow-[0_6px_20px_rgba(29,59,139,0.1)]">
              LC
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#57b7af]">
                {locale === "en" ? "LEXPAT Law Firm" : "Cabinet LEXPAT"}
              </p>
              <p className="mt-2 max-w-2xl text-base font-bold leading-snug text-[#1E3A78]">
                {locale === "en" ? "We handle the formalities when the recruitment requires it" : "On gère les démarches quand le recrutement le demande"}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7b8f]">
                {locale === "en"
                  ? "Work permits, residence status and immigration questions — the LEXPAT law firm steps in if your situation requires it, not before."
                  : "Permis de travail, titre de séjour, questions d'immigration — le cabinet LEXPAT intervient si votre situation le nécessite, pas avant."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex-shrink-0 lg:mt-0">
            <Link
              href="/accompagnement-juridique"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-[14px] border border-[#d2dff4] bg-white px-5 py-3 text-sm font-bold text-[#1d3b8b] transition hover:border-[#a8bbdd] hover:bg-[#f4f8ff]"
            >
              {locale === "en" ? "Learn more" : "En savoir plus"} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CTA BANNER DARK — Section 6
   Strong dark conversion block, dual CTAs, full impact
   ───────────────────────────────────────────────────────────────────────────── */
export function CtaBannerDark({ primaryHref, secondaryHref, locale = "fr" }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div
          className="relative overflow-hidden rounded-[40px] p-10 text-center sm:p-14 lg:p-20"
          style={{ background: "linear-gradient(135deg, #080f2e 0%, #0c1a4a 42%, #162d6b 100%)" }}
        >
          {/* Radial glow overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_0%,rgba(87,183,175,0.22),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(29,59,139,0.3),transparent)]" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9dd4d0] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#57b7af]" />
              {locale === "en" ? "Take action" : "Passez à l'action"}
            </p>

            <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              {locale === "en" ? "Take action now" : "Passez à l'action maintenant"}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/[0.55] sm:text-lg">
              {locale === "en"
                ? "Hire faster or make your profile visible to Belgian employers."
                : "Recrutez plus vite ou rendez votre profil visible auprès des employeurs belges."}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl px-9 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 sm:w-auto"
                style={{
                  background: EMPLOYER.primary,
                  boxShadow: "0 16px 48px rgba(23,58,138,0.32)"
                }}
              >
                {locale === "en" ? "Start hiring" : "Recruter maintenant"}
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl px-9 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 sm:w-auto"
                style={{
                  background: TALENT.primary,
                  boxShadow: "0 16px 48px rgba(89,185,177,0.28)"
                }}
              >
                {locale === "en" ? "Submit my profile" : "Déposer mon profil"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CABINET_SERVICES = {
  fr: [
    {
      kicker: "Immigration economique",
      title: "Permis unique",
      text: "Analyse de faisabilite, checklist documentaire et pilotage du dossier jusqu'a la decision.",
      href: "/permis-unique",
      accent: EMPLOYER.primary
    },
    {
      kicker: "Installation en Belgique",
      title: "Visa rentier",
      text: "Structuration du dossier et accompagnement pour les personnes qui souhaitent s'etablir durablement en Belgique.",
      href: "/accompagnement-juridique",
      accent: "#204E97"
    },
    {
      kicker: "Vie familiale",
      title: "Regroupement familial",
      text: "Strategie, pieces a reunir et suivi rigoureux pour des demandes familiales solides.",
      href: "/contact",
      accent: TALENT.primary
    },
    {
      kicker: "Ancrage durable",
      title: "Nationalite belge",
      text: "Vision claire des conditions, calendrier realiste et parcours securise vers la nationalite.",
      href: "/contact",
      accent: "#B5121B"
    }
  ],
  en: [
    {
      kicker: "Economic immigration",
      title: "Single permit",
      text: "Feasibility assessment, document checklist and end-to-end file management until decision.",
      href: "/en/permis-unique",
      accent: EMPLOYER.primary
    },
    {
      kicker: "Settling in Belgium",
      title: "Passive income visa",
      text: "Case structuring and legal guidance for people planning a long-term move to Belgium.",
      href: "/en/accompagnement-juridique",
      accent: "#204E97"
    },
    {
      kicker: "Family life",
      title: "Family reunification",
      text: "Strategy, supporting documents and rigorous follow-up for strong family-based applications.",
      href: "/en/contact",
      accent: TALENT.primary
    },
    {
      kicker: "Long-term anchoring",
      title: "Belgian nationality",
      text: "Clear eligibility reading, realistic timing and a secure path toward nationality.",
      href: "/en/contact",
      accent: "#B5121B"
    }
  ]
};

const CABINET_METHOD = {
  fr: [
    "Confirmer la faisabilite du projet",
    "Construire une strategie globale",
    "Fournir une checklist claire",
    "Structurer le depot du dossier",
    "Assurer le suivi jusqu'a la decision"
  ],
  en: [
    "Confirm the feasibility of the project",
    "Build an overall legal strategy",
    "Provide a clear checklist",
    "Structure the filing properly",
    "Monitor the case until decision"
  ]
};

const CABINET_TESTIMONIALS = {
  fr: [
    {
      name: "Simon N.",
      role: "Comptable et gerant",
      text: "Une approche tres structuree, un suivi rassurant et une vraie maitrise des procedures."
    },
    {
      name: "Moncef B.",
      role: "CEO",
      text: "Le dossier a ete pris en main avec rigueur et clarte. On sait exactement ou l'on va."
    },
    {
      name: "Sal. B.",
      role: "Client prive",
      text: "Le cabinet donne le sentiment d'etre accompagne du debut a la fin, sans zones grises."
    }
  ],
  en: [
    {
      name: "Simon N.",
      role: "Accountant and manager",
      text: "A very structured approach, reassuring follow-up and a real command of the procedures."
    },
    {
      name: "Moncef B.",
      role: "CEO",
      text: "The case was handled with rigor and clarity. You always know where things stand."
    },
    {
      name: "Sal. B.",
      role: "Private client",
      text: "The firm makes you feel supported from beginning to end, without grey areas."
    }
  ]
};

export function CabinetHero({ locale = "fr" }) {
  const copy = locale === "en"
    ? {
        badge: "LEXPAT law firm",
        title: "Immigration law guidance in Belgium, built on clarity and compliance.",
        text:
          "LEXPAT supports single permit, family reunification, nationality and related immigration procedures with a rigorous legal method and a reassuring client experience.",
        primary: "Book an appointment",
        secondary: "Contact the firm",
        trust: "Economic immigration, family cases and employer compliance",
        stats: [
          { value: "25+", label: "Years of combined experience" },
          { value: "4", label: "Working languages" },
          { value: "1000+", label: "Cases handled" }
        ]
      }
    : {
        badge: "Cabinet d'avocats LEXPAT",
        title: "Le droit des etrangers en Belgique, avec une approche claire, rigoureuse et humaine.",
        text:
          "LEXPAT accompagne les demandes de permis unique, regroupement familial, nationalite belge et autres procedures d'immigration avec une methode juridique exigeante et un suivi rassurant.",
        primary: "Prendre un rendez-vous",
        secondary: "Contacter le cabinet",
        trust: "Immigration economique, dossiers familiaux et conformite employeurs",
        stats: [
          { value: "25+", label: "Annees d'experience cumulees" },
          { value: "4", label: "Langues de travail" },
          { value: "1000+", label: "Dossiers traites" }
        ]
      };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#08112f_0%,#10255b_55%,#173a8a_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,183,175,0.22),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(181,18,27,0.18),transparent_28%)]" />
      <div className="container-shell relative py-14 sm:py-18 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9dd4d0] backdrop-blur-sm">
              {copy.badge}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {copy.text}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={localizeHref("/contact", locale)}
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[#B5121B] px-7 py-4 text-base font-bold text-white shadow-[0_16px_40px_rgba(181,18,27,0.24)] transition hover:-translate-y-0.5 hover:bg-[#991219]"
              >
                {copy.primary}
              </Link>
              <Link
                href={localizeHref("/accompagnement-juridique", locale)}
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/16"
              >
                {copy.secondary}
              </Link>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#d6deee]">
              {copy.trust}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-[#57B7AF]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-[0_24px_80px_rgba(5,15,43,0.28)]">
              <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[280px] bg-[#e8edf5]">
                  <Image
                    src="/candice-profile.png"
                    alt="Portrait de la fondatrice LEXPAT"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 320px, (min-width: 1024px) 420px, 100vw"
                  />
                </div>
                <div className="p-7 sm:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">
                    {locale === "en" ? "Why clients come to LEXPAT" : "Pourquoi les clients viennent chez LEXPAT"}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#1E3A78]">
                    {locale === "en" ? "A strategic legal partner, not vague advice." : "Un partenaire juridique strategique, pas un conseil vague."}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#607086]">
                    {locale === "en"
                      ? "The objective is simple: make the case readable, complete and defensible from the start."
                      : "L'objectif est simple : rendre le dossier lisible, complet et defensable des le depart."}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-1">
                    {copy.stats.map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-[#e5edf4] bg-[#f8fbff] px-4 py-4">
                        <p className="text-2xl font-bold text-[#1E3A78]">{item.value}</p>
                        <p className="mt-1 text-xs leading-5 text-[#607086]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CabinetServices({ locale = "fr" }) {
  const copy = locale === "en"
    ? {
        kicker: "Services",
        title: "The main legal paths handled by the firm",
        intro:
          "The current public site highlights a focused offer: high-stakes immigration procedures, employer support and long-term settlement matters."
      }
    : {
        kicker: "Services",
        title: "Les principales demarches traitees par le cabinet",
        intro:
          "Le site actuel met en avant une offre concentree sur les procedures d'immigration a fort enjeu, l'accompagnement des employeurs et les dossiers d'installation durable."
      };
  const services = CABINET_SERVICES[locale];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-[#dce5f0] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
            {copy.kicker}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#607086]">
            {copy.intro}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[32px] border bg-white p-8 shadow-[0_18px_52px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
              style={{ borderColor: `${service.accent}22` }}
            >
              <span
                className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ background: `${service.accent}14`, color: service.accent }}
              >
                {service.kicker}
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#1E3A78]">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#607086]">
                {service.text}
              </p>
              <Link
                href={service.href}
                className="mt-7 inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                style={{ background: service.accent, boxShadow: `0 14px 34px ${service.accent}33` }}
              >
                {locale === "en" ? "Explore this path" : "Explorer cette demarche"}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CabinetMethod({ locale = "fr" }) {
  const copy = locale === "en"
    ? {
        kicker: "Reliability and compliance",
        title: "A method designed to make each procedure readable and secure",
        intro:
          "The current LEXPAT positioning is clear: strong files, controlled process, pragmatic legal strategy."
      }
    : {
        kicker: "Fiabilite et conformite",
        title: "Une methode pensee pour rendre chaque procedure lisible et securisee",
        intro:
          "Le positionnement actuel de LEXPAT est tres clair : des dossiers solides, un process maitrise et une strategie juridique pragmatique."
      };

  const items = CABINET_METHOD[locale];

  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[38px] border border-[#dce4ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-14">
          <div>
            <p className="inline-flex rounded-full border border-[#d7e8e6] bg-[#f6fbfb] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#57B7AF]">
              {copy.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#607086]">
              {copy.intro}
            </p>
            <div className="mt-8 rounded-[28px] bg-[#0b173d] p-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9dd4d0]">
                {locale === "en" ? "Firm promise" : "Promesse cabinet"}
              </p>
              <p className="mt-3 text-lg font-bold leading-8">
                {locale === "en"
                  ? "You are not left alone with an unclear process. Each next step is made explicit."
                  : "Vous n'etes pas laisse seul face a une procedure floue. Chaque prochaine etape est rendue explicite."}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:mt-0">
            {items.map((item, index) => (
              <article key={item} className="flex items-start gap-4 rounded-[26px] border border-[#e3ebf4] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <div className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-sm font-bold text-[#1E3A78]">
                  0{index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#32445e]">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CabinetProof({ locale = "fr" }) {
  const copy = locale === "en"
    ? {
        kicker: "Trust signals",
        title: "A more institutional page rhythm, closer to the live site",
        intro:
          "We keep the current blue and turquoise identity while moving the homepage toward a law-firm tone: credibility, testimonials and human presence."
      }
    : {
        kicker: "Reassurance",
        title: "Un rythme de page plus institutionnel, plus proche du site en ligne",
        intro:
          "On conserve l'identite bleue et turquoise existante, tout en faisant evoluer l'accueil vers un ton cabinet : credibilite, temoignages et presence humaine."
      };

  const testimonials = CABINET_TESTIMONIALS[locale];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[34px] border border-[#e3ebf4] bg-white p-8 shadow-[0_18px_52px_rgba(15,23,42,0.05)] sm:p-10">
            <p className="inline-flex rounded-full border border-[#dce5f0] bg-[#f8fbff] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
              {copy.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E3A78] sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#607086]">
              {copy.intro}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] bg-[#f8fbff] px-5 py-5">
                <p className="text-2xl font-bold text-[#1E3A78]">25+</p>
                <p className="mt-2 text-sm leading-6 text-[#607086]">
                  {locale === "en" ? "Years of experience highlighted on the public site" : "Annees d'experience mises en avant sur le site public"}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#eefaf8] px-5 py-5">
                <p className="text-2xl font-bold text-[#57B7AF]">4</p>
                <p className="mt-2 text-sm leading-6 text-[#607086]">
                  {locale === "en" ? "Working languages for an international audience" : "Langues de travail pour une clientele internationale"}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#fff5f5] px-5 py-5">
                <p className="text-2xl font-bold text-[#B5121B]">1000+</p>
                <p className="mt-2 text-sm leading-6 text-[#607086]">
                  {locale === "en" ? "Successful cases highlighted as social proof" : "Dossiers reussis mis en avant comme preuve sociale"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-[30px] border border-[#e5edf4] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <p className="text-lg leading-8 text-[#32445e]">
                  "{item.text}"
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#edf2f7] pt-5">
                  <div>
                    <p className="text-sm font-bold text-[#1E3A78]">{item.name}</p>
                    <p className="text-sm text-[#607086]">{item.role}</p>
                  </div>
                  <span className="rounded-full bg-[#f4f7fe] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#204E97]">
                    {locale === "en" ? "Client feedback" : "Retour client"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CabinetCta({ locale = "fr" }) {
  const copy = locale === "en"
    ? {
        title: "Need to move forward on a procedure in Belgium?",
        text: "The homepage now reflects a clearer cabinet positioning. The next step is a conversion-oriented contact flow.",
        primary: "Book an appointment",
        secondary: "View legal support"
      }
    : {
        title: "Vous avez besoin d'avancer sur une procedure en Belgique ?",
        text: "L'accueil reflète maintenant un positionnement cabinet plus lisible. La prochaine etape naturelle est un parcours de contact plus convertissant.",
        primary: "Prendre un rendez-vous",
        secondary: "Voir l'accompagnement juridique"
      };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[40px] border border-[#0f2458] bg-[linear-gradient(135deg,#08112f_0%,#10255b_50%,#173a8a_100%)] p-10 sm:p-14 lg:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(87,183,175,0.24),transparent_34%)]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#B5121B]/20 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9dd4d0]">
              {locale === "en" ? "Next step" : "Prochaine etape"}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              {copy.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
              {copy.text}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={localizeHref("/contact", locale)}
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[#B5121B] px-8 py-4 text-base font-bold text-white shadow-[0_16px_44px_rgba(181,18,27,0.28)] transition hover:-translate-y-0.5 hover:bg-[#991219]"
              >
                {copy.primary}
              </Link>
              <Link
                href={localizeHref("/accompagnement-juridique", locale)}
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/16"
              >
                {copy.secondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEGACY COMPONENTS — kept for other pages
   ───────────────────────────────────────────────────────────────────────────── */
export function Hero({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  note,
  logoSrc,
  logoAlt = "",
  stats = [],
  panels = []
}) {
  return (
    <section className="pb-10 pt-8 sm:pb-14 lg:pb-20 lg:pt-12">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[36px] border border-[#dfe9ee] bg-white px-6 py-10 shadow-[0_20px_70px_rgba(30,52,94,0.08)] sm:px-8 lg:px-12 lg:py-16">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(103,190,182,0.16),transparent_62%)]" />
          <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#60b8b1] to-transparent" />

          <div className="relative mx-auto max-w-5xl text-center">
            {logoSrc ? (
              <div className="mx-auto mb-5 flex justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-[#dce7ef] bg-white shadow-[0_18px_40px_rgba(17,39,87,0.08)] sm:h-28 sm:w-28">
                  <Image
                    src={logoSrc}
                    alt={logoAlt}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </div>
            ) : null}
            <p className="inline-flex items-center justify-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#255c8f]">
              {badge}
            </p>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#1d3b8b] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#50627a] sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                onClick={() => track("Hero CTA Clicked", { cta: primaryLabel, destination: primaryHref })}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2] sm:w-auto"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                onClick={() => track("Hero CTA Clicked", { cta: secondaryLabel, destination: secondaryHref })}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#d4dff2] bg-white px-7 py-4 text-base font-semibold text-[#1d3b8b] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            </div>

            {note ? <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#6b7b8f]">{note}</p> : null}

            {stats.length ? (
              <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-[#e5edf4] bg-[#fbfdff] px-5 py-5 text-left">
                    <p className="text-xl font-semibold text-[#1d3b8b]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#66768b]">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {panels.length ? (
            <div className="relative mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-2">
              {panels.map((panel) => (
                <article key={panel.title} className="rounded-[28px] border border-[#e2ebf3] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 text-left shadow-[0_12px_30px_rgba(24,53,101,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{panel.kicker}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#1d3b8b]">{panel.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5c6e84]">{panel.text}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Section({ title, intro, children, muted = false, kicker }) {
  return (
    <section className={muted ? "py-10 sm:py-14 lg:py-16" : "py-10 sm:py-14 lg:py-20"}>
      <div className="container-shell">
        <div className={muted ? "rounded-[36px] border border-[#e7eef4] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10" : ""}>
          <div className="mx-auto mb-8 max-w-4xl text-center lg:mb-12">
            {kicker ? (
              <p className="inline-flex items-center justify-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
                {kicker}
              </p>
            ) : null}
            <h2 className="section-title mx-auto mt-4">{title}</h2>
            {intro ? <p className="section-copy mx-auto">{intro}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function CardGrid({ items, columns = 3 }) {
  const cols = columns === 2 ? "lg:grid-cols-2" : columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className={`grid gap-5 ${cols}`}>
      {items.map((item) => (
        <article key={item.title} className="h-full rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
          {item.kicker ? (
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {item.kicker}
            </p>
          ) : null}
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#607086]">{item.text}</p>
          {item.link ? (
            <Link href={item.link.href} className="mt-5 inline-flex text-sm font-semibold text-[#1d3b8b] transition hover:text-[#57b7af]">
              {item.link.label}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <article key={item.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2fbfa] text-sm font-semibold text-[#57b7af]">
            0{index + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#607086]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.title} className="rounded-[28px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-3.5 w-3.5 rounded-full bg-[#57b7af]" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#607086]">{item.text}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Faq({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <details key={item.question} className="group rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-lg font-semibold tracking-tight text-[#1d3b8b]">
            <span>{item.question}</span>
            <span className="mt-1 text-[#57b7af] transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#607086]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

function getFieldKey(field) {
  return field.name || field.label;
}

function shouldShowField(field, values) {
  if (!field.showWhen) {
    return true;
  }
  return values[field.showWhen.field] === field.showWhen.value;
}

function resolveSelectOptions(field, values) {
  if (field.optionsMap && field.optionsByField) {
    const selected = values[field.optionsByField];
    return selected ? field.optionsMap[selected] || [] : [];
  }
  return field.options || [];
}

export function FormCard({ title, intro, fields, buttonLabel }) {
  const [values, setValues] = useState({});

  const visibleFields = useMemo(
    () => fields.filter((field) => shouldShowField(field, values)),
    [fields, values]
  );

  function handleChange(field, value) {
    const fieldKey = getFieldKey(field);
    setValues((current) => {
      const next = { ...current, [fieldKey]: value };
      if (fieldKey === "region") {
        next.profession = "";
        next.autreProfession = "";
      }
      if (fieldKey === "profession" && value !== "Autre profession") {
        next.autreProfession = "";
      }
      return next;
    });
  }

  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          Formulaire
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#607086]">{intro}</p>
      </div>
      <form className="grid gap-5 md:grid-cols-2">
        {visibleFields.map((field) => {
          const fieldKey = getFieldKey(field);
          const options = field.type === "select" ? resolveSelectOptions(field, values) : [];
          const placeholder =
            field.type === "select" && field.optionsMap && !values[field.optionsByField]
              ? "Choisissez d'abord une région"
              : field.placeholder;

          return (
            <label key={fieldKey} className={field.wide ? "md:col-span-2" : ""}>
              <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="field-input min-h-32"
                  placeholder={field.placeholder}
                  rows="5"
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  className="field-input"
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                >
                  <option value="" disabled>{placeholder}</option>
                  {options.map((option) =>
                    typeof option === "string" ? (
                      <option key={option} value={option}>{option}</option>
                    ) : (
                      <optgroup key={option.label} label={option.label}>
                        {option.options.map((groupOption) => (
                          <option key={`${option.label}-${groupOption}`} value={groupOption}>
                            {groupOption}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
              ) : (
                <input
                  className="field-input"
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                />
              )}
            </label>
          );
        })}
        <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
            Cette version sert de socle de présentation. Le branchement technique des formulaires peut être ajouté ensuite sans changer l'expérience utilisateur.
          </p>
          <button
            type="button"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2]"
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CtaBanner({
  title,
  text,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}) {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[36px] border border-[#dce8ee] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl text-center">
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              Passerelle LEXPAT
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#1d3b8b] sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#607086]">{text}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.24)] transition hover:bg-[#4aa9a2] sm:w-auto"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#d4dff2] bg-white px-7 py-4 text-base font-semibold text-[#1d3b8b] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MATCHING PREVIEW — Espace de messagerie
   Montre aux visiteurs ce qui les attend après le match : espace dédié + messagerie
   ───────────────────────────────────────────────────────────────────────────── */
export function MatchingPreview({ locale = "fr" }) {
  const isEn = locale === "en";

  const copy = {
    kicker:   isEn ? "After the match"                   : "Après le match",
    title:    isEn ? "Your dedicated matching space"      : "Votre espace de mise en relation",
    intro:    isEn
      ? "Once a match is confirmed, each party gets access to a private space: employer and worker can exchange directly through a secure messaging channel."
      : "Une fois le match confirmé, chaque partie accède à un espace dédié : l'employeur et le travailleur peuvent échanger directement via une messagerie sécurisée.",
    workerLabel: isEn ? "Worker side" : "Côté travailleur",
    employerLabel: isEn ? "Employer side" : "Côté employeur",
    workerImage: isEn ? "/matching-preview-worker-en.png" : "/matching-preview-worker-fr.png",
    employerImage: isEn ? "/matching-preview-employer-en.png" : "/matching-preview-employer-fr.png"
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#f8fafb]">
      <div className="container-shell">

        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#57B7AF]">{copy.kicker}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E3A78] sm:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-[#607086] sm:text-base">{copy.intro}</p>
        </div>

        {/* Two mock UIs side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { label: copy.workerLabel, src: copy.workerImage, alt: copy.workerLabel },
            { label: copy.employerLabel, src: copy.employerImage, alt: copy.employerLabel }
          ].map((item) => (
            <div key={item.src} className="overflow-hidden rounded-[28px] border border-[#e4edf4] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.07)]">
              <div className="border-b border-[#eef3f7] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#57B7AF]">{item.label}</p>
              </div>
              <Image
                src={item.src}
                alt={item.alt}
                width={1536}
                height={960}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TESTIMONIALS STRIP — Preuves sociales cabinet LEXPAT
   Positionné après LexpatStrip pour valider l'expertise présentée
   ───────────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    initials: "G.P.",
    name: "G. P.",
    role: { fr: "Cliente accompagnée sur un permis unique", en: "Client — single work permit" },
    quote: {
      fr: "En 5 mois, nous avons obtenu ce que nous attendions depuis près d'un an et demi. Travail sérieux, efficace, professionnel, toujours disponible, à l'écoute de son client…",
      en: "In 5 months, we obtained what we had been waiting for for almost a year and a half. Serious, efficient, professional, always available, attentive to their client…",
    },
  },
  {
    initials: "A.S.",
    name: "A. S.",
    role: { fr: "Travailleur hautement qualifié", en: "Highly qualified worker" },
    quote: {
      fr: "Depuis 3 ans que je leur confie mon dossier de permis de travail, ils me disent toujours quelles sont mes chances et aujourd'hui encore j'ai reçu du positif pour travailleur hautement qualifié.",
      en: "For 3 years I have entrusted them with my work permit file. They always tell me what my chances are, and once again I received a positive outcome as a highly qualified worker.",
    },
  },
  {
    initials: "S.M.",
    name: "S. M.",
    role: { fr: "Demande d'autorisation de travail et de séjour", en: "Work and residence authorisation" },
    quote: {
      fr: "Votre professionnalisme et votre accompagnement m'ont été d'une aide précieuse lors de ma demande d'autorisation de travail et séjour…",
      en: "Your professionalism and support were invaluable to me during my work and residence authorisation process…",
    },
  },
  {
    initials: "O.G.",
    name: "O. G. N. B.",
    role: { fr: "Dossier de travail et séjour", en: "Work and residence file" },
    quote: {
      fr: "Je remercie le cabinet Lexpat Lawfirm de m'avoir soutenu au cours du traitement de mon dossier. En effet, j'ai pu avoir une réponse positive après 8 mois d'attente.",
      en: "I thank the Lexpat Lawfirm for supporting me throughout the processing of my file. I was able to receive a positive outcome after 8 months of waiting.",
    },
  },
];

export function TestimonialsStrip({ locale = "fr" }) {
  const isEn = locale === "en";

  return (
    <section className="py-16 sm:py-20">
      <div className="container-shell">
        {/* Bridge phrase */}
        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-wide text-[#57B7AF]">
          {isEn
            ? "Expertise built on real work and residence cases in Belgium."
            : "Une expertise construite sur des dossiers réels de travail et de séjour en Belgique."}
        </p>

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#1E3A78] sm:text-3xl">
            {isEn ? "They trusted us" : "Ils nous ont fait confiance"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6b7b8f]">
            {isEn
              ? "Clients have already entrusted us with their work and residence procedures in Belgium. Their trust reflects our hands-on experience."
              : "Des clients nous ont déjà confié leurs démarches liées au travail et au séjour en Belgique. Leur confiance témoigne de notre expérience concrète du terrain."}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[24px] border border-[#e4edf4] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)]"
            >
              {/* Quote mark */}
              <span className="mb-3 font-serif text-3xl leading-none text-[#d2e0f5]" aria-hidden="true">"</span>

              {/* Quote text */}
              <p className="flex-1 text-sm italic leading-relaxed text-[#3d4f66]">
                {t.quote[isEn ? "en" : "fr"]}
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t border-[#eef3f7] pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E3A78,#57B7AF)] text-[11px] font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E3A78]">{t.name}</p>
                  <p className="text-[11px] text-[#8a9bb0]">{t.role[isEn ? "en" : "fr"]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
