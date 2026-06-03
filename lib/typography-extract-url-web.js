/**
 * URL typography: (1) OpenAI + web_search, then (2) if fonts/sizes are missing,
 * HTML download + css_signals + OpenAI (same idea as purple, no Playwright).
 * Playwright stays on POST /api/typography-extract only.
 */

const {
  openaiJsonChat,
  fetchHtmlSnippet,
  extractCssSignalsFromHtml,
  mergeGoogleFontScanIntoCssSignals,
  extractTypographyOpenAI,
  DEFAULT_MODEL,
  resolveOpenAiWebSearchEnabled,
  resolveOpenAiRequestTimeoutMs,
} = require("./hero-match-pipeline");
const { enrichTypographyAiFromOpenAiResponse } = require("./typography-extract-synth-from-ai");

/**
 * @param {Record<string, unknown>|null} ai
 */
function firstFontNameFromCssStack(stack) {
  const str = String(stack || "").trim();
  const m = str.match(/"([^"]+)"/);
  if (m) {
    return m[1].trim();
  }
  return str.split(",")[0].replace(/^['"]+|['"]+$/g, "").trim();
}

/**
 * Deterministic minimum when OpenAI JSON fails but HTML css_signals has font rules.
 * @param {Record<string, unknown>} cssSignals
 */
function buildTypographyAiFromCssSignals(cssSignals) {
  /** @type {string[]} */
  const families = [];
  const lines = Array.isArray(cssSignals.font_family_lines) ? cssSignals.font_family_lines : [];
  for (const line of lines) {
    const m = String(line).match(/font-family:\s*([^;}{]+)/i);
    if (m) {
      const name = firstFontNameFromCssStack(m[1]);
      if (name && !families.some((f) => f.toLowerCase() === name.toLowerCase())) {
        families.push(name);
      }
    }
  }
  for (const f of cssSignals.font_face_families || []) {
    const name = String(f).trim();
    if (name && !families.some((x) => x.toLowerCase() === name.toLowerCase())) {
      families.push(name);
    }
  }
  const primary = families[0] || null;
  const body = families[1] || primary;
  if (!primary) {
    return { error: "no font-family lines in css_signals" };
  }
  const stack = (name) => `"${name.replace(/"/g, "")}", sans-serif`;
  const est = {
    fonts: { headings: stack(primary), body: stack(body || primary) },
    headings: {
      h1: {
        fontFamily: stack(primary),
        fontSize: "48px",
        fontWeight: "700",
        lineHeight: "1.1",
        color: "#000000",
      },
    },
    body: {
      fontFamily: stack(body || primary),
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "1.5",
      color: "#333333",
    },
    google_fonts_urls: Array.isArray(cssSignals.google_fonts_links)
      ? cssSignals.google_fonts_links.slice(0, 8)
      : [],
    font_face_urls: Array.isArray(cssSignals.preload_font_urls)
      ? cssSignals.preload_font_urls.slice(0, 12)
      : [],
    font_stylesheet_urls: Array.isArray(cssSignals.stylesheet_urls)
      ? cssSignals.stylesheet_urls.slice(0, 8)
      : [],
  };
  return enrichTypographyAiFromOpenAiResponse({
    primary_font_family: primary,
    body_font_family: body || primary,
    google_fonts_detected: [],
    font_face_only_families: cssSignals.font_face_families || [],
    approximate_scale: { h1_px: null, body_px: null },
    confidence: 0.62,
    caveat:
      "Typography inferred from downloaded HTML css_signals (font-family / @font-face lines). Sizes/colors are placeholders — use Playwright for computed px.",
    page_title: cssSignals.page_title || null,
    typography_site_estimate: est,
    _ditto_source: "css_signals_heuristic",
  });
}

function typographyAiNeedsHtmlFallback(ai) {
  if (!ai || typeof ai !== "object" || ai.error) {
    return true;
  }
  const conf = Number(ai.confidence);
  if (Number.isFinite(conf) && conf < 0.55) {
    return true;
  }
  const est = ai.typography_site_estimate;
  if (!est || typeof est !== "object") {
    return true;
  }
  const body = est.body && typeof est.body === "object" ? est.body : null;
  const h1 = est.headings?.h1 && typeof est.headings.h1 === "object" ? est.headings.h1 : null;
  const hasFont =
    (body && String(body.fontFamily || "").trim()) ||
    (h1 && String(h1.fontFamily || "").trim()) ||
    String(ai.primary_font_family || "").trim();
  return !hasFont;
}

/**
 * @param {Record<string, unknown>} webAi
 * @param {Record<string, unknown>} htmlAi
 */
function mergeWebSearchWithHtmlTypography(webAi, htmlAi) {
  if (!htmlAi || typeof htmlAi !== "object" || htmlAi.error) {
    return webAi;
  }
  const out = { ...webAi };
  if (webAi && typeof webAi === "object" && webAi.error) {
    out._ditto_web_search_error = String(webAi.error);
  }
  delete out.error;
  if (htmlAi.page_title && !out.page_title) {
    out.page_title = htmlAi.page_title;
  }
  if (htmlAi.typography_site_estimate && typeof htmlAi.typography_site_estimate === "object") {
    out.typography_site_estimate = htmlAi.typography_site_estimate;
  }
  if (htmlAi.primary_font_family) {
    out.primary_font_family = htmlAi.primary_font_family;
  }
  if (htmlAi.body_font_family) {
    out.body_font_family = htmlAi.body_font_family;
  }
  if (Array.isArray(htmlAi.google_fonts_detected) && htmlAi.google_fonts_detected.length) {
    out.google_fonts_detected = htmlAi.google_fonts_detected;
  }
  if (Array.isArray(htmlAi.font_face_only_families) && htmlAi.font_face_only_families.length) {
    out.font_face_only_families = htmlAi.font_face_only_families;
  }
  if (htmlAi.approximate_scale && typeof htmlAi.approximate_scale === "object") {
    const ws = out.approximate_scale && typeof out.approximate_scale === "object" ? out.approximate_scale : {};
    out.approximate_scale = {
      h1_px: ws.h1_px ?? htmlAi.approximate_scale.h1_px,
      body_px: ws.body_px ?? htmlAi.approximate_scale.body_px,
    };
  }
  const wc = Number(out.confidence);
  const hc = Number(htmlAi.confidence);
  out.confidence = Math.max(Number.isFinite(wc) ? wc : 0, Number.isFinite(hc) ? hc : 0.72, 0.55);
  const parts = [
    String(out.caveat || "").trim(),
    String(htmlAi.caveat || "").trim(),
    "web_search could not read CSS; merged typography from downloaded HTML + css_signals (not Playwright).",
  ].filter(Boolean);
  out.caveat = parts.join(" ");
  out._ditto_source = "web_search_url+html_fetch_ai";
  out._ditto_html_fetch_fallback = true;
  return enrichTypographyAiFromOpenAiResponse(out);
}

/**
 * @param {{
 *   websiteUrl: string,
 *   apiKey: string,
 *   model?: string,
 * }} opts
 */
async function extractTypographyFromHtmlFetchAi(opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const fetched = await fetchHtmlSnippet(websiteUrl);
  if (!fetched.ok || !fetched.html || fetched.html.length < 200) {
    return {
      error:
        fetched.error ||
        `HTML fetch failed (status ${fetched.status}, ${fetched.html?.length || 0} chars)`,
      html_fetch: { ok: false },
    };
  }
  const cssSignals = extractCssSignalsFromHtml(fetched.html, websiteUrl);
  mergeGoogleFontScanIntoCssSignals(cssSignals, fetched.google_font_urls_scanned_global);
  const htmlMeta = {
    ok: true,
    status: fetched.status,
    length: fetched.html.length,
    css_signals_summary: {
      font_face_families: cssSignals.font_face_families,
      google_fonts_links: cssSignals.google_fonts_links,
      font_family_lines_count: (cssSignals.font_family_lines || []).length,
    },
  };

  let ai = null;
  let aiParseError = null;
  try {
    ai = await extractTypographyOpenAI({
      websiteUrl,
      htmlSnippet: fetched.html,
      cssSignals,
      apiKey: opts.apiKey,
      model: opts.model,
    });
  } catch (e) {
    aiParseError = e.message || String(e);
    ai = { error: aiParseError };
  }

  if (ai && typeof ai === "object" && !ai.error && !typographyAiNeedsHtmlFallback(ai)) {
    ai._ditto_source = "html_fetch_ai";
    ai.html_fetch = htmlMeta;
    return ai;
  }

  const heuristic = buildTypographyAiFromCssSignals(cssSignals);
  if (heuristic && !heuristic.error) {
    heuristic.html_fetch = htmlMeta;
    heuristic._ditto_html_ai_parse_error = aiParseError || ai?.error || null;
    return heuristic;
  }

  return {
    error:
      aiParseError ||
      ai?.error ||
      heuristic?.error ||
      "HTML fallback could not infer typography",
    html_fetch: htmlMeta,
  };
}

/**
 * @param {{
 *   websiteUrl: string,
 *   apiKey: string,
 *   model?: string,
 *   enableWebSearch?: boolean,
 * }} opts
 */
async function extractTypographyFromUrlWebOpenAI(opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const model = opts.model || DEFAULT_MODEL;
  const webSearch = resolveOpenAiWebSearchEnabled(opts.enableWebSearch);

  const system = `You are a web typography analyst for HubSpot theme cloning.

You MUST use the web_search tool multiple times if needed:
1) Open the homepage URL.
2) Search for stylesheet / font clues: site CSS, Google Fonts links, @font-face, hs-fs/hubfs font paths, "fonts.googleapis.com" on this domain.
3) Prefer evidence from linked CSS and font files over guessing from logo/brand alone.

Extract: heading and body font families, h1/body px sizes, text/background colors, button styles, google_fonts_detected.

Return ONLY one valid json object (no markdown) with keys:
{
  "primary_font_family": string | null,
  "body_font_family": string | null,
  "google_fonts_detected": string[],
  "font_face_only_families": string[],
  "approximate_scale": { "h1_px": number | null, "body_px": number | null },
  "confidence": number,
  "caveat": string,
  "page_title": string | null,
  "typography_site_estimate": {
    "fonts": { "headings": string, "body": string },
    "headings": { "h1": { "fontFamily": string, "fontSize": string, "fontWeight": string, "lineHeight": string, "color": string } },
    "body": { "fontFamily": string, "fontSize": string, "fontWeight": string, "lineHeight": string, "color": string },
    "google_fonts_urls": string[],
    "font_face_urls": string[],
    "font_stylesheet_urls": string[]
  } | null,
  "sources_consulted": string[]
}

Use real font names. No var(--cl-*). If you truly cannot find any font evidence, set confidence below 0.4 and typography_site_estimate null — a server fallback will download HTML.`;

  const user = JSON.stringify({
    _meta: { response_kind: "json_object url typography via web_search" },
    website_url: websiteUrl,
    task: "Extract client site typography for SR HubSpot theme bake.",
  });

  const parsed = await openaiJsonChat({
    apiKey: opts.apiKey,
    model,
    system,
    user,
    latencyProfile: "typography",
    enableWebSearch: webSearch,
  });

  const enriched = enrichTypographyAiFromOpenAiResponse(
    /** @type {Record<string, unknown>} */ (parsed),
  );
  if (enriched && typeof enriched === "object") {
    enriched._ditto_source = "web_search_url";
  }
  return enriched;
}

/**
 * @param {{
 *   websiteUrl: string,
 *   apiKey: string,
 *   model?: string,
 *   enableWebSearch?: boolean,
 *   htmlFetchFallback?: boolean,
 * }} opts
 */
async function runTypographyExtractUrlWeb(opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const model = opts.model || DEFAULT_MODEL;
  const webSearch = resolveOpenAiWebSearchEnabled(opts.enableWebSearch);
  const useHtmlFallback =
    opts.htmlFetchFallback !== false && opts.htmlFetchFallback !== "false";

  let typographyAi = null;
  let aiError = null;
  try {
    typographyAi = await extractTypographyFromUrlWebOpenAI({
      websiteUrl,
      apiKey: opts.apiKey,
      model,
      enableWebSearch: webSearch,
    });
  } catch (e) {
    aiError = e.message || String(e);
    typographyAi = { error: aiError };
  }

  /** @type {Record<string, unknown>} */
  const htmlFetchFallback = {
    attempted: false,
    ok: false,
    used_for_merge: false,
    skipped: !useHtmlFallback,
  };

  let extractionMode = webSearch ? "web_search" : "openai_url";

  if (
    useHtmlFallback &&
    (!typographyAi || typographyAi.error || typographyAiNeedsHtmlFallback(typographyAi))
  ) {
    htmlFetchFallback.attempted = true;
    try {
      const htmlAi = await extractTypographyFromHtmlFetchAi({
        websiteUrl,
        apiKey: opts.apiKey,
        model,
      });
      htmlFetchFallback.ok = Boolean(htmlAi && !htmlAi.error);
      if (htmlAi && !htmlAi.error && !typographyAiNeedsHtmlFallback(htmlAi)) {
        typographyAi = mergeWebSearchWithHtmlTypography(typographyAi, htmlAi);
        htmlFetchFallback.used_for_merge = true;
        extractionMode = "web_search+html_fetch_ai";
      } else if (htmlAi && !htmlAi.error) {
        typographyAi = htmlAi;
        const src = String(htmlAi._ditto_source || "html_fetch_ai");
        if (!typographyAi._ditto_source) {
          typographyAi._ditto_source = "html_fetch_ai";
        }
        if (aiError) {
          typographyAi._ditto_web_search_error = aiError;
        }
        delete typographyAi.error;
        typographyAi.caveat = String(typographyAi.caveat || "").trim()
          ? `${typographyAi.caveat} (web_search had no fonts; using HTML path only.)`
          : aiError
            ? `Web search step failed (${aiError.slice(0, 120)}); using HTML download + css_signals only.`
            : "web_search had no fonts; using HTML download + css_signals only.";
        htmlFetchFallback.used_for_merge = true;
        if (htmlAi._ditto_html_ai_parse_error) {
          htmlFetchFallback.openai_parse_error = htmlAi._ditto_html_ai_parse_error;
        }
        extractionMode =
          src === "css_signals_heuristic" ? "html_fetch_css_signals" : "html_fetch_ai";
      } else {
        htmlFetchFallback.error = htmlAi?.error || "HTML fallback still has no usable fonts";
      }
    } catch (e) {
      htmlFetchFallback.error = e.message || String(e);
    }
  }

  const hasUsableTypography = Boolean(
    typographyAi && !typographyAiNeedsHtmlFallback(typographyAi),
  );
  if (hasUsableTypography && typographyAi && typeof typographyAi === "object") {
    delete typographyAi.error;
  }
  const ok = hasUsableTypography;

  const timeoutMs = resolveOpenAiRequestTimeoutMs(webSearch);

  const failureMessage = ok
    ? null
    : typographyAi?.error ||
      aiError ||
      htmlFetchFallback.error ||
      "No usable typography (web_search and HTML fallback did not yield fonts). Run Playwright extract for ground truth.";

  return {
    ok,
    website_url: websiteUrl,
    openai_model: model,
    extraction_mode: extractionMode,
    web_search_enabled: webSearch,
    openai_request_timeout_ms: timeoutMs,
    typography_ai: typographyAi,
    typography_ai_source:
      typographyAi && typographyAi._ditto_source
        ? String(typographyAi._ditto_source)
        : "web_search_url",
    html_fetch_fallback: htmlFetchFallback,
    ...(aiError && hasUsableTypography ? { web_search_error: aiError } : {}),
    error: failureMessage,
  };
}

module.exports = {
  runTypographyExtractUrlWeb,
  extractTypographyFromUrlWebOpenAI,
  typographyAiNeedsHtmlFallback,
};
