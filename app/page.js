import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  PresentationVideoSection,
  JobSectors,
  LexpatStrip,
  CtaBannerDark,
  MatchingPreview
} from "../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Mise en relation ciblée employeurs belges & travailleurs internationaux",
  description:
    "La plateforme de mise en relation ciblée entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie. Recrutement sécurisé, accompagnement juridique si nécessaire."
};

export default function HomePage() {
  return (
    <>
      <HeroPremium
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />
      <DualEntry />
      <ShortageJobsQuickLink />
      <HowItWorksPremium />
      <MatchingPreview />
      <PresentationVideoSection />
      <JobSectors />
      <LexpatStrip />
      <CtaBannerDark
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />
    </>
  );
}
