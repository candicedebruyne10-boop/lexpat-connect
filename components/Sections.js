import Link from "next/link";

export function Hero({
  badge,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  note
}) {
  return (
    <section className="hero">
      <div className="container hero-card">
        <p className="eyebrow">{badge}</p>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
        <div className="cta-row">
          <Link href={primaryHref} className="button button-primary">
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="button button-secondary">
            {secondaryLabel}
          </Link>
        </div>
        {note ? <p className="hero-note">{note}</p> : null}
      </div>
    </section>
  );
}

export function Section({ title, intro, children, muted = false }) {
  return (
    <section className={muted ? "section section-muted" : "section"}>
      <div className="container">
        <div className="section-heading">
          <h2>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function CardGrid({ items, columns = 3 }) {
  return (
    <div className={"grid grid-" + columns}>
      {items.map((item) => (
        <article key={item.title} className="card">
          {item.kicker ? <p className="card-kicker">{item.kicker}</p> : null}
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          {item.link ? (
            <Link href={item.link.href} className="text-link">
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
    <div className="steps">
      {items.map((item, index) => (
        <article key={item.title} className="step-card">
          <div className="step-number">0{index + 1}</div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <div className="bullet-list">
      {items.map((item) => (
        <div key={item.title} className="bullet-item">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question} className="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FormCard({ title, intro, fields, buttonLabel }) {
  return (
    <div className="form-card">
      <div className="section-heading compact">
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <form className="form-grid">
        {fields.map((field) => (
          <label
            key={field.label}
            className={field.wide ? "field field-wide" : "field"}
          >
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea placeholder={field.placeholder} rows="5" />
            ) : field.type === "select" ? (
              <select defaultValue="">
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
              <input type={field.type || "text"} placeholder={field.placeholder} />
            )}
          </label>
        ))}
        <button type="button" className="button button-primary form-button">
          {buttonLabel}
        </button>
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
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div>
            <p className="eyebrow">Passerelle LEXPAT</p>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-row">
            <Link href={primaryHref} className="button button-primary">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="button button-secondary">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
