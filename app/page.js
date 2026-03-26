import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

const primaryPaths = [
  {
    kicker: "Employeurs belges",
    title: "Clarifier un besoin de recrutement international",
    text: "Déposez un besoin structuré, précisez le métier, la région et le contexte de recrutement, puis identifiez quand un relais juridique devient nécessaire.",
    link: { href: "/employeurs", label: "Accéder à l'espace employeurs" }
  },
  {
    kicker: "Travailleurs internationaux",
    title: "Présenter un profil plus lisible et plus crédible",
    text: "Valorisez votre expérience, vos compétences, votre disponibilité et votre situation de départ pour être compris plus rapidement par un employeur belge.",
    link: { href: "/travailleurs", label: "Accéder à l'espace candidats" }
  }
];

const positioningCards = [
  {
    kicker: "Ce que fait la plateforme",
    title: "Organiser une mise en relation plus sérieuse",
    text: "LEXPAT Connect structure la rencontre entre employeurs belges et talents internationaux autour des métiers en pénurie et des réalités du marché belge."
  },
  {
    kicker: "Ce que la plateforme ne fait pas",
    title: "Ne pas promettre ce qui relève d'un dossier individuel",
    text: "La plateforme n'est ni un cabinet d'avocats ni une promesse d'autorisation automatique. Elle clarifie les parcours sans simplifier à l'excès."
  },
  {
    kicker: "Quand LEXPAT intervient",
    title: "Activer le relais juridique au bon moment",
    text: "Permis unique, droit au travail, faisabilité régionale ou sécurisation administrative: le cabinet LEXPAT intervient lorsque la mise en relation ne suffit plus."
  }
];

const reasons = [
  {
    title: "Une lecture immédiate du projet",
    text: "En quelques secondes, le visiteur comprend s'il est concerné, ce que la plateforme permet réellement et la place du cabinet LEXPAT dans le parcours."
  },
  {
    title: "Un ancrage belge clairement assumé",
    text: "Bruxelles, Wallonie, Flandre: le site ne gomme pas les différences régionales et donne un cadre plus crédible au recrutement international."
  },
  {
    title: "Un design plus institutionnel et rassurant",
    text: "Le ton visuel cherche la clarté, la compétence et la sobriété, sans effet startup gadget ni mise en scène trop technologique."
  },
  {
    title: "Un projet utile pour les deux publics",
    text: "Les employeurs trouvent un cadre plus lisible. Les candidats trouvent une manière plus sérieuse de rendre leur profil visible."
  }
];

const steps = [
  {
    title: "L'employeur cadre le besoin",
    text: "Le poste, la région, le type de contrat et le contexte du recrutement sont précisés dès l'entrée."
  },
  {
    title: "Le candidat présente un profil exploitable",
    text: "Expérience, compétences, langues, disponibilité et situation administrative deviennent plus faciles à lire."
  },
  {
    title: "La plateforme facilite la prise de contact",
    text: "LEXPAT Connect agit comme point d'entrée sérieux pour structurer une mise en relation utile."
  },
  {
    title: "LEXPAT prend le relais si besoin",
    text: "Dès qu'un enjeu juridique concret apparaît, le cabinet intervient dans un cadre distinct et clairement identifié."
  }
];

const regions = [
  {
    kicker: "Bruxelles-Capitale",
    title: "Une lecture plus prudente des mécanismes régionaux",
    text: "Les métiers en pénurie constituent un point d'appui, mais ils doivent être lus avec nuance dans le contexte bruxellois."
  },
  {
    kicker: "Wallonie",
    title: "Des besoins parfois plus directement structurants",
    text: "La liste wallonne aide à clarifier certains recrutements, à condition de conserver une lecture précise de chaque dossier."
  },
  {
    kicker: "Flandre",
    title: "Une présentation rigoureuse des fonctions concernées",
    text: "Certaines fonctions y sont décrites de manière plus technique et doivent être présentées avec précision pour rester crédibles."
  }
];

