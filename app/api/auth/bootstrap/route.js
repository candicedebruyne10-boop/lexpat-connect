import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  extractReferralInput,
  resolveReferralCode,
  resolveReferralByName,
  createReferral,
  generateUniqueReferralCode,
  logReferralEvent,
  isMissingReferralColumnError
} from 'lib/referral';

const allowedRoles = new Set(['worker', 'employer']);

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server environment variables are missing.');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

/**
 * Attribue un parrainage au nouveau travailleur inscrit.
 * Exécuté de manière asynchrone (best-effort) après la création du compte.
 *
 * Sources d'attribution (par ordre de priorité) :
 * 1. referral_code dans le body (depuis cookie/URL — source 'link')
 * 2. referral_input dans le body (saisie libre — code ou nom)
 */
async function handleReferralAttribution({ supabase, body, refereeUserId, refereeWorkerProfileId }) {
  const { code, source, rawInput } = extractReferralInput(body);

  let referrerInfo = null;

  // Cas 1 : code de parrainage (depuis lien ou saisie code)
  if (code) {
    referrerInfo = await resolveReferralCode(supabase, code);
    if (referrerInfo) {
      // Guard auto-parrainage
      if (referrerInfo.referrer_user_id === refereeUserId) {
        await logReferralEvent(supabase, {
          event_type: 'referral_invalid',
          referral_code: code,
          attribution_source: source,
          referrer_user_id: referrerInfo.referrer_user_id,
          referee_user_id: refereeUserId,
          metadata: { reason: 'self_referral' }
        });
        return;
      }

      const referral = await createReferral(supabase, {
        referrer_user_id: referrerInfo.referrer_user_id,
        referrer_worker_profile_id: referrerInfo.referrer_worker_profile_id,
        referee_user_id: refereeUserId,
        referee_worker_profile_id: refereeWorkerProfileId,
        referral_code: code,
        attribution_source: source,
        referrer_name_input: null
      });

      if (referral) {
        await logReferralEvent(supabase, {
          referral_id: referral.id,
          event_type: 'referral_attributed',
          referral_code: code,
          attribution_source: source,
          referrer_user_id: referrerInfo.referrer_user_id,
          referee_user_id: refereeUserId,
          metadata: { referee_worker_profile_id: refereeWorkerProfileId }
        });
      }
      return;
    }
    // Code non résolu → on log et on continue vers le fallback nom
    await logReferralEvent(supabase, {
      event_type: 'signup_completed',
      referral_code: code,
      attribution_source: source,
      referee_user_id: refereeUserId,
      raw_input: rawInput,
      metadata: { resolved: false, reason: 'code_not_found' }
    });
    return;
  }

  // Cas 2 : saisie libre (nom) → lookup + pending_review si ambigu
  if (source === 'manual_name' && rawInput) {
    referrerInfo = await resolveReferralByName(supabase, rawInput);

    const finalStatus = referrerInfo ? 'registered' : 'pending_review';
    const resolvedCode = referrerInfo
      ? `MANUAL-${referrerInfo.referrer_user_id.slice(0, 8).toUpperCase()}`
      : 'MANUAL-UNRESOLVED';

    // Guard auto-parrainage
    if (referrerInfo && referrerInfo.referrer_user_id === refereeUserId) {
      return;
    }

    const referral = await createReferral(supabase, {
      referrer_user_id: referrerInfo?.referrer_user_id || null,
      referrer_worker_profile_id: referrerInfo?.referrer_worker_profile_id || null,
      referee_user_id: refereeUserId,
      referee_worker_profile_id: refereeWorkerProfileId,
      referral_code: resolvedCode,
      attribution_source: 'manual_name',
      referrer_name_input: rawInput,
      // Override le statut si non résolu
      ...(finalStatus === 'pending_review' && { _override_status: 'pending_review' })
    });

    if (referral && finalStatus === 'pending_review') {
      // Forcer le statut pending_review si non résolu
      await supabase
        .from('referrals')
        .update({ status: 'pending_review' })
        .eq('id', referral.id);
    }

    if (referral) {
      await logReferralEvent(supabase, {
        referral_id: referral.id,
        event_type: referrerInfo ? 'referral_attributed' : 'signup_completed',
        attribution_source: 'manual_name',
        raw_input: rawInput,
        referrer_user_id: referrerInfo?.referrer_user_id || null,
        referee_user_id: refereeUserId,
        metadata: { resolved: !!referrerInfo, pending_review: !referrerInfo }
      });
    }
    return;
  }

  // Cas 3 : aucun parrainage → log simple
  await logReferralEvent(supabase, {
    event_type: 'signup_completed',
    attribution_source: 'unknown',
    referee_user_id: refereeUserId,
    metadata: { referral: false }
  });
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token.' }, { status: 401 });
    }

    const body = await request.json();
    const role = body?.role;

    if (!allowedRoles.has(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unable to resolve the authenticated user.' }, { status: 401 });
    }

    const fullName = body?.fullName || user.user_metadata?.full_name || null;
    const companyName = body?.companyName || user.user_metadata?.company_name || null;
    const email = body?.email || user.email || null;
    const metadataRole = user.user_metadata?.role || null;

    if (metadataRole && allowedRoles.has(metadataRole) && metadataRole !== role) {
      return NextResponse.json(
        {
          error:
            metadataRole === 'employer'
              ? "Ce compte est déjà configuré comme employeur. Utilisez uniquement l'espace employeur avec cette adresse email."
              : "Ce compte est déjà configuré comme travailleur. Utilisez uniquement l'espace travailleur avec cette adresse email."
        },
        { status: 409 }
      );
    }

    const { data: existingRoleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingRoleRow?.role && existingRoleRow.role !== role) {
      return NextResponse.json(
        {
          error:
            existingRoleRow.role === 'employer'
              ? "Ce compte est déjà configuré comme employeur. Utilisez uniquement l'espace employeur avec cette adresse email."
              : "Ce compte est déjà configuré comme travailleur. Utilisez uniquement l'espace travailleur avec cette adresse email."
        },
        { status: 409 }
      );
    }

    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role }, { onConflict: 'user_id' });

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 500 });
    }

    if (role === 'worker') {
      const { data: existingWorker } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let workerProfileId = existingWorker?.id;
      let isNewWorker = false;

      if (!existingWorker) {
        isNewWorker = true;
        // Générer un code de parrainage pour le nouveau travailleur
        let newReferralCode = null;
        try {
          newReferralCode = await generateUniqueReferralCode(supabase);
        } catch (err) {
          console.error('[bootstrap] referral code generation failed:', err.message);
        }

        const workerPayload = {
          user_id: user.id,
          full_name: fullName,
          email,
          profile_visibility: 'hidden',
          referral_code: newReferralCode
        };

        let { data: newWorker, error: workerError } = await supabase
          .from('worker_profiles')
          .insert(workerPayload)
          .select('id')
          .single();

        if (workerError && isMissingReferralColumnError(workerError)) {
          ({ data: newWorker, error: workerError } = await supabase
            .from('worker_profiles')
            .insert({
              user_id: user.id,
              full_name: fullName,
              email,
              profile_visibility: 'hidden'
            })
            .select('id')
            .single());
        }

        if (workerError || !newWorker) {
          return NextResponse.json({ error: workerError?.message || 'Worker profile creation failed.' }, { status: 500 });
        }

        workerProfileId = newWorker.id;
      }

      // ── Attribution du parrainage (best-effort, non-bloquant) ───────────────
      if (isNewWorker) {
        handleReferralAttribution({
          supabase,
          body,
          refereeUserId: user.id,
          refereeWorkerProfileId: workerProfileId
        }).catch(err => console.error('[bootstrap] referral attribution error:', err.message));
      }
      // ────────────────────────────────────────────────────────────────────────

      return NextResponse.json({ redirectTo: '/travailleurs/espace' });
    }

    const { data: existingMembership } = await supabase
      .from('employer_members')
      .select('id, employer_profile_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existingMembership) {
      const { data: employerProfile, error: employerError } = await supabase
        .from('employer_profiles')
        .insert({
          company_name: companyName || 'Nouvelle entreprise'
        })
        .select('id')
        .single();

      if (employerError || !employerProfile) {
        return NextResponse.json({ error: employerError?.message || 'Unable to create employer profile.' }, { status: 500 });
      }

      const { error: memberError } = await supabase.from('employer_members').insert({
        employer_profile_id: employerProfile.id,
        user_id: user.id,
        full_name: fullName,
        work_email: email,
        is_owner: true,
        role_label: 'Owner'
      });

      if (memberError) {
        return NextResponse.json({ error: memberError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ redirectTo: '/employeurs/espace' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}
