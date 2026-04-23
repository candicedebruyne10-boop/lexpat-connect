import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServiceClient } from "../../../../../lib/supabase/server";
import {
  exchangeLinkedInCodeForToken,
  fetchAccessibleAdAccounts,
  LINKEDIN_SCOPES,
} from "../../../../../lib/linkedin-marketing";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;
  const redirectBase = `${baseUrl.replace(/\/$/, "")}/admin`;

  if (error) {
    return NextResponse.redirect(
      `${redirectBase}?linkedin_error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectBase}?linkedin_error=missing_code`);
  }

  const cookieStore = await cookies();
  const stored = cookieStore.get("linkedin_oauth_state")?.value;

  let payload = null;
  try {
    payload = stored ? JSON.parse(stored) : null;
  } catch {
    payload = null;
  }

  if (!payload?.state || payload.state !== state || !payload.userId) {
    return NextResponse.redirect(`${redirectBase}?linkedin_error=invalid_state`);
  }

  try {
    const supabase = getServiceClient();
    const token = await exchangeLinkedInCodeForToken(code);
    const accountSnapshot = await fetchAccessibleAdAccounts(token.access_token);

    const expiresAt = token.expires_in
      ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString()
      : null;

    const { error: upsertError } = await supabase.from("linkedin_admin_connections").upsert({
      created_by: payload.userId,
      linkedin_member_id: null,
      access_token: token.access_token,
      expires_at: expiresAt,
      scope: Array.isArray(token.scope) ? token.scope : LINKEDIN_SCOPES,
      account_snapshot: accountSnapshot,
      status: "connected",
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "created_by",
    });

    if (upsertError) throw upsertError;

    cookieStore.delete("linkedin_oauth_state");

    return NextResponse.redirect(
      `${redirectBase}?linkedin_connected=1&linkedin_accounts=${accountSnapshot.length}`
    );
  } catch (err) {
    cookieStore.delete("linkedin_oauth_state");
    return NextResponse.redirect(
      `${redirectBase}?linkedin_error=${encodeURIComponent(err.message || "linkedin_callback_failed")}`
    );
  }
}
