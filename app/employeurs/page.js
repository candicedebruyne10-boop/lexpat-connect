import { BulletList, CtaBanner, Faq, FormCard, Hero, Section, Steps } from "../../components/Sections";

export default function EmployeursPage() {
  return (
    <>
      <Hero
        badge="Espace Employeurs"
        title="Recrutez des talents internationaux pour vos besoins en Belgique"
        description="LEXPAT Connect aide les employeurs belges à entrer en relation avec des travailleurs internationaux dans les métiers en pénurie, avec une possibilité d'accompagnement juridique par le cabinet LEXPAT lorsque le recrutement le nécessite."
        primaryHref="#formulaire"
        primaryLabel="Déposer un besoin de recrutement"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Contacter le cabinet LEXPAT"
      />
      <Section
        title="Recruter devient plus complexe dans certains secteurs"
        intro="Dans de nombreux métiers techniques, de soin, de construction, de transport ou de maintenance, les employeurs belges rencontrent des difficultés à recruter localement."
      >
        <BulletList
          items={[
            { title: "Pénurie de profils", text: "Certains postes restent durablement difficiles à pourvoir." },
            { title: "Manque de temps", text: "Les équipes RH et dirigeantes ont besoin d'un processus plus simple et plus lisible." },
            { title: "Cadre administratif", text: "Le recrutement international suppose parfois des démarches spécifiques qu'il faut anticiper." }
          ]}
        />
      </Section>
      <Section
        title="Une plateforme conçue pour simplifier la mise en relation"
        intro="LEXPAT Connect ne remplace pas votre processus RH interne. La plateforme agit comme un point d'entrée structuré pour identifier plus rapidement des candidatures adaptées."
        muted
      >
        <Steps
          items={[
            { title: "Vous déposez votre besoin", text: "Intitulé du poste, missions, compétences, région et conditions essentielles." },
            { title: "La plateforme facilite la visibilité", text: "La demande est structurée pour permettre un rapprochement avec des candidats pertinents." },
            { title: "Vous entrez en contact", text: "Vous identifiez les profils les plus adaptés et poursuivez les échanges." },
            { title: "Vous sécurisez si nécessaire", text: "Le cabinet LEXPAT peut intervenir sur permis unique, séjour ou analyse régionale." }
          ]}
        />
      </Section>
      <Section title="Déposer un besoin de recrutement" intro="Plus votre besoin est précis, plus la mise en relation sera pertinente." muted>
        <div id="formulaire">
          <FormCard
            title="Formulaire employeur"
            intro="Prototype de formulaire pour le MVP. Les champs correspondent à votre cadrage fonctionnel actuel."
            buttonLabel="Envoyer le besoin"
            fields={[
              { label: "Nom du contact", placeholder: "Prénom Nom" },
              { label: "Entreprise", placeholder: "Nom de l'entreprise" },
              { label: "Email professionnel", placeholder: "contact@entreprise.be", type: "email" },
              { label: "Téléphone", placeholder: "+32 ..." },
              { label: "Région concernée", type: "select", placeholder: "Sélectionnez une région", options: ["Bruxelles-Capitale", "Wallonie", "Flandre"] },
              { label: "Secteur", placeholder: "Construction, santé, transport..." },
              { label: "Intitulé du poste", placeholder: "Électricien installateur résidentiel" },
              { label: "Type de contrat", placeholder: "CDI, CDD, intérim..." },
              { label: "Nombre d'heures hebdomadaires", placeholder: "38h" },
              { label: "Lieu de travail", placeholder: "Bruxelles, Liège, Gand..." },
              { label: "Missions principales", type: "textarea", placeholder: "Résumé des missions et responsabilités...", wide: true },
              { label: "Compétences recherchées", type: "textarea", placeholder: "Compétences, langues, expérience, conditions...", wide: true }
            ]}
          />
        </div>
      </Section>
      <CtaBanner
        title="Un recrutement international peut nécessiter plus qu'une mise en relation"
        text="Dans certains cas, l'embauche d'un travailleur international implique des démarches d'autorisation de travail et de séjour. Ces démarches dépendent notamment de la Région, du type de poste, du niveau de qualification et de la situation du candidat."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Découvrir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />
      <Section title="Questions fréquentes des employeurs" muted>
        <Faq
          items={[
            { question: "Puis-je déposer une offre si je n'ai jamais recruté à l'international ?", answer: "Oui. La plateforme peut justement servir de premier point d'entrée pour structurer votre besoin." },
            { question: "LEXPAT Connect garantit-elle l'obtention d'un permis unique ?", answer: "Non. La plateforme ne garantit aucune décision administrative. Une analyse juridique distincte est nécessaire." },
            { question: "Quand faut-il contacter le cabinet LEXPAT ?", answer: "Dès qu'un recrutement soulève une question d'autorisation de travail, de séjour ou de sécurisation administrative." }
          ]}
        />
      </Section>
    </>
  );
}
