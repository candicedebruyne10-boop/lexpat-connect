import MemberDataShell from "../../components/MemberDataShell";

export const metadata = {
  title: "Candidatures | LEXPAT Connect",
  description: "Vue membre des candidatures anonymisées sur LEXPAT Connect."
};

const summaryCards = [
  { key: "total", label: "Candidatures", tone: "blue" },
  { key: "shortlisted", label: "Présélectionnées", tone: "teal" },
  { key: "sectors", label: "Secteurs visibles", tone: "amber" }
];

const columns = [
  { key: "candidateLabel", label: "Profil candidat", primary: true, secondaryKey: "sector" },
  { key: "companyName", label: "Entreprise" },
  { key: "offerTitle", label: "Poste" },
  { key: "region", label: "Région" },
  { key: "experience", label: "Expérience" },
  { key: "status", label: "Statut" },
  { key: "createdAt", label: "Déposée le" }
];

export default function CandidaturesPage() {
  return (
    <MemberDataShell
      title="Candidatures"
      intro="Cette vue expose uniquement des données non personnelles, pour permettre aux membres de comprendre le niveau d’activité de la plateforme sans dévoiler l’identité des candidats."
      kicker="Espace membre"
      endpoint="/api/member/applications"
      loginPath="/candidatures"
      summaryCards={summaryCards}
      columns={columns}
      emptyLabel="Candidatures anonymisées"
    />
  );
}
