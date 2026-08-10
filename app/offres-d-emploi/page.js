import Link from "next/link";
import PublicMarketplacePage from "../../components/PublicMarketplacePage";
import { getPublicOffersData } from "../../lib/public-marketplace";

import { alternatesFor } from "../../lib/seo-alternates";

export const metadata = {
  alternates: alternatesFor("/offres-d-emploi"),
  title: "Offres d'emploi dans les métiers en pénurie en Belgique | LEXPAT Connect",
  description:
    "Consultez les offres d'emploi dans les métiers en pénurie en Belgique : industrie, construction, santé, logistique, IT. Des postes ouverts au recrutement international — permis unique géré si nécessaire."
};

const SECTORS = [
  { icon: "⚙️", label: "Industrie & maintenance" },
  { icon: "🏗️", label: "Construction & BTP" },
  { icon: "🏥", label: "Santé & aide à domicile" },
  { icon: "🚛", label: "Transport & logistique" },
  { icon: "💻", label: "IT & développement" },
  { icon: "🍽️", label: "Horeca & cuisine" },
];

export default async function OffresEmploiPage() {
  const data = await getPublicOffersData("fr");
  return (
    <>
      <PublicMarketplacePage
        locale="fr"
        kind="offers"
        title="Offres d'emploi dans les métiers en pénurie"
        intro="Ces postes sont ouverts au recrutement international. Les employeurs belges qui publient ici cherchent des profils qualifiés — localement ou à l'étranger. Créez votre espace pour postuler ou soumettre votre candidature."
        kicker="Offres en cours"
        summary={data.summary}
        rows={data.rows}
        primaryCtaHref="/inscription"
        primaryCtaLabel="Créer mon espace"
        secondaryCtaHref="/connexion?next=/offres-d-emploi"
        secondaryCtaLabel="Se connecter"
      />

      {/* Bloc statique SEO — visible même si la BDD est vide */}
      <section className="border-t border-[#e5edf5] bg-[#f8fbff]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#57b7af]">Secteurs couverts</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">
            Quels types de postes trouve-t-on sur LEXPAT Connect ?
          </h2>
          <p className="mt-2 text-sm text-[#607086] max-w-2xl">
            Les offres publiées concernent principalement les métiers figurant sur les listes officielles de pénurie — Actiris (Bruxelles), Forem (Wallonie) et VDAB (Flandre). Ces postes ouvrent droit à des procédures de recrutement international simplifiées.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-4 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold text-[#1d3b8b]">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/simulateur-eligibilite" className="inline-flex items-center gap-2 rounded-2xl border border-[#d0dcf0] bg-white px-6 py-3 text-sm font-bold text-[#1E3A78] transition hover:border-[#1E3A78]">
              🧪 Vérifier l'éligibilité d'un poste
            </Link>
            <Link href="/metiers-en-penurie" className="inline-flex items-center gap-2 rounded-2xl border border-[#d0f0ed] bg-white px-6 py-3 text-sm font-bold text-[#0d7c6e] transition hover:border-[#57b7af]">
              📋 Voir tous les métiers en pénurie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
