import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { educationHome } from "@/lib/home-content";
import { PortalSearchBar } from "@/components/public/search/portal-search-bar";
import { EstablishmentSearch } from "@/components/public/home/establishment-search";
import { FormationSearch } from "@/components/public/home/formation-search";
import {
  ArticleCard,
  CtaButtonsGroup,
  LinkTile,
  NoticeCallout,
  SearchSuggestionTag,
} from "@/components/public/content/ads-fragments";

const HOME_PATH = "/";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { absolute: tHome("metaTitle") },
    description: tMeta("description"),
    ...localizedAlternates(locale, HOME_PATH),
  };
}

/* Layout helpers below use the ADS design tokens through `var(--ads-*)` (the
 * single source of tokens — main.css) so light/dark switching and theming stay
 * owned by the Design System. Only the ministry-specific arrangement of these
 * blocks is expressed here, inline, without any local stylesheet. */

const heroContainerStyle: CSSProperties = {
  maxWidth: "52rem",
  marginInline: "auto",
  textAlign: "center",
};

const searchBlockStyle: CSSProperties = {
  maxWidth: "42rem",
  margin: "2.25rem auto 0",
  textAlign: "left",
};

const searchTitleStyle: CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "1.25rem",
  lineHeight: 1.3,
  fontWeight: 700,
};

const popularLabelStyle: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "0.875rem",
  color: "var(--ads-color-text-muted)",
};

const popularListStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const cardListStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
  display: "grid",
  gap: "1.5rem",
};

const linkListStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
  display: "grid",
  gap: "0",
  maxWidth: "72rem",
};

/** Whole-card link block (audiences, figures, ministry links…). */
const teaserCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  height: "100%",
  padding: "1.25rem",
  background: "var(--ads-color-background)",
  border: "1px solid var(--ads-color-border)",
  borderTop: "3px solid var(--ads-color-primary)",
  textDecoration: "none",
  color: "var(--ads-color-text)",
};

const teaserTitleStyle: CSSProperties = {
  display: "block",
  fontSize: "1.0625rem",
  lineHeight: 1.35,
  fontWeight: 700,
};

const teaserDescStyle: CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  lineHeight: 1.55,
  color: "var(--ads-color-text-muted)",
};

const teaserArrowStyle: CSSProperties = {
  marginTop: "auto",
  alignSelf: "flex-end",
  fontSize: "1rem",
  color: "var(--ads-color-primary)",
};

const iconBlockStyle: CSSProperties = {
  fontSize: "1.375rem",
  lineHeight: 1,
  color: "var(--ads-color-primary)",
};

const figureValueStyle: CSSProperties = {
  display: "block",
  fontSize: "clamp(1.5rem, 3vw, 2rem)",
  lineHeight: 1.2,
  fontWeight: 700,
};

const figureLabelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.9375rem",
  fontWeight: 600,
};

const noteStyle: CSSProperties = {
  margin: "1rem 0 0",
  color: "var(--ads-color-text-muted)",
};

