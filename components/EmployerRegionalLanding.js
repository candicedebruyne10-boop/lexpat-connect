import { BulletList, Hero, Section } from "./Sections";
import FormCard from "./FormCard";

function ProfileTag({ label }) {
  return (
    <li className="rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-sm font-semibold text-[#1E3A78] shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      {label}
    </li>
  );
}

function SolutionGrid({ items }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7"
        >
          <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
            {item.sectionLabel || "Solution"}
          </p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#607086]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function NarrativeSplit({ title, intro, points }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{title}</h3>
        <p className="mt-4 text-sm leading-8 text-[#607086]">{intro}</p>
      </div>
      <div className="rounded-[30px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="inline-flex rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
            {points.sectionLabel || "Points clés"}
        </p>
        <ul className="mt-5 grid gap-4">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-2 inline-flex h-3 w-3 flex-shrink-0 rounded-full bg-[#57b7af]" />
              <span className="text-sm leading-7 text-[#607086]">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LegalCallout({ title, intro, checklist }) {
  return (
    <div className="rounded-[36px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
            {checklist.sectionLabel || "Différenciation juridique"}
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">{title}</h3>
          <p className="mt-4 text-sm leading-8 text-[#607086]">{intro}</p>
        </div>
        <div className="rounded-[30px] border border-[#d9e5f0] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1E3A78]">{checklist.listLabel || "Points à vérifier"}</p>
          <ul className="mt-5 grid gap-4">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-bold text-[#1E3A78]">
                  ✓
                </span>
                <span className="text-sm leading-7 text-[#607086]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SectorGrid({ items }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7"
        >
          <p className="inline-flex rounded-full bg-[#eef1fb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1E3A78]">
            {item.sectionLabel || "Secteur"}
          </p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#607086]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function CompactReassurance({ items }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[28px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7"
        >
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

function FinalCallToAction({ title, text, primaryHref, primaryLabel, badgeLabel }) {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[36px] border border-[#dce8ee] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {badgeLabel || "Recrutement international"}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#1d3b8b] sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#607086]">{text}</p>
            <div className="mt-8 flex justify-center">
              <a href={primaryHref} className="employer-button px-7 py-4 text-base">
                {primaryLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EmployerRegionalLanding({ page }) {
  const ui = page.ui || {};
  const isEn = page.hero.primaryHref.startsWith("/en/");
  const searchedProfiles = page.searchedProfiles.map((profile) =>
    typeof profile === "string" ? { label: profile } : profile
  );
  const solutions = page.solutions.map((item) => ({ ...item, sectionLabel: ui.solutionLabel }));
  const sectors = page.sectors.map((item) => ({ ...item, sectionLabel: ui.sectorLabel }));
  const points = [...page.internationalRecruiting.points];
  points.sectionLabel = ui.keyPointsLabel;
  const checklist = [...page.legalDifferentiation.checklist];
  checklist.sectionLabel = ui.legalDifferentiationLabel;
  checklist.listLabel = ui.checklistLabel;

  const tocItems = isEn ? [
    { n: "01", href: "#challenges",    title: "Recruitment challenges",          desc: "The concrete hiring difficulties in your sector." },
    { n: "02", href: "#profiles",      title: "Profiles in demand",              desc: "Roles that are hard to fill locally." },
    { n: "03", href: "#solution",      title: "The LEXPAT Connect solution",     desc: "What the platform offers you concretely." },
    { n: "04", href: "#international", title: "Why recruit internationally",     desc: "The concrete case for broadening your talent pool." },
    { n: "05", href: "#legal",         title: "Legal framework",                 desc: "Single permit, competent region, salary compliance." },
    { n: "06", href: "#sectors",       title: "Covered sectors",                 desc: "The sectors under the most recruitment pressure." },
    { n: "07", href: "#contact",       title: "Contact us",                      desc: "Form to be contacted directly." },
  ] : [
    { n: "01", href: "#challenges",    title: "Les défis de recrutement",        desc: "Les difficultés concrètes dans votre secteur." },
    { n: "02", href: "#profiles",      title: "Profils recherchés",              desc: "Les métiers difficiles à pourvoir localement." },
    { n: "03", href: "#solution",      title: "La solution LEXPAT Connect",      desc: "Ce que la plateforme vous apporte concrètement." },
    { n: "04", href: "#international", title: "Recruter à l’international",      desc: "Les arguments concrets pour élargir le vivier." },
    { n: "05", href: "#legal",         title: "Cadre juridique",                 desc: "Permis unique, région compétente, conformité salariale." },
    { n: "06", href: "#sectors",       title: "Secteurs couverts",               desc: "Les filières où la tension de recrutement est la plus forte." },
    { n: "07", href: "#contact",       title: "Nous contacter",                  desc: "Formulaire pour être recontacté directement." },
  ];

  return (
    <>
      <Hero
        badge={page.hero.badge}
        title={page.hero.title}
        description={page.hero.description}
        primaryHref={page.hero.primaryHref}
        primaryLabel={page.hero.primaryLabel}
        secondaryHref={page.hero.secondaryHref}
        secondaryLabel={page.hero.secondaryLabel}
        note={page.hero.note}
        stats={page.hero.stats}
        panels={page.hero.panels}
      />

      {/* ── Table des matières ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
                {isEn ? "≡ On this page — navigation" : "≡ Sur cette page — navigation"}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                {isEn ? "Topics covered on this page" : "Les sujets traités sur cette page"}
              </h2>
              <p className="mt-1 text-xs text-[#8a9db8]">
                {isEn ? "Click a section below to jump directly to it ↓" : "Cliquez sur une section ci-dessous pour y accéder directement ↓"}
              </p>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              {isEn ? "⏱ Reading: ~4 min" : "⏱ Lecture : ~4 min"}
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tocItems.map(({ n, href, title, desc }) => (
              <a
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-4 shadow-sm transition hover:border-[#57b7af] hover:shadow-md"
              >
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-bold text-[#1d3b8b] transition group-hover:bg-[#57b7af] group-hover:text-white">
                  {n}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">{title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-[#6b85a0]">{desc}</div>
                </div>
                <span className="ml-auto mt-1 flex-shrink-0 text-[#c5d8ec] transition group-hover:translate-x-1 group-hover:text-[#57b7af]">→</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="challenges">
      <Section
        title={ui.challengeTitle || "Le vrai problème pour beaucoup d’employeurs"}
        intro={ui.challengeIntro || "Quand certains postes restent vacants trop longtemps, les effets se ressentent vite sur la production, l’organisation et la croissance."}
        kicker={ui.challengeKicker || "Constat terrain"}
      >
        <BulletList items={page.employerChallenges} />
      </Section>
      </div>

      <div id="profiles">
      <Section
        title={ui.searchedTitle || "Profils aujourd’hui difficiles à recruter localement"}
        intro={ui.searchedIntro || "Voici quelques fonctions pour lesquelles de nombreux employeurs peinent à trouver des candidats disponibles localement."}
        kicker={ui.searchedKicker || "Profils recherchés"}
        muted
      >
        <ul className="flex flex-wrap justify-center gap-3">
          {searchedProfiles.map((profile) => (
            <ProfileTag key={profile.label} label={profile.label} />
          ))}
        </ul>
      </Section>
      </div>

      <div id="solution">
      <Section
        title={ui.solutionTitle || "LEXPAT Connect : une solution pensée pour les employeurs"}
        intro={ui.solutionIntro || "L’objectif n’est pas seulement de rendre des profils visibles, mais de structurer un recrutement international crédible, plus lisible et juridiquement mieux encadré."}
        kicker={ui.solutionKicker || "Solution"}
      >
        <SolutionGrid items={solutions} />
      </Section>
      </div>

      <div id="international">
      <Section
        title={page.internationalRecruiting.title}
        intro={ui.internationalIntro || "Une ouverture à l’international n’est pertinente que si elle répond à un besoin concret. Lorsqu’elle est bien cadrée, elle peut devenir un vrai levier employeur."}
        kicker={ui.internationalKicker || "Ouverture internationale"}
        muted
      >
        <NarrativeSplit
          title={page.internationalRecruiting.title}
          intro={page.internationalRecruiting.intro}
          points={points}
        />
      </Section>
      </div>

      <div id="legal">
      <Section
        title={ui.legalTitle || "Ce qui fait la différence entre une mise en relation et un recrutement sécurisé"}
        intro={ui.legalIntro || "Sur les métiers en pénurie, la dimension juridique devient vite décisive dès qu’un recrutement international hors UE entre en jeu."}
        kicker={ui.legalKicker || "Cadre juridique"}
      >
        <LegalCallout
          title={page.legalDifferentiation.title}
          intro={page.legalDifferentiation.intro}
          checklist={checklist}
        />
      </Section>
      </div>

      <div id="sectors">
      <Section
        title={ui.sectorsTitle || "Secteurs particulièrement concernés"}
        intro={ui.sectorsIntro || "Cette logique peut s’appliquer à plusieurs secteurs où la tension de recrutement ralentit directement l’activité."}
        kicker={ui.sectorsKicker || "Secteurs couverts"}
        muted
      >
        <SectorGrid items={sectors} />
      </Section>
      </div>

      <Section
        title={ui.reassuranceTitle || "Pour les employeurs qui veulent recruter vite, sans improviser"}
        intro={ui.reassuranceIntro || "Une page locale comme celle-ci doit avant tout rassurer : faisabilité, méthode, sécurité juridique et gain de temps."}
        kicker={ui.reassuranceKicker || "Réassurance"}
      >
        <CompactReassurance items={page.reassurance} />
      </Section>

      <FinalCallToAction
        title={page.finalCta.title}
        text={page.finalCta.text}
        primaryHref={page.finalCta.primaryHref}
        primaryLabel={page.finalCta.primaryLabel}
        badgeLabel={ui.finalCtaBadge}
      />

      <div id="contact">
      <Section
        title={ui.contactTitle || "Besoin d’un échange direct avant d’avancer ?"}
        intro={ui.contactIntro || "La plateforme reste le parcours principal. Ce formulaire est proposé comme solution secondaire pour les employeurs qui préfèrent être recontactés."}
        kicker={ui.contactKicker || "Contact employeur"}
        muted
      >
        <div id="formulaire-contact">
          <FormCard
            title={page.form.title}
            intro={page.form.intro}
            fields={page.form.fields}
            buttonLabel={page.form.buttonLabel}
            formType={page.form.formType}
            successMessage={page.form.successMessage}
          />
        </div>
      </Section>
      </div>

      <RegionalPagesNav currentFormType={page.form.formType} locale={page.hero.primaryHref.startsWith("/en/") ? "en" : "fr"} />
    </>
  );
}

// ─── Navigation vers les autres pages régionales ─────────────────────────────

const REGIONAL_PAGES_FR = [
  {
    label: "Liège",
    description: "Métiers en pénurie à Liège",
    href: "/employeurs/liege-metiers-en-penurie",
    formType: "employeur-liege-penurie",
  },
  {
    label: "Anvers",
    description: "Métiers en pénurie à Anvers",
    href: "/employeurs/anvers-metiers-en-penurie",
    formType: "employeur-anvers-penurie",
  },
  {
    label: "Gand",
    description: "Métiers en pénurie à Gand",
    href: "/employeurs/gand-metiers-en-penurie",
    formType: "employeur-gand-penurie",
  },
  {
    label: "Bruges",
    description: "Métiers en pénurie à Bruges",
    href: "/employeurs/bruges-metiers-en-penurie",
    formType: "employeur-bruges-penurie",
  },
  {
    label: "Recrutement international",
    description: "6 entreprises sur 10 recrutent déjà des profils internationaux",
    href: "/recrutement-international",
    formType: "employeur-recrutement-international",
  },
];

const REGIONAL_PAGES_EN = [
  {
    label: "Liège",
    description: "Shortage occupations in Liège",
    href: "/en/employeurs/liege-metiers-en-penurie",
    formType: "employeur-liege-penurie",
  },
  {
    label: "Antwerp",
    description: "Shortage occupations in Antwerp",
    href: "/en/employeurs/anvers-metiers-en-penurie",
    formType: "employeur-anvers-penurie-en",
  },
  {
    label: "Ghent",
    description: "Shortage occupations in Ghent",
    href: "/en/employeurs/gand-metiers-en-penurie",
    formType: "employeur-gand-penurie-en",
  },
  {
    label: "Bruges",
    description: "Shortage occupations in Bruges",
    href: "/en/employeurs/bruges-metiers-en-penurie",
    formType: "employeur-bruges-penurie-en",
  },
  {
    label: "International recruitment",
    description: "6 in 10 companies already recruit internationally",
    href: "/en/recrutement-international",
    formType: "employeur-recrutement-international-en",
  },
];

function RegionalPagesNav({ currentFormType, locale }) {
  const pages = locale === "en" ? REGIONAL_PAGES_EN : REGIONAL_PAGES_FR;
  const others = pages.filter((p) => p.formType !== currentFormType);
  if (others.length === 0) return null;
  const title = locale === "en" ? "Other employer resources" : "Autres ressources pour les employeurs";
  const intro = locale === "en"
    ? "Each page is tailored to the specific context of a city or topic — shortage occupations, legal framework and available profiles."
    : "Chaque page est adaptée au contexte spécifique d'une ville ou d'un sujet — métiers en pénurie, cadre juridique et profils disponibles.";
  const kicker = locale === "en" ? "Related pages" : "Pages associées";
  return (
    <section className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-t border-[#dce8f5]">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
          {kicker}
        </p>
        <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">{title}</h2>
        <p className="mt-2 text-sm text-[#607086]">{intro}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="group flex flex-col gap-2 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-5 shadow-sm transition hover:border-[#57b7af] hover:shadow-md"
            >
              <span className="text-sm font-bold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">
                {p.label} →
              </span>
              <span className="text-xs leading-relaxed text-[#6b85a0]">{p.description}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
