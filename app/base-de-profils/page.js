"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { useAuth } from "../../components/AuthProvider";

/* ── Icônes secteurs ──────────────────────────────────────────────────────── */
const SECTOR_ICONS = {
  "Informatique": "💻", "IT": "💻", "Tech": "💻",
  "Santé": "🏥", "Médical": "🏥",
  "Construction": "🏗️", "BTP": "🏗️",
  "Ingénierie": "⚙️", "Industrie": "⚙️",
  "Transport": "🚛", "Logistique": "🚛",
  "Finance": "📊", "Comptabilité": "📊",
  "Éducation": "📚", "Enseignement": "📚",
  "Hôtellerie": "🏨", "Restauration": "🍽️",
  "Agriculture": "🌾",
};

function sectorIcon(sector) {
  for (const [key, icon] of Object.entries(SECTOR_ICONS)) {
    if (sector?.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "👤";
}

/* ── Carte réutilisable (publique + membre) ──────────────────────────────── */
function ProfileCard({ profile, t, isMember, locale }) {
  const signupHref  = locale === "en" ? "/en/inscription"  : "/inscription";
  const employerHref = locale === "en" ? "/en/employeurs"  : "/employeurs";

  return (
    <div className="group flex flex-col gap-4 rounded-[24px] border border-[#e3eaf1] bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition hover:border-[#c5d4f3] hover:shadow-[0_8px_28px_rgba(29,59,139,0.09)]">

      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#eef1fb,#eaf4f3)] text-2xl shadow-inner">
          {sectorIcon(profile.sector)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-24 rounded-full bg-[#dce7f5] opacity-60" />
            <span className="flex items-center gap-1 rounded-full bg-[#f0f4f8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a9bb0]">
              <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
                <path d="M6 1a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-4 9c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {t.identityLabel}
            </span>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-[#1d3b8b]">{profile.jobTitle || profile.sector}</p>
        </div>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">{t.regionLabel}</span>
          <span className="font-medium text-[#374151]">{profile.region}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">{t.expLabel}</span>
          <span className="font-medium text-[#374151]">{profile.experience}</span>
        </div>
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">{t.langLabel}</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {profile.languages.split(",").map((lang) => (
              <span key={lang} className="rounded-full bg-[#eaf4f3] px-2.5 py-0.5 text-[11px] font-medium text-[#2b8f88]">
                {lang.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2 border-t border-[#f0f4f8]">
        {isMember ? (
          <Link
            href={employerHref}
            onClick={() => track("Employer CTA Clicked", { cta: "match", location: "profile-card-member" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d3b8b] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#163175]"
          >
            <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
              <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            {t.cardCtaMember}
          </Link>
        ) : (
          <Link
            href={signupHref}
            onClick={() => track("Signup CTA Clicked", { location: "profile-card-public" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1d3b8b] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#1d3b8b] transition hover:bg-[#1d3b8b] hover:text-white"
          >
            {t.cardCta}
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Copie bilingue ─────────────────────────────────────────────────────── */
const COPY = {
  fr: {
    kicker:       "Candidats disponibles",
    kickerMember: "Espace employeur",
    title:        "Candidats disponibles",
    introPublic:  "Ces profils sont réels et actifs. Secteur, région, expérience et langues sont visibles librement. L'identité et les coordonnées sont protégées jusqu'à la mise en relation via un compte employeur.",
    introMember:  "Ces profils sont réels et actifs. Leurs coordonnées restent confidentielles jusqu'à la mise en relation — déposez une offre pour entrer en contact avec les candidats correspondant à votre besoin.",
    statTotal:    "Profils disponibles",
    statSectors:  "Secteurs représentés",
    statRegions:  "Régions couvertes",
    bannerTitle:  "Contactez directement ces candidats",
    bannerDesc:   "Créez un compte employeur gratuitement pour déposer votre besoin et être mis en relation avec les profils correspondants.",
    ctaSignup:    "Créer un compte employeur →",
    ctaLogin:     "Déjà membre ? Se connecter",
    bannerMember: "Prêt à recruter ?",
    bannerMemberDesc: "Déposez votre besoin de recrutement et nous identifions pour vous les candidats correspondants.",
    ctaPost:      "Déposer une offre",
    cardCta:      "Contacter ce candidat →",
    cardCtaMember:"Être mis en relation",
    identityLabel:"Identité protégée",
    regionLabel:  "Région",
    expLabel:     "Expérience",
    langLabel:    "Langues",
    emptyTitle:   "Aucun profil visible pour le moment.",
    emptyDesc:    "Les candidats apparaîtront ici dès qu'ils auront activé la visibilité de leur profil.",
    bottomCta:    (n) => `${n} profil${n > 1 ? "s" : ""} disponible${n > 1 ? "s" : ""}. Accédez aux coordonnées en créant un compte.`,
  },
  en: {
    kicker:       "Available candidates",
    kickerMember: "Employer space",
    title:        "Available candidates",
    introPublic:  "These are real, active profiles. Sector, region, experience and languages are publicly visible. Identity and contact details are protected until a match is confirmed through an employer account.",
    introMember:  "These are real, active profiles. Contact details remain confidential until a match is made — post a job to get in touch with the candidates that match your needs.",
    statTotal:    "Available profiles",
    statSectors:  "Sectors represented",
    statRegions:  "Regions covered",
    bannerTitle:  "Contact these candidates directly",
    bannerDesc:   "Create a free employer account to post your recruitment need and be matched with the right profiles.",
    ctaSignup:    "Create an employer account →",
    ctaLogin:     "Already a member? Sign in",
    bannerMember: "Ready to hire?",
    bannerMemberDesc: "Post your recruitment need and we'll identify the matching candidates for you.",
    ctaPost:      "Post a job",
    cardCta:      "Contact this candidate →",
    cardCtaMember:"Get matched",
    identityLabel:"Protected identity",
    regionLabel:  "Region",
    expLabel:     "Experience",
    langLabel:    "Languages",
    emptyTitle:   "No profiles visible yet.",
    emptyDesc:    "Candidates will appear here once they have activated profile visibility.",
    bottomCta:    (n) => `${n} profile${n > 1 ? "s" : ""} available. Create an account to access contact details.`,
  },
};

/* ── Page principale ─────────────────────────────────────────────────────── */
export default function BaseDeProfilsPage() {
  const { session, loading } = useAuth();
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "fr";
  const t = COPY[locale];
  const isMember = !!session;

  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    const url = isMember ? "/api/member/profiles" : "/api/public/profiles";
    const headers = isMember
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};

    fetch(url, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProfiles(data.rows || []);
        setSummary(data.summary || {});
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [loading, isMember, session]);

  if (loading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1d3b8b] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-shell py-12 lg:py-16">

      {/* ── En-tête ────────────────────────────────────────────────────── */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57b7af]">
          {isMember ? t.kickerMember : t.kicker}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d3b8b] lg:text-4xl">
          {t.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[#607086]">
          {isMember ? t.introMember : t.introPublic}
        </p>
      </div>

      {/* ── Compteurs ──────────────────────────────────────────────────── */}
      {summary && (
        <div className="mt-8 flex flex-wrap gap-4">
          {[
            { value: summary.total,   label: t.statTotal,   color: "bg-[#eef1fb] text-[#1d3b8b] border-[#c5d4f3]" },
            { value: summary.sectors, label: t.statSectors, color: "bg-[#eaf4f3] text-[#2b8f88] border-[#cde2df]" },
            { value: summary.regions, label: t.statRegions, color: "bg-[#fdf2f8] text-[#db2777] border-[#f9a8d4]" },
          ].map(({ value, label, color }) => (
            <div key={label} className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${color}`}>
              <span className="text-2xl font-extrabold">{value ?? "—"}</span>
              <span className="text-[13px] font-medium opacity-80">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Bannière CTA ───────────────────────────────────────────────── */}
      {isMember ? (
        <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#c5d4f3] bg-[linear-gradient(135deg,#eef1fb,#f7fbfb)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#1d3b8b]">{t.bannerMember}</p>
            <p className="mt-1 text-sm leading-6 text-[#607086]">{t.bannerMemberDesc}</p>
          </div>
          <Link
            href={locale === "en" ? "/en/employeurs/rejoindre" : "/employeurs/rejoindre"}
            onClick={() => track("Employer CTA Clicked", { cta: "post-job", location: "base-de-profils-banner" })}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#1d3b8b] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(29,59,139,0.22)] transition hover:bg-[#163175] hover:-translate-y-0.5"
          >
            {t.ctaPost}
            <svg viewBox="0 0 14 14" fill="none" className="h-4 w-4">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#1d3b8b]/20 bg-[linear-gradient(135deg,#1d3b8b,#204E97)] p-7 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#93c5fd]">
                {locale === "en" ? "Employer access" : "Accès employeur"}
              </p>
              <p className="mt-2 text-lg font-bold leading-snug">{t.bannerTitle}</p>
              <p className="mt-1.5 text-sm leading-6 text-white/70">{t.bannerDesc}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
              <Link
                href={locale === "en" ? "/en/inscription" : "/inscription"}
                onClick={() => track("Signup CTA Clicked", { location: "base-de-profils-banner-public" })}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#57b7af] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(87,183,175,0.35)] transition hover:-translate-y-0.5 hover:bg-[#4aa39c]"
              >
                {t.ctaSignup}
              </Link>
              <Link
                href={locale === "en" ? "/en/connexion" : "/connexion"}
                onClick={() => track("Login CTA Clicked", { location: "base-de-profils-public" })}
                className="text-center text-xs text-white/50 underline underline-offset-2 transition hover:text-white/80"
              >
                {t.ctaLogin}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Grille de profils ──────────────────────────────────────────── */}
      {error ? (
        <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">{error}</div>
      ) : profiles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#e3eaf1] bg-white p-12 text-center text-[#8a9bb0]">
          <p className="text-4xl">👤</p>
          <p className="mt-4 text-base font-medium">{t.emptyTitle}</p>
          <p className="mt-2 text-sm">{t.emptyDesc}</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id ?? profile.index}
                profile={profile}
                t={t}
                isMember={isMember}
                locale={locale}
              />
            ))}
          </div>

          {!isMember && profiles.length > 0 && (
            <div className="mt-12 rounded-[20px] border border-[#e3eaf1] bg-[#f8fafd] p-6 text-center">
              <p className="text-sm font-semibold text-[#1d3b8b]">{t.bottomCta(summary?.total ?? 0)}</p>
              <Link
                href={locale === "en" ? "/en/inscription" : "/inscription"}
                onClick={() => track("Signup CTA Clicked", { location: "base-de-profils-bottom-public" })}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#1d3b8b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#163175] hover:-translate-y-0.5"
              >
                {t.ctaSignup}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
