/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/liste-metiers-penurie',
        destination: '/metiers-en-penurie',
        permanent: true
      },
      {
        source: '/liste-metiers-en-penurie',
        destination: '/metiers-en-penurie',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
