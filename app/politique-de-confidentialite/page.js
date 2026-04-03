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
          LEXPAT Connect traite les données personnelles avec un objectif précis : permettre une mise en relation crédible, professionnelle et sécurisée entre employeurs belges et talents internationaux.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Nous appliquons les principes du Règlement général sur la protection des données (RGPD), notamment la limitation des finalités, la minimisation des données, l’exactitude, la sécurité et la transparence.
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
          Pour les talents internationaux : identité, coordonnées, localisation, langues, disponibilité, expérience, compétences, CV, informations sur le métier recherché, secteur visé et statut administratif communiqué volontairement.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les employeurs : identité de l’entreprise, coordonnées, besoin de recrutement, métier en pénurie concerné, région, informations de contact et critères liés à l’offre.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Pour les formulaires de contact et les échanges email : nom, adresse email, téléphone, contenu du message, historique des échanges et informations utiles au traitement de la demande.
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
          Les données sont utilisées pour recevoir les demandes, structurer les profils et besoins, permettre le matching, organiser les mises en relation et assurer le suivi opérationnel de la plateforme.
        </p>
        <p className="text-base leading-8 text-[#5c6e84]">
          Lorsque cela devient nécessaire après une mise en relation, certaines informations peuvent également être utilisées pour orienter un dossier vers le cabinet LEXPAT dans le cadre d’un permis unique, du droit au travail ou de l’immigration économique.
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
          Les données sont conservées pendant la durée nécessaire au fonctionnement de la plateforme, au suivi des mises en relation et à la gestion des demandes. Elles peuvent être supprimées, anonymisées ou archivées lorsqu’elles ne sont plus utiles ou lorsqu’une obligation légale impose une conservation limitée.
        </p>
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
          Les données sont accessibles uniquement aux personnes autorisées au sein de LEXPAT Connect et, lorsque cela est nécessaire, au cabinet LEXPAT. Les mises en relation impliquent naturellement la transmission d’informations pertinentes entre employeurs et talents, dans la stricte mesure utile au matching.
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
          Lorsque des traitements impliquent des prestataires situés en dehors de l’Union européenne, nous veillons à encadrer ces transferts au moyen de garanties appropriées prévues par le RGPD.
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
          Cette politique est interprétée conformément au droit belge et au cadre du RGPD applicable dans l’Union européenne.
        </p>
      </>
    )
  }
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      intro="Cette politique explique de manière claire comment LEXPAT Connect collecte, utilise, conserve et protège les données personnelles des employeurs, talents internationaux et utilisateurs des formulaires du site."
      sections={sections}
    />
  );
}
