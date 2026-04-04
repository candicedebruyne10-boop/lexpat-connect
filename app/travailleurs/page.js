import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import { professionOptionsByRegion } from "../../lib/professions";

const candidateBenefits = [
  {
    title: "Rendre votre profil visible",
    text: "Votre parcours devient plus lisible pour des employeurs belges qui recrutent dans les métiers en pénurie."
  },
  {
    title: "Mettre en avant ce qui compte",
    text: "Compétences, expérience, langues, disponibilité : les informations utiles apparaissent tout de suite."
  },
  {
    title: "Créer plus d'opportunités",
    text: "Vous augmentez vos chances d'être compris plus vite et de déclencher une vraie prise de contact."
  }
];

const candidateSteps = [
  {
    title: "Créez votre profil",
    text: "Vous indiquez votre métier, votre région visée, vos compétences et votre disponibilité."
  },
  {
    title: "Votre candidature devient plus claire",
    text: "Les employeurs comprennent plus vite votre parcours et votre adéquation avec leurs besoins."
  },
  {
    title: "La mise en relation peut commencer",
    text: "Vous gagnez en visibilité auprès d'entreprises belges ouvertes au recrutement international."
  }
];

const candidatePreview = [
  {
    title: "Tableau de bord candidat",
    text: "Une base d'espace personnel pour suivre votre visibilité, votre profil et vos prochaines étapes."
  },
  {
    title: "Profil structuré",
    text: "Une présentation plus claire de votre parcours, pensée pour des employeurs belges."
  },
  {
    title: "CV enrichi",
    text: "Une logique déjà prévue pour centraliser expériences, formations, certificats et compétences."
  }
];

const candidateFaq = [
  {
    question: "Puis-je créer un profil si je ne suis pas encore en Belgique ?",
    answer: "Oui. La plateforme permet déjà de rendre votre profil visible et de présenter votre projet professionnel."
  },
  {
    question: "Dois-je déjà avoir un permis de travail ?",
    answer: "Non. L'inscription sur la plateforme et le droit au travail sont deux sujets différents."
  },
  {
    question: "Le cabinet LEXPAT intervient-il automatiquement ?",
    answer: "Non. Le cabinet n'intervient que si une opportunité soulève ensuite une vraie question de séjour, de permis unique ou de droit au travail."
  }
];

export default function TravailleursPage() {
  return (
    <>
      <Hero
        badge="Espace talents internationaux"
        title={
          <>
            Rendez votre profil visible
            <span className="block text-[#57b7af]">auprès d'employeurs belges qui recrutent</span>
          </>
        }
        description="Présentez votre expérience, vos compétences et votre disponibilité dans un format plus clair, plus crédible et plus utile pour accéder à des opportunités en Belgique."
        primaryHref="#formulaire"
        primaryLabel="Créer mon profil"
        secondaryHref="/metiers-en-penurie"
        secondaryLabel="Voir les métiers recherchés"
        note="Le rôle du cabinet LEXPAT n'intervient qu'après la mise en relation, si une question juridique apparaît."
        stats={[
          { value: "Profil", label: "Une présentation plus claire de votre parcours professionnel" },
          { value: "Belgique", label: "Une visibilité pensée pour les employeurs belges" },
          { value: "Opportunités", label: "Plus de chances de déclencher une prise de contact sérieuse" }
        ]}
        panels={[
          {
            kicker: "Bénéfice immédiat",
            title: "Présentez ce qui intéresse vraiment un employeur",
            text: "Votre métier, vos compétences, vos langues et votre disponibilité sont mis en avant dans un format plus exploitable."
          },
          {
            kicker: "Étape suivante",
            title: "Faire intervenir LEXPAT uniquement si nécessaire",
            text: "Si une opportunité professionnelle soulève une question de permis unique ou de droit au travail, le cabinet peut ensuite prendre le relais."
          }
        ]}
      />

      <Section
        title="Pourquoi créer votre profil"
        intro="La plateforme est pensée pour vous rendre plus visible, plus lisible et plus crédible auprès d'employeurs belges."
        kicker="Talents"
      >
        <BulletList items={candidateBenefits} />
      </Section>

      <Section
        title="Comment ça marche"
        intro="Un parcours simple, centré sur votre visibilité et la mise en relation."
        kicker="3 étapes"
        muted
      >
        <Steps items={candidateSteps} />
      </Section>

      <Section
        title="Un espace travailleur en préparation"
        intro="Nous préparons une interface dédiée pour gérer votre profil, votre CV et votre visibilité de façon plus professionnelle."
        kicker="Aperçu"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace candidat</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">Une vraie base d'espace personnel</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Tableau de bord, profil, CV et progression : la structure est déjà pensée pour vous aider à mieux présenter votre parcours.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/travailleurs/espace" className="primary-button">
                Voir l'espace travailleur
              </Link>
              <Link href="#formulaire" className="secondary-button">
                Commencer maintenant
              </Link>
            </div>
          </div>
          <BulletList items={candidatePreview} />
        </div>
      </Section>

      <Section
        title="Créer mon profil"
        intro="Le statut administratif indiqué permet simplement de mieux comprendre votre point de départ. Il ne vaut jamais validation juridique."
        kicker="Formulaire"
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire candidat"
            intro="Présentez les informations utiles de votre parcours pour augmenter votre visibilité."
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

      <CtaBanner
        title="Une question de séjour ou de droit au travail peut être traitée ensuite"
        text="Une fois la mise en relation engagée, le cabinet LEXPAT peut intervenir si votre situation appelle un accompagnement juridique distinct."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir le relais juridique"
        secondaryHref="/contact"
        secondaryLabel="Nous écrire"
      />

      <Section title="Questions fréquentes des talents" kicker="FAQ">
        <Faq items={candidateFaq} />
      </Section>
    </>
  );
}
