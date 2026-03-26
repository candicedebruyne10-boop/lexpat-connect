import { BulletList, CtaBanner, Faq, FormCard, Hero, Section, Steps } from "../../components/Sections";

export default function EmployeursPage() {
  return (
    <>
      <Hero badge="Espace Employeurs" title="Recrutez des talents internationaux pour vos besoins en Belgique" description="LEXPAT Connect aide les employeurs belges a entrer en relation avec des travailleurs internationaux dans les metiers en penurie, avec une possibilite d'accompagnement juridique par le cabinet LEXPAT lorsque le recrutement le necessite." primaryHref="#formulaire" primaryLabel="Deposer un besoin de recrutement" secondaryHref="/accompagnement-juridique" secondaryLabel="Contacter le cabinet LEXPAT" />
      <Section title="Recruter devient plus complexe dans certains secteurs" intro="Dans de nombreux metiers techniques, de soin, de construction, de transport ou de maintenance, les employeurs belges rencontrent des difficultes a recruter localement.">
        <BulletList items={[
          { title: "Penurie de profils", text: "Certains postes restent durablement difficiles a pourvoir." },
          { title: "Manque de temps", text: "Les equipes RH et dirigeantes ont besoin d'un processus plus simple et plus lisible." },
          { title: "Cadre administratif", text: "Le recrutement international suppose parfois des demarches specifiques qu'il faut anticiper." }
        ]} />
      </Section>
      <Section title="Une plateforme concue pour simplifier la mise en relation" intro="LEXPAT Connect ne remplace pas votre processus RH interne. La plateforme agit comme un point d'entree structure pour identifier plus rapidement des candidatures adaptees." muted>
        <Steps items={[
          { title: "Vous deposez votre besoin", text: "Intitule du poste, missions, competences, region et conditions essentielles." },
          { title: "La plateforme facilite la visibilite", text: "La demande est structuree pour permettre un rapprochement avec des candidats pertinents." },
          { title: "Vous entrez en contact", text: "Vous identifiez les profils les plus adaptes et poursuivez les echanges." },
          { title: "Vous securisez si necessaire", text: "Le cabinet LEXPAT peut intervenir sur permis unique, sejour ou analyse regionale." }
        ]} />
      </Section>
      <Section title="Deposer un besoin de recrutement" intro="Plus votre besoin est precis, plus la mise en relation sera pertinente." muted>
        <div id="formulaire">
          <FormCard title="Formulaire employeur" intro="Prototype de formulaire pour le MVP. Les champs correspondent a votre cadrage fonctionnel actuel." buttonLabel="Envoyer le besoin" fields={[
            { label: "Nom du contact", placeholder: "Prenom Nom" },
            { label: "Entreprise", placeholder: "Nom de l'entreprise" },
            { label: "Email professionnel", placeholder: "contact@entreprise.be", type: "email" },
            { label: "Telephone", placeholder: "+32 ..." },
            { label: "Region concernee", type: "select", placeholder: "Selectionnez une region", options: ["Bruxelles-Capitale", "Wallonie", "Flandre"] },
            { label: "Secteur", placeholder: "Construction, sante, transport..." },
            { label: "Intitule du poste", placeholder: "Electricien installateur residentiel" },
            { label: "Type de contrat", placeholder: "CDI, CDD, interim..." },
            { label: "Nombre d'heures hebdomadaires", placeholder: "38h" },
            { label: "Lieu de travail", placeholder: "Bruxelles, Liege, Gand..." },
            { label: "Missions principales", type: "textarea", placeholder: "Resume des missions et responsabilites...", wide: true },
            { label: "Competences recherchees", type: "textarea", placeholder: "Competences, langues, experience, conditions...", wide: true }
          ]} />
        </div>
      </Section>
      <CtaBanner title="Un recrutement international peut necessiter plus qu'une mise en relation" text="Dans certains cas, l'embauche d'un travailleur international implique des demarches d'autorisation de travail et de sejour. Ces demarches dependent notamment de la Region, du type de poste, du niveau de qualification et de la situation du candidat." primaryHref="/accompagnement-juridique" primaryLabel="Decouvrir l'accompagnement juridique" secondaryHref="/contact" secondaryLabel="Poser une question" />
      <Section title="Questions frequentes des employeurs" muted>
        <Faq items={[
          { question: "Puis-je deposer une offre si je n'ai jamais recrute a l'international ?", answer: "Oui. La plateforme peut justement servir de premier point d'entree pour structurer votre besoin." },
          { question: "LEXPAT Connect garantit-elle l'obtention d'un permis unique ?", answer: "Non. La plateforme ne garantit aucune decision administrative. Une analyse juridique distincte est necessaire." },
          { question: "Quand faut-il contacter le cabinet LEXPAT ?", answer: "Des qu'un recrutement souleve une question d'autorisation de travail, de sejour ou de securisation administrative." }
        ]} />
      </Section>
    </>
  );
}
