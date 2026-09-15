import type { FrIconClassName } from "@codegouvaor/react-ads/fr";
import { sectionPaths } from "./site-structure";

/**
 * Content configuration of the homepage of the Ministère de l'Éducation
 * nationale d'Astoria.
 *
 * Structure only — the file never holds display text: every label is resolved
 * from the message catalogs (`apps/messages/{fr,en}.json`) through the message
 * key carried by each entry. Only the structure (keys, hrefs, icons) lives
 * here, exactly like `site-structure.ts` for the header.
 *
 * Hrefs are locale-agnostic pathnames following the URL plan of the portal
 * (`lib/site-structure.ts`). Destinations that point to sections being
 * published resolve as soon as those sections ship; no fictitious page is
 * created to satisfy them.
 */

/** One card/link of the homepage; `key` resolves a `home.<section>.items.<key>` label. */
export type HomeEntry = {
  key: string;
  href: string;
  iconId: FrIconClassName;
};

/**
 * One article of the homepage news feed. The feed is empty until the
 * editorial API is wired; each entry resolves its labels from the message
 * catalogs through its keys, so adding an article never changes the markup.
 */
export type HomeNewsArticle = {
  titleKey: string;
  textKey?: string;
  tagKey: string;
  dateKey: string;
  href: string;
};

const scolarite = sectionPaths.scolarite;
const orientation = sectionPaths.orientation;
const enseignement = sectionPaths.enseignement;
const etablissements = sectionPaths.etablissements;
const examensDiplomes = sectionPaths.examensDiplomes;
const aidesServices = sectionPaths.aidesServices;
const ministere = sectionPaths.ministere;

