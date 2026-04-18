import EmployerRegionalLanding from "../../../../components/EmployerRegionalLanding";

const page = {
  seo: {
    title: "Shortage occupations in Bruges: recruit international workers | LEXPAT Connect",
    description:
      "In Bruges and the West Flanders region, construction, healthcare and special techniques face lasting shortages. LEXPAT Connect helps employers recruit qualified international profiles."
  },
  hero: {
    badge: "Bruges employers",
    title: "Shortage occupations in Bruges: find qualified profiles for your sites and care needs",
    description:
      "Construction, healthcare, special techniques: in Bruges and across West Flanders, some profiles are simply no longer available locally. LEXPAT Connect helps you recruit internationally within a clear, legally secured framework.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "View candidate profiles",
    secondaryHref: "/en/inscription",
    secondaryLabel: "Share my hiring need",
    note: "Based in Belgium • Structured international recruitment • Legal relay when needed",
    stats: [
      { value: "Bruges", label: "Built for Bruges and West Flanders employers" },
      { value: "Construction & care", label: "Sectors under acute recruitment pressure" },
      { value: "Single permit", label: "Legal relay when the file requires it" }
    ],
    panels: [
      {
        kicker: "Field reality",
        title: "The shortage affects both construction sites and healthcare",
        text: "Masons, formwork workers, roofers, care assistants, home help: these profiles are increasingly scarce across the province."
      },
      {
        kicker: "LEXPAT value",
        title: "Access to international profiles within a secured framework",
        text: "Profiles targeted by sector and full legal support when a Flemish single permit is required."
      }
    ]
  },
  employerChallenges: [
    {
      title: "Worksites slowed by a lack of skilled labour",
      text: "Masons, formwork workers and roofers: Bruges worksites — whether historic renovation or new construction — regularly lack qualified profiles."
    },
    {
      title: "Growing pressure in home care",
      text: "Demand for care assistants and home help is growing faster than the available workforce, creating lasting pressure on care organisations."
    },
    {
      title: "Special techniques permanently understaffed",
      text: "Refrigeration technicians, installation fitters, pipefitters: these hybrid profiles are rare and quickly hired away by a handful of large companies."
    },
    {
      title: "An exhausted local pool for manual trades",
      text: "In a West Flanders labour market with historically low unemployment, candidates available for field trades are increasingly hard to find."
    }
  ],
  searchedProfiles: [
    { label: "Masons" },
    { label: "Formwork workers / concreters" },
    { label: "Roofers" },
    { label: "Care assistants" },
    { label: "Home help workers" },
    { label: "Refrigeration technicians" },
    { label: "Installation technicians" },
    { label: "Pipefitters" },
    { label: "Asbestos removal workers" },
    { label: "Construction estimators" }
  ],
  solutions: [
    {
      title: "Qualified field trade workers",
      text: "Access international profiles in construction, care and special techniques when the local pool is exhausted."
    },
    {
      title: "Pre-qualified profiles for your context",
      text: "Each application is analysed to direct you towards profiles suited to your type of worksite or care structure."
    },
    {
      title: "Single permit support in Flanders",
      text: "VDAB procedures and applicable Flemish conditions for the single permit are integrated from the outset."
    },
    {
      title: "Legal security for your hire",
      text: "Salary compliance, competent region and refusal risks are assessed with a realistic legal reading before any commitment."
    }
  ],
  internationalRecruiting: {
    title: "Why recruit internationally from Bruges?",
    intro:
      "With one of the highest employment rates in Belgium, West Flanders faces a structural shortage of manual and care trade workers. Opening up to international recruitment is not a risky bet — it is a measured response to an on-the-ground reality.",
    points: [
      "Access field profiles unavailable in the local pool",
      "Meet worksite deadlines and maintain service quality",
      "Respond to growing care demand without degrading the quality of support",
      "Structure international recruitment with a clear legal framework from the start"
    ]
  },
  legalDifferentiation: {
    title: "Recruiting internationally in field trades: what changes",
    intro:
      "In Flanders, the single permit for a non-EU worker in construction or care requires precise checks: the role must appear on the VDAB shortage list, salary compliance must be confirmed, and a solid file is needed to avoid refusals.",
    checklist: [
      "Check whether the role appears on the VDAB 2026 shortage list",
      "Confirm salary compliance under the applicable collective agreement",
      "Prepare a solid file to minimise refusal risks",
      "Anticipate processing times and required documents",
      "Identify the type of contract suited to the candidate's administrative situation"
    ]
  },
  sectors: [
    { title: "Construction & renovation", text: "Masons, formwork workers, roofers and tradespeople for new construction and the renovation of Bruges' historic built heritage." },
    { title: "Home care & care assistants", text: "Care and support profiles for home care organisations and care homes that are understaffed." },
    { title: "Special techniques", text: "Refrigeration technicians, installation fitters and pipefitters for residential and commercial building systems." },
    { title: "Civil engineering & public works", text: "Plant operators, asbestos removers and road-works teams for infrastructure projects." },
    { title: "Zeebrugge port logistics", text: "Drivers, handlers and logistics profiles for the operations of the international port of Zeebrugge." },
    { title: "Maintenance & servicing", text: "Maintenance technicians and electromechanics for commercial and industrial businesses in the region." }
  ],
  reassurance: [
    {
      title: "Knowledge of the Flemish framework",
      text: "The VDAB shortage list, collective agreement pay scales and Flanders-specific requirements are built into the analysis from step one."
    },
    {
      title: "Adapted to SMEs and craft businesses",
      text: "The support is designed for employers who recruit occasionally but need a solid, reliable framework."
    },
    {
      title: "Clear process with no surprises",
      text: "Each step is explained and mapped out, from profile selection through to the effective start date."
    },
    {
      title: "Concrete time savings",
      text: "Fewer back-and-forths, fewer unexpected issues: an approach that lets you focus on your business while the process moves forward."
    }
  ],
  finalCta: {
    title: "Still unable to find the right profiles in Bruges or West Flanders?",
    text: "Access a pool of qualified international workers in shortage occupations and move forward within a secured framework.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "Access LEXPAT Connect"
  },
  form: {
    title: "Prefer to be contacted directly?",
    intro:
      "If you would rather be called back than explore the platform right away, you can share your hiring need here.",
    buttonLabel: "Send my request",
    formType: "employeur-bruges-penurie-en",
    successMessage:
      "Your request has been sent successfully. We will come back to you to discuss your hiring need in Bruges.",
    fields: [
      { name: "nom", label: "Name", placeholder: "First name Last name" },
      { name: "email", label: "Email", placeholder: "contact@company.be", type: "email" },
      { name: "entreprise", label: "Company", placeholder: "Company name" },
      {
        name: "secteur",
        label: "Sector",
        type: "select",
        placeholder: "Select a sector",
        options: ["Construction / renovation", "Home care / care assistants", "Special techniques", "Civil engineering", "Logistics", "Maintenance", "Other sector"]
      },
      { name: "profil", label: "Role needed", placeholder: "E.g. mason, roofer, care assistant, refrigeration technician" },
      {
        name: "recontacte",
        label: "I would like to be contacted about an international recruitment need",
        type: "select",
        placeholder: "Choose an option",
        options: ["Yes, please contact me", "No, I only want to share a hiring need"]
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Describe your need, the role context, the hiring difficulty and any useful detail.",
        wide: true
      }
    ]
  },
  ui: {
    challengeTitle: "What many Bruges employers are really facing",
    challengeIntro: "When some roles remain vacant for too long, the impact is quickly felt in production, organisation and growth.",
    challengeKicker: "Field reality",
    searchedTitle: "Roles that are currently hard to recruit in Bruges",
    searchedIntro: "Here are some functions for which many employers struggle to find locally available candidates.",
    searchedKicker: "Roles in demand",
    solutionTitle: "LEXPAT Connect: a solution designed for employers",
    solutionIntro:
      "The goal is not only to make profiles visible, but to structure a credible international recruitment process that is clearer and legally better secured.",
    solutionKicker: "Solution",
    solutionLabel: "Solution",
    internationalIntro:
      "International recruitment only makes sense when it answers a concrete business need. When well framed, it can become a real employer lever.",
    internationalKicker: "International opening",
    keyPointsLabel: "Key points",
    legalTitle: "What makes the difference between an introduction and a secure hire",
    legalIntro:
      "For shortage occupations, the legal dimension quickly becomes decisive as soon as international recruitment outside the EU is involved.",
    legalKicker: "Legal framework",
    legalDifferentiationLabel: "Legal differentiation",
    checklistLabel: "What to review",
    sectorsTitle: "Bruges and West Flanders sectors that are particularly affected",
    sectorsIntro: "This logic applies to several sectors where hiring pressure directly slows activity.",
    sectorsKicker: "Covered sectors",
    sectorLabel: "Sector",
    reassuranceTitle: "For employers who want to hire fast, without improvising",
    reassuranceIntro: "A local page like this should reassure first: feasibility, method, legal security and time savings.",
    reassuranceKicker: "Reassurance",
    finalCtaBadge: "Recruiting in Bruges",
    contactTitle: "Need a direct conversation before moving forward?",
    contactIntro:
      "The platform remains the main path. This form is offered as a secondary option for employers who prefer to be contacted directly.",
    contactKicker: "Employer contact"
  }
};

export const metadata = {
  title: page.seo.title,
  description: page.seo.description
};

export default function BrugesShortageJobsPageEn() {
  return <EmployerRegionalLanding page={page} />;
}
