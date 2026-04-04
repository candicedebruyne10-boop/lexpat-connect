/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        /* ── Palette officielle LEXPAT Connect ── */
        brand: {
          dark:   "#1E3A78",   // Bleu foncé principal (employeurs)
          mid:    "#204E97",   // Bleu moyen secondaire
          light:  "#eef1fb",   // Fond cards bleu
          border: "#c5d4f3",   // Bordure bleue
          /* Aliases legacy (ne pas utiliser dans nouveaux composants) */
          700:    "#1E3A78",
          800:    "#162d6b",
        },
        talent: {
          DEFAULT: "#57B7AF",  // Turquoise talents CTA
          light:   "#eaf4f3",  // Fond turquoise doux
          border:  "#cde2df",  // Bordure turquoise
          dark:    "#4aa9a2",  // Hover
        },
        accent: {
          red:  "#B5121B",     // Rouge juridique / alertes
        },
        ink:    "#222222",     // Gris texte premium
        muted:  "#607086",     // Texte secondaire
        line:   "#e3eaf1",     // Bordure neutre
        surface:"#f8fafb",     // Fond body
      },
      fontFamily: {
        /* Montserrat = titres H1/H2/H3, CTAs, labels nav */
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        /* Open Sans = corps texte, formulaires, mentions légales */
        sans:    ["var(--font-open-sans)", "Open Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 80px rgba(15, 23, 42, 0.08)",
        soft: "0 12px 40px rgba(15, 23, 42, 0.06)",
        blue: "0 16px 40px rgba(30, 58, 120, 0.22)",
        teal: "0 16px 40px rgba(87, 183, 175, 0.26)",
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, #0d1e45 0%, #1E3A78 60%, #204E97 100%)"
      }
    }
  },
  plugins: []
};
