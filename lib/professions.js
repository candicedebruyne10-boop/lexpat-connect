import { normalizeRegion } from "./matching";
import { shortageJobs2026 } from "./shortageJobs2026";

const REGION_LABEL_BY_ID = {
  bruxelles: "Bruxelles-Capitale",
  wallonie: "Wallonie",
  flandre: "Flandre"
};

const REGION_TRANSLATIONS_EN = {
  "Bruxelles-Capitale": "Brussels-Capital Region",
  Wallonie: "Walloon Region",
  Flandre: "Flemish Region"
};

const GROUP_TRANSLATIONS_FR = {
  // Flandre VDAB 2026 — Dutch group names → French
  "Land-, tuin- en bosbouw- en visserijberoepen": "Agriculture, horticulture, sylviculture et pêche",
  "Bouwberoepen — studie, werfleiding en omkadering": "Construction — études, conduite de chantier et encadrement",
  "Bouwberoepen — ruwbouw en afwerking": "Construction — gros œuvre et finitions",
  "Bouwberoepen — onderhoud, installaties en infrastructuur": "Construction — entretien, installations et infrastructure",
  "Industriële beroepen — leidinggevenden en technici": "Industrie — cadres et techniciens",
  "Industriële beroepen — productie, voeding en textiel": "Industrie — production, alimentation et textile",
  "Industriële beroepen — metaal, chemie en overige": "Industrie — métal, chimie et autres",
  "Industriële beroepen — voertuigen en machines": "Industrie — véhicules et machines",
  "Transport- en logistieke beroepen": "Transport et logistique",
  "Handels- en verkoopberoepen": "Commerce et vente",
  Horecaberoepen: "Horeca",
  "Vrijetijds- en artistieke beroepen": "Loisirs et métiers artistiques",
  "Organisatieondersteunende en kennisberoepen": "Support organisationnel et métiers du savoir",
  "Dienstverlenende beroepen": "Services à la personne",
  "Medische, paramedische en verzorgende beroepen": "Métiers médicaux, paramédicaux et de soins",
  "Pedagogische beroepen": "Métiers pédagogiques",
};

const GROUP_TRANSLATIONS_EN = {
  // Bruxelles / Wallonie
  "Commerce, vente et grande distribution": "Commerce, sales and retail",
  "Comptabilité, finance, assurances, droit et immobilier": "Accounting, finance, insurance, law and real estate",
  "Construction et travaux publics": "Construction and public works",
  Construction: "Construction",
  "Enseignement et formation": "Education and training",
  Horeca: "Hotels, restaurants and cafes",
  "Informatique et télécommunications": "IT and telecommunications",
  "Métiers administratifs": "Administrative professions",
  "Métiers techniques et de l’industrie": "Technical and industrial professions",
  "Santé et action sociale": "Health and social work",
  "Services à la personne, sécurité, nettoyage et recyclage": "Personal services, security, cleaning and recycling",
  "Transports et logistique": "Transport and logistics",
  "Liste régionale": "Regional list",
  // Flandre (VDAB 2026) — Dutch sector names
  "Land-, tuin- en bosbouw- en visserijberoepen": "Agriculture, horticulture, forestry and fishing",
  "Bouwberoepen — studie, werfleiding en omkadering": "Construction — design, site management and coordination",
  "Bouwberoepen — ruwbouw en afwerking": "Construction — shell and finishing works",
  "Bouwberoepen — onderhoud, installaties en infrastructuur": "Construction — maintenance, installations and infrastructure",
  "Industriële beroepen — leidinggevenden en technici": "Industrial professions — supervisors and technicians",
  "Industriële beroepen — productie, voeding en textiel": "Industrial professions — production, food and textiles",
  "Industriële beroepen — metaal, chemie en overige": "Industrial professions — metal, chemicals and other",
  "Industriële beroepen — voertuigen en machines": "Industrial professions — vehicles and machinery",
  "Transport- en logistieke beroepen": "Transport and logistics professions",
  "Handels- en verkoopberoepen": "Commercial and sales professions",
  Horecaberoepen: "Hospitality and catering professions",
  "Vrijetijds- en artistieke beroepen": "Leisure and artistic professions",
  "Organisatieondersteunende en kennisberoepen": "Organisational support and knowledge professions",
  "Dienstverlenende beroepen": "Service professions",
  "Medische, paramedische en verzorgende beroepen": "Medical, paramedical and care professions",
  "Pedagogische beroepen": "Educational and pedagogical professions",
  Autre: "Other"
};

const SECTOR_TRANSLATIONS_EN = {
  "Commerce et vente": "Commerce and sales",
  "Comptabilité, finance et immobilier": "Accounting, finance and real estate",
  "Construction et travaux publics": "Construction and public works",
  "Éducation et formation": "Education and training",
  Horeca: "Hotels, restaurants and cafes",
  "Industrie et maintenance": "Industry and maintenance",
  "Santé et action sociale": "Health and social work",
  "Services à la personne et sécurité": "Personal services and security",
  "Technologies et informatique": "Technology and IT",
  "Transport et logistique": "Transport and logistics",
  "Autre secteur": "Other sector"
};

