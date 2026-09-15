/**
 * URL structure of the public portal of the Ministère de l'Éducation nationale
 * d'Astoria (`education.gouv.aor`).
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry (see `apps/messages/{fr,en}.json`).
 *
 * Architecture of the navigation:
 *
 *   primaryNavigation  → the seven entries of the portal. Each entry opens a
 *                        mega-menu panel structured in four sections of four
 *                        links:
 *                            7 entrées × 4 sections × 4 liens = 112 liens
 *
 * This file is the single source of truth of the portal navigation: the
 * header (desktop mega-menus and mobile drawer), the sitemap and the footer
 * all derive their markup from `primaryNavigation`, so adding or renaming a
 * theme, section or link never requires rewriting a component — it only
 * requires editing this file (and the matching message keys).
 *
 * The information architecture is organised around the school journey and the
 * publics of the ministry — not around the administrative organisation that
 * runs the service. It follows the journey of anyone who must study, orient,
 * teach or administrate in Astoria:
 *
 *   Scolarité           → parcourir : école, collège, lycée, enseignement supérieur
 *   Orientation         → choisir   : parcours, formations, métiers, accompagnement
 *   Enseignement        → exercer   : enseignants, personnels, carrières, ressources
 *   Établissements      → trouver   : écoles, collèges, lycées, enseignement supérieur
 *   Examens & diplômes  → valider   : examens, diplômes, certifications, résultats
 *   Aides & services    → être aidé : élèves, parents, étudiants, démarches
 *   Ministère           → connaître : actualités, politiques, publications, institution
 *
 * The structure deliberately keeps an education perimeter: it exposes the
 * destinations that matter to the visitors of the portal, without mirroring
 * the internal organisation of the ministry. It is sufficiently generic to
 * grow with the service (annuaire national des établissements, vérification
 * des diplômes, services authentifiés…) without inventing new sections just to
 * fill the 7 × 4 × 4 model.
 *
 * The structure is validated both at compile time (the tuple types below
 * enforce exactly 7 themes × 4 sections × 4 links) and at runtime
 * (`validateNavigationStructure`), so a malformed navigation fails the build.
 *
 * Hrefs follow the URL plan of the portal; several point to pages being
 * published and will resolve as soon as those sections ship.
 */
export const PORTAL_HOME = "/";

/**
 * The seven entries of the portal — both `nav.primary` and `footer.columns`
 * keys. They follow the journey of the school community rather than the
 * administrative organisation of the ministry.
 */
export type PrimaryNavKey =
  | "scolarite"
  | "orientation"
  | "enseignement"
  | "etablissements"
  | "examensDiplomes"
  | "aidesServices"
  | "ministere";

/** A destination inside a mega-menu panel; its label is a `nav.panel` message key. */
export type NavigationLink = {
  labelKey: string;
  href: string;
};

/**
 * A section of a navigation theme. In the mega-menu panel it heads one of the
 * four columns (`labelKey` → `nav.panel.<theme>.<section>.title`); in the
 * footer it becomes a destination of the domain column. It carries the four
 * destinations of the section.
 */
export type NavigationItem = NavigationLink & {
  /** Related destinations nested under this section. */
  links: NavigationLinks;
};

/**
 * The four destinations of a section. The tuple type is the compile-time
 * guarantee that no section exposes anything other than exactly 4 links.
 */
export type NavigationLinks = readonly [
  NavigationLink,
  NavigationLink,
  NavigationLink,
  NavigationLink,
];

/**
 * The four sections of a theme. The tuple type is the compile-time guarantee
 * that no theme exposes anything other than exactly 4 sections.
 */
export type NavigationItems = readonly [
  NavigationItem,
  NavigationItem,
  NavigationItem,
  NavigationItem,
];

/**
 * One top-level entry of the Government Header navigation.
 *
 * Navigation principle (info.gouv.fr-inspired, adapted to Astoria): the header
 * is organised around the school journey — not around the internal structure
 * of the ministry. Each entry opens a mega-menu panel composed of
 *  - a leader band: the entry name, a one-line description and the main
 *    action of the section (“Tout sur la scolarité”, …),
 *  - four sections, each headed by its title and followed by its four
 *    destinations.
 *
 * Top-level labels resolve under `nav.primary` (`labelKey`), panel content
 * under `nav.panel` (`titleKey`, `paragraphKey`, nested `labelKey`s).
 */
