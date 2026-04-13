/**
 * GET /api/referral/my-referrals
 * Retourne la liste des filleuls du travailleur connecté,
 * avec les compteurs de statut.
 *
 * Réponse : {
 *   referral_code: string,
 *   referral_url: string,
 *   stats: { total, registered, profile_visible, validated },
 *   referrals: Array<{...}>
 * }
 */

import { NextResponse } from 'next/server';
import { getUserFromRequest, getServiceClient } from '../../../../lib/supabase/server';
import { buildReferralUrl, buildShareMessage } from '../../../../lib/referral';

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    const locale = new URL(request.url).searchParams.get('locale') || 'fr';

    // Récupérer le profil et le code de parrainage
    const { data: profile } = await supabase
      .from('worker_profiles')
      .select('id, referral_code')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé.' }, { status: 404 });
    }

    // Si pas encore de code → on en génère un automatiquement
    let code = profile.referral_code;
    if (!code) {
      const { generateUniqueReferralCode } = await import('../../../../lib/referral');
      code = await generateUniqueReferralCode(supabase);
      await supabase
        .from('worker_profiles')
        .update({ referral_code: code })
        .eq('id', profile.id);
    }

    const referralUrl = buildReferralUrl(code, locale);
    const shareMessage = buildShareMessage(referralUrl, locale);

    // Récupérer les parrainages de ce membre
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        id,
        status,
        attribution_source,
        registered_at,
        profile_completed_at,
        profile_visible_at,
        validated_at,
        created_at,
        referee_worker_profile_id (
          full_name,
          target_job,
          profile_visibility,
          profile_completion
        )
      `)
      .eq('referrer_user_id', user.id)
      .not('status', 'eq', 'invalid')
      .order('created_at', { ascending: false });

    const safeReferrals = referrals || [];

    // Calculer les stats
    const stats = {
      total: safeReferrals.length,
      registered: safeReferrals.filter(r =>
        ['registered', 'profile_completed', 'profile_visible', 'validated'].includes(r.status)
      ).length,
      profile_visible: safeReferrals.filter(r =>
        ['profile_visible', 'validated'].includes(r.status)
      ).length,
      validated: safeReferrals.filter(r => r.status === 'validated').length
    };

    // Formater pour le front
    const formattedReferrals = safeReferrals.map(r => ({
      id: r.id,
      status: r.status,
      attribution_source: r.attribution_source,
      registered_at: r.registered_at,
      profile_visible_at: r.profile_visible_at,
      validated_at: r.validated_at,
      created_at: r.created_at,
      // Données filleul (anonymisées : prénom uniquement pour MVP)
      referee_name: r.referee_worker_profile_id?.full_name
        ? r.referee_worker_profile_id.full_name.split(' ')[0]
        : null,
      referee_job: r.referee_worker_profile_id?.target_job || null,
      referee_profile_completion: r.referee_worker_profile_id?.profile_completion || 0
    }));

    return NextResponse.json({
      referral_code: code,
      referral_url: referralUrl,
      share_message: shareMessage,
      stats,
      referrals: formattedReferrals
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
