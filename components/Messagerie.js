"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";

/* ═══════════════════════════════════════════════════════════════════════════
   LEXPAT Connect — Module Messagerie MVP
   Architecture : double-intérêt → chat, inspiré Tinder / LinkedIn Recruiter
   Supabase-ready : toutes les structures suivent le schéma SQL défini.
   AI-ready      : hooks / events prévus pour résumé, suggestions, scoring.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Palette ────────────────────────────────────────────────────────────── */
const C = {
  dark:    "#1E3A78",
  mid:     "#204E97",
  light:   "#eef1fb",
  border:  "#c5d4f3",
  teal:    "#57B7AF",
  tealSoft:"#eaf4f3",
  red:     "#B5121B",
  ink:     "#222222",
  muted:   "#607086",
  line:    "#e3eaf1",
  surface: "#f8fafb",
};

/* ══════════════════════════════════════════════════════════════════════════
   MOCK DATA — Supabase-ready schema
   Tables : conversations, messages, conversation_actions
   ══════════════════════════════════════════════════════════════════════════ */

/* Status workflow */
const STATUS = {
  MATCH_CONFIRMED:    "match_confirmed",
  FIRST_MSG_SENT:     "first_message_sent",
  DISCUSSION_ACTIVE:  "discussion_active",
  INTERVIEW_REQUESTED:"interview_requested",
  LEGAL_REVIEW:       "legal_review_needed",
  CLOSED:             "closed",
};

const STATUS_LABEL = {
  match_confirmed:     { label: "Match confirmé",      color: C.teal,  bg: C.tealSoft },
  first_message_sent:  { label: "Premier contact",     color: C.mid,   bg: C.light    },
  discussion_active:   { label: "En discussion",       color: C.dark,  bg: C.light    },
  interview_requested: { label: "Entretien demandé",   color: "#7c3aed", bg: "#f5f3ff" },
  legal_review_needed: { label: "Autorisation de travail requise", color: C.red, bg: "#fff0f0" },
  closed:              { label: "Clôturé",             color: C.muted, bg: "#f1f5f9"  },
};


/* ══════════════════════════════════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════════════════════════════════ */

const REGION_LABELS = {
  fr: {
    brussels: "Bruxelles-Capitale",
    wallonia: "Wallonie",
    flanders: "Flandre",
  },
  en: {
    brussels: "Brussels-Capital",
    wallonia: "Wallonia",
    flanders: "Flanders",
  }
};

function displayRegion(region, locale = "fr") {
  if (!region) return "";
  return REGION_LABELS[locale]?.[region?.toLowerCase()] || region;
}

function formatTime(iso, locale = "fr") {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  const localeCode = locale === "en" ? "en-GB" : "fr-BE";
  if (days === 0) return d.toLocaleTimeString(localeCode, { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return locale === "en" ? "Yesterday" : "Hier";
  if (days < 7) return d.toLocaleDateString(localeCode, { weekday: "short" });
  return d.toLocaleDateString(localeCode, { day: "2-digit", month: "2-digit" });
}

function formatTimestamp(iso, locale = "fr") {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(locale === "en" ? "en-GB" : "fr-BE", { hour: "2-digit", minute: "2-digit" });
}

function getLocalizedStatusLabel(status, locale = "fr") {
  const baseLabel = STATUS_LABEL[status]?.label || STATUS_LABEL.match_confirmed.label;
  const labels = {
    fr: {
      "Match confirmé": "Match confirmé",
      "Premier contact": "Premier contact",
      "En discussion": "En discussion",
      "Entretien demandé": "Entretien demandé",
      "Autorisation de travail requise": "Autorisation de travail requise",
      "Clôturé": "Clôturé",
    },
    en: {
      "Match confirmé": "Confirmed match",
      "Premier contact": "First contact",
      "En discussion": "In discussion",
      "Entretien demandé": "Interview requested",
      "Autorisation de travail requise": "Work authorization required",
      "Clôturé": "Closed",
    },
  };
  return labels[locale]?.[baseLabel] || baseLabel;
}

function Avatar({ initials, color, size = 40 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ICONS
   ══════════════════════════════════════════════════════════════════════════ */
function IconSearch() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPaperclip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
      <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheckDouble() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
      <path d="M2 10l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7" strokeLinecap="round" />
      <rect x="4" y="8" width="16" height="11" rx="1.5" />
      <path d="M4 12h16" strokeLinecap="round" />
    </svg>
  );
}
function IconScale() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18M3 6l4.5 9H3m-1-9h9m9 0l-4.5 9h4.5M15 6h9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── InfoTooltip — point d'information cliquable ───────────────────────── */
function InfoTooltip({ text, locale = "fr" }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-all hover:scale-110"
        style={{ background: C.teal, color: "#fff", boxShadow: "0 1px 4px rgba(87,183,175,0.4)" }}
        title={locale === "en" ? "Learn more about the single permit" : "En savoir plus sur le permis unique"}
      >
        i
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-xl p-3 text-[11px] leading-relaxed shadow-lg"
          style={{ background: "#fff", border: `1px solid ${C.border}`, color: C.muted, textTransform: "none", letterSpacing: "normal", fontWeight: "normal" }}
        >
          {text}
          <button
            onClick={() => setOpen(false)}
            className="mt-2 block text-[10px] font-semibold"
            style={{ color: C.mid }}
          >
            {locale === "en" ? "Close" : "Fermer"}
          </button>
        </div>
      )}
    </span>
  );
}
function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v2M12 19v2M3 12H5M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h12M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M16 10H4M9 6l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PANEL GAUCHE — ConversationList
   ══════════════════════════════════════════════════════════════════════════ */
