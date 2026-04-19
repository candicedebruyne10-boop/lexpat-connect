import EmployerRegionalLanding from "../../../../components/EmployerRegionalLanding";

const page = {
  seo: {
    title: "Shortage occupations in Liege: recruit international workers | LEXPAT Connect",
    description:
      "In Liege, many roles remain difficult to fill. LEXPAT Connect helps employers recruit international workers and secure the single permit process when needed."
  },
  hero: {
    badge: "Liege employers",
    title: "Shortage occupations in Liege: recruit the right workers at last",
    description:
      "In Liege, some roles remain vacant for too long. LEXPAT Connect helps you identify the right profiles and secure the hiring process when a single permit may be required.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "View candidate profiles",
    secondaryHref: "/en/employeurs/rejoindre",
    secondaryLabel: "Share my hiring need",
    note: "Based in Belgium • Structured international recruitment • Legal relay when needed",
    stats: [
      { value: "Liege", label: "Built for Liege-based employers" },
      { value: "SMEs", label: "A clear and operational approach" },
      { value: "Single permit", label: "Legal relay when the file requires it" }
    ],
    panels: [
      {
        kicker: "Local pressure",
        title: "The blockage does not always come from your hiring need",
        text: "When the local market no longer provides enough candidates, international recruitment can become a practical solution."
      },
      {
        kicker: "LEXPAT value",
        title: "A structured recruitment solution",
        text: "Targeted profiles, a realistic reading of the role and legal support when necessary."
      }
    ]
  },
  employerChallenges: [
    {
      title: "Vacancies that stay open for months",
      text: "Some critical roles remain unfilled for too long despite repeated searches and relaunched job ads."
    },
    {
      title: "Teams under pressure",
      text: "Recruitment gaps quickly lead to overload, lower flexibility and operational fatigue."
    },
    {
      title: "Activity slowed down",
      text: "Production, planning, worksites or service quality can decline when a key role is not filled in time."
    },
    {
      title: "Opportunities lost",
      text: "When the right local profiles are missing, some projects are delayed, reduced or abandoned."
    }
  ],
  searchedProfiles: [
    { label: "Electromechanics" },
    { label: "Maintenance technicians" },
    { label: "Welders" },
    { label: "C/CE truck drivers" },
    { label: "Warehouse operators" },
    { label: "Nurses" },
    { label: "Electricians" },
    { label: "Skilled construction workers" },
    { label: "Cooks and hospitality staff" }
  ],
  solutions: [
    {
      title: "Qualified international workers",
      text: "Access a targeted talent pool when the local market no longer provides enough candidates."
    },
    {
      title: "Pre-qualified profiles",
      text: "Applications are reviewed carefully so you can focus on profiles that are genuinely relevant to your need."
    },
    {
      title: "Single permit guidance",
      text: "When non-EU recruitment requires it, the single permit steps can be anticipated and secured."
    },
    {
      title: "Legal risk control",
      text: "Contract, competent region, salary compliance, timing and refusal risks are reviewed with a legal lens."
    }
  ],
  internationalRecruiting: {
    title: "Why recruit internationally?",
    intro:
      "When the local pool no longer covers critical roles, international recruitment becomes both a business continuity decision and a growth strategy.",
    points: [
      "Expand your candidate pool beyond the local market",
      "Fill critical roles faster",
      "Support growth without leaving key roles vacant",
      "Save time with a more structured approach"
    ]
  },
  legalDifferentiation: {
    title: "International recruitment is not just about finding a CV",
    intro:
      "Hiring outside the EU requires a practical assessment of the role, salary level, competent region and the procedures that truly apply. That is where LEXPAT Connect goes further than a simple job board.",
    checklist: [
      "Check whether the role and context really support international recruitment",
      "Assess salary compliance and the relevant conditions",
      "Identify the type of permit and the competent region",
      "Anticipate timing and potential friction points",
      "Reduce refusal risks through a realistic legal reading"
    ]
  },
  sectors: [
    { title: "Industry", text: "Production, maintenance and technical roles with strong recruitment pressure." },
    { title: "Logistics", text: "Transport, warehouse and flow-management roles essential to business continuity." },
    { title: "Healthcare", text: "Care and support roles facing lasting labour market pressure." },
    { title: "Construction", text: "Skilled workers for worksites, special techniques and execution roles." },
    { title: "Hospitality", text: "Kitchen, floor and operational roles for businesses facing recurring hiring difficulties." },
    { title: "Special techniques / maintenance", text: "Hybrid technical roles whose scarcity directly slows productivity and service quality." }
  ],
  reassurance: [
    {
      title: "Clear feasibility review",
      text: "You get a realistic reading of the role, the context and whether international recruitment makes sense."
    },
    {
      title: "A structured process",
      text: "Each step is organised to avoid guesswork and improve clarity on the employer side."
    },
    {
      title: "Practical support",
      text: "The goal is not to promise the impossible, but to secure a credible and workable recruitment path."
    },
    {
      title: "Time gains and legal security",
      text: "You move faster with better control over single permit and compliance issues."
    }
  ],
  finalCta: {
    title: "Still unable to find the right profile in Liege?",
    text: "Access a pool of qualified international workers and get support at each step.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "Access LEXPAT Connect"
  },
  form: {
    title: "Prefer to be contacted directly?",
    intro:
      "If you would rather be called back than explore the platform right away, you can share your hiring need here.",
    buttonLabel: "Send my request",
    formType: "employeur-liege-penurie",
    successMessage:
      "Your request has been sent successfully. We will come back to you to discuss your hiring need in Liege.",
    fields: [
      { name: "nom", label: "Name", placeholder: "First name Last name" },
      { name: "email", label: "Email", placeholder: "contact@company.be", type: "email" },
      { name: "entreprise", label: "Company", placeholder: "Company name" },
      {
        name: "secteur",
        label: "Sector",
        type: "select",
        placeholder: "Select a sector",
        options: ["Industry", "Logistics", "Healthcare", "Construction", "Hospitality", "Special techniques / maintenance", "Other sector"]
      },
      { name: "profil", label: "Role needed", placeholder: "E.g. welder, nurse, C/CE driver" },
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
    challengeTitle: "What many employers in Liege are really facing",
    challengeIntro: "When some roles remain vacant for too long, the impact is quickly felt in production, organisation and growth.",
    challengeKicker: "Field reality",
    searchedTitle: "Roles that are currently hard to recruit in Liege",
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
    sectorsTitle: "Liege sectors that are particularly affected",
    sectorsIntro: "This logic applies to several sectors where hiring pressure directly slows activity.",
    sectorsKicker: "Covered sectors",
    sectorLabel: "Sector",
    reassuranceTitle: "For employers who want to hire fast, without improvising",
    reassuranceIntro: "A local page like this should reassure first: feasibility, method, legal security and time savings.",
    reassuranceKicker: "Reassurance",
    finalCtaBadge: "Recruiting in Liege",
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

export default function LiegeShortageJobsPageEn() {
  return <EmployerRegionalLanding page={page} />;
}
