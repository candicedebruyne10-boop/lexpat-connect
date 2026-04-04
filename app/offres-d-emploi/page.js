import MemberDataShell from "../../components/MemberDataShell";

export const metadata = {
  title: "Offres d'emploi | LEXPAT Connect",
  description: "Toutes les offres d'emploi visibles aux membres de LEXPAT Connect."
};

const summaryCards = [
  { key: "total", label: "Offres publiées", tone: "blue" },
  { key: "urgent", label: "Offres urgentes", tone: "amber" },
  { key: "sectors", label: "Secteurs actifs", tone: "teal" }
];

const columns = [
  { key: "title", label: "Poste", primary: true, secondaryKey: "sector" },
  { key: "companyName", label: "Entreprise" },
  { key: "region", label: "Région" },
  { key: "contractType", label: "Contrat" },
  { key: "urgency", label: "Urgence" },
  { key: "status", label: "Statut" },
  { key: "createdAt", label: "Créée le" }
];

export default function OffresEmploiPage() {
  return (
    <MemberDataShell
      title="Offres d'emploi"
      intro="Cette page rassemble l’ensemble des offres publiées et visibles aux membres connectés. Elle permet de parcourir rapidement les besoins ouverts par entreprise, secteur et région."
      kicker="Espace membre"
      endpoint="/api/member/offers"
      loginPath="/offres-d-emploi"
      summaryCards={summaryCards}
      columns={columns}
      emptyLabel="Toutes les offres"
    />
  );
}