function ConversationList({ conversations, activeId, onSelect, className = "w-full md:w-[300px]", locale = "fr" }) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.worker.name.toLowerCase().includes(q) ||
      c.employer.name.toLowerCase().includes(q) ||
      c.job_title.toLowerCase().includes(q)
    );
  });

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r ${className}`}
      style={{ borderColor: C.line, background: "#fff" }}
    >
      {/* Header */}
      <div className="border-b px-4 py-4" style={{ borderColor: C.line }}>
        <h2
          className="font-heading text-[15px] font-bold tracking-tight"
          style={{ color: C.dark }}
        >
          {locale === "en" ? "Inbox" : "Messagerie"}
        </h2>
        <p className="mt-0.5 text-xs" style={{ color: C.muted }}>
          {conversations.filter((c) => c.unread > 0).length} {locale === "en" ? "unread message(s)" : "message(s) non lu(s)"}
        </p>
        {/* Search */}
        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: C.surface, border: `1.5px solid ${C.line}` }}
        >
          <span style={{ color: C.muted }}>
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder={locale === "en" ? "Search…" : "Rechercher…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none"
            style={{ color: C.ink, fontFamily: "var(--font-open-sans)" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm" style={{ color: C.muted }}>
            {locale === "en" ? "No conversation found" : "Aucune conversation trouvée"}
          </div>
        )}
        {filtered.map((conv) => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            active={conv.id === activeId}
            onSelect={onSelect}
            locale={locale}
          />
        ))}
      </div>
    </aside>
  );
}

function ConversationItem({ conv, active, onSelect, locale = "fr" }) {
  const statusInfo = STATUS_LABEL[conv.status] || STATUS_LABEL.match_confirmed;
  const localizedStatusLabel = getLocalizedStatusLabel(conv.status, locale);

  return (
    <button
      onClick={() => onSelect(conv.id)}
      className="w-full text-left transition-colors duration-150"
      style={{
        background: active ? C.light : "transparent",
        borderLeft: active ? `3px solid ${C.dark}` : "3px solid transparent",
      }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Avatars stacked */}
        <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
          <Avatar initials={conv.employer.initials} color={conv.employer.color} size={36} />
          <div className="absolute -bottom-1 -right-1">
            <Avatar initials={conv.worker.initials} color={conv.worker.color} size={24} />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <p
                className="truncate font-heading text-[13px] font-semibold leading-tight"
                style={{ color: C.dark }}
              >
                {conv.employer.name}
              </p>
              <p className="truncate text-[11px]" style={{ color: C.muted }}>
                {conv.worker.name} · {conv.job_title}
              </p>
            </div>
            <span className="shrink-0 text-[10px]" style={{ color: C.muted }}>
              {formatTime(conv.last_message_at, locale)}
            </span>
          </div>

          {/* Last message */}
          <p
            className="mt-1 line-clamp-1 text-[12px]"
            style={{
              color: conv.unread > 0 ? C.ink : C.muted,
              fontWeight: conv.unread > 0 ? 600 : 400,
            }}
          >
            {conv.last_message || (locale === "en" ? "Confirmed match — start the conversation" : "Match confirmé — démarrez la conversation")}
          </p>

          {/* Footer: status + unread badge */}
          <div className="mt-1.5 flex items-center justify-between">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                color: statusInfo.color,
                background: statusInfo.bg,
              }}
            >
              {localizedStatusLabel}
            </span>
            {conv.unread > 0 && (
              <span
                className="flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ background: C.dark, minWidth: 18, height: 18 }}
              >
                {conv.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function StartConversationPanel({ matches, onStart, startingId, locale = "fr" }) {
  if (!matches.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" style={{ background: C.surface }}>
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: C.light }}
        >
          <span style={{ color: C.dark, fontSize: 32 }}>💬</span>
        </div>
        <p className="mt-4 font-heading text-base font-semibold" style={{ color: C.dark }}>
          {locale === "en" ? "No active conversation" : "Aucune conversation active"}
        </p>
        <p className="mt-2 max-w-md text-sm leading-7" style={{ color: C.muted }}>
          {locale === "en"
            ? "Once a match is confirmed on both sides, you can start the first exchange here."
            : "Quand un match est confirmé des deux côtés, vous pouvez démarrer ici le premier échange avec votre match."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8" style={{ background: C.surface }}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[30px] border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]" style={{ borderColor: C.line }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.teal }}>
            {locale === "en" ? "Ready to contact" : "Matchs confirmés"}
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight" style={{ color: C.dark }}>
            {locale === "en" ? "Start a conversation" : "Démarrer une conversation avec votre match"}
          </h2>
          <p className="mt-3 text-sm leading-7" style={{ color: C.muted }}>
            {locale === "en"
              ? "Your confirmed matches appear here. Open the conversation to contact the right person directly."
              : "Vos matchs confirmés apparaissent ici. Cliquez sur le bouton pour ouvrir la messagerie avec la bonne personne."}
          </p>

          <div className="mt-6 grid gap-4">
            {matches.map((match) => (
              <article
                key={match.id}
                className="rounded-[24px] border bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] p-5"
                style={{ borderColor: C.line }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-lg font-bold tracking-tight" style={{ color: C.dark }}>
                    {match.offer?.title || match.job_title || (locale === "en" ? "Role" : "Poste")}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: C.muted }}>
                      {[match.offer?.sector || match.sector, displayRegion(match.offer?.region || match.region, locale)].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 text-xs font-semibold" style={{ color: C.mid }}>
                    {locale === "en" ? "Compatibility score:" : "Score de compatibilité :"} {match.score || match.compatibility_score || 0}%
                    </p>
                  </div>

                  <button
                    onClick={() => onStart(match.id)}
                    disabled={startingId === match.id}
                    className="rounded-2xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ background: C.dark }}
                  >
                    {startingId === match.id ? (locale === "en" ? "Opening…" : "Ouverture…") : (locale === "en" ? "Open conversation" : "Parler à mon match")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ZONE CENTRALE — ChatWindow
   ══════════════════════════════════════════════════════════════════════════ */
function ChatWindow({ conversation, messages, onSendMessage, onRequestInterview, onBack, locale = "fr" }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center" style={{ background: C.surface }}>
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: C.light }}
        >
          <span style={{ color: C.dark, fontSize: 32 }}>💬</span>
        </div>
        <p className="mt-4 font-heading text-base font-semibold" style={{ color: C.dark }}>
          {locale === "en" ? "Select a conversation" : "Sélectionnez une conversation"}
        </p>
        <p className="mt-1 text-sm" style={{ color: C.muted }}>
          {locale === "en" ? "Your messages will appear here" : "Vos échanges apparaîtront ici"}
        </p>
      </div>
    );
  }

  const isNewMatch = conversation.status === STATUS.MATCH_CONFIRMED && messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden" style={{ background: C.surface }}>
      {/* Chat header */}
      <div
        className="flex shrink-0 items-center gap-3 border-b px-6 py-4"
        style={{ background: "#fff", borderColor: C.line }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border md:hidden"
            style={{ borderColor: C.line, color: C.dark, background: C.surface }}
            aria-label={locale === "en" ? "Back to conversations" : "Revenir aux conversations"}
          >
            <IconArrowLeft />
          </button>
        ) : null}
        <div className="relative" style={{ width: 48, height: 40 }}>
          <Avatar initials={conversation.employer.initials} color={conversation.employer.color} size={40} />
          <div className="absolute -bottom-1 -right-1">
            <Avatar initials={conversation.worker.initials} color={conversation.worker.color} size={26} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[15px] font-bold leading-tight" style={{ color: C.dark }}>
            {conversation.employer.name} × {conversation.worker.name}
          </p>
          <p className="text-[12px]" style={{ color: C.muted }}>
            {conversation.job_title} · {displayRegion(conversation.region, locale)}
          </p>
        </div>
        {/* Score badge */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ background: C.tealSoft, color: C.teal }}
        >
          <IconStar />
          <span className="font-heading text-[13px] font-bold">
            {conversation.compatibility_score}%
          </span>
        </div>
      </div>

      {/* New match banner */}
      {isNewMatch && (
        <div
          className="mx-4 mt-4 flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: C.light, border: `1.5px solid ${C.border}` }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: C.dark }}
          >
            <span className="text-base text-white">✦</span>
          </div>
          <div>
            <p className="font-heading text-[13px] font-bold" style={{ color: C.dark }}>
              {locale === "en" ? "Confirmed match!" : "Match confirmé !"}
            </p>
            <p className="text-[12px]" style={{ color: C.muted }}>
                {locale === "en"
                ? "Both sides have shown interest. You can now start the conversation."
                : "Les deux parties ont exprimé leur intérêt. Démarrez la conversation."}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && !isNewMatch && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm" style={{ color: C.muted }}>
              {locale === "en" ? "No message yet" : "Aucun message pour l'instant"}
            </p>
          </div>
        )}

        {/* AI Summary Hook — prévu pour résumé automatique */}
        {messages.length >= 3 && (
          <AISummaryBar conversation={conversation} messages={messages} locale={locale} />
        )}

        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} conversation={conversation} viewerRole={conversation.viewer_role} locale={locale} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="shrink-0 border-t px-4 py-3"
        style={{ background: "#fff", borderColor: C.line }}
      >
        {/* AI suggestion hook — espace pour suggestions IA futures */}
        <AISuggestionHook conversation={conversation} onSelect={setInput} locale={locale} />

        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-3"
          style={{ border: `1.5px solid ${C.border}`, background: "#fff" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={locale === "en" ? "Write your message… (Enter to send)" : "Écrivez votre message… (Entrée pour envoyer)"}
            rows={1}
            className="flex-1 resize-none bg-transparent text-[14px] leading-relaxed outline-none"
            style={{
              color: C.ink,
              fontFamily: "var(--font-open-sans)",
              maxHeight: 120,
              overflowY: "auto",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150"
            style={{
              background: input.trim() ? C.dark : C.line,
              color: input.trim() ? "#fff" : C.muted,
            }}
          >
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, conversation, viewerRole, locale = "fr" }) {
  // isMine = ce message est envoyé par le visiteur connecté
  const isMine =
    (viewerRole === "employer" && msg.sender_type === "employer") ||
    (viewerRole === "worker"   && msg.sender_type === "worker");

  // isEmployerMsg = pour déterminer la couleur (bleu foncé = employeur, turquoise = travailleur)
  const isEmployerMsg = msg.sender_type === "employer";

  return (
    <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar
        initials={isEmployerMsg ? conversation.employer.initials : conversation.worker.initials}
        color={isEmployerMsg ? conversation.employer.color : conversation.worker.color}
        size={28}
      />
      <div
        className={`flex max-w-[68%] flex-col ${isMine ? "items-end" : "items-start"}`}
      >
        <div
          className="rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed"
          style={
            isEmployerMsg
              ? {
                  background: C.dark,
                  color: "#fff",
                  borderBottomRightRadius: isMine ? 4 : undefined,
                  borderBottomLeftRadius: !isMine ? 4 : undefined,
                }
              : {
                  background: C.tealSoft,
                  color: C.ink,
                  border: `1px solid rgba(87,183,175,0.28)`,
                  borderBottomRightRadius: isMine ? 4 : undefined,
                  borderBottomLeftRadius: !isMine ? 4 : undefined,
                }
          }
        >
          {msg.content}
        </div>
        <div
          className="mt-1 flex items-center gap-1 px-1 text-[10px]"
          style={{ color: C.muted }}
        >
          <span>{formatTimestamp(msg.created_at, locale)}</span>
          {isMine && (
            <span style={{ color: msg.read ? C.teal : C.muted }}>
              {msg.read ? <IconCheckDouble /> : <IconCheck />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── AI Hooks (UI stubs — ready for backend) ──────────────────────────── */

/**
 * AI_HOOK: conversation_summary
 * Trigger: messages.length >= 3
 * Future: POST /api/ai/summarize { messages } → { summary, key_points, permit_flag }
 */
function AISummaryBar({ conversation, messages, locale = "fr" }) {
  const [open, setOpen] = useState(false);
  // AI_EVENT: permit_detection — scan messages for permit keywords
  const hasPermitKeywords = messages.some((m) =>
    /permis|titre de séjour|autorisation|visa|document/i.test(m.content)
  );

  return (
    <div
      className="mb-4 flex shrink-0 items-center justify-between rounded-xl px-4 py-2.5"
      style={{ background: C.light, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: C.dark }}>
          <IconSparkle />
        </span>
        <span className="text-[12px] font-semibold" style={{ color: C.dark }}>
          {hasPermitKeywords
            ? (locale === "en" ? "⚠️ Work authorization topic detected" : "⚠️ Besoin de permis détecté dans la conversation")
            : (locale === "en" ? "AI conversation summary available" : "Résumé IA disponible")}
        </span>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-bold underline"
        style={{ color: C.mid }}
      >
        {open ? (locale === "en" ? "Hide" : "Masquer") : (locale === "en" ? "View" : "Voir")}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-10 mx-4 mt-1 rounded-xl p-3 text-[12px] shadow-soft"
          style={{ background: "#fff", border: `1px solid ${C.border}`, color: C.muted }}>
          <em>{locale === "en" ? "AI summary coming soon. The integration layer is already in place." : "Résumé IA — bientôt disponible (hook prêt pour intégration LLM)"}</em>
        </div>
      )}
    </div>
  );
}

/**
 * AI_HOOK: reply_suggestions
 * Trigger: last message from other party
 * Future: POST /api/ai/suggest-reply { context, last_message } → string[]
 */
function AISuggestionHook({ conversation, onSelect, locale = "fr" }) {
  const role = conversation?.viewer_role || "worker";
  const isEmployer = role === "employer";

  const employerSuggestions = {
    fr: {
      [STATUS.MATCH_CONFIRMED]: ["Bonjour, je suis intéressé(e) par votre profil. Seriez-vous disponible pour un échange ?"],
      [STATUS.FIRST_MSG_SENT]: ["Pourriez-vous me préciser vos disponibilités pour un entretien ?", "Je vous propose un entretien mercredi ou jeudi, à votre convenance."],
      [STATUS.DISCUSSION_ACTIVE]: ["Je souhaite vous proposer un entretien. Quand êtes-vous disponible ?", "Seriez-vous libre la semaine prochaine pour un premier échange ?"],
      [STATUS.INTERVIEW_REQUESTED]: ["Je vous confirme le créneau. Voici le lien de visio :", "Préférez-vous un entretien en présentiel ou en visioconférence ?"],
      [STATUS.LEGAL_REVIEW]: ["Nous sommes prêts à soutenir votre démarche de permis.", "Pouvez-vous nous transmettre les documents nécessaires ?"],
    },
    en: {
      [STATUS.MATCH_CONFIRMED]: ["Hello, I'm interested in your profile. Would you be available for a quick exchange?"],
      [STATUS.FIRST_MSG_SENT]: ["Could you share your availability for an interview?", "I can offer an interview on Wednesday or Thursday, whichever suits you best."],
      [STATUS.DISCUSSION_ACTIVE]: ["I would like to suggest an interview. When would you be available?", "Would you be available next week for a first conversation?"],
      [STATUS.INTERVIEW_REQUESTED]: ["I confirm the proposed slot. Here is the video link:", "Would you prefer an in-person interview or a video call?"],
      [STATUS.LEGAL_REVIEW]: ["We are ready to support your work authorization process.", "Could you send us the necessary documents?"],
    },
  };

  const workerSuggestions = {
    fr: {
      [STATUS.MATCH_CONFIRMED]: ["Bonjour, merci pour ce match. Je suis très intéressé(e) par ce poste."],
      [STATUS.FIRST_MSG_SENT]: ["Pouvez-vous m'en dire plus sur le poste et l'équipe ?", "Quelles sont les prochaines étapes du processus de sélection ?"],
      [STATUS.DISCUSSION_ACTIVE]: ["Quel format d'entretien prévoyez-vous ?", "Y a-t-il plusieurs étapes dans votre processus de recrutement ?"],
      [STATUS.INTERVIEW_REQUESTED]: ["Je suis disponible aux horaires que vous proposez.", "Pourriez-vous me confirmer le format et la durée de l'entretien ?"],
      [STATUS.LEGAL_REVIEW]: ["Je suis en train de rassembler mes documents.", "Mes documents sont en cours de traitement."],
    },
    en: {
      [STATUS.MATCH_CONFIRMED]: ["Hello, thank you for this match. I am very interested in this role."],
      [STATUS.FIRST_MSG_SENT]: ["Could you tell me more about the role and the team?", "What are the next steps in your selection process?"],
      [STATUS.DISCUSSION_ACTIVE]: ["What interview format do you usually use?", "Are there several stages in your hiring process?"],
      [STATUS.INTERVIEW_REQUESTED]: ["I am available at the times you suggested.", "Could you confirm the format and duration of the interview?"],
      [STATUS.LEGAL_REVIEW]: ["I am currently gathering my documents.", "My documents are currently being processed."],
    },
  };

  const suggestions = isEmployer ? employerSuggestions[locale] : workerSuggestions[locale];
  const convSuggestions = suggestions[conversation?.status];
  if (!convSuggestions) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {convSuggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="rounded-full border px-3 py-1 text-[11px] font-medium transition-colors hover:bg-opacity-80"
          style={{
            borderColor: C.border,
            color: C.mid,
            background: C.light,
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PANNEAU DROIT — ContextPanel
   ══════════════════════════════════════════════════════════════════════════ */
const PERMIT_INFO = {
  fr: "En Belgique, si le candidat est ressortissant d'un pays hors Union européenne et ne dispose pas encore d'un titre de séjour et d'une autorisation de travail valides, c'est l'employeur qui doit introduire la demande de permis unique auprès de la région compétente (Flandre, Wallonie ou Bruxelles-Capitale). Le candidat ne peut pas faire cette démarche lui-même.",
  en: "In Belgium, if the candidate is a non-EU national and does not yet hold a valid residence permit and work authorization, the employer must file the single permit application with the competent region (Flanders, Wallonia or Brussels-Capital). The candidate cannot complete this process alone."
};

function ContextPanel({ conversation, onUpdateStatus, onRequestLexpat, onSendMessage, className = "hidden md:flex md:w-[280px]", locale = "fr" }) {
  if (!conversation) {
    return (
      <aside
        className={`h-full shrink-0 flex-col border-l ${className}`}
        style={{ borderColor: C.line, background: "#fff" }}
      >
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm" style={{ color: C.muted }}>
            {locale === "en" ? "Select a conversation" : "Sélectionnez une conversation"}
          </p>
        </div>
      </aside>
    );
  }

  const statusInfo = STATUS_LABEL[conversation.status];
  const permitNeeded = conversation.actions.legal_review_needed;
  const isEmployer = conversation.viewer_role === "employer";
  const isWorker = conversation.viewer_role === "worker";
  const localizedStatusLabel = getLocalizedStatusLabel(conversation.status, locale);

  return (
    <aside
      className={`h-full shrink-0 flex-col overflow-y-auto border-l ${className}`}
      style={{ borderColor: C.line, background: "#fff" }}
    >
      {/* Fiche poste */}
      <div className="border-b px-5 py-5" style={{ borderColor: C.line }}>
        <p
          className="font-heading text-[11px] font-bold uppercase tracking-widest"
          style={{ color: C.teal }}
        >
          {locale === "en" ? "Match context" : "Contexte du match"}
        </p>

        <h3 className="mt-2 font-heading text-[16px] font-bold leading-tight" style={{ color: C.dark }}>
          {conversation.job_title}
        </h3>

        <div className="mt-3 flex flex-col gap-2">
          <InfoRow icon={<IconBriefcase />} label={locale === "en" ? "Company" : "Entreprise"} value={conversation.employer.name} />
          <InfoRow icon={<IconMapPin />} label={locale === "en" ? "Region" : "Région"} value={displayRegion(conversation.region, locale)} />
          <InfoRow
            icon={<IconStar />}
            label={locale === "en" ? "Compatibility" : "Compatibilité"}
            value={
              <span className="font-bold" style={{ color: C.teal }}>
                {conversation.compatibility_score}%
              </span>
            }
          />
        </div>
      </div>

      {/* Statut discussion */}
      <div className="border-b px-5 py-4" style={{ borderColor: C.line }}>
        <p className="mb-2 font-heading text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
          {locale === "en" ? "Status" : "Statut"}
        </p>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: statusInfo.bg }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: statusInfo.color }}
          />
          <span className="text-[13px] font-semibold" style={{ color: statusInfo.color }}>
            {localizedStatusLabel}
          </span>
        </div>

        {/* Status actions — employeur uniquement peut proposer un entretien */}
        {isEmployer && (
          <div className="mt-3 flex flex-col gap-2">
            {conversation.status !== STATUS.INTERVIEW_REQUESTED &&
              conversation.status !== STATUS.CLOSED && (
                <button
                  onClick={() => onUpdateStatus(conversation.id, STATUS.INTERVIEW_REQUESTED)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors hover:opacity-90"
                  style={{
                    background: C.light,
                    color: C.dark,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <IconCalendar />
                  {locale === "en" ? "Suggest an interview" : "Proposer un entretien"}
                </button>
              )}
          </div>
        )}
      </div>

      {/* Situation administrative / Permis unique */}
      <div className="border-b px-5 py-4" style={{ borderColor: C.line }}>
        <p className="mb-2 font-heading text-[11px] font-bold uppercase tracking-widest flex items-center" style={{ color: C.muted }}>
          {locale === "en" ? "Work authorization" : "Situation administrative"}
          <InfoTooltip text={PERMIT_INFO[locale]} locale={locale} />
        </p>

        {/* Statut actuel */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: permitNeeded ? "#fff0f0" : "#fffbeb",
            border: `1px solid ${permitNeeded ? "#fecaca" : "#fde68a"}`,
          }}
        >
          <span className="text-[13px]">{permitNeeded ? "⚠️" : "❓"}</span>
          <span className="text-[12px] font-semibold" style={{ color: permitNeeded ? C.red : "#92400e" }}>
            {permitNeeded ? (locale === "en" ? "A work permit is required" : "Un permis de travail est requis") : (locale === "en" ? "To be checked" : "À vérifier")}
          </span>
        </div>

        {/* EMPLOYEUR */}
        {isEmployer && (
          <div className="mt-2 flex flex-col gap-2">
            {!permitNeeded ? (
              <button
                onClick={() => {
                  if (onSendMessage) {
                    onSendMessage(
                      locale === "en"
                        ? "Hello, to prepare your file, could you tell us about your current administrative situation in Belgium? Are you an EU national or a non-EU national? Do you already have a valid residence permit and work authorization in Belgium?"
                        : "Bonjour, afin de préparer votre dossier, pourriez-vous nous indiquer votre situation administrative actuelle en Belgique ? Êtes-vous ressortissant(e) de l'UE, ou hors UE ? Disposez-vous déjà d'un titre de séjour et d'une autorisation de travail valides en Belgique ?"
                    );
                  }
                }}
                className="w-full rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition-colors hover:opacity-90"
                style={{ background: C.light, color: C.dark, border: `1px solid ${C.border}` }}
              >
                {locale === "en" ? "🔍 Does the candidate already have the right to work in Belgium?" : "🔍 Le candidat a-t-il le droit de travailler en Belgique ?"}
              </button>
            ) : (
              <div
                className="rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                style={{ background: "#fff0f0", color: C.red, border: "1px solid #fecaca" }}
              >
                <p className="font-semibold">{locale === "en" ? "⚠️ The candidate needs work authorization" : "⚠️ Le candidat a besoin d'une autorisation de travail"}</p>
                <p className="mt-1.5 font-normal" style={{ color: "#7f1d1d" }}>
                  {locale === "en"
                    ? <>As the employer, <strong>you</strong> must file the single permit application with the competent region (Flanders, Wallonia or Brussels-Capital). The candidate cannot do this alone.</>
                    : <>En tant qu'employeur, c'est <strong>vous</strong> qui devez introduire la demande de permis unique auprès de la région compétente (Flandre, Wallonie ou Bruxelles-Capitale). Le candidat ne peut pas faire cette démarche lui-même.</>}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TRAVAILLEUR */}
        {isWorker && (
          <div className="mt-2 flex flex-col gap-2">
            {!permitNeeded ? (
              <>
                <p className="text-[11px]" style={{ color: C.muted }}>
                  {locale === "en" ? "Are you a non-EU national without a residence permit or work authorization in Belgium?" : "Êtes-vous ressortissant(e) hors UE sans titre de séjour ni autorisation de travail en Belgique ?"}
                </p>
                <button
                  onClick={() => onUpdateStatus(conversation.id, STATUS.LEGAL_REVIEW, { legal_review_needed: true })}
                  className="w-full rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors hover:opacity-90"
                  style={{ background: "#fff0f0", color: C.red, border: "1px solid #fecaca" }}
                >
                  {locale === "en" ? "⚠️ Yes, I need work authorization" : "⚠️ Oui, j'ai besoin d'une autorisation de travail"}
                </button>
              </>
            ) : (
              <div
                className="rounded-xl px-3 py-2 text-[11px] font-semibold"
                style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}
              >
                {locale === "en" ? "✅ Situation reported to the employer" : "✅ Situation signalée à l'employeur"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scoring comportemental hook */}
      <div className="border-b px-5 py-4" style={{ borderColor: C.line }}>
        <p className="mb-2 font-heading text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
          {locale === "en" ? "Interaction insights" : "Scoring"}
          <span
            className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px]"
            style={{ background: C.light, color: C.mid }}
          >
            {locale === "en" ? "Coming soon" : "Bientôt disponible"}
          </span>
        </p>
        <div
          className="rounded-xl px-3 py-3 text-[11px] leading-relaxed"
          style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.muted }}
        >
          <p>{locale === "en" ? "📊 Responsiveness and exchange quality scores will soon be calculated automatically." : "📊 Les scores de réactivité et de qualité d'échange seront calculés automatiquement."}</p>
          <p className="mt-2">{locale === "en" ? `⭐ You will soon be able to rate your experience with this ${isEmployer ? "candidate" : "recruiter"} directly from this space.` : `⭐ Vous pourrez bientôt évaluer votre expérience avec ce ${isEmployer ? "candidat" : "recruteur"} directement depuis cet espace.`}</p>
        </div>
      </div>

      {/* CTA LEXPAT */}
      <div className="sticky bottom-0 px-5 py-4" style={{ background: "#fff" }}>
        <button
          onClick={() => onRequestLexpat(conversation)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-heading text-[14px] font-bold text-white shadow-blue transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)` }}
        >
          <IconScale />
          {locale === "en" ? "Request legal support" : "Demander accompagnement LEXPAT"}
        </button>
        <p className="mt-2 text-center text-[10px]" style={{ color: C.muted }}>
          {locale === "en" ? "Law firm specialized in immigration" : "Cabinet juridique spécialisé en immigration"}
        </p>
      </div>
    </aside>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0" style={{ color: C.muted }}>
        {icon}
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-wide" style={{ color: C.muted }}>
          {label}
        </p>
        <p className="text-[13px] font-semibold" style={{ color: C.ink }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: C.muted }}>
          {label}
        </span>
        <span className="font-heading text-[11px] font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: C.line }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MODAL — Demander accompagnement LEXPAT
   ══════════════════════════════════════════════════════════════════════════ */
