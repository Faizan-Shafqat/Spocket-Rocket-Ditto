require("dotenv").config();

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { buildSlimStaging, removeStagingQuiet } = require("./lib/slim-staging");
const {
  publishBakedThemeToSrPreview,
  applySrPreviewFastPublishDefaults,
  previewPublishToken,
  previewApiBaseUrl,
} = require("./lib/sr-preview-publish");
const { ensureValidThemeBundle } = require("./lib/theme-bundle-ensure");
const {
  maybeCreateDraftPreviewPage,
  resolveCmsPat,
} = require("./lib/hubspot-site-page");
const {
  runHeroMatchPipeline,
  fetchHtmlSnippet,
  extractCssSignalsFromHtml,
  extractTypographyOpenAI,
  extractHeroOpenAI,
  extractIntegratedThemeAssessmentOpenAI,
  mergeGoogleFontScanIntoCssSignals,
  mergeHeroAiWithHtmlBackgroundFallbacks,
  preferOpenAiResponsesApi,
  loadLightragSrHeroContext,
  decideSrHero01Match,
} = require("./lib/hero-match-pipeline");
const {
  isUsablePlaywrightExtract,
  buildTypographyAiFromPlaywright,
  buildHeroAiFromPlaywright,
} = require("./lib/playwright-typography-to-ai");
const { runThemeInjectPlanFromCache, loadLightragTypographyContextForAi } = require("./lib/theme-inject-plan-from-cache");
const { mergeBodyWithAiTypographySnapshot } = require("./lib/typography-extract-synth-from-ai");
const { typographyHasNonPortableHubspotFontVars } = require("./lib/ditto-extract-trust");
const { runTypographyExtractUrlWeb } = require("./lib/typography-extract-url-web");
const { runSrDecisionLightrag } = require("./lib/sr-decision-lightrag");
const {
  findCachedWebsiteTypography,
  hydrateTypographySitesFromCache,
  upsertWebsiteTypographyCache,
  persistTypographyExtractToCache,
  ensureTypographyWebsiteIndex,
  rebuildIndexFromAuditFiles,
  typographyAiHasUsableFonts,
} = require("./lib/typography-website-cache");
const {
  parseTypographyWebsiteUrlsFromBody,
  parseTypographyWebsiteUrlsFromQuery,
} = require("./lib/typography-website-urls");
const { dispatchTypographyExtract } = require("./lib/typography-extract-batch");
const {
  siteRecordForUpload,
  writeTypographySitesBundleToTheme,
} = require("./lib/typography-sites-bundle");
const { sameWebsiteUrl } = require("./lib/typography-website-urls");
const {
  patchHeaderForBatchTypographySites,
  buildPreviewSiteLinks,
  augmentTypographySitesManifest,
  friendlyHost,
} = require("./lib/typography-sites-preview");
const {
  appendHeroCoverCssToClientTypographyFile,
  injectSiteTypographyCssIntoPreviewTemplate,
  stripLegacySharedHeroCoverFromPrimaryCss,
} = require("./lib/typography-hero-cover-css");
const {
  lineIndentAtIndex,
  hubLColorCustomDefault,
  repairMalformedPreviewHeroHubL,
} = require("./lib/preview-hero-hubl");

const TYPO_BATCH_MAX_URLS = Math.min(
  50,
  Math.max(1, parseInt(String(process.env.DITTO_TYPO_BATCH_MAX_URLS || "15"), 10) || 15),
);
const TYPO_BATCH_CONCURRENCY = Math.min(
  5,
  Math.max(1, parseInt(String(process.env.DITTO_TYPO_BATCH_CONCURRENCY || "2"), 10) || 2),
);

function typographyBatchDispatchOpts() {
  return {
    validateOne: validateHttpUrlTypography,
    maxUrls: TYPO_BATCH_MAX_URLS,
    concurrency: TYPO_BATCH_CONCURRENCY,
  };
}
const {
  ingestSourceDir: lightragIngestSourceDir,
  loadVdb: lightragLoadVdb,
  retrieveTopK: lightragRetrieveTopK,
  DEFAULT_EMBED_MODEL: LIGHTRAG_DEFAULT_EMBED_MODEL,
} = require("./lib/embeddings-store");
const lightragClient = require("./lib/lightrag-client");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: process.env.DITTO_JSON_BODY_LIMIT || "2mb" }));

app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.name === "PayloadTooLargeError")) {
    return res.status(413).json({
      ok: false,
      error:
        "Request body too large. SR Preview publish only needs typographyWebsiteUrl — extract is loaded from server cache after Extract Typography.",
    });
  }
  return next(err);
});
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/lightrag-graph",
  express.static(path.join(__dirname, "lightrag-d3-kit", "lightrag-d3-kit")),
);

/**
 * HubSpot private app token for POST /install-theme (same as before: forwarded as userToken).
 * Override with HUBSPOT_INSTALLER_PAT or DEMO_TOKEN in `.env` when you rotate the key.
 */
const DEMO_TOKEN =
  process.env.HUBSPOT_INSTALLER_PAT ||
  process.env.DEMO_TOKEN ||
  "";
const INSTALLER_URL =
  process.env.SPOCKET_INSTALLER_URL ||
  "https://40576602.hubspotpreview-na1.com/_hcms/api/spocket-installer";
const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || "40576602";
/** Base URL only (typography-extract service). Resolved path is `/api/typography`. */
const TYPOGRAPHY_EXTRACT_BASE_URL =
  process.env.TYPOGRAPHY_EXTRACT_BASE_URL || "http://127.0.0.1:8787";
const TYPOGRAPHY_CACHE_DIR = path.join(__dirname, "typography-extract-cache");

/** Set `HUBSPOT_HS_UPLOAD_DEBUG=1` so `hs cms upload` runs with `--debug` (real API error in stderr). */
const HUBSPOT_HS_UPLOAD_DEBUG =
  process.env.HUBSPOT_HS_UPLOAD_DEBUG === "1" ||
  process.env.HUBSPOT_HS_UPLOAD_DEBUG === "true";

function hubspotCmsUploadDebugFlag() {
  return HUBSPOT_HS_UPLOAD_DEBUG ? " --debug" : "";
}

/**
 * Optional AI inject: `ai_typography_source` + `ai_typography_snapshot` merge into the same
 * `typography` / `typographyExtract` fields used by Playwright-powered uploads.
 *
 * @param {Record<string, unknown>|undefined} rawBody
 * @returns {{ body: Record<string, unknown>, aiTypographyInject: Record<string, unknown>|null }}
 */
function resolveThemeUploadBody(rawBody) {
  const body =
    rawBody && typeof rawBody === "object" && !Array.isArray(rawBody) ? rawBody : {};
  const aiSource = String(body.ai_typography_source || "").trim();
  if (!aiSource) {
    const out = { ...body };
    if (out.ditto_disable_sr_hero_prototype_fallback === true) {
      out.ditto_sr_hero_prototype_fallback = false;
      out.ditto_sr_hero_prototype_fallback_reasons = [];
    } else if (out.ditto_force_sr_hero_prototype_fallback === true) {
      out.ditto_sr_hero_prototype_fallback = true;
      out.ditto_sr_hero_prototype_fallback_reasons = ["ditto_force_sr_hero_prototype_fallback"];
    }
    return { body: out, aiTypographyInject: null };
  }
  const merged = mergeBodyWithAiTypographySnapshot(body);
  const te = merged.typographyExtract;
  if (merged.ditto_disable_sr_hero_prototype_fallback === true) {
    merged.ditto_sr_hero_prototype_fallback = false;
    merged.ditto_sr_hero_prototype_fallback_reasons = [];
  } else if (merged.ditto_force_sr_hero_prototype_fallback === true) {
    merged.ditto_sr_hero_prototype_fallback = true;
    merged.ditto_sr_hero_prototype_fallback_reasons = ["ditto_force_sr_hero_prototype_fallback"];
  } else if (te && te.ditto_extract_trust && te.ditto_extract_trust.active) {
    merged.ditto_sr_hero_prototype_fallback = true;
    merged.ditto_sr_hero_prototype_fallback_reasons = te.ditto_extract_trust.reasons || [];
  }
  return {
    body: merged,
    aiTypographyInject: {
      source: aiSource,
      synthetic_envelope: true,
      website_url: merged.typographyExtract?.website_url || merged.typographyWebsiteUrl || null,
      prototype_fallback: Boolean(merged.ditto_sr_hero_prototype_fallback),
    },
  };
}

function hubspotUploadFailureHint() {
  return (
    "The HubSpot CLI often prints only a generic message. Typical causes: expired or missing auth (`hs auth` / account PAT), " +
    "wrong `-a` account, no Design Manager file-upload scope, rate limits, or network/proxy. " +
    "Retry with env **HUBSPOT_HS_UPLOAD_DEBUG=1** (Ditto adds `--debug` to the upload) or run the same `hs cms upload …` command manually with `--debug`."
  );
}

function getTypographyExtractPostUrl() {
  if (process.env.TYPOGRAPHY_EXTRACT_API_URL) {
    return String(process.env.TYPOGRAPHY_EXTRACT_API_URL).trim();
  }
  const base = String(TYPOGRAPHY_EXTRACT_BASE_URL || "").replace(/\/+$/, "");
  return `${base}/api/typography`;
}

/**
 * @param {string} destPath  e.g. `/sr-test`
 * @param {{ label?: string|null, version?: string|null, screenshotOk?: boolean }} themeMeta
 *   From `theme.json` after local validation.
 */
