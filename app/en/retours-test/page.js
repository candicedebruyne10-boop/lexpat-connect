import { Hero, Section } from "../../../components/Sections";
import TestFeedbackForm from "../../../components/TestFeedbackForm";

const useCases = [
  "Report a bug or a blocking issue",
  "Tell us when a page is unclear",
  "Share a simple improvement idea",
  "Help us make the platform more useful"
];

export const metadata = {
  title: "Tester feedback | LEXPAT Connect",
  description:
    "Dedicated page to centralize user testing feedback for LEXPAT Connect."
};

export default function RetoursTestPageEn() {
  return (
    <>
      <Hero
        badge="Your feedback"
        title={
          <>
            Help us improve
            <span className="block text-[#57b7af]">LEXPAT Connect</span>
          </>
        }
        description="Have you spotted a bug, a confusing point or simply a useful idea? Share it here in a few lines. Every message helps us make the platform clearer, smoother and more human."
        primaryHref="#feedback-form"
        primaryLabel="Send feedback"
        secondaryHref="/en"
        secondaryLabel="Back to home"
      />

      <Section
        title="When to use this page"
        intro="This page is open to anyone testing the website or wishing to share useful feedback, without relying on scattered messages."
        kicker="Recommended use"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {useCases.map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-[#e5edf4] bg-white px-5 py-4 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
            >
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Share feedback in a few moments"
        intro="No need to fill out a long form. Simply indicate the page concerned, what you noticed and, if you wish, a simple idea for improvement."
        kicker="Form"
        muted
      >
        <div id="feedback-form">
          <TestFeedbackForm locale="en" />
        </div>
      </Section>
    </>
  );
}
