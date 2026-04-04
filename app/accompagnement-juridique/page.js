import { BulletList, CtaBanner, Hero, Section, Steps } from "../../components/Sections";

const legalRoles = [
  {
    title: "Pour les employeurs",
    text: "Sécuriser un recrutement international, analyser un permis unique ou vérifier la faisabilité d'un dossier."
  },
  {
    title: "Pour les travailleurs internationaux",
    text: "Clarifier une situation de séjour, de droit au travail ou un projet professionnel en Belgique."
  },
  {
    title: "Pour les situations sensibles",
    text: "Intervenir lorsque la mise en relation a déjà eu lieu et qu'un cadre juridique devient nécessaire."
  }
];

const legalExamples = [
  {
    title: "Permis unique",
    text: "Lecture, préparation et sécurisation du dossier lorsque le recrutement l'exige."
  },
  {
    title: "Immigration économique",
    text: "Analyse adaptée à la région, au poste, au niveau de qualification et au profil du candidat."
  },
  {
    title: "Analyse préalable",
    text: "Vérifier la faisabilité d'un projet avant d'aller plus loin dans le recrutement."
  }
];

const legalSteps = [
  {
    title: "Une mise en relation existe déjà",
    text: "Le besoin de recrutement ou l'opportunité professionnelle est identifié."
  },
  {
    title: "Une question juridique apparaît",
    text: "Permis unique, droit au travail, immigration économique ou lecture régionale du dossier."
  },
  {
    title: "LEXPAT prend le relais",
    text: "Le cabinet intervient alors dans un cadre distinct pour analyser et sécuriser la situation."
  }
];

export default function AccompagnementPage() {
  return (
    <>
      <Hero
        badge="Cabinet LEXPAT"
        title={
          <>
            Un relais juridique clair
            <span className="block text-[#57b7af]">lorsque la mise en relation ne suffit plus</span>
          </>
        }
        description="LEXPAT Connect sert d'abord au matching. Lorsque le recrutement international soulève une vraie question de permis unique, de droit au travail ou d'immigration économique, le cabinet LEXPAT peut ensuite intervenir."
        primaryHref="/contact"
        primaryLabel="Prendre contact"
        secondaryHref="/"
        secondaryLabel="Revenir à la plateforme"
        note="Le juridique n'est pas l'entrée principale du site. Il intervient au moment utile, lorsque le dossier l'exige réellement."
        stats={[
          { value: "Permis unique", label: "Pour sécuriser un recrutement qui a déjà pris forme" },
          { value: "Travail et séjour", label: "Pour clarifier une situation administrative concrète" },
          { value: "Belgique", label: "Avec une lecture attentive du cadre régional applicable" }
        ]}
      />

      <Section
        title="Quand faire intervenir le cabinet"
        intro="Le rôle du cabinet commence là où la plateforme s'arrête : quand une situation concrète doit être analysée juridiquement."
        kicker="Relais juridique"
      >
        <BulletList items={legalRoles} />
      </Section>

      <Section
        title="Les sujets les plus fréquents"
        intro="Le cabinet intervient sur des dossiers ciblés, directement liés à une embauche, une opportunité ou une situation administrative précise."
        kicker="Interventions"
        muted
      >
        <BulletList items={legalExamples} />
      </Section>

      <Section
        title="Comment le relais se fait"
        intro="Une fois le besoin de matching couvert, l'accompagnement juridique peut prendre le relais de façon claire et séparée."
        kicker="3 étapes"
      >
        <Steps items={legalSteps} />
      </Section>

      <CtaBanner
        title="Besoin d'un regard juridique sur une situation concrète"
        text="Si un recrutement ou une opportunité professionnelle soulève une vraie question de séjour, de permis unique ou de droit au travail, le cabinet LEXPAT peut intervenir."
        primaryHref="/contact"
        primaryLabel="Prendre contact"
        secondaryHref="/employeurs"
        secondaryLabel="Revenir au matching"
      />
    </>
  );
}