function designManagerFinderFields(destPath, themeMeta = {}) {
  const folder = String(destPath || "")
    .replace(/^\//, "")
    .replace(/\/+$/, "");
  const pathSeg = `/${folder}`;
  const label =
    themeMeta && themeMeta.label != null
      ? String(themeMeta.label).trim()
      : null;
  const version =
    themeMeta && themeMeta.version != null
      ? String(themeMeta.version).trim()
      : null;
  return {
    dest: pathSeg,
    /** Exact one-segment folder in the file tree; same as the CLI target path. */
    themeFolderName: folder,
    /** Paste in Design Manager only — finds the file tree folder. Use the full string (incl. `-t…` token), not a name prefix by itself. */
    searchAssetsQuery: folder,
    /** In Design Manager → Search assets, paste `searchAssetsQuery` exactly. Searching a shortened prefix (without `-t…`) often returns no matches. */
    searchHint:
      "Search using the full folder name in `searchAssetsQuery` / `dest` (it includes a `-t` suffix for uniqueness), not a truncated prefix from the name field.",
    /**
     * When a **page/website flow** asks to pick a *theme* by *name*, HubSpot often shows
     * **label** (from `theme.json`), not always the same string as the folder.
     */
    searchContentForThemeLabel: label || folder,
    themeLabel: label,
    themeVersion: version,
    /** Local pre-upload check: `theme.json` screenshot file existed on disk. */
    themeScreenshotValidated: Boolean(themeMeta.screenshotOk),
    designManagerUrl: `https://app.hubspot.com/design-manager/${HUBSPOT_PORTAL_ID}`,
    /** Portal “home” for this account (user can navigate to content from here). */
    hubAppHomeUrl: `https://app.hubspot.com/website/${HUBSPOT_PORTAL_ID}/`,
    /** Handy entry to create or manage **pages** where a **theme** can be chosen. */
    marketingPagesAndWebsiteUrl: `https://app.hubspot.com/pages/${HUBSPOT_PORTAL_ID}/list`,
    designManagerLegacyUrl: "https://app.hubspot.com/l/design-manager",
    /**
     * Short mental model: files live in Design Manager; the **name** in pickers is often
     * **label** in `theme.json` — not the same as the **folder** name in all UIs.
     */
    websiteVsDesignManager: [
      "**Files** (theme.json, templates, modules) live in **Content → Design Manager** as a **root** folder: " +
        pathSeg +
        " — that is the CLI upload result.",
      "**Picking a theme in the content/website UIs** often uses the **“label”** in theme.json" +
        (label ? ` (“${label}”)` : "") +
        ", not the **folder** name. Use the search in the page/theme or style step with that **label**.",
      "The @hubspot folder in Design Manager is **system** content, not your theme. Your theme is a **sibling** at the **root** of the file tree, not **inside** another theme or **inside** @hubspot.",
    ],
    /** Step-by-step (Design Manager is contextual — follow in order). */
    locateYourTheme: {
      designManager: [
        "Open **Content** → **Design Manager** in portal **" +
          HUBSPOT_PORTAL_ID +
          "**. If you have multiple products, the entry may be under the **content** (globe) menu.",
        "Click **View** → **Deselect all** (or clear the file-tree selection) so the Finder is not “stuck” in a subfolder. Otherwise sibling root folders stay hidden.",
        "Open **Search assets** (magnifier). Paste exactly: **" +
          folder +
          "**. That string matches the path segment the CLI used (dest).",
        "Select the result that lists **" +
          pathSeg +
          "** and open the folder. You should see **theme.json**, **fields.json**, **init.json**, and folders **templates/**, **custom-modules/**.",
        "If search fails, expand the file tree to the **top level** and scan for **" +
          folder +
          "**; HubSpot may truncate long names in the left sidebar, so the search box is the reliable path.",
      ],
      themeInPageOrStylePicker: [
        "In **Marketing** (or **Content**), go to **Landing pages** or **Website** → **Create** (or open an existing page) where you can choose a **Theme** or **Default theme** / **Style**.",
        "In that picker, search for **" +
          (label || "the name shown in your theme’s theme.json label") +
          "**. That is usually the **label** in theme.json" +
          (version ? " (version " + version + " in JSON)" : "") +
          " — and can differ from the **folder** name “" +
          folder +
          "”.",
        "If the theme is new, scroll or use search; some screens label it **Sprocket Rocket** or a custom name from your brand settings.",
      ],
    },
    findInHubSpot:
      "**One-line:** In Design Manager: **View → Deselect all** → **Search assets** → paste **" +
      folder +
      "**. " +
      "For **picking a theme in the page/website app**, use **" +
      (label || "the `label` in theme.json") +
      "** (see `themeLabel` in this response). " +
      "Folder: **" +
      folder +
      "** at file-tree root: **" +
      pathSeg +
      "**; not under **@hubspot**; not inside another custom theme’s folder.",
  };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {object|undefined} body
 * @returns {string}
 */
function resolveTypographyWebsiteUrl(body) {
  const b = body || {};
  const raw =
    b.typographyWebsiteUrl ||
    b.typography_website_url ||
    b.websiteUrl ||
    b.website_url ||
    b.url ||
    "";
  return String(raw || "").trim();
}

/**
 * Sites for `typography-sites/sites.json` + per-site CSS (batch upload).
 * Uses body.typography_sites, else multiple URLs from body, hydrated from server cache.
 *
 * @param {Record<string, unknown>} body
 * @returns {Array<Record<string, unknown>>}
 */
function resolveTypographySitesForUpload(body) {
  const b = body && typeof body === "object" ? body : {};
  /** @type {Array<Record<string, unknown>>} */
  let sites = Array.isArray(b.typography_sites) ? b.typography_sites : [];
  if (sites.length === 0) {
    const parsed = parseTypographyWebsiteUrlsFromBody(b, validateHttpUrlTypography, {
      maxUrls: TYPO_BATCH_MAX_URLS,
    });
    if (parsed.urls.length > 1) {
      sites = parsed.urls.map((u) => ({ website_url: u.websiteUrl }));
    }
  }
  if (sites.length === 0) {
    return [];
  }
  return hydrateTypographySitesFromCache(__dirname, sites);
}

/**
 * @param {string} websiteUrlRaw
 */
function validateHttpUrlTypography(websiteUrlRaw) {
  let websiteUrl = String(websiteUrlRaw || "").trim();
  if (!websiteUrl) {
    return { ok: false, websiteUrl, error: "Empty URL." };
  }
  if (!/^https?:\/\//i.test(websiteUrl)) {
    websiteUrl = `https://${websiteUrl.replace(/^\/+/, "")}`;
  }
  let parsed;
  try {
    parsed = new URL(websiteUrl);
  } catch {
    return { ok: false, websiteUrl, error: "Invalid URL. Use absolute http(s) URL or a domain like example.com." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      websiteUrl,
      error: "URL must start with http:// or https://",
    };
  }
  return { ok: true, websiteUrl: parsed.toString(), parsed };
}

/**
 * POST { website_url, include_hero_screenshot? } to typography-extract service.
 */
async function postTypographyExtractJson(websiteUrlAbs, opts = {}) {
  const startedAt = Date.now();
  const payload = { website_url: websiteUrlAbs };
  if (opts.includeHeroScreenshot) {
    payload.include_hero_screenshot = true;
  }
  const timeoutMs = Number(opts.timeoutMs || process.env.TYPOGRAPHY_EXTRACT_TIMEOUT_MS || 120000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(getTypographyExtractPostUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    const timedOut = e && typeof e === "object" && e.name === "AbortError";
    return {
      ok: false,
      status: timedOut ? 408 : 0,
      data: {
        error: timedOut
          ? `Typography extract timed out after ${timeoutMs}ms`
          : e.message || String(e),
      },
      rawText: "",
      elapsedMs: Date.now() - startedAt,
      timedOut,
    };
  }
  clearTimeout(timer);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return {
    ok: response.ok,
    status: response.status,
    data,
    rawText: text,
    elapsedMs: Date.now() - startedAt,
  };
}

/**
 * SR Hero 01: append hero cover CSS into client-typography.css (primary site).
 */
function appendExtractedHeroCoverImageCss(themeRoot, hero) {
  appendHeroCoverCssToClientTypographyFile(
    themeRoot,
    hero,
    "client-typography.css",
    "primary",
  );
}

/**
 * Batch: per-site hero cover + preview template CSS hook (avoids primary cover bleeding).
 *
 * @param {string} themeRoot
 * @param {Array<Record<string, unknown>>} typographySites
 * @param {string} primaryWebsiteUrl
 */
function applyBatchPerSiteHeroBackgrounds(themeRoot, typographySites, primaryWebsiteUrl) {
  if (!Array.isArray(typographySites) || typographySites.length < 2) {
    return;
  }
  const primaryNorm = String(primaryWebsiteUrl || "").trim();
  for (const raw of typographySites) {
    const rec = siteRecordForUpload(
      raw && typeof raw === "object" ? raw : { website_url: "" },
    );
    if (!rec.website_url || !rec.slug) {
      continue;
    }
    const extract =
      rec.typographyExtract ||
      (raw && typeof raw === "object" ? raw.playwright : null) ||
      null;
    const hero =
      extract && typeof extract === "object" && extract.hero
        ? extract.hero
        : null;
    if (!hero || !hero.found) {
      continue;
    }
    const cssBase = `client-typography-${rec.slug}.css`;
    appendHeroCoverCssToClientTypographyFile(themeRoot, hero, cssBase, rec.slug);
    const isPrimary = Boolean(
      primaryNorm && sameWebsiteUrl(rec.website_url, primaryNorm),
    );
    if (!isPrimary) {
      injectSiteTypographyCssIntoPreviewTemplate(
        themeRoot,
        `preview-${rec.slug}.html`,
        rec.slug,
      );
    }
  }
}

/**
 * @returns {{
 *   typography: object|null,
 *   typographyExtract: object|null,
 *   applied: boolean,
 *   cssWritten: boolean,
 *   fetchedUpstream: boolean,
 *   prototypeFallback: boolean,
 *   prototypeFallbackReasons: string[],
 *   typographySkippedNonPortable: boolean,
 * }}
 */
async function synthesizeTypographyIntoTheme(themeRoot, body) {
  let typographyExtract =
    body.typographyExtract ??
    body.typographyExtractSnapshot ??
    body.typographyExtractFull ??
    null;
  let typography = body.typography;
  if (
    typographyExtract &&
    typeof typographyExtract === "object" &&
    typographyExtract.typography != null &&
    !typography
  ) {
    typography = typographyExtract.typography;
  }

  let fetchedUpstream = false;
  const siteUrlRaw = resolveTypographyWebsiteUrl(body);
  const skipUpstreamTypographyFetch =
    body.dittoSkipUpstreamTypographyFetch === true ||
    (typographyExtract &&
      typeof typographyExtract === "object" &&
      typographyExtract.source === "ditto_ai_snapshot");
  if (
    !skipUpstreamTypographyFetch &&
    (!typography || typeof typography !== "object") &&
    siteUrlRaw
  ) {
    const v = validateHttpUrlTypography(siteUrlRaw);
    if (v.ok) {
      const r = await postTypographyExtractJson(v.websiteUrl, {
        includeHeroScreenshot: Boolean(
          body.includeHeroScreenshot ?? body.include_hero_screenshot,
        ),
      });
      if (r.ok && r.data && typeof r.data === "object" && r.data.typography) {
        typographyExtract = r.data;
        typography = r.data.typography;
        fetchedUpstream = true;
      }
    }
  }

  const prototypeFallback = body.ditto_sr_hero_prototype_fallback === true;
  const prototypeFallbackReasons = Array.isArray(body.ditto_sr_hero_prototype_fallback_reasons)
    ? body.ditto_sr_hero_prototype_fallback_reasons.map((x) => String(x))
    : [];

  if (typographyExtract && typeof typographyExtract === "object") {
    if (!prototypeFallback) {
      maybeApplyExtractedHeroPreviewCopy(themeRoot, body, typographyExtract);
      applyExtractedHeroModuleFieldsFromTypographyApi(themeRoot, typographyExtract, body);
    }
  }

  let applied = false;
  let cssWritten = false;
  const skipNonPortableTypography =
    prototypeFallback &&
    typographyExtract &&
    typeof typographyExtract === "object" &&
    typographyExtract.source === "ditto_ai_snapshot" &&
    typography &&
    typeof typography === "object" &&
    typographyHasNonPortableHubspotFontVars(typography);

  if (typography && typeof typography === "object" && !skipNonPortableTypography) {
    const typographyForCss =
      typographyExtract?.hero?.found && typographyExtract.hero.typography
        ? mergeTypographyWithHeroScope(typography, typographyExtract.hero)
        : typography;
    const css = buildClientTypographyCss(typographyForCss);
    const cssDir = path.join(themeRoot, "css");
    fs.mkdirSync(cssDir, { recursive: true });
    fs.writeFileSync(path.join(cssDir, "client-typography.css"), css, "utf8");
    cssWritten = true;
    ensureHeaderIncludesClientTypography(themeRoot);
    applyExtractedTypographyToPreviewHeroModule(
      themeRoot,
      typographyForCss,
      body,
      typographyExtract?.hero,
      "preview.html",
    );
    const previewFp = path.join(themeRoot, "templates", "preview.html");
    if (fs.existsSync(previewFp)) {
      fs.writeFileSync(
        previewFp,
        repairMalformedPreviewHeroHubL(fs.readFileSync(previewFp, "utf8")),
        "utf8",
      );
    }
    if (body.typographySkipThemeFontsCss !== true) {
      applyExtractedTypographyToThemeFontsCss(themeRoot, typographyForCss);
    }
    applied = true;
  }
  if (typographyExtract?.hero?.found && !prototypeFallback) {
    applyExtractedHeroBackgroundToPreview(themeRoot, typographyExtract.hero, body);
    if (applied) {
      appendExtractedHeroCoverImageCss(themeRoot, typographyExtract.hero);
    }
  }

  return {
    typography: typography || null,
    typographyExtract:
      typographyExtract && typeof typographyExtract === "object"
        ? typographyExtract
        : null,
    applied,
    cssWritten,
    fetchedUpstream,
    prototypeFallback,
    prototypeFallbackReasons: prototypeFallback ? prototypeFallbackReasons : [],
    typographySkippedNonPortable: skipNonPortableTypography,
  };
}

function cssQuoted(s) {
  return `"${String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .trim()}"`;
}

/**
 * Use for `font-family:` values that may list multiple families (`"X", Y, fallback`).
 * {@link cssQuoted} wraps the *entire* string in one pair of quotes and breaks stacks.
 */
function cssFontFamilyValue(s) {
  return String(s || "")
    .replace(/[;{}]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
}

/**
 * SR Hero scopes — must beat theme utilities (e.g. `text-*`) & module-scoped CSS.
 */
const TYPOGRAPHY_SR_HERO = ".body_dnd_area .sr-hero-01";

function typographyRule(props) {
  return props.filter(Boolean).join("\n");
}

/**
 * Hero-scoped typography (H1 mono, etc.) wins over page-wide samples for SR Hero CSS.
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
    out.headings = { ...(out.headings && typeof out.headings === "object" ? out.headings : {}), ...ht.headings };
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
  const mergeStrArr = (a, b) => {
    const x = Array.isArray(a) ? [...a] : [];
    if (!Array.isArray(b)) {
      return x;
    }
    for (const u of b) {
      if (typeof u === "string" && u.trim() && !x.includes(u.trim())) {
        x.push(u.trim());
      }
    }
    return x;
  };
  out.google_fonts_urls = mergeStrArr(out.google_fonts_urls, ht.google_fonts_urls);
  out.font_stylesheet_urls = mergeStrArr(out.font_stylesheet_urls, ht.font_stylesheet_urls);
  out.font_face_urls = mergeStrArr(out.font_face_urls, ht.font_face_urls);
  return out;
}

function firstFontFamilyNameFromStack(s) {
  const str = String(s || "").trim();
  const m = str.match(/"([^"]+)"/);
  if (m) {
    return m[1].trim();
  }
  const part = str.split(",")[0].trim();
  return part.replace(/^['"]+|['"]+$/g, "");
}

/**
 * WCAG relative luminance for #rrggbb (via normalizeTypographyHexColor).
 * @param {string} hex
 */
function relativeLuminanceFromHex(hex) {
  const n = normalizeTypographyHexColor(hex);
  if (!n || n.length < 7) {
    return 0.5;
  }
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  const lin = (c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * When extract gives button text color but no fill (common on dark pills + colored label).
 * @param {Record<string, unknown>} b
 */
function inferFilledButtonBackgroundFromExtract(b) {
  const explicit = b.backgroundColor && String(b.backgroundColor).trim();
  if (explicit) {
    return explicit;
  }
  if (!b.color) {
    return "";
  }
  const cNorm = normalizeTypographyHexColor(String(b.color));
  if (!cNorm) {
    return "#111111";
  }
  const L = relativeLuminanceFromHex(cNorm);
  if (L < 0.42) {
    return "#ffffff";
  }
  return "#111111";
}

/**
 * @param {Record<string, unknown>} typography
 */
function appendFontFaceRulesFromFontFaceUrls(lines, typography) {
  const urls = typography.font_face_urls;
  if (!Array.isArray(urls) || !urls.length) {
    return;
  }
  const stack =
    (typography.headings &&
      typography.headings.h1 &&
      typeof typography.headings.h1 === "object" &&
      typography.headings.h1.fontFamily) ||
    (typeof typography.fonts?.headings === "string" ? typography.fonts.headings : "") ||
    typography.body?.fontFamily ||
    "";
  const fam = firstFontFamilyNameFromStack(stack) || "DittoExtractFont";
  const wts = ["400", "500", "600", "700"];
  let n = 0;
  for (const u of urls) {
    if (typeof u !== "string" || !/^https?:\/\//i.test(u.trim())) {
      continue;
    }
    const wt = wts[n] || "400";
    lines.push(`@font-face {`);
    lines.push(`  font-family: ${cssQuoted(fam)};`);
    lines.push(`  src: url(${cssQuoted(u.trim())}) format("woff2");`);
    lines.push(`  font-weight: ${wt};`);
    lines.push(`  font-style: normal;`);
    lines.push(`  font-display: swap;`);
    lines.push(`}`);
    n += 1;
    if (n > 10) {
      break;
    }
  }
}

const DITTO_FONTS_CSS_MARKER = "ditto-fonts-generated";

/**
 * Strip characters that would break a `font-family:` declaration.
 * @param {string} s
 */
function sanitizeCssFontFamilyStack(s) {
  return String(s || "")
    .replace(/[;{}]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
}

/**
 * SR / Sprocket Rocket themes ship `css/_fonts.css` with empty `font-family: ""` placeholders.
 * Bakes typography-extract stacks + @import / @font-face so the whole theme inherits cloned fonts.
 *
 * @param {string} themeRoot
 * @param {Record<string, unknown>} typography merged page + hero scope
 * @returns {boolean}
 */
function applyExtractedTypographyToThemeFontsCss(themeRoot, typography) {
  if (!typography || typeof typography !== "object") {
    return false;
  }
  const fp = path.join(themeRoot, "css", "_fonts.css");
  if (!fs.existsSync(fp)) {
    return false;
  }

  const heads =
    typography.headings && typeof typography.headings === "object" ? typography.headings : {};
  const fontsRoot = typography.fonts && typeof typography.fonts === "object" ? typography.fonts : {};

  function stack(...candidates) {
    for (const c of candidates) {
      if (c == null) {
        continue;
      }
      const t = sanitizeCssFontFamilyStack(String(c));
      if (t) {
        return t;
      }
    }
    return "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  }

  const bodyStack = stack(
    fontsRoot.body,
    typography.body && typography.body.fontFamily,
  );
  const defaultHeadingStack = stack(
    fontsRoot.headings,
    heads.h1 && heads.h1.fontFamily,
    bodyStack,
  );
  function headingStackFor(tag) {
    const h = heads[tag];
    return stack(h && h.fontFamily, defaultHeadingStack, bodyStack);
  }
  const btnStack = stack(
    typography.buttons && typography.buttons.fontFamily,
    bodyStack,
  );
  const navStack = bodyStack;

  const importLines = [];
  const seenUrl = new Set();
  for (const arr of [typography.google_fonts_urls, typography.font_stylesheet_urls]) {
    if (!Array.isArray(arr)) {
      continue;
    }
    for (const u of arr) {
      if (typeof u !== "string" || !/^https?:\/\//i.test(u.trim())) {
        continue;
      }
      const t = u.trim();
      if (seenUrl.has(t)) {
        continue;
      }
      seenUrl.add(t);
      importLines.push(`@import url(${cssQuoted(t)});`);
    }
  }

  const faceLines = [];
  appendFontFaceRulesFromFontFaceUrls(faceLines, typography);

  const t = "\t";
  const out = [];
  out.push("/* Documentation: https://docs.sprocketrocket.co/custom-fonts */");
  out.push("");
  out.push(`/* ${DITTO_FONTS_CSS_MARKER}: baked from typography-extract (Ditto) */`);
  out.push("/* Keep all @import lines at the top of this file */");
  out.push("");
  for (const line of importLines) {
    out.push(line);
  }
  if (importLines.length) {
    out.push("");
  }
  for (const line of faceLines) {
    out.push(line);
  }
  if (faceLines.length) {
    out.push("");
  }

  out.push("body {");
  out.push(`${t}font-family: ${bodyStack};`);
  out.push("}");
  for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    const hk = headingStackFor(tag);
    out.push(`${tag},`);
    out.push(`.${tag} {`);
    out.push(`${t}font-family: ${hk};`);
    out.push("}");
  }
  const displayStack = headingStackFor("h1");
  for (const d of ["display-1", "display-2", "display-3", "display-4"]) {
    out.push(`.${d} {`);
    out.push(`${t}font-family: ${displayStack};`);
    out.push("}");
  }
  out.push("p.lead, p.large {");
  out.push(`${t}font-family: ${bodyStack};`);
  out.push("}");
  out.push("blockquote {");
  out.push(`${t}font-family: ${bodyStack};`);
  out.push("}");
  out.push(".btn,");
  out.push(".btn-wrapper .cta_button,");
  out.push(".btn-wrapper .cta-button,");
  out.push('.btn-wrapper input[type="submit"],');
  out.push('.btn-wrapper input[type="button"],');
  out.push('input[type="submit"],');
  out.push('input[type="button"]    {');
  out.push(`${t}font-family: ${btnStack};`);
  out.push("}");
  out.push(".navbar .navbar-nav .dropdown .dropdown-item,");
  out.push(".navbar .navbar-nav .nav-link,");
  out.push(".btn-wrapper.btn-primary-wrapper.d-xl-inline a,");
  out.push(".no-button.header__menu-link,");
  out.push(".header__menu-link {");
  out.push(`${t}font-family: ${navStack};`);
  out.push("}");

  fs.writeFileSync(fp, `${out.join("\n")}\n`, "utf8");
  return true;
}

/**
 * Builds `css/client-typography.css` from typography-extract `typography` object.
 * Targets SR Hero 01 markup (`.sr-hero-01`, `.heading`, `.description`, `.cta-button`).
 */
function buildClientTypographyCss(typography) {
  const lines = [
    "/* Generated by Ditto upload — typography from typography-extract-api */",
    "/* High specificity + !important overrides SR Hero + HubSpot utilities */",
  ];
  const gfu = typography.google_fonts_urls;
  if (Array.isArray(gfu)) {
    for (const u of gfu) {
      if (typeof u === "string" && /^https?:\/\//i.test(u.trim())) {
        lines.push(`@import url(${cssQuoted(u.trim())});`);
      }
    }
  }
  const fsu = typography.font_stylesheet_urls;
  if (Array.isArray(fsu)) {
    for (const u of fsu) {
      if (typeof u === "string" && /^https?:\/\//i.test(u.trim())) {
        lines.push(`@import url(${cssQuoted(u.trim())});`);
      }
    }
  }
  appendFontFaceRulesFromFontFaceUrls(lines, typography);

  /** @param {{ fontFamily?, fontSize?, fontWeight?, lineHeight?, letterSpacing?, color? }} s */
  const fontBlock = (s, suffix = " !important") => {
    if (!s || typeof s !== "object") {
      return "";
    }
    const bits = [];
    if (s.fontFamily) {
      const ff = cssFontFamilyValue(s.fontFamily);
      if (ff) {
        bits.push(`  font-family: ${ff}${suffix};`);
      }
    }
    if (s.fontSize) {
      const fs = String(s.fontSize).trim();
      if (/^[\d.]+(px|rem|em|%|vw|vh|ch)$/i.test(fs) && !/^(inherit|auto|initial|unset|normal)$/i.test(fs)) {
        bits.push(`  font-size: ${fs}${suffix};`);
      }
    }
    if (s.fontWeight) {
      bits.push(`  font-weight: ${String(s.fontWeight).trim()}${suffix};`);
    }
    if (s.lineHeight) {
      const lh = String(s.lineHeight).trim();
      if (
        /^[\d.]+(px|rem|em|%)?$/i.test(lh) ||
        /^[\d.]+$/.test(lh)
      ) {
        if (!/^(inherit|auto|initial|unset|normal)$/i.test(lh)) {
          bits.push(`  line-height: ${lh}${suffix};`);
        }
      }
    }
    if (s.letterSpacing) {
      const ls = String(s.letterSpacing).trim();
      if (/^[\d.]+(px|em|rem|%)?$/i.test(ls) && !/^(inherit|auto|initial|unset|normal)$/i.test(ls)) {
        bits.push(`  letter-spacing: ${ls}${suffix};`);
      }
    }
    if (s.color) {
      bits.push(`  color: ${String(s.color).trim()}${suffix};`);
    }
    return bits.join("\n");
  };

  const bodyStyle =
    typography.body && typeof typography.body === "object" ? typography.body : null;

  if (bodyStyle && typeof bodyStyle === "object") {
    lines.push(`${TYPOGRAPHY_SR_HERO} .description,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .description.lead,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .description p,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .description div,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .description span,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .description li {`);
    lines.push(
      typographyRule([
        fontBlock(bodyStyle),
        "  -webkit-font-smoothing: antialiased !important;",
      ]),
    );
    lines.push("}");
    lines.push(`${TYPOGRAPHY_SR_HERO} .description * {`);
    lines.push(`  font-family: inherit !important;`);
    lines.push(`  font-size: inherit !important;`);
    lines.push(`  line-height: inherit !important;`);
    lines.push(`  letter-spacing: inherit !important;`);
    lines.push(`}`);
  }

  if (bodyStyle && cssFontFamilyValue(bodyStyle.fontFamily)) {
    lines.push(`${TYPOGRAPHY_SR_HERO} .sr-cover-inner {`);
    lines.push(`  font-family: ${cssFontFamilyValue(bodyStyle.fontFamily)} !important;`);
    lines.push("}");
  }

  const heads =
    typography.headings && typeof typography.headings === "object"
      ? typography.headings
      : {};
  for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    const h = heads[tag];
    if (!h || typeof h !== "object") {
      continue;
    }
    lines.push(`${TYPOGRAPHY_SR_HERO} ${tag},`);
    lines.push(`${TYPOGRAPHY_SR_HERO} ${tag}.heading {`);
    lines.push(typographyRule([fontBlock(h), "  -webkit-font-smoothing: antialiased !important;"]));
    lines.push("}");
  }

  const h3Eyebrow = heads.h3;
  if (h3Eyebrow && typeof h3Eyebrow === "object") {
    lines.push(`${TYPOGRAPHY_SR_HERO} .ditto-extract-preheading,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .ditto-extract-preheading * {`);
    lines.push(
      typographyRule([
        fontBlock(h3Eyebrow),
        "  -webkit-font-smoothing: antialiased !important;",
      ]),
    );
    lines.push("}");
  }

  const h2Sub = heads.h2;
  if (h2Sub && typeof h2Sub === "object") {
    lines.push(`${TYPOGRAPHY_SR_HERO} .ditto-extract-subheading,`);
    lines.push(`${TYPOGRAPHY_SR_HERO} .ditto-extract-subheading.heading {`);
    lines.push(
      typographyRule([
        fontBlock(h2Sub),
        "  -webkit-font-smoothing: antialiased !important;",
      ]),
    );
    lines.push("}");
  }

  if (bodyStyle && cssFontFamilyValue(bodyStyle.fontFamily) && !heads.h1 && !heads.h2) {
    lines.push(`${TYPOGRAPHY_SR_HERO} h1.heading {`);
    lines.push(`  font-family: ${cssFontFamilyValue(bodyStyle.fontFamily)} !important;`);
    lines.push("}");
  }

  if (typography.links && typography.links.color) {
    lines.push(`${TYPOGRAPHY_SR_HERO} a:not(.cta-button):not(.button) {`);
    lines.push(`  color: ${String(typography.links.color).trim()} !important;`);
    if (typography.links.textDecoration) {
      lines.push(
        `  text-decoration-line: ${String(typography.links.textDecoration).trim()} !important;`,
      );
    }
    if (typography.links.fontWeight) {
      lines.push(`  font-weight: ${String(typography.links.fontWeight).trim()} !important;`);
    }
    lines.push("}");
  }

  if (typography.buttons && typeof typography.buttons === "object") {
    const b = typography.buttons;
    const hasBtn = Object.keys(b).length > 0 && (b.fontFamily || b.fontSize || b.color || b.backgroundColor);
    if (hasBtn) {
      const bgFilled = inferFilledButtonBackgroundFromExtract(b);
      const btnCore = [
        `${TYPOGRAPHY_SR_HERO} a.cta-button`,
        `${TYPOGRAPHY_SR_HERO} .cta-button`,
        `${TYPOGRAPHY_SR_HERO} a.button`,
        `${TYPOGRAPHY_SR_HERO} .btn-wrapper a.cta-button`,
        `${TYPOGRAPHY_SR_HERO} .btn-wrapper a.cta_button`,
        `${TYPOGRAPHY_SR_HERO} .btn-wrapper .cta-button`,
        `${TYPOGRAPHY_SR_HERO} .btn-wrapper .cta_button`,
        `${TYPOGRAPHY_SR_HERO} .btn-wrapper:is([class*="btn-"]) :is(.cta-button, .cta_button)`,
      ];
      const btnBlock = () =>
        typographyRule([
          fontBlock(b),
          bgFilled ? `  background-color: ${bgFilled} !important;` : "",
          bgFilled ? `  border-color: transparent !important;` : "",
          b.borderRadius ? `  border-radius: ${String(b.borderRadius).trim()} !important;` : "",
          `  -webkit-font-smoothing: antialiased !important;`,
        ]);
      for (const state of ["", ":hover", ":focus", ":active"]) {
        const selectors = btnCore.map((s) => `${s}${state}`).join(",\n");
        lines.push(`${selectors} {`);
        lines.push(btnBlock());
        lines.push("}");
      }
      lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper .cta-button .button_icon,`);
      lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper .cta_button .button_icon {`);
      lines.push(`  fill: currentColor !important;`);
      lines.push("}");
      // Preview defaults use gradient_* CTAs; pseudo-elements paint theme gradients over extracted type.
      lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper[class*="btn-gradient"] :is(.cta-button, .cta_button)::before,`);
      lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper[class*="btn-gradient"] :is(.cta-button, .cta_button)::after {`);
      lines.push(`  display: none !important;`);
      lines.push(`  opacity: 0 !important;`);
      lines.push(`  content: none !important;`);
      lines.push(`}`);
      lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper[class*="btn-gradient"] :is(.cta-button, .cta_button) {`);
      lines.push(`  position: relative !important;`);
      lines.push(`  z-index: 1 !important;`);
      if (bgFilled) {
        lines.push(`  background-color: ${bgFilled} !important;`);
        lines.push(`  border-color: transparent !important;`);
      }
      if (b.color) {
        lines.push(`  color: ${String(b.color).trim()} !important;`);
      }
      if (b.borderRadius) {
        lines.push(`  border-radius: ${String(b.borderRadius).trim()} !important;`);
      }
      lines.push(`}`);
      if (bgFilled) {
        lines.push(`${TYPOGRAPHY_SR_HERO} .btn-wrapper[class*="btn-outline"] :is(.cta-button, .cta_button) {`);
        lines.push(`  border-color: transparent !important;`);
        lines.push(`  background-color: ${bgFilled} !important;`);
        lines.push(`}`);
      }
    }
  }

  const primary =
    typography.colors &&
    typography.colors.primary &&
    String(typography.colors.primary).trim();
  if (/^#[0-9a-f]{3,8}$/i.test(primary || "")) {
    lines.push(
      `/* Soft backdrop hint from extracted primary — does not replace module background image/color choice */`,
    );
    lines.push(`${TYPOGRAPHY_SR_HERO}.prototype-no-background {`);
    lines.push(`  --ditto-client-primary: ${primary};`);
    lines.push("}");
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Normalizes extract API color strings to #rrggbb (or #rrggbbaa) for HubSpot color fields.
 * @param {string} v
 * @returns {string|null}
 */
function normalizeTypographyHexColor(v) {
  if (v == null || typeof v !== "string") {
    return null;
  }
  let s = v.trim();
  if (!s.length) {
    return null;
  }
  if (s.startsWith("#")) {
    s = s.slice(1);
  }
  if (/^[0-9a-f]{3}$/i.test(s)) {
    return `#${[...s].map((c) => c + c).join("")}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(s) || /^[0-9a-f]{8}$/i.test(s)) {
    return `#${s.toLowerCase()}`;
  }
  return null;
}

/**
 * Bakes typography-extract colors into `templates/preview.html` SR Hero DnD defaults (staging theme only).
 * Uses `heading_color` / `design_settings.text_color` + `*_custom` HubSpot fields so rendered HubL matches CSS.
 *
 * @param {string} themeRoot
 * @param {Record<string, unknown>} typography
 * @param {{ typographySkipPreviewHeroFields?: boolean, previewTemplate?: string }} [body]
 * @param {Record<string, unknown>|null} [hero]
 * @param {string} [previewBasename]
 * @returns {{ patched: boolean }}
 */
function applyExtractedTypographyToPreviewHeroModule(
  themeRoot,
  typography,
  body = {},
  hero = null,
  previewBasename = "preview.html",
) {
  if (body.typographySkipPreviewHeroFields === true) {
    return { patched: false };
  }
  if (!typography || typeof typography !== "object") {
    return { patched: false };
  }
  const fp = path.join(themeRoot, "templates", previewBasename);
  if (!fs.existsSync(fp)) {
    return { patched: false };
  }
  let h = fs.readFileSync(fp, "utf8");
  let patched = false;

  const eyebrowFirst =
    hero &&
    hero.found &&
    hero.text &&
    String(hero.text.preheading || "").trim() &&
    String(hero.text.title || "").trim();

  const firstRowColor = normalizeTypographyHexColor(
    String(
      (eyebrowFirst ? typography.headings?.h3?.color : typography.headings?.h1?.color) != null
        ? String(eyebrowFirst ? typography.headings?.h3?.color : typography.headings?.h1?.color)
        : "",
    ),
  );
  const secondRowColor = normalizeTypographyHexColor(
    String(
      (eyebrowFirst ? typography.headings?.h1?.color : typography.headings?.h2?.color) != null
        ? String(eyebrowFirst ? typography.headings?.h1?.color : typography.headings?.h2?.color)
        : "",
    ),
  );
  const bodyColor = normalizeTypographyHexColor(
    typography.body?.color != null ? String(typography.body.color) : "",
  );
  const subheadingHex = normalizeTypographyHexColor(
    typography.headings?.h2?.color != null ? String(typography.headings.h2.color) : "",
  );
  const descriptionTextColor =
    eyebrowFirst && subheadingHex ? subheadingHex : bodyColor;

  const h1From = `"heading_color":"{{ request.query_dict.hero_heading_color|default('auto') }}"`;
  const h1To = `"heading_color":"custom","heading_color_custom":{"color":"${firstRowColor}","opacity":100}`;
  if (firstRowColor && h.includes(h1From)) {
    h = h.replace(h1From, h1To);
    patched = true;
  }

  const h2From = `"heading_color":"{{ request.query_dict.hero_heading_2_color|default('auto') }}"`;
  const h2To = `"heading_color":"custom","heading_color_custom":{"color":"${secondRowColor}","opacity":100}`;
  if (secondRowColor && h.includes(h2From)) {
    h = h.replace(h2From, h2To);
    patched = true;
  }

  if (descriptionTextColor && !h.includes("design_settings.text_color_custom")) {
    const tcOpen = '{% module_attribute "design_settings.text_color" %}';
    const pos = h.indexOf(tcOpen);
    let textColorPatchOk = false;
    if (pos >= 0) {
      const heroLine = h.indexOf("hero_text_color", pos);
      if (heroLine > 0) {
        const endTag = "{% end_module_attribute %}";
        const endPos = h.indexOf(endTag, heroLine);
        if (endPos > 0) {
          const afterEnd = endPos + endTag.length;
          const blockStart = h.lastIndexOf("\n", pos);
          const blockIndent = h.slice(blockStart + 1, pos).replace(/[\r\n]/g, "") || "\t\t\t\t\t\t";
          const innerIndent = lineIndentAtIndex(h, heroLine) || `${blockIndent}\t`;
          const nl = h.slice(afterEnd, afterEnd + 2) === "\r\n" ? "\r\n" : "\n";
          const colorDefault = hubLColorCustomDefault(
            "hero_text_color_custom",
            descriptionTextColor,
            100,
          );
          const insert = `${nl}${blockIndent}{% module_attribute "design_settings.text_color_custom" %}${nl}${innerIndent}${colorDefault}${nl}${blockIndent}{% end_module_attribute %}`;
          h = `${h.slice(0, afterEnd)}${insert}${h.slice(afterEnd)}`;
          textColorPatchOk = true;
        }
      }
    }
    if (textColorPatchOk) {
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_text_color\|default\('white'\)\s*\}\}/,
        "{{ request.query_dict.hero_text_color|default('custom') }}",
      );
      patched = true;
    }
  }

  const repaired = repairMalformedPreviewHeroHubL(h);
  if (repaired !== h) {
    h = repaired;
    patched = true;
  }

  if (patched) {
    fs.writeFileSync(fp, h, "utf8");
  }
  return { patched };
}

const TYPOGRAPHY_HEADER_MARKER = "{# ditto-client-typography-css #}";
const TYPOGRAPHY_FOOTER_MARKER_LEGACY = "{# sr-client-typography-ditto #}";

function stripLegacyFooterTypographyLink(themeRoot) {
  const fp = path.join(themeRoot, "templates", "footer-includes.html");
  if (!fs.existsSync(fp)) {
    return;
  }
  let h = fs.readFileSync(fp, "utf8");
  const markerPos = h.indexOf(TYPOGRAPHY_FOOTER_MARKER_LEGACY);
  if (markerPos < 0) {
    return;
  }
  const linkRel = "client-typography.css";
  const linkPos = h.indexOf(linkRel, markerPos);
  if (linkPos < 0) {
    return;
  }
  const linkStart = h.lastIndexOf("<link", linkPos);
  if (linkStart < 0 || linkStart < markerPos) {
    return;
  }
  let linkEnd = h.indexOf(">", linkStart);
  if (linkEnd <= linkStart) {
    return;
  }
  linkEnd += 1;
  h = `${h.slice(0, markerPos)}${h.slice(linkEnd)}`.replace(/\n{4,}/g, "\n\n\n");
  fs.writeFileSync(fp, h.replace(/\s+$/, "") + "\n", "utf8");
}

function ensureHeaderIncludesClientTypography(themeRoot) {
  const fp = path.join(themeRoot, "templates", "header.html");
  if (!fs.existsSync(fp)) {
    return;
  }
  stripLegacyFooterTypographyLink(themeRoot);
  let h = fs.readFileSync(fp, "utf8");
  if (h.includes(TYPOGRAPHY_HEADER_MARKER)) {
    return;
  }
  const inject = `\n\t\t${TYPOGRAPHY_HEADER_MARKER}\n\t\t{{ require_css(get_asset_url("../css/client-typography.css")) }}\n`;
  const m = h.match(/\s*<\/head\s*>/i);
  if (m && m.index != null) {
    h = `${h.slice(0, m.index)}${inject}${h.slice(m.index)}`;
  } else {
    h += inject;
  }
  fs.writeFileSync(fp, h, "utf8");
}

/**
 * Batch upload: extra preview templates per non-primary site + header CSS switcher.
 *
 * @param {string} themeRoot
 * @param {Array<Record<string, unknown>>} typographySites
 * @param {string} primaryWebsiteUrl
 */
function applyBatchMultiSitePreviewTemplates(themeRoot, typographySites, primaryWebsiteUrl) {
  if (!Array.isArray(typographySites) || typographySites.length < 2) {
    return { applied: false, siteCount: 0, previewTemplates: [], previewSiteLinks: [] };
  }
  const primaryNorm = String(primaryWebsiteUrl || "").trim();
  /** @type {Array<{ website_url: string, slug: string, is_primary: boolean, css_file: string|null }>} */
  const manifestSites = [];
  for (const raw of typographySites) {
    const rec = siteRecordForUpload(
      raw && typeof raw === "object" ? raw : { website_url: "" },
    );
    if (!rec.website_url || !rec.typography) {
      continue;
    }
    const isPrimary = Boolean(
      primaryNorm && sameWebsiteUrl(rec.website_url, primaryNorm),
    );
    manifestSites.push({
      website_url: rec.website_url,
      slug: rec.slug,
      is_primary: isPrimary,
      css_file: `css/client-typography-${rec.slug}.css`,
    });
  }
  if (manifestSites.length < 2) {
    return { applied: false, siteCount: manifestSites.length, previewTemplates: [], previewSiteLinks: [] };
  }

  const headerPatch = patchHeaderForBatchTypographySites(themeRoot, manifestSites);
  const previewPath = path.join(themeRoot, "templates", "preview.html");
  if (!fs.existsSync(previewPath)) {
    return {
      applied: Boolean(headerPatch.patched),
      siteCount: manifestSites.length,
      previewTemplates: [],
      previewSiteLinks: buildPreviewSiteLinks(manifestSites),
      headerPatched: headerPatch.patched,
    };
  }

  const primarySnap = fs.readFileSync(previewPath, "utf8");
  const refPreview = path.join(SR_2026_REF, "templates", "preview.html");
  if (!fs.existsSync(refPreview)) {
    return {
      applied: Boolean(headerPatch.patched),
      siteCount: manifestSites.length,
      previewTemplates: [],
      previewSiteLinks: buildPreviewSiteLinks(manifestSites),
      headerPatched: headerPatch.patched,
    };
  }
  const refHtml = fs.readFileSync(refPreview, "utf8");
  const miniBody = { typographySkipThemeFontsCss: true };
  /** @type {string[]} */
  const created = [];

  for (const raw of typographySites) {
    const rec = siteRecordForUpload(
      raw && typeof raw === "object" ? raw : { website_url: "" },
    );
    if (!rec.website_url || !rec.typography) {
      continue;
    }
    if (primaryNorm && sameWebsiteUrl(rec.website_url, primaryNorm)) {
      continue;
    }
    const extract =
      rec.typographyExtract ||
      (raw && typeof raw === "object" ? raw.playwright : null) ||
      null;
    const tplFile = `preview-${rec.slug}.html`;
    const perSitePreviewPath = path.join(themeRoot, "templates", tplFile);
    fs.writeFileSync(perSitePreviewPath, refHtml, "utf8");
    applyExtractedTypographyToPreviewHeroModule(
      themeRoot,
      rec.typography,
      miniBody,
      extract && typeof extract === "object" ? extract.hero : null,
      tplFile,
    );
    if (extract && typeof extract === "object" && extract.hero?.found) {
      applyExtractedHeroBackgroundToPreview(themeRoot, extract.hero, miniBody, tplFile);
      applyExtractedHeroModuleFieldsFromTypographyApi(themeRoot, extract, miniBody, tplFile);
      maybeApplyExtractedHeroPreviewCopy(themeRoot, miniBody, extract, tplFile);
    }
    let baked = repairMalformedPreviewHeroHubL(fs.readFileSync(perSitePreviewPath, "utf8"));
    const host = friendlyHost(rec.website_url);
    baked = baked.replace(
      /label:\s*SR Hero Preview \(DND\)/,
      `label: SR Hero Preview — ${host}`,
    );
    fs.writeFileSync(perSitePreviewPath, baked, "utf8");
    created.push(tplFile);
  }

  fs.writeFileSync(
    previewPath,
    repairMalformedPreviewHeroHubL(primarySnap),
    "utf8",
  );
  augmentTypographySitesManifest(themeRoot, manifestSites, created);

  return {
    applied: true,
    siteCount: manifestSites.length,
    previewTemplates: created,
    previewSiteLinks: buildPreviewSiteLinks(manifestSites),
    headerPatched: headerPatch.patched,
  };
}

/**
 * Saves typography extract envelope to disk & returns summary for HTTP response.
 */
function saveTypographyAuditFile(info, body, envelope, httpMeta) {
  const themeFolder = String(info.destPath || "")
    .replace(/^\//, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outName = `${info.mode}-${themeFolder || "theme"}-${stamp}.json`;
  fs.mkdirSync(TYPOGRAPHY_CACHE_DIR, { recursive: true });
  const outPath = path.join(TYPOGRAPHY_CACHE_DIR, outName);
  const payload = {
    timestamp: new Date().toISOString(),
    mode: info.mode,
    themeDestPath: info.destPath,
    typography_api_base: TYPOGRAPHY_EXTRACT_BASE_URL,
    typography_api_url: getTypographyExtractPostUrl(),
    website_url:
      envelope && envelope.website_url
        ? envelope.website_url
        : resolveTypographyWebsiteUrl(body) || "",
    typography_applied_via_synthesis: Boolean(httpMeta && httpMeta.fromSynthesisApplied),
    response: envelope,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  const rel = path.relative(__dirname, outPath).replace(/\\/g, "/");
  const websiteUrl = payload.website_url;
  if (websiteUrl && envelope && typeof envelope === "object") {
    try {
      upsertWebsiteTypographyCache({
        projectRoot: __dirname,
        websiteUrl: String(websiteUrl),
        source: `audit_${info.mode || "upload"}`,
        playwrightEnvelope: envelope,
        auditFile: rel,
      });
    } catch (e) {
      console.warn("[typography-website-cache] audit upsert:", e.message || e);
    }
  }
  return rel;
}

/**
 * @param {Record<string, unknown>} b
 */
function typographyCacheForceRefresh(b) {
  return b.force_refresh === true || b.forceRefresh === true || b.refresh_cache === true;
}

/**
 * After upload (or synth): persist typography JSON for audit trail.
 */
async function runTypographyExtractIfRequested(body, info, synth) {
  const siteUrlRaw = resolveTypographyWebsiteUrl(body);
  let envelope =
    (synth && synth.typographyExtract) ||
    body.typographyExtract ||
    body.typographyExtractSnapshot ||
    body.typographyExtractFull ||
    null;

  if (!envelope && siteUrlRaw) {
    const v = validateHttpUrlTypography(siteUrlRaw);
    if (!v.ok) {
      return {
        requested: true,
        ok: false,
        websiteUrl: siteUrlRaw,
        error: v.error || "Bad URL",
      };
    }
    const r = await postTypographyExtractJson(v.websiteUrl, {
      includeHeroScreenshot: Boolean(
        body.includeHeroScreenshot ?? body.include_hero_screenshot,
      ),
    });
    if (!r.ok) {
      return {
        requested: true,
        ok: false,
        websiteUrl: v.websiteUrl,
        status: r.status,
        error:
          (r.data && (r.data.error || r.data.message)) ||
          r.rawText ||
          `Typography API failed (${r.status})`,
        elapsedMs: r.elapsedMs,
      };
    }
    envelope = r.data || { raw: r.rawText };
  }

  const hasTypographyObject =
    !!(synth && synth.typography && typeof synth.typography === "object");
  const hasEnvelope = !!(envelope && typeof envelope === "object");

  if (!siteUrlRaw && !hasTypographyObject && !hasEnvelope) {
    return {
      requested: false,
      typographyApplied: !!(synth && synth.applied),
      clientTypographyCssWritten: !!(synth && synth.cssWritten),
    };
  }

  if (!hasEnvelope && hasTypographyObject) {
    envelope = {
      success: true,
      source: "client-payload-only",
      website_url: siteUrlRaw || "",
      typography: synth.typography,
    };
  }

  if (!hasEnvelope) {
    return {
      requested: true,
      ok: false,
      websiteUrl: siteUrlRaw || "",
      error:
        siteUrlRaw
          ? "Typography API returned nothing usable."
          : "Provide typography_extract payload or extraction URL.",
      typographyApplied: !!(synth && synth.applied),
      clientTypographyCssWritten: !!(synth && synth.cssWritten),
    };
  }

  try {
    const savedFile = saveTypographyAuditFile(info, body, envelope, {
      fromSynthesisApplied: !!(synth && synth.applied),
    });
    return {
      requested: true,
      ok: true,
      websiteUrl:
        envelope.website_url || siteUrlRaw || resolveTypographyWebsiteUrl(body),
      typographyApiUrl: getTypographyExtractPostUrl(),
      typographyExtractBaseUrl: TYPOGRAPHY_EXTRACT_BASE_URL,
      savedFile,
      typographyApplied: !!(synth && synth.applied),
      clientTypographyCssWritten: !!(synth && synth.cssWritten),
      fetchedUpstreamDuringUploadPrep: !!(synth && synth.fetchedUpstream),
      pageTitle:
        envelope && envelope.page_title != null ? String(envelope.page_title) : "",
      fileGenerated:
        envelope && envelope.file_generated
          ? String(envelope.file_generated)
          : "",
    };
  } catch (e) {
    return {
      requested: true,
      ok: false,
      error: e.message || String(e),
      typographyApplied: !!(synth && synth.applied),
      clientTypographyCssWritten: !!(synth && synth.cssWritten),
    };
  }
}

/**
 * `hs cms list` often **exits non-zero** (e.g. 404 "resource not found") even when `hs cms upload` just
 * created the path, or the list API is stricter than the upload path. This never throws so we can
 * read stdout/stderr and fall back to the upload process output.
 * @param {string} destPath
 * @param {string} account
 * @returns {Promise<{ code: number, combined: string }>}
 */
function execHubspotCmsListRaw(destPath, account) {
  return new Promise((resolve) => {
    const quoted = (p) => `"${p.replace(/"/g, '\\"')}"`;
    const cmd = `npx --yes -p @hubspot/cli@8.4.0 hs cms list ${quoted(destPath)}${
      account ? ` -a ${quoted(account)}` : ""
    }`;
    exec(
      cmd,
      {
        cwd: __dirname,
        maxBuffer: 5 * 1024 * 1024,
        windowsHide: true,
        shell: true,
      },
      (err, stdout, stderr) => {
        const out = `${stdout || ""}\n${stderr || ""}`.trim();
        if (!err) {
          resolve({ code: 0, combined: out });
          return;
        }
        const code = typeof err.code === "number" && err.code ? err.code : 1;
        resolve({ code, combined: out });
      },
    );
  });
}

/**
 * @param {string} stdout
 * @param {string} destPath  e.g. /my-theme
 * @returns {boolean}
 */
function uploadStdoutConfirmsCmsDest(stdout, destPath) {
  if (!stdout || !destPath) {
    return false;
  }
  const folder = String(destPath).replace(/^\//, "").replace(/\/+$/, "");
  if (!folder) {
    return false;
  }
  const s = String(stdout);
  // Real HubSpot success lines from the CLI, e.g. "✔ SUCCESS ... to \"/path\" ... complete"
  if (s.indexOf(folder) < 0) {
    return false;
  }
  const okBySuccess = /\bSUCCESS\b|is complete|Upload complete/i.test(s);
  const okToPath =
    new RegExp(`to\\s+['"]?/[^'"]*${escapeRe(folder)}`, "i").test(s) ||
    new RegExp(`[/'"]${escapeRe(folder)}[/'"]`).test(s);
  return (
    okBySuccess && (okToPath || /Design Manager|uploading files to/i.test(s))
  );
}

/**
 * @param {string} combined
 * @param {string} folder
 */
function rootFolderNameAppearsInCmsListOutput(combined, folder) {
  if (!folder) {
    return false;
  }
  const c = String(combined || "");
  for (const line of c.split(/\r?\n/)) {
    const t = String(line).trim();
    if (
      !t ||
      t.toLowerCase().startsWith("warning") ||
      t.toLowerCase().startsWith("warn")
    ) {
      continue;
    }
    if (t === folder || t === `/${folder}`) {
      return true;
    }
  }
  if (folder.length < 3) {
    return false;
  }
  // e.g. JSON/quoted paths in a dump
  return new RegExp(`[/"']${escapeRe(folder)}[/"'\\s]`, "i").test(c);
}

/**
 * Confirms the CLI is listing a HubSpot *theme* folder, not a random/empty path (reduces false positives).
 * @param {string} text
 * @returns {{ ok: boolean, markers?: string[], reason?: string }}
 */
function cmsListingProvesHubSpotThemeFolder(text) {
  const t = (text || "").trim();
  if (t.length < 2) {
    return { ok: false, reason: "empty_listing" };
  }
  const low = t.toLowerCase();
  // Unrecoverable list errors
  if (
    /\b(unknown path|not found|does not exist|unauthorized|401|403 forbidden)\b/i.test(
      low,
    ) &&
    t.length < 2000
  ) {
    return { ok: false, reason: "list_error" };
  }
  // Definite theme artifacts
  if (/\btheme\.json\b/i.test(t)) {
    return { ok: true, markers: ["theme.json"] };
  }
  if (
    /\b(fields|init)\.json\b/i.test(t) ||
    /(^|[\s,\\/])\b(modules|template)\.html?\b/i.test(t)
  ) {
    return { ok: true, markers: ["theme_config"] };
  }
  if (/(^|[\s,\\/])(templates|custom-modules)([\\/.]|$)/.test(t)) {
    return { ok: true, markers: ["theme_subdirs"] };
  }
  // Deeper paths sometimes list as generic dirs only
  if (
    /(^|[\s,\\/\]])(js|css|images)([\\/.]|$)/.test(t) &&
    /custom-modules|templates|\.json/i.test(t)
  ) {
    return { ok: true, markers: ["mixed_artifacts"] };
  }
  if (/0\s+file|no\s+file|empty\s+folder|nothing\s+here/i.test(t)) {
    return { ok: false, reason: "looks_empty" };
  }
  return { ok: false, reason: "no_theme_artifacts" };
}

/**
 * 1) Prefer `hs cms list` on the theme path (a few path spellings) with recognizable theme output.
 * 2) After CLI SUCCESS, **poll in rounds**: re-run both **path** lists and `hs cms list /` (path often returns
 *    404/“not found” until it catches up, while root lags too). **Do not** return success from stdout alone.
 * @param {string} destPath
 * @param {string} account
 * @param {{ uploadStdout?: string }} [options] Pass the same `hs cms upload` stdout to gate polling after SUCCESS.
 * @returns {Promise<{ ok: boolean, error?: string, code?: string, verification?: object, details?: object, destListing?: string, rootListing?: string }>}
 */
async function verifyPostUploadDest(destPath, account, options = {}) {
  const { uploadStdout = "" } = options;
  const folder = String(destPath || "")
    .replace(/^\//, "")
    .replace(/\/+$/, "");
  if (!folder) {
    return {
      ok: false,
      error: "Post-upload verification: invalid dest path",
      code: "INVALID_DEST",
    };
  }
  const pollAttempts = Math.max(
    1,
    Math.min(
      30,
      parseInt(
        String(process.env.HUBSPOT_ROOT_LIST_POLL_ATTEMPTS || "12"),
        10,
      ) || 12,
    ),
  );
  const pollMs = Math.max(
    500,
    Math.min(
      20_000,
      parseInt(String(process.env.HUBSPOT_ROOT_LIST_POLL_MS || "2500"), 10) ||
        2500,
    ),
  );

  const normalizedDest = `/${folder}`;
  const listPathVariations = Array.from(
    new Set([normalizedDest, `/${folder}/`, folder, folder + "/"]),
  );

  let lastListCombined = "";
  for (const tryPath of listPathVariations) {
    const r = await execHubspotCmsListRaw(tryPath, account);
    lastListCombined = r.combined;
    const destProof = cmsListingProvesHubSpotThemeFolder(r.combined);
    if (destProof.ok) {
      const rr = await execHubspotCmsListRaw("/", account);
      const rootListText = rr.combined;
      const rootFolderInRootList = rootFolderNameAppearsInCmsListOutput(
        rootListText,
        folder,
      );
      return {
        ok: true,
        verification: {
          method: "pathList",
          summary: rootFolderInRootList
            ? "Confirmed: `hs cms list` shows theme content at the path; name also found under `hs cms list /`."
            : "Confirmed: `hs cms list` for the theme path includes theme files (e.g. theme.json or key folders).",
          destPathChecked: normalizedDest,
          listPathUsed: tryPath,
          markers: destProof.markers,
          rootFolderInRootList,
        },
        details: {
          why: "List output contained recognizable theme files or folders.",
        },
        destListing: r.combined,
        rootListing: rootListText,
      };
    }
  }

  const rr0 = await execHubspotCmsListRaw("/", account);
  const rootListText = rr0.combined;
  if (rootFolderNameAppearsInCmsListOutput(rootListText, folder)) {
    return {
      ok: true,
      verification: {
        method: "rootListInitial",
        summary:
          "Your theme folder name appears in `hs cms list /` (file-tree root). The path list did not return theme file markers, but the folder is visible in the same listing the portal uses in Design Manager search.",
        destPathChecked: normalizedDest,
        markers: ["root_list_folder"],
        rootFolderInRootList: true,
        listPathAttemptFailed: true,
      },
      details: { why: "Name matched under root `hs cms list`." },
      destListing: lastListCombined,
      rootListing: rootListText,
    };
  }

  const uploadOk =
    uploadStdout && uploadStdoutConfirmsCmsDest(uploadStdout, destPath);
  if (uploadOk) {
    let lastRoot = rootListText;
    let lastPath = lastListCombined;
    for (let a = 1; a <= pollAttempts; a++) {
      await sleep(pollMs);
      for (const tryPath of listPathVariations) {
        const r = await execHubspotCmsListRaw(tryPath, account);
        lastPath = r.combined;
        const destProof = cmsListingProvesHubSpotThemeFolder(r.combined);
        if (destProof.ok) {
          const rr = await execHubspotCmsListRaw("/", account);
          return {
            ok: true,
            verification: {
              method: "pathListPolled",
              summary: `The theme path started listing theme content in \`hs cms list\` after ${a} wait round(s) (${pollMs}ms per round) — the path can return “not found” only briefly after upload.`,
              destPathChecked: normalizedDest,
              listPathUsed: tryPath,
              markers: destProof.markers,
              pollRounds: a,
              pollIntervalMs: pollMs,
            },
            details: { why: "Path list came good after a delay." },
            destListing: r.combined,
            rootListing: rr.combined,
          };
        }
      }
      const rr = await execHubspotCmsListRaw("/", account);
      lastRoot = rr.combined;
      if (rootFolderNameAppearsInCmsListOutput(lastRoot, folder)) {
        return {
          ok: true,
          verification: {
            method: "rootListPolled",
            summary: `The folder name appeared in \`hs cms list /\` after ${a} re-check(s) (${pollMs}ms apart; path and root re-polled each round). The CLI also reported upload SUCCESS.`,
            destPathChecked: normalizedDest,
            markers: ["root_list_folder", "cli_upload_success"],
            rootFolderInRootList: true,
            listPathAttemptFailed: true,
            pollAttempts: a,
            pollIntervalMs: pollMs,
          },
          details: {
            why: "Root file-tree list updated; path may still lag the opposite order depending on the portal.",
          },
          destListing: lastPath,
          rootListing: lastRoot,
        };
      }
    }
    return {
      ok: false,
      error:
        "Upload output reported SUCCESS, but `hs cms list` still did not show the theme: the path never listed theme files and the folder name never appeared under `hs cms list /` " +
        "after " +
        pollAttempts +
        " wait round(s) (each round re-tries the path and the root). " +
        "If the theme is visible in Design Manager but this check still fails, raise `HUBSPOT_ROOT_LIST_POLL_ATTEMPTS` or `HUBSPOT_ROOT_LIST_POLL_MS` in `.env`. " +
        "Search in the UI with the full name, e.g. **" +
        folder +
        "**.",
      code: "THEME_NOT_VISIBLE_IN_PORTAL",
      details: {
        pollRounds: pollAttempts,
        pollIntervalMs: pollMs,
        listPathTried: listPathVariations,
        uploadStdoutMatch: true,
      },
      destListing: lastPath,
      rootListing: lastRoot,
    };
  }

  return {
    ok: false,
    error:
      `Post-upload: could not confirm the theme. ` +
      "Folder not found in \`hs cms list /\`" +
      ` and the upload process output did not match a HubSpot SUCCESS line for **${folder}** ` +
      `(or upload stdout was missing). Last \`hs cms list\` for the theme path: ${(lastListCombined || "").slice(0, 600) || "(empty)"}. ` +
      "Ensure the same `account` / `HUBSPOT_ACCOUNT` as your login and retry.",
    code: "VERIFY_NO_SIGNAL",
    details: {
      listPathTried: listPathVariations,
      uploadStdoutMatch: false,
      pollConfig: { pollAttempts, pollMs },
    },
    destListing: lastListCombined,
    rootListing: rootListText,
  };
}

/** Working copy of the theme (from `npm run prepare-client-theme`); never written by us into sr-2026. */
const CLIENT_DELIVERY_THEME = path.join(__dirname, "client-delivery-theme");
const SR_2026_REF = path.join(__dirname, "sr-2026");

/**
 * Owned client module (copied from sr-2026 reference via `npm run sync-client-hero`).
 * Do not read sr-2026 at runtime — it is read-only company reference in this workflow.
 * Falls back to the same path under `client-delivery-theme` when `my-theme` is not present.
 */
const SR_HERO_MODULE_DIR = path.join(
  __dirname,
  "my-theme",
  "custom-modules",
  "SR Hero 01.module",
);
const SR_HERO_MODULE_FALLBACK = path.join(
  CLIENT_DELIVERY_THEME,
  "custom-modules",
  "SR Hero 01.module",
);
const SR_HERO_FILES = [
  "module.html",
  "module.js",
  "module.css",
  "fields.json",
  "meta.json",
];

function resolveSrHero01ModuleDir() {
  if (
    fs.existsSync(SR_HERO_MODULE_DIR) &&
    fs.statSync(SR_HERO_MODULE_DIR).isDirectory()
  ) {
    return SR_HERO_MODULE_DIR;
  }
  if (
    fs.existsSync(SR_HERO_MODULE_FALLBACK) &&
    fs.statSync(SR_HERO_MODULE_FALLBACK).isDirectory()
  ) {
    console.warn(
      "Using SR Hero 01 from client-delivery-theme (my-theme not found):",
      SR_HERO_MODULE_FALLBACK,
    );
    return SR_HERO_MODULE_FALLBACK;
  }
  return null;
}

function readSrHero01FileOverrides() {
  const out = [];
  const base = resolveSrHero01ModuleDir();
  if (!base) {
    console.warn(
      "SR Hero 01.module not found in my-theme or client-delivery-theme; overrides skipped",
    );
    return out;
  }
  for (const name of SR_HERO_FILES) {
    const fp = path.join(base, name);
    if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
      continue;
    }
    out.push({
      path: `custom-modules/SR Hero 01.module/${name}`,
      content: fs.readFileSync(fp, "utf8"),
      isBinary: false,
    });
  }
  return out;
}

/**
 * Double-quote HubL `or "..."` content (escape \ and ").
 * @param {string} s
 * @returns {string}
 */
function hubLStringLiteral(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Bakes default hero copy into templates/preview.html on the *deployment copy* only
 * (client-delivery-theme). sr-2026 is never modified.
 * @param {{ heading?: string, description?: string }} o
 */
function hubLInnerForSingleQuotedDefault(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function applyPreviewHeroDefaultsToCopy(themeRoot, o = {}, previewBasename = "preview.html") {
  const { heading, description } = o;
  if (!heading && !description) {
    return;
  }
  const fp = path.join(themeRoot, "templates", previewBasename);
  if (!fs.existsSync(fp)) {
    return;
  }
  let h = fs.readFileSync(fp, "utf8");
  if (typeof heading === "string" && heading.length) {
    const esc = hubLInnerForSingleQuotedDefault(heading);
    const needle =
      "{{ request.query_dict.hero_heading|default('Welcome to Our Website') }}";
    if (h.includes(needle)) {
      h = h.replace(
        needle,
        `{{ request.query_dict.hero_heading|default('${esc}') }}`,
      );
    } else {
      const dq = `|default("Heading One")`;
      const sq = "|default('Heading One')";
      if (h.includes(sq)) {
        h = h.replace(
          /\|default\('Heading One'\)/,
          `|default('${esc}')`,
        );
      } else if (h.includes(dq)) {
        h = h.replace(
          /\|default\("Heading One"\)/,
          `|default("${esc.replace(/"/g, '\\"')}")`,
        );
      } else {
        const re =
          /\{\{\s*Query\.hero_heading\s+or\s+"(?:[^"\\]|\\.)*"\s*\}\}/;
        if (re.test(h)) {
          h = h.replace(
            re,
            `{{ request.query_dict.hero_heading|default('${esc}')|escape }}`,
          );
        }
      }
    }
  }
  if (typeof description === "string" && description.length) {
    const escD = hubLInnerForSingleQuotedDefault(description);
    const needle2 =
      "{{ request.query_dict.hero_description|default('<p>Discover amazing solutions for your business</p>') }}";
    if (h.includes(needle2)) {
      h = h.replace(
        needle2,
        `{{ request.query_dict.hero_description|default('${escD}') }}`,
      );
    } else if (h.includes("|default('<p>Description One</p>')")) {
      h = h.replace(
        /\|default\('<p>Description One<\/p>'\)/,
        `|default('${escD}')`,
      );
    } else {
      const re2 =
        /\{\{\s*Query\.hero_description\s+or\s+"(?:[^"\\]|\\.)*"\s*\}\}/;
      if (re2.test(h)) {
        h = h.replace(
          re2,
          `{{ request.query_dict.hero_description|default('${escD}') }}`,
        );
      }
    }
  }
  fs.writeFileSync(fp, h, "utf8");
}

/**
 * SR Hero `lead_text` adds `.lead`, which pulls theme “lead” sizing and fights extracted body type.
 * When description is baked from extract, default lead off unless the page opts out.
 * @param {string} themeRoot
 * @param {boolean} [defaultOn]
 */
function patchPreviewHeroLeadTextDefault(themeRoot, defaultOn = false, previewBasename = "preview.html") {
  const fp = path.join(themeRoot, "templates", previewBasename);
  if (!fs.existsSync(fp)) {
    return;
  }
  let h = fs.readFileSync(fp, "utf8");
  const v = defaultOn ? "true" : "false";
  const re =
    /\{\{\s*request\.query_dict\.hero_lead_text\|default\((true|false)\)\s*\}\}/;
  if (re.test(h)) {
    h = h.replace(re, `{{ request.query_dict.hero_lead_text|default(${v}) }}`);
    fs.writeFileSync(fp, h, "utf8");
  }
}

function escapeHtmlPlain(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * When typography extract includes a **hero** block (from typography-extract-api) or `page_title`,
 * bake defaults into `templates/preview.html` unless the user already supplied copy.
 * Eyebrow (h3) → first heading row, main title (h1) → second row, subtitle → description when preheading+title exist (e.g. Prialto).
 */
function maybeApplyExtractedHeroPreviewCopy(
  themeRoot,
  body,
  typographyExtract,
  previewBasename = "preview.html",
) {
  if (!typographyExtract || typeof typographyExtract !== "object") {
    return;
  }
  if (body.typographySkipPageTitleHero === true) {
    return;
  }
  const userH = String(body.heroHeading || body.hero_heading || "").trim();
  const userD = String(body.heroDescription || body.hero_description || "").trim();

  const hero = typographyExtract.hero;
  const titleFromHero =
    hero && hero.found && hero.text && hero.text.title
      ? String(hero.text.title).trim()
      : "";
  const titleFromPage = String(typographyExtract.page_title || "").trim();
  const mainTitle = titleFromHero || titleFromPage || "";

  let heading;
  let description;

  if (userH) {
    heading = undefined;
  } else if (
    hero &&
    hero.found &&
    hero.text &&
    String(hero.text.preheading || "").trim() &&
    mainTitle
  ) {
    const prePlain = String(hero.text.preheading || "").trim();
    heading = prePlain;
    const subRole = String(hero.text.subtitleRole || "").toLowerCase();
    const sub = String(hero.text.subtitle || "").trim();
    if (!userD && sub && /^h[2-6]$/.test(subRole)) {
      const tag = subRole.match(/^h[2-6]$/) ? subRole : "h2";
      description = `<${tag} class="heading mb-0 ditto-extract-subheading">${escapeHtmlPlain(sub)}</${tag}>`;
    } else if (
      !userD &&
      sub &&
      (subRole === "p" || subRole === "div" || subRole === "")
    ) {
      /* Eyebrow + H1 layout: subtitle is hero body copy (not a subheading heading tag). */
      const subHtml = String(hero.text.subtitleHtml || "").trim();
      description = subHtml || `<p>${escapeHtmlPlain(sub)}</p>`;
    }
  } else {
    heading = mainTitle || undefined;
  }

  if (!userD && hero && hero.found && hero.text && !(heading && mainTitle && String(hero.text.preheading || "").trim())) {
    const preHtml = String(hero.text.preheadingHtml || "").trim();
    const prePlain = String(hero.text.preheading || "").trim();
    const preBlock =
      preHtml || prePlain
        ? preHtml
          ? `<div class="ditto-extract-preheading">${preHtml}</div>`
          : `<div class="ditto-extract-preheading">${escapeHtmlPlain(prePlain)}</div>`
        : "";

    const role = String(hero.text.subtitleRole || "").toLowerCase();
    let rest = "";
    if (hero.text.subtitleHtml && !/^h[2-6]$/.test(role)) {
      rest = String(hero.text.subtitleHtml).trim();
    } else if (hero.text.subtitle && !/^h[2-6]$/.test(role)) {
      const t = String(hero.text.subtitle).trim();
      if (t) {
        rest = `<p>${escapeHtmlPlain(t)}</p>`;
      }
    }

    if (preBlock || rest) {
      description = description ? `${description}${preBlock}${rest}` : `${preBlock}${rest}`;
    }
  }

  if (heading || description) {
    applyPreviewHeroDefaultsToCopy(themeRoot, { heading, description }, previewBasename);
  }

  if (description && !userD) {
    patchPreviewHeroLeadTextDefault(themeRoot, false, previewBasename);
  }

  if (
    !userH &&
    hero &&
    hero.found &&
    hero.text &&
    String(hero.text.preheading || "").trim() &&
    mainTitle
  ) {
    const fp = path.join(themeRoot, "templates", previewBasename);
    if (fs.existsSync(fp)) {
      let h = fs.readFileSync(fp, "utf8");
      const escTitle = hubLInnerForSingleQuotedDefault(mainTitle);
      if (h.includes("hero_heading_2|default('')")) {
        h = h.replace(/hero_heading_2\|default\(''\)/, `hero_heading_2|default('${escTitle}')`);
      }
      if (h.includes("hero_heading_size|default('h1')")) {
        h = h.replace(
          /hero_heading_size\|default\('h1'\)/,
          `hero_heading_size|default('h3')`,
        );
      }
      if (h.includes("hero_heading_2_size|default('h2')")) {
        h = h.replace(
          /hero_heading_2_size\|default\('h2'\)/,
          `hero_heading_2_size|default('h1')`,
        );
      }
      fs.writeFileSync(fp, h, "utf8");
    }
  }
}

const DND_CTA_EXT_MARKER = "{# dnd-cta-bg-ext #}";

function hubSpotHeroBackgroundPositionFromCss(positionStr) {
  const p = String(positionStr || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (!p || p === "center" || p === "50% 50%" || (p.includes("50%") && p.includes("center"))) {
    return "MIDDLE_CENTER";
  }
  if (/\b100%\b/.test(p) && /\b0%\b/.test(p)) {
    return "TOP_RIGHT";
  }
  const has = (w) => p.includes(w);
  if (has("top") && has("left")) {
    return "TOP_LEFT";
  }
  if (has("top") && has("right")) {
    return "TOP_RIGHT";
  }
  if (has("bottom") && has("left")) {
    return "BOTTOM_LEFT";
  }
  if (has("bottom") && has("right")) {
    return "BOTTOM_RIGHT";
  }
  if (has("top") && !has("left") && !has("right")) {
    return "TOP_CENTER";
  }
  if (has("bottom") && !has("left") && !has("right")) {
    return "BOTTOM_CENTER";
  }
  if (has("left") && !has("top") && !has("bottom")) {
    return "MIDDLE_LEFT";
  }
  if (has("right") && !has("top") && !has("bottom")) {
    return "MIDDLE_RIGHT";
  }
  return "MIDDLE_CENTER";
}

function hubSpotHeroBackgroundSizeFromCss(sizeStr) {
  const s = String(sizeStr || "").toLowerCase();
  if (s.includes("contain")) {
    return "contain";
  }
  if (/\d/.test(s) && (s.includes("px") || s.includes("rem") || s.includes("vw"))) {
    return "contain";
  }
  return "cover";
}

/**
 * Bakes hero **background image** or **solid color** from typography-extract `hero.background` into SR Hero preview defaults.
 * Skips when the user extended the DnD block with custom CTA/bg (`dnd-cta-bg-ext`) or passed explicit hero bg fields.
 *
 * @returns {boolean}
 */
function applyExtractedHeroBackgroundToPreview(
  themeRoot,
  hero,
  body = {},
  previewBasename = "preview.html",
) {
  if (body.typographySkipHeroBackground === true) {
    return false;
  }
  if (body.heroBackgroundHex || body.backgroundHex || body.heroBackgroundUrl) {
    return false;
  }
  if (!hero || !hero.found || !hero.background) {
    return false;
  }
  const fp = path.join(themeRoot, "templates", previewBasename);
  if (!fs.existsSync(fp)) {
    return false;
  }
  let h = fs.readFileSync(fp, "utf8");
  if (h.includes("ditto-hero-bg-extract")) {
    return false;
  }
  if (h.includes(DND_CTA_EXT_MARKER)) {
    return false;
  }

  const bg = hero.background;
  const preferred =
    (bg.recommendedImageUrl && String(bg.recommendedImageUrl).trim()) ||
    (Array.isArray(bg.imageUrls) && bg.imageUrls[0] ? String(bg.imageUrls[0]).trim() : "");
  const url = preferred;
  let patched = false;

  if (url && /^https?:\/\//i.test(url)) {
    const inner = JSON.stringify({
      src: url,
      background_position: hubSpotHeroBackgroundPositionFromCss(
        bg.backgroundPosition || bg.backdrop?.backgroundPosition,
      ),
      background_size: hubSpotHeroBackgroundSizeFromCss(
        bg.backgroundSize || bg.backdrop?.backgroundSize,
      ),
    })
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'");
    h = h.replace(
      /\{\{\s*request\.query_dict\.hero_bg_option\|default\('color'\)\s*\}\}/,
      "{{ request.query_dict.hero_bg_option|default('image') }}",
    );
    h = h.replace(
      /\{\{\s*request\.query_dict\.hero_bg_image\|default\('[^']*'\)\s*\}\}/,
      `{{ request.query_dict.hero_bg_image|default('${inner}') }}`,
    );
    h = h.replace(
      /(\{%\s*module_attribute\s+"design_settings\.background_option"\s*%\}\s*\r?\n)/,
      `$1\t\t\t\t\t\t{# ditto-hero-bg-extract #}\n`,
    );
    const solidUnder = normalizeTypographyHexColor(
      String(bg.backgroundColor || bg.backdrop?.backgroundColor || ""),
    );
    if (solidUnder) {
      const cust = hubLBackgroundCustomJsonFromHex(solidUnder)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_bg_color\|default\('primary'\)\s*\}\}/,
        "{{ request.query_dict.hero_bg_color|default('custom') }}",
      );
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_bg_custom\|default\('(?:[^'\\]|\\.)*'\)\s*\}\}/,
        `{{ request.query_dict.hero_bg_custom|default('${cust}') }}`,
      );
    }
    patched = true;
  } else {
    const solid = normalizeTypographyHexColor(
      String(bg.backgroundColor || bg.backdrop?.backgroundColor || ""),
    );
    if (solid) {
      const cust = hubLBackgroundCustomJsonFromHex(solid)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_bg_color\|default\('primary'\)\s*\}\}/,
        "{{ request.query_dict.hero_bg_color|default('custom') }}",
      );
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_bg_custom\|default\('(?:[^'\\]|\\.)*'\)\s*\}\}/,
        `{{ request.query_dict.hero_bg_custom|default('${cust}') }}`,
      );
      h = h.replace(
        /(\{%\s*module_attribute\s+"design_settings\.background_color"\s*%\}\s*\r?\n)/,
        `$1\t\t\t\t\t\t{# ditto-hero-bg-extract #}\n`,
      );
      patched = true;
    }
  }

  if (patched) {
    h = h.replace(
      /\{\{\s*request\.query_dict\.hero_parallax\|default\(true\)\s*\}\}/,
      "{{ request.query_dict.hero_parallax|default(false) }}",
    );
    h = repairMalformedPreviewHeroHubL(h);
    fs.writeFileSync(fp, h, "utf8");
  }
  return patched;
}

function hubLLinkFieldJsonFromHref(href) {
  return JSON.stringify({
    url: { type: "EXTERNAL", href, content_id: null },
    open_in_new_tab: true,
    no_follow: false,
    sponsored: false,
    user_generated_content: false,
  });
}

function hubLBackgroundCustomJsonFromHex(hex) {
  return JSON.stringify({ color: hex, opacity: 100 });
}

function hubLSingleQuotedJsonDefault(objOrStr) {
  const raw = typeof objOrStr === "string" ? objOrStr : JSON.stringify(objOrStr);
  return raw.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * Bakes typography-extract **`hero`** into SR Hero defaults in `preview.html`:
 * second heading row (`hero_heading_*`), `text_align`, CTA labels / links / `cta_style` (SR enums).
 * Skipped when `{# dnd-cta-bg-ext #}` is present or `typographySkipHeroModuleSnap` is true.
 *
 * @param {string} themeRoot
 * @param {{ hero?: Record<string, unknown> }} typographyExtract
 * @param {Record<string, unknown>} body
 */
function applyExtractedHeroModuleFieldsFromTypographyApi(
  themeRoot,
  typographyExtract,
  body = {},
  previewBasename = "preview.html",
) {
  if (body.typographySkipHeroModuleSnap === true) {
    return;
  }
  const hero = typographyExtract?.hero;
  if (!hero?.found) {
    return;
  }
  const fp = path.join(themeRoot, "templates", previewBasename);
  if (!fs.existsSync(fp)) {
    return;
  }
  let h = fs.readFileSync(fp, "utf8");
  if (h.includes(DND_CTA_EXT_MARKER)) {
    return;
  }
  if (h.includes("ditto-extract-hero-module")) {
    return;
  }
  let patched = false;

  const userH2 = String(body.heroHeading2 || body.hero_heading_2 || "").trim();
  const sub = String(hero.text?.subtitle || "").trim();
  const subRole = String(hero.text?.subtitleRole || "").toLowerCase();
  const preEyebrow = String(hero.text?.preheading || "").trim();
  const mainTitle = String(hero.text?.title || "").trim();
  const threeTierEyebrow =
    Boolean(preEyebrow && mainTitle) &&
    sub &&
    /^h[2-6]$/.test(subRole);
  if (sub && !userH2 && /^h[2-6]$/.test(subRole) && !threeTierEyebrow) {
    const esc = hubLInnerForSingleQuotedDefault(sub);
    if (h.includes("hero_heading_2|default('')")) {
      h = h.replace(/hero_heading_2\|default\(''\)/, `hero_heading_2|default('${esc}')`);
      patched = true;
    }
    const disp = String(hero.text.subtitleDisplaySize || "").trim();
    if (
      disp &&
      disp !== "auto" &&
      /^(?:h[1-6]|display-[1-4])$/i.test(disp)
    ) {
      if (h.includes("hero_heading_2_display_size|default('auto')")) {
        h = h.replace(
          /hero_heading_2_display_size\|default\('auto'\)/,
          `hero_heading_2_display_size|default('${disp.replace(/'/g, "\\'")}')`,
        );
        patched = true;
      }
    }
    const hsz = String(hero.text.subtitleHeadingSize || "").toLowerCase();
    if (/^h[1-6]$/.test(hsz) && hsz !== "h2") {
      h = h.replace(
        /hero_heading_2_size\|default\('h2'\)/,
        `hero_heading_2_size|default('${hsz.replace(/'/g, "\\'")}')`,
      );
      patched = true;
    }
  }

  const align = hero.layout?.textAlign;
  if (
    align &&
    typeof align === "string" &&
    /^(LEFT|RIGHT|CENTER)$/i.test(align.trim())
  ) {
    const j = hubLSingleQuotedJsonDefault({
      text_align: align.trim().toUpperCase(),
    });
    if (/\{\{\s*request\.query_dict\.hero_text_align\|default\(/.test(h)) {
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_text_align\|default\('(?:[^'\\]|\\.)*'\)\s*\}\}/,
        `{{ request.query_dict.hero_text_align|default('${j}') }}`,
      );
      patched = true;
    }
  }

  const ctas = Array.isArray(hero.ctas) ? hero.ctas : [];
  const c1 = ctas[0];
  const c2 = ctas[1];

  if (ctas.length <= 1 && h.includes("hero_cta2_text|default('Test button Two')")) {
    h = h.replace(
      /hero_cta2_text\|default\('Test button Two'\)/,
      `hero_cta2_text|default('')`,
    );
    patched = true;
  }

  if (c1?.label && !String(body.heroCta1Text || body.hero_cta1_text || "").trim()) {
    const e1 = hubLInnerForSingleQuotedDefault(String(c1.label));
    if (h.includes("|default('Test Button One')")) {
      h = h.replace(
        /hero_cta1_text\|default\('Test Button One'\)/,
        `hero_cta1_text|default('${e1}')`,
      );
      patched = true;
    }
  }
  if (c2?.label && !String(body.heroCta2Text || body.hero_cta2_text || "").trim()) {
    const e2 = hubLInnerForSingleQuotedDefault(String(c2.label));
    if (h.includes("|default('Test button Two')")) {
      h = h.replace(
        /hero_cta2_text\|default\('Test button Two'\)/,
        `hero_cta2_text|default('${e2}')`,
      );
      patched = true;
    }
  }

  const userCta1Url =
    body.heroCta1Url ||
    body.hero_cta1_url ||
    body.ctaUrl ||
    "";
  if (c1?.href && !String(userCta1Url).trim()) {
    const lj = hubLSingleQuotedJsonDefault(hubLLinkFieldJsonFromHref(String(c1.href).trim()));
    if (/\{\{\s*request\.query_dict\.hero_cta1_link\|default\(/.test(h)) {
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_cta1_link\|default\('(?:[^'\\]|\\.)*'\)\s*\}\}/,
        `{{ request.query_dict.hero_cta1_link|default('${lj}') }}`,
      );
      patched = true;
    }
  }
  const userCta2Url = body.heroCta2Url || body.hero_cta2_url || "";
  if (c2?.href && !String(userCta2Url).trim()) {
    const lj = hubLSingleQuotedJsonDefault(hubLLinkFieldJsonFromHref(String(c2.href).trim()));
    if (/\{\{\s*request\.query_dict\.hero_cta2_link\|default\(/.test(h)) {
      h = h.replace(
        /\{\{\s*request\.query_dict\.hero_cta2_link\|default\('(?:[^'\\]|\\.)*'\)\s*\}\}/,
        `{{ request.query_dict.hero_cta2_link|default('${lj}') }}`,
      );
      patched = true;
    }
  }

  const ust1 = String(body.heroCta1Style || body.hero_cta1_style || "").trim();
  if (c1?.cta_style && !ust1) {
    const s1 = String(c1.cta_style).replace(/[^a-z0-9_-]/gi, "");
    if (s1) {
      h = h.replace(
        /hero_cta1_style\|default\('gradient_one'\)/,
        `hero_cta1_style|default('${s1}')`,
      );
      patched = true;
    }
  }
  const ust2 = String(body.heroCta2Style || body.hero_cta2_style || "").trim();
  if (c2?.cta_style && !ust2) {
    const s2 = String(c2.cta_style).replace(/[^a-z0-9_-]/gi, "");
    if (s2) {
      h = h.replace(
        /hero_cta2_style\|default\('secondary'\)/,
        `hero_cta2_style|default('${s2}')`,
      );
      patched = true;
    }
  }

  if (patched) {
    h = h.replace(
      /(\{%\s*module_attribute\s+"ctas"\s*%\}\s*\r?\n)/,
      `$1\t\t\t\t\t\t{# ditto-extract-hero-module #}\n`,
    );
    h = repairMalformedPreviewHeroHubL(h);
    fs.writeFileSync(fp, h, "utf8");
  }
}

/**
 * Optional: adds first CTA (button + link) and `custom` background to the DnD block in
 * `templates/preview.html` (working copy only). Bakes install-time defaults; URL query
 * params still map through request.query_dict in HubL where applicable.
 */
function applyDndCtaAndBackgroundDefaults(themeRoot, o = {}) {
  const fp = path.join(themeRoot, "templates", "preview.html");
  if (!fs.existsSync(fp)) {
    return;
  }
  if (!o.extendPreviewDnd && !o.ctaText && !o.ctaUrl && !o.bgHex) {
    return;
  }
  let h = fs.readFileSync(fp, "utf8");
  const href =
    (o.ctaUrl && String(o.ctaUrl).trim()) || "https://www.hubspot.com";
  let hex = (o.bgHex && String(o.bgHex).trim()) || "#1a1a2e";
  if (!/^#[0-9A-Fa-f]{3,8}$/.test(hex)) {
    hex = "#1a1a2e";
  }
  const btn = (o.ctaText && String(o.ctaText).trim()) || "Get started";
  const ext = `
						${DND_CTA_EXT_MARKER}
						{% module_attribute "ctas.0.cta_type" %}btn{% end_module_attribute %}
						{% module_attribute "ctas.0.button_text" %}{{ request.query_dict.hero_cta_text|default('${hubLInnerForSingleQuotedDefault(btn)}') }}{% end_module_attribute %}
						{% module_attribute "ctas.0.link" %}${hubLLinkFieldJsonFromHref(href)}{% end_module_attribute %}
						{% module_attribute "design_settings.background_option" %}custom{% end_module_attribute %}
						{% module_attribute "design_settings.background_custom" %}${hubLBackgroundCustomJsonFromHex(hex)}{% end_module_attribute %}`;
  if (
    !/(\{% module_attribute "description" %\}[\s\S]*?\{% end_module_attribute %\})(\s*)\{% end_dnd_module %\}/.test(
      h,
    )
  ) {
    return;
  }
  h = h.replace(
    /(\{% module_attribute "description" %\}[\s\S]*?\{% end_module_attribute %\})(\s*)\{% end_dnd_module %\}/,
    `$1$2${ext}
					$2{% end_dnd_module %}`,
  );
  fs.writeFileSync(fp, h, "utf8");
}

/**
 * Restores `templates/preview.html` in the working copy from read-only `sr-2026` (no writes to the ref).
 * Ensures each upload starts from a known base before optional hero injection.
 */
function resetPreviewFromReference(themeRoot) {
  const ref = path.join(SR_2026_REF, "templates", "preview.html");
  const target = path.join(themeRoot, "templates", "preview.html");
  if (!fs.existsSync(ref)) {
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(ref, target);
}

/**
 * If client-delivery-theme is missing, clone from read-only sr-2026.
 */
function ensureClientDeliveryCopySync() {
  if (
    fs.existsSync(CLIENT_DELIVERY_THEME) &&
    fs.statSync(CLIENT_DELIVERY_THEME).isDirectory()
  ) {
    return { ok: true, created: false };
  }
  if (!fs.existsSync(SR_2026_REF)) {
    return {
      ok: false,
      created: false,
      reason:
        "sr-2026 is missing. Keep the read-only reference theme in this project.",
    };
  }
  // `prepare-client-theme` script; keeps logic in one place
  const script = path.join(
    __dirname,
    "scripts",
    "clone-sr-2026-to-client-delivery.js",
  );
  try {
    require("child_process").execFileSync(process.execPath, [script], {
      cwd: __dirname,
      encoding: "utf8",
    });
  } catch (e) {
    return {
      ok: false,
      created: false,
      reason: e && e.message ? e.message : String(e),
    };
  }
  return { ok: true, created: true };
}

app.post("/install-theme", async (req, res) => {
  console.log("HIT /install-theme", {
    ...req.body,
    fileOverrides: "(merged server-side)",
  });

  let fileOverrides = [];
  try {
    fileOverrides = readSrHero01FileOverrides();
    console.log(
      "Injected my-theme SR Hero 01.module files:",
      fileOverrides.map((f) => f.path).join(", ") || "(none)",
    );
  } catch (e) {
    console.error("readSrHero01FileOverrides:", e.message);
  }

  const incoming = Array.isArray(req.body.fileOverrides)
    ? req.body.fileOverrides
    : [];
  const byPath = new Map(incoming.map((o) => [o.path, o]));
  for (const o of fileOverrides) {
    byPath.set(o.path, o);
  }

  try {
    const payload = {
      ...req.body,
      userToken: DEMO_TOKEN,
      fileOverrides: Array.from(byPath.values()),
    };

    const response = await fetch(INSTALLER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("HubSpot installer response (raw):", text.slice(0, 2000));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // HubSpot often returns HTTP 200 with { error: "..." } when the serverless handler throws.
    const clientStatus =
      data && data.error && !data.status ? 502 : response.status || 200;
    res.status(clientStatus).json(data);
  } catch (err) {
    console.error("install-theme error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Uploads a working copy of the theme (not sr-2026) to a new Design Manager path.
 * The copy is created with `npm run prepare-client-theme` (or on first use).
 * Relies on global HubSpot CLI auth (`hs cms auth` / `hs account auth`) on this machine.
 * On Windows, npx/hs is run through the shell to avoid `spawn EINVAL`.
 */
/** Quick check the browser can reach this app (use http://localhost:3000, not a file or Live Server). */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "spocket-rocket-ditto",
    hasThemeClone: true,
    hasThemeCloneSlim: true,
    hasCmsPageApiToken: Boolean(resolveCmsPat()),
    hasSrPreviewPublish: Boolean(previewPublishToken()),
    srPreviewApiBase: previewApiBaseUrl(),
    typographyExtractBaseUrl: TYPOGRAPHY_EXTRACT_BASE_URL,
    typographyExtractEndpoint: getTypographyExtractPostUrl(),
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/**
 * Proxies typography extraction so the UI can POST same-origin (`/api/typography-extract`)
 * instead of hitting the typography service port directly from the browser.
 */
/**
 * Lookup saved typography for a URL (ignores timestamp). Reads `typography-extract-cache/website-typography-index.json`.
 *
 * Query: website_url | url
 * Body (POST): same fields; optional force_refresh only affects extract routes, not this GET.
 */
app.get("/api/typography-website-cache", (req, res) => {
  try {
    const parsed = parseTypographyWebsiteUrlsFromQuery(req.query, validateHttpUrlTypography, {
      maxUrls: TYPO_BATCH_MAX_URLS,
    });
    if (!parsed.urls.length) {
      return res.status(400).json({
        ok: false,
        error: parsed.error || "Invalid URL",
        invalid: parsed.invalid.length ? parsed.invalid : undefined,
      });
    }
    if (parsed.urls.length === 1) {
      const hit = findCachedWebsiteTypography(__dirname, parsed.urls[0].websiteUrl);
      return res.json(hit);
    }
    const results = parsed.urls.map((entry) => {
      const hit = findCachedWebsiteTypography(__dirname, entry.websiteUrl);
      return {
        website_url: entry.websiteUrl,
        cache_hit: Boolean(hit.cache_hit),
        ...hit,
      };
    });
    return res.json({
      ok: true,
      multi: true,
      website_urls: parsed.urls.map((u) => u.websiteUrl),
      invalid: parsed.invalid.length ? parsed.invalid : undefined,
      truncated: parsed.truncated || undefined,
      results,
    });
  } catch (e) {
    console.error("[typography-website-cache]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

app.post("/api/typography-website-cache/rebuild", (req, res) => {
  try {
    const r = rebuildIndexFromAuditFiles(__dirname);
    return res.json({ ok: true, ...r });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} b
 */
async function handleTypographyExtractPlaywrightSingle(websiteUrl, b) {
  if (!typographyCacheForceRefresh(b)) {
    const cached = findCachedWebsiteTypography(__dirname, websiteUrl);
    if (cached.cache_hit && cached.playwright_extract) {
      return {
        status: 200,
        body: {
          ok: true,
          from_website_cache: true,
          cache_saved_at: cached.saved_at,
          cache_index_file: cached.index_file,
          ...(/** @type {Record<string, unknown>} */ (cached.playwright_extract)),
        },
      };
    }
  }
  const r = await postTypographyExtractJson(websiteUrl, {
    includeHeroScreenshot: Boolean(b.include_hero_screenshot),
  });
  if (!r.ok) {
    const status = typeof r.status === "number" && r.status >= 400 ? r.status : 502;
    return {
      status,
      body: {
        ok: false,
        upstreamStatus: r.status,
        error:
          (r.data && (r.data.error || r.data.message)) ||
          r.rawText ||
          `Typography upstream failed (${r.status})`,
      },
    };
  }
  const data = r.data && typeof r.data === "object" ? r.data : {};
  const bodyOut = { ok: true, ...data };
  try {
    const cached = persistTypographyExtractToCache(__dirname, {
      websiteUrl,
      source: "typography_extract_playwright",
      response: bodyOut,
    });
    if (cached.audit_file) {
      bodyOut.audit_file = cached.audit_file;
    }
  } catch (eCache) {
    console.warn("[typography-website-cache] playwright persist:", eCache.message || eCache);
  }
  return { status: 200, body: bodyOut };
}

app.post("/api/typography-extract", async (req, res) => {
  try {
    return await dispatchTypographyExtract(
      req,
      res,
      async (websiteUrl, b) => {
        try {
          return await handleTypographyExtractPlaywrightSingle(websiteUrl, b);
        } catch (e) {
          console.error("[typography-extract proxy]", e);
          return { status: 500, body: { ok: false, error: e.message || String(e) } };
        }
      },
      typographyBatchDispatchOpts(),
    );
  } catch (e) {
    console.error("[typography-extract]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * AI-only typography extraction.
 * Fetches the page HTML and asks OpenAI to infer typography (no Playwright).
 * Useful when (a) the typography service is down, or (b) you want a second opinion
 * to compare against the computed-style truth from the Playwright extractor.
 *
 * Body: {
 *   website_url | websiteUrl | url,
 *   include_hero_ai?: boolean (default true) — second OpenAI call for hero + SR mapping preview,
 *   compare_sr_hero_01?: boolean (default true) — third OpenAI call + LightRAG for fit vs SR Hero 01,
 *   include_lightrag_for_typography?: boolean (default false) — include graphml excerpt
 *     from cache/lightrag/.lightrag_data + naive vector hits + SR markdown slices in the
 *     typography OpenAI prompt (same bundle style as theme-inject-plan).
 *   playwright_extract?: object — **optional** full JSON from `POST /api/typography-extract` (Playwright).
 *     When present, same `website_url`, and `typography_full_page` exists, Ditto **skips** OpenAI
 *     typography extraction and fills `typography_ai` from computed styles (h1/body px, font stacks)
 *     plus **`playwright_typography_full_page`**: a deep copy of `typography_full_page` so consumers
 *     and AI→theme synth get **exact** heading/body/link/button metrics (not only `approximate_scale`).
 *     If `hero.found`, also skips OpenAI hero and builds `hero_ai` from the Playwright hero block
 *     (unless `force_openai_hero: true`). Use `force_openai_typography: true` to ignore the bundle for fonts.
 *     **Server Playwright is opt-in:** set `use_server_playwright: true` on the body or `DITTO_SERVER_PLAYWRIGHT_ON_PURPLE=1`
 *     in env so Ditto POSTs to `TYPOGRAPHY_EXTRACT_BASE_URL` when `playwright_extract` is omitted. Default is **AI-only**
 *     (HTML + OpenAI) for this route.
 *   website_urls | websiteUrls — array or newline/comma-separated (batch; max DITTO_TYPO_BATCH_MAX_URLS),
 *   openai_api_key?, openai_model?
 * }
 */
/**
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} b
 */
/** Purple endpoint — typography/fonts via Playwright only (same as `/api/typography-extract`). */
async function handleTypographyExtractAiSingle(websiteUrl, b) {
  const out = await handleTypographyExtractPlaywrightSingle(websiteUrl, b);
  if (out.body && typeof out.body === "object") {
    out.body.extraction_mode = "playwright";
    out.body._ditto_routed_from = "typography-extract-ai";
  }
  return out;
}

app.post("/api/typography-extract-ai", async (req, res) => {
  try {
    return await dispatchTypographyExtract(
      req,
      res,
      async (websiteUrl, body) => {
        try {
          return await handleTypographyExtractAiSingle(websiteUrl, body);
        } catch (e) {
          console.error("[typography-extract-ai]", e);
          return { status: 500, body: { ok: false, error: e.message || String(e) } };
        }
      },
      typographyBatchDispatchOpts(),
    );
  } catch (e) {
    console.error("[typography-extract-ai]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} b
 */
/** Green endpoint — typography/fonts via Playwright only (same as `/api/typography-extract`). */
async function handleTypographyExtractUrlWebSingle(websiteUrl, b) {
  const out = await handleTypographyExtractPlaywrightSingle(websiteUrl, b);
  if (out.body && typeof out.body === "object") {
    out.body.extraction_mode = "playwright";
    out.body._ditto_routed_from = "typography-extract-url";
  }
  return out;
}

app.post("/api/typography-extract-url", async (req, res) => {
  try {
    return await dispatchTypographyExtract(
      req,
      res,
      async (websiteUrl, body) => {
        try {
          return await handleTypographyExtractUrlWebSingle(websiteUrl, body);
        } catch (e) {
          console.error("[typography-extract-url]", e);
          return { status: 500, body: { ok: false, error: e.message || String(e) } };
        }
      },
      typographyBatchDispatchOpts(),
    );
  } catch (e) {
    console.error("[typography-extract-url]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * Load per-URL extracts from request body (single-URL only) or website-typography-index.
 */
function cachedExtractsForDecision(websiteUrl, b) {
  let pwExtract = b.playwright_extract || b.playwrightExtract || null;
  let urlSnap = b.typography_extract_url || b.typographyExtractUrl || null;
  let purpleSnap = b.typography_extract_ai || b.typographyExtractAi || null;
  let aiTypography = b.ai_typography || b.typography_ai || b.typographyAi || null;
  /** @type {Record<string, unknown>|null} */
  let websiteCacheUsed = null;
  if (!typographyCacheForceRefresh(b)) {
    const hit = findCachedWebsiteTypography(__dirname, websiteUrl);
    if (hit.cache_hit) {
      if (!pwExtract && hit.playwright_extract) {
        pwExtract = /** @type {Record<string, unknown>} */ (hit.playwright_extract);
      }
      if (!urlSnap && hit.typography_extract_url) {
        urlSnap = /** @type {Record<string, unknown>} */ (hit.typography_extract_url);
      }
      if (!purpleSnap && hit.typography_extract_ai) {
        purpleSnap = /** @type {Record<string, unknown>} */ (hit.typography_extract_ai);
      }
      if (!aiTypography) {
        const urlTa =
          hit.typography_extract_url &&
          typeof hit.typography_extract_url === "object"
            ? hit.typography_extract_url.typography_ai
            : null;
        if (typographyAiHasUsableFonts(urlTa)) {
          aiTypography = urlTa;
        } else if (
          hit.typography_extract_ai &&
          typeof hit.typography_extract_ai === "object" &&
          typographyAiHasUsableFonts(hit.typography_extract_ai.typography_ai)
        ) {
          aiTypography = hit.typography_extract_ai.typography_ai;
        }
      }
      websiteCacheUsed = {
        saved_at: hit.saved_at,
        index_file: hit.index_file,
        source: hit.source,
        audit_file: hit.audit_file || null,
      };
    }
  }
  return { pwExtract, urlSnap, purpleSnap, aiTypography, websiteCacheUsed };
}

/**
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} b
 */
async function handleSrDecisionForUrl(websiteUrl, b) {
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  const model = b.openai_model || b.openaiModel || process.env.OPENAI_MODEL || "gpt-5.5";
  const vectorK = Math.min(
    24,
    Math.max(4, parseInt(String(b.vector_k || b.vectorK || "10"), 10) || 10),
  );
  const { pwExtract, urlSnap, purpleSnap, aiTypography, websiteCacheUsed } =
    cachedExtractsForDecision(websiteUrl, b);
  const out = await runSrDecisionLightrag({
    projectRoot: __dirname,
    websiteUrl,
    apiKey,
    model,
    vectorK,
    playwrightExtract: pwExtract,
    typographyExtractUrl: urlSnap,
    typographyExtractAi: purpleSnap,
    aiTypography,
    enableWebSearch: b.enable_web_search !== false && b.enableWebSearch !== false,
    includeLegacySrHeroPipeline:
      b.include_legacy_sr_hero_pipeline !== false &&
      b.includeLegacySrHeroPipeline !== false,
  });
  const status = out.ok ? 200 : out.http_status || 502;
  return {
    status,
    body: {
      ...out,
      website_url: websiteUrl,
      ...(websiteCacheUsed ? { from_website_cache: true, website_cache: websiteCacheUsed } : {}),
    },
  };
}

/**
 * SR Hero 01 / module decision per URL (batch when `website_urls` is set).
 */
app.post("/api/sr-decision-lightrag", async (req, res) => {
  const b = req.body || {};
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      ok: false,
      error: "OPENAI_API_KEY missing in env (or pass openai_api_key in body).",
    });
  }
  const t0 = Date.now();
  try {
    return await dispatchTypographyExtract(
      req,
      res,
      async (websiteUrl, body) => {
        try {
          return await handleSrDecisionForUrl(websiteUrl, body);
        } catch (e) {
          console.error("[sr-decision-lightrag]", e);
          return { status: 500, body: { ok: false, error: e.message || String(e), website_url: websiteUrl } };
        }
      },
      { ...typographyBatchDispatchOpts(), concurrency: 1 },
    );
  } catch (e) {
    console.error("[sr-decision-lightrag]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e), elapsed_ms: Date.now() - t0 });
  }
});

/**
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} b
 */
async function handleThemeInjectPlanForUrl(websiteUrl, b) {
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  const model = b.openai_model || b.openaiModel || process.env.OPENAI_MODEL || "gpt-5.5";
  const vectorK = Math.min(
    24,
    Math.max(4, parseInt(String(b.vector_k || b.vectorK || "10"), 10) || 10),
  );
  let playwrightExtract = b.playwright_extract || b.playwrightExtract || null;
  if (!typographyCacheForceRefresh(b)) {
    const hit = findCachedWebsiteTypography(__dirname, websiteUrl);
    if (hit.cache_hit && !playwrightExtract && hit.playwright_extract) {
      playwrightExtract = hit.playwright_extract;
    }
  }
  if (!isUsablePlaywrightExtract(playwrightExtract, websiteUrl)) {
    return {
      status: 400,
      body: {
        ok: false,
        website_url: websiteUrl,
        error: `Run Playwright typography extract for ${websiteUrl} first (POST /api/typography-extract or any extract button — all use Playwright).`,
      },
    };
  }
  const out = await runThemeInjectPlanFromCache({
    projectRoot: __dirname,
    websiteUrl,
    apiKey,
    model,
    vectorK,
    playwrightExtract,
  });
  const status = out.ok ? 200 : out.http_status || 502;
  return {
    status,
    body: {
      ...out,
      website_url: websiteUrl,
      openai_transport: preferOpenAiResponsesApi(model) ? "responses" : "chat_completions",
    },
  };
}

/**
 * AI theme inject plan per URL (batch when `website_urls` is set). Needs green or purple per site in index.
 */
app.post("/api/theme-inject-plan", async (req, res) => {
  const b = req.body || {};
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      ok: false,
      error: "OPENAI_API_KEY missing in env (or pass openai_api_key in body).",
    });
  }
  const t0 = Date.now();
  try {
    return await dispatchTypographyExtract(
      req,
      res,
      async (websiteUrl, body) => {
        try {
          return await handleThemeInjectPlanForUrl(websiteUrl, body);
        } catch (e) {
          console.error("[theme-inject-plan]", e);
          return { status: 500, body: { ok: false, error: e.message || String(e), website_url: websiteUrl } };
        }
      },
      { ...typographyBatchDispatchOpts(), concurrency: 1 },
    );
  } catch (e) {
    console.error("[theme-inject-plan]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e), elapsed_ms: Date.now() - t0 });
  }
});

/**
 * Status: real LightRAG server (if running) + local naive vector store.
 */
app.get("/api/lightrag/status", async (req, res) => {
  try {
    const [serverHealth, vdb] = await Promise.all([
      lightragClient.isAlive(),
      Promise.resolve(lightragLoadVdb(__dirname)),
    ]);
    return res.json({
      ok: true,
      lightrag_server: {
        alive: serverHealth.ok,
        url: lightragClient.DEFAULT_URL,
        info: serverHealth.info,
        error: serverHealth.error,
      },
      naive_store: vdb
        ? {
            ingested: true,
            model: vdb.model,
            dim: vdb.dim,
            chunk_count: vdb.chunks?.length || 0,
            created_at: vdb.created_at,
          }
        : {
            ingested: false,
            message:
              "vdb_chunks.json not found. Run `npm run ingest:lightrag` (naive vectors).",
          },
      hint: serverHealth.ok
        ? "LightRAG server is up — /api/hero-match will use it (mode=lightrag_server)."
        : "LightRAG server not detected — falling back to naive vectors. Start it with `npm run lightrag:server`.",
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * Run the embeddings ingest from the UI / curl (writes cache/lightrag/.lightrag_data/*).
 * Body (optional): { force?: boolean, model?: string, openai_api_key?: string }
 */
app.post("/api/lightrag/ingest", async (req, res) => {
  const b = req.body || {};
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ ok: false, error: "OPENAI_API_KEY missing" });
  }
  try {
    const r = await lightragIngestSourceDir({
      projectRoot: __dirname,
      apiKey,
      model: b.model || process.env.OPENAI_EMBEDDING_MODEL || LIGHTRAG_DEFAULT_EMBED_MODEL,
      force: Boolean(b.force),
      log: (m) => console.log(m),
    });
    return res.json({ ok: true, ...r });
  } catch (e) {
    console.error("[lightrag/ingest]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * Quick retrieval probe — POST { query, k? }.
 */
app.post("/api/lightrag/query", async (req, res) => {
  const b = req.body || {};
  const query = String(b.query || "").trim();
  const apiKey = b.openai_api_key || b.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!query) return res.status(400).json({ ok: false, error: "query is required" });
  if (!apiKey) return res.status(400).json({ ok: false, error: "OPENAI_API_KEY missing" });
  try {
    const r = await lightragRetrieveTopK({
      projectRoot: __dirname,
      query,
      k: Number(b.k) > 0 ? Number(b.k) : 6,
      apiKey,
    });
    return res.json(r);
  } catch (e) {
    console.error("[lightrag/query]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * Playwright typography extract + HTML fetch + OpenAI typography inference + SR Hero 01 fit decision
 * (LightRAG-style context from `cache/lightrag/source/*.md`).
 */
app.post("/api/hero-match", async (req, res) => {
  const b = req.body || {};
  const raw = String(
    b.website_url ||
      b.websiteUrl ||
      b.typographyWebsiteUrl ||
      b.typography_website_url ||
      b.url ||
      "",
  ).trim();
  const v = validateHttpUrlTypography(raw);
  if (!v.ok) {
    return res.status(400).json({ ok: false, error: v.error || "Invalid URL" });
  }
  try {
    const result = await runHeroMatchPipeline({
      websiteUrl: v.websiteUrl,
      projectRoot: __dirname,
      includeHeroScreenshot: Boolean(b.include_hero_screenshot),
      openaiApiKey: b.openai_api_key || b.openaiApiKey,
      openaiModel: b.openai_model || b.openaiModel,
    });
    if (!result.ok) {
      return res.status(400).json({ ok: false, error: result.error });
    }
    return res.json({ ok: true, ...result });
  } catch (e) {
    console.error("[hero-match]", e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

/**
 * @param {string} s
 * @returns {string} single path segment, safe for HubSpot Design Manager
 */
function sanitizeThemeDestSegment(s) {
  return String(s || "")
    .replace(/^\//, "")
    .replace(/\/+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/^-+|-+$/g, "");
}

function newUniqueThemeToken() {
  // Short segment for HubSpot file-tree and Search assets; unique enough to avoid overwrites.
  return Date.now().toString(36) + Math.random().toString(16).slice(2, 6);
}

/**
 * Every run targets a **new** root folder in HubSpot unless the client sets `allowReuseDest: true`
 * (intentional overwrite of the same path). Otherwise we append `...-t<timestamp-random>`.
 * @param {object|undefined} body
 * @param {"full"|"slim"} mode
 */
function resolveThemeDestPath(body, mode) {
  const b = body || {};
  const allowReuse = b.allowReuseDest === true;
  const rawSuffix = b.suffix || `clone-${Date.now()}`;
  const suffix =
    String(rawSuffix).replace(/[^a-zA-Z0-9-_]/g, "") || `clone-${Date.now()}`;
  const defaultPrefix =
    mode === "slim" ? "sr-slim" : mode === "ref" ? "sr-2026-work" : "sr-delivery";
  const defaultName = `${defaultPrefix}-${suffix}`;

  const raw =
    (b.newThemeName && String(b.newThemeName)) ||
    (b.themeName && String(b.themeName)) ||
    "";
  let base = sanitizeThemeDestSegment(raw) || defaultName;
  if (base.length > 40) {
    base = base.slice(0, 40).replace(/-+$/g, "");
  }

  if (allowReuse) {
    return {
      dest: base,
      destPath: `/${base}`,
      nameBase: base,
      uniqueToken: null,
      allowReuseDest: true,
    };
  }
  const token = newUniqueThemeToken();
  let dest = `${base}-t${token}`;
  // Design Manager search and the CLI list output are easier to scan when the segment stays ~short.
  if (dest.length > 70) {
    const fb =
      defaultName.length > 35
        ? String(defaultName).slice(0, 30).replace(/-+$/g, "")
        : String(defaultName);
    dest = `${fb}-t${token}`;
  }
  if (dest.length > 70) {
    dest = `sr-t${token}`;
  }
  return {
    dest,
    destPath: `/${dest}`,
    nameBase: base,
    uniqueToken: token,
    allowReuseDest: false,
  };
}

/**
 * @param {{ method?: string }|null|undefined} verification
 * @returns {string}
 */
/**
 * HubSpot folder `sr-2026` is treated as a protected reference name — never overwrite via Ditto unless explicitly opted in.
 * @param {string} destPath e.g. `/sr-2026-work-abc-txyz`
 * @param {object} [body]
 */
function assertSafeHubspotThemeDest(destPath, body) {
  const allowReuse = body && body.allowReuseDest === true;
  const seg = String(destPath || "")
    .replace(/^\//, "")
    .split("/")[0]
    .toLowerCase();
  if (allowReuse && seg === "sr-2026" && process.env.HUBSPOT_ALLOW_SR2026_OVERWRITE !== "1") {
    const err = new Error(
      "Refusing allowReuseDest for /sr-2026 — that overwrites the reference theme on HubSpot. Uncheck “Reuse path”, use a new folder name, or set HUBSPOT_ALLOW_SR2026_OVERWRITE=1 if you truly intend to overwrite.",
    );
    err.code = "PROTECTED_DEST";
    throw err;
  }
}

function humanUploadVerifyLine(verification) {
  const m = (verification && verification.method) || "";
  if (m === "pathList" || m === "pathListPolled") {
    return "path list includes theme files (e.g. theme.json / templates)";
  }
  if (m === "rootListInitial" || m === "rootListPolled") {
    return "folder name appears in `hs cms list /` (same signal as the Design Manager file tree)";
  }
  return "post-upload check passed";
}

app.post("/api/theme-clone", async (req, res) => {
  const t0 = Date.now();
  const resolved = resolveThemeDestPath(req.body, "full");
  const { dest, destPath } = resolved;

  try {
    assertSafeHubspotThemeDest(destPath, req.body);
  } catch (e) {
    if (e.code === "PROTECTED_DEST") {
      return res.status(403).json({ ok: false, error: e.message, dest: destPath });
    }
    throw e;
  }

  console.log(
    "[theme-clone] start",
    destPath,
    resolved.allowReuseDest ? "(reuse path)" : "(new folder)",
  );
  const ensured = ensureClientDeliveryCopySync();
  console.log(
    "[theme-clone] after ensure copy:",
    Date.now() - t0,
    "ms",
    ensured.created
      ? "(created client-delivery-theme; first run is slow)"
      : "(folder already on disk)",
  );
  if (!ensured.ok) {
    return res.status(503).json({
      ok: false,
      status: "UNREADY",
      dest: destPath,
      error:
        "Client delivery theme not ready. Run: npm run prepare-client-theme",
      detail: ensured.reason || "unknown",
    });
  }

  const themeRoot = CLIENT_DELIVERY_THEME;
  let b;
  let aiTypographyInject = null;
  try {
    const resolvedUpload = resolveThemeUploadBody(req.body || {});
    b = resolvedUpload.body;
    aiTypographyInject = resolvedUpload.aiTypographyInject;
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || String(e) });
  }
  const account =
    (b.account && String(b.account)) ||
    process.env.HUBSPOT_CLI_ACCOUNT ||
    process.env.HUBSPOT_ACCOUNT ||
    "";
  let typographySynth = {
    typography: null,
    typographyExtract: null,
    applied: false,
    cssWritten: false,
    fetchedUpstream: false,
    prototypeFallback: false,
    prototypeFallbackReasons: [],
    typographySkippedNonPortable: false,
  };
  try {
    resetPreviewFromReference(themeRoot);
    applyPreviewHeroDefaultsToCopy(themeRoot, {
      heading: b.heroHeading || b.hero_heading,
      description: b.heroDescription || b.hero_description,
    });
    applyDndCtaAndBackgroundDefaults(themeRoot, {
      extendPreviewDnd: Boolean(b.extendPreviewDnd),
      ctaText: b.heroCtaText || b.ctaText,
      ctaUrl: b.heroCtaUrl || b.ctaUrl,
      bgHex: b.heroBackgroundHex || b.backgroundHex,
    });
    typographySynth = await synthesizeTypographyIntoTheme(themeRoot, b);
  } catch (e) {
    return res
      .status(500)
      .json({
        ok: false,
        status: "FAILED",
        dest: destPath,
        error: "preview copy / apply: " + e.message,
      });
  }

  let themeMeta;
  try {
    themeMeta = ensureValidThemeBundle(themeRoot, SR_2026_REF);
  } catch (e) {
    return res.status(500).json({
      ok: false,
      status: "FAILED",
      dest: destPath,
      ...designManagerFinderFields(destPath, {}),
      error: "Theme bundle validation: " + e.message,
    });
  }

  const quoted = (p) => `"${p.replace(/"/g, '\\"')}"`;
  const cmd = `npx --yes -p @hubspot/cli@8.4.0 hs cms upload ${quoted(themeRoot)} ${quoted(
    destPath,
  )}${account ? ` -a ${quoted(account)}` : ""}${hubspotCmsUploadDebugFlag()}`;

  const execOptions = {
    cwd: __dirname,
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
    shell: true,
  };

  try {
    console.log(
      "[theme-clone] running hs cms upload (can take 5–20+ min for a full theme)…",
    );
    const tUpload = Date.now();
    const { stdout, stderr } = await execAsync(cmd, execOptions);
    console.log(
      "[theme-clone] hs finished in",
      Date.now() - tUpload,
      "ms, total",
      Date.now() - t0,
      "ms",
    );
    const verify = await verifyPostUploadDest(destPath, account, {
      uploadStdout: stdout,
    });
    if (!verify.ok) {
      return res.status(502).json({
        ok: false,
        status: "FAILED",
        summary:
          verify.code === "THEME_NOT_VISIBLE_IN_PORTAL"
            ? "Upload reported SUCCESS, but `hs cms list` on the path and the file-tree root did not show the new theme after automatic re-polling — not treated as a successful install."
            : "Post-upload verification could not confirm the theme (see error and stdout tail).",
        dest: destPath,
        themePathPolicy: {
          newFolderEachRun: !resolved.allowReuseDest,
          nameBase: resolved.nameBase,
          allowReuseDest: Boolean(resolved.allowReuseDest),
          uniqueToken: resolved.uniqueToken,
        },
        ...designManagerFinderFields(destPath, themeMeta),
        localSource:
          "client-delivery-theme (read-only ref: sr-2026, unchanged)",
        warmedCopy: Boolean(ensured.created),
        error: verify.error,
        postUploadVerification: {
          passed: false,
          code: verify.code || "VERIFY_FAIL",
          details: verify.details,
        },
        destListing:
          verify.destListing != null
            ? String(verify.destListing).slice(0, 12000)
            : "",
        rootListing:
          verify.rootListing != null
            ? String(verify.rootListing).slice(0, 12000)
            : "",
        stdoutTail: stdout ? stdout.slice(-8000) : "",
        stderrTail: stderr ? stderr.slice(-4000) : "",
      });
    }
    const remoteListing = String(verify.destListing || "").slice(0, 12000);
    const draftPageExtra = await maybeCreateDraftPreviewPage(
      HUBSPOT_PORTAL_ID,
      b,
      dest,
    );
    const typographyAudit = await runTypographyExtractIfRequested(
      b,
      {
        mode: "full",
        destPath,
      },
      typographySynth,
    );
    res.json({
      ok: true,
      status: "UPLOADED",
      summary: `Theme installed in Design Manager at ${destPath} (HubSpot CLI; ${humanUploadVerifyLine(verify.verification)}).`,
      dest: destPath,
      themePathPolicy: {
        newFolderEachRun: !resolved.allowReuseDest,
        nameBase: resolved.nameBase,
        allowReuseDest: Boolean(resolved.allowReuseDest),
        uniqueToken: resolved.uniqueToken,
      },
      durationMs: Date.now() - t0,
      localSource: "client-delivery-theme (read-only ref: sr-2026, unchanged)",
      warmedCopy: Boolean(ensured.created),
      ...(aiTypographyInject ? { ai_typography_inject: aiTypographyInject } : {}),
      ...designManagerFinderFields(destPath, {
        label: themeMeta.label,
        version: themeMeta.version,
        screenshotOk: themeMeta.screenshotOk,
      }),
      postUploadVerification: {
        passed: true,
        ...(verify.verification || {}),
        code: "OK",
      },
      rootListing: verify.rootListing
        ? String(verify.rootListing).slice(0, 12000)
        : "",
      remoteListing,
      verificationNote:
        (verify.verification && verify.verification.summary) ||
        "Verified on HubSpot",
      templateLabel: "SR Hero Preview (DND)",
      previewTip:
        "Create a test page: Marketing → Web/Landing page → new → pick template SR Hero Preview (DND). " +
        "Optional: ?hero_heading=…&hero_description=… on the preview URL (mapped to request.query_dict in preview.html)." +
        (draftPageExtra.draftPage
          ? " A draft website page was also created via the CMS API — use `pageEditorUrlCandidates` in the JSON response."
          : ""),
      typography: typographySynth.typography,
      typographyExtract: typographySynth.typographyExtract,
      typographySynth: {
        applied: typographySynth.applied,
        clientTypographyCssWritten: typographySynth.cssWritten,
        fetchedUpstreamDuringPrep: typographySynth.fetchedUpstream,
        prototypeFallback: typographySynth.prototypeFallback,
        prototypeFallbackReasons: typographySynth.prototypeFallbackReasons,
        typographySkippedNonPortable: typographySynth.typographySkippedNonPortable,
      },
      typographyAudit,
      ...draftPageExtra,
      stdoutTail: stdout ? stdout.slice(-8000) : "",
      stderrTail: stderr ? stderr.slice(-4000) : "",
    });
  } catch (err) {
    const stdout = err.stdout ? String(err.stdout) : "";
    const stderr = err.stderr ? String(err.stderr) : "";
    res.status(500).json({
      ok: false,
      status: "FAILED",
      dest: destPath,
      ...designManagerFinderFields(destPath, {
        label: themeMeta && themeMeta.label,
        version: themeMeta && themeMeta.version,
        screenshotOk: themeMeta && themeMeta.screenshotOk,
      }),
      localSource: "client-delivery-theme",
      error: err.message,
      uploadTroubleshooting: hubspotUploadFailureHint(),
      ifCliFails:
        "On Windows, ensure npx/hs works in cmd or PowerShell: npx -p @hubspot/cli@8.4.0 hs cms --version " +
        "and: hs account auth. If a large file 403s at upload, re-auth or use Design Manager to upload the skipped asset.",
      stdoutTail: stdout.slice(-8000),
      stderrTail: stderr.slice(-4000),
    });
  }
});

/**
 * Full **local `sr-2026` tree** → temp copy → same typography / preview bake as full clone →
 * `hs cms upload` to a **new** Design Manager root folder (`sr-2026-work-…` by default).
 * Never targets `/sr-2026` unless `HUBSPOT_ALLOW_SR2026_OVERWRITE=1` and allowReuseDest (discouraged).
 */
app.post("/api/theme-upload-reference-copy", async (req, res) => {
  const t0 = Date.now();
  const resolved = resolveThemeDestPath(req.body, "ref");
  const { dest, destPath } = resolved;

  try {
    assertSafeHubspotThemeDest(destPath, req.body);
  } catch (e) {
    if (e.code === "PROTECTED_DEST") {
      return res.status(403).json({ ok: false, error: e.message, dest: destPath });
    }
    throw e;
  }

  if (!fs.existsSync(SR_2026_REF)) {
    return res.status(503).json({
      ok: false,
      status: "UNREADY",
      dest: destPath,
      error: "sr-2026 reference folder is missing from this project.",
    });
  }

  const execCwd = __dirname;
  const workdir = path.join(
    execCwd,
    "hs-upload-tmp",
    `refcopy-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  const workdirRel = path.relative(execCwd, workdir);

  let b;
  let aiTypographyInject = null;
  try {
    const resolvedUpload = resolveThemeUploadBody(req.body || {});
    b = resolvedUpload.body;
    aiTypographyInject = resolvedUpload.aiTypographyInject;
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || String(e) });
  }
  const account =
    (b.account && String(b.account)) ||
    process.env.HUBSPOT_CLI_ACCOUNT ||
    process.env.HUBSPOT_ACCOUNT ||
    "";

  let typographySynth = {
    typography: null,
    typographyExtract: null,
    applied: false,
    cssWritten: false,
    fetchedUpstream: false,
    prototypeFallback: false,
    prototypeFallbackReasons: [],
    typographySkippedNonPortable: false,
  };
  let themeMeta;

  const quoted = (p) => `"${p.replace(/"/g, '\\"')}"`;
  const execOptions = {
    cwd: execCwd,
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
    shell: true,
  };

  try {
    fs.mkdirSync(path.dirname(workdir), { recursive: true });
    fs.cpSync(SR_2026_REF, workdir, { recursive: true });

    resetPreviewFromReference(workdir);
    applyPreviewHeroDefaultsToCopy(workdir, {
      heading: b.heroHeading || b.hero_heading,
      description: b.heroDescription || b.hero_description,
    });
    applyDndCtaAndBackgroundDefaults(workdir, {
      extendPreviewDnd: Boolean(b.extendPreviewDnd),
      ctaText: b.heroCtaText || b.ctaText,
      ctaUrl: b.heroCtaUrl || b.ctaUrl,
      bgHex: b.heroBackgroundHex || b.backgroundHex,
    });
    typographySynth = await synthesizeTypographyIntoTheme(workdir, b);
    let typographySitesBundleRef = null;
    const sitesForBundle = resolveTypographySitesForUpload(b);
    let batchPreviewSlim = null;
    const primaryUrlRef =
      resolveTypographyWebsiteUrl(b) || String(sitesForBundle[0]?.website_url || "");
    if (sitesForBundle.length > 0) {
      typographySitesBundleRef = writeTypographySitesBundleToTheme(
        workdir,
        sitesForBundle,
        primaryUrlRef,
        buildClientTypographyCss,
      );
      if (typographySitesBundleRef.siteCount > 1) {
        batchPreviewSlim = applyBatchMultiSitePreviewTemplates(
          workdir,
          sitesForBundle,
          primaryUrlRef,
        );
        applyBatchPerSiteHeroBackgrounds(workdir, sitesForBundle, primaryUrlRef);
        stripLegacySharedHeroCoverFromPrimaryCss(workdir);
      }
    }

    themeMeta = ensureValidThemeBundle(workdir, SR_2026_REF);

    const cmd = `npx --yes -p @hubspot/cli@8.4.0 hs cms upload ${quoted(workdirRel)} ${quoted(
      destPath,
    )}${account ? ` -a ${quoted(account)}` : ""}${hubspotCmsUploadDebugFlag()}`;
    console.log(
      "[theme-upload-reference-copy] hs cms upload →",
      destPath,
      "(src rel:",
      workdirRel,
      ")",
    );
    const tUpload = Date.now();
    const { stdout, stderr } = await execAsync(cmd, execOptions);
    console.log("[theme-upload-reference-copy] done in", Date.now() - tUpload, "ms");

    const verify = await verifyPostUploadDest(destPath, account, {
      uploadStdout: stdout,
    });
    if (!verify.ok) {
      const cliConfirmed = uploadStdoutConfirmsCmsDest(stdout, destPath);
      if (verify.code === "THEME_NOT_VISIBLE_IN_PORTAL" && cliConfirmed) {
        verify.ok = true;
        verify._softWarning =
          "hs cms list did not confirm folder after polling, but CLI stdout reported SUCCESS.";
      } else {
        return res.status(502).json({
          ok: false,
          status: "FAILED",
          mode: "reference-copy",
          dest: destPath,
          ...designManagerFinderFields(destPath, themeMeta),
          localSource: "temp copy of sr-2026 (reference tree unchanged on disk)",
          error: verify.error,
          stdoutTail: stdout ? stdout.slice(-8000) : "",
          stderrTail: stderr ? stderr.slice(-4000) : "",
        });
      }
    }

    const draftPageExtra = await maybeCreateDraftPreviewPage(
      HUBSPOT_PORTAL_ID,
      b,
      dest,
    );
    const typographyAudit = await runTypographyExtractIfRequested(
      b,
      { mode: "reference-copy", destPath },
      typographySynth,
    );

    res.json({
      ok: true,
      status: "UPLOADED",
      mode: "reference-copy",
      summary: `Full sr-2026 snapshot uploaded to ${destPath} (${humanUploadVerifyLine(verify.verification)}).`,
      dest: destPath,
      themePathPolicy: {
        newFolderEachRun: !resolved.allowReuseDest,
        nameBase: resolved.nameBase,
        allowReuseDest: Boolean(resolved.allowReuseDest),
        uniqueToken: resolved.uniqueToken,
      },
      durationMs: Date.now() - t0,
      localSource: "temp copy of sr-2026 — HubSpot path is a new root folder; local sr-2026/ not modified",
      ...(aiTypographyInject ? { ai_typography_inject: aiTypographyInject } : {}),
      ...designManagerFinderFields(destPath, {
        label: themeMeta.label,
        version: themeMeta.version,
        screenshotOk: themeMeta.screenshotOk,
      }),
      postUploadVerification: {
        passed: true,
        ...(verify.verification || {}),
        code: "OK",
      },
      rootListing: verify.rootListing
        ? String(verify.rootListing).slice(0, 12000)
        : "",
      remoteListing: String(verify.destListing || "").slice(0, 12000),
      verificationNote: verify._softWarning || "Verified on HubSpot",
      listCheckBypassed: Boolean(verify._softWarning),
      templateLabel: "SR Hero Preview (DND)",
      previewTip:
        (batchPreviewSlim && batchPreviewSlim.applied
          ? "Batch preview: templates/preview.html (primary) + templates/preview-{slug}.html per site — Design Manager → Preview. "
          : "") +
        "Use this uploaded folder as your working theme on HubSpot — do not rely on /sr-2026 if that is reserved as read-only in your portal.",
      typography: typographySynth.typography,
      typographyExtract: typographySynth.typographyExtract,
      typographySitesBundle: typographySitesBundleRef || undefined,
      typographyBatchPreview: batchPreviewSlim || undefined,
      typographySynth: {
        applied: typographySynth.applied,
        clientTypographyCssWritten: typographySynth.cssWritten,
        fetchedUpstreamDuringPrep: typographySynth.fetchedUpstream,
        prototypeFallback: typographySynth.prototypeFallback,
        prototypeFallbackReasons: typographySynth.prototypeFallbackReasons,
        typographySkippedNonPortable: typographySynth.typographySkippedNonPortable,
      },
      typographyAudit,
      ...draftPageExtra,
      stdoutTail: stdout ? stdout.slice(-8000) : "",
      stderrTail: stderr ? stderr.slice(-4000) : "",
    });
  } catch (err) {
    const stdout = err.stdout ? String(err.stdout) : "";
    const stderr = err.stderr ? String(err.stderr) : "";
    res.status(500).json({
      ok: false,
      status: "FAILED",
      mode: "reference-copy",
      dest: destPath,
      ...designManagerFinderFields(destPath, {
        label: themeMeta && themeMeta.label,
        version: themeMeta && themeMeta.version,
        screenshotOk: themeMeta && themeMeta.screenshotOk,
      }),
      error: err.message,
      uploadTroubleshooting: hubspotUploadFailureHint(),
      stdoutTail: stdout.slice(-8000),
      stderrTail: stderr.slice(-4000),
    });
  } finally {
    removeStagingQuiet(workdir);
  }
});

/**
 * Fast path: uploads only selected module(s), preview template, macros, minimal css/js,
 * plus theme.json / init.json — all copied read-only from sr-2026 into a temp folder, then
 * `hs cms upload` once. Does not use client-delivery-theme or full theme copy.
 */
app.post("/api/theme-clone-slim", async (req, res) => {
  const t0 = Date.now();
  const resolvedSlim = resolveThemeDestPath(req.body, "slim");
  const { dest, destPath } = resolvedSlim;

  try {
    assertSafeHubspotThemeDest(destPath, req.body);
  } catch (e) {
    if (e.code === "PROTECTED_DEST") {
      return res.status(403).json({ ok: false, error: e.message, dest: destPath });
    }
    throw e;
  }

  console.log(
    "[theme-clone-slim] dest",
    destPath,
    resolvedSlim.allowReuseDest ? "(reuse path)" : "(new folder)",
  );

  if (!fs.existsSync(SR_2026_REF)) {
    return res.status(503).json({
      ok: false,
      status: "UNREADY",
      dest: destPath,
      error: "sr-2026 reference theme is missing from this project.",
    });
  }

  let b;
  let aiTypographyInject = null;
  try {
    const resolvedUpload = resolveThemeUploadBody(req.body || {});
    b = resolvedUpload.body;
    aiTypographyInject = resolvedUpload.aiTypographyInject;
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || String(e) });
  }
  const moduleNames = ["SR Hero 01.module"];
  if (b.includeSecondModule || b.secondModule) {
    moduleNames.push("SR Element Stat.module");
  }
  if (Array.isArray(b.modules) && b.modules.length) {
    moduleNames.length = 0;
    for (const m of b.modules) {
      const s = String(m).trim();
      if (!s) {
        continue;
      }
      moduleNames.push(s.endsWith(".module") ? s : `${s}.module`);
    }
    if (!moduleNames.length) {
      moduleNames.push("SR Hero 01.module");
    }
  }

  // Staging rules (learned the hard way with HubSpot CLI v8.4.0):
  //   1. src MUST be relative to CWD — absolute paths outside CWD get silently skipped (0 files)
  //   2. Must NOT be gitignored — CLI respects .gitignore and skips all files in gitignored dirs
  //   3. Must be INSIDE the project (CWD) so the relative path has no ".." prefix
  // Solution: hs-upload-tmp/ — inside project, NOT in .gitignore, always deleted in finally{}
  const execCwd = __dirname;
  const workdir = path.join(
    execCwd,
    "hs-upload-tmp",
    `run-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  const workdirRel = path.relative(execCwd, workdir); // e.g. "hs-upload-tmp\run-..."

  const account =
    (b.account && String(b.account)) ||
    process.env.HUBSPOT_CLI_ACCOUNT ||
    process.env.HUBSPOT_ACCOUNT ||
    "";

  const quoted = (p) => `"${p.replace(/"/g, '\\"')}"`;
  const execOptions = {
    cwd: __dirname,
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
    shell: true,
  };

  let themeMetaSlim;
  let typographySynthSlim = {
    typography: null,
    typographyExtract: null,
    applied: false,
    cssWritten: false,
    fetchedUpstream: false,
    prototypeFallback: false,
    prototypeFallbackReasons: [],
    typographySkippedNonPortable: false,
  };
  try {
    console.log(
      "[theme-clone-slim] staging",
      workdir,
      "modules",
      moduleNames.join(", "),
    );
    buildSlimStaging(workdir, {
      moduleFolderNames: moduleNames,
      includePreview: b.includePreview !== false,
    });
    resetPreviewFromReference(workdir);
    applyPreviewHeroDefaultsToCopy(workdir, {
      heading: b.heroHeading || b.hero_heading,
      description: b.heroDescription || b.hero_description,
    });
    applyDndCtaAndBackgroundDefaults(workdir, {
      extendPreviewDnd: Boolean(b.extendPreviewDnd),
      ctaText: b.heroCtaText || b.ctaText,
      ctaUrl: b.heroCtaUrl || b.ctaUrl,
      bgHex: b.heroBackgroundHex || b.backgroundHex,
    });
    typographySynthSlim = await synthesizeTypographyIntoTheme(workdir, b);
    let typographySitesBundle = null;
    const sitesForBundleSlim = resolveTypographySitesForUpload(b);
    let batchPreviewSlim = null;
    const primaryUrlSlim =
      resolveTypographyWebsiteUrl(b) || String(sitesForBundleSlim[0]?.website_url || "");
    if (sitesForBundleSlim.length > 0) {
      typographySitesBundle = writeTypographySitesBundleToTheme(
        workdir,
        sitesForBundleSlim,
        primaryUrlSlim,
        buildClientTypographyCss,
      );
      if (typographySitesBundle && typographySitesBundle.siteCount > 1) {
        batchPreviewSlim = applyBatchMultiSitePreviewTemplates(
          workdir,
          sitesForBundleSlim,
          primaryUrlSlim,
        );
        applyBatchPerSiteHeroBackgrounds(workdir, sitesForBundleSlim, primaryUrlSlim);
        stripLegacySharedHeroCoverFromPrimaryCss(workdir);
      }
    }
    try {
      themeMetaSlim = ensureValidThemeBundle(workdir, SR_2026_REF);
    } catch (e) {
      return res.status(500).json({
        ok: false,
        status: "FAILED",
        mode: "slim",
        dest: destPath,
        ...designManagerFinderFields(destPath, {}),
        modules: moduleNames,
        error: "Theme bundle validation: " + e.message,
      });
    }

    const cmd = `npx --yes -p @hubspot/cli@8.4.0 hs cms upload ${quoted(workdirRel)} ${quoted(
      destPath,
    )}${account ? ` -a ${quoted(account)}` : ""}${hubspotCmsUploadDebugFlag()}`;
    console.log("[theme-clone-slim] hs cms upload →", destPath, "(src rel:", workdirRel, ")");
    const tUpload = Date.now();
    const { stdout, stderr } = await execAsync(cmd, { ...execOptions, cwd: execCwd });
    console.log("[theme-clone-slim] done in", Date.now() - tUpload, "ms");
    const verify = await verifyPostUploadDest(destPath, account, {
      uploadStdout: stdout,
    });
    if (!verify.ok) {
      // If the CLI stdout confirmed SUCCESS but the list check failed, that is a HubSpot
      // list-API lag issue — not a real failure. Treat it as ok with a warning.
      const cliConfirmed = uploadStdoutConfirmsCmsDest(stdout, destPath);
      if (verify.code === "THEME_NOT_VISIBLE_IN_PORTAL" && cliConfirmed) {
        console.log("[theme-clone-slim] CLI stdout confirmed SUCCESS — treating list-check lag as warning, not failure.");
        // Fall through to success response below with a warning flag
        verify.ok = true;
        verify._softWarning = "hs cms list did not confirm folder after polling, but CLI stdout reported SUCCESS. The theme IS uploaded — search in Design Manager with the full folder name.";
      } else {
        return res.status(502).json({
          ok: false,
          status: "FAILED",
          mode: "slim",
          summary:
            verify.code === "THEME_NOT_VISIBLE_IN_PORTAL"
              ? "Upload reported SUCCESS, but `hs cms list` on the path and the file-tree root did not show the new theme after automatic re-polling — not treated as a successful install."
              : "Post-upload verification could not confirm the theme (see error and stdout tail).",
          dest: destPath,
          themePathPolicy: {
            newFolderEachRun: !resolvedSlim.allowReuseDest,
            nameBase: resolvedSlim.nameBase,
            allowReuseDest: Boolean(resolvedSlim.allowReuseDest),
            uniqueToken: resolvedSlim.uniqueToken,
          },
          ...designManagerFinderFields(destPath, themeMetaSlim),
          modules: moduleNames,
          error: verify.error,
          postUploadVerification: {
            passed: false,
            code: verify.code || "VERIFY_FAIL",
            details: verify.details,
          },
          destListing:
            verify.destListing != null
              ? String(verify.destListing).slice(0, 12000)
              : "",
          rootListing:
            verify.rootListing != null
              ? String(verify.rootListing).slice(0, 12000)
              : "",
          stdoutTail: stdout ? stdout.slice(-8000) : "",
          stderrTail: stderr ? stderr.slice(-4000) : "",
        });
      }
    }
    const remoteListing = String(verify.destListing || "").slice(0, 12000);
    const draftPageExtraSlim = await maybeCreateDraftPreviewPage(
      HUBSPOT_PORTAL_ID,
      b,
      dest,
    );
    const typographyAudit = await runTypographyExtractIfRequested(
      b,
      {
        mode: "slim",
        destPath,
      },
      typographySynthSlim,
    );
    res.json({
      ok: true,
      status: "UPLOADED",
      mode: "slim",
      summary: `Slim theme uploaded to ${destPath} (${moduleNames.length} module(s), skeleton + preview + assets; ${humanUploadVerifyLine(verify.verification)}).${
        typographySitesBundle && typographySitesBundle.siteCount > 1
          ? ` Batch: ${typographySitesBundle.siteCount} sites → typography-sites/sites.json + per-site client-typography CSS.`
          : ""
      }`,
      dest: destPath,
      themePathPolicy: {
        newFolderEachRun: !resolvedSlim.allowReuseDest,
        nameBase: resolvedSlim.nameBase,
        allowReuseDest: Boolean(resolvedSlim.allowReuseDest),
        uniqueToken: resolvedSlim.uniqueToken,
      },
      modules: moduleNames,
      durationMs: Date.now() - t0,
      ...(aiTypographyInject ? { ai_typography_inject: aiTypographyInject } : {}),
      ...designManagerFinderFields(destPath, {
        label: themeMetaSlim.label,
        version: themeMetaSlim.version,
        screenshotOk: themeMetaSlim.screenshotOk,
      }),
      postUploadVerification: {
        passed: true,
        ...(verify.verification || {}),
        code: "OK",
      },
      rootListing: verify.rootListing
        ? String(verify.rootListing).slice(0, 12000)
        : "",
      remoteListing,
      verificationNote:
        verify._softWarning ||
        (verify.verification && verify.verification.summary) ||
        "Verified on HubSpot",
      listCheckBypassed: Boolean(verify._softWarning),
      templateLabel: "SR Hero Preview (DND)",
      previewTip:
        (batchPreviewSlim && batchPreviewSlim.applied
          ? "Batch preview: open templates/preview.html (primary) or templates/preview-{slug}.html per site in Design Manager → Preview. On preview.html only, ?typography_site={slug} switches CSS. "
          : "Marketing → Website pages → your new draft (if API succeeded) or create a page from template SR Hero Preview (DND). ") +
        "URL query params hero_heading, hero_description, hero_cta_text map to request.query_dict in preview.html." +
        (draftPageExtraSlim.draftPage
          ? " Draft page created — open an entry in `pageEditorUrlCandidates`."
          : ""),
      typography: typographySynthSlim.typography,
      typographyExtract: typographySynthSlim.typographyExtract,
      typographySitesBundle: typographySitesBundle || undefined,
      typographyBatchPreview: batchPreviewSlim || undefined,
      typographySynth: {
        applied: typographySynthSlim.applied,
        clientTypographyCssWritten: typographySynthSlim.cssWritten,
        fetchedUpstreamDuringPrep: typographySynthSlim.fetchedUpstream,
        prototypeFallback: typographySynthSlim.prototypeFallback,
        prototypeFallbackReasons: typographySynthSlim.prototypeFallbackReasons,
        typographySkippedNonPortable: typographySynthSlim.typographySkippedNonPortable,
      },
      typographyAudit,
      ...draftPageExtraSlim,
      stdoutTail: stdout ? stdout.slice(-8000) : "",
      stderrTail: stderr ? stderr.slice(-4000) : "",
    });
  } catch (err) {
    const stdout = err.stdout ? String(err.stdout) : "";
    const stderr = err.stderr ? String(err.stderr) : "";
    res.status(500).json({
      ok: false,
      status: "FAILED",
      mode: "slim",
      dest: destPath,
      ...designManagerFinderFields(destPath, {
        label: themeMetaSlim && themeMetaSlim.label,
        version: themeMetaSlim && themeMetaSlim.version,
        screenshotOk: themeMetaSlim && themeMetaSlim.screenshotOk,
      }),
      modules: moduleNames,
      error: err.message,
      uploadTroubleshooting: hubspotUploadFailureHint(),
      stdoutTail: stdout.slice(-8000),
      stderrTail: stderr.slice(-4000),
    });
  } finally {
    removeStagingQuiet(workdir);
  }
});

/**
 * Bake SR Hero 01 + preview from extract, then publish to Sprocket Rocket preview portal (Brad API).
 * Body: same typography fields as theme-clone-slim + optional sr_preview_client / sr_preview_project.
 */
app.post("/api/sr-preview-publish", async (req, res) => {
  const t0 = Date.now();
  if (!previewPublishToken()) {
    return res.status(503).json({
      ok: false,
      error:
        "SR_PREVIEW_PUBLISH_TOKEN missing in .env (Bearer token from preview.sprocketrocket.co).",
    });
  }

  if (!fs.existsSync(SR_2026_REF)) {
    return res.status(503).json({
      ok: false,
      error: "sr-2026 reference theme is missing from this project.",
    });
  }

  let b;
  let aiTypographyInject = null;
  try {
    const resolvedUpload = resolveThemeUploadBody(req.body || {});
    b = resolvedUpload.body;
    aiTypographyInject = resolvedUpload.aiTypographyInject;
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || String(e) });
  }

  const websiteUrl = resolveTypographyWebsiteUrl(b);
  if (!websiteUrl) {
    return res.status(400).json({
      ok: false,
      error:
        "typographyWebsiteUrl (or website_url) is required — run Extract Typography first or pass typographyExtract.",
    });
  }

  if (!b.typographyExtract && websiteUrl) {
    const hit = findCachedWebsiteTypography(__dirname, websiteUrl);
    if (hit.cache_hit && hit.playwright_extract) {
      b.typographyExtract = hit.playwright_extract;
      if (!b.typography && hit.playwright_extract.typography) {
        b.typography = hit.playwright_extract.typography;
      }
    }
  }

  if (!b.typographyExtract) {
    return res.status(400).json({
      ok: false,
      error:
        `No cached typography extract for ${websiteUrl}. Run Extract Typography first (Playwright cache in typography-extract-cache/).`,
    });
  }

  const shouldFreshExtract =
    b.sr_preview_fresh_extract === true ||
    (typographyCacheForceRefresh(b) && !b.typographyExtract);
  const publishT0 = Date.now();
  let freshExtractRan = false;
  if (shouldFreshExtract && websiteUrl) {
    const v = validateHttpUrlTypography(websiteUrl);
    if (v.ok) {
      const fresh = await postTypographyExtractJson(v.websiteUrl, {
        includeHeroScreenshot: Boolean(
          b.includeHeroScreenshot ?? b.include_hero_screenshot,
        ),
      });
      if (fresh.ok && fresh.data && typeof fresh.data === "object") {
        b.typographyExtract = fresh.data;
        b.typography = fresh.data.typography || b.typography;
        freshExtractRan = true;
        console.log(
          "[sr-preview-publish] fresh Playwright extract for",
          v.websiteUrl,
          "hero strategy:",
          fresh.data?.hero?.strategy || "n/a",
          `${fresh.elapsedMs || Date.now() - publishT0}ms`,
        );
      } else {
        console.warn(
          "[sr-preview-publish] fresh extract failed — using cached payload if any",
          fresh.status,
        );
      }
    }
  } else if (b.typographyExtract) {
    console.log("[sr-preview-publish] using existing extract — skipping Playwright re-run");
  }

  const workdir = path.join(
    __dirname,
    "hs-upload-tmp",
    `sr-preview-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );

  try {
    fs.mkdirSync(workdir, { recursive: true });
    buildSlimStaging(workdir, {
      moduleFolderNames: ["SR Hero 01.module"],
      includePreview: true,
    });
    resetPreviewFromReference(workdir);
    applyPreviewHeroDefaultsToCopy(workdir, {
      heading: b.heroHeading || b.hero_heading,
      description: b.heroDescription || b.hero_description,
    });
    applyDndCtaAndBackgroundDefaults(workdir, {
      extendPreviewDnd: Boolean(b.extendPreviewDnd),
      ctaText: b.heroCtaText || b.ctaText,
      ctaUrl: b.heroCtaUrl || b.ctaUrl,
      bgHex: b.heroBackgroundHex || b.backgroundHex,
    });

    const typographySynth = await synthesizeTypographyIntoTheme(workdir, b);
    if (!typographySynth.applied && !typographySynth.cssWritten) {
      console.warn(
        "[sr-preview-publish] typography bake produced no CSS — publishing module with defaults",
      );
    }

    let typographyForSettings = typographySynth.typography;
    const extractForSettings = typographySynth.typographyExtract;
    if (
      extractForSettings?.hero?.found &&
      extractForSettings.hero.typography &&
      typographyForSettings
    ) {
      typographyForSettings = mergeTypographyWithHeroScope(
        typographyForSettings,
        extractForSettings.hero,
      );
    } else if (
      extractForSettings?.hero?.found &&
      extractForSettings.hero.typography &&
      !typographyForSettings
    ) {
      typographyForSettings = mergeTypographyWithHeroScope({}, extractForSettings.hero);
    }

    const previewOut = await publishBakedThemeToSrPreview({
      workdir,
      websiteUrl,
      body: applySrPreviewFastPublishDefaults(b),
      typography: typographyForSettings,
      typographyExtract: extractForSettings,
    });

    const status = previewOut.uploadOk === false ? previewOut.http_status || 502 : 200;
    return res.status(status).json({
      ...previewOut,
      durationMs: Date.now() - t0,
      freshExtractRan,
      typographySynth: {
        applied: typographySynth.applied,
        cssWritten: typographySynth.cssWritten,
        fetchedUpstream: typographySynth.fetchedUpstream,
        prototypeFallback: typographySynth.prototypeFallback,
      },
      ...(aiTypographyInject ? { ai_typography_inject: aiTypographyInject } : {}),
    });
  } catch (e) {
    console.error("[sr-preview-publish]", e);
    return res.status(500).json({
      ok: false,
      error: e.message || String(e),
      durationMs: Date.now() - t0,
    });
  } finally {
    removeStagingQuiet(workdir);
  }
});

const DITTO_HTTP_PORT = Number(process.env.PORT) || 3000;
/** 0 = no limit. Long GPT-5 /responses calls can exceed Node's default (~5 min) idle limit and kill the socket → browser "Failed to fetch". */
const DITTO_HTTP_INBOUND_TIMEOUT_MS = (() => {
  const raw = process.env.DITTO_HTTP_INBOUND_TIMEOUT_MS;
  if (raw === undefined || String(raw).trim() === "") return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), 86_400_000);
})();

const httpServer = app.listen(DITTO_HTTP_PORT, () => {
  console.log(`Install Theme UI: http://localhost:${DITTO_HTTP_PORT}/`);
  console.log(`Theme clone lab:   http://localhost:${DITTO_HTTP_PORT}/theme-lab.html`);
  console.log("Typography extract: POST /api/typography-extract (Playwright); -url / -ai aliases route to same");
  console.log("Website typo cache: GET /api/typography-website-cache → typography-extract-cache/website-typography-index.json");
  try {
    const idx = ensureTypographyWebsiteIndex(__dirname);
    if (idx.merged != null) {
      console.log(
        `[typography-website-cache] index ready (${idx.entries ?? "?"} URLs` +
          (idx.merged ? `, ${idx.merged} from audit files` : "") +
          ")",
      );
    }
  } catch (eIdx) {
    console.warn("[typography-website-cache] index init:", eIdx.message || eIdx);
  }
  console.log("SR decision:       POST /api/sr-decision-lightrag (green and/or Playwright + LightRAG)");
  console.log("Slim upload API:   POST /api/theme-clone-slim");
  console.log("SR preview publish: POST /api/sr-preview-publish (Brad preview portal; needs SR_PREVIEW_PUBLISH_TOKEN)");
  console.log("Full sr-2026 copy: POST /api/theme-upload-reference-copy (new DM folder; never /sr-2026)");
  console.log(
    `HTTP inbound idle timeout: ${DITTO_HTTP_INBOUND_TIMEOUT_MS ? `${DITTO_HTTP_INBOUND_TIMEOUT_MS} ms` : "disabled (0) — OK for long OpenAI Responses waits"}`,
  );
});

httpServer.setTimeout(DITTO_HTTP_INBOUND_TIMEOUT_MS);
httpServer.requestTimeout = DITTO_HTTP_INBOUND_TIMEOUT_MS;
httpServer.headersTimeout =
  DITTO_HTTP_INBOUND_TIMEOUT_MS === 0 ? 0 : Math.max(DITTO_HTTP_INBOUND_TIMEOUT_MS, 120_000);
