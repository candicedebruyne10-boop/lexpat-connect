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
  title: 'LEXPAT',
  description:
    "Cabinet d'avocats en droit des etrangers en Belgique."
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
