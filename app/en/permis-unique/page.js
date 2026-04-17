import Script from "next/script";
import Link from "next/link";
import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";
import MemberLockedPermitContent from "../../../components/MemberLockedPermitContent";

export const metadata = {
  title: "Single permit in Belgium: a simple employer guide | LEXPAT Connect",
  description:
    "Understand the Belgian single permit in plain language: who it applies to, who decides, what it changes for employers and when legal support matters."
};

const basicCards = [
  {
    title: "What is the single permit for?",
    text: "It allows a non-EU national to live and work in Belgium as an employee."
  },
  {
    title: "Who usually needs it?",
    text: "Most often, a non-EU employee coming to work in Belgium when no other existing right to work already applies."
  },
  {
    title: "It does not apply to everyone",
    text: "Some people may already be allowed to work because of their nationality, residence status or a specific legal situation."
  }
];

const landscapeCards = [
  {
    title: "European Union",
    text: "It sets the overall framework."
  },
  {
    title: "Federal State",
    text: "It handles the residence side."
  },
  {
    title: "Regions",
    text: "They handle the work authorization side."
  }
];

const accessCategories = [
  {
    kicker: "Immediate access to work",
    title: "The candidate may already be allowed to work in Belgium",
    text: "The right to work already exists. The main issue is therefore to verify the status or the residence document correctly.",
    points: [
      "The key issue is to read the residence document correctly",
      "Not every status gives the same level of access to work",
      "The full breakdown is reserved to members"
    ],
    href: "#acces-direct",
    tone: "blue"
  },
  {
    kicker: "Recruitment may be facilitated",
    title: "The case may be easier to support",
    text: "The file can move more easily because the profile or category reduces the weight of the labour market test.",
    points: [
      "Typical examples: highly qualified workers, management, researchers, intra-group transfers",
      "The region, salary and level of the candidate still matter",
      "The full breakdown is reserved to members"
    ],
    href: "#acces-facilite",
    tone: "green"
  },
  {
    kicker: "Prior labour market assessment",
    title: "The employer must justify the difficulty of hiring locally",
    text: "Here, the employer must show that the role could not reasonably be filled on the Belgian or regional market.",
    points: [
      "This is neither an immediate-access case nor a facilitated category",
      "The approach differs between Brussels, Wallonia and Flanders",
      "The full breakdown is reserved to members"
    ],
    href: "#analyse-marche-emploi",
    tone: "dark"
  }
];

const employerPoints = [
  {
    title: "Check before the employee starts",
    text: "The right of residence and the right to work must be verified before the person starts working."
  },
  {
    title: "Do not confuse speed with safety",
    text: "Urgency never removes the need to choose the right procedure and the right region."
  },
  {
    title: "Sanctions remain a real risk",
    text: "Employing someone without a valid legal basis can trigger administrative, social and criminal consequences."
  }
];

const permitSteps = [
  {
    title: "Check the role and the competent region",
    text: "Start with the place of work, the function, the salary and the candidate’s profile."
  },
  {
    title: "Build the file",
    text: "Employer and candidate gather the relevant supporting documents."
  },
  {
    title: "Submit and follow the procedure",
    text: "The Region handles the work authorization; the Immigration Office handles the residence side."
  }
];

