"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";

const copy = {
  fr: {
    tabs: [
      { id: "offers", label: "Offres" },
      { id: "workers", label: "Travailleurs" },
      { id: "matches", label: "Matchings" }
    ],
    summaryCards: [
      { key: "publishedOffers", label: "Offres publiées", tone: "blue" },
      { key: "workers", label: "Travailleurs inscrits", tone: "teal" },
      { key: "visibleWorkers", label: "Profils visibles", tone: "amber" },
      { key: "newMatches", label: "Nouveaux matchs", tone: "green" }
    ],
    searchSr: "Rechercher",
    searchPlaceholder: "Rechercher un poste, une entreprise, un candidat...",
    searchLabel: "Filtrer",
    empty: (label) => `Aucun élément à afficher pour l’instant dans l’onglet ${label.toLowerCase()}.`,
    offers: "Offres",
    workers: "Travailleurs",
    matches: "Matchings",
    offer: "Poste",
    sector: "Secteur",
    company: "Entreprise",
    region: "Région",
    contract: "Contrat",
    status: "Statut",
    created: "Créée le",
    worker: "Travailleur",
    preferredRegion: "Région souhaitée",
    experience: "Expérience",
    profile: "Profil",
    activeReferrals: "Parrainages actifs",
    registered: "Inscrit le",
    backOffice: "Back-office",
    adminAccess: "Accès administrateur requis",
    adminAccessText:
      "Connectez-vous avec votre compte administratrice pour consulter les offres, les candidatures et les matchings dans un seul écran.",
    signIn: "Se connecter",
    home: "Retour à l’accueil",
    denied: "Accès refusé",
    unavailable: "Tableau de bord indisponible",
    badge: "Admin LEXPAT Connect",
    heroTitle: "Vue d’ensemble des offres, travailleurs et matchings",
    heroText:
      "Un back-office pensé pour voir en un coup d’œil qui s’inscrit sur la plateforme, quelles offres sont actives et quels profils remontent dans le matching.",
    sectionTitle: "Pilotage opérationnel",
    sectionText:
      "Passez d’un flux à l’autre sans perdre le fil : offres créées, candidatures déposées, profils remontés par le matching."
  },
  en: {
    tabs: [
      { id: "offers", label: "Openings" },
      { id: "workers", label: "Workers" },
      { id: "matches", label: "Matches" }
    ],
    summaryCards: [
      { key: "publishedOffers", label: "Published openings", tone: "blue" },
      { key: "workers", label: "Registered workers", tone: "teal" },
      { key: "visibleWorkers", label: "Visible profiles", tone: "amber" },
      { key: "newMatches", label: "New matches", tone: "green" }
    ],
    searchSr: "Search",
    searchPlaceholder: "Search for a role, a company or a candidate...",
    searchLabel: "Filter",
    empty: (label) => `Nothing to show yet in the ${label.toLowerCase()} tab.`,
    offers: "Openings",
    workers: "Workers",
    matches: "Matches",
    offer: "Role",
    sector: "Sector",
    company: "Company",
    region: "Region",
    contract: "Contract",
    status: "Status",
    created: "Created on",
    worker: "Worker",
    preferredRegion: "Preferred region",
    experience: "Experience",
    profile: "Profile",
    activeReferrals: "Active referrals",
    registered: "Registered on",
    backOffice: "Back office",
    adminAccess: "Administrator access required",
    adminAccessText:
      "Sign in with your administrator account to review openings, applications and matches in one place.",
    signIn: "Sign in",
    home: "Back to home",
    denied: "Access denied",
    unavailable: "Dashboard unavailable",
    badge: "LEXPAT Connect admin",
    heroTitle: "Overview of openings, workers and matches",
    heroText:
      "A back office designed to quickly see who joined the platform, which openings are active and which profiles surfaced in matching.",
    sectionTitle: "Operational overview",
    sectionText:
      "Move from one workflow to another without losing the thread: openings created, applications submitted and profiles surfaced by matching."
  }
};

const toneClasses = {
  blue: "bg-[#eef4ff] text-[#173a8a] border-[#d7e4ff]",
  teal: "bg-[#ecfaf8] text-[#2b8f88] border-[#cdece8]",
  amber: "bg-[#fff7e8] text-[#c48014] border-[#f7e2b8]",
  green: "bg-[#eef9f1] text-[#2f9d57] border-[#d7efdf]"
};

