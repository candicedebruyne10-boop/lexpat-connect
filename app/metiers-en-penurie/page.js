import { CardGrid, CtaBanner, Hero, Section } from "../../components/Sections";

export default function MetiersPage() {
  return (
    <>
      <Hero badge="Metiers en penurie en Belgique" title="Comprendre les metiers en penurie en Belgique" description="LEXPAT Connect s'appuie sur les realites du marche belge et sur les listes regionales de metiers en penurie pour structurer les opportunites visibles sur la plateforme." primaryHref="/travailleurs" primaryLabel="Voir les opportunites" secondaryHref="/employeurs" secondaryLabel="Deposer un besoin de recrutement" />
      <Section title="Pourquoi cette page est importante" intro="En Belgique, les metiers en penurie jouent un role essentiel dans certaines strategies de recrutement, notamment lorsqu'un employeur envisage d'ouvrir sa recherche a l'international.">
        <CardGrid items={[
          { title: "La Belgique fonctionne par Regions", text: "Bruxelles, Wallonie et Flandre ont leurs propres listes et leurs propres pratiques." },
          { title: "Les listes evoluent", text: "Le contenu doit etre mis a jour regulierement et ne peut pas etre traite comme un bloc fige." },
          { title: "Un metier en penurie ne garantit rien a lui seul", text: "Le contexte du poste et du candidat reste determinant." }
        ]} />
      </Section>
      <Section title="Trois Regions, trois realites" intro="Le futur site devra conserver cette finesse, car c'est la que votre credibilite juridique fera la difference." muted>
        <CardGrid items={[
          { title: "Bruxelles-Capitale", text: "Lecture nuancee des listes et de leur portee, avec attention aux roles d'Actiris et de Bruxelles Economie Emploi." },
          { title: "Wallonie", text: "Liste regionale propre avec categories et fonctions plus directement mobilisables pour les besoins employeurs." },
          { title: "Flandre", text: "Cadre plus fonctionnel sur plusieurs metiers techniques, souvent presente via des descriptions de fonctions." }
        ]} />
      </Section>
      <Section title="Exemples de secteurs concernes" intro="Les categories exactes peuvent varier selon la Region et les formulations officielles. La plateforme doit rester fidele a cette realite.">
        <CardGrid items={[
          { title: "Construction et travaux publics", text: "Maconnerie, couverture, electricite, conduite de chantier, voirie." },
          { title: "Sante et action sociale", text: "Aide-soignant, infirmier, assistant social, fonctions medicales et paramedicales." },
          { title: "Transport et logistique", text: "Poids lourd, autobus, navigation interieure, fonctions de conduite ciblees." },
          { title: "Industrie et maintenance", text: "Electromecanique, automatisation, froid, mecanique, maintenance industrielle." },
          { title: "Technologies et informatique", text: "Developpement, business analysis, fonctions techniques et communication reseau." },
          { title: "Education et formation", text: "Enseignement, formation, coordination pedagogique selon les cadres applicables." }
        ]} />
      </Section>
      <Section title="Ce qu'un metier en penurie ne signifie pas automatiquement" intro="La presence d'un metier sur une liste regionale ne signifie pas, a elle seule, qu'un recrutement international est automatiquement possible ou qu'une autorisation de travail sera delivree." muted>
        <div className="note-box"><p>D'autres elements entrent en ligne de compte, notamment la Region competente, le profil du candidat, la qualification, la remuneration, la nature du poste et la situation administrative.</p></div>
      </Section>
      <CtaBanner title="Utilisez cette page comme point de depart, pas comme reponse finale" text="Les metiers en penurie sont un excellent point d'entree pour comprendre les opportunites en Belgique. Pour securiser une situation concrete, une analyse individualisee reste souvent necessaire." primaryHref="/accompagnement-juridique" primaryLabel="Parler au cabinet LEXPAT" secondaryHref="/contact" secondaryLabel="Poser une question" />
    </>
  );
}
