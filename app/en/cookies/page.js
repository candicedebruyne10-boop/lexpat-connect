import LegalPageLayout from "../../../components/LegalPageLayout";

export const metadata = {
  title: "Cookie policy | LEXPAT Connect",
  description:
    "Cookie policy for LEXPAT Connect: essential cookies, possible analytics tools, retention periods and preference management."
};

const sections = [
  {
    id: "role",
    eyebrow: "Cookies",
    title: "Why this cookie policy?",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        This page explains the role of cookies and similar technologies used on LEXPAT Connect, as well as how your preferences can be managed.
      </p>
    )
  },
  {
    id: "essential",
    eyebrow: "Essential",
    title: "Strictly necessary cookies",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Some cookies or technical storage are necessary for the proper functioning of the website, in particular for security, session stability, authentication, page display and form submission.
      </p>
    )
  },
  {
    id: "analytics",
    eyebrow: "Analytics",
    title: "Audience measurement and analytics, where applicable",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        If analytics tools are activated, their purpose is to improve user experience, the readability of user journeys and the overall performance of the website. Where consent is required, these tools should only be enabled after acceptance.
      </p>
    )
  },
  {
    id: "retention",
    eyebrow: "Retention",
    title: "Retention periods",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Retention depends on the nature of the cookie or technology used. Essential cookies are kept only for the time strictly necessary to provide the service. Analytics cookies, where they exist, are kept for a limited and proportionate period.
      </p>
    )
  },
  {
    id: "consent",
    eyebrow: "Consent",
    title: "Consent and preference management",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        The website is intended to include a cookie banner allowing you to accept, refuse or customize your preferences. You may also configure your browser to block or delete certain cookies, provided this does not impair essential features.
      </p>
    )
  },
  {
    id: "future",
    eyebrow: "Future updates",
    title: "Future evolution of the cookie banner",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        This policy is designed to remain consistent with a future cookie banner and preference center. Its content may be updated if new tools, providers or consent mechanisms are added to the website.
      </p>
    )
  }
];

export default function CookiesPageEn() {
  return (
    <LegalPageLayout
      title="Cookie policy"
      intro="We use a restrained and transparent cookie approach focused on the proper functioning of the website and, where relevant, on reasonable and controlled audience measurement."
      sections={sections}
    />
  );
}
