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
    text: "Il autorise un ressortissant hors UE à séjourner et travailler en Belgique comme salarié."
  },
  {
    title: "Qui en a besoin ?",
    text: "Souvent, un salarié hors UE qui vient travailler en Belgique si aucun autre droit au travail ne s'applique déjà."
  },
  {
    title: "Ce n’est pas pour tout le monde",
    text: "Certaines personnes peuvent déjà travailler via leur séjour, leur nationalité ou un statut particulier."
  }
];

const landscapeCards = [
  {
    title: "Union européenne",
    text: "Elle pose le cadre général."
  },
  {
    title: "État fédéral",
    text: "Il gère la partie séjour."
  },
  {
    title: "Régions",
    text: "Elles gèrent la partie travail."
  }
];

const accessCategories = [
  {
    kicker: "Accès direct à l'emploi",
    title: "Le candidat peut déjà travailler en Belgique",
    text: "Le droit au travail existe déjà. Le sujet principal est donc de vérifier correctement le statut ou le titre de séjour.",
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
    text: "Le dossier peut avancer plus facilement, parce que le profil ou la catégorie réduit le poids de l’analyse du marché de l’emploi.",
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
    text: "Ici, il faut montrer que le poste n’a pas pu être pourvu raisonnablement sur le marché belge ou régional.",
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
    text: "Le droit au séjour et le droit au travail doivent être vérifiés avant l’entrée en fonction."
  },
  {
    title: "Ne pas confondre vitesse et sécurité",
    text: "L’urgence ne dispense jamais de choisir la bonne procédure ni la bonne région."
  },
  {
    title: "Attention aux sanctions",
    text: "Employer sans base valable peut entraîner des sanctions administratives, sociales et pénales."
  }
];

const permitSteps = [
  {
    title: "Vérifier le poste et la région compétente",
    text: "On part du lieu de travail, de la fonction, du salaire et du profil."
  },
  {
    title: "Construire le dossier",
    text: "L’employeur et le candidat réunissent les pièces utiles."
  },
  {
    title: "Déposer et suivre la procédure",
    text: "La région traite le travail, l’Office des étrangers traite le séjour."
  }
];

