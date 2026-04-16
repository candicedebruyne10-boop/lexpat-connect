import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Admin | LEXPAT Connect",
  description: "Back-office administrateur LEXPAT Connect.",
};

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map(e => e.toLowerCase());

async function getAdminData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const [offersRes, workersRes, matchingsRes] = await Promise.all([
    supabase
      .from("job_offers")
      .select("id, title, region, status, created_at, employer_profile_id, employer_profiles(company_name)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("worker_profiles")
      .select("id, full_name, target_job, target_sector, preferred_region, profile_visibility, profile_completion, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("matchings")
      .select("id, score, created_at, job_offers(title), worker_profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return {
    jobOffers: offersRes.data || [],
    workers:   workersRes.data || [],
    matchings: matchingsRes.data || [],
  };
}

export default async function AdminPage() {
  // Fetch operational data server-side
  let initialData = { jobOffers: [], workers: [], matchings: [] };
  try {
    initialData = await getAdminData();
  } catch (e) {
    console.error("Admin page data fetch failed:", e.message);
  }

  return <AdminDashboard initialData={initialData} />;
}
