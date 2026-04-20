import { Hero, Section } from "../../components/Sections";
import TestFeedbackForm from "../../components/TestFeedbackForm";

const useCases = [
  "Signaler un bug ou un blocage",
  "Dire qu'une page n'est pas claire",
  "Partager une idée simple d'amélioration",
  "Nous aider à rendre la plateforme plus utile"
];

export const metadata = {
  title: "Retours testeurs | LEXPAT Connect",
  description:
    "Page dédiée pour centraliser les retours utilisateurs de test sur LEXPAT Connect.",
  robots: { index: false, follow: false },
};

export default function RetoursTestPage() {
  return (
    <>
      <Hero
        badge="Vos retours"
        title={
          <>
            Aidez-nous à améliorer
            <span className="block text-[#57b7af]">LEXPAT Connect</span>
          </>
        }
        description="Vous avez repéré un bug, une incompréhension ou simplement une idée utile ? Partagez-la ici en quelques lignes. Chaque retour nous aide à rendre la plateforme plus claire, plus fluide et plus humaine."
        primaryHref="#formulaire-retour"
        primaryLabel="Envoyer un retour"
        secondaryHref="/"
        secondaryLabel="Revenir à l'accueil"
      />

      <Section
        title="Quand utiliser cette page"
        intro="Cette page est ouverte à toute personne qui teste le site ou qui souhaite nous faire un retour utile, sans passer par des messages dispersés."
        kicker="Usage conseillé"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {useCases.map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-[#e5edf4] bg-white px-5 py-4 text-sm leading-7 text-[#5d6e83] shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
            >
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Partager un retour en quelques instants"
        intro="Pas besoin de remplir un long formulaire. Indiquez simplement la page concernée, ce que vous avez remarqué et, si vous le souhaitez, votre idée d'amélioration."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire-retour">
          <TestFeedbackForm locale="fr" />
        </div>
      </Section>
    </>
  );
}
