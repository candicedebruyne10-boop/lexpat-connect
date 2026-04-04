import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Montserrat, Open_Sans } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import NavAuth, { NavAuthMobile } from '../components/NavAuth';
import NavDropdown from '../components/NavDropdown';

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
  title: 'LEXPAT Connect',
  description:
    'La plateforme de mise en relation ciblée entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie.'
};

// Onglets principaux — 5 entrées claires (charte LEXPAT Connect)
const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/employeurs',   label: 'Employeurs',   color: 'blue'  },
  { href: '/travailleurs', label: 'Travailleurs',  color: 'teal'  },
  { href: '/permis-unique', label: 'Immigration',  color: 'slate' },
  { href: '/accompagnement-juridique', label: 'Cabinet LEXPAT' },
];

// Sous-menus complets avec couleur + icône
const navDropdowns = {
  '/employeurs': {
    color: 'blue',
    items: [
      {
        href: '/employeurs',
        label: 'Je recrute',
        description: 'Déposez votre besoin de recrutement',
        icon: 'arrow',
      },
      {
        href: '/base-de-profils',
        label: 'Candidats disponibles',
        description: 'Parcourez les candidats internationaux',
        icon: 'search',
      },
    ],
  },
  '/travailleurs': {
    color: 'teal',
    items: [
      {
        href: '/travailleurs',
        label: 'Je postule',
        description: 'Rendez votre profil visible aux employeurs belges',
        icon: 'star',
      },
      {
        href: '/offres-d-emploi',
        label: "Offres d'emploi",
        description: 'Consultez les postes ouverts en Belgique',
        icon: 'doc',
      },
    ],
  },
  '/permis-unique': {
    color: 'slate',
    items: [
      {
        href: '/permis-unique',
        label: 'Guide permis unique',
        description: 'Conditions, procédure, types de permis',
        icon: 'doc',
      },
      {
        href: '/travailleurs-hautement-qualifies',
        label: 'Travailleurs hautement qualifiés',
        description: 'Seuils de salaire, Carte Bleue Européenne',
        icon: 'star',
      },
      {
        href: '/metiers-en-penurie',
        label: 'Métiers en pénurie',
        description: 'Professions ouvrant droit au permis unique',
        icon: 'pin',
      },
      {
        href: '/securite-conformite',
        label: 'Conformité & sécurité',
        description: 'RGPD, données personnelles, sécurisation',
        icon: 'globe',
      },
    ],
  },
};

