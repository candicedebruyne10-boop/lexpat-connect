import PublicMarketplacePage from "../../components/PublicMarketplacePage";
import { getPublicOffersData } from "../../lib/public-marketplace";

export const metadata = {
  title: "Offres d'emploi | LEXPAT Connect",
  description: "Aperçu public des offres d'emploi disponibles sur LEXPAT Connect."
};

export default async function OffresEmploiPage() {
  const data = await getPublicOffersData("fr");
  return (
    <PublicMarketplacePage
      locale="fr"
      kind="offers"
      title="Offres d'emploi"
      intro="Consultez les besoins actuellement visibles sur la plateforme. Les informations essentielles sont publiques pour vous aider à évaluer les opportunités avant de créer votre espace membre."
      kicker="Espace public"
      summary={data.summary}
      rows={data.rows}
      primaryCtaHref="/inscription"
      primaryCtaLabel="Créer mon espace"
      secondaryCtaHref="/connexion?next=/offres-d-emploi"
      secondaryCtaLabel="Se connecter"
    />
  );
}