const permitFaq = [
  {
    question: "Qui est compétent pour autoriser un étranger à travailler en Belgique ?",
    answer:
      "La compétence est partagée. L’État fédéral gère l’accès au séjour des étrangers ainsi que l’accès au travail des personnes dont le motif de séjour n’est pas professionnel. Les Régions, elles, sont compétentes pour l’accès au travail des personnes qui séjournent en Belgique pour travailler."
  },
  {
    question: "Certains étrangers peuvent-ils travailler sans aucune démarche de l’employeur ?",
    answer:
      "Oui. Certains profils disposent déjà d’un droit au travail. Dans ce cas, l’employeur ne doit pas introduire de demande préalable. En pratique, le titre de séjour ou le statut de la personne montre déjà que l’accès au marché du travail est illimité."
  },
  {
    question: "Quelles sont les règles pour le travail des étudiants étrangers ?",
    answer:
      "Les étudiants qui disposent d’un titre de séjour valable peuvent travailler, mais dans un cadre limité. En pratique, ils peuvent travailler jusqu’à 20 heures par semaine pendant l’année scolaire. Pendant les vacances scolaires, cette limite ne s’applique pas de la même manière."
  },
  {
    question: "Qu’est-ce que le permis unique ?",
    answer:
      "Le permis unique est une procédure qui combine, dans un même dossier, l’autorisation de séjour et l’autorisation de travail en Belgique pour un travailleur salarié hors Union européenne."
  },
  {
    question: "Qui doit introduire la demande de permis unique ?",
    answer:
      "C’est l’employeur, ou son mandataire, qui introduit la demande pour son futur travailleur. La démarche se fait en ligne sur la plateforme nationale dédiée au permis unique."
  },
  {
    question: "Faut-il toujours prouver qu’aucun travailleur local n’est disponible ?",
    answer:
      "Non. C’est la logique de base, mais il existe de nombreuses situations dans lesquelles l’employeur n’a pas à démontrer qu’il a d’abord cherché localement. C’est notamment le cas pour certaines activités spécifiques ou certains profils qualifiés."
  },
  {
    question: "Quel est le salaire minimum pour embaucher un travailleur étranger sous permis unique ?",
    answer:
      "La rémunération doit toujours atteindre au moins le revenu minimum moyen mensuel garanti, y compris en cas de temps partiel. Pour certaines catégories, comme les profils hautement qualifiés, des seuils nettement plus élevés doivent aussi être respectés."
  },
  {
    question: "Quelle est la durée de validité d’une autorisation de travail limitée ?",
    answer:
      "En règle générale, l’autorisation suit la durée du contrat avec un maximum d’un an. Certaines catégories peuvent aller jusqu’à trois ans, notamment les profils hautement qualifiés, certaines cartes bleues, le personnel de direction ou certains transferts intra-groupe."
  },
  {
    question: "Que se passe-t-il à la fin du contrat de travail d’un étranger sous permis unique ?",
    answer:
      "L’employeur doit signaler la fin de l’occupation à l’autorité régionale compétente. En pratique, le séjour du travailleur reste en principe valable pendant 90 jours après la fin de l’autorisation d’occupation, sauf décision contraire sur le séjour."
  },
  {
    question: "Comment un étranger peut-il obtenir un accès illimité au marché de l’emploi ?",
    answer:
      "Après une certaine durée de travail sous autorisation limitée, le travailleur peut, dans certains cas, demander lui-même un accès illimité au marché de l’emploi. Les conditions précises dépendent notamment de la région compétente et du temps déjà presté ou séjourné en Belgique."
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
        title={
          <>
            Permis unique en Belgique :
            <span className="block text-[#57b7af]">l’essentiel, en langage simple</span>
          </>
        }
        description="Comprenez rapidement quand un permis unique peut être nécessaire, qui décide et ce que l’employeur doit vérifier."
        primaryHref="/contact"
        primaryLabel="Parler à un avocat"
        secondaryHref="/metiers-en-penurie"
        secondaryLabel="Voir les métiers en pénurie"
stats={[
          { value: "UE + Belgique", label: "Un cadre partagé entre règles européennes, État fédéral et régions" },
          { value: "Régions", label: "La partie travail dépend de la région compétente" },
          { value: "Contrôle", label: "L'employeur doit vérifier le droit au travail avant l'occupation" }
        ]}
      />

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">

          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">Sur cette page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les sujets traités<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> sur le permis unique</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~5 min
            </span>
          </div>

          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#principes-generaux",    title: "Les principes généraux",                   desc: "À quoi sert le permis unique et à qui il s’applique." },
              { n: "02", href: "#paysage-institutionnel", title: "Pourquoi le système paraît complexe",      desc: "UE, État fédéral, Régions : qui décide de quoi." },
              { n: "03", href: "#autorisations-travail",  title: "Trois façons d’accéder au marché du travail", desc: "Accès direct, accès facilité ou analyse du marché." },
              { n: "04", href: "#cote-employeur",         title: "Ce que l’employeur doit retenir",          desc: "Vérifier avant l’entrée en fonction, éviter les sanctions." },
              { n: "05", href: "#etapes",                 title: "Comment fonctionne un permis unique",      desc: "Qualifier le poste, monter le dossier, suivre la procédure." },
              { n: "06", href: "#cabinet-lexpat",         title: "Quand faire appel au cabinet LEXPAT",      desc: "Les situations où un avocat spécialisé fait la différence." },
              { n: "07", href: "#faq",                    title: "Questions fréquentes",                     desc: "Réponses courtes aux doutes les plus courants côté employeur." },
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

      <div id="principes-generaux">
      <Section
        title="Les principes généraux"
        intro="Pour travailler en Belgique, il faut une base valable. Parfois elle existe déjà. Parfois il faut un permis unique."
        kicker="Comprendre vite"
      >
        <CardGrid items={basicCards} columns={3} />
      </Section>
      </div>

      <div id="paysage-institutionnel">
      <Section
        title="Pourquoi le système paraît complexe"
        intro="Le permis unique n’est pas géré par une seule autorité. C’est ce qui rend le système parfois difficile à lire."
        kicker="Paysage institutionnel"
        muted
      >
        <CardGrid items={landscapeCards} columns={3} />
      </Section>
      </div>

      <div id="autorisations-travail">
      <Section
        title="Trois lectures très différentes"
        intro="Avant de parler de permis unique, il faut distinguer trois cas : accès direct, accès facilité ou vraie analyse du marché de l’emploi."
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
      </div>

      <div id="cote-employeur">
      <Section
        title="Ce que l’employeur doit retenir"
        intro="Le point clé : vérifier avant l’entrée en fonction."
        kicker="Côté employeur"
        muted
      >
        <CardGrid items={employerPoints} columns={3} />
      </Section>
      </div>

      <div id="etapes">
      <Section
        title="Concrètement, comment fonctionne un permis unique"
        intro="Le dossier suit trois étapes simples : qualifier, préparer, déposer."
        kicker="En 3 étapes"
      >
        <Steps items={permitSteps} />
      </Section>
      </div>

      <div id="cabinet-lexpat">
      <Section
        title="Quand le cabinet LEXPAT intervient"
        intro="La plateforme clarifie le besoin. Le cabinet intervient quand il faut sécuriser juridiquement le dossier."
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
              Il faut articuler la fonction, la région, le contrat, le salaire, le profil du candidat et la logique séjour.
            </p>
          </article>
        </div>
      </Section>
      </div>

      <MemberLockedPermitContent />

      <div id="faq">
      <Section
        title="FAQ permis unique"
        intro="Les réponses courtes aux questions les plus fréquentes côté employeur."
        kicker="FAQ"
      >
        <Faq items={permitFaq} />
      </Section>
      </div>

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
