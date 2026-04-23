import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
const page = regionalEmployerPages.bruges;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: {
    canonical: `${BASE}/employeurs/bruges-metiers-en-penurie`,
    languages: {
      fr: `${BASE}/employeurs/bruges-metiers-en-penurie`,
      en: `${BASE}/en/employeurs/bruges-metiers-en-penurie`,
    },
  },
};

export default function BrugesShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
