import { BulletList, CtaBanner, Hero, Section, Steps } from "../../components/Sections";

export default function AccompagnementPage() {
  return (
    <>
      <Hero
        badge="Cabinet LEXPAT"
        title="Un accompagnement juridique pour sécuriser le recrutement international en Belgique"
        description="Lorsque la mise en relation débouche sur un projet concret d'embauche ou de mobilité, le cabinet LEXPAT peut intervenir sur les aspects juridiques liés au travail et au séjour en Belgique."
        primaryHref="/contact"
        primaryLabel="Prendre rendez-vous"
        secondaryHref="/employeurs"
        secondaryLabel="Revenir à la plateforme"
      />
      <Section
        title="Le rôle du cabinet LEXPAT"
        intro="LEXPAT Connect est une plateforme de mise en relation. Le cabinet LEXPAT intervient dans un cadre distinct pour accompagner juridiquement les employeurs et les travailleurs lorsque la situation le nécessite."
      >
        <BulletList
          items={[
            { title: "Pour les employeurs", text: "Évaluation d'un recrutement, cadre régional applicable, permis unique, anticipation des risques administratifs." },
            { title: "Pour les travailleurs", text: "Droit au travail, situation de séjour, changement d'employeur, projet de mobilité professionnelle." },
            { title: "Pour les dossiers sensibles", text: "Analyse individualisée lorsque la plateforme ne suffit plus à répondre." }
          ]}
        />
      </Section>
      <Section title="Exemples d'accompagnement" muted>
        <BulletList
          items={[
            { title: "Permis unique", text: "Préparation, vérification et sécurisation du dossier." },
            { title: "Immigration économique", text: "Orientation juridique adaptée au poste, à la Région et au profil du candidat." },
            { title: "Analyse préalable", text: "Vérification de la faisabilité avant de lancer ou poursuivre un recrutement." },
            { title: "Conseil stratégique", text: "Accompagnement employeur ou candidat selon les enjeux administratifs et contractuels." }
          ]}
        />
      </Section>
      <Section title="Quand contacter LEXPAT">
        <Steps
          items={[
            { title: "Avant de lancer un recrutement international", text: "Pour clarifier vos options et vos risques dès le départ." },
            { title: "Lorsqu'un candidat est identifié", text: "Pour vérifier rapidement si une embauche semble faisable juridiquement." },
            { title: "Lorsqu'une situation administrative bloque", text: "Pour éviter les erreurs de parcours et reposer le dossier sur une base sérieuse." },
            { title: "Lorsqu'un dossier doit être préparé proprement", text: "Pour passer du simple intérêt à une stratégie juridique exploitable." }
          ]}
        />
      </Section>
      <CtaBanner
        title="Besoin d'un regard juridique sur votre situation"
        text="Votre force de marque se trouve ici : offrir non seulement une rencontre entre offre et demande, mais aussi un cadre juridique crédible lorsque la situation l'exige."
        primaryHref="/contact"
        primaryLabel="Prendre rendez-vous"
        secondaryHref="/travailleurs"
        secondaryLabel="Voir l'espace candidats"
      />
    </>
  );
}
