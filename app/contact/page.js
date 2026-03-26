import { FormCard, Hero, Section } from "../../components/Sections";

export default function ContactPage() {
  return (
    <>
      <Hero
        badge="Contact"
        title="Une question sur la plateforme ou sur le cabinet"
        description="Cette page sert de point d'entrée commun. Ensuite, le besoin peut être redirigé vers la plateforme LEXPAT Connect ou vers le cabinet LEXPAT."
        primaryHref="#formulaire"
        primaryLabel="Nous écrire"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir le cadre juridique"
      />
      <Section title="Nous écrire" intro="Version MVP du point de contact, à relier ensuite à Resend, Supabase ou à votre outil de traitement.">
        <div id="formulaire">
          <FormCard
            title="Formulaire de contact"
            intro="Le tri du besoin pourra être automatisé ensuite : plateforme, recrutement employeur, candidature ou consultation juridique."
            buttonLabel="Envoyer le message"
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
      <Section title="Mentions MVP" muted>
        <div className="grid grid-2">
          <article className="card">
            <h3>Coordonnées à finaliser</h3>
            <p>
              Cette version contient une structure propre, mais les mentions légales,
              l'identité de l'éditeur, les cookies et les traitements RGPD doivent
              être complétés avant mise en ligne publique.
            </p>
          </article>
          <article className="card">
            <h3>Séparation des rôles</h3>
            <p>
              La plateforme facilite la mise en relation. Les services juridiques
              doivent être présentés comme une offre séparée du cabinet LEXPAT.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