/**
 * Homepage of the Ministère de l'Éducation nationale d'Astoria — the national
 * access point to education, not a presentation page of the ministry.
 *
 * The page answers three questions, section after section:
 *
 *   01 Hero / Recherche            — who operates the portal, and search first
 *   02 Vous êtes…                  — the visitor recognises their profile
 *   03 Services en ligne           — what can I do now?
 *   04 Trouver un établissement    — national directory (future service)
 *   05 Trouver une formation       — national catalogue (future service)
 *   06 Construire son parcours     — orientation and careers
 *   07 Examens & diplômes          — calendars, registration, results, verification
 *   08 Actualités                  — editorial feed (explicit empty state until wired)
 *   09 L'éducation en chiffres     — data access, no fabricated statistic
 *   10 Le ministère                — discreet institutional closing
 *
 * Every section is driven by the `educationHome` configuration
 * (lib/home-content.ts) and the message catalogs, so the content can evolve
 * without rewriting the interface. The header navigation remains the single
 * source of truth of the information architecture; the homepage only exposes
 * the destinations that matter to the visitor journey.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* 01 — Hero / Recherche: institutional statement and the global search,
          visually the most important element of the page. */}
      <section className="gov-section" aria-labelledby="home-hero-title">
        <div className="gov-section__container" style={heroContainerStyle}>
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="home-hero-title">{t("hero.title")}</h1>
          <p className="gov-lead">{t("hero.lead")}</p>
          <div style={searchBlockStyle}>
            <h2 id="home-search-title" style={searchTitleStyle}>
              {t("search.title")}
            </h2>
            <PortalSearchBar label={t("search.label")} placeholder={t("search.placeholder")} />
            <div style={{ marginTop: "1.25rem" }}>
              <p style={popularLabelStyle} id="popular-searches-label">
                {t("search.popularLabel")}
              </p>
              <ul style={popularListStyle} aria-labelledby="popular-searches-label">
                {educationHome.popularSearches.map((search) => (
                  <li key={search.key}>
                    <SearchSuggestionTag
                      label={t(`search.popular.${search.key}`)}
                      href={search.href}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Vous êtes…: the visitor identifies their profile and lands on the
          destinations built for them. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="audience-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("audience.kicker")}</p>
              <h2 id="audience-title" className="gov-section__title">
                {t("audience.title")}
              </h2>
              <p className="gov-lead">{t("audience.lead")}</p>
            </div>
          </div>
          <ul className="fr-grid-row fr-grid-row--gutters" role="list">
            {educationHome.audiences.map((item) => (
              <li key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                <a href={item.href} style={teaserCardStyle}>
                  <span className={item.iconId} aria-hidden="true" style={iconBlockStyle} />
                  <span style={teaserTitleStyle}>{t(`audience.items.${item.key}.title`)}</span>
                  <span style={teaserDescStyle}>{t(`audience.items.${item.key}.desc`)}</span>
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Services en ligne: the functional heart of the page, concrete
          priority actions each mapped to a destination of the navigation. */}
      <section className="gov-section" aria-labelledby="services-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("services.kicker")}</p>
              <h2 id="services-title" className="gov-section__title">
                {t("services.title")}
              </h2>
              <p className="gov-lead">{t("services.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("services.allLink"),
                  href: educationHome.servicesAllHref,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {educationHome.services.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <LinkTile
                  title={t(`services.items.${item.key}.title`)}
                  desc={t(`services.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Trouver un établissement: entry point of the future national
          directory. The search interface is ready to receive the service. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="establishment-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("establishment.kicker")}</p>
              <h2 id="establishment-title" className="gov-section__title">
                {t("establishment.title")}
              </h2>
              <p className="gov-lead">{t("establishment.lead")}</p>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-lg-7">
              <EstablishmentSearch
                legend={t("establishment.form.legend")}
                typeLabel={t("establishment.form.typeLabel")}
                typePlaceholder={t("establishment.form.typePlaceholder")}
                locationLabel={t("establishment.form.locationLabel")}
                locationPlaceholder={t("establishment.form.locationPlaceholder")}
                submitLabel={t("establishment.submit")}
                hint={t("establishment.hint")}
                types={educationHome.establishment.types.map((type) => ({
                  key: type.key,
                  label: t(`establishment.types.${type.key}`),
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Trouver une formation: entry point of the future national
          catalogue of programmes. */}
      <section className="gov-section" aria-labelledby="formation-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("formation.kicker")}</p>
              <h2 id="formation-title" className="gov-section__title">
                {t("formation.title")}
              </h2>
              <p className="gov-lead">{t("formation.lead")}</p>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-lg-7">
              <FormationSearch
                legend={t("formation.form.legend")}
                levelLabel={t("formation.form.levelLabel")}
                levelPlaceholder={t("formation.form.levelPlaceholder")}
                fieldLabel={t("formation.form.fieldLabel")}
                fieldPlaceholder={t("formation.form.fieldPlaceholder")}
                submitLabel={t("formation.submit")}
                hint={t("formation.hint")}
                levels={educationHome.formation.levels.map((level) => ({
                  key: level.key,
                  label: t(`formation.levels.${level.key}`),
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Construire son parcours: the orientation journey, from choosing a
          path to being accompanied. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="orientation-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("orientation.kicker")}</p>
              <h2 id="orientation-title" className="gov-section__title">
                {t("orientation.title")}
              </h2>
              <p className="gov-lead">{t("orientation.lead")}</p>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {educationHome.orientation.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <LinkTile
                  title={t(`orientation.items.${item.key}.title`)}
                  desc={t(`orientation.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — Examens & diplômes: functional block; the verification entry is
          already in place for the future service. */}
      <section className="gov-section" aria-labelledby="exams-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("exams.kicker")}</p>
              <h2 id="exams-title" className="gov-section__title">
                {t("exams.title")}
              </h2>
              <p className="gov-lead">{t("exams.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("exams.cta"),
                  href: educationHome.examsHref,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <ul className="fr-grid-row fr-grid-row--gutters" role="list">
            {educationHome.exams.map((item) => (
              <li key={item.key} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <a href={item.href} style={teaserCardStyle}>
                  <span className={item.iconId} aria-hidden="true" style={iconBlockStyle} />
                  <span style={teaserTitleStyle}>{t(`exams.items.${item.key}.title`)}</span>
                  <span style={teaserDescStyle}>{t(`exams.items.${item.key}.desc`)}</span>
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 08 — Actualités: the editorial feed comes after the services. Until
          the feed is wired, the section renders an explicit empty state rather
          than fabricating articles presented as real. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="news-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("news.kicker")}</p>
              <h2 id="news-title" className="gov-section__title">
                {t("news.title")}
              </h2>
              <p className="gov-lead">{t("news.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("news.allLink"),
                  href: educationHome.news.href,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          {educationHome.news.featured ? (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-lg-7">
                <ArticleCard
                  title={t(educationHome.news.featured.titleKey)}
                  desc={
                    educationHome.news.featured.textKey
                      ? t(educationHome.news.featured.textKey)
                      : undefined
                  }
                  tag={t(educationHome.news.featured.tagKey)}
                  date={t(educationHome.news.featured.dateKey)}
                  href={educationHome.news.featured.href}
                  size="large"
                />
              </div>
              <div className="fr-col-12 fr-col-lg-5">
                <ul style={cardListStyle}>
                  {educationHome.news.secondary.map((article) => (
                    <li key={article.href}>
                      <ArticleCard
                        title={t(article.titleKey)}
                        tag={t(article.tagKey)}
                        date={t(article.dateKey)}
                        href={article.href}
                        size="small"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <NoticeCallout iconId="fr-icon-information-line">{t("news.empty")}</NoticeCallout>
          )}
        </div>
      </section>

      {/* 09 — L'éducation en chiffres: data access. No figure is presented as
          an official statistic until the data source ships; the cards render an
          identified placeholder and link to the data sections. */}
      <section className="gov-section" aria-labelledby="stats-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("stats.kicker")}</p>
              <h2 id="stats-title" className="gov-section__title">
                {t("stats.title")}
              </h2>
              <p className="gov-lead">{t("stats.lead")}</p>
            </div>
          </div>
          <ul className="fr-grid-row fr-grid-row--gutters" role="list">
            {educationHome.stats.map((item) => (
              <li key={item.key} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <a href={item.href} style={teaserCardStyle}>
                  <span style={figureValueStyle} aria-hidden="true">
                    —
                  </span>
                  <span style={figureLabelStyle}>{t(`stats.items.${item.key}.label`)}</span>
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
                </a>
              </li>
            ))}
          </ul>
          <p className="fr-text--sm" style={noteStyle}>
            {t("stats.note")}
          </p>
          <ul className="fr-grid-row fr-grid-row--gutters" role="list" style={{ marginTop: "1.5rem" }}>
            {educationHome.statsAccess.map((item) => (
              <li key={item.key} className="fr-col-12 fr-col-md-4">
                <LinkTile
                  title={t(`stats.access.${item.key}.title`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 — Le ministère: discreet institutional closing. The user first
          does, then understands, then discovers the institution. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="ministry-title">
        <div className="gov-section__container" style={heroContainerStyle}>
          <p className="gov-kicker">{t("ministry.kicker")}</p>
          <h2 id="ministry-title" className="gov-section__title">
            {t("ministry.title")}
          </h2>
          <p
            style={{
              margin: "0 auto 1.5rem",
              maxWidth: "42rem",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "var(--ads-color-text-muted)",
            }}
          >
            {t("ministry.lead")}
          </p>
          <ul
            role="list"
            style={{
              ...popularListStyle,
              justifyContent: "center",
              marginTop: "1.5rem",
              gap: "0.625rem 1.75rem",
            }}
          >
            {educationHome.ministry.map((link) => (
              <li key={link.key}>
                <a href={link.href} style={{ fontWeight: 600, textUnderlineOffset: "0.2em" }}>
                  {t(`ministry.links.${link.key}.title`)}
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}