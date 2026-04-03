import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Route de callback après confirmation d'email Supabase.
 * Supabase redirige ici avec ?token_hash=xxx&type=signup (ou recovery, etc.)
 * On échange le token contre une session, puis on redirige vers le bon espace.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get('token_hash');
  const type      = searchParams.get('type');        // 'signup', 'recovery', 'magiclink'…
  const next      = searchParams.get('next') || '/'; // page cible après confirmation

  // Si pas de token → renvoyer sur l'accueil
  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error || !data.session) {
    // Lien expiré ou invalide → page de connexion avec message d'erreur
    return NextResponse.redirect(
      `${origin}/connexion?error=lien_invalide`
    );
  }

  // Session créée — déterminer où rediriger selon le rôle
  const role = data.user?.user_metadata?.role || 'worker';
  let destination = next;

  if (destination === '/') {
    destination = role === 'employer'
      ? '/employeurs/espace'
      : '/travailleurs/espace';
  }

  // Créer une réponse de redirection et injecter les cookies de session
  const response = NextResponse.redirect(`${origin}${destination}`);

  // Supabase stocke la session côté client via localStorage,
  // mais on passe le token dans l'URL pour que le client le récupère
  const redirectWithSession = `${origin}/auth/session?` +
    `access_token=${data.session.access_token}` +
    `&refresh_token=${data.session.refresh_token}` +
    `&next=${encodeURIComponent(destination)}`;

  return NextResponse.redirect(redirectWithSession);
}
