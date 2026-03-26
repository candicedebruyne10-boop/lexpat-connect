import Link from "next/link";

export function Hero({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  note,
  stats = [],
  panels = []
}) {
  return (
    <section className="pb-8 pt-8 sm:pb-12 lg:pb-16 lg:pt-12">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[36px] bg-hero px-6 py-8 text-white shadow-card sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_30%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-end">
            <div>
              <p className="eyebrow">{badge}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                {description}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={primaryHref} className="primary-button bg-white text-brand-900 hover:bg-brand-50">
                  {primaryLabel}
                </Link>
                <Link href={secondaryHref} className="secondary-button border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/16">
                  {secondaryLabel}
                </Link>
              </div>
              {note ? <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68">{note}</p> : null}
              {stats.length ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/14 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-2xl font-semibold text-white">{item.value}</p>
                      <p className="mt-1 text-sm leading-6 text-white/68">{item.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {panels.length ? (
              <div className="grid gap-4">
                {panels.map((panel) => (
                  <article key={panel.title} className="rounded-[28px] border border-white/14 bg-white/10 p-5 backdrop-blur-md">
                    <p className="eyebrow !border-0 !bg-white/12 !px-0 !py-0 text-white/62">{panel.kicker}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{panel.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/74">{panel.text}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Section({ title, intro, children, muted = false, kicker }) {
  return (
    <section className={muted ? "py-10 sm:py-14 lg:py-16" : "py-10 sm:py-14 lg:py-20"}>
      <div className="container-shell">
        <div className={muted ? "rounded-[32px] border border-slate-200/80 bg-white/65 p-6 shadow-soft sm:p-8 lg:p-10" : ""}>
          <div className="mb-8 lg:mb-10">
            {kicker ? <p className="eyebrow-light">{kicker}</p> : null}
            <h2 className="section-title mt-3">{title}</h2>
            {intro ? <p className="section-copy">{intro}</p> : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function CardGrid({ items, columns = 3 }) {
  const cols = columns === 2 ? "lg:grid-cols-2" : columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className={`grid gap-5 ${cols}`}>
      {items.map((item) => (
        <article key={item.title} className="surface-card h-full p-6 sm:p-7">
          {item.kicker ? <p className="eyebrow-light">{item.kicker}</p> : null}
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate">{item.text}</p>
          {item.link ? (
            <Link href={item.link.href} className="ghost-link mt-5 inline-flex">
              {item.link.label}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {items.map((item, index) => (
        <article key={item.title} className="surface-card p-6 sm:p-7">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-sm font-semibold text-brand-800">
            0{index + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.title} className="muted-card p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-3.5 w-3.5 rounded-full bg-brand-700" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate">{item.text}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Faq({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <details key={item.question} className="surface-card group p-6 sm:p-7">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-lg font-semibold tracking-tight text-ink">
            <span>{item.question}</span>
            <span className="mt-1 text-brand-700 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FormCard({ title, intro, fields, buttonLabel }) {
  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow-light">Formulaire</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate">{intro}</p>
      </div>
      <form className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className={field.wide ? "md:col-span-2" : ""}>
            <span className="mb-2 block text-sm font-semibold text-ink">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea className="field-input min-h-32" placeholder={field.placeholder} rows="5" />
            ) : field.type === "select" ? (
              <select className="field-input" defaultValue="">
                <option value="" disabled>
                  {field.placeholder}
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input className="field-input" type={field.type || "text"} placeholder={field.placeholder} />
            )}
          </label>
        ))}
        <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate">
            Cette version sert de socle de présentation. Le branchement technique des formulaires peut être ajouté ensuite sans changer l'expérience utilisateur.
          </p>
          <button type="button" className="primary-button">
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CtaBanner({
  title,
  text,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}) {
  return (
    <section className="py-10 sm:py-14 lg:py-18">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[32px] border border-brand-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_45%,#eff6ff_100%)] p-6 shadow-card sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <p className="eyebrow-light">Passerelle LEXPAT</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate">{text}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link href={primaryHref} className="primary-button w-full justify-center lg:w-auto">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="secondary-button w-full justify-center lg:w-auto">
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
