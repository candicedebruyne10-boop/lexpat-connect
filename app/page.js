import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  SecurityComplianceTeaser,
  HowItWorksPremium,
  JobSectors,
  LexpatStrip,
  CtaBannerDark
} from "../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Mise en relation ciblée employeurs belges & travailleurs internationaux",
  description:
    "La plateforme de mise en relation ciblée entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie. Recrutement sécurisé, accompagnement juridique si nécessaire."
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

      <SecurityComplianceTeaser />

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
