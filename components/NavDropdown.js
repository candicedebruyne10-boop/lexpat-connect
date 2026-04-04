"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

/**
 * Palettes couleur par audience
 * blue   → Employeurs
 * teal   → Travailleurs
 * slate  → Immigration (neutre)
 */
const palette = {
  blue: {
    dot:        'bg-[#1d3b8b]',
    navText:    'text-[#1E3A78]',
    navHover:   'hover:text-[#1E3A78]',
    stripe:     'bg-[#1d3b8b]',
    iconBg:     'bg-[#eef1fb]',
    iconColor:  'text-[#1E3A78]',
    iconHoverBg:'group-hover:bg-[#1d3b8b]',
    itemHoverBg:'hover:bg-[#f5f7fd]',
    subChip:    'border-[#c5d4f3] bg-[#f0f4fd] text-[#1E3A78] hover:border-[#1d3b8b]',
  },
  teal: {
    dot:        'bg-[#57b7af]',
    navText:    'text-[#57b7af]',
    navHover:   'hover:text-[#57b7af]',
    stripe:     'bg-[#57b7af]',
    iconBg:     'bg-[#eaf4f3]',
    iconColor:  'text-[#57B7AF]',
    iconHoverBg:'group-hover:bg-[#57b7af]',
    itemHoverBg:'hover:bg-[#f4fbfa]',
    subChip:    'border-[#cde2df] bg-[#f0faf9] text-[#57b7af] hover:border-[#57b7af]',
  },
  slate: {
    dot:        'bg-[#8a9bb0]',
    navText:    'text-[#607086]',
    navHover:   'hover:text-[#1E3A78]',
    stripe:     'bg-[#8a9bb0]',
    iconBg:     'bg-[#f0f4f8]',
    iconColor:  'text-[#607086]',
    iconHoverBg:'group-hover:bg-[#607086]',
    itemHoverBg:'hover:bg-[#f7f9fb]',
    subChip:    'border-[#e3eaf1] bg-white text-[#607086] hover:border-[#8a9bb0]',
  },
};

/* ─── Icônes intégrées ────────────────────────────────────────────── */
const icons = {
  arrow:  <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  star:   <path d="M8 2l1.5 4H14l-3.5 2.5 1.5 4L8 10l-4 2.5 1.5-4L2 6h4.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />,
  search: <><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
  doc:    <path d="M4 2h5l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1zm5 0v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  pin:    <><path d="M8 2a4 4 0 014 4c0 2.5-4 8-4 8S4 8.5 4 6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/></>,
  globe:  <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M2 8h12M8 2c-2 2-2 8 0 12M8 2c2 2 2 8 0 12" stroke="currentColor" strokeWidth="1.3"/></>,
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      {icons[name] || icons.arrow}
    </svg>
  );
}

/**
 * NavDropdown
 * Props:
 *   label   : string
 *   href    : string
 *   items   : Array<{ href, label, description?, icon? }>
 *   color   : 'blue' | 'teal' | 'slate'
 *   mobile  : bool
 */
export default function NavDropdown({ label, href, items, color = 'slate', mobile = false }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const p = palette[color] ?? palette.slate;

  function openMenu()  { clearTimeout(closeTimer.current); setOpen(true); }
  function closeMenu() { closeTimer.current = setTimeout(() => setOpen(false), 160); }

  /* ── MOBILE ──────────────────────────────────────────────────────── */
  if (mobile) {
    return (
      <>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition
            ${open
              ? `border-current ${p.navText} bg-white`
              : `border-[#e3eaf1] bg-white text-[#607086] ${p.navHover}`
            }`}
        >
          {/* Indicateur couleur */}
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${p.dot}`} />
          {label}
          <svg className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${p.subChip}`}
          >
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  /* ── DESKTOP ─────────────────────────────────────────────────────── */
  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      {/* Onglet nav */}
      <button
        className={`flex items-center gap-1.5 whitespace-nowrap font-medium transition ${open ? p.navText : `text-[#607086] ${p.navHover}`}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${p.dot}`} />
        {label}
        <svg className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Panneau dropdown */}
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-[20px] border border-[#e3eaf1] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.12)]">
          {/* Bande couleur en haut */}
          <div className={`h-1 w-full ${p.stripe}`} />

          {items.map((item, i) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-start gap-3 px-5 py-4 transition group ${p.itemHoverBg}`}
                onClick={() => setOpen(false)}
              >
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition
                  ${p.iconBg} ${p.iconColor} ${p.iconHoverBg} group-hover:text-white`}>
                  <NavIcon name={item.icon || (i === 0 ? 'arrow' : 'star')} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1E3A78]">{item.label}</p>
                  {item.description && (
                    <p className="mt-0.5 text-[12px] leading-5 text-[#8a9bb0]">{item.description}</p>
                  )}
                </div>
              </Link>
              {i < items.length - 1 && <div className="mx-4 border-t border-[#edf1f5]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
