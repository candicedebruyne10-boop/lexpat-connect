import { CtaBanner, Hero, Section } from "../../components/Sections";
import { shortageJobs2026 } from "../../lib/shortageJobs2026";

export const metadata = {
  title: "Professions en pénurie par région en Belgique | LEXPAT Connect",
  description:
    "Consultez rapidement les professions en pénurie classées par région en Belgique : Bruxelles, Wallonie et Flandre. Base LEXPAT Connect mise à jour en continu."
};

const regionStyles = {
  bruxelles: {
    soft: "bg-[#eef4ff]",
    border: "border-[rgba(23,58,138,0.18)]",
    text: "text-[#1E3A78]",
    dot: "bg-[#173A8A]"
  },
  wallonie: {
    soft: "bg-[#ecfaf8]",
    border: "border-[rgba(89,185,177,0.22)]",
    text: "text-[#57B7AF]",
    dot: "bg-[#57B7AF]"
  },
  flandre: {
    soft: "bg-[#eef1fb]",
    border: "border-[rgba(30,58,120,0.18)]",
    text: "text-[#204E97]",
    dot: "bg-[#204E97]"
  }
};

export default function MetiersPage() {
  return (
    <>
      <Hero
        title={
          <>
            Professions en pénurie en Belgique,
            <span className="block text-[#57b7af]">région par région</span>
          </>
        }
        description="Consultez directement les professions classées par Bruxelles, Wallonie et Flandre. Base LEXPAT Connect mise à jour en continu."
        primaryHref="#liste-regionale"
        primaryLabel="Consulter les métiers"
        secondaryHref="/base-de-profils"
        secondaryLabel="Voir les candidats"
stats={[
          { value: "3", label: "Régions" },
          { value: "2026", label: "Base active" },
          { value: "Maj", label: "Mise à jour continue" }
        ]}
      />

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">Sur cette page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les professions en pénurie<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> par région</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              📋 Base 2026
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#bruxelles", title: "Bruxelles-Capitale",  desc: "Les professions en pénurie reconnues par Actiris." },
              { n: "02", href: "#wallonie",  title: "Région wallonne",     desc: "Les professions en pénurie reconnues par le Forem." },
              { n: "03", href: "#flandre",   title: "Région flamande",     desc: "Les professions en pénurie reconnues par le VDAB." },
            ].map(({ n, href, title, desc }) => (
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

      <Section
        title="Accès rapide par région"
        intro="Cliquez sur une région pour aller directement à la liste correspondante."
        kicker="Navigation"
        muted
      >
        <div id="liste-regionale" className="flex flex-wrap gap-3">
          {shortageJobs2026.map((region) => {
            const style = regionStyles[region.id];
            return (
              <a
                key={region.id}
                href={`#${region.id}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${style.soft} ${style.border} ${style.text}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                {region.label}
              </a>
            );
          })}
        </div>
      </Section>

      <Section
        title="Liste complète des professions en pénurie"
        intro="Lecture simple, région par région, sans détour."
        kicker="Référence LEXPAT Connect"
      >
        <div className="space-y-8">
          {shortageJobs2026.map((region) => {
            const style = regionStyles[region.id];
            const totalJobs = region.groups.reduce((sum, group) => sum + group.jobs.length, 0);

            return (
              <article
                key={region.id}
                id={region.id}
                className={`scroll-mt-28 rounded-[32px] border bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.05)] md:p-8 ${style.border}`}
              >
                <div className="flex flex-col gap-4 border-b border-[#e8eef6] pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style.soft} ${style.border} ${style.text}`}>
                      {region.label}
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E3A78] md:text-3xl">
                      {region.label}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#607089]">{region.intro}</p>
                  </div>
                  <div className={`inline-flex rounded-2xl border px-4 py-3 text-sm font-semibold ${style.soft} ${style.border} ${style.text}`}>
                    {totalJobs} profession{totalJobs > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {region.groups.map((group) => (
                    <section
                      key={`${region.id}-${group.title}`}
                      className={`rounded-[26px] border p-5 ${style.soft} ${style.border}`}
                    >
                      <h3 className="text-lg font-semibold text-[#1E3A78]">{group.title}</h3>
                      <ul className="mt-4 space-y-3">
                        {group.jobs.map((job) => (
                          <li key={job} className="flex items-start gap-3 text-sm leading-6 text-[#334155]">
                            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                            <span>{job}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <CtaBanner
        kicker="Besoin employeur"
        title="Vous voulez vérifier rapidement si votre poste peut s’inscrire dans un recrutement hors UE ?"
        text="LEXPAT Connect vous aide à qualifier le besoin. Le cabinet LEXPAT intervient ensuite sur le juridique si nécessaire."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />
    </>
  );
}
