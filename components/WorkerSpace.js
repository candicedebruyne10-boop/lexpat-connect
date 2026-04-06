"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";
import RegionSelector from "./RegionSelector";
import {
  getProfessionGroupsForRegions,
  findSectorForProfession,
  parseRegionSelection,
  sectorOptions,
  stringifyRegionSelection
} from "../lib/professions";

function getSidebarItems(locale) {
  if (locale === "en") {
    return [
      { id: "dashboard", label: "Dashboard" },
      { id: "matches", label: "My matches" },
      { id: "profile", label: "My profile" },
      { id: "cv", label: "My CV" }
    ];
  }

  return [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "matches", label: "Mes matchs" },
    { id: "profile", label: "Mon profil" },
    { id: "cv", label: "Mon CV" }
  ];
}

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  rose: "bg-[#fff0f0] text-[#d64545]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

const profileSections = [
  {
    title: "Informations principales",
    fields: [
      { label: "Nom complet", placeholder: "Candice Debruyne" },
      { label: "Date de naissance", placeholder: "JJ/MM/AAAA" },
      { label: "Genre", type: "select", options: ["Femme", "Homme", "Autre", "Préfère ne pas répondre"] },
      { label: "Tranche d'âge", type: "select", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
      { label: "Téléphone", placeholder: "+32 ..." },
      { label: "Email", type: "email", placeholder: "votre.email@example.com" },
      { label: "Expérience", type: "select", options: ["Débutant", "1 à 3 ans", "3 à 5 ans", "5 à 10 ans", "10 ans et plus"] },
      { label: "Prétention salariale", placeholder: "Indiquez un montant indicatif" },
      { label: "Titre recherché", placeholder: "Intitulé de poste recherché", wide: true },
      { label: "Présentation", type: "textarea", placeholder: "Présentez votre parcours, vos compétences et le type d'opportunités que vous recherchez.", wide: true },
      { label: "Afficher mon profil", type: "select", options: ["Visible", "Visible sur validation", "Masqué"] }
    ]
  },
  {
    title: "Qualification et langues",
    fields: [
      { label: "Qualification", type: "select", options: ["Secondaire", "Bachelier", "Master", "Doctorat", "Certification professionnelle", "Autre"] },
      { label: "Langues", type: "select", options: ["Français", "Anglais", "Néerlandais", "Allemand", "Espagnol", "Autre"] },
      { label: "Autre langue", placeholder: "Précisez si nécessaire" },
      { label: "Catégorie métier", type: "select", options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Personnel hautement qualifié", "Personnel de direction"] }
    ]
  },
  {
    title: "Coordonnées et réseaux",
    fields: [
      { label: "Adresse", placeholder: "Adresse complète", wide: true },
      { label: "Emplacement souhaité", type: "select", options: ["Bruxelles-Capitale", "Wallonie", "Flandre", "Toute la Belgique"] },
      { label: "Localisation actuelle", placeholder: "Ville et pays de résidence" },
      { label: "LinkedIn", placeholder: "https://linkedin.com/in/...", wide: true },
      { label: "Autre réseau", placeholder: "Portfolio, site, vidéo...", wide: true }
    ]
  }
];

function getCvSections(locale) {
  if (locale === "en") {
    return [
      {
        title: "Education",
        description: "Add your main degrees and formal training.",
        items: ["Main degree", "Additional training"],
        buttonLabel: "Add"
      },
      {
        title: "Experience",
        description: "Present the work experience that matters most to a Belgian employer.",
        items: ["Main experience", "Additional experience"],
        buttonLabel: "Add"
      },
      {
        title: "Certificates",
        description: "Mention any certifications or distinctions that strengthen your profile.",
        items: ["Certificate or distinction"],
        buttonLabel: "Add"
      },
      {
        title: "Skills",
        description: "List the technical or operational skills that support your application.",
        items: ["Skill 1", "Skill 2"],
        buttonLabel: "Add"
      }
    ];
  }

  return [
    {
      title: "Formation",
      description: "Ajoutez vos diplômes et formations principales.",
      items: ["Diplôme principal", "Formation complémentaire"],
      buttonLabel: "Ajouter"
    },
    {
      title: "Expériences",
      description: "Présentez vos expériences les plus pertinentes pour un employeur belge.",
      items: ["Expérience principale", "Expérience complémentaire"],
      buttonLabel: "Ajouter"
    },
    {
      title: "Certificats",
      description: "Mentionnez vos certifications ou distinctions utiles.",
      items: ["Certificat ou distinction"],
      buttonLabel: "Ajouter"
    },
    {
      title: "Compétences",
      description: "Listez les compétences techniques ou opérationnelles qui renforcent votre dossier.",
      items: ["Compétence 1", "Compétence 2"],
      buttonLabel: "Ajouter"
    }
  ];
}

function Field({ field }) {
  const base = "field-input";

  return (
    <label className={field.wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${base} min-h-36`} rows={6} placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <select className={base} defaultValue="">
          <option value="" disabled>
            Sélectionnez une option
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
  const [matchCount, setMatchCount] = useState(0);
  const isEn = locale === "en";

  useEffect(() => {
    if (!token) return;
    fetch("/api/matches?role=worker", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setMatchCount(d.matches?.length || 0))
      .catch(() => {});
  }, [token]);

  const displayStats = [
    { label: isEn ? "Matched jobs" : "Offres matchées", value: matchCount, tone: "teal" },
    { label: isEn ? "Applications under review" : "Dossiers en examen", value: 0, tone: "amber" },
    { label: isEn ? "Profile views" : "Vues du profil", value: 0, tone: "rose" },
    { label: isEn ? "Shortlisted" : "Présélectionné", value: 0, tone: "green" }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "Worker space" : "Espace travailleur"}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Candidate dashboard" : "Tableau de bord candidat"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
              {isEn
                ? "See your matched opportunities, complete your profile and monitor your visibility with Belgian employers."
                : "Retrouvez vos offres matchées, complétez votre profil et suivez votre visibilité auprès des employeurs belges."}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d9ebe8] bg-[#f5fbfb] px-5 py-4 text-sm text-[#33566b]">
            {isEn ? "Matching:" : "Matching :"} <span className="font-semibold text-[#1d3b8b]">{isEn ? "active" : "actif"}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {displayStats.map((item) => (
          <article
            key={item.label}
            className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] cursor-pointer transition hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            onClick={() => item.label === (isEn ? "Matched jobs" : "Offres matchées") ? onNavigate("matches") : null}
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold ${toneClasses[item.tone]}`}>
              {item.value}
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.label}</h3>
          </article>
        ))}
      </section>

      <SubmitCandidacyForm token={token} locale={locale} />
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

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My matches" : "Mes matchs"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Jobs that match your profile" : "Offres qui correspondent à votre profil"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "The LEXPAT Connect engine automatically compares your sector and preferred region with Belgian employers' openings. Contact details are only shared after mutual validation."
            : "Le moteur LEXPAT Connect croise automatiquement votre secteur et votre région avec les offres des employeurs belges. Les coordonnées employeur sont partagées uniquement après validation."}
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
                  {match.score}/100
                </span>
              </div>
              <div className="mt-4 rounded-[20px] border border-[#dce9e7] bg-[#f2fbfa] px-4 py-3 text-xs text-[#5f7086]">
                {match.status?.toLowerCase() === "contacted"
                  ? <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold text-[#2f9d57]">{isEn ? "Confirmed match" : "Match confirmé"}</span> {isEn ? "— Contact details are now unlocked." : "— Les coordonnées sont débloquées."}</>
                  : <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold capitalize">{match.status === "pending" ? (isEn ? "Pending review" : "En attente de validation") : match.status}</span> {isEn ? "— Employer details will become available once the contact is confirmed." : "— Les coordonnées du profil seront accessibles après confirmation du contact."}</>
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
                      {openingChat === match.id ? (isEn ? "Opening…" : "Ouverture…") : isEn ? "Open chat →" : "Ouvrir la messagerie →"}
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
                      {acting === match.id ? "…" : isEn ? "Confirm my interest → confirm the match" : "Confirmer mon intérêt → Match confirmé"}
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

function ProfileView({ token, locale }) {
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const isEn = locale === "en";
  const [values, setValues] = useState({
    full_name: "", profession: "", otherProfession: "", sector: "", regions: [],
    experience: "", languages: "", description: "", profile_visibility: "review"
  });

  useEffect(() => {
    if (!token) return;
    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setValues((prev) => ({
            ...prev,
            ...d.profile,
            profession: d.profile.job_option || d.profile.job_title || "",
            otherProfession: d.profile.otherProfession || "",
            regions: d.profile.regions || parseRegionSelection(d.profile.region)
          }));
        }
      })
      .catch(() => {});
  }, [token]);

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
          region: stringifyRegionSelection(values.regions, "Toute la Belgique"),
          job_option: values.profession,
          job_title: values.profession === "Autre profession" ? values.otherProfession : values.profession,
          job_title_other: values.profession === "Autre profession" ? values.otherProfession : ""
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveMsg(isEn ? "Profile saved — your visibility is now active in the matching engine." : "Profil enregistré — votre visibilité est maintenant active dans le moteur de matching.");
    } catch (err) {
      setSaveMsg((isEn ? "Error: " : "Erreur : ") + err.message);
    } finally {
      setSaving(false);
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

      <form onSubmit={handleSave} className="space-y-6">
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
                {sectorOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
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
                  {getProfessionGroupsForRegions(values.regions).map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((profession) => (
                        <option key={`${group.label}-${profession}`} value={profession}>{profession}</option>
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
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Profile visibility" : "Visibilité du profil"}</span>
              <select className="field-input" value={values.profile_visibility || "review"} onChange={(e) => set("profile_visibility", e.target.value)}>
                <option value="visible">{isEn ? "Visible to employers" : "Visible par les employeurs"}</option>
                <option value="review">{isEn ? "Visible after LEXPAT review" : "Visible après validation LEXPAT"}</option>
                <option value="hidden">{isEn ? "Hidden" : "Masqué"}</option>
              </select>
            </label>
          </div>
        </section>

        {saveMsg && (
          <div className={`rounded-[22px] border px-4 py-3 text-sm ${saveMsg.startsWith("Erreur") ? "border-[#f2c4c4] bg-[#fff5f5] text-[#a33f3f]" : "border-[#c6e8e3] bg-[#f0fbf9] text-[#1d7a6e]"}`}>
            {saveMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-8 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70">
            {saving ? (isEn ? "Saving…" : "Enregistrement…") : isEn ? "Save my profile" : "Enregistrer mon profil"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CvCollection({ title, description, items, buttonLabel = "Ajouter" }) {
  return (
    <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#5f7086]">{description}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-4 rounded-[20px] border border-[#e8eff5] bg-[#f7fafc] px-4 py-4 text-sm text-[#314761]">
            <span>{item}</span>
            <span className="text-[#7b8da3]">▾</span>
          </div>
        ))}
      </div>
      <button className="mt-5 secondary-button">{buttonLabel}</button>
    </section>
  );
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
            ? "Signal your interest to LEXPAT Connect. Your profile will be reviewed and introduced to Belgian employers that match your sector."
            : "Signalez votre intérêt à LEXPAT Connect. Votre profil sera examiné et mis en relation avec les employeurs belges correspondant à votre secteur."}
        </p>
        <button onClick={() => setOpen(true)} className="mt-5 inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
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
          aria-label="Fermer"
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
            {sectorOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Target role" : "Métier recherché"}</span>
          {(values.regions || []).length ? (
            <select className="field-input" value={values.title} onChange={(e) => set("title", e.target.value)}>
              <option value="" disabled>{isEn ? "Select your role" : "Sélectionnez votre métier"}</option>
              {getProfessionGroupsForRegions(values.regions).map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((profession) => (
                    <option key={`${group.label}-${profession}`} value={profession}>{profession}</option>
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
            {isEn ? "Your application will be reviewed by LEXPAT Connect. You will receive a confirmation by email." : "Votre candidature sera examinée par LEXPAT Connect. Vous recevrez une confirmation par email."}
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
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My CV" : "Mon CV"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Build a more credible CV" : "Structurer un CV plus crédible"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">{isEn ? "Add your documents, education, work experience and skills in a format that makes your application easier for an employer to read." : "Ajoutez vos documents, vos formations, vos expériences et vos compétences dans un format qui aide un employeur à mieux lire votre dossier."}</p>
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Main document" : "Document principal"}</h2>
        <div className="mt-5 rounded-[24px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-6">
          <p className="text-sm leading-7 text-[#5f7086]">{isEn ? "Upload your CV as a PDF, DOC or DOCX file. You can then enrich it with the rest of your profile." : "Téléversez votre CV en PDF, DOC ou DOCX. Cette version pourra ensuite être complétée par les autres éléments du profil."}</p>
          <button className="secondary-button mt-5">{isEn ? "Upload a file" : "Téléverser un fichier"}</button>
        </div>
      </section>

      {getCvSections(locale).map((section) => (
        <CvCollection key={section.title} {...section} />
      ))}

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Video introduction" : "Présentation vidéo"}</h2>
        <textarea className="field-input mt-6 min-h-32" placeholder={isEn ? "Add a video link or a short presentation if you want to enrich your profile." : "Ajoutez un lien vidéo ou une courte présentation si vous souhaitez compléter votre profil."} rows={5} />
      </section>

      <div className="flex justify-end">
        <button className="primary-button">{isEn ? "Save my CV" : "Enregistrer mon CV"}</button>
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

  if (loading || !session) {
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
                <Image src="/logo-lexpat-connect.png" alt="LEXPAT Connect" fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#17345d]">{isEn ? "Worker profile" : "Profil travailleur"}</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">{isEn ? "Candidate" : "Candidat"}</span>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {sidebarItems.map((item) => (
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
              ))}
            </nav>

            <div className="mt-8 rounded-[24px] border border-[#e7eef5] bg-[#f9fbfd] p-5">
              <p className="text-sm font-semibold text-[#17345d]">{isEn ? "Profile completion" : "Complétude du profil"}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d94b4b]">{completion}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e3eaf1]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#57b7af_0%,#1d3b8b_100%)]" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6d7d91]">{isEn ? "Complete your profile and CV to make your application clearer, stronger and easier for a Belgian employer to assess." : "Complétez votre profil et votre CV pour rendre votre candidature plus claire, plus sérieuse et plus exploitable pour un employeur belge."}</p>
            </div>
          </aside>

          <div>
            {activeTab === "dashboard" ? <DashboardView token={token} onNavigate={setActiveTab} locale={locale} /> : null}
            {activeTab === "matches" ? <WorkerMatchesView token={token} locale={locale} /> : null}
            {activeTab === "profile" ? <ProfileView token={token} locale={locale} /> : null}
            {activeTab === "cv" ? <CvView locale={locale} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