export const educationHome = {
  /** “Que recherchez-vous ?” suggestions rendered under the hero search. */
  popularSearches: [
    { key: "establishment", href: etablissements },
    { key: "formation", href: `${orientation}/formations/catalogue` },
    { key: "procedure", href: `${aidesServices}/demarches` },
    { key: "exam", href: `${examensDiplomes}/examens/calendrier` },
  ] as const,

  /** “Vous êtes…” — the publics of the portal. */
  audiences: [
    { key: "eleve", href: scolarite, iconId: "fr-icon-user-line" },
    { key: "parent", href: aidesServices, iconId: "fr-icon-parent-line" },
    { key: "enseignant", href: enseignement, iconId: "fr-icon-user-star-line" },
    { key: "etudiant", href: `${scolarite}/enseignement-superieur`, iconId: "fr-icon-book-2-line" },
    { key: "etablissement", href: etablissements, iconId: "fr-icon-building-line" },
    { key: "professionnel", href: ministere, iconId: "fr-icon-briefcase-line" },
  ] as const,

  /** “Services en ligne” — priority actions. */
  services: [
    { key: "inscription", href: `${aidesServices}/parents/inscription`, iconId: "fr-icon-ball-pen-line" },
    { key: "formation", href: `${orientation}/formations/catalogue`, iconId: "fr-icon-book-2-line" },
    { key: "examen", href: `${examensDiplomes}/examens/inscriptions`, iconId: "fr-icon-calendar-check-line" },
    { key: "aide", href: `${aidesServices}/eleves/aides`, iconId: "fr-icon-money-euro-circle-line" },
  ] as const,
  servicesAllHref: `${aidesServices}/demarches`,

  /** “Trouver un établissement” — future national directory. */
  establishment: {
    href: etablissements,
    /** Types of establishment proposed in the search select. */
    types: [
      { key: "ecole", href: `${etablissements}/ecoles` },
      { key: "college", href: `${etablissements}/colleges` },
      { key: "lycee", href: `${etablissements}/lycees` },
      { key: "superieur", href: `${etablissements}/enseignement-superieur` },
    ] as const,
  },

  /** “Trouver une formation” — future national catalogue. */
  formation: {
    href: `${orientation}/formations/catalogue`,
    /** Levels proposed in the search select. */
    levels: [
      { key: "college", href: `${orientation}/formations/catalogue` },
      { key: "lycee", href: `${orientation}/formations/catalogue` },
      { key: "superieur", href: `${orientation}/formations/catalogue` },
      { key: "professionnelle", href: `${orientation}/formations/professionnelle` },
    ] as const,
  },

  /** “Construire son parcours” — orientation journey. */
  orientation: [
    { key: "choisir", href: `${orientation}/choisir-son-parcours/orientation`, iconId: "fr-icon-compass-3-line" },
    { key: "metiers", href: `${orientation}/metiers/decouvrir`, iconId: "fr-icon-briefcase-line" },
    { key: "formations", href: `${orientation}/formations/catalogue`, iconId: "fr-icon-book-2-line" },
    { key: "accompagnement", href: `${orientation}/accompagnement/conseillers`, iconId: "fr-icon-user-heart-line" },
  ] as const,

  /** “Examens & diplômes” — functional block. */
  exams: [
    { key: "calendrier", href: `${examensDiplomes}/examens/calendrier`, iconId: "fr-icon-calendar-line" },
    { key: "inscriptions", href: `${examensDiplomes}/examens/inscriptions`, iconId: "fr-icon-ball-pen-line" },
    { key: "resultats", href: `${examensDiplomes}/resultats/examens`, iconId: "fr-icon-bar-chart-box-line" },
    { key: "verifier", href: `${examensDiplomes}/resultats/verifier-un-diplome`, iconId: "fr-icon-medal-line" },
  ] as const,
  examsHref: examensDiplomes,

  /**
   * “L'éducation en chiffres” — the seam where the real indicators plug in.
   *
   * The values are deliberately absent here: the section renders the visual
   * with identified placeholders and a note, so no fictitious figure is ever
   * presented as an official statistic. When the data source ships, each entry
   * resolves its value from the messages / API without touching the layout.
   */
  stats: [
    { key: "etablissements", href: etablissements },
    { key: "eleves", href: scolarite },
    { key: "formations", href: `${orientation}/formations/catalogue` },
    { key: "indicateurs", href: `${ministere}/publications/statistiques` },
  ] as const,
  statsAccess: [
    { key: "statistiques", href: `${ministere}/publications/statistiques`, iconId: "fr-icon-bar-chart-box-line" },
    { key: "openData", href: `${ministere}/publications/donnees-publiques`, iconId: "fr-icon-download-line" },
    { key: "publications", href: `${ministere}/publications`, iconId: "fr-icon-file-text-line" },
  ] as const,

  /**
   * “Le ministère” — discreet institutional closing. Links use the exact
   * destinations of the `ministere` theme of the header navigation.
   */
  ministry: [
    { key: "leMinistere", href: `${ministere}/institution/le-ministere`, iconId: "fr-icon-government-line" },
    { key: "organisation", href: `${ministere}/institution/organisation`, iconId: "fr-icon-building-4-line" },
    { key: "politiques", href: `${ministere}/politiques-publiques`, iconId: "fr-icon-article-line" },
    { key: "publications", href: `${ministere}/publications`, iconId: "fr-icon-newspaper-line" },
    { key: "budget", href: `${ministere}/institution/budget`, iconId: "fr-icon-money-euro-box-line" },
    { key: "contacts", href: `${ministere}/institution/contacts`, iconId: "fr-icon-mail-line" },
  ] as const,

  /**
   * “Actualités du ministère”. Empty by design: until the editorial feed is
   * wired, the section renders an explicit empty state instead of fabricating
   * articles presented as real. Each future article is added here as a
   * `{ titleKey, tagKey, dateKey, href }` entry — the rendering component does
   * not change.
   */
  news: {
    href: `${ministere}/actualites`,
    featured: null as HomeNewsArticle | null,
    secondary: [] as ReadonlyArray<HomeNewsArticle>,
  },
} as const;