/**
 * Brad preview portal uses a different template layout than HubSpot Design Manager.
 * HubSpot preview.html includes ./header.html — that file does not exist on Brad → /t/.../home fails.
 */

/** Brad page templates resolve modules from the shared hubl-modules tree only. */
const BRAD_SHARED_SR_HERO_PATH = "../../../../hubl-modules/_shared/SR Hero 01.module";

/**
 * Client-scoped module path (matches published module from /api/publish-module).
 *
 * @param {string} client
 * @param {string} project
 */
function buildBradClientModulePath(client, project) {
  const c = String(client || "").trim();
  const p = String(project || "").trim();
  return `../../../../clients/${c}/${p}/SR Hero 01.module`;
}

/**
 * @param {string} client
 * @param {string} project
 * @param {{ useSharedModule?: boolean }} [opts]
 */
function buildBradHomeTemplateHtml(client, project, opts = {}) {
  const c = String(client || "").trim();
  const p = String(project || "").trim();
  const modulePath =
    opts.useSharedModule === true ? BRAD_SHARED_SR_HERO_PATH : buildBradClientModulePath(c, p);
  return `<!--
  templateType: page
  isAvailableForNewContent: false
  label: Ditto SR Hero Preview
-->

{% set client_theme_overrides = '../adapters/clients/${c}/${p}/theme-overrides.css' %}
{% include '../../../header.hubl.html' %}

<body class="body_dnd_area">
  {% module "hero" path="${modulePath}" %}
  {% include '../../../footer-includes.hubl.html' %}
</body>
</html>
`;
}

/**
 * Rewrite HubSpot DM macro import to Brad shared macros path (best-effort).
 *
 * @param {string} html
 */
function rewriteModuleHtmlForBradRenderer(html) {
  return String(html || "")
    .replace(
      /\{%\s*import\s+["']\.\.\/\.\.\/templates\/macros\.html["']\s+as\s+macros\s*%\}/,
      "{% import '../../../../../templates/macros.hubl.html' as macros %}",
    )
    .replace(/\.\.\/\.\.\/templates\/macros\.html/g, "../../../../../templates/macros.hubl.html");
}

/**
 * Write Brad-compatible home template into workdir for multipart publish.
 *
 * @param {string} workdir
 * @param {string} client
 * @param {string} project
 * @returns {string} absolute path to temp home template file
 */
function writeBradHomeTemplateFile(workdir, client, project, opts = {}) {
  const fs = require("fs");
  const path = require("path");
  const outDir = path.join(workdir, ".sr-preview-staging");
  fs.mkdirSync(outDir, { recursive: true });
  const fp = path.join(outDir, "home-brad.html");
  fs.writeFileSync(fp, buildBradHomeTemplateHtml(client, project, opts), "utf8");
  return fp;
}

module.exports = {
  BRAD_SHARED_SR_HERO_PATH,
  buildBradClientModulePath,
  buildBradHomeTemplateHtml,
  rewriteModuleHtmlForBradRenderer,
  writeBradHomeTemplateFile,
};
