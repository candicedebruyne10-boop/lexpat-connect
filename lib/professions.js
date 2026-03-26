export const groupedProfessionOptions = [
  {
    label: "Bruxelles-Capitale",
    options: [
      "Infirmier / infirmière",
      "Aide-soignant / aide-soignante",
      "Électricien / électricienne",
      "Technicien de maintenance",
      "Mécanicien / mécanicienne",
      "Chauffeur poids lourd",
      "Développeur / développeuse",
      "Personnel hautement qualifié",
      "Personnel de direction",
      "Autre profession"
    ]
  },
  {
    label: "Wallonie",
    options: [
      "Infirmier / infirmière",
      "Électromécanicien / électromécanicienne",
      "Soudeur / soudeuse",
      "Maçon / maçonne",
      "Couvreur / couvreuse",
      "Chauffeur poids lourd",
      "Analyste informatique",
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
      "Chauffeur poids lourd",
      "Développeur logiciel / développeuse logiciel",
      "Chef de projet technique",
      "Infirmier / infirmière",
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
