import Script from "next/script";
import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";

export const metadata = {
  title: "Quitter la Belgique et revenir plus tard : y a-t-il une garantie ? | LEXPAT Connect",
  description:
    "Une réponse claire et prudente pour les personnes en séjour irrégulier qui se demandent si un retour dans le pays d’origine garantit un retour futur en Belgique."
};

const keyPoints = [
  {
    title: "Pas de garantie générale",
    text: "Quitter la Belgique ne donne pas automatiquement le droit d’y revenir plus tard."
  },
  {
    title: "Tout dépend de votre base légale",
    text: "La vraie question est de savoir sur quelle base vous pourriez revenir : visa, nouvelle autorisation, regroupement familial, travail ou autre."
  },
  {
    title: "Une interdiction d’entrée peut exister",
    text: "Selon votre situation, un ordre de quitter le territoire ou une interdiction d’entrée peut compliquer ou bloquer un retour."
  }
];

const concreteCases = [
  {
    title: "Vous êtes aujourd’hui sans titre de séjour",
    text: "Partir dans ce contexte ne vous donne pas un droit automatique de retour. Il faudra souvent reconstruire une base légale depuis l’étranger."
  },
  {
    title: "Vous avez reçu une décision de retour",
    text: "Il faut vérifier s’il existe aussi une interdiction d’entrée, car cela peut empêcher un retour en Belgique ou dans l’espace Schengen pendant une certaine durée."
  },
  {
    title: "Vous espérez revenir pour travailler",
    text: "En pratique, il faut généralement un employeur, une procédure adaptée et une décision favorable. Le simple fait d’avoir déjà vécu en Belgique ne suffit pas."
  },
  {
    title: "Vous avez un dossier ou une procédure en cours",
    text: "Dans certains cas, partir peut compliquer une demande, un regroupement familial ou une autre situation administrative sensible."
  }
];

const beforeLeaving = [
  {
    title: "Vérifier votre situation exacte",
    text: "Avant tout départ, il faut savoir si vous êtes simplement en séjour irrégulier, sous ordre de quitter le territoire, ou visé par une autre décision."
  },
  {
    title: "Identifier une base concrète de retour",
    text: "Il faut pouvoir répondre à une question simple : sur quelle base légale précise pourrais-je revenir plus tard ?"
  },
  {
    title: "Éviter de fermer une porte",
    text: "Partir sans analyse préalable peut parfois compliquer un futur projet de travail, de séjour ou de regroupement familial."
  }
];

const sourceCards = [
  {
    title: "Interdiction d’entrée",
    text: "Page d’information de l’Office des étrangers sur l’interdiction d’entrée en Belgique et dans l’espace Schengen.",
    link: {
      href: "https://dofi.ibz.be/en/themes/irregular-stay/more-info/entry-ban",
      label: "Voir la source officielle"
    }
  },
  {
    title: "Ordre de quitter le territoire",
    text: "Informations officielles sur la logique de retour et les mesures qui peuvent accompagner une décision de départ.",
    link: {
      href: "https://dofi.ibz.be/en/themes/irregular-stay/alternatives-detention/order-leave-territory",
      label: "Voir la source officielle"
    }
  },
  {
    title: "Permis unique",
    text: "Page générale de l’Office des étrangers sur le permis unique pour les ressortissants de pays tiers.",
    link: {
      href: "https://dofi.ibz.be/en/themes/third-country-nationals/work/single-permit",
      label: "Voir la source officielle"
    }
  }
];

const faq = [
  {
    question: "Si je pars volontairement, est-ce que cela me garantit un retour futur ?",
    answer:
      "Non. Partir volontairement n’ouvre pas automatiquement un droit au retour. Il faut toujours vérifier la base légale sur laquelle un retour pourrait être demandé ensuite."
  },
  {
    question: "Un ordre de quitter le territoire veut-il toujours dire que je ne pourrai plus revenir ?",
    answer:
      "Pas forcément. Mais il faut vérifier très attentivement si une interdiction d’entrée existe ou peut être prononcée, car c’est ce point qui peut bloquer un retour futur."
  },
  {
    question: "Puis-je revenir simplement si je trouve un employeur plus tard ?",
    answer:
      "Pas automatiquement. Un projet de travail peut parfois servir de base, mais il faut alors une procédure adaptée, des conditions remplies et une décision favorable des autorités compétentes."
  },
  {
    question: "Quel est le bon réflexe avant de quitter la Belgique ?",
    answer:
      "Le bon réflexe est de vérifier votre situation exacte et la base juridique d’un éventuel retour avant de partir, au lieu de supposer que le retour sera possible plus tard."
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

export default function RetourBelgiquePage() {
  return (
    <>
      <Script
        id="faq-retour-belgique-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero
        badge="Question fréquente — séjour irrégulier"
        title={
          <>
            Si vous retournez dans votre pays d’origine,
            <span className="block text-[#57b7af]">vous n’avez pas une garantie de pouvoir revenir</span>
          </>
        }
        description="La possibilité de revenir en Belgique dépend de votre situation administrative exacte au moment du départ et de la base légale que vous auriez ensuite pour revenir."
        primaryHref="/contact"
        primaryLabel="Poser ma question"
        secondaryHref="/permis-unique"
        secondaryLabel="Comprendre le permis unique"
        stats={[
          { value: "Non", label: "Il n’existe pas de garantie générale de retour" },
          { value: "Base légale", label: "Le retour dépend d’un visa, d’une autorisation ou d’un autre droit valable" },
          { value: "Prudence", label: "Une interdiction d’entrée peut compliquer ou empêcher un retour" }
        ]}
      />

      <Section
        title="Réponse courte"
        intro="Retourner dans votre pays d’origine ne vous donne pas automatiquement le droit de revenir ensuite en Belgique. Le retour dépend toujours d’une base légale concrète."
        kicker="En une phrase"
      >
        <CardGrid items={keyPoints} columns={3} />
      </Section>

      <Section
        title="Les situations les plus fréquentes"
        intro="La réponse change selon votre situation exacte. Voici les cas les plus concrets."
        kicker="En pratique"
        muted
      >
        <BulletList items={concreteCases} />
      </Section>

      <Section
        title="Avant de partir"
        intro="Le bon réflexe est de vérifier votre situation avant le départ, pas après."
        kicker="3 vérifications minimales"
      >
        <Steps items={beforeLeaving} />
      </Section>

      <Section
        title="Questions fréquentes"
        intro="Des réponses courtes pour éviter les confusions les plus fréquentes."
        kicker="FAQ"
        muted
      >
        <Faq items={faq} />
      </Section>

      <Section
        title="Sources officielles"
        intro="Quelques points de départ utiles pour comprendre la logique administrative belge."
        kicker="Références"
      >
        <CardGrid items={sourceCards} columns={3} />
      </Section>

      <CtaBanner
        title="Avant de prendre une décision de départ, il faut vérifier votre situation exacte"
        text="Cette page donne une information générale. Si votre situation est sensible ou si vous voulez savoir sur quelle base un retour pourrait être envisagé, il faut une lecture individualisée."
        primaryHref="/contact"
        primaryLabel="Parler de ma situation"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir l’accompagnement juridique"
      />
    </>
  );
}
