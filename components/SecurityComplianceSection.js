"use client";

const blocks = [
  {
    step: "Bloc 1",
    eyebrow: "Front public",
    title: "Point d'entrée unique",
    accent: "blue",
    description:
      "LEXPAT Connect concentre les formulaires et parcours de départ dans une interface unique, claire et orientée matching.",
    items: [
      "CTA employeurs",
      "CTA talents",
      "Formulaires simples",
      "Point d'entrée unique"
    ]
  },
  {
    step: "Bloc 2",
    eyebrow: "Base de données européenne",
    title: "Infrastructure UE maîtrisée",
    accent: "blue",
    description:
      "Les données de matching sont hébergées en Europe sur une infrastructure pensée pour le contrôle d'accès et la conformité.",
    items: [
      "Supabase Europe (Francfort)",
      "Hébergement UE",
      "Chiffrement",
      "Accès contrôlé"
    ]
  },
  {
    step: "Bloc 3",
    eyebrow: "Moteur de matching",
    title: "Règles métier et compatibilité",
    accent: "teal",
    description:
      "Le matching croise les besoins employeurs et les profils talents sans exposer immédiatement les données identifiantes.",
    items: [
      "Score de compatibilité",
      "Matching métier",
      "Langues et mobilité",
      "Priorité permis unique"
    ]
  },
  {
    step: "Bloc 4",
    eyebrow: "Mise en relation",
    title: "Contact limité et consenti",
    accent: "teal",
    description:
      "Une fois le match validé, la plateforme encadre le partage d'information dans une logique de minimisation et de consentement.",
    items: [
      "Validation du match",
      "Partage limité des données",
      "Consentement préalable",
      "Minimisation RGPD"
    ]
  },
  {
    step: "Bloc 5",
    eyebrow: "Cabinet LEXPAT — relais juridique séparé",
    title: "Périmètre juridique distinct",
    accent: "legal",
    description:
      "Lorsque le recrutement avance vers un permis unique ou une question d'immigration économique, le cabinet LEXPAT intervient dans un cadre séparé.",
    items: [
      "Permis unique",
      "Immigration économique",
      "Suivi dossier",
      "Infrastructure dédiée",
      "Secret professionnel",
      "Responsable de traitement distinct"
    ]
  }
];

const benefits = [
  "Données hébergées en Europe",
  "Séparation claire des traitements",
  "Matching avant divulgation",
  "Consentement avant transfert",
  "Relais juridique activé uniquement si nécessaire"
];

