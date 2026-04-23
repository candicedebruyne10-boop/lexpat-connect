import {
  HeroPremium,
  ConversionBar,
  DualEntry,
  FeaturedProfiles,
  ShortageJobsQuickLink,
  SimulateurTeaser,
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
 * - workers qui ont partagé leur lien d'affiliation (referrer_user_id dans referrals)
 * - classés par nombre de liens partagés (les plus actifs en premier)
 * - profil complet (profile_completion >= 60) + visible
 * Données anonymisées — aucun identifiant personnel.
 */
async function getFeaturedProfiles() {
  try {
    const supabase = getServiceClient();

    // 1. Compter les liens partagés par referrer_user_id
    const { data: referrals } = await supabase
      .from("referrals")
      .select("referrer_user_id")
      .not("referrer_user_id", "is", null);

    if (!referrals?.length) return [];

    // Agréger : { user_id → nb de liens partagés }
    const countMap = referrals.reduce((map, r) => {
      map.set(r.referrer_user_id, (map.get(r.referrer_user_id) || 0) + 1);
      return map;
    }, new Map());

    // Trier par nombre décroissant, garder les top user IDs
    const topUserIds = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    if (!topUserIds.length) return [];

    // 2. Leurs profils avec job + secteur renseignés (= effectivement visibles)
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

    // 3. Réordonner par nombre de liens partagés décroissant, garder 3
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

async function getTotalOnlineProfiles() {
  try {
    const supabase = getServiceClient();
    const { count } = await supabase
      .from("worker_profiles")
      .select("id", { count: "exact", head: true })
      .eq("profile_visibility", "visible")
      .not("target_job", "is", null)
      .neq("target_job", "")
      .not("target_sector", "is", null)
      .neq("target_sector", "");
    return count || 0;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const [featuredProfiles, totalOnline] = await Promise.all([
    getFeaturedProfiles(),
    getTotalOnlineProfiles(),
  ]);
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

      {featuredProfiles.length > 0 && (
        <FeaturedProfiles profiles={featuredProfiles} totalOnline={totalOnline} />
      )}

      <div id="metiers-en-penurie">
        <ShortageJobsQuickLink />
      </div>

      <div id="simulateur">
        <SimulateurTeaser />
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
