import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";
import FormCard from "../../../components/FormCard";
import {
  getSectorOptions,
  professionSectorByRegion,
} from "../../../lib/professions";

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

export default function TravailleursPageEn() {
  return (
    <>
      <Hero
        badge="International workers"
        title={
          <>
            Make your profile visible
            <span className="block text-[#57b7af]">to Belgian employers who are hiring</span>
          </>
        }
        description="Present your experience, your skills and your availability in a clearer, more credible and more useful format to access opportunities in Belgium."
        primaryHref="#formulaire"
        primaryLabel="Create my profile"
        secondaryHref="/en/metiers-en-penurie"
        secondaryLabel="See shortage occupations"
        stats={[
          { value: "Profile", label: "A clearer presentation of your professional background" },
          { value: "Belgium", label: "Visibility designed for Belgian employers" },
          { value: "Opportunities", label: "More chances to trigger a serious first contact" }
        ]}
        panels={[
          {
            kicker: "Immediate benefit",
            title: "Present what an employer actually needs to see",
            text: "Your occupation, skills, languages and availability are highlighted in a more actionable format."
          },
          {
            kicker: "Next step",
            title: "Bring in LEXPAT only when it is needed",
            text: "If a job opportunity raises a single permit or right-to-work issue, the law firm can step in afterwards."
          }
        ]}
      />

      <Section
        title="Why create your profile"
        intro="The platform is designed to make you more visible, more readable and more credible to Belgian employers."
        kicker="Workers"
      >
        <BulletList items={candidateBenefits} />
      </Section>

      <Section
        title="How it works"
        intro="A simple process focused on your visibility and on useful introductions."
        kicker="3 steps"
        muted
      >
        <Steps items={candidateSteps} />
      </Section>

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
              <Link href="#formulaire" className="secondary-button">
                Start now
              </Link>
            </div>
          </div>
          <BulletList items={candidatePreview} />
        </div>
      </Section>

      <Section
        title="Create my profile"
        intro="The administrative status here only helps clarify your starting point. It never replaces legal validation."
        kicker="Form"
      >
        <div id="formulaire">
          <FormCard
            title="Candidate form"
            intro="Present the useful elements of your background to improve your visibility."
            buttonLabel="Send my profile"
            formType="candidat"
            locale="en"
            successMessage="Your profile has been sent successfully."
            fields={[
              { label: "Full name", placeholder: "First name Last name" },
              { label: "Email", type: "email", placeholder: "your.email@example.com" },
              { label: "Phone", placeholder: "+32 / +..." },
              { label: "Country of residence", placeholder: "Current country" },
              { name: "region", label: "Preferred region or city in Belgium", type: "region-multi", helperText: "Select one or more Belgian regions depending on your mobility." },
              { name: "secteur", label: "Target sector", type: "select", placeholder: "Select a sector", options: getSectorOptions("en") },
              { name: "autreSecteur", label: "Other sector / detail", placeholder: "Add another sector if needed", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Target occupation", type: "select", placeholder: "Choose a region first", optionsByField: "region", locale: "en", deriveField: "secteur", deriveByField: "region", deriveMap: professionSectorByRegion },
              { name: "autreProfession", label: "Other occupation / detail", placeholder: "Add another occupation if needed", showWhen: { field: "profession", value: "Autre profession" } },
              { label: "Availability", placeholder: "Immediate, 1 month, 3 months..." },
              { label: "Languages spoken", placeholder: "French, English, Dutch..." },
              { label: "Administrative status", type: "select", placeholder: "Select your status", options: ["Single permit", "Permit A", "Annex 15", "Annex 35", "No current permit", "Other", "I do not know"] },
              { label: "Main skills", type: "textarea", placeholder: "Skills, diplomas, certificates, experience...", wide: true },
              { label: "Additional message", type: "textarea", placeholder: "Explain your project or any information you need...", wide: true }
            ]}
          />
        </div>
      </Section>

      <CtaBanner
        title="A residence or right-to-work question can be handled afterwards"
        text="Once a first connection exists, the LEXPAT law firm can step in if your situation requires separate legal support."
        primaryHref="/en/accompagnement-juridique"
        primaryLabel="View legal support"
        secondaryHref="/en/contact"
        secondaryLabel="Write to us"
      />

      <Section title="Workers’ frequently asked questions" kicker="FAQ">
        <Faq items={candidateFaq} />
      </Section>
    </>
  );
}
