import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import { professionOptionsByRegion } from "../../lib/professions";

const employerBenefits = [
  {
    title: "Décrivez clairement le poste",
    text: "Métier, région, contrat, compétences attendues : votre besoin devient plus lisible dès le départ."
  },
  {
    title: "Touchez des talents internationaux ciblés",
    text: "La plateforme met en relation des profils qualifiés disponibles dans les métiers en pénurie en Belgique."
  },
  {
    title: "Accélérez la mise en relation",
    text: "Vous passez plus vite d'un besoin flou à une prise de contact utile avec des profils adaptés."
  }
];

const employerSteps = [
  {
    title: "Déposez votre besoin",
    text: "Vous indiquez le métier recherché, la région, le contrat et les compétences attendues."
  },
  {
    title: "La mise en relation devient plus simple",
    text: "Votre recherche gagne en lisibilité et peut être rapprochée de talents internationaux pertinents."
  },
  {
    title: "Vous entrez en contact",
    text: "La mise en relation se fait plus vite dans un cadre plus clair et plus professionnel."
  }
];

const employerPreview = [
  {
    title: "Tableau de bord entreprise",
    text: "Une vue dédiée pour suivre l'activité, les besoins déposés et les prochaines actions."
  },
  {
    title: "Fiche entreprise",
    text: "Un espace plus propre pour présenter votre structure, vos critères et votre contexte de recrutement."
  },
  {
    title: "Suivi des offres",
    text: "Une base pour centraliser vos recrutements en cours et les profils en cours d'analyse."
  }
];

const employerFaq = [
  {
    question: "À qui s'adresse la plateforme ?",
    answer: "Aux employeurs belges qui souhaitent recruter des talents internationaux, en particulier dans les métiers en pénurie."
  },
  {
    question: "Puis-je l'utiliser si je n'ai jamais recruté à l'international ?",
    answer: "Oui. La plateforme est justement pensée pour structurer un premier besoin de manière claire et exploitable."
  },
  {
    question: "Le juridique intervient-il tout de suite ?",
    answer: "Non. La priorité reste la mise en relation. Le cabinet LEXPAT intervient ensuite seulement si une question de permis unique ou de droit au travail apparaît."
  }
];

export default function EmployeursPage() {
  return (
    <>
      <Hero
        badge="Espace employeurs"
        title={
          <>
            Trouvez des talents internationaux
            <span className="block text-[#57b7af]">pour les métiers en pénurie en Belgique</span>
          </>
        }
        description="Déposez votre besoin, gagnez en visibilité et accélérez la mise en relation avec des profils internationaux qualifiés."
        primaryHref="#formulaire"
        primaryLabel="Déposer un besoin"
        secondaryHref="/travailleurs"
        secondaryLabel="Voir le parcours talents"
        note="Le juridique n'intervient qu'après la mise en relation, si le recrutement le nécessite."
        stats={[
          { value: "Poste", label: "Un besoin mieux structuré et immédiatement compréhensible" },
          { value: "Belgique", label: "Une approche pensée pour les métiers en pénurie et les réalités régionales" },
          { value: "Contact", label: "Une mise en relation plus rapide avec des talents pertinents" }
        ]}
        panels={[
          {
            kicker: "Bénéfice immédiat",
            title: "Rendre votre recrutement visible et exploitable",
            text: "Vous clarifiez rapidement le poste, les attentes et le contexte pour gagner du temps."
          },
          {
            kicker: "Étape suivante",
            title: "Faire intervenir LEXPAT seulement si nécessaire",
            text: "Le cabinet prend le relais plus tard, lorsque le dossier soulève un enjeu de permis unique ou d'immigration économique."
          }
        ]}
      />

      <Section
        title="Pourquoi déposer votre besoin ici"
        intro="La plateforme est conçue pour vous aider à passer plus vite d'un besoin de recrutement à une mise en relation utile."
        kicker="Employeurs"
      >
        <BulletList items={employerBenefits} />
        <div className="mt-8 rounded-[28px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Avant de recruter hors UE</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E3A78]">
            Vérifiez d’abord si votre fonction figure parmi les métiers en pénurie
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6e83]">
            Notre guide vous aide à comprendre la logique régionale, l’impact potentiel sur le permis unique et les secteurs les plus porteurs.
          </p>
          <Link href="/metiers-en-penurie" className="mt-5 inline-flex text-sm font-semibold text-[#1E3A78] transition hover:text-[#57b7af]">
            Lire le guide métiers en pénurie
          </Link>
        </div>
      </Section>

      <Section
        title="Comment ça marche"
        intro="Un parcours direct, sans jargon, centré sur le recrutement."
        kicker="3 étapes"
        muted
      >
        <Steps items={employerSteps} />
      </Section>

      <Section
        title="Un espace employeur en préparation"
        intro="Nous préparons une interface dédiée pour structurer vos offres, votre fiche entreprise et le suivi des profils."
        kicker="Aperçu"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace entreprise</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">Un espace plus proche d'une vraie plateforme de recrutement</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Tableau de bord, informations entreprise, offres en cours et suivi des opportunités : la logique est déjà posée.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/employeurs/espace" className="primary-button">
                Voir l'espace employeur
              </Link>
              <Link href="#formulaire" className="secondary-button">
                Commencer maintenant
              </Link>
            </div>
          </div>
          <BulletList items={employerPreview} />
        </div>
      </Section>

      <Section
        title="Déposer un besoin de recrutement"
        intro="Plus votre demande est précise, plus la mise en relation sera efficace."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire employeur"
            intro="Décrivez votre besoin pour permettre une première lecture claire et exploitable."
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

      <CtaBanner
        title="Une fois la mise en relation engagée, le juridique peut prendre le relais"
        text="Permis unique, droit au travail, immigration économique : le cabinet LEXPAT intervient ensuite seulement si le recrutement le nécessite."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir le relais juridique"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />

      <Section title="Questions fréquentes des employeurs" kicker="FAQ">
        <Faq items={employerFaq} />
      </Section>
    </>
  );
}
