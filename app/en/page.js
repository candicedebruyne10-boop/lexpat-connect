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
      .select("referrer_user_id")
      .not("referrer_user_id", "is", null);

    if (!referrals?.length) return [];

    const countMap = referrals.reduce((map, r) => {
      map.set(r.referrer_user_id, (map.get(r.referrer_user_id) || 0) + 1);
      return map;
    }, new Map());

    const topUserIds = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    if (!topUserIds.length) return [];

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("user_id, target_job, target_sector, preferred_region, experience_level")
      .in("user_id", topUserIds)
      .not("target_job", "is", null)
      .neq("target_job", "")
      .not("target_sector", "is", null)
      .neq("target_sector", "")
      .limit(10);

    if (error) throw error;
    if (!data?.length) return [];

    return data
      .sort((a, b) => (countMap.get(b.user_id) || 0) - (countMap.get(a.user_id) || 0))
      .slice(0, 3)
      .map((p) => ({
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
