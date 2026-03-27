export const groupedProfessionOptions = [
  {
    label: "Bruxelles-Capitale",
    options: [
      "Infirmier / infirmière",
      "Aide-soignant / aide-soignante",
      "Médecin spécialiste",
      "Sage-femme",
      "Électricien / électricienne",
      "Technicien de maintenance",
      "Mécanicien / mécanicienne",
      "Frigoriste",
      "Chauffeur poids lourd",
      "Conducteur d'autobus",
      "Cariste",
      "Développeur / développeuse",
      "Ingénieur logiciel",
      "Analyste informatique",
      "Administrateur systèmes",
      "Chef de projet technique",
      "Personnel hautement qualifié",
      "Personnel de direction",
      "Autre profession"
    ]
  },
  {
    label: "Wallonie",
    options: [
      "Infirmier / infirmière",
      "Aide-soignant / aide-soignante",
      "Électromécanicien / électromécanicienne",
      "Technicien de maintenance",
      "Soudeur / soudeuse",
      "Maçon / maçonne",
      "Couvreur / couvreuse",
      "Électricien / électricienne",
      "Frigoriste",
      "Chauffeur poids lourd",
      "Cariste",
      "Analyste informatique",
      "Développeur / développeuse",
      "Automaticien / automaticienne",
      "Chef de chantier",
      "Conducteur de travaux",
      "Personnel hautement qualifié",
      "Personnel de direction",
      "Autre profession"
    ]
  },
  {
    label: "Flandre",
    options: [
      "Technicien industriel",
      "Électricien industriel / électricienne industrielle",
      "Mécanicien industriel / mécanicienne industrielle",
      "Technicien de maintenance",
      "Soudeur / soudeuse",
      "Chauffeur poids lourd",
      "Cariste",
      "Développeur logiciel / développeuse logiciel",
      "Ingénieur logiciel",
      "Administrateur systèmes",
      "Analyste de données",
      "Chef de projet technique",
      "Infirmier / infirmière",
      "Aide-soignant / aide-soignante",
      "Responsable logistique",
      "Planificateur logistique",
      "Personnel hautement qualifié",
      "Personnel de direction",
      "Autre profession"
    ]
  }
];

export const professionOptionsByRegion = {
  "Bruxelles-Capitale": groupedProfessionOptions[0].options,
  Wallonie: groupedProfessionOptions[1].options,
  Flandre: groupedProfessionOptions[2].options
};
