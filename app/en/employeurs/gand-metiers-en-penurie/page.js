import EmployerRegionalLanding from "../../../../components/EmployerRegionalLanding";

const page = {
  seo: {
    title: "Shortage occupations in Ghent: recruit international workers | LEXPAT Connect",
    description:
      "In Ghent, a major industrial hub of Flanders, technical and production profiles are in high demand. LEXPAT Connect helps employers recruit internationally in shortage occupations."
  },
  hero: {
    badge: "Ghent employers",
    title: "Shortage occupations in Ghent: access qualified industrial profiles",
    description:
      "Steel, automotive, chemicals, biotech: Ghent's industry is continuously recruiting technical profiles that are hard to find locally. LEXPAT Connect helps you access an international talent pool and secure the single permit process.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "View candidate profiles",
    secondaryHref: "/en/employeurs/rejoindre",
    secondaryLabel: "Share my hiring need",
    note: "Based in Belgium • Structured international recruitment • Legal relay when needed",
    stats: [
      { value: "Ghent", label: "Built for Ghent-region employers" },
      { value: "Heavy industry", label: "Steel, automotive, chemicals and biotech" },
      { value: "Single permit", label: "Legal relay when the file requires it" }
    ],
    panels: [
      {
        kicker: "Sector pressure",
        title: "Ghent's industry faces a structural shortage of technical profiles",
        text: "Between ArcelorMittal, Volvo Cars and the chemical industries, demand for qualified profiles far exceeds the available local supply."
      },
      {
        kicker: "LEXPAT value",
        title: "Structured international recruitment, legally secured",
        text: "Targeted industrial profiles and full support when a single permit is needed for non-EU workers."
      }
    ]
  },
  employerChallenges: [
    {
      title: "Critical industrial roles left unfilled",
      text: "Machine setters, electromechanics, maintenance mechanics: available local profiles no longer cover production needs."
    },
    {
      title: "Intense competition between industrial employers",
      text: "In a basin where large international groups coexist, SMEs struggle to attract technical profiles that are increasingly scarce."
    },
    {
      title: "Recruitment delays that weaken production",
      text: "Each prolonged vacancy translates into delays, increased pressure on teams and reduced production capacity."
    },
    {
      title: "Expansion projects blocked",
      text: "When profiles are missing, some industrial projects, production ramp-ups or new contracts must be postponed."
    }
  ],
  searchedProfiles: [
    { label: "Machine setters / sheet metal / machining operators" },
    { label: "Electromechanics and maintenance mechanics" },
    { label: "Pipefitters" },
    { label: "Chemical process operators" },
    { label: "Formwork workers / concreters" },
    { label: "Heavy vehicle mechanics" },
    { label: "Installation technicians" },
    { label: "Data communication technicians" },
    { label: "Care assistants" },
    { label: "Construction estimators" }
  ],
  solutions: [
    {
      title: "International industrial workers",
      text: "Access qualified profiles in production, maintenance and construction trades when the local Flemish market no longer suffices."
    },
    {
      title: "Pre-qualified profiles",
      text: "Each application is analysed against your concrete need to direct you towards profiles that are genuinely usable."
    },
    {
      title: "Single permit guidance in Flanders",
      text: "When non-EU recruitment requires it, the VDAB-related steps and applicable Flemish conditions can be anticipated and secured."
    },
    {
      title: "Full legal security",
      text: "Competent region, salary compliance (collective agreement pay scales), VDAB processing times and refusal risks are addressed with a concrete legal reading."
    }
  ],
  internationalRecruiting: {
    title: "Why recruit internationally from Ghent?",
    intro:
      "In a city that concentrates some of Belgium's largest industrial sites, pressure on technical profiles is structural. International recruitment is not a plan B — it is a measured response to a shortage that will not resolve itself.",
    points: [
      "Access industrial profiles unavailable in the local market",
      "Support production without leaving technical roles vacant",
      "Meet VDAB compliance requirements for the single permit",
      "Anticipate the process to reduce time-to-hire"
    ]
  },
  legalDifferentiation: {
    title: "International industrial recruitment cannot be improvised",
    intro:
      "In Flanders, the single permit requires a precise reading of the VDAB shortage list, applicable salary scales by collective agreement and processing timelines. LEXPAT Connect integrates this dimension from the very first step.",
    checklist: [
      "Check whether the role is on the VDAB shortage occupation list",
      "Assess salary compliance under the applicable collective agreement",
      "Identify the appropriate single permit procedure for the target profile",
      "Anticipate processing times and required documents",
      "Reduce refusal risks through rigorous file preparation"
    ]
  },
  sectors: [
    { title: "Steel & metallurgy", text: "Machine setters, welders and production profiles for metal processing sites under high recruitment pressure." },
    { title: "Automotive & assembly", text: "Qualified technicians and operators for production lines and industrial equipment maintenance." },
    { title: "Chemicals & biotech", text: "Chemical process operators and technicians for industries with high regulatory constraints." },
    { title: "Construction & civil engineering", text: "Formwork workers, masons and estimators for major infrastructure and building projects." },
    { title: "Industrial maintenance", text: "Electromechanics and mechanics for production units and heavy equipment." },
    { title: "Healthcare & social care", text: "Care assistants and care profiles for growing demand in Ghent's health facilities." }
  ],
  reassurance: [
    {
      title: "Knowledge of the VDAB framework",
      text: "The Flemish shortage list and VDAB requirements for the single permit are integrated from the outset in the feasibility analysis."
    },
    {
      title: "Approach adapted to industrial SMEs",
      text: "LEXPAT Connect is not reserved for large groups. The support is designed for companies that recruit occasionally but seriously."
    },
    {
      title: "End-to-end structured process",
      text: "Each step — from profile selection to start date — is mapped out to avoid unexpected issues and wasted time."
    },
    {
      title: "Legal security and compliance",
      text: "Contract, competent region, salary scales and compliance with collective agreement requirements: everything is checked upfront."
    }
  ],
  finalCta: {
    title: "Still unable to find the right industrial profiles in Ghent?",
    text: "Access a pool of qualified international workers in shortage occupations and move forward with method.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "Access LEXPAT Connect"
  },
  form: {
    title: "Prefer to be contacted directly?",
    intro:
      "If you would rather be called back than explore the platform right away, you can share your hiring need here.",
    buttonLabel: "Send my request",
    formType: "employeur-gand-penurie-en",
    successMessage:
      "Your request has been sent successfully. We will come back to you to discuss your hiring need in Ghent.",
    fields: [
      { name: "nom", label: "Name", placeholder: "First name Last name" },
      { name: "email", label: "Email", placeholder: "contact@company.be", type: "email" },
      { name: "entreprise", label: "Company", placeholder: "Company name" },
      {
        name: "secteur",
        label: "Sector",
        type: "select",
        placeholder: "Select a sector",
        options: ["Steel / metallurgy", "Automotive / assembly", "Chemicals / biotech", "Construction", "Industrial maintenance", "Healthcare", "Other sector"]
      },
      { name: "profil", label: "Role needed", placeholder: "E.g. machine setter, electromechanic, chemical process operator" },
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
    challengeTitle: "What many Ghent employers are really facing",
    challengeIntro: "When some roles remain vacant for too long, the impact is quickly felt in production, organisation and growth.",
    challengeKicker: "Field reality",
    searchedTitle: "Roles that are currently hard to recruit in Ghent",
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
    sectorsTitle: "Ghent sectors that are particularly affected",
    sectorsIntro: "This logic applies to several sectors where hiring pressure directly slows activity.",
    sectorsKicker: "Covered sectors",
    sectorLabel: "Sector",
    reassuranceTitle: "For employers who want to hire fast, without improvising",
    reassuranceIntro: "A local page like this should reassure first: feasibility, method, legal security and time savings.",
    reassuranceKicker: "Reassurance",
    finalCtaBadge: "Recruiting in Ghent",
    contactTitle: "Need a direct conversation before moving forward?",
    contactIntro:
      "The platform remains the main path. This form is offered as a secondary option for employers who prefer to be contacted directly.",
    contactKicker: "Employer contact"
  }
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";

export const metadata = {
  title: page.seo.title,
  description: page.seo.description,
  alternates: {
    canonical: `${BASE}/en/employeurs/gand-metiers-en-penurie`,
    languages: {
      en: `${BASE}/en/employeurs/gand-metiers-en-penurie`,
      fr: `${BASE}/employeurs/gand-metiers-en-penurie`,
    },
  },
};

export default function GandShortageJobsPageEn() {
  return <EmployerRegionalLanding page={page} />;
}
