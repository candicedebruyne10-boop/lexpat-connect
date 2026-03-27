import Link from "next/link";
import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

const primaryPaths = [
  {
    kicker: "Employeurs belges",
    title: "Recruter plus clairement dans les métiers en pénurie",
    text: "Déposez votre besoin, précisez le poste, la région et le contexte de recrutement, puis identifiez plus facilement les profils pertinents.",
    link: { href: "/employeurs", label: "Accéder à l'espace employeurs" }
  },
  {
    kicker: "Travailleurs internationaux",
    title: "Présenter un profil professionnel plus lisible",
    text: "Mettez en avant votre expérience, vos compétences, votre disponibilité et votre situation pour être compris plus rapidement par un employeur belge.",
    link: { href: "/travailleurs", label: "Accéder à l'espace candidats" }
  }
];

const positioningCards = [
  {
    kicker: "Ce que permet LEXPAT Connect",
    title: "Mettre en relation employeurs et talents internationaux",
    text: "La plateforme organise une rencontre plus claire entre besoins de recrutement belges et profils internationaux, en particulier dans les métiers en pénurie."
  },
  {
    kicker: "Ce que la plateforme ne remplace pas",
    title: "L'analyse juridique d'une situation individuelle",
    text: "LEXPAT Connect ne remplace ni une décision administrative ni un conseil juridique personnalisé. Certaines situations doivent être examinées séparément."
  },
  {
    kicker: "Quand LEXPAT intervient",
    title: "Lorsque le recrutement soulève un enjeu juridique concret",
    text: "Permis unique, droit au travail, faisabilité régionale ou sécurisation administrative: le cabinet LEXPAT peut prendre le relais lorsque le dossier le nécessite."
  }
];

const reasons = [
  {
    title: "Une plateforme pensée pour la Belgique",
    text: "Le projet tient compte des réalités propres à Bruxelles, à la Wallonie et à la Flandre, avec une approche plus précise du recrutement international."
  },
  {
    title: "Un cadre plus crédible pour les employeurs",
    text: "Les entreprises trouvent un environnement clair, sérieux et rassurant pour structurer un besoin de recrutement sans promesse excessive."
  },
  {
    title: "Une meilleure lisibilité pour les candidats",
    text: "Les travailleurs internationaux disposent d'un espace pour présenter un profil plus professionnel et plus facilement exploitable."
  },
  {
    title: "Un relais juridique identifiable",
    text: "Quand une mise en relation débouche sur une vraie question d'autorisation de travail ou de séjour, le rôle du cabinet LEXPAT est immédiatement compréhensible."
  }
];

const steps = [
  {
    title: "Déposer un besoin ou créer un profil",
    text: "L'employeur cadre son recrutement. Le candidat présente son parcours, ses compétences et sa disponibilité."
  },
  {
    title: "Structurer les informations utiles",
    text: "Le métier, la région, le contrat, l'expérience et la situation de départ sont présentés de manière plus lisible."
  },
  {
    title: "Faciliter une prise de contact sérieuse",
    text: "La plateforme sert de point d'entrée pour des mises en relation plus claires entre employeurs et talents internationaux."
  },
  {
    title: "Activer le relais juridique si nécessaire",
    text: "Dès qu'une question de droit au travail, de permis unique ou de sécurisation administrative apparaît, le cabinet LEXPAT peut intervenir."
  }
];

const regions = [
  {
    kicker: "Bruxelles-Capitale",
    title: "Des réalités administratives à lire avec nuance",
    text: "Les métiers en pénurie y constituent un repère utile, mais leur portée concrète doit toujours être appréciée avec prudence."
  },
  {
    kicker: "Wallonie",
    title: "Des besoins qui peuvent structurer le recrutement",
    text: "La liste wallonne permet souvent de mieux cadrer certains recrutements, à condition de garder une lecture précise du dossier."
  },
  {
    kicker: "Flandre",
    title: "Une présentation rigoureuse des fonctions concernées",
    text: "Certaines fonctions y sont formulées de manière plus technique et demandent une présentation particulièrement sérieuse."
  }
];

