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
    <section className="pb-10 pt-8 sm:pb-14 lg:pb-20 lg:pt-12">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[36px] border border-[#dfe9ee] bg-white px-6 py-10 shadow-[0_20px_70px_rgba(30,52,94,0.08)] sm:px-8 lg:px-12 lg:py-16">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(103,190,182,0.16),transparent_62%)]" />
          <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#60b8b1] to-transparent" />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="inline-flex items-center justify-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#255c8f]">
              {badge}
            </p>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#1d3b8b] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#50627a] sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={primaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2] sm:w-auto">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#d4dff2] bg-white px-7 py-4 text-base font-semibold text-[#1d3b8b] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] sm:w-auto">
                {secondaryLabel}
              </Link>
            </div>

            {note ? <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#6b7b8f]">{note}</p> : null}

            {stats.length ? (
              <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-[#e5edf4] bg-[#fbfdff] px-5 py-5 text-left">
                    <p className="text-xl font-semibold text-[#1d3b8b]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#66768b]">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {panels.length ? (
            <div className="relative mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-2">
              {panels.map((panel) => (
                <article key={panel.title} className="rounded-[28px] border border-[#e2ebf3] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 text-left shadow-[0_12px_30px_rgba(24,53,101,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">{panel.kicker}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#1d3b8b]">{panel.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5c6e84]">{panel.text}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Section({ title, intro, children, muted = false, kicker }) {
  return (
    <section className={muted ? "py-10 sm:py-14 lg:py-16" : "py-10 sm:py-14 lg:py-20"}>
      <div className="container-shell">
        <div className={muted ? "rounded-[36px] border border-[#e7eef4] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10" : ""}>
          <div className="mx-auto mb-8 max-w-4xl text-center lg:mb-12">
            {kicker ? (
              <p className="inline-flex items-center justify-center rounded-full border border-[#d7e8e6] bg-[#f7fbfb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
                {kicker}
              </p>
            ) : null}
            <h2 className="section-title mx-auto mt-4">{title}</h2>
            {intro ? <p className="section-copy mx-auto">{intro}</p> : null}
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
        <article key={item.title} className="h-full rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
          {item.kicker ? (
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              {item.kicker}
            </p>
          ) : null}
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
          {item.link ? (
            <Link href={item.link.href} className="mt-5 inline-flex text-sm font-semibold text-[#1d3b8b] transition hover:text-[#57b7af]">
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
        <article key={item.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2fbfa] text-sm font-semibold text-[#57b7af]">
            0{index + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.title} className="rounded-[28px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-3.5 w-3.5 rounded-full bg-[#57b7af]" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{item.text}</p>
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
        <details key={item.question} className="group rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-7">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-lg font-semibold tracking-tight text-[#1d3b8b]">
            <span>{item.question}</span>
            <span className="mt-1 text-[#57b7af] transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#5d6e83]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FormCard({ title, intro, fields, buttonLabel }) {
  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          Formulaire
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d3b8b] sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">{intro}</p>
      </div>
      <form className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className={field.wide ? "md:col-span-2" : ""}>
            <span className="mb-2 block text-sm font-semibold text-[#1f2d3d]">{field.label}</span>
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
          <p className="max-w-2xl text-sm leading-7 text-[#66768b]">
            Cette version sert de socle de présentation. Le branchement technique des formulaires peut être ajouté ensuite sans changer l'expérience utilisateur.
          </p>
          <button type="button" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.28)] transition hover:bg-[#4aa9a2]">
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
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[36px] border border-[#dce8ee] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl text-center">
            <p className="inline-flex rounded-full bg-[#f2fbfa] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
              Passerelle LEXPAT
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#1d3b8b] sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#5d6e83]">{text}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={primaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#57b7af] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(87,183,175,0.24)] transition hover:bg-[#4aa9a2] sm:w-auto">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#d4dff2] bg-white px-7 py-4 text-base font-semibold text-[#1d3b8b] transition hover:border-[#9cb2da] hover:bg-[#f8fbff] sm:w-auto">
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
