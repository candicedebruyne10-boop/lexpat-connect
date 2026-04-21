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
} from "../components/Sections";
import { getServiceClient } from "../lib/supabase/server";
import { normalizeRegion } from "../lib/matching";

export const metadata = {
  title: "LEXPAT Connect — Mise en relation ciblée employeurs belges & travailleurs internationaux",
  description:
    "La plateforme de mise en relation ciblée entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie. Recrutement sécurisé, accompagnement juridique si nécessaire."
};

/**
 * Retourne les profils mis en avant sur la homepage :
 * - inscrits via un lien d'affiliation (attribution_source = 'link')
 * - profil complet (profile_completion >= 60)
 * - profil visible
 * Données anonymisées — aucun identifiant personnel.
 */
async function getFeaturedProfiles() {
  try {
    const supabase = getServiceClient();

    // 1. User IDs ayant saisi un code d'affiliation
    const { data: referrals } = await supabase
      .from("referrals")
      .select("referee_user_id")
      .eq("attribution_source", "manual_code")
      .not("referee_user_id", "is", null);

    if (!referrals?.length) return [];

    const userIds = [...new Set(referrals.map((r) => r.referee_user_id))];

    // 2. Leurs profils visibles et complets
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

export default async function HomePage() {
  const featuredProfiles = await getFeaturedProfiles();
  return (
    <>
      <HeroPremium
        primaryHref="/base-de-profils"
        secondaryHref="/simulateur-eligibilite"
        showProofCard={true}
      />

      <ConversionBar />

      <div id="acces">
        <DualEntry />
      </div>

      {/* Profils affiliés + complets — uniquement si des profils existent */}
      {featuredProfiles.length > 0 && (
        <FeaturedProfiles profiles={featuredProfiles} />
      )}

      <div id="metiers-en-penurie">
        <ShortageJobsQuickLink />
      </div>

      <div id="comment-ca-marche">
        <HowItWorksPremium />
      </div>

      <div id="mise-en-relation">
        <MatchingPreview />
      </div>

      <PresentationVideoSection />

      <div id="secteurs">
        <JobSectors />
      </div>

      <div id="lexpat">
        <LexpatStrip />
      </div>

      <TestimonialsStrip />

      <CtaBannerDark
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />
    </>
  );
}
