import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";
import FormCard from "../../../components/FormCard";
import {
  getSectorOptions,
  professionSectorByRegion,
} from "../../../lib/professions";

export const metadata = {
  title: "Employers | LEXPAT Connect",
  description:
    "Submit your hiring need, structure your opening and connect with international workers for shortage occupations in Belgium."
};

const employerBenefits = [
  {
    title: "Describe the position clearly",
    text: "Occupation, region, contract and expected skills: your hiring need becomes readable from the start."
  },
  {
    title: "Reach targeted international workers",
    text: "The platform highlights qualified international profiles available in shortage occupations in Belgium."
  },
  {
    title: "Accelerate first contact",
    text: "You move faster from a vague need to a useful conversation with relevant profiles."
  }
];

const employerSteps = [
  {
    title: "Submit your need",
    text: "You specify the target occupation, region, contract type and expected skills."
  },
  {
    title: "Your search becomes easier to read",
    text: "Your hiring need can then be matched with relevant international workers."
  },
  {
    title: "You start the conversation",
    text: "The connection happens faster, in a clearer and more professional framework."
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

const employerFaq = [
  {
    question: "Who is the platform for?",
    answer: "Belgian employers who want to recruit international workers, especially in shortage occupations."
  },
  {
    question: "Can I use it if I have never recruited internationally before?",
    answer: "Yes. The platform is designed to structure a first hiring need in a clear, usable way."
  },
  {
    question: "Does the legal team step in immediately?",
    answer: "No. The priority is the match itself. The LEXPAT law firm only steps in later if a single permit or right-to-work issue appears."
  }
];

export default function EmployeursPageEn() {
  return (
    <>
      <Hero
        title={
          <>
            Find international workers
            <span className="block text-[#57b7af]">for shortage occupations in Belgium</span>
          </>
        }
        description="Submit your hiring need, gain visibility and accelerate the first connection with qualified international profiles."
        primaryHref="#formulaire"
        primaryLabel="Submit a hiring need"
        secondaryHref="/en/travailleurs"
        secondaryLabel="See the worker journey"
        stats={[
          { value: "Role", label: "A clearer need, structured from the start" },
          { value: "Belgium", label: "An approach designed for shortage occupations and regional realities" },
          { value: "Contact", label: "A faster first connection with relevant workers" }
        ]}
        panels={[
          {
            kicker: "Immediate benefit",
            title: "Make your recruitment readable and actionable",
            text: "You quickly clarify the role, expectations and context so everyone gains time."
          },
          {
            kicker: "Next step",
            title: "Bring in LEXPAT only when it is needed",
            text: "The law firm steps in later, only if the case raises a single permit or economic immigration issue."
          }
        ]}
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">On this page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Topics covered<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> for employers</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Reading: ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi", title: "Why submit your hiring need here", desc: "How the platform helps you move faster from a need to a connection." },
              { n: "02", href: "#comment-ca-marche", title: "How it works", desc: "Three steps: submit, match, connect — without jargon." },
              { n: "03", href: "#espace-employeur", title: "Employer space preview", desc: "A dedicated interface taking shape for managing your openings." },
              { n: "04", href: "#formulaire", title: "Submit a hiring need", desc: "The direct form to describe your role and reach international workers." },
              { n: "05", href: "#faq", title: "Frequently asked questions", desc: "The questions employers ask most often about the platform." },
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
        title="Why submit your hiring need here"
        intro="The platform is designed to help you move faster from a recruitment need to a useful connection."
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
            Read the shortage occupations guide
          </Link>
        </div>
      </Section>
      </div>

      <div id="comment-ca-marche">
      <Section
        title="How it works"
        intro="A direct process, without jargon, focused on recruitment."
        kicker="3 steps"
        muted
      >
        <Steps items={employerSteps} />
      </Section>
      </div>

      <div id="espace-employeur">
      <Section
        title="An employer space is already taking shape"
        intro="We are building a dedicated interface to structure your openings, your company profile and the follow-up of relevant profiles."
        kicker="Preview"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Company space</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">A real recruitment platform logic</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Dashboard, company information, open roles and opportunity tracking: the structure is already in place.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/en/employeurs/espace" className="primary-button">
                View employer space
              </Link>
              <Link href="#formulaire" className="secondary-button">
                Start now
              </Link>
            </div>
          </div>
          <BulletList items={employerPreview} />
        </div>
      </Section>
      </div>

      <div id="formulaire">
      <Section
        title="Submit a hiring need"
        intro="The more precise your request, the more useful the connection will be."
        kicker="Form"
        muted
      >
        <div>
          <FormCard
            title="Employer form"
            intro="Describe your need so it can be understood and used clearly from the start."
            buttonLabel="Send hiring need"
            formType="employeur"
            locale="en"
            successMessage="Your request has been sent successfully."
            fields={[
              { label: "Contact name", placeholder: "First name Last name" },
              { label: "Company", placeholder: "Company name" },
              { label: "Work email", placeholder: "contact@company.be", type: "email" },
              { label: "Phone", placeholder: "+32 ..." },
              { name: "region", label: "Relevant region", type: "region-multi", helperText: "Select one, two or three regions depending on your hiring perimeter." },
              { name: "secteur", label: "Sector", type: "select", placeholder: "Select a sector", options: getSectorOptions("en") },
              { name: "autreSecteur", label: "Other sector / detail", placeholder: "Add another sector if needed", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Target occupation", type: "select", placeholder: "Choose a region first", optionsByField: "region", locale: "en", deriveField: "secteur", deriveByField: "region", deriveMap: professionSectorByRegion },
              { name: "autreProfession", label: "Other occupation / detail", placeholder: "Add another occupation if needed", showWhen: { field: "profession", value: "Autre profession" } },
              { label: "Contract type", placeholder: "Permanent, fixed-term, temporary..." },
              { label: "Weekly hours", placeholder: "38h" },
              { label: "Work location", placeholder: "Brussels, Liège, Ghent..." },
              { label: "Main responsibilities", type: "textarea", placeholder: "Main tasks and responsibilities...", wide: true },
              { label: "Expected skills", type: "textarea", placeholder: "Skills, languages, experience, conditions...", wide: true }
            ]}
          />
        </div>
      </Section>
      </div>

      <CtaBanner
        title="Once the first connection exists, legal support can take over"
        text="Single permit, right to work, economic immigration: the LEXPAT law firm steps in later only when the recruitment needs it."
        primaryHref="/en/accompagnement-juridique"
        primaryLabel="View legal support"
        secondaryHref="/en/contact"
        secondaryLabel="Ask a question"
      />

      <div id="faq">
      <Section title="Employers’ frequently asked questions" kicker="FAQ">
        <Faq items={employerFaq} />
      </Section>
      </div>
    </>
  );
}
