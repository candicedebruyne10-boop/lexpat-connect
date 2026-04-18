import EmployerRegionalLanding from "../../../../components/EmployerRegionalLanding";

const page = {
  seo: {
    title: "Shortage occupations in Antwerp: recruit international workers | LEXPAT Connect",
    description:
      "In Antwerp, one of the world's largest industrial ports, technical and logistics roles remain persistently vacant. LEXPAT Connect helps employers recruit qualified international workers."
  },
  hero: {
    badge: "Antwerp employers",
    title: "Shortage occupations in Antwerp: find the right technical profiles at last",
    description:
      "In Europe's largest port, certain technical and industrial roles remain vacant for far too long. LEXPAT Connect helps you access qualified international profiles and secure the process when a single permit may be required.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "View candidate profiles",
    secondaryHref: "/en/inscription",
    secondaryLabel: "Share my hiring need",
    note: "Based in Belgium • Structured international recruitment • Legal relay when needed",
    stats: [
      { value: "Antwerp", label: "Built for Antwerp-region employers" },
      { value: "Port & industry", label: "Sectors under acute recruitment pressure" },
      { value: "Single permit", label: "Legal relay when the file requires it" }
    ],
    panels: [
      {
        kicker: "Local pressure",
        title: "The local market no longer covers critical roles in several key sectors",
        text: "Petrochemicals, port logistics, industrial maintenance: available local profiles no longer meet the actual demand."
      },
      {
        kicker: "LEXPAT value",
        title: "Structured access to international profiles",
        text: "Targeted profiles, a realistic reading of the role and legal support when non-EU recruitment requires it."
      }
    ]
  },
  employerChallenges: [
    {
      title: "Technical vacancies open for too long",
      text: "Electromechanics, pipefitters, chemical operators: some critical roles remain open for months despite repeated searches."
    },
    {
      title: "Teams under permanent pressure",
      text: "Recruitment gaps lead to overloads, production delays and growing fatigue among existing teams."
    },
    {
      title: "An exhausted local talent pool",
      text: "In an environment as competitive as the Port of Antwerp, available profiles are quickly captured by large industrial groups."
    },
    {
      title: "Growth projects held back",
      text: "Expansion, new contracts, equipment commissioning: the absence of qualified profiles directly blocks the ability to meet commitments."
    }
  ],
  searchedProfiles: [
    { label: "Electromechanics / maintenance technicians" },
    { label: "Pipefitters" },
    { label: "Chemical process operators" },
    { label: "Heavy vehicle mechanics" },
    { label: "Earthmoving equipment operators" },
    { label: "Inland navigation sailors / barge crew" },
    { label: "Installation technicians" },
    { label: "Refrigeration technicians" },
    { label: "Care assistants" },
    { label: "Formwork workers / concreters" }
  ],
  solutions: [
    {
      title: "Qualified international workers",
      text: "Access a targeted talent pool in technical and industrial trades when the local market no longer provides enough candidates."
    },
    {
      title: "Pre-qualified profiles",
      text: "Applications are carefully reviewed to direct you towards profiles that are genuinely relevant to your need and context."
    },
    {
      title: "Single permit guidance",
      text: "When non-EU recruitment requires it, the single permit steps can be anticipated and secured from the outset."
    },
    {
      title: "Legal risk control",
      text: "Competent region, salary compliance, timing and refusal risks are reviewed with a practical legal lens."
    }
  ],
  internationalRecruiting: {
    title: "Why recruit internationally from Antwerp?",
    intro:
      "In an industrial region of this scale, opening up to international recruitment is no longer a marginal option — it has become a concrete response to a structural shortage of technical profiles.",
    points: [
      "Broaden your candidate pool beyond the saturated Flemish market",
      "Fill critical technical roles faster",
      "Maintain production and meet contractual commitments",
      "Save time with a structured, legally framed approach"
    ]
  },
  legalDifferentiation: {
    title: "International recruitment is not just about finding a CV",
    intro:
      "Hiring outside the EU in the industrial or port sector requires a concrete assessment of the role's eligibility, salary compliance, the competent region and the procedures that actually apply.",
    checklist: [
      "Check whether the role and context support non-EU recruitment",
      "Assess salary compliance against applicable sectoral pay scales",
      "Identify the single permit type and competent region (Flanders)",
      "Anticipate processing times and potential friction points",
      "Reduce refusal risks through a realistic legal review"
    ]
  },
  sectors: [
    { title: "Petrochemicals & chemical industry", text: "Process operators, maintenance technicians and specialised profiles in a sector under very high recruitment pressure." },
    { title: "Port logistics", text: "Equipment operators, barge crew and operational roles essential to the flow of goods through Europe's largest North Sea port." },
    { title: "Industrial maintenance", text: "Electromechanics, mechanics and installation fitters for industrial equipment and utilities." },
    { title: "Construction & special works", text: "Formwork workers, pipefitters, roofers and asbestos removers for industrial sites and building renovation." },
    { title: "Healthcare & home care", text: "Care assistants and home help for a growing demand in the Antwerp care sector." },
    { title: "Refrigeration & HVAC", text: "Refrigeration technicians and installation fitters for port warehouses and food processing industries." }
  ],
  reassurance: [
    {
      title: "Clear feasibility review",
      text: "You get a realistic reading of the role, the industrial context and whether international recruitment makes sense in Antwerp."
    },
    {
      title: "Structured and traceable process",
      text: "Each step is organised to avoid guesswork and ensure clarity on both the employer and administration sides."
    },
    {
      title: "Knowledge of the Flemish framework",
      text: "The Flemish region has its own rules for the single permit. LEXPAT integrates these specifics from the very first step."
    },
    {
      title: "Time gains and legal security",
      text: "You move faster with better control over single permit issues and VDAB requirements."
    }
  ],
  finalCta: {
    title: "Still unable to find the right technical profile in Antwerp?",
    text: "Access a pool of qualified international workers in shortage occupations and get support at every step.",
    primaryHref: "/en/base-de-profils",
    primaryLabel: "Access LEXPAT Connect"
  },
  form: {
    title: "Prefer to be contacted directly?",
    intro:
      "If you would rather be called back than explore the platform right away, you can share your hiring need here.",
    buttonLabel: "Send my request",
    formType: "employeur-anvers-penurie-en",
    successMessage:
      "Your request has been sent successfully. We will come back to you to discuss your hiring need in Antwerp.",
    fields: [
      { name: "nom", label: "Name", placeholder: "First name Last name" },
      { name: "email", label: "Email", placeholder: "contact@company.be", type: "email" },
      { name: "entreprise", label: "Company", placeholder: "Company name" },
      {
        name: "secteur",
        label: "Sector",
        type: "select",
        placeholder: "Select a sector",
        options: ["Petrochemicals / chemical industry", "Port logistics", "Industrial maintenance", "Construction", "Healthcare", "Refrigeration / HVAC", "Other sector"]
      },
      { name: "profil", label: "Role needed", placeholder: "E.g. pipefitter, electromechanic, chemical operator" },
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
    challengeTitle: "What many Antwerp employers are really facing",
    challengeIntro: "When some roles remain vacant for too long, the impact is quickly felt in production, organisation and growth.",
    challengeKicker: "Field reality",
    searchedTitle: "Roles that are currently hard to recruit in Antwerp",
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
    sectorsTitle: "Antwerp sectors that are particularly affected",
    sectorsIntro: "This logic applies to several sectors where hiring pressure directly slows activity.",
    sectorsKicker: "Covered sectors",
    sectorLabel: "Sector",
    reassuranceTitle: "For employers who want to hire fast, without improvising",
    reassuranceIntro: "A local page like this should reassure first: feasibility, method, legal security and time savings.",
    reassuranceKicker: "Reassurance",
    finalCtaBadge: "Recruiting in Antwerp",
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

export default function AnversShortageJobsPageEn() {
  return <EmployerRegionalLanding page={page} />;
}
