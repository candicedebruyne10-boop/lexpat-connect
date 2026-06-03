"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

// ─── Constantes ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",    label: "Vue d'ensemble",  icon: "📊" },
  { id: "coach",       label: "Coach IA",         icon: "🤖" },
  { id: "analytics",  label: "Analyse trafic",   icon: "📈" },
  { id: "prospection", label: "Prospection",      icon: "✨" },
  { id: "promo",       label: "Promo",            icon: "📣" },
  { id: "linkedin",   label: "Posts LinkedIn",     icon: "in" },
  { id: "security",   label: "Sécurité données", icon: "🔒" },
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

// ─── Analyse trafic manuelle ──────────────────────────────────────────────────

const ANALYTICS_PAGES = [
  { path: "/travailleurs/espace", label: "Espace travailleur" },
  { path: "/",                    label: "Accueil FR" },
  { path: "/travailleurs",        label: "Travailleurs" },
  { path: "/metiers-en-penurie",  label: "Métiers en pénurie" },
  { path: "/connexion",           label: "Connexion" },
  { path: "/inscription",         label: "Inscription" },
  { path: "/base-de-profils",     label: "Base de profils" },
  { path: "/employeurs",          label: "Employeurs" },
  { path: "/simulateur-eligibilite", label: "Simulateur" },
  { path: "/employeurs/liege-metiers-en-penurie", label: "Liège — Employeurs ⭐" },
];

