import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  PresentationVideoSection,
  JobSectors,
  LexpatStrip,
  TestimonialsStrip,
  CtaBannerDark,
  MatchingPreview
} from "../../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Targeted matching for Belgian employers and international workers",
  description:
    "A targeted matching platform connecting Belgian employers with qualified international workers in shortage occupations. Secure recruitment, legal relay if needed."
};

export default function HomePageEn() {
  return (
    <>
      <HeroPremium
        locale="en"
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />
      <DualEntry locale="en" />
      <ShortageJobsQuickLink locale="en" />
      <HowItWorksPremium locale="en" />
      <MatchingPreview locale="en" />
      <PresentationVideoSection locale="en" />
      <JobSectors locale="en" />
      <LexpatStrip locale="en" />
      <TestimonialsStrip locale="en" />
      <CtaBannerDark
        locale="en"
        primaryHref="/en/employeurs"
        secondaryHref="/en/travailleurs"
      />
    </>
  );
}
