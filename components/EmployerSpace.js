"use client";

import { useMemo, useState } from "react";

const sidebarItems = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "company", label: "Mon entreprise" },
  { id: "offers", label: "Mes offres" }
];

const dashboardStats = [
  { label: "Offres publiées", value: 0, tone: "blue" },
  { label: "Profils reçus", value: 0, tone: "teal" },
  { label: "Dossiers à clarifier", value: 0, tone: "amber" },
  { label: "Recrutements finalisés", value: 0, tone: "green" }
];

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  teal: "bg-[#eef9f8] text-[#2b8f88]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

const companySections = [
  {
    title: "Informations entreprise",
    fields: [
      { label: "Nom de l'entreprise", placeholder: "Raison sociale" },
      { label: "Secteur principal", type: "select", options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Autre"] },
      { label: "Personne de contact", placeholder: "Prénom Nom" },
      { label: "Email professionnel", type: "email", placeholder: "contact@entreprise.be" },
      { label: "Téléphone", placeholder: "+32 ..." },
      { label: "Site internet", placeholder: "https://..." },
      { label: "Description de l'entreprise", type: "textarea", placeholder: "Présentez brièvement l'activité, la taille et le contexte de l'entreprise.", wide: true }
    ]
  },
  {
    title: "Contexte de recrutement",
    fields: [
      { label: "Région principale", type: "select", options: ["Bruxelles-Capitale", "Wallonie", "Flandre", "Plusieurs régions"] },
      { label: "Type de profils recherchés", placeholder: "Métiers, fonctions, niveaux..." },
      { label: "Expérience minimale", type: "select", options: ["Débutant accepté", "1 à 3 ans", "3 à 5 ans", "5 ans et plus"] },
      { label: "Langues attendues", placeholder: "Français, néerlandais, anglais..." },
      { label: "Critères de sélection", type: "textarea", placeholder: "Compétences, disponibilité, mobilité, certifications...", wide: true }
    ]
  }
];

const offerCards = [
  {
    title: "Soudeur industriel",
    meta: "Wallonie • Temps plein • Urgent",
    status: "Brouillon"
  },
  {
    title: "Aide-soignant",
    meta: "Bruxelles-Capitale • Temps plein",
    status: "À publier"
  }
];

function Field({ field }) {
  const base = "field-input";

  return (
    <label className={field.wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#17345d]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${base} min-h-36`} rows={6} placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <select className={base} defaultValue="">
          <option value="" disabled>
            Sélectionnez une option
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input className={base} type={field.type || "text"} placeholder={field.placeholder} />
      )}
    </label>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e4edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace employeur</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Tableau de bord recrutement</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
              Suivez vos besoins publiés, clarifiez vos critères de recrutement et préparez un cadre plus structuré pour l'évaluation de profils internationaux.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d9ebe8] bg-[#f5fbfb] px-5 py-4 text-sm text-[#33566b]">
            Espace entreprise: <span className="font-semibold text-[#1d3b8b]">version de travail</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <article key={item.label} className="rounded-[26px] border border-[#e5edf4] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold ${toneClasses[item.tone]}`}>
              {item.value}
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1d3b8b]">{item.label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b7b8f]">Ces indicateurs sont prêts à accueillir un vrai suivi des offres et des profils.</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Activité récente</h2>
          <div className="mt-6 space-y-4">
            {[
              "Ajoutez une première offre pour commencer à structurer votre espace employeur.",
              "Complétez les informations entreprise pour rendre vos besoins plus crédibles.",
              "Préparez vos critères de sélection afin d'accélérer l'analyse des candidatures."
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-[#ebf0f6] bg-[#f9fbfd] p-4 text-sm leading-6 text-[#5f7086]">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Relais juridique</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f7086]">
            Quand une offre implique un permis unique, une analyse régionale ou une sécurisation du recrutement, cet espace a vocation à orienter clairement vers le cabinet LEXPAT.
          </p>
          <div className="mt-6 rounded-[22px] border border-[#dce8f6] bg-[#f8fbff] p-4 text-sm leading-7 text-[#3c5473]">
            À terme, chaque offre pourra faire apparaître un niveau d'attention juridique, pour distinguer les besoins simples des situations à sécuriser.
          </div>
        </article>
      </section>
    </div>
  );
}

function CompanyView() {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mon entreprise</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Structurer votre fiche employeur</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Centralisez les éléments qui permettent de présenter votre entreprise, votre contexte de recrutement et vos critères de sélection de manière plus sérieuse.</p>
      </section>

      {companySections.map((section) => (
        <section key={section.title} className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{section.title}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {section.fields.map((field) => (
              <Field key={field.label} field={field} />
            ))}
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <button className="primary-button">Enregistrer l'entreprise</button>
      </div>
    </div>
  );
}

function OffersView() {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mes offres</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Préparer et suivre vos besoins de recrutement</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Cette première vue permet de visualiser la logique d'un espace où les offres, leurs statuts et les profils reçus seront centralisés.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {offerCards.map((offer) => (
          <article key={offer.title} className="rounded-[28px] border border-[#e5edf4] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#1d3b8b]">{offer.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f7086]">{offer.meta}</p>
              </div>
              <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1d3b8b]">
                {offer.status}
              </span>
            </div>
            <div className="mt-5 rounded-[22px] border border-[#ebf0f6] bg-[#f9fbfd] p-4 text-sm leading-7 text-[#5f7086]">
              Une future version permettra de suivre les candidatures reçues, les profils en analyse et les dossiers à transmettre au cabinet si nécessaire.
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[30px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Créer une nouvelle offre</h2>
        <p className="mt-3 text-sm leading-7 text-[#5f7086]">La logique produit est posée: vos futures offres pourront être sauvegardées ici avec leur métier, leur région, leur statut et leur niveau d'urgence.</p>
        <button className="secondary-button mt-5">Ajouter une offre</button>
      </section>
    </div>
  );
}

export default function EmployerSpace() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const completion = useMemo(() => {
    if (activeTab === "dashboard") return 31;
    if (activeTab === "company") return 56;
    return 44;
  }, [activeTab]);

  return (
    <section className="pb-12 pt-8 sm:pb-16 lg:pb-20 lg:pt-10">
      <div className="container-shell">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <aside className="rounded-[32px] border border-[#e4edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 xl:sticky xl:top-8">
            <div className="flex items-center gap-4 rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#eaf4ff_0%,#d8f1ed_100%)] text-xl font-semibold text-[#1d3b8b]">
                EX
              </div>
              <div>
                <p className="text-lg font-semibold text-[#17345d]">Profil employeur</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">Entreprise</span>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === item.id
                      ? "bg-[#eef5ff] text-[#1d3b8b] shadow-[inset_0_0_0_1px_rgba(160,184,216,0.45)]"
                      : "text-[#5f7086] hover:bg-[#f8fbff] hover:text-[#1d3b8b]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[#8ea1bb]">›</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-[24px] border border-[#e7eef5] bg-[#f9fbfd] p-5">
              <p className="text-sm font-semibold text-[#17345d]">Complétude de l'espace</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d94b4b]">{completion}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e3eaf1]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#57b7af_0%,#1d3b8b_100%)]" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6d7d91]">Complétez la fiche entreprise et préparez vos offres pour rendre vos recrutements plus lisibles et plus crédibles.</p>
            </div>
          </aside>

          <div>
            {activeTab === "dashboard" ? <DashboardView /> : null}
            {activeTab === "company" ? <CompanyView /> : null}
            {activeTab === "offers" ? <OffersView /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
