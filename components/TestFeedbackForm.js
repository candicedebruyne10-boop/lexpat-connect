"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

const PAGE_OPTIONS = [
  "Accueil",
  "Employeurs",
  "Travailleurs",
  "Métiers en pénurie",
  "Permis unique",
  "Connexion",
  "Inscription",
  "Espace employeur",
  "Espace travailleur",
  "Messagerie",
  "Contact",
  "Autre page"
];

const FEEDBACK_TYPES = [
  { value: "Bug", label: "J'ai trouvé un bug" },
  { value: "Compréhension", label: "Ce n'est pas clair" },
  { value: "Suggestion", label: "J'ai une idée" }
];

function initialValues() {
  return {
    tester_name: "",
    page_label: "",
    custom_page: "",
    feedback_type: "",
    details: "",
    suggested_fix: ""
  };
}

function summarize(text) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

export default function TestFeedbackForm({ locale = "fr" }) {
  const isEn = locale === "en";
  const pageOptions = isEn
    ? ["Home", "Employers", "Workers", "Shortage occupations", "Single permit", "Sign in", "Create account", "Employer space", "Worker space", "Messaging", "Contact", "Other page"]
    : PAGE_OPTIONS;
  const feedbackTypes = isEn
    ? [
        { value: "Bug", label: "I found a bug" },
        { value: "Compréhension", label: "This is unclear" },
        { value: "Suggestion", label: "I have an idea" }
      ]
    : FEEDBACK_TYPES;
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshots, setScreenshots] = useState([]); // [{ name, dataUrl }]
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_SCREENSHOTS = 3;

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ name: file.name, dataUrl: e.target.result, size: file.size });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    const images = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, MAX_SCREENSHOTS - screenshots.length);
    if (!images.length) return;
    const loaded = await Promise.all(images.map(readFileAsDataUrl));
    setScreenshots(prev => [...prev, ...loaded].slice(0, MAX_SCREENSHOTS));
  }

  function removeScreenshot(index) {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  }

  const resolvedPageLabel = useMemo(
    () => (values.page_label === (isEn ? "Other page" : "Autre page") ? values.custom_page : values.page_label),
    [isEn, values.custom_page, values.page_label]
  );

  function updateValue(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === "page_label" && value !== (isEn ? "Other page" : "Autre page") ? { custom_page: "" } : {})
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload = {
        tester_name: values.tester_name.trim() || "Visiteur",
        page_label: resolvedPageLabel,
        feedback_type: values.feedback_type || "Suggestion",
        priority: "À améliorer",
        device: "",
        browser: "",
        summary: summarize(values.details),
        details: values.details.trim(),
        expected_result: "",
        suggested_fix: values.suggested_fix.trim(),
        screenshots: screenshots.map(s => ({ name: s.name, dataUrl: s.dataUrl })),
      };

      const response = await fetch("/api/test-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || (isEn ? "Unable to save your feedback." : "Impossible d'enregistrer le retour."));
      }

      setValues(initialValues());
      setScreenshots([]);
      setStatus({
        type: result.emailSent === false ? "warning" : "success",
        message:
          result.emailSent === false
            ? (isEn
              ? "Your feedback was saved, but the notification email could not be sent yet. The report is still recorded in our database."
              : "Votre retour a bien été enregistré, mais l'email de notification n'a pas pu être envoyé pour le moment. Le retour est tout de même bien conservé en base.")
            : (isEn
              ? "Thank you very much for your feedback. It genuinely helps us make LEXPAT Connect clearer, smoother and more useful."
              : "Merci beaucoup pour votre retour. Vous participez concrètement à l’éclosion de LEXPAT Connect, et c’est précieux pour nous.")
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || (isEn ? "An error occurred while sending your feedback." : "Une erreur est survenue lors de l'envoi.")
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          {isEn ? "Tester feedback" : "Retour utilisateur"}
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">
          {isEn ? "A simple form built to stay quick" : "Un formulaire simple, pensé pour aller vite"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
          {isEn ? "Tell us what felt confusing, annoying, broken or simply improvable. Even a short note can help a lot." : "Dites-nous simplement ce qui vous a gêné, surpris ou semblé améliorable. Même un retour court peut nous aider énormément."}
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "Your name or nickname" : "Votre prénom ou pseudo"}</span>
          <input
            className="field-input"
            type="text"
            placeholder={isEn ? "Optional" : "Facultatif"}
            value={values.tester_name}
            onChange={(event) => updateValue("tester_name", event.target.value)}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "Page concerned" : "Page concernée"}</span>
          <select
            className="field-input"
            value={values.page_label}
            onChange={(event) => updateValue("page_label", event.target.value)}
            required
          >
            <option value="" disabled>
              {isEn ? "Select a page" : "Sélectionnez une page"}
            </option>
            {pageOptions.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>

        {values.page_label === (isEn ? "Other page" : "Autre page") ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "Specify the page" : "Préciser la page"}</span>
            <input
              className="field-input"
              type="text"
              placeholder={isEn ? "E.g. security & compliance page" : "Ex. page sécurité & conformité"}
              value={values.custom_page}
              onChange={(event) => updateValue("custom_page", event.target.value)}
              required
            />
          </label>
        ) : null}

        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "What kind of feedback do you want to share?" : "Quel type de retour voulez-vous partager ?"}</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {feedbackTypes.map((item) => {
              const active = values.feedback_type === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateValue("feedback_type", item.value)}
                  className="rounded-[20px] border px-4 py-4 text-left text-sm font-semibold transition"
                  style={{
                    borderColor: active ? "#57b7af" : "#dbe7f0",
                    background: active ? "#eef9f8" : "#ffffff",
                    color: active ? "#1d7a6e" : "#36506c"
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "What you want to report" : "Ce que vous voulez nous signaler"}</span>
          <textarea
            className="field-input min-h-36"
            placeholder={isEn ? "Describe freely what you noticed: a bug, a confusing point, something blocking, or a general impression..." : "Décrivez librement ce que vous avez remarqué : un bug, une confusion, un détail bloquant, une impression…"}
            value={values.details}
            onChange={(event) => updateValue("details", event.target.value)}
            required
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{isEn ? "Any idea to improve it?" : "Une idée pour améliorer ?"}</span>
          <textarea
            className="field-input min-h-28"
            placeholder={isEn ? "Optional: if you have a simple suggestion, tell us here." : "Facultatif : si vous avez une suggestion simple, dites-la nous ici."}
            value={values.suggested_fix}
            onChange={(event) => updateValue("suggested_fix", event.target.value)}
          />
        </label>

        {/* Zone captures d'écran */}
        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">
            {isEn ? "Screenshots (optional, max 3)" : "Captures d'écran (facultatif, max 3)"}
          </span>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => screenshots.length < MAX_SCREENSHOTS && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "#57b7af" : "#d0dce8"}`,
              borderRadius: 16,
              background: dragOver ? "#f0faf9" : "#fafcff",
              padding: "20px 16px",
              textAlign: "center",
              cursor: screenshots.length < MAX_SCREENSHOTS ? "pointer" : "default",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture={undefined}
              style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)}
            />
            {screenshots.length === 0 ? (
              <div style={{ color: "#6b85a0", fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {isEn ? "Drag & drop or tap to add a screenshot" : "Glissez une image ici ou tapez pour en ajouter une"}
                </div>
                <div style={{ fontSize: 12, color: "#9aadbe" }}>
                  {isEn ? "PNG, JPG or WEBP — from your phone camera or Mac — max 3 images" : "PNG, JPG ou WEBP — depuis votre smartphone ou votre Mac — max 3 images"}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {screenshots.map((s, i) => (
                  <div key={i} style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={s.dataUrl}
                      alt={s.name}
                      style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid #d0dce8", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                    />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); removeScreenshot(i); }}
                      style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "#b91c1c", border: "2px solid white", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                    >✕</button>
                    <div style={{ fontSize: 10, color: "#8a9db8", marginTop: 4, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  </div>
                ))}
                {screenshots.length < MAX_SCREENSHOTS && (
                  <div
                    style={{ width: 120, height: 80, border: "2px dashed #c8d8e8", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9aadbe", fontSize: 11 }}
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <span style={{ fontSize: 20 }}>+</span>
                    <span>{isEn ? "Add" : "Ajouter"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4 pt-2">
          {status.message ? (
            status.type === "success" ? (
              <div className="flex items-center gap-4 rounded-2xl border border-[#cde8e4] bg-[#f2fbfa] px-4 py-4 text-sm leading-7 text-[#1f6f69]">
                <Image
                  src="/persobug5.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full border border-[#d9e9f1] bg-white object-cover shadow-[0_8px_20px_rgba(17,39,87,0.08)]"
                />
                <p>{status.message}</p>
              </div>
            ) : status.type === "warning" ? (
              <div className="rounded-2xl border border-[#f4e3b0] bg-[#fffaf0] px-4 py-4 text-sm leading-7 text-[#8a6420]">
                {status.message}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#f2d6d8] bg-[#fff7f7] px-4 py-4 text-sm leading-7 text-[#9b3a43]">
                {status.message}
              </div>
            )
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
              {isEn ? "Thank you for taking a moment to help us. Every report is read carefully and helps us build a more useful platform." : "Merci de prendre quelques instants pour nous aider. Chaque retour est lu avec attention et nous aide à construire une plateforme plus utile."}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#173A8A] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(23,58,138,0.24)] transition hover:bg-[#143273] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (isEn ? "Sending..." : "Envoi...") : (isEn ? "Send my feedback" : "Envoyer mon retour")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
