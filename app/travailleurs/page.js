import { BulletList, CtaBanner, Faq, FormCard, Hero, Section, Steps } from "../../components/Sections";

export default function TravailleursPage() {
  return (
    <>
      <Hero badge="Espace Travailleurs" title="Valorisez votre profil pour travailler en Belgique" description="LEXPAT Connect permet aux travailleurs internationaux de présenter leurs compétences et d'accéder a des opportunités professionnelles en Belgique, en particulier dans les métiers en pénurie." primaryHref="#formulaire" primaryLabel="Créer mon profil" secondaryHref="/metiers-en-penurie" secondaryLabel="Comprendre les opportunités" />
      <Section title="Pourquoi créer votre profil" intro="LEXPAT Connect s'adresse aux personnes qui souhaitent travailler en Belgique et qui disposent d'une expérience, d'une qualification ou d'un savoir-faire recherché par des employeurs belges.">
        <BulletList items={[
          { title: "Gagner en visibilité", text: "Votre profil peut être consulte dans le cadre de besoins de recrutement ciblés." },
          { title: "Présenter clairement vos compétences", text: "Parcours, expérience, langues et disponibilité sont mis en avant." },
          { title: "Accéder a des opportunités belges", text: "La plateforme est structuree autour du marché belge et de ses réalités regionales." },
          { title: "Être oriente si une question juridique se pose", text: "Le cabinet LEXPAT peut intervenir séparément si necessaire." }
        ]} />
      </Section>
      <Section title="Comment utiliser LEXPAT Connect" muted>
        <Steps items={[
          { title: "Vous créez votre profil", text: "Coordonnées, expérience, métiers visés, compétences et disponibilité." },
          { title: "Vous précisez votre situation", text: "Localisation, mobilité, statut administratif ou besoins d'information." },
          { title: "Votre profil peut être rapproche d'un besoin employeur", text: "La plateforme facilite la mise en relation lorsqu'un profil correspond a une demande." },
          { title: "Vous etes oriente si besoin", text: "Les questions d'immigration ou d'autorisation de travail peuvent être traitees par le cabinet." }
        ]} />
      </Section>
      <Section title="Créer mon profil" intro="Le statut indique ne vaut jamais validation juridique. Il sert a mieux comprendre votre situation de départ.">
        <div id="formulaire">
          <FormCard title="Formulaire candidat" intro="Version MVP orientée collecte utile et lisible. Les pièces et règles de traitement pourront être branchees ensuite a Supabase." buttonLabel="Envoyer mon profil" fields={[
            { label: "Nom complet", placeholder: "Prénom Nom" },
            { label: "Email", type: "email", placeholder: "votre.email@example.com" },
            { label: "Téléphone", placeholder: "+32 / +..." },
            { label: "Pays de résidence", placeholder: "Pays actuel" },
            { label: "Région ou ville souhaitée en Belgique", placeholder: "Bruxelles, Liège, Anvers..." },
            { label: "Secteur visé", placeholder: "Santé, transport, construction..." },
            { label: "Metier recherché", placeholder: "Infirmier, maçon, technicien..." },
            { label: "Disponibilite", placeholder: "Immédiate, 1 mois, 3 mois..." },
            { label: "Langues parlées", placeholder: "Français, anglais, néerlandais..." },
            { label: "Statut administratif", type: "select", placeholder: "Sélectionnez votre statut", options: ["Permis unique", "Permis A", "Annexe 15", "Annexe 35", "Sans titre actuel", "Autre", "Je ne sais pas"] },
            { label: "Compétences principales", type: "textarea", placeholder: "Competences, diplômes, certifications, expérience...", wide: true },
            { label: "Message complémentaire", type: "textarea", placeholder: "Expliquez votre projet ou vos besoins d'information...", wide: true }
          ]} />
        </div>
      </Section>
      <CtaBanner title="Vous avez une question sur votre droit au travail ou votre séjour" text="Dans certains cas, la création d'un profil ou l'intérêt d'un employeur fait apparaître une question plus juridique : permis unique, statut de séjour, changement d'employeur, droit au travail ou installation en Belgique." primaryHref="/accompagnement-juridique" primaryLabel="Contacter le cabinet LEXPAT" secondaryHref="/contact" secondaryLabel="Nous écrire" />
      <Section title="Questions fréquentes des candidats" muted>
        <Faq items={[
          { question: "Puis-je créer un profil même si je ne suis pas encore en Belgique ?", answer: "Oui, si vous souhaitez identifier des opportunités et présenter votre parcours." },
          { question: "Dois-je déjà avoir un permis de travail pour m'inscrire ?", answer: "Non. L'inscription sur la plateforme et l'existence d'un droit au travail sont deux choses différentes." },
          { question: "Le fait d'exercer un métier en pénurie me donne-t-il automatiquement le droit de travailler en Belgique ?", answer: "Non. Cela peut faciliter certaines demarchés, mais chaque situation doit être examinée individuellement." }
        ]} />
      </Section>
    </>
  );
}