const statusClasses = {
  draft: "bg-[#f5f7fa] text-[#607086]",
  review: "bg-[#fff7e8] text-[#c48014]",
  published: "bg-[#eef4ff] text-[#173a8a]",
  paused: "bg-[#fff3e8] text-[#b25b14]",
  closed: "bg-[#f5f7fa] text-[#607086]",
  submitted: "bg-[#eef4ff] text-[#173a8a]",
  reviewing: "bg-[#fff7e8] text-[#c48014]",
  shortlisted: "bg-[#eef9f1] text-[#2f9d57]",
  contacted: "bg-[#ecfaf8] text-[#2b8f88]",
  rejected: "bg-[#fff1f1] text-[#af4b4b]",
  hired: "bg-[#eef9f1] text-[#2f9d57]",
  new: "bg-[#eef4ff] text-[#173a8a]",
  reviewed: "bg-[#fff7e8] text-[#c48014]",
  interested: "bg-[#ecfaf8] text-[#2b8f88]",
  legal_review: "bg-[#f4efff] text-[#6c49b8]"
};

const statusLabels = {
  // Offres
  draft: "Brouillon",
  review: "En révision",
  published: "Publiée",
  paused: "En pause",
  closed: "Clôturée",
  // Matchings
  new: "Nouveau",
  reviewed: "Travailleur intéressé",
  interested: "Employeur intéressé",
  contacted: "Contact établi",
  legal_review: "Vérification légale",
  // Autres
  submitted: "Soumise",
  reviewing: "En cours",
  shortlisted: "Présélectionné",
  rejected: "Refusé",
  hired: "Recruté"
};

const statusLabelsEn = {
  draft: "Draft",
  review: "In review",
  published: "Published",
  paused: "Paused",
  closed: "Closed",
  new: "New",
  reviewed: "Worker interested",
  interested: "Employer interested",
  contacted: "Contact established",
  legal_review: "Legal review",
  submitted: "Submitted",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired"
};

function StatusBadge({ status, locale = "fr" }) {
  const labels = locale === "en" ? statusLabelsEn : statusLabels;
  const label = labels[status] || status;
  const cls = statusClasses[status] || "bg-[#f5f7fa] text-[#607086]";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function formatDate(value, locale = "fr") {
  if (!value) return locale === "en" ? "Not provided" : "Non renseignée";

  return new Intl.DateTimeFormat(locale === "en" ? "en-BE" : "fr-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function SearchInput({ value, onChange, locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  return (
    <label className="relative block">
      <span className="sr-only">{t.searchSr}</span>
      <input
        className="field-input pr-12"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.searchPlaceholder}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#7a8898]">
        {t.searchLabel}
      </span>
    </label>
  );
}

