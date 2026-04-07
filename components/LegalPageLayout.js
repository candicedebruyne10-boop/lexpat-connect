"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

function renderBody(body) {
  if (typeof body === "string") {
    return <p className="text-base leading-8 text-[#5c6e84]">{body}</p>;
  }

  return body;
}

export default function LegalPageLayout({ title, intro, sections, lastUpdated = "1 avril 2026" }) {
  return (
    <section className="pb-16 pt-8 sm:pb-20 lg:pb-24 lg:pt-12">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[36px] border border-[#e4edf4] bg-white px-6 py-10 shadow-[0_20px_70px_rgba(30,52,94,0.06)] sm:px-8 lg:px-12 lg:py-14">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(103,190,182,0.14),transparent_62%)]" />
          <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#60b8b1] to-transparent" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center justify-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#255c8f]">
              Informations légales
            </p>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#1d3b8b] sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#50627a] sm:text-lg">
              {intro}
            </p>
            <p className="mt-4 text-sm text-[#7a899d]">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-[28px] border border-[#e4edf4] bg-white p-6 shadow-[0_12px_30px_rgba(24,53,101,0.05)] lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Sur cette page</p>
            <nav className="mt-5 space-y-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#607086] transition hover:border-[#d9e7f3] hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                >
                  <span className="mr-2 text-[#57b7af]">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-[22px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5 text-sm text-[#607086]">
              <p className="font-semibold text-[#1d3b8b]">Une question ?</p>
              <p className="mt-2 leading-7">
                Pour toute demande liée aux données, au fonctionnement de la plateforme ou au relais juridique, vous pouvez nous écrire.
              </p>
              <Link
                href="/contact"
                onClick={() => track("Legal Contact CTA Clicked", { cta: "Contacter LEXPAT", location: "legal-sidebar" })}
                className="mt-4 inline-flex font-semibold text-[#1d3b8b] transition hover:text-[#57b7af]"
              >
                Contacter LEXPAT
              </Link>
            </div>
          </aside>

          <div className="space-y-6">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-[30px] border border-[#e4edf4] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
                  {section.eyebrow || "Section"}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#1d3b8b] sm:text-[1.9rem]">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[#5c6e84]">
                  {renderBody(section.body)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
