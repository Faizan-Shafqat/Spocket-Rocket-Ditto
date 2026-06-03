/**
 * Bake typography-extract hero copy/CTA/background into SR Hero fields.json for Brad /m/ previews.
 */

const fs = require("fs");
const path = require("path");

const { normalizeHexColor } = require("./sr-preview-theme-settings");

/**
 * @param {string} href
 */
function linkFieldFromHref(href) {
  return {
    url: { type: "EXTERNAL", href, content_id: null },
    open_in_new_tab: true,
    no_follow: false,
    sponsored: false,
    user_generated_content: false,
  };
}

/**
 * @param {unknown[]} fields
 * @param {string} name
 */
function findFieldGroup(fields, name) {
  return fields.find((f) => f && typeof f === "object" && f.name === name) || null;
}

/**
 * @param {string} raw
 */
function isStockHeroPlaceholder(raw) {
  const s = String(raw || "").trim();
  if (!s) {
    return false;
  }
  return /^(hero title|hero body|headline|get started|<p>hero body<\/p>)$/i.test(s);
}

/**
 * @param {Record<string, unknown>} hero
 * @param {Record<string, unknown>} body
 */
function resolveHeroHeading(hero, body) {
  const user = String(body.heroHeading || body.hero_heading || "").trim();
  if (user && !isStockHeroPlaceholder(user)) {
    return user;
  }
  const text = hero.text && typeof hero.text === "object" ? hero.text : {};
  const pre = String(text.preheading || "").trim();
  const title = String(text.title || "").trim();
  if (pre && title) {
    const preLower = pre.toLowerCase();
    const titleLower = title.toLowerCase();
    if (titleLower.startsWith(preLower)) {
      return title;
    }
    return `${pre} ${title}`.trim();
  }
  return title || pre || "";
}

/**
 * @param {Record<string, unknown>} hero
 * @param {Record<string, unknown>} body
 */
function resolveHeroDescription(hero, body) {
  const user = String(body.heroDescription || body.hero_description || "").trim();
  if (user && !isStockHeroPlaceholder(user)) {
    return user.startsWith("<") ? user : `<p>${user}</p>`;
  }
  const text = hero.text && typeof hero.text === "object" ? hero.text : {};
  const subtitleHtml = String(text.subtitleHtml || "").trim();
  if (subtitleHtml && subtitleHtml.startsWith("<")) {
    return subtitleHtml;
  }
  const desc = String(
    text.subtitle || text.description || text.body || subtitleHtml || "",
  ).trim();
  if (!desc) {
    return "";
  }
  return desc.startsWith("<") ? desc : `<p>${desc}</p>`;
}

/**
 * @param {unknown[]} children
 * @param {string} name
 */
function findDesignChild(children, name) {
  if (!Array.isArray(children)) {
    return null;
  }
  return children.find((c) => c && typeof c === "object" && c.name === name) || null;
}

/**
 * @param {Record<string, unknown>} designGroup
 * @param {Record<string, unknown>} patch
 */
function patchDesignSettingsDefaults(designGroup, patch) {
  if (!designGroup || typeof designGroup !== "object" || !patch || typeof patch !== "object") {
    return;
  }
  if (designGroup.default && typeof designGroup.default === "object") {
    Object.assign(designGroup.default, patch);
  }
  for (const [key, value] of Object.entries(patch)) {
    const child = findDesignChild(designGroup.children, key);
    if (child && value != null) {
      child.default = value;
    }
  }
}

/**
 * @param {unknown[]} fields
 */
function disableStockParallaxDecoration(fields) {
  const parallaxField = fields.find((f) => f?.name === "parallax");
  if (parallaxField) {
    parallaxField.default = false;
  }
  const parallaxImage = fields.find((f) => f?.name === "parallax_scroll_image");
  if (parallaxImage?.children) {
    const imageChild = findDesignChild(parallaxImage.children, "image");
    if (imageChild?.default && typeof imageChild.default === "object") {
      imageChild.default = { ...imageChild.default, src: "", alt: "" };
    }
  }
  if (parallaxImage?.default && typeof parallaxImage.default === "object") {
    if (parallaxImage.default.image && typeof parallaxImage.default.image === "object") {
      parallaxImage.default.image = { ...parallaxImage.default.image, src: "", alt: "" };
    }
  }
}

/**
 * @param {Record<string, unknown>} designGroup
 * @param {Record<string, unknown>} bg
 * @returns {boolean}
 */
