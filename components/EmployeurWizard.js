"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegionSelector from "./RegionSelector";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import {
  sectorOptions,
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

const URGENCY_OPTIONS = [
  "Urgent (moins de 2 semaines)",
  "Sous 1 mois",
  "Sous 3 mois",
  "Flexible / À définir",
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
        // Pré-remplir les champs avec les données du profil si disponible
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
        // 409 = rôle déjà défini comme travailleur
        if (bootstrapRes.status === 409) {
          throw new Error("Ce compte est configuré comme travailleur. Utilisez un compte employeur.");
        }
        throw new Error(err.error || "Impossible de créer l'espace employeur.");
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
        throw new Error(err.error || "Erreur lors de la mise à jour du profil.");
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
        throw new Error(err.error || "Erreur lors de la publication de l'offre.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Une erreur est survenue.");
    }
  }

  // ── Écran de chargement ─────────────────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div style={{
        minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8faff",
      }}>
        <div style={{ fontSize: 14, color: "#8a9db8" }}>Chargement…</div>
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
          Connexion requise
        </h2>
        <p style={{ fontSize: 15, color: "#3d5470", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 28px" }}>
          Pour publier une offre et créer votre espace employeur, vous devez être connecté.
        </p>
        <a
          href={`/connexion?redirect=/employeurs/rejoindre`}
          style={{
            display: "inline-block", padding: "14px 28px", borderRadius: 12,
            background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", marginBottom: 12,
          }}
        >
          Se connecter
        </a>
        <a
          href="/inscription?role=employer&redirect=/employeurs/rejoindre"
          style={{
            display: "inline-block", padding: "14px 28px", borderRadius: 12,
            background: "transparent", color: "#1E3A78", fontWeight: 600, fontSize: 14,
            textDecoration: "none", border: "1.5px solid #dce8f5",
          }}
        >
          Créer un compte employeur
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
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>Offre publiée !</h2>
        <p style={{ fontSize: 16, color: "#3d5470", lineHeight: 1.65, maxWidth: 320, margin: "0 auto 28px" }}>
          Votre offre est maintenant en ligne. Nous cherchons des profils correspondants et vous contactons rapidement.
        </p>
        <a href="/employeurs/espace" style={{
          display: "inline-block", padding: "14px 28px", borderRadius: 12,
          background: "#1E3A78", color: "#fff", fontWeight: 700, fontSize: 15,
          textDecoration: "none",
        }}>
          Voir mon espace employeur →
        </a>
      </div>
    );
  }

  // ── Options dynamiques ──────────────────────────────────────────────────────
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
                {sectorOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>

            <Field label="Métier recherché" optional>
              {professionGroups.length > 0 ? (
                <select value={values.profession} onChange={e => set("profession", e.target.value)} style={inputSt}>
                  <option value="">Sélectionnez un métier</option>
                  {professionGroups.map(g => (
                    <optgroup key={g.label} label={g.label}>
                      {(g.options || []).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  ))}
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

            <Field label="Urgence du recrutement" optional>
              <select value={values.urgency} onChange={e => set("urgency", e.target.value)} style={inputSt}>
                <option value="">—</option>
                {URGENCY_OPTIONS.map(u => (
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
            ? "Publication en cours…"
            : step < STEPS.length - 1
              ? "Continuer →"
              : "Publier mon offre ✓"}
        </button>
      </div>
    </div>
  );
}