// ── Traductions françaises des intitulés néerlandais VDAB 2026 ─────────────
const JOB_TRANSLATIONS_FR = {
  // Land-, tuin- en bosbouw
  "Medewerker landbouw": "Ouvrier agricole",
  "Medewerker tuinbouw": "Ouvrier horticole",
  "Medewerker tuin- en groenaanleg en -onderhoud": "Ouvrier en aménagement et entretien d'espaces verts",
  "Verantwoordelijke tuin- en groenaanleg en -onderhoud": "Responsable en aménagement et entretien d'espaces verts",
  // Bouw — studie & werfleiding
  "Bodemonderzoeker": "Ingénieur en étude de sol",
  "Bouwkundig tekenaar": "Dessinateur en bâtiment",
  "Calculator bouw": "Métreur-calculateur bâtiment",
  "Ingenieur studie en advies bouw": "Ingénieur études et conseils en construction",
  "Landmeter": "Géomètre",
  "Projectleider bouw en openbare werken": "Chef de projet construction et travaux publics",
  "Veiligheidscoördinator": "Coordinateur de sécurité",
  "Werfleider": "Chef de chantier",
  // Bouw — ruwbouw
  "Bekister-betonneerder": "Coffreur-bétonneur",
  "Daktimmerman": "Charpentier de toit",
  "Dakwerker": "Couvreur",
  "Medewerker ruwbouw": "Ouvrier en gros œuvre",
  "Metselaar": "Maçon",
  "Schrijnwerker houtbouw": "Charpentier ossature bois",
  // Bouw — afwerking
  "Dekvloerlegger": "Poseur de chape",
  "Glaswerker": "Vitrier",
  "Interieurbouwer": "Aménageur intérieur",
  "Natuursteenbewerker": "Tailleur de pierre naturelle",
  "Plaatser binnenschrijnwerk": "Poseur de menuiseries intérieures",
  "Plaatser buitenschrijnwerk": "Poseur de menuiseries extérieures",
  "Schilder-decorateur": "Peintre-décorateur",
  "Stukadoor": "Plâtrier",
  "Vloerder-tegelzetter": "Carreleur",
  // Bouw — onderhoud & installaties
  "Asbestverwijderaar": "Désamianteur",
  "Brandertechnicus": "Technicien en brûleurs",
  "Gevelrenoveerder-betonhersteller": "Rénovateur de façades et restaurateur béton",
  "Technicus installatietechnieken": "Technicien en techniques d'installation",
  "Beveiligingstechnicus": "Technicien en sécurité électronique",
  "Datacommunicatie- en netwerktechnicus": "Technicien en communication de données et réseaux",
  "Elektrotechnisch installateur": "Installateur électrotechnique",
  "Installateur energiemanagementsystemen": "Installateur de systèmes de gestion de l'énergie",
  "Monteur installatietechnieken": "Monteur en techniques d'installation",
  "Plaatser van boven- en ondergrondse leidingen": "Poseur de conduites aériennes et souterraines",
  "Technicus hernieuwbare energietechnieken": "Technicien en énergies renouvelables",
  "Rioollegger": "Poseur de canalisations d'égout",
  "Wegenwerker": "Ouvrier routier",
  "Aansluiter van waterleidingen, rioleringen en warmtenetten": "Raccordeur eau, égouts et réseaux de chaleur",
  "Installateur nutsvoorzieningen": "Installateur de réseaux d'utilité publique",
  "Steigerbouwer": "Échafaudeur",
  "Bediener grondverzetmachines": "Conducteur d'engins de terrassement",
  "Bediener machines horizontale boringen": "Conducteur de machines de forage horizontal",
  "Bediener machines verticale boringen": "Conducteur de machines de forage vertical",
  "Bediener van betonnerings- en asfalteringsmachines": "Conducteur de machines à bétonner et asphalter",
  "Kraanbestuurder": "Grutier",
  "Torenkraanbediener": "Grutier de tour",
  // Industrieel — leidinggevenden & technici
  "Afdelingsverantwoordelijke productie": "Responsable de département production",
  "Productiemanager": "Responsable de production",
  "Projectmanager engineering": "Chef de projet ingénierie",
  "Teamleader productie": "Chef d'équipe production",
  "Verantwoordelijke industrieel onderhoud": "Responsable de maintenance industrielle",
  "Verantwoordelijke kwaliteitscontrole": "Responsable contrôle qualité",
  "Verantwoordelijke onderzoek en ontwikkeling": "Responsable recherche et développement",
  "Expert productieproces en -methodes": "Expert processus et méthodes de production",
  "Productieplanner": "Planificateur de production",
  "Werkvoorbereider": "Préparateur de travaux",
  "Industrieel laborant": "Laborantin industriel",
  "Industrieel elektromecanicien": "Électromécanicien industriel",
  "Lifttechnicus": "Technicien ascenseurs",
  "Ontwerper industriële automatisering": "Concepteur en automatisation industrielle",
  "Technicus elektro en elektronica": "Technicien électricité et électronique",
  "Technicus elektronische installaties": "Technicien en installations électroniques",
  "Koeltechnicus": "Technicien frigoriste",
  "Regeltechnicus klimatisatie": "Technicien régulation climatisation",
  "Industrieel onderhoudstechnicus": "Technicien de maintenance industrielle",
  "Onderhoudstechnicus industriële automatisering": "Technicien de maintenance en automatisation industrielle",
  "Tekenaar-ontwerper elektriciteit, elektronica": "Dessinateur-concepteur en électricité et électronique",
  "Tekenaar-ontwerper mechanica": "Dessinateur-concepteur mécanique",
  // Industrieel — voeding, textiel, druk, hout
  "Procesoperator voedingsindustrie": "Opérateur de processus industrie alimentaire",
  "Productieoperator voedingsindustrie": "Opérateur de production industrie alimentaire",
  "Brood- en banketbakker": "Boulanger-pâtissier",
  "Chocolatier-ijsbereider: chocolatier": "Chocolatier-glacier",
  "Slachter": "Abatteur",
  "Slager": "Boucher",
  "Uitsnijder-uitbener": "Découpeur-désosseur",
  "Productieoperator textielproductielijn": "Opérateur de production sur ligne textile",
  "Productieoperator van textielmachines": "Opérateur de machines textiles",
  "Productiemedewerker textielproductielijn": "Ouvrier de production sur ligne textile",
  "Polyvalent stikster": "Couturière polyvalente",
  "Operator drukken": "Conducteur de presse",
  "Operator drukafwerking": "Conducteur de finition d'impression",
  "Operator CNC-gestuurde houtbewerkingsmachines": "Conducteur de machines à bois CNC",
  "Productieoperator hout": "Opérateur de production bois",
  "Meubelmaker": "Ébéniste / fabricant de meubles",
  "Werkplaatsschrijnwerker": "Menuisier d'atelier",
  // Industrieel — metaal, chemie, overige
  "Operator gieterij": "Opérateur de fonderie",
  "Operator montage en assemblage": "Opérateur montage et assemblage",
  "Manueel lasser": "Soudeur manuel",
  "Matrijzenmaker": "Outilleur-mouliste",
  "Insteller-omsteller plaatbewerking": "Régleur-opérateur en travail de tôle",
  "Insteller-omsteller verspaning": "Régleur-opérateur en usinage",
  "Machinebouwer": "Constructeur de machines",
  "Monteur staalconstructies": "Monteur en constructions métalliques",
  "Pijpfitter": "Tuyauteur",
  "Rigger-monteerder": "Gréeur-monteur",
  "Bordenbouwer - Elektromonteur machinebouw": "Constructeur de tableaux électriques / électromonteur",
  "Elektrotechnicus": "Électrotechnicien",
  "Technicus industriële elektriciteit": "Technicien en électricité industrielle",
  "Operator farma en biotech": "Opérateur pharma et biotech",
  "Procesoperator chemische industrie": "Opérateur de processus industrie chimique",
  "Procesoperator energetische en petrochemische industrie": "Opérateur de processus industrie énergétique et pétrochimique",
  "Productieoperator-machineregelaar kunststoffen": "Opérateur de production / régleur machines plastiques",
  "Productiemedewerker kunststofverwerking": "Ouvrier en transformation des plastiques",
  "Operator van een papier- of kartonmachine": "Conducteur de machine papier ou carton",
  "Verpakkingsoperator": "Opérateur d'emballage",
  "Industrieel schilder": "Peintre industriel",
  "Uitvoerder van werken op hoogte": "Technicien de travaux en hauteur",
  "Diamantbewerker": "Tailleur de diamants",
  // Industrieel — voertuigen & machines
  "OAD-technicus van personenwagens en lichte bedrijfsvoertuigen": "Technicien OBD — voitures et véhicules légers",
  "OD-technicus van zware bedrijfsvoertuigen": "Technicien OBD — véhicules utilitaires lourds",
  "Technicus van bromfietsen en motorfietsen": "Technicien cyclomoteurs et motocyclettes",
  "Technicus van tuin-, park- en bosmachines": "Technicien machines de jardin, parc et forêt",
  "Technicus werf-, landbouw- en hefmachines": "Technicien machines de chantier, agricoles et de levage",
  "Vliegtuigtechnicus": "Technicien aéronautique",
  "Werktuigkundige scheepvaart": "Mécanicien navigant",
  "Fietshersteller": "Réparateur de vélos",
  "Onderhoudsmecanicien van personenwagens en lichte bedrijfsvoertuigen": "Mécanicien d'entretien — voitures et véhicules légers",
  "Onderhoudsmecanicien van zware bedrijfsvoertuigen": "Mécanicien d'entretien — véhicules utilitaires lourds",
  "Monteur-demonteur carrosserie": "Monteur-démonteur carrosserie",
  "Plaatwerker carrosserie": "Tôlier carrosserie",
  "Spuiter carrosserie": "Peintre carrosserie",
  "Voorbewerker carrosserie": "Préparateur carrosserie",
  // Transport & logistiek
  "Dispatcher goederenvervoer": "Dispatcher transport de marchandises",
  "Douanedeclarant": "Déclarant en douane",
  "Expediteur": "Transitaire",
  "Logistiek verantwoordelijke": "Responsable logistique",
  "Heftruckchauffeur": "Cariste",
  "Magazijnmedewerker": "Magasinier",
  "Reachtruckchauffeur": "Cariste reach truck",
  "Verhuizer": "Déménageur",
  "Autobuschauffeur": "Chauffeur d'autobus",
  "Autocarchauffeur": "Chauffeur d'autocar",
  "Taxichauffeur en chauffeur privévervoer": "Chauffeur de taxi et de transport privé",
  "Vrachtwagenbestuurder": "Chauffeur de camion",
  "Treinbestuurder": "Conducteur de train",
  "Spoorwerker": "Agent de voie ferrée",
  "Matroos binnenscheepvaart": "Matelot de navigation intérieure",
  // Handel & verkoop
  "Opticien": "Opticien",
  "Winkelverkoper": "Vendeur en magasin",
  "Technisch adviseur klantenondersteuning": "Conseiller technique support client",
  "Winkelmedewerker": "Employé de magasin",
  "Assistent winkelmanager": "Assistant responsable de magasin",
  "Winkelmanager": "Responsable de magasin",
  "Vertegenwoordiger B2B": "Représentant B2B",
  // Horeca
  "Hotelreceptionist": "Réceptionniste d'hôtel",
  "Kamerjongen-Kamermeisje": "Valet / femme de chambre",
  "Polyvalent hotelmedewerker": "Employé polyvalent d'hôtel",
  "Chef de partie": "Chef de partie",
  "Grootkeukenkok": "Cuisinier de collectivité",
  "Hulpkok": "Commis de cuisine",
  "Hulpkok grootkeuken": "Commis de cuisine (collectivité)",
  "Keukenmedewerker": "Aide de cuisine",
  "Kok": "Cuisinier",
  "Medewerker fastfood": "Équipier restauration rapide",
  "Barman": "Barman",
  "Hulpkelner": "Aide-serveur",
  "Kelner": "Serveur",
  "Maître d'hôtel": "Maître d'hôtel",
  "Horecamanager": "Responsable horeca",
  // Vrijetijd & kunst
  "Polyvalent podiumtechnicus": "Technicien de scène polyvalent",
  "Redder: Hoger Redder": "Maître-nageur sauveteur",
  // Organisatieondersteunend & kennis
  "Sales engineer": "Ingénieur commercial",
  "Commercieel medewerker binnendienst": "Commercial sédentaire",
  "Contactcenter medewerker": "Agent de centre de contact",
  "Payroll advisor": "Gestionnaire de la paie",
  "Accountant": "Comptable",
  "Verantwoordelijke ICT": "Responsable ICT",
  "Managementassistent": "Assistant de direction",
  "Technisch-administratief medewerker": "Employé technico-administratif",
  "Data manager": "Gestionnaire de données",
  "Data scientist": "Data scientist",
  "ICT architect": "Architecte ICT",
  "ICT security specialist": "Spécialiste en sécurité ICT",
  "Integratie expert ICT": "Expert en intégration ICT",
  "Software analist": "Analyste logiciel",
  "Netwerkbeheerder": "Administrateur réseau",
  "Systeembeheerder": "Administrateur système",
  "Data engineer": "Ingénieur de données",
  "Software ontwikkelaar": "Développeur logiciel",
  "Software tester": "Testeur logiciel",
  "Support medewerker ICT": "Technicien support ICT",
  // Dienstverlening
  "Arbeidsbemiddelaar-jobcoach: uitzendconsulent": "Consultant en intérim / coach emploi",
  "Maatschappelijk werker": "Assistant social",
  "Kapper": "Coiffeur",
  "Schoonheidsspecialist": "Esthéticien",
  "Medewerker textielverzorging": "Employé entretien textile",
  "Uitvaartondernemer: uitvaartassistent": "Assistant de pompes funèbres",
  "Adviseur beleggingen": "Conseiller en investissements",
  "Adviseur kredieten": "Conseiller en crédits",
  "Adviseur verzekeringen": "Conseiller en assurances",
  "Beheerder verzekeringen": "Gestionnaire en assurances",
  "Syndicus: medewerker syndicus": "Gestionnaire de copropriété",
  "Bewakingsagent": "Agent de gardiennage",
  "Beveiligingsagent (politie)": "Agent de sécurité publique (police)",
  "Soldaat-matroos bij defensie": "Soldat-marin de la défense",
  "Huishoudhulp-poetshulp": "Aide ménagère / aide au nettoyage",
  "Ruitenwasser": "Laveur de vitres",
  "Industrieel reiniger": "Nettoyeur industriel",
  // Medisch & paramedisch
  "Arts": "Médecin",
  "Dierenarts": "Vétérinaire",
  "Apotheker: ziekenhuisapotheker": "Pharmacien hospitalier",
  "Kinesitherapeut": "Kinésithérapeute",
  "Audioloog-audicien": "Audiologiste-audioprothésiste",
  "Ergotherapeut": "Ergothérapeute",
  "Optometrist": "Optométriste",
  "Orthopedisch technoloog": "Technicien en orthopédie",
  "Technoloog medische beeldvorming": "Technologue en imagerie médicale",
  "Hoofdverpleegkundige": "Infirmier en chef",
  "Verpleegkundige": "Infirmier",
  "Persoonlijk assistent": "Assistant personnel (aide)",
  "Verzorgende": "Aide à domicile",
  "Zorgkundige": "Aide-soignant",
  "Dentaaltechnicus": "Prothésiste dentaire",
  "Hulpverlener-ambulancier": "Secouriste-ambulancier",
  // Pedagogisch
  "Leerkracht buitengewoon secundair onderwijs": "Enseignant en secondaire spécialisé",
  "Leerkracht kleuteronderwijs": "Enseignant en maternelle",
  "Leerkracht lager onderwijs": "Enseignant en primaire",
  "Leerkracht secundair onderwijs": "Enseignant en secondaire",
  "Leidinggevende onderwijsinstelling": "Directeur d'établissement scolaire",
  "Rijinstructeur": "Moniteur d'auto-école",
  "Kinderbegeleider baby's en peuters": "Éducateur petite enfance (bébés et tout-petits)",
  "Kinderbegeleider schoolgaande kinderen": "Éducateur enfants d'âge scolaire",
  "Monitor-begeleider in de sociale economie": "Moniteur-accompagnateur en économie sociale",
  "Opvoeder-begeleider": "Éducateur-accompagnateur",
  "Verantwoordelijke kinderopvang": "Responsable de crèche",
};

