"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M8 10V7.75A4 4 0 0 1 12 4a4 4 0 0 1 4 3.75V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SmallCard({ title, subtitle, note }) {
  return (
    <article className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <h4 className="text-base font-semibold text-[#163573]">{title}</h4>
      {subtitle ? <p className="mt-2 text-sm font-medium text-[#2f9f97]">{subtitle}</p> : null}
      {note ? <p className="mt-3 text-sm leading-7 text-[#607086]">{note}</p> : null}
    </article>
  );
}

function ContentSection({ id, badge, badgeTone = "blue", title, intro, children }) {
  const tones = {
    blue: "bg-[#eef4ff] text-[#173A8A]",
    green: "bg-[#ecfaf8] text-[#2f9f97]",
    dark: "bg-[#edf3f8] text-[#1b355f]"
  };

  return (
    <section className="rounded-[30px] border border-[#dfe8f0] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
      {id ? <span id={id} className="block -translate-y-24" aria-hidden="true" /> : null}
      <p className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${tones[badgeTone]}`}>
        {badge}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{title}</h3>
      {intro ? <p className="mt-3 max-w-4xl text-sm leading-7 text-[#607086]">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const noPermitRows = [
  "Étrangers engagés avant l’âge de 18 ans dans les liens d’un contrat d’apprentissage ou de formation en alternance.",
  "Étrangers effectuant en Belgique un stage obligatoire dans le cadre de leurs études en Belgique ou dans un État membre (EEE + Suisse)."
];

const unlimitedRows = [
  {
    situation: "Citoyen UE (+ Suisse, Liechtenstein et Islande)",
    title: "Annexe 19, carte EU ou carte EU+",
    note: "L’accès au marché du travail découle de la nationalité et non de la détention de la carte."
  },
  {
    situation: "Membre de la famille d’un citoyen UE reconnu",
    title: "Carte F ou F+",
    note: "Le droit au travail est attaché au statut familial reconnu."
  },
  {
    situation: "Membre de famille d’un Belge reconnu",
    title: "Carte F ou F+",
    note: "Accès large au marché du travail."
  },
  {
    situation: "Étranger admis au séjour illimité en Belgique",
    title: "Cartes B / C / L",
    note: "Pas de permis unique à demander pour exercer comme salarié."
  },
  {
    situation: "Bénéficiaire de l’accord de retrait (Brexit)",
    title: "Carte M",
    note: "Régime spécifique lié au retrait du Royaume-Uni."
  },
  {
    situation: "Titulaire d’une carte d’identité spéciale",
    title: "Cartes D, C, P",
    note: "À lire avec prudence selon la fonction exercée et les accords applicables."
  }
];

const limitedRows = [
  {
    situation: "Réfugié reconnu ou bénéficiaire d’une protection subsidiaire / temporaire",
    title: "Carte A",
    note: "Le droit au travail découle d’abord du statut et pas seulement de la carte."
  },
  {
    situation: "Régularisation sur base des articles 9, 9bis, 9ter ou 13",
    title: "Carte A",
    note: "À vérifier selon la décision de séjour exacte."
  },
  {
    situation: "Vacances-travail",
    title: "Carte A",
    note: "Dans les limites prévues par l’accord international applicable."
  },
  {
    situation: "Étudiant pour un travail accessoire",
    title: "Carte A / annexe 33",
    note: "Maximum 20 heures par semaine pendant l’année scolaire, sans limitation pour les vacances scolaires."
  },
  {
    situation: "Étudiant pour leur stage d’études",
    title: "Carte A / annexe 33",
    note: "Le stage doit rester dans le cadre des études."
  },
  {
    situation: "Ancien étudiant avec séjour d’une année après études",
    title: "Carte A",
    note: "Séjour orienté recherche d’emploi ou création d’entreprise."
  },
  {
    situation: "Regroupement familial avec un ressortissant de pays tiers",
    title: "Carte A",
    note: "Attention si le regroupant est étudiant."
  },
  {
    situation: "Membre de la famille d’un chercheur en mobilité de courte durée",
    title: "Annexe 62",
    note: "À lire selon le cadre exact de mobilité."
  }
];

const precariousRows = [
  {
    situation: "Demande de regroupement familial avec Belge (art. 40bis)",
    title: "AI (carte orange) ou annexe 19ter",
    note: "Situation de séjour précaire à lire avec prudence."
  },
  {
    situation: "Demande de regroupement familial avec un citoyen UE (art. 40ter)",
    title: "AI (carte orange) ou annexe 19ter",
    note: "Sauf certaines autres hypothèses de membres de famille."
  },
  {
    situation: "Demande de regroupement familial avec un ressortissant de pays tiers",
    title: "AI (carte orange)",
    note: "Attention si le regroupant est étudiant."
  },
  {
    situation: "Demande d’asile après 4 mois de procédure",
    title: "AI (carte orange)",
    note: "À vérifier selon l’état exact de la procédure."
  },
  {
    situation: "Victime de traite des êtres humains autorisée au séjour",
    title: "AI (carte orange)",
    note: "Lecture liée au statut de protection."
  },
  {
    situation: "Demande de bénéficiaire de l’accord de retrait",
    title: "Annexes 56, 57, 58",
    note: "Régime transitoire spécifique."
  },
  {
    situation: "Recours contre un refus de regroupement familial ou de bénéficiaire de l’accord de retrait",
    title: "Annexe 35",
    note: "Attention : mêmes limites que sous AI selon les cas."
  },
  {
    situation: "Étranger autorisé au travail dans l’attente du renouvellement",
    title: "Annexe 15",
    note: "Sous réserve des critères déjà remplis auparavant."
  },
  {
    situation: "Travailleur frontalier, conjoint de Belge ou de citoyen UE",
    title: "Annexe 15",
    note: "En principe titulaire d’un droit de séjour de plus de 3 mois dans l’État de résidence."
  }
];

const activityCards = [
  {
    title: "Personnel hautement qualifié",
    subtitle: "Dispense de l’examen du marché de l’emploi",
    note: "La logique repose sur un niveau de qualification suffisant et un seuil de rémunération minimal, avec des lectures régionales différentes."
  },
  {
    title: "Bruxelles-Capitale",
    subtitle: "Catégories spécifiques de travailleurs",
    note: "Lecture des travailleurs hautement qualifiés et des catégories spécifiques prévues par la réglementation bruxelloise."
  },
  {
    title: "Wallonie",
    subtitle: "Travailleurs hautement qualifiés + catégories particulières",
    note: "Lecture structurée entre travailleurs hautement qualifiés et catégories particulières de travailleurs."
  },
  {
    title: "Flandre",
    subtitle: "Catégories spéciales de travailleurs",
    note: "Lecture plus fonctionnelle des catégories, avec approche flamande des exemptions."
  }
];

const highlyQualifiedRows = [
  {
    region: "Bruxelles-Capitale",
    title: "Diplôme pertinent pour la fonction",
    note: "Lecture centrée sur la qualification et sur un seuil minimal de rémunération applicable dans la région."
  },
  {
    region: "Wallonie",
    title: "Diplôme supérieur ou expérience qualifiante",
    note: "La lecture peut intégrer l’expérience professionnelle suffisante dans certains cas, avec seuil salarial à respecter."
  },
  {
    region: "Flandre",
    title: "Diplôme supérieur ou niveau qualifiant reconnu",
    note: "Lecture flamande plus structurée autour du niveau de qualification et des seuils annuels applicables."
  }
];

const specificActivityRows = [
  {
    title: "Personnel de direction",
    note: "On regarde surtout le niveau réel de direction, d’autonomie, de gestion journalière et de pouvoir de représentation. Le diplôme n’est pas toujours central, mais la rémunération minimale reste importante."
  },
  {
    title: "Sportifs professionnels et entraîneurs",
    note: "Le point d’attention principal reste la rémunération minimale et la réalité du cadre professionnel."
  },
  {
    title: "Artistes de spectacle",
    note: "Le caractère artistique réel de l’activité et le niveau de rémunération restent centraux."
  },
  {
    title: "Ministre d’un culte reconnu",
    note: "Catégorie spécifique à lire à part, avec logique propre."
  },
  {
    title: "Jeunes au pair",
    note: "Il faut vérifier l’âge, le niveau d’études, la famille d’accueil, la langue, le volume d’heures et la compensation financière."
  },
  {
    title: "Stagiaires",
    note: "La durée, le cadre d’études, l’objectif pédagogique et le contrat de stage sont déterminants."
  },
  {
    title: "Travailleurs saisonniers",
    note: "Catégorie très encadrée, avec durée limitée et logique propre selon l’activité."
  },
  {
    title: "Transfert temporaire intra-groupe",
    note: "On vérifie surtout le lien entre les sociétés, la fonction et la durée de la mission."
  },
  {
    title: "Chercheurs et post-doc",
    note: "Catégorie spécifique, souvent plus lisible quand la structure d’accueil et l’objet scientifique sont clairs."
  }
];

const activitySpecificDetails = [
  {
    title: "Personnel hautement qualifié",
    note: "En pratique, il faut un profil cohérent avec la fonction, un niveau de qualification suffisant et un salaire qui atteint le seuil régional applicable. Ces seuils évoluent chaque année."
  },
  {
    title: "Personnel de direction",
    note: "Ce qui compte surtout est la réalité du rôle : direction effective, pouvoir de décision, autonomie réelle et place dans l’organigramme de l’entreprise."
  },
  {
    title: "Sportifs professionnels et entraîneurs",
    note: "Le dossier doit montrer une activité réellement professionnelle, avec contrat clair, structure d’accueil sérieuse et niveau de rémunération adapté."
  },
  {
    title: "Artistes de spectacle",
    note: "Il faut pouvoir démontrer la nature artistique de la prestation, l’encadrement contractuel et le cadre professionnel dans lequel l’activité sera exercée."
  },
  {
    title: "Jeunes au pair",
    note: "Il faut vérifier l’âge, le niveau d’études, les compétences linguistiques, la composition de la famille d’accueil, le nombre d’heures et la compensation financière."
  },
  {
    title: "Stagiaires",
    note: "La logique reste pédagogique : il faut un vrai stage, un encadrement, un objectif de formation et une durée cohérente."
  },
  {
    title: "Travailleurs saisonniers",
    note: "Le travail doit être lié à une activité saisonnière identifiable, avec une durée courte et un besoin temporaire clairement établi."
  },
  {
    title: "Transfert temporaire intra-groupe",
    note: "Il faut démontrer le lien entre les sociétés, la fonction exercée, l’ancienneté du travailleur dans le groupe et le caractère temporaire de la mission."
  },
  {
    title: "Chercheurs et post-doc",
    note: "Le dossier est généralement plus lisible quand l’institution d’accueil, le projet scientifique et le financement sont clairement documentés."
  }
];

const stayConditions = [
  "Le travailleur doit en principe se trouver dans son pays d’origine ou dans un pays où il est autorisé au séjour au moment de la demande.",
  "Une introduction peut parfois se faire avec présence du travailleur en Belgique, mais seulement dans certaines hypothèses bien encadrées.",
  "Un court séjour valable peut parfois suffire selon la situation.",
  "Un long séjour valable peut aussi permettre l’introduction dans certains cas.",
  "Certaines situations précaires ne permettent pas d’introduire correctement la demande."
];

const stayTimingCards = [
  {
    title: "Depuis l’étranger",
    note: "C’est le cas le plus simple. Le travailleur se trouve dans son pays d’origine ou dans un pays où il séjourne régulièrement au moment de l’introduction."
  },
  {
    title: "Depuis la Belgique",
    note: "C’est parfois possible, mais pas dans toutes les hypothèses. Il faut regarder très précisément le type de séjour en cours et la catégorie visée."
  },
  {
    title: "Point d’attention majeur",
    note: "Une présence en Belgique avec un statut trop fragile peut bloquer la bonne introduction du dossier, même si le profil est bon sur le fond."
  }
];

const otherConditions = [
  "Respecter la réglementation belge du travail : rémunération, conditions de travail, barèmes et règles applicables.",
  "Prévoir un contrat de travail clair, cohérent et complet.",
  "Veiller à ce que la rémunération soit au moins au niveau minimum requis pour la catégorie concernée.",
  "Ajouter les documents utiles selon la catégorie d’activité : description de fonction, CV, diplôme, organigramme, preuve de compétences ou éléments sur l’employeur."
];

const employerFileChecklist = [
  "Description de fonction lisible et cohérente avec la réalité du poste",
  "Contrat de travail clair avec durée, fonction, lieu de travail et rémunération",
  "Preuves de qualification ou d’expérience du candidat",
  "Pièces sur l’employeur selon la catégorie : organigramme, activité réelle, besoin de recrutement",
  "Vérification préalable du seuil salarial applicable dans la région concernée"
];

const laborMarketReview = [
  {
    region: "Bruxelles-Capitale",
    note: "La logique passe en pratique par une offre publiée et par une analyse des candidatures ou refus, avec un regard porté sur la fonction réellement difficile à pourvoir."
  },
  {
    region: "Wallonie",
    note: "La logique repose sur la difficulté réelle à recruter, qui peut être soutenue par une publication d’offre, une gestion active ou une présélection adaptée."
  },
  {
    region: "Flandre",
    note: "La logique est plus structurée autour de la publication de l’offre et, dans certains cas, de listes de professions en pénurie ou d’une médiation active."
  }
];

const workAccessSummary = [
  "L’accès au marché de l’emploi reste en principe limité à un employeur déterminé et à une fonction déterminée, sauf exceptions.",
  "La durée suit souvent la durée du contrat, avec des plafonds qui varient selon la catégorie.",
  "Certaines catégories peuvent aller jusqu’à plusieurs années.",
  "Les travailleurs saisonniers et les stagiaires restent dans des durées plus courtes.",
  "Le changement d’employeur ou l’activité complémentaire dépend de la catégorie et de la région."
];

const permitDurationCards = [
  {
    title: "Règle générale",
    note: "La durée suit souvent le contrat de travail, avec un cadre limité dans le temps."
  },
  {
    title: "Catégories renforcées",
    note: "Certaines catégories peuvent bénéficier d’une durée plus longue, notamment les profils hautement qualifiés ou certaines missions intra-groupe."
  },
  {
    title: "Catégories courtes",
    note: "Les stagiaires et les saisonniers restent généralement dans des durées plus limitées."
  },
  {
    title: "Changement d’employeur",
    note: "Il n’est pas libre. Il dépend de la catégorie, du moment du dossier et parfois d’une lecture régionale différente."
  }
];

export default function MemberLockedPermitContent({ locale = "fr" }) {
  const [status, setStatus] = useState("loading");
  const copy = locale === "en"
    ? {
        memberContent: "Member content",
        unlocked: "Unlocked content",
        title: "Work permit exemptions",
        intro: "A members-only extension that goes deeper into exemptions, residence documents and situations where a person may already work in Belgium without automatically starting again from a single permit procedure.",
        reserved: "Members only",
        unlockTitle: "Unlock the full reading",
        unlockText: "The member content goes further than the public page: it classifies exemptions by residence logic, highlights practical limits and gives a first useful reading before any legal analysis.",
        memberBannerText: "You have full access to this member-only content.",
        guestBannerText: "This content is reserved for members. Sign in or create an account to access it.",
        unlockList: [
          "Cases without a residence title",
          "Unlimited and limited residence statuses",
          "Temporary and precarious statuses",
          "Regional labour market test exemptions"
        ],
        guestCards: [
          { title: "Cases without a residence title", note: "Apprenticeship before age 18, mandatory study placements and other situations expressly covered by the regulations." },
          { title: "Exemptions — unlimited residence statuses", note: "EU citizens, F/F+ cards, B/C/L cards, M card and other statuses already granting access to work." },
          { title: "Exemptions — limited residence statuses", note: "A card, students, family reunification, international protection, working holiday and other statuses that require closer review." },
          { title: "Temporary and precarious residence statuses", note: "Orange cards, Annexes 15, 19ter, 35 and other transitional situations that must be read carefully." },
          { title: "Specific activity categories", note: "Labour market test exemptions may apply to some categories, including certain highly qualified worker profiles." },
          { title: "Regional reading", note: "Brussels, Wallonia and Flanders do not always apply exactly the same practical logic." }
        ],
        becomeMember: "Become a member",
        signIn: "Sign in"
      }
    : {
        memberContent: "Contenu membre",
        unlocked: "Contenu débloqué",
        title: "Dispenses de permis de travail",
        intro: "Un complément réservé aux membres pour aller plus loin sur les dispenses, les titres de séjour et les situations qui permettent déjà de travailler en Belgique sans repartir automatiquement sur un permis unique.",
        reserved: "Réservé aux membres",
        unlockTitle: "Débloquez la lecture complète",
        unlockText: "Le contenu membre va plus loin que la page publique : il classe les dispenses par familles de séjour, attire l’attention sur les limites et apporte un premier niveau de lecture utile avant l’analyse juridique.",
        memberBannerText: "Vous avez accès à l'intégralité de ce contenu réservé aux membres.",
        guestBannerText: "Ce contenu est réservé aux membres. Connectez-vous ou créez un compte pour y accéder.",
        unlockList: [
          "Cas sans titre de séjour",
          "Séjours illimités et séjours limités",
          "Séjours temporaires et précaires",
          "Dispenses régionales de l’examen du marché de l’emploi"
        ],
        guestCards: [
          { title: "Sans titre de séjour", note: "Apprentissage avant 18 ans, stage obligatoire dans le cadre des études et cas prévus par la réglementation." },
          { title: "Dispenses — séjours illimités", note: "Citoyens UE, cartes F/F+, cartes B/C/L, carte M et autres statuts ouvrant déjà le droit au travail." },
          { title: "Dispenses — séjours limités", note: "Carte A, étudiants, regroupement familial, protection internationale, vacances-travail et autres régimes à vérifier." },
          { title: "Séjours temporaires et précaires", note: "Cartes orange, annexes 15, 19ter, 35 et autres situations transitoires à lire avec prudence." },
          { title: "Activité spécifique", note: "Dispense de l’examen du marché de l’emploi, notamment pour certaines catégories de travailleurs hautement qualifiés." },
          { title: "Lecture régionale", note: "Bruxelles, Wallonie et Flandre n’utilisent pas toujours exactement la même logique pratique." }
        ],
        becomeMember: "Devenir membre",
        signIn: "Se connecter"
      };

  useEffect(() => {
    let mounted = true;
    let supabase;

    try {
      supabase = getSupabaseBrowserClient();
    } catch {
      if (mounted) setStatus("guest");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.session ? "member" : "guest");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setStatus(session ? "member" : "guest");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section id="contenu-membre" className="py-10 sm:py-14 lg:py-16">
      <div className="container-shell">
        <div className="rounded-[36px] border border-[#e3ebf3] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:p-10">
          {/* ── Bannière d'état — très visible ──────────────────────────── */}
          {status === "member" ? (
            <div className="mb-8 flex items-center gap-4 rounded-[20px] border border-[#57B7AF] bg-[linear-gradient(135deg,#d4f0ed_0%,#c2e9e5_100%)] px-5 py-4 shadow-[0_4px_18px_rgba(89,185,177,0.25)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d6b65] text-white shadow-[0_4px_12px_rgba(29,107,101,0.35)]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f4d48]">✦ {copy.unlocked}</p>
                <p className="mt-0.5 text-xs font-medium text-[#1d6b65]">{copy.memberBannerText}</p>
              </div>
            </div>
          ) : status === "guest" ? (
            <div className="mb-8 flex items-center gap-4 rounded-[20px] border border-[#c7d7ef] bg-[linear-gradient(135deg,#f0f4ff_0%,#e8eefb_100%)] px-5 py-4 shadow-[0_4px_18px_rgba(29,59,139,0.08)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d3b8b] text-white shadow-[0_4px_12px_rgba(29,59,139,0.30)]">
                <LockIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1d3b8b]">⊘ {copy.memberContent}</p>
                <p className="mt-0.5 text-xs text-[#4a6090]">{copy.guestBannerText}</p>
              </div>
            </div>
          ) : null}

          <div className="mx-auto mb-8 max-w-4xl text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-[#1d3b8b] sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#607086] sm:text-base">
              {copy.intro}
            </p>
          </div>

          {status === "loading" ? (
            <div className="flex min-h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#59B9B1] border-t-transparent" />
            </div>
          ) : null}

          {status === "guest" ? (
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative overflow-hidden rounded-[30px] border border-[#d9e6ef] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(245,248,252,0.94)_100%)] backdrop-blur-[3px]" />
                <div className="relative grid gap-4 md:grid-cols-2">
                  {copy.guestCards.map((card) => (
                    <SmallCard key={card.title} title={card.title} note={card.note} />
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#f4fbfa_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#ecfaf8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">
                  <LockIcon />
                  {copy.reserved}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b]">
                  {copy.unlockTitle}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#607086]">
                  {copy.unlockText}
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[#607086]">
                  {copy.unlockList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={`${locale === "en" ? "/en" : ""}/inscription?next=${locale === "en" ? "/en/permis-unique%23contenu-membre" : "/permis-unique%23contenu-membre"}`} className="primary-button">
                    {copy.becomeMember}
                  </Link>
                  <Link href={`${locale === "en" ? "/en" : ""}/connexion?next=${locale === "en" ? "/en/permis-unique%23contenu-membre" : "/permis-unique%23contenu-membre"}`} className="secondary-button">
                    {copy.signIn}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {status === "member" ? (
            <div className="space-y-8">
              <ContentSection
                id="acces-direct"
                badge="Sans titre de séjour"
                title="Cas très spécifiques"
                intro="Ce sont des hypothèses particulières où l’on ne repart pas sur une logique classique de permis unique."
              >
                <div className="grid gap-4">
                  {noPermitRows.map((item) => (
                    <SmallCard key={item} title={item} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                id="acces-facilite"
                badge="Dispenses — séjours illimités"
                title="Les cas les plus simples à lire"
                intro="Ici, le droit au travail découle généralement du statut ou d’un séjour stable déjà reconnu."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {unlimitedRows.map((item) => (
                    <SmallCard key={item.situation} title={item.situation} subtitle={item.title} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                badge="Dispenses — séjours limités"
                badgeTone="green"
                title="Les situations à examiner plus attentivement"
                intro="Ici, il existe souvent un droit au travail, mais dans un cadre plus conditionné, limité ou dépendant du statut exact."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {limitedRows.map((item) => (
                    <SmallCard key={item.situation} title={item.situation} subtitle={item.title} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                badge="Séjours temporaires et précaires"
                badgeTone="dark"
                title="Les cas les plus sensibles"
                intro="Ces situations demandent plus de prudence. Le titre de séjour est souvent temporaire, en attente ou lié à une procédure en cours."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {precariousRows.map((item) => (
                    <SmallCard key={item.situation} title={item.situation} subtitle={item.title} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                id="acces-facilite-categories"
                badge="Activité spécifique"
                title="Dispense de l’examen du marché de l’emploi"
                intro="Certaines catégories de travailleurs peuvent entrer dans une logique spécifique, notamment les profils hautement qualifiés. La lecture varie ensuite selon la région compétente."
              >
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                  {activityCards.map((item) => (
                    <SmallCard key={item.title} title={item.title} subtitle={item.subtitle} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                badge="Travailleurs hautement qualifiés"
                badgeTone="dark"
                title="Lecture régionale rapide"
                intro="Le principe est simple : la qualification et la rémunération restent centrales, mais les trois régions n’emploient pas exactement la même logique pratique."
              >
                <div className="overflow-hidden rounded-[26px] border border-[#dfe8f0]">
                  <div className="grid bg-[#254e7a] text-white lg:grid-cols-3">
                    {highlyQualifiedRows.map((item) => (
                      <div key={item.region} className="border-b border-white/15 px-5 py-4 text-lg font-semibold last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                        {item.region}
                      </div>
                    ))}
                  </div>
                  <div className="grid bg-white lg:grid-cols-3">
                    {highlyQualifiedRows.map((item) => (
                      <div key={item.region} className="border-b border-[#e7eef5] px-5 py-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                        <h4 className="text-xl font-semibold tracking-tight text-[#163573]">{item.title}</h4>
                        <p className="mt-4 text-sm leading-7 text-[#607086]">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 rounded-[24px] border border-[rgba(89,185,177,0.22)] bg-[#f4fbfa] p-5">
                  <p className="text-sm leading-7 text-[#47697f]">
                    À retenir : le statut de travailleur hautement qualifié ne se résume pas à l’intitulé du poste. Il faut regarder ensemble la région, le diplôme, l’expérience utile, le niveau de salaire et la cohérence globale du dossier.
                  </p>
                </div>
              </ContentSection>

              <ContentSection
                badge="Activité spécifique — suite"
                badgeTone="dark"
                title="Autres catégories à connaître"
                intro="Au-delà des profils hautement qualifiés, plusieurs autres catégories peuvent entrer dans une logique spécifique."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {specificActivityRows.map((item) => (
                    <SmallCard key={item.title} title={item.title} note={item.note} />
                  ))}
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {activitySpecificDetails.map((item) => (
                    <SmallCard key={`${item.title}-detail`} title={item.title} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                badge="Conditions de séjour"
                badgeTone="blue"
                title="Au moment de la demande"
                intro="Avant même le fond du dossier, il faut vérifier si la situation de séjour permet d’introduire correctement la demande."
              >
                <div className="mb-5 grid gap-4 lg:grid-cols-3">
                  {stayTimingCards.map((item) => (
                    <SmallCard key={item.title} title={item.title} note={item.note} />
                  ))}
                </div>
                <div className="rounded-[26px] border border-[#dfe8f0] bg-white p-6">
                  <ul className="space-y-4 text-sm leading-7 text-[#607086]">
                    {stayConditions.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#173A8A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ContentSection>

              <ContentSection
                badge="Autres conditions"
                badgeTone="green"
                title="Ce qu’un employeur doit aussi sécuriser"
                intro="Le permis unique ne dépend pas seulement du statut du travailleur. L’employeur doit aussi cadrer correctement le travail proposé."
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-[26px] border border-[#dfe8f0] bg-white p-6">
                    <ul className="space-y-4 text-sm leading-7 text-[#607086]">
                      {otherConditions.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#59B9B1]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[26px] border border-[rgba(89,185,177,0.22)] bg-[#f4fbfa] p-6">
                    <h4 className="text-lg font-semibold tracking-tight text-[#163573]">Checklist employeur</h4>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-[#607086]">
                      {employerFileChecklist.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#2f9f97]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ContentSection>

              <ContentSection
                id="analyse-marche-emploi"
                badge="Examen du marché de l’emploi"
                badgeTone="dark"
                title="Lecture pratique par région"
                intro="Quand il n’y a pas de dispense, il faut souvent démontrer qu’on ne trouve pas facilement un travailleur disponible sur le marché local."
              >
                <div className="grid gap-4 lg:grid-cols-3">
                  {laborMarketReview.map((item) => (
                    <SmallCard key={item.region} title={item.region} note={item.note} />
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                badge="Accès au travail"
                badgeTone="blue"
                title="Durée et limites de l’autorisation"
                intro="En pratique, l’autorisation n’est pas toujours large ni durable. Elle dépend du contrat, de la catégorie et parfois de la région."
              >
                <div className="mb-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                  {permitDurationCards.map((item) => (
                    <SmallCard key={item.title} title={item.title} note={item.note} />
                  ))}
                </div>
                <div className="rounded-[26px] border border-[#dfe8f0] bg-white p-6">
                  <ul className="space-y-4 text-sm leading-7 text-[#607086]">
                    {workAccessSummary.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#173A8A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ContentSection>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
