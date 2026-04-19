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
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ On this page — navigation</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> on the platform</span>
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
              { n: "07", href: "/en/permis-unique", title: "The single permit", desc: "Rights and obligations of employers and foreign workers in Belgium." },
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

      <TestimonialsStrip locale="en" />
      <CtaBannerDark
        locale="en"
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />
    </>
  );
}
