import Script from "next/script";
import Link from "next/link";
import { CtaBanner, Faq, Hero, Section } from "../../components/Sections";

export const metadata = {
  title: "Métiers en pénurie en Belgique : comment recruter plus vite à l’international | LEXPAT Connect",
  description:
    "Guide employeur pour comprendre les métiers en pénurie en Belgique, leur impact sur le permis unique, les différences régionales et le recrutement hors UE."
};

const explanationCards = [
  {
    title: "Définition simple",
    text: "Un métier en pénurie est une fonction pour laquelle les employeurs peinent à recruter, soit par manque de candidats, soit parce que les profils adéquats sont rares."
  },
  {
    title: "Pénurie quantitative / qualitative",
    text: "La pénurie peut être quantitative quand il n’y a pas assez de candidats, ou qualitative quand les candidats disponibles ne correspondent pas au niveau de compétence attendu."
  },
  {
    title: "Rôle des régions",
    text: "La Belgique fonctionne par listes régionales. Bruxelles, la Wallonie et la Flandre publient chacune leurs propres références, avec leurs critères et leur lecture du marché."
  },
  {
    title: "Lien avec le permis unique",
    text: "Lorsqu’une fonction figure sur une liste régionale, cela peut aider à documenter la tension du marché du travail dans un dossier de permis unique, sans garantir l’autorisation à elle seule."
  },
  {
    title: "Intérêt pour l’employeur",
    text: "Pour une PME ou un service RH sans équipe juridique interne, la liste aide à vérifier rapidement si un recrutement hors UE a plus de chances d’être défendable et cohérent."
  }
];

const sectors = [
  {
    title: "Construction",
    summary:
      "Un secteur historiquement tendu dans les trois régions, avec de fortes difficultés sur les fonctions de chantier et d’installation.",
    examples: ["Maçon", "Chef de chantier", "Couvreur", "Installateur sanitaire"]
  },
  {
    title: "Santé",
    summary:
      "Les soins restent parmi les besoins les plus structurels, notamment pour les fonctions infirmières, d’aide au soin et certains métiers spécialisés.",
    examples: ["Infirmier", "Aide-soignant", "Ergothérapeute", "Technologue médical"]
  },
  {
    title: "Industrie",
    summary:
      "Les métiers industriels et de production apparaissent régulièrement dans les listes pour les besoins de maintenance, process, qualité et atelier.",
    examples: ["Soudeur", "Tuyauteur", "Responsable de maintenance", "Régleur-opérateur"]
  },
  {
    title: "Transport & logistique",
    summary:
      "Le manque de conducteurs et de profils logistiques qualifiés reste un enjeu concret pour les entreprises en croissance ou en continuité d’activité.",
    examples: ["Conducteur poids lourd", "Conducteur d’autobus", "Acheteur", "Responsable des achats"]
  },
  {
    title: "Comptabilité & finance",
    summary:
      "Certaines fonctions de gestion, d’analyse financière et de comptabilité restent identifiées comme difficiles à pourvoir, surtout à Bruxelles.",
    examples: ["Comptable", "Chef comptable", "Analyste financier", "Expert-comptable"]
  },
  {
    title: "Enseignement",
    summary:
      "Les fonctions pédagogiques figurent dans plusieurs listes régionales, avec un traitement parfois spécifique selon la communauté ou le niveau d’enseignement concerné.",
    examples: ["Enseignant secondaire", "Enseignant primaire", "Formateur pour adultes", "Coordinateur pédagogique"]
  },
  {
    title: "Maintenance & électromécanique",
    summary:
      "Les entreprises peinent souvent à recruter des profils capables d’assurer l’entretien, le diagnostic et la continuité technique de leurs installations.",
    examples: ["Électromécanicien", "Technicien de maintenance", "Mécanicien de maintenance", "Frigoriste"]
  },
  {
    title: "Métiers techniques",
    summary:
      "Les métiers à forte technicité restent stratégiques pour les entreprises qui recrutent vite, notamment dans les environnements industriels, automatisés ou réglementés.",
    examples: ["Technicien en automatisation", "Dessinateur-concepteur", "Installateur d’ascenseurs", "Technicien réseaux"]
  }
];

