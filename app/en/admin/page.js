import AdminDashboard from "../../../components/AdminDashboard";

export const metadata = {
  title: "Admin | LEXPAT Connect",
  description: "Administrative back office to review openings, applications and matches.",
  robots: { index: false, follow: false },
};

export default function AdminPageEn() {
  return <AdminDashboard locale="en" />;
}
