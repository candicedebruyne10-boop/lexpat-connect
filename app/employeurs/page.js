import Script from "next/script";
import Link from "next/link";
import { BulletList, CtaBanner, Faq, Hero, Section, Steps } from "../../components/Sections";
import { getServiceClient } from "../../lib/supabase/server";

async function getLiveProfileCount() {
  try {
    const supabase = getServiceClient();
    const { count } = await supabase
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .eq("profile_visibility", "visible");
    return count ?? 0;
  } catch {
    return null; // silent fallback — static text used
  }
}

const employerBenefits = [
  {
    title: "Accédez à des profils qualifiés dès aujourd'hui",
    text: "Des travailleurs internationaux qualifiés dans les métiers en pénurie sont disponibles maintenant — sans délai d'attente."
  },
  {
    title: "Recrutez plus rapidement, en toute sécurité",
    text: "De l'accès au profil à l'embauche, chaque étape est balisée pour aller vite et en toute conformité légale."
  },
  {
    title: "Le juridique intervient si vous en avez besoin",
    text: "Permis unique, autorisation de travail, conformité salariale : le cabinet LEXPAT prend le relais si votre dossier le nécessite."
  }
];

const employerSteps = [
  {
    title: "Accédez aux profils",
    text: "Consultez directement les profils disponibles dans votre métier, votre région et votre secteur — dès maintenant."
  },
  {
    title: "Contactez directement les candidats",
    text: "Identifiez les profils qui correspondent et entrez en contact sans intermédiaire inutile."
  },
  {
    title: "LEXPAT sécurise le cadre juridique si nécessaire",
    text: "Permis unique, droit au travail, immigration économique : le cabinet intervient uniquement si votre recrutement le requiert."
  }
];

const employerWhyValues = [
  {
    title: "Accès immédiat à des profils qualifiés",
    text: "Développeurs, techniciens, soins, construction — des profils disponibles dès aujourd'hui dans les métiers en pénurie."
  },
  {
    title: "Gain de temps réel",
    text: "Pas de CVthèque à trier. Des profils ciblés, disponibles, prêts à être contactés immédiatement."
  },
  {
    title: "Recrutement international simplifié",
    text: "Un parcours guidé qui structure votre besoin et le met en face des bons profils, sans complexité administrative."
  },
  {
    title: "Cadre juridique sécurisé",
    text: "Le cabinet LEXPAT intervient si nécessaire pour le permis unique et la conformité — vous recrutez en toute sérénité."
  }
];

const employerPreview = [
  {
    title: "Tableau de bord entreprise",
    text: "Suivez vos besoins actifs, les profils consultés et les prochaines actions à entreprendre."
  },
  {
    title: "Fiche entreprise",
    text: "Présentez votre structure, vos critères de recrutement et votre contexte aux candidats."
  },
  {
    title: "Suivi des offres",
    text: "Centralisez vos recrutements en cours et les profils en cours d'analyse, en un seul endroit."
  }
];

