"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";
import RegionSelector from "./RegionSelector";
import {
  findSectorForProfession,
  getProfessionGroupsForRegions,
  parseRegionSelection,
  sectorOptions
} from "../lib/professions";

const sidebarItems = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "company", label: "Mon entreprise" },
  { id: "offers", label: "Mes offres" },
  { id: "matches", label: "Profils matchés" }
];

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  teal: "bg-[#eef9f8] text-[#2b8f88]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

const companyFields = [
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

function Field({ field, value, onChange }) {
  const base = "field-input";

  return (
    <label className={field.wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${base} min-h-36`} rows={6} placeholder={field.placeholder} value={value} onChange={(event) => onChange(field.name, event.target.value)} />
      ) : field.type === "select" ? (
        <select className={base} value={value} onChange={(event) => onChange(field.name, event.target.value)}>
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
        <input className={base} type={field.type || "text"} placeholder={field.placeholder} value={value} onChange={(event) => onChange(field.name, event.target.value)} />
      )}
    </label>
  );
}

function DashboardView({ token, onNavigate }) {
  const [stats, setStats] = useState({ offers: 0, matches: 0 });

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
    { label: "Offres publiées", value: stats.offers, tone: "blue" },
    { label: "Profils matchés", value: stats.matches, tone: "teal" },
    { label: "Dossiers à clarifier", value: 0, tone: "amber" },
    { label: "Recrutements finalisés", value: 0, tone: "green" }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace employeur</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Tableau de bord recrutement</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
              Suivez vos offres publiées et les profils matchés automatiquement par le moteur LEXPAT Connect.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d9ebe8] bg-[#f5fbfb] px-5 py-4 text-sm text-[#33566b]">
            Matching : <span className="font-semibold text-[#1d3b8b]">actif</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {displayStats.map((item) => (
          <article
            key={item.label}
            className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] cursor-pointer transition hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            onClick={() => item.label === "Profils matchés" ? onNavigate("matches") : item.label === "Offres publiées" ? onNavigate("offers") : null}
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold ${toneClasses[item.tone]}`}>
              {item.value}
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.label}</h3>
          </article>
        ))}
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Relais juridique</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">
          Quand un recrutement avance vers un permis unique ou une situation d'immigration économique, le cabinet LEXPAT intervient dans un périmètre séparé de la plateforme.
        </p>
        <div className="mt-6 rounded-[22px] border border-[#dce8f6] bg-[#f8fbff] p-4 text-sm leading-7 text-[#3c5473]">
          Chaque offre pourra déclencher une analyse juridique automatique dès qu'un profil étranger est présélectionné.
        </div>
      </section>
    </div>
  );
}

