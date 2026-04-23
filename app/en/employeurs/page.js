import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps, TestimonialsStrip } from "../../../components/Sections";
import { getServiceClient } from "../../../lib/supabase/server";

// ── Point 5 : live count on EN page (was missing)
async function getLiveProfileCount() {
  try {
    const supabase = getServiceClient();
    const { count } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_visibility", "visible");
    return count ?? 0;
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Employers | LEXPAT Connect",
  description:
    "Find the qualified international profiles your team needs — available now for shortage occupations in Belgium. Fast, structured and legally secured."
};

// ── Point 8 : step 2 reworded — targeted matching, not "no unnecessary intermediary"
const employerSteps = [
  {
    title: "Access available profiles",
    text: "Browse profiles directly in your occupation, region and sector — right now."
  },
  {
    title: "Identify the right match and get in touch",
    text: "Filter candidates by sector, region and experience level. Contact those who match your need directly and efficiently."
  },
  {
    title: "LEXPAT secures the legal framework if needed",
    text: "Single permit, right to work, economic immigration: the law firm steps in only if your recruitment requires it."
  }
];

const employerBenefits = [
  {
    title: "Qualified profiles available right now",
    text: "Access a pool of international workers available in shortage occupations — without waiting."
  },
  {
    title: "Fast and legally secure recruitment",
    text: "From finding a profile to making the hire, every step is structured for speed and full legal security."
  },
  {
    title: "Legal relay when needed",
    text: "Single permit, work authorisation, salary compliance: the LEXPAT law firm steps in if your case requires it."
  }
];

const employerWhyValues = [
  {
    title: "Immediate access to qualified profiles",
    text: "Developers, technicians, healthcare, construction — profiles available today in shortage occupations."
  },
  {
    title: "Real time savings",
    text: "No CV database to sift through. Targeted, available profiles, ready to be contacted immediately."
  },
  {
    title: "Simplified international recruitment",
    text: "A guided process that structures your need and matches it to the right profiles, without administrative complexity."
  },
  {
    title: "Legally secured framework",
    text: "The LEXPAT law firm steps in if needed for the single permit and compliance — you recruit with full peace of mind."
  }
];

const employerPreview = [
  {
    title: "Company dashboard",
    text: "A dedicated view to monitor activity, submitted needs and next actions."
  },
  {
    title: "Employer profile",
    text: "A cleaner space to present your company, your criteria and your hiring context."
  },
  {
    title: "Offer tracking",
    text: "A base to centralize ongoing recruitments and profiles under review."
  }
];

// ── Point 6 : FAQ expanded from 3 to 6 questions
const employerFaq = [
  {
    question: "Who is the platform for?",
    answer: "Belgian employers who want to recruit international workers, especially in shortage occupations."
  },
  {
    question: "Can I use it if I have never recruited internationally before?",
    answer: "Yes. The platform is designed to structure a first hiring need in a clear, usable way — no legal expertise required."
  },
  {
    question: "Does the legal team step in immediately?",
    answer: "No. The priority is the match itself. The LEXPAT law firm only steps in later if a single permit or right-to-work issue appears."
  },
  {
    question: "How long does it take to fill a role through LEXPAT Connect?",
    answer: "Access to profiles is immediate. The actual timeline depends on the role, the chosen candidate and — if a single permit is required — the administrative processing that follows. The LEXPAT team gives you a realistic estimate from the first consultation."
  },
  {
    question: "Is my role eligible for international recruitment?",
    answer: "It depends on the region and the type of role. In Flanders in particular, only occupations listed on the official VDAB 2026 shortage lists are eligible for a single economic permit. Our eligibility simulator gives you an answer in under 3 minutes."
  },
  {
    question: "What happens if the selected candidate does not work out?",
    answer: "You are never committed simply by browsing or contacting a profile. If a recruitment does not proceed, you are free to search again. The law firm only becomes involved if a formal legal process has already begun."
  }
];

const employerFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: employerFaq.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default async function EmployeursPageEn() {
  // ── Point 5 : live count now fetched on EN page too
  const profileCount = await getLiveProfileCount();
  const countLabel = profileCount !== null
    ? `${profileCount} profile${profileCount !== 1 ? "s" : ""} available today.`
    : "Profiles available today.";

  return (
    <>
      <Script
        id="faq-employers-en-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employerFaqJsonLd) }}
      />

      {/* ── Point 1 : title recentred on employer outcome
          ── Point 2 : primary CTA harmonised → "See available profiles"
          ── Point 3 : badge with credibility signals */}
      <Hero
        badge="+10,000 cases handled · 30 years of expertise · Profiles available now"
        title={
          <>
            Finally find the qualified profiles
            <span className="block text-[#57b7af]">your team has been waiting for.</span>
          </>
        }
        description={`${countLabel} International workers in shortage occupations — recruit quickly and with full legal security.`}
        note="Developers · Technicians · Healthcare · Construction — browse profiles and hire today."
        primaryHref="/en/base-de-profils"
        primaryLabel="See available profiles"
        secondaryHref="/en/simulateur-eligibilite"
        secondaryLabel="Check eligibility"
      />

      {/* ── Available profiles block ── */}
      <div className="border-y border-[#e0edf5] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-[#f0f7ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d3b8b]">
                <span className="h-2 w-2 rounded-full bg-[#57b7af] animate-pulse" />
                Profiles already available
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">
                Recruit today — no waiting
              </h2>
              <p className="mt-2 text-sm text-[#607086]">
                Some profiles are available immediately in these sectors:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Developers", "Technicians", "Healthcare", "Construction"].map(cat => (
                  <span key={cat} className="rounded-full border border-[#d4e6f7] bg-[#f8fbff] px-4 py-1.5 text-sm font-semibold text-[#1d3b8b]">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            {/* ── Point 2 : harmonised CTA */}
            <Link
              href="/en/base-de-profils"
              className="flex-shrink-0 inline-flex h-13 items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: "#57b7af", boxShadow: "0 8px 24px rgba(87,183,175,0.30)" }}
            >
              See available profiles →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Table of contents ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ On this page — navigation</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                How to recruit quickly<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> via LEXPAT Connect</span>
              </h2>
              <p className="mt-2 text-xs text-[#8a9db8]">Click on any section below to jump directly ↓</p>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi",          title: "Why recruit here",                    desc: "Qualified profiles available now in shortage occupations." },
              { n: "02", href: "#comment-ca-marche",  title: "How it works",                        desc: "3 steps to access profiles and hire quickly." },
              { n: "03", href: "#espace-employeur",   title: "Employer space",                      desc: "Your dedicated interface to manage your recruitments." },
              { n: "04", href: "/en/employeurs/rejoindre", title: "Access profiles now",            desc: "Describe your need in 4 steps and contact candidates." },
              { n: "05", href: "#faq",                title: "Frequently asked questions",           desc: "Answers to the most common employer questions." },
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

      <div id="pourquoi">
      <Section
        title="Why recruit via LEXPAT Connect?"
        intro="Qualified profiles available now, a fast process and a legally secured framework."
        kicker="Employers"
      >
        <BulletList items={employerBenefits} />
        <div className="mt-8 rounded-[28px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Before recruiting outside the EU</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E3A78]">
            First check whether your role appears on a regional shortage occupations list
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6e83]">
            Our guide helps you understand the regional logic, the possible impact on the single permit and the most promising sectors.
          </p>
          <Link href="/en/metiers-en-penurie" className="mt-5 inline-flex text-sm font-semibold text-[#1E3A78] transition hover:text-[#57b7af]">
            Read the shortage occupations guide →
          </Link>
        </div>
      </Section>
      </div>

      <div id="comment-ca-marche">
      {/* ── Point 8 : step 2 reworded */}
      <Section
        title="How it works"
        intro="Three simple steps to access profiles, contact candidates and hire quickly."
        kicker="3 steps"
        muted
      >
        <Steps items={employerSteps} />
      </Section>
      </div>

      <Section
        title="Why employers use LEXPAT Connect"
        intro="Concrete reasons to recruit here rather than anywhere else."
        kicker="Added value"
      >
        <BulletList items={employerWhyValues} />
        {/* ── Point 2 : harmonised CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-[28px] border border-[#dce7ef] bg-[linear-gradient(180deg,#f0f7ff_0%,#eaf7f5_100%)] px-8 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-[#1E3A78]">Profiles available as of today.</p>
            <p className="mt-1 text-sm text-[#6b85a0]">Access profiles now and start recruiting immediately.</p>
          </div>
          <Link
            href="/en/base-de-profils"
            className="flex-shrink-0 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ background: "#57b7af", boxShadow: "0 8px 24px rgba(87,183,175,0.28)" }}
          >
            See available profiles →
          </Link>
        </div>
      </Section>

      {/* ── Point 10 : simulator — featured section ── */}
      <div className="bg-[linear-gradient(135deg,#1E3A78_0%,#163269_100%)]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#a8c4f0]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" />
                Free tool · 3 minutes · Instant result
              </p>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Is this recruitment possible?<br />
                <span className="text-[#57b7af]">The simulator answers in 3 minutes.</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#b8cef0]">
                Enter the region, the occupation and the candidate's nationality. The simulator cross-checks the official 2026 lists (Actiris, Forem, VDAB) and tells you: is it eligible, which procedure applies, what timeline to expect — before you start any process.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/en/simulateur-eligibilite"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(233,30,140,0.28)] transition hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #e91e8c, #c2177e)" }}
                >
                  Test feasibility now →
                </Link>
                <Link
                  href="/en/metiers-en-penurie"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  See eligible occupations
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:w-72">
              {[
                { icon: "✓", label: "Eligibility confirmed", sub: "Cross-referenced against official 2026 lists" },
                { icon: "⏱", label: "Procedure & timeline", sub: "Reduced market test, full exemption or blocked" },
                { icon: "→", label: "Next steps", sub: "Available profiles or legal guidance" },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 px-5 py-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#57b7af]/25 text-sm font-bold text-[#57b7af]">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-[12px] text-[#9ab5d8]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="espace-employeur">
      <Section
        title="The employer space"
        intro="Your dedicated interface to manage your recruitments, track your openings and contact profiles."
        kicker="Recruiter space"
        muted
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Company space</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">Manage all your recruitments in one place</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Dashboard, company information, open roles and opportunity tracking: everything is centralised so you can recruit faster.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/en/employeurs/espace" className="primary-button">
                View employer space
              </Link>
              {/* ── Point 2 : harmonised CTA */}
              <Link href="/en/base-de-profils" className="secondary-button">
                See available profiles
              </Link>
            </div>
          </div>
          <BulletList items={employerPreview} />
        </div>
      </Section>
      </div>

      <div id="formulaire">
      <Section
        title="Access profiles — in 4 steps"
        intro="Describe your need in a few minutes and contact available candidates directly."
        kicker="Recruit now"
        muted
      >
        <div className="rounded-[30px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)] overflow-hidden">
          {/* Steps preview */}
          <div className="grid gap-0 sm:grid-cols-4 border-b border-[#e5edf4]">
            {[
              { n: "01", label: "Your company", desc: "Name, contact, region" },
              { n: "02", label: "The position", desc: "Occupation, sector, contract" },
              { n: "03", label: "Expectations", desc: "Tasks & skills required" },
              { n: "04", label: "Submit", desc: "Review & send" },
            ].map(({ n, label, desc }, i) => (
              <div key={n} className={`flex items-start gap-3 px-6 py-5 ${i < 3 ? "border-b sm:border-b-0 sm:border-r" : ""} border-[#e5edf4]`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[11px] font-bold text-[#1d3b8b]">{n}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1E3A78]">{label}</p>
                  <p className="mt-0.5 text-xs text-[#8a9db8]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div className="flex flex-col items-center gap-4 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-base font-semibold text-[#1E3A78]">Profiles available as of today.</p>
              <p className="mt-1 text-sm text-[#6b85a0]">About 3 minutes — guided step by step, on any device.</p>
            </div>
            {/* ── Point 2 : harmonised CTA */}
            <Link
              href="/en/base-de-profils"
              className="flex-shrink-0 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: "#1E3A78", boxShadow: "0 8px 24px rgba(23,58,138,0.25)" }}
            >
              See available profiles →
            </Link>
          </div>
        </div>
      </Section>
      </div>

      <CtaBanner
        title="Recruit now — legal support follows if needed"
        text="Single permit, right to work, economic immigration: the LEXPAT law firm steps in only when your recruitment requires it. Start by accessing the profiles."
        primaryHref="/en/base-de-profils"
        primaryLabel="See available profiles"
        secondaryHref="/en/accompagnement-juridique"
        secondaryLabel="View legal support"
      />

      {/* ── Point 4 : social proof — cabinet testimonials ── */}
      <div className="border-t border-[#e5edf5]">
        <div className="mx-auto max-w-5xl px-6 pt-4 pb-0">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607086]">
            What our clients say about the LEXPAT law firm
          </p>
        </div>
        <TestimonialsStrip locale="en" />
      </div>

      {/* ── Regional & thematic pages ── */}
      <section className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
            Resources by city and topic
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Recruit in your region
          </h2>
          <p className="mt-2 text-sm text-[#607086]">
            Each page is tailored to the specific context of a city or topic — shortage occupations, legal framework and available profiles.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Liège", description: "Shortage occupations in Liège", href: "/en/employeurs/liege-metiers-en-penurie" },
              { label: "Antwerp", description: "Shortage occupations in Antwerp", href: "/en/employeurs/anvers-metiers-en-penurie" },
              { label: "Ghent", description: "Shortage occupations in Ghent", href: "/en/employeurs/gand-metiers-en-penurie" },
              { label: "Bruges", description: "Shortage occupations in Bruges", href: "/en/employeurs/bruges-metiers-en-penurie" },
              { label: "International recruitment", description: "6 in 10 companies already recruit internationally", href: "/en/recrutement-international" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col gap-2 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-5 shadow-sm transition hover:border-[#57b7af] hover:shadow-md"
              >
                <span className="text-sm font-bold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">
                  {p.label} →
                </span>
                <span className="text-xs leading-relaxed text-[#6b85a0]">{p.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="faq">
      {/* ── Point 6 : FAQ expanded */}
      <Section title="Frequently asked questions" kicker="FAQ">
        <Faq items={employerFaq} />
      </Section>
      </div>
    </>
  );
}
