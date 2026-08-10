import Link from "next/link";
import { Hero, Section } from "../../components/Sections";
import FormCard from "../../components/FormCard";

import { alternatesFor } from "../../lib/seo-alternates";

export const metadata = {
  alternates: alternatesFor("/contact"),
  title: "Contact — Posez votre question sur le recrutement international ou le permis unique | LEXPAT Connect",
  description:
    "Une question sur le recrutement international en Belgique, le permis unique ou la plateforme ? Écrivez-nous — employeurs, travailleurs et questions juridiques bienvenues. Réponse sous 24h."
};

export default function ContactPage() {
  return (
    <>
      <Hero
        badge="Contact"
        title={
          <>
            Une question ?
            <span className="block text-[#57b7af]">Écrivez-nous, on vous répond.</span>
          </>
        }
        description="Que vous soyez employeur, travailleur ou que vous ayez une question sur le permis unique ou le droit au travail — posez votre question ici. Nous vous orientons vers la bonne personne sous 24h."
        primaryHref="#formulaire"
        primaryLabel="Poser ma question"
        secondaryHref="/simulateur-eligibilite"
        secondaryLabel="Tester l'éligibilité d'abord"
      />

      {/* Signaux de réassurance */}
      <div className="border-y border-[#e5edf5] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            {[
              { icon: "⏱", label: "Réponse sous 24h", sub: "En jours ouvrables" },
              { icon: "🔒", label: "Données confidentielles", sub: "Traitement RGPD conforme" },
              { icon: "🎯", label: "Orienté vers la bonne personne", sub: "Plateforme ou cabinet selon votre besoin" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-bold text-[#1E3A78]">{label}</p>
                <p className="text-xs text-[#8a9db8]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section
        title="Posez votre question"
        intro="Décrivez votre situation en quelques lignes — nous vous orientons vers la bonne ressource ou la bonne personne."
        kicker="Formulaire"
        muted
      >
        <div id="formulaire">
          <FormCard
            title="Formulaire de contact"
            intro="Choisissez le motif qui correspond le mieux à votre situation."
            buttonLabel="Envoyer le message"
            formType="contact"
            fields={[
              { label: "Nom complet", placeholder: "Prénom Nom" },
              { label: "Email", type: "email", placeholder: "votre.email@example.com" },
              { label: "Type de demande", type: "select", placeholder: "Sélectionnez votre besoin", options: ["Question employeur", "Question travailleur", "Consultation juridique", "Partenariat", "Autre"] },
              { label: "Message", type: "textarea", placeholder: "Expliquez votre situation ou votre question...", wide: true }
            ]}
          />
        </div>

        {/* Alternatives directes */}
        <div className="mt-8 rounded-[20px] border border-[#e5edf5] bg-white p-6">
          <p className="text-sm font-bold text-[#1E3A78] mb-4">Vous préférez accéder directement ?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/simulateur-eligibilite" className="inline-flex items-center gap-2 rounded-xl border border-[#d0dcf0] bg-[#f5f7ff] px-4 py-2.5 text-sm font-semibold text-[#1E3A78] transition hover:border-[#1E3A78]">
              🧪 Tester l'éligibilité de mon poste
            </Link>
            <Link href="/base-de-profils" className="inline-flex items-center gap-2 rounded-xl border border-[#d0f0ed] bg-[#f0faf9] px-4 py-2.5 text-sm font-semibold text-[#0d7c6e] transition hover:border-[#57b7af]">
              👤 Voir les profils disponibles
            </Link>
            <Link href="/permis-unique" className="inline-flex items-center gap-2 rounded-xl border border-[#d0dcf0] bg-[#f5f7ff] px-4 py-2.5 text-sm font-semibold text-[#1E3A78] transition hover:border-[#1E3A78]">
              📋 Guide permis unique
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
