import Script from "next/script";
import { CtaBanner, Faq, Hero, Section } from "../../components/Sections";
import { shortageJobs2026 } from "../../lib/shortageJobs2026";

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

const regionInsights = [
  {
    id: "bruxelles",
    kicker: "Bruxelles-Capitale",
    title: "Une liste utile, mais à lire avec prudence administrative",
    text:
      "À Bruxelles, la liste publiée par Actiris sert de repère sur les fonctions critiques, mais elle n’emporte pas automatiquement la même portée qu’en Wallonie. Pour un employeur, cela veut dire qu’il faut vérifier la fonction réelle, la région compétente et la logique administrative du dossier avant de conclure qu’un recrutement hors UE sera facilité.",
    emphasis: "Bruxelles demande souvent la lecture la plus nuancée.",
    accent: "border-[rgba(23,58,138,0.16)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]",
    badge: "bg-[#eef4ff] text-[#173A8A] border-[rgba(23,58,138,0.16)]",
    pill: "bg-[#eef4ff] text-[#173A8A] border-[rgba(23,58,138,0.16)]",
    line: "from-[#173A8A]/20 via-[#173A8A]/5 to-transparent"
  },
  {
    id: "wallonie",
    kicker: "Wallonie",
    title: "La lecture la plus directe pour les employeurs",
    text:
      "La Wallonie publie une liste opérationnelle et concrète, souvent la plus simple à mobiliser pour comprendre rapidement si un poste s’inscrit dans une logique de pénurie. Elle est particulièrement parlante pour les métiers de terrain, la maintenance, l’industrie, la logistique et certains profils de soins.",
    emphasis: "C’est souvent la liste la plus lisible pour une PME.",
    accent: "border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#f5fcfb_100%)]",
    badge: "bg-[#ecfaf8] text-[#2f9f97] border-[rgba(89,185,177,0.22)]",
    pill: "bg-[#ecfaf8] text-[#2f9f97] border-[rgba(89,185,177,0.22)]",
    line: "from-[#59B9B1]/25 via-[#59B9B1]/5 to-transparent"
  },
  {
    id: "flandre",
    kicker: "Flandre",
    title: "Une logique par familles fonctionnelles",
    text:
      "La Flandre raisonne souvent par familles de fonctions et métiers critiques, avec une forte présence de profils techniques, industriels, logistiques et de soins. Pour un employeur, la bonne approche consiste moins à chercher un intitulé exact qu’à vérifier si le poste entre dans une famille clairement en tension.",
    emphasis: "La grille flamande est souvent plus fonctionnelle que littérale.",
    accent: "border-[rgba(98,84,183,0.18)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f3ff_100%)]",
    badge: "bg-[#eee8ff] text-[#6254B7] border-[rgba(98,84,183,0.18)]",
    pill: "bg-[#f4f1ff] text-[#6254B7] border-[rgba(98,84,183,0.18)]",
    line: "from-[#6254B7]/22 via-[#6254B7]/5 to-transparent"
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

const regionMetrics = shortageJobs2026.map((region) => ({
  id: region.id,
  label: region.label,
  groups: region.groups.length,
  jobs: region.groups.reduce((total, group) => total + group.jobs.length, 0)
}));

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
        note="Cette page s’appuie sur la base régionale LEXPAT Connect, organisée par région, enrichie pour la lecture employeur et mise à jour en continu à partir de votre liste de référence."
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
        title="Une base régionale pensée pour aller vite"
        intro="Plutôt qu’une liste froide ou dispersée, LEXPAT Connect rassemble les professions en pénurie par région dans un format exploitable immédiatement par les employeurs."
        kicker="Référence LEXPAT Connect"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
            <p className="inline-flex rounded-full border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">
              Mise à jour continue
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">
              La référence rapide pour repérer les professions en pénurie par région
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Notre base regroupe, classe et reformule les professions par région pour permettre une lecture immédiate côté employeur. L’objectif est simple : savoir rapidement si une fonction mérite d’être explorée dans une logique de recrutement international.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full border border-[rgba(23,58,138,0.16)] bg-[#eef4ff] px-3.5 py-1.5 text-xs font-semibold text-[#173A8A]">
                Classement par région
              </span>
              <span className="inline-flex rounded-full border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-3.5 py-1.5 text-xs font-semibold text-[#2f9f97]">
                Lecture employeur
              </span>
              <span className="inline-flex rounded-full border border-[rgba(23,58,138,0.16)] bg-[#f8fbff] px-3.5 py-1.5 text-xs font-semibold text-[#173A8A]">
                Mise à jour constante
              </span>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {regionMetrics.map((region) => (
              <article key={region.id} className="rounded-[24px] border border-[#e3eaf2] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-semibold text-[#1d3b8b]">{region.label}</p>
                <div className="mt-3 flex items-end gap-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7b8f]">Familles</p>
                    <p className="mt-1 text-2xl font-semibold text-[#173A8A]">{region.groups}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7b8f]">Professions</p>
                    <p className="mt-1 text-2xl font-semibold text-[#57b7af]">{region.jobs}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

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
        title="Trois régions, trois lectures différentes des métiers en pénurie"
        intro="C’est un point essentiel : la Belgique ne fonctionne pas avec une seule liste. Bruxelles, la Wallonie et la Flandre publient chacune leur propre lecture du marché, avec un niveau d’opérabilité différent pour l’employeur."
        kicker="Différences régionales"
        muted
      >
        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(23,58,138,0.16)] bg-[#eef4ff] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#173A8A]">Bruxelles</p>
            <p className="mt-2 text-sm font-semibold text-[#173A8A]">Lecture prudente</p>
            <p className="mt-1 text-sm leading-6 text-[#415676]">Un repère utile, mais à articuler avec une lecture administrative plus nuancée.</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">Wallonie</p>
            <p className="mt-2 text-sm font-semibold text-[#2f9f97]">Lecture directe</p>
            <p className="mt-1 text-sm leading-6 text-[#415676]">La liste est souvent la plus simple à mobiliser pour un premier diagnostic employeur.</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(98,84,183,0.18)] bg-[#f4f1ff] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6254B7]">Flandre</p>
            <p className="mt-2 text-sm font-semibold text-[#6254B7]">Lecture par familles</p>
            <p className="mt-1 text-sm leading-6 text-[#415676]">La fonction doit souvent être rapprochée d’une catégorie métier plutôt que d’un intitulé exact.</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {regionInsights.map((region) => {
            const details = shortageJobs2026.find((item) => item.id === region.id);
            const examples = details
              ? details.groups.flatMap((group) => group.jobs).slice(0, 6)
              : [];

            return (
              <article
                key={region.id}
                className={`relative overflow-hidden rounded-[30px] border p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7 ${region.accent}`}
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${region.line}`} />
                <p className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${region.badge}`}>
                  {region.kicker}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{region.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6e83]">{region.text}</p>
                <p className={`mt-4 inline-flex rounded-full border px-3.5 py-1.5 text-sm font-semibold leading-6 ${region.pill}`}>
                  {region.emphasis}
                </p>

                <div className="mt-6 rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a7a8f]">
                    Exemples de fonctions repères
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {examples.map((job) => (
                      <span
                        key={job}
                        className="inline-flex rounded-full border border-[#dfe7ef] bg-white px-3 py-1.5 text-xs font-medium text-[#334968]"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>

              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-[#dce9e7] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">
            Ce que cela change concrètement pour l’employeur
          </h3>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Un même poste peut être plus facile à argumenter dans une région que dans une autre.</span></li>
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>La bonne question n’est pas seulement “le métier est-il en pénurie ?”, mais aussi “dans quelle région et sous quelle logique ?”.</span></li>
            <li className="flex gap-3"><span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#173A8A]" /><span>Pour un recrutement hors UE, la région compétente doit toujours être intégrée dès le départ dans la stratégie.</span></li>
          </ul>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Base régionale LEXPAT Connect</p>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Cette page est pensée comme une référence pratique pour identifier rapidement les professions en pénurie par région, sans obliger l’employeur à naviguer entre plusieurs lectures fragmentées.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-[#e3eaf2] bg-white px-4 py-4 text-sm font-medium text-[#1d3b8b]">
                Professions classées par région
              </div>
              <div className="rounded-2xl border border-[#e3eaf2] bg-white px-4 py-4 text-sm font-medium text-[#1d3b8b]">
                Lecture plus rapide pour PME et RH
              </div>
              <div className="rounded-2xl border border-[#e3eaf2] bg-white px-4 py-4 text-sm font-medium text-[#1d3b8b]">
                Base maintenue et mise à jour en continu
              </div>
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
