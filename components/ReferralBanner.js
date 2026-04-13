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
    subtitle: 'Chaque personne que vous recommandez enrichit la communauté. Copiez votre lien et partagez-le par message, email ou LinkedIn.',
    yourLink: 'Votre lien personnel',
    copy: 'Copier le lien',
    copied: 'Copié !',
    copyMessage: 'Copier le message',
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
    subtitle: 'Every person you recommend enriches the community. Copy your link and share it by message, email or LinkedIn.',
    yourLink: 'Your personal link',
    copy: 'Copy link',
    copied: 'Copied!',
    copyMessage: 'Copy message',
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
  const [copiedLink, setCopiedLink] = useState(false);
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

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <p className="text-sm text-[#8fa0b3]">{t.loading}</p>
      </div>
    );
  }

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

      {/* Lien */}
      <div className="px-6 py-5">
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

        {/* Code */}
        <p className="mt-2 text-xs text-[#8fa0b3]">
          Code : <span className="font-mono font-medium text-[#57b7af]">{data?.referral_code}</span>
        </p>

        {/* Bouton message */}
        <button
          onClick={handleCopyMessage}
          className={`mt-4 w-full rounded-[14px] border px-4 py-2.5 text-sm font-medium transition ${
            copiedMsg
              ? 'border-[#dcebe8] bg-[#f5fbfb] text-[#33566b]'
              : 'border-[#e5edf4] bg-white text-[#5d6e83] hover:border-[#57b7af] hover:text-[#57b7af]'
          }`}
        >
          {copiedMsg ? `✓ ${t.messageCopied}` : `💬 ${t.copyMessage}`}
        </button>
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
