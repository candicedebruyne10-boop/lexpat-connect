"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";
import RegionSelector from "./RegionSelector";
import {
  findSectorForProfession,
  getSectorOptions,
  getProfessionGroupsForRegions,
  parseRegionSelection,
  stringifyRegionSelection
} from "../lib/professions";
import { normalizeRegion } from "../lib/matching";

function getSidebarItems(locale) {
  if (locale === "en") {
    return [
      { id: "dashboard", label: "Dashboard" },
      { id: "company", label: "Employer profile" },
      { id: "offers", label: "My openings" },
      { id: "matches", label: "Candidates for my openings" },
      { id: "messaging", label: "Messaging", href: "/en/messagerie" }
    ];
  }

  return [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "company", label: "Mon entreprise" },
    { id: "offers", label: "Mes offres" },
    { id: "matches", label: "Candidats pour mes offres" },
    { id: "messaging", label: "Messagerie", href: "/messagerie" }
  ];
}

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  teal: "bg-[#eef9f8] text-[#2b8f88]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

function formatCompatibilityLabel(score, isEn) {
  return `${isEn ? "Compatibility" : "Compatibilité"} ${score}/100`;
}

function formatEmployerMatchStatus(status, isEn) {
  switch ((status || "").toLowerCase()) {
    case "contacted":
      return isEn ? "Confirmed match" : "Match confirmé";
    case "reviewed":
      return isEn ? "Worker interested" : "Candidat intéressé";
    case "interested":
      return isEn ? "Interest sent" : "Intérêt envoyé";
    case "pending":
      return isEn ? "Pending review" : "En attente de validation";
    case "new":
      return isEn ? "New profile" : "Nouveau profil";
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

function getCompanyFields(locale) {
  if (locale === "en") {
    return [
      { name: "companyName", label: "Company name", placeholder: "Legal entity name" },
      {
        name: "sector",
        label: "Main sector",
        type: "select",
        options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Autre"]
      },
      { name: "contactName", label: "Contact person", placeholder: "First name Last name" },
      { name: "email", label: "Business email", type: "email", placeholder: "contact@company.be" },
      { name: "phone", label: "Phone", placeholder: "+32 ..." },
      { name: "website", label: "Website", placeholder: "https://..." },
      {
        name: "region",
        label: "Main region",
        type: "select",
        options: ["Bruxelles-Capitale", "Wallonie", "Flandre", "Plusieurs régions"]
      },
      {
        name: "description",
        label: "Company description",
        type: "textarea",
        placeholder: "Briefly present the activity, size and hiring context of the company.",
        wide: true
      }
    ];
  }

  return [
    { name: "companyName", label: "Nom de l'entreprise", placeholder: "Raison sociale" },
    {
      name: "sector",
      label: "Secteur principal",
      type: "select",
      options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Autre"]
    },
    { name: "contactName", label: "Personne de contact", placeholder: "Prénom Nom" },
    { name: "email", label: "Email professionnel", type: "email", placeholder: "contact@entreprise.be" },
    { name: "phone", label: "Téléphone", placeholder: "+32 ..." },
    { name: "website", label: "Site internet", placeholder: "https://..." },
    {
      name: "region",
      label: "Région principale",
      type: "select",
      options: ["Bruxelles-Capitale", "Wallonie", "Flandre", "Plusieurs régions"]
    },
    {
      name: "description",
      label: "Description de l'entreprise",
      type: "textarea",
      placeholder: "Présentez brièvement l'activité, la taille et le contexte de l'entreprise.",
      wide: true
    }
  ];
}

function Field({ field, value, onChange }) {
  const isEn = field.locale === "en";
  const base = "field-input";

  return (
    <label className={field.wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${base} min-h-36`} rows={6} placeholder={field.placeholder} value={value} onChange={(event) => onChange(field.name, event.target.value)} />
      ) : field.type === "select" ? (
        <select className={base} value={value} onChange={(event) => onChange(field.name, event.target.value)}>
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
        <input className={base} type={field.type || "text"} placeholder={field.placeholder} value={value} onChange={(event) => onChange(field.name, event.target.value)} />
      )}
    </label>
  );
}

function DashboardView({ token, onNavigate, locale }) {
  const [stats, setStats] = useState({ offers: 0, matches: 0 });
  const isEn = locale === "en";

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch("/api/offers", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/matches?role=employer", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ]).then(([offersData, matchesData]) => {
      setStats({
        offers: offersData.offers?.length || 0,
        matches: matchesData.matches?.length || 0
      });
    }).catch(() => {});
  }, [token]);

  const displayStats = [
    { label: isEn ? "Published openings" : "Offres publiées", value: stats.offers, tone: "blue" },
    { label: isEn ? "Matching profiles" : "Profils correspondants", value: stats.matches, tone: "teal" }
  ];
  const matchingStatus =
    stats.matches > 0
      ? isEn
        ? `${stats.matches} profile${stats.matches > 1 ? "s" : ""} detected`
        : `${stats.matches} profil${stats.matches > 1 ? "s" : ""} détecté${stats.matches > 1 ? "s" : ""}`
      : isEn
        ? "No profile detected yet"
        : "Aucun profil détecté pour l'instant";

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "Employer space" : "Espace employeur"}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Recruitment dashboard" : "Tableau de bord recrutement"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
              {isEn
                ? "Track your published openings and the profiles automatically matched by the LEXPAT Connect engine."
                : "Suivez vos offres publiées et les profils matchés automatiquement par le moteur LEXPAT Connect."}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d9ebe8] bg-[#f5fbfb] px-5 py-4 text-sm text-[#33566b]">
            {isEn ? "Matching:" : "Matching :"} <span className="font-semibold text-[#1d3b8b]">{matchingStatus}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {displayStats.map((item) => (
          <article
            key={item.label}
            className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] cursor-pointer transition hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            onClick={() => item.label === (isEn ? "Matching profiles" : "Profils correspondants") ? onNavigate("matches") : item.label === (isEn ? "Published openings" : "Offres publiées") ? onNavigate("offers") : null}
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold ${toneClasses[item.tone]}`}>
              {item.value}
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.label}</h3>
          </article>
        ))}
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Legal support" : "Relais juridique"}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">
          {isEn
            ? "The LEXPAT Law Firm is available to support you further with any legal questions related to hiring a foreign national in Belgium."
            : "Le cabinet LEXPAT est disponible pour vous accompagner plus loin sur toute question juridique liée au recrutement d'un ressortissant étranger en Belgique."}
        </p>
        <div className="mt-4">
          <a
            href="mailto:lexpat@lexpat.be"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1d3b8b] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(29,59,139,0.25)]"
          >
            ✉ {isEn ? "Contact LEXPAT Law Firm" : "Contacter le cabinet LEXPAT"}
          </a>
        </div>
      </section>
    </div>
  );
}

