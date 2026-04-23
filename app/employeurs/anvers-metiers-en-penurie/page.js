import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
const page = regionalEmployerPages.anvers;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: {
    canonical: `${BASE}/employeurs/anvers-metiers-en-penurie`,
    languages: {
      fr: `${BASE}/employeurs/anvers-metiers-en-penurie`,
      en: `${BASE}/en/employeurs/anvers-metiers-en-penurie`,
    },
  },
};

export default function AnversShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
