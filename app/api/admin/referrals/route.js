/**
 * GET  /api/admin/referrals — Liste tous les parrainages (admin uniquement)
 * PATCH /api/admin/referrals — Met à jour le statut d'un parrainage
 */

import { NextResponse } from 'next/server';
import { getUserFromRequest, getServiceClient } from '../../../../lib/supabase/server';
import { logReferralEvent } from '../../../../lib/referral';

async function requireAdmin(request) {
  const { user } = await getUserFromRequest(request);
  const supabase = getServiceClient();

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleRow?.role !== 'admin') {
    throw new Error('Accès administrateur requis.');
  }

  return { user, supabase };
}

export async function GET(request) {
  try {
    const { supabase } = await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = page * limit;

    let query = supabase
      .from('referrals')
      .select(`
        id,
        status,
        attribution_source,
        referral_code,
        referrer_name_input,
        admin_notes,
        attributed_at,
        registered_at,
        profile_completed_at,
        profile_visible_at,
        validated_at,
        created_at,
        referrer_worker_profile_id (
          full_name,
          email,
          target_job
        ),
        referee_worker_profile_id (
          full_name,
          email,
          target_job,
          profile_visibility,
          profile_completion
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Compteurs par statut
    const { data: statusCounts } = await supabase
      .from('referrals')
      .select('status');

    const summary = (statusCounts || []).reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      referrals: data || [],
      total: count || 0,
      page,
      limit,
      summary
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PATCH(request) {
  try {
    const { user, supabase } = await requireAdmin(request);
    const body = await request.json();

    const { referral_id, action, admin_notes } = body;

    if (!referral_id || !action) {
      return NextResponse.json({ error: 'referral_id et action sont requis.' }, { status: 400 });
    }

    const allowedActions = ['validate', 'invalidate', 'set_pending_review'];
    if (!allowedActions.includes(action)) {
      return NextResponse.json({ error: `Action non reconnue: ${action}` }, { status: 400 });
    }

    const newStatus = action === 'validate'
      ? 'validated'
      : action === 'invalidate'
        ? 'invalid'
        : 'pending_review';

    const updateData = {
      status: newStatus,
      admin_notes: admin_notes || null
    };

    if (action === 'validate') {
      updateData.validated_at = new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabase
      .from('referrals')
      .update(updateData)
      .eq('id', referral_id)
      .select('id, status, referrer_user_id, referee_user_id, referral_code')
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: updateError?.message || 'Referral non trouvé.' }, { status: 404 });
    }

    await logReferralEvent(supabase, {
      referral_id,
      event_type: action === 'validate' ? 'referral_validated' : 'referral_invalid',
      referral_code: updated.referral_code,
      referrer_user_id: updated.referrer_user_id,
      referee_user_id: updated.referee_user_id,
      metadata: { action, admin_user_id: user.id, admin_notes: admin_notes || null }
    });

    return NextResponse.json({ ok: true, referral: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
