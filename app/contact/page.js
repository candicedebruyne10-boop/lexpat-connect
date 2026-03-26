import { BulletList, Hero, Section } from "../../components/Sections";
import FormCard from "../../components/FormCard";

export default function ContactPage() {
  return (
    <>
      <Hero
        badge="Contact"
        title={
          <>
            Une question sur la plateforme ou sur le cabinet,
            <span className="block text-[#57b7af]">commencez ici</span>
          </>
        }
        description="Cette page vous permet de nous écrire pour une question employeur, une question candidat, une demande liée au cabinet LEXPAT ou une demande plus générale."
        primaryHref="#formulaire"
        primaryLabel="Nous écrire"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir le cadre juridique"
        note="Selon votre besoin, votre message pourra être orienté vers la plateforme LEXPAT Connect ou vers le cabinet LEXPAT."
      />

      <Section
        title="Nous écrire"
        intro="Décrivez votre situation ou votre question pour permettre une première lecture claire de votre besoin."
        kicker="Formulaire"
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire de contact"
            intro="Employeur, candidat, consultation juridique ou partenariat: choisissez le motif de votre demande et décrivez votre situation."
            buttonLabel="Envoyer le message"
            formType="contact"
            fields={[
              { label: "Nom complet", placeholder: "Prénom Nom" },
              { label: "Email", type: "email", placeholder: "votre.email@example.com" },
              { label: "Téléphone", placeholder: "+32 ..." },
              { label: "Type de demande", type: "select", placeholder: "Sélectionnez votre besoin", options: ["Question employeur", "Question candidat", "Consultation juridique", "Partenariat", "Autre"] },
              { label: "Message", type: "textarea", placeholder: "Expliquez votre situation ou votre question...", wide: true }
            ]}
          />
        </div>
      </Section>

      <Section
        title="Avant d'écrire"
        intro="Quelques points utiles pour bien comprendre le rôle de chaque espace."
        kicker="Repères"
        muted
      >
        <BulletList
          items={[
            {
              title: "La plateforme facilite la mise en relation",
              text: "LEXPAT Connect sert à structurer un besoin employeur ou à présenter un profil candidat de manière plus claire."
            },
            {
              title: "Le cabinet LEXPAT intervient pour le juridique",
              text: "Les questions de permis unique, de droit au travail, de séjour ou de faisabilité régionale relèvent du cabinet dans un cadre distinct."
            },
            {
              title: "Les informations légales et RGPD devront être finalisées avant déploiement public définitif",
              text: "La structure du site est en place, mais les mentions complètes, les cookies et les informations de traitement devront être complétés avant une diffusion finale."
            }
          ]}
        />
      </Section>
    </>
  );
}
