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
      {/* Hero */}
      <div className="bg-[#1E3A78] px-4 py-14 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-[#a8c4f0]">
          Outil juridique gratuit · Résultat immédiat
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Mon poste est-il encore éligible en 2026&nbsp;?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#c5d4f3]">
          Simulateur d'éligibilité permis unique — basé sur les listes officielles
          Actiris, Forem et VDAB 2026.
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
