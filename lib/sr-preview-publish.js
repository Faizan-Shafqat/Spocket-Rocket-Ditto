/**
 * Publish a baked slim theme workdir to the SR preview portal.
 */

const fs = require("fs");
const path = require("path");

const { siteSlugFromUrl } = require("./typography-sites-bundle");
const { buildPreviewThemeSettingsPartial } = require("./sr-preview-theme-settings");
const { buildExtractUploadManifest } = require("./sr-preview-extract-manifest");
const { applyExtractedHeroToModuleFieldsJson } = require("./sr-preview-hero-fields");
const {
  rewriteModuleHtmlForBradRenderer,
  writeBradHomeTemplateFile,
  buildBradClientModulePath,
} = require("./sr-preview-brad-home-template");
const {
  bakeExtractedHeroIntoModuleHtmlForBrad,
  expandTypographyCssForBradModuleScope,
  ensureHeroCoverInClientTypographyCss,
} = require("./sr-preview-brad-module-bake");
const {
  sanitizePreviewSlug,
  previewOnboard,
  previewPatchThemeSettings,
  previewPublishModuleFromDir,
  previewPublishTemplateFile,
  previewPublishThemeOverrides,
  previewPublishToken,
  previewApiBaseUrl,
  previewHealthCheck,
} = require("./sr-preview-api-client");

const DEFAULT_MODULE_FOLDER = "SR Hero 01.module";
const DEFAULT_MODULE_LABEL = "SR Hero 01";
const DEFAULT_TEMPLATE_NAME = "home";

/** Brad /m/ preview works for legacy projects only until module registry fix ships. */
const BRAD_KNOWN_GOOD_CLIENT =
  String(process.env.SR_PREVIEW_KNOWN_GOOD_CLIENT || "smuves-com").trim() || "smuves-com";
const BRAD_KNOWN_GOOD_PROJECT =
  String(process.env.SR_PREVIEW_KNOWN_GOOD_PROJECT || "site-mpvb2qjx").trim() || "site-mpvb2qjx";

const BRAD_HS_STATIC_PROBE_PATHS = [
  "/hs/hsstatic/HubspotToolsMenu/static-1.640/js/index.js",
  "/hs/hsstatic/cos-i18n/static-1.53/bundles/project.js",
];

/**
 * Brad serves gzip Content-Encoding with invalid bodies — browser shows blank /m/ pages.
 */
async function verifyBradHubspotStaticAssets() {
  const base = previewApiBaseUrl();
  /** @type {{ path: string, ok: boolean, status: number, encoding: string|null, reason?: string }[]} */
  const probes = [];
  for (const rel of BRAD_HS_STATIC_PROBE_PATHS) {
    const url = `${base}${rel}`;
    try {
      const res = await fetch(url, {
        headers: { "Accept-Encoding": "gzip, deflate, br" },
      });
      let decodeOk = true;
      try {
        await res.arrayBuffer();
      } catch (e) {
        decodeOk = false;
      }
      probes.push({
        path: rel,
        ok: res.ok && decodeOk,
        status: res.status,
        encoding: res.headers.get("content-encoding"),
        reason: decodeOk ? undefined : "content_decoding_failed",
      });
    } catch (e) {
      probes.push({
        path: rel,
        ok: false,
        status: 0,
        encoding: null,
        reason: e.message || String(e),
      });
    }
  }
  const broken = probes.some((p) => !p.ok);
  return { broken, probes };
}

/**
 * Heading can exist in HTML but be invisible (text-white on white bg + broken scoped CSS).
 *
 * @param {string} html
 */
