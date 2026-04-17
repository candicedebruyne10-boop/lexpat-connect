import Link from "next/link";
import { Section, Faq } from "../../components/Sections";

export const metadata = {
  title: "Travailleurs hautement qualifiés en Belgique | LEXPAT Connect",
  description:
    "Accès facilité au marché de l'emploi belge pour les profils hautement qualifiés : conditions par région, Carte Bleue Européenne, avantages et procédure."
};

const regionCards = [
  {
    region: "Bruxelles-Capitale",
    color: "#1d3b8b",
    bg: "#eef5ff",
    border: "#c5d8f5",
    conditions: [
      { label: "Qualification", value: "Diplôme de l'enseignement supérieur pertinent pour la fonction" },
      { label: "Salaire minimum", value: "3 703,44 €/mois brut (78 % du salaire moyen) — au 1er janvier 2025" }
    ]
  },
  {
    region: "Région flamande",
    color: "#2b6f3e",
    bg: "#eef9f2",
    border: "#b8e4c6",
    conditions: [
      { label: "Qualification", value: "Diplôme de l'enseignement supérieur, OU 3 ans d'expérience sur 7 ans, OU manager/spécialiste IT (niveau 6)" },
      { label: "Salaire minimum", value: "50 310 €/an (53 220 € en 2026) — réduction à 80 % pour les moins de 30 ans, infirmiers et enseignants" }
    ]
  },
  {
    region: "Région wallonne",
    color: "#7c3a1e",
    bg: "#fff7f3",
    border: "#f5cdb8",
    conditions: [
      { label: "Qualification", value: "Diplôme de l'enseignement supérieur (3 ans ou niveau 5)" },
      { label: "Salaire minimum", value: "48 912 €/an brut minimum pour 2025" }
    ]
  }
];

const advantages = [
  {
    icon: "⏳",
    title: "Permis jusqu'à 3 ans",
    text: "Contrairement à la règle générale (max. 1 an), les travailleurs hautement qualifiés et les détenteurs d'une Carte Bleue peuvent obtenir une autorisation allant jusqu'à 3 ans, dans la limite de la durée du contrat."
  },
  {
    icon: "🔄",
    title: "Mobilité simplifiée",
    text: "En Région wallonne, une activité complémentaire chez un autre employeur est possible sans autorisation explicite. Pour la Carte Bleue (Wallonie & Bruxelles), un changement d'employeur après 12 mois nécessite une simple notification."
  },
  {
    icon: "✅",
    title: "Dispense d'examen du marché",
    text: "L'employeur n'a pas à prouver l'absence de candidat local disponible. La procédure est donc plus rapide et moins contraignante que pour un profil standard."
  }
];

const faqItems = [
  {
    question: "Un employeur peut-il embaucher un travailleur étranger sans demander de permis ?",
    answer: "Oui, certains étrangers bénéficient d'une autorisation de travail « de plein droit » : leur carte de séjour porte la mention « MARCHÉ DU TRAVAIL : ILLIMITÉ ». C'est le cas des citoyens UE, des réfugiés reconnus, des bénéficiaires du regroupement familial ou des étudiants (limités à 20 h/semaine en période scolaire). L'employeur doit néanmoins vérifier le titre de séjour et déclarer l'entrée et la sortie du travailleur."
  },
  {
    question: "Qu'est-ce que le Permis Unique et qui doit le demander ?",
    answer: "Le Permis Unique combine l'autorisation de séjour (État fédéral) et l'autorisation de travail (Régions) en une seule démarche. C'est toujours l'employeur (ou son mandataire) qui introduit la demande en ligne via la plateforme singlepermit, au nom du candidat."
  },
  {
    question: "Le candidat doit-il obligatoirement se trouver à l'étranger lors de la demande ?",
    answer: "Pas nécessairement. Il doit être soit dans son pays d'origine, soit déjà en Belgique avec un titre de séjour valide (visa court séjour, carte A). Les documents précaires comme l'Attestation d'Immatriculation (carte orange) ne permettent généralement pas d'introduire la demande depuis la Belgique."
  },
  {
    question: "Faut-il toujours prouver qu'il n'y a pas de candidat local disponible ?",
    answer: "En règle générale oui, via la publication d'une offre chez Actiris, le Forem ou le VDAB. Mais le personnel hautement qualifié bénéficie d'une dispense totale de cet examen du marché de l'emploi, tout comme la direction, les sportifs professionnels, les chercheurs ou les artistes."
  },
  {
    question: "Quel est le salaire minimum pour embaucher sous Permis Unique ?",
    answer: "La rémunération doit être au moins équivalente au RMMMG, fixé à 2 111,48 €/mois depuis le 1er février 2025, même à temps partiel. Pour les profils dispensés de l'examen du marché, des seuils salariaux bien plus élevés s'appliquent selon la Région (voir les conditions par région ci-dessus)."
  },
  {
    question: "Quelle est la durée de validité du Permis Unique ?",
    answer: "En règle générale, la durée correspond à celle du contrat de travail, avec un maximum de 1 an. Cette limite peut aller jusqu'à 3 ans pour le personnel hautement qualifié, les détenteurs d'une Carte Bleue, les dirigeants ou les travailleurs en transfert intra-groupe."
  },
  {
    question: "Un travailleur sous Permis Unique peut-il changer d'employeur ou exercer une activité complémentaire ?",
    answer: "Par défaut, l'accès au marché est limité à un employeur et une fonction précise. Toutefois, en Région wallonne, certains profils hautement qualifiés peuvent exercer une activité complémentaire sans autorisation. Pour la Carte Bleue, un changement d'employeur après 12 mois est possible sur simple notification, en Wallonie et à Bruxelles."
  },
  {
    question: "Que doit faire l'employeur lorsque le contrat se termine ?",
    answer: "Il a l'obligation formelle de communiquer la fin de l'occupation à l'autorité régionale compétente. Le droit de séjour du travailleur reste en principe valable 90 jours après la fin de l'autorisation de travail, sauf décision de retrait."
  },
  {
    question: "Que se passe-t-il si la carte expire pendant l'examen du renouvellement ?",
    answer: "L'employeur doit introduire la demande de renouvellement au plus tard deux mois avant l'expiration. Si le permis expire pendant le traitement mais que la demande a été déclarée recevable, la commune délivre une Annexe 49 (autorisation provisoire). Sa validité est admise dans les faits par les Régions pour continuer l'occupation."
  },
  {
    question: "Comment un travailleur peut-il obtenir un accès illimité au marché du travail ?",
    answer: "Après 4 ans de travail sous autorisation limitée (ou 30 mois à Bruxelles sous condition de 10 ans de séjour ininterrompu), le travailleur peut demander lui-même une admission au travail pour durée illimitée auprès de sa Région de domicile. Une fois obtenu, son accès au marché ne dépend plus d'aucun employeur."
  }
];

export default function TravailleursHautementQualifiesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#060c26_0%,#0e1f5c_50%,#0e2a4a_100%)] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_70%_50%,rgba(89,185,177,0.12),transparent_70%)]" />
        <div className="container-shell relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9dd4d0]">
              <Link href="/permis-unique" className="hover:text-white transition">Permis unique</Link>
              <span className="text-white/30">›</span>
              <span>Travailleurs hautement qualifiés</span>
            </div>
            <h1 className="mt-8 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-white">
              Travailleurs hautement<br />
              <span className="text-[#5ec9c1]">qualifiés</span> en Belgique
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Un accès facilité au marché de l'emploi belge — sans examen du marché pour l'employeur — mais soumis à des conditions strictes de qualification et de salaire, qui varient selon les trois Régions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Dispense d'examen du marché", "Permis jusqu'à 3 ans", "Carte Bleue Européenne"].map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.07] px-3.5 py-1.5 text-xs font-semibold text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#57b7af]">Sur cette page</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les sujets traités<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> sur les travailleurs hautement qualifiés</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~5 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#principe",       title: "Accès facilité, conditions strictes",        desc: "Pourquoi ce statut simplifie la procédure pour l'employeur." },
              { n: "02", href: "#regions",         title: "Conditions par région",                      desc: "Qualification et salaire minimum à Bruxelles, en Flandre et en Wallonie." },
              { n: "03", href: "#carte-bleue",     title: "La Carte Bleue Européenne",                  desc: "Une alternative avec des avantages spécifiques de mobilité." },
              { n: "04", href: "#avantages",       title: "Ce que ce statut change concrètement",       desc: "Durée du permis, mobilité simplifiée, dispense d'examen du marché." },
              { n: "05", href: "#procedure",       title: "Comment ça se passe",                        desc: "Les étapes de la demande de permis unique pour ce profil." },
              { n: "06", href: "#faq",             title: "Questions fréquentes",                       desc: "Réponses aux doutes les plus courants côté employeur." },
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

      {/* ── Principe général ── */}
      <div id="principe">
      <Section kicker="Le principe" title="Accès facilité, conditions strictes">
        <div className="prose-lexpat max-w-3xl">
          <p className="text-base leading-8 text-[#4a5b6e]">
            Les travailleurs hautement qualifiés bénéficient d'un accès facilité au marché de l'emploi belge. Leur futur employeur doit introduire une demande de Permis Unique, mais il est <strong className="text-[#1d3b8b]">totalement dispensé de l'examen du marché de l'emploi</strong> — autrement dit, il n'a pas besoin de prouver qu'aucun candidat local n'était disponible pour le poste.
          </p>
          <p className="mt-5 text-base leading-8 text-[#4a5b6e]">
            En contrepartie, le candidat et l'employeur doivent respecter des conditions strictes de qualification et de rémunération minimum, qui <strong className="text-[#1d3b8b]">varient selon les trois Régions</strong> compétentes.
          </p>
        </div>
      </Section>
      </div>

      {/* ── Conditions par région ── */}
      <div id="regions">
      <Section kicker="Conditions" title="Par région" muted>
        <div className="grid gap-6 md:grid-cols-3">
          {regionCards.map((card) => (
            <div
              key={card.region}
              className="rounded-[28px] border p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: card.color }}>
                {card.region}
              </p>
              <div className="mt-5 space-y-4">
                {card.conditions.map((c) => (
                  <div key={c.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8094a8]">{c.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#2a3b4e] font-medium">{c.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      </div>

      {/* ── Carte Bleue Européenne ── */}
      <div id="carte-bleue">
      <Section kicker="Alternative" title="La Carte Bleue Européenne">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-base leading-8 text-[#4a5b6e]">
              La Carte Bleue Européenne est un statut similaire destiné au même public — diplômés de l'enseignement supérieur, travailleurs expérimentés ou experts IT. Elle s'obtient selon les mêmes étapes que le Permis Unique, mais avec des <strong className="text-[#1d3b8b]">seuils de rémunération plus élevés</strong> que ceux prévus pour les travailleurs hautement qualifiés classiques.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4a5b6e]">
              En contrepartie, elle offre des avantages spécifiques en matière de mobilité : après 12 mois de travail, un changement d'employeur est possible sur <strong className="text-[#1d3b8b]">simple notification</strong> (en Wallonie et à Bruxelles), sans nouvelle demande complète.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dce9e7] bg-[linear-gradient(135deg,#f5fbfb,#eef7ff)] p-7 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#57b7af]">En résumé</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#3a4f63]">
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Même public cible que le statut hautement qualifié</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Seuil salarial plus élevé mais mobilité facilitée</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Durée jusqu'à 3 ans (même règle)</li>
              <li className="flex gap-3"><span className="mt-0.5 text-[#57b7af]">✓</span> Changement d'employeur sur notification après 12 mois</li>
            </ul>
          </div>
        </div>
      </Section>
      </div>

      {/* ── Avantages ── */}
      <div id="avantages">
      <Section kicker="Avantages" title="Ce que ce statut change concrètement" muted>
        <div className="grid gap-6 md:grid-cols-3">
          {advantages.map((adv) => (
            <div key={adv.title} className="rounded-[28px] border border-[#e4edf4] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <span className="text-3xl">{adv.icon}</span>
              <p className="mt-4 text-base font-semibold text-[#17345d]">{adv.title}</p>
              <p className="mt-2 text-sm leading-7 text-[#5d7080]">{adv.text}</p>
            </div>
          ))}
        </div>
      </Section>
      </div>

      {/* ── Procédure ── */}
      <div id="procedure">
      <Section kicker="Procédure" title="Comment ça se passe">
        <div className="max-w-2xl space-y-5">
          {[
            { n: "1", title: "L'employeur initie la demande", text: "C'est toujours l'employeur (ou son mandataire) qui introduit la demande en ligne via la plateforme singlepermit, au nom du candidat." },
            { n: "2", title: "Le candidat doit être en situation régulière", text: "Au moment de la demande, le travailleur doit se trouver dans son pays d'origine, ou disposer d'un droit de séjour valable s'il est déjà en Belgique. Les documents de séjour précaires ne sont généralement pas autorisés." },
            { n: "3", title: "Approbation et double autorisation", text: "Une fois approuvé, le Permis Unique vaut à la fois autorisation de séjour et autorisation de travail. Le candidat peut alors rejoindre la Belgique et commencer son emploi." }
          ].map((step) => (
            <div key={step.n} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d3b8b,#57b7af)] text-sm font-bold text-white">
                {step.n}
              </span>
              <div className="pt-1.5">
                <p className="font-semibold text-[#17345d]">{step.title}</p>
                <p className="mt-1.5 text-sm leading-7 text-[#5d7080]">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      </div>

      {/* ── FAQ ── */}
      <div id="faq">
      <Faq items={faqItems} />
      </div>

      {/* ── CTA ── */}
      <section className="border-t border-[#edf1f5] bg-white py-16">
        <div className="container-shell">
          <div className="rounded-[32px] border border-[#dce9e7] bg-[linear-gradient(160deg,#f5fbfb,#eef5ff)] p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#57b7af]">Prochaine étape</p>
            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#17345d] sm:text-3xl">
              Votre profil correspond à ce statut ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5d7080]">
              Déposez votre profil sur LEXPAT Connect pour être mis en relation avec des employeurs belges qui recherchent exactement ce type de profil.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/travailleurs" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#57b7af,#2b8f88)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(87,183,175,0.35)] transition hover:-translate-y-px">
                Déposer mon profil
              </Link>
              <Link href="/permis-unique" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl border border-[#d5e5f0] bg-white px-8 py-3.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#b8cfe0]">
                Retour au guide Permis unique
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