function CompanyView({ token, locale }) {
  const [values, setValues] = useState({
    companyName: "",
    sector: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    region: "",
    description: "",
    preferred_locale: locale === "en" ? "en" : "fr",
    match_alerts_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isEn = locale === "en";

  const updateValue = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/employer-profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => {
        if (data.profile) {
          setValues({
            companyName: data.profile.companyName || "",
            sector: data.profile.sector || "",
            contactName: data.profile.contactName || "",
            email: data.profile.email || "",
            phone: data.profile.phone || "",
            website: data.profile.website || "",
            region: data.profile.region || "",
            description: data.profile.description || "",
            preferred_locale: data.profile.preferred_locale || (locale === "en" ? "en" : "fr"),
            match_alerts_enabled: data.profile.match_alerts_enabled !== false
          });
        }
      })
      .catch(() => {
        setError(isEn ? "Unable to load the company profile." : "Impossible de charger la fiche entreprise.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/employer-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (isEn ? "Unable to save the company profile." : "Impossible d'enregistrer l'entreprise."));
      }

      setMessage(isEn ? `Company profile saved. Completion: ${data.completion}%` : `Fiche entreprise enregistrée. Complétude : ${data.completion}%`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My company" : "Mon entreprise"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Structure your employer profile" : "Structurer votre fiche employeur"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">{isEn ? "Centralise the information that helps present your company, your hiring context and your selection criteria in a stronger way." : "Centralisez les éléments qui permettent de présenter votre entreprise, votre contexte de recrutement et vos critères de sélection de manière plus sérieuse."}</p>
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Company information" : "Informations entreprise"}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          {isEn ? "This profile structures your employer presence and becomes the foundation for future openings published on the platform." : "Cette fiche structure votre présence employeur et sert de base aux prochains recrutements publiés sur la plateforme."}
        </p>

        {loading ? (
          <div className="mt-6 flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {getCompanyFields(locale).map((field) => (
                <Field key={field.name} field={{ ...field, locale }} value={values[field.name] || ""} onChange={updateValue} />
              ))}
              <label className="md:col-span-2 rounded-[20px] border border-[#dce8f6] bg-[#f8fbff] px-4 py-4">
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={values.match_alerts_enabled !== false}
                    onChange={(event) => updateValue("match_alerts_enabled", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#bfd0e5] text-[#1E3A78] focus:ring-[#57B7AF]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#17345d]">
                      {isEn ? "Email me when a new talent matches one of my openings" : "M’envoyer un email quand un nouveau talent correspond à l’une de mes offres"}
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

            {error ? (
              <div className="rounded-[18px] border border-[#f2c4c4] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33f3f]">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-[18px] border border-[#c6e8e3] bg-[#f0fbf9] px-4 py-3 text-sm text-[#1d7a6e]">
                {message}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button disabled={saving} className="primary-button disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? (isEn ? "Saving…" : "Enregistrement…") : isEn ? "Save company profile" : "Enregistrer l'entreprise"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function CreateOfferForm({ onSuccess, token, locale }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    title: "", profession: "", otherProfession: "", sector: "", region: "", contract: "", urgency: "", email: "", description: ""
  });
  const isEn = locale === "en";

  function set(key, value) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "region") {
        next.profession = "";
        next.otherProfession = "";
        next.title = "";
        if (next.sector !== "Autre secteur") {
          next.sector = "";
        }
      }

      if (key === "profession") {
        if (value !== "Autre profession") {
          next.otherProfession = "";
          next.title = value;
        }

        const derivedSector = findSectorForProfession(next.region, value);
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
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title:         values.profession === "Autre profession" ? values.otherProfession : values.profession,
          shortage_job:  values.profession,
          shortage_job_other: values.profession === "Autre profession" ? values.otherProfession : "",
          sector:        values.sector,
          region:        values.region,
          contract_type: values.contract,
          urgency:       values.urgency,
          description:   values.description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isEn ? "Error while sending the opening." : "Erreur lors de l'envoi."));

      setValues({ title: "", profession: "", otherProfession: "", sector: "", region: "", contract: "", urgency: "", email: "", description: "" });
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <section className="rounded-[30px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Create a new opening" : "Créer une nouvelle offre"}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">
          {isEn ? "Submit your hiring need. It will be sent directly to LEXPAT Connect for review and matching." : "Déposez votre besoin de recrutement. Il sera transmis directement à LEXPAT Connect pour traitement et mise en relation."}
        </p>
        <button onClick={() => setOpen(true)} className="primary-button mt-5">
          {isEn ? "Add an opening" : "Ajouter une offre"}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#d4e2f4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "New opening" : "Nouvelle offre"}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3b8b]">{isEn ? "Describe your hiring need" : "Décrivez votre besoin de recrutement"}</h2>
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
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Sector" : "Secteur"} * <span className="text-[#57b7af]">{isEn ? "(used for matching)" : "(utilisé pour le matching)"}</span></span>
          <select className="field-input" required value={values.sector} onChange={(e) => set("sector", e.target.value)}>
            <option value="" disabled>{isEn ? "Select a sector" : "Sélectionnez un secteur"}</option>
            {getSectorOptions(isEn ? "en" : "fr").map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Region" : "Région"} *</span>
          <RegionSelector
            value={parseRegionSelection(values.region)}
            onChange={(nextRegions) => set("region", nextRegions)}
            helperText={isEn ? "Select one, two or three regions depending on your hiring scope." : "Sélectionnez une, deux ou trois régions selon votre besoin de recrutement."}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Target role" : "Métier recherché"} *</span>
          {values.region ? (
            <select className="field-input" required value={values.profession} onChange={(e) => set("profession", e.target.value)}>
              <option value="" disabled>{isEn ? "Select the target role" : "Sélectionnez le métier visé"}</option>
              {getProfessionGroupsForRegions(values.region, isEn ? "en" : "fr").map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((profession) => (
                    <option key={`${group.label}-${profession.value}`} value={profession.value}>{profession.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
              {isEn ? "Select a region first to choose a role" : "Sélectionnez d'abord une région pour choisir un métier"}
            </div>
          )}
          {parseRegionSelection(values.region).length === 1 ? (
            <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
              {isEn ? `Official shortage occupation list for ${parseRegionSelection(values.region)[0]} — updated 2026` : `Liste officielle des métiers en pénurie pour ${parseRegionSelection(values.region)[0]} — mise à jour 2026`}
            </p>
          ) : values.region ? (
            <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
              {isEn ? "Consolidated 2026 shortage occupation list for the selected regions." : "Liste consolidée des métiers en pénurie 2026 pour les régions sélectionnées."}
            </p>
          ) : null}
        </label>

        {values.profession === "Autre profession" ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Other role / details" : "Autre profession / précision"} *</span>
            <input className="field-input" type="text" placeholder={isEn ? "Specify the exact job title" : "Précisez l'intitulé exact du poste"} required value={values.otherProfession} onChange={(e) => set("otherProfession", e.target.value)} />
          </label>
        ) : null}

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Contract type" : "Type de contrat"}</span>
          <select className="field-input" value={values.contract} onChange={(e) => set("contract", e.target.value)}>
            <option value="" disabled>{isEn ? "Select a type" : "Sélectionnez un type"}</option>
            <option value="CDI">{isEn ? "Open-ended contract (CDI)" : "CDI"}</option>
            <option value="CDD">{isEn ? "Fixed-term contract (CDD)" : "CDD"}</option>
            <option value="Intérim">{isEn ? "Temporary / Interim" : "Intérim"}</option>
            <option value="Temps plein">{isEn ? "Full-time" : "Temps plein"}</option>
            <option value="Temps partiel">{isEn ? "Part-time" : "Temps partiel"}</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Urgency level" : "Niveau d'urgence"}</span>
          <select className="field-input" value={values.urgency} onChange={(e) => set("urgency", e.target.value)}>
            <option value="" disabled>{isEn ? "Select a level" : "Sélectionnez un niveau"}</option>
            <option value="Normal">{isEn ? "Standard" : "Normal"}</option>
            <option value="Urgent">{isEn ? "Urgent" : "Urgent"}</option>
            <option value="Très urgent">{isEn ? "Very urgent" : "Très urgent"}</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Contact email" : "Email de contact"} *</span>
          <input
            className="field-input"
            type="email"
            placeholder={isEn ? "contact@company.be" : "contact@entreprise.be"}
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Opening summary" : "Description du besoin"}</span>
          <textarea
            className="field-input min-h-[8rem]"
            placeholder={isEn ? "Expected skills, experience, context, preferred timing…" : "Compétences attendues, expérience, contexte, disponibilité souhaitée…"}
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

        <div className="md:col-span-2 rounded-[18px] border border-[#dce8f6] bg-[#f8fbff] px-4 py-3 text-sm text-[#4e6380]">
          {isEn ? "Role used for matching:" : "Intitulé retenu pour le matching :"} <span className="font-semibold text-[#1d3b8b]">{values.profession === "Autre profession" ? values.otherProfession || (isEn ? "To be specified" : "À préciser") : values.profession || (isEn ? "Not selected" : "Non sélectionné")}</span>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#6b7b8f]">
            {isEn ? "Your opening will be sent to LEXPAT Connect. You will receive a confirmation by email." : "Votre offre sera transmise à LEXPAT Connect. Vous recevrez une confirmation par email."}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setOpen(false); setError(""); }}
              className="secondary-button"
            >
              {isEn ? "Cancel" : "Annuler"}
            </button>
            <button type="submit" disabled={loading} className="primary-button disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? (isEn ? "Sending…" : "Envoi…") : isEn ? "Submit opening" : "Soumettre l'offre"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function createOfferValues() {
  return {
    title: "",
    profession: "",
    otherProfession: "",
    sector: "",
    region: "",
    contract: "",
    urgency: "",
    email: "",
    description: ""
  };
}

function mapOfferToFormValues(offer) {
  const profession = offer.shortage_job || offer.title || "";
  return {
    title: offer.title || "",
    profession,
    otherProfession: offer.shortage_job === "Autre profession" ? (offer.shortage_job_other || offer.title || "") : "",
    sector: offer.sector || "",
    region: normalizeRegion(offer.region) || "",
    contract: offer.contract_type || "",
    urgency: offer.urgency || "",
    email: "",
    description: offer.missions || ""
  };
}

function OffersView({ token, locale, onNavigate }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [offers, setOffers] = useState([]);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [editingValues, setEditingValues] = useState(createOfferValues());
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingOfferId, setDeletingOfferId] = useState(null);
  const [actionError, setActionError] = useState("");
  const isEn = locale === "en";

  const refreshOffers = useCallback(() => {
    if (!token) return;
    fetch("/api/offers", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { refreshOffers(); }, [refreshOffers]);

  function setEditValue(key, value) {
    setEditingValues((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "region") {
        next.profession = "";
        next.otherProfession = "";
        next.title = "";
        if (next.sector !== "Autre secteur") {
          next.sector = "";
        }
      }

      if (key === "profession") {
        if (value !== "Autre profession") {
          next.otherProfession = "";
          next.title = value;
        }

        const derivedSector = findSectorForProfession(next.region, value);
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

  function startEditing(offer) {
    setEditingOfferId(offer.id);
    setEditingValues(mapOfferToFormValues(offer));
    setActionError("");
    setSuccessMsg("");
  }

  function cancelEditing() {
    setEditingOfferId(null);
    setEditingValues(createOfferValues());
    setActionError("");
  }

  async function handleUpdateOffer(event) {
    event.preventDefault();
    setSavingEdit(true);
    setActionError("");

    try {
      const res = await fetch("/api/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: editingOfferId,
          title: editingValues.profession === "Autre profession" ? editingValues.otherProfession : editingValues.profession,
          shortage_job: editingValues.profession,
          shortage_job_other: editingValues.profession === "Autre profession" ? editingValues.otherProfession : "",
          sector: editingValues.sector,
          region: stringifyRegionSelection(editingValues.region, "Plusieurs régions"),
          contract_type: editingValues.contract,
          urgency: editingValues.urgency,
          description: editingValues.description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isEn ? "Unable to update this opening." : "Impossible de mettre à jour cette offre."));

      setSuccessMsg(isEn ? "Opening updated." : "Offre mise à jour.");
      cancelEditing();
      refreshOffers();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteOffer(offerId) {
    const confirmed = window.confirm(
      isEn
        ? "Do you really want to delete this opening? Linked matches and applications will also be removed."
        : "Voulez-vous vraiment supprimer cette offre ? Les matchs et candidatures liés seront aussi supprimés."
    );

    if (!confirmed) return;

    setDeletingOfferId(offerId);
    setActionError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/offers?id=${offerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isEn ? "Unable to delete this opening." : "Impossible de supprimer cette offre."));

      if (editingOfferId === offerId) {
        cancelEditing();
      }
      setSuccessMsg(isEn ? "Opening deleted." : "Offre supprimée.");
      refreshOffers();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingOfferId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{isEn ? "My openings" : "Mes offres"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Create and manage your hiring needs" : "Préparer et suivre vos besoins de recrutement"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">{isEn ? "Submit your openings directly from this space. Each need is sent to LEXPAT Connect for review and matching." : "Déposez vos offres directement depuis cet espace. Chaque besoin sera transmis à LEXPAT Connect pour traitement et mise en relation."}</p>
      </section>

      {successMsg && (
        <div className="rounded-[24px] border border-[#c6e8e3] bg-[#f0fbf9] px-5 py-4 text-sm font-semibold text-[#1d7a6e]">
          {successMsg}
        </div>
      )}

      {actionError && (
        <div className="rounded-[24px] border border-[#f2c4c4] bg-[#fff5f5] px-5 py-4 text-sm font-semibold text-[#a33f3f]">
          {actionError}
        </div>
      )}

      {offers.length > 0 && (
        <section className="rounded-[26px] border border-[#dce8f6] bg-[#f8fbff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1d3b8b]">
              {isEn ? "Want to see the candidates matching this opening?" : "Vous voulez voir les candidats correspondant à cette offre ?"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5f7086]">
              {isEn
                ? "Open the matching space to review the profiles already linked to your hiring needs."
                : "Ouvrez l'espace de matching pour voir les profils déjà reliés à vos besoins de recrutement."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("matches")}
            className="mt-4 inline-flex items-center justify-center rounded-[16px] bg-[#1E3A78] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#162d6b] sm:mt-0"
          >
            {isEn ? "See matching candidates →" : "Voir les candidats correspondants →"}
          </button>
        </section>
      )}

      {offers.length > 0 && (
        <section className="grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{offer.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f7086]">
                    {[offer.sector, normalizeRegion(offer.region), offer.contract_type, offer.urgency].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1d3b8b]">
                  {offer.status === "published" ? (isEn ? "Published" : "Publiée") : offer.status === "draft" ? (isEn ? "Draft" : "Brouillon") : offer.status}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startEditing(offer)}
                  className="inline-flex min-h-[2.75rem] items-center justify-center rounded-[16px] border border-[#c5d4f3] bg-[#eef5ff] px-4 py-2.5 text-sm font-semibold text-[#1d3b8b] transition hover:bg-[#e2ecff]"
                >
                  {isEn ? "Edit opening" : "Modifier l'offre"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOffer(offer.id)}
                  disabled={deletingOfferId === offer.id}
                  className="inline-flex min-h-[2.75rem] items-center justify-center rounded-[16px] border border-[#f0c3c3] bg-[#fff5f5] px-4 py-2.5 text-sm font-semibold text-[#b54848] transition hover:bg-[#ffeaea] disabled:opacity-60"
                >
                  {deletingOfferId === offer.id
                    ? (isEn ? "Deleting…" : "Suppression…")
                    : (isEn ? "Delete opening" : "Supprimer l'offre")}
                </button>
              </div>

              {editingOfferId === offer.id ? (
                <form onSubmit={handleUpdateOffer} className="mt-6 grid gap-5 border-t border-[#e8eff5] pt-6 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Sector" : "Secteur"} *</span>
                    <select className="field-input" required value={editingValues.sector} onChange={(e) => setEditValue("sector", e.target.value)}>
                      <option value="" disabled>{isEn ? "Select a sector" : "Sélectionnez un secteur"}</option>
                      {getSectorOptions(isEn ? "en" : "fr").map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Region" : "Région"} *</span>
                    <RegionSelector
                      value={parseRegionSelection(editingValues.region)}
                      onChange={(nextRegions) => setEditValue("region", nextRegions)}
                      helperText={isEn ? "Select one, two or three regions depending on your hiring scope." : "Sélectionnez une, deux ou trois régions selon votre besoin de recrutement."}
                    />
                  </label>

                  <label className="md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Target role" : "Métier recherché"} *</span>
                    {editingValues.region ? (
                      <select className="field-input" required value={editingValues.profession} onChange={(e) => setEditValue("profession", e.target.value)}>
                        <option value="" disabled>{isEn ? "Select the target role" : "Sélectionnez le métier visé"}</option>
                        {getProfessionGroupsForRegions(editingValues.region, isEn ? "en" : "fr").map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.options.map((profession) => (
                              <option key={`${group.label}-${profession.value}`} value={profession.value}>{profession.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    ) : (
                      <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
                        {isEn ? "Select a region first to choose a role" : "Sélectionnez d'abord une région pour choisir un métier"}
                      </div>
                    )}
                  </label>

                  {editingValues.profession === "Autre profession" ? (
                    <label className="md:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Other role / details" : "Autre profession / précision"} *</span>
                      <input className="field-input" type="text" required value={editingValues.otherProfession} onChange={(e) => setEditValue("otherProfession", e.target.value)} />
                    </label>
                  ) : null}

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Contract type" : "Type de contrat"}</span>
                    <select className="field-input" value={editingValues.contract} onChange={(e) => setEditValue("contract", e.target.value)}>
                      <option value="" disabled>{isEn ? "Select a type" : "Sélectionnez un type"}</option>
                      <option value="CDI">{isEn ? "Open-ended contract (CDI)" : "CDI"}</option>
                      <option value="CDD">{isEn ? "Fixed-term contract (CDD)" : "CDD"}</option>
                      <option value="Intérim">{isEn ? "Temporary / Interim" : "Intérim"}</option>
                      <option value="Temps plein">{isEn ? "Full-time" : "Temps plein"}</option>
                      <option value="Temps partiel">{isEn ? "Part-time" : "Temps partiel"}</option>
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Urgency level" : "Niveau d'urgence"}</span>
                    <select className="field-input" value={editingValues.urgency} onChange={(e) => setEditValue("urgency", e.target.value)}>
                      <option value="" disabled>{isEn ? "Select a level" : "Sélectionnez un niveau"}</option>
                      <option value="Normal">{isEn ? "Standard" : "Normal"}</option>
                      <option value="Urgent">{isEn ? "Urgent" : "Urgent"}</option>
                      <option value="Très urgent">{isEn ? "Very urgent" : "Très urgent"}</option>
                    </select>
                  </label>

                  <label className="md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-[#17345d]">{isEn ? "Opening summary" : "Description du besoin"}</span>
                    <textarea
                      className="field-input min-h-[8rem]"
                      rows={5}
                      value={editingValues.description}
                      onChange={(e) => setEditValue("description", e.target.value)}
                      placeholder={isEn ? "Expected skills, experience, context, preferred timing…" : "Compétences attendues, expérience, contexte, disponibilité souhaitée…"}
                    />
                  </label>

                  <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl border border-[#d7e3f2] bg-white px-5 py-3 text-sm font-semibold text-[#1d3b8b] transition hover:bg-[#f8fbff]"
                    >
                      {isEn ? "Cancel" : "Annuler"}
                    </button>
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-[#59B9B1] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70"
                    >
                      {savingEdit ? (isEn ? "Saving…" : "Enregistrement…") : (isEn ? "Save changes" : "Enregistrer les modifications")}
                    </button>
                  </div>
                </form>
              ) : null}
            </article>
          ))}
        </section>
      )}

      <CreateOfferForm
        token={token}
        locale={locale}
        onSuccess={() => { setSuccessMsg(isEn ? "Opening saved and published." : "Offre enregistrée et publiée."); refreshOffers(); }}
      />
    </div>
  );
}

function MatchesView({ token, locale }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null); // matchId en cours
  const [openingChat, setOpeningChat] = useState(null); // matchId en cours d'ouverture
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
    fetch("/api/matches?role=employer", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setMatches(d.matches || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  // Employeur clique "Intéressé"
  // new → interested | reviewed (worker déjà intéressé) → contacted (match confirmé)
  const handleInterest = async (matchId, currentStatus) => {
    setActing(matchId);
    const nextStatus = currentStatus === "reviewed" ? "contacted" : "interested";
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
    if (score >= 60) return "bg-[#eef5ff] text-[#1d3b8b]";
    return "bg-[#fff7e7] text-[#d08900]";
  };
  const scoringInfo = isEn
    ? "Compatibility reflects how closely the role, sector, region and experience align. It helps prioritize profiles, but it is not a hiring guarantee on its own."
    : "La compatibilité reflète la proximité entre le poste, le secteur, la région et l'expérience. Elle aide à prioriser les profils, sans constituer à elle seule une garantie de recrutement.";

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Matching</p>
          <InfoTooltip
            text={scoringInfo}
            buttonTitle={isEn ? "What does the compatibility score mean?" : "Que signifie la compatibilité ?"}
            closeLabel={isEn ? "Close" : "Fermer"}
          />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">{isEn ? "Profiles matching your openings" : "Profils correspondant à vos offres"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          {isEn ? "The LEXPAT Connect engine automatically compares your openings with available worker profiles. Worker contact details are only shared after the match is confirmed." : "Le moteur LEXPAT Connect croise automatiquement vos offres avec les profils travailleurs disponibles. Les coordonnées travailleur ne sont partagées qu'après confirmation du match."}
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" /></div>
      ) : matches.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-8 text-center text-sm text-[#5f7086]">
          {isEn ? "No matches yet. Publish an opening with a sector to trigger automatic matching." : "Aucun match pour l'instant. Publiez une offre avec un secteur pour déclencher le matching automatique."}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {matches.map((match) => (
            <article key={match.id} className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57b7af]">{match.offer?.title}</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1d3b8b]">
                    {match.worker?.job_title || (isEn ? "Profile being completed" : "Profil en cours de complétion")}
                  </h2>
                  <p className="mt-1 text-sm text-[#5f7086]">
                    {[match.worker?.sector, match.worker?.region, match.worker?.experience].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${scoreColor(match.score)}`}>
                  {formatCompatibilityLabel(match.score, isEn)}
                </span>
              </div>
              <div className="mt-4 rounded-[20px] border border-[#ebf0f6] bg-[#f9fbfd] px-4 py-3 text-xs text-[#5f7086]">
                {match.status?.toLowerCase() === "contacted"
                  ? <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold text-[#2f9d57]">{isEn ? "Confirmed match" : "Match confirmé"}</span> {isEn ? "— Worker contact details are unlocked." : "— Les coordonnées travailleur sont débloquées."}</>
                  : <>{isEn ? "Status:" : "Statut :"} <span className="font-semibold">{formatEmployerMatchStatus(match.status, isEn)}</span> {isEn ? "— Worker contact details become available once the match is confirmed." : "— Les coordonnées travailleur deviennent accessibles après confirmation du match."}</>
                }
              </div>

              {/* ── Bouton d'intérêt employeur ── */}
              <div className="mt-4">
                {match.status?.toLowerCase() === "contacted" ? (
                  /* Match confirmé des deux côtés */
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-[16px] bg-[#eef9f1] px-4 py-2.5 text-sm font-semibold text-[#2f9d57]">
                      <span>✓</span> {isEn ? "Confirmed match — contact details are unlocked" : "Match confirmé — les coordonnées sont débloquées"}
                    </div>
                    <button
                      onClick={() => handleOpenMessagerie(match.id)}
                      disabled={openingChat === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                    >
                      {openingChat === match.id ? (isEn ? "Opening…" : "Ouverture…") : isEn ? "Open messaging →" : "Ouvrir la messagerie →"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "reviewed" ? (
                  /* Le travailleur a déjà manifesté son intérêt */
                  <div className="flex flex-col gap-2">
                    <div className="rounded-[16px] border border-[#57b7af]/30 bg-[#eaf4f3] px-4 py-2.5 text-xs text-[#33566b]">
                      ✦ {isEn ? "This candidate is interested in your opening" : "Ce candidat est intéressé par votre offre"}
                    </div>
                    <button
                      onClick={() => handleInterest(match.id, match.status)}
                      disabled={acting === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                    >
                      {acting === match.id ? "…" : isEn ? "Confirm my interest → confirm the match" : "Confirmer mon intérêt → confirmer le match"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "interested" ? (
                  /* Employeur a déjà cliqué, en attente du candidat */
                  <div className="rounded-[16px] border border-[#c5d4f3] bg-[#eef1fb] px-4 py-2.5 text-xs text-[#5f7086]">
                    {isEn ? "Waiting for the candidate's response…" : "En attente de la réponse du candidat…"}
                  </div>
                ) : (
                  /* Statut new / par défaut */
                  <button
                    onClick={() => handleInterest(match.id, match.status)}
                    disabled={acting === match.id}
                    className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                  >
                    {acting === match.id ? "…" : isEn ? "Interested in this profile →" : "Intéressé par ce profil →"}
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

export default function EmployerSpace({ locale = "fr" }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const isEn = locale === "en";
  const sidebarItems = getSidebarItems(locale);

  const token = session?.access_token ?? null;

  // useMemo MUST be before any conditional return (Rules of Hooks)
  const completion = useMemo(() => {
    if (activeTab === "dashboard") return 31;
    if (activeTab === "company") return 56;
    return 44;
  }, [activeTab]);

  // Redirection si non connecté (après chargement)
  useEffect(() => {
    if (!loading && !session) {
      router.replace(isEn ? "/en/connexion" : "/connexion");
    }
  }, [loading, session, router, isEn]);

  useEffect(() => {
    if (!loading && session && user?.user_metadata?.role === "worker") {
      router.replace(isEn ? "/en/travailleurs/espace" : "/travailleurs/espace");
    }
  }, [loading, session, user, router, isEn]);

  if (loading || !session || user?.user_metadata?.role === "worker") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" />
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
                <p className="text-lg font-semibold text-[#17345d]">{isEn ? "Employer profile" : "Profil employeur"}</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">{isEn ? "Employer" : "Employeur"}</span>
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
            {activeTab === "company" ? <CompanyView token={token} locale={locale} /> : null}
            {activeTab === "offers" ? <OffersView token={token} locale={locale} onNavigate={setActiveTab} /> : null}
            {activeTab === "matches" ? <MatchesView token={token} locale={locale} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
