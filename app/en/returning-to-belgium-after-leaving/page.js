import Script from "next/script";
import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";

export const metadata = {
  title: "Returning to your country to get a work permit in Belgium: what you need to know | LEXPAT Connect",
  description:
    "Undocumented in Belgium and want to get a work permit? Here is what it means in practice: why returning is often necessary, and why your chances are real if your file is solid."
};

const keyPoints = [
  {
    title: "If undocumented in Belgium, returning is often unavoidable",
    text: "To obtain a single permit (work permit + residence title), the procedure is in principle initiated from the country of origin. If you are in an irregular stay in Belgium, it is in most cases very difficult — or impossible — to regularise your situation without first returning to your home country."
  },
  {
    title: "If all conditions are met, your chances are real",
    text: "The single permit can be granted in a near-automatic way when the file is complete and all conditions are met: an engaged employer, an eligible sector, documents in order. This is still an administrative decision, and there is always some uncertainty — but a solid file genuinely makes a difference."
  },
  {
    title: "Check your situation before you leave",
    text: "An unprepared departure can complicate things: entry ban, pending procedure, missing documents. Before any departure, it is important to verify your exact situation so you do not unknowingly close a door."
  }
];

const concreteCases = [
  {
    title: "You have no valid residence document in Belgium",
    text: "This is the most common situation. To obtain a single permit, the procedure in principle requires you to be in your country of origin when the application is filed. Leaving is often a necessary step, not an abandonment."
  },
  {
    title: "You have an employer ready to hire you",
    text: "This is an essential condition. Without a job offer, the procedure cannot begin. With an employer committed in an eligible sector, you have a concrete legal basis to start the process."
  },
  {
    title: "Your file is complete and all conditions are met",
    text: "In that case, your chances of obtaining the permit are serious. The Belgian administration can grant the single permit in a near-automatic way when everything is in order. It is not an absolute guarantee, but it is not an impossible journey either."
  },
  {
    title: "You have received an order to leave the territory",
    text: "You need to check very carefully whether an entry ban is attached to this decision. This can block or delay a legal return to Belgium — including through a work permit. This check must be done before any departure."
  }
];

const beforeLeaving = [
  {
    title: "Check whether an entry ban exists",
    text: "Before leaving, make sure no measure would block your return. An order to leave the territory can sometimes come with an entry ban across the entire Schengen area."
  },
  {
    title: "Make sure you have a legal route back",
    text: "The most common route is an employer ready to hire you in a sector eligible for the single permit. Without that, returning remains administratively possible, but there is no clear path to come back and work legally."
  },
  {
    title: "Prepare your file in advance",
    text: "A solid file — with the right documents, the right steps and the right timelines — significantly increases the chances of a successful return. This is where LEXPAT Connect can help you find an employer matching your profile."
  }
];

const sourceCards = [
  {
    title: "Entry ban",
    text: "Belgian Immigration Office information on entry bans in Belgium and the Schengen area.",
    link: {
      href: "https://dofi.ibz.be/en/themes/irregular-stay/more-info/entry-ban",
      label: "See the official source"
    }
  },
  {
    title: "Order to leave the territory",
    text: "Official information on return decisions and the measures that may accompany them.",
    link: {
      href: "https://dofi.ibz.be/en/themes/irregular-stay/alternatives-detention/order-leave-territory",
      label: "See the official source"
    }
  },
  {
    title: "Single permit",
    text: "Belgian Immigration Office general page on the single permit for third-country nationals.",
    link: {
      href: "https://dofi.ibz.be/en/themes/third-country-nationals/work/single-permit",
      label: "See the official source"
    }
  }
];

const faq = [
  {
    question: "Am I required to return to my home country to get a work permit?",
    answer:
      "In the vast majority of cases, yes. The single permit procedure is initiated from the country of origin or legal residence. If you are in an irregular stay in Belgium, it is generally very difficult to regularise your situation without going through that return. This is not a punishment — it is often the only legal path available."
  },
  {
    question: "Do I have a good chance of coming back if my file is in order?",
    answer:
      "Yes, your chances are serious. When all conditions are met — an engaged employer, an eligible sector, a complete file — the single permit can be granted in a near-automatic way. It remains an administrative decision, and there is never an absolute guarantee, but a solid file genuinely makes a difference."
  },
  {
    question: "How long does the procedure take?",
    answer:
      "The single permit procedure typically takes between 3 and 4 months once the complete file has been submitted. Timelines can vary depending on the region, the sector and the administration's workload. This is a difficult period, and it is important to prepare for it well before leaving."
  },
  {
    question: "Does an order to leave always mean I can never come back?",
    answer:
      "Not necessarily. But you must check very carefully whether an entry ban is attached to that decision. That is the specific point that can block or delay a legal return — including through a work permit application. This check must happen before any departure."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function ReturningToBelgiumPage() {
  return (
    <>
      <Script
        id="faq-returning-belgium-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero
        badge="Irregular stay & work permit"
        title={
          <>
            Returning home to come back and work in Belgium:
            <span className="block text-[#57b7af]">it is often the only path — and more achievable than you might think</span>
          </>
        }
        description="If you are undocumented in Belgium and want to regularise your situation through work, you will in most cases need to return to your home country to file your single permit application. That is hard to hear — but it is also a procedure that works, when the file is well prepared."
        primaryHref="/en/contact"
        primaryLabel="Ask my question"
        secondaryHref="/en/permis-unique"
        secondaryLabel="Understand the single permit"
        stats={[
          { value: "Return", label: "Often necessary to start the procedure from the country of origin" },
          { value: "Solid file", label: "With an employer and the right conditions, your chances are real" },
          { value: "Caution", label: "Check your situation before leaving so you do not close a door" }
        ]}
      />

      <Section
        title="What you need to understand"
        intro="Two realities coexist: returning is often unavoidable, but it can also open a real door if your situation allows it."
        kicker="The essentials"
      >
        <CardGrid items={keyPoints} columns={3} />
      </Section>

      <Section
        title="Most common situations"
        intro="The procedure and the chances vary depending on your exact situation. Here is what changes in practice."
        kicker="In practice"
        muted
      >
        <BulletList items={concreteCases} />
      </Section>

      <Section
        title="Before leaving"
        intro="A well-prepared departure changes everything. Here are the three key points to check before making a decision."
        kicker="3 key steps"
      >
        <Steps items={beforeLeaving} />
      </Section>

      <Section
        title="Frequently asked questions"
        intro="Clear answers to questions that many people face alone before making a difficult decision."
        kicker="FAQ"
        muted
      >
        <Faq items={faq} />
      </Section>

      <Section
        title="Official sources"
        intro="A few references to understand the Belgian administrative logic around the single permit and irregular stay."
        kicker="References"
      >
        <CardGrid items={sourceCards} columns={3} />
      </Section>

      <CtaBanner
        title="Your situation deserves careful attention — not a generic answer"
        text="This page provides general, educational information. If you are considering returning to your home country to start a single permit procedure, we can help you find an employer matching your profile — and the lexpat.be law firm can support you on the legal aspects."
        primaryHref="/en/contact"
        primaryLabel="Discuss my situation"
        secondaryHref="/en/accompagnement-juridique"
        secondaryLabel="See legal support"
      />
    </>
  );
}
