import Link from "next/link";
import { CtaBanner, Hero, Section } from "../../components/Sections";

const foundations = [
  {
    title: "La Belgique fonctionne par Régions",
    text: "Bruxelles, la Wallonie et la Flandre appliquent leurs propres listes et leurs propres pratiques administratives."
  },
  {
    title: "Les listes évoluent dans le temps",
    text: "Elles doivent être lues comme des repères utiles et régulièrement actualisés, jamais comme un cadre figé."
  },
  {
    title: "Un métier en pénurie ne suffit pas à lui seul",
    text: "La réalité du poste, le profil du candidat et la région compétente restent déterminants."
  }
];

const regions = [
  {
    kicker: "Bruxelles-Capitale",
    title: "Une lecture particulièrement nuancée",
    text: "Les listes et leur portée concrète doivent être appréciées avec prudence, en tenant compte des réalités administratives bruxelloises."
  },
  {
    kicker: "Wallonie",
    title: "Des besoins souvent plus directement structurants",
    text: "La liste wallonne peut aider à cadrer plus vite certains recrutements, à condition de conserver une lecture précise du dossier."
  },
  {
    kicker: "Flandre",
    title: "Une logique plus fonctionnelle sur plusieurs métiers",
    text: "De nombreuses fonctions y sont décrites de manière plus technique et demandent une présentation rigoureuse."
  }
];

const sectors = [
  {
    id: "construction",
    title: "Construction et travaux publics",
    summary: "Maçonnerie, couverture, électricité, conduite de chantier, voirie et fonctions de terrain spécifiques.",
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
    summary: "Aide-soignant, infirmier, fonctions médicales et paramédicales, accompagnement social.",
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
    summary: "Fonctions de conduite, logistique, poids lourd, navigation intérieure et métiers ciblés du secteur.",
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
    summary: "Électromécanique, automatisation, maintenance industrielle, froid, mécanique et fonctions techniques.",
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
    summary: "Développement, infrastructure, analyse fonctionnelle et plusieurs fonctions numériques spécialisées.",
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
    summary: "Certaines fonctions d'enseignement, de coordination ou de formation selon les cadres régionaux applicables.",
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
            Comprendre les métiers en pénurie,
            <span className="block text-[#57b7af]">avec une lecture claire et rigoureuse</span>
          </>
        }
        description="LEXPAT Connect s'appuie sur les réalités du marché belge et sur les listes régionales de métiers en pénurie pour structurer les opportunités visibles sur la plateforme."
        primaryHref="/travailleurs"
        primaryLabel="Je suis candidat"
        secondaryHref="/employeurs"
        secondaryLabel="Je suis employeur"
        note="Cette page sert de point d'entrée. Elle n'a pas vocation à remplacer l'analyse d'une situation individuelle."
        stats={[
          { value: "Bruxelles", label: "Des réalités à lire avec une attention particulière" },
          { value: "Wallonie", label: "Des catégories souvent plus directement mobilisables" },
          { value: "Flandre", label: "Des fonctions parfois formulées de manière plus technique" }
        ]}
      />

      <Section
        title="Pourquoi cette page compte"
        intro="Les métiers en pénurie jouent un rôle important dans certains recrutements internationaux. Ils constituent un repère utile, à condition d'être lus dans le bon cadre."
        kicker="Repères"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {foundations.map((item) => (
            <article key={item.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Trois Régions, trois lectures différentes"
        intro="La crédibilité de LEXPAT Connect repose aussi sur cette distinction: un métier ou une situation ne se lit pas exactement de la même manière selon la région concernée."
        kicker="Régions"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {regions.map((item) => (
            <article key={item.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{item.kicker}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Secteurs concernés"
        intro="Vous pouvez désormais cliquer sur un secteur pour accéder directement à quelques métiers représentatifs. Cette page garde une fonction pédagogique: les intitulés exacts et leur portée doivent toujours être vérifiés dans le cadre régional applicable."
        kicker="Secteurs"
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
              <span className="mt-5 inline-flex text-sm font-semibold text-[#1d3b8b] transition group-hover:text-[#57b7af]">Voir les métiers liés</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Métiers par secteur"
        intro="Cette présentation permet une lecture plus pratique des secteurs. Elle ne remplace pas une vérification régionale complète du dossier."
        kicker="Accès rapide"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {sectors.map((sector) => (
            <article key={sector.id} id={sector.id} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7 scroll-mt-32">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{sector.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{sector.summary}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
                {sector.jobs.map((job) => (
                  <li key={job} className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#57b7af]" /> <span>{job}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Ce qu'un métier en pénurie ne signifie pas automatiquement"
        intro="La présence d'un métier sur une liste régionale ne suffit pas, à elle seule, à sécuriser un recrutement international ou à garantir une autorisation de travail."
        kicker="À retenir"
        muted
      >
        <div className="rounded-[28px] border border-[#d9ece9] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <p>
            D'autres éléments entrent en ligne de compte, notamment la région compétente, le profil du candidat, la qualification, la rémunération, la nature du poste et la situation administrative.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Utilisez cette page comme point de départ, pas comme réponse définitive"
        text="Les métiers en pénurie permettent de mieux comprendre les opportunités visibles sur la plateforme. Pour sécuriser une situation concrète, une analyse individualisée reste souvent nécessaire."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Parler au cabinet LEXPAT"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />
    </>
  );
}
