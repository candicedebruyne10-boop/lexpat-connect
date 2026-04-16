"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

// ─── Constantes ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",    label: "Vue d'ensemble",  icon: "📊" },
  { id: "contacts",   label: "Contacts",         icon: "👥" },
  { id: "emailing",   label: "Emailing",         icon: "✉️" },
  { id: "operations", label: "Opérationnel",     icon: "⚙️" },
  { id: "history",    label: "Historique",       icon: "📋" },
];

const SEGMENT_GROUPS = {
  "Travailleurs": [
    { id: "workers_all",        label: "Tous les travailleurs" },
    { id: "workers_visible",    label: "Profils visibles" },
    { id: "workers_hidden",     label: "Profils masqués" },
    { id: "workers_incomplete", label: "Profils incomplets" },
    { id: "workers_recent",     label: "Inscrits récemment (30j)" },
    { id: "workers_inactive",   label: "Inactifs (90j)" },
  ],
  "Employeurs": [
    { id: "employers_all",             label: "Tous les employeurs" },
    { id: "employers_with_offers",     label: "Avec offres publiées" },
    { id: "employers_without_offers",  label: "Sans offre publiée" },
    { id: "employers_recent",          label: "Inscrits récemment (30j)" },
  ],
  "Autres": [
    { id: "unsubscribed", label: "Désinscrits email" },
  ],
};

const TEMPLATES = [
  { id: "visibility_initial",     label: "Rendre son profil visible (1ère relance)",  description: "Invite les travailleurs à rendre leur profil visible avant lundi." },
  { id: "visibility_reminder",    label: "Rendre son profil visible (rappel)",         description: "Rappel : profil toujours masqué, dernière chance." },
  { id: "complete_profile",       label: "Compléter son profil",                       description: "Pour les profils incomplets : les encourage à renseigner les infos manquantes." },
  { id: "employer_publish_offer", label: "Employeur — Publier une offre",              description: "Invite les employeurs sans offre publiée à créer leur première offre." },
  { id: "inactivity_reminder",    label: "Rappel d'inactivité",                        description: "Rappel pour les membres inactifs depuis 90+ jours." },
  { id: "referral_share",         label: "Partager son lien de référencement",         description: "Invite les profils visibles à partager leur lien à 3 contacts qualifiés." },
  { id: "custom",                 label: "Message personnalisé",                       description: "Envoyez un message libre sur n'importe quel segment." },
];

// ─── Styles partagés ──────────────────────────────────────────────────────────

const card = {
  background: "#ffffff",
  borderRadius: 16,
  border: "1px solid #e8eef8",
  padding: "24px 28px",
  boxShadow: "0 2px 16px rgba(30,58,120,0.06)",
};

const btn = {
  base: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "9px 18px", borderRadius: 10, fontWeight: 700,
    fontSize: 13, cursor: "pointer", border: "none", transition: "opacity .15s",
  },
  primary: { background: "linear-gradient(135deg,#1E3A78,#2a5ca8)", color: "#fff" },
  danger:  { background: "linear-gradient(135deg,#B5121B,#c9282f)", color: "#fff" },
  ghost:   { background: "#f0f4fb", color: "#1E3A78", border: "1px solid #d0dcf0" },
  teal:    { background: "linear-gradient(135deg,#3da89f,#57B7AF)", color: "#fff" },
};

const badgeStyle = {
  base:        { display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 },
  visible:     { background: "#e6faf7", color: "#0d7c6e" },
  hidden:      { background: "#fef3f2", color: "#b91c1c" },
  incomplete:  { background: "#fff8e6", color: "#92400e" },
  unsubscribed:{ background: "#f5f5f5", color: "#555" },
  worker:      { background: "#eff6ff", color: "#1d4ed8" },
  employer:    { background: "#faf5ff", color: "#6b21a8" },
};

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700, color: "#1E3A78",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
};

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #d0dcf0",
  fontSize: 13, color: "#1E3A78", outline: "none", boxSizing: "border-box",
  background: "#fff",
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Petits composants ────────────────────────────────────────────────────────

