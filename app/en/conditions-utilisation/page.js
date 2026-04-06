import LegalPageLayout from "../../../components/LegalPageLayout";

export const metadata = {
  title: "Terms of use | LEXPAT Connect",
  description:
    "Terms of use of LEXPAT Connect: access to the website, obligations of employers and workers, role of the platform, liability and applicable law."
};

const sections = [
  {
    id: "access",
    eyebrow: "Access to the website",
    title: "Access and purpose of these terms",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        These terms govern access to and use of LEXPAT Connect, a platform that connects Belgian employers with international workers in shortage occupations. Using the website implies acceptance of these terms.
      </p>
    )
  },
  {
    id: "employers",
    eyebrow: "Employers",
    title: "Employer obligations",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Employers undertake to publish serious, lawful, accurate and up-to-date recruitment needs. They must refrain from posting misleading, discriminatory, unlawful offers or offers contrary to Belgian employment and recruitment law.
      </p>
    )
  },
  {
    id: "workers",
    eyebrow: "Workers",
    title: "Obligations of international workers",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Workers undertake to provide accurate, fair and up-to-date information regarding their identity, professional background, skills, availability and professional situation. They remain responsible for the documents and statements shared through the platform.
      </p>
    )
  },
  {
    id: "accuracy",
    eyebrow: "Accuracy",
    title: "Accuracy of information and prohibited content",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        All users must refrain from publishing unlawful, defamatory, fraudulent, misleading or discriminatory content, or any content that infringes the rights of third parties. Any misuse of the platform may lead to suspension or removal of access.
      </p>
    )
  },
  {
    id: "platform-role",
    eyebrow: "Role of LEXPAT Connect",
    title: "Limited role of the platform",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect provides a framework for matching and introductions. The platform is not an employer, does not act as a placement agency in the broadest sense, and does not guarantee either a successful recruitment or the obtaining of a job.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          A match or introduction does not imply any guarantee of hiring, collaboration or contractual conclusion.
        </p>
      </>
    )
  },
  {
    id: "legal-relay",
    eyebrow: "Separate relay",
    title: "Separate legal support",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        When a match requires support for a single permit, right to work or economic immigration, the LEXPAT law firm may intervene separately. That intervention belongs to a framework distinct from the mere use of the platform.
      </p>
    )
  },
  {
    id: "liability",
    eyebrow: "Limitation",
    title: "Limitation of liability",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        LEXPAT Connect cannot be held liable for recruitment decisions, absence of matching, refusal to hire, inaccurate information provided by users, or damage resulting directly from exchanges between an employer and a talent, except in the case of gross negligence or mandatory legal provisions to the contrary.
      </p>
    )
  },
  {
    id: "applicable-law",
    eyebrow: "Legal framework",
    title: "Applicable law",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        These terms are governed by Belgian law. Any dispute relating to the use of the platform falls within the jurisdiction of the competent courts in Belgium, unless mandatory provisions provide otherwise.
      </p>
    )
  }
];

export default function TermsOfUsePageEn() {
  return (
    <LegalPageLayout
      title="Terms of use"
      intro="These terms set out the rules applicable to the use of LEXPAT Connect by employers, international workers and website visitors."
      sections={sections}
    />
  );
}
