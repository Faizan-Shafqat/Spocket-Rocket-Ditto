/**
 * Build a HubSpot / SR theme injection plan by combining:
 *   - Live site: AI typography + hero — either **fresh** (HTML fetch + OpenAI, same as typography-extract-ai)
 *     or **reused** when the client passes the full `typography_extract_ai` snapshot from POST /api/typography-extract-ai
 *     (same URL): skips HTML re-fetch and skips duplicate typography/hero OpenAI calls.
 *   - Local cache: LightRAG graphml excerpt + embedding top-K over Ditto naive vdb
 *     (`cache/lightrag/.naive_data/vdb_chunks.json` after `npm run ingest:lightrag`) + cheatsheet excerpts.
 *   - Planner OpenAI always receives **local_cache** + a **slim** `typography_ai` (large `playwright_typography_full_page`
 *     and `typography_site_estimate` are replaced by compact planner summaries so the ~900k prompt cap does not truncate cache hits).
 */

const fs = require("fs");
const path = require("path");
const {
  fetchHtmlSnippet,
  extractCssSignalsFromHtml,
  mergeGoogleFontScanIntoCssSignals,
  extractTypographyOpenAI,
  extractHeroOpenAI,
  openaiJsonChat,
} = require("./hero-match-pipeline");
const {
  isUsablePlaywrightExtract,
  buildTypographyAiFromPlaywright,
  buildHeroAiFromPlaywright,
} = require("./playwright-typography-to-ai");
const { sameWebsiteUrl } = require("./typography-website-urls");
const { retrieveTopK, loadVdb } = require("./embeddings-store");

function resolveGraphmlMaxBytes() {
  const n = parseInt(String(process.env.DITTO_GRAPHML_PROMPT_MAX_BYTES || "280000"), 10);
  if (Number.isFinite(n) && n >= 20_000 && n <= 900_000) return n;
  return 280_000;
}

