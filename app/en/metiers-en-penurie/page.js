import { CtaBanner, Hero, Section } from "../../../components/Sections";
import { shortageJobs2026 } from "../../../lib/shortageJobs2026";
import { translateGroupTitle, translateProfessionLabel, translateRegionLabel } from "../../../lib/professions";

export const metadata = {
  title: "Shortage occupations by region in Belgium | LEXPAT Connect",
  description:
    "Consult shortage occupations by region in Belgium: Brussels, Wallonia and Flanders. LEXPAT Connect regional database updated continuously."
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

const regionIntroMap = {
  bruxelles:
    "The Brussels list is published by Actiris. It is a useful operational reference point, even though it is not the only practical reading used in Brussels.",
  wallonie:
    "Wallonia publishes a direct and operational list, especially useful for field occupations, industry, healthcare and logistics.",
  flandre:
    "Flanders presents shortage occupations through functional families. It is particularly useful for technical, industrial and care profiles."
};

const groupTitleMap = {
  "Commerce, vente et grande distribution": "Retail, sales and large distribution",
  "Comptabilité, finance, assurances, droit et immobilier": "Accounting, finance, insurance, legal and real estate",
  "Construction et travaux publics": "Construction and public works",
  "Construction": "Construction",
  "Enseignement et formation": "Education and training",
  Horeca: "Hospitality",
  "Informatique et télécommunications": "IT and telecommunications",
  "Métiers administratifs": "Administrative roles",
  "Métiers techniques et de l’industrie": "Technical and industrial occupations",
  "Santé et action sociale": "Healthcare and social care",
  "Services à la personne, sécurité, nettoyage et recyclage": "Personal services, security, cleaning and recycling",
  "Transports et logistique": "Transport and logistics",
  "Liste régionale": "Regional list",
  "Conduite de véhicules et de machines": "Vehicle and machinery operation",
  "Entretien de véhicules et de machines": "Vehicle and machinery maintenance",
  "Installation, montage et entretien d’installations électriques, électroniques et sanitaires":
    "Installation and maintenance of electrical, electronic and sanitary systems",
  "Fonctions relatives aux soins": "Care functions",
  "Autres fonctions techniques et de construction": "Other technical and construction functions"
};

const regionCanonicalMap = {
  "Région de Bruxelles-Capitale": "Brussels-Capital Region",
  "Région wallonne": "Wallonia",
  "Région flamande": "Flanders"
};

function tRegionLabel(region) {
  return translateRegionLabel(regionCanonicalMap[region.label] || region.label, "en");
}

function tRegionIntro(region) {
  return regionIntroMap[region.id] || region.intro;
}

function tGroupTitle(title) {
  return groupTitleMap[title] || translateGroupTitle(title, "en");
}

export default function MetiersPageEn() {
  return (
    <>
      <Hero
        title={
          <>
            Shortage occupations in Belgium,
            <span className="block text-[#57b7af]">region by region</span>
          </>
        }
        description="Consult the occupations directly by Brussels, Wallonia and Flanders. LEXPAT Connect regional database updated continuously."
        primaryHref="#regional-list"
        primaryLabel="Browse occupations"
        secondaryHref="/en/base-de-profils"
        secondaryLabel="View candidates"
        stats={[
          { value: "3", label: "Regions" },
          { value: "2026", label: "Active database" },
          { value: "Live", label: "Continuous update" }
        ]}
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ On this page — navigation</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> on shortage occupations</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#bruxelles", title: "Brussels-Capital Region", desc: "Actiris shortage occupations list for the Brussels region." },
              { n: "02", href: "#wallonie", title: "Wallonia", desc: "Direct and operational list, focused on industry, healthcare and logistics." },
              { n: "03", href: "#flandre", title: "Flanders", desc: "Shortage occupations organised by functional families." },
            ].map(({ n, href, title, desc }) => (
              <a key={href} href={href} className="group flex items-start gap-4 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-4 shadow-sm transition hover:border-[#57b7af] hover:shadow-md">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-bold text-[#1d3b8b] transition group-hover:bg-[#57b7af] group-hover:text-white">{n}</span>
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
        title="Quick access by region"
        intro="Click a region to jump directly to the corresponding list."
        kicker="Navigation"
        muted
      >
        <div id="regional-list" className="flex flex-wrap gap-3">
          {shortageJobs2026.map((region) => {
            const style = regionStyles[region.id];
            return (
              <a
                key={region.id}
                href={`#${region.id}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${style.soft} ${style.border} ${style.text}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                {tRegionLabel(region)}
              </a>
            );
          })}
        </div>
      </Section>

      <Section
        title="Full list of shortage occupations"
        intro="A simple reading, region by region, without unnecessary detours."
        kicker="LEXPAT Connect reference"
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
                      {tRegionLabel(region)}
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E3A78] md:text-3xl">
                      {tRegionLabel(region)}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#607089]">{tRegionIntro(region)}</p>
                  </div>
                  <div className={`inline-flex rounded-2xl border px-4 py-3 text-sm font-semibold ${style.soft} ${style.border} ${style.text}`}>
                    {totalJobs} occupation{totalJobs > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {region.groups.map((group) => (
                    <section
                      key={`${region.id}-${group.title}`}
                      className={`rounded-[26px] border p-5 ${style.soft} ${style.border}`}
                    >
                      <h3 className="text-lg font-semibold text-[#1E3A78]">{tGroupTitle(group.title)}</h3>
                      <ul className="mt-4 space-y-3">
                        {group.jobs.map((job) => (
                          <li key={job} className="flex items-start gap-3 text-sm leading-6 text-[#334155]">
                            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                            <span>{translateProfessionLabel(job, "en")}</span>
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
        kicker="Employer need"
        title="Do you want to quickly check whether your role can support recruitment outside the EU?"
        text="LEXPAT Connect helps you qualify the hiring need first. The LEXPAT law firm then steps in on legal matters when necessary."
        primaryHref="/en/employeurs"
        primaryLabel="I am hiring"
        secondaryHref="/en/contact"
        secondaryLabel="Ask a question"
      />
    </>
  );
}
