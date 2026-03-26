import "./globals.css";
import Link from "next/link";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata = {
  title: "LEXPAT Connect",
  description:
    "Plateforme de mise en relation entre employeurs belges et talents internationaux, adossée au cabinet LEXPAT."
};

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/employeurs", label: "Employeurs" },
  { href: "/travailleurs", label: "Travailleurs" },
  { href: "/metiers-en-penurie", label: "Métiers en pénurie" },
  { href: "/accompagnement-juridique", label: "Cabinet LEXPAT" },
  { href: "/contact", label: "Contact" }
];

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans">
        <div className="shell">
          <div className="border-b border-[#edf1f5] bg-white/88 backdrop-blur">
            <div className="container-shell py-3">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-[#607086] sm:justify-end">
                <Link href="/employeurs" className="transition hover:text-[#57b7af]">
                  Pour les employeurs
                </Link>
                <Link href="/accompagnement-juridique" className="transition hover:text-[#57b7af]">
                  Cabinet LEXPAT
                </Link>
                <span className="text-[#8b99aa]">Français</span>
              </div>
            </div>
          </div>

          <header className="sticky top-0 z-40 border-b border-[#edf1f5] bg-white/92 backdrop-blur-xl">
            <div className="container-shell py-5">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eef7fb_0%,#dff4f1_100%)] text-sm font-bold tracking-[0.24em] text-[#1d3b8b]">
                    LC
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold tracking-[0.12em] text-[#1d3b8b]">LEXPAT</span>
                    <span className="block text-sm text-[#6d7b8d]">Connect</span>
                  </span>
                </Link>

                <div className="hidden items-center gap-6 lg:flex">
                  <nav className="flex items-center gap-6 text-sm font-medium text-[#607086]">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="transition hover:text-[#1d3b8b]">
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <Link href="/contact" className="primary-button">
                    Nous contacter
                  </Link>
                </div>

                <div className="flex items-center gap-3 lg:hidden">
                  <Link href="/contact" className="secondary-button">
                    Contact
                  </Link>
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
              <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
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
                    Une plateforme pensée pour clarifier le recrutement international en Belgique,
                    rendre les parcours plus lisibles et activer, si nécessaire, le relais juridique du cabinet LEXPAT.
                  </p>
                  <div className="rounded-[28px] border border-[#dce9e7] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfb_100%)] p-5 text-sm text-[#607086] shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                    <p className="font-semibold text-[#1d3b8b]">Important</p>
                    <p className="mt-2 leading-7">
                      La plateforme facilite la mise en relation. Les prestations juridiques sont assurées séparément par le cabinet LEXPAT.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Navigation</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="block transition hover:text-[#1d3b8b]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Parcours</p>
                  <div className="mt-4 space-y-3 text-sm text-[#607086]">
                    <Link href="/employeurs" className="block transition hover:text-[#1d3b8b]">Déposer un besoin employeur</Link>
                    <Link href="/travailleurs" className="block transition hover:text-[#1d3b8b]">Créer un profil candidat</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-[#1d3b8b]">Comprendre les métiers en pénurie</Link>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#57b7af]">Cabinet LEXPAT</p>
                  <p className="mt-4 text-sm leading-7 text-[#607086]">
                    Permis unique, immigration économique, sécurisation d'embauche internationale et analyse juridique individualisée.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link href="/accompagnement-juridique" className="primary-button">
                      Voir l'accompagnement juridique
                    </Link>
                    <Link href="/contact" className="ghost-link">
                      Demander un échange
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
