"use client";

import { useMemo, useState } from "react";

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

export default function TestFeedbackForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedPageLabel = useMemo(
    () => (values.page_label === "Autre page" ? values.custom_page : values.page_label),
    [values.custom_page, values.page_label]
  );

  function updateValue(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === "page_label" && value !== "Autre page" ? { custom_page: "" } : {})
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
        suggested_fix: values.suggested_fix.trim()
      };

      const response = await fetch("/api/test-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Impossible d'enregistrer le retour.");
      }

      setValues(initialValues());
      setStatus({
        type: "success",
        message:
          "Merci beaucoup pour votre retour. Vous participez concrètement à l’éclosion de LEXPAT Connect, et c’est précieux pour nous."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Une erreur est survenue lors de l'envoi."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          Retour utilisateur
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">
          Un formulaire simple, pensé pour aller vite
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
          Dites-nous simplement ce qui vous a gêné, surpris ou semblé améliorable. Même un retour court peut nous aider énormément.
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Votre prénom ou pseudo</span>
          <input
            className="field-input"
            type="text"
            placeholder="Facultatif"
            value={values.tester_name}
            onChange={(event) => updateValue("tester_name", event.target.value)}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Page concernée</span>
          <select
            className="field-input"
            value={values.page_label}
            onChange={(event) => updateValue("page_label", event.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionnez une page
            </option>
            {PAGE_OPTIONS.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>

        {values.page_label === "Autre page" ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Préciser la page</span>
            <input
              className="field-input"
              type="text"
              placeholder="Ex. page sécurité & conformité"
              value={values.custom_page}
              onChange={(event) => updateValue("custom_page", event.target.value)}
              required
            />
          </label>
        ) : null}

        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Quel type de retour voulez-vous partager ?</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {FEEDBACK_TYPES.map((item) => {
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
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Ce que vous voulez nous signaler</span>
          <textarea
            className="field-input min-h-36"
            placeholder="Décrivez librement ce que vous avez remarqué : un bug, une confusion, un détail bloquant, une impression…"
            value={values.details}
            onChange={(event) => updateValue("details", event.target.value)}
            required
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Une idée pour améliorer ?</span>
          <textarea
            className="field-input min-h-28"
            placeholder="Facultatif : si vous avez une suggestion simple, dites-la nous ici."
            value={values.suggested_fix}
            onChange={(event) => updateValue("suggested_fix", event.target.value)}
          />
        </label>

        <div className="md:col-span-2 flex flex-col gap-4 pt-2">
          {status.message ? (
            <div
              className={
                status.type === "success"
                  ? "rounded-2xl border border-[#cde8e4] bg-[#f2fbfa] px-4 py-4 text-sm leading-7 text-[#1f6f69]"
                  : "rounded-2xl border border-[#f2d6d8] bg-[#fff7f7] px-4 py-4 text-sm leading-7 text-[#9b3a43]"
              }
            >
              {status.message}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
              Merci de prendre quelques instants pour nous aider. Chaque retour est lu avec attention et nous aide à construire une plateforme plus utile.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#173A8A] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(23,58,138,0.24)] transition hover:bg-[#143273] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Envoi..." : "Envoyer mon retour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
