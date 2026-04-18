import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";

export const metadata = {
  title: "Workers | LEXPAT Connect",
  description:
    "Make your profile visible to Belgian employers, clarify your experience and access opportunities in Belgium."
};

const candidateBenefits = [
  {
    title: "Make your profile visible",
    text: "Your background becomes easier to read for Belgian employers recruiting in shortage occupations."
  },
  {
    title: "Highlight what matters",
    text: "Skills, experience, languages and availability: the useful information appears immediately."
  },
  {
    title: "Create more opportunities",
    text: "You increase your chances of being understood faster and starting a real conversation."
  }
];

const candidateSteps = [
  {
    title: "Create your profile",
    text: "You indicate your occupation, preferred region, skills and availability."
  },
  {
    title: "Your application becomes clearer",
    text: "Employers understand your background faster and how it fits their needs."
  },
  {
    title: "The first connection can begin",
    text: "You gain visibility with Belgian companies open to international recruitment."
  }
];

const candidatePreview = [
  {
    title: "Candidate dashboard",
    text: "A personal space to track your visibility, your profile and your next steps."
  },
  {
    title: "Structured profile",
    text: "A clearer presentation of your background, designed for Belgian employers."
  },
  {
    title: "Enhanced CV logic",
    text: "A structure already planned to centralize experience, training, certificates and skills."
  }
];

const candidateFaq = [
  {
    question: "Can I create a profile if I am not yet in Belgium?",
    answer: "Yes. The platform already allows you to make your profile visible and present your professional project."
  },
  {
    question: "Do I already need a work permit?",
    answer: "No. Registering on the platform and having the right to work are two different subjects."
  },
  {
    question: "Does the LEXPAT law firm step in automatically?",
    answer: "No. The law firm only steps in if an opportunity later raises a real residence, single permit or right-to-work issue."
  }
];

const candidateFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: candidateFaq.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function TravailleursPageEn() {
  return (
    <>
      <Script
        id="faq-travailleurs-en-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(candidateFaqJsonLd) }}
      />
      <Hero
        title={
          <>
            Make your profile visible
            <span className="block text-[#57b7af]">to Belgian employers who are hiring</span>
          </>
        }
        description="Present your experience, your skills and your availability in a clearer, more credible and more useful format to access opportunities in Belgium."
        primaryHref="/en/travailleurs/rejoindre"
        primaryLabel="Create my profile"
        secondaryHref="/en/metiers-en-penurie"
        secondaryLabel="See shortage occupations"
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ On this page — navigation</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> for workers</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi", title: "Why create your profile", desc: "What the platform gives you to become more visible and credible." },
              { n: "02", href: "#comment-ca-marche", title: "How it works", desc: "A simple process in 3 steps, focused on your visibility." },
              { n: "03", href: "#espace-travailleur", title: "Worker space preview", desc: "A dedicated interface taking shape to manage your profile and CV." },
              { n: "04", href: "/en/travailleurs/rejoindre", title: "Create my profile", desc: "Guided 4-step form to present your background to Belgian employers." },
              { n: "05", href: "#faq", title: "Frequently asked questions", desc: "Common doubts about the platform, the permit and the law firm." },
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

      <div id="pourquoi">
      <Section
        title="Why create your profile"
        intro="The platform is designed to make you more visible, more readable and more credible to Belgian employers."
        kicker="Workers"
      >
        <BulletList items={candidateBenefits} />
      </Section>
      </div>

      <div id="comment-ca-marche">
      <Section
        title="How it works"
        intro="A simple process focused on your visibility and on useful introductions."
        kicker="3 steps"
        muted
      >
        <Steps items={candidateSteps} />
      </Section>
      </div>

      <div id="espace-travailleur">
      <Section
        title="A worker space is already taking shape"
        intro="We are building a dedicated interface to manage your profile, your CV and your visibility in a more professional way."
        kicker="Preview"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Candidate space</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">A real personal space structure</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Dashboard, profile, CV and progress tracking: the structure is already designed to help you present your path more clearly.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/en/travailleurs/espace" className="primary-button">
                View worker space
              </Link>
              <Link href="/en/travailleurs/rejoindre" className="secondary-button">
                Start now
              </Link>
            </div>
          </div>
          <BulletList items={candidatePreview} />
        </div>
      </Section>
      </div>

      <div id="formulaire">
      <Section
        title="Create my profile"
        intro="A guided 4-step form to present your occupation, region and skills in a clear, actionable format."
        kicker="Wizard"
        muted
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <Link
            href="/en/travailleurs/rejoindre"
            className="primary-button px-10 py-4 text-base"
          >
            Create my profile →
          </Link>
          <p className="text-xs text-[#8a9db8]">
            About 3 minutes · Account required · Mobile-optimised
          </p>
        </div>
      </Section>
      </div>

      <CtaBanner
        title="A residence or right-to-work question can be handled afterwards"
        text="Once a first connection exists, the LEXPAT law firm can step in if your situation requires separate legal support."
        primaryHref="/en/accompagnement-juridique"
        primaryLabel="View legal support"
        secondaryHref="/en/contact"
        secondaryLabel="Write to us"
      />

      <div id="faq">
      <Section title="Workers’ frequently asked questions" kicker="FAQ">
        <Faq items={candidateFaq} />
      </Section>
      </div>
    </>
  );
}