const permitFaq = [
  {
    question: "Who is competent to authorize a foreign national to work in Belgium?",
    answer:
      "Competence is shared. The federal level handles residence for foreign nationals and also the right to work for people whose residence is not based on employment. The Regions are competent for the right to work of people who stay in Belgium for professional reasons."
  },
  {
    question: "Can some foreign nationals work without any prior step from the employer?",
    answer:
      "Yes. Some profiles already benefit from a right to work. In those cases, the employer does not need to file a prior application. In practice, the residence document or status already shows that access to the labour market is unlimited."
  },
  {
    question: "What are the rules for foreign students who work?",
    answer:
      "Students with a valid residence document can work, but within a limited framework. In practice, they can usually work up to 20 hours per week during the academic year. During school holidays, the practical limits are different."
  },
  {
    question: "What is the single permit?",
    answer:
      "The single permit is a procedure that combines, within the same file, the authorization to stay and the authorization to work in Belgium for a non-EU employee."
  },
  {
    question: "Who files the single permit application?",
    answer:
      "The employer, or its representative, files the application for the future worker. The procedure is made online through the national single permit platform."
  },
  {
    question: "Must the employer always prove that no local worker is available?",
    answer:
      "No. That is the basic logic, but many situations exempt the employer from proving a prior local search. This is notably true for some specific categories or qualified profiles."
  },
  {
    question: "What is the minimum salary to hire a foreign worker under a single permit?",
    answer:
      "The remuneration must at least reach the guaranteed average minimum monthly income, including part-time work. For certain categories, such as highly qualified workers, much higher legal thresholds also apply."
  },
  {
    question: "How long is a limited work authorization valid?",
    answer:
      "As a general rule, the authorization follows the duration of the contract with a maximum of one year. Some categories can go up to three years, notably highly qualified workers, some EU Blue Card cases, management profiles and certain intra-group transfers."
  },
  {
    question: "What happens when the employment contract ends?",
    answer:
      "The employer must notify the competent regional authority that the employment has ended. In practice, the worker’s residence generally remains valid for 90 days after the end of the work authorization, unless a different residence decision is taken."
  },
  {
    question: "How can a foreign worker obtain unlimited access to the labour market?",
    answer:
      "After a certain period of work under a limited authorization, the worker may in some cases request unlimited access to the labour market. The exact conditions depend notably on the competent region and on the time already worked or spent in Belgium."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: permitFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function PermisUniquePageEn() {
  return (
    <>
      <Script
        id="faq-single-permit-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero
        title={
          <>
            Single permit in Belgium:
            <span className="block text-[#57b7af]">the essentials in plain language</span>
          </>
        }
        description="Quickly understand when a single permit may be needed, who decides and what an employer must verify first."
        primaryHref="/en/contact"
        primaryLabel="Speak with a lawyer"
        secondaryHref="/en/metiers-en-penurie"
        secondaryLabel="See shortage occupations"
        stats={[
          { value: "EU + Belgium", label: "A framework shared between EU rules, the federal state and the Regions" },
          { value: "Regions", label: "The work side depends on the competent Region" },
          { value: "Check", label: "The employer must verify the right to work before the start date" }
        ]}
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">On this page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> on the single permit</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~5 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#principes-generaux", title: "General principles", desc: "Who needs a single permit and when the right to work already exists." },
              { n: "02", href: "#paysage-institutionnel", title: "Why the system feels complex", desc: "How EU rules, the federal state and the Regions share competences." },
              { n: "03", href: "#autorisations-travail", title: "Three different situations", desc: "Immediate access, facilitated access, or a labour market assessment." },
              { n: "04", href: "#cote-employeur", title: "What employers must remember", desc: "Verifying the right to work before the start date is non-negotiable." },
              { n: "05", href: "#etapes", title: "How a single permit works", desc: "Qualify the role, prepare the file, submit and follow the procedure." },
              { n: "06", href: "#cabinet-lexpat", title: "When LEXPAT steps in", desc: "The platform clarifies the need. The law firm handles the legal part." },
              { n: "07", href: "#faq", title: "Frequently asked questions", desc: "Short answers to the questions employers ask most often." },
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

      <div id="principes-generaux">
      <Section
        title="General principles"
        intro="To work in Belgium, a person needs a valid legal basis. Sometimes that basis already exists. Sometimes a single permit is required."
        kicker="Quick understanding"
      >
        <CardGrid items={basicCards} columns={3} />
      </Section>
      </div>

      <div id="paysage-institutionnel">
      <Section
        title="Why the system feels complex"
        intro="The single permit is not handled by a single authority. That is why it can be difficult to read at first."
        kicker="Institutional landscape"
        muted
      >
        <CardGrid items={landscapeCards} columns={3} />
      </Section>
      </div>

      <div id="autorisations-travail">
      <Section
        title="Three very different situations"
        intro="Before discussing the single permit, it helps to distinguish three cases: immediate access, facilitated access, or a real labour market assessment."
        kicker="Work authorization"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {accessCategories.map((item) => (
            <article
              key={item.title}
              className={`rounded-[30px] border p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7 ${
                item.tone === "blue"
                  ? "border-[rgba(23,58,138,0.18)] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)]"
                  : item.tone === "green"
                    ? "border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#ecfaf8_100%)]"
                    : "border-[#dfe8f0] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)]"
              }`}
            >
              <p
                className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  item.tone === "blue"
                    ? "bg-[#eef4ff] text-[#173A8A]"
                    : item.tone === "green"
                      ? "bg-[#ecfaf8] text-[#2f9f97]"
                      : "bg-[#edf3f8] text-[#1b355f]"
                }`}
              >
                {item.kicker}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#607086]">{item.text}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#4f6178]">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      className={`mt-2 h-2 w-2 rounded-full ${
                        item.tone === "blue" ? "bg-[#173A8A]" : item.tone === "green" ? "bg-[#59B9B1]" : "bg-[#58728f]"
                      }`}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    item.tone === "blue"
                      ? "bg-[#173A8A] text-white hover:bg-[#143273]"
                      : item.tone === "green"
                        ? "bg-[#59B9B1] text-white hover:bg-[#48aaa2]"
                        : "border border-[#d7e2ec] bg-white text-[#1d3b8b] hover:bg-[#f7faff]"
                  }`}
                >
                  View member detail
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
      </div>

      <div id="cote-employeur">
      <Section
        title="What employers should remember"
        intro="The key point is simple: verify before the person starts working."
        kicker="Employer side"
        muted
      >
        <CardGrid items={employerPoints} columns={3} />
      </Section>
      </div>

      <div id="etapes">
      <Section
        title="In practice, how a single permit works"
        intro="The file usually follows three simple stages: qualify, prepare, submit."
        kicker="3 steps"
      >
        <Steps items={permitSteps} />
      </Section>
      </div>

      <div id="cabinet-lexpat">
      <Section
        title="When the LEXPAT law firm steps in"
        intro="The platform clarifies the hiring need. The law firm steps in when the file needs legal security."
        kicker="Legal relay"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">The right time to ask for support</h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
              <li>The function is sensitive or difficult to classify</li>
              <li>The competent Region is not obvious</li>
              <li>The candidate’s profile raises a residence or right-to-work question</li>
              <li>You want to avoid a procedural mistake or a sanction risk</li>
            </ul>
          </article>
          <article className="rounded-[30px] border border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="inline-flex rounded-full bg-[#ecfaf8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">
              Key point
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">A single permit is not just a form</h3>
            <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
              The role, the region, the contract, the salary, the candidate’s profile and the residence logic all have to fit together.
            </p>
          </article>
        </div>
      </Section>

      </div>

      <MemberLockedPermitContent locale="en" />

      <div id="faq">
      <Section
        title="Single permit FAQ"
        intro="Short answers to the questions employers ask most often."
        kicker="FAQ"
      >
        <Faq items={permitFaq} />
      </Section>
      </div>

      <CtaBanner
        title="Do you want to know whether your recruitment requires a single permit?"
        text="Explain the role, the region and the target profile in simple terms. We help you understand whether the single permit is relevant and when legal support should step in."
        primaryHref="/en/contact"
        primaryLabel="Speak with a lawyer"
        secondaryHref="/en/employeurs"
        secondaryLabel="Submit a hiring need"
      />
    </>
  );
}
