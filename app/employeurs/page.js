import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import { professionOptionsByRegion } from "../../lib/professions";

const employerChallenges = [
  {
    title: "Des postes qui restent durablement ouverts",
    text: "Dans plusieurs secteurs, certains recrutements deviennent plus longs, plus incertains et plus coûteux à sécuriser."
  },
  {
    title: "Un besoin de clarté avant d'ouvrir à l'international",
    text: "Avant même d'identifier un candidat, l'employeur a besoin d'un cadre lisible sur le poste, la région et les conditions du recrutement."
  },
  {
    title: "Des enjeux administratifs à anticiper",
    text: "Selon le profil recruté, le recrutement peut soulever des questions de permis unique, de droit au travail ou de faisabilité régionale."
  }
];

const employerBenefits = [
  {
    title: "Structurer le besoin de recrutement",
    text: "LEXPAT Connect permet de présenter le poste, les missions, la région et les conditions essentielles dans un format plus clair."
  },
  {
    title: "Rendre la recherche plus lisible",
    text: "La plateforme aide à rapprocher un besoin employeur de profils internationaux pertinents, sans survendre un matching automatique."
  },
  {
    title: "Identifier plus vite le moment où le juridique devient nécessaire",
    text: "Quand le dossier soulève un enjeu concret de séjour ou d'autorisation de travail, le cabinet LEXPAT peut prendre le relais."
  }
];

const employerFaq = [
  {
    question: "Puis-je utiliser la plateforme même si je n'ai jamais recruté à l'international ?",
    answer: "Oui. LEXPAT Connect peut justement servir de point d'entrée pour clarifier votre besoin et comprendre le cadre d'un recrutement international en Belgique."
  },
  {
    question: "La plateforme garantit-elle l'obtention d'un permis unique ?",
    answer: "Non. Une autorisation de travail ou de séjour dépend toujours d'une situation précise et, le cas échéant, d'une analyse juridique distincte."
  },
  {
    question: "À quel moment faut-il contacter le cabinet LEXPAT ?",
    answer: "Dès qu'un recrutement soulève une question de droit au travail, de faisabilité régionale, de permis unique ou de sécurisation administrative."
  }
];

const employerSpacePreview = [
  {
    title: "Suivre ses offres et besoins publiés",
    text: "Un futur espace employeur permettra de retrouver l'ensemble des besoins déposés, leur état d'avancement et les profils consultés."
  },
  {
    title: "Centraliser les informations de l'entreprise",
    text: "L'idée est de permettre à l'employeur de renseigner durablement ses critères de sélection, ses secteurs et son contexte de recrutement."
  },
  {
    title: "Préparer ensuite un suivi plus structuré",
    text: "Cet espace a vocation à devenir le point d'entrée d'un vrai suivi employeur, plus proche d'un tableau de bord que d'un simple formulaire."
  }
];

