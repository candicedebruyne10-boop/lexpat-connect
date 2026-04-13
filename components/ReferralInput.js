"use client";

/**
 * ReferralInput.js
 * Champ "Qui vous a recommandé ?" pour le formulaire d'inscription (AuthForm).
 *
 * Comportement :
 * - Si referralCode présent (depuis cookie/URL) → affichage verrouillé "Lien de parrainage détecté ✓"
 * - Sinon → champ textuel libre avec validation debounced
 *
 * Props :
 *   referralCode    string | null  Code détecté depuis cookie/URL (verrouille le champ)
 *   value           string         Valeur actuelle du champ libre
 *   onChange        fn(string)     Callback de changement
 *   locale          'fr' | 'en'
 */

import { useEffect, useRef, useState } from 'react';

const copy = {
  fr: {
    label: 'Vous avez été recommandé(e) ?',
    locked: 'Lien de parrainage détecté',
    placeholder: 'Prénom et nom de votre contact, ou son code (ex\u00a0: LP-A7K2MN)',
    helper: 'Facultatif · Aide à reconnaître votre recommandation',
    validating: 'Vérification…',
    clear: 'Effacer'
  },
  en: {
    label: 'Were you recommended?',
    locked: 'Referral link detected',
    placeholder: 'First and last name of your contact, or their code (e.g. LP-A7K2MN)',
    helper: 'Optional · Helps identify your referral',
    validating: 'Checking…',
    clear: 'Clear'
  }
};

export default function ReferralInput({ referralCode, value, onChange, locale = 'fr' }) {
  const t = copy[locale] || copy.fr;
  const isLocked = Boolean(referralCode);

  const [feedback, setFeedback] = useState(null); // { valid, message }
  const [validating, setValidating] = useState(false);
  const debounceRef = useRef(null);

  // Valider en debounce quand l'utilisateur saisit
  useEffect(() => {
    if (isLocked || !value || value.trim().length < 3) {
      setFeedback(null);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setValidating(true);
      try {
        const res = await fetch('/api/referral/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: value.trim(), locale })
        });
        const data = await res.json();
        setFeedback({
          valid: data.valid,
          message: data.message,
          source: data.source
        });
      } catch {
        setFeedback(null);
      } finally {
        setValidating(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [value, isLocked, locale]);

  // Si lien de parrainage détecté (verrouillé)
  if (isLocked) {
    return (
      <div className="md:col-span-2">
        <span className="mb-2 block text-sm font-semibold text-[#17345d]">{t.label}</span>
        <div className="flex items-center gap-3 rounded-[16px] border border-[#9fcfca] bg-[#f2fbfa] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(87,183,175,0.2)]">
          <span className="text-[#57b7af]">✓</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#33566b]">{t.locked}</p>
            <p className="text-xs text-[#57b7af] font-mono mt-0.5">{referralCode}</p>
          </div>
        </div>
      </div>
    );
  }

  // Champ libre
  const borderClass = feedback
    ? feedback.valid
      ? 'border-[#9fcfca] focus:ring-[#57b7af]/20'
      : 'border-[#f2a4a4] focus:ring-red-100'
    : 'border-[#d4e2ef] focus:border-[#57b7af] focus:ring-[#57b7af]/20';

  return (
    <div className="md:col-span-2">
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{t.label}</span>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          className={`w-full rounded-[14px] border bg-white px-4 py-2.5 text-sm text-[#1d3b8b] outline-none ring-4 ring-transparent transition placeholder:text-[#b0bfcc] ${borderClass}`}
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setFeedback(null); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8fa0b3] hover:text-[#1d3b8b] transition"
          >
            {t.clear}
          </button>
        )}
      </div>

      {/* Feedback */}
      {validating && (
        <p className="mt-1.5 text-xs text-[#8fa0b3]">{t.validating}</p>
      )}
      {!validating && feedback && (
        <p className={`mt-1.5 text-xs font-medium ${
          feedback.valid ? 'text-[#33566b]' : 'text-[#a33f3f]'
        }`}>
          {feedback.message}
        </p>
      )}
      {!validating && !feedback && (
        <p className="mt-1.5 text-xs text-[#b0bfcc]">{t.helper}</p>
      )}
    </div>
  );
}