function loadGraphmlExcerpt(projectRoot) {
  const p = path.join(
    projectRoot,
    "cache",
    "lightrag",
    ".lightrag_data",
    "graph_chunk_entity_relation.graphml",
  );
  if (!fs.existsSync(p)) {
    return {
      ok: false,
      error: "missing_file",
      path: p,
      excerpt: "",
      file_size_bytes: 0,
      bytes_read: 0,
      approx_nodes_in_excerpt: 0,
      truncated: false,
    };
  }
  const st = fs.statSync(p);
  const maxBytes = Math.min(resolveGraphmlMaxBytes(), st.size);
  const fd = fs.openSync(p, "r");
  const buf = Buffer.allocUnsafe(maxBytes);
  fs.readSync(fd, buf, 0, maxBytes, 0);
  fs.closeSync(fd);
  const excerpt = buf.toString("utf8");
  const m = excerpt.match(/<node id="/g);
  return {
    ok: true,
    path: p,
    excerpt,
    file_size_bytes: st.size,
    bytes_read: maxBytes,
    approx_nodes_in_excerpt: m ? m.length : 0,
    truncated: st.size > maxBytes,
  };
}

function readMdSlice(projectRoot, relUnderSource, maxChars) {
  const sourceDir = path.join(projectRoot, "cache", "lightrag", "source");
  const candidates = [
    path.join(sourceDir, relUnderSource),
    path.join(sourceDir, "__enqueued__", relUnderSource),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const s = fs.readFileSync(p, "utf8");
    return { ok: true, path: p, text: s.slice(0, maxChars), truncated: s.length > maxChars };
  }
  return {
    ok: false,
    path: candidates[0],
    text: "",
    truncated: false,
    tried_paths: candidates,
  };
}

/**
 * Semantic top-K over Ditto's naive ingest (`npm run ingest:lightrag`).
 * LightRAG's own `.lightrag_data/vdb_chunks.json` uses a different vector format; we do not parse it here.
 */
async function retrieveTopKFromProjectCache(projectRoot, query, k, apiKey) {
  const naive = await retrieveTopK({ projectRoot, query, k, apiKey });
  if (naive.ok) {
    return { ...naive, vdb_source: "cache/lightrag/.naive_data/vdb_chunks.json" };
  }
  return {
    ok: false,
    error: naive.error || "no_naive_vdb",
    vdb_source: null,
    results: [],
    hint: "Run `npm run ingest:lightrag` so cache/lightrag/.naive_data/vdb_chunks.json exists; graphml + markdown excerpts are still used.",
  };
}

function buildModuleSearchQuery(websiteUrl, pageTitle, typographyAi, heroAi) {
  const pw = typographyAi?.playwright_typography_full_page;
  const est = typographyAi?.typography_site_estimate;
  const pwt =
    pw && typeof pw === "object" && !Array.isArray(pw)
      ? /** @type {Record<string, any>} */ (pw)
      : est && typeof est === "object" && !Array.isArray(est)
        ? /** @type {Record<string, any>} */ (est)
        : null;
  const h1 = pwt?.headings?.h1 && typeof pwt.headings.h1 === "object" ? pwt.headings.h1 : null;
  const body = pwt?.body && typeof pwt.body === "object" ? pwt.body : null;
  const exactTypo =
    h1 && (h1.fontSize || h1.fontFamily)
      ? `computed h1: ${h1.fontFamily || "?"} ${h1.fontSize || ""} / body: ${body?.fontFamily || "?"} ${body?.fontSize || ""}`
      : "";

  const parts = [
    "Sprocket Rocket SR modules theme typography design_settings HubL fields",
    websiteUrl,
    pageTitle || "",
    typographyAi && !typographyAi.error
      ? `fonts: ${typographyAi.primary_font_family || "?"} / ${typographyAi.body_font_family || "?"}`
      : "",
    exactTypo,
    typographyAi && !typographyAi.error && typographyAi.approximate_scale
      ? `scale h1_px=${typographyAi.approximate_scale.h1_px ?? "?"} body_px=${typographyAi.approximate_scale.body_px ?? "?"}`
      : "",
    heroAi && !heroAi.error && heroAi.text && heroAi.text.title
      ? `hero: ${heroAi.text.title}`
      : "",
  ];
  return parts.filter(Boolean).join(" \n ");
}

/** CSS-ish keys we keep for the theme planner (avoids megabyte prompts). */
const TYPO_PLANNER_STYLE_KEYS = [
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

/**
 * @param {Record<string, unknown>|null|undefined} block
 */
function pickStyleSubset(block) {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    return null;
  }
  /** @type {Record<string, unknown>} */
  const o = {};
  for (const k of TYPO_PLANNER_STYLE_KEYS) {
    if (block[k] != null && String(block[k]).trim() !== "") {
      o[k] = block[k];
    }
  }
  return Object.keys(o).length ? o : null;
}

/**
 * Full `playwright_typography_full_page` can be large; the inject-plan prompt is capped (~900k).
 * Drop the raw blob for OpenAI and attach a compact summary so **local_cache** stays in-budget.
 *
 * @param {Record<string, unknown>|null} ta
 * @returns {Record<string, unknown>|null}
 */
function slimTypographyAiForThemePlanner(ta) {
  if (!ta || typeof ta !== "object" || ta.error) {
    return ta;
  }
  /** @type {Record<string, unknown>} */
  let out = { ...ta };

  function slimBlob(blobKey, summaryKey, note) {
    const raw = out[blobKey];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return;
    }
    const p = /** @type {Record<string, any>} */ (raw);
    const headings = p.headings && typeof p.headings === "object" ? p.headings : {};
    /** @type {Record<string, Record<string, unknown>>} */
    const headings_sample = {};
    for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      const sub = pickStyleSubset(headings[tag]);
      if (sub) {
        headings_sample[tag] = sub;
      }
    }
    const urls = Array.isArray(p.google_fonts_urls) ? p.google_fonts_urls.map((u) => String(u || "").trim()) : [];
    delete out[blobKey];
    out[summaryKey] = {
      fonts: p.fonts && typeof p.fonts === "object" ? p.fonts : {},
      headings: headings_sample,
      body: pickStyleSubset(p.body),
      links: pickStyleSubset(p.links) || p.links || {},
      buttons: pickStyleSubset(p.buttons) || p.buttons || {},
      buttons_secondary: pickStyleSubset(p.buttons_secondary) || p.buttons_secondary || {},
      colors: p.colors && typeof p.colors === "object" ? p.colors : {},
      google_fonts_urls: urls.slice(0, 12),
      font_face_urls: Array.isArray(p.font_face_urls) ? p.font_face_urls.slice(0, 12) : [],
      font_stylesheet_urls: Array.isArray(p.font_stylesheet_urls) ? p.font_stylesheet_urls.slice(0, 12) : [],
      _note: note,
    };
  }

  slimBlob(
    "playwright_typography_full_page",
    "playwright_typography_planner_summary",
    "Subset of Playwright typography_full_page for prompt size.",
  );
  slimBlob(
    "typography_site_estimate",
    "typography_site_estimate_planner_summary",
    "Subset of AI typography_site_estimate (Playwright-shaped) for prompt size.",
  );
  return out;
}

