import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  PresentationVideoSection,
  JobSectors,
  LexpatStrip,
  TestimonialsStrip,
  CtaBannerDark,
  MatchingPreview
} from "../../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Targeted matching for Belgian employers and international workers",
  description:
    "A targeted matching platform connecting Belgian employers with qualified international workers in shortage occupations. Secure recruitment, legal relay if needed."
};

export default function HomePageEn() {
  return (
    <>
      <HeroPremium
        locale="en"
        primaryHref="/en/base-de-profils"
        secondaryHref="/en/simulateur-eligibilite"
      />

      {/* ── Available profiles banner ───────────────────────────────── */}
      <div className="bg-[#1a3268]">
        <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-baseline gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#57b7af] animate-pulse self-center shrink-0" />
            <span className="text-5xl font-black text-white tracking-tight">19</span>
            <span className="text-xl font-semibold text-white/90">profiles available today</span>
          </div>
          <p className="text-[#9dd4d0] text-sm font-medium tracking-wide">
            Developers · Technicians · Healthcare · Construction
          </p>
          <a
            href="/en/base-de-profils"
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-[#57b7af] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#3fa099] hover:shadow-[0_6px_20px_rgba(87,183,175,0.45)] w-full sm:w-auto justify-center"
          >
            See available profiles →
          </a>
          <p className="text-white/35 text-[11px] font-semibold uppercase tracking-[0.18em]">
            Available for <span className="text-[#57b7af]/70">Belgium</span>
          </p>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ On this page — navigation</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> on this page</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#acces", title: "Employers & workers", desc: "Two distinct portals depending on your profile and need." },
              { n: "02", href: "#metiers-en-penurie", title: "Shortage occupations", desc: "Quick access to regional lists by sector." },
              { n: "03", href: "#comment-ca-marche", title: "How it works", desc: "How the platform works in a few clear steps." },
              { n: "04", href: "#mise-en-relation", title: "The matching platform", desc: "How employers and workers get in touch." },
              { n: "05", href: "#secteurs", title: "Sectors covered", desc: "The fields of activity present on LEXPAT Connect." },
              { n: "06", href: "#lexpat", title: "The LEXPAT law firm", desc: "Legal relay available if the case requires it." },
              { n: "07", href: "#permis-unique", title: "Rights and obligations of employers and workers", desc: "What the single permit concretely implies for each party." },
              { n: "08", href: "#equivalence-diplome", title: "Diploma recognition", desc: "When is it required and how to apply for equivalence in Belgium?" },
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

      <div id="acces">
        <DualEntry locale="en" />
      </div>

      <div id="metiers-en-penurie">
        <ShortageJobsQuickLink locale="en" />
      </div>

      <div id="comment-ca-marche">
        <HowItWorksPremium locale="en" />
      </div>

      <div id="mise-en-relation">
        <MatchingPreview locale="en" />
      </div>

      <PresentationVideoSection locale="en" />

      <div id="secteurs">
        <JobSectors locale="en" />
      </div>

      <div id="lexpat">
        <LexpatStrip locale="en" />
      </div>

      {/* ── Diploma equivalence section ─────────────────────────────── */}
      <div id="equivalence-diplome" className="bg-[#f7f9fb] border-t border-[#e3edf8]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#cde2df] bg-[#eaf7f5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2f9f97]">🎓 Diplomas & recognition</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Diploma equivalence:<br className="hidden sm:block" />
            <span className="text-[#57b7af]"> what you need to know before applying</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            Whether diploma equivalence is required depends on the role you are applying for and your country of origin. If you studied abroad, you must in principle request equivalence. The procedure is easier when the diploma was obtained in a country of the European Economic Area.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Public sector / regulated professions */}
            <div className="rounded-2xl border border-[#c5d4f3] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d3b8b] text-white text-base">🏛</span>
                <h3 className="text-[15px] font-bold text-[#1d3b8b]">Public sector & regulated professions</h3>
              </div>
              <p className="text-[13.5px] leading-6 text-[#4a6b99] mb-3">
                Diploma equivalence is <strong className="text-[#1d3b8b]">mandatory</strong> if you wish to work in the public sector or practise a regulated profession.
              </p>
              <div className="rounded-xl bg-[#f0f4fd] p-3 mb-3">
                <p className="text-[12px] font-semibold text-[#1d3b8b] mb-1">Professions concerned (examples)</p>
                <p className="text-[12px] leading-5 text-[#4a6b99]">Nurse, pharmacist, architect, teacher, mechanic…</p>
              </div>
              <p className="text-[12px] leading-5 text-[#607086]">
                Equivalence also ensures you are paid according to the <strong>legal pay scales</strong> applicable to your level of education.
              </p>
            </div>

            {/* Private sector */}
            <div className="rounded-2xl border border-[#cde2df] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#57b7af] text-white text-base">🏢</span>
                <h3 className="text-[15px] font-bold text-[#2f9f97]">Private sector and non-regulated professions</h3>
              </div>
              <p className="text-[13.5px] leading-6 text-[#4a6b99] mb-3">
                Equivalence is <strong className="text-[#2f9f97]">not required</strong>. Your employer can hire you on the basis of your foreign diploma, without an equivalence certificate.
              </p>
              <div className="rounded-xl border border-[#cde2df] bg-[#f0faf9] p-3">
                <p className="text-[12px] font-semibold text-[#2f9f97] mb-1">Non-EU worker & single permit</p>
                <p className="text-[12px] leading-5 text-[#4a6b99]">
                  A non-EU worker without legal residence in Belgium must obtain a single permit. For this application, it is <strong>not necessary</strong> to provide a diploma equivalence certificate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/en/accompagnement-juridique" className="inline-flex items-center gap-2 rounded-full bg-[#57b7af] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3fa099]">
              Get support →
            </a>
            <a href="/en/permis-unique" className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#1d3b8b]">
              Learn more about the single permit
            </a>
          </div>
        </div>
      </div>

      <TestimonialsStrip locale="en" />

      {/* ── Single permit section ───────────────────────────────────── */}
      <div id="permis-unique" className="bg-white border-t border-[#e3edf8]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* Header */}
          <p className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-[#eef1fb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E3A78]">⚖ Legal framework</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Single permit:<br className="hidden sm:block" />
            <span className="text-[#57b7af]"> rights and obligations of employers and workers</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            An employer wishing to hire a non-EU foreign worker must, in principle, apply for a single permit before the employment begins. If the candidate already lives and works in Belgium, the employer must first check whether they are exempt from the single permit requirement — in which case hiring can take place immediately.
          </p>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            When a single permit is required, the application follows two steps: first with the competent region (where the worker will be employed), then with the Immigration Office of the Ministry of the Interior. Once the permit is issued — and after obtaining a type D visa for candidates living outside Belgium — the employment can begin.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Employer obligations */}
            <div className="rounded-2xl border border-[#c5d4f3] bg-[#f5f7fd] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d3b8b] text-white">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </span>
                <h3 className="text-[15px] font-bold text-[#1d3b8b]">Employer obligations</h3>
              </div>
              <ul className="space-y-3 text-[13.5px] leading-6 text-[#4a6b99]">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Apply for a <strong className="text-[#1d3b8b]">new work authorisation</strong> if the workplace changes.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Ensure the salary corresponds to the applicable <strong className="text-[#1d3b8b]">sectoral pay scales</strong> for the role and category under which the permit was applied for.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Notify the competent authority of any <strong className="text-[#1d3b8b]">contract termination</strong> or significant change in working conditions affecting the validity of the work authorisation.</span></li>
              </ul>
              <p className="mt-4 rounded-xl border border-[#dce6f9] bg-white p-3 text-[12px] leading-5 text-[#607086]">
                <strong>Note:</strong> if the employer does not notify the region of the contract termination, the work authorisation is not withdrawn. The former worker retains the single permit until it expires. After notification, the worker has in principle three months to find a new employer and may, under certain conditions, claim unemployment benefits.
              </p>
            </div>

            {/* Worker rights */}
            <div className="rounded-2xl border border-[#cde2df] bg-[#f0faf9] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#57b7af] text-white">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M5 10l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3 className="text-[15px] font-bold text-[#2f9f97]">Worker rights</h3>
              </div>
              <ul className="space-y-3 text-[13.5px] leading-6 text-[#4a6b99]">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>The worker may work <strong className="text-[#2f9f97]">only for the employer</strong> who applied for the single permit on their behalf.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>After several years, they may apply for an <strong className="text-[#2f9f97]">unlimited-duration single permit</strong> (card A — "labour market: unlimited"), allowing them to change employer freely without a new application.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>When moving within Belgium, the worker must notify the municipality of the new address. Upon <strong className="text-[#2f9f97]">leaving Belgium permanently</strong>, they must deregister from the municipality.</span></li>
              </ul>
              <p className="mt-4 rounded-xl border border-[#cde2df] bg-white p-3 text-[12px] leading-5 text-[#607086]">
                <strong>Note:</strong> the unlimited single permit is convenient for an employer recruiting an existing holder, but may weaken worker retention. Eligibility conditions vary by region.
              </p>
            </div>
          </div>

          {/* Walloon region specificity */}
          <div className="mt-6 rounded-2xl border border-[#f0c97a] bg-[#fffbf0] p-5">
            <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#b07d1a]">⚠ Specificity — Walloon Region</p>
            <p className="text-[13.5px] leading-6 text-[#5a4a1a]">
              In Wallonia, certain single permit applications require the employment contract to be adapted with <strong>specific mandatory clauses</strong>. These may include health insurance coverage and, in some cases, the worker's return costs. These requirements vary depending on the profile and type of authorisation, and do not apply to all categories. A prior review helps avoid refusals or processing delays.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/en/permis-unique" className="inline-flex items-center gap-2 rounded-full bg-[#1d3b8b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16307a]">
              Learn more about the single permit →
            </a>
            <a href="/en/accompagnement-juridique" className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#1d3b8b]">
              LEXPAT legal support
            </a>
          </div>
        </div>
      </div>

      <CtaBannerDark
        locale="en"
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />
    </>
  );
}
