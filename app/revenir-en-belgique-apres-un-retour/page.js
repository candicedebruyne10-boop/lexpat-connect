import Script from "next/script";
import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";

export const metadata = {
  title: "Retourner dans son pays pour obtenir un permis de travail en Belgique : ce qu’il faut savoir | LEXPAT Connect",
  description:
    "Vous êtes sans papiers en Belgique et vous voulez obtenir un permis de travail ? Voici ce que cela implique concrètement : pourquoi le retour est souvent nécessaire, et pourquoi les chances sont réelles si votre dossier est solide."
};

const keyPoints = [
  {
    title: "Sans papiers en Belgique, le retour est souvent incontournable",
    text: "Pour obtenir un permis unique (permis de travail + titre de séjour), la procédure se fait en principe depuis le pays d’origine. Si vous êtes en séjour irrégulier en Belgique, il est dans la plupart des cas très difficile — voire impossible — de régulariser votre situation sans d’abord retourner dans votre pays."
  },
  {
    title: "Si toutes les conditions sont réunies, les chances sont réelles",
    text: "Le permis unique peut être octroyé de manière quasi-automatique lorsque le dossier est complet et que toutes les conditions sont remplies : employeur engagé, secteur éligible, documents en ordre. Cela reste une décision administrative, et il y a toujours une part d’incertitude — mais un bon dossier change vraiment les choses."
  },
  {
    title: "Vérifiez votre situation avant de partir",
    text: "Un retour non préparé peut compliquer les choses : interdiction d’entrée, procédure en cours, documents manquants. Avant tout départ, il est important de vérifier votre situation exacte pour ne pas fermer une porte sans le savoir."
  }
];

const concreteCases = [
  {
    title: "Vous êtes sans titre de séjour en Belgique",
    text: "C’est la situation la plus fréquente. Pour obtenir un permis unique, la procédure exige en principe que vous soyez dans votre pays d’origine au moment du dépôt de la demande. Partir est souvent une étape nécessaire, pas un abandon."
  },
  {
    title: "Vous avez un employeur prêt à vous recruter",
    text: "C’est une condition essentielle. Sans promesse d’embauche, la procédure ne peut pas démarrer. Avec un employeur engagé dans un secteur éligible, vous avez une base légale concrète pour entamer les démarches."
  },
  {
    title: "Votre dossier est complet et les conditions sont remplies",
    text: "Dans ce cas, les chances d’obtenir le permis sont sérieuses. L’administration belge peut octroyer le permis unique de manière quasi-automatique si tout est en ordre. Ce n’est pas une garantie absolue, mais ce n’est pas non plus un parcours du combattant sans issue."
  },
  {
    title: "Vous avez reçu un ordre de quitter le territoire",
    text: "Il faut vérifier attentivement si une interdiction d’entrée est associée à cette décision. Cela peut bloquer ou retarder un retour en Belgique. Une analyse de votre situation avant tout départ est indispensable."
  }
];

