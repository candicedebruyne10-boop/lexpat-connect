import Link from "next/link";
import { CtaBanner, Hero, Section } from "../../components/Sections";

const regionCards = [
  {
    kicker: "Bruxelles-Capitale",
    title: "Des besoins à lire avec précision",
    text: "Des fonctions recherchées, mais une lecture administrative qui demande plus de nuance."
  },
  {
    kicker: "Wallonie",
    title: "Des métiers souvent plus directement mobilisables",
    text: "Une région clé pour lire rapidement les besoins de recrutement sur plusieurs fonctions."
  },
  {
    kicker: "Flandre",
    title: "Des profils techniques fortement demandés",
    text: "Une logique très fonctionnelle, particulièrement utile pour les métiers industriels et logistiques."
  }
];

const sectors = [
  {
    id: "construction",
    title: "Construction et travaux publics",
    summary: "Des métiers de terrain régulièrement recherchés par les employeurs belges.",
    jobs: [
      "Maçon / maçonne",
      "Couvreur / couvreuse",
      "Électricien / électricienne",
      "Chef de chantier",
      "Conducteur de travaux",
      "Ouvrier voirie"
    ]
  },
  {
    id: "sante",
    title: "Santé et action sociale",
    summary: "Des profils de soin et d'accompagnement parmi les plus recherchés actuellement.",
    jobs: [
      "Infirmier / infirmière",
      "Aide-soignant / aide-soignante",
      "Sage-femme",
      "Kinésithérapeute",
      "Médecin spécialiste",
      "Accompagnateur social"
    ]
  },
  {
    id: "transport",
    title: "Transport et logistique",
    summary: "Des fonctions essentielles pour les entreprises qui recrutent en tension.",
    jobs: [
      "Chauffeur poids lourd",
      "Cariste",
      "Planificateur logistique",
      "Gestionnaire de stock",
      "Conducteur d'autobus",
      "Agent logistique"
    ]
  },
  {
    id: "industrie",
    title: "Industrie et maintenance",
    summary: "Des profils techniques recherchés pour renforcer des équipes rapidement.",
    jobs: [
      "Électromécanicien / électromécanicienne",
      "Technicien de maintenance",
      "Mécanicien industriel / mécanicienne industrielle",
      "Soudeur / soudeuse",
      "Frigoriste",
      "Automaticien / automaticienne"
    ]
  },
  {
    id: "it",
    title: "Technologies et informatique",
    summary: "Des profils numériques spécialisés présents dans plusieurs listes régionales.",
    jobs: [
      "Développeur / développeuse",
      "Analyste informatique",
      "Ingénieur logiciel",
      "Administrateur systèmes",
      "Chef de projet technique",
      "Data engineer"
    ]
  },
  {
    id: "education",
    title: "Éducation et formation",
    summary: "Certaines fonctions pédagogiques ou de formation restent également recherchées.",
    jobs: [
      "Enseignant / enseignante",
      "Formateur / formatrice",
      "Coordinateur pédagogique",
      "Professeur technique",
      "Conseiller en insertion",
      "Responsable de formation"
    ]
  }
];

export default function MetiersPage() {
  return (
    <>
      <Hero
        badge="Métiers en pénurie en Belgique"
        title={
          <>
            Identifiez les profils
            <span className="block text-[#57b7af]">les plus recherchés en Belgique</span>
          </>
        }
        description="Une lecture directe des métiers en pénurie pour repérer plus vite les secteurs qui recrutent et les profils les plus demandés."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/travailleurs"
        secondaryLabel="Je rends mon profil visible"
        note="Les listes régionales sont un point d'entrée utile. Elles ne remplacent jamais l'analyse complète d'un dossier."
        stats={[
          { value: "Santé", label: "Des fonctions durablement recherchées dans plusieurs régions" },
          { value: "Construction", label: "Des métiers de terrain qui restent en forte tension" },
          { value: "Industrie", label: "Des profils techniques recherchés pour des besoins immédiats" }
        ]}
      />

      <Section
        title="Trois régions, trois lectures du marché"
        intro="La Belgique ne fonctionne pas avec une seule liste. Les besoins sont réels, mais ils se lisent toujours par région."
        kicker="Régions"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {regionCards.map((item) => (
            <article key={item.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{item.kicker}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Les secteurs les plus recherchés actuellement"
        intro="Cliquez sur un secteur pour aller directement aux métiers qui reviennent le plus souvent dans les recrutements en Belgique."
        kicker="Secteurs"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {sectors.map((sector) => (
            <Link
              key={sector.id}
              href={`#${sector.id}`}
              className="group rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#cfe1de] hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-7"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b] transition group-hover:text-[#57b7af]">{sector.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{sector.summary}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#1d3b8b] transition group-hover:text-[#57b7af]">
                Voir les métiers liés
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Métiers par secteur"
        intro="Une lecture rapide des profils les plus demandés pour aider employeurs et talents à se repérer immédiatement."
        kicker="Accès rapide"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {sectors.map((sector) => (
            <article key={sector.id} id={sector.id} className="scroll-mt-32 rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{sector.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{sector.summary}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
                {sector.jobs.map((job) => (
                  <li key={job} className="flex gap-3">
                    <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#57b7af]" />
                    <span>{job}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Ce qu'il faut garder en tête"
        intro="Un métier en pénurie donne de la visibilité à un recrutement ou à un profil. Il ne garantit pas, à lui seul, la faisabilité complète du dossier."
        kicker="À retenir"
        muted
      >
        <div className="rounded-[28px] border border-[#d9ece9] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <p>
            La région compétente, le profil du candidat, le niveau de qualification, la nature du poste et le contexte administratif restent déterminants. La plateforme aide à se repérer vite. Le juridique intervient ensuite seulement si nécessaire.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Passez maintenant de l'information à l'action"
        text="Déposez un besoin de recrutement ou rendez votre profil visible à partir des métiers actuellement les plus recherchés en Belgique."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/travailleurs"
        secondaryLabel="Je rends mon profil visible"
      />
    </>
  );
}
