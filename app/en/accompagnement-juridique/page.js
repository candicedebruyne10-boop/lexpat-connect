import { BulletList, CtaBanner, Hero, Section, Steps } from "../../../components/Sections";

const legalRoles = [
  {
    title: "For employers",
    text: "To secure an international hire, assess a single permit strategy or confirm whether a recruitment project is viable."
  },
  {
    title: "For international workers",
    text: "To clarify a residence issue, a right-to-work question or a professional move to Belgium."
  },
  {
    title: "For sensitive situations",
    text: "To step in once a match exists and the legal dimension can no longer be handled informally."
  }
];

const legalExamples = [
  {
    title: "Single permit",
    text: "Reviewing, preparing and securing the application whenever the hire requires one."
  },
  {
    title: "Economic immigration",
    text: "A practical reading tailored to the region, the role, the qualification level and the candidate profile."
  },
  {
    title: "Preliminary assessment",
    text: "Checking whether a project is realistic before investing further time in the recruitment process."
  }
];

const legalSteps = [
  {
    title: "A match already exists",
    text: "A recruitment need or a professional opportunity has already been identified."
  },
  {
    title: "A legal question appears",
    text: "Single permit, right to work, economic immigration or a region-specific regulatory issue."
  },
  {
    title: "LEXPAT takes over",
    text: "The law firm then intervenes within a separate legal framework to assess and secure the situation."
  }
];

export const metadata = {
  title: "Legal support | LEXPAT Connect",
  description:
    "Learn when the LEXPAT law firm steps in after a match to support single permit, right-to-work and economic immigration issues in Belgium."
};

export default function LegalSupportPageEn() {
  return (
    <>
      <Hero
        badge="LEXPAT law firm"
        title={
          <>
            A clear legal next step
            <span className="block text-[#57b7af]">when matching alone is no longer enough</span>
          </>
        }
        description="LEXPAT Connect is designed first as a matching platform. When an international hire raises a real single permit, right-to-work or economic immigration issue, the LEXPAT law firm can step in as a separate legal relay."
        primaryHref="/en/contact"
        primaryLabel="Contact us"
        secondaryHref="/en"
        secondaryLabel="Back to LEXPAT Connect"
        stats={[
          { value: "Single permit", label: "To secure a recruitment process that has already taken shape" },
          { value: "Work and residence", label: "To clarify a concrete administrative situation" },
          { value: "Belgium", label: "With a careful reading of the relevant regional framework" }
        ]}
      />

      <Section
        title="When to involve the law firm"
        intro="The law firm begins where the platform stops: when a real situation needs a legal reading, not just a recruitment one."
        kicker="Legal relay"
      >
        <BulletList items={legalRoles} />
      </Section>

      <Section
        title="The most common topics"
        intro="The firm intervenes on focused matters directly tied to a hire, a professional opportunity or a specific administrative situation."
        kicker="Typical support"
        muted
      >
        <BulletList items={legalExamples} />
      </Section>

      <Section
        title="How the relay works"
        intro="Once the matching stage is complete, legal support can take over in a clear and separate way."
        kicker="3 steps"
      >
        <Steps items={legalSteps} />
      </Section>

      <CtaBanner
        title="Need a legal view on a real situation?"
        text="If a recruitment process or a professional opportunity raises a genuine question about residence, a single permit or the right to work, the LEXPAT law firm can step in."
        primaryHref="/en/contact"
        primaryLabel="Contact us"
        secondaryHref="/en/employeurs"
        secondaryLabel="Back to LEXPAT Connect"
      />
    </>
  );
}