function KpiCard({ label, value, color = "#1E3A78", icon }) {
  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Alert({ type = "info", children }) {
  const s = {
    info:    { background: "#eff6ff", borderLeft: "3px solid #3b82f6", color: "#1d4ed8" },
    success: { background: "#f0fdf4", borderLeft: "3px solid #22c55e", color: "#166534" },
    warning: { background: "#fff8e6", borderLeft: "3px solid #f59e0b", color: "#92400e" },
    error:   { background: "#fef2f2", borderLeft: "3px solid #ef4444", color: "#b91c1c" },
  };
  return (
    <div style={{ ...s[type], borderRadius: "0 8px 8px 0", padding: "12px 16px", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
      {children}
    </div>
  );
}

function SectionCard({ title, count, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: "1px solid #e8eef8", borderRadius: 16, overflow: "hidden", marginBottom: 20, background: "#fff" }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", cursor: "pointer", borderBottom: open ? "1px solid #e8eef8" : "none", background: "#f8faff" }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ fontWeight: 800, fontSize: 15, color: "#1E3A78" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {count != null && <span style={{ fontSize: 12, color: "#8a9db8", fontWeight: 600 }}>{count} éléments</span>}
          <span style={{ color: "#8a9db8", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && <div style={{ overflowX: "auto" }}>{children}</div>}
    </div>
  );
}

function SimpleTable({ cols, rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "#f8faff" }}>
          {cols.map(c => <th key={c} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #e8eef8" }}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", borderBottom: "1px solid #f0f4fb" }}>
            {row.map((cell, j) => <td key={j} style={{ padding: "8px 14px", color: "#3d5470" }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyState({ text }) {
  return <div style={{ padding: "24px 20px", color: "#8a9db8", fontSize: 13, textAlign: "center" }}>{text}</div>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ initialData }) {
  const data = initialData || {};

  // Session récupérée côté client
  const [token, setToken] = useState(null);
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setToken(session?.access_token || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    if (!token) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || null));
  }, [token]);

  const [activeTab, setActiveTab] = useState("overview");

  // ── Overview state ──────────────────────────────────────────────────────────
  const [kpis, setKpis]               = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  // ── Contacts state ──────────────────────────────────────────────────────────
  const [segment, setSegment]             = useState("workers_all");
  const [contacts, setContacts]           = useState([]);
  const [contactStats, setContactStats]   = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedIds, setSelectedIds]     = useState(new Set());
  const [search, setSearch]               = useState("");

  // ── Emailing state ──────────────────────────────────────────────────────────
  const [emailSegment, setEmailSegment]   = useState("workers_hidden");
  const [emailTemplate, setEmailTemplate] = useState("visibility_initial");
  const [emailSubject, setEmailSubject]   = useState("");
  const [emailName, setEmailName]         = useState("");
  const [emailLocale, setEmailLocale]     = useState("auto");
  const [emailCustomBody, setEmailCustomBody] = useState("");
  const customBodyRef = { current: null };

  function insertVariable(tag) {
    const textarea = customBodyRef.current;
    if (!textarea) {
      setEmailCustomBody(prev => prev + tag);
      return;
    }
    const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
    const before = emailCustomBody.slice(0, start);
    const after  = emailCustomBody.slice(end);
    const newVal = before + tag + after;
    setEmailCustomBody(newVal);
    // Remettre le curseur après le tag inséré
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  }
  const [emailLoading, setEmailLoading]   = useState(false);
  const [emailResult, setEmailResult]     = useState(null);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [pendingDryRun, setPendingDryRun] = useState(false);
  const [previewHtml, setPreviewHtml]     = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ── History state ───────────────────────────────────────────────────────────
  const [campaigns, setCampaigns]             = useState([]);
  const [campaignsTotal, setCampaignsTotal]   = useState(0);
  const [campaignsPage, setCampaignsPage]     = useState(1);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  // ── Fetch KPIs ──────────────────────────────────────────────────────────────

  const fetchKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      const [wRes, eRes] = await Promise.all([
        fetch("/api/admin/crm?segment=workers_all",    { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/crm?segment=employers_all",  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [wData, eData] = await Promise.all([wRes.json(), eRes.json()]);
      const workers   = wData.contacts  || [];
      const employers = eData.contacts  || [];
      const now = Date.now();

      setKpis({
        workers_total:      workers.length,
        workers_visible:    workers.filter(w => w.visibility === "visible").length,
        workers_hidden:     workers.filter(w => w.visibility === "hidden").length,
        workers_incomplete: workers.filter(w => (w.completion || 0) < 60).length,
        workers_inactive:   workers.filter(w =>
          now - new Date(w.created_at).getTime() > 90 * 86400000 && w.visibility !== "visible"
        ).length,
        employers_total:    employers.length,
        unsubscribed:       wData.stats?.unsubscribed || 0,
        no_email:           wData.stats?.noEmail || 0,
      });
    } catch (e) {
      console.error("KPI fetch failed", e);
    } finally {
      setKpisLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchKpis(); }, [fetchKpis]);

  // ── Fetch contacts ──────────────────────────────────────────────────────────

  const fetchContacts = useCallback(async (seg) => {
    setContactsLoading(true);
    setSelectedIds(new Set());
    try {
      const res  = await fetch(`/api/admin/crm?segment=${seg}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setContacts(json.contacts || []);
      setContactStats(json.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setContactsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "contacts") fetchContacts(segment);
  }, [activeTab, segment, fetchContacts]);

  // ── Fetch campaigns ─────────────────────────────────────────────────────────

  const fetchCampaigns = useCallback(async (page = 1) => {
    setCampaignsLoading(true);
    try {
      const res  = await fetch(`/api/admin/campaigns?page=${page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setCampaigns(json.campaigns || []);
      setCampaignsTotal(json.total || 0);
      setCampaignsPage(page);
    } catch (e) {
      console.error(e);
    } finally {
      setCampaignsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "history") fetchCampaigns(1);
  }, [activeTab, fetchCampaigns]);

  // ── Send campaign ───────────────────────────────────────────────────────────

  const sendCampaign = async (isDryRun) => {
    setEmailLoading(true);
    setEmailResult(null);
    setShowConfirm(false);
    try {
      const res  = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          segment:     emailSegment,
          template:    emailTemplate,
          subject:     emailSubject,
          name:        emailName,
          locale:      emailLocale,
          dry_run:     isDryRun,
          contact_ids: selectedIds.size > 0 ? [...selectedIds] : null,
          custom_html: emailTemplate === "custom" && emailCustomBody ? emailCustomBody : null,
        }),
      });
      const json = await res.json();
      setEmailResult({ ...json, isDryRun });
      if (!isDryRun) fetchCampaigns(1);
    } catch (e) {
      setEmailResult({ error: e.message, isDryRun });
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Contact helpers ─────────────────────────────────────────────────────────

  const filteredContacts = contacts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.name  || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.job   || "").toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const useSelectionForEmail = () => {
    setEmailSegment(segment);
    setActiveTab("emailing");
  };

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────

  // Attendre la session
  if (token === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4fb", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#1E3A78" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>LEXPAT <span style={{ color: "#57B7AF" }}>CONNECT</span></div>
          <div style={{ fontSize: 13, color: "#8a9db8" }}>Chargement de la session…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Open Sans', Arial, sans-serif", background: "#f0f4fb", minHeight: "100vh" }}>

      {/* ── Topbar ── */}
      <div style={{ background: "linear-gradient(135deg,#1a3368,#1E3A78)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: -0.5 }}>LEXPAT</span>
            <span style={{ fontWeight: 700, fontSize: 11, color: "#57B7AF", letterSpacing: 4 }}>CONNECT</span>
            <span style={{ marginLeft: 16, background: "rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>ADMIN</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{userEmail || ""}</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eef8" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", padding: "0 32px" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "16px 20px", fontSize: 13, fontWeight: 700,
                color: activeTab === tab.id ? "#1E3A78" : "#8a9db8",
                borderBottom: activeTab === tab.id ? "3px solid #1E3A78" : "3px solid transparent",
                display: "flex", alignItems: "center", gap: 6, transition: "color .15s",
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>

        {/* ════════════════════════════════════════════════════
            ONGLET 1 — VUE D'ENSEMBLE
        ════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Vue d'ensemble</h2>

            {kpisLoading ? (
              <div style={{ color: "#8a9db8", fontSize: 14 }}>Chargement des indicateurs…</div>
            ) : !kpis ? (
              <Alert type="error">Impossible de charger les KPIs.</Alert>
            ) : (
              <>
                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Travailleurs</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
                  <KpiCard icon="👤" label="Total inscrits"   value={kpis.workers_total}      color="#1E3A78" />
                  <KpiCard icon="✅" label="Profils visibles" value={kpis.workers_visible}    color="#0d7c6e" />
                  <KpiCard icon="🔒" label="Profils masqués"  value={kpis.workers_hidden}     color="#b91c1c" />
                  <KpiCard icon="⚠️" label="Incomplets"       value={kpis.workers_incomplete} color="#92400e" />
                  <KpiCard icon="💤" label="Inactifs (90j)"   value={kpis.workers_inactive}   color="#6b7280" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Employeurs & plateforme</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                  <KpiCard icon="🏢" label="Employeurs"        value={kpis.employers_total} color="#6b21a8" />
                  <KpiCard icon="🔕" label="Désinscrits email" value={kpis.unsubscribed}    color="#6b7280" />
                  <KpiCard icon="📭" label="Sans email"        value={kpis.no_email}        color="#6b7280" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Actions rapides</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button style={{ ...btn.base, ...btn.primary }} onClick={() => { setEmailSegment("workers_hidden"); setEmailTemplate("visibility_initial"); setActiveTab("emailing"); }}>
                    ✉️ Campagne profils masqués
                  </button>
                  <button style={{ ...btn.base, ...btn.teal }} onClick={() => { setSegment("workers_incomplete"); setActiveTab("contacts"); }}>
                    👥 Voir profils incomplets
                  </button>
                  <button style={{ ...btn.base, ...btn.ghost }} onClick={() => { setSegment("employers_without_offers"); setActiveTab("contacts"); }}>
                    🏢 Employeurs sans offre
                  </button>
                  <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setActiveTab("history")}>
                    📋 Historique campagnes
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET 2 — CONTACTS
        ════════════════════════════════════════════════════ */}
        {activeTab === "contacts" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Centre de contacts</h2>
              {selectedIds.size > 0 && (
                <button style={{ ...btn.base, ...btn.primary }} onClick={useSelectionForEmail}>
                  ✉️ Campagne pour les {selectedIds.size} sélectionnés
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

              {/* Sidebar segments */}
              <div style={{ width: 220, flexShrink: 0 }}>
                {Object.entries(SEGMENT_GROUPS).map(([group, segs]) => (
                  <div key={group} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 12 }}>{group}</div>
                    {segs.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSegment(s.id); setSearch(""); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: segment === s.id ? "#eff6ff" : "transparent",
                          color: segment === s.id ? "#1E3A78" : "#6b7280",
                          fontWeight: segment === s.id ? 700 : 500,
                          fontSize: 13, marginBottom: 2, transition: "background .15s",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Contact list */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* Stats bar */}
                {contactStats && (
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    {[
                      { label: "Total", value: contactStats.total, color: "#1E3A78" },
                      { label: "Joignables", value: contactStats.reachable, color: "#0d7c6e" },
                      { label: "Désinscrits", value: contactStats.unsubscribed, color: "#b91c1c" },
                      { label: "Sans email", value: contactStats.noEmail, color: "#6b7280" },
                    ].map(s => (
                      <div key={s.label} style={{ ...card, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</span>
                        <span style={{ fontSize: 12, color: "#8a9db8" }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search + select all */}
                <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Rechercher nom, email, métier…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                  />
                  {filteredContacts.length > 0 && (
                    <button style={{ ...btn.base, ...btn.ghost, fontSize: 12 }} onClick={toggleSelectAll}>
                      {selectedIds.size === filteredContacts.length ? "Tout désélectionner" : `Tout sélectionner (${filteredContacts.length})`}
                    </button>
                  )}
                </div>

                {contactsLoading ? (
                  <div style={{ color: "#8a9db8", fontSize: 14, padding: 20 }}>Chargement…</div>
                ) : filteredContacts.length === 0 ? (
                  <div style={{ ...card, color: "#8a9db8", fontSize: 14, textAlign: "center", padding: 40 }}>
                    Aucun contact dans ce segment.
                  </div>
                ) : (
                  <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                          <th style={{ padding: "10px 14px", width: 36, textAlign: "center" }}>
                            <input type="checkbox" checked={selectedIds.size === filteredContacts.length && filteredContacts.length > 0} onChange={toggleSelectAll} />
                          </th>
                          {["Nom / Email", "Métier / Secteur", "Statut", "Région", "Inscrit"].map(h => (
                            <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((c, i) => (
                          <tr
                            key={c.id}
                            style={{
                              background: selectedIds.has(c.id) ? "#f0f6ff" : i % 2 === 0 ? "#fff" : "#fafbff",
                              borderBottom: "1px solid #f0f4fb", cursor: "pointer",
                            }}
                            onClick={() => toggleSelect(c.id)}
                          >
                            <td style={{ padding: "10px 14px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} />
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ fontWeight: 700, color: "#1E3A78" }}>{c.name || "—"}</div>
                              <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>{c.email || "—"}</div>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ color: "#3d5470" }}>{c.job || "—"}</div>
                              <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>{c.sector || ""}</div>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              {c.unsubscribed
                                ? <span style={{ ...badgeStyle.base, ...badgeStyle.unsubscribed }}>Désinscrit</span>
                                : c.type === "worker"
                                  ? c.visibility === "visible"
                                    ? <span style={{ ...badgeStyle.base, ...badgeStyle.visible }}>Visible</span>
                                    : <span style={{ ...badgeStyle.base, ...badgeStyle.hidden }}>Masqué</span>
                                  : <span style={{ ...badgeStyle.base, ...badgeStyle.employer }}>Employeur</span>
                              }
                              {c.completion != null && c.type === "worker" && (
                                <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 4 }}>{c.completion}% complet</div>
                              )}
                            </td>
                            <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{c.region || "—"}</td>
                            <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{formatDate(c.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedIds.size > 0 && (
                  <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#1E3A78", fontWeight: 700 }}>{selectedIds.size} contact(s) sélectionné(s)</span>
                    <button style={{ ...btn.base, ...btn.primary }} onClick={useSelectionForEmail}>✉️ Créer une campagne pour cette sélection</button>
                    <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setSelectedIds(new Set())}>Désélectionner tout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET 3 — EMAILING
        ════════════════════════════════════════════════════ */}
        {activeTab === "emailing" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Centre d'emailing</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* Config panneau */}
              <div style={{ ...card, display: "flex", flexDirection: "column", gap: 18 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>Configuration</h3>

                <div>
                  <label style={labelStyle}>Nom de la campagne (optionnel)</label>
                  <input type="text" placeholder="Ex : Relance profils masqués — avril 2026" value={emailName} onChange={e => setEmailName(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Segment cible</label>
                  <select value={emailSegment} onChange={e => setEmailSegment(e.target.value)} style={inputStyle}>
                    {Object.entries(SEGMENT_GROUPS).map(([group, segs]) => (
                      <optgroup key={group} label={group}>
                        {segs.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Template d'email</label>
                  <select value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)} style={inputStyle}>
                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 6 }}>
                    {TEMPLATES.find(t => t.id === emailTemplate)?.description}
                  </div>
                </div>

                {emailTemplate === "custom" && (
                  <div>
                    <label style={labelStyle}>Corps du message</label>
                    <textarea
                      ref={el => { customBodyRef.current = el; }}
                      rows={8}
                      placeholder={`Bonjour {{name}},\n\nVotre message ici…\n\nL'équipe LEXPAT Connect`}
                      value={emailCustomBody}
                      onChange={e => setEmailCustomBody(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
                    />
                    <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 8, lineHeight: 1.8 }}>
                      Variables disponibles — seront remplacées automatiquement pour chaque destinataire :
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                        {[
                          { tag: "{{name}}",         desc: "Prénom du contact" },
                          { tag: "{{profile_url}}",  desc: "Lien vers son espace" },
                          { tag: "{{referral_url}}", desc: "Son lien d'affiliation" },
                          { tag: "{{email}}",        desc: "Son adresse email" },
                        ].map(v => (
                          <button
                            key={v.tag}
                            type="button"
                            onClick={() => insertVariable(v.tag)}
                            title={`Cliquer pour insérer ${v.tag}`}
                            style={{ background: "#f0f4fb", border: "1px solid #d0dcf0", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#1E3A78", fontFamily: "monospace", cursor: "pointer", transition: "background .15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e2eaf8"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f0f4fb"}
                          >
                            {v.tag} <span style={{ color: "#8a9db8", fontFamily: "inherit" }}>— {v.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Sujet personnalisé (laissez vide pour le sujet par défaut)</label>
                  <input type="text" placeholder="Sujet de l'email…" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Langue</label>
                  <select value={emailLocale} onChange={e => setEmailLocale(e.target.value)} style={inputStyle}>
                    <option value="auto">Automatique (langue du contact)</option>
                    <option value="fr">Français uniquement</option>
                    <option value="en">Anglais uniquement</option>
                  </select>
                </div>

                {selectedIds.size > 0 && (
                  <Alert type="info">
                    📌 Envoi limité aux <strong>{selectedIds.size} contacts sélectionnés</strong> depuis l'onglet Contacts.{" "}
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontWeight: 700, padding: 0 }} onClick={() => setSelectedIds(new Set())}>
                      Annuler la sélection
                    </button>
                  </Alert>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    style={{ ...btn.base, ...btn.ghost }}
                    disabled={previewLoading}
                    onClick={async () => {
                      setPreviewLoading(true);
                      const params = new URLSearchParams({ template: emailTemplate, locale: emailLocale === "auto" ? "fr" : emailLocale });
                      if (emailTemplate === "custom" && emailCustomBody) params.set("custom_html", emailCustomBody);
                      const res = await fetch(`/api/admin/campaigns/preview?${params}`, { headers: { Authorization: `Bearer ${token}` } });
                      const html = await res.text();
                      setPreviewHtml(html);
                      setPreviewLoading(false);
                    }}
                  >
                    {previewLoading ? "⏳" : "👁️"} Aperçu
                  </button>
                  <button style={{ ...btn.base, ...btn.ghost }} disabled={emailLoading} onClick={() => sendCampaign(true)}>
                    {emailLoading ? "⏳ Simulation…" : "🧪 Simuler"}
                  </button>
                  <button style={{ ...btn.base, ...btn.primary }} disabled={emailLoading} onClick={() => { setPendingDryRun(false); setShowConfirm(true); }}>
                    {emailLoading ? "⏳ Envoi…" : "🚀 Envoyer pour de vrai"}
                  </button>
                </div>
              </div>

              {/* Résultats panneau */}
              <div>
                {!emailResult && !emailLoading && (
                  <div style={{ ...card, textAlign: "center", color: "#8a9db8", fontSize: 14, padding: 48 }}>
                    Configurez votre campagne à gauche, puis simulez ou envoyez.
                  </div>
                )}

                {emailLoading && (
                  <div style={{ ...card, textAlign: "center", color: "#1E3A78", fontSize: 14, padding: 48 }}>
                    ⏳ Traitement en cours…
                  </div>
                )}

                {emailResult && !emailLoading && (
                  <div style={card}>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>
                      {emailResult.isDryRun ? "🧪 Résultat de la simulation" : "✅ Campagne envoyée"}
                    </h3>

                    {emailResult.error && <Alert type="error">{emailResult.error}</Alert>}

                    {!emailResult.error && (
                      <>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                          {[
                            { label: "Envoyés",  value: emailResult.sent,    color: "#0d7c6e" },
                            { label: "Ignorés",  value: emailResult.skipped, color: "#92400e" },
                            { label: "Échecs",   value: emailResult.failed,  color: "#b91c1c" },
                          ].map(s => (
                            <div key={s.label} style={{ flex: 1, background: "#f8faff", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value ?? 0}</div>
                              <div style={{ fontSize: 11, color: "#8a9db8" }}>{s.label}</div>
                            </div>
                          ))}
                        </div>

                        {emailResult.isDryRun && (
                          <Alert type="warning">
                            Mode simulation — aucun email n'a été envoyé.
                          </Alert>
                        )}

                        {emailResult.campaign_id && (
                          <div style={{ fontSize: 12, color: "#8a9db8", marginBottom: 12 }}>
                            Campagne enregistrée : <em>{emailResult.campaign_name}</em>
                          </div>
                        )}

                        {(emailResult.recipients || []).length > 0 && (
                          <details style={{ marginTop: 8 }}>
                            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#1E3A78", marginBottom: 8 }}>
                              Destinataires ({emailResult.recipients.length})
                            </summary>
                            <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 8 }}>
                              {emailResult.recipients.map((r, i) => (
                                <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f4fb", color: "#3d5470" }}>
                                  {r.name || r.email}{" "}
                                  <span style={{ color: "#8a9db8" }}>— {r.email}</span>
                                  {r.locale && <span style={{ marginLeft: 8, ...badgeStyle.base, ...badgeStyle.worker }}>{r.locale}</span>}
                                  {r.dry && <span style={{ marginLeft: 8, color: "#f59e0b", fontSize: 11 }}>(simulation)</span>}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}

                        {(emailResult.failures || []).length > 0 && (
                          <details style={{ marginTop: 8 }}>
                            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#b91c1c", marginBottom: 8 }}>
                              Erreurs ({emailResult.failures.length})
                            </summary>
                            <div style={{ maxHeight: 160, overflowY: "auto", marginTop: 8 }}>
                              {emailResult.failures.map((f, i) => (
                                <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f4fb", color: "#b91c1c" }}>
                                  {f.email} — {f.error}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET 4 — OPÉRATIONNEL
        ════════════════════════════════════════════════════ */}
        {activeTab === "operations" && (
          <div>
            <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Opérationnel</h2>

            <SectionCard title="Offres d'emploi" count={data.jobOffers?.length}>
              {data.jobOffers?.length ? (
                <SimpleTable
                  cols={["Poste", "Employeur", "Région", "Statut", "Date"]}
                  rows={(data.jobOffers || []).map(o => [
                    o.title || "—",
                    o.employer_profiles?.company_name || "—",
                    o.region || "—",
                    o.status || "—",
                    formatDate(o.created_at),
                  ])}
                />
              ) : <EmptyState text="Aucune offre." />}
            </SectionCard>

            <SectionCard title="Travailleurs" count={data.workers?.length}>
              {data.workers?.length ? (
                <SimpleTable
                  cols={["Nom", "Métier", "Secteur", "Région", "Visibilité", "Complétion", "Inscrit"]}
                  rows={(data.workers || []).map(w => [
                    w.full_name || "—",
                    w.target_job || "—",
                    w.target_sector || "—",
                    w.preferred_region || "—",
                    w.profile_visibility || "—",
                    `${w.profile_completion || 0}%`,
                    formatDate(w.created_at),
                  ])}
                />
              ) : <EmptyState text="Aucun travailleur." />}
            </SectionCard>

            <SectionCard title="Matchings récents" count={data.matchings?.length}>
              {data.matchings?.length ? (
                <SimpleTable
                  cols={["Score", "Offre", "Travailleur", "Date"]}
                  rows={(data.matchings || []).map(m => [
                    `${m.score || 0}/100`,
                    m.job_offers?.title || "—",
                    m.worker_profiles?.full_name || "—",
                    formatDate(m.created_at),
                  ])}
                />
              ) : <EmptyState text="Aucun matching." />}
            </SectionCard>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET 5 — HISTORIQUE
        ════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Historique des campagnes</h2>
              <span style={{ fontSize: 12, color: "#8a9db8" }}>{campaignsTotal} campagne(s)</span>
            </div>

            {campaignsLoading ? (
              <div style={{ color: "#8a9db8", fontSize: 14 }}>Chargement…</div>
            ) : campaigns.length === 0 ? (
              <div style={{ ...card, textAlign: "center", color: "#8a9db8", fontSize: 14, padding: 48 }}>
                Aucune campagne pour l'instant. Lancez votre première depuis l'onglet Emailing.
              </div>
            ) : (
              <>
                <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                        {["Nom", "Segment", "Template", "Envoyés", "Ignorés", "Échecs", "Mode", "Statut", "Date"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => (
                        <>
                          <tr
                            key={c.id}
                            style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", borderBottom: "1px solid #f0f4fb", cursor: "pointer" }}
                            onClick={() => setExpandedCampaign(expandedCampaign === c.id ? null : c.id)}
                          >
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1E3A78", maxWidth: 200 }}>{c.name}</td>
                            <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{c.segment}</td>
                            <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{c.template}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0d7c6e" }}>{c.sent_count}</td>
                            <td style={{ padding: "10px 14px", color: "#92400e" }}>{c.skipped_count}</td>
                            <td style={{ padding: "10px 14px", color: "#b91c1c" }}>{c.failed_count}</td>
                            <td style={{ padding: "10px 14px" }}>
                              {c.dry_run
                                ? <span style={{ ...badgeStyle.base, ...badgeStyle.incomplete }}>Simulation</span>
                                : <span style={{ ...badgeStyle.base, ...badgeStyle.visible }}>Réel</span>}
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ ...badgeStyle.base, ...(c.status === "done" ? badgeStyle.visible : c.status === "partial" ? badgeStyle.incomplete : badgeStyle.hidden) }}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{formatDateTime(c.created_at)}</td>
                          </tr>
                          {expandedCampaign === c.id && (
                            <tr key={`${c.id}-detail`}>
                              <td colSpan={9} style={{ padding: "12px 24px 20px", background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                                <div style={{ display: "flex", gap: 24 }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#57B7AF", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                                      Destinataires ({(c.recipients || []).length})
                                    </div>
                                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                                      {(c.recipients || []).slice(0, 50).map((r, j) => (
                                        <div key={j} style={{ fontSize: 12, color: "#3d5470", padding: "4px 0", borderBottom: "1px solid #f0f4fb" }}>
                                          {r.name || r.email} <span style={{ color: "#8a9db8" }}>— {r.email}</span>
                                        </div>
                                      ))}
                                      {(c.recipients || []).length > 50 && (
                                        <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 6 }}>…et {c.recipients.length - 50} autres</div>
                                      )}
                                    </div>
                                  </div>
                                  {(c.failures || []).length > 0 && (
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                                        Échecs ({c.failures.length})
                                      </div>
                                      <div style={{ maxHeight: 180, overflowY: "auto" }}>
                                        {c.failures.map((f, j) => (
                                          <div key={j} style={{ fontSize: 12, color: "#b91c1c", padding: "4px 0", borderBottom: "1px solid #f0f4fb" }}>
                                            {f.email} — {f.error}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {campaignsTotal > 20 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                    <button style={{ ...btn.base, ...btn.ghost }} disabled={campaignsPage <= 1} onClick={() => fetchCampaigns(campaignsPage - 1)}>← Préc.</button>
                    <span style={{ padding: "9px 14px", fontSize: 13, color: "#1E3A78" }}>Page {campaignsPage} / {Math.ceil(campaignsTotal / 20)}</span>
                    <button style={{ ...btn.base, ...btn.ghost }} disabled={campaignsPage * 20 >= campaignsTotal} onClick={() => fetchCampaigns(campaignsPage + 1)}>Suiv. →</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Modale de prévisualisation ── */}
      {previewHtml && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 998 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "min(720px, 95vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e8eef8", flexShrink: 0 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1E3A78" }}>Aperçu de l'email</div>
                <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>Données fictives — destinataire : Marie Dupont</div>
              </div>
              <button
                onClick={() => setPreviewHtml(null)}
                style={{ background: "#f0f4fb", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700, color: "#1E3A78", fontSize: 13 }}
              >
                ✕ Fermer
              </button>
            </div>
            {/* iframe */}
            <iframe
              srcDoc={previewHtml}
              style={{ flex: 1, border: "none", width: "100%", minHeight: 500 }}
              title="Aperçu email"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* ── Modale de confirmation ── */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 440, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 900, color: "#1E3A78" }}>Confirmer l'envoi réel</h3>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: "#3d5470", lineHeight: 1.7 }}>
              Segment : <strong>{emailSegment}</strong>
              {selectedIds.size > 0 && ` (${selectedIds.size} contacts sélectionnés)`}<br />
              Template : <strong>{TEMPLATES.find(t => t.id === emailTemplate)?.label}</strong>
            </p>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#b91c1c" }}>
              ⚠️ Cette action enverra des emails réels. Elle est irréversible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setShowConfirm(false)}>Annuler</button>
              <button style={{ ...btn.base, ...btn.danger }} onClick={() => sendCampaign(false)}>
                Oui, envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
