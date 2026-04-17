"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

// ─── Constantes ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",    label: "Vue d'ensemble",  icon: "📊" },
  { id: "coach",       label: "Coach IA",         icon: "🤖" },
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
  { id: "visibility_initial",     label: "Rendre son profil visible (1ère relance)",  description: "Invite les travailleurs à rendre leur profil visible avant lundi.",              subject_fr: "Rendez votre profil visible avant lundi",                  subject_en: "Make your profile visible before Monday" },
  { id: "visibility_reminder",    label: "Rendre son profil visible (rappel)",         description: "Rappel : profil toujours masqué, dernière chance.",                              subject_fr: "Rappel : rendez votre profil visible avant lundi",          subject_en: "Reminder: make your profile visible before Monday" },
  { id: "complete_profile",       label: "Compléter son profil",                       description: "Pour les profils incomplets : les encourage à renseigner les infos manquantes.", subject_fr: "Complétez votre profil LEXPAT Connect",                     subject_en: "Complete your LEXPAT Connect profile" },
  { id: "employer_publish_offer", label: "Employeur — Publier une offre",              description: "Invite les employeurs sans offre publiée à créer leur première offre.",          subject_fr: "Publiez votre première offre sur LEXPAT Connect",           subject_en: "Publish your first opening on LEXPAT Connect" },
  { id: "inactivity_reminder",    label: "Rappel d'inactivité",                        description: "Rappel pour les membres inactifs depuis 90+ jours.",                             subject_fr: "Votre profil LEXPAT Connect vous attend",                   subject_en: "Your LEXPAT Connect profile is waiting for you" },
  { id: "referral_share",         label: "Partager son lien de référencement",         description: "Invite les profils visibles à partager leur lien à 3 contacts qualifiés.",       subject_fr: "Boostez votre visibilité en 1 geste",                       subject_en: "Boost your visibility in 1 step" },
  { id: "custom",                 label: "Message personnalisé",                       description: "Envoyez un message libre sur n'importe quel segment.",                           subject_fr: "",                                                          subject_en: "" },
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
  amber:   { background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "#fff" },
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

// ─── Coach IA — Analyse Trafic ────────────────────────────────────────────────

const TRAFFIC_THRESHOLDS = { high: 80, medium: 25 }; // visiteurs/7j

function classifyTraffic(visitors) {
  if (visitors >= TRAFFIC_THRESHOLDS.high)   return "high";
  if (visitors >= TRAFFIC_THRESHOLDS.medium)  return "medium";
  return "low";
}

