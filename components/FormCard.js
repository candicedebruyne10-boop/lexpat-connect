"use client";

import { useMemo, useState } from "react";
import RegionSelector from "./RegionSelector";
import { findSectorForProfession, getProfessionGroupsForRegions, stringifyRegionSelection } from "../lib/professions";

function getFieldKey(field) {
  return field.name || field.label;
}

function shouldShowField(field, values) {
  if (!field.showWhen) {
    return true;
  }

  return values[field.showWhen.field] === field.showWhen.value;
}

function resolveSelectOptions(field, values) {
  if (field.optionsByField) {
    const selected = values[field.optionsByField];
    if (Array.isArray(selected)) {
      return getProfessionGroupsForRegions(selected, field.locale || "fr");
    }
    if (!selected) return [];
    return field.optionsMap ? field.optionsMap[selected] || [] : getProfessionGroupsForRegions(selected, field.locale || "fr");
  }

  return field.options || [];
}

export default function FormCard({
  title,
  intro,
  fields,
  buttonLabel,
  formType,
  successMessage = "Votre demande a bien été envoyée.",
  locale = "fr"
}) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleFields = useMemo(
    () => fields.filter((field) => shouldShowField(field, values)),
    [fields, values]
  );

  function handleChange(field, value) {
    const fieldKey = getFieldKey(field);

    setValues((current) => {
      const next = {
        ...current,
        [fieldKey]: value
      };

      if (fieldKey === "region") {
        next.regionLabel = stringifyRegionSelection(value, "Plusieurs régions");
        next.profession = "";
        next.autreProfession = "";
        if (Object.prototype.hasOwnProperty.call(next, "secteur")) {
          next.secteur = "";
        }
      }

      if (fieldKey === "profession" && value !== "Autre profession") {
        next.autreProfession = "";
      }

      if (fieldKey === "secteur" && value !== "Autre secteur") {
        next.autreSecteur = "";
      }

      if (field.deriveField && field.deriveMap) {
        const selectedParentValue = field.deriveByField ? next[field.deriveByField] : null;
        const derivedValue = Array.isArray(selectedParentValue)
          ? findSectorForProfession(selectedParentValue, value)
          : selectedParentValue
            ? field.deriveMap[selectedParentValue]?.[value]
            : field.deriveMap[value];

        if (derivedValue) {
          next[field.deriveField] = derivedValue;
        }
      }

      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const payloadFields = visibleFields.map((field) => ({
      label: field.label,
      name: getFieldKey(field),
      value: Array.isArray(values[getFieldKey(field)])
        ? values[getFieldKey(field)].join(", ")
        : values[getFieldKey(field)] || ""
    }));

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formType,
          title,
          fields: payloadFields
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue.");
      }

      setValues({});
      setStatus({ type: "success", message: successMessage });
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
      <div className="mb-8 max-w-2xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          {locale === "en" ? "Form" : "Formulaire"}
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{intro}</p>
      </div>
      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        {visibleFields.map((field) => {
          const fieldKey = getFieldKey(field);
          const options = field.type === "select" ? resolveSelectOptions(field, values) : [];
          const placeholder = field.type === "select" && field.optionsMap && !values[field.optionsByField]
            ? (locale === "en" ? "Choose a region first" : "Choisissez d'abord une région")
            : field.placeholder;

          return (
            <label key={fieldKey} className={field.wide ? "md:col-span-2" : ""}>
              <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="field-input min-h-32"
                  placeholder={field.placeholder}
                  rows="5"
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                />
              ) : field.type === "region-multi" ? (
                <RegionSelector
                  value={values[fieldKey] || []}
                  onChange={(nextValue) => handleChange(field, nextValue)}
                  helperText={field.helperText}
                  locale={locale}
                />
              ) : field.type === "select" ? (
                <select
                  className="field-input"
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                >
                  <option value="" disabled>
                    {placeholder}
                  </option>
                  {options.map((option) =>
                    typeof option === "string" ? (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ) : option?.value ? (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ) : (
                      <optgroup key={option.label} label={option.label}>
                        {option.options.map((groupOption) => (
                          <option
                            key={`${option.label}-${typeof groupOption === "string" ? groupOption : groupOption.value}`}
                            value={typeof groupOption === "string" ? groupOption : groupOption.value}
                          >
                            {typeof groupOption === "string" ? groupOption : groupOption.label}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
              ) : (
                <input
                  className="field-input"
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={values[fieldKey] || ""}
                  onChange={(event) => handleChange(field, event.target.value)}
                />
              )}
            </label>
          );
        })}
        <div className="md:col-span-2 flex flex-col gap-4 pt-2">
          {status.message ? (
            <div
              className={status.type === "success"
                ? "rounded-2xl border border-[#cde8e4] bg-[#f2fbfa] px-4 py-3 text-sm text-[#1f6f69]"
                : "rounded-2xl border border-[#f2d6d8] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b3a43]"}
            >
              {status.message}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
              {locale === "en"
                ? "Messages sent through this form are received at the platform's official contact address."
                : "Les messages envoyés via ce formulaire sont reçus à l'adresse officielle de contact de la plateforme."}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (locale === "en" ? "Sending..." : "Envoi en cours...") : buttonLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
