import SimulateurEligibilite from "../../../components/SimulateurEligibilite";

export const metadata = {
  title: "Single permit eligibility simulator 2026 | LEXPAT Connect",
  description:
    "Check in 4 steps whether your role is still eligible for a single permit procedure in Belgium. Instant result based on the official Actiris, Forem and VDAB 2026 lists.",
  keywords: [
    "Belgium single permit simulator 2026",
    "single permit eligibility",
    "shortage occupations Belgium",
    "non-EU recruitment Belgium",
    "labour market test Belgium",
  ],
  openGraph: {
    title: "Single permit eligibility simulator 2026 — LEXPAT Connect",
    description:
      "Is my role still eligible in 2026? Test it in 4 steps with the official shortage occupation lists.",
    url: "https://lexpat-connect.be/en/simulateur-eligibilite",
    type: "website",
  },
};

export default function SimulateurPageEn() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="bg-[#1E3A78] px-4 pb-10 pt-14 text-center text-white">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#3a5899]/60 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#a8c4f0]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" />
          Free tool · Instant result · Based on official 2026 lists
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Can I recruit internationally for this role?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#c5d4f3]">
          This simulator checks in 3 minutes whether your role appears on Belgium's official shortage occupation lists — and tells you which permit procedure applies, the expected timeline and the conditions to meet.
        </p>

        {/* What you get */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            {
              icon: "✓",
              title: "Eligibility confirmed",
              text: "Your role is cross-referenced against the Actiris, Forem and VDAB 2026 lists — with the candidate's qualification level.",
            },
            {
              icon: "⏱",
              title: "Procedure & timeline",
              text: "Reduced market test, full exemption or blocked: you know exactly what to expect before you start.",
            },
            {
              icon: "→",
              title: "Next steps",
              text: "Based on your result, you go directly to available profiles or to the appropriate legal guidance.",
            },
          ].map(({ icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/8 p-5"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#57b7af]/20 text-sm font-bold text-[#57b7af]">
                {icon}
              </span>
              <p className="mt-3 text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-[13px] leading-6 text-[#b8cef0]">{text}</p>
            </div>
          ))}
        </div>

        {/* For whom? */}
        <p className="mt-8 text-[13px] text-[#8aa8d8]">
          For <strong className="text-white">Belgian employers</strong> looking to recruit outside the EU · and <strong className="text-white">international workers</strong> who want to know their chances
        </p>
      </div>

      {/* ── Separator ── */}
      <div className="border-b border-[#e5edf5] bg-[#f8fbff] px-4 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4a6b99]">
          Complete the 4 steps below · No registration required
        </p>
      </div>

      <SimulateurEligibilite locale="en" />

      {/* ── Conversion block post-simulator ── */}
      <div className="bg-[linear-gradient(135deg,#eef1fb_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#cde2df] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" />
            Concrete results
          </p>
          <h2 className="mt-4 text-2xl font-bold text-[#1d3b8b]">Profiles already match your need</h2>
          <p className="mt-3 text-[15px] leading-7 text-[#607086]">
            Qualified international workers are available on the platform — in shortage sectors across Belgium. Access them directly or create an account to get matched.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="/en/base-de-profils" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1d3b8b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#16307a]">
              See compatible profiles →
            </a>
            <a href="/en/inscription" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c5d4f3] bg-white px-7 py-3.5 text-sm font-bold text-[#1d3b8b] transition hover:border-[#1d3b8b] hover:shadow-sm">
              Create an account to access talent
            </a>
          </div>
          <p className="mt-5 text-xs text-[#8a9bb0]">Free access · No commitment · Instant results</p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1E3A78]">
          Roles still eligible for a Belgian single permit in 2026
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#607086]">
          Each year, the three Belgian regions publish their official shortage
          occupation lists: Actiris for Brussels-Capital, Le Forem for Wallonia,
          and the VDAB for Flanders. A role appearing on one of these lists may
          benefit from a faster single permit procedure, with a lighter or fully
          removed labour market test depending on the region.
        </p>
        <p className="mt-4 text-sm leading-7 text-[#607086]">
          In 2026, the most represented sectors remain construction, healthcare,
          IT, transport and logistics, as well as several technical industrial
          roles. The simulator above helps Belgian employers quickly assess
          whether their recruitment may fit within that more favourable framework.
        </p>
      </section>
    </>
  );
}
