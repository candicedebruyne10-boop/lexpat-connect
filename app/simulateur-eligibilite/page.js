import SimulateurEligibilite from "../../components/SimulateurEligibilite";

export const metadata = {
  title: "Simulateur d'éligibilité permis unique 2026 | LEXPAT Connect",
  description:
    "Vérifiez en 4 étapes si votre poste est éligible à une procédure de permis unique en Belgique. Résultat immédiat basé sur les listes officielles Actiris, Forem et VDAB 2026.",
  keywords: [
    "simulateur permis unique Belgique 2026",
    "éligibilité permis unique",
    "métiers en pénurie Belgique",
    "recrutement hors UE Belgique",
    "test marché emploi Belgique",
  ],
  openGraph: {
    title: "Simulateur d'éligibilité permis unique 2026 — LEXPAT Connect",
    description:
      "Mon poste est-il encore éligible en 2026 ? Testez en 4 étapes avec les listes officielles des métiers en pénurie.",
    url: "https://lexpat-connect.be/simulateur-eligibilite",
    type: "website",
  },
};

export default function SimulateurPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="bg-[#1E3A78] px-4 pb-12 pt-14 text-center text-white">

        {/* Badge double-dot : rose + turquoise */}
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#a8c4f0]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e91e8c]" />
          Outil gratuit
          <span className="text-white/25">·</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" style={{ animationDelay: "0.6s" }} />
          Résultat immédiat
          <span className="text-white/25">·</span>
          Listes officielles 2026
        </p>

        {/* H1 avec "possible ?" en rose */}
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Mon recrutement est-il <span style={{ color: "#e91e8c" }}>possible&nbsp;?</span>
        </h1>

        {/* Description avec concepts-clés en turquoise */}
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#b8cef0]">
          Ce simulateur vérifie en{" "}
          <strong className="font-bold text-[#57b7af]">3 minutes</strong>{" "}
          si votre poste figure sur les{" "}
          <strong className="font-bold text-[#57b7af]">listes officielles de pénurie</strong>{" "}
          en Belgique — et vous indique la procédure applicable, les{" "}
          <strong className="font-bold text-white/90">délais</strong> et les conditions pour obtenir un{" "}
          <strong className="font-bold text-[#57b7af]">permis unique</strong>.
        </p>

        {/* 3 cartes — turquoise / rose / turquoise */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            {
              accent: "#57b7af",
              icon: "✓",
              title: "Éligibilité vérifiée",
              text: "Votre poste est confronté aux listes Actiris, Forem et VDAB 2026 — avec le niveau de qualification du candidat.",
            },
            {
              accent: "#e91e8c",
              icon: "⏱",
              title: "Procédure & délais",
              text: "Test du marché allégé, dispense totale ou blocage : vous savez exactement à quoi vous attendre avant de commencer.",
            },
            {
              accent: "#57b7af",
              icon: "→",
              title: "Prochaines étapes",
              text: "Selon votre résultat, vous accédez directement aux profils disponibles ou à l'accompagnement adapté.",
            },
          ].map(({ accent, icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.06)",
                borderTop: `3px solid ${accent}`,
                borderLeft: "0.5px solid rgba(255,255,255,0.10)",
                borderRight: "0.5px solid rgba(255,255,255,0.10)",
                borderBottom: "0.5px solid rgba(255,255,255,0.10)",
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: `${accent}22`, color: accent }}
              >
                {icon}
              </span>
              <p className="mt-3 text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-[13px] leading-6 text-[#b8cef0]">{text}</p>
            </div>
          ))}
        </div>

        {/* Pour qui ? — turquoise + rose */}
        <p className="mt-8 text-[13px] text-[#8aa8d8]">
          Pour les{" "}
          <strong style={{ color: "#57b7af" }}>employeurs belges</strong>{" "}
          qui veulent recruter hors UE · et les{" "}
          <strong style={{ color: "#f48fb1" }}>travailleurs internationaux</strong>{" "}
          qui veulent connaître leurs chances
        </p>
      </div>

      {/* ── Séparateur "Commencer" ── */}
      <div className="border-b border-[#e5edf5] bg-[#f8fbff] px-4 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4a6b99]">
          Complétez les 4 étapes ci-dessous · Aucune inscription requise
        </p>
      </div>

      {/* Wizard */}
      <SimulateurEligibilite locale="fr" />

      {/* ── Bloc conversion post-simulateur ── */}
      <div className="bg-[linear-gradient(135deg,#eef1fb_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#cde2df] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57b7af]" />
            Résultats concrets
          </p>
          <h2 className="mt-4 text-2xl font-bold text-[#1d3b8b]">Des profils correspondent déjà à votre besoin</h2>
          <p className="mt-3 text-[15px] leading-7 text-[#607086]">
            Des travailleurs internationaux qualifiés sont disponibles sur la plateforme — dans les secteurs en pénurie en Belgique. Accédez-y directement ou créez un compte pour être mis en relation.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="/base-de-profils" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1d3b8b] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#16307a]">
              Voir les profils compatibles →
            </a>
            <a href="/inscription" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c5d4f3] bg-white px-7 py-3.5 text-sm font-bold text-[#1d3b8b] transition hover:border-[#1d3b8b] hover:shadow-sm">
              Créer un compte pour accéder aux talents
            </a>
          </div>
          <p className="mt-5 text-xs text-[#8a9bb0]">Accès gratuit · Aucun engagement · Résultats immédiats</p>
        </div>
      </div>

      {/* Bloc SEO */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1E3A78]">
          Métiers encore éligibles au permis unique en Belgique en 2026
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#607086]">
          Chaque année, les trois régions belges publient leurs listes officielles de
          métiers en pénurie : Actiris pour Bruxelles-Capitale, Le Forem pour la
          Wallonie, et le VDAB pour la Flandre. Un poste figurant sur l'une de ces
          listes peut bénéficier d'une procédure de permis unique accélérée, sans
          que l'employeur n'ait à démontrer l'absence de candidats locaux disponibles
          (test du marché de l'emploi allégé ou supprimé selon la région).
        </p>
        <p className="mt-4 text-sm leading-7 text-[#607086]">
          En 2026, les secteurs les plus représentés dans les listes de pénurie sont
          la construction, la santé, l'informatique, le transport et la logistique,
          ainsi que certains métiers techniques industriels. Le simulateur ci-dessus
          permet à tout employeur belge de vérifier rapidement si son recrutement
          s'inscrit dans ce cadre favorable.
        </p>
      </section>
    </>
  );
}
