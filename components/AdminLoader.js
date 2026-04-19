"use client";

/**
 * AdminLoader — Client Component wrapper
 *
 * In Next.js App Router, `dynamic(..., { ssr: false })` must be called from
 * inside a Client Component. The Server Component page (app/admin/page.js)
 * imports this wrapper; this wrapper lazy-loads AdminDashboard browser-only.
 */

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("./AdminDashboard"),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#1E3A78", fontSize: 15, fontWeight: 600 }}>
        Chargement du tableau de bord…
      </div>
    ),
  }
);

export default function AdminLoader() {
  return <AdminDashboard />;
}
