import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

const page = regionalEmployerPages.bruges;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description
};

export default function BrugesShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
