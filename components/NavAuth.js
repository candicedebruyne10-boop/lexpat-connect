"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function NavAuth() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  // Pendant le chargement initial — placeholder invisible pour éviter le flash
  if (loading) {
    return <div className="hidden h-10 w-48 lg:block" />;
  }

  // Utilisateur connecté
  if (user) {
    const role      = user.user_metadata?.role || 'worker';
    const spacePath = role === 'employer' ? '/employeurs/espace' : '/travailleurs/espace';
    const fullName  = user.user_metadata?.full_name || '';
    const parts     = fullName.trim().split(' ').filter(Boolean);
    const firstName = parts[0] || '';
    const initials  = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] || user.email?.[0] || '?').toUpperCase();

    return (
      <div className="hidden items-center gap-2 lg:flex">
        {/* Lien vers l'espace */}
        <Link
          href={spacePath}
          className="flex items-center gap-2 rounded-2xl border border-[#d9e9f1] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#1d3b8b] shadow-[0_4px_12px_rgba(29,59,139,0.08)] transition hover:shadow-[0_6px_18px_rgba(29,59,139,0.13)] hover:-translate-y-px"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d3b8b,#57b7af)] text-[11px] font-bold text-white">
            {initials}
          </span>
          <span className="max-w-[90px] truncate">{firstName || 'Mon espace'}</span>
          {firstName && <><span className="text-[#9db5c8]">·</span><span className="whitespace-nowrap text-[#57b7af]">Mon espace</span></>}
        </Link>

        {/* Déconnexion */}
        <button
          onClick={handleSignOut}
          className="whitespace-nowrap rounded-2xl border border-[#e8edf3] bg-white px-3.5 py-2 text-[13px] font-medium text-[#6d7b8d] transition hover:border-[#f2c4c4] hover:text-[#a33f3f]"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  // Utilisateur non connecté
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Link href="/connexion" className="secondary-button">
        Se connecter
      </Link>
      <Link href="/inscription" className="primary-button">
        Créer un compte
      </Link>
    </div>
  );
}

/* Version mobile du bouton auth */
export function NavAuthMobile() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) return null;

  if (user) {
    const role      = user.user_metadata?.role || 'worker';
    const spacePath = role === 'employer' ? '/employeurs/espace' : '/travailleurs/espace';
    const fullName  = user.user_metadata?.full_name || '';
    const parts     = fullName.trim().split(' ').filter(Boolean);
    const firstName = parts[0] || '';
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
          <span className="max-w-[80px] truncate">{firstName || 'Espace'}</span>
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
    <Link href="/connexion" className="secondary-button">
      Connexion
    </Link>
  );
}
