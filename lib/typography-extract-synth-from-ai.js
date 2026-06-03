/**
 * Converts Ditto AI responses (`/api/typography-extract-ai`, `/api/theme-inject-plan`)
 * into a minimal `typographyExtract`-shaped envelope so `synthesizeTypographyIntoTheme`
 * can bake `_fonts.css`, `client-typography.css`, and SR Hero preview defaults the same
 * way as Playwright extracts.
 *
 * Typography rules (inject):
 * - When `typography_ai.playwright_typography_full_page` is present (Playwright bundle merge), the synth
 *   uses that object **verbatim** as the extract `typography` payload so `client-typography.css` matches
 *   computed Playwright (sizes, line-height, colors, links, buttons), not only `approximate_scale`.
 * - Else when `typography_ai.typography_site_estimate` is present (OpenAI **Playwright-shaped** site estimate
 *   from HTML + css_signals), the synth uses that object verbatim when it passes the same usability check
 *   (headings/body font stacks, google_fonts_urls, and/or self-hosted `font_face_urls`).
 * - Otherwise (legacy minimal): heading stack `primary_font_family`, else first of `font_face_only_families`;
 *   body stack `body_font_family`, else primary; eyebrow (h3) from second `font_face_only_families` when it differs;
 *   `@import` from `google_fonts_detected`; sizes from `approximate_scale.h1_px` / `body_px`.
 */

"use strict";

const { evaluateAiSnapshotPrototypeFallback } = require("./ditto-extract-trust");

const GOOGLE_CSS2_MAX = 8;

function encodeFamilyForGoogleCss2(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, "+");
}

/**
 * @param {string[]} families
 * @returns {string[]}
 */
function googleFontsCss2UrlsFromFamilies(families) {
  if (!Array.isArray(families) || !families.length) {
    return [];
  }
  const clean = [];
  for (const f of families) {
    const n = String(f || "").trim();
    if (n && !clean.some((x) => x.toLowerCase() === n.toLowerCase())) {
      clean.push(n);
    }
    if (clean.length >= GOOGLE_CSS2_MAX) {
      break;
    }
  }
  if (!clean.length) {
    return [];
  }
  const parts = clean.map(
    (name) => `family=${encodeFamilyForGoogleCss2(name)}:wght@400;500;600;700`,
  );
  return [`https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`];
}

/**
 * @param {string} name
 * @param {"sans"|"mono"} kind
 */
function fontStack(name, kind = "sans") {
  if (!name || typeof name !== "string") {
    return "";
  }
  const q = String(name)
    .trim()
    .replace(/"/g, "");
  if (!q) {
    return "";
  }
  const fb =
    kind === "mono"
      ? ", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      : ", system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  return `"${q}"${fb}`;
}

/**
 * Same heuristics as the legacy minimal builder: enough signal to emit typography CSS.
 * @param {Record<string, unknown>|null|undefined} typography
 */
function hasUsableTypography(typography) {
  if (!typography || typeof typography !== "object") {
    return false;
  }
  const googleUrls = Array.isArray(typography.google_fonts_urls) ? typography.google_fonts_urls : [];
  const hasGoogle = googleUrls.some((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim()));
  const bodyFam =
    typography.body && typeof typography.body === "object" ? typography.body.fontFamily : null;
  const heads =
    typography.headings && typeof typography.headings === "object" ? typography.headings : {};
  const hasHeading = Object.values(heads).some(
    (h) => h && typeof h === "object" && /** @type {Record<string, unknown>} */ (h).fontFamily,
  );
  const ffUrls = Array.isArray(typography.font_face_urls) ? typography.font_face_urls : [];
  const hasFontFace = ffUrls.some((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim()));
  return Boolean(hasGoogle || bodyFam || hasHeading || hasFontFace);
}

/**
 * @param {unknown} v
 * @returns {Record<string, unknown>|null}
 */
function cloneJsonTypography(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    return null;
  }
  try {
    return /** @type {Record<string, unknown>} */ (JSON.parse(JSON.stringify(v)));
  } catch {
    return null;
  }
}

const AI_ESTIMATE_STYLE_KEYS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "color",
  "textDecoration",
  "backgroundColor",
  "borderRadius",
  "borderColor",
  "borderWidth",
];

const NON_PORTABLE_CSS_VALUES = new Set([
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
  "auto",
  "normal",
  "none",
]);

