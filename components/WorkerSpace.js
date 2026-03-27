"use client";

import { useMemo, useState } from "react";

const dashboardStats = [
  { label: "Candidatures envoyées", value: 0, tone: "blue" },
  { label: "Dossiers en examen", value: 0, tone: "amber" },
  { label: "Vues du profil", value: 0, tone: "rose" },
  { label: "Présélectionné", value: 0, tone: "green" }
];

const sidebarItems = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "profile", label: "Mon profil" },
  { id: "cv", label: "Mon CV" }
];

const toneClasses = {
  blue: "bg-[#eef5ff] text-[#1d3b8b]",
  amber: "bg-[#fff7e7] text-[#d08900]",
  rose: "bg-[#fff0f0] text-[#d64545]",
  green: "bg-[#eef9f1] text-[#2f9d57]"
};

const profileSections = [
  {
    title: "Informations principales",
    fields: [
      { label: "Nom complet", placeholder: "Candice Debruyne" },
      { label: "Date de naissance", placeholder: "JJ/MM/AAAA" },
      { label: "Genre", type: "select", options: ["Femme", "Homme", "Autre", "Préfère ne pas répondre"] },
      { label: "Tranche d'âge", type: "select", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
      { label: "Téléphone", placeholder: "+32 ..." },
      { label: "Email", type: "email", placeholder: "votre.email@example.com" },
      { label: "Expérience", type: "select", options: ["Débutant", "1 à 3 ans", "3 à 5 ans", "5 à 10 ans", "10 ans et plus"] },
      { label: "Prétention salariale", placeholder: "Indiquez un montant indicatif" },
      { label: "Titre recherché", placeholder: "Intitulé de poste recherché", wide: true },
      { label: "Présentation", type: "textarea", placeholder: "Présentez votre parcours, vos compétences et le type d'opportunités que vous recherchez.", wide: true },
      { label: "Afficher mon profil", type: "select", options: ["Visible", "Visible sur validation", "Masqué"] }
    ]
  },
  {
    title: "Qualification et langues",
    fields: [
      { label: "Qualification", type: "select", options: ["Secondaire", "Bachelier", "Master", "Doctorat", "Certification professionnelle", "Autre"] },
      { label: "Langues", type: "select", options: ["Français", "Anglais", "Néerlandais", "Allemand", "Espagnol", "Autre"] },
      { label: "Autre langue", placeholder: "Précisez si nécessaire" },
      { label: "Catégorie métier", type: "select", options: ["Construction et travaux publics", "Santé et action sociale", "Transport et logistique", "Industrie et maintenance", "Technologies et informatique", "Éducation et formation", "Personnel hautement qualifié", "Personnel de direction"] }
    ]
  },
  {
    title: "Coordonnées et réseaux",
    fields: [
      { label: "Adresse", placeholder: "Adresse complète", wide: true },
      { label: "Emplacement souhaité", type: "select", options: ["Bruxelles-Capitale", "Wallonie", "Flandre", "Toute la Belgique"] },
      { label: "Localisation actuelle", placeholder: "Ville et pays de résidence" },
      { label: "LinkedIn", placeholder: "https://linkedin.com/in/...", wide: true },
      { label: "Autre réseau", placeholder: "Portfolio, site, vidéo...", wide: true }
    ]
  }
];

const cvSections = [
  {
    title: "Formation",
    description: "Ajoutez vos diplômes et formations principales.",
    items: ["Diplôme principal", "Formation complémentaire"]
  },
  {
    title: "Expériences",
    description: "Présentez vos expériences les plus pertinentes pour un employeur belge.",
    items: ["Expérience principale", "Expérience complémentaire"]
  },
  {
    title: "Certificats",
    description: "Mentionnez vos certifications ou distinctions utiles.",
    items: ["Certificat ou distinction"]
  },
  {
    title: "Compétences",
    description: "Listez les compétences techniques ou opérationnelles qui renforcent votre dossier.",
    items: ["Compétence 1", "Compétence 2"]
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Espace travailleur</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Tableau de bord candidat</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f7086]">
              Retrouvez ici l'état de votre profil, vos indicateurs de visibilité et les prochaines étapes pour rendre votre dossier plus crédible auprès d'employeurs belges.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d9ebe8] bg-[#f5fbfb] px-5 py-4 text-sm text-[#33566b]">
            Profil public: <span className="font-semibold text-[#1d3b8b]">en préparation</span>
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
            <p className="mt-2 text-sm leading-6 text-[#6b7b8f]">Les indicateurs se rempliront au fur et à mesure de l'usage réel de la plateforme.</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Vues de votre profil</h2>
              <p className="mt-2 text-sm leading-7 text-[#5f7086]">Une lecture simple de votre visibilité, avec une logique plus claire que celle d'un simple CV isolé.</p>
            </div>
            <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1d3b8b]">30 jours</span>
          </div>
          <div className="mt-8 h-72 rounded-[26px] border border-[#e6edf5] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fb_100%)] p-5">
            <div className="flex h-full items-end gap-3">
              {[6, 10, 8, 12, 11, 16, 24, 22, 28, 42, 36, 58].map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center justify-end gap-3">
                  <div className="w-full rounded-t-[18px] bg-[linear-gradient(180deg,#89d2cb_0%,#1d3b8b_100%)]" style={{ height: `${value}%` }} />
                  <span className="text-[10px] font-medium text-[#8695a8]">S{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Notifications</h2>
          <div className="mt-6 space-y-4">
            {[
              "Complétez votre titre recherché pour rendre votre profil plus lisible.",
              "Ajoutez un CV pour enrichir votre dossier candidat.",
              "Indiquez vos langues et votre mobilité pour gagner en crédibilité."
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-[#ebf0f6] bg-[#f9fbfd] p-4 text-sm leading-6 text-[#5f7086]">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mon profil</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Modifier mon profil</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Renseignez les informations qui permettent à un employeur de comprendre plus rapidement qui vous êtes, ce que vous recherchez et dans quelles conditions vous êtes disponible.</p>
      </section>

      {profileSections.map((section) => (
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
        <button className="primary-button">Enregistrer mon profil</button>
      </div>
    </div>
  );
}

function CvCollection({ title, description, items, buttonLabel = "Ajouter" }) {
  return (
    <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#5f7086]">{description}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-4 rounded-[20px] border border-[#e8eff5] bg-[#f7fafc] px-4 py-4 text-sm text-[#314761]">
            <span>{item}</span>
            <span className="text-[#7b8da3]">▾</span>
          </div>
        ))}
      </div>
      <button className="mt-5 secondary-button">{buttonLabel}</button>
    </section>
  );
}

function CvView() {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#57b7af]">Mon CV</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d3b8b] sm:text-4xl">Structurer un CV plus crédible</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f7086]">Ajoutez vos documents, vos formations, vos expériences et vos compétences dans un format qui aide un employeur à mieux lire votre dossier.</p>
      </section>

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Document principal</h2>
        <div className="mt-5 rounded-[24px] border border-dashed border-[#cfddeb] bg-[#f8fbfd] p-6">
          <p className="text-sm leading-7 text-[#5f7086]">Téléversez votre CV en PDF, DOC ou DOCX. Cette version pourra ensuite être complétée par les autres éléments du profil.</p>
          <button className="secondary-button mt-5">Téléverser un fichier</button>
        </div>
      </section>

      {cvSections.map((section) => (
        <CvCollection key={section.title} {...section} />
      ))}

      <section className="rounded-[30px] border border-[#e5edf4] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#1d3b8b]">Présentation vidéo</h2>
        <textarea className="field-input mt-6 min-h-32" placeholder="Ajoutez un lien vidéo ou une courte présentation si vous souhaitez compléter votre profil." rows={5} />
      </section>

      <div className="flex justify-end">
        <button className="primary-button">Enregistrer mon CV</button>
      </div>
    </div>
  );
}

export default function WorkerSpace() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const completion = useMemo(() => {
    if (activeTab === "dashboard") return 38;
    if (activeTab === "profile") return 62;
    return 54;
  }, [activeTab]);

  return (
    <section className="pb-12 pt-8 sm:pb-16 lg:pb-20 lg:pt-10">
      <div className="container-shell">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <aside className="rounded-[32px] border border-[#e4edf4] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7 xl:sticky xl:top-8">
            <div className="flex items-center gap-4 rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#eaf4ff_0%,#d8f1ed_100%)] text-xl font-semibold text-[#1d3b8b]">
                LC
              </div>
              <div>
                <p className="text-lg font-semibold text-[#17345d]">Profil travailleur</p>
                <span className="mt-1 inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1d3b8b]">Candidat</span>
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
              <p className="text-sm font-semibold text-[#17345d]">Complétude du profil</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#d94b4b]">{completion}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e3eaf1]">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#57b7af_0%,#1d3b8b_100%)]" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6d7d91]">Complétez votre profil et votre CV pour rendre votre candidature plus claire, plus sérieuse et plus exploitable pour un employeur belge.</p>
            </div>
          </aside>

          <div>
            {activeTab === "dashboard" ? <DashboardView /> : null}
            {activeTab === "profile" ? <ProfileView /> : null}
            {activeTab === "cv" ? <CvView /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