function detectBradInvisibleHero(html) {
  const hasHeading = /<h1[^>]*class="[^"]*heading[^"]*"[^>]*>/i.test(html);
  const textWhite = /\bsr-hero-01\b[^"<>]{0,240}\btext-white\b/i.test(html);
  const whiteBg =
    /background-color:\s*#fff(?:fff)?\b/i.test(html) ||
    /background-color:\s*rgba\(\s*255\s*,\s*255\s*,\s*255/i.test(html);
  const scopedHeadingColor = /\.sr-hero-01(?:\.ditto-brad-hero-baked)?\s+h1[^}]*color:\s*#[0-9a-f]{3,8}/i.test(
    html,
  );
  const bradScopeBroken =
    html.includes("ditto-brad-module-typography-scope") &&
    /\.sr-hero-01 h1,\s*\n\.sr-hero-01 h1\.heading \{\s*\n\.sr-hero-01 h3,/i.test(html);
  return Boolean(
    hasHeading &&
      textWhite &&
      whiteBg &&
      (!scopedHeadingColor || bradScopeBroken),
  );
}

/**
 * @param {string} moduleUrl
 * @param {Record<string, unknown>|null|undefined} uploadedExtract
 */
async function verifyBradModuleReflectsExtract(moduleUrl, uploadedExtract) {
  const render = await verifyBradModulePreviewRenders(moduleUrl);
  if (!render.ok) {
    return { ...render, reflectsExtract: false, stale: true };
  }
  const html = await fetch(String(moduleUrl).trim(), { redirect: "follow" }).then((r) => r.text());
  const heading = String(uploadedExtract?.heading || "").trim();
  const needle = heading.length >= 12 ? heading.slice(0, 24) : heading;
  const headingInHtml = Boolean(needle && html.includes(needle));
  const invisibleHero = detectBradInvisibleHero(html);
  const hsStatic = await verifyBradHubspotStaticAssets();
  const reflectsExtract = headingInHtml && !invisibleHero;
  const polluted = html.includes("DITTO SMUVES HEADING TEST");
  return {
    ...render,
    reflectsExtract,
    stale: !reflectsExtract,
    polluted,
    invisibleHero,
    bradHsStaticBroken: hsStatic.broken,
    bradHsStaticProbes: hsStatic.probes,
    browserLikelyBlank: invisibleHero || hsStatic.broken,
    liveHeading: (html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i) || [])[0]
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    expectedHeading: heading || null,
  };
}

/**
 * @param {string} moduleUrl
 */
async function verifyBradModulePreviewRenders(moduleUrl) {
  const url = String(moduleUrl || "").trim();
  if (!url) {
    return { ok: false, reason: "missing_module_url" };
  }
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    if (!res.ok) {
      return { ok: false, reason: `http_${res.status}`, htmlLength: html.length };
    }
    if (html.includes("custom widget definition not found")) {
      return { ok: false, reason: "widget_not_found", htmlLength: html.length };
    }
    if (!html.includes("sr-hero-01")) {
      return { ok: false, reason: "hero_module_missing", htmlLength: html.length };
    }
    return { ok: true, htmlLength: html.length };
  } catch (e) {
    return { ok: false, reason: e.message || String(e) };
  }
}

/**
 * HubSpot bake writes `css/client-typography.css` (fonts, hero cover, buttons).
 * Brad module-only preview (/m/...) does not load preview.html or header — merge CSS into module.css.
 *
 * @param {string} workdir
 * @returns {{ merged: boolean, bytes?: number }}
 */
function mergeClientTypographyCssIntoModule(workdir) {
  const cssPath = path.join(workdir, "css", "client-typography.css");
  const moduleCssPath = path.join(
    workdir,
    "custom-modules",
    DEFAULT_MODULE_FOLDER,
    "module.css",
  );
  if (!fs.existsSync(cssPath) || !fs.existsSync(moduleCssPath)) {
    return { merged: false };
  }
  const extractCss = fs.readFileSync(cssPath, "utf8");
  if (!String(extractCss).trim()) {
    return { merged: false };
  }
  const marker = "/* ditto-client-typography-merged */";
  let existing = fs.readFileSync(moduleCssPath, "utf8");
  const cut = existing.indexOf(marker);
  if (cut >= 0) {
    existing = existing.slice(0, cut);
  }
  const scopedCss = expandTypographyCssForBradModuleScope(extractCss);
  const merged = `${existing.trim()}\n\n${marker}\n${scopedCss}\n`;
  fs.writeFileSync(moduleCssPath, merged, "utf8");
  return { merged: true, bytes: Buffer.byteLength(scopedCss, "utf8") };
}

/**
 * Brad renderer resolves macros from shared templates, not HubSpot DM paths.
 *
 * @param {string} moduleDir
 */
function rewritePublishedModuleHtmlForBrad(moduleDir) {
  const fp = path.join(moduleDir, "module.html");
  if (!fs.existsSync(fp)) {
    return false;
  }
  const raw = fs.readFileSync(fp, "utf8");
  const next = rewriteModuleHtmlForBradRenderer(raw);
  if (next !== raw) {
    fs.writeFileSync(fp, next, "utf8");
    return true;
  }
  return false;
}

/**
 * Write theme-overrides.css for Brad adapters path (typography + hero cover from extract bake).
 *
 * @param {string} workdir
 * @param {string} client
 * @param {string} project
 * @returns {{ written: boolean, cssPath?: string }}
 */
