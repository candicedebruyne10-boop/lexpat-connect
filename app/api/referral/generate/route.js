/**
 * POST /api/referral/generate
 * Génère un code de parrainage pour le travailleur connecté.
 * Si un code existe déjà, le retourne sans en créer un nouveau.
 *
 * Réponse : { referral_code, referral_url }
 */

import { NextResponse } from 'next/server';
import { getUserFromRequest, getServiceClient } from '../../../../lib/supabase/server';
import { generateUniqueReferralCode, buildReferralUrl, isMissingReferralColumnError } from 'lib/referral';

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();

    // Vérifier que l'utilisateur est bien un travailleur
    const { data: profile, error: profileError } = await supabase
      .from('worker_profiles')
      .select('id, referral_code')
      .eq('user_id', user.id)
      .maybeSingle();

    if (isMissingReferralColumnError(profileError)) {
      return NextResponse.json(
        { error: 'Le système de parrainage n’est pas encore activé sur cet environnement.', disabled: true },
        { status: 503 }
      );
    }

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profil travailleur non trouvé.' },
        { status: 404 }
      );
    }

    // Si code déjà existant, retourner directement
    if (profile.referral_code) {
      const locale = new URL(request.url).searchParams.get('locale') || 'fr';
      return NextResponse.json({
        referral_code: profile.referral_code,
        referral_url: buildReferralUrl(profile.referral_code, locale)
      });
    }

    // Générer un nouveau code unique
    const code = await generateUniqueReferralCode(supabase);

    const { error: updateError } = await supabase
      .from('worker_profiles')
      .update({ referral_code: code })
      .eq('id', profile.id);

    if (updateError) {
      console.error('[referral/generate] update error:', updateError.message);
      return NextResponse.json({ error: 'Erreur lors de la génération du code.' }, { status: 500 });
    }

    const locale = new URL(request.url).searchParams.get('locale') || 'fr';

    return NextResponse.json({
      referral_code: code,
      referral_url: buildReferralUrl(code, locale)
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
