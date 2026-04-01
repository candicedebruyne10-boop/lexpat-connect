import Link from "next/link";
import { Hero, Section, CtaBanner } from "../../components/Sections";
import { shortageJobs2026, shortageUsefulLinks } from "../../lib/shortageJobs2026";

const regionThemes = {
  bruxelles: {
    soft: "#EEF4FF",
    border: "rgba(23,58,138,0.18)",
    badgeBg: "#DDE8FF",
    accent: "#173A8A"
  },
  wallonie: {
    soft: "#ECFAF8",
    border: "rgba(89,185,177,0.22)",
    badgeBg: "#D8F3EF",
    accent: "#2F9F97"
  },
  flandre: {
    soft: "#F4F1FF",
    border: "rgba(98,84,183,0.2)",
    badgeBg: "#E6DFFF",
    accent: "#6254B7"
  }
};

export const metadata = {
  title: "Liste complète des métiers en pénurie 2026 | LEXPAT Connect",
  description:
    "Consultez la liste complète 2026 des métiers en pénurie en Belgique, structurée par région : Bruxelles-Capitale, Wallonie et Flandre."
};

export default function ListeMetiersPenuriePage() {
  return (
    <>
      <Hero
        badge="Liste complète 2026"
        title={
          <>
            Tous les métiers en pénurie
            <span className="block text-[#57b7af]">repris par région en Belgique</span>
          </>
        }
        description="Une page de référence pour consulter, région par région, les métiers en pénurie repris dans votre document 2026."
        primaryHref="/travailleurs"
        primaryLabel="Déposer mon profil"
        secondaryHref="/employeurs"
        secondaryLabel="Déposer un besoin"
        note="Cette page reprend les métiers listés dans votre brochure 2026. Elle sert de repère pratique pour employeurs et talents."
      />

      <Section
        title="Accès direct par région"
        intro="Choisissez directement la région qui vous concerne pour consulter la liste détaillée des métiers en pénurie."
        kicker="Navigation rapide"
        muted
      >
        <div className="grid gap-5 md:grid-cols-3">
          {shortageJobs2026.map((region) => (
            <a
              key={region.id}
              href={`#${region.id}`}
              className="rounded-[28px] border border-[#dce9e7] bg-white p-6 text-left shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-[#cde2df] hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
            >
              <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
                Région
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{region.label}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{region.intro}</p>
            </a>
          ))}
        </div>
      </Section>

      <section className="py-10 sm:py-14 lg:py-20">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_12px_30px_rgba(24,53,101,0.05)] lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Sommaire</p>
              <nav className="mt-5 space-y-3">
                {shortageJobs2026.map((region, index) => (
                  <a
                    key={region.id}
                    href={`#${region.id}`}
                    className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#607086] transition hover:border-[#d9e7f3] hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                  >
                    <span className="mr-2 text-[#57b7af]">{String(index + 1).padStart(2, "0")}</span>
                    {region.label}
                  </a>
                ))}
              </nav>
              <a
                href="#top"
                className="mt-6 inline-flex rounded-full border border-[#dce9e7] bg-[#f7fbfb] px-4 py-2 text-sm font-semibold text-[#1d3b8b] transition hover:text-[#57b7af]"
              >
                Retour en haut
              </a>
            </aside>

            <div className="space-y-10">
              {shortageJobs2026.map((region) => (
                <article key={region.id} id={region.id} className="scroll-mt-32">
                  {(() => {
                    const theme = regionThemes[region.id];
                    return (
                      <>
                  <div className="mb-6">
                    <p
                      className="inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ background: theme.badgeBg, color: theme.accent }}
                    >
                      Liste détaillée
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]" style={{ color: theme.accent }}>
                      {region.label}
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d6e83]">{region.intro}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <div className="rounded-2xl border px-4 py-3" style={{ borderColor: theme.border, background: theme.soft }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7b8f]">Familles</p>
                        <p className="mt-1 text-xl font-semibold" style={{ color: theme.accent }}>{region.groups.length}</p>
                      </div>
                      <div className="rounded-2xl border px-4 py-3" style={{ borderColor: theme.border, background: "#ffffff" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7b8f]">Métiers repris</p>
                        <p className="mt-1 text-xl font-semibold" style={{ color: theme.accent }}>
                          {region.groups.reduce((total, group) => total + group.jobs.length, 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {region.groups.map((group) => (
                      <article
                        key={group.title}
                        className="rounded-[30px] border bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7"
                        style={{ borderColor: theme.border }}
                      >
                        <h3 className="text-xl font-semibold tracking-tight" style={{ color: theme.accent }}>{group.title}</h3>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                          {group.jobs.map((job) => (
                            <li key={job} className="flex gap-3 text-sm leading-7 text-[#5d6e83]">
                              <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full" style={{ background: theme.accent }} />
                              <span>{job}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                      </>
                    );
                  })()}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Liens utiles pour aller plus loin"
        intro="Ces ressources publiques peuvent vous aider à consulter les informations régionales et à identifier des opportunités d’emploi en Belgique."
        kicker="Ressources"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {shortageUsefulLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[28px] border border-[#e5edf4] bg-white p-6 text-sm font-semibold text-[#1d3b8b] shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:border-[#cde2df] hover:text-[#57b7af]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Passez de la liste à l’action"
        text="Vous avez identifié un métier pertinent ? Déposez votre besoin de recrutement ou rendez votre profil visible pour entrer dans une logique de matching."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/travailleurs"
        secondaryLabel="Je rends mon profil visible"
      />
    </>
  );
}
