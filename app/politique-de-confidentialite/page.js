import LegalPageLayout from "../../components/LegalPageLayout";

export const metadata = {
  title: "Politique de confidentialité | LEXPAT Connect",
  description:
    "Politique de confidentialité RGPD de LEXPAT Connect : données collectées, finalités, bases juridiques, conservation, droits des personnes et contact."
};

const sections = [
  {
    id: "principes",
    eyebrow: "RGPD",
    title: "Notre approche en matière de confidentialité",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          LEXPAT Connect traite les données personnelles avec un objectif précis : permettre une mise en relation crédible, professionnelle et sécurisée entre employeurs belges et travailleurs internationaux.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Nous appliquons les principes du Règlement général sur la protection des données (RGPD), notamment la limitation des finalités, la minimisation des données, l’exactitude, la sécurité et la transparence.
        </p>
      </>
    )
  },
  {
    id: "responsable",
    eyebrow: "Responsable de traitement",
    title: "Qui décide des traitements ?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les traitements liés a la plateforme de matching, aux formulaires, aux comptes utilisateurs, aux candidatures, a la messagerie et aux retours testeurs, le responsable de traitement est <strong className="text-[#1d3b8b]">LEXPAT SRL</strong>, via LEXPAT Connect.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Lorsque qu'un dossier bascule vers un accompagnement juridique distinct, le cabinet LEXPAT intervient dans un cadre separe, avec ses propres finalites, ses propres obligations et, le cas echeant, sa propre base legale.
        </p>
      </>
    )
  },
  {
    id: "donnees",
    eyebrow: "Données collectées",
    title: "Quelles données peuvent être collectées ?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les travailleurs internationaux : identité, coordonnées, localisation, langues, disponibilité, expérience, compétences, CV, informations sur le métier recherché, secteur visé et statut administratif communiqué volontairement.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les employeurs : identité de l’entreprise, coordonnées, besoin de recrutement, métier en pénurie concerné, région, informations de contact et critères liés à l’offre.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les formulaires de contact et les échanges email : nom, adresse email, téléphone, contenu du message, historique des échanges et informations utiles au traitement de la demande.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour la navigation sur le site : données techniques strictement nécessaires au fonctionnement, informations de session, préférences cookies et, si vous les acceptez, données de mesure d'audience non essentielles.
        </p>
      </>
    )
  },
  {
    id: "finalites",
    eyebrow: "Finalités",
    title: "Pourquoi utilisons-nous ces données ?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Les données sont utilisées pour recevoir les demandes, structurer les profils et besoins, permettre la mise en relation, organiser les mises en relation et assurer le suivi operationnel de la plateforme.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Lorsque cela devient nécessaire après une mise en relation, certaines informations peuvent également être utilisées pour orienter un dossier vers le cabinet LEXPAT dans le cadre d’un permis unique, du droit au travail ou de l’immigration économique.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Les formulaires du site peuvent egalement donner lieu a un envoi d'email vers l'adresse de contact de LEXPAT Connect afin de permettre un traitement plus rapide des demandes.
        </p>
      </>
    )
  },
  {
    id: "base-juridique",
    eyebrow: "Base légale",
    title: "Base juridique des traitements",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Selon les cas, les traitements sont fondés sur l’exécution de mesures précontractuelles, l’intérêt légitime de LEXPAT Connect à organiser la mise en relation, le respect de ses obligations légales, ou le consentement lorsqu’il est requis.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Les cookies ou mesures d'audience non essentiels reposent sur votre choix. Les traitements lies a la plateforme elle-meme reposent principalement sur l'execution de mesures precontractuelles, l'interet legitime d'organisation et, lorsque le cadre juridique l'impose, le respect d'obligations legales.
        </p>
      </>
    )
  },
  {
    id: "conservation",
    eyebrow: "Durée",
    title: "Combien de temps conservons-nous les données ?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Les donnees ne sont pas conservees indifferemment. Elles sont revues selon leur categorie et peuvent etre supprimees, anonymisees ou archivees lorsqu'elles ne sont plus utiles ou lorsqu'une obligation legale impose une conservation specifique.
        </p>
        <ul className="mt-4 space-y-3 text-base leading-8 text-[#5c6e84]">
          <li>Formulaires de contact et demandes entrantes : jusqu'a 24 mois apres le dernier echange utile.</li>
          <li>Profils travailleurs et employeurs : tant que le compte reste actif, puis suppression ou revue apres une periode prolongee d'inactivite.</li>
          <li>Candidatures, matchings et messagerie : pendant la relation active puis archivage ou suppression selon l'utilite operationnelle et les obligations legales.</li>
          <li>Retours testeurs : duree courte de travail produit, en principe jusqu'a 12 mois sauf besoin de suivi plus long.</li>
        </ul>
      </>
    )
  },
  {
    id: "destinataires",
    eyebrow: "Accès",
    title: "Qui peut accéder aux données ?",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Les donnees sont accessibles uniquement aux personnes autorisees au sein de LEXPAT Connect et, lorsque cela est necessaire, au cabinet LEXPAT. Les mises en relation impliquent la transmission d'informations pertinentes entre employeurs et travailleurs dans la stricte mesure utile a la relation.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Certains repertoires presentes aux membres sont volontairement anonymises ou partiellement masques tant qu'une relation plus avancee n'est pas justifiee.
        </p>
      </>
    )
  },
  {
    id: "transferts",
    eyebrow: "Sous-traitants",
    title: "Hébergement, outils et transferts éventuels",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Le site est déployé sur Vercel. Certaines données ou métadonnées techniques peuvent donc transiter ou être hébergées via cette infrastructure. La plateforme peut également utiliser Supabase pour l’authentification, la base de données et le stockage applicatif.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Le site peut egalement utiliser Resend pour l'envoi de certains emails transactionnels ou de notifications. Lorsque des traitements impliquent des prestataires situes en dehors de l'Union europeenne, nous veillons a encadrer ces transferts au moyen de garanties appropriees prevues par le RGPD.
        </p>
      </>
    )
  },
  {
    id: "droits",
    eyebrow: "Vos droits",
    title: "Vos droits RGPD",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Vous disposez notamment d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et, lorsque c’est applicable, d’un droit à la portabilité de vos données. Vous pouvez également retirer votre consentement lorsque le traitement repose sur celui-ci.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Vous pouvez également introduire une réclamation auprès de l’autorité de protection des données compétente en Belgique.
        </p>
      </>
    )
  },
  {
    id: "contact",
    eyebrow: "Contact privacy",
    title: "Nous contacter",
    body: (
      <>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour toute question relative à vos données personnelles ou pour exercer vos droits, vous pouvez écrire à : <strong className="text-[#1d3b8b]">lexpat@lexpat.be</strong>.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Vous pouvez egalement demander des precisions sur la logique de conservation, les sous-traitants utilises et le point de bascule entre la plateforme et le cabinet.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Cette politique est interpretee conformement au droit belge et au cadre du RGPD applicable dans l'Union europeenne.
        </p>
      </>
    )
  }
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      intro="Cette politique explique de manière claire comment LEXPAT Connect collecte, utilise, conserve et protège les données personnelles des employeurs, travailleurs internationaux et utilisateurs des formulaires du site."
      sections={sections}
    />
  );
}
