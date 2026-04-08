import LegalPageLayout from "../../components/LegalPageLayout";

export const metadata = {
  title: "Politique cookies | LEXPAT Connect",
  description:
    "Politique cookies de LEXPAT Connect : cookies essentiels, mesures d’audience éventuelles, durée de conservation et gestion des préférences."
};

const sections = [
  {
    id: "role",
    eyebrow: "Cookies",
    title: "Pourquoi cette politique cookies ?",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Cette page explique le rôle des cookies et technologies similaires utilisés sur LEXPAT Connect, ainsi que les modalités de gestion de vos préférences.
      </p>
    )
  },
  {
    id: "essentiels",
    eyebrow: "Essentiels",
    title: "Cookies strictement nécessaires",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Certains cookies ou stockages techniques sont indispensables au bon fonctionnement du site, notamment pour la sécurité, la stabilité de la session, l’authentification, l’affichage des pages et la soumission des formulaires.
      </p>
    )
  },
  {
    id: "analytics",
    eyebrow: "Mesure d’audience",
    title: "Mesures d’audience et analytics éventuels",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Si des outils de mesure d’audience sont activés, ils ont pour finalité d’améliorer l’expérience utilisateur, la lisibilité des parcours et la performance du site. Lorsqu’un consentement est requis, ces outils ne doivent être activés qu’après acceptation.
      </p>
    )
  },
  {
    id: "duree",
    eyebrow: "Durée",
    title: "Durée de conservation",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        La durée de conservation dépend de la nature du cookie ou de la technologie utilisée. Les cookies essentiels sont conservés pour la durée strictement nécessaire au service. Les cookies d’analyse, lorsqu’ils existent, sont conservés pour une durée limitée et proportionnée.
      </p>
    )
  },
  {
    id: "consentement",
    eyebrow: "Consentement",
    title: "Consentement et gestion des préférences",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Le site intègre un bandeau de gestion des cookies afin de permettre l’acceptation, le refus ou la personnalisation des préférences non essentielles. Vous pouvez également configurer votre navigateur pour bloquer ou supprimer certains cookies, sous réserve que cela n’altère pas certaines fonctionnalités essentielles.
      </p>
    )
  },
  {
    id: "lien",
    eyebrow: "Évolution",
    title: "Évolution de cette politique",
    body: (
      <p className="text-base leading-8 text-[#5c6e84]">
        Cette politique pourra être mise à jour si de nouveaux outils, prestataires ou mécanismes de consentement sont ajoutés au site.
      </p>
    )
  }
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Politique cookies"
      intro="Nous utilisons une approche sobre et transparente des cookies, centrée sur le bon fonctionnement du site et, le cas échéant, sur une mesure d’audience raisonnable et encadrée."
      sections={sections}
      locale="fr"
    />
  );
}
