import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Manrope } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import NavAuth, { NavAuthMobile } from '../components/NavAuth';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
});

export const metadata = {
  title: 'LEXPAT Connect',
  description:
    'Plateforme de mise en relation entre employeurs belges et talents internationaux dans les métiers en pénurie.'
};

const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/employeurs', label: 'Employeurs' },
  { href: '/travailleurs', label: 'Talents' },
  { href: '/metiers-en-penurie', label: 'Métiers en pénurie' },
  { href: '/permis-unique', label: 'Permis unique' }
];

const legalLinks = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-de-confidentialite', label: 'Confidentialité' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/conditions-utilisation', label: 'Conditions d’utilisation' },
  { href: '/securite-conformite', label: 'Sécurité & conformité' },
  { href: '/retours-test', label: 'Retours testeurs' }
];

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans">
        <AuthProvider>
        <div className="shell">
          <header className="sticky top-0 z-40 border-b border-[#edf1f5] bg-white/92 backdrop-blur-xl">
            <div className="container-shell py-5">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <span className="relative inline-flex h-14 w-14 overflow-hidden rounded-[18px] border border-[#d9e9f1] bg-white shadow-[0_10px_24px_rgba(17,39,87,0.08)]">
                    <Image
                      src="/logo-lexpat-connect.png"
                      alt="Logo LEXPAT Connect"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold tracking-[0.12em] text-[#1d3b8b]">LEXPAT</span>
                    <span className="block text-sm text-[#6d7b8d]">Connect</span>
                  </span>
                </Link>

                <div className="hidden items-center gap-3 lg:flex">
                  <nav className="flex items-center gap-5 text-[13px] font-medium text-[#607086]">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="whitespace-nowrap transition hover:text-[#1d3b8b]">
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mx-1 h-5 w-px bg-[#e3eaf1]" />
                  {/* Boutons auth intelligents — connecté ou non */}
                  <NavAuth />
                </div>

                <div className="flex items-center gap-3 lg:hidden">
                  <NavAuthMobile />
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#c8d8ee] bg-white text-[#1d3b8b] shadow-[0_8px_20px_rgba(29,59,139,0.06)]">
                    <span className="flex flex-col gap-1">
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                      <span className="block h-0.5 w-5 rounded-full bg-current" />
                    </span>
                  </div>
                </div>
              </div>

              <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm font-medium text-[#607086] lg:hidden">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full border border-[#e3eaf1] bg-white px-4 py-2 transition hover:border-[#cde2df] hover:text-[#57b7af]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-20 border-t border-[#edf1f5] bg-white/90">
            <div className="container-shell py-14">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eef7fb_0%,#dff4f1_100%)] text-sm font-bold tracking-[0.24em] text-[#1d3b8b]">
                      LC
                    </span>
                    <div>
                      <p className="text-sm font-extrabold tracking-[0.18em] text-[#1d3b8b]">LEXPAT</p>
                      <p className="text-sm text-[#6d7b8d]">Connect</p>
                    </div>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-[#607086]">
                    Une plateforme pensée pour connecter les employeurs belges aux talents internationaux dans les métiers en pénurie, de façon plus claire, plus rapide et plus lisible.
                  </p>
                  <div className="rounded-[28px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5 text-sm text-[#607086] shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                    <p className="font-semibold text-[#1d3b8b]">Après la mise en relation</p>
                    <p className="mt-2 leading-7">
                      Si un recrutement suppose un permis unique ou une question d'immigration économique, le cabinet LEXPAT peut ensuite prendre le relais.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Plateforme</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="block transition hover:text-[#1d3b8b]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Actions rapides</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    <Link href="/employeurs" className="block transition hover:text-[#1d3b8b]">Déposer un besoin de recrutement</Link>
                    <Link href="/travailleurs" className="block transition hover:text-[#1d3b8b]">Rendre mon profil visible</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-[#1d3b8b]">Explorer les métiers en pénurie</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-[#1d3b8b]">Guide métiers en pénurie</Link>
                    <Link href="/permis-unique" className="block transition hover:text-[#1d3b8b]">Comprendre le permis unique</Link>
                    <Link href="/connexion" className="block transition hover:text-[#1d3b8b]">Se connecter</Link>
                    <Link href="/inscription" className="block transition hover:text-[#1d3b8b]">Créer un compte</Link>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Cabinet LEXPAT</p>
                  <p className="mt-4 text-sm leading-7 text-[#607086]">
                    Un relais juridique distinct lorsque la mise en relation débouche sur une question de permis unique, de droit au travail ou de sécurisation du recrutement.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link href="/accompagnement-juridique" className="secondary-button">
                      Voir l'accompagnement
                    </Link>
                    <Link href="/contact" className="ghost-link">
                      Parler à LEXPAT
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
                      className="inline-flex rounded-full border border-transparent px-3 py-1.5 transition hover:border-[#dce7ef] hover:bg-white hover:text-[#1d3b8b]"
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