const JOB_TRANSLATIONS_EN = {
  "Conseiller technico-commercial / Conseillère technico-commerciale": "Technical Sales Advisor",
  "Conseiller technique pour le support à la clientèle / Conseillère technique pour le support à la clientèle": "Technical Advisor for Customer Support",
  "Responsable de rayon produits alimentaires": "Food Department Manager",
  "Analyste financier / Analyste financière": "Financial Analyst",
  "Chef comptable / Cheffe comptable": "Chief Accountant",
  Comptable: "Accountant",
  "Conseiller en assurances / Conseillère en assurances": "Insurance Advisor",
  "Expert-comptable / Experte comptable": "Chartered Accountant",
  "Syndic d’immeubles": "Property Manager",
  "Chargé d’études techniques du bâtiment / Chargée d’études techniques du bâtiment": "Building Technical Researcher",
  "Chef de chantier / Cheffe de chantier": "Site Manager",
  "Coffreur-ferrailleur / Coffreuse-ferrailleuse": "Formwork carpenter / steel fixer",
  "Conducteur de chantier / Conductrice de chantier": "Construction Site Supervisor",
  "Conducteur de grue à tour / Conductrice de grue à tour": "Tower crane operator",
  "Conducteur de grue mobile / Conductrice de grue mobile": "Mobile crane operator",
  "Conducteur d’engins de chantier / Conductrice d’engins de chantier": "Construction equipment operator",
  "Couvreur de toits inclinés / Couvreuse de toits inclinés": "Pitched roof roofer",
  "Couvreur de toits plats / Couvreuse de toits plats": "Flat roof roofer",
  "Électricien installateur industriel / Électricienne installatrice industrielle": "Industrial electrician installer",
  "Électricien installateur résidentiel / Électricienne installatrice résidentielle": "Residential electrician installer",
  "Installateur de réseaux de communication de données / Installatrice de réseaux de communication de données": "Communications network technician",
  "Maçon / Maçonne": "Bricklayer",
  "Menuisier d’extérieur / Menuisière d’extérieur": "Exterior construction carpenter",
  "Menuisier d’intérieur / Menuisière d’intérieur": "Interior construction carpenter",
  "Métreur / Métreuse": "Quantity Surveyor",
  "Ouvrier de voirie / Ouvrière de voirie": "Road construction worker",
  "Responsable de l’entretien des bâtiments et infrastructures": "Building and Infrastructure Maintenance Manager",
  "Technicien de maintenance de brûleurs / Technicienne de maintenance de brûleurs": "Heating system maintenance technician",
  "Technicien de maintenance en systèmes de chauffage / Technicienne de maintenance en systèmes de chauffage": "Heating systems maintenance technician",
  "Coordinateur pédagogique / Coordinatrice pédagogique": "Educational coordinator",
  "Éducateur dans un établissement scolaire / Éducatrice dans un établissement scolaire": "Educator in a school",
  "Enseignant dans l’enseignement secondaire / Enseignante dans l’enseignement secondaire": "Secondary school teacher",
  "Enseignant dans l’enseignement maternel ou primaire / Enseignante dans l’enseignement maternel ou primaire": "Nursery or primary school teacher",
  "Formateur pour adultes / Formatrice pour adultes": "Adult trainer",
  "Moniteur d’auto-école / Monitrice d’auto-école": "Driving instructor",
  "Assistant de direction d’hôtel-restaurant / Assistante de direction d’hôtel-restaurant": "Hotel and restaurant management assistant",
  "Analyste-développeur TIC / Analyste-développeuse TIC": "ICT analyst-developer",
  "Business Analyst TIC": "ICT business analyst",
  "Responsable de département informatique": "IT Department Manager",
  "Assistant de direction / Assistante de direction": "Executive Assistant",
  "Manager des ressources humaines / Manageuse des ressources humaines": "Human Resources Manager",
  "Dessinateur-concepteur en électricité et électronique / Dessinatrice-conceptrice en électricité et électronique": "Electrical and electronic design draughtsperson",
  "Dessinateur-concepteur mécanique / Dessinatrice-conceptrice mécanique": "Mechanical design draughtsperson",
  "Électricien de maintenance / Électricienne de maintenance": "Maintenance electrician",
  "Expert en sécurité, hygiène et environnement / Experte en sécurité, hygiène et environnement": "Safety, health and environment expert",
  "Inspecteur de conformité / Inspectrice de conformité": "Compliance inspector",
  "Installateur d’ascenseurs / Installatrice d’ascenseurs": "Elevator installer",
  "Mécanicien de maintenance / Mécanicienne de maintenance": "Maintenance mechanic",
  "Responsable contrôle qualité en industrie": "Quality control manager in industry",
  "Responsable de maintenance industrielle": "Industrial maintenance manager",
  "Responsable des méthodes de production et de l’industrialisation": "Production Methods and Industrialisation Manager",
  "Responsable du planning et de la gestion de la production": "Production Planning and Management Manager",
  "Technicien de maintenance d’ascenseurs / Technicienne de maintenance d’ascenseurs": "Elevator maintenance technician",
  "Technicien de maintenance en équipements industriels / Technicienne de maintenance en équipements industriels": "Industrial equipment maintenance technician",
  "Technicien en automatisation industrielle / Technicienne en automatisation industrielle": "Industrial automation technician",
  "Technicien en froid et climatisation / Technicienne en froid et climatisation": "Refrigeration and air-conditioning technician",
  "Technicien en sécurité, hygiène et environnement / Technicienne en sécurité, hygiène et environnement": "Safety, health and environment technician",
  "Aide-soignant / Aide-soignante": "Healthcare assistant",
  "Ambulancier-secouriste / Ambulancière-secouriste": "Paramedic",
  "Assistant social / Assistante sociale": "Social worker",
  "Conseiller emploi / Conseillère emploi": "Employment advisor",
  "Conseiller en aide sociale / Conseillère en aide sociale": "Social welfare advisor",
  "Éducateur-accompagnateur / Éducatrice-accompagnatrice": "Educator-accompanist",
  Ergothérapeute: "Occupational therapist",
  "Infirmier / Infirmière": "Nurse",
  "Infirmier en chef / Infirmière en chef": "Head nurse",
  "Infirmier social / Infirmière sociale": "Social nurse",
  "Infirmier spécialisé au bloc opératoire / Infirmière spécialisée au bloc opératoire": "Operating theatre nurse",
  "Infirmier spécialisé en pédiatrie / Infirmière spécialisée en pédiatrie": "Paediatric nurse",
  Logopède: "Speech therapist",
  Médecin: "Doctor",
  "Moniteur-animateur dans l’économie sociale / Monitrice-animatrice dans l’économie sociale": "Instructor-facilitator in the social economy",
  "Pharmacien / Pharmacienne": "Pharmacist",
  "Puériculteur / Puéricultrice": "Childcare worker",
  "Responsable de garderie": "Daycare manager",
  "Technologue de laboratoire médical": "Medical laboratory technologist",
  "Technologue en imagerie médicale": "Medical imaging technologist",
  "Agent de gardiennage / Agente de gardiennage": "Security guard",
  "Agent de la sécurité publique / Agente de la sécurité publique": "Public security officer",
  "Acheteur / Acheteuse": "Purchaser",
  "Conducteur d’autobus / Conductrice d’autobus": "Bus driver",
  "Conducteur de camion avec remorque / Conductrice de camion avec remorque": "Truck driver with trailer",
  "Conducteur de poids lourd multibennes / Conductrice de poids lourd multibennes": "Multi-skip truck driver",
  "Responsable des achats": "Head of procurement",
  "Conducteur / Conductrice de chantier": "Construction Site Supervisor",
  "Monteur / Monteuse de structures métalliques lourdes": "Heavy steel structure assembler",
  "Installateur / Installatrice sanitaire": "Sanitary installer (plumber)",
  "Monteur / Monteuse d’installations de chauffage central": "Central heating installer",
  "Menuisier / Menuisière de chantier d’extérieur": "Exterior construction carpenter",
  "Menuisier / Menuisière de chantier d’intérieur": "Interior construction carpenter",
  "Carreleur / Carreleuse": "Tiler",
  "Couvreur / Couvreuse de toits inclinés": "Pitched roof roofer",
  "Maçon / Maçonne qualifiée": "Qualified bricklayer / mason",
  "Poseur / Poseuse de conduites d’eaux": "Water pipe layer",
  "Chef / Cheffe de partie": "Chef de partie",
  "Technicien / Technicienne en processus et méthodes de production": "Production process and methods technician",
  "Conducteur / Conductrice d’installation en industrie chimique": "Chemical plant operator",
  "Conducteur / Conductrice de machine de fabrication de produits textiles": "Textile manufacturing machine operator",
  "Chef / Cheffe d'équipe en industrie de production": "Production team leader",
  "Tôlier industriel / Tôlière industrielle": "Industrial sheet metal worker",
  "Régleur-opérateur / Régleuse-opératrice machines-outils CN": "CNC machine tool setter-operator",
  "Régleur-opérateur / Régleuse-opératrice machines-outils conventionnelles": "Conventional machine tool setter-operator",
  "Assembleur / Assembleuse d'éléments de structure métallique": "Metal structure assembler",
  "Soudeur / Soudeuse TIG": "TIG welder",
  "Tuyauteur / Tuyauteuse": "Pipe fitter",
  "Électromécanicien / Électromécanicienne de maintenance industrielle": "Industrial maintenance electromechanic",
  "Technicien / Technicienne de maintenance en électronique industrielle": "Industrial electronics maintenance technician",
  "Technicien / Technicienne en froid et climatisation": "Refrigeration and air-conditioning technician",
  "Technicien / Technicienne de réseaux de communication et en système de sécurité": "Communication networks and security systems technician",
  "Technicien / Technicienne de maintenance en système de chauffage": "Heating systems maintenance technician",
  "Électricien / Électricienne de maintenance": "Maintenance electrician",
  "Mécanicien / Mécanicienne de maintenance": "Maintenance mechanic",
  "Mécanicien / Mécanicienne de maintenance d’engins de chantier, agricoles et levage": "Construction, agricultural and lifting equipment maintenance mechanic",
  "Mécanicien / Mécanicienne pour camions et véhicules utilitaires lourds (+ 3,5T)": "Heavy truck and commercial vehicle mechanic (+3.5T)",
  "Mécanicien / Mécanicienne pour voitures et véhicules légers (- 3,5T)": "Car and light vehicle mechanic (-3.5T)",
  "Technicien / Technicienne automobile": "Automotive technician",
  "Tôlier / Tôlière en carrosserie": "Bodywork sheet metal worker",
  "Préparateur / Préparatrice en carrosserie": "Bodywork preparer",
  "Peintre en carrosserie": "Bodywork painter",
  "Matelot dans la navigation intérieure": "Inland waterways sailor (deckhand)",
  "Conducteur / Conductrice de poids-lourd permis C": "Heavy truck driver - Category C license",
  "Conducteur / Conductrice de poids-lourd permis CE - multibennes": "Heavy truck driver - Category CE license (skip loader / multi-skip)",
  "Conducteur / Conductrice de poids-lourd permis CE": "Heavy truck driver - Category CE license",
  "Conducteur / Conductrice d’autocar": "Coach driver",
  "Enseignant, dans les limites de la liste des fonctions en pénurie de main-d’œuvre dans l’enseignement établie par la Communauté française": "Teacher (within the shortage occupation list for teaching established by the French Community)",
  "Conducteur d'engins de terrassement": "Earthmoving machinery operator",
  "Batelier-pilote de navigation intérieure / Matelot de navigation intérieure": "Inland waterway skipper-mate / inland waterway deckhand",
  "Mécanicien de maintenance de véhicules utilitaires lourds": "Maintenance mechanic of heavy commercial vehicles",
  "Technicien de voitures particulières et de véhicules utilitaires légers": "Passenger car and light commercial vehicle technician",
  "Technicien de machines de chantier, agricoles et de levage": "Construction, agricultural and lifting machinery technician",
  "Préparateur / Tôlier en carrosserie": "Bodywork prepper / panel beater",
  "Électrotechnicien et mécanicien": "Electrotechnician and mechanic",
  "Monteur en techniques d'installation": "Installation techniques fitter",
  "Technicien frigoriste": "Refrigeration technician",
  Tuyauteur: "Pipefitter",
  "Technicien de communication de données et de réseaux": "Data communication and network technician",
  "Aide-soignant": "Healthcare assistant",
  "Aide à domicile": "Caregiver",
  "Régleur-opérateur en tôlerie / usinage": "Sheet metal / machining setter-operator",
  "Coffreur-bétonneur": "Formworker-concrete worker",
  Maçon: "Mason",
  "Calculateur construction / préparateur de travaux": "Construction estimator / work preparer",
  Couvreur: "Roofer",
  "Opérateur de processus industrie chimique": "Chemical industry process operator",
  Désamianteur: "Asbestos remover",
  Diamantaire: "Diamond worker",
  "Autre profession": "Other occupation",

  // ── Flandre VDAB 2026 — Dutch job title translations ─────────────────────
  // Land-, tuin- en bosbouw
  "Medewerker landbouw": "Agricultural worker",
  "Medewerker tuinbouw": "Horticulture worker",
  "Medewerker tuin- en groenaanleg en -onderhoud": "Garden and green space worker",
  "Verantwoordelijke tuin- en groenaanleg en -onderhoud": "Garden and green space supervisor",
  // Bouw — studie & werfleiding
  "Bodemonderzoeker": "Soil surveyor",
  "Bouwkundig tekenaar": "Architectural draughtsperson",
  "Calculator bouw": "Construction estimator",
  "Ingenieur studie en advies bouw": "Building design and advisory engineer",
  "Landmeter": "Land surveyor",
  "Projectleider bouw en openbare werken": "Construction and public works project manager",
  "Veiligheidscoördinator": "Safety coordinator",
  "Werfleider": "Construction site manager",
  // Bouw — ruwbouw
  "Bekister-betonneerder": "Formwork setter and concrete worker",
  "Daktimmerman": "Roof carpenter",
  "Dakwerker": "Roofer",
  "Medewerker ruwbouw": "Shell construction worker",
  "Metselaar": "Bricklayer / Mason",
  "Schrijnwerker houtbouw": "Timber frame carpenter",
  // Bouw — afwerking
  "Dekvloerlegger": "Screed floor layer",
  "Glaswerker": "Glazier",
  "Interieurbouwer": "Interior builder",
  "Natuursteenbewerker": "Natural stone worker",
  "Plaatser binnenschrijnwerk": "Interior joinery installer",
  "Plaatser buitenschrijnwerk": "Exterior joinery installer",
  "Schilder-decorateur": "Painter-decorator",
  "Stukadoor": "Plasterer",
  "Vloerder-tegelzetter": "Floor and tile layer",
  // Bouw — onderhoud & installaties
  "Asbestverwijderaar": "Asbestos remover",
  "Brandertechnicus": "Burner technician",
  "Gevelrenoveerder-betonhersteller": "Façade renovator / concrete restorer",
  "Technicus installatietechnieken": "Building installation technician",
  "Beveiligingstechnicus": "Security systems technician",
  "Datacommunicatie- en netwerktechnicus": "Data communication and network technician",
  "Elektrotechnisch installateur": "Electrotechnical installer",
  "Installateur energiemanagementsystemen": "Energy management systems installer",
  "Monteur installatietechnieken": "Installation technician (HVAC / plumbing)",
  "Plaatser van boven- en ondergrondse leidingen": "Above and underground pipe installer",
  "Technicus hernieuwbare energietechnieken": "Renewable energy technician",
  "Rioollegger": "Sewer pipe layer",
  "Wegenwerker": "Road construction worker",
  "Aansluiter van waterleidingen, rioleringen en warmtenetten": "Water, sewage and heating network connector",
  "Installateur nutsvoorzieningen": "Utilities installer",
  "Steigerbouwer": "Scaffolder",
  "Bediener grondverzetmachines": "Earthmoving machine operator",
  "Bediener machines horizontale boringen": "Horizontal drilling machine operator",
  "Bediener machines verticale boringen": "Vertical drilling machine operator",
  "Bediener van betonnerings- en asfalteringsmachines": "Concrete and asphalt machine operator",
  "Kraanbestuurder": "Crane operator",
  "Torenkraanbediener": "Tower crane operator",
  // Industrieel — leidinggevenden & technici
  "Afdelingsverantwoordelijke productie": "Production department supervisor",
  "Productiemanager": "Production manager",
  "Projectmanager engineering": "Engineering project manager",
  "Teamleader productie": "Production team leader",
  "Verantwoordelijke industrieel onderhoud": "Industrial maintenance supervisor",
  "Verantwoordelijke kwaliteitscontrole": "Quality control supervisor",
  "Verantwoordelijke onderzoek en ontwikkeling": "R&D supervisor",
  "Expert productieproces en -methodes": "Production process and methods expert",
  "Productieplanner": "Production planner",
  "Werkvoorbereider": "Work preparation engineer",
  "Industrieel laborant": "Industrial laboratory technician",
  "Industrieel elektromecanicien": "Industrial electromechanic",
  "Lifttechnicus": "Lift technician",
  "Ontwerper industriële automatisering": "Industrial automation designer",
  "Technicus elektro en elektronica": "Electrical and electronics technician",
  "Technicus elektronische installaties": "Electronic installations technician",
  "Koeltechnicus": "Refrigeration technician",
  "Regeltechnicus klimatisatie": "Climate control technician",
  "Industrieel onderhoudstechnicus": "Industrial maintenance technician",
  "Onderhoudstechnicus industriële automatisering": "Industrial automation maintenance technician",
  "Tekenaar-ontwerper elektriciteit, elektronica": "Electrical and electronic design draughtsperson",
  "Tekenaar-ontwerper mechanica": "Mechanical design draughtsperson",
  // Industrieel — voeding, textiel, druk, hout
  "Procesoperator voedingsindustrie": "Food industry process operator",
  "Productieoperator voedingsindustrie": "Food industry production operator",
  "Brood- en banketbakker": "Bread and pastry baker",
  "Chocolatier-ijsbereider: chocolatier": "Chocolatier and ice cream maker",
  "Slachter": "Slaughterer",
  "Slager": "Butcher",
  "Uitsnijder-uitbener": "Meat cutter / deboner",
  "Productieoperator textielproductielijn": "Textile production line operator",
  "Productieoperator van textielmachines": "Textile machine operator",
  "Productiemedewerker textielproductielijn": "Textile production line worker",
  "Polyvalent stikster": "Polyvalent sewing machine operator",
  "Operator drukken": "Print operator",
  "Operator drukafwerking": "Print finishing operator",
  "Operator CNC-gestuurde houtbewerkingsmachines": "CNC woodworking machine operator",
  "Productieoperator hout": "Wood production operator",
  "Meubelmaker": "Cabinet maker / furniture maker",
  "Werkplaatsschrijnwerker": "Workshop carpenter / joiner",
  // Industrieel — metaal, chemie, overige
  "Operator gieterij": "Foundry operator",
  "Operator montage en assemblage": "Assembly operator",
  "Manueel lasser": "Manual welder",
  "Matrijzenmaker": "Die / mould maker",
  "Insteller-omsteller plaatbewerking": "Sheet metal machine setter-operator",
  "Insteller-omsteller verspaning": "Machining setter-operator (turning / milling)",
  "Machinebouwer": "Machine builder",
  "Monteur staalconstructies": "Steel structure assembler",
  "Pijpfitter": "Pipe fitter",
  "Rigger-monteerder": "Rigger and assembler",
  "Bordenbouwer - Elektromonteur machinebouw": "Panel builder / electrical machine assembler",
  "Elektrotechnicus": "Electrotechnician",
  "Technicus industriële elektriciteit": "Industrial electrician",
  "Operator farma en biotech": "Pharma and biotech operator",
  "Procesoperator chemische industrie": "Chemical industry process operator",
  "Procesoperator energetische en petrochemische industrie": "Energy and petrochemical industry process operator",
  "Productieoperator-machineregelaar kunststoffen": "Plastics production operator and machine regulator",
  "Productiemedewerker kunststofverwerking": "Plastics processing worker",
  "Operator van een papier- of kartonmachine": "Paper or cardboard machine operator",
  "Verpakkingsoperator": "Packaging operator",
  "Industrieel schilder": "Industrial painter",
  "Uitvoerder van werken op hoogte": "Works at height specialist",
  "Diamantbewerker": "Diamond cutter / processor",
  // Industrieel — voertuigen & machines
  "OAD-technicus van personenwagens en lichte bedrijfsvoertuigen": "OBD technician — passenger cars and light vehicles",
  "OD-technicus van zware bedrijfsvoertuigen": "OBD technician — heavy commercial vehicles",
  "Technicus van bromfietsen en motorfietsen": "Moped and motorcycle technician",
  "Technicus van tuin-, park- en bosmachines": "Garden, park and forestry machinery technician",
  "Technicus werf-, landbouw- en hefmachines": "Construction, agricultural and lifting machinery technician",
  "Vliegtuigtechnicus": "Aircraft technician",
  "Werktuigkundige scheepvaart": "Marine engineer",
  "Fietshersteller": "Bicycle mechanic",
  "Onderhoudsmecanicien van personenwagens en lichte bedrijfsvoertuigen": "Maintenance mechanic — passenger cars and light vehicles",
  "Onderhoudsmecanicien van zware bedrijfsvoertuigen": "Maintenance mechanic — heavy commercial vehicles",
  "Monteur-demonteur carrosserie": "Bodywork assembly / disassembly technician",
  "Plaatwerker carrosserie": "Bodywork panel beater",
  "Spuiter carrosserie": "Bodywork painter / sprayer",
  "Voorbewerker carrosserie": "Bodywork preparer",
  // Transport & logistiek
  "Dispatcher goederenvervoer": "Freight dispatcher",
  "Douanedeclarant": "Customs declarant",
  "Expediteur": "Freight forwarder",
  "Logistiek verantwoordelijke": "Logistics supervisor",
  "Heftruckchauffeur": "Forklift driver",
  "Magazijnmedewerker": "Warehouse worker",
  "Reachtruckchauffeur": "Reach truck driver",
  "Verhuizer": "Removal worker",
  "Autobuschauffeur": "Bus driver",
  "Autocarchauffeur": "Coach driver",
  "Taxichauffeur en chauffeur privévervoer": "Taxi and private transport driver",
  "Vrachtwagenbestuurder": "Truck driver",
  "Treinbestuurder": "Train driver",
  "Spoorwerker": "Railway worker",
  "Matroos binnenscheepvaart": "Inland waterways sailor",
  // Handel & verkoop
  "Opticien": "Optician",
  "Winkelverkoper": "Shop sales assistant",
  "Technisch adviseur klantenondersteuning": "Technical customer support advisor",
  "Winkelmedewerker": "Shop assistant",
  "Assistent winkelmanager": "Assistant store manager",
  "Winkelmanager": "Store manager",
  "Vertegenwoordiger B2B": "B2B sales representative",
  // Horeca
  "Hotelreceptionist": "Hotel receptionist",
  "Kamerjongen-Kamermeisje": "Hotel room attendant",
  "Polyvalent hotelmedewerker": "Polyvalent hotel employee",
  "Grootkeukenkok": "Large-scale kitchen chef",
  "Hulpkok": "Commis chef",
  "Hulpkok grootkeuken": "Large-scale kitchen assistant chef",
  "Keukenmedewerker": "Kitchen worker",
  "Kok": "Cook / Chef",
  "Medewerker fastfood": "Fast food worker",
  "Barman": "Bartender",
  "Hulpkelner": "Assistant waiter",
  "Kelner": "Waiter",
  "Horecamanager": "Hospitality manager",
  // Vrijetijd & kunst
  "Polyvalent podiumtechnicus": "Polyvalent stage technician",
  "Redder: Hoger Redder": "Senior lifeguard",
  // Organisatieondersteunend & kennis
  "Commercieel medewerker binnendienst": "Inside sales representative",
  "Contactcenter medewerker": "Contact centre agent",
  "Verantwoordelijke ICT": "ICT manager",
  "Managementassistent": "Management assistant",
  "Technisch-administratief medewerker": "Technical-administrative employee",
  "Data manager": "Data manager",
  "Data scientist": "Data scientist",
  "ICT architect": "ICT architect",
  "ICT security specialist": "ICT security specialist",
  "Integratie expert ICT": "ICT integration expert",
  "Software analist": "Software analyst",
  "Netwerkbeheerder": "Network administrator",
  "Systeembeheerder": "System administrator",
  "Data engineer": "Data engineer",
  "Software ontwikkelaar": "Software developer",
  "Software tester": "Software tester",
  "Support medewerker ICT": "ICT support technician",
  // Dienstverlening
  "Arbeidsbemiddelaar-jobcoach: uitzendconsulent": "Employment agency consultant / job coach",
  "Maatschappelijk werker": "Social worker",
  "Kapper": "Hairdresser",
  "Schoonheidsspecialist": "Beauty specialist",
  "Medewerker textielverzorging": "Textile care worker",
  "Uitvaartondernemer: uitvaartassistent": "Funeral assistant",
  "Adviseur beleggingen": "Investment advisor",
  "Adviseur kredieten": "Credit advisor",
  "Adviseur verzekeringen": "Insurance advisor",
  "Beheerder verzekeringen": "Insurance administrator",
  "Syndicus: medewerker syndicus": "Property manager / syndic assistant",
  "Bewakingsagent": "Security guard",
  "Beveiligingsagent (politie)": "Police officer",
  "Soldaat-matroos bij defensie": "Soldier / sailor in defence",
  "Huishoudhulp-poetshulp": "Domestic and cleaning helper",
  "Ruitenwasser": "Window cleaner",
  "Industrieel reiniger": "Industrial cleaner",
  // Medisch & paramedisch
  "Arts": "Medical doctor",
  "Dierenarts": "Veterinarian",
  "Apotheker: ziekenhuisapotheker": "Hospital pharmacist",
  "Kinesitherapeut": "Physiotherapist",
  "Audioloog-audicien": "Audiologist and hearing aid specialist",
  "Optometrist": "Optometrist",
  "Orthopedisch technoloog": "Orthopaedic technologist",
  "Technoloog medische beeldvorming": "Medical imaging technologist",
  "Hoofdverpleegkundige": "Head nurse",
  "Verpleegkundige": "Nurse",
  "Persoonlijk assistent": "Personal assistant (care)",
  "Verzorgende": "Home carer",
  "Zorgkundige": "Nursing aide",
  "Dentaaltechnicus": "Dental technician",
  "Hulpverlener-ambulancier": "Paramedic / ambulance worker",
  // Pedagogisch
  "Leerkracht buitengewoon secundair onderwijs": "Special secondary education teacher",
  "Leerkracht kleuteronderwijs": "Nursery school teacher",
  "Leerkracht lager onderwijs": "Primary school teacher",
  "Leerkracht secundair onderwijs": "Secondary school teacher",
  "Leidinggevende onderwijsinstelling": "School director",
  "Rijinstructeur": "Driving instructor",
  "Kinderbegeleider baby's en peuters": "Childcare worker (babies and toddlers)",
  "Kinderbegeleider schoolgaande kinderen": "Childcare worker (school-age children)",
  "Monitor-begeleider in de sociale economie": "Instructor-coach in the social economy",
  "Opvoeder-begeleider": "Educational support worker",
  "Verantwoordelijke kinderopvang": "Childcare supervisor"
};

