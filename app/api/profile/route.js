import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../lib/supabase/server";
import { normalizeRegion } from "../../../lib/matching";
import { parseRegionSelection } from "../../../lib/professions";

const regionToDb = {
  "Bruxelles-Capitale": "brussels",
  Wallonie: "wallonia",
  Flandre: "flanders",
  "Plusieurs régions": "multi_region",
  "Toute la Belgique": "multi_region"
};

export async function POST(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);
    const body = await request.json();
    const selectedJobOption = body.job_option || body.profession || body.job_title || "";
    const otherJobTitle = body.job_title_other || body.otherProfession || "";
    const finalJobTitle =
      selectedJobOption === "Autre profession"
        ? otherJobTitle || ""
        : selectedJobOption || "";
    const selectedRegions = parseRegionSelection(body.region || body.regions);
    const normalizedRegion =
      selectedRegions.length > 1
        ? "multi_region"
        : regionToDb[selectedRegions[0]] || null;
    const languages = Array.isArray(body.languages)
      ? body.languages
      : String(body.languages || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const { error } = await supabase
      .from("worker_profiles")
      .update({
        target_job: finalJobTitle || null,
        target_job_other: selectedJobOption === "Autre profession" ? otherJobTitle || null : null,
        target_sector: body.sector || null,
        preferred_region: normalizedRegion,
        experience_level: body.experience || null,
        languages,
        summary: body.description || null,
        full_name: body.full_name || null,
        profile_visibility: body.profile_visibility || "review"
      })
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * GET /api/profile
 * Returns the worker profile for the authenticated user.
 */
export async function GET(request) {
  try {
    const { user, supabase } = await getUserFromRequest(request);

    const { data } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      profile: data
        ? {
            ...data,
            job_title: data.target_job || "",
            job_option: data.target_job_other ? "Autre profession" : data.target_job || "",
            otherProfession: data.target_job_other || "",
            sector: data.target_sector || "",
            region: normalizeRegion(data.preferred_region),
            regions: parseRegionSelection(data.preferred_region),
            experience: data.experience_level || "",
            languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "",
            description: data.summary || ""
          }
        : null
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
