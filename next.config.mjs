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
      // Page testeurs — redirigée vers /contact en production
      {
        source: '/retours-test',
        destination: '/contact',
        permanent: false
      },
      {
        source: '/en/retours-test',
        destination: '/en/contact',
        permanent: false
      },
      // Slugs FR/EN inversés — correction des arbres de routes
      {
        source: '/returning-to-belgium-after-leaving',
        destination: '/revenir-en-belgique-apres-un-retour',
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