/**
 * Values safe to bake into client-typography.css (Playwright uses real px/rem).
 * @param {unknown} value
 * @param {"size"|"color"|"any"} kind
 */
function isPortableCssValue(value, kind = "any") {
  const s = String(value || "").trim();
  if (!s || NON_PORTABLE_CSS_VALUES.has(s.toLowerCase())) {
    return false;
  }
  if (kind === "size") {
    if (/^[\d.]+(px|rem|em|%|vw|vh|ch)$/i.test(s)) {
      return true;
    }
    return false;
  }
  if (kind === "color") {
    return /^#([0-9a-f]{3,8})$/i.test(s) || /^rgba?\(/i.test(s) || /^hsla?\(/i.test(s);
  }
  return true;
}

function resolveAiFallbackH1Px(typographyAi) {
  const scale =
    typographyAi?.approximate_scale && typeof typographyAi.approximate_scale === "object"
      ? typographyAi.approximate_scale
      : {};
  const n = Number(scale.h1_px);
  if (Number.isFinite(n) && n > 0 && n < 200) {
    return Math.round(n);
  }
  const env = Number(process.env.DITTO_AI_FALLBACK_H1_PX);
  if (Number.isFinite(env) && env > 0) {
    return Math.round(env);
  }
  return 48;
}

function resolveAiFallbackBodyPx(typographyAi) {
  const scale =
    typographyAi?.approximate_scale && typeof typographyAi.approximate_scale === "object"
      ? typographyAi.approximate_scale
      : {};
  const n = Number(scale.body_px);
  if (Number.isFinite(n) && n > 0 && n < 80) {
    return Math.round(n);
  }
  const env = Number(process.env.DITTO_AI_FALLBACK_BODY_PX);
  if (Number.isFinite(env) && env > 0) {
    return Math.round(env);
  }
  return 16;
}

/**
 * AI site estimates often omit px or emit `inherit` — SR Hero then inherits theme display scale (huge).
 * Playwright path skips this because computed px are already on the payload.
 *
 * @param {Record<string, unknown>} typography
 * @param {Record<string, unknown>} typographyAi
 */
function normalizeAiTypographyForBake(typography, typographyAi) {
  if (!typography || typeof typography !== "object") {
    return typography;
  }
  const h1Px = resolveAiFallbackH1Px(typographyAi);
  const bodyPx = resolveAiFallbackBodyPx(typographyAi);

  if (!typography.headings || typeof typography.headings !== "object") {
    typography.headings = {};
  }
  const heads = /** @type {Record<string, Record<string, unknown>>} */ (typography.headings);
  for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    const h = heads[tag];
    if (!h || typeof h !== "object") {
      continue;
    }
    if (!isPortableCssValue(h.fontSize, "size")) {
      delete h.fontSize;
    }
    if (!isPortableCssValue(h.lineHeight, "size")) {
      delete h.lineHeight;
    }
    if (!isPortableCssValue(h.letterSpacing, "size")) {
      delete h.letterSpacing;
    }
    if (!isPortableCssValue(h.color, "color")) {
      delete h.color;
    }
  }
  const h1 = heads.h1 && typeof heads.h1 === "object" ? heads.h1 : null;
  if (h1 && !isPortableCssValue(h1.fontSize, "size")) {
    h1.fontSize = `${h1Px}px`;
    heads.h1 = h1;
  }
  if (!typography.body || typeof typography.body !== "object") {
    typography.body = {};
  }
  const body = /** @type {Record<string, unknown>} */ (typography.body);
  if (!isPortableCssValue(body.fontSize, "size")) {
    body.fontSize = `${bodyPx}px`;
  }
  if (!isPortableCssValue(body.lineHeight, "size")) {
    body.lineHeight = "1.5";
  }
  return typography;
}

/**
 * @param {unknown} block
 */
function pickAiStyleBlock(block) {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    return null;
  }
  /** @type {Record<string, unknown>} */
  const o = {};
  for (const k of AI_ESTIMATE_STYLE_KEYS) {
    const v = /** @type {Record<string, unknown>} */ (block)[k];
    if (v == null) {
      continue;
    }
    const s = String(v).trim().slice(0, 240);
    if (!s) {
      continue;
    }
    if (k === "fontSize" || k === "lineHeight" || k === "letterSpacing") {
      if (!isPortableCssValue(s, "size")) {
        continue;
      }
    }
    if (k === "color" || k === "backgroundColor" || k === "borderColor") {
      if (!isPortableCssValue(s, "color")) {
        continue;
      }
    }
    o[k] = s;
  }
  return Object.keys(o).length ? o : null;
}

