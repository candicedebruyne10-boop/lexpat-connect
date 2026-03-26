/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slate: {
          DEFAULT: "#475569",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          500: "#64748b",
          600: "#475569",
          700: "#334155"
        },
        line: "#dbe4f0",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfd3fb",
          300: "#95b8f6",
          600: "#1d4ed8",
          700: "#1d3b8b",
          800: "#162d6b",
          900: "#0f1f4f"
        },
        accent: {
          sand: "#f3efe7",
          gold: "#b6925b"
        }
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 24px 80px rgba(15, 23, 42, 0.08)",
        soft: "0 12px 40px rgba(15, 23, 42, 0.06)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(29, 78, 216, 0.18), transparent 32%), linear-gradient(135deg, #0f1f4f 0%, #162d6b 52%, #1d3b8b 100%)"
      }
    }
  },
  plugins: []
};
