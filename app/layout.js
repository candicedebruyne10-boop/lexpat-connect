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
          <div className="border-b border-slate-200/70 bg-white/75 text-[11px] font-medium text-slate backdrop-blur">
            <div className="container-shell flex min-h-10 items-center justify-between gap-4 py-2">
              <p className="max-w-3xl">
                Plateforme de mise en relation pour employeurs belges et travailleurs internationaux,
                avec relais juridique assuré par le cabinet LEXPAT lorsque la situation l'exige.
              </p>
              <Link href="/accompagnement-juridique" className="hidden text-brand-700 sm:inline-flex">
                Quand LEXPAT intervient
              </Link>
            </div>
          </div>

          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
            <div className="container-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-sm font-bold tracking-[0.24em] text-white">
                    LC
                  </span>
                  <span>
                    <span className="block text-base font-extrabold tracking-[0.18em] text-brand-900">LEXPAT</span>
                    <span className="block text-sm font-medium text-slate">Connect</span>
                  </span>
                </Link>
                <Link href="/contact" className="primary-button lg:hidden">
                  Nous contacter
                </Link>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate lg:justify-center lg:gap-6">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href} className="transition hover:text-brand-800">
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="hidden lg:flex lg:items-center lg:gap-3">
                  <Link href="/employeurs" className="secondary-button">
                    Espace employeurs
                  </Link>
                  <Link href="/contact" className="primary-button">
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-20 border-t border-slate-200 bg-white">
            <div className="container-shell py-14">
              <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-sm font-bold tracking-[0.24em] text-white">
                      LC
                    </span>
                    <div>
                      <p className="text-sm font-extrabold tracking-[0.18em] text-brand-900">LEXPAT</p>
                      <p className="text-sm text-slate">Connect</p>
                    </div>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-slate">
                    Une plateforme pensée pour clarifier le recrutement international en Belgique,
                    orienter les prises de contact et activer, si nécessaire, le relais juridique du cabinet LEXPAT.
                  </p>
                  <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-5 text-sm text-slate shadow-soft">
                    <p className="font-semibold text-brand-900">Important</p>
                    <p className="mt-2 leading-7">
                      La plateforme facilite la mise en relation. Les prestations juridiques sont assurées séparément par le cabinet LEXPAT.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Navigation</p>
                  <div className="mt-4 space-y-3 text-sm text-slate">
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href} className="block transition hover:text-brand-800">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Parcours</p>
                  <div className="mt-4 space-y-3 text-sm text-slate">
                    <Link href="/employeurs" className="block transition hover:text-brand-800">Déposer un besoin employeur</Link>
                    <Link href="/travailleurs" className="block transition hover:text-brand-800">Créer un profil candidat</Link>
                    <Link href="/metiers-en-penurie" className="block transition hover:text-brand-800">Comprendre les métiers en pénurie</Link>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Cabinet LEXPAT</p>
                  <p className="mt-4 text-sm leading-7 text-slate">
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