function EmptyState({ label, locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  return (
    <div className="rounded-[28px] border border-dashed border-[#d9e4ee] bg-[#fbfdff] px-6 py-12 text-center text-sm leading-7 text-[#6d7b8d]">
      {t.empty(label)}
    </div>
  );
}

function OffersTable({ rows, locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  if (!rows.length) return <EmptyState label={t.offers} locale={locale} />;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="hidden grid-cols-[2fr_1.3fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#edf3f7] bg-[#f9fbfd] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#607086] lg:grid">
        <div>{t.offer}</div>
        <div>{t.company}</div>
        <div>{t.region}</div>
        <div>{t.contract}</div>
        <div>{t.status}</div>
        <div>{t.created}</div>
      </div>
      <div className="divide-y divide-[#edf3f7]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 px-6 py-5 lg:grid-cols-[2fr_1.3fr_1fr_1fr_1fr_1fr] lg:items-center lg:gap-4">
            <div>
              <p className="text-base font-semibold text-[#173a8a]">{row.title}</p>
              <p className="mt-1 text-sm text-[#6d7b8d]">{row.sector}</p>
            </div>
            <div className="text-sm text-[#334155]">{row.companyName}</div>
            <div className="text-sm text-[#334155]">{row.region}</div>
            <div className="text-sm text-[#334155]">{row.contractType}</div>
            <div><StatusBadge status={row.status} locale={locale} /></div>
            <div className="text-sm text-[#6d7b8d]">{formatDate(row.createdAt, locale)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

const visibilityLabel = {
  visible: "Visible",
  hidden: "Masqué",
  review: "En attente"
};

const visibilityClasses = {
  visible: "bg-[#eef9f1] text-[#2f9d57]",
  hidden: "bg-[#f5f7fa] text-[#607086]",
  review: "bg-[#fff7e8] text-[#c48014]"
};

function WorkersTable({ rows, locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  if (!rows.length) return <EmptyState label={t.workers} locale={locale} />;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="hidden grid-cols-[2fr_1.3fr_1fr_1fr_1fr_0.9fr_1fr] gap-4 border-b border-[#edf3f7] bg-[#f9fbfd] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#607086] lg:grid">
        <div>{t.worker}</div>
        <div>{t.sector}</div>
        <div>{t.preferredRegion}</div>
        <div>{t.experience}</div>
        <div>{t.profile}</div>
        <div>{t.activeReferrals}</div>
        <div>{t.registered}</div>
      </div>
      <div className="divide-y divide-[#edf3f7]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 px-6 py-5 lg:grid-cols-[2fr_1.3fr_1fr_1fr_1fr_0.9fr_1fr] lg:items-center lg:gap-4">
            <div>
              <p className="text-base font-semibold text-[#173a8a]">{row.fullName}</p>
              <p className="mt-1 text-sm text-[#6d7b8d]">{row.targetJob}</p>
            </div>
            <div className="text-sm text-[#334155]">{row.targetSector}</div>
            <div className="text-sm text-[#334155]">{row.preferredRegion}</div>
            <div className="text-sm text-[#334155]">{row.experienceLevel}</div>
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${visibilityClasses[row.profileVisibility] || "bg-[#f5f7fa] text-[#607086]"}`}>
                {visibilityLabel[row.profileVisibility] || row.profileVisibility}
              </span>
            </div>
            <div>
              <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#173a8a]">
                {row.activeReferralLinks || 0}
              </span>
            </div>
            <div className="text-sm text-[#6d7b8d]">{formatDate(row.createdAt, locale)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ApplicationsTable({ rows }) {
  if (!rows.length) return <EmptyState label="Candidatures" />;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="hidden grid-cols-[1.8fr_1.2fr_1.3fr_1fr_1fr_1fr] gap-4 border-b border-[#edf3f7] bg-[#f9fbfd] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#607086] lg:grid">
        <div>Candidat</div>
        <div>Entreprise</div>
        <div>Poste</div>
        <div>Région</div>
        <div>Statut</div>
        <div>Déposée le</div>
      </div>
      <div className="divide-y divide-[#edf3f7]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 px-6 py-5 lg:grid-cols-[1.8fr_1.2fr_1.3fr_1fr_1fr_1fr] lg:items-center lg:gap-4">
            <div>
              <p className="text-base font-semibold text-[#173a8a]">{row.candidateName}</p>
              <p className="mt-1 text-sm text-[#6d7b8d]">
                {row.candidateJob} · {row.candidateSector}
              </p>
            </div>
            <div className="text-sm text-[#334155]">{row.companyName}</div>
            <div className="text-sm text-[#334155]">{row.offerTitle}</div>
            <div className="text-sm text-[#334155]">{row.candidateRegion}</div>
            <div><StatusBadge status={row.status} /></div>
            <div className="text-sm text-[#6d7b8d]">{formatDate(row.createdAt)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MatchesTable({ rows, locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  if (!rows.length) return <EmptyState label={t.matches} locale={locale} />;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="hidden grid-cols-[1.8fr_1.3fr_1.3fr_0.7fr_1fr_1fr] gap-4 border-b border-[#edf3f7] bg-[#f9fbfd] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#607086] lg:grid">
        <div>{locale === "en" ? "Candidate" : "Candidat"}</div>
        <div>{t.company}</div>
        <div>{t.offer}</div>
        <div>{locale === "en" ? "Score" : "Score"}</div>
        <div>{t.status}</div>
        <div>{t.created}</div>
      </div>
      <div className="divide-y divide-[#edf3f7]">
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 px-6 py-5 lg:grid-cols-[1.8fr_1.3fr_1.3fr_0.7fr_1fr_1fr] lg:items-center lg:gap-4">
            <div>
              <p className="text-base font-semibold text-[#173a8a]">{row.candidateName}</p>
              <p className="mt-1 text-sm text-[#6d7b8d]">
                {row.candidateJob} · {row.candidateRegion}
              </p>
            </div>
            <div className="text-sm text-[#334155]">{row.companyName}</div>
            <div className="text-sm text-[#334155]">{row.offerTitle}</div>
            <div>
              <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#173a8a]">
                {row.score}/100
              </span>
            </div>
            <div><StatusBadge status={row.status} locale={locale} /></div>
            <div className="text-sm text-[#6d7b8d]">{formatDate(row.createdAt, locale)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ locale = "fr" }) {
  const t = copy[locale] || copy.fr;
  const router = useRouter();
  const { user, session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("offers");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user || !session?.access_token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadOverview() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/overview", {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Impossible de charger le back-office.");
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Impossible de charger le back-office.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOverview();
    return () => {
      cancelled = true;
    };
  }, [loading, session?.access_token, user]);

  const filtered = useMemo(() => {
    if (!data) {
      return { offers: [], workers: [], applications: [], matches: [] };
    }

    const needle = query.trim().toLowerCase();
    if (!needle) {
      return data;
    }

    const includesAny = (values) =>
      values.some((value) => String(value || "").toLowerCase().includes(needle));

    return {
      ...data,
      offers: data.offers.filter((row) =>
        includesAny([row.title, row.companyName, row.sector, row.region, row.status])
      ),
      workers: (data.workers || []).filter((row) =>
        includesAny([row.fullName, row.targetJob, row.targetSector, row.preferredRegion, row.profileVisibility])
      ),
      applications: (data.applications || []).filter((row) =>
        includesAny([row.candidateName, row.candidateJob, row.companyName, row.offerTitle, row.status])
      ),
      matches: data.matches.filter((row) =>
        includesAny([row.candidateName, row.candidateJob, row.companyName, row.offerTitle, row.status, row.score])
      )
    };
  }, [data, query]);

  const counts = filtered.summary || data?.summary || {
    offers: 0,
    publishedOffers: 0,
    applications: 0,
    newMatches: 0
  };

  if (loading || isLoading) {
    return (
      <div className="container-shell py-16">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user || !session?.access_token) {
    return (
      <div className="container-shell py-16">
        <section className="mx-auto max-w-3xl rounded-[34px] border border-[#e5edf4] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
          <p className="inline-flex rounded-full bg-[#eef4ff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#173a8a]">
            {t.backOffice}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#173a8a] sm:text-4xl">
            {t.adminAccess}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#607086]">
            {t.adminAccessText}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={locale === "en" ? "/en/connexion?next=/en/admin" : "/connexion?next=/admin"} className="primary-button">
              {t.signIn}
            </Link>
            <button onClick={() => router.push(locale === "en" ? "/en" : "/")} className="secondary-button">
              {t.home}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-shell py-16">
        <section className="mx-auto max-w-3xl rounded-[34px] border border-[#f0d0d0] bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#af4b4b]">{t.denied}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#173a8a]">{t.unavailable}</h1>
          <p className="mt-4 text-sm leading-7 text-[#607086]">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="container-shell py-10 sm:py-14">
      <section className="rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-[#eef4ff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#173a8a]">
              {t.badge}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#173a8a] sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607086]">
              {t.heroText}
            </p>
          </div>
          <div className="min-w-[280px]">
            <SearchInput value={query} onChange={setQuery} locale={locale} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-4">
        {t.summaryCards.map((card) => (
          <article key={card.key} className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[card.tone]}`}>
              {card.label}
            </span>
            <p className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#173a8a]">{counts[card.key] || 0}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#173a8a]">{t.sectionTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#607086]">
              {t.sectionText}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#173a8a] text-white shadow-[0_10px_24px_rgba(23,58,138,0.18)]"
                    : "border border-[#e1e9f1] bg-white text-[#607086] hover:border-[#bfd3ea] hover:text-[#173a8a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {activeTab === "offers" ? <OffersTable rows={filtered.offers || []} locale={locale} /> : null}
          {activeTab === "workers" ? <WorkersTable rows={filtered.workers || []} locale={locale} /> : null}
          {activeTab === "matches" ? <MatchesTable rows={filtered.matches || []} locale={locale} /> : null}
        </div>
      </section>
    </div>
  );
}
