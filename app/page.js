import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  JobSectors,
  LexpatStrip,
  CtaBannerDark
} from "../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Matching employeurs belges & talents internationaux",
  description:
    "La plateforme qui connecte directement les employeurs belges aux talents internationaux qualifiés dans les métiers en pénurie. Matching rapide, mise en relation directe, accompagnement juridique si nécessaire."
};

export default function HomePage() {
  return (
    <>
      {/* Section 1 — Hero ultra direct : impact immédiat, 2 CTA cartes */}
      <HeroPremium
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />

      {/* Section 2 — Double entrée : 2 cartes premium élaborées */}
      <DualEntry />

      <ShortageJobsQuickLink />

      {/* Section 3 — Comment ça marche : 3 étapes, zéro jargon */}
      <HowItWorksPremium />

      {/* Section 4 — Métiers en pénurie : les secteurs les plus recherchés */}
      <JobSectors />

      {/* Section 5 — Relais LEXPAT : discret, stratégique, post-match uniquement */}
      <LexpatStrip />

      {/* Section 6 — CTA final sombre : conversion maximale */}
      <CtaBannerDark
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />
    </>
  );
}
