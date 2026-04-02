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
    text: "text-[#173A8A]",
    dot: "bg-[#173A8A]"
  },
  wallonie: {
    soft: "bg-[#ecfaf8]",
    border: "border-[rgba(89,185,177,0.22)]",
    text: "text-[#2f9f97]",
    dot: "bg-[#59B9B1]"
  },
  flandre: {
    soft: "bg-[#f3efff]",
    border: "border-[rgba(98,84,183,0.18)]",
    text: "text-[#6254B7]",
    dot: "bg-[#6254B7]"
  }
};

export default function MetiersPage() {
  return (
    <>
      <Hero
        badge="Base régionale 2026"
        title={
          <>
            Professions en pénurie en Belgique,
            <span className="block text-[#57b7af]">région par région</span>
          </>
        }
        description="Consultez directement les professions classées par Bruxelles, Wallonie et Flandre. Base LEXPAT Connect mise à jour en continu."
        primaryHref="#liste-regionale"
        primaryLabel="Voir la liste"
        secondaryHref="/employeurs"
        secondaryLabel="Parler de mon recrutement"
        note="Cette page présente strictement les professions reprises dans votre base régionale LEXPAT Connect, organisée pour une lecture rapide côté employeur."
        stats={[
          { value: "3", label: "Régions" },
          { value: "2026", label: "Base active" },
          { value: "Maj", label: "Mise à jour continue" }
        ]}
      />

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
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#15306f] md:text-3xl">
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
                      <h3 className="text-lg font-semibold text-[#173A8A]">{group.title}</h3>
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
        primaryLabel="Parler de mon besoin"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />
    </>
  );
}