const faqs = [
  {
    question: "LEXPAT Connect est-elle une agence de recrutement ?",
    answer: "Non. LEXPAT Connect est une plateforme de mise en relation entre employeurs belges et travailleurs internationaux."
  },
  {
    question: "Le cabinet LEXPAT intervient-il automatiquement dans chaque dossier ?",
    answer: "Non. Le cabinet intervient lorsque la situation soulève un enjeu juridique concret: permis unique, droit au travail, analyse régionale ou sécurisation administrative."
  },
  {
    question: "La plateforme garantit-elle une autorisation de travail ?",
    answer: "Non. La présence d'un métier sur une liste régionale ou sur la plateforme ne remplace jamais l'analyse individualisée d'un dossier."
  },
  {
    question: "Qui est concerné en priorité ?",
    answer: "Les employeurs belges qui recrutent dans des métiers en tension, et les travailleurs internationaux qui souhaitent présenter un profil professionnel clair et sérieux."
  }
];

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de mise en relation et relais juridique en Belgique"
        title={
          <>
            Recruter des talents internationaux en Belgique,
            <span className="block text-[#57b7af]">avec une lecture plus claire et plus crédible</span>
          </>
        }
        description="LEXPAT Connect aide les employeurs belges à structurer leurs recrutements dans les métiers en pénurie, permet aux travailleurs internationaux de présenter un profil sérieux, et oriente vers le cabinet LEXPAT lorsqu'un accompagnement juridique devient nécessaire."
        primaryHref="/employeurs"
        primaryLabel="Je suis employeur"
        secondaryHref="/travailleurs"
        secondaryLabel="Je suis candidat"
        note="La plateforme facilite la mise en relation. Les prestations juridiques relèvent séparément du cabinet LEXPAT."
        stats={[
          { value: "2 parcours", label: "Une entrée claire pour les employeurs et les candidats" },
          { value: "3 régions", label: "Une lecture attentive des réalités belges" },
          { value: "1 relais juridique", label: "Une continuité possible avec le cabinet LEXPAT" }
        ]}
        panels={[
          {
            kicker: "En pratique",
            title: "Ce que le site permet dès l'arrivée",
            text: "Comprendre qui est concerné, ce que la plateforme fait réellement, et à quel moment le juridique doit être traité séparément."
          },
          {
            kicker: "Positionnement",
            title: "Un projet sérieux, sans surpromesse",
            text: "Le site privilégie la clarté, la précision et la confiance, plutôt qu'un discours technologique trop démonstratif."
          }
        ]}
      />

      <Section
        title="Deux entrées principales, deux parcours très lisibles"
        intro="Le site doit guider immédiatement vers le bon espace, sans ambiguïté, avec une proposition de valeur claire pour chaque public."
        kicker="Parcours"
      >
        <CardGrid columns={2} items={primaryPaths} />
      </Section>

      <Section
        title="Une plateforme pensée pour être comprise en quelques secondes"
        intro="Le positionnement doit être net: qui est concerné, ce que la plateforme fait, ce qu'elle ne fait pas, et quand le cabinet LEXPAT intervient juridiquement."
        kicker="Positionnement"
        muted
      >
        <CardGrid items={positioningCards} />
      </Section>

      <Section
        title="Pourquoi cette approche inspire davantage confiance"
        intro="La crédibilité du projet repose autant sur le fond métier que sur une manière plus calme, plus claire et plus institutionnelle de le présenter."
        kicker="Crédibilité"
      >
        <CardGrid items={reasons} columns={2} />
      </Section>

      <Section
        title="Comment ça fonctionne"
        intro="Le parcours reste volontairement sobre. Il ne prétend pas automatiser des décisions complexes: il structure les étapes et prépare une mise en relation plus utile."
        kicker="Méthode"
        muted
      >
        <Steps items={steps} />
      </Section>

      <Section
        title="Les métiers en pénurie restent un point d'entrée stratégique"
        intro="Ils aident à structurer les opportunités visibles sur la plateforme, mais ils n'évitent jamais une lecture régionale ni une analyse individualisée lorsque la situation l'exige."
        kicker="Belgique"
      >
        <CardGrid items={regions} />
        <div className="mt-6 rounded-[28px] border border-[#d9ece9] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="font-semibold text-[#1d3b8b]">À retenir</p>
          <p className="mt-2">
            Un métier en pénurie ne garantit pas, à lui seul, la faisabilité d'un recrutement international ni l'obtention d'une autorisation de travail. Le contexte du poste, la région compétente et la situation du candidat restent déterminants.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Quand la mise en relation ne suffit plus, le relais juridique doit être immédiat et parfaitement lisible"
        text="Permis unique, droit au travail, sécurisation administrative, faisabilité régionale: la valeur du projet repose aussi sur la clarté avec laquelle il oriente vers le cabinet LEXPAT."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Parler à LEXPAT"
      />

      <Section
        title="Questions fréquentes"
        intro="La FAQ sert à rassurer, à cadrer le rôle de la plateforme et à rappeler les limites normales d'un projet de mise en relation dans ce domaine."
        kicker="FAQ"
        muted
      >
        <Faq items={faqs} />
      </Section>
    </>
  );
}