function normalizeGroupToSector(groupTitle) {
  const label = String(groupTitle || "").toLowerCase();

  if (label.includes("sant") || label.includes("social")) return "Santé et action sociale";
  if (label.includes("construction") || label.includes("bâtiment") || label.includes("voirie")) return "Construction et travaux publics";
  if (label.includes("transport") || label.includes("logistique") || label.includes("navigation")) return "Transport et logistique";
  if (label.includes("industrie") || label.includes("technique") || label.includes("maintenance") || label.includes("automatisation")) return "Industrie et maintenance";
  if (label.includes("informatique") || label.includes("tic") || label.includes("telecommunication") || label.includes("numérique")) return "Technologies et informatique";
  if (label.includes("enseignement") || label.includes("formation") || label.includes("pedagog")) return "Éducation et formation";
  if (label.includes("commerce") || label.includes("vente") || label.includes("distribution")) return "Commerce et vente";
  if (label.includes("comptabil") || label.includes("finance") || label.includes("assurance") || label.includes("immobilier") || label.includes("droit")) {
    return "Comptabilité, finance et immobilier";
  }
  if (label.includes("horeca")) return "Horeca";
  if (label.includes("service") || label.includes("sécurité") || label.includes("securite") || label.includes("nettoyage")) {
    return "Services à la personne et sécurité";
  }

  return groupTitle;
}

