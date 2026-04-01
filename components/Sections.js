"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   HERO PREMIUM — Section 1
   Dark blue full-bleed, punch headline, 2 CTA cards embedded in hero
   ───────────────────────────────────────────────────────────────────────────── */
export function HeroPremium({ primaryHref, secondaryHref }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 lg:pb-32 lg:pt-24"
      style={{ background: "linear-gradient(135deg, #080f2e 0%, #0c1a4a 38%, #122060 65%, #1a2e7a 100%)" }}
    >
      <div className="absolute inset-0">
        <Image
          src="/hero-accueil-lexpat-connect.png"
          alt="Visualisation de la mise en relation entre employeurs belges et talents internationaux"
          fill
          priority
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,46,0.16)_0%,rgba(8,15,46,0.26)_24%,rgba(8,15,46,0.46)_62%,rgba(8,15,46,0.72)_100%)]" />

      {/* Decorative radial glows */}
        <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[650px] bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,rgba(87,183,175,0.12),transparent)]" />
        <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-600/6 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-[#57b7af]/8 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(8,15,46,0.34),transparent)]" />
      </div>

      <div className="container-shell relative">
        <div className="mb-8 flex justify-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:h-28 sm:w-28">
            <Image
              src="/logo-lexpat-connect.png"
              alt="Logo LEXPAT Connect"
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </div>

        {/* Badge pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9dd4d0] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#57b7af]" />
            Belgique · Métiers en pénurie · Mise en relation directe
          </div>
        </div>

        {/* Main headline */}
        <div className="mx-auto mt-10 max-w-5xl text-center">
          <h1 className="text-[clamp(2.6rem,5.8vw,5.2rem)] font-bold leading-[1.04] tracking-[-0.045em] text-white">
            Employeurs belges.{" "}
            <span className="text-[#57b7af]">Talents internationaux.</span>{" "}
            Match direct.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/[0.58] sm:text-[1.1rem]">
            La plateforme qui connecte les entreprises belges aux profils qualifiés dans les métiers en pénurie — sans intermédiaire, sans délai.
          </p>
        </div>

        {/* Dual CTA cards */}
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2 lg:max-w-[44rem]">
          {/* Employer card */}
          <Link
            href={primaryHref}
            className="group flex flex-col justify-between rounded-[26px] border border-white/[0.1] bg-white/[0.07] p-7 backdrop-blur-sm transition duration-300 hover:border-white/[0.2] hover:bg-white/[0.12] hover:shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
          >
            <div>
              <span className="inline-block rounded-full bg-[#57b7af]/[0.22] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#57b7af]">
                Employeurs belges
              </span>
              <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.02em] text-white">
                Trouvez les talents internationaux que vous ne trouvez pas localement
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/[0.5]">
                Déposez votre besoin. Ciblez les métiers en tension. Recrutez plus vite.
              </p>
            </div>
            <div className="mt-7 inline-flex items-center gap-2 text-base font-bold text-white transition-all duration-200 group-hover:gap-3.5">
              Je recrute <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Talent card */}
          <Link
            href={secondaryHref}
            className="group flex flex-col justify-between rounded-[26px] border border-[#57b7af]/[0.3] bg-[#57b7af]/[0.12] p-7 backdrop-blur-sm transition duration-300 hover:border-[#57b7af]/[0.5] hover:bg-[#57b7af]/[0.2] hover:shadow-[0_24px_64px_rgba(87,183,175,0.15)]"
          >
            <div>
              <span className="inline-block rounded-full bg-[#57b7af]/[0.25] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#57b7af]">
                Talents internationaux
              </span>
              <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.02em] text-white">
                Rendez votre profil visible auprès des employeurs belges
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/[0.5]">
                Présentez vos compétences, votre expérience, votre disponibilité.
              </p>
            </div>
            <div className="mt-7 inline-flex items-center gap-2 text-base font-bold text-white transition-all duration-200 group-hover:gap-3.5">
              Je rends mon profil visible <span aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DUAL ENTRY — Section 2
   Two premium elaborated cards — one employer, one talent
   ───────────────────────────────────────────────────────────────────────────── */