function writeThemeOverridesCssForBrad(workdir, client, project) {
  const cssSrc = path.join(workdir, "css", "client-typography.css");
  if (!fs.existsSync(cssSrc)) {
    return { written: false };
  }
  const css = fs.readFileSync(cssSrc, "utf8");
  if (!String(css).trim()) {
    return { written: false };
  }
  const relDir = path.join(
    workdir,
    ".sr-preview-staging",
    "adapters",
    "clients",
    client,
    project,
  );
  fs.mkdirSync(relDir, { recursive: true });
  const cssPath = path.join(relDir, "theme-overrides.css");
  const scoped = expandTypographyCssForBradModuleScope(css);
  fs.writeFileSync(cssPath, scoped, "utf8");
  return { written: true, cssPath };
}

/**
 * Brad /m/ preview only renders on legacy smuves-com/site-mpvb2qjx until module registry fix.
 * Default: publish there so preview opens; opt in to dedicated slug with sr_preview_allow_dedicated_slug.
 *
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} body
 */
function resolvePreviewClientProject(websiteUrl, body) {
  const b = body && typeof body === "object" ? body : {};
  const requestedClient = sanitizePreviewSlug(
    b.sr_preview_client ||
      b.srPreviewClient ||
      b.preview_client ||
      b.previewClient ||
      siteSlugFromUrl(websiteUrl),
  );
  const siteSlug = sanitizePreviewSlug(siteSlugFromUrl(websiteUrl));
  const requestedProject = sanitizePreviewSlug(
    b.sr_preview_project ||
      b.srPreviewProject ||
      b.preview_project ||
      b.previewProject ||
      `site-${siteSlug}`.slice(0, 48),
  );

  const useDedicated =
    b.sr_preview_allow_dedicated_slug === true ||
    String(process.env.SR_PREVIEW_ALLOW_DEDICATED_SLUGS || "").trim() === "1";
  const useKnownGood =
    !useDedicated ||
    b.sr_preview_use_known_good === true ||
    String(process.env.SR_PREVIEW_USE_KNOWN_GOOD || "").trim() === "1";

  if (useKnownGood) {
    return {
      client: sanitizePreviewSlug(BRAD_KNOWN_GOOD_CLIENT),
      project: sanitizePreviewSlug(BRAD_KNOWN_GOOD_PROJECT),
      requestedClient,
      requestedProject,
      usedKnownGoodTarget: true,
    };
  }

  return {
    client: requestedClient,
    project: requestedProject,
    requestedClient,
    requestedProject,
    usedKnownGoodTarget: false,
  };
}

/**
 * Skip slow Brad steps by default (verify HTML, home template, theme PATCH).
 * Typography/hero live in module.css + baked module.html for /m/ previews.
 *
 * @param {Record<string, unknown>} body
 */
function applySrPreviewFastPublishDefaults(body) {
  const b = body && typeof body === "object" ? { ...body } : {};
  if (process.env.SR_PREVIEW_FAST_PUBLISH === "0") {
    return b;
  }
  if (b.sr_preview_skip_verify !== false) {
    b.sr_preview_skip_verify = true;
  }
  if (b.sr_preview_skip_template !== false) {
    b.sr_preview_skip_template = true;
  }
  if (b.sr_preview_skip_theme_settings !== false) {
    b.sr_preview_skip_theme_settings = true;
  }
  return b;
}

/**
 * @param {{
 *   workdir: string,
 *   websiteUrl: string,
 *   body?: Record<string, unknown>,
 *   typography?: Record<string, unknown>|null,
 *   typographyExtract?: Record<string, unknown>|null,
 *   moduleFolderName?: string,
 *   moduleLabel?: string,
 *   templateName?: string,
 * }} opts
 */