/**
 * Vector query for typography-only AI (before hero_ai exists). Uses css_signals + URL.
 *
 * @param {string} websiteUrl
 * @param {Record<string, unknown>} cssSignals
 */
function buildTypographyLightragQuery(websiteUrl, cssSignals) {
  const css = cssSignals && typeof cssSignals === "object" ? cssSignals : {};
  const ff = Array.isArray(css.font_family_lines)
    ? css.font_family_lines.slice(0, 12).join(" | ")
    : "";
  const parts = [
    "HubSpot Sprocket Rocket SR theme typography fonts headings body design_settings _fonts.css",
    websiteUrl,
    css.page_title || "",
    ff,
    Array.isArray(css.google_fonts_links) ? css.google_fonts_links.slice(0, 4).join(" ") : "",
  ];
  return parts.filter(Boolean).join(" \n ");
}

/**
 * Same local bundle as theme-inject-plan (graphml under `cache/lightrag/.lightrag_data/`,
 * naive vectors under `.naive_data/`, markdown cheatsheets) — for **typography AI** cross-check.
 *
 * @param {{
 *   projectRoot: string,
 *   websiteUrl: string,
 *   cssSignals: Record<string, unknown>,
 *   apiKey: string,
 *   vectorK?: number,
 * }} opts
 */
async function loadLightragTypographyContextForAi(opts) {
  const projectRoot = opts.projectRoot;
  const websiteUrl = opts.websiteUrl;
  const cssSignals = opts.cssSignals || {};
  const apiKey = opts.apiKey;
  const vectorK = Math.min(
    24,
    Math.max(4, parseInt(String(opts.vectorK || opts.vector_k || "10"), 10) || 10),
  );

  const graph = loadGraphmlExcerpt(projectRoot);
  const q = buildTypographyLightragQuery(websiteUrl, cssSignals);
  const vec = await retrieveTopKFromProjectCache(projectRoot, q, vectorK, apiKey);
  const cheatsheet = readMdSlice(projectRoot, "08-sr-modules-selection-cheatsheet.md", 18_000);
  const guidelines = readMdSlice(projectRoot, "07-sr-theme-guidelines-core.md", 20_000);

  const localCache = {
    graphml: {
      ok: graph.ok,
      path: graph.path,
      file_size_bytes: graph.file_size_bytes,
      bytes_read: graph.bytes_read,
      approx_nodes_in_excerpt: graph.approx_nodes_in_excerpt,
      truncated: graph.truncated,
      error: graph.error || null,
      excerpt: graph.excerpt || "",
    },
    vector_search: {
      ok: vec.ok,
      vdb_source: vec.vdb_source || null,
      query_used: q.slice(0, 2000),
      model: vec.model,
      dim: vec.dim,
      error: vec.error || null,
      hits: (vec.results || []).map(slimVectorHit),
    },
    cheatsheet: cheatsheet.text,
    cheatsheet_meta: { ok: cheatsheet.ok, truncated: cheatsheet.truncated, path: cheatsheet.path },
    theme_guidelines: guidelines.text,
    theme_guidelines_meta: { ok: guidelines.ok, truncated: guidelines.truncated, path: guidelines.path },
  };

  const naivePresent = Boolean(loadVdb(projectRoot)?.chunks?.length);

  return {
    local_sr_knowledge: buildLocalCacheForOpenAiPrompt(localCache),
    meta: {
      graphml_path: graph.path,
      graphml_ok: graph.ok,
      vector_hits: (vec.results || []).length,
      naive_vdb_present: naivePresent,
      vdb_source: vec.vdb_source || null,
      vector_error: vec.error || null,
      query_used: q.slice(0, 2000),
      cheatsheet_chars: (cheatsheet.text || "").length,
      guidelines_chars: (guidelines.text || "").length,
    },
  };
}

