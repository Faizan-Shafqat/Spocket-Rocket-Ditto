/**
 * Multi-site typography: one SR Hero module, many site records (JSON + per-site CSS).
 */

const fs = require("fs");
const path = require("path");

const { sameWebsiteUrl } = require("./typography-website-urls");
const { appendHeroCoverCssToClientTypographyFile } = require("./typography-hero-cover-css");

/**
 * @param {string} websiteUrl
 */
function siteSlugFromUrl(websiteUrl) {
  try {
    const h = new URL(websiteUrl).hostname.replace(/^www\./i, "");
    const s = h.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
    return s || "site";
  } catch {
    return "site";
  }
}

/**
 * @param {unknown} typography
 */
function typographyFontSummary(typography) {
  if (!typography || typeof typography !== "object") {
    return { heading: null, body: null };
  }
  const t = /** @type {Record<string, unknown>} */ (typography);
  const fonts = t.fonts && typeof t.fonts === "object" ? t.fonts : {};
  const heads = t.headings && typeof t.headings === "object" ? t.headings : {};
  const h1 = heads.h1 && typeof heads.h1 === "object" ? heads.h1 : {};
  const body = t.body && typeof t.body === "object" ? t.body : {};
  return {
    heading: String(h1.fontFamily || fonts.headings || "").trim() || null,
    body: String(body.fontFamily || fonts.body || "").trim() || null,
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} envelope
 */
function envelopeTypography(envelope) {
  if (!envelope || typeof envelope !== "object") {
    return null;
  }
  if (envelope.typography && typeof envelope.typography === "object") {
    return envelope.typography;
  }
  if (envelope.typography_full_page && typeof envelope.typography_full_page === "object") {
    return envelope.typography_full_page;
  }
  return null;
}

/**
 * @param {{
 *   website_url: string,
 *   slug?: string,
 *   playwright?: Record<string, unknown>|null,
 *   green?: Record<string, unknown>|null,
 *   purple?: Record<string, unknown>|null,
 *   typography?: Record<string, unknown>|null,
 *   typographyExtract?: Record<string, unknown>|null,
 * }} site
 */
/**
 * @param {Record<string, unknown>} pageTypography
 * @param {{ typography?: Record<string, unknown>|null }} hero
 */
function mergeTypographyWithHeroScope(pageTypography, hero) {
  if (!pageTypography || typeof pageTypography !== "object") {
    return pageTypography;
  }
  const ht = hero?.typography;
  if (!ht || typeof ht !== "object") {
    return pageTypography;
  }
  const out = { ...pageTypography };
  if (ht.headings && typeof ht.headings === "object") {
    out.headings = {
      ...(out.headings && typeof out.headings === "object" ? out.headings : {}),
      ...ht.headings,
    };
  }
  if (ht.body && typeof ht.body === "object") {
    out.body = { ...(out.body && typeof out.body === "object" ? out.body : {}), ...ht.body };
  }
  if (ht.fonts && typeof ht.fonts === "object") {
    out.fonts = { ...(out.fonts && typeof out.fonts === "object" ? out.fonts : {}), ...ht.fonts };
  }
  if (ht.buttons && typeof ht.buttons === "object" && Object.keys(ht.buttons).length > 0) {
    out.buttons = {
      ...(out.buttons && typeof out.buttons === "object" ? out.buttons : {}),
      ...ht.buttons,
    };
  }
  return out;
}

function siteRecordForUpload(site) {
  const url = String(site.website_url || "").trim();
  const pw = site.playwright || site.typographyExtract || null;
  const typography = site.typography || envelopeTypography(pw);
  return {
    website_url: url,
    slug: site.slug || siteSlugFromUrl(url),
    typography,
    typographyExtract: pw,
    sources: {
      playwright: Boolean(pw && envelopeTypography(pw)),
    },
  };
}

/**
 * Write `typography-sites/sites.json` and `css/client-typography-{slug}.css` per site.
 * Primary site still uses caller's main `synthesizeTypographyIntoTheme` path.
 *
 * @param {string} themeRoot
 * @param {Array<Record<string, unknown>>} typographySites
 * @param {string} primaryWebsiteUrl
 * @param {(typography: Record<string, unknown>) => string} buildClientTypographyCss
 */
function writeTypographySitesBundleToTheme(themeRoot, typographySites, primaryWebsiteUrl, buildClientTypographyCss) {
  if (!Array.isArray(typographySites) || typographySites.length === 0) {
    return { written: false, siteCount: 0 };
  }
  const dir = path.join(themeRoot, "typography-sites");
  fs.mkdirSync(dir, { recursive: true });
  const cssDir = path.join(themeRoot, "css");
  fs.mkdirSync(cssDir, { recursive: true });

  /** @type {Record<string, unknown>[]} */
  const manifestSites = [];

  for (const raw of typographySites) {
    const rec = siteRecordForUpload(
      raw && typeof raw === "object" ? raw : { website_url: "" },
    );
    if (!rec.website_url) {
      continue;
    }
    const extract = rec.typographyExtract;
    const hero =
      extract && typeof extract === "object" && extract.hero
        ? extract.hero
        : null;
    let ty = rec.typography;
    if (ty && hero?.typography) {
      ty = mergeTypographyWithHeroScope(ty, hero);
    }
    let cssFile = null;
    if (ty && typeof ty === "object") {
      const css = buildClientTypographyCss(ty);
      cssFile = `css/client-typography-${rec.slug}.css`;
      const cssPath = path.join(themeRoot, cssFile);
      fs.writeFileSync(cssPath, css, "utf8");
      if (hero?.found) {
        appendHeroCoverCssToClientTypographyFile(
          themeRoot,
          hero,
          `client-typography-${rec.slug}.css`,
          rec.slug,
        );
      }
    }
    const sum = typographyFontSummary(ty);
    const isPrimary = Boolean(
      String(primaryWebsiteUrl || "").trim() &&
        sameWebsiteUrl(rec.website_url, primaryWebsiteUrl),
    );
    manifestSites.push({
      website_url: rec.website_url,
      slug: rec.slug,
      is_primary: isPrimary,
      css_file: cssFile,
      fonts: sum,
      sources: rec.sources,
    });
  }

  const manifest = {
    version: 1,
    module: "SR Hero 01",
    note:
      "One SR Hero module; per-site CSS in css/client-typography-{slug}.css. Primary: templates/preview.html. Other sites: templates/preview-{slug}.html (after batch upload).",
    primary_website_url: primaryWebsiteUrl || manifestSites.find((s) => s.is_primary)?.website_url || manifestSites[0]?.website_url,
    sites: manifestSites,
  };
  fs.writeFileSync(path.join(dir, "sites.json"), JSON.stringify(manifest, null, 2), "utf8");
  return {
    written: true,
    siteCount: manifestSites.length,
    manifestPath: "typography-sites/sites.json",
    primary_website_url: manifest.primary_website_url,
    sites: manifestSites.map((s) => ({
      website_url: s.website_url,
      slug: s.slug,
      is_primary: s.is_primary,
      css_file: s.css_file,
      fonts: s.fonts,
    })),
  };
}

module.exports = {
  siteSlugFromUrl,
  typographyFontSummary,
  envelopeTypography,
  siteRecordForUpload,
  writeTypographySitesBundleToTheme,
};
