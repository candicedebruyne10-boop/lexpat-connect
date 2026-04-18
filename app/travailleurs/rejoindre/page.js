import TravailleurWizard from "../../../components/TravailleurWizard";

export const metadata = {
  title: "Créer mon profil | LEXPAT Connect",
  description: "Créez votre profil travailleur en quelques étapes et devenez visible auprès d'employeurs belges.",
  robots: { index: false },
};

export default function RejoindreTravailleurs() {
  return <TravailleurWizard />;
}
