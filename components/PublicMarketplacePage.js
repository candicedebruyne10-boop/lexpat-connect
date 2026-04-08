import Link from "next/link";

const toneClasses = {
  blue: "bg-[#eef1fb] text-[#1d3b8b] border-[#c5d4f3]",
  teal: "bg-[#eaf4f3] text-[#2b8f88] border-[#cde2df]",
  amber: "bg-[#fff7e8] text-[#c48014] border-[#f7e2b8]"
};

const kindConfig = {
  fr: {
    offers: {
      summaryCards: [
        { key: "total", label: "Offres visibles", tone: "blue" },
        { key: "sectors", label: "Secteurs représentés", tone: "teal" },
        { key: "regions", label: "Régions couvertes", tone: "amber" }
      ],
      ctaTitle: "Envie d'aller plus loin ?",
      ctaText: "Créez votre espace membre pour postuler, suivre les échanges et débloquer la mise en relation.",
      emptyTitle: "Aucune offre visible pour le moment.",
      emptyBody: "Les nouvelles opportunités publiées apparaîtront ici."
    },
    applications: {
      summaryCards: [
        { key: "total", label: "Profils visibles", tone: "blue" },
        { key: "sectors", label: "Secteurs représentés", tone: "teal" },
        { key: "regions", label: "Régions couvertes", tone: "amber" }
      ],
      ctaTitle: "Prêt à recruter ?",
      ctaText: "Déposez une offre ou créez votre espace membre pour débloquer les mises en relation et la messagerie.",
      emptyTitle: "Aucune candidature visible pour le moment.",
      emptyBody: "Les profils actifs apparaîtront ici dès qu'ils seront publiés."
    }
  },
  en: {
    offers: {
      summaryCards: [
        { key: "total", label: "Visible openings", tone: "blue" },
        { key: "sectors", label: "Represented sectors", tone: "teal" },
        { key: "regions", label: "Covered regions", tone: "amber" }
      ],
      ctaTitle: "Want to go further?",
      ctaText: "Create your member account to apply, continue the conversation and unlock the full matching flow.",
      emptyTitle: "No opening is visible at the moment.",
      emptyBody: "New published opportunities will appear here."
    },
    applications: {
      summaryCards: [
        { key: "total", label: "Visible profiles", tone: "blue" },
        { key: "sectors", label: "Represented sectors", tone: "teal" },
        { key: "regions", label: "Covered regions", tone: "amber" }
      ],
      ctaTitle: "Ready to recruit?",
      ctaText: "Post an opening or create your member account to unlock introductions and messaging.",
      emptyTitle: "No application is visible at the moment.",
      emptyBody: "Active profiles will appear here once published."
    }
  }
};

const cardCopy = {
  fr: {
    offers: {
      labelA: "Entreprise",
      labelB: "Région",
      labelC: "Contrat",
      labelD: "Urgence",
      action: "Créer un compte pour postuler"
    },
    applications: {
      protected: "Identité protégée",
      labelA: "Région",
      labelB: "Expérience",
      labelC: "Langues",
      labelD: "Cible visible",
      action: "Déposer une offre pour contacter"
    }
  },
  en: {
    offers: {
      labelA: "Employer",
      labelB: "Region",
      labelC: "Contract",
      labelD: "Urgency",
      action: "Create an account to apply"
    },
    applications: {
      protected: "Protected identity",
      labelA: "Region",
      labelB: "Experience",
      labelC: "Languages",
      labelD: "Visible target",
      action: "Post an opening to connect"
    }
  }
};

function SectorBadge({ text }) {
  return (
    <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold text-[#1d3b8b]">
      {text}
    </span>
  );
}

function MetaBlock({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa7b8]">{label}</span>
      <span className="text-sm font-medium text-[#415164]">{value}</span>
    </div>
  );
}