function resolveThemeInjectGraphmlPromptMaxBytes() {
  const n = parseInt(String(process.env.DITTO_THEME_INJECT_GRAPHML_PROMPT_MAX_BYTES || "56000"), 10);
  if (Number.isFinite(n) && n >= 4000 && n <= 250000) return n;
  return 56000;
}

/**
 * The full graphml excerpt can be 200k+ chars. If we JSON.stringify(live_site + local_cache) and
 * `.slice(0, 190_000)`, the tail (vector hits, cheatsheets) is **cut off** — the model then truthfully
 * says those inputs were "missing". For OpenAI we cap graph text and put vector hits + markdown first.
 *
 * @param {object} lc full local_cache object (includes large graphml.excerpt)
 */
function buildLocalCacheForOpenAiPrompt(lc) {
  const graphExcerpt = String(lc.graphml?.excerpt || "");
  const cap = resolveThemeInjectGraphmlPromptMaxBytes();
  const excerpt = graphExcerpt.slice(0, cap);
  const hits = Array.isArray(lc.vector_search?.hits) ? lc.vector_search.hits : [];
  const cs = String(lc.cheatsheet || "");
  const gl = String(lc.theme_guidelines || "");
  return {
    cache_summary_for_model: {
      vector_hit_count: hits.length,
      cheatsheet_chars: cs.length,
      theme_guidelines_chars: gl.length,
      graphml_file_bytes_on_disk: lc.graphml?.file_size_bytes ?? null,
      graphml_excerpt_chars_in_this_prompt: excerpt.length,
      graphml_excerpt_capped_for_prompt: graphExcerpt.length > cap,
    },
    vector_search: lc.vector_search,
    cheatsheet_excerpt: cs.slice(0, 32_000),
    theme_guidelines_excerpt: gl.slice(0, 26_000),
    cheatsheet_meta: lc.cheatsheet_meta,
    theme_guidelines_meta: lc.theme_guidelines_meta,
    graphml: {
      ok: lc.graphml?.ok,
      error: lc.graphml?.error || null,
      approx_nodes_in_excerpt: lc.graphml?.approx_nodes_in_excerpt,
      truncated_on_disk_read: lc.graphml?.truncated,
      excerpt: excerpt,
    },
  };
}