function deriveTrafficInsights(pages) {
  if (!pages?.length) return [];

  const insights   = [];
  const maxVisitors = Math.max(...pages.map(p => p.visitors), 1);

  // Tri par visiteurs décroissant
  const sorted = [...pages].sort((a, b) => b.visitors - a.visitors);

  let criticalCount    = 0; // max 1
  let opportunityCount = 0; // max 2

  for (const page of sorted) {
    const traffic = classifyTraffic(page.visitors);
    const isKey   = page.priority === "critical";

    // ── Règle 8 : Simulateur + trafic élevé ──────────────────────────────────
    if (page.path.includes("simulateur") && traffic !== "low" && opportunityCount < 2) {
      insights.push({
        id: `trafic_simulateur`,
        type: "opportunite",
        icon: "🔮",
        page: page.path, label: page.label, visitors: page.visitors,
        message: "Le simulateur attire du trafic.",
        action: "Transformer la fin du simulateur en machine à conversion : CTA 'Voir les profils' et 'Créer mon compte' bien visibles.",
        impact: "très fort",
      });
      opportunityCount++;
      continue;
    }

    // ── Règle 7 : Page Liège + trafic élevé ──────────────────────────────────
    if (page.path.includes("liege") && traffic !== "low" && opportunityCount < 2) {
      insights.push({
        id: `trafic_liege`,
        type: "opportunite",
        icon: "🏙️",
        page: page.path, label: page.label, visitors: page.visitors,
        message: "La page Liège attire des employeurs potentiels.",
        action: "Ajouter des profils visibles dans ce secteur, des témoignages et un CTA simulateur en haut de page.",
        impact: "très fort",
      });
      opportunityCount++;
      continue;
    }

    // ── Règle 1+2 : Trafic élevé → problème potentiel CTR ────────────────────
    if (traffic === "high" && (page.path === "/" || page.path === "/en") && criticalCount < 1) {
      insights.push({
        id: `trafic_home_ctr`,
        type: "probleme",
        icon: "⚠️",
        page: page.path, label: page.label, visitors: page.visitors,
        message: "La homepage génère du trafic mais les visiteurs ne passent pas encore suffisamment à l'action.",
        action: "Clarifier la promesse principale et placer un CTA 'Voir les profils' ou 'Tester la faisabilité' dès le dessus du fold.",
        impact: "très fort",
      });
      criticalCount++;
      continue;
    }

    // ── Règle 3 : Page qui performe bien ─────────────────────────────────────
    if (traffic === "medium" && opportunityCount < 2) {
      insights.push({
        id: `trafic_performing_${page.path}`,
        type: "opportunite",
        icon: "✅",
        page: page.path, label: page.label, visitors: page.visitors,
        message: "Cette page génère un trafic régulier.",
        action: "Optimiser la conversion : ajouter témoignages, CTA et profils visibles pour transformer les visiteurs en leads.",
        impact: "fort",
      });
      opportunityCount++;
      continue;
    }

    // ── Règle 4 : Trafic faible → SEO ────────────────────────────────────────
    if (traffic === "low" && isKey && opportunityCount < 2) {
      insights.push({
        id: `trafic_low_${page.path}`,
        type: "opportunite",
        icon: "📈",
        page: page.path, label: page.label, visitors: page.visitors,
        message: "Cette page clé n'attire pas encore de trafic.",
        action: "Améliorer le SEO (méta-description, H1 ciblé, maillage interne) ou partager sur LinkedIn et par email.",
        impact: "moyen",
      });
      opportunityCount++;
      continue;
    }
  }

  // Cap : 1 problème critique + 2 opportunités max
  const critical     = insights.filter(i => i.type === "probleme").slice(0, 1);
  const opportunities = insights.filter(i => i.type === "opportunite").slice(0, 2);
  return [...critical, ...opportunities];
}

// ─── Coach IA — carte trafic ──────────────────────────────────────────────────

