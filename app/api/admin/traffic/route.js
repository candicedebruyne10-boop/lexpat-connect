import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

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

export async function GET(request) {
  const isAdmin = await assertAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  }

  const token     = process.env.LEXPAT_ANALYTICS_TOKEN;
  const projectId = process.env.LEXPAT_PROJECT_ID;
  const teamId    = process.env.LEXPAT_TEAM_ID;

  if (!token || !projectId) {
    return NextResponse.json({
      configured: false,
      missing: [!token ? "LEXPAT_ANALYTICS_TOKEN" : null, !projectId ? "LEXPAT_PROJECT_ID" : null].filter(Boolean),
      pages: [],
    });
  }

  const to   = Date.now();
  const from = to - 7 * 24 * 60 * 60 * 1000;
  const teamParam = teamId ? `&teamId=${teamId}` : "";

  // Toutes les variantes d'endpoints connues pour Vercel Analytics
  const endpoints = [
    { label: "v1 page-visits (vercel.com)",  url: `https://vercel.com/api/v1/web/analytics/page-visits?projectId=${projectId}&from=${from}&to=${to}&environment=production${teamParam}` },
    { label: "v1 page-visits (api.vercel)", url: `https://api.vercel.com/v1/web/analytics/page-visits?projectId=${projectId}&from=${from}&to=${to}${teamParam}` },
    { label: "web analytics stats",          url: `https://vercel.com/api/web/analytics/stats?projectId=${projectId}&from=${from}&to=${to}${teamParam}` },
    { label: "web insights stats",           url: `https://vercel.com/api/web/insights/stats?projectId=${projectId}&from=${from}&to=${to}${teamParam}` },
    { label: "v2 analytics",                 url: `https://api.vercel.com/v2/web/analytics?projectId=${projectId}&from=${from}&to=${to}${teamParam}` },
  ];

  const debug = [];
  let successData = null;

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });

      const body = await res.text();
      debug.push({ endpoint: ep.label, status: res.status, preview: body.slice(0, 150) });

      if (res.ok) {
        let json;
        try { json = JSON.parse(body); } catch { continue; }
        const rows = json.data ?? json.pageVisits ?? json.rows ?? json.results ?? json.pages ?? [];
        if (Array.isArray(rows) && rows.length > 0) {
          successData = { rows, endpoint: ep.label };
          break;
        }
      }
    } catch (e) {
      debug.push({ endpoint: ep.label, status: "network_error", preview: e.message });
    }
  }

  // Si aucun endpoint n'a fonctionné, retourne le debug pour diagnostiquer
  if (!successData) {
    return NextResponse.json({
      configured: true,
      error: "Aucun endpoint Vercel Analytics n'a retourné de données.",
      debug, // ← visible dans la console du navigateur (F12 → Network → /api/admin/traffic)
      pages: TRACKED_PAGES.map(p => ({ ...p, visitors: 0 })),
      totalVisitors: 0,
    });
  }

  const pages = TRACKED_PAGES.map(({ path, label, priority }) => {
    const match = successData.rows.find(r =>
      r.path === path || r.path === `${path}/` || r.page === path
    );
    return {
      path, label, priority,
      visitors: match ? (match.total ?? match.visitors ?? match.pageviews ?? match.count ?? match.value ?? 0) : 0,
    };
  });

  return NextResponse.json({
    configured: true,
    pages,
    totalVisitors: successData.rows.reduce((s, r) => s + (r.total ?? r.visitors ?? r.pageviews ?? r.count ?? 0), 0),
    from, to,
    _endpoint: successData.endpoint,
  });
}
