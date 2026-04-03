import { Hero, Section } from "../../components/Sections";
import TestFeedbackForm from "../../components/TestFeedbackForm";

const useCases = [
  "Signaler un bug qui bloque un parcours",
  "Noter un manque de clarté sur une page",
  "Remonter une difficulté mobile ou navigateur",
  "Partager une suggestion simple d'amélioration"
];

export const metadata = {
  title: "Retours testeurs | LEXPAT Connect",
  description:
    "Page dédiée pour centraliser les retours utilisateurs de test sur LEXPAT Connect."
};

export default function RetoursTestPage() {
  return (
    <>
      <Hero
        badge="Test produit"
        title={
          <>
            Centraliser les retours de test
            <span className="block text-[#57b7af]">de Margaux et Zahra</span>
          </>
        }
        description="Un outil simple pour partager rapidement un bug, une incompréhension ou une idée d’amélioration pendant les tests du site."
        primaryHref="#formulaire-retour"
        primaryLabel="Envoyer un retour"
        secondaryHref="/"
        secondaryLabel="Revenir à l'accueil"
        note="Chaque retour est enregistré de façon structurée pour faciliter vos arbitrages de correction."
      />

      <Section
        title="Quand utiliser cette page"
        intro="Cette page sert à capter vite les retours utiles pendant les tests utilisateurs, sans passer par des messages éparpillés."
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
        title="Partager un retour structuré"
        intro="Choisissez la page testée, décrivez ce que vous avez observé et indiquez l’impact réel sur le parcours."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire-retour">
          <TestFeedbackForm />
        </div>
      </Section>
    </>
  );
}