const beforeLeaving = [
  {
    title: "Vérifiez si une interdiction d’entrée existe",
    text: "Avant de partir, il faut s’assurer qu’aucune mesure ne bloquerait votre retour. Un ordre de quitter le territoire peut parfois être accompagné d’une interdiction d’entrée dans l’espace Schengen."
  },
  {
    title: "Assurez-vous d’avoir une base légale de retour",
    text: "La base la plus fréquente est un employeur prêt à vous recruter dans un secteur éligible au permis unique. Sans cela, le retour reste possible administrativement, mais il n’y a pas de voie claire pour revenir légalement travailler."
  },
  {
    title: "Préparez votre dossier en amont",
    text: "Un dossier solide — avec les bons documents, les bonnes démarches, et les bons délais — augmente significativement les chances d’un retour réussi. C’est là que LEXPAT Connect peut vous aider à trouver un employeur correspondant à votre profil."
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
    question: "Est-ce que je suis obligé de retourner dans mon pays pour obtenir un permis de travail ?",
    answer:
      "Dans la très grande majorité des cas, oui. La procédure de permis unique se fait depuis le pays d’origine ou de résidence légale. Si vous êtes en séjour irrégulier en Belgique, il est généralement très difficile d’obtenir une régularisation sans passer par ce retour. Ce n’est pas une punition : c’est souvent le seul chemin légal disponible."
  },
  {
    question: "Est-ce que j’ai de bonnes chances de revenir si mon dossier est en ordre ?",
    answer:
      "Oui, les chances sont sérieuses. Lorsque toutes les conditions sont réunies — un employeur engagé, un secteur éligible, un dossier complet — le permis unique peut être accordé de manière quasi-automatique. Il reste une décision administrative, et il n’existe jamais de garantie absolue, mais un dossier solide fait vraiment la différence."
  },
  {
    question: "Combien de temps peut durer la procédure ?",
    answer:
      "La procédure de permis unique prend en principe entre 3 et 4 mois une fois le dossier complet déposé. Les délais peuvent varier selon la région, le secteur et la charge de l’administration. C’est une période difficile, et il est important de bien s’y préparer avant de partir."
  },
  {
    question: "Un ordre de quitter le territoire veut-il dire que je ne pourrai plus jamais revenir ?",
    answer:
      "Pas nécessairement. Mais il faut vérifier attentivement si une interdiction d’entrée est associée à cette décision. C’est ce point précis qui peut bloquer ou retarder un retour légal, y compris dans le cadre d’un permis de travail. Cette vérification doit se faire avant tout départ."
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
        badge="Séjour irrégulier & permis de travail"
        title={
          <>
            Retourner dans son pays pour revenir travailler en Belgique :
            <span className="block text-[#57b7af]">c’est souvent la seule voie, et elle est plus accessible qu’on ne le croit</span>
          </>
        }
        description="Si vous êtes sans papiers en Belgique et que vous souhaitez régulariser votre situation par le travail, il vous faudra dans la plupart des cas retourner dans votre pays d’origine pour déposer votre demande de permis unique. C’est difficile à entendre — mais c’est aussi une procédure qui fonctionne, quand le dossier est bien préparé."
        primaryHref="/contact"
        primaryLabel="Poser ma question"
        secondaryHref="/permis-unique"
        secondaryLabel="Comprendre le permis unique"
        stats={[
          { value: "Retour", label: "Souvent nécessaire pour démarrer la procédure depuis le pays d’origine" },
          { value: "Dossier solide", label: "Avec un employeur et les conditions remplies, les chances sont réelles" },
          { value: "Prudence", label: "Il faut vérifier sa situation avant de partir pour ne pas fermer une porte" }
        ]}
      />

      <Section
        title="Ce qu’il faut comprendre"
        intro="Deux réalités coexistent : le retour est souvent incontournable, mais il peut aussi ouvrir une vraie porte si votre situation le permet."
        kicker="L’essentiel"
      >
        <CardGrid items={keyPoints} columns={3} />
      </Section>

      <Section
        title="Les situations les plus fréquentes"
        intro="La procédure et les chances varient selon votre situation exacte. Voici ce que cela change concrètement."
        kicker="En pratique"
        muted
      >
        <BulletList items={concreteCases} />
      </Section>

      <Section
        title="Avant de partir"
        intro="Un départ bien préparé change tout. Voici les trois points à vérifier avant de prendre une décision."
        kicker="3 étapes clés"
      >
        <Steps items={beforeLeaving} />
      </Section>

      <Section
        title="Questions fréquentes"
        intro="Des réponses claires aux questions que beaucoup se posent, souvent seuls, avant de prendre une décision difficile."
        kicker="FAQ"
        muted
      >
        <Faq items={faq} />
      </Section>

      <Section
        title="Sources officielles"
        intro="Quelques références pour comprendre la logique administrative belge autour du permis unique et du séjour irrégulier."
        kicker="Références"
      >
        <CardGrid items={sourceCards} columns={3} />
      </Section>

      <CtaBanner
        title="Votre situation mérite une lecture attentive — pas une réponse générique"
        text="Cette page donne une information générale et pédagogique. Si vous envisagez un retour dans votre pays pour entamer une procédure de permis unique, nous pouvons vous aider à trouver un employeur correspondant à votre profil — et le cabinet d’avocats lexpat.be peut vous accompagner sur les aspects juridiques."
        primaryHref="/contact"
        primaryLabel="Parler de ma situation"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir l’accompagnement juridique"
      />
    </>
  );
}