function applyHeroBackgroundToDesignGroup(designGroup, bg) {
  if (!designGroup || !bg || typeof bg !== "object") {
    return false;
  }
  const preferred =
    (bg.recommendedImageUrl && String(bg.recommendedImageUrl).trim()) ||
    (Array.isArray(bg.imageUrls) && bg.imageUrls[0] ? String(bg.imageUrls[0]).trim() : "");
  if (preferred && /^https?:\/\//i.test(preferred)) {
    patchDesignSettingsDefaults(designGroup, {
      background_option: "image",
      background_image: {
        src: preferred,
        background_position: "MIDDLE_CENTER",
        background_size: "cover",
      },
    });
    return true;
  }
  const solid = normalizeHexColor(String(bg.backgroundColor || bg.backdrop?.backgroundColor || ""));
  if (solid) {
    patchDesignSettingsDefaults(designGroup, {
      background_option: "custom",
      background_custom: { color: solid, opacity: 100 },
    });
    if (isLightBackgroundHex(solid)) {
      patchDesignSettingsDefaults(designGroup, { text_color: "dark" });
    }
    return true;
  }
  return false;
}

/**
 * @param {string|null|undefined} hex
 */
function isLightBackgroundHex(hex) {
  const n = normalizeHexColor(String(hex || ""));
  if (!n) {
    return false;
  }
  const raw = n.slice(1);
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72;
}

/**
 * @param {string} moduleDir absolute path to *.module folder
 * @param {Record<string, unknown>|null|undefined} typographyExtract
 * @param {Record<string, unknown>} [body]
 * @returns {{ patched: boolean, fieldsPath?: string }}
 */
function applyExtractedHeroToModuleFieldsJson(moduleDir, typographyExtract, body = {}) {
  if (body.typographySkipHeroModuleSnap === true) {
    return { patched: false };
  }
  const hero = typographyExtract?.hero;
  if (!hero?.found) {
    return { patched: false };
  }

  const fieldsPath = path.join(moduleDir, "fields.json");
  if (!fs.existsSync(fieldsPath)) {
    return { patched: false };
  }

  const fields = JSON.parse(fs.readFileSync(fieldsPath, "utf8"));
  if (!Array.isArray(fields)) {
    return { patched: false };
  }

  let patched = false;
  const headingText = resolveHeroHeading(hero, body);
  const descriptionHtml = resolveHeroDescription(hero, body);

  const headingGroup = findFieldGroup(fields, "heading");
  if (headingGroup && headingText) {
    if (Array.isArray(headingGroup.children)) {
      for (const child of headingGroup.children) {
        if (child?.name === "heading" && typeof child.default === "string") {
          child.default = headingText;
        }
      }
    }
    if (Array.isArray(headingGroup.default) && headingGroup.default[0]) {
      headingGroup.default[0].heading = headingText;
    }
    patched = true;
  }

  const descriptionField = fields.find((f) => f?.name === "description");
  if (descriptionField && descriptionHtml) {
    descriptionField.default = descriptionHtml;
    patched = true;
  }

  const ctas = Array.isArray(hero.ctas) ? hero.ctas : [];
  const ctaGroup = findFieldGroup(fields, "ctas");
  if (ctaGroup && Array.isArray(ctaGroup.default)) {
    for (let i = 0; i < Math.min(ctas.length, ctaGroup.default.length); i++) {
      const cta = ctas[i];
      const slot = ctaGroup.default[i];
      if (!slot || !cta || typeof cta !== "object") {
        continue;
      }
      if (cta.label) {
        slot.button_text = String(cta.label);
        patched = true;
      }
      if (cta.href) {
        slot.link = linkFieldFromHref(String(cta.href).trim());
        patched = true;
      }
      if (cta.cta_style) {
        const style = String(cta.cta_style).replace(/[^a-z0-9_-]/gi, "");
        if (style) {
          slot.cta_style = style;
          patched = true;
        }
      }
      slot.cta_type = "btn";
    }
    if (ctas.length <= 1 && ctaGroup.default[1]) {
      ctaGroup.default.splice(1);
      if (Array.isArray(ctaGroup.occurrence)) {
        ctaGroup.occurrence.default = 1;
      } else if (ctaGroup.occurrence && typeof ctaGroup.occurrence === "object") {
        ctaGroup.occurrence.default = 1;
      }
      patched = true;
    }
  }

  const userBgHex = String(body.heroBackgroundHex || body.backgroundHex || "").trim();
  const designGroup = findFieldGroup(fields, "design_settings");
  if (designGroup) {
    if (userBgHex && normalizeHexColor(userBgHex)) {
      patchDesignSettingsDefaults(designGroup, {
        background_option: "custom",
        background_custom: { color: normalizeHexColor(userBgHex), opacity: 100 },
      });
      patched = true;
    } else if (hero.background && typeof hero.background === "object") {
      if (applyHeroBackgroundToDesignGroup(designGroup, hero.background)) {
        patched = true;
      }
    }
  }

  if (body.sr_preview_disable_parallax !== false) {
    disableStockParallaxDecoration(fields);
    patched = true;
  }

  if (patched) {
    fs.writeFileSync(fieldsPath, JSON.stringify(fields, null, 2), "utf8");
  }
  return { patched, fieldsPath };
}

module.exports = {
  applyExtractedHeroToModuleFieldsJson,
  resolveHeroHeading,
  resolveHeroDescription,
};