function FlowIcon({ accent = "blue" }) {
  const accentMap = {
    blue: "text-[#173A8A] bg-[#eef4ff] border-[rgba(23,58,138,0.14)]",
    teal: "text-[#2f9f97] bg-[#ecfaf8] border-[rgba(89,185,177,0.2)]",
    legal: "text-[#274f96] bg-[#f3f6fe] border-[rgba(39,79,150,0.18)]"
  };

  return (
    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accentMap[accent]}`}>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function BlockCard({ block, index, isLast }) {
  const styles = {
    blue: {
      wrap: "border-[rgba(23,58,138,0.16)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]",
      badge: "border-[rgba(23,58,138,0.16)] bg-[#eef4ff] text-[#173A8A]",
      icon: "blue",
      dot: "bg-[#173A8A]"
    },
    teal: {
      wrap: "border-[rgba(89,185,177,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#f5fcfb_100%)]",
      badge: "border-[rgba(89,185,177,0.22)] bg-[#ecfaf8] text-[#2f9f97]",
      icon: "teal",
      dot: "bg-[#59B9B1]"
    },
    legal: {
      wrap: "border-[rgba(39,79,150,0.18)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] lg:ml-8",
      badge: "border-[rgba(39,79,150,0.18)] bg-[#eef4ff] text-[#274f96]",
      icon: "legal",
      dot: "bg-[#274f96]"
    }
  }[block.accent];

  return (
    <div className="relative">
      {!isLast ? (
        <>
          <div className="absolute left-6 top-full hidden h-12 w-px bg-gradient-to-b from-[#dce7f2] to-transparent lg:block" />
          <div className={`absolute left-[21px] top-[calc(100%+10px)] hidden h-3 w-3 rounded-full ${styles.dot} animate-pulse lg:block`} />
        </>
      ) : null}

      <article className={`relative overflow-hidden rounded-[32px] border p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 ${styles.wrap}`}>
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(89,185,177,0.12),transparent_70%)]" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={`inline-flex rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.badge}`}>
                {block.step} — {block.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#14315f] sm:text-[2.2rem]">
                {block.title}
              </h2>
            </div>
            <FlowIcon accent={styles.icon} />
          </div>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#55677f]">
            {block.description}
          </p>

          <div className={`mt-7 grid gap-4 ${block.accent === "legal" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
            {block.items.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-sm font-medium leading-7 text-[#20385f] shadow-[0_8px_20px_rgba(21,35,68,0.04)] backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>

          {block.accent === "legal" ? (
            <div className="mt-7 rounded-[26px] border border-[rgba(39,79,150,0.16)] bg-white/70 p-6 text-sm leading-7 text-[#385172]">
              <p className="font-semibold text-[#173A8A]">Séparation RGPD garantie</p>
              <p className="mt-2">
                Le traitement juridique opère dans un périmètre distinct de la plateforme de matching, avec secret professionnel, infrastructure dédiée et base légale propre au cabinet.
              </p>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default function SecurityComplianceSection() {
  return (
    <section className="pb-16 pt-8 sm:pb-20 lg:pb-24 lg:pt-12">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[38px] border border-[#e4edf4] bg-white px-6 py-10 shadow-[0_20px_70px_rgba(30,52,94,0.06)] sm:px-8 lg:px-12 lg:py-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(103,190,182,0.16),transparent_62%)]" />
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(23,58,138,0.08),transparent_68%)]" />

          <div className="relative max-w-4xl">
            <p className="inline-flex items-center rounded-full border border-[#d8e7e5] bg-[#f6fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#255c8f]">
              Sécurité & conformité
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#173A8A] sm:text-5xl lg:text-6xl">
              Comment LEXPAT Connect sépare le matching professionnel du traitement juridique
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#55677f] sm:text-lg">
              Une architecture pensée pour protéger les données, clarifier les rôles et sécuriser le parcours entre mise en relation et accompagnement juridique.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-[28px] border border-[#e4edf4] bg-white p-6 shadow-[0_12px_30px_rgba(24,53,101,0.05)] lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Vue d’ensemble</p>
            <nav className="mt-5 space-y-2">
              {blocks.map((block) => (
                <a
                  key={block.step}
                  href={`#${block.step.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#607086] transition hover:border-[#d9e7f3] hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                >
                  {block.step} — {block.eyebrow}
                </a>
              ))}
            </nav>

            <div className="mt-6 rounded-[22px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5 text-sm text-[#607086]">
              <p className="font-semibold text-[#1d3b8b]">Pourquoi cette page ?</p>
              <p className="mt-2 leading-7">
                Montrer que le matching et le traitement juridique n’obéissent pas au même périmètre de données renforce la confiance des employeurs comme des talents.
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            {blocks.map((block, index) => (
              <div key={block.step} id={block.step.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
                <BlockCard block={block} index={index} isLast={index === blocks.length - 1} />
              </div>
            ))}

            <section className="overflow-hidden rounded-[34px] border border-[#d8e7e5] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full border border-[#d7ece8] bg-[#ecfaf8] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f9f97]">
                  Bénéfices
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#14315f] sm:text-[2.2rem]">
                  Pourquoi cette architecture protège employeurs et talents
                </h2>
                <p className="mt-4 text-base leading-8 text-[#55677f]">
                  La plateforme limite les transferts, sépare les rôles et active l’intervention du cabinet uniquement lorsque la relation avance vers un recrutement réel.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <div key={benefit} className="rounded-[24px] border border-[#d8e7e5] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(21,35,68,0.04)]">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#173A8A] text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium leading-7 text-[#20385f]">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
