import LegalPageLayout from "../../../components/LegalPageLayout";

export const metadata = {
  title: "Legal notice | LEXPAT Connect",
  description:
    "Legal notice for LEXPAT Connect: publisher, hosting, purpose of the platform, liability, intellectual property and applicable law."
};

const sections = [
  {
    id: "publisher",
    eyebrow: "Website publisher",
    title: "Website publisher",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        <strong className="text-[#1d3b8b]">LEXPAT SRL</strong>
        <br />
        Law firm focused on economic immigration and international mobility
        <br />
        Belgium
        <br />
        Email: lexpat@lexpat.be
        <br />
        Publishing director: Candice Debruyne
      </p>
    )
  },
  {
    id: "hosting",
    eyebrow: "Infrastructure",
    title: "Hosting and domain name",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          The website is hosted by:
          <br />
          <strong className="text-[#1d3b8b]">Vercel Inc.</strong>
          <br />
          440 N Barranca Ave #4133
          <br />
          Covina, CA 91723
          <br />
          United States
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          The domain name is registered through:
          <br />
          <strong className="text-[#1d3b8b]">OVH SAS / OVHcloud</strong>
          <br />
          2 rue Kellermann
          <br />
          59100 Roubaix
          <br />
          France
        </p>
      </>
    )
  },
  {
    id: "purpose",
    eyebrow: "Platform",
    title: "Purpose of the platform",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect is a platform that connects Belgian employers with international workers in shortage occupations in Belgium.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          The platform facilitates matching. The LEXPAT law firm may intervene separately after matching for single permit, right-to-work and economic immigration matters.
        </p>
      </>
    )
  },
  {
    id: "liability",
    eyebrow: "Use",
    title: "Liability",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Users remain responsible for the profiles, information, needs and offers they publish. LEXPAT Connect provides a matching framework without guaranteeing the accuracy, completeness or outcome of any recruitment process.
      </p>
    )
  },
  {
    id: "intellectual-property",
    eyebrow: "Protection",
    title: "Intellectual property",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        All content, logo, UX, visuals, components and databases available on the site remain the property of LEXPAT SRL unless otherwise stated. Any unauthorized reproduction, adaptation or exploitation is prohibited.
      </p>
    )
  },
  {
    id: "applicable-law",
    eyebrow: "Legal framework",
    title: "Applicable law",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        This website and its use are governed by Belgian law. In the event of a dispute, only the competent courts of Belgium shall have jurisdiction, unless mandatory legal provisions provide otherwise.
      </p>
    )
  }
];

export default function LegalNoticePageEn() {
  return (
    <LegalPageLayout
      title="Legal notice"
      intro="This legal notice sets out the identity of the publisher, the website's technical infrastructure and the general rules applicable to the use of the platform."
      sections={sections}
    />
  );
}
