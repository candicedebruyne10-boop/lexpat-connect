import { BulletList, CtaBanner, Hero, Section, Steps } from "../../components/Sections";

export default function AccompagnementPage() {
  return (
    <>
      <Hero badge="Cabinet LEXPAT" title="Un accompagnement juridique pour securiser le recrutement international en Belgique" description="Lorsque la mise en relation debouche sur un projet concret d'embauche ou de mobilite, le cabinet LEXPAT peut intervenir sur les aspects juridiques lies au travail et au sejour en Belgique." primaryHref="/contact" primaryLabel="Prendre rendez-vous" secondaryHref="/employeurs" secondaryLabel="Revenir a la plateforme" />
      <Section title="Le role du cabinet LEXPAT" intro="LEXPAT Connect est une plateforme de mise en relation. Le cabinet LEXPAT intervient dans un cadre distinct pour accompagner juridiquement les employeurs et les travailleurs lorsque la situation le necessite.">
        <BulletList items={[
          { title: "Pour les employeurs", text: "Evaluation d'un recrutement, cadre regional applicable, permis unique, anticipation des risques administratifs." },
          { title: "Pour les travailleurs", text: "Droit au travail, situation de sejour, changement d'employeur, projet de mobilite professionnelle." },
          { title: "Pour les dossiers sensibles", text: "Analyse individualisee lorsque la plateforme ne suffit plus a repondre." }
        ]} />
      </Section>
      <Section title="Exemples d'accompagnement" muted>
        <BulletList items={[
          { title: "Permis unique", text: "Preparation, verification et securisation du dossier." },
          { title: "Immigration economique", text: "Orientation juridique adaptee au poste, a la Region et au profil du candidat." },
          { title: "Analyse prealable", text: "Verification de la faisabilite avant de lancer ou poursuivre un recrutement." },
          { title: "Conseil strategique", text: "Accompagnement employeur ou candidat selon les enjeux administratifs et contractuels." }
        ]} />
      </Section>
      <Section title="Quand contacter LEXPAT">
        <Steps items={[
          { title: "Avant de lancer un recrutement international", text: "Pour clarifier vos options et vos risques des le depart." },
          { title: "Lorsqu'un candidat est identifie", text: "Pour verifier rapidement si une embauche semble faisable juridiquement." },
          { title: "Lorsqu'une situation administrative bloque", text: "Pour eviter les erreurs de parcours et reposer le dossier sur une base serieuse." },
          { title: "Lorsqu'un dossier doit etre prepare proprement", text: "Pour passer du simple interet a une strategie juridique exploitable." }
        ]} />
      </Section>
      <CtaBanner title="Besoin d'un regard juridique sur votre situation" text="Votre force de marque se trouve ici : offrir non seulement une rencontre entre offre et demande, mais aussi un cadre juridique credible lorsque la situation l'exige." primaryHref="/contact" primaryLabel="Prendre rendez-vous" secondaryHref="/travailleurs" secondaryLabel="Voir l'espace candidats" />
    </>
  );
}
