import { BulletList, CardGrid, CtaBanner, Faq, Hero, Section, Steps } from "../components/Sections";

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Plateforme de mise en relation & immigration economique"
        title="Recrutez en Belgique des talents internationaux dans les metiers en penurie"
        description="LEXPAT Connect met en relation les employeurs belges et les travailleurs internationaux, avec la possibilite d'un accompagnement juridique par le cabinet LEXPAT pour securiser les demarches d'immigration et d'autorisation de travail."
        primaryHref="/employeurs"
        primaryLabel="Je suis employeur"
        secondaryHref="/travailleurs"
        secondaryLabel="Je suis candidat"
        note="Une plateforme adossee au cabinet d'avocats LEXPAT, actif en droit de l'immigration en Belgique."
      />
      <Section title="Une plateforme pensee pour les deux cotes du recrutement" intro="Une architecture simple, credible et orientee conversion pour connecter les besoins des employeurs belges et les parcours des travailleurs internationaux." muted>
        <CardGrid columns={2} items={[
          { kicker: "Employeurs belges", title: "Deposer un besoin de recrutement", text: "Trouvez des profils internationaux pour vos besoins de recrutement dans les metiers en penurie et soyez orientes, si necessaire, vers un accompagnement juridique adapte.", link: { href: "/employeurs", label: "Decouvrir l'espace employeurs" } },
          { kicker: "Travailleurs internationaux", title: "Creer un profil visible et serieux", text: "Valorisez vos competences et accedez a des opportunites professionnelles en Belgique dans des secteurs qui recrutent reellement.", link: { href: "/travailleurs", label: "Decouvrir l'espace candidats" } }
        ]} />
      </Section>
      <Section title="Pourquoi LEXPAT Connect" intro="Le recrutement international ne se resume pas a trouver un profil. Il faut aussi comprendre le cadre belge, les realites regionales et les demarches qui permettent une embauche securisee.">
        <BulletList items={[
          { title: "Mise en relation ciblee", text: "Employeurs et candidats se rencontrent autour de besoins concrets dans des metiers en tension." },
          { title: "Ancrage belge", text: "La plateforme est pensee pour la Belgique, avec une attention particuliere aux realites regionales." },
          { title: "Relais juridique integre", text: "Lorsqu'un recrutement implique un permis unique ou une demarche d'immigration economique, le cabinet LEXPAT peut prendre le relais." },
          { title: "Approche claire et humaine", text: "Nous privilegions une mise en relation lisible, serieuse et accompagnee plutot qu'une promesse technologique abstraite." }
        ]} />
      </Section>
      <Section title="Comment ca fonctionne" intro="Le MVP repose sur un processus simple qui rend le recrutement international plus lisible sans survendre une mecanique algorithmique." muted>
        <Steps items={[
          { title: "L'employeur publie son besoin", text: "Le poste, la region, le type de contrat et les competences recherchees sont structures des le depart." },
          { title: "Le candidat cree son profil", text: "Le parcours, les competences, la disponibilite et la situation administrative sont presentes clairement." },
          { title: "La mise en relation s'opere", text: "Les prises de contact demarrent sur une base plus claire et plus utile pour les deux parties." },
          { title: "LEXPAT accompagne si necessaire", text: "Si le projet suppose une autorisation de travail ou une demarche de sejour, le cabinet peut intervenir." }
        ]} />
      </Section>
      <Section title="Les metiers en penurie comme porte d'entree" intro="LEXPAT Connect s'appuie sur les realites du marche belge et sur les listes regionales des metiers en penurie pour structurer la plateforme.">
        <CardGrid items={[
          { title: "Bruxelles-Capitale", text: "Lecture nuancee des listes et des pratiques administratives, avec vigilance sur la competence regionale." },
          { title: "Wallonie", text: "Categories et fonctions structurees autour de la liste wallonne et des secteurs en tension." },
          { title: "Flandre", text: "Approche plus fonctionnelle sur certains metiers techniques, a presenter avec precision." }
        ]} />
      </Section>
      <CtaBanner title="Besoin de securiser le recrutement" text="Lorsqu'un employeur souhaite recruter un travailleur international, certaines situations necessitent un accompagnement juridique precis. Le cabinet LEXPAT peut intervenir notamment pour les questions de permis unique, d'immigration economique et de securisation administrative du dossier." primaryHref="/accompagnement-juridique" primaryLabel="Decouvrir l'accompagnement juridique" secondaryHref="/contact" secondaryLabel="Contacter LEXPAT" />
      <Section title="Questions frequentes" intro="Les formulations du MVP restent volontiers prudentes pour ne promettre que ce que la plateforme pourra reellement delivrer." muted>
        <Faq items={[
          { question: "LEXPAT Connect est-elle une agence de recrutement ?", answer: "Non. LEXPAT Connect est une plateforme de mise en relation entre employeurs belges et travailleurs internationaux." },
          { question: "Le cabinet LEXPAT intervient-il automatiquement dans chaque dossier ?", answer: "Non. L'intervention du cabinet depend des besoins juridiques lies au recrutement et a la situation du candidat." },
          { question: "Puis-je utiliser la plateforme si je suis un travailleur hors Union europeenne ?", answer: "Oui, sous reserve des conditions applicables a votre situation et au poste vise. Certaines embauches necessitent une procedure prealable." },
          { question: "Tous les metiers publies permettent-ils automatiquement une autorisation de travail ?", answer: "Non. La presence d'un metier sur une liste regionale ou sur la plateforme ne remplace jamais une analyse juridique du dossier." }
        ]} />
      </Section>
    </>
  );
}
