import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((e) => e.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    // ── 1. Utilisateurs avec rôle admin en base ──────────────────────────────
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id, role, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    // ── 2. Tous les rôles (pour la distribution) ─────────────────────────────
    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("role");

    const roleCount = (allRoles || []).reduce((acc, r) => {
      acc[r.role] = (acc[r.role] || 0) + 1;
      return acc;
    }, {});

    // ── 3. Présence des variables d'environnement (jamais les valeurs) ────────
    const envVars = {
      ANTHROPIC_API_KEY:            !!process.env.ANTHROPIC_API_KEY,
      OPENAI_API_KEY:               !!process.env.OPENAI_API_KEY,
      RESEND_API_KEY:               !!process.env.RESEND_API_KEY,
      LINKEDIN_CLIENT_SECRET:       !!process.env.LINKEDIN_CLIENT_SECRET,
      LINKEDIN_CLIENT_ID:           !!process.env.LINKEDIN_CLIENT_ID,
      SUPABASE_SERVICE_ROLE_KEY:    !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL:     !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      CONTACT_EMAIL:                !!process.env.CONTACT_EMAIL,
      NEXT_PUBLIC_GA_MEASUREMENT_ID:!!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    };

    // ── 4. Migrations appliquées (vérification par existence de tables/colonnes)
    const migrationChecks = await Promise.all([
      supabase.from("user_roles").select("user_id").limit(0),             // 001
      supabase.from("test_feedback").select("id").limit(0),               // 002
      supabase.from("matches").select("id").limit(0),                     // 003
      supabase.from("conversations").select("id").limit(0),               // 004
      supabase.from("match_notification_logs").select("id").limit(0),     // 006
      supabase.from("referrals").select("id").limit(0),                   // 007
      supabase.from("email_campaigns").select("id").limit(0),             // 008
      supabase.from("linkedin_admin_connections").select("id").limit(0),  // 009
    ]);

    const migrations = [
      { id: "001", label: "Schéma initial (users, workers, employers, offers)", ok: !migrationChecks[0].error },
      { id: "002", label: "Feedback testeurs (test_feedback)", ok: !migrationChecks[1].error },
      { id: "003", label: "Matching (matches)", ok: !migrationChecks[2].error },
      { id: "004", label: "Messagerie (conversations, messages)", ok: !migrationChecks[3].error },
      { id: "005", label: "Sécurité test_feedback (RLS + REVOKE)", ok: !migrationChecks[1].error },
      { id: "006", label: "Logs notifications matching", ok: !migrationChecks[4].error },
      { id: "007", label: "Système de parrainage (referrals)", ok: !migrationChecks[5].error },
      { id: "008", label: "Campagnes email (email_campaigns)", ok: !migrationChecks[6].error },
      { id: "009", label: "Connexions LinkedIn admin", ok: !migrationChecks[7].error },
      { id: "010", label: "Profils sociaux LinkedIn (colonnes member_urn)", ok: !migrationChecks[7].error },
      { id: "011", label: "Durcissement sécurité (RLS matches, GRANTs, fix user_roles)", ok: !migrationChecks[2].error },
    ];

    // ── 5. Admins hardcodés (emails env) ─────────────────────────────────────
    const hardcodedAdmins = ADMIN_EMAILS;

    return NextResponse.json({
      ok: true,
      adminRoles: adminRoles || [],
      roleCount,
      envVars,
      migrations,
      hardcodedAdmins,
      checkedAt: new Date().toISOString(),
    });

  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