/**
 * Caps and normalizes OpenAI `typography_site_estimate` (Playwright-shaped) for safe synth + JSON size.
 * @param {unknown} raw
 * @returns {Record<string, unknown>|null}
 */
function sanitizeAiTypographySiteEstimate(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const r = /** @type {Record<string, unknown>} */ (raw);
  /** @type {Record<string, unknown>} */
  const out = {};

  if (r.fonts && typeof r.fonts === "object" && !Array.isArray(r.fonts)) {
    const f = /** @type {Record<string, unknown>} */ (r.fonts);
    /** @type {Record<string, string>} */
    const fonts = {};
    for (const k of ["headings", "body"]) {
      if (f[k] != null && String(f[k]).trim()) {
        fonts[k] = String(f[k]).trim().slice(0, 400);
      }
    }
    if (Object.keys(fonts).length) {
      out.fonts = fonts;
    }
  }

  const hin = r.headings && typeof r.headings === "object" && !Array.isArray(r.headings) ? r.headings : {};
  /** @type {Record<string, Record<string, unknown>>} */
  const headings = {};
  for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    const sub = pickAiStyleBlock(hin[tag]);
    if (sub) {
      headings[tag] = sub;
    }
  }
  if (Object.keys(headings).length) {
    out.headings = headings;
  }

  const body = pickAiStyleBlock(r.body);
  if (body) {
    out.body = body;
  }
  const links = pickAiStyleBlock(r.links);
  if (links) {
    out.links = links;
  }
  const buttons = pickAiStyleBlock(r.buttons);
  if (buttons) {
    out.buttons = buttons;
  }
  const bs = pickAiStyleBlock(r.buttons_secondary);
  if (bs) {
    out.buttons_secondary = bs;
  }

  if (r.colors && typeof r.colors === "object" && !Array.isArray(r.colors)) {
    const c = /** @type {Record<string, unknown>} */ (r.colors);
    const capArr = (a) =>
      Array.isArray(a)
        ? a.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 20)
        : [];
    const text = capArr(c.text);
    const background = capArr(c.background);
    const primary = c.primary != null ? String(c.primary).trim().slice(0, 32) : "";
    if (text.length || background.length || primary) {
      out.colors = {};
      if (text.length) {
        out.colors.text = text;
      }
      if (background.length) {
        out.colors.background = background;
      }
      if (primary) {
        out.colors.primary = primary;
      }
    }
  }

  const capUrlArr = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((x) => String(x || "").trim())
          .filter((u) => /^https?:\/\//i.test(u))
          .slice(0, 24)
      : [];
  const gfu = capUrlArr(r.google_fonts_urls);
  if (gfu.length) {
    out.google_fonts_urls = gfu;
  }
  const ffu = capUrlArr(r.font_face_urls);
  if (ffu.length) {
    out.font_face_urls = ffu;
  }
  const fsu = capUrlArr(r.font_stylesheet_urls);
  if (fsu.length) {
    out.font_stylesheet_urls = fsu;
  }

  if (!hasUsableTypography(out)) {
    return null;
  }
  out._ditto_source = "openai_typography_site_estimate";
  return out;
}

/**
 * Post-process OpenAI typography json: keep `typography_site_estimate` only when sanitized usable.
 * @param {Record<string, unknown>|null} ai
 * @returns {Record<string, unknown>|null}
 */
function enrichTypographyAiFromOpenAiResponse(ai) {
  if (!ai || typeof ai !== "object" || ai.error) {
    return ai;
  }
  const est = ai.typography_site_estimate;
  if (est && typeof est === "object") {
    const clean = sanitizeAiTypographySiteEstimate(est);
    if (clean) {
      ai.typography_site_estimate = clean;
    } else {
      delete ai.typography_site_estimate;
    }
  }
  return ai;
}

/**
 * @param {Record<string, unknown>} typographyAi
 * @returns {Record<string, unknown>|null} null → skip typography CSS (hero-only inject)
 */