function slimVectorHit(row) {
  const ch = row.chunk || {};
  const text = String(ch.text || "").replace(/\s+/g, " ").trim();
  return {
    score: Number(row.score.toFixed(4)),
    source: ch.source,
    heading: ch.heading,
    id: ch.id,
    text_preview: text.slice(0, 700),
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} ta
 */
function typographyAiHasUsableFonts(ta) {
  if (!ta || typeof ta !== "object" || ta.error) {
    return false;
  }
  if (String(ta.primary_font_family || "").trim() || String(ta.body_font_family || "").trim()) {
    return true;
  }
  const est = ta.typography_site_estimate;
  return Boolean(est && typeof est === "object" && !Array.isArray(est));
}

function isValidTypographyExtractAiSnapshot(snap) {
  if (!snap || typeof snap !== "object" || snap.ok === false) {
    return false;
  }
  if (!String(snap.website_url || "").trim()) {
    return false;
  }
  const ta = snap.typography_ai;
  if (!typographyAiHasUsableFonts(ta)) {
    return false;
  }
  const cs = snap.css_signals;
  if (!cs || typeof cs !== "object") {
    return false;
  }
  return true;
}

/** Full JSON from POST /api/typography-extract-url (green). */
function isValidTypographyExtractUrlSnapshot(snap) {
  if (!snap || typeof snap !== "object" || snap.ok === false) {
    return false;
  }
  if (!String(snap.website_url || "").trim()) {
    return false;
  }
  return typographyAiHasUsableFonts(snap.typography_ai);
}

async function decideThemeInjectPlanOpenAI(o) {
  const reuse =
    o.liveSite &&
    o.liveSite._meta &&
    (o.liveSite._meta.live_site_source === "typography_extract_ai_reuse" ||
      o.liveSite._meta.live_site_source === "typography_extract_url_reuse");
  const pwBundle =
    o.liveSite &&
    o.liveSite._meta &&
    o.liveSite._meta.typography_ai_source === "playwright_bundle";

  const system = `You are a HubSpot CMS + Sprocket Rocket (SR) theme implementer.

You receive json with:
1) live_site — url, page_title, typography_ai (site typography signals), hero_ai (hero signals), css_signals_summary, and _meta (includes typography_ai_source when known).
2) local_cache — **reordered for the prompt**: small cache_summary_for_model first, then vector_search (semantic hits), cheatsheet_excerpt, theme_guidelines_excerpt, then a **capped** graphml.excerpt (full graph on disk can be megabytes).

${
  reuse
    ? `**Important:** live_site was built by **reusing** the user's prior \`/api/typography-extract-ai\` run (purple flow). Treat \`typography_ai\` and \`hero_ai\` as the **canonical** typography/hero extract for this URL. Your job is to **align** the injection plan with **local_cache** (vector hits, markdown excerpts, graph excerpt): cite where SR docs/modules support the extract, and call out gaps or conflicts in risks_or_unknowns — do not silently ignore the provided extract.`
    : ""
}
${
  pwBundle
    ? `
**Computed typography bundle:** \`live_site._meta.typography_ai_source\` is \`playwright_bundle\`. Heading/body sizes and stacks in \`typography_ai.playwright_typography_planner_summary\` (and scale fields) come from **browser-computed** styles merged into purple — treat them as **high-confidence ground truth** for the live site. Use **local_cache** to choose SR-appropriate modules, HubSpot field patterns, and to flag where SR docs **differ** from the client's exact metrics (say so in risks_or_unknowns). Do not dismiss computed sizes as "unverified guesses".`
    : ""
}

Your job: decide what to **inject** into an SR-based HubSpot theme so the new theme matches the client's site as well as SR conventions allow. This is guidance for a developer, not executable HubL.

Return ONLY valid json (no markdown). Keys:
{
  "plain_english_summary": string,
  "typography_inject": {
    "heading_font_plan": string,
    "body_font_plan": string,
    "hubspot_actions": string[]
  },
  "module_plan": [
    {
      "sr_module_name": string,
      "role_on_page": string,
      "why": string,
      "confidence": number,
      "inject_order": number
    }
  ],
  "theme_level_notes": string[],
  "risks_or_unknowns": string[],
  "how_local_cache_was_used": string
}

Rules:
- Prefer SR module names that appear in vector_search.hits or graphml excerpt text when possible.
- **how_local_cache_was_used** must agree with \`local_cache.cache_summary_for_model\`: if \`vector_hit_count\` > 0, state that semantic vector hits were used and name 1–3 source files from hits; if \`cheatsheet_chars\` / \`theme_guidelines_chars\` > 0, say those excerpts were included. Do not claim vector hits or cheatsheets were "missing" when the counts show otherwise.
- If typography_ai has low confidence (e.g. confidence < 0.55 and no playwright bundle), say so and recommend verifying in browser or theme CSS. If typography_ai_source is playwright_bundle, confidence is from computed styles — focus risks on SR/cache **convention** conflicts, not "unknown font sizes".
- Do not invent Google Fonts URLs; prefer \`typography_ai.playwright_typography_planner_summary.google_fonts_urls\` when present, else \`typography_ai.typography_site_estimate_planner_summary.google_fonts_urls\`, else \`typography_ai.google_fonts_detected\`.
- The word json appears here for API json mode compliance.`;

  const userObj = {
    _meta: { response_kind: "json_object theme inject plan from cache" },
    live_site: o.liveSite,
    local_cache: o.localCache,
  };
  let user = JSON.stringify(userObj);
  if (user.length > 900_000) {
    user = user.slice(0, 900_000);
  }

  return openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model,
    system,
    user,
    latencyProfile: "theme_inject_plan",
  });
}

