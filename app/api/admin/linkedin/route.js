import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../lib/supabase/server";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((email) => email.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

export async function GET(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const { data, error } = await supabase
      .from("linkedin_admin_connections")
      .select("id, linkedin_member_id, member_urn, member_name, scope, expires_at, account_snapshot, organization_snapshot, created_at, updated_at")
      .eq("created_by", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;

    if (!data) {
      return NextResponse.json({ connected: false });
    }

    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    const expired = expiresAt ? expiresAt.getTime() <= Date.now() : false;

    return NextResponse.json({
      connected: true,
      expired,
      connection: {
        id: data.id,
        linkedin_member_id: data.linkedin_member_id,
        member_urn: data.member_urn,
        member_name: data.member_name,
        scope: data.scope || [],
        expires_at: data.expires_at,
        account_snapshot: data.account_snapshot || [],
        organization_snapshot: data.organization_snapshot || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function DELETE(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const { error } = await supabase
      .from("linkedin_admin_connections")
      .delete()
      .eq("created_by", user.id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
