import LegalPageLayout from "../../../components/LegalPageLayout";

export const metadata = {
  title: "Privacy policy | LEXPAT Connect",
  description:
    "GDPR privacy policy for LEXPAT Connect: data collected, purposes, legal bases, retention, data subject rights and contact details."
};

const sections = [
  {
    id: "principles",
    eyebrow: "GDPR",
    title: "Our approach to privacy",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect processes personal data with a clear purpose: enabling credible, professional and secure matching between Belgian employers and international workers.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          We apply the principles of the General Data Protection Regulation (GDPR), including purpose limitation, data minimization, accuracy, security and transparency.
        </p>
      </>
    )
  },
  {
    id: "controller",
    eyebrow: "Data controller",
    title: "Who decides how data is processed?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          For processing related to the matching platform, website forms, user accounts, applications, messaging and tester feedback, the data controller is <strong className="text-[#1d3b8b]">LEXPAT SRL</strong>, through LEXPAT Connect.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          When a matter moves into a separate legal support workflow, the LEXPAT law firm acts within a distinct framework, with its own purposes, obligations and, where applicable, its own legal basis.
        </p>
      </>
    )
  },
  {
    id: "data",
    eyebrow: "Collected data",
    title: "What data may be collected?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          For international workers: identity data, contact details, location, languages, availability, experience, skills, CV, information about the target occupation, target sector and any administrative status shared voluntarily.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          For employers: company identity, contact details, recruitment needs, relevant shortage occupation, region, contact information and offer-related criteria.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          For contact forms and email exchanges: name, email address, phone number, message content, exchange history and information useful to handling the request.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          For website use: technical data strictly necessary to operate the service, session information, cookie preferences and, if you allow them, non-essential audience measurement data.
        </p>
      </>
    )
  },
  {
    id: "purposes",
    eyebrow: "Purposes",
    title: "Why do we use this data?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Data is used to receive requests, structure profiles and needs, enable matching, organize introductions and ensure the operational follow-up of the platform.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          When necessary after a match, some information may also be used to route a matter to the LEXPAT law firm in connection with a single permit, right to work or economic immigration.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Website forms may also trigger an email sent to the LEXPAT Connect contact mailbox so requests can be handled more quickly.
        </p>
      </>
    )
  },
  {
    id: "legal-basis",
    eyebrow: "Legal basis",
    title: "Legal basis for processing",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Depending on the situation, processing is based on pre-contractual steps, the legitimate interest of LEXPAT Connect in organizing matching, compliance with legal obligations, or consent where required.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Non-essential cookies or audience measurement tools rely on your choice. Core platform processing mainly relies on pre-contractual steps, legitimate operational interests and, where required by law, legal obligations.
        </p>
      </>
    )
  },
  {
    id: "retention",
    eyebrow: "Retention",
    title: "How long do we keep data?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Data is not kept indefinitely. It is reviewed by category and may be deleted, anonymized or archived when no longer useful, or where a legal obligation requires a specific retention period.
        </p>
        <ul className="mt-4 space-y-3 text-base leading-8 text-[#5c6e84]">
          <li>Contact forms and inbound requests: up to 24 months after the last useful exchange.</li>
          <li>Worker and employer profiles: for as long as the account remains active, then review or deletion after a prolonged period of inactivity.</li>
          <li>Applications, matching records and messaging: during the active relationship, then archiving or deletion depending on operational need and legal obligations.</li>
          <li>Tester feedback: short product-work retention, in principle up to 12 months unless a longer follow-up is needed.</li>
        </ul>
      </>
    )
  },
  {
    id: "recipients",
    eyebrow: "Access",
    title: "Who can access the data?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Data is accessible only to authorized persons within LEXPAT Connect and, when necessary, to the LEXPAT law firm. Matching naturally involves the transfer of relevant information between employers and workers, strictly to the extent useful for the connection.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Some directories shown to members are intentionally anonymized or partially masked until a more advanced relationship is justified.
        </p>
      </>
    )
  },
  {
    id: "transfers",
    eyebrow: "Processors",
    title: "Hosting, tools and possible transfers",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          The site is deployed on Vercel. Some data or technical metadata may therefore transit through or be hosted on this infrastructure. The platform may also rely on Supabase for authentication, database and application storage.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          The site may also use Resend for certain transactional emails or notifications. Where processing involves service providers located outside the European Union, we seek to frame such transfers using appropriate safeguards provided for by the GDPR.
        </p>
      </>
    )
  },
  {
    id: "rights",
    eyebrow: "Your rights",
    title: "Your GDPR rights",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          You have, in particular, the right of access, rectification, erasure, restriction, objection and, where applicable, the right to data portability. You may also withdraw your consent when processing is based on consent.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          You may also lodge a complaint with the competent data protection authority in Belgium.
        </p>
      </>
    )
  },
  {
    id: "contact",
    eyebrow: "Privacy contact",
    title: "Contact us",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          For any question about your personal data or to exercise your rights, you may write to: <strong className="text-[#1d3b8b]">contact@lexpat-connect.be</strong>.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          You may also ask for more detail about retention logic, subprocessors used and the point at which a matter moves from the platform to the law firm.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          This policy is interpreted in accordance with Belgian law and the GDPR framework applicable in the European Union.
        </p>
      </>
    )
  }
];

export default function PrivacyPolicyPageEn() {
  return (
    <LegalPageLayout
      title="Privacy policy"
      intro="This policy explains in a clear way how LEXPAT Connect collects, uses, keeps and protects the personal data of employers, international workers and users of the website forms."
      sections={sections}
      locale="en"
    />
  );
}