/**
 * @param {{
 *   projectRoot: string,
 *   websiteUrl: string,
 *   apiKey: string,
 *   model?: string,
 *   vectorK?: number,
 *   typographyExtractAi?: Record<string, unknown> | null,
 *   typographyExtractUrl?: Record<string, unknown> | null,
 *   playwrightExtract?: Record<string, unknown> | null,
 * }} opts
 */
async function runThemeInjectPlanFromCache(opts) {
  const projectRoot = opts.projectRoot;
  const websiteUrl = opts.websiteUrl;
  const apiKey = opts.apiKey;
  const model = opts.model;
  const vectorK = typeof opts.vectorK === "number" ? opts.vectorK : 10;

  const pwExtract = opts.playwrightExtract || null;
  const snapPurple = opts.typographyExtractAi || null;
  const snapGreen = opts.typographyExtractUrl || null;

  /** @type {"playwright"|"purple"|"green_url"|null} */
  let reuseKind = null;
  /** @type {Record<string, unknown>|null} */
  let snap = null;

  if (pwExtract && isUsablePlaywrightExtract(pwExtract, websiteUrl)) {
    reuseKind = "playwright";
    snap = pwExtract;
  } else if (
    snapPurple &&
    isValidTypographyExtractAiSnapshot(snapPurple) &&
    sameWebsiteUrl(snapPurple.website_url, websiteUrl)
  ) {
    snap = snapPurple;
    reuseKind = "purple";
  } else if (
    snapGreen &&
    isValidTypographyExtractUrlSnapshot(snapGreen) &&
    sameWebsiteUrl(snapGreen.website_url, websiteUrl)
  ) {
    snap = snapGreen;
    reuseKind = "green_url";
  }

  if ((pwExtract || snapPurple || snapGreen) && !reuseKind) {
    const bad = pwExtract || snapPurple || snapGreen;
    if (
      pwExtract &&
      !isUsablePlaywrightExtract(pwExtract, websiteUrl) &&
      !typographyAiHasUsableFonts(bad?.typography_ai)
    ) {
      return {
        ok: false,
        http_status: 400,
        error:
          "Passed Typography extract is missing typography for this URL. Re-run Playwright extract first.",
      };
    }
    if (!typographyAiHasUsableFonts(bad?.typography_ai)) {
      return {
        ok: false,
        http_status: 400,
        error:
          "Passed extract snapshot has no usable typography. Run Typography extract for this URL first.",
      };
    }
    return {
      ok: false,
      http_status: 400,
      error: `Extract snapshot was for a different URL (${bad?.website_url || bad?.websiteUrl || "?"}). Re-run for ${websiteUrl} or change the URL field.`,
    };
  }

  let fetched = null;
  /** @type {Record<string, unknown>} */
  let cssSignals = {};
  let typographyAi = null;
  let heroAi = null;
  const typographySnapshotReuse = Boolean(reuseKind);

  if (reuseKind === "playwright" && snap) {
    typographyAi = buildTypographyAiFromPlaywright(snap);
    heroAi = buildHeroAiFromPlaywright(snap);
    cssSignals = {
      page_title: snap.page_title || null,
      stylesheet_urls: [],
      google_fonts_links: [],
      font_face_families: [],
      preload_font_urls: [],
      inline_style_blocks_chars: 0,
      font_family_lines: [],
      font_size_lines: [],
      color_lines: [],
    };
    fetched = {
      ok: true,
      status: 200,
      truncated: false,
      html: "",
      length: 0,
      max_chars_used: 0,
    };
  } else if (reuseKind === "purple" && snap) {
    cssSignals = /** @type {Record<string, unknown>} */ (snap.css_signals);
    typographyAi = snap.typography_ai;
    heroAi =
      snap.hero_ai &&
      typeof snap.hero_ai === "object" &&
      !snap.hero_ai.error
        ? snap.hero_ai
        : null;
    fetched = {
      ok: true,
      status: snap.html_fetch && typeof snap.html_fetch === "object" ? snap.html_fetch.status : 200,
      truncated: snap.html_fetch && snap.html_fetch.truncated,
      html: "",
      length: snap.html_fetch && typeof snap.html_fetch.length === "number" ? snap.html_fetch.length : 0,
      max_chars_used: snap.html_fetch && snap.html_fetch.max_chars_used,
    };
  } else if (reuseKind === "green_url" && snap) {
    typographyAi = snap.typography_ai;
    fetched = await fetchHtmlSnippet(websiteUrl);
    if (!fetched.ok || !fetched.html || fetched.html.length < 200) {
      return {
        ok: false,
        error:
          fetched.error ||
          `HTML fetch failed for hero/css_signals (status ${fetched.status}, ${fetched.html?.length || 0} chars)`,
        fetch: {
          ok: fetched.ok,
          status: fetched.status,
          length: fetched.html?.length || 0,
          timed_out: Boolean(fetched.timed_out),
        },
      };
    }
    cssSignals = extractCssSignalsFromHtml(fetched.html, websiteUrl);
    mergeGoogleFontScanIntoCssSignals(cssSignals, fetched.google_font_urls_scanned_global);
    try {
      heroAi = await extractHeroOpenAI({
        websiteUrl,
        htmlSnippet: fetched.html,
        cssSignals,
        typographyAi: typographyAi && !typographyAi.error ? typographyAi : null,
        apiKey,
        model,
      });
    } catch (e) {
      heroAi = { error: e.message || String(e) };
    }
  } else {
    fetched = await fetchHtmlSnippet(websiteUrl);
    if (!fetched.ok || !fetched.html || fetched.html.length < 200) {
      return {
        ok: false,
        error:
          fetched.error ||
          `HTML fetch failed (status ${fetched.status}, ${fetched.html?.length || 0} chars)`,
        fetch: {
          ok: fetched.ok,
          status: fetched.status,
          length: fetched.html?.length || 0,
          timed_out: Boolean(fetched.timed_out),
        },
      };
    }

    cssSignals = extractCssSignalsFromHtml(fetched.html, websiteUrl);
    mergeGoogleFontScanIntoCssSignals(cssSignals, fetched.google_font_urls_scanned_global);

    try {
      typographyAi = await extractTypographyOpenAI({
        websiteUrl,
        htmlSnippet: fetched.html,
        cssSignals,
        apiKey,
        model,
      });
    } catch (e) {
      typographyAi = { error: e.message || String(e) };
    }
    try {
      heroAi = await extractHeroOpenAI({
        websiteUrl,
        htmlSnippet: fetched.html,
        cssSignals,
        typographyAi: typographyAi && !typographyAi.error ? typographyAi : null,
        apiKey,
        model,
      });
    } catch (e) {
      heroAi = { error: e.message || String(e) };
    }
  }

  const graph = loadGraphmlExcerpt(projectRoot);
  const q = buildModuleSearchQuery(
    websiteUrl,
    cssSignals.page_title,
    typographyAi,
    heroAi,
  );
  const vec = await retrieveTopKFromProjectCache(projectRoot, q, vectorK, apiKey);
  const cheatsheet = readMdSlice(projectRoot, "08-sr-modules-selection-cheatsheet.md", 28_000);
  const guidelines = readMdSlice(projectRoot, "07-sr-theme-guidelines-core.md", 24_000);

  const localCache = {
    graphml: {
      ok: graph.ok,
      path: graph.path,
      file_size_bytes: graph.file_size_bytes,
      bytes_read: graph.bytes_read,
      approx_nodes_in_excerpt: graph.approx_nodes_in_excerpt,
      truncated: graph.truncated,
      error: graph.error || null,
      excerpt: graph.excerpt || "",
    },
    vector_search: {
      ok: vec.ok,
      vdb_source: vec.vdb_source || null,
      query_used: q.slice(0, 2000),
      model: vec.model,
      dim: vec.dim,
      error: vec.error || null,
      hits: (vec.results || []).map(slimVectorHit),
    },
    cheatsheet: cheatsheet.text,
    cheatsheet_meta: { ok: cheatsheet.ok, truncated: cheatsheet.truncated, path: cheatsheet.path },
    theme_guidelines: guidelines.text,
    theme_guidelines_meta: { ok: guidelines.ok, truncated: guidelines.truncated, path: guidelines.path },
  };

  const naivePresent = Boolean(loadVdb(projectRoot)?.chunks?.length);

  const typographyAiSource = typographySnapshotReuse
    ? reuseKind === "playwright"
      ? "playwright_typography_service"
      : reuseKind === "green_url"
        ? String(snap.typography_ai_source || snap.extraction_mode || "web_search_url").trim() ||
          "web_search_url"
        : String(snap.typography_ai_source || "").trim() ||
          (typographyAi &&
          typeof typographyAi === "object" &&
          !typographyAi.error &&
          (typographyAi._ditto_source === "playwright_typography_bundle" ||
            (typographyAi.playwright_typography_full_page &&
              typeof typographyAi.playwright_typography_full_page === "object"))
            ? "playwright_bundle"
            : "openai_html")
    : null;

  const typographyAiForPlanner = slimTypographyAiForThemePlanner(
    typographyAi && typeof typographyAi === "object" ? typographyAi : null,
  );

  const liveSite = {
    _meta: {
      live_site_source: typographySnapshotReuse
        ? reuseKind === "playwright"
          ? "typography_extract_playwright_reuse"
          : reuseKind === "green_url"
            ? "typography_extract_url_reuse"
            : "typography_extract_ai_reuse"
        : "html_fetch_openai_fresh",
      ...(typographyAiSource ? { typography_ai_source: typographyAiSource } : {}),
    },
    url: websiteUrl,
    page_title: cssSignals.page_title || null,
    typography_ai: typographyAiForPlanner,
    hero_ai: heroAi,
    css_signals_summary: {
      stylesheet_urls: Array.isArray(cssSignals.stylesheet_urls)
        ? cssSignals.stylesheet_urls.length
        : 0,
      google_fonts_links: cssSignals.google_fonts_links,
      font_face_families: cssSignals.font_face_families,
      font_family_lines: (cssSignals.font_family_lines || []).slice(0, 12),
    },
  };

  let theme_inject_plan = null;
  try {
    theme_inject_plan = await decideThemeInjectPlanOpenAI({
      apiKey,
      model,
      liveSite,
      localCache: buildLocalCacheForOpenAiPrompt(localCache),
    });
  } catch (e) {
    theme_inject_plan = { error: e.message || String(e) };
  }

  return {
    ok: true,
    website_url: websiteUrl,
    openai_model: model,
    typography_extract_ai_reused: reuseKind === "purple",
    typography_extract_url_reused: reuseKind === "green_url",
    ...(typographyAiSource ? { typography_ai_source: typographyAiSource } : {}),
    html_fetch: typographySnapshotReuse
      ? {
          ok: true,
          mode:
            reuseKind === "green_url"
              ? "typography_extract_url_reuse"
              : "typography_extract_ai_reuse",
          from_snapshot:
            reuseKind === "purple" ? snap.html_fetch || null : snap.html_fetch_fallback || null,
        }
      : {
          ok: fetched.ok,
          status: fetched.status,
          truncated: Boolean(fetched.truncated),
          length: fetched.html.length,
          max_chars_used: fetched.max_chars_used,
        },
    typography_ai: typographyAi,
    hero_ai: heroAi,
    cache_bundle_meta: {
      graphml_bytes_in_prompt: graph.bytes_read || 0,
      vector_hits: (vec.results || []).length,
      naive_vdb_present: naivePresent,
      cheatsheet_chars: (cheatsheet.text || "").length,
      guidelines_chars: (guidelines.text || "").length,
    },
    local_cache_for_response: {
      graphml: {
        ok: graph.ok,
        file_size_bytes: graph.file_size_bytes,
        bytes_read: graph.bytes_read,
        approx_nodes_in_excerpt: graph.approx_nodes_in_excerpt,
        truncated: graph.truncated,
        error: graph.error || null,
      },
      vector_search: {
        ok: vec.ok,
        vdb_source: vec.vdb_source,
        model: vec.model,
        dim: vec.dim,
        error: vec.error || null,
        hits: localCache.vector_search.hits,
      },
      cheatsheet_meta: localCache.cheatsheet_meta,
      theme_guidelines_meta: localCache.theme_guidelines_meta,
    },
    theme_inject_plan,
  };
}

module.exports = {
  runThemeInjectPlanFromCache,
  loadGraphmlExcerpt,
  retrieveTopKFromProjectCache,
  loadLightragTypographyContextForAi,
  buildTypographyLightragQuery,
};
