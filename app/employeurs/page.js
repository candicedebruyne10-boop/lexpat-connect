import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import {
  groupedProfessionOptionsByRegion,
  professionSectorByRegion,
  sectorOptions
} from "../../lib/professions";

const employerBenefits = [
  {
    title: "Décrivez clairement le poste",
    text: "Métier, région, contrat, compétences attendues : votre besoin devient plus lisible dès le départ."
  },
  {
    title: "Touchez des travailleurs internationaux ciblés",
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
    text: "Votre recherche gagne en lisibilité et peut être rapprochée de travailleurs internationaux pertinents."
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
    answer: "Aux employeurs belges qui souhaitent recruter des travailleurs internationaux, en particulier dans les métiers en pénurie."
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

const employerFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: employerFaq.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function EmployeursPage() {
  return (
    <>
      <Script
        id="faq-employeurs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employerFaqJsonLd) }}
      />
      <Hero
        title={
          <>
            Trouvez des travailleurs internationaux
            <span className="block text-[#57b7af]">pour les métiers en pénurie en Belgique</span>
          </>
        }
        description="Déposez votre besoin, gagnez en visibilité et accélérez la mise en relation avec des profils internationaux qualifiés."
        primaryHref="/employeurs/rejoindre"
        primaryLabel="Trouver un travailleur"
        secondaryHref="/travailleurs"
        secondaryLabel="Voir le parcours travailleurs"
      />

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ Sur cette page — navigation</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les sujets traités<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> pour les employeurs</span>
              </h2>
              <p className="mt-2 text-xs text-[#8a9db8]">Cliquez sur une section ci-dessous pour y accéder directement ↓</p>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi",          title: "Pourquoi chercher ici",                desc: "Ce que la plateforme vous apporte concrètement." },
              { n: "02", href: "#comment-ca-marche",  title: "Comment ça marche",                    desc: "Le parcours en 3 étapes, sans jargon." },
              { n: "03", href: "#espace-employeur",   title: "L'espace employeur",    desc: "L'interface dédiée aux recruteurs." },
              { n: "04", href: "/employeurs/rejoindre", title: "Trouver un travailleur",              desc: "Formulaire guidé en 4 étapes pour décrire le profil recherché." },
              { n: "05", href: "#faq",                title: "Questions fréquentes",                 desc: "Les réponses aux doutes les plus courants." },
            ].map(({ n, href, title, desc }) => (
              <a
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-4 shadow-sm transition hover:border-[#57b7af] hover:shadow-md"
              >
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-bold text-[#1d3b8b] transition group-hover:bg-[#57b7af] group-hover:text-white">
                  {n}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">{title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-[#6b85a0]">{desc}</div>
                </div>
                <span className="ml-auto mt-1 flex-shrink-0 text-[#c5d8ec] transition group-hover:translate-x-1 group-hover:text-[#57b7af]">→</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="pourquoi">
      <Section
        title="Pourquoi chercher un travailleur ici"
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
      </div>

      <div id="comment-ca-marche">
      <Section
        title="Comment ça marche"
        intro="Un parcours direct, sans jargon, centré sur le recrutement."
        kicker="3 étapes"
        muted
      >
        <Steps items={employerSteps} />
      </Section>
      </div>

      <div id="espace-employeur">
      <Section
        title="L'espace employeur"
        intro="Une interface dédiée pour structurer vos offres, votre fiche entreprise et le suivi des profils."
        kicker="Espace recruteur"
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
      </div>

      <div id="formulaire">
      <Section
        title="Trouver un travailleur"
        intro="Plus votre demande est précise, plus la mise en relation sera efficace."
        kicker="Formulaire"
        muted
      >
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#dce8f5] bg-white px-5 py-4 sm:hidden">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#1E3A78]">Sur mobile ?</p>
            <p className="text-xs text-[#8a9db8]">Version simplifiée en 4 étapes, pensée pour le téléphone.</p>
          </div>
          <Link href="/employeurs/rejoindre" className="flex-shrink-0 rounded-xl bg-[#1E3A78] px-4 py-2 text-sm font-bold text-white">
            Utiliser →
          </Link>
        </div>
        <div>
          <FormCard
            title="Formulaire employeur"
            intro="Décrivez votre besoin pour permettre une première lecture claire et exploitable."
            buttonLabel="Trouver un travailleur"
            formType="employeur"
            fields={[
              { label: "Nom du contact", placeholder: "Prénom Nom" },
              { label: "Entreprise", placeholder: "Nom de l'entreprise" },
              { label: "Email professionnel", placeholder: "contact@entreprise.be", type: "email" },
              { label: "Téléphone", placeholder: "+32 ..." },
              { name: "region", label: "Région concernée", type: "region-multi", helperText: "Sélectionnez une, deux ou trois régions selon votre périmètre de recrutement." },
              { name: "secteur", label: "Secteur", type: "select", placeholder: "Sélectionnez un secteur", options: sectorOptions },
              { name: "autreSecteur", label: "Autre secteur / précision", placeholder: "Indiquez ici un autre secteur si nécessaire", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Métier recherché", type: "select", placeholder: "Choisissez d'abord une région", optionsByField: "region", optionsMap: groupedProfessionOptionsByRegion, deriveField: "secteur", deriveByField: "region", deriveMap: professionSectorByRegion },
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
      </div>

      <CtaBanner
        title="Une fois la mise en relation engagée, le juridique peut prendre le relais"
        text="Permis unique, droit au travail, immigration économique : le cabinet LEXPAT intervient ensuite seulement si le recrutement le nécessite."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir le relais juridique"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />

      {/* ── Pages régionales & thématiques ── */}
      <section className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
            Ressources par ville et par sujet
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Recrutez dans votre région
          </h2>
          <p className="mt-2 text-sm text-[#607086]">
            Chaque page est adaptée au contexte d&apos;une ville ou d&apos;un sujet spécifique — métiers en pénurie, cadre juridique et profils disponibles.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Liège", description: "Métiers en pénurie à Liège", href: "/employeurs/liege-metiers-en-penurie" },
              { label: "Anvers", description: "Métiers en pénurie à Anvers", href: "/employeurs/anvers-metiers-en-penurie" },
              { label: "Gand", description: "Métiers en pénurie à Gand", href: "/employeurs/gand-metiers-en-penurie" },
              { label: "Bruges", description: "Métiers en pénurie à Bruges", href: "/employeurs/bruges-metiers-en-penurie" },
              { label: "Recrutement international", description: "6 entreprises sur 10 recrutent déjà des profils étrangers", href: "/recrutement-international" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col gap-2 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-5 shadow-sm transition hover:border-[#57b7af] hover:shadow-md"
              >
                <span className="text-sm font-bold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">
                  {p.label} →
                </span>
                <span className="text-xs leading-relaxed text-[#6b85a0]">{p.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="faq">
      <Section title="Questions fréquentes des employeurs" kicker="FAQ">
        <Faq items={employerFaq} />
      </Section>
      </div>
    </>
  );
}