function buildRegionData() {
  return shortageJobs2026.map((region) => {
    const label = REGION_LABEL_BY_ID[region.id] || region.label;
    const groups = region.groups.map((group) => ({
      label: group.title,
      options: group.jobs
    }));

    const flatJobs = region.groups.flatMap((group) => group.jobs);
    const sectorMap = Object.fromEntries(
      region.groups.flatMap((group) =>
        group.jobs.map((job) => [job, normalizeGroupToSector(group.title)])
      )
    );

    return {
      id: region.id,
      label,
      groups: [...groups, { label: "Autre", options: ["Autre profession"] }],
      flatJobs: [...flatJobs, "Autre profession"],
      sectorMap
    };
  });
}

const regionData = buildRegionData();

export const coreRegionOptions = ["Bruxelles-Capitale", "Wallonie", "Flandre"];

export const groupedProfessionOptions = regionData.map((region) => ({
  label: region.label,
  options: region.flatJobs
}));

export const groupedProfessionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.groups])
);

export const professionOptionsByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.flatJobs])
);

export const professionSectorByRegion = Object.fromEntries(
  regionData.map((region) => [region.label, region.sectorMap])
);

export const sectorOptions = [
  "Commerce et vente",
  "Comptabilité, finance et immobilier",
  "Construction et travaux publics",
  "Éducation et formation",
  "Horeca",
  "Industrie et maintenance",
  "Santé et action sociale",
  "Services à la personne et sécurité",
  "Technologies et informatique",
  "Transport et logistique",
  "Autre secteur"
];

