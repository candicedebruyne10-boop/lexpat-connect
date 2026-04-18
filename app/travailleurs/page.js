import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";

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
        primaryHref="/travailleurs/rejoindre"
        primaryLabel="Créer mon profil"
        secondaryHref="/metiers-en-penurie"
        secondaryLabel="Voir les métiers recherchés"
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
              { n: "03", href: "#espace-travailleur", title: "L'espace travailleur",     desc: "L'interface dédiée aux candidats." },
              { n: "04", href: "/travailleurs/rejoindre", title: "Créer mon profil",                       desc: "Formulaire guidé en 4 étapes pour présenter votre parcours." },
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
        title="L'espace travailleur"
        intro="Une interface dédiée pour gérer votre profil, votre CV et votre visibilité de façon professionnelle."
        kicker="Espace candidat"
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
              <Link href="/travailleurs/rejoindre" className="secondary-button">
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
        intro="Un parcours guidé en 4 étapes pour présenter votre métier, votre région et vos compétences de façon claire et exploitable."
        kicker="Wizard"
        muted
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <Link
            href="/travailleurs/rejoindre"
            className="primary-button px-10 py-4 text-base"
          >
            Créer mon profil →
          </Link>
          <p className="text-xs text-[#8a9db8]">
            Environ 3 minutes · Compte requis · Version mobile optimisée
          </p>
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
