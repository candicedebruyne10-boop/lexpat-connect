"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RegionSelector from "./RegionSelector";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import {
  sectorOptions,
  getSectorOptions,
  getProfessionGroupsForRegions,
  stringifyRegionSelection,
} from "../lib/professions";

// ─── i18n ─────────────────────────────────────────────────────────────────────

const T = {
  fr: {
    steps: [
      { icon: "👋", title: "Qui êtes-vous ?",           subtitle: "Vos coordonnées de contact" },
      { icon: "📍", title: "Où souhaitez-vous travailler ?", subtitle: "Région et lieu souhaités en Belgique" },
      { icon: "💼", title: "Quel est votre métier ?",   subtitle: "Secteur, profession et expérience" },
      { icon: "📝", title: "Votre disponibilité",       subtitle: "Disponibilité, langues et description (optionnel)" },
    ],
    experienceOptions: ["Moins d'1 an", "1 à 3 ans", "3 à 5 ans", "5 à 10 ans", "Plus de 10 ans"],
    adminStatusOptions: ["Permis unique", "Permis A", "Annexe 15", "Annexe 35", "Sans titre actuel", "Autre", "Je ne sais pas"],
    loading: "Chargement…",
    loginTitle: "Connexion requise",
    loginText: "Pour créer votre profil et accéder à votre espace travailleur, vous devez être connecté.",
    loginBtn: "Se connecter",
    signupBtn: "Créer un compte travailleur",
    successTitle: "Profil créé !",
    successText: "Votre profil est maintenant visible. Nous le mettons en relation avec des employeurs belges dans votre secteur.",
    successBtn: "Voir mon espace travailleur →",
    cancel: "Annuler",
    step: "Étape",
    of: "sur",
    continue: "Continuer →",
    submit: "Créer mon profil ✓",
    submitting: "Création en cours…",
    name: "Nom complet", namePh: "Prénom Nom",
    email: "Email", emailPh: "votre.email@example.com",
    phone: "Téléphone", phonePh: "+32 / +...",
    country: "Pays de résidence", countryPh: "Pays actuel",
    region: "Région ou ville souhaitée en Belgique",
    regionHelper: "Sélectionnez une ou plusieurs régions belges selon votre mobilité.",
    city: "Ville ou commune préférée", cityPh: "Bruxelles, Liège, Gand…",
    sector: "Secteur visé", sectorPh: "Sélectionnez un secteur",
    profession: "Métier recherché", professionPh: "Sélectionnez un métier",
    professionLocked: "Choisissez d'abord une région à l'étape précédente",
    experience: "Niveau d'expérience", experiencePh: "—",
    availability: "Disponibilité", availabilityPh: "Immédiate, 1 mois, 3 mois…",
    languages: "Langues parlées", languagesPh: "Français, anglais, néerlandais…",
    adminStatus: "Statut administratif", adminStatusPh: "—",
    adminStatusNote: "Ce champ permet de mieux comprendre votre point de départ. Il ne vaut jamais validation juridique.",
    description: "Description / message complémentaire", descriptionPh: "Compétences, diplômes, certifications, expérience, projet professionnel…",
    detailsHint: "Ces champs sont optionnels. Plus vous êtes précis, plus la mise en relation sera efficace.",
    optional: "optionnel",
    errName: "Veuillez indiquer votre nom.",
    errEmail: "Email invalide.",
    errRegion: "Sélectionnez au moins une région.",
    errSector: "Sélectionnez un secteur.",
    backTo: "/travailleurs",
    wizardPath: "/travailleurs/rejoindre",
    spacePath: "/travailleurs/espace",
    loginPath: "/connexion",
    signupPath: "/inscription",
  },
  en: {
    steps: [
      { icon: "👋", title: "Who are you?",                subtitle: "Your contact details" },
      { icon: "📍", title: "Where do you want to work?", subtitle: "Preferred region and location in Belgium" },
      { icon: "💼", title: "What is your occupation?",   subtitle: "Sector, role and experience" },
      { icon: "📝", title: "Your availability",          subtitle: "Availability, languages and description (optional)" },
    ],
    experienceOptions: ["Less than 1 year", "1 to 3 years", "3 to 5 years", "5 to 10 years", "More than 10 years"],
    adminStatusOptions: ["Single permit", "Permit A", "Annex 15", "Annex 35", "No current permit", "Other", "I do not know"],
    loading: "Loading…",
    loginTitle: "Sign in required",
    loginText: "To create your profile and access your worker space, you need to be signed in.",
    loginBtn: "Sign in",
    signupBtn: "Create a worker account",
    successTitle: "Profile created!",
    successText: "Your profile is now visible. We are connecting it with Belgian employers in your sector.",
    successBtn: "View my worker space →",
    cancel: "Cancel",
    step: "Step",
    of: "of",
    continue: "Continue →",
    submit: "Create my profile ✓",
    submitting: "Creating…",
    name: "Full name", namePh: "First Last",
    email: "Email", emailPh: "your.email@example.com",
    phone: "Phone", phonePh: "+32 / +...",
    country: "Country of residence", countryPh: "Current country",
    region: "Preferred region or city in Belgium",
    regionHelper: "Select one or more Belgian regions depending on your mobility.",
    city: "Preferred city or municipality", cityPh: "Brussels, Liège, Ghent…",
    sector: "Target sector", sectorPh: "Select a sector",
    profession: "Target occupation", professionPh: "Select an occupation",
    professionLocked: "Choose a region in the previous step first",
    experience: "Experience level", experiencePh: "—",
    availability: "Availability", availabilityPh: "Immediate, 1 month, 3 months…",
    languages: "Languages spoken", languagesPh: "French, English, Dutch…",
    adminStatus: "Administrative status", adminStatusPh: "—",
    adminStatusNote: "This field helps clarify your starting point. It never replaces legal validation.",
    description: "Description / additional message", descriptionPh: "Skills, diplomas, certificates, experience, professional project…",
    detailsHint: "These fields are optional. The more precise you are, the more effective the matching will be.",
    optional: "optional",
    errName: "Please enter your name.",
    errEmail: "Invalid email.",
    errRegion: "Please select at least one region.",
    errSector: "Please select a sector.",
    backTo: "/en/travailleurs",
    wizardPath: "/en/travailleurs/rejoindre",
    spacePath: "/en/travailleurs/espace",
    loginPath: "/en/connexion",
    signupPath: "/en/inscription",
  },
};

