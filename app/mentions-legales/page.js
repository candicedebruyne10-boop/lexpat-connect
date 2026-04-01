import LegalPageLayout from "../../components/LegalPageLayout";

export const metadata = {
  title: "Mentions légales | LEXPAT Connect",
  description:
    "Mentions légales de LEXPAT Connect : éditeur, hébergement, objet de la plateforme, responsabilité, propriété intellectuelle et droit applicable."
};

const sections = [
  {
    id: "editeur",
    eyebrow: "Éditeur du site",
    title: "Éditeur du site",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          <strong className="text-[#1d3b8b]">LEXPAT SRL</strong><br />
          Cabinet d’avocats spécialisé en immigration économique et mobilité internationale<br />
          Belgique<br />
          Email : contact@lexpat-connect.be<br />
          Responsable de la publication : Candice Debruyne
        </p>
      </>
    )
  },
  {
    id: "hebergement",
    eyebrow: "Infrastructure",
    title: "Hébergement et nom de domaine",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Le site est hébergé par :<br />
          <strong className="text-[#1d3b8b]">Vercel Inc.</strong><br />
          440 N Barranca Ave #4133<br />
          Covina, CA 91723<br />
          États-Unis
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Nom de domaine enregistré auprès de :<br />
          <strong className="text-[#1d3b8b]">OVH SAS / OVHcloud</strong><br />
          2 rue Kellermann<br />
          59100 Roubaix<br />
          France
        </p>
      </>
    )
  },
  {
    id: "objet",
    eyebrow: "Plateforme",
    title: "Objet de la plateforme",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect est une plateforme de mise en relation entre les employeurs belges et les talents internationaux dans les métiers en pénurie en Belgique.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          La plateforme facilite la mise en relation. Le cabinet LEXPAT peut intervenir séparément après le matching pour le permis unique, le droit au travail et l’immigration économique.
        </p>
      </>
    )
  },
  {
    id: "responsabilite",
    eyebrow: "Utilisation",
    title: "Responsabilité",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Les utilisateurs restent responsables des profils, informations, besoins et offres publiés. LEXPAT Connect met à disposition un cadre de mise en relation, sans garantir l’exactitude, l’exhaustivité ou l’issue d’un recrutement.
      </p>
    )
  },
  {
    id: "propriete",
    eyebrow: "Protection",
    title: "Propriété intellectuelle",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Tous les contenus, logo, UX, visuels, composants et bases de données présents sur le site restent la propriété de LEXPAT SRL, sauf mentions contraires. Toute reproduction, adaptation ou exploitation non autorisée est interdite.
      </p>
    )
  },
  {
    id: "droit-applicable",
    eyebrow: "Cadre juridique",
    title: "Droit applicable",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Le présent site et son utilisation sont régis par le droit belge. En cas de litige, les tribunaux compétents de Belgique sont seuls compétents, sauf disposition légale impérative contraire.
      </p>
    )
  }
];

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      intro="Les présentes mentions légales détaillent l’identité de l’éditeur, l’infrastructure technique du site et les règles générales applicables à l’utilisation de la plateforme."
      sections={sections}
    />
  );
}
