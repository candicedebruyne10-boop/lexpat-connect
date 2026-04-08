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
      <SimulateurEligibilite />

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