// ─── Styles partagés ──────────────────────────────────────────────────────────

const inputSt = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1.5px solid #dce8f5",
  fontSize: 16,
  color: "#1E3A78",
  background: "#fff",
  boxSizing: "border-box",
  WebkitAppearance: "none",
  appearance: "none",
  outline: "none",
};

function Field({ label, children, error, helper, optional, optionalLabel }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: helper ? 4 : 7 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: "#3d5470" }}>{label}</label>
        {optional && (
          <span style={{ fontSize: 11, color: "#b0bec5", fontWeight: 500 }}>
            {optionalLabel || "optionnel"}
          </span>
        )}
      </div>
      {helper && <div style={{ fontSize: 12, color: "#8a9db8", marginBottom: 7 }}>{helper}</div>}
      {children}
      {error && <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TravailleurWizard() {
  const pathname = usePathname() || "/";
  const locale = pathname.startsWith("/en") ? "en" : "fr";
  const t = T[locale];

  const [authStatus, setAuthStatus] = useState("loading"); // loading | authenticated | unauthenticated
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    fullName: "", email: "", phone: "", country: "",
    region: [], city: "",
    sector: "", profession: "", experience: "",
    availability: "", languages: "", adminStatus: "", description: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // ── Vérification de l'authentification ────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session) {
          setAuthStatus("authenticated");
          const meta = session.user?.user_metadata || {};
          setValues(prev => ({
            ...prev,
            fullName: prev.fullName || meta.full_name || "",
            email: prev.email || session.user.email || "",
          }));
        } else {
          setAuthStatus("unauthenticated");
        }
      }).catch(() => {
        if (isMounted) setAuthStatus("unauthenticated");
      });
    } catch {
      if (isMounted) setAuthStatus("unauthenticated");
    }
    return () => { isMounted = false; };
  }, []);

  function set(key, val) {
    setValues(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  }

  // ── Validation par étape ────────────────────────────────────────────────────
  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!values.fullName.trim()) e.fullName = t.errName;
      if (!values.email.trim() || !values.email.includes("@")) e.email = t.errEmail;
    }
    if (s === 1) {
      if (!values.region?.length) e.region = t.errRegion;
    }
    if (s === 2) {
      if (!values.sector) e.sector = t.errSector;
    }
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => Math.min(s + 1, t.steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Soumission → Supabase ───────────────────────────────────────────────────
  async function submit() {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthStatus("unauthenticated");
        setStatus("idle");
        return;
      }

      const token = session.access_token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      // 1. Bootstrap : crée l'espace travailleur si inexistant
      const bootstrapRes = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers,
        body: JSON.stringify({
          role: "worker",
          fullName: values.fullName.trim(),
          email: values.email.trim(),
        }),
      });

      if (!bootstrapRes.ok) {
        const err = await bootstrapRes.json().catch(() => ({}));
        throw new Error(err.error || (locale === "en"
          ? "Unable to create worker space."
          : "Impossible de créer l'espace travailleur."));
      }

      // 2. Calcul d'un score de complétion approximatif
      const filledFields = [
        values.fullName, values.email, values.phone, values.country,
        values.region?.length, values.city,
        values.sector, values.profession, values.experience,
        values.availability, values.languages, values.description,
      ].filter(Boolean).length;
      const profileCompletion = Math.round((filledFields / 12) * 100);

      // 3. Langue préférée depuis locale
      const preferredLocale = locale;

      // 4. Envoi du profil travailleur
      const regionString = stringifyRegionSelection(values.region);
      const languagesArray = values.languages
        ? values.languages.split(",").map(l => l.trim()).filter(Boolean)
        : [];

      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers,
        body: JSON.stringify({
          full_name: values.fullName.trim(),
          region: regionString,
          sector: values.sector,
          job_option: values.profession || values.sector,
          experience: values.experience || null,
          languages: languagesArray,
          description: [
            values.description,
            values.availability ? (locale === "en" ? `Availability: ${values.availability}` : `Disponibilité : ${values.availability}`) : "",
            values.adminStatus ? (locale === "en" ? `Administrative status: ${values.adminStatus}` : `Statut administratif : ${values.adminStatus}`) : "",
            values.country ? (locale === "en" ? `Country of residence: ${values.country}` : `Pays de résidence : ${values.country}`) : "",
            values.city ? (locale === "en" ? `Preferred city: ${values.city}` : `Ville souhaitée : ${values.city}`) : "",
          ].filter(Boolean).join("\n"),
          profile_visibility: "visible",
          preferred_locale: preferredLocale,
          profile_completion: profileCompletion,
          match_alerts_enabled: true,
        }),
      });

      if (!profileRes.ok) {
        const err = await profileRes.json().catch(() => ({}));
        throw new Error(err.error || (locale === "en"
          ? "Error creating profile."
          : "Erreur lors de la création du profil."));
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || (locale === "en" ? "An error occurred." : "Une erreur est survenue."));
    }
  }

  // ── Écran de chargement ─────────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8faff",
      }}>
        <div style={{ fontSize: 14, color: "#8a9db8" }}>{t.loading}</div>
      </div>
    );
  }

  // ── Écran non connecté ──────────────────────────────────────────────────────
  if (authStatus === "unauthenticated") {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px", textAlign: "center", background: "#f8faff",
      }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔒</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1E3A78", margin: "0 0 12px" }}>
          {t.loginTitle}
        </h2>
        <p style={{ fontSize: 15, color: "#3d5470", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 28px" }}>
          {t.loginText}
        </p>
        <a
          href={`${t.loginPath}?redirect=${t.wizardPath}`}
          style={{
            display: "inline-block", padding: "14px 28px", borderRadius: 12,
            background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", marginBottom: 12,
          }}
        >
          {t.loginBtn}
        </a>
        <a
          href={`${t.signupPath}?role=worker&redirect=${t.wizardPath}`}
          style={{
            display: "inline-block", padding: "14px 28px", borderRadius: 12,
            background: "transparent", color: "#1E3A78", fontWeight: 600, fontSize: 14,
            textDecoration: "none", border: "1.5px solid #dce8f5",
          }}
        >
          {t.signupBtn}
        </a>
      </div>
    );
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
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>
          {t.successTitle}
        </h2>
        <p style={{ fontSize: 16, color: "#3d5470", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 28px" }}>
          {t.successText}
        </p>
        <a href={t.spacePath} style={{
          display: "inline-block", padding: "14px 28px", borderRadius: 12,
          background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 15,
          textDecoration: "none",
        }}>
          {t.successBtn}
        </a>
      </div>
    );
  }

  // ── Options dynamiques ──────────────────────────────────────────────────────
  const professionGroups = values.region?.length
    ? getProfessionGroupsForRegions(values.region, locale)
    : [];

  const localeSectorOptions = locale === "en"
    ? getSectorOptions("en")
    : sectorOptions.map(s => ({ value: s, label: s }));

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
              {t.step} {step + 1} {t.of} {t.steps.length}
            </div>
          </div>
          <a href={t.backTo} style={{ fontSize: 12, color: "#b0bec5", textDecoration: "none" }}>
            {t.cancel}
          </a>
        </div>
        {/* Barres de progression */}
        <div style={{ display: "flex", gap: 5 }}>
          {t.steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= step ? "#57b7af" : "#e8eef8",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <div style={{
        flex: 1, padding: "28px 20px 140px",
        maxWidth: 520, margin: "0 auto", width: "100%", boxSizing: "border-box",
      }}>

        {/* En-tête de l'étape */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{t.steps[step].icon}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1E3A78", margin: "0 0 6px", lineHeight: 1.2 }}>
            {t.steps[step].title}
          </h1>
          <p style={{ fontSize: 14, color: "#8a9db8", margin: 0 }}>{t.steps[step].subtitle}</p>
        </div>

        {/* ── Étape 0 : Contact ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label={t.name} error={errors.fullName}>
              <input
                type="text" placeholder={t.namePh} value={values.fullName}
                onChange={e => set("fullName", e.target.value)}
                style={inputSt} autoComplete="name"
              />
            </Field>
            <Field label={t.email} error={errors.email}>
              <input
                type="email" placeholder={t.emailPh} value={values.email}
                onChange={e => set("email", e.target.value)}
                style={inputSt} autoCapitalize="off" autoCorrect="off"
                autoComplete="email" inputMode="email"
              />
            </Field>
            <Field label={t.phone} optional optionalLabel={t.optional}>
              <input
                type="tel" placeholder={t.phonePh} value={values.phone}
                onChange={e => set("phone", e.target.value)}
                style={inputSt} autoComplete="tel" inputMode="tel"
              />
            </Field>
            <Field label={t.country} optional optionalLabel={t.optional}>
              <input
                type="text" placeholder={t.countryPh} value={values.country}
                onChange={e => set("country", e.target.value)}
                style={inputSt} autoComplete="country-name"
              />
            </Field>
          </div>
        )}

        {/* ── Étape 1 : Localisation ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <Field label={t.region} error={errors.region} helper={t.regionHelper}>
              <RegionSelector value={values.region} onChange={v => set("region", v)} />
            </Field>
            <Field label={t.city} optional optionalLabel={t.optional}>
              <input
                type="text" placeholder={t.cityPh} value={values.city}
                onChange={e => set("city", e.target.value)}
                style={inputSt}
              />
            </Field>
          </div>
        )}

        {/* ── Étape 2 : Métier ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label={t.sector} error={errors.sector}>
              <select
                value={values.sector}
                onChange={e => set("sector", e.target.value)}
                style={inputSt}
              >
                <option value="">{t.sectorPh}</option>
                {localeSectorOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label={t.profession} optional optionalLabel={t.optional}>
              {professionGroups.length > 0 ? (
                <select
                  value={values.profession}
                  onChange={e => set("profession", e.target.value)}
                  style={inputSt}
                >
                  <option value="">{t.professionPh}</option>
                  {professionGroups.map(g => (
                    <optgroup key={g.label} label={g.label}>
                      {(g.options || []).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <input
                  type="text" placeholder={t.professionLocked}
                  value={values.profession} readOnly
                  style={{ ...inputSt, background: "#f5f7fb", color: "#b0bec5" }}
                />
              )}
            </Field>

            <Field label={t.experience} optional optionalLabel={t.optional}>
              <select
                value={values.experience}
                onChange={e => set("experience", e.target.value)}
                style={inputSt}
              >
                <option value="">{t.experiencePh}</option>
                {t.experienceOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* ── Étape 3 : Disponibilité & détails ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#8a9db8", lineHeight: 1.6 }}>
              {t.detailsHint}
            </p>
            <Field label={t.availability} optional optionalLabel={t.optional}>
              <input
                type="text" placeholder={t.availabilityPh} value={values.availability}
                onChange={e => set("availability", e.target.value)}
                style={inputSt}
              />
            </Field>
            <Field label={t.languages} optional optionalLabel={t.optional}>
              <input
                type="text" placeholder={t.languagesPh} value={values.languages}
                onChange={e => set("languages", e.target.value)}
                style={inputSt}
              />
            </Field>
            <Field label={t.adminStatus} optional optionalLabel={t.optional} helper={t.adminStatusNote}>
              <select
                value={values.adminStatus}
                onChange={e => set("adminStatus", e.target.value)}
                style={inputSt}
              >
                <option value="">{t.adminStatusPh}</option>
                {t.adminStatusOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={t.description} optional optionalLabel={t.optional}>
              <textarea
                placeholder={t.descriptionPh}
                value={values.description}
                onChange={e => set("description", e.target.value)}
                style={{ ...inputSt, minHeight: 120, resize: "vertical" }}
              />
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
          onClick={step < t.steps.length - 1 ? next : submit}
          disabled={status === "submitting"}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: status === "submitting" ? "#8a9db8" : "#57b7af",
            color: "#fff", fontSize: 17, fontWeight: 800,
            cursor: status === "submitting" ? "default" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {status === "submitting"
            ? t.submitting
            : step < t.steps.length - 1
              ? t.continue
              : t.submit}
        </button>
      </div>
    </div>
  );
}
