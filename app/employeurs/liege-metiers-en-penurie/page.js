import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

const page = regionalEmployerPages.liege;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description
};

export default function LiegeShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