function analyzeWeeklyTraffic(inputs) {
  const insights = [];
  const get = (path) => inputs.pages.find(p => p.path === path)?.visitors || 0;

  const home        = get("/");
  const travailleurs = get("/travailleurs");
  const employeurs  = get("/employeurs");
  const simulateur  = get("/simulateur-eligibilite");
  const connexion   = get("/connexion");
  const inscription = get("/inscription");
  const metiers     = get("/metiers-en-penurie");
  const liege       = get("/employeurs/liege-metiers-en-penurie");
  const espace      = get("/travailleurs/espace");
  const total       = inputs.totalVisitors || inputs.pages.reduce((s, p) => s + p.visitors, 0);
  const mobile      = inputs.mobilePercent;
  const belgium     = inputs.belgiumPercent;

  // 1. Déséquilibre employeurs
  if (travailleurs > 10 && employeurs === 0) {
    insights.push({ type: "alerte", icon: "⚖️",
      title: "Aucun employeur sur le site cette semaine",
      text: `La page /employeurs n'a reçu aucune visite alors que /travailleurs en a eu ${travailleurs}. La plateforme est déséquilibrée : trop de candidats, pas assez de recruteurs.`,
      action: "Envoyer l'email Coach IA 'Employeur sans offre' + publier un post LinkedIn ciblé RH belge" });
  } else if (travailleurs > 0 && employeurs > 0 && travailleurs / employeurs > 4) {
    const ratio = Math.round(travailleurs / employeurs);
    insights.push({ type: "alerte", icon: "⚖️",
      title: `Déséquilibre ${ratio}× : travailleurs vs employeurs`,
      text: `${travailleurs} visites travailleurs pour ${employeurs} visites employeurs. Pour que la plateforme fonctionne, les deux côtés doivent progresser ensemble.`,
      action: "Activer une campagne email + LinkedIn ciblée recruteurs belges" });
  }

  // 2. Intent d'inscription fort
  if (connexion + inscription >= 20) {
    insights.push({ type: "opportunite", icon: "🔑",
      title: "Fort intent d'inscription",
      text: `${connexion + inscription} visites combinées sur /connexion et /inscription — les gens veulent utiliser la plateforme. Un bug ou une friction mobile peut les faire partir.`,
      action: "Tester le parcours inscription complet sur iPhone cette semaine" });
  }

  // 3. Espace travailleur > page travailleurs
  if (espace > 0 && espace >= travailleurs) {
    insights.push({ type: "info", icon: "🔄",
      title: "Les membres reviennent plus que les nouveaux n'arrivent",
      text: `${espace} visites sur l'espace vs ${travailleurs} sur la page d'acquisition. La rétention est bonne mais l'acquisition ralentit.`,
      action: "Publier du contenu pour attirer de nouveaux travailleurs (post, article, SEO)" });
  }

  // 4. Simulateur
  if (simulateur >= 20) {
    insights.push({ type: "opportunite", icon: "🧮",
      title: "Le simulateur génère du trafic qualifié",
      text: `${simulateur} visites — ces visiteurs ont une intention claire. Assurez-vous que le CTA après les résultats pousse vers le formulaire employeur ou travailleur.`,
      action: "Vérifier et renforcer le CTA post-simulateur" });
  } else if (simulateur > 0 && simulateur < 10) {
    insights.push({ type: "alerte", icon: "🧮",
      title: "Simulateur sous-utilisé",
      text: `Seulement ${simulateur} visites sur votre outil différenciateur. Mettez-le plus en avant sur la homepage et dans le menu.`,
      action: "Ajouter le simulateur dans la navigation principale" });
  }

  // 5. Mobile
  if (mobile >= 50) {
    insights.push({ type: "info", icon: "📱",
      title: `${mobile}% des visiteurs sont sur mobile`,
      text: "La majorité navigue sur téléphone. Un formulaire mal adapté ou un bouton trop petit peut bloquer des inscriptions.",
      action: "Faire un test complet mobile (formulaires, navigation, CTA) cette semaine" });
  }

  // 6. Trafic international
  if (belgium > 0 && belgium < 40) {
    insights.push({ type: "info", icon: "🌍",
      title: `${100 - belgium}% de trafic hors Belgique`,
      text: "Votre audience est majoritairement internationale — probablement des travailleurs cherchant des opportunités. La page EN /en/travailleurs est cruciale.",
      action: "Optimiser /en/travailleurs et vérifier que le formulaire EN fonctionne" });
  }

  // 7. Liège
  if (liege >= 8) {
    insights.push({ type: "opportunite", icon: "📍",
      title: "La page Liège fonctionne — dupliquez le modèle",
      text: `${liege} visites sur la page Liège. L'approche géolocalisée attire des employeurs locaux qualifiés.`,
      action: "Créer /employeurs/bruxelles-metiers-en-penurie et /employeurs/gand-metiers-en-penurie" });
  }

  // 8. Métiers en pénurie SEO
  if (metiers >= 30) {
    insights.push({ type: "opportunite", icon: "🔍",
      title: "La page métiers en pénurie performe",
      text: `${metiers} visites — c'est votre meilleur aimant SEO. Les visiteurs cherchent activement cette information.`,
      action: "Enrichir le contenu avec des données régionales plus détaillées pour progresser en SEO" });
  }

  // 9. Trafic global faible
  if (total > 0 && total < 100) {
    insights.push({ type: "info", icon: "📈",
      title: "Phase de lancement — trafic en construction",
      text: `${total} visiteurs cette semaine. C'est normal pour un MVP actif. 1 action de distribution ciblée par semaine suffit pour progresser régulièrement.`,
      action: "Choisir 1 action cette semaine : post LinkedIn, email, ou article de blog" });
  }

  return insights;
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
  const [mode, setMode]         = useState("magic"); // "password" | "magic"

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
                <div style={{ marginBottom: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#15803d", lineHeight: 1.6 }}>
                  ✅ <strong>Mode recommandé.</strong> Un lien de connexion à usage unique sera envoyé à votre adresse email. Plus sûr qu'un mot de passe.
                </div>
              )}
              {mode === "password" && (
                <div style={{ marginBottom: 8, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                  ⚠️ Préférez le <strong>Lien magique</strong> pour une connexion plus sécurisée.
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

// Emails autorisés à accéder au back-office (vérification côté client en complément du check serveur)
const ADMIN_EMAILS = ["lexpat@lexpat.be", "contact@lexpat-connect.be"];

function AdminForbiddenScreen({ email }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4fb", fontFamily: "Arial, sans-serif", padding: "32px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#1E3A78", marginBottom: 8 }}>Accès refusé</div>
      <div style={{ fontSize: 14, color: "#5d6e83", maxWidth: 340, lineHeight: 1.7, marginBottom: 24 }}>
        Le compte <strong>{email}</strong> n'est pas autorisé à accéder à cette interface.
      </div>
      <a href="/" style={{ padding: "12px 24px", borderRadius: 10, background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
        Retour à l'accueil
      </a>
    </div>
  );
}

export default function AdminDashboard({ initialData }) {
  void initialData; // data is now fetched client-side via auth-protected API routes

  // Session récupérée côté client
  // undefined = vérification en cours | null = non connecté | string = token actif
  const [token, setToken] = useState(undefined);
  useEffect(() => {
    let subscription;
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession()
        .then(({ data }) => {
          setToken(data?.session?.access_token ?? null);
        })
        .catch(() => setToken(null));
      const { data } = supabase.auth.onAuthStateChange((_e, session) => {
        setToken(session?.access_token ?? null);
      });
      subscription = data?.subscription;
    } catch {
      setToken(null);
    }
    return () => { try { subscription?.unsubscribe(); } catch {} };
  }, []);

  // undefined = vérification en cours | null = non connecté/inconnu | string = email chargé
  const [userEmail, setUserEmail] = useState(undefined);

  useEffect(() => {
    // token === undefined : auth pas encore connue, on attend
    if (token === undefined) return;
    // token === null : pas connecté, on passe userEmail à null pour débloquer le guard
    if (token === null) { setUserEmail(null); return; }
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || null));
  }, [token]);

  const [activeTab, setActiveTab] = useState("overview");
  const [prospectionTab, setProspectionTab] = useState("contacts"); // "contacts" | "emailing"

  // ── Overview state ──────────────────────────────────────────────────────────
  const [kpis, setKpis]               = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  // ── Operations state (full lists from /api/admin/overview) ─────────────────
  const [opData, setOpData] = useState({ jobOffers: [], workers: [], matchings: [] });

  // ── Contacts state ──────────────────────────────────────────────────────────
  const [segment, setSegment]             = useState("workers_all");
  const [contacts, setContacts]           = useState([]);
  const [contactStats, setContactStats]   = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [selectedIds, setSelectedIds]     = useState(new Set());
  const [search, setSearch]               = useState("");

  // ── Studio IA state ─────────────────────────────────────────────────────────
  const [aiStudioMode, setAiStudioMode]       = useState("email"); // "email" | "post"
  const [aiEmailPrompt, setAiEmailPrompt]     = useState("");
  const [aiEmailAudience, setAiEmailAudience] = useState("employer");
  const [aiEmailLocale, setAiEmailLocale]     = useState("fr");
  const [aiEmailTo, setAiEmailTo]             = useState("");
  const [aiEmailLoading, setAiEmailLoading]   = useState(false);
  const [aiEmailResult, setAiEmailResult]     = useState(null);
  const [aiEmailError, setAiEmailError]       = useState(null);
  const [aiPostNetwork, setAiPostNetwork]     = useState("linkedin");
  const [aiPostTone, setAiPostTone]           = useState("expert");
  const [aiPostResult, setAiPostResult]       = useState(null);
  const [aiPostTextEdit, setAiPostTextEdit]   = useState("");
  const [aiEmailHistory, setAiEmailHistory]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("lexpat_studio_history") || "[]"); }
    catch { return []; }
  });
  const [copiedField, setCopiedField]         = useState(null);
  const [aiEmailSubjectEdit, setAiEmailSubjectEdit] = useState("");
  const [aiEmailBodyEdit, setAiEmailBodyEdit]       = useState("");

  async function generateAiEmail() {
    if (!aiEmailPrompt.trim()) return;
    setAiEmailLoading(true);
    setAiEmailError(null);
    setAiEmailResult(null);
    setAiPostResult(null);
    try {
      const res = await fetch("/api/admin/emails/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: aiEmailPrompt, audience: aiEmailAudience, locale: aiEmailLocale }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur génération");
      setAiEmailResult(json);
      setAiEmailSubjectEdit(json.subject || "");
      setAiEmailBodyEdit(json.body || "");
      const entry = {
        id: Date.now(), type: "email", createdAt: new Date().toISOString(),
        prompt: aiEmailPrompt, audience: aiEmailAudience, locale: aiEmailLocale,
        subject: json.subject, body: json.body, mode: json.mode,
      };
      const updated = [entry, ...aiEmailHistory].slice(0, 30);
      setAiEmailHistory(updated);
      try { localStorage.setItem("lexpat_studio_history", JSON.stringify(updated)); } catch {}
    } catch (err) {
      setAiEmailError(err.message);
    } finally {
      setAiEmailLoading(false);
    }
  }

  async function generateAiPost() {
    if (!aiEmailPrompt.trim()) return;
    setAiEmailLoading(true);
    setAiEmailError(null);
    setAiEmailResult(null);
    setAiPostResult(null);
    try {
      const res = await fetch("/api/admin/linkedin/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topic: aiEmailPrompt,
          audience: aiEmailAudience === "employer" ? "Employeurs belges" : aiEmailAudience === "worker" ? "Travailleurs internationaux" : "Professionnels RH et droit de l'immigration",
          tone: aiPostTone === "expert" ? "Expert et pédagogique" : aiPostTone === "human" ? "Humain et proche" : aiPostTone === "impactful" ? "Percutant et direct" : "Storytelling",
          network: aiPostNetwork,
          locale: aiEmailLocale,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur génération");
      setAiPostResult(json);
      setAiPostTextEdit(json.text || "");
      const entry = {
        id: Date.now(), type: "post", network: aiPostNetwork, createdAt: new Date().toISOString(),
        prompt: aiEmailPrompt, locale: aiEmailLocale, tone: aiPostTone,
        text: json.text, mode: json.mode,
      };
      const updated = [entry, ...aiEmailHistory].slice(0, 30);
      setAiEmailHistory(updated);
      try { localStorage.setItem("lexpat_studio_history", JSON.stringify(updated)); } catch {}
    } catch (err) {
      setAiEmailError(err.message);
    } finally {
      setAiEmailLoading(false);
    }
  }

  function copyToClipboard(text, field) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  }

  // ── Coach stratégie state ───────────────────────────────────────────────────
  const [strategy, setStrategy]           = useState(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyError, setStrategyError] = useState(null);

  const fetchStrategy = useCallback(async () => {
    if (!token) return;
    setStrategyLoading(true);
    setStrategyError(null);
    try {
      const res = await fetch("/api/admin/coach/strategy", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur stratégie");
      setStrategy(data);
    } catch (e) {
      setStrategyError(e.message);
    } finally {
      setStrategyLoading(false);
    }
  }, [token]);

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
  const [emailWizardStep, setEmailWizardStep] = useState(0); // 0 = mode classique, 1-4 = wizard guidé

  // ── Promo state ────────────────────────────────────────────────────────────
  const [promoCopied, setPromoCopied]   = useState(null);
  const [utmSource, setUtmSource]       = useState("linkedin");
  const [utmMedium, setUtmMedium]       = useState("social");
  const [utmCampaign, setUtmCampaign]   = useState("prospection-2026");
  const [utmPage, setUtmPage]           = useState("/employeurs");
  const promoBase = "https://lexpat-connect.be";
  function buildUtm() {
    const params = new URLSearchParams({ utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign });
    return `${promoBase}${utmPage}?${params.toString()}`;
  }
  function copyPromo(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setPromoCopied(key);
      setTimeout(() => setPromoCopied(null), 2000);
    });
  }

  // ── LinkedIn Ads state ─────────────────────────────────────────────────────
  const [linkedinStatus, setLinkedinStatus] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinError, setLinkedinError] = useState(null);
  const [linkedinActionLoading, setLinkedinActionLoading] = useState(false);
  const [linkedinBuilder, setLinkedinBuilder] = useState({
    accountId: "",
    accountCurrency: "EUR",
    campaignGroupName: "",
    campaignName: "",
    campaignType: "SPONSORED_UPDATES",
    objectiveType: "WEBSITE_VISITS",
    costType: "CPC",
    dailyBudget: "",
    totalBudget: "",
    localeCountry: "BE",
    localeLanguage: "fr",
    locationUrns: "",
    interfaceLocaleUrns: "urn:li:locale:fr_FR",
    companyUrns: "",
    associatedEntity: "",
    startAt: "",
    endAt: "",
    status: "DRAFT",
    campaignGroupStatus: "DRAFT",
  });
  const [linkedinCampaignLoading, setLinkedinCampaignLoading] = useState(false);
  const [linkedinCampaignResult, setLinkedinCampaignResult] = useState(null);
  const [linkedinPostForm, setLinkedinPostForm] = useState({
    topic: "",
    audience: "",
    offer: "",
    tone: "expert",
    keywords: "",
    cta: "",
    author: "",
    commentary: "",
    imageDataUrl: "https://lexpat-connect.be/og-image.jpg",
    imageFileName: "og-image-lexpat-connect.jpg",
    articleUrl: "",
    articleTitle: "",
    articleDescription: "",
  });
  const [linkedinPostLoading, setLinkedinPostLoading] = useState(false);
  const [linkedinPostResult, setLinkedinPostResult] = useState(null);
  const [linkedinImageLoading, setLinkedinImageLoading] = useState(false);
  const [linkedinPostHistory, setLinkedinPostHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lexpat_linkedin_posts") || "[]"); }
    catch { return []; }
  });
  const [showLinkedinHistory, setShowLinkedinHistory] = useState(false);

  // ── Analytics tab state ─────────────────────────────────────────────────────
  const [analyticsInputs, setAnalyticsInputs] = useState({
    totalVisitors: "",
    mobilePercent: "",
    belgiumPercent: "",
    topReferrer: "",
    pages: ANALYTICS_PAGES.map(p => ({ ...p, visitors: "" })),
  });
  const [analyticsReport, setAnalyticsReport] = useState(null);
  const [analyticsHistory, setAnalyticsHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lexpat_analytics_history") || "[]"); }
    catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [csvError, setCsvError] = useState(null);

  function updateAnalyticsPage(path, value) {
    setAnalyticsInputs(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.path === path ? { ...p, visitors: value } : p),
    }));
  }

  // Parse a Vercel Analytics CSV export and fill the form
  function handleCsvImport(e) {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) throw new Error("Fichier vide ou invalide.");

        // Detect header columns (case-insensitive)
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/^"|"$/g, ""));
        const pathCol  = headers.findIndex(h => ["pathname","path","page","url"].includes(h));
        const visCol   = headers.findIndex(h => ["visitors","unique visitors","unique_visitors","users","sessions"].includes(h));
        if (pathCol === -1 || visCol === -1) throw new Error(`Colonnes non reconnues. En-têtes trouvés : ${headers.join(", ")}`);

        const newPages = [...analyticsInputs.pages];
        let matched = 0;
        for (let i = 1; i < lines.length; i++) {
          // Handle quoted CSV fields
          const cols = lines[i].match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || lines[i].split(",");
          const path = (cols[pathCol] || "").trim().replace(/^"|"$/g, "");
          const vis  = parseInt((cols[visCol] || "").trim().replace(/^"|"$/g, "")) || 0;
          const idx  = newPages.findIndex(p => p.path === path || p.path === "/" + path.replace(/^\//, ""));
          if (idx !== -1) { newPages[idx] = { ...newPages[idx], visitors: String(vis) }; matched++; }
        }
        if (matched === 0) throw new Error("Aucune page reconnue dans le fichier. Vérifiez que le CSV contient bien les URLs de votre site.");
        setAnalyticsInputs(prev => ({ ...prev, pages: newPages }));
        setCsvError(`✅ ${matched} page${matched > 1 ? "s" : ""} importée${matched > 1 ? "s" : ""} depuis le CSV.`);
      } catch (err) {
        setCsvError("❌ " + err.message);
      }
      e.target.value = ""; // reset input
    };
    reader.readAsText(file);
  }

  function runAnalysis() {
    const parsed = {
      totalVisitors: parseInt(analyticsInputs.totalVisitors) || 0,
      mobilePercent: parseInt(analyticsInputs.mobilePercent) || 0,
      belgiumPercent: parseInt(analyticsInputs.belgiumPercent) || 0,
      topReferrer: analyticsInputs.topReferrer,
      pages: analyticsInputs.pages.map(p => ({ ...p, visitors: parseInt(p.visitors) || 0 })),
    };
    if (!parsed.totalVisitors) {
      parsed.totalVisitors = parsed.pages.reduce((s, p) => s + p.visitors, 0);
    }
    const report = { inputs: parsed, insights: analyzeWeeklyTraffic(parsed), generatedAt: new Date().toISOString() };
    setAnalyticsReport(report);
    // Save to history (max 20 entries)
    setAnalyticsHistory(prev => {
      const updated = [report, ...prev].slice(0, 20);
      try { localStorage.setItem("lexpat_analytics_history", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  function loadFromHistory(entry) {
    setAnalyticsInputs({
      totalVisitors: String(entry.inputs.totalVisitors || ""),
      mobilePercent: String(entry.inputs.mobilePercent || ""),
      belgiumPercent: String(entry.inputs.belgiumPercent || ""),
      topReferrer: entry.inputs.topReferrer || "",
      pages: ANALYTICS_PAGES.map(p => {
        const found = entry.inputs.pages.find(ep => ep.path === p.path);
        return { ...p, visitors: found ? String(found.visitors) : "" };
      }),
    });
    setAnalyticsReport(entry);
    setShowHistory(false);
  }

  function deleteHistoryEntry(idx) {
    setAnalyticsHistory(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      try { localStorage.setItem("lexpat_analytics_history", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

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

  // ── Sécurité données state ───────────────────────────────────────────────────
  const [securityData,    setSecurityData]    = useState(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError,   setSecurityError]   = useState(null);

  // ── Email individuel state ───────────────────────────────────────────────────
  const [soloEmail,     setSoloEmail]     = useState("");
  const [soloPrenom,    setSoloPrenom]    = useState("");
  const [soloSociete,   setSoloSociete]   = useState("");
  const [soloSubject,   setSoloSubject]   = useState("");
  const [soloBody,      setSoloBody]      = useState("");
  const [soloSending,   setSoloSending]   = useState(false);
  const [soloResult,    setSoloResult]    = useState(null);
  const soloBodyRef                       = useRef(null);

  const sendSoloEmail = async () => {
    if (!soloEmail || !soloSubject || !soloBody) return;
    setSoloSending(true); setSoloResult(null);
    try {
      const res = await fetch("/api/admin/campaigns/solo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: soloEmail, prenom: soloPrenom, societe: soloSociete, subject: soloSubject, body: soloBody }),
      });
      const json = await res.json();
      setSoloResult(json);
      if (json.ok) { setSoloEmail(""); setSoloPrenom(""); setSoloSociete(""); setSoloSubject(""); setSoloBody(""); }
    } catch (err) {
      setSoloResult({ error: err.message });
    } finally {
      setSoloSending(false);
    }
  };

  // ── CSV Campaign state ───────────────────────────────────────────────────────
  const [csvFile, setCsvFile]               = useState(null);
  const [csvContacts, setCsvContacts]       = useState([]);
  const [csvParseError, setCsvParseError]   = useState(null);
  const [csvSubject, setCsvSubject]         = useState("");
  const [csvBody, setCsvBody]               = useState("");
  const [csvCampaignName, setCsvCampaignName] = useState("");
  const [csvSending, setCsvSending]         = useState(false);
  const [csvResult, setCsvResult]           = useState(null);
  const [csvBatchSize, setCsvBatchSize]     = useState(30);
  const [csvBatchOffset, setCsvBatchOffset] = useState(0);
  const [csvCampaignId, setCsvCampaignId]   = useState(null);
  const [csvOpens, setCsvOpens]             = useState(null);
  const [csvOpensLoading, setCsvOpensLoading] = useState(false);
  const csvBodyRef                          = useRef(null);

  // Parse CSV client-side for preview
  const handleCsvFile = (file) => {
    setCsvFile(file);
    setCsvResult(null);
    setCsvParseError(null);
    if (!file) { setCsvContacts([]); setCsvBatchOffset(0); return; }
    setCsvBatchOffset(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Strip UTF-8 BOM if present (Excel exports)
        const raw = e.target.result.replace(/^\uFEFF/, "");
        const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
        if (!lines.length) { setCsvContacts([]); return; }

        // Auto-detect delimiter (comma vs semicolon vs tab) from first line
        const firstLine = lines[0];
        const counts = { ",": 0, ";": 0, "\t": 0 };
        let inQ = false;
        for (const ch of firstLine) {
          if (ch === '"') inQ = !inQ;
          else if (!inQ && counts[ch] !== undefined) counts[ch]++;
        }
        const sep = counts[";"] > counts[","] && counts[";"] > counts["\t"] ? ";"
          : counts["\t"] > counts[","] ? "\t"
          : ",";

        const parseLine = (line) => {
          const result = []; let cur = ""; let inQ2 = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { if (inQ2 && line[i+1]==='"'){cur+='"';i++;}else inQ2=!inQ2; }
            else if (ch === sep && !inQ2) { result.push(cur.trim()); cur = ""; }
            else cur += ch;
          }
          result.push(cur.trim()); return result;
        };
        const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g," ").trim());
        const colIndex = (...aliases) => { for(let i=0;i<headers.length;i++){if(aliases.some(a=>a.toLowerCase().replace(/\s+/g," ").trim()===headers[i]))return i;} return -1; };
        const iPrenom  = colIndex("prénom","prenom","first name");
        const iNom     = colIndex("nom de famille","nom","last name");
        const iEmail   = colIndex("e-mail 1","email 1","email","e-mail","mail");
        const iSociete = colIndex("société","societe","company","entreprise");
        const iVille   = colIndex("adresse 1 - ville","ville","city");
        const parsed = [];
        for (let r = 1; r < lines.length; r++) {
          const line = lines[r].trim(); if (!line) continue;
          const cols = parseLine(line);
          const get = (idx) => idx >= 0 ? (cols[idx]||"").trim() : "";
          const email = get(iEmail);
          if (!email || !email.includes("@")) continue;
          parsed.push({ email, prenom: get(iPrenom), nom: get(iNom), societe: get(iSociete), ville: get(iVille) });
        }
        if (!parsed.length) setCsvParseError("Aucun email valide trouvé. Vérifiez que la colonne « E-mail 1 » est présente.");
        else setCsvContacts(parsed);
      } catch (err) { setCsvParseError("Erreur de lecture du fichier : " + err.message); }
    };
    reader.readAsText(file, "utf-8");
  };

  const sendCsvCampaign = async (isDryRun, offsetOverride) => {
    if (!csvFile || !csvSubject || !csvBody) return;
    const offset = offsetOverride !== undefined ? offsetOverride : csvBatchOffset;
    setCsvSending(true); setCsvResult(null); setCsvOpens(null);
    try {
      const fd = new FormData();
      fd.append("csv", csvFile);
      fd.append("subject", csvSubject);
      fd.append("body", csvBody);
      fd.append("name", csvCampaignName);
      fd.append("dry_run", isDryRun ? "true" : "false");
      fd.append("locale", "fr");
      fd.append("batch_size",   String(csvBatchSize));
      fd.append("batch_offset", String(offset));
      const res = await fetch("/api/admin/campaigns/csv", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      setCsvResult(json);
      if (!isDryRun && json.ok) {
        setCsvCampaignId(json.campaign_id || null);
        // Avancer l'offset pour le prochain lot
        const nextOffset = offset + csvBatchSize;
        if (nextOffset < csvContacts.length) {
          setCsvBatchOffset(nextOffset);
        } else {
          setCsvBatchOffset(0); // tout envoyé — reset
        }
        fetchCampaigns(1);
      }
    } catch (err) {
      setCsvResult({ error: err.message });
    } finally {
      setCsvSending(false);
    }
  };

  const fetchCsvOpens = async (campaignId) => {
    if (!campaignId || !token) return;
    setCsvOpensLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/opens?campaign_id=${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCsvOpens(json.opens || []);
    } catch {
      setCsvOpens([]);
    } finally {
      setCsvOpensLoading(false);
    }
  };

  // ── Fetch KPIs ──────────────────────────────────────────────────────────────

  const fetchKpis = useCallback(async () => {
    if (!token) return;   // attendre que l'auth soit résolue avant tout appel API
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

      // Store full lists for the Operations tab
      setOpData({
        jobOffers: ovData.offers    || [],
        workers:   ovData.workers   || [],
        matchings: ovData.matches   || [],
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
    if (!token) return;
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
    if (activeTab === "prospection" && prospectionTab === "contacts") fetchContacts(segment);
  }, [activeTab, prospectionTab, segment, fetchContacts]);

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

  // ── Sécurité données ───────────────────────────────────────────────────────

  const fetchSecurityStatus = useCallback(async () => {
    if (!token) return;
    setSecurityLoading(true);
    setSecurityError(null);
    try {
      const res = await fetch("/api/admin/security", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setSecurityData(json);
    } catch (err) {
      setSecurityError(err.message);
    } finally {
      setSecurityLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "security" && !securityData) fetchSecurityStatus();
  }, [activeTab, securityData, fetchSecurityStatus]);

  // ── LinkedIn status ────────────────────────────────────────────────────────

  const fetchLinkedinStatus = useCallback(async () => {
    if (!token) return;
    setLinkedinLoading(true);
    setLinkedinError(null);
    try {
      const res = await fetch("/api/admin/linkedin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinStatus(json);
    } catch (e) {
      setLinkedinError(e.message);
    } finally {
      setLinkedinLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "linkedin") fetchLinkedinStatus();
  }, [activeTab, fetchLinkedinStatus]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const connected = url.searchParams.get("linkedin_connected");
    const error = url.searchParams.get("linkedin_error");
    if (!connected && !error) return;

    setActiveTab("linkedin");
    if (connected) {
      fetchLinkedinStatus();
    }
    if (error) {
      setLinkedinError(decodeURIComponent(error));
    }

    url.searchParams.delete("linkedin_connected");
    url.searchParams.delete("linkedin_accounts");
    url.searchParams.delete("linkedin_error");
    window.history.replaceState({}, "", url.toString());
  }, [fetchLinkedinStatus]);

  const connectLinkedin = async () => {
    setLinkedinActionLoading(true);
    setLinkedinError(null);
    try {
      const res = await fetch("/api/admin/linkedin/connect", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      window.location.href = json.authUrl;
    } catch (e) {
      setLinkedinError(e.message);
      setLinkedinActionLoading(false);
    }
  };

  const disconnectLinkedin = async () => {
    setLinkedinActionLoading(true);
    setLinkedinError(null);
    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinStatus({ connected: false });
    } catch (e) {
      setLinkedinError(e.message);
    } finally {
      setLinkedinActionLoading(false);
    }
  };

  useEffect(() => {
    const accounts = linkedinStatus?.connection?.account_snapshot || [];
    if (!accounts.length) return;

    setLinkedinBuilder((prev) => {
      const current = accounts.find((account) => account.accountId === prev.accountId);
      if (current) {
        return {
          ...prev,
          accountCurrency: current.currency || prev.accountCurrency || "EUR",
        };
      }

      return {
        ...prev,
        accountId: accounts[0].accountId || "",
        accountCurrency: accounts[0].currency || prev.accountCurrency || "EUR",
      };
    });
  }, [linkedinStatus]);

  useEffect(() => {
    const connection = linkedinStatus?.connection;
    if (!connection) return;
    setLinkedinPostForm((prev) => {
      if (prev.author) return prev;
      return {
        ...prev,
        author:
          connection.organization_snapshot?.[0]?.urn ||
          connection.member_urn ||
          "",
      };
    });
  }, [linkedinStatus]);

  const createLinkedinDraftCampaign = async () => {
    setLinkedinCampaignLoading(true);
    setLinkedinCampaignResult(null);
    setLinkedinError(null);
    try {
      const res = await fetch("/api/admin/linkedin/campaigns", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkedinBuilder),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinCampaignResult(json);
      fetchLinkedinStatus();
    } catch (e) {
      setLinkedinCampaignResult({ error: e.message });
    } finally {
      setLinkedinCampaignLoading(false);
    }
  };

  const generateLinkedinPost = async () => {
    setLinkedinPostLoading(true);
    setLinkedinPostResult(null);
    try {
      const res = await fetch("/api/admin/linkedin/posts/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkedinPostForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinPostForm((prev) => ({ ...prev, commentary: json.text || "" }));
      setLinkedinPostResult({ mode: json.mode, generated: true });
    } catch (e) {
      setLinkedinPostResult({ error: e.message });
    } finally {
      setLinkedinPostLoading(false);
    }
  };

  const publishLinkedinPost = async () => {
    setLinkedinPostLoading(true);
    setLinkedinPostResult(null);
    try {
      const res = await fetch("/api/admin/linkedin/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: linkedinPostForm.author,
          commentary: linkedinPostForm.commentary,
          ...(linkedinPostForm.imageDataUrl ? { imageDataUrl: linkedinPostForm.imageDataUrl } : {}),
          ...(linkedinPostForm.articleUrl?.trim() && !linkedinPostForm.imageDataUrl ? {
            articleUrl: linkedinPostForm.articleUrl.trim(),
            articleTitle: linkedinPostForm.articleTitle?.trim() || "",
            articleDescription: linkedinPostForm.articleDescription?.trim() || "",
          } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinPostResult({ ok: true, postId: json.postId });
      // Save to local history
      const entry = {
        id: json.postId || `local-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        commentary: linkedinPostForm.commentary,
        author: linkedinPostForm.author,
        hasImage: !!linkedinPostForm.imageDataUrl,
        articleUrl: linkedinPostForm.articleUrl || null,
        imageDataUrl: linkedinPostForm.imageDataUrl || null,
      };
      setLinkedinPostHistory(prev => {
        const updated = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem("lexpat_linkedin_posts", JSON.stringify(updated)); } catch {}
        return updated;
      });
    } catch (e) {
      setLinkedinPostResult({ error: e.message });
    } finally {
      setLinkedinPostLoading(false);
    }
  };

  // ── Génération image LinkedIn via DALL-E ────────────────────────────────────
  const generateLinkedinImage = async () => {
    setLinkedinImageLoading(true);
    setLinkedinPostResult(null);
    try {
      const res = await fetch("/api/admin/linkedin/generate-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: linkedinPostForm.topic,
          tone: linkedinPostForm.tone,
          audience: linkedinPostForm.audience,
          commentary: linkedinPostForm.commentary,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      setLinkedinPostForm((prev) => ({
        ...prev,
        imageDataUrl: json.dataUrl,
        imageFileName: "image-linkedin-ia.png",
        articleUrl: "",
      }));
      setLinkedinPostResult({ generated: true, mode: "image-ai" });
    } catch (e) {
      setLinkedinPostResult({ error: `Image IA : ${e.message}` });
    } finally {
      setLinkedinImageLoading(false);
    }
  };

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
    setActiveTab("prospection");
    setProspectionTab("emailing");
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

  // Operations tab data — populated by fetchKpis from /api/admin/overview
  const data = opData;

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

  // Email en cours de récupération (token présent mais userEmail pas encore chargé)
  if (userEmail === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4fb", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#1E3A78" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>LEXPAT <span style={{ color: "#57B7AF" }}>CONNECT</span></div>
          <div style={{ fontSize: 13, color: "#8a9db8" }}>Vérification des droits d'accès…</div>
        </div>
      </div>
    );
  }

  // Email déterminé mais non autorisé (ou inconnu)
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return <AdminForbiddenScreen email={userEmail || "inconnu"} />;
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
                  <KpiCard icon="💤" label="Inactifs (90j)"   value={kpis.workers_inactive}   color="#6b7280" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Employeurs & plateforme</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
                  <KpiCard icon="🏢" label="Employeurs"        value={kpis.employers_total} color="#6b21a8" />
                  <KpiCard icon="🔕" label="Désinscrits email" value={kpis.unsubscribed}    color="#6b7280" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Mise en relation</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
                  <KpiCard icon="🤝" label="Matchings total"   value={kpis.matches_total}    color="#1E3A78" />
                  <KpiCard icon="✨" label="Nouveaux matchings" value={kpis.matches_new}      color="#0d7c6e" />
                  <KpiCard icon="📄" label="Offres publiées"   value={kpis.offers_published}  color="#6b21a8" />
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1 }}>Actions rapides</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button style={{ ...btn.base, ...btn.primary }} onClick={() => { setEmailSegment("workers_hidden"); setEmailTemplate("visibility_initial"); setActiveTab("prospection"); setProspectionTab("emailing"); }}>
                    ✉️ Campagne profils masqués
                  </button>
                  <button style={{ ...btn.base, ...btn.ghost }} onClick={() => { setSegment("employers_without_offers"); setActiveTab("prospection"); setProspectionTab("contacts"); }}>
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
                Diagnostics automatiques et stratégie de prospection basés sur vos profils disponibles.
              </p>
            </div>

            {/* ══ STRATÉGIE DE CIBLAGE ══════════════════════════════════════════ */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#1E3A78" }}>🎯 Qui contacter en priorité ?</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#8a9db8" }}>
                    Recommandations générées par IA à partir de vos profils disponibles sur la plateforme.
                  </p>
                </div>
                <button
                  style={{ ...btn.base, ...btn.primary }}
                  onClick={fetchStrategy}
                  disabled={strategyLoading}
                >
                  {strategyLoading ? "⏳ Analyse en cours…" : strategy ? "🔄 Regénérer" : "✨ Analyser mes profils"}
                </button>
              </div>

              {strategyError && (
                <div style={{ ...card, borderLeft: "4px solid #ef4444", background: "#fff5f5", color: "#b91c1c", fontSize: 13, padding: "12px 16px", marginBottom: 16 }}>
                  ⚠️ {strategyError}
                </div>
              )}

              {!strategy && !strategyLoading && (
                <div style={{ ...card, textAlign: "center", padding: "40px 24px", color: "#8a9db8" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#1E3A78", fontSize: 15 }}>Analyse stratégique de vos profils</p>
                  <p style={{ margin: "0 0 20px", fontSize: 13 }}>Cliquez sur "Analyser mes profils" pour savoir quels employeurs belges contacter en premier, avec quel argument et via quel canal.</p>
                </div>
              )}

              {strategy && !strategyLoading && (
                <>
                  {/* Résumé des profils */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                    <div style={{ ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>👤</span>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>{strategy.profileCount}</div>
                        <div style={{ fontSize: 11, color: "#8a9db8" }}>profils disponibles</div>
                      </div>
                    </div>
                    {(strategy.topSectors || []).slice(0, 3).map(([sector, count]) => (
                      <div key={sector} style={{ ...card, padding: "12px 18px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78" }}>{sector}</div>
                        <div style={{ fontSize: 11, color: "#8a9db8" }}>{count} profil{count > 1 ? "s" : ""}</div>
                      </div>
                    ))}
                    {(strategy.topRegions || []).slice(0, 2).map(([region, count]) => (
                      <div key={region} style={{ ...card, padding: "12px 18px", borderLeft: "3px solid #57B7AF" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0d7c6e" }}>{region}</div>
                        <div style={{ fontSize: 11, color: "#8a9db8" }}>{count} profil{count > 1 ? "s" : ""}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recommandations */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                    {(strategy.recommendations || []).map((rec) => (
                      <div key={rec.id} style={{ ...card, borderTop: `4px solid ${rec.priority === "haute" ? "#e91e8c" : "#57B7AF"}`, display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: rec.priority === "haute" ? "#e91e8c" : "#0d7c6e" }}>
                              {rec.priority === "haute" ? "🔴 Priorité haute" : "🟡 Priorité moyenne"}
                            </span>
                            <h4 style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 800, color: "#1E3A78" }}>{rec.segment}</h4>
                          </div>
                          <span style={{ fontSize: 11, background: "#f0f4fb", border: "1px solid #dde4f5", borderRadius: 20, padding: "3px 10px", color: "#607086", whiteSpace: "nowrap", flexShrink: 0 }}>
                            {rec.profileMatch}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, background: "#eef4ff", borderRadius: 20, padding: "2px 9px", color: "#1E3A78" }}>📍 {rec.region}</span>
                          <span style={{ fontSize: 11, background: "#eef4ff", borderRadius: 20, padding: "2px 9px", color: "#1E3A78" }}>⚙️ {rec.sector}</span>
                          <span style={{ fontSize: 11, background: "#fce4f0", borderRadius: 20, padding: "2px 9px", color: "#b5005c" }}>📣 {rec.channel}</span>
                        </div>

                        <div style={{ fontSize: 12, color: "#607086", lineHeight: 1.6 }}>
                          <strong style={{ color: "#1E3A78" }}>Pourquoi maintenant :</strong> {rec.why}
                        </div>

                        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#0369a1", lineHeight: 1.6 }}>
                          <strong>💬 Argument :</strong> {rec.pitch}
                        </div>

                        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#15803d", lineHeight: 1.6 }}>
                          <strong>→ Action immédiate :</strong> {rec.action}
                        </div>

                        <button
                          style={{ ...btn.base, ...btn.ghost, fontSize: 12, justifyContent: "center" }}
                          onClick={() => {
                            setActiveTab("promo");
                            setUtmSource(rec.channel?.toLowerCase().includes("linkedin") ? "linkedin" : rec.channel?.toLowerCase().includes("email") ? "email" : "autre");
                          }}
                        >
                          → Créer un lien tracké pour cette action
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* ══ FIN STRATÉGIE ════════════════════════════════════════════════ */}

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#1E3A78" }}>📊 Diagnostics KPI</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#8a9db8" }}>Alertes automatiques basées sur vos données internes.</p>
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
                                onViewSegment={seg => { setSegment(seg); setActiveTab("prospection"); setProspectionTab("contacts"); }}
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
                                onViewSegment={seg => { setSegment(seg); setActiveTab("prospection"); setProspectionTab("contacts"); }}
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

            {/* Lien rapide vers Analyse trafic */}
            <div style={{ marginTop: 32, ...card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "16px 20px", background: "#f8faff", borderLeft: "4px solid #57B7AF" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#607086" }}>
                📈 Pour analyser le trafic de ton site, va dans l'onglet <strong style={{ color: "#1E3A78" }}>Analyse trafic</strong>.
              </p>
              <button style={{ ...btn.base, ...btn.ghost, fontSize: 12 }} onClick={() => setActiveTab("analytics")}>
                Voir l'analyse trafic →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET ANALYSE TRAFIC
        ════════════════════════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>📈 Analyse trafic hebdomadaire</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8a9db8" }}>Importez le CSV Vercel ou saisissez les chiffres manuellement pour obtenir les recommandations.</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => setShowHistory(h => !h)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: showHistory ? "#1E3A78" : "#fff", color: showHistory ? "#fff" : "#1E3A78", border: "1.5px solid #1E3A78", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  📋 Historique {analyticsHistory.length > 0 && `(${analyticsHistory.length})`}
                </button>
                <a href="https://vercel.com/candicedebruyne10-3544s-projects/lexpat-connect/analytics" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1E3A78", color: "#fff", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  Ouvrir Vercel Analytics →
                </a>
              </div>
            </div>

            {/* ── Historique des analyses ── */}
            {showHistory && (
              <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1E3A78", marginBottom: 14 }}>📋 Historique des analyses</div>
                {analyticsHistory.length === 0 ? (
                  <p style={{ color: "#8a9db8", fontSize: 13 }}>Aucune analyse sauvegardée pour le moment.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {analyticsHistory.map((entry, idx) => {
                      const d = new Date(entry.generatedAt);
                      const total = entry.inputs.totalVisitors || entry.inputs.pages?.reduce((s, p) => s + p.visitors, 0) || 0;
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8faff", borderRadius: 10, padding: "10px 14px", border: "1px solid #e8eef8" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#1E3A78" }}>
                              {d.toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })} — {d.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b85a0", marginTop: 2 }}>
                              {total} visiteurs · {entry.insights?.length || 0} recommandation{entry.insights?.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <button onClick={() => loadFromHistory(entry)}
                            style={{ background: "#1E3A78", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            Charger
                          </button>
                          <button onClick={() => deleteHistoryEntry(idx)}
                            style={{ background: "#fff1f2", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 8, padding: "5px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Formulaire de saisie ── */}
            <div style={{ ...card, marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#1E3A78", marginBottom: 16 }}>Visiteurs par page (7 derniers jours)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 20 }}>
                {analyticsInputs.pages.map(p => (
                  <div key={p.path} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8faff", borderRadius: 10, padding: "8px 12px", border: "1px solid #e8eef8" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1E3A78", marginBottom: 1 }}>{p.label}</div>
                      <div style={{ fontSize: 10, color: "#8a9db8", fontFamily: "monospace" }}>{p.path}</div>
                    </div>
                    <input
                      type="number" min="0" placeholder="0"
                      value={p.visitors}
                      onChange={e => updateAnalyticsPage(p.path, e.target.value)}
                      style={{ width: 64, padding: "5px 8px", borderRadius: 8, border: "1.5px solid #dce8f5", fontSize: 14, fontWeight: 900, color: "#1E3A78", textAlign: "center", background: "#fff" }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #e8eef8", paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                {[
                  { key: "totalVisitors", label: "Total visiteurs (optionnel)", placeholder: "ex: 285" },
                  { key: "mobilePercent", label: "% mobile", placeholder: "ex: 51" },
                  { key: "belgiumPercent", label: "% Belgique", placeholder: "ex: 43" },
                  { key: "topReferrer",   label: "1er référent (optionnel)", placeholder: "ex: Gmail Android", isText: true },
                ].map(({ key, label, placeholder, isText }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{label}</label>
                    <input
                      type={isText ? "text" : "number"} min="0" max={isText ? undefined : "100"} placeholder={placeholder}
                      value={analyticsInputs[key]}
                      onChange={e => setAnalyticsInputs(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #dce8f5", fontSize: 13, color: "#1E3A78", background: "#fff", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {/* CSV import */}
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f0f7ff", color: "#1E3A78", border: "1.5px solid #c5d4f3", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  📂 Importer CSV Vercel
                  <input type="file" accept=".csv,text/csv" onChange={handleCsvImport} style={{ display: "none" }} />
                </label>
                <button
                  onClick={runAnalysis}
                  style={{ background: "#1E3A78", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
                >
                  🔍 Générer l'analyse
                </button>
              </div>
              {csvError && (
                <p style={{ marginTop: 10, fontSize: 13, color: csvError.startsWith("✅") ? "#0d7c6e" : "#b91c1c", fontWeight: 600 }}>{csvError}</p>
              )}
            </div>

            {/* ── Rapport généré ── */}
            {analyticsReport && (() => {
              const { inputs, insights, generatedAt } = analyticsReport;
              const sortedPages = [...inputs.pages].sort((a, b) => b.visitors - a.visitors);
              const typeTheme = {
                alerte:      { bg: "#fff1f2", border: "#fca5a5", badge: "#fee2e2", badgeText: "#b91c1c", label: "⚠️ Alerte" },
                opportunite: { bg: "#f0fdf4", border: "#86efac", badge: "#dcfce7", badgeText: "#166534", label: "🚀 Opportunité" },
                info:        { bg: "#f0f6ff", border: "#93c5fd", badge: "#dbeafe", badgeText: "#1d4ed8", label: "ℹ️ Info" },
              };

              return (
                <>
                  {/* Mini stats */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                    {[
                      { icon: "👁️", value: inputs.totalVisitors || inputs.pages.reduce((s,p)=>s+p.visitors,0), label: "visiteurs totaux" },
                      { icon: "📱", value: inputs.mobilePercent ? `${inputs.mobilePercent}%` : "—", label: "mobile" },
                      { icon: "🇧🇪", value: inputs.belgiumPercent ? `${inputs.belgiumPercent}%` : "—", label: "Belgique" },
                      { icon: "📣", value: inputs.topReferrer || "—", label: "1er référent", small: true },
                    ].map(({ icon, value, label, small }) => (
                      <div key={label} style={{ ...card, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, minWidth: 120 }}>
                        <span style={{ fontSize: 20 }}>{icon}</span>
                        <div>
                          <div style={{ fontSize: small ? 14 : 22, fontWeight: 900, color: "#1E3A78", lineHeight: 1 }}>{value}</div>
                          <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 2 }}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tableau pages */}
                  <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 24 }}>
                    <div style={{ padding: "12px 18px", background: "#f8faff", borderBottom: "1px solid #e8eef8", fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>
                      Pages — classement de la semaine
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8faff", borderBottom: "1px solid #e8eef8" }}>
                          {["#", "Page", "Visiteurs", "Performance"].map(h => (
                            <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPages.filter(p => p.visitors > 0).map((p, i) => {
                          const lvl = classifyTraffic(p.visitors);
                          const c = { high: { color: "#0d7c6e", bg: "#e6faf7", label: "Élevé" }, medium: { color: "#92400e", bg: "#fef3c7", label: "Moyen" }, low: { color: "#6b7280", bg: "#f5f5f5", label: "Faible" } }[lvl];
                          return (
                            <tr key={p.path} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", borderBottom: "1px solid #f0f4fb" }}>
                              <td style={{ padding: "8px 16px", color: "#8a9db8", fontWeight: 700 }}>{i + 1}</td>
                              <td style={{ padding: "8px 16px" }}>
                                <div style={{ fontWeight: 600, color: "#1E3A78" }}>{p.label}</div>
                                <div style={{ fontSize: 11, color: "#8a9db8", fontFamily: "monospace" }}>{p.path}</div>
                              </td>
                              <td style={{ padding: "8px 16px", fontWeight: 900, fontSize: 16, color: "#1E3A78" }}>{p.visitors}</td>
                              <td style={{ padding: "8px 16px" }}>
                                <span style={{ display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>{c.label}</span>
                              </td>
                            </tr>
                          );
                        })}
                        {sortedPages.filter(p => p.visitors > 0).length === 0 && (
                          <tr><td colSpan={4} style={{ padding: "24px 16px", color: "#8a9db8", textAlign: "center" }}>Aucune donnée saisie</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Insights */}
                  {insights.length === 0 ? (
                    <div style={{ ...card, textAlign: "center", padding: 36, color: "#8a9db8", fontSize: 13 }}>
                      ✅ Pas de point d'attention particulier cette semaine. Continuez sur votre lancée.
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        Recommandations ({insights.length})
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 24 }}>
                        {insights.map((ins, i) => {
                          const th = typeTheme[ins.type] || typeTheme.info;
                          return (
                            <div key={i} style={{ background: th.bg, border: `1.5px solid ${th.border}`, borderRadius: 16, padding: "18px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <span style={{ fontSize: 18 }}>{ins.icon}</span>
                                <span style={{ display: "inline-block", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 800, background: th.badge, color: th.badgeText }}>{th.label}</span>
                              </div>
                              <div style={{ fontWeight: 800, fontSize: 14, color: "#1E3A78", marginBottom: 6 }}>{ins.title}</div>
                              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#3d5470", lineHeight: 1.65 }}>{ins.text}</p>
                              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#1E3A78", fontWeight: 700 }}>
                                → {ins.action}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div style={{ fontSize: 11, color: "#b0bec5", textAlign: "right" }}>
                    Analyse générée le {new Date(generatedAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET PROSPECTION — Contacts / Emailing / Studio IA
        ════════════════════════════════════════════════════ */}
        {activeTab === "prospection" && (
          <div>
            {/* ── Sous-navigation ── */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#f0f4fb", borderRadius: 14, padding: 4, width: "fit-content" }}>
              {[
                { id: "contacts", label: "👥 Contacts" },
                { id: "emailing", label: "✉️ Emailing" },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setProspectionTab(sub.id)}
                  style={{
                    padding: "9px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                    cursor: "pointer", border: "none",
                    background: prospectionTab === sub.id ? "#fff" : "transparent",
                    color: prospectionTab === sub.id ? "#1E3A78" : "#8a9db8",
                    boxShadow: prospectionTab === sub.id ? "0 1px 6px rgba(30,58,120,0.10)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* ── Sous-onglet Contacts ── */}
            {prospectionTab === "contacts" && <div>
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
          </div>}

            {/* ── Sous-onglet Emailing ── */}
            {prospectionTab === "emailing" && <div>

            {/* ── Barre de mode : Classique / Guidé ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1E3A78" }}>✉️ Emailing</h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8a9db8" }}>
                  {emailWizardStep === 0 ? "Mode classique — configurez librement votre campagne." : `Étape ${emailWizardStep} / 4`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setEmailWizardStep(0)}
                  style={{ padding: "7px 16px", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer", border: "1px solid #dde4f5", background: emailWizardStep === 0 ? "#1E3A78" : "#f5f7ff", color: emailWizardStep === 0 ? "#fff" : "#8a9db8", transition: "all .15s" }}
                >
                  ⚙️ Classique
                </button>
                <button
                  onClick={() => setEmailWizardStep(1)}
                  style={{ padding: "7px 16px", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer", border: "1px solid #dde4f5", background: emailWizardStep > 0 ? "#57B7AF" : "#f5f7ff", color: emailWizardStep > 0 ? "#fff" : "#8a9db8", transition: "all .15s" }}
                >
                  🧭 Mode guidé
                </button>
              </div>
            </div>

            {/* ══ WIZARD GUIDÉ ══════════════════════════════════════════════════════ */}
            {emailWizardStep > 0 && (() => {
              const stepLabels = ["Segment cible", "Contenu IA", "Aperçu", "Envoyer"];

              return (
                <div>
                  {/* Stepper barre */}
                  <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
                    {stepLabels.map((label, i) => {
                      const step = i + 1;
                      const active = emailWizardStep === step;
                      const done   = emailWizardStep > step;
                      return (
                        <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                          {i > 0 && <div style={{ position: "absolute", left: 0, top: 16, width: "50%", height: 2, background: done || active ? "#57B7AF" : "#e2eaf3" }} />}
                          {i < 3 && <div style={{ position: "absolute", right: 0, top: 16, width: "50%", height: 2, background: done ? "#57B7AF" : "#e2eaf3" }} />}
                          <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, fontWeight: 800, fontSize: 13, background: done ? "#57B7AF" : active ? "#1E3A78" : "#e2eaf3", color: done || active ? "#fff" : "#8a9db8", transition: "all .2s" }}>
                            {done ? "✓" : step}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? "#1E3A78" : done ? "#57B7AF" : "#8a9db8" }}>{label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Étape 1 : Segment ── */}
                  {emailWizardStep === 1 && (
                    <div style={{ ...card, maxWidth: 560, margin: "0 auto" }}>
                      <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#1E3A78" }}>1 — Qui voulez-vous contacter ?</h3>
                      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#607086" }}>Choisissez le segment cible. L'email sera envoyé à tous les contacts de ce groupe qui ont une adresse email valide.</p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                          <label style={labelStyle}>Nom de la campagne (optionnel)</label>
                          <input type="text" placeholder="Ex : Relance profils masqués — juin 2026" value={emailName} onChange={e => setEmailName(e.target.value)} style={inputStyle} />
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
                          <div style={{ fontSize: 12, color: "#8a9db8", marginTop: 6 }}>
                            Conseil : pour une première campagne, commencez par un segment précis (ex : <em>Travailleurs — profil masqué</em>).
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Langue d'envoi</label>
                          <select value={emailLocale} onChange={e => setEmailLocale(e.target.value)} style={inputStyle}>
                            <option value="auto">Automatique (langue du contact)</option>
                            <option value="fr">Français uniquement</option>
                            <option value="en">Anglais uniquement</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                        <button style={{ ...btn.base, ...btn.primary }} onClick={() => setEmailWizardStep(2)}>
                          Suivant → Contenu
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Étape 2 : Contenu IA ── */}
                  {emailWizardStep === 2 && (
                    <div style={{ ...card, maxWidth: 620, margin: "0 auto" }}>
                      <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#1E3A78" }}>2 — Quel est votre message ?</h3>
                      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#607086" }}>Décrivez l'email en quelques mots — l'IA rédige le sujet et le corps. Vous pouvez aussi choisir un template standard.</p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                          <label style={labelStyle}>Template de base</label>
                          <select value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)} style={inputStyle}>
                            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                          <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 4 }}>{TEMPLATES.find(t => t.id === emailTemplate)?.description}</div>
                        </div>

                        <div style={{ background: "#f5f7ff", border: "1px solid #dde4f5", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#1E3A78" }}>✨ Aide IA</span>
                            <span style={{ fontSize: 11, color: "#8a9db8" }}>— facultatif, mais recommandé</span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Ex : Email de prospection pour un DRH flamand qui ne connaît pas encore LEXPAT Connect."
                            value={aiEmailPrompt}
                            onChange={e => setAiEmailPrompt(e.target.value)}
                            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", fontSize: 12 }}
                          />
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <select value={aiEmailAudience} onChange={e => setAiEmailAudience(e.target.value)} style={{ ...inputStyle, flex: "1 1 160px", fontSize: 12, padding: "6px 10px" }}>
                              <option value="employer">Employeur belge</option>
                              <option value="worker">Travailleur international</option>
                              <option value="partner">Partenaire / cabinet RH</option>
                              <option value="press">Journaliste / presse</option>
                              <option value="external">Contact externe</option>
                            </select>
                            <button
                              style={{ ...btn.base, ...btn.teal, fontSize: 12, padding: "7px 16px", opacity: aiEmailLoading || !aiEmailPrompt.trim() ? 0.6 : 1 }}
                              disabled={aiEmailLoading || !aiEmailPrompt.trim()}
                              onClick={generateAiEmail}
                            >
                              {aiEmailLoading ? "⏳ Génération…" : "✨ Générer"}
                            </button>
                          </div>
                          {aiEmailError && <div style={{ fontSize: 12, color: "#b91c1c" }}>⚠️ {aiEmailError}</div>}
                          {aiEmailResult && (
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: "#0d7c6e", fontWeight: 700 }}>✓ Brouillon prêt</span>
                              <button style={{ ...btn.base, ...btn.ghost, fontSize: 11, padding: "4px 12px" }} onClick={() => { setEmailTemplate("custom"); setEmailCustomBody(aiEmailBodyEdit); setEmailSubject(aiEmailSubjectEdit); }}>
                                ↓ Appliquer
                              </button>
                            </div>
                          )}
                        </div>

                        {emailTemplate === "custom" && (
                          <div>
                            <label style={labelStyle}>Corps du message</label>
                            <textarea
                              ref={el => { customBodyRef.current = el; }}
                              rows={7}
                              placeholder={`Bonjour {{name}},\n\nVotre message ici…\n\nL'équipe LEXPAT Connect`}
                              value={emailCustomBody}
                              onChange={e => setEmailCustomBody(e.target.value)}
                              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
                            />
                          </div>
                        )}

                        <div>
                          <label style={labelStyle}>Sujet de l'email (laissez vide pour le sujet par défaut)</label>
                          <input type="text" placeholder="Sujet de l'email…" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} style={inputStyle} />
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                        <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setEmailWizardStep(1)}>← Retour</button>
                        <button style={{ ...btn.base, ...btn.primary }} onClick={async () => {
                          setPreviewLoading(true);
                          const params = new URLSearchParams({ template: emailTemplate, locale: emailLocale === "auto" ? "fr" : emailLocale });
                          if (emailTemplate === "custom" && emailCustomBody) params.set("custom_html", emailCustomBody);
                          const res = await fetch(`/api/admin/campaigns/preview?${params}`, { headers: { Authorization: `Bearer ${token}` } });
                          const html = await res.text();
                          setPreviewHtml(html);
                          setPreviewLoading(false);
                          setEmailWizardStep(3);
                        }}>
                          {previewLoading ? "⏳ Chargement…" : "Suivant → Aperçu"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Étape 3 : Aperçu ── */}
                  {emailWizardStep === 3 && (
                    <div style={{ ...card, maxWidth: 720, margin: "0 auto" }}>
                      <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#1E3A78" }}>3 — Vérifiez l'aperçu</h3>
                      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#607086" }}>Voici à quoi ressemblera votre email. Relisez avant d'envoyer.</p>

                      <div style={{ display: "flex", gap: 10, marginBottom: 16, padding: "10px 14px", background: "#f8faff", borderRadius: 10, fontSize: 13 }}>
                        <span><strong>Segment :</strong> {Object.values(SEGMENT_GROUPS).flat().find(s => s.id === emailSegment)?.label || emailSegment}</span>
                        {emailSubject && <><span style={{ color: "#8a9db8" }}>·</span><span><strong>Sujet :</strong> {emailSubject}</span></>}
                        <span style={{ color: "#8a9db8" }}>·</span>
                        <span><strong>Template :</strong> {TEMPLATES.find(t => t.id === emailTemplate)?.label}</span>
                      </div>

                      {previewHtml ? (
                        <iframe
                          srcDoc={previewHtml}
                          style={{ width: "100%", height: 480, border: "1px solid #e2eaf3", borderRadius: 10 }}
                          title="Aperçu email"
                        />
                      ) : (
                        <div style={{ textAlign: "center", color: "#8a9db8", padding: 48 }}>⏳ Chargement de l'aperçu…</div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                        <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setEmailWizardStep(2)}>← Modifier le contenu</button>
                        <button style={{ ...btn.base, ...btn.primary }} onClick={() => setEmailWizardStep(4)}>
                          Suivant → Envoyer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Étape 4 : Envoyer ── */}
                  {emailWizardStep === 4 && (
                    <div style={{ ...card, maxWidth: 560, margin: "0 auto" }}>
                      <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#1E3A78" }}>4 — Lancer la campagne</h3>
                      <p style={{ margin: "0 0 20px", fontSize: 13, color: "#607086" }}>Récapitulatif avant envoi. Commencez par une simulation pour vérifier sans risque.</p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#f8faff", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 13 }}>
                        <div><strong>Segment :</strong> {Object.values(SEGMENT_GROUPS).flat().find(s => s.id === emailSegment)?.label || emailSegment}</div>
                        <div><strong>Template :</strong> {TEMPLATES.find(t => t.id === emailTemplate)?.label}</div>
                        {emailSubject && <div><strong>Sujet :</strong> {emailSubject}</div>}
                        {emailName && <div><strong>Nom campagne :</strong> {emailName}</div>}
                        <div><strong>Langue :</strong> {emailLocale === "auto" ? "Automatique" : emailLocale === "fr" ? "Français" : "Anglais"}</div>
                      </div>

                      {selectedIds.size > 0 && (
                        <Alert type="info">
                          📌 Envoi limité aux <strong>{selectedIds.size} contacts sélectionnés</strong>.{" "}
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontWeight: 700, padding: 0 }} onClick={() => setSelectedIds(new Set())}>Annuler</button>
                        </Alert>
                      )}

                      {emailResult && !emailLoading && (
                        <div style={{ marginBottom: 16, padding: "12px 16px", background: emailResult.error ? "#fef3f2" : "#f0fdf4", border: `1px solid ${emailResult.error ? "#fca5a5" : "#86efac"}`, borderRadius: 10, fontSize: 13 }}>
                          {emailResult.error
                            ? <span style={{ color: "#b91c1c" }}>⚠️ {emailResult.error}</span>
                            : <span style={{ color: "#15803d" }}>✓ {emailResult.isDryRun ? "Simulation réussie" : "Campagne envoyée"} — {emailResult.sent ?? 0} envoyé(s), {emailResult.skipped ?? 0} ignoré(s), {emailResult.failed ?? 0} échec(s)</span>
                          }
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
                        <button style={{ ...btn.base, ...btn.ghost }} onClick={() => setEmailWizardStep(3)}>← Retour</button>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button style={{ ...btn.base, ...btn.ghost }} disabled={emailLoading} onClick={() => sendCampaign(true)}>
                            {emailLoading ? "⏳ Simulation…" : "🧪 Simuler d'abord"}
                          </button>
                          <button style={{ ...btn.base, ...btn.primary }} disabled={emailLoading} onClick={() => { setPendingDryRun(false); setShowConfirm(true); }}>
                            {emailLoading ? "⏳ Envoi…" : "🚀 Envoyer pour de vrai"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            {/* ══ FIN WIZARD ══════════════════════════════════════════════════════ */}

            {/* ══ MODE CLASSIQUE ══════════════════════════════════════════════════ */}
            {emailWizardStep === 0 && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

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

                {/* ✨ Aide IA — génère sujet + corps en un clic */}
                <div style={{ background: "#f5f7ff", border: "1px solid #dde4f5", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E3A78" }}>✨ Aide IA</span>
                    <span style={{ fontSize: 11, color: "#8a9db8" }}>— génère le sujet et le corps automatiquement</span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Ex : Email de prospection pour un DRH en Flandre qui ne connaît pas encore LEXPAT Connect."
                    value={aiEmailPrompt}
                    onChange={e => setAiEmailPrompt(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", fontSize: 12 }}
                  />
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <select value={aiEmailAudience} onChange={e => setAiEmailAudience(e.target.value)} style={{ ...inputStyle, flex: "1 1 160px", fontSize: 12, padding: "6px 10px" }}>
                      <option value="employer">Employeur belge</option>
                      <option value="worker">Travailleur international</option>
                      <option value="partner">Partenaire / cabinet RH</option>
                      <option value="press">Journaliste / presse</option>
                      <option value="external">Contact externe</option>
                    </select>
                    <select value={aiEmailLocale} onChange={e => setAiEmailLocale(e.target.value)} style={{ ...inputStyle, flex: "0 0 110px", fontSize: 12, padding: "6px 10px" }}>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                    <button
                      style={{ ...btn.base, ...btn.teal, fontSize: 12, padding: "7px 16px", opacity: aiEmailLoading || !aiEmailPrompt.trim() ? 0.6 : 1 }}
                      disabled={aiEmailLoading || !aiEmailPrompt.trim()}
                      onClick={async () => {
                        await generateAiEmail();
                      }}
                    >
                      {aiEmailLoading ? "⏳" : "✨ Générer"}
                    </button>
                  </div>
                  {aiEmailError && <div style={{ fontSize: 12, color: "#b91c1c" }}>⚠️ {aiEmailError}</div>}
                  {aiEmailResult && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#0d7c6e", fontWeight: 700 }}>✓ Brouillon prêt</span>
                      <button
                        style={{ ...btn.base, ...btn.ghost, fontSize: 11, padding: "4px 12px" }}
                        onClick={() => { setEmailTemplate("custom"); setEmailCustomBody(aiEmailBodyEdit); setEmailSubject(aiEmailSubjectEdit); }}
                      >
                        ↓ Appliquer à la campagne
                      </button>
                    </div>
                  )}
                </div>

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
            </div>}
            {/* ══ FIN MODE CLASSIQUE ══════════════════════════════════════════════ */}

            {/* ── Section : Email individuel ──────────────────────────────── */}
            <div style={{ marginTop: 32, ...card }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>
                ✉️ Email individuel
              </h3>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#607086" }}>
                Envoyez un email personnalisé à n'importe quelle adresse, sans passer par un fichier CSV.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Colonne gauche */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Prénom</label>
                      <input type="text" placeholder="Thomas" value={soloPrenom} onChange={e => setSoloPrenom(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Société</label>
                      <input type="text" placeholder="Acme SA" value={soloSociete} onChange={e => setSoloSociete(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Email destinataire <span style={{ color: "#b91c1c" }}>*</span></label>
                    <input type="email" placeholder="contact@entreprise.be" value={soloEmail} onChange={e => setSoloEmail(e.target.value)} style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Sujet <span style={{ color: "#b91c1c" }}>*</span></label>
                    <input type="text" placeholder="Un message de LEXPAT Connect" value={soloSubject} onChange={e => setSoloSubject(e.target.value)} style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Corps du message <span style={{ color: "#b91c1c" }}>*</span></label>
                    <textarea
                      ref={soloBodyRef}
                      rows={7}
                      placeholder={"Bonjour {{prenom}},\n\n..."}
                      value={soloBody}
                      onChange={e => setSoloBody(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
                    />
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                      {["{{prenom}}", "{{societe}}"].map(tag => (
                        <button key={tag} type="button"
                          onClick={() => {
                            const el = soloBodyRef.current;
                            if (el) {
                              const s = el.selectionStart, e2 = el.selectionEnd;
                              const v = soloBody.slice(0, s) + tag + soloBody.slice(e2);
                              setSoloBody(v);
                              requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + tag.length, s + tag.length); });
                            } else setSoloBody(b => b + tag);
                          }}
                          style={{ background: "#f0f4fb", border: "1px solid #d0dcf0", borderRadius: 6, padding: "3px 9px", fontSize: 11, color: "#1E3A78", fontFamily: "monospace", cursor: "pointer" }}
                        >{tag}</button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={sendSoloEmail}
                    disabled={soloSending || !soloEmail || !soloSubject || !soloBody}
                    style={{ ...btn.base, ...btn.primary, opacity: (!soloEmail || !soloSubject || !soloBody) ? 0.5 : 1, alignSelf: "flex-start" }}
                  >
                    {soloSending ? "Envoi en cours…" : "📨 Envoyer"}
                  </button>
                </div>

                {/* Colonne droite — résultat */}
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {!soloResult ? (
                    <div style={{ fontSize: 13, color: "#8a9db8", padding: "24px 0", textAlign: "center", border: "2px dashed #e2eaf8", borderRadius: 10, width: "100%" }}>
                      Le résultat de l'envoi apparaîtra ici
                    </div>
                  ) : (
                    <div style={{ width: "100%", background: soloResult.error ? "#fef2f2" : "#f0fdf4", border: `1px solid ${soloResult.error ? "#fecaca" : "#bbf7d0"}`, borderRadius: 10, padding: 16 }}>
                      {soloResult.error
                        ? <div style={{ color: "#b91c1c", fontWeight: 700 }}>❌ {soloResult.error}</div>
                        : <div style={{ color: "#16a34a", fontWeight: 700 }}>✅ Email envoyé à <strong>{soloResult.to}</strong></div>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section : Campagne CSV ───────────────────────────────────── */}
            <div style={{ marginTop: 32, ...card }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>
                📤 Campagne depuis un fichier CSV
              </h3>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#607086" }}>
                Importez un export de contacts (Google Contacts, CRM…) et envoyez un email personnalisé à chaque destinataire.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                {/* Colonne gauche — configuration */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Nom de la campagne (optionnel)</label>
                    <input
                      type="text"
                      placeholder="Ex : Promo simulateur — employeurs belges"
                      value={csvCampaignName}
                      onChange={e => setCsvCampaignName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Fichier CSV <span style={{ color: "#b91c1c" }}>*</span></label>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={e => handleCsvFile(e.target.files?.[0] || null)}
                      style={{ ...inputStyle, padding: "8px 12px", cursor: "pointer" }}
                    />
                    <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 4 }}>
                      Colonnes reconnues : Prénom, Nom de famille, E-mail 1, Société, Adresse 1 - Ville, Adresse 1 - Pays, Occupation, Langue…
                    </div>
                    {csvParseError && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>{csvParseError}</div>
                    )}
                    {csvContacts.length > 0 && !csvParseError && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                        ✅ {csvContacts.length} contact{csvContacts.length > 1 ? "s" : ""} valide{csvContacts.length > 1 ? "s" : ""} détecté{csvContacts.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Sujet de l'email <span style={{ color: "#b91c1c" }}>*</span></label>
                    <input
                      type="text"
                      placeholder="Ex : Simulez votre recrutement international en 2 minutes"
                      value={csvSubject}
                      onChange={e => setCsvSubject(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Corps du message <span style={{ color: "#b91c1c" }}>*</span></label>
                    <textarea
                      ref={csvBodyRef}
                      rows={10}
                      placeholder={"Bonjour {{prenom}},\n\nEn tant que responsable chez {{societe}},\nvous êtes peut-être confronté(e) à des difficultés de recrutement.\n\nNous avons développé un simulateur gratuit qui vous permet d'évaluer la faisabilité d'un recrutement international en 2 minutes.\n\nAccédez-y ici : https://lexpat-connect.be/simulateur\n\nCordialement,\nL'équipe LEXPAT Connect"}
                      value={csvBody}
                      onChange={e => setCsvBody(e.target.value)}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
                    />
                    <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 8, lineHeight: 1.8 }}>
                      Variables disponibles :
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                        {[
                          { tag: "{{prenom}}",     desc: "Prénom" },
                          { tag: "{{nom}}",        desc: "Nom de famille" },
                          { tag: "{{societe}}",    desc: "Société" },
                          { tag: "{{email}}",      desc: "Email" },
                          { tag: "{{ville}}",      desc: "Ville" },
                          { tag: "{{pays}}",       desc: "Pays" },
                          { tag: "{{occupation}}", desc: "Occupation" },
                        ].map(v => (
                          <button
                            key={v.tag}
                            type="button"
                            onClick={() => {
                              const el = csvBodyRef.current;
                              if (el) {
                                const start = el.selectionStart;
                                const end   = el.selectionEnd;
                                const newVal = csvBody.slice(0, start) + v.tag + csvBody.slice(end);
                                setCsvBody(newVal);
                                requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + v.tag.length, start + v.tag.length); });
                              } else {
                                setCsvBody(b => b + v.tag);
                              }
                            }}
                            style={{ background: "#f0f4fb", border: "1px solid #d0dcf0", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#1E3A78", fontFamily: "monospace", cursor: "pointer" }}
                          >
                            {v.tag} <span style={{ color: "#8a9db8", fontFamily: "inherit" }}>— {v.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Taille du lot */}
                  <div>
                    <label style={labelStyle}>Taille du lot</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[10, 20, 30, 50, 100, 9999].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCsvBatchSize(n)}
                          style={{
                            padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                            border: `1.5px solid ${csvBatchSize === n ? "#1E3A78" : "#d0dcf0"}`,
                            background: csvBatchSize === n ? "#1E3A78" : "#f8fbff",
                            color: csvBatchSize === n ? "#fff" : "#3d5470",
                          }}
                        >
                          {n === 9999 ? "Tous" : n}
                        </button>
                      ))}
                    </div>
                    {csvContacts.length > 0 && csvBatchSize < 9999 && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12, color: "#607086", background: "#eef4ff", borderRadius: 8, padding: "6px 12px" }}>
                          Lot <strong>{Math.floor(csvBatchOffset / csvBatchSize) + 1}</strong> / <strong>{Math.ceil(csvContacts.length / csvBatchSize)}</strong>
                          {" — "}contacts <strong>{csvBatchOffset + 1}</strong> à <strong>{Math.min(csvBatchOffset + csvBatchSize, csvContacts.length)}</strong> sur <strong>{csvContacts.length}</strong>
                        </div>
                        <button
                          type="button"
                          disabled={csvBatchOffset === 0}
                          onClick={() => setCsvBatchOffset(Math.max(0, csvBatchOffset - csvBatchSize))}
                          style={{ padding: "4px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid #d0dcf0", background: "#f8fbff", color: "#3d5470", opacity: csvBatchOffset === 0 ? 0.4 : 1 }}
                        >← Lot préc.</button>
                        <button
                          type="button"
                          disabled={csvBatchOffset + csvBatchSize >= csvContacts.length}
                          onClick={() => setCsvBatchOffset(Math.min(csvContacts.length - 1, csvBatchOffset + csvBatchSize))}
                          style={{ padding: "4px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid #d0dcf0", background: "#f8fbff", color: "#3d5470", opacity: csvBatchOffset + csvBatchSize >= csvContacts.length ? 0.4 : 1 }}
                        >Lot suiv. →</button>
                        <span style={{ fontSize: 11, color: "#8a9db8" }}>ou reprendre au contact&nbsp;#</span>
                        <input
                          type="number"
                          min={1}
                          max={csvContacts.length}
                          value={csvBatchOffset + 1}
                          onChange={e => {
                            const v = Math.max(1, Math.min(csvContacts.length, parseInt(e.target.value) || 1));
                            setCsvBatchOffset(v - 1);
                          }}
                          style={{ width: 64, padding: "3px 8px", borderRadius: 6, border: "1.5px solid #d0dcf0", fontSize: 12, color: "#1E3A78", fontWeight: 700 }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
                    <button
                      disabled={!csvBody || previewLoading}
                      onClick={async () => {
                        setPreviewLoading(true);
                        // Remplacer les variables CSV avec des données fictives
                        const demoBody = (csvBody || "")
                          .replace(/\{\{prenom\}\}/gi,     "Marie")
                          .replace(/\{\{nom\}\}/gi,        "Dupont")
                          .replace(/\{\{name\}\}/gi,       "Marie Dupont")
                          .replace(/\{\{societe\}\}/gi,    "Acme SA")
                          .replace(/\{\{email\}\}/gi,      "marie.dupont@example.com")
                          .replace(/\{\{ville\}\}/gi,      "Bruxelles")
                          .replace(/\{\{pays\}\}/gi,       "Belgique")
                          .replace(/\{\{occupation\}\}/gi, "Responsable RH")
                          .replace(/\{\{telephone\}\}/gi,  "+32 2 123 45 67")
                          .replace(/\{\{region\}\}/gi,     "Bruxelles-Capitale")
                          .replace(/\{\{precision\}\}/gi,  "");
                        const params = new URLSearchParams({ template: "custom", locale: "fr", custom_html: demoBody });
                        const res = await fetch(`/api/admin/campaigns/preview?${params}`, { headers: { Authorization: `Bearer ${token}` } });
                        const html = await res.text();
                        setPreviewHtml(html);
                        setPreviewLoading(false);
                      }}
                      style={{ ...btn.base, ...btn.ghost, opacity: !csvBody ? 0.5 : 1 }}
                    >
                      {previewLoading ? "⏳" : "👁️ Aperçu email"}
                    </button>
                    <button
                      onClick={() => sendCsvCampaign(true)}
                      disabled={csvSending || !csvFile || !csvSubject || !csvBody}
                      style={{ ...btn.base, ...btn.ghost, opacity: (!csvFile || !csvSubject || !csvBody) ? 0.5 : 1 }}
                    >
                      {csvSending ? "…" : "🔍 Simuler (dry run)"}
                    </button>
                    <button
                      onClick={() => sendCsvCampaign(false)}
                      disabled={csvSending || !csvFile || !csvSubject || !csvBody || csvContacts.length === 0}
                      style={{ ...btn.base, ...btn.primary, opacity: (!csvFile || !csvSubject || !csvBody || csvContacts.length === 0) ? 0.5 : 1 }}
                    >
                      {csvSending
                        ? "Envoi en cours…"
                        : csvBatchSize < 9999
                          ? `🚀 Envoyer lot ${Math.floor(csvBatchOffset / csvBatchSize) + 1} (${Math.min(csvBatchSize, csvContacts.length - csvBatchOffset)} contacts)`
                          : `🚀 Envoyer à ${csvContacts.length} contact${csvContacts.length !== 1 ? "s" : ""}`
                      }
                    </button>
                  </div>
                </div>

                {/* Colonne droite — aperçu des contacts */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78", marginBottom: 10 }}>
                    Aperçu des contacts
                  </div>
                  {csvContacts.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#8a9db8", padding: "24px 0", textAlign: "center", border: "2px dashed #e2eaf8", borderRadius: 10 }}>
                      Importez un CSV pour voir la liste ici
                    </div>
                  ) : (
                    <div style={{ maxHeight: 340, overflowY: "auto", border: "1px solid #e5edf5", borderRadius: 10 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#f8fbff" }}>
                            {["Prénom", "Nom", "Email", "Société", "Ville"].map(h => (
                              <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#3d5470", borderBottom: "1px solid #e5edf5" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvContacts.slice(0, 50).map((c, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f0f4fb" }}>
                              <td style={{ padding: "6px 10px", color: "#1E3A78" }}>{c.prenom}</td>
                              <td style={{ padding: "6px 10px", color: "#3d5470" }}>{c.nom}</td>
                              <td style={{ padding: "6px 10px", color: "#3d5470", fontSize: 11 }}>{c.email}</td>
                              <td style={{ padding: "6px 10px", color: "#3d5470" }}>{c.societe}</td>
                              <td style={{ padding: "6px 10px", color: "#3d5470" }}>{c.ville}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {csvContacts.length > 50 && (
                        <div style={{ padding: "8px 12px", fontSize: 12, color: "#8a9db8", borderTop: "1px solid #e5edf5" }}>
                          … et {csvContacts.length - 50} autre{csvContacts.length - 50 > 1 ? "s" : ""} contact{csvContacts.length - 50 > 1 ? "s" : ""} (tous seront inclus dans l'envoi)
                        </div>
                      )}
                    </div>
                  )}

                  {/* Résultats */}
                  {csvResult && (
                    <div style={{ marginTop: 16, background: csvResult.error ? "#fef2f2" : "#f0fdf4", border: `1px solid ${csvResult.error ? "#fecaca" : "#bbf7d0"}`, borderRadius: 10, padding: 16 }}>
                      {csvResult.error ? (
                        <div style={{ color: "#b91c1c", fontWeight: 700 }}>❌ {csvResult.error}</div>
                      ) : (
                        <>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#16a34a", marginBottom: 8 }}>
                            {csvResult.dry_run ? "🔍 Simulation terminée" : "✅ Lot envoyé"}
                          </div>
                          <div style={{ fontSize: 13, color: "#3d5470", lineHeight: 2 }}>
                            <strong>{csvResult.sent}</strong> envoyé{csvResult.sent !== 1 ? "s" : ""} ·{" "}
                            <strong>{csvResult.skipped}</strong> ignoré{csvResult.skipped !== 1 ? "s" : ""} ·{" "}
                            <strong style={{ color: csvResult.failed > 0 ? "#b91c1c" : "inherit" }}>{csvResult.failed}</strong> erreur{csvResult.failed !== 1 ? "s" : ""}
                          </div>

                          {/* Lot suivant */}
                          {!csvResult.dry_run && csvResult.remaining > 0 && (
                            <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8 }}>
                              <div style={{ fontSize: 12, color: "#9a3412", fontWeight: 700, marginBottom: 8 }}>
                                📋 {csvResult.remaining} contact{csvResult.remaining > 1 ? "s" : ""} restant{csvResult.remaining > 1 ? "s" : ""} dans ce fichier
                              </div>
                              <button
                                onClick={() => sendCsvCampaign(false, csvBatchOffset)}
                                disabled={csvSending}
                                style={{ ...btn.base, background: "#ea580c", color: "#fff", fontSize: 12, padding: "6px 14px" }}
                              >
                                {csvSending ? "Envoi…" : `🚀 Envoyer le lot suivant (${Math.min(csvBatchSize, csvResult.remaining)} contacts)`}
                              </button>
                            </div>
                          )}

                          {!csvResult.dry_run && csvResult.remaining === 0 && csvResult.total_in_file > csvResult.total_in_batch && (
                            <div style={{ marginTop: 8, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                              🎉 Tous les contacts du fichier ont été traités.
                            </div>
                          )}

                          {/* Ouvertures */}
                          {!csvResult.dry_run && csvCampaignId && (
                            <div style={{ marginTop: 12, borderTop: "1px solid #bbf7d0", paddingTop: 12 }}>
                              <button
                                onClick={() => fetchCsvOpens(csvCampaignId)}
                                disabled={csvOpensLoading}
                                style={{ ...btn.base, ...btn.ghost, fontSize: 12, padding: "5px 12px" }}
                              >
                                {csvOpensLoading ? "Chargement…" : "👁 Voir qui a ouvert"}
                              </button>
                              {csvOpens !== null && (
                                <div style={{ marginTop: 10 }}>
                                  {csvOpens.length === 0 ? (
                                    <div style={{ fontSize: 12, color: "#607086" }}>Aucune ouverture enregistrée pour l'instant (les clients de messagerie bloquent parfois les pixels).</div>
                                  ) : (
                                    <>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>
                                        {csvOpens.length} ouverture{csvOpens.length > 1 ? "s" : ""} confirmée{csvOpens.length > 1 ? "s" : ""}
                                      </div>
                                      <div style={{ maxHeight: 140, overflowY: "auto" }}>
                                        {csvOpens.map((o, i) => (
                                          <div key={i} style={{ fontSize: 11, padding: "3px 0", borderBottom: "1px solid #d1fae5", display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "#1E3A78", fontWeight: 600 }}>{o.email}</span>
                                            <span style={{ color: "#607086" }}>{new Date(o.opened_at).toLocaleString("fr-BE")}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {(csvResult.failures || []).length > 0 && (
                            <details style={{ marginTop: 8 }}>
                              <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#b91c1c" }}>
                                Voir les erreurs
                              </summary>
                              <div style={{ marginTop: 8 }}>
                                {csvResult.failures.map((f, i) => (
                                  <div key={i} style={{ fontSize: 11, padding: "3px 0", color: "#b91c1c" }}>
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
          </div>}

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
                  cols={["Poste", "Employeur", "Secteur", "Région", "Statut", "Date"]}
                  rows={(data.jobOffers || []).map(o => [
                    o.title       || "—",
                    o.companyName || "—",
                    o.sector      || "—",
                    o.region      || "—",
                    o.status      || "—",
                    formatDate(o.createdAt),
                  ])}
                />
              ) : <EmptyState text="Aucune offre." />}
            </SectionCard>

            <SectionCard title="Travailleurs" count={data.workers?.length}>
              {data.workers?.length ? (
                <SimpleTable
                  cols={["Nom", "Métier", "Secteur", "Région", "Visibilité", "Liens affiliation", "Inscrit"]}
                  rows={(data.workers || []).map(w => [
                    w.fullName        || "—",
                    w.targetJob       || "—",
                    w.targetSector    || "—",
                    w.preferredRegion || "—",
                    w.profileVisibility || "—",
                    w.activeReferralLinks > 0
                      ? <span style={{ fontWeight: 700, color: "#0d7c6e" }}>✓ {w.activeReferralLinks} lien{w.activeReferralLinks > 1 ? "s" : ""}</span>
                      : <span style={{ color: "#aab4c0" }}>—</span>,
                    formatDate(w.createdAt),
                  ])}
                />
              ) : <EmptyState text="Aucun travailleur." />}
            </SectionCard>

            <SectionCard title="Matchings récents" count={data.matchings?.length}>
              {data.matchings?.length ? (
                <SimpleTable
                  cols={["Score", "Offre", "Entreprise", "Travailleur", "Statut", "Date"]}
                  rows={(data.matchings || []).map(m => [
                    `${m.score || 0}/100`,
                    m.offerTitle   || "—",
                    m.companyName  || "—",
                    m.candidateName || "—",
                    m.status       || "—",
                    formatDate(m.createdAt),
                  ])}
                />
              ) : <EmptyState text="Aucun matching." />}
            </SectionCard>
          </div>
        )}

        {/* ── [Studio IA fusionné dans Emailing] ── */}
        {false && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>✨ Studio IA</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#8a9db8" }}>
                Rédigez emails et posts réseaux sociaux en décrivant ce que vous voulez. L'IA connaît LEXPAT Connect, ses audiences et le droit belge de l'immigration.
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 11, color: "#b0bccf" }}>
                Modèle actif : <strong style={{ color: "#607086" }}>Claude Haiku</strong> par défaut — modifiable via la variable <code style={{ background: "#f0f4fb", borderRadius: 4, padding: "1px 5px", fontSize: 11 }}>CLAUDE_MODEL</code> dans Vercel (ex. <code style={{ background: "#f0f4fb", borderRadius: 4, padding: "1px 5px", fontSize: 11 }}>claude-sonnet-4-6</code> pour plus de qualité).
              </p>
            </div>

            {/* ── Switcher Email / Post social ───────────────────────────────── */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#f0f4fb", borderRadius: 12, padding: 4, width: "fit-content" }}>
              {[
                { id: "email", label: "✉️  Email", desc: "Brouillon complet avec sujet + corps" },
                { id: "post",  label: "📣  Post réseau social", desc: "LinkedIn, Instagram, Facebook…" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => { setAiEmailAudience(prev => prev); setAiStudioMode(m.id); setAiEmailResult(null); setAiEmailError(null); }}
                  style={{
                    padding: "8px 20px", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none",
                    background: aiStudioMode === m.id ? "#fff" : "transparent",
                    color: aiStudioMode === m.id ? "#1E3A78" : "#8a9db8",
                    boxShadow: aiStudioMode === m.id ? "0 1px 6px rgba(30,58,120,0.10)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>

              {/* ── Formulaire gauche ───────────────────────────────────────── */}
              <div style={{ ...card, borderTop: `3px solid ${aiStudioMode === "email" ? "#57B7AF" : "#e91e8c"}` }}>

                {/* Options selon le mode */}
                {aiStudioMode === "email" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1E3A78" }}>✉️ Rédiger un email</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Type de destinataire</label>
                        <select value={aiEmailAudience} onChange={e => setAiEmailAudience(e.target.value)} style={inputStyle}>
                          <option value="employer">Employeur belge</option>
                          <option value="worker">Travailleur international</option>
                          <option value="partner">Partenaire / cabinet RH</option>
                          <option value="press">Journaliste / presse</option>
                          <option value="external">Contact externe (autre)</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Langue</label>
                        <select value={aiEmailLocale} onChange={e => setAiEmailLocale(e.target.value)} style={inputStyle}>
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Email du destinataire (optionnel)</label>
                      <input
                        type="email"
                        placeholder="contact@entreprise.be"
                        value={aiEmailTo}
                        onChange={e => setAiEmailTo(e.target.value)}
                        style={inputStyle}
                      />
                      <div style={{ fontSize: 11, color: "#8a9db8", marginTop: 4 }}>Si renseigné, affiché en haut du brouillon pour faciliter le copier-coller vers votre client mail.</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1E3A78" }}>📣 Rédiger un post</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Réseau social</label>
                        <select value={aiPostNetwork} onChange={e => setAiPostNetwork(e.target.value)} style={inputStyle}>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitter">X (Twitter)</option>
                          <option value="generic">Générique (à adapter)</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Langue</label>
                        <select value={aiEmailLocale} onChange={e => setAiEmailLocale(e.target.value)} style={inputStyle}>
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Ton</label>
                      <select value={aiPostTone} onChange={e => setAiPostTone(e.target.value)} style={inputStyle}>
                        <option value="expert">Expert & pédagogique</option>
                        <option value="human">Humain & proche</option>
                        <option value="impactful">Percutant & direct</option>
                        <option value="storytelling">Storytelling</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Prompt commun */}
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>
                    {aiStudioMode === "email" ? "Décrivez l'email voulu" : "Décrivez le post voulu"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={aiStudioMode === "email"
                      ? "Ex : Email de prospection pour un DRH dans le secteur de la construction en Flandre, qui ne connaît pas encore LEXPAT Connect. Mettre en avant le simulateur gratuit et la base de profils."
                      : "Ex : Post LinkedIn pour annoncer que les 21 professions flamandes ont une dispense totale du test marché depuis le 1er janvier 2026. Angle : bonne nouvelle pour les employeurs."}
                    value={aiEmailPrompt}
                    onChange={e => setAiEmailPrompt(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", minHeight: 100 }}
                  />
                </div>

                <button
                  style={{ ...btn.base, ...(aiStudioMode === "email" ? btn.teal : { background: "linear-gradient(135deg,#c0006a,#e91e8c)", color: "#fff" }), width: "100%", justifyContent: "center", marginTop: 6, opacity: aiEmailLoading || !aiEmailPrompt.trim() ? 0.6 : 1 }}
                  disabled={aiEmailLoading || !aiEmailPrompt.trim()}
                  onClick={aiStudioMode === "email" ? generateAiEmail : generateAiPost}
                >
                  {aiEmailLoading
                    ? "⏳ Génération en cours…"
                    : aiStudioMode === "email"
                    ? "✨ Générer l'email"
                    : "✨ Générer le post"}
                </button>

                {aiEmailError && (
                  <div style={{ marginTop: 10, background: "#fef3f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#b91c1c" }}>
                    ⚠️ {aiEmailError}
                  </div>
                )}
              </div>

              {/* ── Résultat + historique droite ───────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Résultat email */}
                {aiStudioMode === "email" && aiEmailResult && (
                  <div style={{ ...card }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0d7c6e" }}>✓ Brouillon généré</span>
                      {aiEmailResult.mode === "fallback" && (
                        <span style={{ fontSize: 10, background: "#fff8e6", border: "1px solid #fcd34d", color: "#92400e", borderRadius: 20, padding: "2px 9px", fontWeight: 700 }}>
                          Mode local
                        </span>
                      )}
                    </div>

                    {aiEmailTo && (
                      <div style={{ background: "#f0f4fb", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#4a6b99", marginBottom: 12 }}>
                        <strong>À :</strong> {aiEmailTo}
                      </div>
                    )}

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <label style={{ ...labelStyle, marginBottom: 0, fontSize: 11 }}>SUJET</label>
                        <button style={{ ...btn.base, ...btn.ghost, fontSize: 10, padding: "3px 10px" }} onClick={() => copyToClipboard(aiEmailSubjectEdit, "subject")}>
                          {copiedField === "subject" ? "✓" : "Copier"}
                        </button>
                      </div>
                      <input value={aiEmailSubjectEdit} onChange={e => setAiEmailSubjectEdit(e.target.value)} style={{ ...inputStyle, fontWeight: 600, fontSize: 13 }} />
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <label style={{ ...labelStyle, marginBottom: 0, fontSize: 11 }}>CORPS</label>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ ...btn.base, ...btn.ghost, fontSize: 10, padding: "3px 10px" }} onClick={() => copyToClipboard(aiEmailBodyEdit, "body")}>
                            {copiedField === "body" ? "✓" : "Copier"}
                          </button>
                          <button style={{ ...btn.base, ...btn.ghost, fontSize: 10, padding: "3px 10px" }} onClick={() => { setEmailTemplate("custom"); setEmailCustomBody(aiEmailBodyEdit); setEmailSubject(aiEmailSubjectEdit); setActiveTab("prospection"); setProspectionTab("emailing"); }}>
                            → Campagne
                          </button>
                        </div>
                      </div>
                      <textarea rows={9} value={aiEmailBodyEdit} onChange={e => setAiEmailBodyEdit(e.target.value)} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, fontFamily: "inherit", fontSize: 12 }} />
                    </div>
                  </div>
                )}

                {/* Résultat post social */}
                {aiStudioMode === "post" && aiPostResult && (
                  <div style={{ ...card }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0d7c6e" }}>✓ Post généré</span>
                      <span style={{ fontSize: 10, background: "#fce4f0", border: "1px solid rgba(233,30,140,0.3)", color: "#b5005c", borderRadius: 20, padding: "2px 9px", fontWeight: 700 }}>
                        {aiPostNetwork === "linkedin" ? "LinkedIn" : aiPostNetwork === "instagram" ? "Instagram" : aiPostNetwork === "facebook" ? "Facebook" : aiPostNetwork === "twitter" ? "X/Twitter" : "Générique"}
                      </span>
                      {aiPostResult.mode === "fallback" && (
                        <span style={{ fontSize: 10, background: "#fff8e6", border: "1px solid #fcd34d", color: "#92400e", borderRadius: 20, padding: "2px 9px", fontWeight: 700 }}>Mode local</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label style={{ ...labelStyle, marginBottom: 0, fontSize: 11 }}>TEXTE DU POST</label>
                      <button style={{ ...btn.base, ...btn.ghost, fontSize: 10, padding: "3px 10px" }} onClick={() => copyToClipboard(aiPostTextEdit, "post")}>
                        {copiedField === "post" ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                    <textarea rows={10} value={aiPostTextEdit} onChange={e => setAiPostTextEdit(e.target.value)} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, fontFamily: "inherit", fontSize: 12 }} />
                    {aiPostNetwork === "linkedin" && (
                      <button
                        style={{ ...btn.base, background: "#0a66c2", color: "#fff", marginTop: 10, justifyContent: "center", width: "100%", fontSize: 12 }}
                        onClick={() => { setLinkedinPostForm(f => ({ ...f, commentary: aiPostTextEdit })); setActiveTab("linkedin"); }}
                      >
                        → Publier sur LinkedIn
                      </button>
                    )}
                  </div>
                )}

                {/* Vide */}
                {!aiEmailResult && !aiPostResult && !aiEmailLoading && (
                  <div style={{ ...card, textAlign: "center", color: "#8a9db8", fontSize: 13, padding: "36px 24px" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>✨</div>
                    Décrivez ce que vous voulez à gauche,<br />le brouillon apparaîtra ici.
                  </div>
                )}

                {/* Historique */}
                {aiEmailHistory.length > 0 && (
                  <div style={{ ...card }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78" }}>📋 Historique ({aiEmailHistory.length})</span>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#b91c1c" }}
                        onClick={() => { if (confirm("Vider l'historique ?")) { setAiEmailHistory([]); localStorage.removeItem("lexpat_email_drafts"); } }}>
                        Vider
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
                      {aiEmailHistory.map(entry => (
                        <div key={entry.id}
                          style={{ background: "#f8faff", border: "1px solid #e2eaf3", borderRadius: 9, padding: "9px 12px", cursor: "pointer" }}
                          onClick={() => {
                            if (entry.type === "post") {
                              setAiStudioMode("post");
                              setAiPostResult(entry);
                              setAiPostTextEdit(entry.text || "");
                            } else {
                              setAiStudioMode("email");
                              setAiEmailResult(entry);
                              setAiEmailSubjectEdit(entry.subject || "");
                              setAiEmailBodyEdit(entry.body || "");
                            }
                            setAiEmailPrompt(entry.prompt || "");
                          }}
                        >
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                            <span style={{ fontSize: 10, background: entry.type === "post" ? "#fce4f0" : "#eef1fb", border: `1px solid ${entry.type === "post" ? "rgba(233,30,140,0.2)" : "#d0d8f0"}`, color: entry.type === "post" ? "#b5005c" : "#1E3A78", borderRadius: 20, padding: "1px 7px", fontWeight: 700 }}>
                              {entry.type === "post" ? (entry.network || "Post") : "Email"}
                            </span>
                            <span style={{ fontSize: 11, color: "#8a9db8" }}>
                              {new Date(entry.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                            {entry.subject || (entry.text || "").slice(0, 60) + "…"}
                          </div>
                          <div style={{ fontSize: 11, color: "#8a9db8", fontStyle: "italic", marginTop: 2 }}>
                            "{(entry.prompt || "").slice(0, 70)}{(entry.prompt || "").length > 70 ? "…" : ""}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET LINKEDIN ADS
        ════════════════════════════════════════════════════ */}
        {activeTab === "linkedin" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>📣 Posts LinkedIn</h2>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#8a9db8", lineHeight: 1.6 }}>
                  Générez et publiez des posts organiques sur LinkedIn. Pour les messages directs (DMs) et kits de prospection, utilise l'onglet <strong style={{ color: "#1E3A78", cursor: "pointer" }} onClick={() => setActiveTab("promo")}>Promo</strong>.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  style={{ ...btn.base, ...btn.ghost }}
                  onClick={fetchLinkedinStatus}
                  disabled={linkedinLoading || linkedinActionLoading}
                >
                  {linkedinLoading ? "Chargement..." : "Rafraichir"}
                </button>
                {linkedinStatus?.connected ? (
                  <button
                    style={{ ...btn.base, ...btn.danger }}
                    onClick={disconnectLinkedin}
                    disabled={linkedinActionLoading}
                  >
                    {linkedinActionLoading ? "Deconnexion..." : "Deconnecter LinkedIn"}
                  </button>
                ) : (
                  <button
                    style={{ ...btn.base, ...btn.primary }}
                    onClick={connectLinkedin}
                    disabled={linkedinActionLoading}
                  >
                    {linkedinActionLoading ? "Connexion..." : "Connecter LinkedIn"}
                  </button>
                )}
              </div>
            </div>

            <Alert type={linkedinStatus?.connected ? (linkedinStatus?.expired ? "warning" : "success") : "info"}>
              {linkedinStatus?.connected
                ? linkedinStatus?.expired
                  ? "La connexion LinkedIn existe mais le jeton semble expire. Reconnectez le compte avant d'automatiser des campagnes."
                  : "Le compte LinkedIn Marketing est connecte. Les comptes publicitaires detectes ci-dessous pourront servir de base pour vos futures campagnes."
                : "Aucune connexion LinkedIn enregistree pour cet admin. La connexion utilise l'OAuth LinkedIn avec les scopes marketing requis pour la gestion publicitaire."}
            </Alert>

            {linkedinError && (
              <Alert type="error">
                Erreur LinkedIn : {linkedinError}
              </Alert>
            )}

            {/* ── Note Campaign Builder ── */}
            <div style={{ marginBottom: 20, background: "#f8faff", border: "1px solid #dde4f5", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#607086", display: "flex", alignItems: "center", gap: 8 }}>
              <span>💡</span>
              <span>Le <strong>Campaign Builder LinkedIn Ads</strong> (campagnes payantes, ciblage URN, budgets) est disponible mais masqué. Demande à Candice de le réactiver dans le code si tu en as besoin.</span>
            </div>

            {false && <><div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: 18, alignItems: "start" }}>
              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#1E3A78" }}>Comptes publicitaires detectes</div>
                  {linkedinStatus?.connection?.account_snapshot?.length ? (
                    <span style={{ ...badgeStyle.base, ...badgeStyle.worker }}>
                      {linkedinStatus.connection.account_snapshot.length} compte(s)
                    </span>
                  ) : null}
                </div>

                {linkedinLoading ? (
                  <div style={{ color: "#8a9db8", fontSize: 14 }}>Verification de la connexion LinkedIn...</div>
                ) : !linkedinStatus?.connected ? (
                  <EmptyState text="Connectez votre compte LinkedIn pour lister les comptes publicitaires accessibles." />
                ) : (linkedinStatus.connection.account_snapshot || []).length === 0 ? (
                  <EmptyState text="La connexion est active, mais aucun compte publicitaire accessible n'a ete remonte par LinkedIn pour cet utilisateur." />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(linkedinStatus.connection.account_snapshot || []).map((account) => (
                      <div key={account.accountUrn || account.accountId} style={{ border: "1px solid #e8eef8", borderRadius: 14, padding: "14px 16px", background: "#fbfdff" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                          <div style={{ fontWeight: 800, color: "#1E3A78" }}>
                            {account.accountName || account.accountUrn || "Compte LinkedIn"}
                          </div>
                          <span style={{ ...badgeStyle.base, ...badgeStyle.visible }}>
                            {account.role || "Role inconnu"}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, fontSize: 12, color: "#5d6e83" }}>
                          <div><strong>ID</strong> : {account.accountId || "—"}</div>
                          <div><strong>Statut</strong> : {account.accountStatus || "—"}</div>
                          <div><strong>Type</strong> : {account.accountType || "—"}</div>
                          <div><strong>Devise</strong> : {account.currency || "—"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#1E3A78", marginBottom: 6 }}>Etat de preparation</div>
                  <div style={{ fontSize: 13, color: "#5d6e83", lineHeight: 1.7 }}>
                    Cette etape connecte votre admin a LinkedIn et verifie l'acces Marketing API. La creation pilotee de campagnes dans l'interface pourra venir juste apres.
                  </div>
                </div>

                <div style={{ background: "#f8faff", border: "1px solid #e8eef8", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#57B7AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Conditions LinkedIn
                  </div>
                  <div style={{ fontSize: 13, color: "#3d5470", lineHeight: 1.8 }}>
                    <div>Scopes attendus : <strong>{linkedinStatus?.connection?.scope?.join(", ") || "r_ads, rw_ads"}</strong></div>
                    <div>Compte pub relie a l'application LinkedIn : <strong>obligatoire</strong></div>
                    <div>Acces Marketing API approuve : <strong>obligatoire</strong></div>
                    <div>Jeton expire le : <strong>{linkedinStatus?.connection?.expires_at ? formatDateTime(linkedinStatus.connection.expires_at) : "—"}</strong></div>
                  </div>
                </div>

                <div style={{ background: "#fff8e6", border: "1px solid #f5d58b", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#7a4b00", lineHeight: 1.7 }}>
                  Prochaine etape recommandee : ajouter un vrai "Campaign Builder" LinkedIn dans cet onglet pour choisir un compte pub, definir objectif, budget, audience et lancer la campagne depuis l'admin.
                </div>
              </div>
            </div>

            <div style={{ ...card, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#1E3A78" }}>Campaign Builder</div>
                  <div style={{ fontSize: 13, color: "#6b85a0", marginTop: 4 }}>
                    Creation prudente : un groupe LinkedIn + une campagne en brouillon (`DRAFT`) avec votre ciblage minimum.
                  </div>
                </div>
                <button
                  style={{ ...btn.base, ...btn.primary }}
                  onClick={createLinkedinDraftCampaign}
                  disabled={!linkedinStatus?.connected || linkedinCampaignLoading}
                >
                  {linkedinCampaignLoading ? "Creation en cours..." : "Creer le brouillon LinkedIn"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Compte publicitaire</label>
                  <select
                    value={linkedinBuilder.accountId}
                    onChange={(e) => {
                      const selected = (linkedinStatus?.connection?.account_snapshot || []).find((account) => account.accountId === e.target.value);
                      setLinkedinBuilder((prev) => ({
                        ...prev,
                        accountId: e.target.value,
                        accountCurrency: selected?.currency || prev.accountCurrency,
                      }));
                    }}
                    style={inputStyle}
                  >
                    <option value="">Selectionnez un compte</option>
                    {(linkedinStatus?.connection?.account_snapshot || []).map((account) => (
                      <option key={account.accountId || account.accountUrn} value={account.accountId || ""}>
                        {account.accountName || account.accountUrn || account.accountId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Devise</label>
                  <input
                    value={linkedinBuilder.accountCurrency}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, accountCurrency: e.target.value.toUpperCase() }))}
                    style={inputStyle}
                    placeholder="EUR"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom du groupe</label>
                  <input
                    value={linkedinBuilder.campaignGroupName}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, campaignGroupName: e.target.value }))}
                    style={inputStyle}
                    placeholder="LEXPAT - RH Belgique - Avril"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom de campagne</label>
                  <input
                    value={linkedinBuilder.campaignName}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, campaignName: e.target.value }))}
                    style={inputStyle}
                    placeholder="Traffic vers landing employeurs"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Objectif</label>
                  <select
                    value={linkedinBuilder.objectiveType}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, objectiveType: e.target.value }))}
                    style={inputStyle}
                  >
                    {["BRAND_AWARENESS", "ENGAGEMENT", "LEAD_GENERATION", "WEBSITE_CONVERSIONS", "WEBSITE_VISITS", "VIDEO_VIEWS", "JOB_APPLICANTS"].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select
                    value={linkedinBuilder.campaignType}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, campaignType: e.target.value }))}
                    style={inputStyle}
                  >
                    {["SPONSORED_UPDATES", "TEXT_AD", "SPONSORED_INMAILS", "DYNAMIC"].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Mode campagne</label>
                  <select
                    value={linkedinBuilder.status}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, status: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Mode groupe</label>
                  <select
                    value={linkedinBuilder.campaignGroupStatus}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, campaignGroupStatus: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Facturation</label>
                  <select
                    value={linkedinBuilder.costType}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, costType: e.target.value }))}
                    style={inputStyle}
                  >
                    {["CPC", "CPM", "CPV"].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Budget quotidien</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={linkedinBuilder.dailyBudget}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, dailyBudget: e.target.value }))}
                    style={inputStyle}
                    placeholder="40.00"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Budget total groupe</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={linkedinBuilder.totalBudget}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, totalBudget: e.target.value }))}
                    style={inputStyle}
                    placeholder="600.00"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Debut</label>
                  <input
                    type="datetime-local"
                    value={linkedinBuilder.startAt}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, startAt: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Fin</label>
                  <input
                    type="datetime-local"
                    value={linkedinBuilder.endAt}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, endAt: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Pays locale</label>
                  <input
                    value={linkedinBuilder.localeCountry}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, localeCountry: e.target.value.toUpperCase() }))}
                    style={inputStyle}
                    placeholder="BE"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Langue locale</label>
                  <input
                    value={linkedinBuilder.localeLanguage}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, localeLanguage: e.target.value.toLowerCase() }))}
                    style={inputStyle}
                    placeholder="fr"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 16 }}>
                <div>
                  <label style={labelStyle}>URNs de localisation</label>
                  <textarea
                    value={linkedinBuilder.locationUrns}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, locationUrns: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                    placeholder={"urn:li:geo:...\nurn:li:geo:..."}
                  />
                </div>
                <div>
                  <label style={labelStyle}>URNs de langue interface</label>
                  <textarea
                    value={linkedinBuilder.interfaceLocaleUrns}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, interfaceLocaleUrns: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                    placeholder="urn:li:locale:fr_FR"
                  />
                </div>
                <div>
                  <label style={labelStyle}>URNs entreprises ciblees</label>
                  <textarea
                    value={linkedinBuilder.companyUrns}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, companyUrns: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                    placeholder={"urn:li:organization:...\nurn:li:organization:..."}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Associated entity</label>
                  <input
                    value={linkedinBuilder.associatedEntity}
                    onChange={(e) => setLinkedinBuilder((prev) => ({ ...prev, associatedEntity: e.target.value }))}
                    style={inputStyle}
                    placeholder="urn:li:organization:123456"
                  />
                </div>
              </div>

              <div style={{ marginTop: 14, background: "#f8faff", border: "1px solid #e8eef8", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#5d6e83", lineHeight: 1.8 }}>
                Le builder cree une campagne LinkedIn avec `targetingCriteria`. Le minimum recommande ici est au moins une localisation LinkedIn (`urn:li:geo:...`). Pour les Sponsored Updates, renseigner aussi `associatedEntity` avec l'URN de votre page entreprise LinkedIn est fortement conseille.
              </div>

              {linkedinCampaignResult && (
                <div style={{ marginTop: 16 }}>
                  {linkedinCampaignResult.error ? (
                    <Alert type="error">Creation LinkedIn impossible : {linkedinCampaignResult.error}</Alert>
                  ) : (
                    <Alert type="success">
                      Brouillon cree. Groupe LinkedIn : <strong>{linkedinCampaignResult.campaignGroupId}</strong> · Campagne : <strong>{linkedinCampaignResult.campaignId || "ID non retourne"}</strong>
                    </Alert>
                  )}
                </div>
              )}
            </div>
            </>}
            {/* ── FIN Campaign Builder masqué ── */}

            <div style={{ ...card, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#1E3A78" }}>Posts LinkedIn organiques</div>
                  <div style={{ fontSize: 13, color: "#6b85a0", marginTop: 4 }}>
                    Generez un post depuis l'admin puis publiez-le sur votre profil ou votre page, sans lancer de campagne payante.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    style={{ ...btn.base, ...btn.ghost }}
                    onClick={generateLinkedinPost}
                    disabled={linkedinPostLoading}
                  >
                    {linkedinPostLoading ? "⏳ Génération…" : "✨ Générer avec IA"}
                  </button>
                  <button
                    style={{ ...btn.base, ...btn.primary }}
                    onClick={publishLinkedinPost}
                    disabled={!linkedinStatus?.connected || linkedinPostLoading || !linkedinPostForm.commentary}
                    title={!linkedinStatus?.connected ? "Connectez LinkedIn pour publier" : ""}
                  >
                    {linkedinPostLoading ? "Publication…" : "Publier sur LinkedIn"}
                  </button>
                </div>
              </div>

              {/* Presets rapides */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Démarrage rapide</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "🎯 Simulateur", topic: "Mon recrutement international est-il possible ? Simulateur gratuit", audience: "DRH, PME belges, responsables RH", offer: "Simulateur d'éligibilité gratuit — réponse en 3 minutes sur les listes pénurie 2026", tone: "direct", keywords: "RecrutementInternational, PermisUnique, Belgique, RH", cta: "Testez gratuitement → lexpat-connect.be/simulateur-eligibilite" },
                    { label: "📋 Listes pénurie", topic: "Les listes de pénurie 2026 sont publiées — ce que ça change pour votre recrutement", audience: "Employeurs belges, avocats RH, DRH", offer: "Analyse des nouvelles listes Actiris, Forem et VDAB 2026", tone: "expert", keywords: "ListesPénurie, PermisUnique, RHBelgique, RecrutementHorsUE", cta: "Vérifiez votre poste → lexpat-connect.be/simulateur-eligibilite" },
                    { label: "🤝 Témoignage", topic: "Comment une PME belge a recruté un profil introuvable localement en 3 semaines", audience: "PME belges, fondateurs, dirigeants", offer: "LEXPAT Connect : mise en relation + accompagnement permis unique", tone: "warm", keywords: "Recrutement, PMEBelgique, ImmigrationProfessionnelle", cta: "Découvrez la plateforme → lexpat-connect.be" },
                    { label: "👤 Travailleurs", topic: "Votre profil visible auprès des employeurs belges qui recrutent hors UE", audience: "Professionnels internationaux, expatriés", offer: "Plateforme gratuite pour travailleurs — créez votre profil visible", tone: "warm", keywords: "TravaillerEnBelgique, PermisUnique, Emploi, Expatrié", cta: "Créez votre profil → lexpat-connect.be/inscription" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setLinkedinPostForm((prev) => ({ ...prev, ...preset, commentary: "" }))}
                      style={{ padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid #d0dcf0", background: "#f0f4ff", color: "#1E3A78" }}
                    >{preset.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Sujet</label>
                  <input value={linkedinPostForm.topic} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, topic: e.target.value }))} style={inputStyle} placeholder="Ex: Recruter a l'international en Belgique" />
                </div>
                <div>
                  <label style={labelStyle}>Audience</label>
                  <input value={linkedinPostForm.audience} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, audience: e.target.value }))} style={inputStyle} placeholder="DRH, PME belges, responsables RH" />
                </div>
                <div>
                  <label style={labelStyle}>Offre / message</label>
                  <input value={linkedinPostForm.offer} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, offer: e.target.value }))} style={inputStyle} placeholder="Ce que LEXPAT Connect apporte" />
                </div>
                <div>
                  <label style={labelStyle}>Ton</label>
                  <select value={linkedinPostForm.tone} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, tone: e.target.value }))} style={inputStyle}>
                    <option value="expert">Expert</option>
                    <option value="warm">Chaleureux</option>
                    <option value="direct">Direct</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Mots-cles / hashtags</label>
                  <input value={linkedinPostForm.keywords} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, keywords: e.target.value }))} style={inputStyle} placeholder="Belgique, recrutement, immigration" />
                </div>
                <div>
                  <label style={labelStyle}>CTA</label>
                  <input value={linkedinPostForm.cta} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, cta: e.target.value }))} style={inputStyle} placeholder="Ecrivez-moi pour en parler" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Publier en tant que</label>
                  <select value={linkedinPostForm.author} onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, author: e.target.value }))} style={inputStyle}>
                    <option value="">Selectionnez un auteur</option>
                    {linkedinStatus?.connection?.member_urn ? (
                      <option value={linkedinStatus.connection.member_urn}>
                        {linkedinStatus.connection.member_name || "Mon profil LinkedIn"}
                      </option>
                    ) : null}
                    {(linkedinStatus?.connection?.organization_snapshot || []).map((org) => (
                      <option key={org.urn} value={org.urn}>
                        {org.name} ({(org.roles || []).join(", ") || "Page"})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Texte du post</label>
                  <textarea
                    value={linkedinPostForm.commentary}
                    onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, commentary: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 180, resize: "vertical" }}
                    placeholder="Le texte genere apparaitra ici. Vous pouvez le modifier avant publication."
                  />
                </div>

                {/* ── Image ou lien (optionnel) ── */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    Contenu visuel (optionnel — image OU lien)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {/* Image */}
                    <div style={{ border: "1.5px dashed #c8d8ed", borderRadius: 12, padding: 14, background: "#f8fbff" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1E3A78", marginBottom: 8 }}>🖼 Image</div>
                      {linkedinPostForm.imageDataUrl ? (
                        <div>
                          <img src={linkedinPostForm.imageDataUrl} alt="preview" style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #e3eaf1", marginBottom: 8 }} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "#5d6e83", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{linkedinPostForm.imageFileName}</span>
                            <button
                              type="button"
                              onClick={generateLinkedinImage}
                              disabled={linkedinImageLoading}
                              style={{ fontSize: 11, fontWeight: 700, color: "#1E3A78", background: "#eef2fb", border: "1px solid #c5d4f3", borderRadius: 6, padding: "3px 8px", cursor: linkedinImageLoading ? "wait" : "pointer", flexShrink: 0 }}
                            >
                              {linkedinImageLoading ? "⏳" : "↺ Régénérer"}
                            </button>
                            <button type="button" onClick={() => setLinkedinPostForm((prev) => ({ ...prev, imageDataUrl: "", imageFileName: "" }))} style={{ fontSize: 11, color: "#e74c3c", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>✕</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {/* Génération IA */}
                          <button
                            type="button"
                            onClick={generateLinkedinImage}
                            disabled={linkedinImageLoading}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #1E3A78", background: "linear-gradient(135deg,#1E3A78,#244892)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: linkedinImageLoading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                          >
                            {linkedinImageLoading ? "⏳ Génération en cours…" : "✨ Générer une image IA"}
                          </button>
                          <div style={{ textAlign: "center", fontSize: 10, color: "#b0bec5" }}>ou</div>
                          {/* Upload manuel */}
                          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "8px", borderRadius: 8, border: "1px dashed #c8d8ed" }}>
                            <span style={{ fontSize: 18 }}>📁</span>
                            <span style={{ fontSize: 11, color: "#8a9db8", textAlign: "center" }}>Importer depuis votre appareil</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setLinkedinPostForm((prev) => ({ ...prev, imageDataUrl: ev.target.result, imageFileName: file.name, articleUrl: "" }));
                                };
                                reader.readAsDataURL(file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Lien article */}
                    <div style={{ border: "1.5px dashed #c8d8ed", borderRadius: 12, padding: 14, background: "#f8fbff" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1E3A78", marginBottom: 8 }}>🔗 Lien web (aperçu automatique)</div>
                      <input
                        value={linkedinPostForm.articleUrl}
                        onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, articleUrl: e.target.value, imageDataUrl: e.target.value ? "" : prev.imageDataUrl, imageFileName: e.target.value ? "" : prev.imageFileName }))}
                        style={{ ...inputStyle, marginBottom: 8 }}
                        placeholder="https://lexpat-connect.be/simulateur-eligibilite"
                      />
                      <input
                        value={linkedinPostForm.articleTitle}
                        onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, articleTitle: e.target.value }))}
                        style={{ ...inputStyle, marginBottom: 8 }}
                        placeholder="Titre (optionnel)"
                      />
                      <input
                        value={linkedinPostForm.articleDescription}
                        onChange={(e) => setLinkedinPostForm((prev) => ({ ...prev, articleDescription: e.target.value }))}
                        style={inputStyle}
                        placeholder="Description courte (optionnel)"
                      />
                    </div>
                  </div>
                  {linkedinPostForm.imageDataUrl && linkedinPostForm.articleUrl && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#e97f00", background: "#fff8ed", borderRadius: 8, padding: "6px 10px" }}>
                      ⚠️ Image et lien tous deux renseignés — l'image sera utilisée (LinkedIn n'accepte qu'un seul type de contenu par post).
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 14, background: "#f8faff", border: "1px solid #e8eef8", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#5d6e83", lineHeight: 1.8 }}>
                Si `ANTHROPIC_API_KEY` est configuré, le bouton "Générer avec IA" utilisera Claude (Anthropic). Sinon, fallback sur `OPENAI_API_KEY` si disponible, puis sur un générateur local.
              </div>

              {linkedinPostResult && (
                <div style={{ marginTop: 16 }}>
                  {linkedinPostResult.error ? (
                    <Alert type="error">Publication LinkedIn impossible : {linkedinPostResult.error}</Alert>
                  ) : linkedinPostResult.ok ? (
                    <Alert type="success">Post publié sur LinkedIn ✓ — visible dans l'historique ci-dessous.</Alert>
                  ) : linkedinPostResult.generated ? (
                    <Alert type="success">
                      {linkedinPostResult.mode === "image-ai"
                        ? "Image générée par DALL-E 3 ✨ — vous pouvez la régénérer ou la modifier."
                        : <>Brouillon généré via {linkedinPostResult.mode === "claude" ? "Claude (Anthropic) ✨" : linkedinPostResult.mode === "openai" ? "OpenAI" : "générateur local — ajoutez ANTHROPIC_API_KEY dans Vercel pour utiliser Claude"}. Modifiez le texte puis cliquez sur "Publier sur LinkedIn".</>
                      }
                    </Alert>
                  ) : null}
                </div>
              )}

              {/* ── Historique des posts publiés ── */}
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <button
                    onClick={() => setShowLinkedinHistory(h => !h)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, background: showLinkedinHistory ? "#1E3A78" : "#f0f4fc", color: showLinkedinHistory ? "#fff" : "#1E3A78", border: "1.5px solid #1E3A78", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    📋 Historique des posts {linkedinPostHistory.length > 0 && <span style={{ background: showLinkedinHistory ? "rgba(255,255,255,0.25)" : "#1E3A78", color: "#fff", borderRadius: 100, padding: "1px 8px", fontSize: 11 }}>{linkedinPostHistory.length}</span>}
                  </button>
                  {linkedinPostHistory.length > 0 && (
                    <button
                      onClick={() => { if (confirm("Vider tout l'historique ?")) { setLinkedinPostHistory([]); localStorage.removeItem("lexpat_linkedin_posts"); } }}
                      style={{ fontSize: 11, color: "#e53935", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >Vider</button>
                  )}
                </div>

                {showLinkedinHistory && (
                  <div style={{ border: "1px solid #e2eaf3", borderRadius: 14, overflow: "hidden" }}>
                    {linkedinPostHistory.length === 0 ? (
                      <p style={{ padding: "20px 16px", fontSize: 13, color: "#8a9db8", textAlign: "center" }}>Aucun post publié pour l'instant.</p>
                    ) : (
                      linkedinPostHistory.map((entry, i) => (
                        <div key={entry.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderBottom: i < linkedinPostHistory.length - 1 ? "1px solid #f0f4f8" : "none", background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
                          {/* Miniature image si dispo */}
                          {entry.imageDataUrl ? (
                            <img src={entry.imageDataUrl} alt="" style={{ width: 56, height: 32, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid #e2eaf3" }} />
                          ) : (
                            <div style={{ width: 56, height: 32, background: "#eef1fb", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                              {entry.articleUrl ? "🔗" : "📝"}
                            </div>
                          )}
                          {/* Texte */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E3A78", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {entry.commentary?.slice(0, 90) || "(sans texte)"}…
                            </p>
                            {entry.articleUrl && (
                              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#57B7AF" }}>🔗 {entry.articleUrl}</p>
                            )}
                            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#8a9db8" }}>
                              {new Date(entry.publishedAt).toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              {entry.author && <span style={{ marginLeft: 8, color: "#b0bec5" }}>· {entry.author.split(":").pop()}</span>}
                            </p>
                          </div>
                          {/* Lien LinkedIn si ID disponible */}
                          {entry.id && !entry.id.startsWith("local-") && (
                            <a
                              href={`https://www.linkedin.com/feed/update/${entry.id}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#0077b5", textDecoration: "none", border: "1px solid #0077b5", borderRadius: 8, padding: "4px 10px", whiteSpace: "nowrap" }}
                            >Voir →</a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            ONGLET — SÉCURITÉ DONNÉES
        ════════════════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div>
            {/* En-tête */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>🔒 Sécurité des données</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#8a9db8" }}>
                  Vue d'ensemble de la protection des données, des accès et des secrets configurés. Consultez cet onglet avant toute modification sensible.
                </p>
              </div>
              <button
                style={{ ...btn.base, ...btn.ghost, fontSize: 12, flexShrink: 0 }}
                onClick={() => { setSecurityData(null); fetchSecurityStatus(); }}
              >
                ↺ Actualiser
              </button>
            </div>

            {/* ── Section RGPD & Infrastructure ── */}
            <div style={{ ...card, marginBottom: 28, borderTop: "4px solid #1E3A78" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 15, color: "#1E3A78" }}>🇪🇺 RGPD & Infrastructure — Actions prioritaires</p>
              <p style={{ margin: "0 0 20px", fontSize: 12, color: "#8a9db8" }}>
                Analyse de conformité RGPD de l'infrastructure actuelle. Ces recommandations concernent les prestataires qui hébergent ou traitent les données des membres de la plateforme.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Vercel */}
                <div style={{ border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 16px", background: "#fff5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>▲ Vercel (hébergement du site)</span>
                    <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>✅ Paris cdg1 configuré</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#607086", lineHeight: 1.7 }}>
                    Vercel est une entreprise américaine mais le déploiement est maintenant forcé en Europe. Le fichier <code>vercel.json</code> configure la région <strong>Paris (cdg1)</strong>. Vercel ne stocke pas de données personnelles — il sert uniquement les pages du site. Les données membres restent dans Supabase Paris.
                  </p>
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#15803d" }}>
                    ✅ vercel.json créé — région cdg1 (Paris) active. Vercel Analytics derrière consentement cookie.
                  </div>
                </div>

                {/* Supabase */}
                <div style={{ border: "1px solid #fcd34d", borderRadius: 12, padding: "14px 16px", background: "#fffbeb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>🗄️ Supabase (base de données)</span>
                    <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>✅ Paris (eu-west-3)</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#607086", lineHeight: 1.7 }}>
                    Supabase est une société américaine mais les données sont hébergées en Europe. ✅ La région configurée est <strong>West EU (Paris) — eu-west-3</strong> — toutes les données membres sont physiquement stockées en France, dans l'UE. C'est conforme RGPD. Le RLS est activé sur toutes les tables. Il reste à signer le DPA (accord de traitement des données) avec Supabase.
                  </p>
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#15803d" }}>
                    ✅ Région Paris (eu-west-3) confirmée — données en France, conformité RGPD assurée. Action restante : signer le DPA Supabase (Settings → Legal).
                  </div>
                </div>

                {/* Resend */}
                <div style={{ border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 16px", background: "#fff5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>📧 Resend (envoi d'emails)</span>
                    <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>✅ DPA automatique + SOC 2</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#607086", lineHeight: 1.7 }}>
                    Resend envoie depuis l'Irlande (EU). C'est acceptable pour le RGPD à condition de signer leur DPA. La migration vers Scaleway (100% EU, Paris) reste une option si tu passes à grande échelle, mais n'est pas urgente.
                  </p>
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#15803d" }}>
                    ✅ DPA automatiquement en vigueur à l'inscription. Resend est SOC 2 Type II certifié (audit Vanta 2025–2026). Télécharge le PDF depuis Settings → Documents dans Resend pour tes archives RGPD.
                  </div>
                </div>

                {/* Claude / OpenAI */}
                <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px", background: "#f0fdf4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>✨ Claude IA & OpenAI (génération de textes)</span>
                    <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>✅ Aucune donnée personnelle</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#607086", lineHeight: 1.7 }}>
                    Le code a été vérifié : les prompts envoyés à Claude et OpenAI ne contiennent aucune donnée personnelle de membres (pas de noms, emails, téléphones). Seuls le type d'audience générique et le texte de description saisi par l'admin sont transmis. L'API Anthropic ne réutilise pas ces données pour l'entraînement.
                  </p>
                  <div style={{ background: "#f8f9ff", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#1E3A78" }}>
                    <strong>Seul risque résiduel :</strong> si tu inclus toi-même le nom d'un contact dans le champ prompt (ex : "email pour Thomas, DRH chez Acme"), cette donnée part chez Anthropic. C'est un choix délibéré, pas un flux automatique — à éviter par précaution.
                  </div>
                </div>

                {/* ── Liste des actions encore à faire ── */}
                <div style={{ border: "2px solid #fca5a5", borderRadius: 12, padding: "16px 18px", background: "#fff5f5" }}>
                  <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 14, color: "#b91c1c" }}>📋 Actions RGPD encore à faire</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      {
                        done: false,
                        label: "Signer le DPA Anthropic (Claude)",
                        desc: "Va sur anthropic.com → Legal → Data Processing Agreement. Obligatoire pour utiliser l'API Claude dans un contexte professionnel RGPD.",
                        link: "https://www.anthropic.com/legal/dpa",
                        linkLabel: "anthropic.com/legal/dpa"
                      },
                      {
                        done: false,
                        label: "Signer le DPA OpenAI",
                        desc: "Va sur platform.openai.com → Settings → Privacy → Data Processing Agreement.",
                        link: "https://openai.com/policies/data-processing-addendum",
                        linkLabel: "openai.com/policies/data-processing-addendum"
                      },
                      {
                        done: true,
                        label: "Activer la 2FA sur Gmail ✅",
                        desc: "Fait — la validation en deux étapes est active sur la boîte Gmail liée à l'admin.",
                      },
                      {
                        done: true,
                        label: "Activer la 2FA sur Supabase ✅",
                        desc: "Fait — authentification à deux facteurs activée sur le compte Supabase.",
                      },
                      {
                        done: true,
                        label: "Supprimer le projet Supabase prototype ✅",
                        desc: "Fait — le projet 'syncmjmtaerwrwjsorhy' a été supprimé. L'alerte de sécurité Supabase a disparu.",
                      },
                      {
                        done: true,
                        label: "Supprimer le projet Vercel lexpat-connect-mvp ✅",
                        desc: "Fait — le doublon Vercel a été supprimé. Plus d'erreurs de déploiement.",
                      },
                      {
                        done: false,
                        label: "Mentionner Claude & OpenAI dans la politique de confidentialité",
                        desc: "Ajouter une ligne dans la politique de confidentialité du site : 'Certaines fonctionnalités utilisent des modèles d'IA tiers (Anthropic, OpenAI). Aucune donnée personnelle de membre n'est transmise à ces services.'",
                      },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: item.done ? "#f0fdf4" : "#fff", borderRadius: 8, border: `1px solid ${item.done ? "#bbf7d0" : "#fecaca"}` }}>
                        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.done ? "✅" : "🔲"}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{item.label}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#607086", lineHeight: 1.6 }}>{item.desc}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#1d4ed8", marginTop: 4, display: "inline-block" }}>
                              → {item.linkLabel}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px", background: "#f0fdf4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>💶 Coût infrastructure estimé</span>
                    <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>✅ Raisonnable</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#607086", lineHeight: 1.7 }}>
                    Infrastructure complète, conforme RGPD et défendable devant l'APD belge : <strong>15–18 €/mois en phase prototype</strong>, ~70–80 €/mois en phase de croissance. Soit moins de 800 €/an.
                  </p>
                </div>

              </div>
            </div>

            {securityLoading && (
              <div style={{ color: "#8a9db8", fontSize: 14, padding: "32px 0" }}>Chargement du statut de sécurité…</div>
            )}
            {securityError && (
              <div style={{ ...card, borderLeft: "4px solid #e53e3e", background: "#fff5f5", color: "#c53030", fontSize: 13, padding: "16px 20px", marginBottom: 20 }}>
                ⚠️ {securityError}
              </div>
            )}

            {securityData && (() => {
              const { adminRoles, roleCount, envVars, migrations, hardcodedAdmins, checkedAt } = securityData;

              // ── Helpers visuels ──
              const Pill = ({ ok, labelOk, labelKo }) => (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: ok ? "#f0fdf4" : "#fff5f5",
                  color: ok ? "#15803d" : "#dc2626",
                  border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {ok ? "✓" : "✗"} {ok ? labelOk : labelKo}
                </span>
              );

              // Calcul score global
              const criticalEnv = ["SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "RESEND_API_KEY", "CONTACT_EMAIL"];
              const missingCritical = criticalEnv.filter(k => !envVars[k]);
              const allMigrationsOk = migrations.every(m => m.ok);
              const score = missingCritical.length === 0 && allMigrationsOk ? "good" : missingCritical.length > 0 ? "critical" : "warn";

              return (
                <>
                  {/* ── Bandeau de statut global ── */}
                  <div style={{
                    ...card,
                    marginBottom: 24,
                    borderLeft: `5px solid ${score === "good" ? "#22c55e" : score === "warn" ? "#f59e0b" : "#ef4444"}`,
                    background: score === "good" ? "#f0fdf4" : score === "warn" ? "#fffbeb" : "#fff5f5",
                    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                  }}>
                    <span style={{ fontSize: 32 }}>{score === "good" ? "🟢" : score === "warn" ? "🟡" : "🔴"}</span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 15, color: "#1E3A78" }}>
                        {score === "good" ? "Aucun problème critique détecté" : score === "warn" ? "Migrations incomplètes" : `${missingCritical.length} variable(s) critique(s) manquante(s)`}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#607086" }}>
                        Vérifié le {new Date(checkedAt).toLocaleString("fr-BE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {missingCritical.length > 0 && (
                      <div style={{ marginLeft: "auto", fontSize: 12, color: "#dc2626", fontWeight: 700 }}>
                        Manquant : {missingCritical.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* ── Plan d'action sécurité ── */}
                  <div style={{ ...card, marginBottom: 24, borderLeft: "5px solid #1E3A78" }}>
                    <p style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 14, color: "#1E3A78" }}>📋 Plan d'action sécurité</p>
                    <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

                      {/* Colonne Fait */}
                      <div>
                        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em" }}>✅ Fait — code &amp; base de données</p>
                        {[
                          { label: "Migration 011 appliquée", desc: "RLS activé sur matches et match_notification_logs, fix escalade de privilèges sur user_roles, GRANTs PostgREST, fonction current_user_role()" },
                          { label: "Onglet Sécurité dans le dashboard", desc: "Vue d'ensemble des secrets, migrations, accès et règles d'or" },
                          { label: ".env.local.save protégé", desc: "Ajouté dans .gitignore — ne sera jamais commité par accident" },
                        ].map(item => (
                          <div key={item.label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f4fb" }}>
                            <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                            <div>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{item.label}</p>
                              <p style={{ margin: 0, fontSize: 11, color: "#8a9db8", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Colonne À vérifier */}
                      <div>
                        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.08em" }}>⏳ À vérifier ici même</p>
                        {[
                          { label: "Toutes les migrations affichent ✅", desc: "Panneau « Migrations SQL » ci-dessous — 11/11 requis" },
                          { label: "Secrets critiques configurés", desc: "SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CONTACT_EMAIL — panneau ci-dessous" },
                        ].map(item => (
                          <div key={item.label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f4fb" }}>
                            <span style={{ color: "#f59e0b", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>⏳</span>
                            <div>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{item.label}</p>
                              <p style={{ margin: 0, fontSize: 11, color: "#8a9db8", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Colonne Infrastructure hors code */}
                      <div>
                        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠️ Actions à faire en dehors du code</p>
                        {[
                          { label: "Emails : anti-spam", desc: "Vérifier que les emails envoyés depuis le site arrivent bien dans la boîte de réception (pas dans les spams). À configurer une fois dans OVH." },
                          { label: "Emails : signature numérique", desc: "Une signature invisible protège les emails contre l'usurpation d'identité. À vérifier dans le compte Resend (service d'envoi d'emails)." },
                          { label: "LinkedIn : reconnecter le compte", desc: "Si les posts LinkedIn ne fonctionnent plus, aller dans l'onglet LinkedIn de l'admin et cliquer 'Connecter LinkedIn'." },
                        ].map(item => (
                          <div key={item.label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f4fb" }}>
                            <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>!</span>
                            <div>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{item.label}</p>
                              <p style={{ margin: 0, fontSize: 11, color: "#8a9db8", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>

                    {/* ── Administrateurs actifs ── */}
                    <div style={card}>
                      <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 14, color: "#1E3A78" }}>👤 Administrateurs actifs</p>
                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#8a9db8" }}>Emails hardcodés (toujours admin) :</p>
                      {hardcodedAdmins.map(email => (
                        <div key={email} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0f4fb" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1E3A78", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#1E3A78", fontWeight: 600 }}>{email}</span>
                          <span style={{ marginLeft: "auto", fontSize: 11, color: "#8a9db8" }}>hardcodé</span>
                        </div>
                      ))}
                      {adminRoles.length > 0 && (
                        <>
                          <p style={{ margin: "14px 0 10px", fontSize: 12, color: "#8a9db8" }}>Admins en base (user_roles) :</p>
                          {adminRoles.map(r => (
                            <div key={r.user_id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0f4fb" }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e91e8c", flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: "#607086", fontFamily: "monospace" }}>{r.user_id.slice(0, 8)}…</span>
                              <span style={{ marginLeft: "auto", fontSize: 11, color: "#8a9db8" }}>depuis le {new Date(r.created_at).toLocaleDateString("fr-BE")}</span>
                            </div>
                          ))}
                        </>
                      )}
                      {adminRoles.length === 0 && (
                        <p style={{ fontSize: 12, color: "#22c55e", marginTop: 10 }}>✓ Aucun admin supplémentaire en base — normal si vous n'en avez pas créé.</p>
                      )}
                      <div style={{ marginTop: 14, padding: "10px 12px", background: "#f0f4fb", borderRadius: 10, fontSize: 12, color: "#607086" }}>
                        <strong>Distribution des rôles :</strong>{" "}
                        {Object.entries(roleCount).map(([role, count]) => `${count} ${role}`).join(" · ") || "aucun rôle assigné"}
                      </div>
                    </div>

                    {/* ── Secrets configurés ── */}
                    <div style={card}>
                      <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 14, color: "#1E3A78" }}>🔑 Secrets & variables d'environnement</p>
                      <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8a9db8" }}>Seule la présence est vérifiée — jamais les valeurs.</p>
                      {[
                        { key: "SUPABASE_SERVICE_ROLE_KEY",     label: "Base de données — clé secrète",   critical: true },
                        { key: "NEXT_PUBLIC_SUPABASE_URL",      label: "Base de données — adresse",       critical: true },
                        { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", label: "Base de données — clé publique",  critical: true },
                        { key: "RESEND_API_KEY",                label: "Service d'envoi d'emails",        critical: true },
                        { key: "CONTACT_EMAIL",                 label: "Email administrateur du site",    critical: true },
                        { key: "ANTHROPIC_API_KEY",             label: "Claude IA (génération de textes)", critical: false },
                        { key: "OPENAI_API_KEY",                label: "OpenAI (alternative IA)",         critical: false },
                        { key: "LINKEDIN_CLIENT_ID",            label: "LinkedIn — identifiant",          critical: false },
                        { key: "LINKEDIN_CLIENT_SECRET",        label: "LinkedIn — clé secrète",          critical: false },
                        { key: "NEXT_PUBLIC_GA_MEASUREMENT_ID", label: "Google Analytics",                critical: false },
                      ].map(({ key, label, critical }) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #f0f4fb" }}>
                          <span style={{ fontSize: 14 }}>{envVars[key] ? "✅" : critical ? "🔴" : "⚪"}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: envVars[key] ? "#15803d" : critical ? "#dc2626" : "#8a9db8" }}>{label}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#b0bccf", fontFamily: "monospace" }}>{key}</p>
                          </div>
                          <Pill ok={envVars[key]} labelOk="Configuré" labelKo={critical ? "MANQUANT" : "Non défini"} />
                        </div>
                      ))}
                    </div>

                    {/* ── État des migrations ── */}
                    <div style={card}>
                      <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 14, color: "#1E3A78" }}>🗄️ Migrations SQL ({migrations.filter(m => m.ok).length}/{migrations.length} détectées)</p>
                      <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8a9db8" }}>Vérification par existence des tables en base.</p>
                      {migrations.map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: "1px solid #f0f4fb" }}>
                          <span style={{ fontSize: 13, marginTop: 1 }}>{m.ok ? "✅" : "❌"}</span>
                          <div>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{m.id}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#8a9db8" }}>{m.label}</p>
                          </div>
                        </div>
                      ))}
                      {!allMigrationsOk && (
                        <div style={{ marginTop: 14, padding: "10px 12px", background: "#fff5f5", borderRadius: 10, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
                          ⚠️ Des migrations manquent. Appliquez-les dans Supabase → SQL Editor depuis le dossier <code>supabase/</code> du projet.
                        </div>
                      )}
                    </div>

                    {/* ── Matrice des accès par table ── */}
                    <div style={{ ...card, gridColumn: "1 / -1" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 14, color: "#1E3A78" }}>📋 Qui voit quoi sur le site</p>
                      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#8a9db8" }}>Résumé des droits d'accès selon le type d'utilisateur. Les données sensibles (emails, téléphones, documents) ne sont jamais visibles par des inconnus.</p>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#f0f4fb" }}>
                              {["Données", "Visiteur inconnu", "Travailleur connecté", "Employeur connecté", "Admin", "Niveau de confidentialité"].map(h => (
                                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#607086", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { table: "worker_profiles",         anon: "profils visibles (job+secteur)", worker: "son propre profil", employer: "profils visibles", admin: "tout", sensitive: "🔴 nom, email, tel, adresse" },
                              { table: "worker_cv_items",         anon: "—", worker: "ses propres items", employer: "—", admin: "tout", sensitive: "🟡 historique pro" },
                              { table: "worker_documents",        anon: "—", worker: "ses propres docs", employer: "—", admin: "tout", sensitive: "🔴 docs identité, CV" },
                              { table: "employer_profiles",       anon: "—", worker: "—", employer: "son profil", admin: "tout", sensitive: "🟡 infos société" },
                              { table: "employer_members",        anon: "—", worker: "—", employer: "ses membres", admin: "tout", sensitive: "🟡 email pro, tel" },
                              { table: "job_offers",              anon: "offres publiées", worker: "offres publiées", employer: "ses offres", admin: "tout", sensitive: "🟢 non" },
                              { table: "job_applications",        anon: "—", worker: "ses candidatures", employer: "candidatures sur ses offres", admin: "tout", sensitive: "🟡 notes employeur" },
                              { table: "matches",                 anon: "—", worker: "ses matchs", employer: "matchs sur ses offres", admin: "tout", sensitive: "🟡 score de matching" },
                              { table: "conversations / messages",anon: "—", worker: "ses conversations", employer: "ses conversations", admin: "tout", sensitive: "🔴 messages privés" },
                              { table: "user_roles",              anon: "—", worker: "son propre rôle", employer: "son propre rôle", admin: "tout", sensitive: "🟡 rôle app" },
                              { table: "referrals",               anon: "—", worker: "ses parrainages", employer: "—", admin: "tout", sensitive: "🟡 liens de parrainage" },
                              { table: "test_feedback",           anon: "—", worker: "—", employer: "—", admin: "service_role only", sensitive: "🟡 feedback testeurs" },
                              { table: "email_campaigns",         anon: "—", worker: "—", employer: "—", admin: "service_role only", sensitive: "🔴 liste emails envoyés" },
                              { table: "match_notification_logs", anon: "—", worker: "—", employer: "—", admin: "service_role only", sensitive: "🔴 emails utilisateurs" },
                              { table: "linkedin_admin_connections", anon: "—", worker: "—", employer: "—", admin: "propriétaire only", sensitive: "🔴 token OAuth LinkedIn" },
                            ].map((row, i) => (
                              <tr key={row.table} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfd", borderBottom: "1px solid #f0f4fb" }}>
                                <td style={{ padding: "8px 12px", fontWeight: 700, color: "#1E3A78", fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>{row.table}</td>
                                <td style={{ padding: "8px 12px", color: row.anon === "—" ? "#c5cdd8" : "#607086" }}>{row.anon}</td>
                                <td style={{ padding: "8px 12px", color: row.worker === "—" ? "#c5cdd8" : "#607086" }}>{row.worker}</td>
                                <td style={{ padding: "8px 12px", color: row.employer === "—" ? "#c5cdd8" : "#607086" }}>{row.employer}</td>
                                <td style={{ padding: "8px 12px", color: "#607086" }}>{row.admin}</td>
                                <td style={{ padding: "8px 12px" }}>{row.sensitive}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ── Règles d'or ── */}
                    <div style={{ ...card, gridColumn: "1 / -1", borderTop: "4px solid #f59e0b", background: "#fffbeb" }}>
                      <p style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 14, color: "#92400e" }}>⚠️ Ce qu'il ne faut jamais faire</p>

                      {/* Recommandations connexion admin */}
                      <div style={{ marginBottom: 20, padding: "14px 16px", background: "#f0f7ff", border: "1px solid #b8d8f5", borderRadius: 12 }}>
                        <p style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 13, color: "#1E3A78" }}>🔐 Connexion à ce dashboard — recommandations</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[
                            { icon: "✅", text: "Utilise toujours le mode Magic Link (lien par email) plutôt que le mot de passe — si quelqu'un vole ton mot de passe, il ne peut pas entrer sans accès à ta boîte email." },
                            { icon: "✅", text: "Active la double authentification (2FA) sur ton compte Gmail — c'est le maillon clé. Sans accès à ta boîte email, personne ne peut se connecter à l'admin via magic link." },
                            { icon: "✅", text: "Active la 2FA sur ton compte Supabase → supabase.com → Account Settings → Security." },
                            { icon: "⚠️", text: "Ne partage jamais le lien /admin avec quelqu'un qui n'est pas admin. La page est publique mais seules les adresses autorisées peuvent se connecter." },
                          ].map(({ icon, text }, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#3d5470", lineHeight: 1.6 }}>
                              <span style={{ flexShrink: 0 }}>{icon}</span>
                              <span>{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                        {[
                          { icon: "🚫", title: "Ne jamais partager les clés secrètes du site", desc: "Les clés de la base de données et des services (emails, IA) ne doivent jamais être envoyées par email, mises dans un doc partagé ou visible dans le code public." },
                          { icon: "🚫", title: "Les données personnelles des membres sont protégées", desc: "Les informations privées (téléphone, email, adresse) d'un travailleur ne sont visibles que par lui-même et par l'admin. Jamais par un visiteur non connecté." },
                          { icon: "🚫", title: "Seul un développeur peut donner l'accès admin", desc: "Pour donner l'accès admin à une nouvelle personne, il faut passer par le développeur — il n'est pas possible de se promouvoir admin soi-même depuis le site." },
                          { icon: "🚫", title: "Les mots de passe du site ne sont jamais dans le code", desc: "Toutes les clés secrètes sont stockées dans Vercel (variables d'environnement), jamais dans les fichiers du projet ni sur GitHub." },
                        ].map(rule => (
                          <div key={rule.title} style={{ padding: "12px 14px", background: "#fff", borderRadius: 12, border: "1px solid #fde68a" }}>
                            <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#92400e" }}>{rule.icon} {rule.title}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#78350f", lineHeight: 1.6 }}>{rule.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              );
            })()}
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

      {/* ══ PROMO ══════════════════════════════════════════════════════════════ */}
      {activeTab === "promo" && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#1E3A78" }}>📣 Kit de promotion</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#8a9db8" }}>Textes prêts à copier-coller, QR code et liens trackés — pour promouvoir LEXPAT Connect partout.</p>
          </div>

          {/* ── Section 1 : Kit de communication ── */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>💬 Messages prêts à l'emploi</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {[
                {
                  key: "employer_linkedin",
                  audience: "👔 Employeur",
                  channel: "LinkedIn DM",
                  color: "#0a66c2",
                  text: `Bonjour [Prénom],\n\nJe voulais vous partager une ressource utile si vous recrutez dans des métiers en tension : LEXPAT Connect permet d'accéder à des profils internationaux qualifiés dans les métiers en pénurie en Belgique.\n\nSi le recrutement nécessite un permis unique, le cabinet d'avocats LEXPAT prend le relais directement — pas besoin de gérer ça de votre côté.\n\nLien : https://lexpat-connect.be/employeurs\n\nBonne journée,\nCandice`,
                },
                {
                  key: "employer_email",
                  audience: "👔 Employeur",
                  channel: "Email froid",
                  color: "#1E3A78",
                  text: `Objet : Profils internationaux qualifiés dans les métiers en pénurie — LEXPAT Connect\n\nBonjour [Prénom],\n\nVous recrutez dans un métier difficile à pourvoir localement ?\n\nLEXPAT Connect vous donne accès à des travailleurs internationaux qualifiés dans les métiers en pénurie en Belgique — avec un cadre juridique sécurisé si un permis unique est nécessaire.\n\n→ Voir les profils disponibles : https://lexpat-connect.be/base-de-profils\n→ Vérifier l'éligibilité de votre poste (gratuit, 3 min) : https://lexpat-connect.be/simulateur-eligibilite\n\nJe reste disponible si vous avez des questions.\n\nBien à vous,\nCandice Debruyne\ncabinet LEXPAT — lexpat-connect.be`,
                },
                {
                  key: "employer_pitch",
                  audience: "👔 Employeur",
                  channel: "Pitch oral 30 sec",
                  color: "#57B7AF",
                  text: `LEXPAT Connect, c'est une plateforme belge qui connecte les employeurs à des travailleurs internationaux qualifiés dans les métiers en pénurie. Ce qui nous différencie : si le recrutement nécessite un permis unique, le cabinet d'avocats LEXPAT gère tout le juridique — sans changer d'interlocuteur. Tout est dans un seul endroit : lexpat-connect.be`,
                },
                {
                  key: "worker_whatsapp",
                  audience: "🧑‍💼 Travailleur",
                  channel: "WhatsApp / message",
                  color: "#25D366",
                  text: `Bonjour ! Je voulais vous partager une plateforme belge qui peut vous aider à trouver un emploi en Belgique dans votre domaine : LEXPAT Connect.\n\nVous créez un profil gratuit et les employeurs belges qui recrutent dans votre secteur peuvent vous trouver directement. Si un permis de travail est nécessaire, un cabinet d'avocats s'en occupe.\n\nLien pour s'inscrire : https://lexpat-connect.be/travailleurs`,
                },
                {
                  key: "partner_network",
                  audience: "🤝 Partenaire / réseau",
                  channel: "Email ou message réseau",
                  color: "#8b5cf6",
                  text: `Bonjour [Prénom],\n\nJe développe actuellement LEXPAT Connect, une plateforme belge de recrutement international dans les métiers en pénurie, adossée au cabinet d'avocats LEXPAT.\n\nJe serais ravie d'explorer si une collaboration ou un échange de bonnes pratiques pourrait avoir du sens entre nos structures.\n\nVous trouverez plus d'informations ici : https://lexpat-connect.be\n\nBien à vous,\nCandice`,
                },
              ].map(({ key, audience, channel, color, text }) => (
                <div key={key} style={{ ...card, borderLeft: `3px solid ${color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A78" }}>{audience}</span>
                      <span style={{ fontSize: 11, background: "#f0f4fb", border: "1px solid #dde4f5", borderRadius: 20, padding: "2px 10px", color: "#607086" }}>{channel}</span>
                    </div>
                    <button
                      style={{ ...btn.base, ...btn.ghost, fontSize: 11, padding: "4px 14px" }}
                      onClick={() => copyPromo(text, key)}
                    >
                      {promoCopied === key ? "✓ Copié !" : "Copier"}
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: 12, color: "#3d5470", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", background: "#f8faff", borderRadius: 8, padding: "10px 14px" }}>
                    {text}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2 : QR Code ── */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>📱 QR Code</h3>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center", ...card }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(promoBase)}&bgcolor=ffffff&color=1E3A78&margin=2`}
                  alt="QR Code LEXPAT Connect"
                  style={{ border: "1px solid #e2eaf3", borderRadius: 8 }}
                />
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(promoBase)}&bgcolor=ffffff&color=1E3A78&margin=4`}
                  download="qr-lexpat-connect.png"
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...btn.base, ...btn.ghost, fontSize: 12 }}
                >
                  ⬇ Télécharger (HD)
                </a>
              </div>
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#1E3A78" }}>À imprimer ou partager</p>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#607086", lineHeight: 1.7 }}>
                  Ce QR code pointe vers <strong>lexpat-connect.be</strong>. Utilisez-le sur vos cartes de visite, présentations, salons RH ou formations.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Carte de visite", "Présentation PowerPoint", "Salon / événement RH", "Formation ou conférence", "Email signature"].map(use => (
                    <span key={use} style={{ fontSize: 11, background: "#f0f4fb", border: "1px solid #dde4f5", borderRadius: 20, padding: "4px 12px", color: "#4a6b99" }}>{use}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3 : Liens UTM ── */}
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#1E3A78" }}>🔗 Liens trackés</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8a9db8" }}>
              Un lien tracké te permet de savoir combien de personnes ont cliqué depuis LinkedIn, un email ou un événement — et si elles se sont inscrites. Tu partages ce lien à la place du lien normal.
            </p>
            <div style={{ ...card }}>

              {/* Étape 1 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E3A78", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78" }}>D'où vient ce lien ? <span style={{ fontWeight: 400, color: "#8a9db8" }}>(où tu vas le partager)</span></span>
                </div>
                <select value={utmSource} onChange={e => setUtmSource(e.target.value)} style={inputStyle}>
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="evenement">Événement / salon</option>
                  <option value="partenaire">Partenaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Étape 2 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E3A78", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78" }}>Sur quelle page du site tu veux envoyer les gens ?</span>
                </div>
                <select value={utmPage} onChange={e => setUtmPage(e.target.value)} style={inputStyle}>
                  <option value="/">Page d'accueil</option>
                  <option value="/employeurs">Page Employeurs</option>
                  <option value="/travailleurs">Page Travailleurs</option>
                  <option value="/base-de-profils">Voir les profils disponibles</option>
                  <option value="/simulateur-eligibilite">Simulateur d'éligibilité</option>
                  <option value="/permis-unique">Guide permis unique</option>
                  <option value="/recrutement-international">Recrutement international</option>
                </select>
              </div>

              {/* Étape 3 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E3A78", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1E3A78" }}>Donne un nom à cette action <span style={{ fontWeight: 400, color: "#8a9db8" }}>(pour te souvenir dans Analytics)</span></span>
                </div>
                <input type="text" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} style={inputStyle} placeholder="ex: salon-rh-juin-2026" />
              </div>

              {/* Résultat */}
              <div style={{ background: "#f0f4fb", border: "2px solid #1E3A78", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ton lien tracké — copie-le et utilise-le à la place du lien normal</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <code style={{ fontSize: 12, color: "#1E3A78", wordBreak: "break-all", flex: 1 }}>{buildUtm()}</code>
                  <button style={{ ...btn.base, ...btn.primary, fontSize: 12, flexShrink: 0 }} onClick={() => copyPromo(buildUtm(), "utm")}>
                    {promoCopied === "utm" ? "✓ Copié !" : "📋 Copier ce lien"}
                  </button>
                </div>
              </div>

              {/* Liens rapides */}
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A78", marginBottom: 10 }}>⚡ Liens rapides — prêts à l'emploi :</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "📘 Post LinkedIn → page Employeurs", url: `${promoBase}/employeurs?utm_source=linkedin&utm_medium=social&utm_campaign=prospection-employeurs` },
                    { label: "📧 Email → Simulateur d'éligibilité", url: `${promoBase}/simulateur-eligibilite?utm_source=email&utm_medium=email&utm_campaign=prospection-simulateur` },
                    { label: "📱 QR code salon → Accueil", url: `${promoBase}/?utm_source=evenement&utm_medium=qr&utm_campaign=networking-2026` },
                    { label: "💬 WhatsApp → page Travailleurs", url: `${promoBase}/travailleurs?utm_source=whatsapp&utm_medium=social&utm_campaign=prospection-travailleurs` },
                  ].map(({ label, url }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8faff", borderRadius: 8, padding: "8px 12px", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#3d5470" }}>{label}</span>
                      <button style={{ ...btn.base, ...btn.ghost, fontSize: 11, padding: "3px 12px", flexShrink: 0 }} onClick={() => copyPromo(url, label)}>
                        {promoCopied === label ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ══ FIN PROMO ════════════════════════════════════════════════════════════ */}

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
