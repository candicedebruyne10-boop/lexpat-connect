import dynamic from "next/dynamic";

// AdminDashboard uses Supabase browser client (localStorage, cookies, browser APIs).
// Rendering it on the server causes a crash — ssr: false ensures it only runs in the browser.
const AdminDashboard = dynamic(
  () => import("../../components/AdminDashboard"),
  { ssr: false }
);

export const metadata = {
  title: "Admin | LEXPAT Connect",
  description: "Back-office administrateur LEXPAT Connect.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
