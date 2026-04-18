"use client";

import { useState } from "react";
import RegionSelector from "./RegionSelector";
import {
  getSectorOptions,
  getProfessionGroupsForRegions,
  stringifyRegionSelection,
} from "../lib/professions";

// ─── Config des étapes ────────────────────────────────────────────────────────

const STEPS = [
  { icon: "👋", title: "Qui recrute ?",          subtitle: "Vos coordonnées de contact" },
  { icon: "📍", title: "Où se situe le poste ?", subtitle: "Région et lieu de travail" },
  { icon: "💼", title: "Quel poste ?",            subtitle: "Le métier et le type de contrat" },
  { icon: "📝", title: "Décrivez le rôle",        subtitle: "Missions et compétences attendues (optionnel)" },
];

// ─── Styles partagés ──────────────────────────────────────────────────────────

const inputSt = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1.5px solid #dce8f5",
  fontSize: 16,           // évite le zoom auto sur iOS
  color: "#1E3A78",
  background: "#fff",
  boxSizing: "border-box",
  WebkitAppearance: "none",
  appearance: "none",
  outline: "none",
};

function Field({ label, children, error, helper, optional }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: helper ? 4 : 7 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: "#3d5470" }}>{label}</label>
        {optional && <span style={{ fontSize: 11, color: "#b0bec5", fontWeight: 500 }}>optionnel</span>}
      </div>
      {helper && <div style={{ fontSize: 12, color: "#8a9db8", marginBottom: 7 }}>{helper}</div>}
      {children}
      {error && <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function EmployeurWizard() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    contactName: "", company: "", email: "", phone: "",
    region: [], location: "",
    sector: "", profession: "", contractType: "", hours: "",
    responsibilities: "", skills: "",
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function set(key, val) {
    setValues(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  }

  // ── Validation par étape ────────────────────────────────────────────────────
  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!values.contactName.trim()) e.contactName = "Veuillez indiquer votre nom.";
      if (!values.company.trim())     e.company     = "Veuillez indiquer votre entreprise.";
      if (!values.email.trim() || !values.email.includes("@")) e.email = "Email invalide.";
    }
    if (s === 1) {
      if (!values.region?.length) e.region = "Sélectionnez au moins une région.";
    }
    if (s === 2) {
      if (!values.sector) e.sector = "Sélectionnez un secteur.";
    }
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Soumission ──────────────────────────────────────────────────────────────
  async function submit() {
    setStatus("submitting");
    const fields = [
      { label: "Nom du contact",                name: "contactName",      value: values.contactName },
      { label: "Entreprise",                    name: "company",          value: values.company },
      { label: "Email professionnel",           name: "email",            value: values.email },
      { label: "Téléphone",                     name: "phone",            value: values.phone },
      { label: "Région concernée",              name: "region",           value: stringifyRegionSelection(values.region, "Non précisé") },
      { label: "Lieu de travail",               name: "location",         value: values.location },
      { label: "Secteur",                       name: "sector",           value: values.sector },
      { label: "Métier recherché",              name: "profession",       value: values.profession },
      { label: "Type de contrat",               name: "contractType",     value: values.contractType },
      { label: "Heures hebdomadaires",          name: "hours",            value: values.hours },
      { label: "Missions principales",          name: "responsibilities", value: values.responsibilities },
      { label: "Compétences recherchées",       name: "skills",           value: values.skills },
    ].filter(f => f.value.trim());

    try {
      const res  = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "employeur", title: "Formulaire employeur (mobile)", fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'envoi.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  // ── Écran de succès ─────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px", textAlign: "center", background: "#f0fdf4",
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>Besoin envoyé !</h2>
        <p style={{ fontSize: 16, color: "#3d5470", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 28px" }}>
          Votre besoin de recrutement a bien été transmis. Nous revenons vers vous rapidement.
        </p>
        <a href="/employeurs" style={{
          display: "inline-block", padding: "14px 28px", borderRadius: 12,
          background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 15,
          textDecoration: "none",
        }}>
          Retour à la page employeurs
        </a>
      </div>
    );
  }

  // ── Options dynamiques ──────────────────────────────────────────────────────
  const sectorOptions     = getSectorOptions("fr");
  const professionGroups  = values.region?.length
    ? getProfessionGroupsForRegions(values.region, "fr")
    : [];

  // ── Rendu principal ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100svh", background: "#f8faff", display: "flex", flexDirection: "column" }}>

      {/* ── Barre de progression (sticky) ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8eef8",
        padding: "14px 20px 12px", position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {step > 0 && (
            <button onClick={back} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#8a9db8", fontSize: 22, padding: "0 4px 0 0", lineHeight: 1, flexShrink: 0,
            }}>←</button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8a9db8", textTransform: "uppercase", letterSpacing: 0.6 }}>
              Étape {step + 1} sur {STEPS.length}
            </div>
          </div>
          <a href="/employeurs" style={{ fontSize: 12, color: "#b0bec5", textDecoration: "none" }}>Annuler</a>
        </div>
        {/* Barres de progression */}
        <div style={{ display: "flex", gap: 5 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= step ? "#1E3A78" : "#e8eef8",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <div style={{ flex: 1, padding: "28px 20px 140px", maxWidth: 520, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        {/* En-tête de l'étape */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{STEPS[step].icon}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1E3A78", margin: "0 0 6px", lineHeight: 1.2 }}>
            {STEPS[step].title}
          </h1>
          <p style={{ fontSize: 14, color: "#8a9db8", margin: 0 }}>{STEPS[step].subtitle}</p>
        </div>

        {/* ── Étape 0 : Contact ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Votre nom" error={errors.contactName}>
              <input type="text" placeholder="Prénom Nom" value={values.contactName}
                onChange={e => set("contactName", e.target.value)} style={inputSt} autoComplete="name" />
            </Field>
            <Field label="Votre entreprise" error={errors.company}>
              <input type="text" placeholder="Nom de l'entreprise" value={values.company}
                onChange={e => set("company", e.target.value)} style={inputSt} autoComplete="organization" />
            </Field>
            <Field label="Email professionnel" error={errors.email}>
              <input type="email" placeholder="contact@entreprise.be" value={values.email}
                onChange={e => set("email", e.target.value)} style={inputSt}
                autoCapitalize="off" autoCorrect="off" autoComplete="email" inputMode="email" />
            </Field>
            <Field label="Téléphone" optional>
              <input type="tel" placeholder="+32 ..." value={values.phone}
                onChange={e => set("phone", e.target.value)} style={inputSt}
                autoComplete="tel" inputMode="tel" />
            </Field>
          </div>
        )}

        {/* ── Étape 1 : Localisation ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <Field label="Région de recrutement" error={errors.region}
              helper="Sélectionnez la région où le travail sera principalement organisé.">
              <RegionSelector value={values.region} onChange={v => set("region", v)} />
            </Field>
            <Field label="Ville ou lieu de travail" optional>
              <input type="text" placeholder="Bruxelles, Liège, Gand…" value={values.location}
                onChange={e => set("location", e.target.value)} style={inputSt} />
            </Field>
          </div>
        )}

        {/* ── Étape 2 : Le poste ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Secteur d'activité" error={errors.sector}>
              <select value={values.sector} onChange={e => set("sector", e.target.value)} style={inputSt}>
                <option value="">Sélectionnez un secteur</option>
                {sectorOptions.map(o =>
                  typeof o === "string"
                    ? <option key={o} value={o}>{o}</option>
                    : <optgroup key={o.label} label={o.label}>
                        {(o.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </optgroup>
                )}
              </select>
            </Field>

            <Field label="Métier recherché" optional>
              {professionGroups.length > 0 ? (
                <select value={values.profession} onChange={e => set("profession", e.target.value)} style={inputSt}>
                  <option value="">Sélectionnez un métier</option>
                  {professionGroups.map(g =>
                    typeof g === "string"
                      ? <option key={g} value={g}>{g}</option>
                      : <optgroup key={g.label} label={g.label}>
                          {(g.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </optgroup>
                  )}
                </select>
              ) : (
                <input type="text" placeholder="Choisissez d'abord une région à l'étape précédente"
                  value={values.profession} readOnly
                  style={{ ...inputSt, background: "#f5f7fb", color: "#b0bec5" }} />
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Type de contrat" optional>
                <select value={values.contractType} onChange={e => set("contractType", e.target.value)} style={inputSt}>
                  <option value="">—</option>
                  {["CDI", "CDD", "Intérim", "Freelance", "Stage"].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </Field>
              <Field label="Heures/semaine" optional>
                <input type="text" placeholder="38h" value={values.hours}
                  onChange={e => set("hours", e.target.value)} style={inputSt} inputMode="numeric" />
              </Field>
            </div>
          </div>
        )}

        {/* ── Étape 3 : Détails ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#8a9db8", lineHeight: 1.6 }}>
              Ces champs sont optionnels. Plus vous êtes précis, plus la mise en relation sera efficace.
            </p>
            <Field label="Missions principales" optional>
              <textarea placeholder="Résumé des missions et responsabilités…" value={values.responsibilities}
                onChange={e => set("responsibilities", e.target.value)}
                style={{ ...inputSt, minHeight: 110, resize: "vertical" }} />
            </Field>
            <Field label="Compétences recherchées" optional>
              <textarea placeholder="Compétences, langues, expérience, conditions…" value={values.skills}
                onChange={e => set("skills", e.target.value)}
                style={{ ...inputSt, minHeight: 110, resize: "vertical" }} />
            </Field>
          </div>
        )}
      </div>

      {/* ── Bouton CTA fixe en bas ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e8eef8",
        padding: "14px 20px 20px", zIndex: 20,
      }}>
        {status === "error" && (
          <div style={{ fontSize: 13, color: "#b91c1c", marginBottom: 10, textAlign: "center" }}>
            {errorMsg}
          </div>
        )}
        <button
          onClick={step < STEPS.length - 1 ? next : submit}
          disabled={status === "submitting"}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: status === "submitting" ? "#8a9db8" : "#1E3A78",
            color: "#fff", fontSize: 17, fontWeight: 800,
            cursor: status === "submitting" ? "default" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {status === "submitting"
            ? "Envoi en cours…"
            : step < STEPS.length - 1
              ? "Continuer →"
              : "Envoyer mon besoin ✓"}
        </button>
      </div>
    </div>
  );
}