function LexpatModal({ conversation, onClose, locale = "fr" }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ message: "", urgency: "normal" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/lexpat/request { conversation_id, message, urgency }
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,12,38,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.28)]"
        style={{ background: "#fff" }}
      >
        {/* Header */}
        <div
          className="px-7 py-6"
          style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)` }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:text-white"
          >
            <IconX />
          </button>
          <div
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <IconScale />
          </div>
          <h3 className="font-heading text-[18px] font-bold text-white">
            {locale === "en" ? "Legal support" : "Accompagnement juridique"}
          </h3>
          <p className="mt-1 text-[13px] text-white/70">
            {locale === "en" ? "LEXPAT Law Firm — Immigration law specialists" : "Cabinet LEXPAT — Experts en droit de l'immigration"}
          </p>
        </div>

        {sent ? (
          <div className="px-7 py-8 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: C.tealSoft }}
            >
              <span className="text-2xl">✓</span>
            </div>
            <h4 className="font-heading text-[16px] font-bold" style={{ color: C.dark }}>
              {locale === "en" ? "Request sent" : "Demande envoyée"}
            </h4>
            <p className="mt-2 text-sm" style={{ color: C.muted }}>
              {locale === "en" ? "Our legal team will contact you within 24 business hours." : "Notre équipe juridique vous contactera sous 24h ouvrables."}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl py-3 font-heading text-[14px] font-bold text-white"
              style={{ background: C.dark }}
            >
              {locale === "en" ? "Close" : "Fermer"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-6">
            {/* Poste concerné */}
            {conversation && (
              <div
                className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: C.light }}
              >
                <IconBriefcase />
                <div>
                  <p className="text-[11px]" style={{ color: C.muted }}>
                    {locale === "en" ? "Related role" : "Dossier concerné"}
                  </p>
                  <p className="font-heading text-[13px] font-bold" style={{ color: C.dark }}>
                    {conversation.job_title} · {conversation.employer.name}
                  </p>
                </div>
              </div>
            )}

            {/* Urgency */}
            <div className="mb-4">
              <label className="mb-1.5 block font-heading text-[12px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>
                {locale === "en" ? "Urgency level" : "Niveau d'urgence"}
              </label>
              <div className="flex gap-2">
                {[
                  { v: "normal", l: locale === "en" ? "Normal" : "Normal" },
                  { v: "urgent", l: locale === "en" ? "Urgent" : "Urgent" },
                  { v: "critical", l: locale === "en" ? "Critical" : "Critique" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, urgency: v }))}
                    className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition-colors"
                    style={
                      form.urgency === v
                        ? { background: C.dark, color: "#fff" }
                        : { background: C.light, color: C.muted, border: `1px solid ${C.line}` }
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="mb-1.5 block font-heading text-[12px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>
                {locale === "en" ? "Context / details" : "Contexte / précisions"}
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={locale === "en" ? "Explain the situation (nationality, role, region…)" : "Expliquez la situation (nationalité, poste, région…)"}
                className="w-full resize-none rounded-xl px-4 py-3 text-[13px] outline-none"
                style={{
                  border: `1.5px solid ${C.border}`,
                  color: C.ink,
                  background: C.surface,
                  fontFamily: "var(--font-open-sans)",
                }}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-heading text-[14px] font-bold text-white shadow-blue transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)` }}
            >
              {locale === "en" ? "Send request" : "Envoyer la demande"}
              <IconArrowRight />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT — MessagerieApp
   ══════════════════════════════════════════════════════════════════════════ */