const legalLinks = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-de-confidentialite', label: 'Confidentialité' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/conditions-utilisation', label: 'Conditions d’utilisation' },
  { href: '/securite-conformite', label: 'Sécurité & conformité' },
  { href: '/retours-test', label: 'Retours testeurs' },
  { href: '/admin', label: 'Admin' }
];

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-sans">
        <AuthProvider>
        <div className="shell">
          <header className="sticky top-0 z-40 border-b border-[#edf1f5] bg-white/92 backdrop-blur-xl">
            <div className="container-shell flex min-h-[72px] items-center lg:min-h-[88px]">
              <div className="flex w-full items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 lg:gap-4">
                  <span className="relative inline-flex h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-[#d9e9f1] bg-white shadow-[0_10px_24px_rgba(17,39,87,0.08)] lg:h-[72px] lg:w-[72px]">
                    <Image
                      src="/logo-lexpat-connect.png"
                      alt="Logo LEXPAT Connect"
                      fill
                      className="object-cover p-[5px]"
                      sizes="(min-width: 1024px) 72px, 56px"
                    />
                  </span>
                  <span className="leading-tight">
                    <span className="font-heading block text-[20px] font-bold tracking-[0.08em] text-[#1E3A78] lg:text-[24px]">
                      LEXPAT
                    </span>
                    <span className="block text-[15px] font-normal tracking-[0.03em] text-[#6d7b8d] lg:text-[18px]">
                      Connect
                    </span>
                  </span>
                </Link>

                <div className="hidden items-center gap-3 lg:flex">
                  <nav className="flex items-center gap-5 text-[13px] font-medium text-[#607086]">
                    {navigation.map((item) => {
                      const dd = navDropdowns[item.href];
                      return dd ? (
                        <NavDropdown
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          items={dd.items}
                          color={dd.color}
                        />
                      ) : (
                        <Link key={item.href} href={item.href} className="whitespace-nowrap transition hover:text-[#1E3A78]">
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mx-1 h-5 w-px bg-[#e3eaf1]" />
                  {/* Boutons auth intelligents — connecté ou non */}
                  <NavAuth />
                </div>

                <div className="flex items-center gap-3 lg:hidden">
                  <NavAuthMobile />
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#c8d8ee] bg-white text-[#1E3A78] shadow-[0_8px_20px_rgba(29,59,139,0.06)]">
                    <span className="flex flex-col gap-1">
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                    </span>
                  </div>
                </div>
              </div>

              <nav className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-1 text-sm font-medium text-[#607086] lg:hidden">
                {navigation.map((item) => {
                  const dd = navDropdowns[item.href];
                  return dd ? (
                    <NavDropdown
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      items={dd.items}
                      color={dd.color}
                      mobile
                    />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="whitespace-nowrap rounded-full border border-[#e3eaf1] bg-white px-4 py-2 transition hover:border-[#cde2df] hover:text-[#57b7af]"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-20 border-t border-[#edf1f5] bg-white/90">
            <div className="container-shell py-14">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-12 w-12 overflow-hidden rounded-[18px] border border-[#d9e9f1] bg-white shadow-[0_6px_16px_rgba(17,39,87,0.08)]">
                      <Image src="/logo-lexpat-connect.png" alt="Logo LEXPAT Connect" fill className="object-cover" sizes="48px" />
                    </span>
                    <div className="leading-none">
                      <p className="text-xl font-black tracking-[0.06em] text-[#1E2F86]">LEXPAT</p>
                      <p className="mt-1 text-lg font-light tracking-[-0.02em] text-[#7CCDC7]">Connect</p>
                    </div>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-[#607086]">
                    Une plateforme pensée pour connecter les employeurs belges aux travailleurs internationaux dans les métiers en pénurie, de façon plus claire, plus rapide et plus lisible.
                  </p>
                  <div className="rounded-[28px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5 text-sm text-[#607086] shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                    <p className="font-semibold text-[#1E3A78]">Après la mise en relation</p>
                    <p className="mt-2 leading-7">
                      Si un recrutement suppose un permis unique ou une question d'immigration économique, le cabinet LEXPAT peut ensuite prendre le relais.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">Employeurs</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    <Link href="/employeurs" className="block transition hover:text-[#1E3A78]">Je recrute</Link>
                    <Link href="/base-de-profils" className="block transition hover:text-[#1E3A78]">Candidats disponibles</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-[#1E3A78]">Métiers en pénurie</Link>
                  </div>
                  <p className="mt-6 font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">Travailleurs</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    <Link href="/travailleurs" className="block transition hover:text-[#57B7AF]">Je postule</Link>
                    <Link href="/offres-d-emploi" className="block transition hover:text-[#57B7AF]">Offres d'emploi</Link>
                  </div>
                </div>

                <div>
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#57B7AF]">Actions rapides</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    <Link href="/employeurs" className="block transition hover:text-[#1E3A78]">Déposer un besoin de recrutement</Link>
                    <Link href="/travailleurs" className="block transition hover:text-[#1E3A78]">Rendre mon profil visible</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-[#1E3A78]">Métiers en pénurie</Link>
                    <Link href="/permis-unique" className="block transition hover:text-[#1E3A78]">Comprendre le permis unique</Link>
                    <Link href="/connexion" className="block transition hover:text-[#1E3A78]">Se connecter</Link>
                    <Link href="/inscription" className="block transition hover:text-[#1E3A78]">Créer un compte</Link>
                  </div>
                </div>

                <div>
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E3A78]">Cabinet LEXPAT</p>
                  <p className="mt-4 text-sm leading-7 text-[#607086]">
                    Un relais juridique distinct lorsque la mise en relation débouche sur une question de permis unique, de droit au travail ou de sécurisation du recrutement.
                  </p>
                  <div className="mt-5">
                    <Link href="/accompagnement-juridique" className="secondary-button">
                      Voir l'accompagnement
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-[#edf1f5] pt-6">
                <div className="flex flex-col gap-4 rounded-[24px] border border-[#edf3f7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-5 py-4 text-sm text-[#6d7b8d] shadow-[0_10px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
                  <p className="leading-7">
                    LEXPAT Connect — Plateforme de mise en relation pour métiers en pénurie en Belgique.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {legalLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex rounded-full border border-transparent px-3 py-1.5 transition hover:border-[#dce7ef] hover:bg-white hover:text-[#1E3A78]"
                    >
                      {item.label}
                    </Link>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
