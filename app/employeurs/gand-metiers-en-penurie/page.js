import EmployerRegionalLanding from "../../../components/EmployerRegionalLanding";
import { regionalEmployerPages } from "../../../lib/regional-employer-pages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
const page = regionalEmployerPages.gand;

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: {
    canonical: `${BASE}/employeurs/gand-metiers-en-penurie`,
    languages: {
      fr: `${BASE}/employeurs/gand-metiers-en-penurie`,
      en: `${BASE}/en/employeurs/gand-metiers-en-penurie`,
    },
  },
};

export default function GandShortageJobsPage() {
  return <EmployerRegionalLanding page={page} />;
}
