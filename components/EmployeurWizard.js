"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
      { icon: "👋", title: "Qui recrute ?",          subtitle: "Vos coordonnées de contact" },
      { icon: "📍", title: "Où se situe le poste ?", subtitle: "Région et lieu de travail" },
      { icon: "💼", title: "Quel poste ?",            subtitle: "Le métier et le type de contrat" },
      { icon: "📝", title: "Décrivez le rôle",        subtitle: "Missions et compétences attendues (optionnel)" },
    ],
    urgency: ["Urgent (moins de 2 semaines)", "Sous 1 mois", "Sous 3 mois", "Flexible / À définir"],
    loading: "Chargement…",
    loginTitle: "Connexion requise",
    loginText: "Pour publier une offre et créer votre espace employeur, vous devez être connecté.",
    loginBtn: "Se connecter",
    signupBtn: "Créer un compte employeur",
    successTitle: "Offre publiée !",
    successText: "Votre offre est maintenant en ligne. Nous cherchons des profils correspondants et vous contactons rapidement.",
    successBtn: "Voir mon espace employeur →",
    cancel: "Annuler",
    step: "Étape",
    of: "sur",
    continue: "Continuer →",
    submit: "Publier mon offre ✓",
    submitting: "Publication en cours…",
    name: "Votre nom", namePh: "Prénom Nom",
    company: "Votre entreprise", companyPh: "Nom de l'entreprise",
    email: "Email professionnel", emailPh: "contact@entreprise.be",
    phone: "Téléphone", phonePh: "+32 ...",
    region: "Région de recrutement",
    regionHelper: "Sélectionnez la région où le travail sera principalement organisé.",
    city: "Ville ou lieu de travail", cityPh: "Bruxelles, Liège, Gand…",
    sector: "Secteur d'activité", sectorPh: "Sélectionnez un secteur",
    profession: "Métier recherché", professionPh: "Sélectionnez un métier",
    professionLocked: "Choisissez d'abord une région à l'étape précédente",
    contract: "Type de contrat", contractPh: "—",
    contractOptions: ["CDI", "CDD", "Intérim", "Freelance", "Stage"],
    hours: "Heures/semaine", hoursPh: "38h",
    urgencyLabel: "Urgence du recrutement",
    missions: "Missions principales", missionsPh: "Résumé des missions et responsabilités…",
    skills: "Compétences recherchées", skillsPh: "Compétences, langues, expérience, conditions…",
    detailsHint: "Ces champs sont optionnels. Plus vous êtes précis, plus la mise en relation sera efficace.",
    optional: "optionnel",
    errName: "Veuillez indiquer votre nom.",
    errCompany: "Veuillez indiquer votre entreprise.",
    errEmail: "Email invalide.",
    errRegion: "Sélectionnez au moins une région.",
    errSector: "Sélectionnez un secteur.",
    backTo: "/employeurs",
    wizardPath: "/employeurs/rejoindre",
    spacePath: "/employeurs/espace",
    loginPath: "/connexion",
    signupPath: "/inscription",
  },
  en: {
    steps: [
      { icon: "👋", title: "Who is hiring?",       subtitle: "Your contact details" },
      { icon: "📍", title: "Where is the role?",   subtitle: "Region and work location" },
      { icon: "💼", title: "What role?",            subtitle: "The occupation and contract type" },
      { icon: "📝", title: "Describe the role",    subtitle: "Responsibilities and expected skills (optional)" },
    ],
    urgency: ["Urgent (under 2 weeks)", "Within 1 month", "Within 3 months", "Flexible / To be defined"],
    loading: "Loading…",
    loginTitle: "Sign in required",
    loginText: "To post a job opening and create your employer space, you need to be signed in.",
    loginBtn: "Sign in",
    signupBtn: "Create an employer account",
    successTitle: "Opening published!",
    successText: "Your opening is now live. We are looking for matching profiles and will be in touch shortly.",
    successBtn: "View my employer space →",
    cancel: "Cancel",
    step: "Step",
    of: "of",
    continue: "Continue →",
    submit: "Publish my opening ✓",
    submitting: "Publishing…",
    name: "Your name", namePh: "First Last",
    company: "Your company", companyPh: "Company name",
    email: "Work email", emailPh: "contact@company.be",
    phone: "Phone", phonePh: "+32 ...",
    region: "Hiring region",
    regionHelper: "Select the region where the work will primarily take place.",
    city: "City or work location", cityPh: "Brussels, Liège, Ghent…",
    sector: "Sector", sectorPh: "Select a sector",
    profession: "Target role", professionPh: "Select a role",
    professionLocked: "Choose a region in the previous step first",
    contract: "Contract type", contractPh: "—",
    contractOptions: ["Permanent", "Fixed-term", "Temporary", "Freelance", "Internship"],
    hours: "Hours/week", hoursPh: "38h",
    urgencyLabel: "Hiring urgency",
    missions: "Main responsibilities", missionsPh: "Summary of tasks and responsibilities…",
    skills: "Expected skills", skillsPh: "Skills, languages, experience, conditions…",
    detailsHint: "These fields are optional. The more precise you are, the more effective the matching will be.",
    optional: "optional",
    errName: "Please enter your name.",
    errCompany: "Please enter your company name.",
    errEmail: "Invalid email.",
    errRegion: "Please select at least one region.",
    errSector: "Please select a sector.",
    backTo: "/en/employeurs",
    wizardPath: "/en/employeurs/rejoindre",
    spacePath: "/en/employeurs/espace",
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
  fontSize: 16,           // évite le zoom auto sur iOS
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
        {optional && <span style={{ fontSize: 11, color: "#b0bec5", fontWeight: 500 }}>{optionalLabel || "optionnel"}</span>}
      </div>
      {helper && <div style={{ fontSize: 12, color: "#8a9db8", marginBottom: 7 }}>{helper}</div>}
      {children}
      {error && <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function EmployeurWizard() {
  const pathname = usePathname() || "/";
  const locale = pathname.startsWith("/en") ? "en" : "fr";
  const t = T[locale];
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("loading"); // loading | authenticated | unauthenticated
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    contactName: "", company: "", email: "", phone: "",
    region: [], location: "",
    sector: "", profession: "", contractType: "", hours: "", urgency: "",
    responsibilities: "", skills: "",
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // ── Vérification de l'authentification ────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session) {
        setAuthStatus("authenticated");
        const meta = session.user?.user_metadata || {};
        setValues(prev => ({
          ...prev,
          contactName: prev.contactName || meta.full_name || "",
          email: prev.email || session.user.email || "",
          company: prev.company || meta.company_name || "",
        }));
      } else {
        setAuthStatus("unauthenticated");
      }
    });
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
      if (!values.contactName.trim()) e.contactName = t.errName;
      if (!values.company.trim())     e.company     = t.errCompany;
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
    setStep(s => Math.min(s + 1, STEPS.length - 1));
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

      // 1. Bootstrap : crée l'espace employeur si inexistant
      const bootstrapRes = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers,
        body: JSON.stringify({
          role: "employer",
          companyName: values.company.trim(),
          fullName: values.contactName.trim(),
          email: values.email.trim(),
        }),
      });

      if (!bootstrapRes.ok) {
        const err = await bootstrapRes.json().catch(() => ({}));
        throw new Error(err.error || (locale === "en" ? "Unable to create employer space." : "Impossible de créer l'espace employeur."));
      }

      // 2. Mise à jour du profil employeur (infos entreprise + contact)
      const primaryRegion = values.region?.[0] || "";
      const profileRes = await fetch("/api/employer-profile", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          companyName: values.company.trim(),
          contactName: values.contactName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          sector: values.sector,
          region: primaryRegion,
        }),
      });

      if (!profileRes.ok) {
        const err = await profileRes.json().catch(() => ({}));
        throw new Error(err.error || (locale === "en" ? "Error updating profile." : "Erreur lors de la mise à jour du profil."));
      }

      // 3. Création de l'offre d'emploi
      const description = [values.responsibilities, values.skills]
        .map(s => s.trim())
        .filter(Boolean)
        .join("\n\n");

      const offerRes = await fetch("/api/offers", {
        method: "POST",
        headers,
        body: JSON.stringify({
          shortage_job: values.profession || values.sector,
          sector: values.sector,
          region: values.region,
          contract_type: values.contractType || null,
          urgency: values.urgency || null,
          description: description || null,
          title: values.profession || values.sector,
        }),
      });

      if (!offerRes.ok) {
        const err = await offerRes.json().catch(() => ({}));
        throw new Error(err.error || (locale === "en" ? "Error publishing the opening." : "Erreur lors de la publication de l'offre."));
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
          href={`${t.signupPath}?role=employer&redirect=${t.wizardPath}`}
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
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>{t.successTitle}</h2>
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
  const localeSectorOptions = locale === "en" ? getSectorOptions("en").map(o => o.label) : sectorOptions;

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
          <a href={t.backTo} style={{ fontSize: 12, color: "#b0bec5", textDecoration: "none" }}>{t.cancel}</a>
        </div>
        {/* Barres de progression */}
        <div style={{ display: "flex", gap: 5 }}>
          {t.steps.map((_, i) => (
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
          <div style={{ fontSize: 40, marginBottom: 10 }}>{t.steps[step].icon}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1E3A78", margin: "0 0 6px", lineHeight: 1.2 }}>
            {t.steps[step].title}
          </h1>
          <p style={{ fontSize: 14, color: "#8a9db8", margin: 0 }}>{t.steps[step].subtitle}</p>
        </div>

        {/* ── Étape 0 : Contact ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label={t.name} error={errors.contactName}>
              <input type="text" placeholder={t.namePh} value={values.contactName}
                onChange={e => set("contactName", e.target.value)} style={inputSt} autoComplete="name" />
            </Field>
            <Field label={t.company} error={errors.company}>
              <input type="text" placeholder={t.companyPh} value={values.company}
                onChange={e => set("company", e.target.value)} style={inputSt} autoComplete="organization" />
            </Field>
            <Field label={t.email} error={errors.email}>
              <input type="email" placeholder={t.emailPh} value={values.email}
                onChange={e => set("email", e.target.value)} style={inputSt}
                autoCapitalize="off" autoCorrect="off" autoComplete="email" inputMode="email" />
            </Field>
            <Field label={t.phone} optional optionalLabel={t.optional}>
              <input type="tel" placeholder={t.phonePh} value={values.phone}
                onChange={e => set("phone", e.target.value)} style={inputSt}
                autoComplete="tel" inputMode="tel" />
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
              <input type="text" placeholder={t.cityPh} value={values.location}
                onChange={e => set("location", e.target.value)} style={inputSt} />
            </Field>
          </div>
        )}

        {/* ── Étape 2 : Le poste ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label={t.sector} error={errors.sector}>
              <select value={values.sector} onChange={e => set("sector", e.target.value)} style={inputSt}>
                <option value="">{t.sectorPh}</option>
                {localeSectorOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>

            <Field label={t.profession} optional optionalLabel={t.optional}>
              {professionGroups.length > 0 ? (
                <select value={values.profession} onChange={e => set("profession", e.target.value)} style={inputSt}>
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
                <input type="text" placeholder={t.professionLocked}
                  value={values.profession} readOnly
                  style={{ ...inputSt, background: "#f5f7fb", color: "#b0bec5" }} />
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label={t.contract} optional optionalLabel={t.optional}>
                <select value={values.contractType} onChange={e => set("contractType", e.target.value)} style={inputSt}>
                  <option value="">{t.contractPh}</option>
                  {t.contractOptions.map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </Field>
              <Field label={t.hours} optional optionalLabel={t.optional}>
                <input type="text" placeholder={t.hoursPh} value={values.hours}
                  onChange={e => set("hours", e.target.value)} style={inputSt} inputMode="numeric" />
              </Field>
            </div>

            <Field label={t.urgencyLabel} optional optionalLabel={t.optional}>
              <select value={values.urgency} onChange={e => set("urgency", e.target.value)} style={inputSt}>
                <option value="">—</option>
                {t.urgency.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* ── Étape 3 : Détails ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#8a9db8", lineHeight: 1.6 }}>
              {t.detailsHint}
            </p>
            <Field label={t.missions} optional optionalLabel={t.optional}>
              <textarea placeholder={t.missionsPh} value={values.responsibilities}
                onChange={e => set("responsibilities", e.target.value)}
                style={{ ...inputSt, minHeight: 110, resize: "vertical" }} />
            </Field>
            <Field label={t.skills} optional optionalLabel={t.optional}>
              <textarea placeholder={t.skillsPh} value={values.skills}
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
          onClick={step < t.steps.length - 1 ? next : submit}
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
            ? t.submitting
            : step < t.steps.length - 1
              ? t.continue
              : t.submit}
        </button>
      </div>
    </div>
  );
}
