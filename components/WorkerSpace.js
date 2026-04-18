"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";
import RegionSelector from "./RegionSelector";
import ReferralBanner from "./ReferralBanner";
import {
  getProfessionGroupsForRegions,
  getSectorOptions,
  findSectorForProfession,
  parseRegionSelection,
  stringifyRegionSelection
} from "../lib/professions";

function getSidebarItems(locale) {
  if (locale === "en") {
    return [
      { id: "dashboard", label: "Dashboard" },
      { id: "matches", label: "Jobs for my profile" },
      { id: "profile", label: "Worker profile" },
      { id: "cv", label: "My CV" },
      { id: "messaging", label: "Messaging", href: "/en/messagerie" }
    ];
  }

  return [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "matches", label: "Offres pour mon profil" },
    { id: "profile", label: "Mon profil" },
    { id: "cv", label: "Mon CV" },
    { id: "messaging", label: "Messagerie", href: "/messagerie" }
  ];
}

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  rose: "bg-[#fff0f0] text-[#d64545]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

function formatCompatibilityLabel(score, isEn, compact = false) {
  const label = isEn
    ? (compact ? "Match" : "Compatibility")
    : (compact ? "Compat." : "Compatibilité");

  return `${label} ${score}/100`;
}

function formatWorkerMatchStatus(status, isEn) {
  switch ((status || "").toLowerCase()) {
    case "contacted":
      return isEn ? "Confirmed match" : "Match confirmé";
    case "interested":
      return isEn ? "Employer interested" : "Employeur intéressé";
    case "reviewed":
      return isEn ? "Interest sent" : "Intérêt envoyé";
    case "pending":
      return isEn ? "Pending review" : "En attente de validation";
    case "new":
      return isEn ? "New opportunity" : "Nouvelle opportunité";
    default:
      return status || (isEn ? "Pending" : "En attente");
  }
}

function InfoTooltip({ text, buttonTitle, closeLabel }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#57b7af] text-[11px] font-bold text-white shadow-[0_4px_10px_rgba(87,183,175,0.25)] transition hover:scale-105"
        title={buttonTitle}
      >
        i
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-[#dce9e7] bg-white p-3 text-[12px] leading-6 text-[#5f7086] shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
          {text}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 block text-[11px] font-semibold text-[#1d3b8b]"
          >
            {closeLabel}
          </button>
        </div>
      )}
    </span>
  );
}


function getCvSections(locale) {
  const isEn = locale === "en";

  const yearFromField = { key: "yearFrom", label: isEn ? "Year started" : "Année de début", type: "number", placeholder: "2018" };
  const yearToField   = { key: "yearTo",   label: isEn ? "Year ended"   : "Année de fin",   type: "number", placeholder: "2022" };
  const descField     = { key: "description", label: isEn ? "Description" : "Description", type: "textarea",
    placeholder: isEn ? "Briefly describe the content, specialization or key outcomes." : "Décrivez brièvement le contenu, la spécialisation ou les résultats clés." };

  const educationFields = [
    { key: "school",  label: isEn ? "School / University" : "École / Université", placeholder: isEn ? "Université de Liège" : "Université de Liège" },
    { key: "diploma", label: isEn ? "Diploma / Title" : "Diplôme / Titre",       placeholder: isEn ? "Bachelor in Management" : "Bachelier en Gestion" },
    yearFromField, yearToField, descField
  ];

  const experienceFields = [
    { key: "company",  label: isEn ? "Company" : "Entreprise",       placeholder: isEn ? "Company name" : "Nom de l'entreprise" },
    { key: "jobTitle", label: isEn ? "Job title" : "Intitulé du poste", placeholder: isEn ? "Project Manager" : "Chef de projet" },
    yearFromField, yearToField, descField
  ];

  const certFields = [
    { key: "name",   label: isEn ? "Certificate name" : "Nom du certificat",          placeholder: isEn ? "AWS Cloud Practitioner" : "AWS Cloud Practitioner" },
    { key: "issuer", label: isEn ? "Issuing organization" : "Organisme délivrant",    placeholder: isEn ? "Amazon Web Services" : "Amazon Web Services" },
    { key: "year",   label: isEn ? "Year obtained" : "Année d'obtention", type: "number", placeholder: "2023" },
    descField
  ];

  const skillFields = [
    { key: "name",  label: isEn ? "Skill" : "Compétence", placeholder: isEn ? "Project management, AutoCAD…" : "Gestion de projet, AutoCAD…" },
    { key: "level", label: isEn ? "Level" : "Niveau", type: "select",
      options: isEn ? ["Beginner", "Intermediate", "Advanced", "Expert"] : ["Débutant", "Intermédiaire", "Avancé", "Expert"] }
  ];

  return [
    {
      title: isEn ? "Education" : "Formation",
      description: isEn ? "Add your main degrees and formal training." : "Ajoutez vos diplômes et formations principales.",
      sectionKey: "formation",
      items: [
        { label: isEn ? "Main degree"        : "Diplôme principal",        fields: educationFields },
        { label: isEn ? "Additional training" : "Formation complémentaire", fields: educationFields }
      ]
    },
    {
      title: isEn ? "Experience" : "Expériences",
      description: isEn ? "Present the most relevant work experience for a Belgian employer." : "Présentez vos expériences les plus pertinentes pour un employeur belge.",
      sectionKey: "experiences",
      items: [
        { label: isEn ? "Main experience"       : "Expérience principale",    fields: experienceFields },
        { label: isEn ? "Additional experience" : "Expérience complémentaire", fields: experienceFields }
      ]
    },
    {
      title: isEn ? "Certificates" : "Certificats",
      description: isEn ? "Mention any certifications or distinctions that strengthen your profile." : "Mentionnez vos certifications ou distinctions utiles.",
      sectionKey: "certificats",
      items: [
        { label: isEn ? "Certificate or distinction" : "Certificat ou distinction", fields: certFields }
      ]
    },
    {
      title: isEn ? "Skills" : "Compétences",
      description: isEn ? "List the technical or operational skills that support your application." : "Listez les compétences techniques ou opérationnelles qui renforcent votre dossier.",
      sectionKey: "competences",
      items: [
        { label: isEn ? "Skill 1" : "Compétence 1", fields: skillFields },
        { label: isEn ? "Skill 2" : "Compétence 2", fields: skillFields }
      ]
    }
  ];
}