function buildTypographyObject(typographyAi) {
  const tai =
    typographyAi && typeof typographyAi === "object" && !typographyAi.error ? typographyAi : {};

  const pwFp = tai.playwright_typography_full_page;
  if (pwFp && typeof pwFp === "object" && !Array.isArray(pwFp)) {
    const exact = cloneJsonTypography(pwFp);
    if (exact && hasUsableTypography(exact)) {
      return exact;
    }
  }

  const aiEst = tai.typography_site_estimate;
  if (aiEst && typeof aiEst === "object" && !Array.isArray(aiEst)) {
    const est = cloneJsonTypography(aiEst);
    if (est && hasUsableTypography(est)) {
      return normalizeAiTypographyForBake(est, tai);
    }
  }

  const faceOnly = Array.isArray(tai.font_face_only_families)
    ? tai.font_face_only_families.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  const primaryRaw = tai.primary_font_family ? String(tai.primary_font_family).trim() : "";
  const bodyRaw = tai.body_font_family ? String(tai.body_font_family).trim() : "";
  const primary = primaryRaw || faceOnly[0] || "";
  const bodyFam = bodyRaw || primaryRaw || faceOnly[0] || "";
  const accent =
    faceOnly.find(
      (f) =>
        f &&
        (!primary || f.toLowerCase() !== String(primary).toLowerCase()),
    ) || "";

  const scale =
    tai.approximate_scale && typeof tai.approximate_scale === "object"
      ? tai.approximate_scale
      : {};
  const h1Px = scale.h1_px != null && scale.h1_px !== "" ? Number(scale.h1_px) : NaN;
  const bodyPx = scale.body_px != null && scale.body_px !== "" ? Number(scale.body_px) : NaN;

  const googleUrls = googleFontsCss2UrlsFromFamilies(
    Array.isArray(tai.google_fonts_detected) ? tai.google_fonts_detected : [],
  );

  const bodyStack = bodyFam ? fontStack(bodyFam, "sans") : "";
  const headStack = primary ? fontStack(primary, "sans") : bodyStack;

  /** @type {Record<string, unknown>} */
  const typography = {
    google_fonts_urls: googleUrls,
    body: {},
    headings: {},
    fonts: {},
  };

  if (bodyStack) {
    typography.body.fontFamily = bodyStack;
    typography.fonts.body = bodyStack;
  }
  if (headStack) {
    typography.headings.h1 = { fontFamily: headStack };
    typography.headings.h2 = { fontFamily: headStack };
    typography.fonts.headings = headStack;
  }
  if (accent) {
    typography.headings.h3 = { fontFamily: fontStack(accent, "mono") };
  }
  if (Number.isFinite(h1Px) && h1Px > 0) {
    typography.headings.h1 = { ...typography.headings.h1, fontSize: `${h1Px}px` };
  } else if (headStack) {
    typography.headings.h1 = {
      ...typography.headings.h1,
      fontSize: `${resolveAiFallbackH1Px(tai)}px`,
    };
  }
  if (Number.isFinite(bodyPx) && bodyPx > 0) {
    typography.body.fontSize = `${bodyPx}px`;
  } else if (bodyStack) {
    typography.body.fontSize = `${resolveAiFallbackBodyPx(tai)}px`;
    typography.body.lineHeight = "1.5";
  }

  return hasUsableTypography(typography) ? typography : null;
}

/**
 * @param {Record<string, unknown>|null} heroAi
 * @param {string} [baseUrl] resolve relative image URLs
 */
function buildHeroFromAi(heroAi, baseUrl) {
  if (!heroAi || typeof heroAi !== "object" || heroAi.error || !heroAi.found) {
    return { found: false };
  }
  const text = heroAi.text && typeof heroAi.text === "object" ? heroAi.text : {};
  const bg = heroAi.background && typeof heroAi.background === "object" ? heroAi.background : {};
  const rawList = Array.isArray(bg.image_url_candidates)
    ? bg.image_url_candidates.map((u) => String(u || "").trim()).filter(Boolean)
    : [];
  const urls = [];
  const seen = new Set();
  for (const raw of rawList) {
    let abs = raw;
    if (!/^https?:\/\//i.test(raw) && baseUrl) {
      try {
        abs = new URL(raw, baseUrl).href;
      } catch {
        abs = raw;
      }
    }
    if (/^https?:\/\//i.test(abs) && !seen.has(abs)) {
      seen.add(abs);
      urls.push(abs);
    }
  }
  const hexes = Array.isArray(bg.color_hex_candidates) ? bg.color_hex_candidates : [];
  const firstHex = hexes.length ? String(hexes[0] || "").trim() : "";

  return {
    found: true,
    text: {
      title: String(text.title || "").trim(),
      preheading: String(text.preheading || "").trim(),
      subtitle: String(text.subtitle || "").trim(),
      subtitleRole: String(text.subtitleRole || "p").trim() || "p",
      subtitleHtml: text.subtitleHtml != null ? String(text.subtitleHtml) : "",
    },
    layout: heroAi.layout && typeof heroAi.layout === "object" ? { ...heroAi.layout } : {},
    ctas: Array.isArray(heroAi.ctas) ? heroAi.ctas : [],
    background: {
      type: bg.type != null ? String(bg.type) : "none",
      recommendedImageUrl: urls[0] || "",
      imageUrls: urls,
      backgroundColor: firstHex,
    },
  };
}

