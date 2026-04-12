import { BulletList, Hero, Section } from "../../../components/Sections";
import FormCard from "../../../components/FormCard";

const contactPoints = [
  {
    title: "An employer question",
    text: "To submit a hiring need, clarify a recruitment issue or understand how to use the platform."
  },
  {
    title: "A worker question",
    text: "To make your profile visible, present your background more clearly or understand the opportunities available."
  },
  {
    title: "A legal question",
    text: "For single permit, right-to-work, residence or economic immigration matters."
  }
];

export const metadata = {
  title: "Contact | LEXPAT Connect",
  description:
    "Contact LEXPAT Connect to ask a platform question, clarify a recruitment need, improve a candidate profile or request legal guidance."
};

export default function ContactPageEn() {
  return (
    <>
      <Hero
        badge="Contact"
        title={
          <>
            A question?
            <span className="block text-[#57b7af]">Write to us — we will get back to you.</span>
          </>
        }
        description="Whether you are an employer, a worker, or have a legal question about the single permit or the right to work — send us your question and we will point you in the right direction."
        primaryHref="#form"
        primaryLabel="Ask my question"
        secondaryHref="/en"
        secondaryLabel="Back to home"
      />

      <Section
        title="When to contact us"
        intro="This page is the single entry point for questions related to either the platform or the law firm."
        kicker="Guidance"
      >
        <BulletList items={contactPoints} />
      </Section>

      <Section
        title="Send your question"
        intro="Describe your situation as clearly as possible so we can give you a fast and useful first response."
        kicker="Form"
        muted
      >
        <div id="form">
          <FormCard
            locale="en"
            title="Contact form"
            intro="Employer, worker, legal consultation or partnership: choose the right topic and tell us what you need."
            buttonLabel="Send message"
            formType="contact"
            fields={[
              { label: "Full name", placeholder: "First name Last name" },
              { label: "Email", type: "email", placeholder: "your.email@example.com" },
              { label: "Phone", placeholder: "+32 ..." },
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
      </Section>
    </>
  );
}
