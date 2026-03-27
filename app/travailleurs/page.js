import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import { professionOptionsByRegion } from "../../lib/professions";

const candidateBenefits = [
  {
    title: "Présenter un profil plus sérieux",
    text: "Votre expérience, vos compétences, vos langues et votre disponibilité sont présentées dans un format plus clair pour un employeur belge."
  },
  {
    title: "Gagner en lisibilité",
    text: "La plateforme aide à rendre votre parcours plus compréhensible, sans vous réduire à un simple CV ou à une promesse imprécise."
  },
  {
    title: "Comprendre où vous vous situez",
    text: "Votre localisation, votre mobilité et votre situation administrative peuvent être décrites de manière plus structurée."
  },
  {
    title: "Être orienté si une question juridique apparaît",
    text: "Si votre situation soulève un enjeu de droit au travail ou de séjour, le cabinet LEXPAT peut intervenir séparément."
  }
];

const candidateFaq = [
  {
    question: "Puis-je créer un profil même si je ne suis pas encore en Belgique ?",
    answer: "Oui. La plateforme peut déjà vous permettre de présenter votre parcours et de rendre votre profil visible pour des opportunités en Belgique."
  },
  {
    question: "Dois-je déjà disposer d'un permis de travail pour m'inscrire ?",
    answer: "Non. L'inscription sur la plateforme et l'existence d'un droit au travail sont deux choses distinctes."
  },
  {
    question: "Exercer un métier en pénurie suffit-il pour travailler en Belgique ?",
    answer: "Non. Cela peut constituer un point d'appui, mais chaque situation dépend aussi de la région compétente, du poste et du profil du candidat."
  }
];

const candidateSpacePreview = [
  {
    title: "Compléter son profil dans le temps",
    text: "Un futur espace candidat permettra d'enrichir son dossier avec davantage d'informations, de documents et de préférences professionnelles."
  },
  {
    title: "Mieux structurer sa présentation",
    text: "L'objectif est d'aller au-delà d'un simple formulaire pour créer un vrai profil lisible par les employeurs belges."
  },
  {
    title: "Suivre sa visibilité et ses démarches",
    text: "À terme, cet espace pourrait centraliser les candidatures, les échanges et les informations utiles liées au projet professionnel en Belgique."
  }
];

