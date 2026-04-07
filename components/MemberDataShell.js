"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

const toneClasses = {
  blue: "bg-[#eef4ff] text-[#173a8a] border-[#d7e4ff]",
  teal: "bg-[#ecfaf8] text-[#2b8f88] border-[#cdece8]",
  amber: "bg-[#fff7e8] text-[#c48014] border-[#f7e2b8]"
};

const statusClasses = {
  published: "bg-[#eef4ff] text-[#173a8a]",
  submitted: "bg-[#eef4ff] text-[#173a8a]",
  reviewing: "bg-[#fff7e8] text-[#c48014]",
  shortlisted: "bg-[#eef9f1] text-[#2f9d57]",
  contacted: "bg-[#ecfaf8] text-[#2b8f88]",
  rejected: "bg-[#fff1f1] text-[#af4b4b]",
  hired: "bg-[#eef9f1] text-[#2f9d57]"
};

function formatDate(value, locale = "fr") {
  if (!value) return locale === "en" ? "Not provided" : "Non renseignée";
  return new Intl.DateTimeFormat(locale === "en" ? "en-BE" : "fr-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatValue(key, value, locale = "fr") {
  if (key === "createdAt") return formatDate(value, locale);
  return value || (locale === "en" ? "Not provided" : "Non renseigné");
}

export default function MemberDataShell({
  title,
  intro,
  kicker,
  endpoint,
  loginPath,
  summaryCards,
  columns,
  emptyLabel,
  locale = "fr"
}) {
  const isEn = locale === "en";
  const { user, session, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ summary: {}, rows: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user || !session?.access_token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadRows() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || (isEn ? "Unable to load the data." : "Impossible de charger les données."));
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || (isEn ? "Unable to load the data." : "Impossible de charger les données."));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRows();
    return () => {
      cancelled = true;
    };
  }, [endpoint, loading, session?.access_token, user]);

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return data.rows || [];

    return (data.rows || []).filter((row) =>
      columns.some((column) => String(row[column.key] || "").toLowerCase().includes(needle))
    );
  }, [columns, data.rows, query]);

  if (loading || isLoading) {
    return (
      <div className="container-shell py-16">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173A8A] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user || !session?.access_token) {
    return (
      <div className="container-shell py-16">
        <section className="mx-auto max-w-3xl rounded-[34px] border border-[#e5edf4] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
          <p className="inline-flex rounded-full bg-[#eef4ff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#173a8a]">
            {isEn ? "Member access" : "Accès membre"}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#173a8a] sm:text-4xl">
            {isEn ? "Sign-in required" : "Connexion requise"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#607086]">
            {isEn ? "This page is reserved for signed-in members." : "Cette page est réservée aux membres connectés de LEXPAT."}
          </p>
          <div className="mt-8">
            <Link href={`${isEn ? "/en" : ""}/connexion?next=${loginPath}`} className="primary-button">
              {isEn ? "Sign in" : "Se connecter"}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-shell py-10 sm:py-14">
      <section className="rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-10">
        <p className="inline-flex rounded-full bg-[#eef4ff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#173a8a]">
          {kicker}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#173a8a] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#607086]">{intro}</p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article key={card.key} className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[card.tone]}`}>
              {card.label}
            </span>
            <p className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#173a8a]">
              {data.summary?.[card.key] || 0}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#173a8a]">{emptyLabel}</h2>
            <p className="mt-2 text-sm leading-7 text-[#607086]">
              {isEn ? "Use this view to quickly browse the data available in the member area." : "Utilisez cette vue pour parcourir rapidement les données disponibles dans l’espace membre."}
            </p>
          </div>
          <label className="block w-full min-w-0 lg:min-w-[280px]">
            <span className="sr-only">{isEn ? "Search" : "Rechercher"}</span>
            <input
              className="field-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isEn ? "Search..." : "Rechercher..."}
            />
          </label>
        </div>

        {error ? (
          <div className="mt-6 rounded-[22px] border border-[#f2c4c4] bg-[#fff5f5] px-4 py-4 text-sm text-[#a33f3f]">
            {error}
          </div>
        ) : null}

        {!error && !filteredRows.length ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-[#d9e4ee] bg-[#fbfdff] px-6 py-12 text-center text-sm leading-7 text-[#6d7b8d]">
            {isEn ? "No items to display yet." : "Aucun élément à afficher pour l’instant."}
          </div>
        ) : null}

        {!error && filteredRows.length ? (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
            <div className={`hidden gap-4 border-b border-[#edf3f7] bg-[#f9fbfd] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#607086] lg:grid`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
              {columns.map((column) => (
                <div key={column.key}>{column.label}</div>
              ))}
            </div>
            <div className="divide-y divide-[#edf3f7]">
              {filteredRows.map((row) => (
                <article key={row.id} className="grid gap-3 px-6 py-5 lg:items-center lg:gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
                  {columns.map((column) => {
                    const value = formatValue(column.key, row[column.key], locale);
                    const isStatus = column.key === "status";
                    return (
                      <div key={column.key} className={column.primary ? "" : "text-sm text-[#334155]"}>
                        {column.primary ? (
                          <>
                            <p className="text-base font-semibold text-[#173a8a]">{value}</p>
                            {column.secondaryKey ? (
                              <p className="mt-1 text-sm text-[#6d7b8d]">{formatValue(column.secondaryKey, row[column.secondaryKey], locale)}</p>
                            ) : null}
                          </>
                        ) : isStatus ? (
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[row.status] || "bg-[#f5f7fa] text-[#607086]"}`}>
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </div>
                    );
                  })}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