const permitCards = [
  {
    title: "Facilitation du dossier",
    text: "La présence d’une fonction sur une liste régionale peut soutenir l’argument selon lequel le poste est objectivement difficile à pourvoir localement."
  },
  {
    title: "Argument marché de l’emploi",
    text: "La liste ne remplace pas l’analyse du dossier, mais elle peut renforcer la cohérence du recrutement hors UE dans le cadre du permis unique."
  },
  {
    title: "Rapidité potentielle",
    text: "Un métier en pénurie peut aider à fluidifier l’instruction lorsqu’il s’insère dans un dossier complet, bien documenté et déposé dans la bonne région."
  },
  {
    title: "Région compétente",
    text: "La région compétente reste déterminante : la lecture d’un poste à Bruxelles n’est pas identique à celle d’un poste en Wallonie ou en Flandre."
  }
];

const officialSources = [
  {
    label: "Belgium.be — travailler en Belgique et permis unique",
    href: "https://www.belgium.be/fr/emploi/venir_travailler_en_belgique"
  },
  {
    label: "Le Forem — fonctions critiques et métiers en tension",
    href: "https://www.leforem.be"
  },
  {
    label: "Actiris — marché de l’emploi à Bruxelles",
    href: "https://www.actiris.brussels"
  },
  {
    label: "VDAB — knelpuntberoepen en Flandre",
    href: "https://www.vdab.be/trends/knelpuntberoepen"
  }
];