async function publishBakedThemeToSrPreview(opts) {
  if (!previewPublishToken()) {
    return {
      ok: false,
      http_status: 503,
      error: "SR_PREVIEW_PUBLISH_TOKEN missing in .env",
      code: "PREVIEW_TOKEN_MISSING",
    };
  }

  const workdir = opts.workdir;
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const body = opts.body && typeof opts.body === "object" ? opts.body : {};
  const slug = resolvePreviewClientProject(websiteUrl, body);
  const { client, project, requestedClient, requestedProject, usedKnownGoodTarget } = slug;

  const moduleFolder = String(opts.moduleFolderName || DEFAULT_MODULE_FOLDER);
  const moduleLabel = String(opts.moduleLabel || DEFAULT_MODULE_LABEL);
  const templateName = sanitizePreviewSlug(opts.templateName || DEFAULT_TEMPLATE_NAME);

  const moduleDir = path.join(workdir, "custom-modules", moduleFolder);
  const templatePath = path.join(workdir, "templates", "preview.html");

  if (!fs.existsSync(moduleDir)) {
    return {
      ok: false,
      http_status: 400,
      error: `Module folder not found after bake: ${moduleDir}`,
    };
  }

  if (opts.typographyExtract?.hero?.found) {
    ensureHeroCoverInClientTypographyCss(workdir, opts.typographyExtract.hero);
  }
  const cssMerge = mergeClientTypographyCssIntoModule(workdir);
  const moduleHtmlRewritten = rewritePublishedModuleHtmlForBrad(moduleDir);

  let typography = opts.typography;
  if (!typography && opts.typographyExtract?.typography) {
    typography = opts.typographyExtract.typography;
  }
  const hero =
    opts.typographyExtract && typeof opts.typographyExtract === "object"
      ? opts.typographyExtract.hero
      : null;

  const heroFields = applyExtractedHeroToModuleFieldsJson(moduleDir, opts.typographyExtract, body);

  const bradBake = bakeExtractedHeroIntoModuleHtmlForBrad(
    moduleDir,
    opts.typographyExtract,
    body,
  );

  const settingsPartial = buildPreviewThemeSettingsPartial(
    typography && typeof typography === "object" ? typography : null,
    hero && typeof hero === "object" ? hero : null,
    {
      includeTypography: body.sr_preview_apply_theme_fonts !== false,
    },
  );

  const uploadedExtract = buildExtractUploadManifest(
    opts.typographyExtract,
    typography && typeof typography === "object" ? typography : null,
    body,
  );

  const steps = [];
  const stepMs = {};
  const mark = (name) => {
    stepMs[name] = Date.now();
  };
  const since = (name) => (stepMs[name] != null ? Date.now() - stepMs[name] : null);

  mark("onboard");
  const onboard = await previewOnboard(client, project, {
    seed: body.sr_preview_seed === "none" ? "none" : "minimal",
    ...(settingsPartial ? { settings: settingsPartial } : {}),
  });
  steps.push({
    step: "onboard",
    ok: onboard.ok,
    status: onboard.status,
    alreadyExists: Boolean(onboard.alreadyExists),
    durationMs: since("onboard"),
    data: onboard.data,
  });
  console.log("[sr-preview-publish] onboard", since("onboard"), "ms", onboard.status);
  if (!onboard.ok) {
    return {
      ok: false,
      http_status: onboard.status || 502,
      error:
        (onboard.data && (onboard.data.error || onboard.data.message)) ||
        "Preview onboard failed",
      client,
      project,
      steps,
    };
  }

  if (settingsPartial && body.sr_preview_skip_theme_settings !== true) {
    mark("theme-settings");
    const patch = await previewPatchThemeSettings(client, project, settingsPartial);
    steps.push({
      step: "theme-settings",
      ok: patch.ok,
      status: patch.status,
      durationMs: since("theme-settings"),
      settingsPartial,
      data: patch.data,
    });
    console.log("[sr-preview-publish] theme-settings", since("theme-settings"), "ms", patch.status);
    if (!patch.ok) {
      return {
        ok: false,
        http_status: patch.status || 502,
        error:
          (patch.data && (patch.data.error || patch.data.message)) ||
          "Preview theme-settings patch failed",
        client,
        project,
        steps,
      };
    }
  }

  mark("publish-module");
  const mod = await previewPublishModuleFromDir(client, project, moduleLabel, moduleDir);
  steps.push({
    step: "publish-module",
    ok: mod.ok,
    status: mod.status,
    durationMs: since("publish-module"),
    moduleLabel,
    data: mod.data,
  });
  console.log("[sr-preview-publish] publish-module", since("publish-module"), "ms", mod.status);
  if (!mod.ok) {
    return {
      ok: false,
      uploadOk: false,
      http_status: mod.status || 502,
      error:
        (mod.data && (mod.data.error || mod.data.message)) ||
        "Preview module publish failed",
      client,
      project,
      uploadedExtract,
      steps,
    };
  }

  const themeOverridesWrite = writeThemeOverridesCssForBrad(workdir, client, project);
  let themeOverridesPublish = null;
  const tryThemeOverrides =
    body.sr_preview_publish_theme_overrides === true ||
    String(process.env.SR_PREVIEW_PUBLISH_THEME_OVERRIDES || "").trim() === "1";
  if (
    tryThemeOverrides &&
    themeOverridesWrite.written &&
    themeOverridesWrite.cssPath &&
    body.sr_preview_skip_theme_overrides !== true
  ) {
    themeOverridesPublish = await previewPublishThemeOverrides(
      client,
      project,
      themeOverridesWrite.cssPath,
    );
    steps.push({
      step: "publish-theme-overrides",
      ok: Boolean(themeOverridesPublish.ok),
      status: themeOverridesPublish.status,
      skipped: Boolean(themeOverridesPublish.skipped),
      data: themeOverridesPublish.data,
      tried: themeOverridesPublish.tried,
    });
  }

  let templateUrl = null;
  const skipTemplate = body.sr_preview_skip_template === true;
  if (!skipTemplate) {
    const bradHomePath = writeBradHomeTemplateFile(workdir, client, project, {
      useSharedModule: !usedKnownGoodTarget,
    });
    mark("publish-template");
    const tpl = await previewPublishTemplateFile(client, project, templateName, bradHomePath);
    steps.push({
      step: "publish-template",
      ok: tpl.ok,
      status: tpl.status,
      durationMs: since("publish-template"),
      templateName,
      modulePath: buildBradClientModulePath(client, project),
      data: tpl.data,
    });
    console.log("[sr-preview-publish] publish-template", since("publish-template"), "ms", tpl.status);
    if (!tpl.ok) {
      return {
        ok: false,
        uploadOk: false,
        http_status: tpl.status || 502,
        error:
          (tpl.data && (tpl.data.error || tpl.data.message)) ||
          "Preview template publish failed",
        client,
        project,
        uploadedExtract,
        steps,
      };
    }
    templateUrl =
      (tpl.data && (tpl.data.templateUrl || tpl.data.previewUrl)) ||
      `${previewApiBaseUrl()}/t/${client}/${project}/${encodeURIComponent(templateName)}`;
  }

  const moduleUrl =
    (mod.data && (mod.data.moduleUrl || mod.data.previewUrl)) ||
    `${previewApiBaseUrl()}/m/${client}/${project}/${encodeURIComponent(moduleLabel)}`;

  const skipVerify = body.sr_preview_skip_verify === true;
  let modulePreviewCheck = null;
  if (!skipVerify && moduleUrl) {
    mark("verify-preview");
    modulePreviewCheck = await verifyBradModuleReflectsExtract(moduleUrl, uploadedExtract);
    steps.push({
      step: "verify-preview",
      ok: Boolean(modulePreviewCheck?.reflectsExtract),
      durationMs: since("verify-preview"),
      data: modulePreviewCheck,
    });
    console.log("[sr-preview-publish] verify-preview", since("verify-preview"), "ms");
  } else {
    console.log("[sr-preview-publish] verify-preview skipped");
  }
  const previewRenderable = Boolean(modulePreviewCheck?.reflectsExtract);
  const bradBrowserBroken = Boolean(
    modulePreviewCheck?.browserLikelyBlank ||
      modulePreviewCheck?.invisibleHero ||
      modulePreviewCheck?.bradHsStaticBroken,
  );
  const bradPreviewStale =
    !previewRenderable &&
    (Boolean(modulePreviewCheck?.stale) ||
      Boolean(modulePreviewCheck?.polluted) ||
      Boolean(bradBrowserBroken) ||
      modulePreviewCheck == null);
  const uploadOk = true;
  const bradNewSlugBroken =
    !usedKnownGoodTarget &&
    !previewRenderable &&
    Boolean(modulePreviewCheck?.reason === "widget_not_found" || !modulePreviewCheck);

  return {
    ok: uploadOk,
    uploadOk,
    status: previewRenderable ? "PREVIEW_PUBLISHED" : "UPLOADED_PREVIEW_STALE",
    client,
    project,
    requestedClient,
    requestedProject,
    usedKnownGoodTarget,
    website_url: websiteUrl || undefined,
    moduleUrl,
    templateUrl,
    previewUrl: previewRenderable || usedKnownGoodTarget ? moduleUrl : null,
    previewRenderable,
    bradNewSlugBroken,
    bradPreviewNote: bradNewSlugBroken
      ? `Brad cannot render new client/project slugs yet (${requestedClient}/${requestedProject}). API returned 200 but /m/ and /t/ fail with widget_not_found or "Failed to fetch template data". Use HubSpot slim upload for a real preview.`
      : bradBrowserBroken
        ? `Brad /m/ may look blank in the browser even though HTML contains your heading. Common causes: text-white on a light hero background, broken typography CSS scope, or Brad /hs/hsstatic/ gzip errors (ERR_CONTENT_DECODING_FAILED). Use Upload SR Hero 01 (slim) for a working preview.`
        : bradPreviewStale
          ? `Ditto uploaded "${uploadedExtract?.heading || "hero"}" but Brad /m/ still shows "${modulePreviewCheck?.liveHeading || "cached stock/test copy"}". Changing the source website does not fix this — Brad's preview server is not applying new module files.`
          : usedKnownGoodTarget
            ? `Published to Brad shared preview slot (${client}/${project}). Source: ${websiteUrl || "n/a"}.`
            : undefined,
    bradLiveHeading: modulePreviewCheck?.liveHeading || null,
    bradExpectedHeading: uploadedExtract?.heading || null,
    modulePreviewCheck,
    uploadedExtract,
    previewUrlHint: previewRenderable
      ? usedKnownGoodTarget
        ? `Brad module preview (${client}/${project}). Extracted hero copy, background, typography CSS, and fields.json were uploaded. Source: ${websiteUrl || "n/a"}.`
        : "Open moduleUrl — SR Hero 01 with extracted copy, CTAs, and merged typography CSS."
      : bradNewSlugBroken
        ? "Do not open templateUrl on new Brad slugs — it 500s. Use HubSpot slim upload for accurate preview, or republish without dedicated slug (defaults to smuves-com/site-mpvb2qjx)."
        : `Extract uploaded to Brad (${client}/${project}). /m/ may show cached stock content until Brad hot-reloads.`,
    previewWarning: previewRenderable
      ? undefined
      : bradBrowserBroken
        ? `Brad preview is blank/invisible in the browser for light-background heroes like Cal.com (white text on white background, or broken /hs/hsstatic/ JS). Ditto uploaded "${uploadedExtract?.heading || "n/a"}" correctly — use Upload SR Hero 01 (slim) instead.`
        : bradPreviewStale && modulePreviewCheck?.polluted
          ? `Brad /m/ is stuck on old debug test copy ("DITTO SMUVES HEADING TEST 999") — not your extract. Ditto uploaded your hero (${uploadedExtract?.heading || "n/a"}) but Brad's preview server does not hot-reload module files. Use Upload SR Hero 01 (slim) for a real preview.`
          : bradPreviewStale
            ? `Brad /m/ did not show your uploaded heading (${uploadedExtract?.heading || "n/a"}). Live page shows: "${modulePreviewCheck?.liveHeading || "unknown"}". This is a Brad preview cache bug — not a Ditto extract bug.`
            : bradNewSlugBroken
              ? `Brad preview is broken for ${requestedClient}/${requestedProject} (not a Ditto extract issue). Upload API succeeded; renderer cannot load the module.`
              : `Brad /m/ preview did not reflect the latest upload (${modulePreviewCheck?.reason || "unknown"}).`,
    bradBrowserBroken,
    clientTypographyCssMerged: cssMerge.merged,
    themeOverridesWritten: themeOverridesWrite.written,
    themeOverridesPublished: Boolean(themeOverridesPublish?.ok),
    moduleHtmlRewrittenForBrad: moduleHtmlRewritten,
    heroFieldsJsonPatched: heroFields.patched,
    bradModuleHtmlBaked: bradBake.baked,
    bradModuleBakeReason: bradBake.reason,
    bradClientModulePath: buildBradClientModulePath(client, project),
    bradHomeTemplate: !skipTemplate,
    hubspotPreviewHtmlPath: fs.existsSync(templatePath) ? templatePath : null,
    settingsPartial: settingsPartial || null,
    steps,
    docsUrl: `${previewApiBaseUrl()}/api/docs`,
  };
}

module.exports = {
  publishBakedThemeToSrPreview,
  applySrPreviewFastPublishDefaults,
  resolvePreviewClientProject,
  verifyBradModulePreviewRenders,
  verifyBradModuleReflectsExtract,
  verifyBradHubspotStaticAssets,
  detectBradInvisibleHero,
  writeThemeOverridesCssForBrad,
  previewHealthCheck,
  previewPublishToken,
  previewApiBaseUrl,
  DEFAULT_MODULE_LABEL,
  DEFAULT_TEMPLATE_NAME,
  BRAD_KNOWN_GOOD_CLIENT,
  BRAD_KNOWN_GOOD_PROJECT,
};
