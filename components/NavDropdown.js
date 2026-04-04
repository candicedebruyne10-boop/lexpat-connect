"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

/**
 * NavDropdown — onglet nav avec sous-menu au survol (desktop) ou au clic (mobile)
 * Props:
 *   label     : string   — libellé de l'onglet principal
 *   href      : string   — lien de l'onglet principal
 *   items     : Array<{ href, label, description? }>
 *   mobile    : bool     — version mobile (chips scrollables)
 */
export default function NavDropdown({ label, href, items, mobile = false }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  function handleMouseEnter() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  /* ── Version mobile ────────────────────────────────────────────── */
  if (mobile) {
    return (
      <>
        {/* Chip principal cliquable */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex whitespace-nowrap items-center gap-1 rounded-full border border-[#e3eaf1] bg-white px-4 py-2 text-sm font-medium text-[#607086] transition hover:border-[#cde2df] hover:text-[#57b7af]"
        >
          {label}
          <svg
            className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Sous-chips affichés en ligne si ouvert */}
        {open &&
          items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="whitespace-nowrap rounded-full border border-[#cde2df] bg-[#f0faf9] px-4 py-2 text-sm font-medium text-[#57b7af] transition hover:border-[#57b7af] hover:text-[#1d3b8b]"
            >
              {item.label}
            </Link>
          ))}
      </>
    );
  }

  /* ── Version desktop ───────────────────────────────────────────── */
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Lien principal + chevron */}
      <Link
        href={href}
        className="flex items-center gap-1 whitespace-nowrap transition hover:text-[#1d3b8b]"
      >
        {label}
        <svg
          className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Panneau dropdown */}
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-[20px] border border-[#e3eaf1] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)] overflow-hidden">
          {/* Lien vers la page principale */}
          <Link
            href={href}
            className="flex items-start gap-3 px-5 py-4 transition hover:bg-[#f7fbfb] group"
            onClick={() => setOpen(false)}
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf4f3] text-[#57b7af] group-hover:bg-[#57b7af] group-hover:text-white transition">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[#1d3b8b]">Guide permis unique</p>
              <p className="mt-0.5 text-[12px] leading-5 text-[#8a9bb0]">Conditions, procédure, types de permis</p>
            </div>
          </Link>

          <div className="mx-4 border-t border-[#edf1f5]" />

          {/* Sous-pages */}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 px-5 py-4 transition hover:bg-[#f7fbfb] group"
              onClick={() => setOpen(false)}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf4f3] text-[#57b7af] group-hover:bg-[#57b7af] group-hover:text-white transition">
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                  <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 3v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[#1d3b8b]">{item.label}</p>
                {item.description && (
                  <p className="mt-0.5 text-[12px] leading-5 text-[#8a9bb0]">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