export function translateRegionLabel(label, locale = "fr") {
  if (locale !== "en") return label;
  return REGION_TRANSLATIONS_EN[label] || label;
}

export function translateGroupTitle(label, locale = "fr") {
  if (locale === "en") return GROUP_TRANSLATIONS_EN[label] || label;
  if (locale === "fr") return GROUP_TRANSLATIONS_FR[label] || label;
  return label;
}

export function translateSectorLabel(label, locale = "fr") {
  if (locale !== "en") return label;
  return SECTOR_TRANSLATIONS_EN[label] || label;
}

export function translateProfessionLabel(label, locale = "fr") {
  if (locale === "en") return JOB_TRANSLATIONS_EN[label] || label;
  if (locale === "fr") return JOB_TRANSLATIONS_FR[label] || label;
  return label;
}

export function getSectorOptions(locale = "fr") {
  return sectorOptions.map((option) => ({
    value: option,
    label: translateSectorLabel(option, locale)
  }));
}

export const workerRegionOptions = [...coreRegionOptions, "Toute la Belgique"];
export const employerRegionOptions = [...coreRegionOptions, "Plusieurs régions"];

export function parseRegionSelection(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRegion(item)).filter(Boolean);
  }

  const normalized = String(value || "").trim();
  if (!normalized) return [];
  if (normalized === "Toute la Belgique" || normalized === "Plusieurs régions") {
    return coreRegionOptions;
  }

  if (normalized.includes("|")) {
    return normalized
      .split("|")
      .map((item) => normalizeRegion(item.trim()))
      .filter(Boolean);
  }

  if (normalized.includes(",")) {
    return normalized
      .split(",")
      .map((item) => normalizeRegion(item.trim()))
      .filter(Boolean);
  }

  return [normalizeRegion(normalized)];
}

