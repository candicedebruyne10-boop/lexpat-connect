import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de mise en relation & immigration économique"
        title="Recrutez en Belgique des talents internationaux dans les métiers en pénurie"
        description="LEXPAT Connect met en relation les employeurs belges et les travailleurs internationaux, avec la possibilité d'un accompagnement juridique par le cabinet LEXPAT pour sécuriser les démarches d'immigration et d'autorisation de travail."
        primaryHref="/employeurs"
        primaryLabel="Je suis employeur"
        secondaryHref="/travailleurs"
        secondaryLabel="Je suis candidat"
        note="Une plateforme adossée au cabinet d'avocats LEXPAT, actif en droit de l'immigration en Belgique."
      />
      <Section
        title="Une plateforme pensée pour les deux côtés du recrutement"
        intro="Une architecture simple, crédible et orientée conversion pour connecter les besoins des employeurs belges et les parcours des travailleurs internationaux."
        muted
      >
        <CardGrid
          columns={2}
          items={[
            {
              kicker: "Employeurs belges",
              title: "Déposer un besoin de recrutement",
              text: "Trouvez des profils internationaux pour vos besoins de recrutement dans les métiers en pénurie et soyez orientés, si nécessaire, vers un accompagnement juridique adapté.",
              link: { href: "/employeurs", label: "Découvrir l'espace employeurs" }
            },
            {
              kicker: "Travailleurs internationaux",
              title: "Créer un profil visible et sérieux",
              text: "Valorisez vos compétences et accédez à des opportunités professionnelles en Belgique dans des secteurs qui recrutent réellement.",
              link: { href: "/travailleurs", label: "Découvrir l'espace candidats" }
            }
          ]}
        />
      </Section>
      <Section
        title="Pourquoi LEXPAT Connect"
        intro="Le recrutement international ne se résume pas à trouver un profil. Il faut aussi comprendre le cadre belge, les réalités régionales et les démarches qui permettent une embauche sécurisée."
      >
        <BulletList
          items={[
            {
              title: "Mise en relation ciblée",
              text: "Employeurs et candidats se rencontrent autour de besoins concrets dans des métiers en tension."
            },
            {
              title: "Ancrage belge",
              text: "La plateforme est pensée pour la Belgique, avec une attention particulière aux réalités régionales."
            },
            {
              title: "Relais juridique intégré",
              text: "Lorsqu'un recrutement implique un permis unique ou une démarche d'immigration économique, le cabinet LEXPAT peut prendre le relais."
            },
            {
              title: "Approche claire et humaine",
              text: "Nous privilégions une mise en relation lisible, sérieuse et accompagnée plutôt qu'une promesse technologique abstraite."
            }
          ]}
        />
      </Section>
      <Section
        title="Comment ça fonctionne"
        intro="Le MVP repose sur un processus simple qui rend le recrutement international plus lisible sans survendre une mécanique algorithmique."
        muted
      >
        <Steps
          items={[
            {
              title: "L'employeur publie son besoin",
              text: "Le poste, la région, le type de contrat et les compétences recherchées sont structurés dès le départ."
            },
            {
              title: "Le candidat crée son profil",
              text: "Le parcours, les compétences, la disponibilité et la situation administrative sont présentés clairement."
            },
            {
              title: "La mise en relation s'opère",
              text: "Les prises de contact démarrent sur une base plus claire et plus utile pour les deux parties."
            },
            {
              title: "LEXPAT accompagne si nécessaire",
              text: "Si le projet suppose une autorisation de travail ou une démarche de séjour, le cabinet peut intervenir."
            }
          ]}
        />
      </Section>
      <Section
        title="Les métiers en pénurie comme porte d'entrée"
        intro="LEXPAT Connect s'appuie sur les réalités du marché belge et sur les listes régionales des métiers en pénurie pour structurer la plateforme."
      >
        <CardGrid
          items={[
            {
              title: "Bruxelles-Capitale",
              text: "Lecture nuancée des listes et des pratiques administratives, avec vigilance sur la compétence régionale."
            },
            {
              title: "Wallonie",
              text: "Catégories et fonctions structurées autour de la liste wallonne et des secteurs en tension."
            },
            {
              title: "Flandre",
              text: "Approche plus fonctionnelle sur certains métiers techniques, à présenter avec précision."
            }
          ]}
        />
      </Section>
      <CtaBanner
        title="Besoin de sécuriser le recrutement"
        text="Lorsqu'un employeur souhaite recruter un travailleur international, certaines situations nécessitent un accompagnement juridique précis. Le cabinet LEXPAT peut intervenir notamment pour les questions de permis unique, d'immigration économique et de sécurisation administrative du dossier."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Découvrir l'accompagnement juridique"
        secondaryHref="/contact"
        secondaryLabel="Contacter LEXPAT"
      />
      <Section
        title="Questions fréquentes"
        intro="Les formulations du MVP restent volontiers prudentes pour ne promettre que ce que la plateforme pourra réellement délivrer."
        muted
      >
        <Faq
          items={[
            {
              question: "LEXPAT Connect est-elle une agence de recrutement ?",
              answer: "Non. LEXPAT Connect est une plateforme de mise en relation entre employeurs belges et travailleurs internationaux."
            },
            {
              question: "Le cabinet LEXPAT intervient-il automatiquement dans chaque dossier ?",
              answer: "Non. L'intervention du cabinet dépend des besoins juridiques liés au recrutement et à la situation du candidat."
            },
            {
              question: "Puis-je utiliser la plateforme si je suis un travailleur hors Union européenne ?",
              answer: "Oui, sous réserve des conditions applicables à votre situation et au poste visé. Certaines embauches nécessitent une procédure préalable."
            },
            {
              question: "Tous les métiers publiés permettent-ils automatiquement une autorisation de travail ?",
              answer: "Non. La présence d'un métier sur une liste régionale ou sur la plateforme ne remplace jamais une analyse juridique du dossier."
            }
          ]}
        />
      </Section>
    </>
  );
}