export default function TravailleursPage() {
  return (
    <>
      <Hero
        badge="Espace candidats"
        title={
          <>
            Présenter votre profil pour travailler en Belgique,
            <span className="block text-[#57b7af]">dans un cadre plus sérieux et plus lisible</span>
          </>
        }
        description="LEXPAT Connect permet aux travailleurs internationaux de valoriser leurs compétences, leur expérience et leur disponibilité, tout en facilitant une lecture plus claire de leur profil par des employeurs belges."
        primaryHref="#formulaire"
        primaryLabel="Créer mon profil"
        secondaryHref="/metiers-en-penurie"
        secondaryLabel="Comprendre les opportunités"
        note="Créer un profil ne vaut jamais validation juridique. Si votre situation soulève une question de droit au travail ou de séjour, le cabinet LEXPAT peut intervenir séparément."
        stats={[
          { value: "Profil", label: "Une présentation plus claire de votre parcours et de vos compétences" },
          { value: "Belgique", label: "Une visibilité pensée pour des employeurs belges" },
          { value: "LEXPAT", label: "Un accompagnement juridique possible si votre situation l'exige" }
        ]}
        panels={[
          {
            kicker: "Pour votre candidature",
            title: "Rendre votre parcours plus compréhensible",
            text: "Valorisez votre expérience, vos langues, votre disponibilité et le métier que vous recherchez dans un format plus structuré."
          },
          {
            kicker: "Pour la suite",
            title: "Comprendre quand demander un appui juridique",
            text: "Si une opportunité professionnelle soulève une question de permis unique, de séjour ou de droit au travail, le relais vers LEXPAT doit être clair."
          }
        ]}
      />

      <Section
        title="Pourquoi créer votre profil"
        intro="LEXPAT Connect s'adresse aux personnes qui souhaitent travailler en Belgique et qui veulent présenter leur parcours de manière plus sérieuse à des employeurs ouverts au recrutement international."
        kicker="Visibilité"
      >
        <BulletList items={candidateBenefits} />
      </Section>

      <Section
        title="Comment cela fonctionne"
        intro="Le parcours reste simple: vous présentez les informations utiles, votre profil devient plus lisible et la plateforme facilite ensuite une mise en relation plus crédible."
        kicker="Étapes"
        muted
      >
        <Steps
          items={[
            {
              title: "Vous créez votre profil",
              text: "Vous indiquez votre identité, votre parcours, les métiers visés et votre disponibilité."
            },
            {
              title: "Vous précisez votre situation",
              text: "Votre pays de résidence, votre mobilité, vos langues et votre situation administrative peuvent être mentionnés clairement."
            },
            {
              title: "Votre profil devient plus exploitable",
              text: "Les employeurs peuvent mieux comprendre votre projet professionnel et votre adéquation avec un besoin de recrutement."
            },
            {
              title: "LEXPAT peut intervenir si nécessaire",
              text: "Si une opportunité révèle une vraie question juridique, le cabinet peut être consulté dans un cadre distinct."
            }
          ]}
        />
      </Section>

      <Section
        title="Créer mon profil"
        intro="Le statut indiqué sert à mieux comprendre votre situation de départ. Il ne vaut jamais validation juridique."
        kicker="Formulaire"
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire candidat"
            intro="Présentez les éléments utiles de votre parcours pour rendre votre profil plus clair auprès d'employeurs belges."
            buttonLabel="Envoyer mon profil"
            formType="candidat"
            successMessage="Votre profil a bien été envoyé. Un email de confirmation vous a été adressé."
            fields={[
              { label: "Nom complet", placeholder: "Prénom Nom" },
              { label: "Email", type: "email", placeholder: "votre.email@example.com" },
              { label: "Téléphone", placeholder: "+32 / +..." },
              { label: "Pays de résidence", placeholder: "Pays actuel" },
              { name: "region", label: "Région ou ville souhaitée en Belgique", type: "select", placeholder: "Sélectionnez une région", options: ["Bruxelles-Capitale", "Wallonie", "Flandre"] },
              { name: "secteur", label: "Secteur visé", type: "select", placeholder: "Sélectionnez un secteur", options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Personnel hautement qualifié", "Personnel de direction", "Autre secteur"] },
              { name: "autreSecteur", label: "Autre secteur / précision", placeholder: "Indiquez ici un autre secteur si nécessaire", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Métier recherché", type: "select", placeholder: "Choisissez d'abord une région", optionsByField: "region", optionsMap: professionOptionsByRegion },
              { name: "autreProfession", label: "Autre profession / précision", placeholder: "Indiquez ici une autre profession si nécessaire", showWhen: { field: "profession", value: "Autre profession" } },
              { label: "Disponibilité", placeholder: "Immédiate, 1 mois, 3 mois..." },
              { label: "Langues parlées", placeholder: "Français, anglais, néerlandais..." },
              { label: "Statut administratif", type: "select", placeholder: "Sélectionnez votre statut", options: ["Permis unique", "Permis A", "Annexe 15", "Annexe 35", "Sans titre actuel", "Autre", "Je ne sais pas"] },
              { label: "Compétences principales", type: "textarea", placeholder: "Compétences, diplômes, certifications, expérience...", wide: true },
              { label: "Message complémentaire", type: "textarea", placeholder: "Expliquez votre projet ou vos besoins d'information...", wide: true }
            ]}
          />
        </div>
      </Section>

      <Section
        title="Espace candidat en préparation"
        intro="Le formulaire actuel constitue une première étape utile. La prochaine brique produit logique est un espace candidat plus complet et plus personnalisable."
        kicker="À venir"
      >
        <BulletList items={candidateSpacePreview} />
      </Section>

      <CtaBanner
        title="Vous avez une question sur votre droit au travail ou votre séjour en Belgique"
        text="Dans certains cas, la création d'un profil ou l'intérêt d'un employeur fait apparaître une question plus juridique. Le cabinet LEXPAT peut alors intervenir dans un cadre distinct."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Contacter le cabinet LEXPAT"
        secondaryHref="/contact"
        secondaryLabel="Nous écrire"
      />

      <Section title="Questions fréquentes des candidats" kicker="FAQ" muted>
        <Faq items={candidateFaq} />
      </Section>
    </>
  );
}
