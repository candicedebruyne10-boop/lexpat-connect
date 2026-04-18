import EmployeurWizard from "../../../components/EmployeurWizard";

export const metadata = {
  title: "Déposer un besoin | LEXPAT Connect",
  description: "Soumettez votre besoin de recrutement international en quelques étapes simples.",
  robots: { index: false },
};

export default function RejoindreEmployeurPage() {
  return <EmployeurWizard />;
}
