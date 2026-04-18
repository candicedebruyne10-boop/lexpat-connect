import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import FormCard from "../../components/FormCard";
import {
  groupedProfessionOptionsByRegion,
  professionSectorByRegion,
  sectorOptions
} from "../../lib/professions";

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

const candidateFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: candidateFaq.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function TravailleursPage() {
  return (
    <>
      <Script
        id="faq-travailleurs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(candidateFaqJsonLd) }}
      />
      <Hero
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

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ Sur cette page — navigation</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les sujets traités<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> pour les travailleurs</span>
              </h2>
              <p className="mt-2 text-xs text-[#8a9db8]">Cliquez sur une section ci-dessous pour y accéder directement ↓</p>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi",          title: "Pourquoi créer votre profil",             desc: "Ce que la plateforme vous apporte concrètement." },
              { n: "02", href: "#comment-ca-marche",  title: "Comment ça marche",                       desc: "Le parcours en 3 étapes, sans jargon." },
              { n: "03", href: "#espace-travailleur", title: "L'espace travailleur en préparation",     desc: "Aperçu de l'interface dédiée aux candidats." },
              { n: "04", href: "#formulaire",         title: "Créer mon profil",                        desc: "Formulaire direct pour soumettre votre candidature." },
              { n: "05", href: "#faq",                title: "Questions fréquentes",                    desc: "Les réponses aux doutes les plus courants." },
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
        title="Pourquoi créer votre profil"
        intro="La plateforme est pensée pour vous rendre plus visible, plus lisible et plus crédible auprès d'employeurs belges."
        kicker="Travailleurs"
      >
        <BulletList items={candidateBenefits} />
      </Section>
      </div>

      <div id="comment-ca-marche">
      <Section
        title="Comment ça marche"
        intro="Un parcours simple, centré sur votre visibilité et la mise en relation."
        kicker="3 étapes"
        muted
      >
        <Steps items={candidateSteps} />
      </Section>
      </div>

      <div id="espace-travailleur">
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
      </div>

      <div id="formulaire">
      <Section
        title="Créer mon profil"
        intro="Le statut administratif indiqué permet simplement de mieux comprendre votre point de départ. Il ne vaut jamais validation juridique."
        kicker="Formulaire"
      >
        <div>
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
              { name: "region", label: "Région ou ville souhaitée en Belgique", type: "region-multi", helperText: "Sélectionnez une ou plusieurs régions belges selon votre mobilité." },
              { name: "secteur", label: "Secteur visé", type: "select", placeholder: "Sélectionnez un secteur", options: sectorOptions },
              { name: "autreSecteur", label: "Autre secteur / précision", placeholder: "Indiquez ici un autre secteur si nécessaire", showWhen: { field: "secteur", value: "Autre secteur" } },
              { name: "profession", label: "Métier recherché", type: "select", placeholder: "Choisissez d'abord une région", optionsByField: "region", optionsMap: groupedProfessionOptionsByRegion, deriveField: "secteur", deriveByField: "region", deriveMap: professionSectorByRegion },
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
      </div>

      <CtaBanner
        title="Une question de séjour ou de droit au travail peut être traitée ensuite"
        text="Une fois la mise en relation engagée, le cabinet LEXPAT peut intervenir si votre situation appelle un accompagnement juridique distinct."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir le relais juridique"
        secondaryHref="/contact"
        secondaryLabel="Nous écrire"
      />

      <div id="faq">
      <Section title="Questions fréquentes des travailleurs" kicker="FAQ">
        <Faq items={candidateFaq} />
      </Section>
      </div>
    </>
  );
}