const faqs = [
  {
    question: "LEXPAT Connect est-elle une agence de recrutement ?",
    answer: "Non. LEXPAT Connect est une plateforme de mise en relation entre employeurs belges et travailleurs internationaux."
  },
  {
    question: "Le cabinet LEXPAT intervient-il automatiquement dans chaque dossier ?",
    answer: "Non. Le cabinet intervient lorsqu'une situation soulève une question juridique concrète, par exemple en matière de permis unique, de droit au travail ou d'analyse régionale."
  },
  {
    question: "La plateforme garantit-elle une autorisation de travail ?",
    answer: "Non. La présence d'un métier sur une liste régionale ou sur la plateforme ne remplace jamais l'analyse individualisée d'un dossier."
  },
  {
    question: "À qui s'adresse la plateforme en priorité ?",
    answer: "Aux employeurs belges qui recrutent dans des métiers en tension, et aux travailleurs internationaux qui souhaitent présenter un profil professionnel plus clair et plus crédible."
  }
];

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de mise en relation et relais juridique en Belgique"
        title={
          <>
            Recrutez des talents internationaux en Belgique,
            <span className="block text-[#57b7af]">sans encombre juridique inutile</span>
          </>
        }
        description="LEXPAT Connect aide les employeurs belges à structurer leurs recrutements dans les métiers en pénurie, permet aux travailleurs internationaux de présenter un profil sérieux, et oriente vers le cabinet LEXPAT lorsqu'un accompagnement juridique devient nécessaire."
        primaryHref="/employeurs"
        primaryLabel="Je suis employeur"
        secondaryHref="/travailleurs"
        secondaryLabel="Je suis candidat"
        note="La plateforme facilite la mise en relation. Les prestations juridiques relèvent séparément du cabinet LEXPAT."
        stats={[
          { value: "Employeurs", label: "Un espace pour cadrer plus précisément un besoin de recrutement" },
          { value: "Candidats", label: "Un espace pour présenter un profil professionnel plus lisible" },
          { value: "LEXPAT", label: "Un relais juridique mobilisable lorsque la situation l'exige" }
        ]}
        panels={[
          {
            kicker: "Pour les employeurs",
            title: "Élargir le recrutement sans brouiller le cadre",
            text: "Publiez un besoin clair, identifiez des profils internationaux et comprenez à quel moment un dossier doit être sécurisé juridiquement."
          },
          {
            kicker: "Pour les candidats",
            title: "Rendre un parcours plus compréhensible",
            text: "Présentez votre expérience, vos compétences et votre disponibilité dans un format plus sérieux pour des employeurs belges."
          }
        ]}
      />

      <Section
        title="Deux entrées principales pour deux besoins distincts"
        intro="Que vous recrutiez en Belgique ou que vous souhaitiez rendre votre profil visible, la plateforme vous oriente immédiatement vers le bon parcours."
        kicker="Parcours"
      >
        <CardGrid columns={2} items={primaryPaths} />
      </Section>

      <Section
        title="Une plateforme utile, sans promesse excessive"
        intro="LEXPAT Connect clarifie ce qu'une plateforme de mise en relation peut réellement apporter, et distingue clairement ce qui relève ensuite d'un accompagnement juridique."
        kicker="Clarté"
        muted
      >
        <CardGrid items={positioningCards} />
      </Section>

      <Section
        title="Qui sommes-nous ?"
        intro="LEXPAT Connect est né d'un constat de terrain : recruter un travailleur international en Belgique ne se limite jamais à publier une annonce. Il faut aussi comprendre les réalités régionales, anticiper les enjeux administratifs et savoir à quel moment un relais juridique devient indispensable."
        kicker="Fondatrice"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[32px] border border-[#e5edf4] bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Un projet conçu par Maître Candice Debruyne</h3>
            <p className="mt-4 text-sm leading-8 text-[#5d6e83]">
              En tant qu'avocate active en droit de l'immigration en Belgique, Maître Debruyne accompagne des situations où le recrutement international, le droit au travail et le séjour doivent être lus ensemble. LEXPAT Connect a été pensé pour créer un pont plus lisible entre les besoins concrets des employeurs belges, les profils de travailleurs internationaux et le moment où un accompagnement juridique doit prendre le relais.
            </p>
            <p className="mt-4 text-sm leading-8 text-[#5d6e83]">
              La plateforme ne remplace pas le cabinet. Elle permet d'organiser la rencontre, de structurer l'information utile et d'orienter plus clairement les dossiers qui nécessitent ensuite une analyse individualisée.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/accompagnement-juridique" className="primary-button">
                Découvrir le cabinet LEXPAT
              </Link>
              <a href="https://www.lexpat.be" target="_blank" rel="noreferrer" className="ghost-link">
                Voir le site du cabinet
              </a>
            </div>
          </article>
          <article className="rounded-[32px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              Pourquoi ce site
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-8 text-[#5d6e83]">
              <li><span className="font-semibold text-[#1d3b8b]">Pour les employeurs :</span> clarifier un recrutement international avant qu'il ne devienne un dossier administratif confus.</li>
              <li><span className="font-semibold text-[#1d3b8b]">Pour les candidats :</span> présenter un parcours plus sérieux, plus compréhensible et mieux aligné avec le marché belge.</li>
              <li><span className="font-semibold text-[#1d3b8b]">Pour le cabinet :</span> rendre visible le moment où une mise en relation soulève ensuite un enjeu juridique réel.</li>
            </ul>
            <div className="mt-6 rounded-[24px] border border-[#d9ece9] bg-white p-5 text-sm leading-7 text-[#5d6e83]">
              <p className="font-semibold text-[#1d3b8b]">Version anglaise</p>
              <p className="mt-2">Une version anglaise du site fait partie des prochaines évolutions prioritaires pour améliorer l'accès des travailleurs internationaux à la plateforme.</p>
            </div>
          </article>
        </div>
      </Section>

      <Section
        title="Pourquoi choisir LEXPAT Connect"
        intro="Le projet réunit un besoin de recrutement concret, une meilleure lisibilité des profils et un relais juridique identifiable lorsque le dossier le nécessite."
        kicker="Confiance"
      >
        <CardGrid items={reasons} columns={2} />
      </Section>

      <Section
        title="Comment cela fonctionne"
        intro="Le parcours reste volontairement simple: il structure la mise en relation, clarifie les informations utiles et permet d'orienter le dossier si une question juridique apparaît."
        kicker="Méthode"
        muted
      >
        <Steps items={steps} />
      </Section>

      <Section
        title="Les métiers en pénurie comme point d'entrée stratégique"
        intro="Ils permettent d'organiser les opportunités visibles sur la plateforme, tout en rappelant que chaque recrutement international dépend aussi de la région compétente et de la situation du candidat."
        kicker="Belgique"
      >
        <CardGrid items={regions} />
        <div className="mt-6 rounded-[28px] border border-[#d9ece9] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <p className="font-semibold text-[#1d3b8b]">À retenir</p>
          <p className="mt-2">
            Un métier en pénurie ne garantit pas, à lui seul, la faisabilité d'un recrutement international ni l'obtention d'une autorisation de travail. Le contexte du poste, la région compétente et la situation du candidat restent déterminants.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Lorsque le recrutement soulève une question de droit au travail ou de séjour, le relais juridique doit être immédiat"
        text="Permis unique, analyse régionale, sécurisation administrative ou faisabilité du recrutement: le cabinet LEXPAT peut intervenir dans un cadre distinct lorsque la situation l'exige."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Voir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Parler à LEXPAT"
      />

      <Section
        title="Questions fréquentes"
        intro="Quelques repères utiles pour comprendre le rôle de la plateforme et la place du cabinet LEXPAT dans le parcours."
        kicker="FAQ"
        muted
      >
        <Faq items={faqs} />
      </Section>
    </>
  );
}
