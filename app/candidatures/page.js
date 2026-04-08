import PublicMarketplacePage from "../../components/PublicMarketplacePage";
import { getPublicApplicationsData } from "../../lib/public-marketplace";

export const metadata = {
  title: "Candidatures | LEXPAT Connect",
  description: "Aperçu public des candidatures anonymisées disponibles sur LEXPAT Connect."
};

export default async function CandidaturesPage() {
  const data = await getPublicApplicationsData("fr");
  return (
    <PublicMarketplacePage
      locale="fr"
      kind="applications"
      title="Candidatures anonymisées"
      intro="Ces profils sont réels et actifs. Les éléments clés sont visibles publiquement, tandis que l'identité et les coordonnées restent protégées jusqu'à la mise en relation."
      kicker="Espace public"
      summary={data.summary}
      rows={data.rows}
      primaryCtaHref="/employeurs"
      primaryCtaLabel="Déposer une offre"
      secondaryCtaHref="/connexion?next=/candidatures"
      secondaryCtaLabel="Se connecter"
    />
  );
}
