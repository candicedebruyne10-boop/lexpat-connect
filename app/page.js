import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

const primaryPaths = [
  {
    kicker: "Employeurs belges",
    title: "Identifier plus vite les profils pertinents",
    text: "Déposez un besoin structuré, clarifiez le poste, la région et les conditions de recrutement, puis activez le relais juridique si la situation l'exige.",
    link: { href: "/employeurs", label: "Accéder à l'espace employeurs" }
  },
  {
    kicker: "Travailleurs internationaux",
    title: "Rendre votre profil plus lisible et plus sérieux",
    text: "Présentez vos compétences, votre disponibilité et votre situation de départ pour être visible auprès d'employeurs belges ouverts au recrutement international.",
    link: { href: "/travailleurs", label: "Accéder à l'espace candidats" }
  }
];

const positioningCards = [
  {
    kicker: "Ce que fait la plateforme",
    title: "Structurer la mise en relation",
    text: "LEXPAT Connect aide les employeurs et les candidats à se rencontrer dans un cadre plus lisible, centré sur les métiers en pénurie et le marché belge."
  },
  {
    kicker: "Ce que la plateforme ne fait pas",
    title: "Ne pas remplacer l'analyse juridique",
    text: "La plateforme n'est ni une agence de recrutement traditionnelle ni un cabinet d'avocats. Elle n'a pas vocation à promettre ce qui dépend d'une situation individuelle."
  },
  {
    kicker: "Quand LEXPAT intervient",
    title: "Activer le relais juridique au bon moment",
    text: "Permis unique, autorisation de travail, faisabilité régionale ou sécurisation administrative : le cabinet LEXPAT prend le relais lorsque le dossier sort du simple cadre de mise en relation."
  }
];

const reasons = [
  {
    title: "Un langage clair pour des sujets complexes",
    text: "Le site est pensé pour être compris rapidement par un employeur, un candidat et un interlocuteur juridique, sans effet de surpromesse ni jargon inutile."
  },
  {
    title: "Un ancrage belge assumé",
    text: "Le projet tient compte des réalités de Bruxelles, de la Wallonie et de la Flandre, au lieu de lisser artificiellement les différences administratives."
  },
  {
    title: "Une plateforme crédible avant d'être démonstrative",
    text: "L'accent est mis sur la précision du besoin, la qualité du profil présenté et le moment où un accompagnement juridique distinct devient nécessaire."
  },
  {
    title: "Une image sérieuse pour les deux publics",
    text: "Les employeurs doivent sentir une méthode fiable. Les travailleurs doivent sentir un cadre respectueux, professionnel et rassurant."
  }
];

const steps = [
  {
    title: "L'employeur précise son besoin",
    text: "Fonction, région, contrat, niveau de qualification et contexte du recrutement sont posés dès le départ."
  },
  {
    title: "Le candidat construit un profil exploitable",
    text: "Parcours, compétences, disponibilité, langues et situation administrative deviennent plus faciles à comprendre."
  },
  {
    title: "La plateforme facilite la mise en relation",
    text: "Le site sert de point d'entrée professionnel et lisible pour initier des prises de contact sérieuses."
  },
  {
    title: "Le cabinet LEXPAT intervient si nécessaire",
    text: "Dès qu'une question juridique concrète apparaît, le relais est clairement identifié et présenté séparément."
  }
];

const regions = [
  {
    kicker: "Bruxelles-Capitale",
    title: "Lecture nuancée des listes et des pratiques",
    text: "Le recrutement dans les métiers en pénurie suppose une lecture attentive des mécanismes régionaux et de leur portée concrète."
  },
  {
    kicker: "Wallonie",
    title: "Des catégories plus directement mobilisables",
    text: "La liste wallonne permet souvent de structurer plus rapidement les besoins employeurs, à condition de garder une lecture précise du dossier."
  },
  {
    kicker: "Flandre",
    title: "Une logique plus fonctionnelle sur certains métiers",
    text: "Plusieurs fonctions y sont décrites de manière technique et doivent être présentées de façon rigoureuse pour rester crédibles."
  }
];

