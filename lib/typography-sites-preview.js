/**
 * Batch typography themes: per-site preview templates + header CSS switching.
 */

const fs = require("fs");
const path = require("path");

const TYPOGRAPHY_HEADER_MARKER = "{# ditto-client-typography-css #}";
/**
 * @param {string} websiteUrl
 */
function friendlyHost(websiteUrl) {
  try {
    return new URL(String(websiteUrl || "").trim()).hostname.replace(/^www\./i, "");
  } catch {
    return String(websiteUrl || "site").trim() || "site";
  }
}

/**
 * @param {{ slug: string, is_primary?: boolean }} site
 */
function previewTemplateFilename(site) {
  return site.is_primary ? "preview.html" : `preview-${site.slug}.html`;
}

/**
 * HubL block: load per-site CSS by template name or ?typography_site=slug on preview.html.
 *
 * @param {Array<{ slug: string, css_file?: string|null, is_primary?: boolean }>} manifestSites
 * @returns {string|null}
 */
function buildBatchTypographyHeaderBlock(manifestSites) {
  const withCss = (manifestSites || []).filter((s) => s.css_file && s.slug);
  if (withCss.length < 2) {
    return null;
  }
  const lines = [`\n\t\t${TYPOGRAPHY_HEADER_MARKER}`];
  let opened = false;
  for (const s of withCss) {
    if (s.is_primary) {
      continue;
    }
    const tpl = previewTemplateFilename(s);
    const cssName = String(s.css_file).replace(/^css\//, "");
    const slug = String(s.slug).replace(/'/g, "");
    const cond = `'${tpl}' in content.template_path or '${slug}' in content.template_path or request.query_dict.typography_site|lower == '${slug}' or request.query_dict.site|lower == '${slug}'`;
    if (!opened) {
      lines.push(`\t\t{% if ${cond} %}`);
      opened = true;
    } else {
      lines.push(`\t\t{% elif ${cond} %}`);
    }
    lines.push(`\t\t{{ require_css(get_asset_url("../css/${cssName}")) }}`);
  }
  const primarySite = withCss.find((s) => s.is_primary) || withCss[0];
  const primaryCssName = primarySite?.css_file
    ? String(primarySite.css_file).replace(/^css\//, "")
    : "client-typography.css";
  lines.push(
    opened
      ? `\t\t{% else %}\n\t\t{{ require_css(get_asset_url("../css/${primaryCssName}")) }}\n\t\t{% endif %}\n`
      : `\n\t\t{{ require_css(get_asset_url("../css/${primaryCssName}")) }}\n`,
  );
  return lines.join("\n");
}

/**
 * @param {string} themeRoot
 * @param {Array<{ slug: string, css_file?: string|null, is_primary?: boolean }>} manifestSites
 */
function patchHeaderForBatchTypographySites(themeRoot, manifestSites) {
  const block = buildBatchTypographyHeaderBlock(manifestSites);
  if (!block) {
    return { patched: false };
  }
  const fp = path.join(themeRoot, "templates", "header.html");
  if (!fs.existsSync(fp)) {
    return { patched: false, error: "header.html missing" };
  }
  let h = fs.readFileSync(fp, "utf8");
  const markerPos = h.indexOf(TYPOGRAPHY_HEADER_MARKER);
  if (markerPos >= 0) {
    const afterMarker = h.slice(markerPos);
    const endOfBlock = afterMarker.search(/\n\t\t(?:\{\{|{%|<\/head)/i);
    const cut =
      endOfBlock > 0 ? markerPos + endOfBlock : markerPos + afterMarker.length;
    h = h.slice(0, markerPos) + block.trimEnd() + h.slice(cut);
  } else {
    const m = h.match(/\s*<\/head\s*>/i);
    if (m && m.index != null) {
      h = `${h.slice(0, m.index)}${block}${h.slice(m.index)}`;
    } else {
      h += block;
    }
  }
  fs.writeFileSync(fp, h, "utf8");
  return { patched: true };
}

/**
 * @param {Array<{ website_url: string, slug: string, is_primary?: boolean }>} manifestSites
 */
function buildPreviewSiteLinks(manifestSites) {
  return (manifestSites || []).map((s) => {
    const tpl = previewTemplateFilename(s);
    return {
      website_url: s.website_url,
      slug: s.slug,
      is_primary: Boolean(s.is_primary),
      preview_template: tpl,
      design_manager_path: `templates/${tpl}`,
      typography_site_query: `typography_site=${encodeURIComponent(s.slug)}`,
    };
  });
}

/**
 * @param {string} themeRoot
 * @param {Array<Record<string, unknown>>} manifestSites
 * @param {string[]} extraPreviewTemplates
 */
function augmentTypographySitesManifest(themeRoot, manifestSites, extraPreviewTemplates) {
  const dir = path.join(themeRoot, "typography-sites");
  const fp = path.join(dir, "sites.json");
  if (!fs.existsSync(fp)) {
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch {
    return;
  }
  const bySlug = new Map(
    (manifestSites || []).map((s) => [String(s.slug), s]),
  );
  manifest.version = manifest.version || 1;
  manifest.note =
    "One SR Hero module. Primary: templates/preview.html + css/client-typography.css. Other sites: templates/preview-{slug}.html + css/client-typography-{slug}.css. On preview.html you can also use ?typography_site={slug}.";
  manifest.preview_templates = extraPreviewTemplates || [];
  if (Array.isArray(manifest.sites)) {
    manifest.sites = manifest.sites.map((/** @type {Record<string, unknown>} */ row) => {
      const slug = String(row.slug || "");
      const meta = bySlug.get(slug);
      const isPrimary = Boolean(row.is_primary || meta?.is_primary);
      return {
        ...row,
        is_primary: isPrimary,
        preview_template: previewTemplateFilename({
          slug,
          is_primary: isPrimary,
        }),
        typography_site_query: `typography_site=${encodeURIComponent(slug)}`,
      };
    });
  }
  fs.writeFileSync(fp, JSON.stringify(manifest, null, 2), "utf8");
}

module.exports = {
  TYPOGRAPHY_HEADER_MARKER,
  friendlyHost,
  previewTemplateFilename,
  buildBatchTypographyHeaderBlock,
  patchHeaderForBatchTypographySites,
  buildPreviewSiteLinks,
  augmentTypographySitesManifest,
};
