import Script from "next/script";
import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../../components/Sections";

export const metadata = {
  title: "If I leave Belgium, am I guaranteed to come back later? | LEXPAT Connect",
  description:
    "A clear and cautious answer for people in an irregular stay who wonder whether leaving Belgium guarantees a future return."
};

const keyPoints = [
  {
    title: "There is no general guarantee",
    text: "Leaving Belgium does not automatically give you the right to come back later."
  },
  {
    title: "Everything depends on your legal basis",
    text: "The real question is what legal basis you would have to return later: visa, new authorization, family reunification, work or another valid route."
  },
  {
    title: "An entry ban may exist",
    text: "Depending on your situation, a return decision or entry ban may complicate or block a future return."
  }
];

const concreteCases = [
  {
    title: "You currently have no valid residence document",
    text: "Leaving in that situation does not create an automatic right to return. A future return often requires building a new legal basis from abroad."
  },
  {
    title: "You have received a return decision",
    text: "You need to check whether an entry ban also exists, because that may prevent a future return to Belgium or the Schengen area for a period of time."
  },
  {
    title: "You hope to come back for work",
    text: "In practice, this usually requires an employer, the right procedure and a positive decision. Having already lived in Belgium is not enough by itself."
  },
  {
    title: "You have a pending file or procedure",
    text: "In some cases, leaving may complicate an application, a family reunification project or another sensitive administrative situation."
  }
];

const beforeLeaving = [
  {
    title: "Check your exact status",
    text: "Before leaving, you need to know whether you are simply in an irregular stay, subject to a return order, or affected by another formal decision."
  },
  {
    title: "Identify a concrete legal route back",
    text: "You should be able to answer one simple question: on what precise legal basis could I come back later?"
  },
  {
    title: "Avoid closing a door",
    text: "Leaving without checking first may sometimes weaken a future work, residence or family-based project."
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
    question: "If I leave voluntarily, does that guarantee that I will be able to come back later?",
    answer:
      "No. Leaving voluntarily does not automatically create a right to return. You still need to identify the legal basis on which a future return could be requested."
  },
  {
    question: "Does an order to leave always mean that I will never be able to come back?",
    answer:
      "Not necessarily. But you must check very carefully whether an entry ban exists or may be imposed, because that is what can block a future return."
  },
  {
    question: "Can I simply come back later if I find an employer?",
    answer:
      "Not automatically. A work project may sometimes support a future return, but it still requires the right procedure, the relevant conditions and a positive decision."
  },
  {
    question: "What is the right reflex before leaving Belgium?",
    answer:
      "The right reflex is to verify your exact situation and the legal basis of any future return before leaving, instead of assuming that coming back will be possible later."
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
        badge="Frequent question — irregular stay"
        title={
          <>
            If you return to your country of origin,
            <span className="block text-[#57b7af]">you are not generally guaranteed to come back to Belgium</span>
          </>
        }
        description="The possibility of returning to Belgium depends on your exact administrative situation at the time of departure and on the legal basis you would later have to return."
        primaryHref="/en/contact"
        primaryLabel="Ask my question"
        secondaryHref="/en/permis-unique"
        secondaryLabel="Understand the single permit"
        stats={[
          { value: "No", label: "There is no general guarantee of return" },
          { value: "Legal basis", label: "A future return depends on a visa, an authorization or another valid route" },
          { value: "Caution", label: "An entry ban may complicate or block a return" }
        ]}
      />

      <Section
        title="Short answer"
        intro="Returning to your country of origin does not automatically give you the right to come back later to Belgium. A future return always depends on a concrete legal basis."
        kicker="In one sentence"
      >
        <CardGrid items={keyPoints} columns={3} />
      </Section>

      <Section
        title="Most common situations"
        intro="The answer changes depending on your exact situation. These are the most practical cases."
        kicker="In practice"
        muted
      >
        <BulletList items={concreteCases} />
      </Section>

      <Section
        title="Before leaving"
        intro="The right reflex is to verify your situation before departure, not after."
        kicker="3 minimum checks"
      >
        <Steps items={beforeLeaving} />
      </Section>

      <Section
        title="Frequently asked questions"
        intro="Short answers to avoid the most common misunderstandings."
        kicker="FAQ"
        muted
      >
        <Faq items={faq} />
      </Section>

      <Section
        title="Official sources"
        intro="A few useful starting points to understand the Belgian administrative logic."
        kicker="References"
      >
        <CardGrid items={sourceCards} columns={3} />
      </Section>

      <CtaBanner
        title="Before deciding to leave, your exact situation needs to be checked"
        text="This page provides general information only. If your situation is sensitive or if you want to know on what basis a future return could be considered, you need an individual review."
        primaryHref="/en/contact"
        primaryLabel="Discuss my situation"
        secondaryHref="/en/accompagnement-juridique"
        secondaryLabel="See legal support"
      />
    </>
  );
}
