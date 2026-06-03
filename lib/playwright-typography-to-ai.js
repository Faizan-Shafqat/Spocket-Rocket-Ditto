/**
 * Maps Playwright typography service JSON (`POST` typography-extract /api/typography)
 * into `typography_ai` + `hero_ai` shapes used by Ditto purple/teal flows — **pixel-exact**
 * for fields present on `typography_full_page` (computed styles), not LLM guesses.
 */

"use strict";

const { sameWebsiteUrl } = require("./typography-website-urls");

/**
 * @param {string} stack e.g. "Montserrat, sans-serif"
 * @returns {string|null}
 */
function firstFontFamilyName(stack) {
  const s = String(stack || "").trim();
  if (!s) {
    return null;
  }
  const part = s.split(",")[0].trim().replace(/^["']|["']$/g, "");
  if (!part) {
    return null;
  }
  // HubSpot marketing sites use a long display subfamily first; theme tooling expects "HubSpot Serif".
  if (/page header human/i.test(part) && /HubSpot Serif/i.test(s)) {
    return "HubSpot Serif";
  }
  return part;
}

/**
 * @param {string} px e.g. "45px"
 * @returns {number|null}
 */
function parseCssPx(px) {
  const m = String(px || "").match(/^([\d.]+)px$/i);
  if (!m) {
    return null;
  }
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {string[]} urls
 * @returns {string[]}
 */
function googleFontFamiliesFromUrls(urls) {
  const out = [];
  const seen = new Set();
  if (!Array.isArray(urls)) {
    return out;
  }
  for (const raw of urls) {
    const u = String(raw || "");
    const re = /family=([^&]+)/gi;
    let m;
    while ((m = re.exec(u)) !== null) {
      const first = decodeURIComponent(m[1].split(":")[0].replace(/\+/g, " "))
        .trim()
        .split(/\s*&\s*/)[0]
        .trim();
      if (first && !seen.has(first.toLowerCase())) {
        seen.add(first.toLowerCase());
        out.push(first);
      }
    }
  }
  return out.slice(0, 12);
}

/**
 * Deep clone JSON-serializable extract fragments (typography objects are plain data).
 * @param {unknown} v
 * @returns {Record<string, unknown>|null}
 */
function cloneJsonObject(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    return null;
  }
  try {
    return /** @type {Record<string, unknown>} */ (JSON.parse(JSON.stringify(v)));
  } catch {
    return null;
  }
}

/**
 * @param {unknown} typography
 */
function envelopeTypographyUsable(typography) {
  if (!typography || typeof typography !== "object") {
    return false;
  }
  const t = /** @type {Record<string, unknown>} */ (typography);
  const body = t.body;
  const heads = t.headings;
  if (body && typeof body === "object" && String(body.fontFamily || "").trim()) {
    return true;
  }
  if (heads && typeof heads === "object") {
    for (const h of Object.values(heads)) {
      if (h && typeof h === "object" && String(/** @type {Record<string, unknown>} */ (h).fontFamily || "").trim()) {
        return true;
      }
    }
  }
  const g = t.google_fonts_urls;
  return Array.isArray(g) && g.some((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim()));
}

/**
 * @param {Record<string, unknown>} pw full Playwright API JSON (or slim AI envelope with `typography`)
 * @returns {boolean}
 */
function isUsablePlaywrightExtract(pw, expectedWebsiteUrl) {
  if (!pw || typeof pw !== "object") {
    return false;
  }
  if (pw.success !== true && pw.ok !== true) {
    return false;
  }
  const url = String(
    pw.requested_website_url ||
      pw.website_url ||
      pw.websiteUrl ||
      "",
  ).trim();
  if (
    expectedWebsiteUrl &&
    url &&
    !sameWebsiteUrl(url, expectedWebsiteUrl)
  ) {
    return false;
  }
  const tf = pw.typography_full_page;
  if (tf && typeof tf === "object") {
    return true;
  }
  return envelopeTypographyUsable(pw.typography);
}

/**
 * @param {Record<string, unknown>} pw
 */
function resolvePlaywrightTypographyBlob(pw) {
  const full = pw.typography_full_page;
  if (full && typeof full === "object" && !Array.isArray(full)) {
    return /** @type {Record<string, unknown>} */ (full);
  }
  const slim = pw.typography;
  if (slim && typeof slim === "object" && !Array.isArray(slim)) {
    return /** @type {Record<string, unknown>} */ (slim);
  }
  return null;
}

/**
 * @param {Record<string, unknown>} pw
 */
function buildTypographyAiFromPlaywright(pw) {
  const tf = /** @type {Record<string, any>} */ (resolvePlaywrightTypographyBlob(pw) || {});
  const tfExact = cloneJsonObject(tf);
  const headings = tf.headings && typeof tf.headings === "object" ? tf.headings : {};
  const h1 = headings.h1 && typeof headings.h1 === "object" ? headings.h1 : {};
  const h2 = headings.h2 && typeof headings.h2 === "object" ? headings.h2 : {};
  const h3 = headings.h3 && typeof headings.h3 === "object" ? headings.h3 : {};
  const body = tf.body && typeof tf.body === "object" ? tf.body : {};
  const fonts = tf.fonts && typeof tf.fonts === "object" ? tf.fonts : {};

  const primaryStack = String(h1.fontFamily || fonts.headings || "").trim();
  const bodyStack = String(body.fontFamily || fonts.body || primaryStack || "").trim();
  const primary = firstFontFamilyName(primaryStack);
  const bodyFam = firstFontFamilyName(bodyStack) || primary;

  const h1Px = parseCssPx(h1.fontSize) || parseCssPx(h2.fontSize) || parseCssPx(h3.fontSize);
  const bodyPx = parseCssPx(body.fontSize);

  const urls = Array.isArray(tf.google_fonts_urls)
    ? tf.google_fonts_urls
    : Array.isArray(pw.typography?.google_fonts_urls)
      ? pw.typography.google_fonts_urls
      : [];
  const google = googleFontFamiliesFromUrls(urls);

  const headingNotes = [
    h1.fontFamily ? `h1 font-family: ${h1.fontFamily}` : null,
    h1.fontSize ? `h1 font-size: ${h1.fontSize}` : null,
    h1.fontWeight ? `h1 font-weight: ${h1.fontWeight}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const bodyNotes = [
    body.fontFamily ? `body font-family: ${body.fontFamily}` : null,
    body.fontSize ? `body font-size: ${body.fontSize}` : null,
    body.fontWeight ? `body font-weight: ${body.fontWeight}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    primary_font_family: primary,
    body_font_family: bodyFam,
    heading_style_notes: headingNotes || "From Playwright typography_full_page (computed styles).",
    body_style_notes: bodyNotes || "From Playwright typography_full_page (computed styles).",
    approximate_scale: {
      h1_px: h1Px,
      body_px: bodyPx,
    },
    google_fonts_detected: google.length ? google : googleFontFamiliesFromUrls(urls),
    font_face_only_families: [],
    /** Pixel-exact mirror of Playwright `typography_full_page` for consumers + theme synth. */
    playwright_typography_full_page:
      pw.typography_full_page && typeof pw.typography_full_page === "object"
        ? tfExact || undefined
        : undefined,
    typography_site_estimate:
      !pw.typography_full_page && tfExact ? tfExact : undefined,
    evidence: {
      primary_font_source: pw.typography_full_page
        ? "playwright_computed_styles: typography_full_page.headings.h1 (or fonts.headings)"
        : "cached_typography_envelope.headings.h1 (or fonts.headings)",
      body_font_source: pw.typography_full_page
        ? "playwright_computed_styles: typography_full_page.body (or fonts.body)"
        : "cached_typography_envelope.body (or fonts.body)",
      ignored_preloads: [],
    },
    confidence: 0.95,
    caveat:
      "Typography mirrors Playwright computed `typography_full_page` (see playwright_typography_full_page). Not inferred from raw HTML.",
    _ditto_source: "playwright_typography_bundle",
  };
}

/**
 * @param {Record<string, unknown>} pw
 */
function buildHeroAiFromPlaywright(pw) {
  const hero = pw.hero;
  if (!hero || typeof hero !== "object" || !hero.found) {
    return null;
  }

  const text = hero.text && typeof hero.text === "object" ? hero.text : {};
  const layout = hero.layout && typeof hero.layout === "object" ? hero.layout : {};
  const bg = hero.background && typeof hero.background === "object" ? hero.background : {};

  const imgs = Array.isArray(bg.imageUrls) ? bg.imageUrls.map((x) => String(x || "").trim()).filter(Boolean) : [];
  const rec = String(bg.recommendedImageUrl || "").trim();
  const imageCandidates = [...(rec ? [rec] : []), ...imgs].filter((u, i, a) => a.indexOf(u) === i);

  const typeRaw = String(bg.type || "unknown").toLowerCase();
  const bgType =
    typeRaw === "image" || typeRaw === "color" || typeRaw === "gradient" || typeRaw === "video"
      ? typeRaw
      : imageCandidates.length
        ? "image"
        : "unknown";

  const hex = String(bg.backgroundColor || "").trim();
  const colorHex = /^#?[0-9a-f]{3,8}$/i.test(hex.replace("#", "")) ? (hex.startsWith("#") ? hex : `#${hex}`) : "";

  const ctas = Array.isArray(hero.ctas)
    ? hero.ctas.map((c) => ({
        label: String(c?.label || "").trim(),
        href: c?.href != null ? String(c.href).trim() : null,
        inferred_style: String(c?.cta_style || c?.inferred_style || "primary"),
      }))
    : [];

  const align = String(layout.textAlign || "unknown").toUpperCase();
  const textAlign =
    align === "LEFT" || align === "CENTER" || align === "RIGHT" ? align : "unknown";

  const title = String(text.title || "").trim() || null;

  return {
    found: true,
    confidence: typeof hero.extractionMeta?.confidence === "number" ? hero.extractionMeta.confidence : 0.85,
    evidence_notes: "Built from Playwright hero extract (computed / layout region), not raw HTML inference.",
    text: {
      title,
      title_tag: String(text.titleTag || text.title_tag || "h1").trim() || "unknown",
      preheading: text.preheading != null && String(text.preheading).trim() ? String(text.preheading).trim() : null,
      subtitle: text.subtitle != null && String(text.subtitle).trim() ? String(text.subtitle).trim() : null,
    },
    layout: { textAlign: textAlign === "unknown" ? "LEFT" : textAlign },
    ctas,
    background: {
      type: bgType,
      color_hex_candidates: colorHex ? [colorHex] : [],
      image_url_candidates: imageCandidates,
    },
    sr_hero_01_mapping_preview: {
      likely_maps: ctas.length > 0 || Boolean(title) || imageCandidates.length > 0,
      confidence: 0.78,
      summary:
        "Mapped from Playwright hero region: background/CTAs/title where present; SR Hero 01 is a reasonable default for a single-column marketing hero.",
      gaps: Array.isArray(hero.extractionMeta?.warnings)
        ? hero.extractionMeta.warnings.map((x) => String(x))
        : [],
      field_hints: {
        textAlign: textAlign === "unknown" ? "LEFT" : textAlign,
        backgroundType: bgType,
        ctaCount: ctas.length,
        notes: "sr_hero_01_mapping_preview is heuristic from Playwright geometry, not a second AI pass.",
      },
    },
    _ditto_source: "playwright_typography_bundle",
  };
}

module.exports = {
  sameWebsiteUrl,
  isUsablePlaywrightExtract,
  buildTypographyAiFromPlaywright,
  buildHeroAiFromPlaywright,
};