export default function MessagerieApp({ locale = "fr" }) {
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});       // { conversation_id: Message[] }
  const [activeId, setActiveId] = useState(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [lexpatModal, setLexpatModal] = useState(null);
  const [starterMatches, setStarterMatches] = useState([]);
  const [startingConversationFor, setStartingConversationFor] = useState(null);
  const [requestedConversationId, setRequestedConversationId] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("list");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = new URLSearchParams(window.location.search);
    setRequestedConversationId(search.get("conversation"));
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const activeMessages = activeId ? (messages[activeId] || []) : [];

  useEffect(() => {
    if (activeId) {
      setMobilePanel("chat");
    }
  }, [activeId]);

  /* ── Charger les conversations réelles depuis Supabase ── */
  useEffect(() => {
    if (authLoading) return;          // attendre la fin du chargement auth
    if (!token) {
      setLoadingConvs(false);         // pas connecté → arrêter le spinner
      return;
    }
    setLoadingConvs(true);
    fetch("/api/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const convs = d.conversations || [];
        setConversations(convs);
        if (convs.length > 0) {
          const requestedExists = requestedConversationId && convs.some((conv) => conv.id === requestedConversationId);
          setActiveId(requestedExists ? requestedConversationId : convs[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, [token, authLoading, requestedConversationId]);

  useEffect(() => {
    if (authLoading || !token || conversations.length > 0) {
      if (conversations.length > 0) {
        setStarterMatches([]);
      }
      return;
    }

    Promise.all([
      fetch("/api/matches?role=worker", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({ matches: [] })),
      fetch("/api/matches?role=employer", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({ matches: [] }))
    ]).then(([workerData, employerData]) => {
      const combined = [...(workerData.matches || []), ...(employerData.matches || [])];
      const confirmed = combined.filter((match) => String(match.status).toLowerCase() === "contacted");
      const unique = confirmed.filter((match, index, array) => array.findIndex((item) => item.id === match.id) === index);
      setStarterMatches(unique);
    });
  }, [authLoading, token, conversations]);

  /* ── Charger les messages quand on change de conversation ── */
  useEffect(() => {
    if (!activeId || !token || messages[activeId]) return;
    setLoadingMsgs(true);
    fetch(`/api/messages?conversation_id=${activeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setMessages((prev) => ({ ...prev, [activeId]: d.messages || [] }));
      })
      .catch(console.error)
      .finally(() => setLoadingMsgs(false));
  }, [activeId, token]);

  /* ── Sélectionner une conversation + marquer comme lu ── */
  const handleSelect = useCallback(
    (id) => {
      setActiveId(id);
      setMobilePanel("chat");
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
      );
      // Forcer le rechargement des messages si pas encore chargés
      if (!messages[id]) {
        setMessages((prev) => ({ ...prev })); // force re-run of effect
      }
    },
    [messages]
  );

  /* ── Envoyer un message ── */
  const handleSendMessage = useCallback(
    async (content) => {
      if (!activeId || !token) return;

      // Optimiste : affichage immédiat
      const tempMsg = {
        id: `temp_${Date.now()}`,
        conversation_id: activeId,
        sender_type: "employer",
        sender_id: activeConversation?.employer?.id || "",
        content,
        read: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), tempMsg],
      }));

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversation_id: activeId, content }),
        });
        const data = await res.json();
        if (data.message) {
          // Remplacer le message temporaire par le vrai
          setMessages((prev) => ({
            ...prev,
            [activeId]: (prev[activeId] || []).map((m) =>
              m.id === tempMsg.id ? data.message : m
            ),
          }));
          // Mettre à jour le dernier message dans la liste
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    last_message: content,
                    last_message_at: data.message.created_at,
                    last_sender: "employer",
                    status:
                      c.status === STATUS.MATCH_CONFIRMED
                        ? STATUS.FIRST_MSG_SENT
                        : c.status === STATUS.FIRST_MSG_SENT
                        ? STATUS.DISCUSSION_ACTIVE
                        : c.status,
                  }
                : c
            )
          );
        }
      } catch (err) {
        // Retirer le message temporaire en cas d'erreur
        setMessages((prev) => ({
          ...prev,
          [activeId]: (prev[activeId] || []).filter((m) => m.id !== tempMsg.id),
        }));
      }

      // AI_EVENT: on_message_sent — hook pour scoring comportemental
      // triggerEvent('message_sent', { conversation_id: activeId, content });
    },
    [activeId, token, activeConversation]
  );

  /* ── Mettre à jour le statut ── */
  const handleUpdateStatus = useCallback(
    async (convId, newStatus, actionOverrides = {}) => {
      // Optimiste
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, status: newStatus, actions: { ...c.actions, ...actionOverrides } }
            : c
        )
      );
      if (token) {
        await fetch("/api/conversations", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversation_id: convId,
            status: newStatus,
            actions: Object.keys(actionOverrides).length > 0 ? actionOverrides : undefined,
          }),
        }).catch(console.error);
      }
    },
    [token]
  );

  const handleStartConversation = useCallback(
    async (matchId) => {
      if (!token) return;
      setStartingConversationFor(matchId);

      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ match_id: matchId }),
        });

        const data = await response.json();
      if (data?.conversation) {
          const nextConversationId = data.conversation.id;
          const refreshed = await fetch("/api/conversations", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json());
          const nextConversations = refreshed.conversations || [];
          setConversations(nextConversations);
          setActiveId(nextConversationId);
          setMobilePanel("chat");
          setStarterMatches((prev) => prev.filter((match) => match.id !== matchId));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setStartingConversationFor(null);
      }
    },
    [token]
  );

  /* ── État de chargement ── */
  if (authLoading || loadingConvs) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 72px)", background: C.surface }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: C.border, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  /* ── Pas connecté ── */
  if (!token) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4"
        style={{ height: "calc(100vh - 72px)", background: C.surface }}
      >
        <p className="font-heading text-base font-semibold" style={{ color: C.dark }}>
          {locale === "en" ? "Sign in to access your messaging" : "Connectez-vous pour accéder à votre messagerie"}
        </p>
        <a
          href={locale === "en" ? "/en/connexion" : "/connexion"}
          className="rounded-2xl px-6 py-3 font-heading text-sm font-bold text-white"
          style={{ background: C.dark }}
        >
          {locale === "en" ? "Sign in" : "Se connecter"}
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - 72px)", background: C.surface }}
    >
      <div className="hidden h-full w-full md:flex">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          className="w-[300px]"
          locale={locale}
        />

        {conversations.length === 0 ? (
          <StartConversationPanel
            matches={starterMatches}
            onStart={handleStartConversation}
            startingId={startingConversationFor}
            locale={locale}
          />
        ) : (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onRequestInterview={() =>
              handleUpdateStatus(activeId, STATUS.INTERVIEW_REQUESTED, {
                interview_requested: true,
              })
            }
            locale={locale}
          />
        )}

        <ContextPanel
          conversation={activeConversation}
          onUpdateStatus={handleUpdateStatus}
          onRequestLexpat={(conv) => setLexpatModal(conv)}
          onSendMessage={handleSendMessage}
          className="flex w-[280px]"
          locale={locale}
        />
      </div>

      <div className="flex h-full w-full md:hidden">
        {mobilePanel === "list" ? (
          conversations.length === 0 ? (
            <StartConversationPanel
              matches={starterMatches}
              onStart={handleStartConversation}
              startingId={startingConversationFor}
              locale={locale}
            />
          ) : (
            <ConversationList
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelect}
              locale={locale}
            />
          )
        ) : (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onRequestInterview={() =>
              handleUpdateStatus(activeId, STATUS.INTERVIEW_REQUESTED, {
                interview_requested: true,
              })
            }
            onBack={() => setMobilePanel("list")}
            locale={locale}
          />
        )}
      </div>

      {/* Modal accompagnement */}
      {lexpatModal && (
        <LexpatModal
          conversation={lexpatModal}
          onClose={() => setLexpatModal(null)}
          locale={locale}
        />
      )}
    </div>
  );
}
