"use client";

/**
 * ReferralBanner.js
 * Bannière de parrainage affichée dans l'espace travailleur (WorkerSpace).
 * Affiche le lien de parrainage, les compteurs, et le message de partage.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '../lib/supabase/client';

const copy = {
  fr: {
    kicker: 'Parrainage',
    title: 'Invitez vos contacts sur LEXPAT Connect',
    subtitle: 'Partagez soit votre lien direct, soit simplement votre code. Le lien est le plus simple : le code est utile si la personne arrive plus tard sur le site.',
    howToShare: 'Deux façons de parrainer',
    optionLinkTitle: '1. Partager le lien direct',
    optionLinkText: 'La personne clique sur votre lien et le code est repris automatiquement pendant l’inscription.',
    optionCodeTitle: '2. Donner uniquement le code',
    optionCodeText: 'La personne peut venir directement sur le site et saisir ce code au moment de créer son compte.',
    yourLink: 'Lien direct à partager',
    linkHelp: 'À privilégier si vous envoyez le lien par message, email, WhatsApp ou LinkedIn.',
    copy: 'Copier le lien',
    copied: 'Copié !',
    yourCode: 'Code à transmettre',
    copyCode: 'Copier le code',
    codeCopied: 'Code copié !',
    codeHelp: 'À donner si la personne veut s’inscrire plus tard elle-même sur LEXPAT Connect.',
    previewTitle: 'Message prêt à partager',
    previewText: 'Vous pouvez relire ce message avant de le copier.',
    copyMessage: 'Copier ce message',
    messageCopied: 'Message copié !',
    stats: {
      invited: 'invité(s)',
      registered: 'inscrit(s)',
      visible: 'profil(s) visible(s)'
    },
    loading: 'Chargement...',
    error: 'Impossible de charger votre lien de parrainage.',
    statusLabels: {
      pending: 'En attente',
      pending_review: 'À vérifier',
      registered: 'Inscrit',
      profile_completed: 'Profil rempli',
      profile_visible: 'Profil visible',
      validated: 'Validé',
      invalid: 'Invalide'
    }
  },
  en: {
    kicker: 'Referral',
    title: 'Invite your contacts to LEXPAT Connect',
    subtitle: 'You can share either your direct link or simply your code. The link is easiest; the code is useful if the person visits the site later.',
    howToShare: 'Two ways to refer someone',
    optionLinkTitle: '1. Share the direct link',
    optionLinkText: 'The person clicks your link and the referral code is carried automatically during sign-up.',
    optionCodeTitle: '2. Share only the code',
    optionCodeText: 'The person can go directly to the site and enter this code while creating an account.',
    yourLink: 'Direct link to share',
    linkHelp: 'Best option if you are sending the referral by message, email, WhatsApp or LinkedIn.',
    copy: 'Copy link',
    copied: 'Copied!',
    yourCode: 'Referral code to share',
    copyCode: 'Copy code',
    codeCopied: 'Code copied!',
    codeHelp: 'Useful if the person prefers to visit LEXPAT Connect later on their own.',
    previewTitle: 'Ready-to-share message',
    previewText: 'You can review the message before copying it.',
    copyMessage: 'Copy this message',
    messageCopied: 'Message copied!',
    stats: {
      invited: 'invited',
      registered: 'registered',
      visible: 'visible profile(s)'
    },
    loading: 'Loading...',
    error: 'Unable to load your referral link.',
    statusLabels: {
      pending: 'Pending',
      pending_review: 'To verify',
      registered: 'Registered',
      profile_completed: 'Profile filled',
      profile_visible: 'Profile visible',
      validated: 'Validated',
      invalid: 'Invalid'
    }
  }
};

const statusDotClass = {
  pending: 'bg-gray-300',
  pending_review: 'bg-amber-400',
  registered: 'bg-blue-400',
  profile_completed: 'bg-teal-400',
  profile_visible: 'bg-green-500',
  validated: 'bg-green-600',
  invalid: 'bg-red-400'
};

export default function ReferralBanner({ locale = 'fr', accessToken }) {
  const t = copy[locale] || copy.fr;
  const supabase = useMemo(() => {
    try { return getSupabaseBrowserClient(); } catch { return null; }
  }, []);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchReferrals = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/referral/my-referrals?locale=${locale}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (json?.disabled) {
        setDisabled(true);
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, locale, t.error]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  function handleCopyLink() {
    if (!data?.referral_url) return;
    navigator.clipboard.writeText(data.referral_url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  }

  function handleCopyMessage() {
    if (!data?.share_message) return;
    navigator.clipboard.writeText(data.share_message).then(() => {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    });
  }

  function handleCopyCode() {
    if (!data?.referral_code) return;
    navigator.clipboard.writeText(data.referral_code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <p className="text-sm text-[#8fa0b3]">{t.loading}</p>
      </div>
    );
  }

  if (disabled) return null;

  if (error) {
    return (
      <div className="rounded-[28px] border border-[#f2c4c4] bg-[#fff5f5] p-6">
        <p className="text-sm text-[#a33f3f]">{error}</p>
      </div>
    );
  }

  const stats = data?.stats || { total: 0, registered: 0, profile_visible: 0 };
  const referrals = data?.referrals || [];

  return (
    <div className="rounded-[28px] border border-[#e5edf4] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#f0f5fb]">
        <p className="inline-flex rounded-full bg-[#f2fbfa] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">
          🎁 {t.kicker}
        </p>
        <h3 className="mt-3 text-lg font-semibold text-[#1d3b8b] tracking-[-0.02em]">
          {t.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#5d6e83]">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-[#f0f5fb] border-b border-[#f0f5fb]">
        {[
          { value: stats.total, label: t.stats.invited },
          { value: stats.registered, label: t.stats.registered },
          { value: stats.profile_visible, label: t.stats.visible }
        ].map((s) => (
          <div key={s.label} className="px-4 py-4 text-center">
            <p className="text-2xl font-bold text-[#1d3b8b]">{s.value}</p>
            <p className="mt-0.5 text-xs text-[#8fa0b3]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Zone pédagogique */}
      <div className="px-6 py-5">
        <div className="rounded-[18px] border border-[#e8eef5] bg-[#fbfdff] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8fa0b3]">
            {t.howToShare}
          </p>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[#dfe8f1] bg-white p-4">
              <p className="text-sm font-semibold text-[#1d3b8b]">{t.optionLinkTitle}</p>
              <p className="mt-1 text-sm leading-6 text-[#5d6e83]">{t.optionLinkText}</p>
            </div>
            <div className="rounded-[16px] border border-[#dfe8f1] bg-white p-4">
              <p className="text-sm font-semibold text-[#1d3b8b]">{t.optionCodeTitle}</p>
              <p className="mt-1 text-sm leading-6 text-[#5d6e83]">{t.optionCodeText}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b3]">
              {t.yourLink}
            </p>
            <div className="flex items-center gap-2 rounded-[14px] border border-[#e5edf4] bg-[#f7fafd] px-4 py-2.5">
              <p className="flex-1 truncate text-sm font-mono text-[#1d3b8b] select-all">
                {data?.referral_url}
              </p>
              <button
                onClick={handleCopyLink}
                className={`shrink-0 rounded-[10px] px-3 py-1.5 text-xs font-semibold transition ${
                  copiedLink
                    ? 'bg-[#eef9f1] text-[#2f9d57]'
                    : 'bg-[#1d3b8b] text-white hover:bg-[#2a52c9]'
                }`}
              >
                {copiedLink ? t.copied : t.copy}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8fa0b3]">{t.linkHelp}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b3]">
              {t.yourCode}
            </p>
            <div className="flex items-center gap-2 rounded-[14px] border border-[#dfe8f1] bg-white px-4 py-2.5">
              <p className="flex-1 text-sm font-mono font-semibold text-[#57b7af] select-all">
                {data?.referral_code}
              </p>
              <button
                onClick={handleCopyCode}
                className={`shrink-0 rounded-[10px] px-3 py-1.5 text-xs font-semibold transition ${
                  copiedCode
                    ? 'bg-[#eef9f1] text-[#2f9d57]'
                    : 'border border-[#dce7ef] bg-white text-[#1d3b8b] hover:border-[#c9d7ea] hover:bg-[#f6f9fc]'
                }`}
              >
                {copiedCode ? t.codeCopied : t.copyCode}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8fa0b3]">{t.codeHelp}</p>
          </div>

          <div className="rounded-[18px] border border-[#e5edf4] bg-[#fcfdff] p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8fa0b3]">
                  {t.previewTitle}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8fa0b3]">{t.previewText}</p>
              </div>
              <button
                onClick={handleCopyMessage}
                className={`mt-3 rounded-[12px] border px-4 py-2 text-sm font-medium transition sm:mt-0 ${
                  copiedMsg
                    ? 'border-[#dcebe8] bg-[#f5fbfb] text-[#33566b]'
                    : 'border-[#e5edf4] bg-white text-[#5d6e83] hover:border-[#57b7af] hover:text-[#57b7af]'
                }`}
              >
                {copiedMsg ? `✓ ${t.messageCopied}` : `💬 ${t.copyMessage}`}
              </button>
            </div>
            <div className="mt-4 rounded-[14px] border border-[#e8eef5] bg-white px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#35506f]">
                {data?.share_message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste filleuls (si au moins 1) */}
      {referrals.length > 0 && (
        <div className="border-t border-[#f0f5fb]">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-sm font-medium text-[#5d6e83] hover:text-[#1d3b8b] transition"
          >
            <span>
              {locale === 'en' ? 'My referrals' : 'Mes filleuls'} ({referrals.length})
            </span>
            <span className="text-xs">{expanded ? '▲' : '▼'}</span>
          </button>

          {expanded && (
            <div className="divide-y divide-[#f0f5fb]">
              {referrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#17345d]">
                      {r.referee_name || (locale === 'en' ? 'Contact' : 'Contact')}
                      {r.referee_job ? <span className="ml-2 text-xs text-[#8fa0b3]">{r.referee_job}</span> : null}
                    </p>
                    <p className="text-xs text-[#8fa0b3]">
                      {r.registered_at
                        ? new Date(r.registered_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-BE')
                        : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${statusDotClass[r.status] || 'bg-gray-300'}`} />
                    <span className="text-xs text-[#8fa0b3]">
                      {t.statusLabels[r.status] || r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
