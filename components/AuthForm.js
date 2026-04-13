"use client";

import Link from 'next/link';
import { track } from '@vercel/analytics';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '../lib/supabase/client';
import { localizeHref } from '../lib/i18n';
import ReferralInput from './ReferralInput';

// ── Helpers parrainage ───────────────────────────────────────────────────────

const REFERRAL_COOKIE = 'lexpat_ref';
const REFERRAL_LS_KEY = 'lexpat_ref';
const REFERRAL_TTL_DAYS = 30;

function readReferralFromStorage() {
  if (typeof window === 'undefined') return null;
  // 1. Cookie (prioritaire)
  const cookieMatch = document.cookie.match(new RegExp(`(?:^|;\\s*)${REFERRAL_COOKIE}=([^;]+)`));
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  // 2. localStorage
  try {
    const raw = localStorage.getItem(REFERRAL_LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.code && parsed.ts && Date.now() - parsed.ts < REFERRAL_TTL_DAYS * 86400 * 1000) {
        return parsed.code;
      }
    }
  } catch {}
  return null;
}

function writeReferralToStorage(code) {
  if (typeof window === 'undefined' || !code) return;
  const maxAge = REFERRAL_TTL_DAYS * 86400;
  document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(code)}; max-age=${maxAge}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(REFERRAL_LS_KEY, JSON.stringify({ code, ts: Date.now() }));
  } catch {}
}

// ────────────────────────────────────────────────────────────────────────────

