import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

import { alternatesFor } from "../../../lib/seo-alternates";

const page = regionalEmployerPages.anvers;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: alternatesFor("/employeurs/anvers-metiers-en-penurie"),
};

export default function AnversShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
