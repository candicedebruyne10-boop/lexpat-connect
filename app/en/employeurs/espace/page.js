import EmployerSpace from "../../../../components/EmployerSpace";

export const metadata = {
  title: "Employer space | LEXPAT Connect",
  description: "An employer space designed to structure hiring needs and manage openings.",
  robots: { index: false, follow: false },
};

export default function EnglishEmployerSpacePage() {
  return <EmployerSpace locale="en" />;
}