const faqs = [
  {
    question: "LEXPAT Connect est-elle une agence de recrutement ?",
    answer: "Non. LEXPAT Connect est une plateforme de mise en relation entre employeurs belges et travailleurs internationaux."
  },
  {
    question: "Le cabinet LEXPAT intervient-il automatiquement dans chaque dossier ?",
    answer: "Non. Le cabinet intervient lorsque la situation soulève un enjeu juridique concret : permis unique, droit au travail, analyse régionale ou sécurisation administrative."
  },
  {
    question: "La plateforme garantit-elle l'obtention d'une autorisation de travail ?",
    answer: "Non. La présence d'un métier sur une liste régionale ou sur la plateforme ne remplace jamais l'analyse individualisée d'un dossier."
  },
  {
    question: "Qui est concerné en priorité ?",
    answer: "Les employeurs belges qui souhaitent recruter dans des métiers en tension, et les travailleurs internationaux qui veulent présenter un profil professionnel sérieux et lisible."
  }
];

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de mise en relation, recrutement international et relais juridique"
        title="Recruter à l'international en Belgique, avec plus de clarté, de méthode et de sécurité"
        description="LEXPAT Connect aide les employeurs belges à structurer leurs besoins de recrutement dans les métiers en pénurie, permet aux travailleurs internationaux de présenter un profil sérieux, et active le relais juridique du cabinet LEXPAT lorsque la situation l'exige."
        primaryHref="/employeurs"
        primaryLabel="Je suis employeur"
        secondaryHref="/travailleurs"
        secondaryLabel="Je suis candidat"
        note="La plateforme facilite la mise en relation. Les prestations juridiques relèvent séparément du cabinet LEXPAT."
        stats={[
          { value: "2 parcours", label: "Une entrée claire pour les employeurs et les candidats" },
          { value: "3 régions", label: "Une lecture attentive des réalités belges" },
          { value: "1 relais", label: "Un accompagnement juridique mobilisable au bon moment" }
        ]}
        panels={[
          {
            kicker: "En 5 secondes",
            title: "Ce que la plateforme permet",
            text: "Clarifier un besoin employeur, présenter un profil candidat et faire comprendre immédiatement quand un sujet doit être traité juridiquement."
          },
          {
            kicker: "Positionnement",
            title: "Ce que la plateforme ne prétend pas faire",
            text: "Ni promesse technique excessive, ni raccourci administratif. Le projet mise sur la lisibilité, la crédibilité et la qualité de l'orientation."
          }
        ]}
      />

      <Section
        title="Deux entrées principales, deux logiques de conversion"
        intro="Dès l'arrivée sur le site, chacun doit comprendre où cliquer, ce qu'il va trouver et pourquoi la plateforme peut lui être utile."
        kicker="Parcours"
      >
        <CardGrid columns={2} items={primaryPaths} />
      </Section>

      <Section
        title="Une plateforme conçue pour être comprise rapidement"
        intro="Le positionnement doit être évident en quelques secondes : qui est concerné, ce que fait la plateforme, ce qu'elle ne fait pas et quand le cabinet LEXPAT intervient."
        kicker="Positionnement"
        muted
      >
        <CardGrid items={positioningCards} />
      </Section>

      <Section
        title="Pourquoi LEXPAT Connect inspire davantage confiance"
        intro="Le projet doit parler à la fois aux entreprises, aux candidats et à toute personne attentive aux enjeux juridiques du recrutement international."
        kicker="Crédibilité"
      >
        <CardGrid items={reasons} columns={2} />
      </Section>

      <Section
        title="Comment ça fonctionne"
        intro="Le parcours reste volontairement sobre. Le site ne survend pas une mécanique algorithmique ; il clarifie les étapes et prépare une mise en relation plus utile."
        kicker="Méthode"
        muted
      >
        <Steps items={steps} />
      </Section>

      <Section
        title="Les métiers en pénurie restent un point d'entrée stratégique"
        intro="Ils aident à structurer les opportunités visibles sur la plateforme, mais ils ne dispensent jamais d'une lecture régionale ni d'une analyse individualisée lorsque le dossier l'exige."
        kicker="Belgique"
      >
        <CardGrid items={regions} />
        <div className="mt-6 rounded-[28px] border border-amber-200/80 bg-amber-50/80 p-6 text-sm leading-7 text-slate shadow-soft">
          <p className="font-semibold text-ink">À retenir</p>
          <p className="mt-2">
            Un métier en pénurie ne garantit pas, à lui seul, la faisabilité d'un recrutement international ni l'obtention d'une autorisation de travail. Le contexte du poste, la région compétente et la situation du candidat restent déterminants.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Quand la mise en relation ne suffit plus, le relais juridique doit être immédiat et clair"
        text="Permis unique, droit au travail, sécurisation administrative, faisabilité régionale : la valeur du projet repose aussi sur sa capacité à faire comprendre le moment où le cabinet LEXPAT doit intervenir dans un cadre distinct."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Parler à LEXPAT"
      />

      <Section
        title="Questions fréquentes"
        intro="La FAQ doit rassurer sans promettre excessivement. Elle sert à cadrer le rôle de la plateforme et à clarifier la place du cabinet."
        kicker="FAQ"
        muted
      >
        <Faq items={faqs} />
      </Section>
    </>
  );
}
