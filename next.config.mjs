/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/offres d'emploi",
        destination: "/offres-d-emploi",
        permanent: true
      },
      {
        source: '/liste-metiers-penurie',
        destination: '/metiers-en-penurie',
        permanent: true
      },
      {
        source: '/liste-metiers-en-penurie',
        destination: '/metiers-en-penurie',
        permanent: true
      },
      // Page testeurs — redirigée vers /admin
      {
        source: '/retours-test',
        destination: '/admin',
        permanent: false
      },
      {
        source: '/en/retours-test',
        destination: '/admin',
        permanent: false
      },
      // Accompagnement juridique → permis unique (contenu absorbé dans #cabinet-lexpat)
      {
        source: '/accompagnement-juridique',
        destination: '/permis-unique#cabinet-lexpat',
        permanent: true
      },
      {
        source: '/en/accompagnement-juridique',
        destination: '/en/permis-unique#cabinet-lexpat',
        permanent: true
      },
      // Travailleurs hautement qualifiés → section #qualifies dans /travailleurs
      {
        source: '/travailleurs-hautement-qualifies',
        destination: '/travailleurs#qualifies',
        permanent: true
      },
      {
        source: '/en/highly-qualified-workers',
        destination: '/en/workers#qualifies',
        permanent: true
      },
      // Revenir en Belgique → section #retour dans /travailleurs
      {
        source: '/revenir-en-belgique-apres-un-retour',
        destination: '/travailleurs#retour',
        permanent: true
      },
      {
        source: '/en/returning-to-belgium-after-leaving',
        destination: '/en/workers#retour',
        permanent: true
      },
      // Slugs FR/EN inversés — correction des arbres de routes
      {
        source: '/returning-to-belgium-after-leaving',
        destination: '/travailleurs#retour',
        permanent: true
      },
      {
        source: '/en/revenir-en-belgique-apres-un-retour',
        destination: '/en/returning-to-belgium-after-leaving',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
