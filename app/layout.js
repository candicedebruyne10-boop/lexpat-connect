import "./globals.css";
import Link from "next/link";

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
    <html lang="fr">
      <body>
        <div className="site-shell">
          <header className="topbar">
            <div className="container topbar-inner">
              <Link href="/" className="brand">
                <span className="brand-mark">LEXPAT</span>
                <span className="brand-sub">Connect</span>
              </Link>
              <nav className="nav">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <div className="container footer-grid">
              <div>
                <p className="eyebrow">LEXPAT Connect</p>
                <p className="footer-copy">
                  Plateforme de mise en relation pour employeurs belges et
                  travailleurs internationaux, avec passerelle vers le cabinet
                  LEXPAT.
                </p>
              </div>
              <div>
                <p className="footer-title">Navigation</p>
                <div className="footer-links">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="footer-title">Important</p>
                <p className="footer-copy">
                  La plateforme facilite la mise en relation. Les prestations
                  juridiques sont assurées séparément par le cabinet LEXPAT.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