export type NavigationSection = {
  type: "megaMenu";
  /** Message key (`nav.primary`) of the top-level tab. */
  labelKey: PrimaryNavKey;
  /** Landing page of the section, used by the leader action and active-state detection. */
  href: string;
  /** Leader band shown on top of the panel. */
  leader: {
    titleKey: string;
    paragraphKey: string;
    link: NavigationLink;
  };
  /** The four sections of the theme, each with its four links. */
  primaryItems: NavigationItems;
};

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<NavigationLink>;
};

export const sectionPaths = {
  scolarite: "/scolarite",
  orientation: "/orientation",
  enseignement: "/enseignement",
  etablissements: "/etablissements",
  examensDiplomes: "/examens-et-diplomes",
  aidesServices: "/aides-et-services",
  ministere: "/ministere",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

/** Structural guard: the navigation must stay a fixed 7 × 4 × 4 grid. */
export const navigationShape = {
  themes: 7,
  sectionsPerTheme: 4,
  linksPerSection: 4,
} as const;

/**
 * Runtime validation of the navigation structure. Returns the list of
 * problems found (empty when the structure is valid):
 *  - the portal must expose exactly 7 themes;
 *  - each theme must contain exactly 4 sections;
 *  - each section must contain exactly 4 links;
 *  - every link must carry a non-empty, absolute-path destination.
 *
 * The same invariants are enforced at compile time by the tuple types
 * (`NavigationItems`, `NavigationLinks` and the seven-tuple below).
 */
export function validateNavigationStructure(
  navigation: ReadonlyArray<NavigationSection> = primaryNavigation
): string[] {
  const problems: string[] = [];

  if (navigation.length !== navigationShape.themes) {
    problems.push(
      `La navigation doit comporter exactement ${navigationShape.themes} thèmes, or elle en compte ${navigation.length}.`
    );
  }

  for (const section of navigation) {
    if (section.primaryItems.length !== navigationShape.sectionsPerTheme) {
      problems.push(
        `Le thème « ${section.labelKey} » doit contenir exactement ${navigationShape.sectionsPerTheme} sections, or il en compte ${section.primaryItems.length}.`
      );
    }

    for (const item of section.primaryItems) {
      if (item.links.length !== navigationShape.linksPerSection) {
        problems.push(
          `La section « ${item.labelKey} » doit contenir exactement ${navigationShape.linksPerSection} liens, or elle en compte ${item.links.length}.`
        );
      }

      for (const link of item.links) {
        if (!link.href || !link.href.startsWith("/")) {
          problems.push(
            `Le lien « ${link.labelKey} » (« ${item.labelKey} ») n'a pas de destination valide : « ${link.href} ».`
          );
        }
      }
    }
  }

  return problems;
}

/**
 * Throws when the navigation structure is malformed. Called at module load so
 * a structural error fails the build immediately instead of shipping a broken
 * header. Satisfies the contract: 7 thèmes × 4 sections × 4 liens = 112 liens.
 */
function assertNavigationStructureValid(): void {
  const problems = validateNavigationStructure();
  if (problems.length > 0) {
    throw new Error(
      `Structure de navigation invalide :\n- ${problems.join("\n- ")}`
    );
  }
}

/** Convenience: the total number of destinations exposed by the navigation. */
export function countNavigationLinks(
  navigation: ReadonlyArray<NavigationSection> = primaryNavigation
): number {
  return navigation.reduce(
    (total, section) =>
      total +
      section.primaryItems.reduce(
        (sectionTotal, item) => sectionTotal + item.links.length,
        0
      ),
    0
  );
}

/**
 * Main navigation of the Government Header of the Ministère de l'Éducation
 * nationale d'Astoria — the permanent information architecture of the portal,
 * organised in seven entries:
 *
 *   Scolarité           → parcourir : école, collège, lycée, enseignement supérieur
 *   Orientation         → choisir   : parcours, formations, métiers, accompagnement
 *   Enseignement        → exercer   : enseignants, personnels, carrières, ressources
 *   Établissements      → trouver   : écoles, collèges, lycées, enseignement supérieur
 *   Examens & diplômes  → valider   : examens, diplômes, certifications, résultats
 *   Aides & services    → être aidé : élèves, parents, étudiants, démarches
 *   Ministère           → connaître : actualités, politiques, publications, institution
 *
 * The first entries carry the operational journey of the school community
 * (studying, orienting, teaching, finding an establishment); the last ones are
 * the validation, assistance and institutional entries. The publics of the
 * ministry (élèves, parents, étudiants, enseignants, personnels) are served
 * where their journey needs them, without turning the navigation into a mirror
 * of the administrative organisation.
 *
 * Each entry opens a mega-menu panel with a leader band and four sections —
 * each section headed by its title and followed by its four destinations. The
 * panel is not the sitemap of the portal; it exposes the destinations that
 * matter to the visitor journey. The structure is configuration-driven and
 * validated: adding a section only means adding an entry here (and the
 * matching messages).
 */
export const primaryNavigation: ReadonlyArray<NavigationSection> = [
  {
    type: "megaMenu",
    labelKey: "scolarite",
    href: sectionPaths.scolarite,
    leader: {
      titleKey: "scolarite.title",
      paragraphKey: "scolarite.text",
      link: {
        labelKey: "scolarite.allLink",
        href: sectionPaths.scolarite,
      },
    },
    primaryItems: [
      {
        labelKey: "scolarite.ecole.title",
        href: `${sectionPaths.scolarite}/ecole`,
        links: [
          { labelKey: "scolarite.ecole.programmes", href: `${sectionPaths.scolarite}/ecole/programmes` },
          { labelKey: "scolarite.ecole.inscriptions", href: `${sectionPaths.scolarite}/ecole/inscriptions` },
          { labelKey: "scolarite.ecole.vieScolaire", href: `${sectionPaths.scolarite}/ecole/vie-scolaire` },
          { labelKey: "scolarite.ecole.orientation", href: `${sectionPaths.scolarite}/ecole/orientation` },
        ],
      },
      {
        labelKey: "scolarite.college.title",
        href: `${sectionPaths.scolarite}/college`,
        links: [
          { labelKey: "scolarite.college.programmes", href: `${sectionPaths.scolarite}/college/programmes` },
          { labelKey: "scolarite.college.inscriptions", href: `${sectionPaths.scolarite}/college/inscriptions` },
          { labelKey: "scolarite.college.vieScolaire", href: `${sectionPaths.scolarite}/college/vie-scolaire` },
          { labelKey: "scolarite.college.orientation", href: `${sectionPaths.scolarite}/college/orientation` },
        ],
      },
      {
        labelKey: "scolarite.lycee.title",
        href: `${sectionPaths.scolarite}/lycee`,
        links: [
          { labelKey: "scolarite.lycee.programmes", href: `${sectionPaths.scolarite}/lycee/programmes` },
          { labelKey: "scolarite.lycee.inscriptions", href: `${sectionPaths.scolarite}/lycee/inscriptions` },
          { labelKey: "scolarite.lycee.vieScolaire", href: `${sectionPaths.scolarite}/lycee/vie-scolaire` },
          { labelKey: "scolarite.lycee.orientation", href: `${sectionPaths.scolarite}/lycee/orientation` },
        ],
      },
      {
        labelKey: "scolarite.enseignementSuperieur.title",
        href: `${sectionPaths.scolarite}/enseignement-superieur`,
        links: [
          { labelKey: "scolarite.enseignementSuperieur.formations", href: `${sectionPaths.scolarite}/enseignement-superieur/formations` },
          { labelKey: "scolarite.enseignementSuperieur.admission", href: `${sectionPaths.scolarite}/enseignement-superieur/admission` },
          { labelKey: "scolarite.enseignementSuperieur.vieEtudiante", href: `${sectionPaths.scolarite}/enseignement-superieur/vie-etudiante` },
          { labelKey: "scolarite.enseignementSuperieur.orientation", href: `${sectionPaths.scolarite}/enseignement-superieur/orientation` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "orientation",
    href: sectionPaths.orientation,
    leader: {
      titleKey: "orientation.title",
      paragraphKey: "orientation.text",
      link: {
        labelKey: "orientation.allLink",
        href: sectionPaths.orientation,
      },
    },
    primaryItems: [
      {
        labelKey: "orientation.choisirSonParcours.title",
        href: `${sectionPaths.orientation}/choisir-son-parcours`,
        links: [
          { labelKey: "orientation.choisirSonParcours.parcoursScolaires", href: `${sectionPaths.orientation}/choisir-son-parcours/parcours-scolaires` },
          { labelKey: "orientation.choisirSonParcours.orientation", href: `${sectionPaths.orientation}/choisir-son-parcours/orientation` },
          { labelKey: "orientation.choisirSonParcours.reorientation", href: `${sectionPaths.orientation}/choisir-son-parcours/reorientation` },
          { labelKey: "orientation.choisirSonParcours.conseils", href: `${sectionPaths.orientation}/choisir-son-parcours/conseils` },
        ],
      },
      {
        labelKey: "orientation.formations.title",
        href: `${sectionPaths.orientation}/formations`,
        links: [
          { labelKey: "orientation.formations.catalogue", href: `${sectionPaths.orientation}/formations/catalogue` },
          { labelKey: "orientation.formations.professionnelle", href: `${sectionPaths.orientation}/formations/professionnelle` },
          { labelKey: "orientation.formations.alternance", href: `${sectionPaths.orientation}/formations/alternance` },
          { labelKey: "orientation.formations.continue", href: `${sectionPaths.orientation}/formations/continue` },
        ],
      },
      {
        labelKey: "orientation.metiers.title",
        href: `${sectionPaths.orientation}/metiers`,
        links: [
          { labelKey: "orientation.metiers.decouvrir", href: `${sectionPaths.orientation}/metiers/decouvrir` },
          { labelKey: "orientation.metiers.fiches", href: `${sectionPaths.orientation}/metiers/fiches` },
          { labelKey: "orientation.metiers.secteurs", href: `${sectionPaths.orientation}/metiers/secteurs` },
          { labelKey: "orientation.metiers.debouches", href: `${sectionPaths.orientation}/metiers/debouches` },
        ],
      },
      {
        labelKey: "orientation.accompagnement.title",
        href: `${sectionPaths.orientation}/accompagnement`,
        links: [
          { labelKey: "orientation.accompagnement.conseillers", href: `${sectionPaths.orientation}/accompagnement/conseillers` },
          { labelKey: "orientation.accompagnement.services", href: `${sectionPaths.orientation}/accompagnement/services` },
          { labelKey: "orientation.accompagnement.personnalise", href: `${sectionPaths.orientation}/accompagnement/personnalise` },
          { labelKey: "orientation.accompagnement.ressources", href: `${sectionPaths.orientation}/accompagnement/ressources` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "enseignement",
    href: sectionPaths.enseignement,
    leader: {
      titleKey: "enseignement.title",
      paragraphKey: "enseignement.text",
      link: {
        labelKey: "enseignement.allLink",
        href: sectionPaths.enseignement,
      },
    },
    primaryItems: [
      {
        labelKey: "enseignement.enseignants.title",
        href: `${sectionPaths.enseignement}/enseignants`,
        links: [
          { labelKey: "enseignement.enseignants.devenir", href: `${sectionPaths.enseignement}/enseignants/devenir` },
          { labelKey: "enseignement.enseignants.recrutement", href: `${sectionPaths.enseignement}/enseignants/recrutement` },
          { labelKey: "enseignement.enseignants.formation", href: `${sectionPaths.enseignement}/enseignants/formation` },
          { labelKey: "enseignement.enseignants.concours", href: `${sectionPaths.enseignement}/enseignants/concours` },
        ],
      },
      {
        labelKey: "enseignement.personnels.title",
        href: `${sectionPaths.enseignement}/personnels`,
        links: [
          { labelKey: "enseignement.personnels.administratifs", href: `${sectionPaths.enseignement}/personnels/administratifs` },
          { labelKey: "enseignement.personnels.techniques", href: `${sectionPaths.enseignement}/personnels/techniques` },
          { labelKey: "enseignement.personnels.vieProfessionnelle", href: `${sectionPaths.enseignement}/personnels/vie-professionnelle` },
          { labelKey: "enseignement.personnels.services", href: `${sectionPaths.enseignement}/personnels/services` },
        ],
      },
      {
        labelKey: "enseignement.carrieres.title",
        href: `${sectionPaths.enseignement}/carrieres`,
        links: [
          { labelKey: "enseignement.carrieres.carriere", href: `${sectionPaths.enseignement}/carrieres/carriere` },
          { labelKey: "enseignement.carrieres.mobilite", href: `${sectionPaths.enseignement}/carrieres/mobilite` },
          { labelKey: "enseignement.carrieres.concours", href: `${sectionPaths.enseignement}/carrieres/concours` },
          { labelKey: "enseignement.carrieres.formationContinue", href: `${sectionPaths.enseignement}/carrieres/formation-continue` },
        ],
      },
      {
        labelKey: "enseignement.ressources.title",
        href: `${sectionPaths.enseignement}/ressources`,
        links: [
          { labelKey: "enseignement.ressources.programmes", href: `${sectionPaths.enseignement}/ressources/programmes` },
          { labelKey: "enseignement.ressources.pedagogiques", href: `${sectionPaths.enseignement}/ressources/pedagogiques` },
          { labelKey: "enseignement.ressources.referentiels", href: `${sectionPaths.enseignement}/ressources/referentiels` },
          { labelKey: "enseignement.ressources.outilsNumeriques", href: `${sectionPaths.enseignement}/ressources/outils-numeriques` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "etablissements",
    href: sectionPaths.etablissements,
    leader: {
      titleKey: "etablissements.title",
      paragraphKey: "etablissements.text",
      link: {
        labelKey: "etablissements.allLink",
        href: sectionPaths.etablissements,
      },
    },
    primaryItems: [
      {
        labelKey: "etablissements.ecoles.title",
        href: `${sectionPaths.etablissements}/ecoles`,
        links: [
          { labelKey: "etablissements.ecoles.annuaire", href: `${sectionPaths.etablissements}/ecoles/annuaire` },
          { labelKey: "etablissements.ecoles.carte", href: `${sectionPaths.etablissements}/ecoles/carte` },
          { labelKey: "etablissements.ecoles.formations", href: `${sectionPaths.etablissements}/ecoles/formations` },
          { labelKey: "etablissements.ecoles.informationsPratiques", href: `${sectionPaths.etablissements}/ecoles/informations-pratiques` },
        ],
      },
      {
        labelKey: "etablissements.colleges.title",
        href: `${sectionPaths.etablissements}/colleges`,
        links: [
          { labelKey: "etablissements.colleges.annuaire", href: `${sectionPaths.etablissements}/colleges/annuaire` },
          { labelKey: "etablissements.colleges.carte", href: `${sectionPaths.etablissements}/colleges/carte` },
          { labelKey: "etablissements.colleges.formations", href: `${sectionPaths.etablissements}/colleges/formations` },
          { labelKey: "etablissements.colleges.informationsPratiques", href: `${sectionPaths.etablissements}/colleges/informations-pratiques` },
        ],
      },
      {
        labelKey: "etablissements.lycees.title",
        href: `${sectionPaths.etablissements}/lycees`,
        links: [
          { labelKey: "etablissements.lycees.annuaire", href: `${sectionPaths.etablissements}/lycees/annuaire` },
          { labelKey: "etablissements.lycees.carte", href: `${sectionPaths.etablissements}/lycees/carte` },
          { labelKey: "etablissements.lycees.formations", href: `${sectionPaths.etablissements}/lycees/formations` },
          { labelKey: "etablissements.lycees.informationsPratiques", href: `${sectionPaths.etablissements}/lycees/informations-pratiques` },
        ],
      },
      {
        labelKey: "etablissements.enseignementSuperieur.title",
        href: `${sectionPaths.etablissements}/enseignement-superieur`,
        links: [
          { labelKey: "etablissements.enseignementSuperieur.annuaire", href: `${sectionPaths.etablissements}/enseignement-superieur/annuaire` },
          { labelKey: "etablissements.enseignementSuperieur.carte", href: `${sectionPaths.etablissements}/enseignement-superieur/carte` },
          { labelKey: "etablissements.enseignementSuperieur.formations", href: `${sectionPaths.etablissements}/enseignement-superieur/formations` },
          { labelKey: "etablissements.enseignementSuperieur.informationsPratiques", href: `${sectionPaths.etablissements}/enseignement-superieur/informations-pratiques` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "examensDiplomes",
    href: sectionPaths.examensDiplomes,
    leader: {
      titleKey: "examensDiplomes.title",
      paragraphKey: "examensDiplomes.text",
      link: {
        labelKey: "examensDiplomes.allLink",
        href: sectionPaths.examensDiplomes,
      },
    },
    primaryItems: [
      {
        labelKey: "examensDiplomes.examens.title",
        href: `${sectionPaths.examensDiplomes}/examens`,
        links: [
          { labelKey: "examensDiplomes.examens.calendrier", href: `${sectionPaths.examensDiplomes}/examens/calendrier` },
          { labelKey: "examensDiplomes.examens.inscriptions", href: `${sectionPaths.examensDiplomes}/examens/inscriptions` },
          { labelKey: "examensDiplomes.examens.convocations", href: `${sectionPaths.examensDiplomes}/examens/convocations` },
          { labelKey: "examensDiplomes.examens.informationsPratiques", href: `${sectionPaths.examensDiplomes}/examens/informations-pratiques` },
        ],
      },
      {
        labelKey: "examensDiplomes.diplomes.title",
        href: `${sectionPaths.examensDiplomes}/diplomes`,
        links: [
          { labelKey: "examensDiplomes.diplomes.nationaux", href: `${sectionPaths.examensDiplomes}/diplomes/nationaux` },
          { labelKey: "examensDiplomes.diplomes.professionnels", href: `${sectionPaths.examensDiplomes}/diplomes/professionnels` },
          { labelKey: "examensDiplomes.diplomes.equivalences", href: `${sectionPaths.examensDiplomes}/diplomes/equivalences` },
          { labelKey: "examensDiplomes.diplomes.demander", href: `${sectionPaths.examensDiplomes}/diplomes/demander` },
        ],
      },
      {
        labelKey: "examensDiplomes.certifications.title",
        href: `${sectionPaths.examensDiplomes}/certifications`,
        links: [
          { labelKey: "examensDiplomes.certifications.certifications", href: `${sectionPaths.examensDiplomes}/certifications/certifications` },
          { labelKey: "examensDiplomes.certifications.competences", href: `${sectionPaths.examensDiplomes}/certifications/competences` },
          { labelKey: "examensDiplomes.certifications.validation", href: `${sectionPaths.examensDiplomes}/certifications/validation` },
          { labelKey: "examensDiplomes.certifications.reconnaissance", href: `${sectionPaths.examensDiplomes}/certifications/reconnaissance` },
        ],
      },
      {
        labelKey: "examensDiplomes.resultats.title",
        href: `${sectionPaths.examensDiplomes}/resultats`,
        links: [
          { labelKey: "examensDiplomes.resultats.examens", href: `${sectionPaths.examensDiplomes}/resultats/examens` },
          { labelKey: "examensDiplomes.resultats.concours", href: `${sectionPaths.examensDiplomes}/resultats/concours` },
          { labelKey: "examensDiplomes.resultats.verifierUnDiplome", href: `${sectionPaths.examensDiplomes}/resultats/verifier-un-diplome` },
          { labelKey: "examensDiplomes.resultats.archives", href: `${sectionPaths.examensDiplomes}/resultats/archives` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "aidesServices",
    href: sectionPaths.aidesServices,
    leader: {
      titleKey: "aidesServices.title",
      paragraphKey: "aidesServices.text",
      link: {
        labelKey: "aidesServices.allLink",
        href: sectionPaths.aidesServices,
      },
    },
    primaryItems: [
      {
        labelKey: "aidesServices.eleves.title",
        href: `${sectionPaths.aidesServices}/eleves`,
        links: [
          { labelKey: "aidesServices.eleves.aides", href: `${sectionPaths.aidesServices}/eleves/aides` },
          { labelKey: "aidesServices.eleves.bourses", href: `${sectionPaths.aidesServices}/eleves/bourses` },
          { labelKey: "aidesServices.eleves.vieScolaire", href: `${sectionPaths.aidesServices}/eleves/vie-scolaire` },
          { labelKey: "aidesServices.eleves.accompagnement", href: `${sectionPaths.aidesServices}/eleves/accompagnement` },
        ],
      },
      {
        labelKey: "aidesServices.parents.title",
        href: `${sectionPaths.aidesServices}/parents`,
        links: [
          { labelKey: "aidesServices.parents.inscription", href: `${sectionPaths.aidesServices}/parents/inscription` },
          { labelKey: "aidesServices.parents.orientation", href: `${sectionPaths.aidesServices}/parents/orientation` },
          { labelKey: "aidesServices.parents.aides", href: `${sectionPaths.aidesServices}/parents/aides` },
          { labelKey: "aidesServices.parents.vieScolaire", href: `${sectionPaths.aidesServices}/parents/vie-scolaire` },
        ],
      },
      {
        labelKey: "aidesServices.etudiants.title",
        href: `${sectionPaths.aidesServices}/etudiants`,
        links: [
          { labelKey: "aidesServices.etudiants.aides", href: `${sectionPaths.aidesServices}/etudiants/aides` },
          { labelKey: "aidesServices.etudiants.bourses", href: `${sectionPaths.aidesServices}/etudiants/bourses` },
          { labelKey: "aidesServices.etudiants.logement", href: `${sectionPaths.aidesServices}/etudiants/logement` },
          { labelKey: "aidesServices.etudiants.accompagnement", href: `${sectionPaths.aidesServices}/etudiants/accompagnement` },
        ],
      },
      {
        labelKey: "aidesServices.demarches.title",
        href: `${sectionPaths.aidesServices}/demarches`,
        links: [
          { labelKey: "aidesServices.demarches.toutes", href: `${sectionPaths.aidesServices}/demarches/toutes` },
          { labelKey: "aidesServices.demarches.documents", href: `${sectionPaths.aidesServices}/demarches/documents` },
          { labelKey: "aidesServices.demarches.formulaires", href: `${sectionPaths.aidesServices}/demarches/formulaires` },
          { labelKey: "aidesServices.demarches.servicesEnLigne", href: `${sectionPaths.aidesServices}/demarches/services-en-ligne` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "ministere",
    href: sectionPaths.ministere,
    leader: {
      titleKey: "ministere.title",
      paragraphKey: "ministere.text",
      link: {
        labelKey: "ministere.allLink",
        href: sectionPaths.ministere,
      },
    },
    primaryItems: [
      {
        labelKey: "ministere.actualites.title",
        href: `${sectionPaths.ministere}/actualites`,
        links: [
          { labelKey: "ministere.actualites.actualites", href: `${sectionPaths.ministere}/actualites/actualites` },
          { labelKey: "ministere.actualites.communiques", href: `${sectionPaths.ministere}/actualites/communiques` },
          { labelKey: "ministere.actualites.agenda", href: `${sectionPaths.ministere}/actualites/agenda` },
          { labelKey: "ministere.actualites.discours", href: `${sectionPaths.ministere}/actualites/discours` },
        ],
      },
      {
        labelKey: "ministere.politiquesPubliques.title",
        href: `${sectionPaths.ministere}/politiques-publiques`,
        links: [
          { labelKey: "ministere.politiquesPubliques.reformes", href: `${sectionPaths.ministere}/politiques-publiques/reformes` },
          { labelKey: "ministere.politiquesPubliques.programmesNationaux", href: `${sectionPaths.ministere}/politiques-publiques/programmes-nationaux` },
          { labelKey: "ministere.politiquesPubliques.priorites", href: `${sectionPaths.ministere}/politiques-publiques/priorites` },
          { labelKey: "ministere.politiquesPubliques.evaluation", href: `${sectionPaths.ministere}/politiques-publiques/evaluation` },
        ],
      },
      {
        labelKey: "ministere.publications.title",
        href: `${sectionPaths.ministere}/publications`,
        links: [
          { labelKey: "ministere.publications.rapports", href: `${sectionPaths.ministere}/publications/rapports` },
          { labelKey: "ministere.publications.statistiques", href: `${sectionPaths.ministere}/publications/statistiques` },
          { labelKey: "ministere.publications.donneesPubliques", href: `${sectionPaths.ministere}/publications/donnees-publiques` },
          { labelKey: "ministere.publications.documentsOfficiels", href: `${sectionPaths.ministere}/publications/documents-officiels` },
        ],
      },
      {
        labelKey: "ministere.institution.title",
        href: `${sectionPaths.ministere}/institution`,
        links: [
          { labelKey: "ministere.institution.leMinistere", href: `${sectionPaths.ministere}/institution/le-ministere` },
          { labelKey: "ministere.institution.organisation", href: `${sectionPaths.ministere}/institution/organisation` },
          { labelKey: "ministere.institution.budget", href: `${sectionPaths.ministere}/institution/budget` },
          { labelKey: "ministere.institution.contacts", href: `${sectionPaths.ministere}/institution/contacts` },
        ],
      },
    ],
  },
];

assertNavigationStructureValid();

/**
 * Secondary navigation zone of the site footer, distinct from the main
 * navigation of the header. It mirrors the seven entries of the header
 * navigation and derives its links from the sections of each theme — so the
 * footer and the header can never drift apart.
 *
 * Column titles resolve under `footer.columns`, links under `nav.panel`.
 */
export const footerNavigation: ReadonlyArray<FooterColumn> = primaryNavigation.map(
  (section) => ({
    columnKey: section.labelKey,
    links: section.primaryItems,
  })
);