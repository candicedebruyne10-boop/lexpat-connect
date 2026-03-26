import { BulletList, CtaBanner, Hero, Section, Steps } from "../../components/Sections";

const legalRoles = [
  {
    title: "Pour les employeurs",
    text: "Évaluer la faisabilité d'un recrutement, lire le cadre régional applicable, préparer un permis unique et anticiper les risques administratifs."
  },
  {
    title: "Pour les travailleurs internationaux",
    text: "Comprendre une situation de séjour, un droit au travail, un changement d'employeur ou un projet de mobilité professionnelle."
  },
  {
    title: "Pour les dossiers qui dépassent la simple mise en relation",
    text: "Intervenir lorsque la plateforme ne suffit plus et qu'une analyse individualisée devient nécessaire."
  }
];

const legalExamples = [
  {
    title: "Permis unique",
    text: "Préparation, vérification et sécurisation du dossier lorsque le recrutement l'exige."
  },
  {
    title: "Immigration économique",
    text: "Orientation juridique adaptée à la région, au poste, au niveau de qualification et à la situation du candidat."
  },
  {
    title: "Analyse préalable d'un recrutement",
    text: "Lecture de la faisabilité avant d'engager ou de poursuivre une embauche internationale."
  },
  {
    title: "Conseil stratégique",
    text: "Accompagnement ciblé pour un employeur ou un candidat lorsque les enjeux administratifs doivent être clarifiés."
  }
];

export default function AccompagnementPage() {
  return (
    <>
      <Hero
        badge="Cabinet LEXPAT"
        title={
          <>
            Un accompagnement juridique pour sécuriser
            <span className="block text-[#57b7af]">le recrutement international en Belgique</span>
          </>
        }
        description="Lorsque la mise en relation débouche sur un projet concret d'embauche ou de mobilité, le cabinet LEXPAT peut intervenir sur les aspects juridiques liés au travail et au séjour en Belgique."
        primaryHref="/contact"
        primaryLabel="Prendre rendez-vous"
        secondaryHref="/employeurs"
        secondaryLabel="Revenir à la plateforme"
        note="LEXPAT Connect et le cabinet LEXPAT sont complémentaires, mais leurs rôles restent distincts."
        stats={[
          { value: "Employeurs", label: "Pour sécuriser un recrutement international ou un permis unique" },
          { value: "Travailleurs", label: "Pour clarifier une situation de séjour ou de droit au travail" },
          { value: "Belgique", label: "Avec une lecture attentive des cadres régionaux applicables" }
        ]}
      />

      <Section
        title="Quand le cabinet LEXPAT intervient"
        intro="LEXPAT Connect facilite la mise en relation. Le cabinet LEXPAT intervient lorsque le dossier soulève une vraie question juridique qui doit être traitée séparément."
        kicker="Rôle du cabinet"
      >
        <BulletList items={legalRoles} />
      </Section>

      <Section
        title="Exemples d'accompagnement"
        intro="Chaque dossier dépend de faits précis. Le cabinet intervient pour analyser, orienter et sécuriser la situation lorsqu'un cadre juridique clair devient nécessaire."
        kicker="Interventions"
        muted
      >
        <BulletList items={legalExamples} />
      </Section>

      <Section
        title="À quel moment prendre contact"
        intro="Un échange utile intervient souvent au moment où une situation concrète doit être vérifiée, sécurisée ou clarifiée avant d'aller plus loin."
        kicker="Moments clés"
      >
        <Steps
          items={[
            {
              title: "Avant de lancer un recrutement international",
              text: "Pour comprendre le cadre applicable, les options possibles et les points de vigilance dès le départ."
            },
            {
              title: "Lorsqu'un candidat est identifié",
              text: "Pour vérifier rapidement si le recrutement semble juridiquement envisageable dans la situation donnée."
            },
            {
              title: "Lorsqu'une situation administrative bloque",
              text: "Pour éviter les erreurs de parcours et reposer le dossier sur une base plus solide."
            },
            {
              title: "Lorsqu'un dossier doit être préparé sérieusement",
              text: "Pour passer d'un simple projet d'embauche à une démarche plus sécurisée sur le plan juridique."
            }
          ]}
        />
      </Section>

      <CtaBanner
        title="Besoin d'un regard juridique sur une situation concrète"
        text="Le cabinet LEXPAT peut intervenir lorsque le recrutement international, le droit au travail ou la situation de séjour demandent une lecture individualisée et rigoureuse."
        primaryHref="/contact"
        primaryLabel="Prendre rendez-vous"
        secondaryHref="/travailleurs"
        secondaryLabel="Voir l'espace candidats"
      />
    </>
  );
}
