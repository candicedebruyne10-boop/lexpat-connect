import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic"; // désactive le cache Next.js

// Pages prioritaires à surveiller
const TRACKED_PAGES = [
  { path: "/",                                    label: "Accueil FR",         priority: "high"     },
  { path: "/en",                                  label: "Accueil EN",         priority: "high"     },
  { path: "/employeurs",                          label: "Employeurs",         priority: "high"     },
  { path: "/travailleurs",                        label: "Travailleurs",       priority: "high"     },
  { path: "/simulateur-eligibilite",              label: "Simulateur",         priority: "critical" },
  { path: "/metiers-en-penurie",                  label: "Métiers en pénurie", priority: "high"     },
  { path: "/employeurs/liege-metiers-en-penurie", label: "Liège — Employeurs", priority: "critical" },
  { path: "/en/employeurs",                       label: "Employers (EN)",     priority: "medium"   },
  { path: "/en/travailleurs",                     label: "Workers (EN)",       priority: "medium"   },
];

// ─── Auth admin ───────────────────────────────────────────────────────────────

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

async function fetchVercelPageViews(token, projectId, teamId, from, to) {
  const teamParam = teamId ? `&teamId=${teamId}` : "";

  // Essai 1 : endpoint v1 Web Analytics
  const endpoints = [
    `https://vercel.com/api/v1/web/analytics/page-visits?projectId=${projectId}&from=${from}&to=${to}&environment=production&limit=100${teamParam}`,
    `https://api.vercel.com/v1/web/analytics/page-visits?projectId=${projectId}&from=${from}&to=${to}&environment=production&limit=100${teamParam}`,
    `https://vercel.com/api/web/analytics/stats?projectId=${projectId}&from=${from}&to=${to}${teamParam}`,
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 404 || res.status === 405) continue; // mauvais endpoint, essaie le suivant
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        lastError = `HTTP ${res.status}: ${body.slice(0, 200)}`;
        continue;
      }

      const json = await res.json();
      const rows = json.data ?? json.pageVisits ?? json.rows ?? json.results ?? json.pages ?? [];

      return { ok: true, rows, endpoint: url };
    } catch (e) {
      lastError = e.message;
    }
  }

  return { ok: false, error: lastError || "Tous les endpoints ont échoué" };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request) {
  // Auth
  const isAdmin = await assertAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  }

  // Lire les env vars DANS la fonction (pas au niveau module) pour éviter le cache
  const token     = process.env.LEXPAT_ANALYTICS_TOKEN;
  const projectId = process.env.LEXPAT_PROJECT_ID;
  const teamId    = process.env.LEXPAT_TEAM_ID;

  if (!token || !projectId) {
    return NextResponse.json({
      configured: false,
      missing: [
        !token     ? "LEXPAT_ANALYTICS_TOKEN"  : null,
        !projectId ? "LEXPAT_PROJECT_ID"        : null,
      ].filter(Boolean),
      pages: [],
    });
  }

  const to   = Date.now();
  const from = to - 7 * 24 * 60 * 60 * 1000;

  const result = await fetchVercelPageViews(token, projectId, teamId, from, to);

  if (!result.ok) {
    console.error("[admin/traffic]", result.error);
    return NextResponse.json({
      configured: true,
      error: result.error,
      pages: TRACKED_PAGES.map(p => ({ ...p, visitors: 0 })),
    });
  }

  const pages = TRACKED_PAGES.map(({ path, label, priority }) => {
    const match = result.rows.find(r =>
      r.path === path || r.path === `${path}/` || r.page === path || r.url === path
    );
    return {
      path, label, priority,
      visitors: match ? (match.total ?? match.visitors ?? match.pageviews ?? match.count ?? match.value ?? 0) : 0,
    };
  });

  const totalVisitors = result.rows.reduce((s, r) =>
    s + (r.total ?? r.visitors ?? r.pageviews ?? r.count ?? r.value ?? 0), 0
  );

  return NextResponse.json({
    configured: true,
    pages,
    totalVisitors,
    from, to,
    _endpoint: result.endpoint, // pour debug
  });
}