function CompanyView({ token }) {
  const [values, setValues] = useState({
    companyName: "",
    sector: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    region: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
            description: data.profile.description || ""
          });
        }
      })
      .catch(() => {
        setError("Impossible de charger la fiche entreprise.");
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
        throw new Error(data.error || "Impossible d'enregistrer l'entreprise.");
      }

      setMessage(`Fiche entreprise enregistrée. Complétude : ${data.completion}%`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mon entreprise</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Structurer votre fiche employeur</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Centralisez les éléments qui permettent de présenter votre entreprise, votre contexte de recrutement et vos critères de sélection de manière plus sérieuse.</p>
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Informations entreprise</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          Cette fiche structure votre présence employeur et sert de base aux prochains recrutements publiés sur la plateforme.
        </p>

        {loading ? (
          <div className="mt-6 flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {companyFields.map((field) => (
                <Field key={field.name} field={field} value={values[field.name] || ""} onChange={updateValue} />
              ))}
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
                {saving ? "Enregistrement…" : "Enregistrer l'entreprise"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function CreateOfferForm({ onSuccess, token }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    title: "", profession: "", otherProfession: "", sector: "", region: "", contract: "", urgency: "", email: "", description: ""
  });

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
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");

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
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Créer une nouvelle offre</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">
          Déposez votre besoin de recrutement. Il sera transmis directement à LEXPAT Connect pour traitement et mise en relation.
        </p>
        <button onClick={() => setOpen(true)} className="primary-button mt-5">
          Ajouter une offre
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#d4e2f4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Nouvelle offre</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3b8b]">Décrivez votre besoin de recrutement</h2>
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
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Secteur * <span className="text-[#57b7af]">(utilisé pour le matching)</span></span>
          <select className="field-input" required value={values.sector} onChange={(e) => set("sector", e.target.value)}>
            <option value="" disabled>Sélectionnez un secteur</option>
            {sectorOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Région *</span>
          <RegionSelector
            value={parseRegionSelection(values.region)}
            onChange={(nextRegions) => set("region", nextRegions)}
            helperText="Sélectionnez une, deux ou trois régions selon votre besoin de recrutement."
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Métier recherché *</span>
          {values.region ? (
            <select className="field-input" required value={values.profession} onChange={(e) => set("profession", e.target.value)}>
              <option value="" disabled>Sélectionnez le métier visé</option>
              {getProfessionGroupsForRegions(values.region).map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((profession) => (
                    <option key={`${group.label}-${profession}`} value={profession}>{profession}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <div className="field-input flex cursor-default items-center text-[#8a9bb0]">
              Sélectionnez d'abord une région pour choisir un métier
            </div>
          )}
          {parseRegionSelection(values.region).length === 1 ? (
            <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
              Liste officielle des métiers en pénurie pour {parseRegionSelection(values.region)[0]} — mise à jour 2026
            </p>
          ) : values.region ? (
            <p className="mt-1.5 text-[11px] text-[#8a9bb0]">
              Liste consolidée des métiers en pénurie 2026 pour les régions sélectionnées.
            </p>
          ) : null}
        </label>

        {values.profession === "Autre profession" ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">Autre profession / précision *</span>
            <input className="field-input" type="text" placeholder="Précisez l'intitulé exact du poste" required value={values.otherProfession} onChange={(e) => set("otherProfession", e.target.value)} />
          </label>
        ) : null}

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Type de contrat</span>
          <select className="field-input" value={values.contract} onChange={(e) => set("contract", e.target.value)}>
            <option value="" disabled>Sélectionnez un type</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Intérim</option>
            <option>Temps plein</option>
            <option>Temps partiel</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Niveau d'urgence</span>
          <select className="field-input" value={values.urgency} onChange={(e) => set("urgency", e.target.value)}>
            <option value="" disabled>Sélectionnez un niveau</option>
            <option>Normal</option>
            <option>Urgent</option>
            <option>Très urgent</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Email de contact *</span>
          <input
            className="field-input"
            type="email"
            placeholder="contact@entreprise.be"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Description du besoin</span>
          <textarea
            className="field-input min-h-[8rem]"
            placeholder="Compétences attendues, expérience, contexte, disponibilité souhaitée…"
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
          Intitulé retenu pour le matching : <span className="font-semibold text-[#1d3b8b]">{values.profession === "Autre profession" ? values.otherProfession || "À préciser" : values.profession || "Non sélectionné"}</span>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#6b7b8f]">
            Votre offre sera transmise à LEXPAT Connect. Vous recevrez une confirmation par email.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setOpen(false); setError(""); }}
              className="secondary-button"
            >
              Annuler
            </button>
            <button type="submit" disabled={loading} className="primary-button disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Envoi…" : "Soumettre l'offre"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function OffersView({ token }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [offers, setOffers] = useState([]);

  const refreshOffers = useCallback(() => {
    if (!token) return;
    fetch("/api/offers", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOffers(d.offers || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => { refreshOffers(); }, [refreshOffers]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mes offres</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Préparer et suivre vos besoins de recrutement</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Déposez vos offres directement depuis cet espace. Chaque besoin sera transmis à LEXPAT Connect pour traitement et mise en relation.</p>
      </section>

      {successMsg && (
        <div className="rounded-[24px] border border-[#c6e8e3] bg-[#f0fbf9] px-5 py-4 text-sm font-semibold text-[#1d7a6e]">
          {successMsg}
        </div>
      )}

      {offers.length > 0 && (
        <section className="grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{offer.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f7086]">
                    {[offer.sector, offer.region, offer.contract_type, offer.urgency].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1d3b8b]">
                  {offer.status === "published" ? "Publiée" : offer.status === "draft" ? "Brouillon" : offer.status}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      <CreateOfferForm
        token={token}
        onSuccess={() => { setSuccessMsg("Offre enregistrée et publiée."); refreshOffers(); }}
      />
    </div>
  );
}

function MatchesView({ token }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null); // matchId en cours
  const [openingChat, setOpeningChat] = useState(null); // matchId en cours d'ouverture

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
        ? `/messagerie?conversation=${conversationId}`
        : "/messagerie";
    } catch (e) {
      console.error(e);
      window.location.href = "/messagerie";
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

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Matching</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Profils matchés à vos offres</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">
          Le moteur LEXPAT Connect croise automatiquement vos offres avec les profils travailleurs disponibles. Les données identifiantes ne sont partagées qu'après validation du match.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" /></div>
      ) : matches.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-8 text-center text-sm text-[#5f7086]">
          Aucun match pour l'instant. Publiez une offre avec un secteur pour déclencher le matching automatique.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {matches.map((match) => (
            <article key={match.id} className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57b7af]">{match.offer?.title}</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1d3b8b]">
                    {match.worker?.job_title || "Profil en cours de complétion"}
                  </h2>
                  <p className="mt-1 text-sm text-[#5f7086]">
                    {[match.worker?.sector, match.worker?.region, match.worker?.experience].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${scoreColor(match.score)}`}>
                  Score {match.score}/100
                </span>
              </div>
              <div className="mt-4 rounded-[20px] border border-[#ebf0f6] bg-[#f9fbfd] px-4 py-3 text-xs text-[#5f7086]">
                {match.status?.toLowerCase() === "contacted"
                  ? <>Statut : <span className="font-semibold text-[#2f9d57]">Match confirmé</span> — Les coordonnées sont débloquées.</>
                  : <>Statut : <span className="font-semibold capitalize">{match.status}</span> — Les coordonnées du profil seront accessibles après confirmation du contact.</>
                }
              </div>

              {/* ── Bouton d'intérêt employeur ── */}
              <div className="mt-4">
                {match.status?.toLowerCase() === "contacted" ? (
                  /* Match confirmé des deux côtés */
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-[16px] bg-[#eef9f1] px-4 py-2.5 text-sm font-semibold text-[#2f9d57]">
                      <span>✓</span> Match confirmé — les coordonnées sont débloquées
                    </div>
                    <button
                      onClick={() => handleOpenMessagerie(match.id)}
                      disabled={openingChat === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                    >
                      {openingChat === match.id ? "Ouverture…" : "Ouvrir la messagerie →"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "reviewed" ? (
                  /* Le travailleur a déjà manifesté son intérêt */
                  <div className="flex flex-col gap-2">
                    <div className="rounded-[16px] border border-[#57b7af]/30 bg-[#eaf4f3] px-4 py-2.5 text-xs text-[#33566b]">
                      ✦ Ce candidat est intéressé par votre offre
                    </div>
                    <button
                      onClick={() => handleInterest(match.id, match.status)}
                      disabled={acting === match.id}
                      className="flex items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                    >
                      {acting === match.id ? "…" : "Confirmer mon intérêt → Match confirmé"}
                    </button>
                  </div>
                ) : match.status?.toLowerCase() === "interested" ? (
                  /* Employeur a déjà cliqué, en attente du candidat */
                  <div className="rounded-[16px] border border-[#c5d4f3] bg-[#eef1fb] px-4 py-2.5 text-xs text-[#5f7086]">
                    En attente de la réponse du candidat…
                  </div>
                ) : (
                  /* Statut new / par défaut */
                  <button
                    onClick={() => handleInterest(match.id, match.status)}
                    disabled={acting === match.id}
                    className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#1E3A78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#162d6b] disabled:opacity-60"
                  >
                    {acting === match.id ? "…" : "Intéressé par ce profil →"}
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

export default function EmployerSpace() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, session, loading } = useAuth();
  const router = useRouter();

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
      router.replace("/connexion");
    }
  }, [loading, session, router]);

  if (loading || !session) {
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
                <Image src="/logo-lexpat-connect.png" alt="LEXPAT Connect" fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#17345d]">Profil employeur</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">Entreprise</span>
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
              <p className="text-sm font-semibold text-[#17345d]">Complétude de l'espace</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d94b4b]">{completion}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e3eaf1]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#57b7af_0%,#1d3b8b_100%)]" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6d7d91]">Complétez la fiche entreprise et préparez vos offres pour rendre vos recrutements plus lisibles et plus crédibles.</p>
            </div>
          </aside>

          <div>
            {activeTab === "dashboard" ? <DashboardView token={token} onNavigate={setActiveTab} /> : null}
            {activeTab === "company" ? <CompanyView token={token} /> : null}
            {activeTab === "offers" ? <OffersView token={token} /> : null}
            {activeTab === "matches" ? <MatchesView token={token} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