function TrafficCard({ insight, siteUrl }) {
  const typeTheme = {
    probleme:   { bg: "#fff1f2", border: "#fca5a5", badgeBg: "#fee2e2", badgeText: "#b91c1c", label: "Problème" },
    opportunite:{ bg: "#f0fdf4", border: "#86efac", badgeBg: "#dcfce7", badgeText: "#166534", label: "Opportunité" },
    insight:    { bg: "#eff6ff", border: "#bfdbfe", badgeBg: "#dbeafe", badgeText: "#1d4ed8", label: "Insight" },
    alerte:     { bg: "#fffbeb", border: "#fcd34d", badgeBg: "#fef3c7", badgeText: "#92400e", label: "Alerte" },
  };
  const th = typeTheme[insight.type] || typeTheme.insight;

  const impactColor = {
    "très fort": "#b91c1c",
    "fort":      "#0d7c6e",
    "moyen":     "#92400e",
  }[insight.impact] || "#6b7280";

  return (
    <div style={{ background: th.bg, border: `1.5px solid ${th.border}`, borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 22, lineHeight: 1.2 }}>{insight.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1E3A78", lineHeight: 1.3 }}>{insight.label}</div>
            <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2, fontFamily: "monospace" }}>{insight.page}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, background: th.badgeBg, color: th.badgeText }}>{th.label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: impactColor }}>impact {insight.impact}</span>
        </div>
      </div>

      {/* Visiteurs badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: 0.5 }}>7 derniers jours</span>
        <span style={{ fontWeight: 900, fontSize: 18, color: "#1E3A78" }}>{insight.visitors.toLocaleString("fr-BE")}</span>
        <span style={{ fontSize: 12, color: "#8a9db8" }}>visiteurs</span>
      </div>

      {/* Message */}
      <p style={{ margin: 0, fontSize: 13, color: "#3d5470", lineHeight: 1.65 }}>{insight.message}</p>

      {/* Action */}
      <div style={{ background: "rgba(255,255,255,0.72)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Action concrète</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E3A78" }}>{insight.action}</div>
      </div>

      {/* CTA */}
      {siteUrl && (
        <a
          href={`${siteUrl}${insight.page}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btn.base, ...btn.ghost, textDecoration: "none", fontSize: 12, alignSelf: "flex-start" }}
        >
          🔗 Ouvrir la page
        </a>
      )}
    </div>
  );
}

// ─── Écran de connexion admin ─────────────────────────────────────────────────

function AdminLoginScreen() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [sent, setSent]         = useState(false);
  const [mode, setMode]         = useState("password"); // "password" | "magic"

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (err) setError(err.message);
      else setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4fb", fontFamily: "'Open Sans', Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 44px", maxWidth: 420, width: "90%", boxShadow: "0 8px 40px rgba(30,58,120,0.10)", border: "1px solid #e8eef8" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#1E3A78", letterSpacing: -0.5 }}>
            LEXPAT <span style={{ color: "#57B7AF" }}>CONNECT</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>
            Accès administrateur
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1E3A78", marginBottom: 8 }}>Lien envoyé !</div>
            <div style={{ fontSize: 13, color: "#8a9db8", lineHeight: 1.7 }}>
              Un lien de connexion a été envoyé à <strong>{email}</strong>.<br />
              Cliquez dessus pour accéder au dashboard.
            </div>
          </div>
        ) : (
          <>
            {/* Toggle mode */}
            <div style={{ display: "flex", background: "#f0f4fb", borderRadius: 10, padding: 3, marginBottom: 24 }}>
              {[
                { id: "password", label: "Mot de passe" },
                { id: "magic",    label: "Lien magique" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setError(null); }}
                  style={{
                    flex: 1, border: "none", borderRadius: 8, padding: "8px 0",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s",
                    background: mode === m.id ? "#fff" : "transparent",
                    color: mode === m.id ? "#1E3A78" : "#8a9db8",
                    boxShadow: mode === m.id ? "0 1px 6px rgba(30,58,120,0.10)" : "none",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@lexpat-connect.be"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>

              {mode === "password" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Mot de passe</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={inputStyle}
                    autoComplete="current-password"
                  />
                </div>
              )}

              {mode === "magic" && (
                <div style={{ marginBottom: 20, fontSize: 12, color: "#8a9db8", lineHeight: 1.6 }}>
                  Un lien de connexion sera envoyé à votre adresse email.
                </div>
              )}

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ ...btn.base, ...btn.primary, width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 0", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "⏳ Connexion…" : mode === "password" ? "Se connecter" : "Envoyer le lien"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Coach IA — logique de diagnostic ────────────────────────────────────────

function deriveInsights(kpis) {
  if (!kpis) return [];
  const insights = [];

  // 1. Profils masqués
  if ((kpis.workers_hidden || 0) > 0) {
    insights.push({
      id: "hidden_profiles",
      icon: "🔒",
      severity: kpis.workers_hidden > 10 ? "high" : "medium",
      title: "Profils masqués",
      description: `${kpis.workers_hidden} travailleur(s) inscrits n'ont pas rendu leur profil visible. Ils sont invisibles pour tous les employeurs.`,
      action: "Relancer par email pour activer la visibilité.",
      count: kpis.workers_hidden,
      segment: "workers_hidden",
      template: "visibility_initial",
      subject_fr: "Votre profil est prêt — rendez-le visible",
      subject_en: "Your profile is ready — make it visible",
    });
  }

  // 2. Profils incomplets
  if ((kpis.workers_incomplete || 0) > 0) {
    insights.push({
      id: "incomplete_profiles",
      icon: "⚠️",
      severity: kpis.workers_incomplete > 5 ? "medium" : "low",
      title: "Profils incomplets",
      description: `${kpis.workers_incomplete} profil(s) à moins de 60% de complétion. Un profil incomplet est moins attractif pour les employeurs.`,
      action: "Encourager les membres à ajouter leurs expériences, CV et langues.",
      count: kpis.workers_incomplete,
      segment: "workers_incomplete",
      template: "complete_profile",
      subject_fr: "Complétez votre profil pour être contacté",
      subject_en: "Complete your profile to be contacted",
    });
  }

  // 3. Employeurs sans offre
  if ((kpis.employers_without_offers || 0) > 0) {
    insights.push({
      id: "employers_no_offers",
      icon: "🏢",
      severity: kpis.employers_without_offers > 3 ? "high" : "medium",
      title: "Employeurs sans offre publiée",
      description: `${kpis.employers_without_offers} employeur(s) inscrit(s) n'ont pas encore publié de besoin. Leur espace est vide.`,
      action: "Inviter à publier leur première offre pour accéder aux profils.",
      count: kpis.employers_without_offers,
      segment: "employers_without_offers",
      template: "employer_publish_offer",
      subject_fr: "Publiez votre première recherche",
      subject_en: "Publish your first search",
    });
  }

  // 4. Travailleurs inactifs (>90j, profil non visible)
  if ((kpis.workers_inactive || 0) > 0) {
    insights.push({
      id: "inactive_workers",
      icon: "💤",
      severity: "medium",
      title: "Travailleurs inactifs",
      description: `${kpis.workers_inactive} travailleur(s) inactifs depuis plus de 90 jours sans profil visible.`,
      action: "Rappel doux pour les réengager.",
      count: kpis.workers_inactive,
      segment: "workers_inactive",
      template: "inactivity_reminder",
      subject_fr: "De nouvelles opportunités sont disponibles",
      subject_en: "New opportunities are available",
    });
  }

  // 5. Opportunité de croissance (référencement)
  if ((kpis.workers_visible || 0) >= 5) {
    insights.push({
      id: "referral_opportunity",
      icon: "🚀",
      severity: "low",
      title: "Opportunité de croissance",
      description: `${kpis.workers_visible} profils visibles prêts à recommander la plateforme. Activer le bouche-à-oreille.`,
      action: "Inviter les profils visibles à partager leur lien de référencement.",
      count: kpis.workers_visible,
      segment: "workers_visible",
      template: "referral_share",
      subject_fr: "Boostez votre visibilité en 1 geste",
      subject_en: "Boost your visibility in 1 step",
    });
  }

  return insights;
}