function PublicOfferCard({ row, locale, primaryCtaHref, primaryCtaLabel }) {
  const copy = cardCopy[locale].offers;
  return (
    <article className="flex h-full flex-col gap-5 rounded-[28px] border border-[#e3eaf1] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition hover:border-[#c5d4f3] hover:shadow-[0_12px_36px_rgba(29,59,139,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57b7af]">{row.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">{row.title}</h2>
        </div>
        <SectorBadge text={row.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetaBlock label={copy.labelA} value={row.companyName} />
        <MetaBlock label={copy.labelB} value={row.region} />
        <MetaBlock label={copy.labelC} value={row.contractType} />
        <MetaBlock label={copy.labelD} value={row.urgency} />
      </div>

      <div className="mt-auto rounded-[22px] border border-[#d8efe9] bg-[#f4fbf8] px-4 py-3 text-sm text-[#4c6a67]">
        {copy.action}
      </div>

      <Link href={primaryCtaHref} className="inline-flex items-center justify-center rounded-2xl bg-[#1d3b8b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#163175]">
        {primaryCtaLabel}
      </Link>
    </article>
  );
}

function PublicApplicationCard({ row, locale, primaryCtaHref, primaryCtaLabel }) {
  const copy = cardCopy[locale].applications;
  return (
    <article className="flex h-full flex-col gap-5 rounded-[28px] border border-[#e3eaf1] bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition hover:border-[#c5d4f3] hover:shadow-[0_12px_36px_rgba(29,59,139,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#eef1fb,#eaf4f3)] text-lg font-bold text-[#1d3b8b] shadow-inner">
          ?
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-2.5 w-20 rounded-full bg-[#dce7f5] opacity-70" />
            <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a9bb0]">
              {copy.protected}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57b7af]">{row.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1d3b8b]">{row.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetaBlock label={copy.labelA} value={row.region} />
        <MetaBlock label={copy.labelB} value={row.experience} />
        <MetaBlock label={copy.labelD} value={row.targetOffer} />
        <MetaBlock label={copy.labelC} value={row.languages.join(", ") || "—"} />
      </div>

      <div className="rounded-[22px] border border-[#d8efe9] bg-[#f4fbf8] px-4 py-3 text-sm text-[#4c6a67]">
        {row.status} — {copy.action.toLowerCase()}
      </div>

      <Link href={primaryCtaHref} className="inline-flex items-center justify-center rounded-2xl bg-[#1d3b8b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#163175]">
        {primaryCtaLabel}
      </Link>
    </article>
  );
}

export default function PublicMarketplacePage({
  locale = "fr",
  kind,
  title,
  intro,
  kicker,
  summary,
  rows,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel
}) {
  const copy = kindConfig[locale][kind];
  const limit = 8;
  const visibleRows = rows.slice(0, limit);

  return (
    <div className="container-shell py-12 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57b7af]">{kicker}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1d3b8b] lg:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-8 text-[#607086]">{intro}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {copy.summaryCards.map(({ key, label, tone }) => (
          <div key={key} className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${toneClasses[tone]}`}>
            <span className="text-2xl font-extrabold">{summary[key] ?? 0}</span>
            <span className="text-[13px] font-medium opacity-80">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#c5d4f3] bg-[linear-gradient(135deg,#eef1fb,#f7fbfb)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-semibold text-[#1d3b8b]">{copy.ctaTitle}</p>
          <p className="mt-1 text-sm leading-6 text-[#607086]">{copy.ctaText}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primaryCtaHref} className="inline-flex items-center justify-center rounded-2xl bg-[#1d3b8b] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(29,59,139,0.22)] transition hover:bg-[#163175]">
            {primaryCtaLabel}
          </Link>
          <Link href={secondaryCtaHref} className="inline-flex items-center justify-center rounded-2xl border border-[#c5d4f3] bg-white px-6 py-3 text-sm font-bold text-[#1d3b8b] transition hover:border-[#9cb3e8] hover:bg-[#f8fbff]">
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      {!visibleRows.length ? (
        <div className="mt-10 rounded-2xl border border-[#e3eaf1] bg-white p-12 text-center text-[#8a9bb0]">
          <p className="text-base font-medium">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm">{copy.emptyBody}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleRows.map((row) =>
            kind === "offers" ? (
              <PublicOfferCard
                key={row.id}
                row={row}
                locale={locale}
                primaryCtaHref={primaryCtaHref}
                primaryCtaLabel={primaryCtaLabel}
              />
            ) : (
              <PublicApplicationCard
                key={row.id}
                row={row}
                locale={locale}
                primaryCtaHref={primaryCtaHref}
                primaryCtaLabel={primaryCtaLabel}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
