/**
 * Professions en pénurie en Flandre — deux listes officielles (2026)
 *
 * LISTE 1 — FLANDRE_MB_21
 *   21 professions "moyennement qualifiées" établies par l'Arrêté ministériel du
 *   1er décembre 2025 (MB 8/12/2025). Ces professions bénéficient d'une DISPENSE
 *   TOTALE du test du marché de l'emploi (arbeidsmarkttoets).
 *   Source : ejustice.just.fgov.be, réf. 2025009222
 *
 * LISTE 2 — FLANDRE_VDAB_227
 *   227 professions publiées par le VDAB (Knelpuntberoepen 2026, 1 février 2026).
 *   Ces professions requièrent 9 semaines de publication sur VDAB + EURES dans
 *   les 4 mois précédant la demande, avec médiation VDAB active et preuve
 *   d'absence de candidat local/européen approprié.
 *   Les conditions sont CUMULATIVES.
 *
 * Les noms utilisés ici doivent correspondre EXACTEMENT aux valeurs dans
 * shortageJobs2026.js (section Flandre) pour que la correspondance fonctionne.
 *
 * RÈGLE Flandre (depuis 1/1/2026) :
 *   - Profession sur FLANDRE_MB_21  → dispense totale du test marché
 *   - Profession sur FLANDRE_VDAB_227 (hors MB_21) → test marché 9 semaines
 *   - Profession hors des deux listes → pas d'accès au permis unique économique
 */

/**
 * Les 21 professions "middengeschoolde knelpuntberoepen" (MB 1 décembre 2025).
 * Certaines entrées MB couvrent deux intitulés VDAB distincts (ex. :
 * "Insteller-omsteller plaatbewerking/verspaning" → deux lignes VDAB séparées).
 * "Diamantbewerker" n'est pas dans les 227 VDAB mais est sur la liste MB.
 */
export const FLANDRE_MB_21 = new Set([
  // Besturen van voertuigen en machines
  "Bediener grondverzetmachines",
  "Matroos binnenscheepvaart",
  // Onderhouden van voertuigen en machines
  "Onderhoudsmecanicien van zware bedrijfsvoertuigen",
  "OAD-technicus van personenwagens en lichte bedrijfsvoertuigen",
  "Technicus werf-, landbouw- en hefmachines",
  "Voorbewerker carrosserie",
  "Plaatwerker carrosserie",          // parfois groupé avec Voorbewerker dans le MB
  // Installeren/monteren/onderhouden elektrische, elektronische en sanitaire installaties
  "Elektrotechnicus",
  "Monteur installatietechnieken",
  "Koeltechnicus",
  "Pijpfitter",
  "Datacommunicatie- en netwerktechnicus",
  // Verzorging
  "Zorgkundige",
  "Verzorgende",
  // Overige technische en bouwfuncties
  "Insteller-omsteller plaatbewerking",
  "Insteller-omsteller verspaning",
  "Bekister-betonneerder",
  "Metselaar",
  "Calculator bouw",
  "Werkvoorbereider",
  "Dakwerker",
  "Procesoperator chemische industrie",
  "Asbestverwijderaar",
  "Diamantbewerker",                  // spécifique MB, hors liste VDAB 227
]);

/**
 * Les 227 professions VDAB Knelpuntberoepen 2026 (1 février 2026).
 * Organisées par secteur, dans l'ordre du rapport VDAB.
 */
