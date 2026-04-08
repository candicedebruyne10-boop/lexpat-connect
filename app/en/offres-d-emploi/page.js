import PublicMarketplacePage from "../../../components/PublicMarketplacePage";
import { getPublicOffersData } from "../../../lib/public-marketplace";

export const metadata = {
  title: "Job openings | LEXPAT Connect",
  description: "Public preview of job openings available on LEXPAT Connect."
};

export default async function EnOffresEmploiPage() {
  const data = await getPublicOffersData("en");
  return (
    <PublicMarketplacePage
      locale="en"
      kind="offers"
      title="Job openings"
      intro="Browse the opportunities currently visible on the platform. The key information is public so you can assess the market before creating your member account."
      kicker="Public area"
      summary={data.summary}
      rows={data.rows}
      primaryCtaHref="/en/inscription"
      primaryCtaLabel="Create my account"
      secondaryCtaHref="/en/connexion?next=/en/offres-d-emploi"
      secondaryCtaLabel="Sign in"
    />
  );
}