export function DualEntry() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#57b7af]">
            Accès direct
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
            Pour qui est cette plateforme ?
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Employer card — navy palette */}
          <article className="relative overflow-hidden rounded-[32px] border border-[#c8d8f0] bg-[linear-gradient(150deg,#f0f5ff_0%,#e6eefb_100%)] p-8 shadow-[0_20px_60px_rgba(15,31,79,0.08)] transition duration-300 hover:shadow-[0_30px_72px_rgba(15,31,79,0.14)] sm:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#1d3b8b]/[0.06] blur-2xl" />
            <span className="inline-block rounded-full border border-[#b0c6e8] bg-[#dce8f8] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1d3b8b]">
              Employeurs belges
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-[-0.03em] text-[#080f2e] sm:text-3xl">
              Recrutez des talents internationaux alignés avec vos besoins
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#5d6e83]">
              Déposez votre besoin de recrutement. La plateforme cible les métiers en pénurie et vous connecte aux profils internationaux qualifiés, disponibles et prêts à travailler en Belgique.
            </p>
            <div className="mt-8">
              <Link
                href="/employeurs"
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[#1d3b8b] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_36px_rgba(29,59,139,0.28)] transition hover:bg-[#162d6b] hover:shadow-[0_16px_44px_rgba(29,59,139,0.36)]"
              >
                Je recrute maintenant
              </Link>
            </div>
          </article>

          {/* Talent card — teal palette */}
          <article className="relative overflow-hidden rounded-[32px] border border-[#9dd4d0] bg-[linear-gradient(150deg,#f0fbf9_0%,#e4f7f5_100%)] p-8 shadow-[0_20px_60px_rgba(87,183,175,0.1)] transition duration-300 hover:shadow-[0_30px_72px_rgba(87,183,175,0.18)] sm:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#57b7af]/[0.12] blur-2xl" />
            <span className="inline-block rounded-full border border-[#8fcdc8] bg-[#d4f0ee] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2a8a82]">
              Talents internationaux
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-[-0.03em] text-[#080f2e] sm:text-3xl">
              Rendez votre profil visible auprès des bons employeurs
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#5d6e83]">
              Présentez votre expérience, vos compétences et votre disponibilité dans un format lisible, clair et directement exploitable par les employeurs belges qui recrutent dans votre domaine.
            </p>
            <div className="mt-8">
              <Link
                href="/travailleurs"
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_36px_rgba(87,183,175,0.32)] transition hover:bg-[#4aa9a2] hover:shadow-[0_16px_44px_rgba(87,183,175,0.42)]"
              >
                Je rends mon profil visible
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOW IT WORKS PREMIUM — Section 3
   3 steps, horizontal flow, zero jargon
   ───────────────────────────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Dépôt",
    text: "L'employeur décrit son besoin. Le talent présente son parcours, ses compétences et sa disponibilité."
  },
  {
    num: "02",
    title: "Matching",
    text: "Région, métier en pénurie, expérience : le contexte rend la mise en relation plus pertinente et plus rapide."
  },
  {
    num: "03",
    title: "Contact direct",
    text: "Employeurs et talents avancent directement vers une mise en relation sérieuse, sans intermédiaire."
  }
];

export function HowItWorksPremium() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[40px] border border-[#e2ecf4] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10 lg:p-14">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="inline-flex items-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#57b7af]">
              3 étapes
            </p>
            <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mx-auto mt-4 text-base leading-7 text-[#5d6e83]">
              Un parcours simple, centré sur la mise en relation.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-0 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center px-6 py-4 text-center sm:px-8 sm:py-6">
                {/* Connecting dashed line (desktop) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="absolute hidden sm:block"
                    style={{
                      top: "2.5rem",
                      left: "62%",
                      right: "-38%",
                      borderTop: "2px dashed #c8e0dc"
                    }}
                  />
                )}
                {/* Step number */}
                <div className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#57b7af,#3d9a93)] text-xl font-bold text-white shadow-[0_14px_36px_rgba(87,183,175,0.28)]">
                  {step.num}
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-[#080f2e]">{step.title}</h3>
                <p className="mt-3 max-w-[16rem] text-sm leading-7 text-[#5d6e83]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   JOB SECTORS — Section 4
   Most sought-after profiles in Belgium
   ───────────────────────────────────────────────────────────────────────────── */
const JOB_SECTORS = [
  {
    id: "sante",
    label: "Santé & soins",
    roles: "Infirmiers, aides-soignants, profils de soin",
    note: "Demande élevée dans plusieurs régions belges.",
    dotColor: "#e04a6a",
    tagBg: "#fdf0f3",
    tagColor: "#c0335a"
  },
  {
    id: "construction",
    label: "Construction",
    roles: "Maçons, couvreurs, électriciens, techniciens",
    note: "Métiers de terrain à besoin récurrent et élevé.",
    dotColor: "#d97706",
    tagBg: "#fffbec",
    tagColor: "#b45309"
  },
  {
    id: "industrie",
    label: "Industrie & maintenance",
    roles: "Soudeurs, mécaniciens, opérateurs, maintenance",
    note: "Profils techniques pour renforcer les équipes rapidement.",
    dotColor: "#2563eb",
    tagBg: "#eff6ff",
    tagColor: "#1d4ed8"
  },
  {
    id: "transport",
    label: "Transport & logistique",
    roles: "Chauffeurs, préparateurs, fonctions logistiques",
    note: "Indispensables pour les entreprises qui recrutent en tension.",
    dotColor: "#059669",
    tagBg: "#ecfdf5",
    tagColor: "#047857"
  }
];

export function JobSectors() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#57b7af]">
            Métiers en pénurie
          </p>
          <h2 className="mx-auto mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#080f2e] sm:text-4xl">
            Les profils les plus recherchés en Belgique
          </h2>
          <p className="mx-auto mt-4 text-base leading-7 text-[#5d6e83]">
            La plateforme cible en priorité les fonctions en tension pour rendre les mises en relation plus utiles.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {JOB_SECTORS.map((sector) => (
            <article
              key={sector.id}
              className="group rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:shadow-[0_20px_56px_rgba(15,23,42,0.09)] hover:-translate-y-1 sm:p-7"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ background: sector.tagBg, color: sector.tagColor }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: sector.dotColor }} />
                {sector.label}
              </span>
              <h3 className="mt-5 text-base font-bold leading-snug tracking-tight text-[#080f2e]">
                {sector.roles}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#5d6e83]">{sector.note}</p>
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
                Une fois la mise en relation validée, LEXPAT peut sécuriser le permis unique et accompagner l'immigration économique.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7b8f]">
                Intervention uniquement si la situation l'exige. La mise en relation reste la priorité.
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
              La mise en relation commence maintenant
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/[0.55] sm:text-lg">
              Déposez votre besoin ou rendez votre profil visible. La plateforme pensée pour accélérer le recrutement dans les métiers en pénurie en Belgique.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl bg-[#57b7af] px-9 py-4 text-base font-bold text-white shadow-[0_16px_48px_rgba(87,183,175,0.34)] transition hover:bg-[#4aa9a2] hover:shadow-[0_20px_56px_rgba(87,183,175,0.44)] sm:w-auto"
              >
                Je recrute maintenant
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-2xl border border-white/[0.2] bg-white/[0.08] px-9 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:border-white/[0.35] hover:bg-white/[0.14] sm:w-auto"
              >
                Je rends mon profil visible
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
