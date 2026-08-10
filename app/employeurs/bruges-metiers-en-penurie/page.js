import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

import { alternatesFor } from "../../../lib/seo-alternates";

const page = regionalEmployerPages.bruges;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: alternatesFor("/employeurs/bruges-metiers-en-penurie"),
};

export default function BrugesShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