// ─── Coach IA — carte d'action ────────────────────────────────────────────────

function CoachCard({ insight, token, onViewSegment, onSent }) {
  const [phase, setPhase] = useState("idle"); // idle | confirming | sending | done | error
  const [result, setResult] = useState(null);

  const severityTheme = {
    high:   { bg: "#fff1f2", border: "#fca5a5", badgeBg: "#fee2e2", badgeText: "#b91c1c", badgeLabel: "Priorité haute" },
    medium: { bg: "#fffbeb", border: "#fcd34d", badgeBg: "#fef3c7", badgeText: "#92400e", badgeLabel: "À traiter"       },
    low:    { bg: "#f0fdf4", border: "#86efac", badgeBg: "#dcfce7", badgeText: "#166534", badgeLabel: "Opportunité"     },
  };
  const th = severityTheme[insight.severity] || severityTheme.medium;

  const sendEmail = async () => {
    setPhase("sending");
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          segment:  insight.segment,
          template: insight.template,
          subject:  insight.subject_fr,
          name:     `Coach IA — ${insight.title}`,
          locale:   "auto",
          dry_run:  false,
        }),
      });
      const json = await res.json();
      setResult(json);
      setPhase(json.error ? "error" : "done");
      if (!json.error && onSent) onSent();
    } catch (e) {
      setResult({ error: e.message });
      setPhase("error");
    }
  };

  return (
    <div style={{ background: th.bg, border: `1.5px solid ${th.border}`, borderRadius: 18, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ fontSize: 24, lineHeight: 1.2 }}>{insight.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#1E3A78", lineHeight: 1.3 }}>{insight.title}</div>
            <span style={{ display: "inline-block", marginTop: 5, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, background: th.badgeBg, color: th.badgeText }}>
              {th.badgeLabel}
            </span>
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#1E3A78", flexShrink: 0, lineHeight: 1 }}>{insight.count}</div>
      </div>

      {/* Description */}
      <p style={{ margin: 0, fontSize: 13, color: "#3d5470", lineHeight: 1.65 }}>{insight.description}</p>

      {/* Action recommandée */}
      <div style={{ background: "rgba(255,255,255,0.72)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Action recommandée</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E3A78" }}>{insight.action}</div>
        <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 3 }}>
          Objet FR : <em>{insight.subject_fr}</em>
        </div>
      </div>

      {/* ── IDLE ── */}
      {phase === "idle" && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            style={{ ...btn.base, ...btn.primary, flex: 1, justifyContent: "center", minWidth: 180 }}
            onClick={() => setPhase("confirming")}
          >
            👉 Envoyer l'email recommandé
          </button>
          <button
            style={{ ...btn.base, ...btn.ghost }}
            onClick={() => onViewSegment(insight.segment)}
          >
            👥 Voir le segment
          </button>
        </div>
      )}

      {/* ── CONFIRMING ── */}
      {phase === "confirming" && (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8eef8", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1E3A78" }}>Confirmer l'envoi ?</div>
          <div style={{ fontSize: 12, color: "#3d5470", lineHeight: 1.7 }}>
            Segment : <strong>{insight.segment}</strong> · <strong>{insight.count}</strong> contact(s)<br />
            Template : <strong>{TEMPLATES.find(t => t.id === insight.template)?.label || insight.template}</strong><br />
            Objet : <em>{insight.subject_fr}</em>
          </div>
          <div style={{ fontSize: 11, color: "#b91c1c", fontWeight: 600 }}>⚠️ Envoi réel — irréversible.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...btn.base, ...btn.danger, flex: 1, justifyContent: "center" }} onClick={sendEmail}>
              Oui, envoyer
            </button>
            <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setPhase("idle")}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── SENDING ── */}
      {phase === "sending" && (
        <div style={{ textAlign: "center", padding: "12px 0", color: "#1E3A78", fontSize: 13, fontWeight: 700 }}>
          ⏳ Envoi en cours…
        </div>
      )}

      {/* ── DONE ── */}
      {phase === "done" && result && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontWeight: 800, color: "#166534", fontSize: 14, marginBottom: 6 }}>✅ Campagne envoyée</div>
          <div style={{ fontSize: 13, color: "#3d5470" }}>
            <strong style={{ color: "#0d7c6e" }}>{result.sent ?? 0}</strong> envoyés &nbsp;·&nbsp;
            <strong style={{ color: "#92400e" }}>{result.skipped ?? 0}</strong> ignorés &nbsp;·&nbsp;
            <strong style={{ color: "#b91c1c" }}>{result.failed ?? 0}</strong> échecs
          </div>
          <button style={{ ...btn.base, ...btn.ghost, marginTop: 10, fontSize: 12 }} onClick={() => { setPhase("idle"); setResult(null); }}>
            ↩ Réinitialiser
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontWeight: 800, color: "#b91c1c", fontSize: 14, marginBottom: 6 }}>❌ Erreur lors de l'envoi</div>
          <div style={{ fontSize: 12, color: "#3d5470" }}>{result?.error || "Erreur inconnue"}</div>
          <button style={{ ...btn.base, ...btn.ghost, marginTop: 10, fontSize: 12 }} onClick={() => { setPhase("idle"); setResult(null); }}>
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ initialData }) {
  const data = initialData || {};

  // Session récupérée côté client
  // undefined = vérification en cours | null = non connecté | string = token actif
  const [token, setToken] = useState(undefined);
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setToken(session?.access_token ?? null);
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

  // ── Traffic state ───────────────────────────────────────────────────────────
  const [trafficData, setTrafficData]           = useState(null);   // null | { configured, pages, error }
  const [trafficLoading, setTrafficLoading]     = useState(false);

  const fetchTraffic = useCallback(async () => {
    if (!token) return;
    setTrafficLoading(true);
    try {
      const res  = await fetch("/api/admin/traffic", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setTrafficData(json);
    } catch (e) {
      setTrafficData({ configured: false, error: e.message, pages: [] });
    } finally {
      setTrafficLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "coach" && !trafficData) fetchTraffic();
  }, [activeTab, trafficData, fetchTraffic]);

  // ── History state ───────────────────────────────────────────────────────────
  const [campaigns, setCampaigns]             = useState([]);
  const [campaignsTotal, setCampaignsTotal]   = useState(0);
  const [campaignsPage, setCampaignsPage]     = useState(1);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError]   = useState(null);
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  // ── Fetch KPIs ──────────────────────────────────────────────────────────────

  const fetchKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      const [wRes, eRes, ovRes, ewRes] = await Promise.all([
        fetch("/api/admin/crm?segment=workers_all",            { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/crm?segment=employers_all",          { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/overview",                           { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/crm?segment=employers_without_offers", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [wData, eData, ovData, ewData] = await Promise.all([wRes.json(), eRes.json(), ovRes.json(), ewRes.json()]);
      const workers   = wData.contacts || [];
      const employers = eData.contacts || [];
      const now = Date.now();

      setKpis({
        workers_total:           workers.length,
        workers_visible:         workers.filter(w => w.visibility === "visible").length,
        workers_hidden:          workers.filter(w => w.visibility === "hidden").length,
        workers_incomplete:      workers.filter(w => (w.completion || 0) < 60).length,
        workers_inactive:        workers.filter(w =>
          now - new Date(w.created_at).getTime() > 90 * 86400000 && w.visibility !== "visible"
        ).length,
        employers_total:         employers.length,
        employers_without_offers:(ewData.contacts || []).length,
        unsubscribed:            wData.stats?.unsubscribed || 0,
        no_email:                wData.stats?.noEmail || 0,
        matches_total:           ovData.summary?.matches || 0,
        matches_new:             ovData.summary?.newMatches || 0,
        offers_published:        ovData.summary?.publishedOffers || 0,
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
    if (!token) return;
    setCampaignsLoading(true);
    setCampaignsError(null);
    try {
      const res  = await fetch(`/api/admin/campaigns?page=${page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setCampaigns(json.campaigns || []);
      setCampaignsTotal(json.total || 0);
      setCampaignsPage(page);
    } catch (e) {
      console.error(e);
      setCampaignsError(e.message);
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

  const [retryLoading, setRetryLoading] = useState(null); // campaign id en cours

  const retryFailures = async (campaign) => {
    if (!campaign.failures?.length) return;
    setRetryLoading(campaign.id);
    try {
      // Construire la liste des emails en échec
      const failedEmails = campaign.failures.map(f => f.email).filter(Boolean);

      // On passe les emails directement — l'API accepte contact_ids OU on crée
      // un envoi ciblé via le segment + filtre côté serveur
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          segment:      campaign.segment,
          template:     campaign.template,
          subject:      campaign.subject,
          name:         `Réessai — ${campaign.name}`,
          locale:       campaign.locale,
          dry_run:      false,
          retry_emails: failedEmails,
        }),
      });
      const json = await res.json();
      alert(`Réessai terminé : ${json.sent} envoyés, ${json.failed} échecs, ${json.skipped} ignorés.`);
      fetchCampaigns(campaignsPage);
    } catch (e) {
      alert("Erreur : " + e.message);
    } finally {
      setRetryLoading(null);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────

  // Vérification en cours
  if (token === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4fb", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#1E3A78" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>LEXPAT <span style={{ color: "#57B7AF" }}>CONNECT</span></div>
          <div style={{ fontSize: 13, color: "#8a9db8" }}>Chargement de la session…</div>
        </div>
      </div>
    );
  }

  // Pas de session active — afficher le formulaire de connexion
  if (token === null) {
    return <AdminLoginScreen />;
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
                  <KpiCard icon="🏢" label="Employeurs"        value={kpis.employers_total} color="#6b21a8" />
                  <KpiCard icon="🔕" label="Désinscrits email" value={kpis.unsubscribed}    color="#6b7280" />
                  <KpiCard icon="📭" label="Sans email"        value={kpis.no_email}        color="#6b7280" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Mise en relation</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                  <KpiCard icon="🤝" label="Matchings total"   value={kpis.matches_total}    color="#1E3A78" />
                  <KpiCard icon="✨" label="Nouveaux matchings" value={kpis.matches_new}      color="#0d7c6e" />
                  <KpiCard icon="📄" label="Offres publiées"   value={kpis.offers_published}  color="#6b21a8" />
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
            ONGLET COACH IA
        ════════════════════════════════════════════════════ */}
        {activeTab === "coach" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>Coach IA</h2>
              <p style={{ margin: 0, fontSize: 14, color: "#8a9db8", lineHeight: 1.6 }}>
                Diagnostics automatiques basés sur vos KPIs. Cliquez sur une action pour envoyer directement l'email ciblé — sans aller dans l'onglet Emailing.
              </p>
            </div>

            {kpisLoading ? (
              <div style={{ color: "#8a9db8", fontSize: 14 }}>Analyse en cours…</div>
            ) : !kpis ? (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "0 8px 8px 0", padding: "12px 16px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>
                Impossible de charger les données. Vérifiez votre connexion.
              </div>
            ) : (() => {
              const insights = deriveInsights(kpis);
              const problems = insights.filter(i => i.severity !== "low");
              const opportunities = insights.filter(i => i.severity === "low");
              return (
                <>
                  {/* Barre de synthèse */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ ...card, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 26 }}>🔴</span>
                      <div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: "#b91c1c", lineHeight: 1 }}>{problems.length}</div>
                        <div style={{ fontSize: 12, color: "#8a9db8", marginTop: 2 }}>Problème{problems.length > 1 ? "s" : ""} détecté{problems.length > 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div style={{ ...card, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 26 }}>🟢</span>
                      <div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: "#166534", lineHeight: 1 }}>{opportunities.length}</div>
                        <div style={{ fontSize: 12, color: "#8a9db8", marginTop: 2 }}>Opportunité{opportunities.length > 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <button style={{ ...btn.base, ...btn.ghost, marginLeft: "auto" }} onClick={fetchKpis}>
                      🔄 Rafraîchir le diagnostic
                    </button>
                  </div>

                  {insights.length === 0 ? (
                    <div style={{ ...card, textAlign: "center", padding: 56, color: "#0d7c6e" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#1E3A78", marginBottom: 6 }}>Tout semble en ordre</div>
                      <div style={{ fontSize: 13, color: "#8a9db8" }}>Aucune action prioritaire détectée pour l'instant.</div>
                    </div>
                  ) : (
                    <>
                      {problems.length > 0 && (
                        <>
                          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#b91c1c", textTransform: "uppercase", letterSpacing: 1 }}>
                            🔴 Problèmes à traiter ({problems.length})
                          </h3>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18, marginBottom: 32 }}>
                            {problems.map(insight => (
                              <CoachCard
                                key={insight.id}
                                insight={insight}
                                token={token}
                                onViewSegment={seg => { setSegment(seg); setActiveTab("contacts"); }}
                                onSent={fetchKpis}
                              />
                            ))}
                          </div>
                        </>
                      )}
                      {opportunities.length > 0 && (
                        <>
                          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: 1 }}>
                            🟢 Opportunités ({opportunities.length})
                          </h3>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18 }}>
                            {opportunities.map(insight => (
                              <CoachCard
                                key={insight.id}
                                insight={insight}
                                token={token}
                                onViewSegment={seg => { setSegment(seg); setActiveTab("contacts"); }}
                                onSent={fetchKpis}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              );
            })()}

            {/* ════ SECTION TRAFIC ════ */}
            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1E3A78" }}>📊 Coach IA — Optimisation trafic</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8a9db8" }}>Analyse page par page des 7 derniers jours via Vercel Analytics.</p>
                </div>
                <button style={{ ...btn.base, ...btn.ghost, fontSize: 12 }} onClick={fetchTraffic} disabled={trafficLoading}>
                  {trafficLoading ? "⏳" : "🔄"} Actualiser
                </button>
              </div>

              {trafficLoading ? (
                <div style={{ color: "#8a9db8", fontSize: 14 }}>Récupération des données trafic…</div>

              ) : !trafficData ? (
                <div style={{ color: "#8a9db8", fontSize: 14 }}>Cliquez sur Actualiser pour charger l'analyse trafic.</div>

              ) : !trafficData.configured ? (
                /* ── Non configuré ── */
                <div style={{ ...card, background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#92400e", marginBottom: 8 }}>⚙️ Configuration requise</div>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "#3d5470", lineHeight: 1.7 }}>
                    Pour activer l'analyse trafic, ajoutez ces variables dans votre fichier <code style={{ background: "#fef3c7", borderRadius: 4, padding: "1px 6px" }}>.env.local</code> :
                  </p>
                  <div style={{ background: "#1E3A78", borderRadius: 10, padding: "14px 18px", fontFamily: "monospace", fontSize: 12, color: "#93c5fd", lineHeight: 2 }}>
                    {(trafficData.missing || ["VERCEL_API_TOKEN", "VERCEL_PROJECT_ID"]).map(k => (
                      <div key={k}>{k}=<span style={{ color: "#fbbf24" }}>votre_valeur</span></div>
                    ))}
                    <div style={{ color: "#6b7280", marginTop: 4 }}># VERCEL_TEAM_ID=xxx  ← optionnel (compte équipe)</div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#8a9db8", lineHeight: 1.7 }}>
                    Trouvez votre <strong>VERCEL_API_TOKEN</strong> dans <em>vercel.com → Account → Tokens</em>.<br />
                    Trouvez votre <strong>VERCEL_PROJECT_ID</strong> dans <em>vercel.com → Projet → Settings → General</em>.
                  </div>
                </div>

              ) : trafficData.error && !trafficData.pages?.length ? (
                /* ── Erreur API ── */
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#b91c1c" }}>
                  ❌ Erreur Vercel API : {trafficData.error}
                </div>

              ) : (() => {
                const pages          = trafficData.pages || [];
                const trafficInsights = deriveTrafficInsights(pages);
                const totalVisitors   = trafficData.totalVisitors ?? pages.reduce((s, p) => s + p.visitors, 0);
                const siteUrl         = process.env.NEXT_PUBLIC_SITE_URL || "";

                return (
                  <>
                    {/* Mini stats bar */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
                      <div style={{ ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>👁️</span>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: "#1E3A78", lineHeight: 1 }}>{totalVisitors.toLocaleString("fr-BE")}</div>
                          <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>visiteurs totaux (7j)</div>
                        </div>
                      </div>
                      <div style={{ ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>📄</span>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: "#1E3A78", lineHeight: 1 }}>{pages.length}</div>
                          <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>pages surveillées</div>
                        </div>
                      </div>
                    </div>

                    {/* Mini tableau des pages */}
                    <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 24 }}>
                      <div style={{ padding: "12px 18px", background: "#f8faff", borderBottom: "1px solid #e8eef8", fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>
                        Pages surveillées
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                            {["Page", "Visiteurs (7j)", "Niveau"].map(h => (
                              <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...pages].sort((a, b) => b.visitors - a.visitors).map((p, i) => {
                            const lvl = classifyTraffic(p.visitors);
                            const lvlStyle = {
                              high:   { color: "#0d7c6e", bg: "#e6faf7" },
                              medium: { color: "#92400e", bg: "#fef3c7" },
                              low:    { color: "#6b7280", bg: "#f5f5f5" },
                            }[lvl];
                            return (
                              <tr key={p.path} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", borderBottom: "1px solid #f0f4fb" }}>
                                <td style={{ padding: "8px 16px" }}>
                                  <div style={{ fontWeight: 600, color: "#1E3A78" }}>{p.label}</div>
                                  <div style={{ fontSize: 11, color: "#8a9db8", fontFamily: "monospace" }}>{p.path}</div>
                                </td>
                                <td style={{ padding: "8px 16px", fontWeight: 900, fontSize: 16, color: "#1E3A78" }}>
                                  {p.visitors.toLocaleString("fr-BE")}
                                </td>
                                <td style={{ padding: "8px 16px" }}>
                                  <span style={{ display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, background: lvlStyle.bg, color: lvlStyle.color }}>
                                    {lvl === "high" ? "Élevé" : lvl === "medium" ? "Moyen" : "Faible"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Insights trafic */}
                    {trafficInsights.length === 0 ? (
                      <div style={{ ...card, textAlign: "center", padding: 36, color: "#8a9db8", fontSize: 13 }}>
                        Pas assez de données trafic pour générer des recommandations. Revenez dans quelques jours.
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>
                          Recommandations ({trafficInsights.length})
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                          {trafficInsights.map(ins => (
                            <TrafficCard key={ins.id} insight={ins} siteUrl={siteUrl} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
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
            ) : campaignsError ? (
              <Alert type="error">
                Erreur lors du chargement : {campaignsError}
                <button style={{ ...btn.base, ...btn.ghost, marginLeft: 16, fontSize: 12 }} onClick={() => fetchCampaigns(1)}>Réessayer</button>
              </Alert>
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
                        {["Nom", "Segment", "Template", "Envoyés", "Ignorés", "Échecs", "Mode", "Statut", "Date", ""].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => (
                        <React.Fragment key={c.id}>
                          <tr
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
                            <td style={{ padding: "10px 14px" }}>
                              {(c.failures?.length > 0 && !c.dry_run) && (
                                <button
                                  style={{ ...btn.base, ...btn.amber, fontSize: 12, padding: "5px 12px" }}
                                  disabled={retryLoading === c.id}
                                  onClick={e => { e.stopPropagation(); retryFailures(c); }}
                                >
                                  {retryLoading === c.id ? "⏳" : "🔁"} Réessayer ({c.failures.length})
                                </button>
                              )}
                            </td>
                          </tr>
                          {expandedCampaign === c.id && (
                            <tr>
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
                        </React.Fragment>
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
                <div style={{ fontSize: 11, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Aperçu de l'email</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#1E3A78", marginBottom: 4 }}>
                  {emailSubject || TEMPLATES.find(t => t.id === emailTemplate)?.[emailLocale === "en" ? "subject_en" : "subject_fr"] || "—"}
                </div>
                <div style={{ fontSize: 11, color: "#8a9db8" }}>Données fictives — destinataire : Marie Dupont</div>
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
