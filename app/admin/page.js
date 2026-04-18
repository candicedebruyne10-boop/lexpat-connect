import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Admin | LEXPAT Connect",
  description: "Back-office administrateur LEXPAT Connect.",
  robots: { index: false, follow: false },
};

// NOTE: all data is fetched client-side by AdminDashboard via auth-protected API routes.
// No server-side data fetch here — the service-role key must never be used without
// verifying the requester's identity first.
export default function AdminPage() {
  return <AdminDashboard />;
}
