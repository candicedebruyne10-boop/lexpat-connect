"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const EMPLOYER = {
  primary: "#173A8A",
  secondary: "#2E5AA2",
  soft: "#EEF4FF",
  border: "rgba(23,58,138,0.18)"
};

const TALENT = {
  primary: "#59B9B1",
  secondary: "#6EC9C1",
  soft: "#ECFAF8",
  border: "rgba(89,185,177,0.22)"
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
export function HeroPremium({ primaryHref, secondaryHref }) {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden lg:min-h-screen">
      {/* ── Image de fond : carte monde + Belgique mise en lumière ── */}
      <Image
        src="/hero-world-map_2.png"
        alt="LEXPAT Connect — Connexion Belgique et talents internationaux"
        fill
        priority
        quality={90}
        className="object-cover object-[20%_42%] lg:object-[58%_42%]"
        sizes="100vw"
      />

      {/* ── Overlays : split composition gauche (texte) / droite (carte) ── */}
      {/* Mobile : voile uniforme pour lisibilité du texte — Desktop : gradient directionnel */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(6,12,38,0.82)_0%,rgba(6,12,38,0.58)_60%,rgba(6,12,38,0.38)_100%)] lg:bg-[linear-gradient(108deg,rgba(6,12,38,0.97)_0%,rgba(7,14,42,0.92)_22%,rgba(8,16,50,0.78)_40%,rgba(8,16,50,0.48)_58%,rgba(6,12,38,0.22)_78%,rgba(6,12,38,0.10)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(6,12,38,0.82),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,rgba(6,12,38,0.55),transparent)]" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#59B9B1]/[0.06] blur-3xl" />

      {/* ── Contenu ── */}
      <div className="container-shell relative z-10 w-full py-24 sm:py-28 lg:py-32">
        <div className="max-w-2xl xl:max-w-[52rem]">

          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.08] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9dd4d0] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#59B9B1]" />
            Belgique · Métiers en pénurie · Matching international
          </div>

          <h1 className="mt-8 text-[clamp(2.8rem,5.8vw,5.6rem)] font-bold leading-[1.02] tracking-[-0.048em] text-white">
            Employeurs belges.<br />
            <span className="text-[#5ec9c1]">Talents internationaux.</span><br />
            Match direct.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/[0.62] sm:text-lg">
            La plateforme qui connecte les entreprises belges aux profils qualifiés dans les métiers en pénurie — de façon claire, rapide et ciblée.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex min-h-[3.75rem] items-center justify-center rounded-2xl px-8 py-4 text-base font-bold text-white shadow-[0_18px_48px_rgba(23,58,138,0.38)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(23,58,138,0.48)]"
              style={{ background: EMPLOYER.primary }}
            >
              Je recrute
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-[3.75rem] items-center justify-center rounded-2xl px-8 py-4 text-base font-bold text-white shadow-[0_18px_48px_rgba(89,185,177,0.32)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(89,185,177,0.42)]"
              style={{ background: TALENT.primary }}
            >
              Je me fais repérer
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Bruxelles", "Wallonie", "Flandre", "Immigration économique", "Permis unique"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.07] px-3.5 py-1.5 text-xs font-semibold text-white/[0.55] backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
const ENTRY_CARDS = [
  {
    icon: BriefcaseIcon,
    title: "J'ai un poste à pourvoir",
    text: "Vous cherchez un profil qualifié dans un métier en pénurie ? Déposez votre besoin et accédez à des candidats internationaux prêts à s'installer en Belgique.",
    href: "/employeurs",
    cta: "Voir l'espace employeur",
    colors: EMPLOYER
  },
  {
    icon: TalentIcon,
    title: "Je cherche un emploi en Belgique",
    text: "Vous avez une expérience dans un métier en pénurie et souhaitez travailler en Belgique ? Créez votre profil et faites-vous repérer par les employeurs belges.",
    href: "/travailleurs",
    cta: "Voir l'espace talent",
    colors: TALENT
  }
];

export function DualEntry() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
            Deux parcours
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
            Choisissez votre entrée
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-[32px] border bg-white p-8 shadow-[0_18px_52px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:p-10"
                style={{
                  background: `linear-gradient(180deg, #ffffff 0%, ${card.colors.soft} 100%)`,
                  borderColor: card.colors.border
                }}
              >
                <div
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{ background: card.colors.soft, borderColor: card.colors.border, color: card.colors.primary }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div
                  className="mt-5 inline-flex rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    background: card.colors.soft,
                    border: `1px solid ${card.colors.border}`,
                    color: card.colors.primary
                  }}
                >
                  {card.title}
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#080f2e] sm:text-[2rem]">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#5d6e83]">
                  {card.text}
                </p>
                <div className="mt-8">
                  <Link
                    href={card.href}
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

