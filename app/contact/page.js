import { FormCard, Hero, Section } from "../../components/Sections";

export default function ContactPage() {
  return (
    <>
      <Hero badge="Contact" title="Une question sur la plateforme ou sur le cabinet" description="Cette page sert de point d'entree commun. Ensuite, le besoin peut etre redirige vers la plateforme LEXPAT Connect ou vers le cabinet LEXPAT." primaryHref="#formulaire" primaryLabel="Nous ecrire" secondaryHref="/accompagnement-juridique" secondaryLabel="Voir le cadre juridique" />
      <Section title="Nous ecrire" intro="Version MVP du point de contact, a relier ensuite a Resend, Supabase ou a votre outil de traitement.">
        <div id="formulaire">
          <FormCard title="Formulaire de contact" intro="Le tri du besoin pourra etre automatise ensuite : plateforme, recrutement employeur, candidature ou consultation juridique." buttonLabel="Envoyer le message" fields={[
            { label: "Nom complet", placeholder: "Prenom Nom" },
            { label: "Email", type: "email", placeholder: "votre.email@example.com" },
            { label: "Telephone", placeholder: "+32 ..." },
            { label: "Type de demande", type: "select", placeholder: "Selectionnez votre besoin", options: ["Question employeur", "Question candidat", "Consultation juridique", "Partenariat", "Autre"] },
            { label: "Message", type: "textarea", placeholder: "Expliquez votre situation ou votre question...", wide: true }
          ]} />
        </div>
      </Section>
      <Section title="Mentions MVP" muted>
        <div className="grid grid-2">
          <article className="card"><h3>Coordonnees a finaliser</h3><p>Cette version contient une structure propre, mais les mentions legales, l'identite de l'editeur, les cookies et les traitements RGPD doivent etre completes avant mise en ligne publique.</p></article>
          <article className="card"><h3>Separation des roles</h3><p>La plateforme facilite la mise en relation. Les services juridiques doivent etre presentes comme une offre separee du cabinet LEXPAT.</p></article>
        </div>
      </Section>
    </>
  );
}
