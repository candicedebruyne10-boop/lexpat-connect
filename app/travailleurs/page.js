import { BulletList, CtaBanner, Faq, FormCard, Hero, Section, Steps } from "../../components/Sections";

export default function TravailleursPage() {
  return (
    <>
      <Hero badge="Espace Travailleurs" title="Valorisez votre profil pour travailler en Belgique" description="LEXPAT Connect permet aux travailleurs internationaux de presenter leurs competences et d'acceder a des opportunites professionnelles en Belgique, en particulier dans les metiers en penurie." primaryHref="#formulaire" primaryLabel="Creer mon profil" secondaryHref="/metiers-en-penurie" secondaryLabel="Comprendre les opportunites" />
      <Section title="Pourquoi creer votre profil" intro="LEXPAT Connect s'adresse aux personnes qui souhaitent travailler en Belgique et qui disposent d'une experience, d'une qualification ou d'un savoir-faire recherche par des employeurs belges.">
        <BulletList items={[
          { title: "Gagner en visibilite", text: "Votre profil peut etre consulte dans le cadre de besoins de recrutement cibles." },
          { title: "Presenter clairement vos competences", text: "Parcours, experience, langues et disponibilite sont mis en avant." },
          { title: "Acceder a des opportunites belges", text: "La plateforme est structuree autour du marche belge et de ses realites regionales." },
          { title: "Etre oriente si une question juridique se pose", text: "Le cabinet LEXPAT peut intervenir separement si necessaire." }
        ]} />
      </Section>
      <Section title="Comment utiliser LEXPAT Connect" muted>
        <Steps items={[
          { title: "Vous creez votre profil", text: "Coordonnees, experience, metiers vises, competences et disponibilite." },
          { title: "Vous precisez votre situation", text: "Localisation, mobilite, statut administratif ou besoins d'information." },
          { title: "Votre profil peut etre rapproche d'un besoin employeur", text: "La plateforme facilite la mise en relation lorsqu'un profil correspond a une demande." },
          { title: "Vous etes oriente si besoin", text: "Les questions d'immigration ou d'autorisation de travail peuvent etre traitees par le cabinet." }
        ]} />
      </Section>
      <Section title="Creer mon profil" intro="Le statut indique ne vaut jamais validation juridique. Il sert a mieux comprendre votre situation de depart.">
        <div id="formulaire">
          <FormCard title="Formulaire candidat" intro="Version MVP orientee collecte utile et lisible. Les pieces et regles de traitement pourront etre branchees ensuite a Supabase." buttonLabel="Envoyer mon profil" fields={[
            { label: "Nom complet", placeholder: "Prenom Nom" },
            { label: "Email", type: "email", placeholder: "votre.email@example.com" },
            { label: "Telephone", placeholder: "+32 / +..." },
            { label: "Pays de residence", placeholder: "Pays actuel" },
            { label: "Region ou ville souhaitee en Belgique", placeholder: "Bruxelles, Liege, Anvers..." },
            { label: "Secteur vise", placeholder: "Sante, transport, construction..." },
            { label: "Metier recherche", placeholder: "Infirmier, macon, technicien..." },
            { label: "Disponibilite", placeholder: "Immediate, 1 mois, 3 mois..." },
            { label: "Langues parlees", placeholder: "Francais, anglais, neerlandais..." },
            { label: "Statut administratif", type: "select", placeholder: "Selectionnez votre statut", options: ["Permis unique", "Permis A", "Annexe 15", "Annexe 35", "Sans titre actuel", "Autre", "Je ne sais pas"] },
            { label: "Competences principales", type: "textarea", placeholder: "Competences, diplomes, certifications, experience...", wide: true },
            { label: "Message complementaire", type: "textarea", placeholder: "Expliquez votre projet ou vos besoins d'information...", wide: true }
          ]} />
        </div>
      </Section>
      <CtaBanner title="Vous avez une question sur votre droit au travail ou votre sejour" text="Dans certains cas, la creation d'un profil ou l'interet d'un employeur fait apparaitre une question plus juridique : permis unique, statut de sejour, changement d'employeur, droit au travail ou installation en Belgique." primaryHref="/accompagnement-juridique" primaryLabel="Contacter le cabinet LEXPAT" secondaryHref="/contact" secondaryLabel="Nous ecrire" />
      <Section title="Questions frequentes des candidats" muted>
        <Faq items={[
          { question: "Puis-je creer un profil meme si je ne suis pas encore en Belgique ?", answer: "Oui, si vous souhaitez identifier des opportunites et presenter votre parcours." },
          { question: "Dois-je deja avoir un permis de travail pour m'inscrire ?", answer: "Non. L'inscription sur la plateforme et l'existence d'un droit au travail sont deux choses differentes." },
          { question: "Le fait d'exercer un metier en penurie me donne-t-il automatiquement le droit de travailler en Belgique ?", answer: "Non. Cela peut faciliter certaines demarches, mais chaque situation doit etre examinee individuellement." }
        ]} />
      </Section>
    </>
  );
}
