"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '../lib/supabase/client';

const roleOptions = [
  {
    value: 'worker',
    label: 'Travailleur',
    description: 'Créer un profil, compléter son CV et suivre sa visibilité.'
  },
  {
    value: 'employer',
    label: 'Employeur',
    description: 'Structurer son entreprise, ses offres et ses besoins de recrutement.'
  }
];

export default function AuthForm({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  const [role, setRole] = useState('worker');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = new URLSearchParams(window.location.search).get('next') || '';
    setNextPath(next);
  }, []);

  function getSafeRedirect(fallback) {
    const next = nextPath;
    if (!next || !next.startsWith('/')) {
      return fallback;
    }
    return next;
  }

  async function bootstrapUser(session, bootstrapRole) {
    const response = await fetch('/api/auth/bootstrap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        role: bootstrapRole,
        fullName,
        companyName,
        email
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Impossible de préparer votre espace.');
    }

    return payload.redirectTo;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase n’est pas encore configuré dans cet environnement.');
      }

      if (isSignup) {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              full_name: fullName,
              company_name: companyName
            }
          }
        });

        if (signupError) {
          throw signupError;
        }

        if (data.session) {
          const redirectTo = await bootstrapUser(data.session, role);
          const target = getSafeRedirect(redirectTo);
          router.push(target);
          router.refresh();
          return;
        }

        setMessage('Votre compte a été créé. Vérifiez votre boîte mail puis connectez-vous pour accéder à votre espace.');
        return;
      }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        throw loginError;
      }

      const detectedRole = data.user?.user_metadata?.role || 'worker';
      const redirectTo = await bootstrapUser(data.session, detectedRole);
      const target = getSafeRedirect(redirectTo);
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          {isSignup ? 'Inscription' : 'Connexion'}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">
          {isSignup ? 'Créer votre accès LEXPAT Connect' : 'Se connecter à LEXPAT Connect'}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
          {isSignup
            ? 'Choisissez votre parcours et créez votre accès pour préparer votre espace candidat ou employeur.'
            : 'Accédez à votre espace pour retrouver votre profil, vos offres et vos informations enregistrées.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        {isSignup ? (
          <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">Je m’inscris en tant que</span>
            <div className="grid gap-3 md:grid-cols-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`rounded-[22px] border p-4 text-left transition ${
                    role === option.value
                      ? 'border-[#9fcfca] bg-[#f2fbfa] shadow-[inset_0_0_0_1px_rgba(87,183,175,0.2)]'
                      : 'border-[#e5edf4] bg-white hover:border-[#cfe0ed]'
                  }`}
                >
                  <p className="text-base font-semibold text-[#1d3b8b]">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#607086]">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isSignup ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">
              {role === 'worker' ? 'Nom complet' : 'Nom du contact'}
            </span>
            <input className="field-input" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={role === 'worker' ? 'Prénom Nom' : 'Prénom Nom'} />
          </label>
        ) : null}

        {isSignup && role === 'employer' ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">Entreprise</span>
            <input className="field-input" value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Nom de l'entreprise" />
          </label>
        ) : null}

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Email</span>
          <input className="field-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="votre.email@example.com" required />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Mot de passe</span>
          <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 caractères" required />
        </label>

        {(error || message) ? (
          <div className={`md:col-span-2 rounded-[20px] border px-4 py-4 text-sm leading-6 ${error ? 'border-[#f2c4c4] bg-[#fff5f5] text-[#a33f3f]' : 'border-[#dcebe8] bg-[#f5fbfb] text-[#33566b]'}`}>
            {error || message}
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button disabled={loading} className="primary-button disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Chargement...' : isSignup ? 'Créer mon compte' : 'Se connecter'}
          </button>
          <p className="text-sm text-[#607086]">
            {isSignup ? 'Vous avez déjà un compte ? ' : 'Vous n’avez pas encore de compte ? '}
            <Link href={isSignup ? '/connexion' : '/inscription'} className="font-semibold text-[#1d3b8b] hover:text-[#57b7af]">
              {isSignup ? 'Se connecter' : 'Créer un compte'}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
