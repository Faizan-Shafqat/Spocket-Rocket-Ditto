/**
 * Map Ditto / Playwright typography into SR preview portal theme-settings partials.
 */

/**
 * @param {string} raw
 */
function normalizeHexColor(raw) {
  const s = String(raw || "").trim();
  if (!s) {
    return null;
  }
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    const h = s.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(s)) {
    return s.toLowerCase();
  }
  return null;
}

/**
 * @param {string} stack
 */
function firstFontFamilyName(stack) {
  const str = String(stack || "").trim();
  const m = str.match(/"([^"]+)"/);
  if (m) {
    return m[1].trim();
  }
  const part = str.split(",")[0].trim();
  return part.replace(/^['"]+|['"]+$/g, "") || null;
}

/**
 * @param {string|null|undefined} name
 */
function googleFontField(name) {
  const font = String(name || "").trim();
  if (!font) {
    return null;
  }
  return {
    font_set: "GOOGLE",
    font,
    variant: "regular",
    fallback: "sans-serif",
    styles: {},
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} typography
 * @param {Record<string, unknown>|null|undefined} [hero]
 * @param {{ includeTypography?: boolean }} [opts]
 * @returns {Record<string, unknown>|null}
 */
function buildPreviewThemeSettingsPartial(typography, hero, opts = {}) {
  const includeTypography = opts.includeTypography !== false;
  if (!typography || typeof typography !== "object") {
    return null;
  }

  const t = /** @type {Record<string, unknown>} */ (typography);
  const heads =
    t.headings && typeof t.headings === "object"
      ? /** @type {Record<string, unknown>} */ (t.headings)
      : {};
  const h1 =
    heads.h1 && typeof heads.h1 === "object"
      ? /** @type {Record<string, unknown>} */ (heads.h1)
      : {};
  const body =
    t.body && typeof t.body === "object" ? /** @type {Record<string, unknown>} */ (t.body) : {};
  const fonts =
    t.fonts && typeof t.fonts === "object" ? /** @type {Record<string, unknown>} */ (t.fonts) : {};
  const colors =
    t.colors && typeof t.colors === "object"
      ? /** @type {Record<string, unknown>} */ (t.colors)
      : {};

  const headingName =
    firstFontFamilyName(String(h1.fontFamily || fonts.headings || "")) ||
    firstFontFamilyName(String(fonts.headings || ""));
  const bodyName =
    firstFontFamilyName(String(body.fontFamily || fonts.body || "")) ||
    firstFontFamilyName(String(fonts.body || ""));

  let primaryHex =
    normalizeHexColor(String(colors.primary || "")) ||
    normalizeHexColor(String(colors.accent || ""));

  if (!primaryHex && hero && typeof hero === "object") {
    const bg = hero.background;
    if (bg && typeof bg === "object") {
      const bgHex = normalizeHexColor(String(bg.backgroundColor || bg.backdrop?.backgroundColor || ""));
      if (bgHex) {
        const raw = bgHex.slice(1);
        const r = parseInt(raw.slice(0, 2), 16);
        const g = parseInt(raw.slice(2, 4), 16);
        const b = parseInt(raw.slice(4, 6), 16);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (lum <= 0.72) {
          primaryHex = bgHex;
        }
      }
    }
  }

  if (!primaryHex) {
    const textColors = Array.isArray(colors.text) ? colors.text : [];
    for (const c of textColors) {
      const hex = normalizeHexColor(String(c || ""));
      if (hex && hex !== "#ffffff") {
        primaryHex = hex;
        break;
      }
    }
  }

  /** @type {Record<string, unknown>} */
  const partial = {};
  if (includeTypography) {
    partial.typography = {};
  }
  const typoPartial =
    includeTypography && partial.typography && typeof partial.typography === "object"
      ? /** @type {Record<string, unknown>} */ (partial.typography)
      : null;

  const bodyFont = includeTypography ? googleFontField(bodyName) : null;
  if (bodyFont && typoPartial) {
    typoPartial.primary_font = {
      ...bodyFont,
      size: Number(body.fontSize) > 0 ? Number(body.fontSize) : 16,
    };
  }

  const h1Font = includeTypography ? googleFontField(headingName) : null;
  if (h1Font && typoPartial) {
    typoPartial.h1 = {
      h1_font: {
        ...h1Font,
        variant: String(h1.fontWeight || "600"),
      },
      ...(Number(h1.fontSize) > 0 ? { h1_font_size: Math.round(Number(h1.fontSize)) } : {}),
    };
  }

  if (primaryHex) {
    partial.colors = {
      primary: { color: primaryHex, opacity: 100 },
    };
  }

  const hasTypo = typoPartial != null && Object.keys(typoPartial).length > 0;
  const hasColors = partial.colors != null;
  if (!hasTypo && !hasColors) {
    return null;
  }
  if (!hasTypo && partial.typography != null) {
    delete partial.typography;
  }
  return partial;
}

module.exports = {
  buildPreviewThemeSettingsPartial,
  normalizeHexColor,
  firstFontFamilyName,
};