export function stringifyRegionSelection(value, fallbackLabel = "Plusieurs régions") {
  const selections = parseRegionSelection(value);

  if (!selections.length) return "";
  if (selections.length === 1) return selections[0];
  if (selections.length === coreRegionOptions.length) {
    return fallbackLabel;
  }

  return selections.join(" | ");
}

export function getProfessionGroupsForRegions(value, locale = "fr") {
  const selections = parseRegionSelection(value);
  if (!selections.length) return [];

  const groupsMap = new Map();

  selections.forEach((regionLabel) => {
    const regionGroups = groupedProfessionOptionsByRegion[regionLabel] || [];
    regionGroups.forEach((group) => {
      const current = groupsMap.get(group.label) || new Set();
      group.options.forEach((option) => current.add(option));
      groupsMap.set(group.label, current);
    });
  });

  return Array.from(groupsMap.entries()).map(([label, options]) => ({
    label: translateGroupTitle(label, locale),
    options: Array.from(options).map((option) => ({
      value: option,
      label: translateProfessionLabel(option, locale)
    }))
  }));
}

export function findSectorForProfession(regionLabel, professionLabel) {
  if (!regionLabel || !professionLabel || professionLabel === "Autre profession") {
    return "";
  }

  const selections = parseRegionSelection(regionLabel);

  for (const selectedRegion of selections) {
    const derived = professionSectorByRegion[selectedRegion]?.[professionLabel];
    if (derived) return derived;
  }

  return "";
}
