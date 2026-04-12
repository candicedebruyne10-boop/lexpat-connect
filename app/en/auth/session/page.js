"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../../lib/supabase/client";

function SessionHandlerEn() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const next = params.get("next") || "/en";

    if (!accessToken || !refreshToken) {
      router.replace("/en/connexion?error=missing_session");
      return;
    }

    async function initSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        if (error) throw error;
        router.replace(next);
      } catch {
        router.replace("/en/connexion?error=invalid_session");
      }
    }

    initSession();
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#57b7af] border-t-transparent" />
        <p className="text-sm text-[#607086]">Signing you in...</p>
      </div>
    </div>
  );
}

export default function SessionPageEn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#57b7af] border-t-transparent" />
        </div>
      }
    >
      <SessionHandlerEn />
    </Suspense>
  );
}