const faqItems = [
  {
    question: "Un développeur est-il encore en pénurie en Belgique ?",
    answer:
      "Cela dépend de la région, du niveau de spécialisation et de la fonction exacte. Certaines fonctions TIC restent en tension, surtout lorsqu’elles combinent expertise technique, expérience et disponibilité immédiate."
  },
  {
    question: "Quelles régions publient la liste des métiers en pénurie ?",
    answer:
      "La Wallonie, Bruxelles et la Flandre publient chacune leurs propres références via leurs opérateurs et outils régionaux. Il n’existe pas une seule liste unique valable indistinctement pour toute la Belgique."
  },
  {
    question: "La liste change-t-elle chaque année ?",
    answer:
      "Oui. Les listes évoluent avec le marché de l’emploi, les besoins sectoriels et les critères régionaux. Il faut toujours vérifier la version la plus récente avant de lancer un recrutement hors UE."
  },
  {
    question: "Un métier en pénurie garantit-il le permis unique ?",
    answer:
      "Non. La pénurie n’accorde pas automatiquement le permis unique. Elle peut renforcer un dossier, mais l’administration examine aussi la fonction exacte, le contrat, la rémunération, la région compétente et la situation du candidat."
  },
  {
    question: "Quelle différence entre métier critique et métier en pénurie ?",
    answer:
      "Les termes varient selon les régions et les opérateurs. En pratique, ils renvoient à des fonctions difficiles à pourvoir, mais la terminologie, la méthode de classement et l’effet administratif peuvent différer."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function MetiersPage() {
  return (
    <>
      <Script
        id="faq-metiers-penurie-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero
        badge="Guide employeur — Belgique"
        title={
          <>
            Métiers en pénurie en Belgique :
            <span className="block text-[#57b7af]">comment recruter plus vite à l’international</span>
          </>
        }
        description="Découvrez les fonctions officiellement reconnues en pénurie en Wallonie, à Bruxelles et en Flandre, et comprenez comment cela peut accélérer votre recrutement de talents hors Union européenne."
        primaryHref="#verifier"
        primaryLabel="Vérifier si votre poste est concerné"
        secondaryHref="/employeurs"
        secondaryLabel="Déposer un besoin de recrutement"
        note="Cette page synthétise les logiques régionales officielles. Pour une décision concrète sur un recrutement hors UE, la fonction doit toujours être relue dans sa région compétente et dans le contexte du dossier."
        stats={[
          { value: "3", label: "Régions publient leurs propres listes et lectures du marché" },
          { value: "UE", label: "Le raisonnement permis unique se construit région par région" },
          { value: "RH", label: "Un vrai outil de lecture pour les PME et équipes sans service juridique" }
        ]}
        panels={[
          {
            kicker: "Pourquoi cette page ?",
            title: "Comprendre vite si un recrutement hors UE est défendable",
            text: "L’objectif n’est pas d’empiler 100 intitulés de fonctions, mais de vous aider à lire intelligemment les listes officielles."
          },
          {
            kicker: "Point clé",
            title: "Un métier en pénurie aide, mais ne remplace jamais l’analyse juridique",
            text: "La liste est un accélérateur de compréhension et un argument utile. Elle n’accorde pas automatiquement le permis unique."
          }
        ]}
      />

      <Section
        title="Comprendre simplement ce qu’est un métier en pénurie"
        intro="Avant de recruter hors UE, il faut d’abord comprendre ce que les administrations et les régions regardent réellement lorsqu’elles parlent de métier en pénurie."
        kicker="Explication simple"
      >
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {explanationCards.map((card) => (
            <article key={card.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{card.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Les métiers les plus recherchés à regarder en priorité"
        intro="Voici les familles de fonctions qui reviennent le plus souvent dans les listes officielles régionales. Cette lecture est plus utile qu’une liste brute pour décider rapidement si votre recrutement a du sens."
        kicker="Secteurs porteurs"
        muted
      >
        <div id="verifier" className="grid gap-5 lg:grid-cols-2">
          {sectors.map((sector, index) => (
            <article key={sector.title} className="rounded-[30px] border border-[#e2ebf3] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#173A8A]">
                    Secteur {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{sector.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5d6e83]">{sector.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {sector.examples.map((job) => (
                  <span
                    key={job}
                    className="inline-flex rounded-full border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-3.5 py-1.5 text-xs font-semibold text-[#2f9f97]"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Ce que cela change concrètement pour le permis unique"
        intro="Lorsqu’une fonction figure dans une liste régionale, elle peut soutenir la logique du dossier. Mais c’est toujours le montage global qui fait la différence."
        kicker="Permis unique"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {permitCards.map((card) => (
            <article key={card.title} className="rounded-[30px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[30px] border border-[#e3eaf2] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">Comment utiliser intelligemment la liste</h3>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Vérifier d’abord la région compétente du poste.</span></li>
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Comparer la fonction réelle avec l’intitulé et la famille métier visés.</span></li>
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Utiliser la pénurie comme argument, pas comme garantie automatique.</span></li>
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Prévoir une relecture juridique si le recrutement doit déboucher sur un permis unique.</span></li>
          </ul>
        </div>
      </Section>

      <Section
        title="LEXPAT vous aide lorsque la fonction est validée et que le recrutement avance"
        intro="La plateforme sert à comprendre et à orienter le matching. Le cabinet LEXPAT intervient ensuite pour sécuriser juridiquement le recrutement si la fonction et le projet d’embauche le justifient."
        kicker="Relais LEXPAT"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-[#dce9e7] bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
            <h3 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">
              Quand LEXPAT intervient juridiquement
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Lorsque la fonction est réellement ciblée, que le matching est avancé et qu’un permis unique, une analyse du droit au travail ou une sécurisation du parcours hors UE devient nécessaire.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Validation du poste",
                "Lecture de la région compétente",
                "Permis unique",
                "Immigration économique"
              ].map((item) => (
                <span key={item} className="inline-flex rounded-full border border-[#d6dfef] bg-[#f8fbff] px-3.5 py-1.5 text-xs font-semibold text-[#173A8A]">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-[#dfe8f2] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-7 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Sources officielles</p>
            <div className="mt-5 space-y-3">
              {officialSources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-[#e3eaf2] bg-white px-4 py-4 text-sm font-medium text-[#1d3b8b] transition hover:border-[#c8d9ef] hover:text-[#57b7af]"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </Section>

      <Section
        title="Questions fréquentes sur les métiers en pénurie et le permis unique"
        intro="Une FAQ pensée pour répondre aux questions qui reviennent le plus souvent chez les employeurs et les équipes RH."
        kicker="FAQ SEO"
      >
        <Faq items={faqItems} />
      </Section>

      <CtaBanner
        title="Besoin de sécuriser un recrutement hors UE ?"
        text="LEXPAT vous aide à relire la fonction, la région compétente et la stratégie permis unique lorsque votre recrutement avance concrètement."
        primaryHref="/contact"
        primaryLabel="Parler à un avocat"
        secondaryHref="/employeurs"
        secondaryLabel="Déposer un besoin"
      />
    </>
  );
}
