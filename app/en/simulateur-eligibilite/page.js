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
      <div className="bg-[#1E3A78] px-4 py-14 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-[#a8c4f0]">
          Free legal tool · Instant result
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Is my role still eligible in 2026?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#c5d4f3]">
          Single permit eligibility simulator — based on the official Actiris,
          Forem and VDAB 2026 lists.
        </p>
      </div>

      <SimulateurEligibilite locale="en" />

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
