import MemberDataShell from "../../components/MemberDataShell";

export const metadata = {
  title: "Base de profils talents | LEXPAT Connect",
  description: "Parcourez les profils de talents internationaux disponibles sur LEXPAT Connect."
};

const summaryCards = [
  { key: "total",   label: "Profils disponibles", tone: "blue" },
  { key: "sectors", label: "Secteurs représentés", tone: "teal" },
  { key: "regions", label: "Régions couvertes",    tone: "amber" },
];

const columns = [
  { key: "fullName",   label: "Candidat",    primary: true, secondaryKey: "jobTitle" },
  { key: "sector",     label: "Secteur" },
  { key: "region",     label: "Région" },
  { key: "experience", label: "Expérience" },
  { key: "languages",  label: "Langues" },
  { key: "updatedAt",  label: "Mis à jour" },
];

export default function BaseDeProfilsPage() {
  return (
    <MemberDataShell
      title="Base de profils talents"
      intro="Retrouvez ici les profils de candidats internationaux ayant rendu leur profil visible. Filtrez par secteur ou région pour identifier rapidement les talents correspondant à vos besoins."
      kicker="Espace employeur"
      endpoint="/api/member/profiles"
      loginPath="/base-de-profils"
      summaryCards={summaryCards}
      columns={columns}
      emptyLabel="Tous les profils"
    />
  );
}
