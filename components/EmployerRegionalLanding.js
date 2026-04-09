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
            Solution
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
          Points clés
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
            Différenciation juridique
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">{title}</h3>
          <p className="mt-4 text-sm leading-8 text-[#607086]">{intro}</p>
        </div>
        <div className="rounded-[30px] border border-[#d9e5f0] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1E3A78]">Points à vérifier</p>
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
            Secteur
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

function FinalCallToAction({ title, text, primaryHref, primaryLabel }) {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[36px] border border-[#dce8ee] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              Recrutement à Liège
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

      <Section
        title="Le vrai problème pour beaucoup d’employeurs liégeois"
        intro="Quand certains postes restent vacants trop longtemps, les effets se ressentent vite sur la production, l’organisation et la croissance."
        kicker="Constat terrain"
      >
        <BulletList items={page.employerChallenges} />
      </Section>

      <Section
        title="Profils aujourd’hui difficiles à recruter à Liège"
        intro="Voici quelques fonctions pour lesquelles de nombreux employeurs peinent à trouver des candidats disponibles localement."
        kicker="Profils recherchés"
        muted
      >
        <ul className="flex flex-wrap justify-center gap-3">
          {page.searchedProfiles.map((profile) => (
            <ProfileTag key={profile} label={profile} />
          ))}
        </ul>
      </Section>

      <Section
        title="LEXPAT Connect : une solution pensée pour les employeurs"
        intro="L’objectif n’est pas seulement de rendre des profils visibles, mais de structurer un recrutement international crédible, plus lisible et juridiquement mieux encadré."
        kicker="Solution"
      >
        <SolutionGrid items={page.solutions} />
      </Section>

      <Section
        title={page.internationalRecruiting.title}
        intro="Une ouverture à l’international n’est pertinente que si elle répond à un besoin concret. Lorsqu’elle est bien cadrée, elle peut devenir un vrai levier employeur."
        kicker="Ouverture internationale"
        muted
      >
        <NarrativeSplit
          title={page.internationalRecruiting.title}
          intro={page.internationalRecruiting.intro}
          points={page.internationalRecruiting.points}
        />
      </Section>

      <Section
        title="Ce qui fait la différence entre une mise en relation et un recrutement sécurisé"
        intro="Sur les métiers en pénurie, la dimension juridique devient vite décisive dès qu’un recrutement international hors UE entre en jeu."
        kicker="Cadre juridique"
      >
        <LegalCallout
          title={page.legalDifferentiation.title}
          intro={page.legalDifferentiation.intro}
          checklist={page.legalDifferentiation.checklist}
        />
      </Section>

      <Section
        title="Secteurs liégeois particulièrement concernés"
        intro="Cette logique peut s’appliquer à plusieurs secteurs où la tension de recrutement ralentit directement l’activité."
        kicker="Secteurs couverts"
        muted
      >
        <SectorGrid items={page.sectors} />
      </Section>

      <Section
        title="Pour les employeurs qui veulent recruter vite, sans improviser"
        intro="Une page locale comme celle-ci doit avant tout rassurer : faisabilité, méthode, sécurité juridique et gain de temps."
        kicker="Réassurance"
      >
        <CompactReassurance items={page.reassurance} />
      </Section>

      <FinalCallToAction
        title={page.finalCta.title}
        text={page.finalCta.text}
        primaryHref={page.finalCta.primaryHref}
        primaryLabel={page.finalCta.primaryLabel}
      />

      <Section
        title="Besoin d’un échange direct avant d’avancer ?"
        intro="La plateforme reste le parcours principal. Ce formulaire est proposé comme solution secondaire pour les employeurs qui préfèrent être recontactés."
        kicker="Contact employeur"
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
    </>
  );
}
