/**
 * POST /api/referral/validate
 * Valide un code ou un nom de parrain saisi manuellement.
 */

import { NextResponse } from 'next/server';
import { getServiceClient } from '../../../../lib/supabase/server';
import {
  resolveReferralCode,
  resolveReferralByName
} from '../../../../lib/referral';

export async function POST(request) {
  try {
    const body = await request.json();
    const input = (body?.input || '').trim();
    const locale = body?.locale || 'fr';
    const isEn = locale === 'en';

    if (!input || input.length < 2) {
      return NextResponse.json({
        valid: false,
        source: 'unknown',
        message: isEn ? 'Please enter a name or code.' : 'Veuillez saisir un nom ou un code.'
      });
    }

    const supabase = getServiceClient();

    // Tentative 1 : code LP-XXXXXX
    if (/^LP-?[A-Z0-9]{6}$/i.test(input.replace(/\s/g, ''))) {
      const normalized = input.trim().toUpperCase().replace(/\s/g, '');
      const result = await resolveReferralCode(supabase, normalized);

      if (result) {
        const { data: profile } = await supabase
          .from('worker_profiles')
          .select('full_name')
          .eq('user_id', result.referrer_user_id)
          .maybeSingle();

        return NextResponse.json({
          valid: true,
          source: 'manual_code',
          display_name: profile?.full_name || null,
          message: isEn
            ? `Referral recognized${profile?.full_name ? ` — ${profile.full_name}` : ''} 🎉`
            : `Parrainage reconnu${profile?.full_name ? ` — ${profile.full_name}` : ''} 🎉`
        });
      }

      return NextResponse.json({
        valid: false,
        source: 'manual_code',
        message: isEn
          ? 'Code not recognized. Leave blank if you don\'t have one.'
          : 'Code non reconnu. Laissez vide si vous n\'avez pas de code.'
      });
    }

    // Tentative 2 : recherche par nom
    if (input.length >= 3) {
      const result = await resolveReferralByName(supabase, input);

      if (result) {
        const { data: profile } = await supabase
          .from('worker_profiles')
          .select('full_name')
          .eq('user_id', result.referrer_user_id)
          .maybeSingle();

        return NextResponse.json({
          valid: true,
          source: 'manual_name',
          display_name: profile?.full_name || input,
          message: isEn
            ? `Referral found — ${profile?.full_name || input} 🎉`
            : `Contact trouvé — ${profile?.full_name || input} 🎉`
        });
      }

      // Non trouvé exactement → accepté pour vérification admin
      return NextResponse.json({
        valid: true,
        source: 'manual_name_unresolved',
        message: isEn
          ? 'Name not found exactly. Our team will verify.'
          : 'Nom non trouvé exactement. Notre équipe vérifiera.'
      });
    }

    return NextResponse.json({
      valid: false,
      source: 'unknown',
      message: isEn ? 'Invalid entry.' : 'Saisie invalide.'
    });
  } catch (err) {
    console.error('[referral/validate] error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