export default function AuthForm({ mode = 'login', locale = 'fr' }) {
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  // fullName calculé depuis prénom + nom
  const fullName = `${firstName} ${lastName}`.trim();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState('');
  // ── Parrainage ──────────────────────────────────────────────────────────────
  // referralCode : code détecté depuis cookie/URL → champ verrouillé
  const [referralCode, setReferralCode] = useState(null);
  // referralInput : saisie libre (code ou nom) si pas de lien automatique
  const [referralInput, setReferralInput] = useState('');
  // ───────────────────────────────────────────────────────────────────────────
  const roleOptions = locale === 'en'
    ? [
        {
          value: 'worker',
          label: 'Worker',
          description: 'Create a profile, complete your CV and track your visibility.'
        },
        {
          value: 'employer',
          label: 'Employer',
          description: 'Structure your company, your openings and your hiring needs.'
        }
      ]
    : [
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || '';
    setNextPath(next);

    // Messages entrants depuis d'autres pages
    const msg = params.get('message');
    const err = params.get('error');
    if (msg === 'compte_cree') {
      setMessage(locale === 'en' ? 'Your account has been created. Sign in now with your credentials.' : 'Votre compte a été créé. Connectez-vous maintenant avec vos identifiants.');
    }
    if (err === 'lien_invalide') {
      setError(locale === 'en' ? 'This confirmation link has expired or is invalid. Please sign in directly.' : 'Ce lien de confirmation a expiré ou est invalide. Connectez-vous directement.');
    }
    if (err === 'session_invalide' || err === 'session_manquante') {
      setError(locale === 'en' ? 'Session expired. Please sign in again.' : 'Session expirée. Veuillez vous reconnecter.');
    }

    // ── Parrainage : lecture du code depuis l'URL ou le stockage ──────────────
    if (isSignup) {
      const urlRef = params.get('ref');
      if (urlRef && /^LP-[A-Z0-9]{6}$/i.test(urlRef.trim())) {
        const normalized = urlRef.trim().toUpperCase();
        writeReferralToStorage(normalized);
        setReferralCode(normalized);
      } else {
        // Pas de ref dans l'URL → lire depuis cookie/localStorage
        const stored = readReferralFromStorage();
        if (stored && /^LP-[A-Z0-9]{6}$/.test(stored)) {
          setReferralCode(stored);
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────────────
  }, [locale, isSignup]);

  function getSafeRedirect(fallback) {
    const next = nextPath;
    if (!next || !next.startsWith('/')) {
      return fallback;
    }
    return next;
  }

  async function bootstrapUser(session, bootstrapRole) {
    // Préparer les données de parrainage
    // Priorité : code auto (lien) > saisie libre
    const referralPayload = referralCode
      ? { referral_code: referralCode }
      : referralInput?.trim()
        ? { referral_input: referralInput.trim() }
        : {};

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
        email,
        ...referralPayload
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || (locale === 'en' ? 'Unable to prepare your space.' : 'Impossible de préparer votre espace.'));
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
        throw new Error(locale === 'en' ? 'Supabase is not configured in this environment yet.' : 'Supabase n’est pas encore configuré dans cet environnement.');
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

        // Pas de session = email déjà utilisé ou confirmation requise
        // On redirige vers /connexion avec un message clair
        router.push(`${locale === 'en' ? '/en' : ''}/connexion?message=compte_cree`);
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
      setError(err.message || (locale === 'en' ? 'An error occurred.' : 'Une erreur est survenue.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[#e5edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          {isSignup ? (locale === 'en' ? 'Sign up' : 'Inscription') : (locale === 'en' ? 'Sign in' : 'Connexion')}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">
          {isSignup
            ? (locale === 'en' ? 'Create your LEXPAT Connect access' : 'Créer votre accès LEXPAT Connect')
            : (locale === 'en' ? 'Sign in to LEXPAT Connect' : 'Se connecter à LEXPAT Connect')}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#5d6e83]">
          {isSignup
            ? (locale === 'en'
              ? 'Choose your path and create your access to prepare your candidate or employer space.'
              : 'Choisissez votre parcours et créez votre accès pour préparer votre espace candidat ou employeur.')
            : (locale === 'en'
              ? 'Access your space to find your profile, your openings and your saved information.'
              : 'Accédez à votre espace pour retrouver votre profil, vos offres et vos informations enregistrées.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        {isSignup ? (
          <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">{locale === 'en' ? 'I am signing up as' : 'Je m’inscris en tant que'}</span>
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
          <>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{locale === 'en' ? 'First name' : 'Prénom'}</span>
              <input
                className="field-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={locale === 'en' ? 'First name' : 'Prénom'}
                required
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-[#17345d]">{locale === 'en' ? 'Last name' : 'Nom'}</span>
              <input
                className="field-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={locale === 'en' ? 'Last name' : 'Nom de famille'}
                required
              />
            </label>
          </>
        ) : null}

        {isSignup && role === 'employer' ? (
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#17345d]">{locale === 'en' ? 'Company' : 'Entreprise'}</span>
            <input className="field-input" value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder={locale === 'en' ? 'Company name' : "Nom de l'entreprise"} />
          </label>
        ) : null}

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">Email</span>
          <input
            className="field-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={locale === 'en' ? 'your.email@example.com' : 'votre.email@example.com'}
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[#17345d]">{locale === 'en' ? 'Password' : 'Mot de passe'}</span>
          <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={locale === 'en' ? 'Minimum 6 characters' : 'Minimum 6 caractères'} required />
        </label>

        {/* Champ parrainage — visible uniquement à l'inscription, rôle travailleur */}
        {isSignup && role === 'worker' ? (
          <ReferralInput
            referralCode={referralCode}
            value={referralInput}
            onChange={setReferralInput}
            locale={locale}
          />
        ) : null}

        {(error || message) ? (
          <div className={`md:col-span-2 rounded-[20px] border px-4 py-4 text-sm leading-6 ${error ? 'border-[#f2c4c4] bg-[#fff5f5] text-[#a33f3f]' : 'border-[#dcebe8] bg-[#f5fbfb] text-[#33566b]'}`}>
            {error || message}
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button disabled={loading} className="primary-button disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? (locale === 'en' ? 'Loading...' : 'Chargement...') : isSignup ? (locale === 'en' ? 'Create my account' : 'Créer mon compte') : (locale === 'en' ? 'Sign in' : 'Se connecter')}
          </button>
          <p className="text-sm text-[#607086]">
            {isSignup
              ? (locale === 'en' ? 'Already have an account? ' : 'Vous avez déjà un compte ? ')
              : (locale === 'en' ? 'Don’t have an account yet? ' : 'Vous n’avez pas encore de compte ? ')}
            <Link
              href={localizeHref(isSignup ? '/connexion' : '/inscription', locale)}
              className="font-semibold text-[#1d3b8b] hover:text-[#57b7af]"
              onClick={() =>
                track('Auth Secondary CTA Clicked', {
                  cta: isSignup ? (locale === 'en' ? 'Sign in' : 'Se connecter') : (locale === 'en' ? 'Create an account' : 'Créer un compte'),
                  mode,
                  locale
                })
              }
            >
              {isSignup ? (locale === 'en' ? 'Sign in' : 'Se connecter') : (locale === 'en' ? 'Create an account' : 'Créer un compte')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
