/**
 * Summarize extracted typography/hero items packaged for Brad upload.
 */

const { firstFontFamilyName } = require("./sr-preview-theme-settings");
const { resolveHeroHeading, resolveHeroDescription } = require("./sr-preview-hero-fields");

/**
 * @param {Record<string, unknown>|null|undefined} typographyExtract
 * @param {Record<string, unknown>|null|undefined} typography
 * @param {Record<string, unknown>} [body]
 */
function buildExtractUploadManifest(typographyExtract, typography, body = {}) {
  const hero =
    typographyExtract?.hero && typeof typographyExtract.hero === "object"
      ? typographyExtract.hero
      : null;
  const typo =
    typography ||
    (typographyExtract?.typography && typeof typographyExtract.typography === "object"
      ? typographyExtract.typography
      : null);

  const text = hero?.text && typeof hero.text === "object" ? hero.text : {};
  const bg = hero?.background && typeof hero.background === "object" ? hero.background : null;
  const ctas = Array.isArray(hero?.ctas) ? hero.ctas : [];

  const heading = hero?.found ? resolveHeroHeading(hero, body) : "";
  const description = hero?.found ? resolveHeroDescription(hero, body) : "";

  const heads =
    typo?.headings && typeof typo.headings === "object" ? typo.headings : {};
  const h1 = heads.h1 && typeof heads.h1 === "object" ? heads.h1 : {};
  const bodyTypo = typo?.body && typeof typo.body === "object" ? typo.body : {};

  const backgroundImage =
    (bg?.recommendedImageUrl && String(bg.recommendedImageUrl).trim()) ||
    (Array.isArray(bg?.imageUrls) && bg.imageUrls[0] ? String(bg.imageUrls[0]).trim() : "") ||
    null;
  const backgroundColor =
    (bg?.backgroundColor && String(bg.backgroundColor).trim()) ||
    (bg?.backdrop?.backgroundColor && String(bg.backdrop.backgroundColor).trim()) ||
    null;

  /** @type {string[]} */
  const fontUrls = [];
  for (const key of ["font_face_urls", "google_fonts_urls", "font_stylesheet_urls"]) {
    const arr = typo?.[key];
    if (Array.isArray(arr)) {
      for (const u of arr) {
        if (typeof u === "string" && /^https?:\/\//i.test(u.trim())) {
          fontUrls.push(u.trim());
        }
      }
    }
  }

  return {
    heroFound: Boolean(hero?.found),
    heroStrategy: hero?.strategy ? String(hero.strategy) : null,
    preheading: String(text.preheading || "").trim() || null,
    heading: heading || null,
    subtitle: String(text.subtitle || "").trim() || null,
    description: description ? description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : null,
    ctas: ctas.slice(0, 3).map((c) => ({
      label: c?.label ? String(c.label) : null,
      href: c?.href ? String(c.href) : null,
      style: c?.cta_style ? String(c.cta_style) : null,
    })),
    background: {
      color: backgroundColor,
      imageUrl: backgroundImage,
    },
    typography: {
      headingFont:
        firstFontFamilyName(String(h1.fontFamily || "")) ||
        firstFontFamilyName(String(typo?.fonts?.headings || "")) ||
        null,
      bodyFont:
        firstFontFamilyName(String(bodyTypo.fontFamily || "")) ||
        firstFontFamilyName(String(typo?.fonts?.body || "")) ||
        null,
      h1Size: h1.fontSize ? String(h1.fontSize) : null,
      bodySize: bodyTypo.fontSize ? String(bodyTypo.fontSize) : null,
      fontUrlCount: fontUrls.length,
      fontUrls: fontUrls.slice(0, 8),
    },
  };
}

module.exports = {
  buildExtractUploadManifest,
};
