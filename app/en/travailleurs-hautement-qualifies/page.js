import Link from "next/link";
import { Section, Faq } from "../../../components/Sections";

export const metadata = {
  title: "Highly qualified workers in Belgium | LEXPAT Connect",
  description:
    "A simplified path into the Belgian labour market for highly qualified profiles: regional conditions, EU Blue Card, benefits and process."
};

const regionCards = [
  {
    region: "Brussels-Capital Region",
    color: "#1d3b8b",
    bg: "#eef5ff",
    border: "#c5d8f5",
    conditions: [
      { label: "Qualification", value: "A higher education degree that is relevant to the role" },
      { label: "Minimum salary", value: "EUR 3,703.44 gross/month (78% of the average salary) — as of 1 January 2025" }
    ]
  },
  {
    region: "Flemish Region",
    color: "#2b6f3e",
    bg: "#eef9f2",
    border: "#b8e4c6",
    conditions: [
      { label: "Qualification", value: "A higher education degree, OR 3 years of experience over the last 7 years, OR IT manager/specialist profile (level 6)" },
      { label: "Minimum salary", value: "EUR 50,310/year (EUR 53,220 in 2026) — reduced to 80% for workers under 30, nurses and teachers" }
    ]
  },
  {
    region: "Walloon Region",
    color: "#7c3a1e",
    bg: "#fff7f3",
    border: "#f5cdb8",
    conditions: [
      { label: "Qualification", value: "A higher education degree (3 years or level 5)" },
      { label: "Minimum salary", value: "At least EUR 48,912 gross/year for 2025" }
    ]
  }
];

const advantages = [
  {
    icon: "⏳",
    title: "Permits of up to 3 years",
    text: "Unlike the standard rule (maximum 1 year), highly qualified workers and EU Blue Card holders may obtain permits valid for up to 3 years, within the duration of the employment contract."
  },
  {
    icon: "🔄",
    title: "Simplified mobility",
    text: "In Wallonia, an additional activity with another employer may be allowed without an explicit work authorisation. For EU Blue Card holders in Wallonia and Brussels, a change of employer after 12 months can be handled by simple notification."
  },
  {
    icon: "✅",
    title: "No labour market test",
    text: "The employer does not need to prove that no local candidate was available. The process is therefore faster and less burdensome than for a standard foreign profile."
  }
];

const faqItems = [
  {
    question: "Can an employer hire a foreign national without applying for a work permit?",
    answer: "Yes. Some foreign nationals have a direct right to work and their residence card explicitly states that they have unlimited access to the labour market. This includes EU citizens, recognised refugees, certain family reunification beneficiaries and students, subject to the limits that apply to their status. The employer must still verify the residence document and complete the required employment declarations."
  },
  {
    question: "What is the Single Permit and who must apply for it?",
    answer: "The Single Permit combines the residence authorisation handled at federal level and the work authorisation handled by the Regions into one process. It is always the employer, or a duly appointed representative, who files the online application through the singlepermit platform on behalf of the candidate."
  },
  {
    question: "Does the candidate have to be abroad when the application is filed?",
    answer: "Not necessarily. The candidate may either be in their country of origin or already in Belgium with a valid residence right, such as a short-stay visa or an A card. Temporary or precarious residence documents generally do not allow the process to be started from within Belgium."
  },
  {
    question: "Does the employer always have to prove that no local candidate is available?",
    answer: "As a rule, yes. But highly qualified workers are fully exempt from the labour market test. The same exemption also applies to several specific categories such as management staff, professional athletes, researchers and performing artists."
  },
  {
    question: "What is the minimum salary for a Single Permit hire?",
    answer: "The salary must always at least match the guaranteed average minimum monthly income, including for part-time work. For categories that are exempt from the labour market test, much higher salary thresholds apply depending on the Region, as shown in the regional conditions above."
  },
  {
    question: "How long can a Single Permit remain valid?",
    answer: "In principle, its duration follows the employment contract, with a standard maximum of one year. That cap can extend to three years for highly qualified staff, EU Blue Card holders, management staff and intra-corporate transferees."
  },
  {
    question: "Can a worker under a Single Permit change employer or take on an additional activity?",
    answer: "As a rule, labour market access remains tied to one employer and one authorised role. That said, Wallonia allows certain highly qualified profiles to perform an additional activity. For EU Blue Card holders, a change of employer after 12 months can be handled through notification in Wallonia and Brussels."
  },
  {
    question: "What must the employer do when the employment contract ends?",
    answer: "The employer must formally notify the competent regional authority that the employment has ended. In principle, the worker's residence right remains valid for 90 days after the work authorisation ends, unless a withdrawal decision is issued."
  },
  {
    question: "What happens if the card expires while a renewal is still under review?",
    answer: "The employer should file the renewal application no later than two months before expiry. If the permit expires while the application is being processed but the file has already been declared admissible, the commune may issue a temporary Annex 49. In practice, the Regions accept it to allow work to continue during the review."
  },
  {
    question: "How can a worker obtain unlimited access to the labour market?",
    answer: "After several years of work under a limited authorisation, the worker may apply personally for unlimited access to employment with the Region of residence. Once granted, access to the labour market no longer depends on a specific employer."
  }
];

export default function HighlyQualifiedWorkersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#060c26_0%,#0e1f5c_50%,#0e2a4a_100%)] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_70%_50%,rgba(89,185,177,0.12),transparent_70%)]" />
        <div className="container-shell relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9dd4d0]">
              <Link href="/en/permis-unique" className="transition hover:text-white">Single permit</Link>
              <span className="text-white/30">›</span>
              <span>Highly qualified workers</span>
            </div>
            <h1 className="mt-8 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-white">
              Highly qualified<br />
              <span className="text-[#5ec9c1]">workers</span> in Belgium
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              A simplified path into the Belgian labour market, without a labour market test for the employer, but still subject to strict qualification and salary conditions that vary between the three Regions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["No labour market test", "Permits up to 3 years", "EU Blue Card"].map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.07] px-3.5 py-1.5 text-xs font-semibold text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">On this page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> on highly qualified workers</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~5 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#principe", title: "A simpler route, stricter conditions", desc: "No labour market test, but strict qualification and salary thresholds." },
              { n: "02", href: "#regions", title: "Regional thresholds", desc: "The conditions vary between Brussels, Flanders and Wallonia." },
              { n: "03", href: "#carte-bleue", title: "The EU Blue Card", desc: "A comparable status with higher thresholds and easier employer mobility." },
              { n: "04", href: "#avantages", title: "What this status changes in practice", desc: "Longer permits, simplified mobility and no local search requirement." },
              { n: "05", href: "#procedure", title: "How it works", desc: "Three steps: the employer files, the candidate must have a valid status." },
              { n: "06", href: "#faq", title: "Frequently asked questions", desc: "The most common questions from employers and candidates." },
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

      <div id="principe">
      <Section kicker="Overview" title="A simpler route, but stricter conditions">
        <div className="prose-lexpat max-w-3xl">
          <p className="text-base leading-8 text-[#4a5b6e]">
            Highly qualified workers benefit from a simplified entry route into the Belgian labour market. Their future employer still needs to file a Single Permit application, but is <strong className="text-[#1d3b8b]">fully exempt from the labour market test</strong>. In other words, the employer does not have to prove that no suitable local candidate was available.
          </p>
          <p className="mt-5 text-base leading-8 text-[#4a5b6e]">
            In return, both the candidate and the employer must comply with strict qualification and minimum salary requirements, which <strong className="text-[#1d3b8b]">vary from one Region to another</strong>.
          </p>
        </div>
      </Section>
      </div>

      <div id="regions">
      <Section kicker="Conditions" title="Regional thresholds" muted>
        <div className="grid gap-6 md:grid-cols-3">
          {regionCards.map((card) => (
            <div
              key={card.region}
              className="rounded-[28px] border p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: card.color }}>
                {card.region}
              </p>
              <div className="mt-5 space-y-4">
                {card.conditions.map((condition) => (
                  <div key={condition.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8094a8]">{condition.label}</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-[#2a3b4e]">{condition.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      </div>

      <div id="carte-bleue">
      <Section kicker="Alternative" title="The EU Blue Card">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-base leading-8 text-[#4a5b6e]">
              The EU Blue Card is a comparable status aimed at the same type of profile: graduates, experienced professionals and certain IT experts. It follows the same overall process as the Single Permit, but with <strong className="text-[#1d3b8b]">higher salary thresholds</strong> than those applied to standard highly qualified workers.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4a5b6e]">
              In exchange, it offers specific mobility benefits. After 12 months of employment, a change of employer may be handled by <strong className="text-[#1d3b8b]">simple notification</strong> in Wallonia and Brussels, without restarting a full application from scratch.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dce9e7] bg-[linear-gradient(135deg,#f5fbfb,#eef7ff)] p-7 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#57b7af]">At a glance</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#3a4f63]">
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Same target profile as the highly qualified route</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Higher salary threshold but easier mobility</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Validity of up to 3 years</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Change of employer through notification after 12 months</li>
            </ul>
          </div>
        </div>
      </Section>
      </div>

      <div id="avantages">
      <Section kicker="Benefits" title="What this status changes in practice" muted>
        <div className="grid gap-6 md:grid-cols-3">
          {advantages.map((advantage) => (
            <div key={advantage.title} className="rounded-[28px] border border-[#e4edf4] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <span className="text-3xl">{advantage.icon}</span>
              <p className="mt-4 text-base font-semibold text-[#17345d]">{advantage.title}</p>
              <p className="mt-2 text-sm leading-7 text-[#5d7080]">{advantage.text}</p>
            </div>
          ))}
        </div>
      </Section>
      </div>

      <div id="procedure">
      <Section kicker="Process" title="How it works">
        <div className="max-w-2xl space-y-5">
          {[
            {
              n: "1",
              title: "The employer initiates the process",
              text: "It is always the employer, or a duly appointed representative, who files the Single Permit application online on behalf of the candidate."
            },
            {
              n: "2",
              title: "The candidate must have a regular status",
              text: "At the time of filing, the worker must either still be in the country of origin or already have a valid residence right in Belgium. Temporary residence documents are usually not sufficient."
            },
            {
              n: "3",
              title: "Approval leads to a dual authorisation",
              text: "Once approved, the Single Permit covers both residence and work. The candidate may then come to Belgium and start employment."
            }
          ].map((step) => (
            <div key={step.n} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d3b8b,#57b7af)] text-sm font-bold text-white">
                {step.n}
              </span>
              <div className="pt-1.5">
                <p className="font-semibold text-[#17345d]">{step.title}</p>
                <p className="mt-1.5 text-sm leading-7 text-[#5d7080]">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      </div>

      <div id="faq">
      <Faq items={faqItems} />
      </div>

      <section className="border-t border-[#edf1f5] bg-white py-16">
        <div className="container-shell">
          <div className="rounded-[32px] border border-[#dce9e7] bg-[linear-gradient(160deg,#f5fbfb,#eef5ff)] p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#57b7af]">Next step</p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#17345d] sm:text-3xl">
              Does your profile fit this route?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5d7080]">
              Submit your profile on LEXPAT Connect to be introduced to Belgian employers looking specifically for this type of profile.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/en/travailleurs" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#57b7af,#2b8f88)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(87,183,175,0.35)] transition hover:-translate-y-px">
                Submit my profile
              </Link>
              <Link href="/en/permis-unique" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl border border-[#d5e5f0] bg-white px-8 py-3.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#b8cfe0]">
                Back to the Single Permit guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