export const FLANDRE_VDAB_227 = [
  // ── Land-, tuin- en bosbouw- en visserijberoepen ──────────────────────────
  "Medewerker landbouw",
  "Medewerker tuinbouw",
  "Medewerker tuin- en groenaanleg en -onderhoud",
  "Verantwoordelijke tuin- en groenaanleg en -onderhoud",

  // ── Bouwberoepen ─────────────────────────────────────────────────────────
  "Bodemonderzoeker",
  "Bouwkundig tekenaar",
  "Calculator bouw",
  "Ingenieur studie en advies bouw",
  "Landmeter",
  "Projectleider bouw en openbare werken",
  "Veiligheidscoördinator",
  "Werfleider",
  "Bekister-betonneerder",
  "Daktimmerman",
  "Dakwerker",
  "Medewerker ruwbouw",
  "Metselaar",
  "Schrijnwerker houtbouw",
  "Dekvloerlegger",
  "Glaswerker",
  "Interieurbouwer",
  "Natuursteenbewerker",
  "Plaatser binnenschrijnwerk",
  "Plaatser buitenschrijnwerk",
  "Schilder-decorateur",
  "Stukadoor",
  "Vloerder-tegelzetter",
  "Asbestverwijderaar",
  "Brandertechnicus",
  "Gevelrenoveerder-betonhersteller",
  "Technicus installatietechnieken",
  "Beveiligingstechnicus",
  "Datacommunicatie- en netwerktechnicus",
  "Elektrotechnisch installateur",
  "Installateur energiemanagementsystemen",
  "Monteur installatietechnieken",
  "Plaatser van boven- en ondergrondse leidingen",
  "Technicus hernieuwbare energietechnieken",
  "Rioollegger",
  "Wegenwerker",
  "Aansluiter van waterleidingen, rioleringen en warmtenetten",
  "Installateur nutsvoorzieningen",
  "Steigerbouwer",
  "Bediener grondverzetmachines",
  "Bediener machines horizontale boringen",
  "Bediener machines verticale boringen",
  "Bediener van betonnerings- en asfalteringsmachines",
  "Kraanbestuurder",
  "Torenkraanbediener",

  // ── Industriële beroepen en ambachten ─────────────────────────────────────
  "Afdelingsverantwoordelijke productie",
  "Productiemanager",
  "Projectmanager engineering",
  "Teamleader productie",
  "Verantwoordelijke industrieel onderhoud",
  "Verantwoordelijke kwaliteitscontrole",
  "Verantwoordelijke onderzoek en ontwikkeling",
  "Expert productieproces en -methodes",
  "Productieplanner",
  "Werkvoorbereider",
  "Industrieel laborant",
  "Industrieel elektromecanicien",
  "Lifttechnicus",
  "Ontwerper industriële automatisering",
  "Technicus elektro en elektronica",
  "Technicus elektronische installaties",
  "Koeltechnicus",
  "Regeltechnicus klimatisatie",
  "Industrieel onderhoudstechnicus",
  "Onderhoudstechnicus industriële automatisering",
  "Tekenaar-ontwerper elektriciteit, elektronica",
  "Tekenaar-ontwerper mechanica",
  "Procesoperator voedingsindustrie",
  "Productieoperator voedingsindustrie",
  "Brood- en banketbakker",
  "Chocolatier-ijsbereider: chocolatier",
  "Slachter",
  "Slager",
  "Uitsnijder-uitbener",
  "Productieoperator textielproductielijn",
  "Productieoperator van textielmachines",
  "Productiemedewerker textielproductielijn",
  "Polyvalent stikster",
  "Operator drukken",
  "Operator drukafwerking",
  "Operator CNC-gestuurde houtbewerkingsmachines",
  "Productieoperator hout",
  "Meubelmaker",
  "Werkplaatsschrijnwerker",
  "Operator gieterij",
  "Operator montage en assemblage",
  "Manueel lasser",
  "Matrijzenmaker",
  "Insteller-omsteller plaatbewerking",
  "Insteller-omsteller verspaning",
  "Machinebouwer",
  "Monteur staalconstructies",
  "Pijpfitter",
  "Rigger-monteerder",
  "OAD-technicus van personenwagens en lichte bedrijfsvoertuigen",
  "OD-technicus van zware bedrijfsvoertuigen",
  "Technicus van bromfietsen en motorfietsen",
  "Technicus van tuin-, park- en bosmachines",
  "Technicus werf-, landbouw- en hefmachines",
  "Vliegtuigtechnicus",
  "Werktuigkundige scheepvaart",
  "Fietshersteller",
  "Onderhoudsmecanicien van personenwagens en lichte bedrijfsvoertuigen",
  "Onderhoudsmecanicien van zware bedrijfsvoertuigen",
  "Monteur-demonteur carrosserie",
  "Plaatwerker carrosserie",
  "Spuiter carrosserie",
  "Voorbewerker carrosserie",
  "Bordenbouwer - Elektromonteur machinebouw",
  "Elektrotechnicus",
  "Technicus industriële elektriciteit",
  "Operator farma en biotech",
  "Procesoperator chemische industrie",
  "Procesoperator energetische en petrochemische industrie",
  "Productieoperator-machineregelaar kunststoffen",
  "Productiemedewerker kunststofverwerking",
  "Operator van een papier- of kartonmachine",
  "Verpakkingsoperator",
  "Industrieel schilder",
  "Uitvoerder van werken op hoogte",

  // ── Transport- en logistieke beroepen ─────────────────────────────────────
  "Dispatcher goederenvervoer",
  "Douanedeclarant",
  "Expediteur",
  "Logistiek verantwoordelijke",
  "Heftruckchauffeur",
  "Magazijnmedewerker",
  "Reachtruckchauffeur",
  "Verhuizer",
  "Autobuschauffeur",
  "Autocarchauffeur",
  "Taxichauffeur en chauffeur privévervoer",
  "Vrachtwagenbestuurder",
  "Treinbestuurder",
  "Spoorwerker",
  "Matroos binnenscheepvaart",

  // ── Handels- en verkoopberoepen ───────────────────────────────────────────
  "Opticien",
  "Winkelverkoper",
  "Technisch adviseur klantenondersteuning",
  "Winkelmedewerker",
  "Assistent winkelmanager",
  "Winkelmanager",
  "Vertegenwoordiger B2B",

  // ── Horecaberoepen ────────────────────────────────────────────────────────
  "Hotelreceptionist",
  "Kamerjongen-Kamermeisje",
  "Polyvalent hotelmedewerker",
  "Chef de partie",
  "Grootkeukenkok",
  "Hulpkok",
  "Hulpkok grootkeuken",
  "Keukenmedewerker",
  "Kok",
  "Medewerker fastfood",
  "Barman",
  "Hulpkelner",
  "Kelner",
  "Maître d'hôtel",
  "Horecamanager",

  // ── Vrijetijds- en artistieke beroepen ───────────────────────────────────
  "Polyvalent podiumtechnicus",
  "Redder: Hoger Redder",

  // ── Organisatieondersteunende en kennisberoepen ───────────────────────────
  "Sales engineer",
  "Commercieel medewerker binnendienst",
  "Contactcenter medewerker",
  "Payroll advisor",
  "Accountant",
  "Verantwoordelijke ICT",
  "Managementassistent",
  "Technisch-administratief medewerker",
  "Data manager",
  "Data scientist",
  "ICT architect",
  "ICT security specialist",
  "Integratie expert ICT",
  "Software analist",
  "Netwerkbeheerder",
  "Systeembeheerder",
  "Data engineer",
  "Software ontwikkelaar",
  "Software tester",
  "Support medewerker ICT",

  // ── Dienstverlenende beroepen ─────────────────────────────────────────────
  "Arbeidsbemiddelaar-jobcoach: uitzendconsulent",
  "Maatschappelijk werker",
  "Kapper",
  "Schoonheidsspecialist",
  "Medewerker textielverzorging",
  "Uitvaartondernemer: uitvaartassistent",
  "Adviseur beleggingen",
  "Adviseur kredieten",
  "Adviseur verzekeringen",
  "Beheerder verzekeringen",
  "Syndicus: medewerker syndicus",
  "Bewakingsagent",
  "Beveiligingsagent (politie)",
  "Soldaat-matroos bij defensie",
  "Huishoudhulp-poetshulp",
  "Ruitenwasser",
  "Industrieel reiniger",

  // ── Medische, paramedische en verzorgende beroepen ───────────────────────
  "Arts",
  "Dierenarts",
  "Apotheker: ziekenhuisapotheker",
  "Kinesitherapeut",
  "Audioloog-audicien",
  "Ergotherapeut",
  "Optometrist",
  "Orthopedisch technoloog",
  "Technoloog medische beeldvorming",
  "Hoofdverpleegkundige",
  "Verpleegkundige",
  "Persoonlijk assistent",
  "Verzorgende",
  "Zorgkundige",
  "Dentaaltechnicus",
  "Hulpverlener-ambulancier",

  // ── Pedagogische beroepen ─────────────────────────────────────────────────
  "Leerkracht buitengewoon secundair onderwijs",
  "Leerkracht kleuteronderwijs",
  "Leerkracht lager onderwijs",
  "Leerkracht secundair onderwijs",
  "Leidinggevende onderwijsinstelling",
  "Rijinstructeur",
  "Kinderbegeleider baby's en peuters",
  "Kinderbegeleider schoolgaande kinderen",
  "Monitor-begeleider in de sociale economie",
  "Opvoeder-begeleider",
  "Verantwoordelijke kinderopvang",
];

/** Set for O(1) lookup */
export const FLANDRE_VDAB_227_SET = new Set(FLANDRE_VDAB_227);
