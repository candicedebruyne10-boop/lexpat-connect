// Server Component — can export metadata.
// AdminDashboard is browser-only (Supabase auth, localStorage).
// We load it via AdminLoader (a Client Component that uses dynamic + ssr:false),
// which is the correct App Router pattern for excluding a component from SSR.
import AdminLoader from "../../components/AdminLoader";

export const metadata = {
  title: "Admin | LEXPAT Connect",
  description: "Back-office administrateur LEXPAT Connect.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminLoader />;
}