const employerFaq = [
  {
    question: "À qui s'adresse LEXPAT Connect ?",
    answer: "Aux employeurs belges qui veulent recruter rapidement des travailleurs internationaux qualifiés, en particulier dans les métiers en pénurie."
  },
  {
    question: "Puis-je recruter si je n'ai jamais embauché à l'international ?",
    answer: "Oui. Le parcours est justement conçu pour ça : vous décrivez votre besoin en 4 étapes, et vous accédez aux profils disponibles sans connaissances juridiques préalables."
  },
  {
    question: "Le juridique intervient-il tout de suite ?",
    answer: "Non. Vous accédez d'abord aux profils et vous contactez les candidats. Le cabinet LEXPAT intervient ensuite seulement si une question de permis unique ou de droit au travail se pose."
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

export default async function EmployeursPage() {
  const profileCount = await getLiveProfileCount();
  const countLabel = profileCount !== null
    ? `${profileCount} profil${profileCount > 1 ? "s" : ""} disponible${profileCount > 1 ? "s" : ""} aujourd'hui.`
    : "Des profils disponibles aujourd'hui.";

  return (
    <>
      <Script
        id="faq-employeurs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employerFaqJsonLd) }}
      />
      <Hero
        badge="Employeurs belges · Métiers en pénurie · Profils disponibles maintenant"
        title={
          <>
            Accédez immédiatement à des profils internationaux qualifiés
            <span className="block text-[#57b7af]">dans les métiers en pénurie.</span>
          </>
        }
        description={`${countLabel} Certains sont disponibles immédiatement.`}
        note="Développeurs · Techniciens · Soins · Construction — consultez les profils et recrutez dès aujourd'hui."
        primaryHref="/base-de-profils"
        primaryLabel="Voir les profils disponibles"
        secondaryHref="/simulateur-eligibilite"
        secondaryLabel="Tester la faisabilité"
      />

      {/* ── Bloc profils disponibles ── */}
      <div className="border-y border-[#e0edf5] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-[#f0f7ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d3b8b]">
                <span className="h-2 w-2 rounded-full bg-[#57b7af] animate-pulse" />
                Des profils sont déjà disponibles
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">
                Recrutez dès aujourd'hui — sans attendre
              </h2>
              <p className="mt-2 text-sm text-[#607086]">
                Certains profils sont disponibles immédiatement dans ces secteurs :
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Développeurs", "Techniciens", "Soins", "Construction"].map(cat => (
                  <span key={cat} className="rounded-full border border-[#d4e6f7] bg-[#f8fbff] px-4 py-1.5 text-sm font-semibold text-[#1d3b8b]">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/base-de-profils"
              className="flex-shrink-0 inline-flex h-13 items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: "#57b7af", boxShadow: "0 8px 24px rgba(87,183,175,0.30)" }}
            >
              Voir les profils disponibles →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sommaire ── */}
      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ Sur cette page — navigation</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Comment recruter rapidement<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> via LEXPAT Connect</span>
              </h2>
              <p className="mt-2 text-xs text-[#8a9db8]">Cliquez sur une section ci-dessous pour y accéder directement ↓</p>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#pourquoi",          title: "Pourquoi recruter ici",                 desc: "Des profils disponibles maintenant dans les métiers en pénurie." },
              { n: "02", href: "#comment-ca-marche",  title: "Comment ça marche",                     desc: "3 étapes pour accéder aux profils et recruter rapidement." },
              { n: "03", href: "#espace-employeur",   title: "L'espace employeur",                    desc: "Votre interface dédiée pour gérer vos recrutements." },
              { n: "04", href: "/employeurs/rejoindre", title: "Accéder aux profils maintenant",       desc: "Décrivez votre besoin en 4 étapes et contactez les candidats." },
              { n: "05", href: "#faq",                title: "Questions fréquentes",                  desc: "Les réponses aux questions des employeurs." },
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
        title="Pourquoi recruter via LEXPAT Connect ?"
        intro="Des profils qualifiés disponibles maintenant, un parcours rapide, un cadre juridique sécurisé."
        kicker="Employeurs"
      >
        <BulletList items={employerBenefits} />
        <div className="mt-8 rounded-[28px] border border-[#dce7ef] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Avant de recruter hors UE</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E3A78]">
            Vérifiez si votre métier figure parmi les fonctions en pénurie
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6e83]">
            Notre guide vous aide à comprendre la logique régionale, l'impact sur le permis unique et les secteurs où recruter rapidement à l'international.
          </p>
          <Link href="/metiers-en-penurie" className="mt-5 inline-flex text-sm font-semibold text-[#1E3A78] transition hover:text-[#57b7af]">
            Consulter le guide métiers en pénurie →
          </Link>
        </div>
      </Section>
      </div>

      <div id="comment-ca-marche">
      <Section
        title="Comment ça marche"
        intro="3 étapes simples pour accéder aux profils, contacter les candidats et recruter rapidement."
        kicker="3 étapes"
        muted
      >
        <Steps items={employerSteps} />
      </Section>
      </div>

      {/* ── Bloc valeur : Pourquoi les employeurs utilisent LEXPAT Connect ── */}
      <Section
        title="Pourquoi les employeurs utilisent LEXPAT Connect ?"
        intro="Des raisons concrètes de recruter ici plutôt qu'ailleurs."
        kicker="Valeur ajoutée"
      >
        <BulletList items={employerWhyValues} />
        <div className="mt-8 flex flex-col items-center gap-4 rounded-[28px] border border-[#dce7ef] bg-[linear-gradient(180deg,#f0f7ff_0%,#eaf7f5_100%)] px-8 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-[#1E3A78]">Des profils disponibles dès aujourd'hui.</p>
            <p className="mt-1 text-sm text-[#6b85a0]">Accédez aux profils maintenant et recrutez immédiatement.</p>
          </div>
          <Link
            href="/base-de-profils"
            className="flex-shrink-0 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ background: "#57b7af", boxShadow: "0 8px 24px rgba(87,183,175,0.28)" }}
          >
            Accéder aux profils maintenant →
          </Link>
        </div>
      </Section>

      <div id="espace-employeur">
      <Section
        title="L'espace employeur"
        intro="Votre interface dédiée pour gérer vos recrutements, suivre vos offres et contacter les profils."
        kicker="Espace recruteur"
        muted
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace entreprise</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1E3A78]">Gérez vos recrutements en un seul endroit</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d6e83]">
              Tableau de bord, fiche entreprise, offres en cours et suivi des profils : tout est centralisé pour recruter plus vite.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/employeurs/espace" className="primary-button">
                Voir l'espace employeur
              </Link>
              <Link href="/employeurs/rejoindre" className="secondary-button">
                Accéder aux profils maintenant
              </Link>
            </div>
          </div>
          <BulletList items={employerPreview} />
        </div>
      </Section>
      </div>

      <div id="formulaire">
      <Section
        title="Accédez aux profils — en 4 étapes"
        intro="Décrivez votre besoin en quelques minutes et contactez directement les candidats disponibles."
        kicker="Recrutez maintenant"
        muted
      >
        <div className="rounded-[30px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)] overflow-hidden">
          {/* Steps preview */}
          <div className="grid gap-0 sm:grid-cols-4 border-b border-[#e5edf4]">
            {[
              { n: "01", label: "Votre entreprise", desc: "Nom, contact, région" },
              { n: "02", label: "Le poste", desc: "Métier, secteur, contrat" },
              { n: "03", label: "Les attentes", desc: "Missions & compétences" },
              { n: "04", label: "Envoi", desc: "Vérification & soumission" },
            ].map(({ n, label, desc }, i) => (
              <div key={n} className={`flex items-start gap-3 px-6 py-5 ${i < 3 ? "border-b sm:border-b-0 sm:border-r" : ""} border-[#e5edf4]`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[11px] font-bold text-[#1d3b8b]">{n}</span>
                <div>
                  <p className="text-sm font-semibold text-[#1E3A78]">{label}</p>
                  <p className="mt-0.5 text-xs text-[#8a9db8]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div className="flex flex-col items-center gap-4 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-base font-semibold text-[#1E3A78]">Des profils disponibles dès aujourd'hui.</p>
              <p className="mt-1 text-sm text-[#6b85a0]">Environ 3 minutes — guidé étape par étape, sur tous supports.</p>
            </div>
            <Link
              href="/employeurs/rejoindre"
              className="flex-shrink-0 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: "#1E3A78", boxShadow: "0 8px 24px rgba(23,58,138,0.25)" }}
            >
              Accéder aux profils maintenant →
            </Link>
          </div>
        </div>
      </Section>
      </div>

      <CtaBanner
        title="Recrutez maintenant — le juridique suit si nécessaire"
        text="Permis unique, droit au travail, immigration économique : le cabinet LEXPAT intervient uniquement si votre recrutement le nécessite. Commencez par accéder aux profils."
        primaryHref="/base-de-profils"
        primaryLabel="Voir les profils disponibles"
        secondaryHref="/accompagnement-juridique"
        secondaryLabel="Voir le relais juridique"
      />

      {/* ── Pages régionales & thématiques ── */}
      <section className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
            Ressources par ville et par sujet
          </p>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Recrutez dans votre région — dès aujourd'hui
          </h2>
          <p className="mt-2 text-sm text-[#607086]">
            Profils disponibles, métiers en pénurie et cadre juridique — adaptés à votre ville.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Liège", description: "Profils disponibles — métiers en pénurie à Liège", href: "/employeurs/liege-metiers-en-penurie" },
              { label: "Anvers", description: "Profils disponibles — métiers en pénurie à Anvers", href: "/employeurs/anvers-metiers-en-penurie" },
              { label: "Gand", description: "Profils disponibles — métiers en pénurie à Gand", href: "/employeurs/gand-metiers-en-penurie" },
              { label: "Bruges", description: "Profils disponibles — métiers en pénurie à Bruges", href: "/employeurs/bruges-metiers-en-penurie" },
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
