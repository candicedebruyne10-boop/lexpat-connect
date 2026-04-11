import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

      if (!existingWorker) {
        const { error: workerError } = await supabase.from('worker_profiles').insert({
          user_id: user.id,
          full_name: fullName,
          email,
          profile_visibility: 'visible'
        });

        if (workerError) {
          return NextResponse.json({ error: workerError.message }, { status: 500 });
        }
      }

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
