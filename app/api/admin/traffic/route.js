import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";

// ─── Config ───────────────────────────────────────────────────────────────────

const VERCEL_API  = "https://vercel.com/api";
const TOKEN       = process.env.VERCEL_API_TOKEN;
const PROJECT_ID  = process.env.VERCEL_PROJECT_ID;
const TEAM_ID     = process.env.VERCEL_TEAM_ID; // optionnel (compte team)

// Pages prioritaires à surveiller
const TRACKED_PAGES = [
  { path: "/",                                    label: "Accueil FR",          priority: "high" },
  { path: "/en",                                  label: "Accueil EN",          priority: "high" },
  { path: "/employeurs",                          label: "Employeurs",          priority: "high" },
  { path: "/travailleurs",                        label: "Travailleurs",        priority: "high" },
  { path: "/simulateur-eligibilite",              label: "Simulateur",          priority: "critical" },
  { path: "/metiers-en-penurie",                  label: "Métiers en pénurie",  priority: "high" },
  { path: "/employeurs/liege-metiers-en-penurie", label: "Liège — Employeurs",  priority: "critical" },
  { path: "/en/employeurs",                       label: "Employers (EN)",      priority: "medium" },
  { path: "/en/travailleurs",                     label: "Workers (EN)",        priority: "medium" },
];

// ─── Auth helper (réutilise le pattern des autres routes admin) ───────────────

async function assertAdmin(request) {
  try {
    const { user } = await getUserFromRequest(request);
    if (!user) return false;
    const allowed = [
      process.env.CONTACT_EMAIL,
      "contact@lexpat-connect.be",
      "lexpat@lexpat.be",
    ].filter(Boolean).map(e => e.toLowerCase());
    return allowed.includes((user.email || "").toLowerCase());
  } catch {
    return false;
  }
}

// ─── Vercel Analytics fetcher ─────────────────────────────────────────────────

async function fetchVercelPageViews(from, to) {
  const teamParam = TEAM_ID ? `&teamId=${TEAM_ID}` : "";

  // Vercel Analytics REST API — page visits breakdown
  const url = `${VERCEL_API}/v1/web/analytics/page-visits`
    + `?projectId=${PROJECT_ID}`
    + `&from=${from}`
    + `&to=${to}`
    + `&environment=production`
    + `&limit=100`
    + teamParam;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
    next: { revalidate: 1800 }, // cache 30 min
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vercel API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();

  // L'API peut retourner différentes structures selon la version
  const rows = json.data ?? json.pageVisits ?? json.rows ?? json.results ?? [];

  return rows.map(r => ({
    path:     r.path     ?? r.page  ?? r.url  ?? "",
    visitors: r.total    ?? r.visitors ?? r.pageviews ?? r.count ?? r.value ?? 0,
    sessions: r.sessions ?? r.unique ?? null,
  }));
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request) {
  // Vérification accès admin
  const isAdmin = await assertAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  }

  // Credentials manquants → état "non configuré" (pas une erreur)
  if (!TOKEN || !PROJECT_ID) {
    return NextResponse.json({
      configured: false,
      missing: [
        !TOKEN       ? "VERCEL_API_TOKEN"  : null,
        !PROJECT_ID  ? "VERCEL_PROJECT_ID" : null,
      ].filter(Boolean),
      pages: [],
    });
  }

  // Plage : 7 derniers jours
  const to   = Date.now();
  const from = to - 7 * 24 * 60 * 60 * 1000;

  try {
    const raw = await fetchVercelPageViews(from, to);

    // Associer les données brutes aux pages trackées
    const pages = TRACKED_PAGES.map(({ path, label, priority }) => {
      const match = raw.find(r => r.path === path || r.path === `${path}/`);
      return {
        path,
        label,
        priority,
        visitors: match?.visitors ?? 0,
        sessions: match?.sessions ?? null,
      };
    });

    // Stats globales (toutes pages)
    const totalVisitors = raw.reduce((s, r) => s + r.visitors, 0);

    return NextResponse.json({
      configured: true,
      pages,
      totalVisitors,
      from,
      to,
      rawCount: raw.length,
    });

  } catch (e) {
    console.error("[admin/traffic] Vercel API error:", e.message);
    return NextResponse.json({
      configured: true,
      error: e.message,
      pages: TRACKED_PAGES.map(p => ({ ...p, visitors: 0, sessions: null })),
    }, { status: 200 }); // 200 pour que le frontend gère l'erreur gracieusement
  }
}