/**
 * @param {Record<string, unknown>} snapshot API json (typography-extract-ai or theme-inject-plan)
 */
function buildTypographyExtractEnvelopeFromAiSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error("ai_typography_snapshot must be a non-null object.");
  }
  const website_url = String(snapshot.website_url || snapshot.websiteUrl || "").trim();
  const typography_ai = snapshot.typography_ai;
  if (!typography_ai || typeof typography_ai !== "object" || typography_ai.error) {
    throw new Error(
      "Snapshot must include typography_ai (object, no error). Run the purple or teal AI button first.",
    );
  }

  const hero_ai = snapshot.hero_ai != null ? snapshot.hero_ai : null;
  const hero = buildHeroFromAi(/** @type {Record<string, unknown>} */ (hero_ai), website_url);

  const typography = buildTypographyObject(
    /** @type {Record<string, unknown>} */ (typography_ai),
  );

  if (!typography && !hero.found) {
    throw new Error(
      "AI snapshot has no usable typography (fonts unset / no google_fonts_detected) and no usable hero_ai. Re-run AI extract or use Playwright extract.",
    );
  }

  const ditto_extract_trust = evaluateAiSnapshotPrototypeFallback(
    /** @type {Record<string, unknown>} */ (snapshot),
  );

  return {
    success: true,
    website_url: website_url || undefined,
    source: "ditto_ai_snapshot",
    typography,
    hero,
    ditto_extract_trust,
  };
}

/**
 * When `ai_typography_source` is set, replaces `typographyExtract` + `typography` on the body
 * for that upload (Playwright extract in the same request is ignored for those two keys).
 *
 * @param {Record<string, unknown>} body
 * @returns {Record<string, unknown>}
 */
function mergeBodyWithAiTypographySnapshot(body) {
  const b = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  const src = String(b.ai_typography_source || "").trim();
  if (!src) {
    return b;
  }

  let snap = b.ai_typography_snapshot;
  if (snap == null && typeof b.ai_typography_snapshot_json === "string") {
    try {
      snap = JSON.parse(b.ai_typography_snapshot_json);
    } catch (e) {
      throw new Error(`ai_typography_snapshot_json: invalid JSON (${e.message || e})`);
    }
  }
  if (typeof snap !== "object" || snap === null) {
    throw new Error(
      "When ai_typography_source is set, pass ai_typography_snapshot (object) or ai_typography_snapshot_json (string).",
    );
  }
  if (src !== "typography_extract_ai" && src !== "theme_inject_plan") {
    throw new Error(
      `ai_typography_source must be "typography_extract_ai" or "theme_inject_plan" (got "${src}").`,
    );
  }

  const envelope = buildTypographyExtractEnvelopeFromAiSnapshot(
    /** @type {Record<string, unknown>} */ (snap),
  );

  const out = { ...b };
  delete out.ai_typography_snapshot;
  delete out.ai_typography_snapshot_json;
  delete out.ai_typography_source;

  out.typographyExtract = envelope;
  out.typography = envelope.typography;
  out.dittoSkipUpstreamTypographyFetch = true;
  if (envelope.website_url && !String(out.typographyWebsiteUrl || "").trim()) {
    out.typographyWebsiteUrl = envelope.website_url;
  }
  return out;
}

module.exports = {
  buildTypographyExtractEnvelopeFromAiSnapshot,
  mergeBodyWithAiTypographySnapshot,
  googleFontsCss2UrlsFromFamilies,
  enrichTypographyAiFromOpenAiResponse,
  sanitizeAiTypographySiteEstimate,
};
