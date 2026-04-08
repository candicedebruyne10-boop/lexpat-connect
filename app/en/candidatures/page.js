import PublicMarketplacePage from "../../../components/PublicMarketplacePage";
import { getPublicApplicationsData } from "../../../lib/public-marketplace";

export const metadata = {
  title: "Anonymous applications | LEXPAT Connect",
  description: "Public preview of anonymised worker applications available on LEXPAT Connect."
};

export default async function EnCandidaturesPage() {
  const data = await getPublicApplicationsData("en");
  return (
    <PublicMarketplacePage
      locale="en"
      kind="applications"
      title="Anonymous applications"
      intro="These profiles are real and active. The key information is visible publicly, while identity and contact details remain protected until a match is confirmed."
      kicker="Public area"
      summary={data.summary}
      rows={data.rows}
      primaryCtaHref="/en/employeurs"
      primaryCtaLabel="Post an opening"
      secondaryCtaHref="/en/connexion?next=/en/candidatures"
      secondaryCtaLabel="Sign in"
    />
  );
}
