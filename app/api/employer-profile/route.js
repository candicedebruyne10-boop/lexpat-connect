import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";

const regionToDb = {
  "Bruxelles-Capitale": "brussels",
  Wallonie: "wallonia",
  Flandre: "flanders",
  "Plusieurs régions": "multi_region"
};

const regionFromDb = {
  brussels: "Bruxelles-Capitale",
  wallonia: "Wallonie",
  flanders: "Flandre",
  multi_region: "Plusieurs régions"
};

function computeCompletion(payload) {
  const required = [
    payload.company_name,
    payload.sector,
    payload.company_website,
    payload.company_description,
    payload.region,
    payload.full_name,
    payload.work_email,
    payload.phone
  ];

  const filled = required.filter(Boolean).length;
  return Math.round((filled / required.length) * 100);
}

export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    const { data: membership, error: membershipError } = await supabase
      .from("employer_members")
      .select("employer_profile_id, full_name, work_email, phone, is_owner")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json({ error: "Espace employeur introuvable." }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("employer_profiles")
      .select("company_name, sector, company_website, company_description, region, profile_completion")
      .eq("id", membership.employer_profile_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: profileError?.message || "Profil employeur introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        companyName: profile.company_name || "",
        sector: profile.sector || "",
        contactName: membership.full_name || "",
        email: membership.work_email || "",
        phone: membership.phone || "",
        website: profile.company_website || "",
        description: profile.company_description || "",
        region: regionFromDb[profile.region] || "",
        completion: profile.profile_completion || 0,
        isOwner: Boolean(membership.is_owner),
        preferred_locale: user.user_metadata?.preferred_locale === "en" ? "en" : "fr",
        match_alerts_enabled: user.user_metadata?.match_alerts_enabled !== false
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();

    const { data: membership, error: membershipError } = await supabase
      .from("employer_members")
      .select("employer_profile_id, is_owner")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json({ error: "Espace employeur introuvable." }, { status: 404 });
    }

    if (!membership.is_owner) {
      return NextResponse.json({ error: "Seul le propriétaire peut modifier l'entreprise." }, { status: 403 });
    }

    const normalized = {
      company_name: body.companyName?.trim() || "Nouvelle entreprise",
      sector: body.sector?.trim() || null,
      company_website: body.website?.trim() || null,
      company_description: body.description?.trim() || null,
      region: regionToDb[body.region] || null,
      full_name: body.contactName?.trim() || null,
      work_email: body.email?.trim() || user.email || null,
      phone: body.phone?.trim() || null
    };

    const profileCompletion = computeCompletion(normalized);

    const { error: profileError } = await supabase
      .from("employer_profiles")
      .update({
        company_name: normalized.company_name,
        sector: normalized.sector,
        company_website: normalized.company_website,
        company_description: normalized.company_description,
        region: normalized.region,
        profile_completion: profileCompletion
      })
      .eq("id", membership.employer_profile_id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const { error: memberUpdateError } = await supabase
      .from("employer_members")
      .update({
        full_name: normalized.full_name,
        work_email: normalized.work_email,
        phone: normalized.phone
      })
      .eq("employer_profile_id", membership.employer_profile_id)
      .eq("user_id", user.id);

    if (memberUpdateError) {
      return NextResponse.json({ error: memberUpdateError.message }, { status: 500 });
    }

    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        preferred_locale: body.preferred_locale === "en" ? "en" : "fr",
        match_alerts_enabled: body.match_alerts_enabled !== false
      }
    }).catch(() => {});

    return NextResponse.json({ ok: true, completion: profileCompletion });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
