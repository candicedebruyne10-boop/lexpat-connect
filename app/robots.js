const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/en/admin",
          "/connexion",
          "/en/connexion",
          "/inscription",
          "/en/inscription",
          "/auth/",
          "/en/auth/",
          "/employeurs/espace",
          "/en/employeurs/espace",
          "/travailleurs/espace",
          "/en/travailleurs/espace",
          "/employeurs/rejoindre",
          "/en/employeurs/rejoindre",
          "/travailleurs/rejoindre",
          "/en/travailleurs/rejoindre",
          "/messagerie",
          "/en/messagerie",
          "/candidatures",
          "/en/candidatures",
          "/retours-test",
          "/en/retours-test",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
