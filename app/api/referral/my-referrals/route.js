/**
 * GET /api/referral/my-referrals
 * Retourne la liste des filleuls du travailleur connecté,
 * avec les compteurs de statut.
 */

import { NextResponse } from 'next/server';
import { getUserFromRequest, getServiceClient } from '../../../../lib/supabase/server';
import {
  buildReferralUrl,
  buildShareMessage,
  generateUniqueReferralCode,
  isMissingReferralColumnError
} from '../../../../lib/referral';

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    const locale = new URL(request.url).searchParams.get('locale') || 'fr';

    // Récupérer le profil et le code de parrainage
    const { data: profile, error: profileError } = await supabase
      .from('worker_profiles')
      .select('id, referral_code')
      .eq('user_id', user.id)
      .maybeSingle();

    // Log pour diagnostic
    if (profileError) {
      console.error('[my-referrals] profileError:', profileError.message, profileError.code, profileError.details);
    }

    // Migration SQL pas encore appliquée → désactiver silencieusement
    if (isMissingReferralColumnError(profileError)) {
      return NextResponse.json({
        disabled: true,
        referral_code: null,
        referral_url: null,
        share_message: null,
        stats: { total: 0, registered: 0, profile_visible: 0, validated: 0 },
        referrals: []
      });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé.' }, { status: 404 });
    }

    // Si pas encore de code → en générer un automatiquement
    let code = profile.referral_code;
    if (!code) {
      try {
        code = await generateUniqueReferralCode(supabase);
        await supabase
          .from('worker_profiles')
          .update({ referral_code: code })
          .eq('id', profile.id);
      } catch (err) {
        console.error('[my-referrals] code generation failed:', err.message);
      }
    }

    const referralUrl = code ? buildReferralUrl(code, locale) : null;
    const shareMessage = referralUrl ? buildShareMessage(referralUrl, locale) : null;

    // Récupérer les parrainages de ce membre
    const { data: referrals, error: referralsError } = await supabase
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

    // Log pour diagnostic
    if (referralsError) {
      console.error('[my-referrals] referrals query error:', referralsError.message, referralsError.code, referralsError.details);
      // Si la table n'existe vraiment pas → désactivation silencieuse
      if (referralsError.message?.includes('does not exist') || referralsError.code === '42P01') {
        return NextResponse.json({
          disabled: true,
          referral_code: code,
          referral_url: referralUrl,
          share_message: shareMessage,
          stats: { total: 0, registered: 0, profile_visible: 0, validated: 0 },
          referrals: []
        });
      }
      // Autre erreur → on retourne quand même le banner avec les stats vides (pas disabled)
      return NextResponse.json({
        referral_code: code,
        referral_url: referralUrl,
        share_message: shareMessage,
        stats: { total: 0, registered: 0, profile_visible: 0, validated: 0 },
        referrals: [],
        _debug_error: referralsError.message
      });
    }

    const safeReferrals = referrals || [];

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

    const formattedReferrals = safeReferrals.map(r => ({
      id: r.id,
      status: r.status,
      attribution_source: r.attribution_source,
      registered_at: r.registered_at,
      profile_visible_at: r.profile_visible_at,
      validated_at: r.validated_at,
      created_at: r.created_at,
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
