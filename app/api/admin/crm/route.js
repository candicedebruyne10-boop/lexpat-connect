/**
 * GET /api/admin/crm?segment=workers_hidden&page=1&limit=50
 *
 * Retourne la liste des contacts filtrée par segment,
 * avec les données nécessaires pour l'affichage et l'emailing.
 *
 * Segments disponibles :
 *   workers_all, workers_visible, workers_hidden, workers_incomplete,
 *   workers_recent, workers_inactive,
 *   employers_all, employers_with_offers, employers_without_offers, employers_recent,
 *   unsubscribed
 */

import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";
import { getEffectiveWorkerProfileVisibility } from "../../../../lib/worker-profile-visibility";
import { normalizeRegion } from "../../../../lib/matching";

// ─── Accès admin ────────────────────────────────────────────────────────────

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map(e => e.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

// ─── Segments ────────────────────────────────────────────────────────────────

export const SEGMENTS = [
  // Travailleurs
  { id: "workers_all",        label: "Tous les travailleurs",       group: "Travailleurs" },
  { id: "workers_visible",    label: "Profils visibles",            group: "Travailleurs" },
  { id: "workers_hidden",     label: "Profils masqués",             group: "Travailleurs" },
  { id: "workers_incomplete", label: "Profils incomplets",          group: "Travailleurs" },
  { id: "workers_recent",     label: "Inscrits récemment (30j)",    group: "Travailleurs" },
  { id: "workers_inactive",   label: "Inactifs (90j sans activité)",group: "Travailleurs" },
  // Employeurs
  { id: "employers_all",             label: "Tous les employeurs",         group: "Employeurs" },
  { id: "employers_with_offers",     label: "Avec offres publiées",        group: "Employeurs" },
  { id: "employers_without_offers",  label: "Sans offre publiée",          group: "Employeurs" },
  { id: "employers_recent",          label: "Inscrits récemment (30j)",    group: "Employeurs" },
  // Autres
  { id: "unsubscribed", label: "Désinscrits email", group: "Autres" },
];

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const url = new URL(request.url);
    const segment = url.searchParams.get("segment") || "workers_all";

    // ── 1. Chercher les profils selon le segment ──────────────────────────────

    let contacts = [];

    if (segment.startsWith("workers_")) {
      // Récupérer tous les workers avec les infos utiles
      let query = supabase
        .from("worker_profiles")
        .select("id, user_id, full_name, target_job, target_sector, preferred_region, experience_level, profile_visibility, profile_completion, created_at, updated_at, referral_code")
        .order("created_at", { ascending: false });

      const { data: workers, error } = await query;
      if (error) throw error;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      let filtered = workers || [];

      if (segment === "workers_visible") {
        filtered = filtered.filter(w => getEffectiveWorkerProfileVisibility(w) === "visible");
      } else if (segment === "workers_hidden") {
        filtered = filtered.filter(w => getEffectiveWorkerProfileVisibility(w) === "hidden");
      } else if (segment === "workers_incomplete") {
        filtered = filtered.filter(w => !w.target_job?.trim() || !w.target_sector?.trim() || (w.profile_completion || 0) < 60);
      } else if (segment === "workers_recent") {
        filtered = filtered.filter(w => new Date(w.created_at) > thirtyDaysAgo);
      } else if (segment === "workers_inactive") {
        filtered = filtered.filter(w =>
          new Date(w.updated_at || w.created_at) < ninetyDaysAgo &&
          getEffectiveWorkerProfileVisibility(w) !== "visible"
        );
      }

      // Enrichir avec email depuis auth.users (batch par 50)
      contacts = await enrichWithEmails(supabase, filtered, "worker");

    } else if (segment.startsWith("employers_")) {
      // Récupérer les employeurs
      const { data: employers, error: empError } = await supabase
        .from("employer_profiles")
        .select("id, company_name, created_at")
        .order("created_at", { ascending: false });
      if (empError) throw empError;

      // Récupérer les membres (pour avoir user_id et email)
      const { data: members, error: memError } = await supabase
        .from("employer_members")
        .select("employer_profile_id, user_id, full_name, work_email, is_owner, created_at")
        .eq("is_owner", true);
      if (memError) throw memError;

      // Récupérer les offres publiées
      const { data: offers } = await supabase
        .from("job_offers")
        .select("employer_profile_id, status");

      const offerMap = new Map();
      (offers || []).forEach(o => {
        if (o.status === "published") {
          offerMap.set(o.employer_profile_id, (offerMap.get(o.employer_profile_id) || 0) + 1);
        }
      });

      const memberMap = new Map((members || []).map(m => [m.employer_profile_id, m]));
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      let filtered = employers || [];

      if (segment === "employers_with_offers") {
        filtered = filtered.filter(e => (offerMap.get(e.id) || 0) > 0);
      } else if (segment === "employers_without_offers") {
        filtered = filtered.filter(e => (offerMap.get(e.id) || 0) === 0);
      } else if (segment === "employers_recent") {
        filtered = filtered.filter(e => new Date(e.created_at) > thirtyDaysAgo);
      }

      contacts = filtered.map(emp => {
        const member = memberMap.get(emp.id);
        return {
          id: emp.id,
          user_id: member?.user_id || null,
          type: "employer",
          name: emp.company_name || "Entreprise",
          email: member?.work_email || null,
          job: null,
          sector: null,
          region: null,
          visibility: null,
          completion: null,
          offersCount: offerMap.get(emp.id) || 0,
          locale: "fr",
          created_at: emp.created_at,
        };
      }).filter(c => c.email);

    } else if (segment === "unsubscribed") {
      const { data: unsubs, error } = await supabase
        .from("email_unsubscribes")
        .select("email, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      contacts = (unsubs || []).map(u => ({
        id: u.email,
        user_id: null,
        type: "unsubscribed",
        name: u.email,
        email: u.email,
        job: null,
        sector: null,
        region: null,
        visibility: null,
        completion: null,
        locale: "fr",
        created_at: u.created_at,
      }));
    }

    // ── 2. Vérifier les désinscriptions ──────────────────────────────────────
    const { data: unsubs } = await supabase
      .from("email_unsubscribes")
      .select("email");
    const unsubSet = new Set((unsubs || []).map(u => u.email.toLowerCase()));

    contacts = contacts.map(c => ({
      ...c,
      unsubscribed: unsubSet.has((c.email || "").toLowerCase()),
    }));

    // ── 3. Statistiques du segment ───────────────────────────────────────────
    const stats = {
      total: contacts.length,
      reachable: contacts.filter(c => c.email && !c.unsubscribed).length,
      unsubscribed: contacts.filter(c => c.unsubscribed).length,
      noEmail: contacts.filter(c => !c.email).length,
    };

    return NextResponse.json({
      segment,
      segments: SEGMENTS,
      stats,
      contacts,
    });

  } catch (err) {
    const status = err.message?.includes("admin") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Enrichit une liste de worker_profiles avec leur email depuis auth.users.
 * Utilise le champ `email` du profil si disponible, sinon appelle auth.admin.
 */
async function enrichWithEmails(supabase, profiles, type) {
  const results = [];

  for (const profile of profiles) {
    // Essayer l'email stocké dans le profil d'abord
    if (profile.email) {
      results.push(buildWorkerContact(profile, profile.email, "fr"));
      continue;
    }

    // Sinon récupérer depuis auth.users
    if (!profile.user_id) continue;
    const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
    const email = userData?.user?.email;
    if (!email) continue;
    const locale = userData?.user?.user_metadata?.preferred_locale === "en" ? "en" : "fr";
    results.push(buildWorkerContact(profile, email, locale));
  }

  return results;
}

function buildWorkerContact(profile, email, locale) {
  return {
    id: profile.id,
    user_id: profile.user_id,
    type: "worker",
    name: profile.full_name || email,
    email,
    job: profile.target_job || null,
    sector: profile.target_sector || null,
    region: normalizeRegion(profile.preferred_region),
    visibility: getEffectiveWorkerProfileVisibility(profile),
    completion: profile.profile_completion || 0,
    referral_code: profile.referral_code || null,
    locale,
    created_at: profile.created_at,
  };
}
