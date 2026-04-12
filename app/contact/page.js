import { BulletList, Hero, Section } from "../../components/Sections";
import FormCard from "../../components/FormCard";

const contactPoints = [
  {
    title: "Une question employeur",
    text: "Pour déposer un besoin, clarifier un recrutement ou comprendre comment utiliser la plateforme."
  },
  {
    title: "Une question travailleur",
    text: "Pour rendre votre profil visible, mieux présenter votre parcours ou comprendre les opportunités."
  },
  {
    title: "Une question juridique",
    text: "Pour les sujets de permis unique, droit au travail, séjour ou immigration économique."
  }
];

export default function ContactPage() {
  return (
    <>
      <Hero
        badge="Contact"
        title={
          <>
            Une question ?
            <span className="block text-[#57b7af]">Écrivez-nous, on vous répond.</span>
          </>
        }
        description="Que vous soyez employeur, travailleur ou que vous ayez une question juridique sur le permis unique ou le droit au travail — posez votre question ici et nous vous orienterons vers la bonne personne."
        primaryHref="#formulaire"
        primaryLabel="Poser ma question"
        secondaryHref="/"
        secondaryLabel="Revenir à l'accueil"
      />

      <Section
        title="Dans quel cas nous écrire"
        intro="Cette page sert de point d'entrée unique pour les questions liées à la plateforme ou au cabinet."
        kicker="Orientation"
      >
        <BulletList items={contactPoints} />
      </Section>

      <Section
        title="Poser votre question"
        intro="Décrivez votre situation le plus clairement possible pour permettre une première lecture rapide et utile."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire de contact"
            intro="Employeur, travailleur, consultation juridique ou partenariat : choisissez le bon motif et décrivez votre besoin."
            buttonLabel="Envoyer le message"
            formType="contact"
            fields={[
              { label: "Nom complet", placeholder: "Prénom Nom" },
              { label: "Email", type: "email", placeholder: "votre.email@example.com" },
              { label: "Téléphone", placeholder: "+32 ..." },
              { label: "Type de demande", type: "select", placeholder: "Sélectionnez votre besoin", options: ["Question employeur", "Question travailleur", "Consultation juridique", "Partenariat", "Autre"] },
              { label: "Message", type: "textarea", placeholder: "Expliquez votre situation ou votre question...", wide: true }
            ]}
          />
        </div>
      </Section>
    </>
  );
}