export default function EmployeursPage() {
  return (
    <>
      <Hero
        badge="Espace employeurs"
        title={
          <>
            Recruter à l'international en Belgique,
            <span className="block text-[#57b7af]">avec un cadre plus clair dès le départ</span>
          </>
        }
        description="LEXPAT Connect aide les employeurs belges à structurer leurs besoins de recrutement dans les métiers en pénurie, à rendre leurs attentes plus lisibles et à identifier quand un relais juridique devient nécessaire."
        primaryHref="#formulaire"
        primaryLabel="Déposer un besoin"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir le relais juridique"
        note="La plateforme facilite la mise en relation. Les questions juridiques sont traitées séparément par le cabinet LEXPAT."
        stats={[
          { value: "Poste", label: "Un cadrage plus précis du besoin, des missions et du contexte" },
          { value: "Région", label: "Une lecture attentive de Bruxelles, de la Wallonie et de la Flandre" },
          { value: "Relais", label: "Une continuité possible avec le cabinet LEXPAT si nécessaire" }
        ]}
        panels={[
          {
            kicker: "Pour votre entreprise",
            title: "Rendre le recrutement plus lisible",
            text: "Clarifiez le métier recherché, le type de contrat, la région et les compétences attendues pour faciliter une mise en relation utile."
          },
          {
            kicker: "Pour le dossier",
            title: "Ne pas attendre pour sécuriser le cadre",
            text: "Lorsqu'une situation soulève une question de droit au travail ou de faisabilité, le relais juridique doit être identifié immédiatement."
          }
        ]}
      />

      <Section
        title="Pourquoi les employeurs utilisent LEXPAT Connect"
        intro="La plateforme s'adresse aux entreprises qui veulent ouvrir leur recherche à des talents internationaux sans perdre en clarté, en sérieux ni en sécurité."
        kicker="Besoins"
      >
        <BulletList items={employerChallenges} />
      </Section>

      <Section
        title="Ce que la plateforme vous apporte concrètement"
        intro="LEXPAT Connect n'a pas vocation à remplacer vos process RH internes. Elle sert à structurer le besoin, clarifier les informations utiles et préparer une mise en relation plus crédible."
        kicker="Apport"
        muted
      >
        <BulletList items={employerBenefits} />
      </Section>

      <Section
        title="Comment cela fonctionne"
        intro="Le parcours reste volontairement simple pour vous faire gagner du temps sans brouiller la lecture du dossier."
        kicker="Étapes"
      >
        <Steps
          items={[
            {
              title: "Vous décrivez votre besoin",
              text: "Poste, région, compétences, contrat, niveau d'urgence et contexte du recrutement sont posés dès l'entrée."
            },
            {
              title: "La demande devient plus exploitable",
              text: "Votre besoin est présenté dans un format qui facilite un rapprochement avec des profils internationaux pertinents."
            },
            {
              title: "La mise en relation peut commencer",
              text: "Vous pouvez entrer en contact avec des profils adaptés, dans un cadre plus clair et plus professionnel."
            },
            {
              title: "LEXPAT intervient si le dossier l'exige",
              text: "Permis unique, séjour, faisabilité régionale ou sécurisation administrative peuvent ensuite être traités dans un cadre distinct."
            }
          ]}
        />
      </Section>

      <Section
        title="Déposer un besoin de recrutement"
        intro="Plus votre demande est précise, plus la mise en relation sera utile et plus le moment d'un éventuel accompagnement juridique pourra être identifié rapidement."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire employeur"
            intro="Décrivez votre besoin de manière claire pour permettre une première lecture sérieuse du recrutement envisagé."
            buttonLabel="Envoyer le besoin"
            formType="employeur"
            fields={[
              { label: "Nom du contact", placeholder: "Prénom Nom" },
              { label: "Entreprise", placeholder: "Nom de l'entreprise" },
              { label: "Email professionnel", placeholder: "contact@entreprise.be", type: "email" },
              { label: "Téléphone", placeholder: "+32 ..." },
              { name: "region", label: "Région concernée", type: "select", placeholder: "Sélectionnez une région", options: ["Bruxelles-Capitale", "Wallonie", "Flandre"] },
              { name: "secteur", label: "Secteur", type: "select", placeholder: "Sélectionnez un secteur", options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Personnel hautement qualifié", "Personnel de direction", "Autre secteur"] },
              { name: "autreSecteur", label: "Autre secteur / précision", placeholder: "Indiquez ici un autre secteur si nécessaire", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Métier recherché", type: "select", placeholder: "Choisissez d'abord une région", optionsByField: "region", optionsMap: professionOptionsByRegion },
              { name: "autreProfession", label: "Autre profession / précision", placeholder: "Indiquez ici une autre profession si nécessaire", showWhen: { field: "profession", value: "Autre profession" } },
              { label: "Type de contrat", placeholder: "CDI, CDD, intérim..." },
              { label: "Nombre d'heures hebdomadaires", placeholder: "38h" },
              { label: "Lieu de travail", placeholder: "Bruxelles, Liège, Gand..." },
              { label: "Missions principales", type: "textarea", placeholder: "Résumé des missions et responsabilités...", wide: true },
              { label: "Compétences recherchées", type: "textarea", placeholder: "Compétences, langues, expérience, conditions...", wide: true }
            ]}
          />
        </div>
      </Section>

      <Section
        title="Espace employeur en préparation"
        intro="Le site pose aujourd'hui le socle de collecte et de mise en relation. Un espace employeur plus complet constitue la prochaine étape produit logique."
        kicker="À venir"
      >
        <BulletList items={employerSpacePreview} />
      </Section>

      <CtaBanner
        title="Un recrutement international peut nécessiter plus qu'une mise en relation"
        text="Lorsque le recrutement implique une question de séjour, de permis unique ou de droit au travail, le cabinet LEXPAT peut intervenir pour sécuriser le dossier dans un cadre distinct."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Découvrir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />

      <Section title="Questions fréquentes des employeurs" kicker="FAQ" muted>
        <Faq items={employerFaq} />
      </Section>
    </>
  );
}
