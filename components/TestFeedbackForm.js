"use client";

import { useMemo, useState } from "react";

const TESTERS = ["Margaux", "Zahra"];

const PAGE_OPTIONS = [
  "Accueil",
  "Employeurs",
  "Talents",
  "Métiers en pénurie",
  "Permis unique",
  "Connexion",
  "Inscription",
  "Espace employeur",
  "Espace travailleur",
  "Contact",
  "Autre page"
];

const FEEDBACK_TYPES = [
  "Bug",
  "Compréhension",
  "Parcours utilisateur",
  "Design / lisibilité",
  "Contenu / wording",
  "Suggestion"
];

const PRIORITIES = ["Bloquant", "Important", "À améliorer", "Idée"];

function initialValues() {
  return {
    tester_name: "",
    page_label: "",
    custom_page: "",
    feedback_type: "",
    priority: "",
    device: "",
    browser: "",
    summary: "",
    details: "",
    expected_result: "",
    suggested_fix: ""
  };
}

export default function TestFeedbackForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolvedPageLabel = useMemo(() => {
    return values.page_label === "Autre page" ? values.custom_page : values.page_label;
  }, [values.custom_page, values.page_label]);

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
        ...values,
        page_label: resolvedPageLabel
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
        message: "Le retour a bien été enregistré. Merci pour le test."
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
          Retours testeurs
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">
          Centraliser les retours de Margaux et Zahra
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
          L’objectif est d’aller vite : une page testée, un problème observé, un impact, et si possible une suggestion.
        </p>
      </div>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Testeur</span>
          <select
            className="field-input"
            value={values.tester_name}
            onChange={(event) => updateValue("tester_name", event.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionnez le testeur
            </option>
            {TESTERS.map((tester) => (
              <option key={tester} value={tester}>
                {tester}
              </option>
            ))}
          </select>
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

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Type de retour</span>
          <select
            className="field-input"
            value={values.feedback_type}
            onChange={(event) => updateValue("feedback_type", event.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionnez un type
            </option>
            {FEEDBACK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Priorité</span>
          <select
            className="field-input"
            value={values.priority}
            onChange={(event) => updateValue("priority", event.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionnez une priorité
            </option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Appareil</span>
          <input
            className="field-input"
            type="text"
            placeholder="Ex. iPhone, MacBook, PC"
            value={values.device}
            onChange={(event) => updateValue("device", event.target.value)}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Navigateur</span>
          <input
            className="field-input"
            type="text"
            placeholder="Ex. Safari, Chrome"
            value={values.browser}
            onChange={(event) => updateValue("browser", event.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Résumé rapide</span>
          <input
            className="field-input"
            type="text"
            placeholder="Ex. Le bouton n'est pas visible sur mobile"
            value={values.summary}
            onChange={(event) => updateValue("summary", event.target.value)}
            required
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Ce que j’ai observé</span>
          <textarea
            className="field-input min-h-32"
            placeholder="Décrivez ce qui se passe réellement."
            value={values.details}
            onChange={(event) => updateValue("details", event.target.value)}
            required
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Ce qui était attendu</span>
          <textarea
            className="field-input min-h-28"
            placeholder="Décrivez le comportement attendu."
            value={values.expected_result}
            onChange={(event) => updateValue("expected_result", event.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">Suggestion ou idée</span>
          <textarea
            className="field-input min-h-28"
            placeholder="Si vous avez une idée d'amélioration, notez-la ici."
            value={values.suggested_fix}
            onChange={(event) => updateValue("suggested_fix", event.target.value)}
          />
        </label>

        <div className="md:col-span-2 flex flex-col gap-4 pt-2">
          {status.message ? (
            <div
              className={
                status.type === "success"
                  ? "rounded-2xl border border-[#cde8e4] bg-[#f2fbfa] px-4 py-3 text-sm text-[#1f6f69]"
                  : "rounded-2xl border border-[#f2d6d8] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3a43]"
              }
            >
              {status.message}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
              Chaque retour est enregistré dans Supabase et peut aussi être envoyé par email à LEXPAT pour un suivi plus rapide.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#173A8A] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(23,58,138,0.24)] transition hover:bg-[#143273] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enregistrement..." : "Envoyer le retour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
