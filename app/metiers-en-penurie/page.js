import { CardGrid, CtaBanner, Hero, Section } from "../../components/Sections";

export default function MetiersPage() {
  return (
    <>
      <Hero
        badge="Métiers en pénurie en Belgique"
        title="Comprendre les métiers en pénurie en Belgique"
        description="LEXPAT Connect s'appuie sur les réalités du marché belge et sur les listes régionales de métiers en pénurie pour structurer les opportunités visibles sur la plateforme."
        primaryHref="/travailleurs"
        primaryLabel="Voir les opportunités"
        secondaryHref="/employeurs"
        secondaryLabel="Déposer un besoin de recrutement"
      />
      <Section
        title="Pourquoi cette page est importante"
        intro="En Belgique, les métiers en pénurie jouent un rôle essentiel dans certaines stratégies de recrutement, notamment lorsqu'un employeur envisage d'ouvrir sa recherche à l'international."
      >
        <CardGrid
          items={[
            { title: "La Belgique fonctionne par Régions", text: "Bruxelles, Wallonie et Flandre ont leurs propres listes et leurs propres pratiques." },
            { title: "Les listes évoluent", text: "Le contenu doit être mis à jour régulièrement et ne peut pas être traité comme un bloc figé." },
            { title: "Un métier en pénurie ne garantit rien à lui seul", text: "Le contexte du poste et du candidat reste déterminant." }
          ]}
        />
      </Section>
      <Section
        title="Trois Régions, trois réalités"
        intro="Le futur site devra conserver cette finesse, car c'est là que votre crédibilité juridique fera la différence."
        muted
      >
        <CardGrid
          items={[
            { title: "Bruxelles-Capitale", text: "Lecture nuancée des listes et de leur portée, avec attention aux rôles d'Actiris et de Bruxelles Économie Emploi." },
            { title: "Wallonie", text: "Liste régionale propre avec catégories et fonctions plus directement mobilisables pour les besoins employeurs." },
            { title: "Flandre", text: "Cadre plus fonctionnel sur plusieurs métiers techniques, souvent présenté via des descriptions de fonctions." }
          ]}
        />
      </Section>
      <Section
        title="Exemples de secteurs concernés"
        intro="Les catégories exactes peuvent varier selon la Région et les formulations officielles. La plateforme doit rester fidèle à cette réalité."
      >
        <CardGrid
          items={[
            { title: "Construction et travaux publics", text: "Maçonnerie, couverture, électricité, conduite de chantier, voirie." },
            { title: "Santé et action sociale", text: "Aide-soignant, infirmier, assistant social, fonctions médicales et paramédicales." },
            { title: "Transport et logistique", text: "Poids lourd, autobus, navigation intérieure, fonctions de conduite ciblées." },
            { title: "Industrie et maintenance", text: "Électromécanique, automatisation, froid, mécanique, maintenance industrielle." },
            { title: "Technologies et informatique", text: "Développement, business analysis, fonctions techniques et communication réseau." },
            { title: "Éducation et formation", text: "Enseignement, formation, coordination pédagogique selon les cadres applicables." }
          ]}
        />
      </Section>
      <Section
        title="Ce qu'un métier en pénurie ne signifie pas automatiquement"
        intro="La présence d'un métier sur une liste régionale ne signifie pas, à elle seule, qu'un recrutement international est automatiquement possible ou qu'une autorisation de travail sera délivrée."
        muted
      >
        <div className="note-box">
          <p>
            D'autres éléments entrent en ligne de compte, notamment la Région
            compétente, le profil du candidat, la qualification, la rémunération,
            la nature du poste et la situation administrative.
          </p>
        </div>
      </Section>
      <CtaBanner
        title="Utilisez cette page comme point de départ, pas comme réponse finale"
        text="Les métiers en pénurie sont un excellent point d'entrée pour comprendre les opportunités en Belgique. Pour sécuriser une situation concrète, une analyse individualisée reste souvent nécessaire."
        primaryHref="/accompagnement-juridique"
        primaryLabel="Parler au cabinet LEXPAT"
        secondaryHref="/contact"
        secondaryLabel="Poser une question"
      />
    </>
  );
}
