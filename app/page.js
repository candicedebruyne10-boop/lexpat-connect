import {
  HeroPremium,
  FeaturedProfiles,
  ShortageJobsQuickLink,
  SimulateurTeaser,
  HowItWorksPremium,
  LexpatStrip,
  TestimonialsStrip,
} from "../components/Sections";
import { getServiceClient } from "../lib/supabase/server";
import { normalizeRegion } from "../lib/matching";

import { alternatesFor } from "../lib/seo-alternates";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lexpat-connect.be/#organization",
      "name": "LEXPAT Connect",
      "url": "https://lexpat-connect.be",
      "logo": "https://lexpat-connect.be/logo-lexpat-connect.png",
      "description": "Plateforme belge de mise en relation entre employeurs et travailleurs internationaux qualifiés dans les métiers en pénurie. Permis unique géré par le cabinet d'avocats LEXPAT si nécessaire.",
      "foundingLocation": { "@type": "Place", "name": "Bruxelles, Belgique" },
      "areaServed": { "@type": "Country", "name": "Belgique" },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://lexpat-connect.be/contact",
        "availableLanguage": ["French", "English"]
      },
      "sameAs": ["https://www.lexpat.be"]
    },
    {
      "@type": "WebSite",
      "@id": "https://lexpat-connect.be/#website",
      "url": "https://lexpat-connect.be",
      "name": "LEXPAT Connect",
      "publisher": { "@id": "https://lexpat-connect.be/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lexpat-connect.be/simulateur-eligibilite?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Service",
      "@id": "https://lexpat-connect.be/#service",
      "name": "Recrutement international dans les métiers en pénurie en Belgique",
      "provider": { "@id": "https://lexpat-connect.be/#organization" },
      "serviceType": "Recrutement international",
      "areaServed": { "@type": "Country", "name": "Belgique" },
      "description": "Mise en relation entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie (Actiris, Forem, VDAB). Accompagnement permis unique par le cabinet LEXPAT si nécessaire.",
      "url": "https://lexpat-connect.be/employeurs"
    }
  ]
};

export const metadata = {
  alternates: alternatesFor("/"),
  title: "LEXPAT Connect — Recrutez un profil international qualifié en Belgique, sans vous perdre dans les démarches",
  description:
    "Trouvez des travailleurs internationaux qualifiés dans les métiers en pénurie en Belgique. Profils disponibles dès maintenant — et si un permis unique est nécessaire, le cabinet d'avocats LEXPAT prend le relais."
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroPremium
        primaryHref="/base-de-profils"
        secondaryHref="/simulateur-eligibilite"
        showProofCard={true}
      />

      <div id="comment-ca-marche">
        <HowItWorksPremium />
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

      <TestimonialsStrip />

      <div id="lexpat">
        <LexpatStrip />
      </div>
    </>
  );
}
