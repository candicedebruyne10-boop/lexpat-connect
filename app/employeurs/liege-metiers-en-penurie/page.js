import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

import { alternatesFor } from "../../../lib/seo-alternates";

const page = regionalEmployerPages.liege;

export const metadata = {
  alternates: alternatesFor("/employeurs/liege-metiers-en-penurie"),
  title: page.seo.title,
  description: page.seo.description
};

export default function LiegeShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
