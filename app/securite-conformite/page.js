import SecurityComplianceSection from "../../components/SecurityComplianceSection";

export const metadata = {
  title: "Sécurité & conformité | LEXPAT Connect",
  description:
    "Découvrez comment LEXPAT Connect sépare le matching professionnel du traitement juridique : hébergement européen, minimisation RGPD, consentement et relais juridique distinct.",
  robots: { index: false, follow: false },
};

export default function SecuriteConformitePage() {
  return <SecurityComplianceSection />;
}
