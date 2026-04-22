import {
  HeroPremium,
  ConversionBar,
  DualEntry,
  FeaturedProfiles,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  PresentationVideoSection,
  JobSectors,
  LexpatStrip,
  TestimonialsStrip,
  CtaBannerDark,
  MatchingPreview
} from "../../components/Sections";
import { getServiceClient } from "../../lib/supabase/server";
import { normalizeRegion } from "../../lib/matching";

export const metadata = {
  title: "LEXPAT Connect — Targeted matching for Belgian employers and international workers",
  description:
    "A targeted matching platform connecting Belgian employers with qualified international workers in shortage occupations. Secure recruitment, legal relay if needed."
};

async function getFeaturedProfiles() {
  try {
    const supabase = getServiceClient();

    const { data: referrals } = await supabase
      .from("referrals")
      .select("referee_user_id")
      .eq("attribution_source", "manual_code")
      .not("referee_user_id", "is", null);

    if (!referrals?.length) return [];

    const userIds = [...new Set(referrals.map((r) => r.referee_user_id))];

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("target_job, target_sector, preferred_region, experience_level")
      .eq("profile_visibility", "visible")
      .gte("profile_completion", 60)
      .in("user_id", userIds)
      .not("target_job", "is", null)
      .neq("target_job", "")
      .not("target_sector", "is", null)
      .neq("target_sector", "")
      .order("updated_at", { ascending: false })
      .limit(3);

    if (error) throw error;

    return (data || []).map((p) => ({
      jobTitle:   p.target_job,
      sector:     p.target_sector,
      region:     normalizeRegion(p.preferred_region),
      experience: p.experience_level || null,
    }));
  } catch {
    return [];
  }
}

export default async function HomePageEn() {
  const featuredProfiles = await getFeaturedProfiles();
  return (
    <>
      <HeroPremium
        locale="en"
        primaryHref="/en/base-de-profils"
        secondaryHref="/en/simulateur-eligibilite"
        showProofCard={true}
      />

      <ConversionBar locale="en" />

      <div id="acces">
        <DualEntry locale="en" />
      </div>

      {featuredProfiles.length > 0 && (
        <FeaturedProfiles profiles={featuredProfiles} locale="en" />
      )}

      <div id="metiers-en-penurie">
        <ShortageJobsQuickLink locale="en" />
      </div>

      <div id="comment-ca-marche">
        <HowItWorksPremium locale="en" />
      </div>

      <div id="mise-en-relation">
        <MatchingPreview locale="en" />
      </div>

      <PresentationVideoSection locale="en" />

      <div id="secteurs">
        <JobSectors locale="en" />
      </div>

      <div id="lexpat">
        <LexpatStrip locale="en" />
      </div>

      <TestimonialsStrip locale="en" />

      <CtaBannerDark
        locale="en"
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />
    </>
  );
}