export function ShortageJobsQuickLink() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="rounded-[32px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-[#e9f8f5] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              Guide employeur
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#080f2e] sm:text-3xl">
              Comprenez quels métiers en pénurie comptent vraiment pour votre recrutement
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
              Une page unique vous aide à lire les listes régionales officielles, à comprendre leur impact sur le permis unique et à repérer les secteurs les plus porteurs.
            </p>
          </div>
          <div className="mt-6 flex-shrink-0 lg:mt-0">
            <Link
              href="/metiers-en-penurie"
              className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[#173A8A] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_36px_rgba(23,58,138,0.28)] transition hover:bg-[#153374]"
            >
              Lire le guide métiers en pénurie
            </Link>
            <p className="mt-3 text-xs leading-6 text-[#6c7b8f]">
              Idéal pour vérifier rapidement si votre poste peut s’appuyer sur une liste régionale officielle.
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
                Une architecture conçue pour séparer le matching professionnel du traitement juridique
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d6e83] sm:text-[0.98rem]">
                Données hébergées en Europe, partage limité avant mise en relation et relais juridique distinct uniquement quand le recrutement l’exige.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full border border-[rgba(23,58,138,0.16)] bg-[#eef4ff] px-3.5 py-1.5 text-xs font-semibold text-[#173A8A]">
                  Hébergement UE
                </span>
                <span className="inline-flex rounded-full border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-3.5 py-1.5 text-xs font-semibold text-[#2f9f97]">
                  Consentement avant transfert
                </span>
                <span className="inline-flex rounded-full border border-[rgba(39,79,150,0.16)] bg-[#f4f7fe] px-3.5 py-1.5 text-xs font-semibold text-[#274f96]">
                  Relais juridique séparé
                </span>
              </div>
            </div>

            <div className="mt-6 flex-shrink-0 lg:mt-0">
              <Link
                href="/securite-conformite"
                className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-[#d6dfef] bg-white px-7 py-4 text-base font-semibold text-[#173A8A] shadow-[0_12px_28px_rgba(23,58,138,0.08)] transition hover:-translate-y-0.5 hover:border-[#b7c8e3] hover:bg-[#f5f9ff]"
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
    title: "Déposer un besoin ou un profil",
    text: "Employeurs et talents renseignent l’essentiel, sans parcours complexe.",
    accent: EMPLOYER,
    iconIndex: 0
  },
  {
    num: "02",
    title: "Entrer en relation",
    text: "La plateforme facilite une mise en relation rapide et lisible.",
    accent: TALENT,
    iconIndex: 1
  },
  {
    num: "03",
    title: "Sécuriser le juridique si nécessaire",
    text: "LEXPAT intervient ensuite uniquement quand le recrutement l’exige.",
    accent: EMPLOYER,
    iconIndex: 2
  }
];

export function HowItWorksPremium() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[40px] border border-[#e2ecf4] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10 lg:p-14">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-[#f8fbff] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
              3 étapes
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
              Comment ça marche
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
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
                <h3 className="mt-5 text-xl font-bold tracking-tight text-[#080f2e]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{step.text}</p>
              </article>
            ))}
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

export function JobSectors() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d9e6ef] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a6f8d]">
            Métiers en pénurie
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
            Les profils les plus recherchés actuellement en Belgique
          </h2>
          <p className="mx-auto mt-4 text-base leading-7 text-[#5d6e83]">
            Des fonctions prioritaires pour accélérer les recrutements et donner plus de visibilité aux profils internationaux.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {JOB_SECTORS.map((job) => (
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
              <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-[#080f2e]">
                {job.label}
              </h3>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/metiers-en-penurie"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#d4dff2] bg-white px-7 py-3.5 text-sm font-bold text-[#1d3b8b] shadow-[0_8px_24px_rgba(29,59,139,0.08)] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] hover:shadow-[0_12px_32px_rgba(29,59,139,0.14)]"
          >
            Voir tous les métiers en pénurie <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEXPAT RELAY — Section 5
   Discreet, premium, strategic — appears AFTER the match
   ───────────────────────────────────────────────────────────────────────────── */
export function LexpatStrip() {
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
                Cabinet LEXPAT — Relais juridique
              </p>
              <p className="mt-2 max-w-2xl text-base font-bold leading-snug text-[#080f2e]">
                Sécurisation juridique après mise en relation
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7b8f]">
                Une fois le matching validé, le cabinet LEXPAT prend le relais pour sécuriser le permis unique, l'immigration économique et le droit au travail.
              </p>
            </div>
          </div>
          <div className="mt-6 flex-shrink-0 lg:mt-0">
            <Link
              href="/accompagnement-juridique"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-[14px] border border-[#d2dff4] bg-white px-5 py-3 text-sm font-bold text-[#1d3b8b] transition hover:border-[#a8bbdd] hover:bg-[#f4f8ff]"
            >
              En savoir plus <span aria-hidden="true">→</span>
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
export function CtaBannerDark({ primaryHref, secondaryHref }) {
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
              Passez à l'action
            </p>

            <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Passez à l'action maintenant
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/[0.55] sm:text-lg">
              Recrutez plus vite ou rendez votre profil visible auprès des employeurs belges.
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
                Recruter maintenant
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl px-9 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 sm:w-auto"
                style={{
                  background: TALENT.primary,
                  boxShadow: "0 16px 48px rgba(89,185,177,0.28)"
                }}
              >
                Déposer mon profil
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
              <Link href={primaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2] sm:w-auto">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#d4dff2] bg-white px-7 py-4 text-base font-semibold text-[#1d3b8b] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] sm:w-auto">
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
          <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
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
          <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
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
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
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
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#5d6e83]">{item.answer}</p>
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
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{intro}</p>
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
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#5d6e83]">{text}</p>
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
