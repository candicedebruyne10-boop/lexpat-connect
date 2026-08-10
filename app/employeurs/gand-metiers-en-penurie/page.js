import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

import { alternatesFor } from "../../../lib/seo-alternates";

const page = regionalEmployerPages.gand;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: alternatesFor("/employeurs/gand-metiers-en-penurie"),
};

export default function GandShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