function Field({ field, locale = "fr" }) {
  const isEn = locale === "en";
  const base = "field-input";

  return (
    <label className={field.wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${base} min-h-36`} rows={6} placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <select className={base} defaultValue="">
          <option value="" disabled>
            {isEn ? "Select an option" : "Sélectionnez une option"}
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input className={base} type={field.type || "text"} placeholder={field.placeholder} />
      )}
    </label>
  );
}

function DashboardView({ token, onNavigate, locale }) {
  const isEn = locale === "en";
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setProfile(d.profile || null); setProfileLoading(false); })
      .catch(() => setProfileLoading(false));
    fetch("/api/matches?role=worker", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setMatches(d.matches || []); setMatchesLoading(false); })
      .catch(() => setMatchesLoading(false));
  }, [token]);

  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      isEn
        ? "Delete your worker profile? This cannot be undone."
        : "Supprimer votre profil travailleur ? Cette action est irréversible."
    );
    if (!confirmed) return;
    setDeleting(true);
    const res = await fetch("/api/profile", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setProfile(null);
    setDeleting(false);
  }

  const visibilityBadge = profile?.profile_visibility === "visible"
    ? { label: isEn ? "Visible to employers" : "Visible aux employeurs", cls: "bg-[#eef9f1] text-[#2f9d57] border-[#c4e8cf]" }
    : { label: isEn ? "Profile hidden" : "Profil masqué", cls: "bg-[#f5f7fa] text-[#607086] border-[#dde5ee]" };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          {isEn ? "Worker space" : "Espace travailleur"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">
          {isEn ? "My dashboard" : "Mon tableau de bord"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "View your profile, your CV and the job offers matched to your search."
            : "Consultez votre profil, votre CV et les offres d'emploi correspondant à votre recherche."}
        </p>
      </section>

      {/* ── Profile card ───────────────────────────────────────────────── */}
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {isEn ? "My profile" : "Mon profil"}
            </p>
            {profileLoading ? (
              <div className="mt-4 h-5 w-40 animate-pulse rounded-full bg-[#edf3f7]" />
            ) : profile ? (
              <div className="mt-3 space-y-1">
                <p className="text-xl font-semibold text-[#1d3b8b]">{profile.full_name || "—"}</p>
                <p className="text-sm text-[#5f7086]">
                  {profile.target_job || profile.job_title || "—"}
                  {profile.target_sector ? ` · ${profile.target_sector}` : ""}
                </p>
                <p className="text-sm text-[#5f7086]">
                  {profile.preferred_region || (isEn ? "Belgium" : "Toute la Belgique")}
                  {profile.experience_level ? ` · ${profile.experience_level}` : ""}
                </p>
                <span className={`mt-2 inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold ${visibilityBadge.cls}`}>
                  {visibilityBadge.label}
                </span>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-[#5f7086]">
                  {isEn ? "Your profile hasn't been created yet." : "Votre profil n'a pas encore été créé."}
                </p>
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href={isEn ? "/en/travailleurs/rejoindre" : "/travailleurs/rejoindre"}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#d7e4f0] bg-white px-4 py-2 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#b0cadf] hover:shadow-sm"
            >
              ✏️ {profile ? (isEn ? "Edit my profile" : "Modifier mon profil") : (isEn ? "Create my profile" : "Créer mon profil")}
            </a>
            {profile && (
              <button
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-[#f0d0d0] bg-white px-4 py-2 text-sm font-semibold text-[#af4b4b] transition hover:border-[#e0a0a0] hover:shadow-sm disabled:opacity-50"
              >
                🗑️ {isEn ? "Delete" : "Supprimer"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CV card ────────────────────────────────────────────────────── */}
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {isEn ? "My CV" : "Mon CV"}
            </p>
            {profileLoading ? (
              <div className="mt-4 h-5 w-40 animate-pulse rounded-full bg-[#edf3f7]" />
            ) : profile?.cv_url ? (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-semibold text-[#1d3b8b]">
                    {isEn ? "CV uploaded" : "CV déposé"}
                  </p>
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#57b7af] underline hover:text-[#3a9a92]"
                  >
                    {isEn ? "View my CV" : "Voir mon CV"}
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#5f7086]">
                {isEn ? "No CV uploaded yet." : "Aucun CV déposé pour l'instant."}
              </p>
            )}
          </div>
          <button
            onClick={() => onNavigate("cv")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-[#d7e4f0] bg-white px-4 py-2 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#b0cadf] hover:shadow-sm"
          >
            {profile?.cv_url ? (isEn ? "Replace my CV" : "Remplacer mon CV") : (isEn ? "Upload my CV" : "Déposer mon CV")}
          </button>
        </div>
      </section>

      {/* ── Matched offers ─────────────────────────────────────────────── */}
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
            {isEn ? "Matched job offers" : "Offres matchées"}
          </p>
          {matches.length > 0 && (
            <button
              onClick={() => onNavigate("matches")}
              className="text-xs font-semibold text-[#1d3b8b] underline hover:text-[#57b7af]"
            >
              {isEn ? "See all" : "Voir tout"}
            </button>
          )}
        </div>
        {matchesLoading ? (
          <div className="mt-6 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#f3f7fb]" />)}
          </div>
        ) : matches.length > 0 ? (
          <div className="mt-4 space-y-3">
            {matches.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigate("matches")}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#e5edf4] px-5 py-4 transition hover:border-[#c0d5ea] hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1d3b8b]">{m.offer?.title || m.offer_title || "—"}</p>
                  <p className="mt-0.5 text-xs text-[#5f7086]">{m.offer?.company_name || m.company_name || ""}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#173a8a]">
                  {formatCompatibilityLabel(m.score, isEn, true)}
                </span>
              </div>
            ))}
            {matches.length > 3 && (
              <button
                onClick={() => onNavigate("matches")}
                className="w-full rounded-2xl border border-dashed border-[#c0d5ea] py-3 text-sm font-semibold text-[#1d3b8b] transition hover:bg-[#f4f8fd]"
              >
                +{matches.length - 3} {isEn ? "more offers" : "offres supplémentaires"}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d9e4ee] bg-[#fbfdff] px-6 py-10 text-center">
            <p className="text-sm leading-7 text-[#6d7b8d]">
              {!profile
                ? (isEn
                  ? "Create your profile so the matching engine can detect relevant offers."
                  : "Créez votre profil pour que le moteur de matching détecte des offres correspondantes.")
                : (isEn
                  ? "No matching offer detected yet. We'll notify you as soon as one appears."
                  : "Aucune offre matchée pour l'instant. Vous serez notifié dès qu'une offre correspond.")}
            </p>
            {!profile && (
              <button
                onClick={() => onNavigate("profile")}
                className="mt-5 inline-flex items-center rounded-2xl bg-[#1d3b8b] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                {isEn ? "Create my profile" : "Créer mon profil"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Parrainage ─────────────────────────────────────────────────── */}
      <ReferralBanner accessToken={token} locale={locale} />
    </div>
  );
}

function WorkerMatchesView({ token, locale }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [openingChat, setOpeningChat] = useState(null);
  const isEn = locale === "en";

  const handleOpenMessagerie = async (matchId) => {
    setOpeningChat(matchId);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ match_id: matchId }),
      });
      const data = await response.json();
      const conversationId = data?.conversation?.id;
      window.location.href = conversationId
        ? `${isEn ? "/en" : ""}/messagerie?conversation=${conversationId}`
        : `${isEn ? "/en" : ""}/messagerie`;
    } catch (e) {
      console.error(e);
      window.location.href = `${isEn ? "/en" : ""}/messagerie`;
    }
  };

  useEffect(() => {
    if (!token) return;
    fetch("/api/matches?role=worker", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setMatches(d.matches || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  // Travailleur clique "Je suis intéressé"
  // new → reviewed | interested (employeur déjà intéressé) → contacted (match confirmé)
  const handleInterest = async (matchId, currentStatus) => {
    setActing(matchId);
    const nextStatus = currentStatus === "interested" ? "contacted" : "reviewed";
    try {
      const res = await fetch("/api/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ matchId, status: nextStatus }),
      });
      if (res.ok) {
        setMatches((prev) =>
          prev.map((m) => m.id === matchId ? { ...m, status: nextStatus } : m)
        );
      }
    } finally {
      setActing(null);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "bg-[#eef9f1] text-[#2f9d57]";
    if (score >= 60) return "bg-[#ecfaf8] text-[#2f9f97]";
    return "bg-[#fff7e7] text-[#d08900]";
  };
  const scoringInfo = isEn
    ? "Compatibility reflects how closely the role, sector, region and experience align. It helps prioritize opportunities, but it is not a hiring guarantee on its own."
    : "La compatibilité reflète la proximité entre le poste, le secteur, la région et l'expérience. Elle aide à prioriser les opportunités, sans constituer à elle seule une garantie de recrutement.";

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My matches" : "Mes matchs"}</p>
          <InfoTooltip
            text={scoringInfo}
            buttonTitle={isEn ? "What does the compatibility score mean?" : "Que signifie la compatibilité ?"}
            closeLabel={isEn ? "Close" : "Fermer"}
          />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Opportunities matching your profile" : "Opportunités correspondant à votre profil"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "The LEXPAT Connect engine automatically compares your sector and preferred region with Belgian employer openings. Employer contact details are only shared after the match is confirmed."
            : "Le moteur LEXPAT Connect croise automatiquement votre secteur et votre région avec les offres des employeurs belges. Les coordonnées employeur sont partagées uniquement après confirmation du match."}
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#59B9B1] border-t-transparent" /></div>
      ) : matches.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#a8d9d4] bg-[#f2fbfa] p-8 text-center text-sm text-[#5f7086]">
          {isEn
            ? "No matches yet. Complete your profile with a sector and at least one region to be detected automatically."
            : "Aucun match pour l'instant. Complétez votre profil avec un secteur et une région pour être détecté automatiquement."}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {matches.map((match) => (
            <article key={match.id} className="rounded-[28px] border border-[#dce9e7] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{match.offer?.title}</h2>
                  <p className="mt-1 text-sm text-[#5f7086]">
                    {[match.offer?.sector, match.offer?.region, match.offer?.contract_type, match.offer?.urgency].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${scoreColor(match.score)}`}>
                  {formatCompatibilityLabel(match.score, isEn)}
                </span>
              </div>
              <div className="mt-4 rounded-[20px] border border-[#dce9e7] bg-[#f2fbfa] px-4 py-3 text-xs text-[#5f7086]">
                {match.status?.toLowerCase() === "contacted"
                  ? <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold text-[#2f9d57]">{isEn ? "Confirmed match" : "Match confirmé"}</span> {isEn ? "— Employer contact details are unlocked." : "— Les coordonnées employeur sont débloquées."}</>
                  : <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold">{formatWorkerMatchStatus(match.status, isEn)}</span> {isEn ? "— Employer contact details become available once the match is confirmed." : "— Les coordonnées employeur deviennent accessibles après confirmation du match."}</>
                }
              </div>

              {/* ── Bouton d'intérêt travailleur ── */}
              <div className="mt-4">
                {match.status?.toLowerCase() === "contacted" ? (
                  /* Match confirmé des deux côtés */
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-[16px] bg-[#eef9f1] px-4 py-2.5 text-sm font-semibold text-[#2f9d57]">
                      <span>✓</span> {isEn ? "Confirmed match — employer contact details are now available" : "Match confirmé — les coordonnées employeur sont débloquées"}
                    </div>
                    <button
                      onClick={() => handleOpenMessagerie(match.id)}
                      disabled={openingChat === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#57B7AF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4aa9a2] disabled:opacity-60"
                    >
                      {openingChat === match.id ? (isEn ? "Opening…" : "Ouverture…") : isEn ? "Open messaging →" : "Ouvrir la messagerie →"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "interested" ? (
                  /* L'employeur a déjà manifesté son intérêt */
                  <div className="flex flex-col gap-2">
                    <div className="rounded-[16px] border border-[#1E3A78]/20 bg-[#eef1fb] px-4 py-2.5 text-xs text-[#33566b]">
                      ✦ {isEn ? "This employer is interested in your profile" : "Cet employeur est intéressé par votre profil"}
                    </div>
                    <button
                      onClick={() => handleInterest(match.id, match.status)}
                      disabled={acting === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#57B7AF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4aa9a2] disabled:opacity-60"
                    >
                      {acting === match.id ? "…" : isEn ? "Confirm my interest → confirm the match" : "Confirmer mon intérêt → confirmer le match"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "reviewed" ? (
                  /* Travailleur a déjà cliqué, en attente de l'employeur */
                  <div className="rounded-[16px] border border-[#a8d9d4] bg-[#eaf4f3] px-4 py-2.5 text-xs text-[#5f7086]">
                    {isEn ? "Waiting for the employer's response…" : "En attente de la réponse de l'employeur…"}
                  </div>
                ) : (
                  /* Statut new / par défaut */
                  <button
                    onClick={() => handleInterest(match.id, match.status)}
                    disabled={acting === match.id}
                    className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#57B7AF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4aa9a2] disabled:opacity-60"
                  >
                    {acting === match.id ? "…" : isEn ? "I'm interested →" : "Je suis intéressé(e) →"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ token, locale, onNavigate }) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const isEn = locale === "en";

  function createEmptyProfileValues() {
    return {
      full_name: "", profession: "", otherProfession: "", sector: "", regions: [],
      experience: "", languages: "", description: "", profile_visibility: "visible",
      preferred_locale: locale === "en" ? "en" : "fr",
      match_alerts_enabled: true
    };
  }

  const [values, setValues] = useState(createEmptyProfileValues);

  useEffect(() => {
    if (!token) return;
    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setHasProfile(true);
          setValues((prev) => ({
            ...prev,
            ...d.profile,
            profession: d.profile.job_option || d.profile.job_title || "",
            otherProfession: d.profile.otherProfession || "",
            regions: d.profile.regions || parseRegionSelection(d.profile.region)
          }));
        } else {
          setHasProfile(false);
          setValues(createEmptyProfileValues());
        }
      })
      .catch(() => {});
  }, [token, locale]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...values,
          preferred_locale: locale === "en" ? "en" : "fr",
          region: stringifyRegionSelection(values.regions, "Toute la Belgique"),
          job_option: values.profession,
          job_title: values.profession === "Autre profession" ? values.otherProfession : values.profession,
          job_title_other: values.profession === "Autre profession" ? values.otherProfession : ""
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasProfile(true);
      // Use the server-confirmed visibility (may differ from user selection if fields were missing)
      if (data.forced_hidden) {
        setSaveMsg(
          isEn
            ? "Profile saved — but kept hidden because the target job and sector are required to activate visibility. Fill them in and save again."
            : "Profil enregistré — mais maintenu masqué car le poste visé et le secteur sont obligatoires pour activer la visibilité. Renseignez-les et enregistrez à nouveau."
        );
      } else {
        const isVisible = data.profile_visibility === "visible";
        setSaveMsg(
          isEn
            ? isVisible
              ? "Profile saved — your profile is now active and visible to employers."
              : "Profile saved — your profile is paused. Reactivate it at any time to appear in matching results."
            : isVisible
              ? "Profil enregistré — votre profil est actif et visible par les employeurs."
              : "Profil enregistré — votre profil est en pause. Réactivez-le quand vous le souhaitez pour réapparaître dans les résultats."
        );
      }
    } catch (err) {
      setSaveMsg((isEn ? "Error: " : "Erreur : ") + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      isEn
        ? "Do you really want to delete your worker profile? Your CV items, matches and linked applications will also be removed."
        : "Voulez-vous vraiment supprimer votre profil travailleur ? Votre CV, vos matchs et vos candidatures liées seront aussi supprimés."
    );

    if (!confirmed) return;

    setDeleting(true);
    setSaveMsg("");

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHasProfile(false);
      setValues(createEmptyProfileValues());
      setSaveMsg(isEn ? "Profile deleted." : "Profil supprimé.");
    } catch (err) {
      setSaveMsg((isEn ? "Error: " : "Erreur : ") + err.message);
    } finally {
      setDeleting(false);
    }
  }

  function set(key, val) {
    setValues((prev) => {
      const next = { ...prev, [key]: val };

      if (key === "regions") {
        next.profession = "";
        next.otherProfession = "";
        if (next.sector !== "Autre secteur") {
          next.sector = "";
        }
      }

      if (key === "profession") {
        if (val !== "Autre profession") {
          next.otherProfession = "";
        }
        const derivedSector = findSectorForProfession(next.regions, val);
        if (derivedSector) {
          next.sector = derivedSector;
        }
      }

      return next;
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My profile" : "Mon profil"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Edit my profile" : "Modifier mon profil"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">{isEn ? "These details feed the matching engine directly. A sector and one or more regions are enough to make your profile discoverable by Belgian employers." : "Ces informations alimentent directement le moteur de matching. Un secteur et une ou plusieurs régions renseignés suffisent pour être détecté par les employeurs belges."}</p>
      </section>

      <section className="rounded-[26px] border border-[#dce8f6] bg-[#f8fbff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1d3b8b]">
            {isEn ? "Want to see the openings matching your profile?" : "Vous voulez voir les offres correspondant à votre profil ?"}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5f7086]">
            {isEn
              ? "Open the matching space to review the employer openings already linked to your sector and regions."
              : "Ouvrez l'espace de matching pour voir les offres déjà reliées à votre secteur et à vos régions."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("matches")}
          className="mt-4 inline-flex items-center justify-center rounded-[16px] bg-[#57B7AF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4aa9a2] sm:mt-0"
        >
          {isEn ? "See matching openings →" : "Voir les offres correspondantes →"}
        </button>
      </section>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-[22px] border border-[#dce8f6] bg-[#f4f8ff] px-5 py-4 text-sm leading-6 text-[#3c5473]">
          {isEn
            ? <span>Your profile becomes <strong>visible to employers</strong> only once you have filled in at least your <strong>target job</strong> and your <strong>sector</strong>. All other fields improve your matching score but are optional.</span>
            : <span>Votre profil devient <strong>visible par les employeurs</strong> uniquement lorsque vous avez renseigné au minimum votre <strong>poste visé</strong> et votre <strong>secteur d'activité</strong>. Les autres champs améliorent votre score de matching mais sont optionnels.</span>}
        </div>
        <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Matching information" : "Informations de matching"}</h2>
          <p className="mt-2 text-sm text-[#57b7af] font-medium">{isEn ? "These fields feed the matching engine directly." : "Ces champs alimentent directement le moteur de matching."}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Full name" : "Nom complet"}</span>
              <input className="field-input" value={values.full_name || ""} onChange={(e) => set("full_name", e.target.value)} placeholder={isEn ? "First name Last name" : "Prénom Nom"} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Sector" : "Secteur"} * <span className="text-[#57b7af]">(matching)</span></span>
              <select className="field-input" value={values.sector || ""} onChange={(e) => set("sector", e.target.value)}>
                <option value="" disabled>{isEn ? "Select a sector" : "Sélectionnez un secteur"}</option>
                {getSectorOptions(isEn ? "en" : "fr").map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Preferred region" : "Région souhaitée"} * <span className="text-[#57B7AF]">({isEn ? "introductions" : "mise en relation"})</span></span>
              <RegionSelector
                value={values.regions || []}
                onChange={(nextRegions) => set("regions", nextRegions)}
                helperText={isEn ? "Select one, two or three regions depending on your mobility." : "Sélectionnez une, deux ou trois régions selon votre mobilité."}
              />
            </label>

            {/* ── Métier en pénurie — dynamique selon la région ── */}
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">
                {isEn ? "Target role" : "Métier en pénurie"} * <span className="text-[#57B7AF]">({isEn ? "introductions" : "mise en relation"})</span>
              </span>
              {(values.regions || []).length ? (
                <select
                  className="field-input"
                  value={values.profession || ""}
                  onChange={(e) => set("profession", e.target.value)}
                >
                  <option value="" disabled>{isEn ? "Select your role" : "Sélectionnez votre métier"}</option>
                  {getProfessionGroupsForRegions(values.regions, isEn ? "en" : "fr").map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((profession) => (
                        <option key={`${group.label}-${profession.value}`} value={profession.value}>{profession.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
                  {isEn ? "Select at least one region to see shortage occupations" : "Sélectionnez au moins une région pour voir les métiers en pénurie"}
                </div>
              )}
              {(values.regions || []).length > 0 && (
                <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
                  {(values.regions || []).length === 1
                    ? isEn ? `Official shortage occupation list for ${values.regions[0]} — updated 2026` : `Liste officielle des métiers en pénurie pour ${values.regions[0]} — mise à jour 2026`
                    : isEn ? "Consolidated 2026 shortage occupation list for the selected regions" : "Liste consolidée des métiers en pénurie 2026 pour les régions sélectionnées"}
                </p>
              )}
            </label>

            {values.profession === "Autre profession" ? (
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Other role / details" : "Autre profession / précision"}</span>
                <input
                  className="field-input"
                  value={values.otherProfession || ""}
                  onChange={(e) => set("otherProfession", e.target.value)}
                  placeholder={isEn ? "Specify the exact job title you are targeting" : "Précisez l'intitulé exact du métier recherché"}
                />
              </label>
            ) : null}

            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Experience" : "Expérience"}</span>
              <select className="field-input" value={values.experience || ""} onChange={(e) => set("experience", e.target.value)}>
                <option value="" disabled>{isEn ? "Select" : "Sélectionnez"}</option>
                <option>{isEn ? "Less than 1 year" : "Moins d'1 an"}</option>
                <option>{isEn ? "1 to 3 years" : "1 à 3 ans"}</option>
                <option>{isEn ? "3 to 5 years" : "3 à 5 ans"}</option>
                <option>{isEn ? "5 to 10 years" : "5 à 10 ans"}</option>
                <option>{isEn ? "10+ years" : "10 ans et plus"}</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Languages" : "Langues"}</span>
              <input className="field-input" value={values.languages || ""} onChange={(e) => set("languages", e.target.value)} placeholder={isEn ? "French, English, Arabic…" : "Français, anglais, arabe…"} />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Profile summary" : "Présentation"}</span>
              <textarea className="field-input min-h-[7rem]" rows={4} value={values.description || ""} onChange={(e) => set("description", e.target.value)} placeholder={isEn ? "Briefly describe your background, current situation and what you are looking for." : "Décrivez brièvement votre parcours, votre situation actuelle et vos attentes."} />
            </label>
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Profile visibility" : "Visibilité du profil"}</span>
              <select className="field-input" value={values.profile_visibility || "visible"} onChange={(e) => set("profile_visibility", e.target.value)}>
                <option value="visible">{isEn ? "Active — employers can find me" : "Actif — les employeurs peuvent me trouver"}</option>
                <option value="hidden">{isEn ? "Paused — my profile is invisible" : "En pause — mon profil est invisible"}</option>
              </select>
              {(() => {
                const hasJob = !!(values.profession && values.profession !== "Autre profession"
                  ? values.profession.trim()
                  : values.otherProfession?.trim());
                const hasSector = !!values.sector?.trim();
                const canBeVisible = hasJob && hasSector;
                const wantsVisible = (values.profile_visibility || "visible") === "visible";

                if (wantsVisible && !canBeVisible) {
                  return (
                    <p className="mt-2 text-xs leading-5 text-[#a33f3f] font-medium">
                      {isEn
                        ? "⚠ The target job and sector are required before your profile can be visible. Fill them in above."
                        : "⚠ Le poste visé et le secteur sont obligatoires pour activer la visibilité. Renseignez-les ci-dessus."}
                    </p>
                  );
                }
                return (
                  <p className="mt-2 text-xs leading-5 text-[#5f7086]">
                    {wantsVisible
                      ? (isEn ? "Your profile appears in matching results and employers can contact you." : "Votre profil apparaît dans les résultats de matching et les employeurs peuvent vous contacter.")
                      : (isEn ? "Your profile is saved but invisible. No employer will see it until you reactivate it." : "Votre profil est sauvegardé mais invisible. Aucun employeur ne le verra tant que vous ne le réactivez pas.")}
                  </p>
                );
              })()}
            </div>
            <label className="md:col-span-2 rounded-[20px] border border-[#dce8f6] bg-[#f8fbff] px-4 py-4">
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={values.match_alerts_enabled !== false}
                  onChange={(e) => set("match_alerts_enabled", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#bfd0e5] text-[#1E3A78] focus:ring-[#57B7AF]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#17345d]">
                    {isEn ? "Email me when a new opening matches my profile" : "M’envoyer un email quand une nouvelle offre correspond à mon profil"}
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-[#5f7086]">
                    {isEn
                      ? "Maximum one notification every 12 hours. Several new matches are grouped into a single premium alert."
                      : "Maximum une notification toutes les 12 heures. Plusieurs nouveaux matchs sont regroupés dans une seule alerte premium."}
                  </span>
                </span>
              </span>
            </label>
          </div>
        </section>

        {saveMsg && (
          <div className={`rounded-[22px] border px-4 py-3 text-sm ${saveMsg.startsWith("Erreur") ? "border-[#f2c4c4] bg-[#fff5f5] text-[#a33f3f]" : "border-[#c6e8e3] bg-[#f0fbf9] text-[#1d7a6e]"}`}>
            {saveMsg}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {hasProfile ? (
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl border border-[#f0c3c3] bg-[#fff5f5] px-5 py-3 text-sm font-semibold text-[#b54848] transition hover:bg-[#ffeaea] disabled:opacity-60"
              >
                {deleting
                  ? (isEn ? "Deleting…" : "Suppression…")
                  : (isEn ? "Delete my profile" : "Supprimer mon profil")}
              </button>
            ) : (
              <p className="text-sm text-[#6b7b8f]">
                {isEn ? "No worker profile has been saved yet." : "Aucun profil travailleur n’a encore été enregistré."}
              </p>
            )}
          </div>
          <button type="submit" disabled={saving} className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-8 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70">
            {saving ? (isEn ? "Saving…" : "Enregistrement…") : isEn ? "Save" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CvCollectionAccordion({ title, description, sectionKey, items, locale, data, onChange }) {
  const isEn = locale === "en";
  const templateFields = items[0]?.fields || [];
  // Use the LAST template item as the base for extra entries
  const lastTemplateLabel = items[items.length - 1]?.label || title;
  const baseLabel = lastTemplateLabel.replace(/\s*\d+\s*$/, "").trim();

  // Total number of rows = max(template count, saved data count, user-added count)
  const savedCount = Array.isArray(data) ? data.length : 0;
  const [totalCount, setTotalCount] = useState(Math.max(items.length, savedCount));
  const [openIndex, setOpenIndex]   = useState(null);

  // If saved data has more entries than what we're showing, expand to fit
  useEffect(() => {
    if (savedCount > totalCount) setTotalCount(savedCount);
  }, [savedCount]);

  function getLabel(idx) {
    if (idx < items.length) return items[idx].label;
    // If the last template label already ends with a number (e.g. "Compétence 2"),
    // continue the sequence naturally (3, 4…). Otherwise number the extras from 2.
    const endsWithNumber = /\d+\s*$/.test(lastTemplateLabel);
    const num = endsWithNumber ? idx + 1 : idx - items.length + 2;
    return `${baseLabel} ${num}`;
  }

  function getFields(idx) {
    return items[idx]?.fields || templateFields;
  }

  function updateEntry(itemIdx, fieldKey, value) {
    const updated = Array.isArray(data) ? [...data] : [];
    if (!updated[itemIdx]) updated[itemIdx] = {};
    updated[itemIdx] = { ...updated[itemIdx], [fieldKey]: value };
    onChange(sectionKey, updated);
  }

  function addEntry() {
    const next = totalCount;
    setTotalCount((n) => n + 1);
    setOpenIndex(next);
  }

  function removeEntry(idx) {
    const updated = Array.isArray(data) ? [...data] : [];
    updated.splice(idx, 1);
    onChange(sectionKey, updated);
    setTotalCount((n) => Math.max(1, n - 1));
    setOpenIndex((prev) => {
      if (prev === idx) return null;
      if (prev > idx) return prev - 1;
      return prev;
    });
  }

  const indices = Array.from({ length: totalCount }, (_, i) => i);

  return (
    <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#5f7086]">{description}</p>
      <div className="mt-6 space-y-3">
        {indices.map((idx) => {
          const isOpen = openIndex === idx;
          const entry  = (Array.isArray(data) ? data[idx] : null) || {};
          const fields = getFields(idx);

          return (
            <div key={idx} className="overflow-hidden rounded-[20px] border border-[#e8eff5]">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex flex-1 items-center justify-between gap-4 bg-[#f7fafc] px-4 py-4 text-sm font-semibold text-[#314761] transition hover:bg-[#eef5ff] hover:text-[#1d3b8b]"
                >
                  <span>{getLabel(idx)}</span>
                  <span
                    className="text-[#7b8da3] transition-transform duration-200"
                    style={{ display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                </button>
                {totalCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    title={isEn ? "Remove" : "Supprimer"}
                    className="flex h-full items-center border-l border-[#e8eff5] bg-[#f7fafc] px-3 py-4 text-[#a0b0c0] transition hover:bg-[#fff1f1] hover:text-[#af4b4b]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {isOpen && (
                <div className="grid gap-4 border-t border-[#e8eff5] bg-white p-5 md:grid-cols-2">
                  {fields.map((field) => (
                    <label
                      key={field.key}
                      className={field.type === "textarea" ? "md:col-span-2" : ""}
                    >
                      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          className="field-input min-h-[80px] resize-y"
                          placeholder={field.placeholder || ""}
                          value={entry[field.key] || ""}
                          onChange={(e) => updateEntry(idx, field.key, e.target.value)}
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="field-input"
                          value={entry[field.key] || ""}
                          onChange={(e) => updateEntry(idx, field.key, e.target.value)}
                        >
                          <option value="">{isEn ? "Select…" : "Sélectionnez…"}</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="field-input"
                          type={field.type || "text"}
                          placeholder={field.placeholder || ""}
                          value={entry[field.key] || ""}
                          onChange={(e) => updateEntry(idx, field.key, e.target.value)}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#c0d5ea] py-3 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#8ab0d0] hover:bg-[#f4f8fd]"
      >
        <span className="text-base">+</span>
        {isEn ? `Add a ${baseLabel.toLowerCase()}` : `Ajouter ${startsWithVowel(baseLabel) ? "une" : "une"} ${baseLabel.toLowerCase()}`}
      </button>
    </section>
  );
}

function startsWithVowel(str) {
  return /^[aeiouyàâéèêëîïôùûüæœ]/i.test(str || "");
}

function SubmitCandidacyForm({ token, locale }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [values, setValues] = useState({
    name: "",
    title: "",
    otherProfession: "",
    regions: [],
    sector: "",
    experience: "",
    email: "",
    description: ""
  });
  const isEn = locale === "en";

  function set(key, value) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "regions") {
        next.title = "";
        next.otherProfession = "";
        if (next.sector !== "Autre secteur") {
          next.sector = "";
        }
      }

      if (key === "title") {
        if (value !== "Autre profession") {
          next.otherProfession = "";
        }
        const derivedSector = findSectorForProfession(next.regions, value);
        if (derivedSector) {
          next.sector = derivedSector;
        }
      }

      if (key === "otherProfession") {
        next.title = value;
      }

      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "candidacy",
          title: `Nouvelle candidature : ${(values.title === "Autre profession" ? values.otherProfession : values.title) || "Sans titre"}`,
          fields: [
            { label: "Nom complet", value: values.name },
            { label: "Titre recherché", value: values.title === "Autre profession" ? values.otherProfession : values.title },
            { label: "Région souhaitée", value: stringifyRegionSelection(values.regions, "Toute la Belgique") },
            { label: "Secteur", value: values.sector },
            { label: "Expérience", value: values.experience },
            { label: "Email", value: values.email },
            { label: "Présentation", value: values.description }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

      setValues({ name: "", title: "", otherProfession: "", regions: [], sector: "", experience: "", email: "", description: "" });
      setOpen(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
        <div className="rounded-[24px] border border-[#c6e8e3] bg-[#f0fbf9] px-5 py-4 text-sm font-semibold text-[#1d7a6e]">
        {isEn ? "Your application has been sent to LEXPAT Connect. You will receive a confirmation by email." : "Votre candidature a bien été transmise à LEXPAT Connect. Vous recevrez une confirmation par email."}
      </div>
    );
  }

  if (!open) {
    return (
      <section className="rounded-[30px] border border-dashed border-[#a8d9d4] bg-[#f2fbfa] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Submit my application" : "Soumettre ma candidature"}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "Signal your interest to LEXPAT Connect. Your profile can be shared directly with Belgian employers that match your sector."
            : "Signalez votre intérêt à LEXPAT Connect. Votre profil pourra être présenté directement aux employeurs belges correspondant à votre secteur."}
        </p>
        <button
          onClick={() => {
            track("Worker CTA Clicked", { cta: isEn ? "Submit my application" : "Soumettre ma candidature", location: "worker-space" });
            setOpen(true);
          }}
          className="mt-5 inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          {isEn ? "Submit my application" : "Soumettre ma candidature"}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#a8d9d4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "New application" : "Nouvelle candidature"}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Describe your profile and job search" : "Décrivez votre profil et votre recherche"}</h2>
        </div>
        <button
          onClick={() => { setOpen(false); setError(""); }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0eaf2] bg-[#f5f9fd] text-[#6b7b8f] transition hover:bg-[#edf3f9]"
          aria-label={isEn ? "Close" : "Fermer"}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Full name" : "Nom complet"} *</span>
          <input className="field-input" type="text" placeholder={isEn ? "First name Last name" : "Prénom Nom"} required value={values.name} onChange={(e) => set("name", e.target.value)} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Email *</span>
          <input className="field-input" type="email" placeholder={isEn ? "your.email@example.com" : "votre.email@example.com"} required value={values.email} onChange={(e) => set("email", e.target.value)} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Preferred region" : "Région souhaitée"}</span>
          <RegionSelector
            value={values.regions || []}
            onChange={(nextRegions) => set("regions", nextRegions)}
            helperText={isEn ? "Select one or more regions to widen your search." : "Sélectionnez une ou plusieurs régions pour élargir votre recherche."}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Sector" : "Secteur"}</span>
          <select className="field-input" value={values.sector} onChange={(e) => set("sector", e.target.value)}>
            <option value="" disabled>{isEn ? "Select a sector" : "Sélectionnez un secteur"}</option>
            {getSectorOptions(isEn ? "en" : "fr").map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Target role" : "Métier recherché"}</span>
          {(values.regions || []).length ? (
            <select className="field-input" value={values.title} onChange={(e) => set("title", e.target.value)}>
              <option value="" disabled>{isEn ? "Select your role" : "Sélectionnez votre métier"}</option>
              {getProfessionGroupsForRegions(values.regions, isEn ? "en" : "fr").map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((profession) => (
                    <option key={`${group.label}-${profession.value}`} value={profession.value}>{profession.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
              {isEn ? "Select at least one region to choose a role" : "Sélectionnez au moins une région pour choisir un métier"}
            </div>
          )}
          {(values.regions || []).length ? (
            <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
              {(values.regions || []).length === 1
                ? isEn ? `Official shortage occupation list for ${values.regions[0]} — updated 2026` : `Liste officielle des métiers en pénurie pour ${values.regions[0]} — mise à jour 2026`
                : isEn ? "Consolidated 2026 shortage occupation list for the selected regions" : "Liste consolidée des métiers en pénurie 2026 pour les régions sélectionnées"}
            </p>
          ) : null}
        </label>

        {values.title === "Autre profession" ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Other role / details" : "Autre profession / précision"}</span>
            <input className="field-input" type="text" placeholder={isEn ? "Specify the exact job title you are targeting" : "Précisez l'intitulé exact du poste recherché"} value={values.otherProfession} onChange={(e) => set("otherProfession", e.target.value)} />
          </label>
        ) : null}

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Experience" : "Expérience"}</span>
          <select className="field-input" value={values.experience} onChange={(e) => set("experience", e.target.value)}>
            <option value="" disabled>{isEn ? "Select" : "Sélectionnez"}</option>
            <option>{isEn ? "Less than 1 year" : "Moins d'1 an"}</option>
            <option>{isEn ? "1 to 3 years" : "1 à 3 ans"}</option>
            <option>{isEn ? "3 to 5 years" : "3 à 5 ans"}</option>
            <option>{isEn ? "5 to 10 years" : "5 à 10 ans"}</option>
            <option>{isEn ? "10+ years" : "10 ans et plus"}</option>
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Profile summary" : "Présentation"}</span>
          <textarea
            className="field-input min-h-[8rem]"
            placeholder={isEn ? "Briefly describe your background, skills and current situation (country of residence, availability, languages…)" : "Décrivez brièvement votre parcours, vos compétences et votre situation actuelle (pays de résidence, disponibilité, langues…)"}
            rows={5}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>

        {error && (
          <div className="md:col-span-2 rounded-[18px] border border-[#f2c4c4] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33f3f]">
            {error}
          </div>
        )}

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#6b7b8f]">
            {isEn ? "Your application will be sent to LEXPAT Connect. You will receive a confirmation by email." : "Votre candidature sera transmise à LEXPAT Connect. Vous recevrez une confirmation par email."}
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setOpen(false); setError(""); }} className="secondary-button">{isEn ? "Cancel" : "Annuler"}</button>
            <button type="submit" disabled={loading} className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? (isEn ? "Sending…" : "Envoi…") : isEn ? "Send my application" : "Envoyer ma candidature"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function CvView({ locale }) {
  const isEn = locale === "en";
  const { session } = useAuth();
  const fileInputRef = useRef(null);

  // ── Upload state ──────────────────────────────────────────────────────────
  const [cvFileName, setCvFileName] = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [uploadMsg,  setUploadMsg]  = useState("");
  const uploadIsError = uploadMsg.startsWith("❌");

  // ── CV sections data ──────────────────────────────────────────────────────
  const [cvData, setCvData]   = useState({});
  const [videoUrl, setVideoUrl] = useState("");

  // ── Save state ────────────────────────────────────────────────────────────
  const [saving,  setSaving]  = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const saveIsError = saveMsg.startsWith("❌");

  const sections = getCvSections(locale);

  // Open the native file picker
  function handleFileClick() {
    fileInputRef.current?.click();
  }

  // Upload the selected file to the server
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setUploading(true);
    setUploadMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res  = await fetch("/api/cv-upload", {
        method: "POST",
        body: formData,
        headers: { "Authorization": `Bearer ${session?.access_token || ""}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadMsg(isEn ? "✓ File uploaded." : "✓ Fichier téléversé.");
    } catch (err) {
      setUploadMsg(`❌ ${err.message}`);
      setCvFileName("");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Update a single CV section's data
  function handleSectionChange(sectionKey, updated) {
    setCvData((prev) => ({ ...prev, [sectionKey]: updated }));
  }

  // Save the full CV data
  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res  = await fetch("/api/profile/cv", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body:    JSON.stringify({ cv_data: { ...cvData, videoUrl } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaveMsg(isEn ? "✓ CV saved." : "✓ CV enregistré.");
    } catch (err) {
      setSaveMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My CV" : "Mon CV"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">
          {isEn ? "Build a more credible CV" : "Structurer un CV plus crédible"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "Add your documents, education, work experience and skills in a format that makes your application easier for an employer to read."
            : "Ajoutez vos documents, vos formations, vos expériences et vos compétences dans un format qui aide un employeur à mieux lire votre dossier."}
        </p>
      </section>

      {/* ── CV Upload ── */}
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">
          {isEn ? "Main document" : "Document principal"}
        </h2>

        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-5 rounded-[24px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-6">
          <p className="text-sm leading-7 text-[#5f7086]">
            {isEn
              ? "Upload your CV as a PDF, DOC or DOCX file (max 5 MB). You can then enrich it with the rest of your profile."
              : "Téléversez votre CV en PDF, DOC ou DOCX (max 5 Mo). Cette version pourra ensuite être complétée par les autres éléments du profil."}
          </p>

          {cvFileName && (
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#314761]">
              <span>📄</span>
              <span className="truncate">{cvFileName}</span>
            </p>
          )}

          {uploadMsg && (
            <p className={`mt-2 text-sm font-semibold ${uploadIsError ? "text-[#a33f3f]" : "text-[#1d7a6e]"}`}>
              {uploadMsg}
            </p>
          )}

          <button
            type="button"
            onClick={handleFileClick}
            disabled={uploading}
            className="secondary-button mt-5 disabled:opacity-60"
          >
            {uploading
              ? (isEn ? "Uploading…" : "Envoi en cours…")
              : cvFileName
                ? (isEn ? "Replace the file" : "Remplacer le fichier")
                : (isEn ? "Upload a file" : "Téléverser un fichier")}
          </button>
        </div>
      </section>

      {/* ── CV Sections (accordions) ── */}
      {sections.map((section) => (
        <CvCollectionAccordion
          key={section.sectionKey}
          title={section.title}
          description={section.description}
          sectionKey={section.sectionKey}
          items={section.items}
          locale={locale}
          data={cvData[section.sectionKey] || []}
          onChange={handleSectionChange}
        />
      ))}

      {/* ── Video introduction ── */}
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">
          {isEn ? "Video introduction" : "Présentation vidéo"}
        </h2>
        <label className="mt-6 block text-sm font-medium text-[#5f7086]">
          {isEn ? "Video link (YouTube, Vimeo…)" : "Lien vidéo (YouTube, Vimeo…)"}
        </label>
        <input
          type="url"
          className="field-input mt-2"
          placeholder="https://youtube.com/..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </section>

      {/* ── Save ── */}
      {saveMsg && (
        <div className={`rounded-[22px] border px-4 py-3 text-sm font-semibold ${
          saveIsError
            ? "border-[#f2c4c4] bg-[#fff5f5] text-[#a33f3f]"
            : "border-[#c6e8e3] bg-[#f0fbf9] text-[#1d7a6e]"
        }`}>
          {saveMsg}
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-8 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70"
        >
          {saving ? (isEn ? "Saving…" : "Enregistrement…") : (isEn ? "Save my CV" : "Enregistrer mon CV")}
        </button>
      </div>
    </div>
  );
}

export default function WorkerSpace({ locale = "fr" }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const isEn = locale === "en";
  const sidebarItems = getSidebarItems(locale);

  const token = session?.access_token ?? null;

  // useMemo MUST be before any conditional return (Rules of Hooks)
  const completion = useMemo(() => {
    if (activeTab === "dashboard") return 38;
    if (activeTab === "profile") return 62;
    return 54;
  }, [activeTab]);

  // Redirection si non connecté (après chargement)
  useEffect(() => {
    if (!loading && !session) {
      router.replace(isEn ? "/en/connexion" : "/connexion");
    }
  }, [loading, session, router, isEn]);

  useEffect(() => {
    if (!loading && session && user?.user_metadata?.role === "employer") {
      router.replace(isEn ? "/en/employeurs/espace" : "/employeurs/espace");
    }
  }, [loading, session, user, router, isEn]);

  if (loading || !session || user?.user_metadata?.role === "employer") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#59B9B1] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="pb-12 pt-8 sm:pb-16 lg:pb-20 lg:pt-10">
      <div className="container-shell">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <aside className="rounded-[32px] border border-[#e4edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 xl:sticky xl:top-8">
            <div className="flex items-center gap-4 rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] p-4">
              <div className="relative flex h-16 w-16 overflow-hidden rounded-[20px] border border-[#d9e9f1] bg-white shadow-[0_4px_12px_rgba(29,59,139,0.08)]">
                <Image src="/logo-lexpat-connect.png" alt="LEXPAT" fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#17345d]">{isEn ? "Worker profile" : "Profil travailleur"}</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">{isEn ? "Worker" : "Travailleur"}</span>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {sidebarItems.map((item) => (
                item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-semibold text-[#5f7086] transition hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                >
                  <span>{item.label}</span>
                  <span className="text-[#8ea1bb]">›</span>
                </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === item.id
                        ? "bg-[#eef5ff] text-[#1d3b8b] shadow-[inset_0_0_0_1px_rgba(160,184,216,0.45)]"
                        : "text-[#5f7086] hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[#8ea1bb]">›</span>
                  </button>
                )
              ))}
            </nav>

            {user?.email && (
              <div className="mt-6 rounded-[16px] border border-[#e7eef5] bg-[#f9fbfd] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8ea1bb]">
                  {isEn ? "Logged in as" : "Connecté en tant que"}
                </p>
                <p className="mt-1 break-all text-[12px] font-semibold text-[#17345d]">{user.email}</p>
              </div>
            )}

          </aside>

          <div>
            {activeTab === "dashboard" ? <DashboardView token={token} onNavigate={setActiveTab} locale={locale} /> : null}
            {activeTab === "matches" ? <WorkerMatchesView token={token} locale={locale} /> : null}
            {activeTab === "profile" ? <ProfileView token={token} locale={locale} onNavigate={setActiveTab} /> : null}
            {activeTab === "cv" ? <CvView locale={locale} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
