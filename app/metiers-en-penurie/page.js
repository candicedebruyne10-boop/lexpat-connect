import { CardGrid, CtaBanner, Hero, Section } from "../../components/Sections";

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
    title: "Construction et travaux publics",
    text: "Maçonnerie, couverture, électricité, conduite de chantier, voirie et fonctions de terrain spécifiques."
  },
  {
    title: "Santé et action sociale",
    text: "Aide-soignant, infirmier, fonctions médicales et paramédicales, accompagnement social."
  },
  {
    title: "Transport et logistique",
    text: "Fonctions de conduite, logistique, poids lourd, navigation intérieure et métiers ciblés du secteur."
  },
  {
    title: "Industrie et maintenance",
    text: "Électromécanique, automatisation, maintenance industrielle, froid, mécanique et fonctions techniques."
  },
  {
    title: "Technologies et informatique",
    text: "Développement, infrastructure, analyse fonctionnelle et plusieurs fonctions numériques spécialisées."
  },
  {
    title: "Éducation et formation",
    text: "Certaines fonctions d'enseignement, de coordination ou de formation selon les cadres régionaux applicables."
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
            <span className="block text-[#57b7af]">sans simplifier ce qui doit rester nuancé</span>
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
        <CardGrid items={foundations} />
      </Section>

      <Section
        title="Trois Régions, trois lectures différentes"
        intro="La crédibilité de LEXPAT Connect repose aussi sur cette distinction: un métier ou une situation ne se lit pas exactement de la même manière selon la région concernée."
        kicker="Régions"
        muted
      >
        <CardGrid items={regions} />
      </Section>

      <Section
        title="Exemples de secteurs concernés"
        intro="Les formulations exactes varient selon les sources régionales, mais plusieurs secteurs reviennent de manière récurrente dans les besoins exprimés sur le marché belge."
        kicker="Secteurs"
      >
        <CardGrid items={sectors} />
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
