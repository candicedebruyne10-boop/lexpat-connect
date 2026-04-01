import Link from "next/link";
import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

const primaryPaths = [
  {
    kicker: "Employeurs belges",
    title: "Recrutez des talents internationaux déjà alignés avec vos besoins",
    text: "Déposez votre besoin, ciblez les métiers en pénurie et accédez plus vite à des profils internationaux qualifiés.",
    link: { href: "/employeurs", label: "Je recrute" }
  },
  {
    kicker: "Talents internationaux",
    title: "Rendez votre profil visible auprès d'employeurs belges",
    text: "Présentez votre expérience, vos compétences et votre disponibilité dans un format plus lisible et plus crédible.",
    link: { href: "/travailleurs", label: "Je rends mon profil visible" }
  }
];

const steps = [
  {
    title: "Déposez un besoin ou un profil",
    text: "L'employeur décrit le poste. Le talent présente son parcours, ses compétences et sa disponibilité."
  },
  {
    title: "Le matching s'affine",
    text: "La région, le métier en pénurie, l'expérience et le contexte de recrutement rendent la mise en relation plus pertinente."
  },
  {
    title: "La prise de contact se fait directement",
    text: "Employeurs et talents avancent plus vite vers une mise en relation sérieuse et exploitable."
  }
];

const shortageCards = [
  {
    kicker: "Santé et soins",
    title: "Infirmiers, aides-soignants, profils de soin",
    text: "Des fonctions particulièrement recherchées dans plusieurs régions belges."
  },
  {
    kicker: "Construction",
    title: "Maçons, couvreurs, électriciens, techniciens",
    text: "Des métiers de terrain où les besoins restent élevés et récurrents."
  },
  {
    kicker: "Industrie et maintenance",
    title: "Soudeurs, mécaniciens, opérateurs, maintenance",
    text: "Des profils techniques recherchés pour renforcer les équipes rapidement."
  },
  {
    kicker: "Transport et logistique",
    title: "Chauffeurs, préparateurs, fonctions logistiques",
    text: "Des métiers indispensables pour les entreprises qui recrutent en tension."
  }
];

const faqs = [
  {
    question: "À qui s'adresse LEXPAT Connect ?",
    answer: "Aux employeurs belges qui recrutent dans les métiers en pénurie et aux talents internationaux qui souhaitent rendre leur profil visible en Belgique."
  },
  {
    question: "La plateforme est-elle centrée sur le juridique ?",
    answer: "Non. La priorité de la plateforme est la mise en relation. Le juridique intervient ensuite uniquement si la situation le nécessite."
  },
  {
    question: "Quels profils sont les plus recherchés ?",
    answer: "Principalement des profils liés aux métiers en pénurie en Belgique, notamment dans la santé, la construction, l'industrie, la maintenance et la logistique."
  },
  {
    question: "Quand le cabinet LEXPAT intervient-il ?",
    answer: "Une fois la mise en relation engagée, lorsque le recrutement suppose un permis unique, une question d'immigration économique ou une sécurisation administrative."
  }
];

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de matching pour les métiers en pénurie en Belgique"
        title={
          <>
            Connectez les employeurs belges
            <span className="block text-[#57b7af]">aux talents internationaux qualifiés</span>
          </>
        }
        description="Une plateforme directe pour recruter dans les métiers en pénurie en Belgique, rendre les profils visibles et accélérer les mises en relation sérieuses."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/travailleurs"
        secondaryLabel="Je rends mon profil visible"
        note="Belgique • métiers en pénurie • mise en relation rapide et lisible"
        stats={[
          { value: "Belgique", label: "Une approche pensée pour les besoins de recrutement belges" },
          { value: "Métiers en pénurie", label: "Des profils ciblés sur les fonctions les plus recherchées" },
          { value: "Mise en relation", label: "Une prise de contact plus directe entre entreprises et talents" }
        ]}
        panels={[
          {
            kicker: "Pour les employeurs",
            title: "Trouvez plus vite les profils que vous ne trouvez pas localement",
            text: "Structurez votre besoin et donnez de la visibilité à votre recrutement sur les métiers en tension."
          },
          {
            kicker: "Pour les talents",
            title: "Présentez un profil sérieux, clair et immédiatement exploitable",
            text: "Mettez en avant vos compétences, votre expérience et votre disponibilité pour des employeurs belges."
          }
        ]}
      />

      <Section
        title="Choisissez votre entrée"
        intro="La plateforme s'adresse à deux besoins très simples : recruter plus vite ou rendre son profil visible."
        kicker="Accès direct"
      >
        <CardGrid columns={2} items={primaryPaths} />
      </Section>

      <Section
        title="Comment ça marche"
        intro="Un parcours simple, rapide et centré sur la mise en relation."
        kicker="3 étapes"
        muted
      >
        <Steps items={steps} />
      </Section>

      <Section
        title="Les profils les plus recherchés actuellement en Belgique"
        intro="La plateforme met en avant les besoins les plus récurrents dans les métiers en pénurie, pour faciliter des mises en relation plus utiles."
        kicker="Métiers en pénurie"
      >
        <CardGrid items={shortageCards} columns={2} />
        <div className="mt-8 text-center">
          <Link href="/metiers-en-penurie" className="secondary-button">
            Voir les métiers en pénurie
          </Link>
        </div>
      </Section>

      <Section
        title="Un relais juridique uniquement quand il devient utile"
        intro="Une fois la mise en relation validée, le cabinet LEXPAT peut prendre le relais pour sécuriser un permis unique, une question de droit au travail ou une démarche d'immigration économique."
        kicker="Relais LEXPAT"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <h3 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Le matching d'abord, le juridique ensuite</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              LEXPAT Connect n'a pas vocation à alourdir le parcours. La priorité reste la rencontre entre une entreprise belge et un talent international. Le cabinet intervient seulement lorsque la situation appelle une sécurisation juridique.
            </p>
          </article>
          <article className="rounded-[30px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Cabinet LEXPAT</p>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Immigration économique, permis unique, sécurisation du recrutement : un relais expert et distinct lorsque le dossier le nécessite réellement.
            </p>
            <div className="mt-5">
              <Link href="/accompagnement-juridique" className="ghost-link">
                Découvrir l'accompagnement juridique
              </Link>
            </div>
          </article>
        </div>
      </Section>

      <Section
        title="Questions fréquentes"
        intro="L'essentiel à comprendre avant de déposer un besoin ou de rendre votre profil visible."
        kicker="FAQ"
      >
        <Faq items={faqs} />
      </Section>

      <CtaBanner
        title="Passez à l'action dès maintenant"
        text="Déposez un besoin de recrutement ou rendez votre profil visible pour accélérer la mise en relation en Belgique."
        primaryHref="/employeurs"
        primaryLabel="Je recrute"
        secondaryHref="/travailleurs"
        secondaryLabel="Je rends mon profil visible"
      />
    </>
  );
}
