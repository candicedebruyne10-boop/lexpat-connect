"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { detectLocaleFromPathname, localizeHref, siteCopy } from '../lib/i18n';

export default function NavAuth() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPathname(pathname);
  const copy = siteCopy[locale];

  async function handleSignOut() {
    await signOut();
    router.push(localizeHref('/', locale));
    router.refresh();
  }

  // Pendant le chargement initial — placeholder invisible pour éviter le flash
  if (loading) {
    return <div className="hidden h-10 w-48 lg:block" />;
  }

  // Utilisateur connecté
  if (user) {
    const role      = user.user_metadata?.role || 'worker';
    const spacePath = localizeHref(role === 'employer' ? '/employeurs/espace' : '/travailleurs/espace', locale);
    const spaceLabel = role === 'employer' ? copy.auth.employerSpace : copy.auth.workerSpace;
    const fullName  = user.user_metadata?.full_name || '';
    const parts     = fullName.trim().split(' ').filter(Boolean);
    const initials  = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] || user.email?.[0] || '?').toUpperCase();

    return (
      <div className="hidden items-center gap-1.5 lg:flex">
        {/* Lien vers l'espace */}
        <Link
          href={spacePath}
          className="whitespace-nowrap rounded-full border border-[#d9e9f1] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1d3b8b] shadow-[0_4px_10px_rgba(15,23,42,0.03)] transition hover:border-[#b8cef5] hover:text-[#1d3b8b]"
        >
          {spaceLabel}
        </Link>

        {/* Déconnexion */}
        <button
          onClick={handleSignOut}
          className="whitespace-nowrap rounded-full border border-[#e8edf3] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#6d7b8d] shadow-[0_4px_10px_rgba(15,23,42,0.03)] transition hover:border-[#f2c4c4] hover:text-[#a33f3f]"
        >
          {copy.auth.signOut}
        </button>
      </div>
    );
  }

  // Utilisateur non connecté
  return (
    <div className="hidden items-center gap-1.5 lg:flex">
      <Link
        href={localizeHref("/connexion", locale)}
        className="inline-flex items-center rounded-full border border-[#d9e9f1] bg-white px-4 py-2 text-[12px] font-semibold text-[#1d3b8b] shadow-[0_4px_10px_rgba(15,23,42,0.03)] transition hover:border-[#b8cef5] hover:text-[#1d3b8b]"
      >
        {copy.auth.signIn}
      </Link>
      <Link
        href={localizeHref("/inscription", locale)}
        className="inline-flex items-center rounded-full px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(87,183,175,0.18)] transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(87,183,175,0.24)]"
        style={{ background: "linear-gradient(135deg, #6fc1b8, #57B7AF)" }}
      >
        {locale === "en" ? "Create account" : copy.auth.createAccount}
      </Link>
    </div>
  );
}

/* Version mobile du bouton auth */
export function NavAuthMobile() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPathname(pathname);
  const copy = siteCopy[locale];

  async function handleSignOut() {
    await signOut();
    router.push(localizeHref('/', locale));
    router.refresh();
  }

  if (loading) return null;

  if (user) {
    const role      = user.user_metadata?.role || 'worker';
    const spacePath = localizeHref(role === 'employer' ? '/employeurs/espace' : '/travailleurs/espace', locale);
    const fullName  = user.user_metadata?.full_name || '';
    const parts     = fullName.trim().split(' ').filter(Boolean);
    const initials  = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] || user.email?.[0] || '?').toUpperCase();

    return (
      <div className="flex items-center gap-2">
        <Link
          href={spacePath}
          className="flex items-center gap-2 rounded-2xl border border-[#d9e9f1] bg-white px-3 py-2 text-sm font-semibold text-[#1d3b8b] shadow-sm"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d3b8b,#57b7af)] text-[10px] font-bold text-white">
            {initials}
          </span>
          <span className="max-w-[80px] truncate">{copy.auth.mobileSpace}</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-2xl border border-[#e8edf3] bg-white px-3 py-2 text-xs font-medium text-[#6d7b8d]"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <Link
      href={localizeHref("/connexion", locale)}
      className="inline-flex items-center rounded-full border border-[#d9e9f1] bg-white px-3 py-2 text-xs font-semibold text-[#1d3b8b] shadow-sm"
    >
      {copy.auth.signIn}
    </Link>
  );
}
