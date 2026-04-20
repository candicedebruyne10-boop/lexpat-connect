import MessagerieApp from "../../components/Messagerie";

export const metadata = {
  title: "Messagerie — LEXPAT Connect",
  description:
    "Vos conversations avec vos matchs. Double intérêt validé : échangez directement avec employeurs et candidats.",
  robots: { index: false, follow: false },
};

export default function MessageriePage() {
  return <MessagerieApp locale="fr" />;
}
