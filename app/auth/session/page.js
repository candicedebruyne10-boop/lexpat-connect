"use client";

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '../../../lib/supabase/client';

function SessionHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const next         = params.get('next') || '/';

    if (!accessToken || !refreshToken) {
      router.replace('/connexion?error=session_manquante');
      return;
    }

    async function initSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
        router.replace(next);
      } catch {
        router.replace('/connexion?error=session_invalide');
      }
    }

    initSession();
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#57b7af] border-t-transparent" />
        <p className="text-sm text-[#607086]">Connexion en cours…</p>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#57b7af] border-t-transparent" />
      </div>
    }>
      <SessionHandler />
    </Suspense>
  );
}
