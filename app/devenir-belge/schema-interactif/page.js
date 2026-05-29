import Script from "next/script";
import NationalitySchemaInteractif from "../../../components/NationalitySchemaInteractif";

export const metadata = {
  title: "Schéma interactif pour devenir Belge | LEXPAT Connect",
  description:
    "Simulateur d'orientation pour identifier les principales voies d'acquisition ou d'attribution de la nationalité belge.",
  keywords: [
    "devenir belge",
    "schéma interactif nationalité belge",
    "déclaration nationalité belge",
    "article 12bis",
    "naturalisation Belgique",
  ],
  openGraph: {
    title: "Schéma interactif pour devenir Belge - LEXPAT Connect",
    description:
      "Un parcours interactif pour comprendre quelle procédure de nationalité belge pourrait correspondre à votre situation.",
    url: "https://lexpat-connect.be/devenir-belge/schema-interactif",
    type: "website",
  },
};

const faq = [
  {
    question: "Ce simulateur remplace-t-il un avis juridique ?",
    answer:
      "Non. Il donne une orientation générale à partir des grandes conditions publiques. Une vérification individuelle reste nécessaire avant tout dépôt.",
  },
  {
    question: "Faut-il toujours un titre de séjour à durée illimitée ?",
    answer:
      "Pour les déclarations de nationalité des majeurs, le titre de séjour à durée illimitée au moment de la demande est une condition centrale.",
  },
  {
    question: "Que signifie la connaissance d'une langue nationale ?",
    answer:
      "Il s'agit de la connaissance du français, du néerlandais ou de l'allemand. Certaines preuves d'intégration sociale peuvent aussi établir cette condition.",
  },
  {
    question: "Quelle différence entre la voie de 5 ans et celle de 10 ans ?",
    answer:
      "La voie générale de 5 ans demande notamment langue, intégration sociale et participation économique. La voie de 10 ans demande langue et participation à la communauté d'accueil.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function SchemaInteractifDevenirBelgePage() {
  return (
    <>
      <Script
        id="faq-nationalite-belge-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="bg-[#1E3A78] px-4 pb-12 pt-14 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#a8c4f0]">
            Nationalité belge
            <span className="text-white/30">·</span>
            Orientation interactive
            <span className="text-white/30">·</span>
            Article 12bis
          </p>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Quel chemin pour <span className="text-[#57b7af]">devenir Belge</span> ?
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#c3d4ef]">
            Répondez à quelques questions simples pour identifier la procédure de
            nationalité belge qui pourrait correspondre à votre situation : naissance
            en Belgique, 5 ans de séjour légal, mariage, enfant belge, handicap,
            pension ou 10 ans de résidence.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {[
              {
                title: "Décision rapide",
                text: "Le parcours affiche une orientation dès que les conditions décisives sont identifiées.",
                accent: "#57b7af",
              },
              {
                title: "Pièces à préparer",
                text: "Chaque résultat rappelle les documents à préparer avant une analyse par le cabinet LEXPAT.",
                accent: "#e91e8c",
              },
              {
                title: "Cadre prudent",
                text: "Le simulateur aide à se repérer, sans remplacer une analyse juridique individuelle.",
                accent: "#57b7af",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                style={{ borderTopColor: item.accent, borderTopWidth: 3 }}
              >
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#b8cef0]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-[#e5edf5] bg-[#f8fbff] px-4 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4a6b99]">
          Orientation générale · Données à vérifier avec le cabinet LEXPAT
        </p>
      </div>

      <NationalitySchemaInteractif />

      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#57b7af]">
                Accompagnement LEXPAT
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#1d3b8b]">
                Avant de déposer une demande
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#607086]">
                Les conditions de nationalité sont strictes. Une interruption de
                séjour, une carte non reconnue ou une preuve incomplète peut modifier
                le résultat. LEXPAT peut analyser votre situation et préparer une
                stratégie de dossier.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Analyse du dossier",
                  text: "Vérification du séjour, du titre de séjour, des interruptions éventuelles et de la voie la plus solide.",
                  href: "https://www.lexpat.be",
                },
                {
                  title: "Préparation des preuves",
                  text: "Identification des pièces utiles : langue, intégration, travail, filiation, mariage ou participation.",
                  href: "https://www.lexpat.be",
                },
                {
                  title: "Sécurisation juridique",
                  text: "Lecture juridique du dossier avant dépôt pour réduire les risques d'incomplétude ou de refus.",
                  href: "https://www.lexpat.be",
                },
                {
                  title: "Cabinet LEXPAT",
                  text: "Un avocat vous accompagne dans la stratégie, la préparation et le suivi de votre demande.",
                  href: "https://www.lexpat.be",
                },
              ].map((source) => (
                <a
                  key={source.title}
                  href={source.href}
                  className="rounded-2xl border border-[#dbe8f7] bg-[#f8fbff] p-5 transition hover:border-[#57b7af] hover:bg-white hover:shadow-sm"
                >
                  <p className="text-sm font-extrabold text-[#1d3b8b]">{source.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#607086]">{source.text}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-[#dbe8f7] bg-[#f8fbff] p-6">
            <h2 className="text-xl font-extrabold text-[#1d3b8b]">Questions fréquentes</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.question} className="rounded-xl bg-white p-5">
                  <h3 className="text-sm font-bold text-[#1e3357]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#607086]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
