import LegalPageLayout from "../../components/LegalPageLayout";

export const metadata = {
  title: "Conditions d’utilisation | LEXPAT Connect",
  description:
    "Conditions d’utilisation de LEXPAT Connect : accès au site, obligations des employeurs et travailleurs, rôle de la plateforme, responsabilité et droit applicable."
};

const sections = [
  {
    id: "acces",
    eyebrow: "Accès au site",
    title: "Accès et objet des conditions d’utilisation",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Les présentes conditions régissent l’accès et l’utilisation de LEXPAT Connect, plateforme de mise en relation entre employeurs belges et travailleurs internationaux dans les métiers en pénurie. L’utilisation du site implique l’acceptation des présentes conditions.
      </p>
    )
  },
  {
    id: "employeurs",
    eyebrow: "Employeurs",
    title: "Obligations des employeurs",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Les employeurs s’engagent à publier des besoins de recrutement sérieux, licites, exacts et à jour. Ils s’interdisent toute offre trompeuse, discriminatoire, illicite ou contraire au droit belge applicable au travail et au recrutement.
      </p>
    )
  },
  {
    id: "travailleurs",
    eyebrow: "Travailleurs",
    title: "Obligations des travailleurs internationaux",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Les travailleurs s’engagent à fournir des informations exactes, loyales et actualisées sur leur identité, leur parcours, leurs compétences, leur disponibilité et leur situation professionnelle. Ils restent responsables des documents et déclarations transmis via la plateforme.
      </p>
    )
  },
  {
    id: "veracite",
    eyebrow: "Véracité",
    title: "Véracité des informations et contenus interdits",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Tous les utilisateurs doivent s’abstenir de publier des contenus illicites, diffamatoires, frauduleux, trompeurs, discriminatoires ou portant atteinte aux droits de tiers. Toute utilisation abusive de la plateforme peut entraîner une suspension ou une suppression d’accès.
      </p>
    )
  },
  {
    id: "role-plateforme",
    eyebrow: "Rôle de LEXPAT Connect",
    title: "Rôle limité de la plateforme",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect met à disposition un cadre de matching et de mise en relation. La plateforme n’est pas un employeur, n’agit pas comme agence de placement au sens le plus large du terme, et ne garantit ni l’aboutissement d’un recrutement ni l’obtention d’un emploi.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          La mise en relation n’emporte aucune garantie d’embauche, de collaboration ou de conclusion contractuelle.
        </p>
      </>
    )
  },
  {
    id: "juridique",
    eyebrow: "Relais distinct",
    title: "Relais juridique séparé",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Lorsque la mise en relation nécessite un accompagnement en matière de permis unique, de droit au travail ou d’immigration économique, le cabinet LEXPAT peut intervenir séparément. Cette intervention relève d’un cadre distinct de la simple utilisation de la plateforme.
      </p>
    )
  },
  {
    id: "responsabilite",
    eyebrow: "Limitation",
    title: "Limitation de responsabilité",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        LEXPAT Connect ne peut être tenue responsable des décisions de recrutement, de l’absence de matching, d’un refus d’embauche, de l’inexactitude des informations fournies par les utilisateurs ou d’un préjudice résultant directement d’un échange entre employeur et talent, sauf faute lourde ou disposition légale impérative contraire.
      </p>
    )
  },
  {
    id: "droit-applicable",
    eyebrow: "Cadre juridique",
    title: "Droit applicable",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Les présentes conditions sont soumises au droit belge. Tout litige relatif à l’utilisation de la plateforme relève des juridictions compétentes en Belgique, sauf disposition impérative contraire.
      </p>
    )
  }
];

export default function ConditionsUtilisationPage() {
  return (
    <LegalPageLayout
      title="Conditions d’utilisation"
      intro="Ces conditions précisent les règles applicables à l’utilisation de LEXPAT Connect par les employeurs, les travailleurs internationaux et les visiteurs du site."
      sections={sections}
    />
  );
}
