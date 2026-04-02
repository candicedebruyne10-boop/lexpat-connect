import { createClient } from "@supabase/supabase-js";

/**
 * Supabase service-role client — bypasses RLS.
 * Usage : server-side only (API routes).
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server environment variables are missing.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Verify a Bearer token and return the authenticated user.
 * Throws if token is missing or invalid.
 */
export async function getUserFromRequest(request) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) throw new Error("Missing authorization token.");

  const supabase = getServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) throw new Error("Invalid or expired token.");

  return { user, supabase };
}
