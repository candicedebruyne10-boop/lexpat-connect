import './globals.css';
import { Suspense } from 'react';
import { Montserrat, Open_Sans } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import SiteChrome from '../components/SiteChrome';
import CookieBanner from '../components/CookieBanner';
import ConsentAwareAnalytics from '../components/ConsentAwareAnalytics';
import TestFeedbackLauncher from '../components/TestFeedbackLauncher';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "LEXPAT Connect — Recrutement international en Belgique",
    template: "%s | LEXPAT Connect",
  },
  description:
    "Trouvez des travailleurs internationaux qualifiés dans les métiers en pénurie en Belgique. Profils disponibles dès maintenant — permis unique géré par le cabinet d'avocats LEXPAT si nécessaire.",
  metadataBase: new URL("https://lexpat-connect.be"),
  openGraph: {
    type: "website",
    siteName: "LEXPAT Connect",
    title: "LEXPAT Connect — Recrutement international en Belgique",
    description:
      "Profils qualifiés disponibles maintenant dans les métiers en pénurie. Recrutez rapidement — le cabinet LEXPAT sécurise le juridique si nécessaire.",
    url: "https://lexpat-connect.be",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "LEXPAT Connect — Recrutement international en Belgique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEXPAT Connect — Recrutement international en Belgique",
    description:
      "Profils qualifiés disponibles maintenant dans les métiers en pénurie. Recrutez rapidement — le cabinet LEXPAT sécurise le juridique si nécessaire.",
    images: ["/hero-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
          <TestFeedbackLauncher />
          <CookieBanner />
          <Suspense fallback={null}>
            <ConsentAwareAnalytics />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
