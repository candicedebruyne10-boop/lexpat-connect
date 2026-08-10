import Link from "next/link";
import { Hero, Section } from "../../../components/Sections";
import FormCard from "../../../components/FormCard";

import { alternatesFor } from "../../../lib/seo-alternates";

export const metadata = {
  alternates: alternatesFor("/en/contact"),
  title: "Contact — Ask about international recruitment or the single permit in Belgium | LEXPAT Connect",
  description:
    "A question about international recruitment in Belgium, the single permit or the platform? Write to us — employers, workers and legal questions welcome. Reply within 24h."
};

export default function ContactPageEn() {
  return (
    <>
      <Hero
        badge="Contact"
        title={
          <>
            A question?
            <span className="block text-[#57b7af]">Write to us — we reply within 24h.</span>
          </>
        }
        description="Whether you are an employer, a worker or have a question about the single permit or the right to work — send us your question here. We will point you to the right person within 24h."
        primaryHref="#form"
        primaryLabel="Ask my question"
        secondaryHref="/en/simulateur-eligibilite"
        secondaryLabel="Test eligibility first"
      />

      {/* Reassurance signals */}
      <div className="border-y border-[#e5edf5] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            {[
              { icon: "⏱", label: "Reply within 24h", sub: "On business days" },
              { icon: "🔒", label: "Confidential data", sub: "GDPR-compliant processing" },
              { icon: "🎯", label: "Routed to the right person", sub: "Platform or law firm depending on your need" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-bold text-[#1E3A78]">{label}</p>
                <p className="text-xs text-[#8a9db8]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section
        title="Send your question"
        intro="Describe your situation in a few lines — we will point you to the right resource or the right person."
        kicker="Form"
        muted
      >
        <div id="form">
          <FormCard
            locale="en"
            title="Contact form"
            intro="Choose the topic that best matches your situation."
            buttonLabel="Send message"
            formType="contact"
            fields={[
              { label: "Full name", placeholder: "First name Last name" },
              { label: "Email", type: "email", placeholder: "your.email@example.com" },
              {
                label: "Request type",
                type: "select",
                placeholder: "Select your request",
                options: ["Employer question", "Worker question", "Legal consultation", "Partnership", "Other"]
              },
              { label: "Message", type: "textarea", placeholder: "Explain your question or situation...", wide: true }
            ]}
          />
        </div>

        {/* Direct links */}
        <div className="mt-8 rounded-[20px] border border-[#e5edf5] bg-white p-6">
          <p className="text-sm font-bold text-[#1E3A78] mb-4">Prefer to go directly?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/en/simulateur-eligibilite" className="inline-flex items-center gap-2 rounded-xl border border-[#d0dcf0] bg-[#f5f7ff] px-4 py-2.5 text-sm font-semibold text-[#1E3A78] transition hover:border-[#1E3A78]">
              🧪 Check my role's eligibility
            </Link>
            <Link href="/en/base-de-profils" className="inline-flex items-center gap-2 rounded-xl border border-[#d0f0ed] bg-[#f0faf9] px-4 py-2.5 text-sm font-semibold text-[#0d7c6e] transition hover:border-[#57b7af]">
              👤 Browse available profiles
            </Link>
            <Link href="/en/permis-unique" className="inline-flex items-center gap-2 rounded-xl border border-[#d0dcf0] bg-[#f5f7ff] px-4 py-2.5 text-sm font-semibold text-[#1E3A78] transition hover:border-[#1E3A78]">
              📋 Single permit guide
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
