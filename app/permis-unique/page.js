import Script from "next/script";
import Link from "next/link";
import { CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import MemberLockedPermitContent from "../../components/MemberLockedPermitContent";

export const metadata = {
  title: "Permis unique en Belgique : guide simple pour employeurs | LEXPAT Connect",
  description:
    "Comprenez simplement le permis unique en Belgique : à qui il s'applique, qui décide, ce que cela change pour l'employeur et quand faire intervenir un avocat."
};

const basicCards = [
  {
    title: "À quoi sert le permis unique ?",
    text: "Le permis unique permet à un ressortissant hors Union européenne de séjourner et de travailler en Belgique comme salarié dans un cadre déterminé."
  },
  {
    title: "Qui en a besoin ?",
    text: "En pratique, un travailleur étranger qui vient travailler en Belgique comme salarié doit souvent passer par ce mécanisme si aucun autre droit au travail ne s'applique déjà."
  },
  {
    title: "Ce n’est pas pour tout le monde",
    text: "Certaines personnes ont déjà un droit au travail via leur titre de séjour, leur nationalité, leur statut ou un autre régime spécifique."
  }
];

const landscapeCards = [
  {
    title: "Union européenne",
    text: "Elle fixe le cadre général de certaines règles, dont la logique du permis unique."
  },
  {
    title: "État fédéral",
    text: "L'Office des étrangers intervient pour la partie séjour."
  },
  {
    title: "Régions",
    text: "La région compétente traite la partie travail et examine la fonction, l'employeur et le dossier."
  }
];

const accessCategories = [
  {
    kicker: "Accès direct à l'emploi",
    title: "Le candidat peut déjà travailler en Belgique",
    text: "Dans cette catégorie, l’employeur n’a pas à lancer un permis unique classique, car le droit au travail existe déjà via le statut ou le titre de séjour.",
    points: [
      "L’enjeu principal est de vérifier correctement le document de séjour",
      "Tous les statuts ne donnent pas le même niveau d’accès au travail",
      "Le détail complet est réservé aux membres"
    ],
    href: "#acces-direct",
    tone: "blue"
  },
  {
    kicker: "Accès facilité à l'emploi",
    title: "Le recrutement peut être plus simple à défendre",
    text: "Ici, le dossier peut avancer dans une logique plus favorable, par exemple parce que le profil ou la catégorie réduit le poids de l’analyse du marché de l’emploi.",
    points: [
      "Typiquement : profils hautement qualifiés, direction, chercheurs, transferts intra-groupe",
      "La région, le salaire et le niveau du candidat restent décisifs",
      "Le détail complet est réservé aux membres"
    ],
    href: "#acces-facilite",
    tone: "green"
  },
  {
    kicker: "Nécessité d'une analyse du marché de l'emploi",
    title: "L’employeur doit justifier la difficulté à recruter localement",
    text: "Dans cette catégorie, il faut montrer que le poste n’a pas pu être pourvu raisonnablement sur le marché belge ou régional avant d’avancer plus loin.",
    points: [
      "Ce n’est ni un accès direct, ni une catégorie facilitée",
      "La méthode diffère entre Bruxelles, la Wallonie et la Flandre",
      "Le détail complet est réservé aux membres"
    ],
    href: "#analyse-marche-emploi",
    tone: "dark"
  }
];

const employerPoints = [
  {
    title: "Vérifier avant l’entrée en fonction",
    text: "L'employeur doit vérifier le droit au séjour et le droit au travail avant l'occupation."
  },
  {
    title: "Ne pas confondre vitesse et sécurité",
    text: "Un besoin urgent de recrutement ne dispense pas de vérifier la bonne procédure et la bonne région."
  },
  {
    title: "Attention aux sanctions",
    text: "Employer une personne sans base valable peut entraîner des sanctions administratives, sociales et pénales."
  }
];

const permitSteps = [
  {
    title: "Vérifier le poste et la région compétente",
    text: "On part du lieu de travail, de la fonction, du salaire et du profil du candidat."
  },
  {
    title: "Construire le dossier",
    text: "L'employeur et le candidat réunissent les pièces utiles pour la partie travail et la partie séjour."
  },
  {
    title: "Déposer et suivre la procédure",
    text: "La région traite l'autorisation de travail et l'Office des étrangers intervient sur le séjour."
  }
];

const permitFaq = [
  {
    question: "Le permis unique est-il obligatoire pour tout travailleur étranger ?",
    answer:
      "Non. Tout dépend de la nationalité, du titre de séjour déjà détenu, du statut de la personne et du type de travail envisagé. Certaines personnes ont déjà un droit au travail."
  },
  {
    question: "Un métier en pénurie donne-t-il automatiquement droit au permis unique ?",
    answer:
      "Non. Un métier en pénurie peut aider à soutenir un dossier, mais il ne garantit jamais à lui seul l'obtention du permis unique."
  },
  {
    question: "Qui décide pour un permis unique en Belgique ?",
    answer:
      "La logique est partagée : la région compétente traite la partie travail, et l'État fédéral via l'Office des étrangers intervient pour la partie séjour."
  },
  {
    question: "Quand un employeur doit-il demander un avis juridique ?",
    answer:
      "Dès qu'il y a un doute sur la bonne procédure, la région compétente, le statut du candidat, le niveau de salaire ou les risques de non-conformité."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: permitFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function PermisUniquePage() {
  return (
    <>
      <Script
        id="faq-permis-unique-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero
        badge="Guide employeur — Permis unique"
        title={
          <>
            Permis unique en Belgique :
            <span className="block text-[#57b7af]">l’essentiel, en langage simple</span>
          </>
        }
        description="Cette page vous aide à comprendre rapidement quand un permis unique peut être nécessaire, qui décide, ce que l'employeur doit vérifier et à quel moment faire intervenir le cabinet."
        primaryHref="/contact"
        primaryLabel="Parler à un avocat"
        secondaryHref="/metiers-en-penurie"
        secondaryLabel="Voir les métiers en pénurie"
        note="Objectif : aller droit au but. Pas de jargon inutile, seulement ce qu'un employeur doit comprendre avant de recruter hors UE."
        stats={[
          { value: "UE + Belgique", label: "Un cadre partagé entre règles européennes, État fédéral et régions" },
          { value: "Régions", label: "La partie travail dépend de la région compétente" },
          { value: "Contrôle", label: "L'employeur doit vérifier le droit au travail avant l'occupation" }
        ]}
      />

      <Section
        title="Les principes généraux"
        intro="En version simple : pour travailler en Belgique, un ressortissant étranger doit avoir une base valable pour travailler. Parfois ce droit existe déjà. Parfois il faut une autorisation spécifique, comme le permis unique."
        kicker="Comprendre vite"
      >
        <CardGrid items={basicCards} columns={3} />
      </Section>

      <Section
        title="Pourquoi le système paraît complexe"
        intro="Le permis unique n'est pas géré par une seule autorité. C'est justement ce qui rend les choses parfois difficiles à lire pour un employeur."
        kicker="Paysage institutionnel"
        muted
      >
        <CardGrid items={landscapeCards} columns={3} />
      </Section>

      <Section
        title="Trois lectures très différentes"
        intro="Avant de parler de permis unique, il faut distinguer trois catégories : le droit au travail déjà existant, les cas où l'accès est facilité, et les cas où une vraie analyse du marché de l'emploi reste nécessaire."
        kicker="Autorisation de travail"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {accessCategories.map((item) => (
            <article
              key={item.title}
              className={`rounded-[30px] border p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7 ${
                item.tone === "blue"
                  ? "border-[rgba(23,58,138,0.18)] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)]"
                  : item.tone === "green"
                    ? "border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#ecfaf8_100%)]"
                    : "border-[#dfe8f0] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)]"
              }`}
            >
              <p
                className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  item.tone === "blue"
                    ? "bg-[#eef4ff] text-[#173A8A]"
                    : item.tone === "green"
                      ? "bg-[#ecfaf8] text-[#2f9f97]"
                      : "bg-[#edf3f8] text-[#1b355f]"
                }`}
              >
                {item.kicker}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#607086]">{item.text}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[#4f6178]">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      className={`mt-2 h-2 w-2 rounded-full ${
                        item.tone === "blue"
                          ? "bg-[#173A8A]"
                          : item.tone === "green"
                            ? "bg-[#59B9B1]"
                            : "bg-[#58728f]"
                      }`}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    item.tone === "blue"
                      ? "bg-[#173A8A] text-white hover:bg-[#143273]"
                      : item.tone === "green"
                        ? "bg-[#59B9B1] text-white hover:bg-[#48aaa2]"
                        : "border border-[#d7e2ec] bg-white text-[#1d3b8b] hover:bg-[#f7faff]"
                  }`}
                >
                  Voir le détail membre
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Ce que l'employeur doit retenir"
        intro="Le point le plus important : vérifier avant l'entrée en fonction. C'est là que se joue le risque."
        kicker="Côté employeur"
        muted
      >
        <CardGrid items={employerPoints} columns={3} />
      </Section>

      <Section
        title="Concrètement, comment fonctionne un permis unique"
        intro="Le dossier se construit en plusieurs étapes. L'objectif est de vérifier le poste, la région compétente et la situation réelle du candidat avant tout dépôt."
        kicker="En 3 étapes"
      >
        <Steps items={permitSteps} />
      </Section>

      <Section
        title="Quand le cabinet LEXPAT intervient"
        intro="LEXPAT Connect sert d'abord à clarifier le besoin et le recrutement. Le cabinet intervient ensuite quand il faut sécuriser juridiquement le dossier."
        kicker="Relais juridique"
        muted
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <h3 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">Le bon moment pour demander un accompagnement</h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d6e83]">
              <li>La fonction est sensible ou difficile à qualifier</li>
              <li>La région compétente n'est pas évidente</li>
              <li>Le profil du candidat soulève une question de séjour ou de droit au travail</li>
              <li>Vous voulez éviter une erreur de procédure ou un risque de sanction</li>
            </ul>
          </article>
          <article className="rounded-[30px] border border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="inline-flex rounded-full bg-[#ecfaf8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">
              À retenir
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">Le permis unique ne se résume pas à un formulaire</h3>
            <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
              Il faut articuler la fonction, la région, le contrat, le salaire, le profil du candidat et la logique séjour. C'est là que l'accompagnement juridique devient utile.
            </p>
          </article>
        </div>
      </Section>

      <MemberLockedPermitContent />

      <Section
        title="FAQ permis unique"
        intro="Les réponses courtes aux questions les plus fréquentes côté employeur."
        kicker="FAQ"
      >
        <Faq items={permitFaq} />
      </Section>

      <CtaBanner
        title="Vous voulez savoir si votre recrutement passe par un permis unique ?"
        text="Expliquez simplement le poste, la région et le profil recherché. Nous vous aidons à savoir s'il faut avancer sur le permis unique et à quel moment sécuriser le juridique."
        primaryHref="/contact"
        primaryLabel="Parler à un avocat"
        secondaryHref="/employeurs"
        secondaryLabel="Déposer un besoin"
      />
    </>
  );
}
