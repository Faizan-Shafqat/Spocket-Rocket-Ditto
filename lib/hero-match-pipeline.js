/**
 * Dual-path typography extraction (Playwright API + OpenAI on HTML) and
 * SR Hero 01 fit decision using local LightRAG *source* docs (cache/lightrag/source).
 *
 * Env: OPENAI_API_KEY (required), OPENAI_MODEL (optional, default gpt-5.5),
 * OPENAI_ENABLE_WEB_SEARCH=1 enables `tools: [{ type: "web_search" }]` on Responses API calls when requested.
 * OPENAI_RESPONSES_URL (optional), OPENAI_MAX_OUTPUT_TOKENS (global ceiling for /v1/responses),
 * per-profile caps OPENAI_RESPONSES_MAX_OUT_* (see .env.example),
 * OPENAI_RESPONSES_REASONING_EFFORT (none|low|…|off), OPENAI_RESPONSES_TEXT_VERBOSITY (low|…|off),
 * OPENAI_RESPONSES_SERVICE_TIER (priority|flex), OPENAI_JSON_CHAT_USE_RESPONSES=1.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

/** Long-lived HTTPS agent so OpenAI + web_search is not cut off at ~30s socket idle. */
let openAiHttpsAgent = null;
function getOpenAiHttpsAgent() {
  if (!openAiHttpsAgent) {
    const socketMs = resolveOpenAiRequestTimeoutMs(true);
    openAiHttpsAgent = new https.Agent({
      keepAlive: true,
      timeout: socketMs > 0 ? socketMs : 600_000,
    });
  }
  return openAiHttpsAgent;
}

const { loadVdb, retrieveTopK } = require("./embeddings-store");
const lightragClient = require("./lightrag-client");
const { enrichTypographyAiFromOpenAiResponse } = require("./typography-extract-synth-from-ai");

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";

function resolveOpenAiWebSearchEnabled(override) {
  if (override === true) return true;
  if (override === false) return false;
  const raw = String(process.env.OPENAI_ENABLE_WEB_SEARCH ?? "1").trim().toLowerCase();
  return raw !== "0" && raw !== "false" && raw !== "off";
}

/**
 * Outbound OpenAI HTTP wait (ms). Web-search Responses often run 60–180s+.
 * `OPENAI_REQUEST_TIMEOUT_MS`: unset → 600000 with web_search, else 300000; `0` → no AbortController.
 *
 * @param {boolean} [enableWebSearch]
 * @param {number} [overrideMs]
 */
function resolveOpenAiRequestTimeoutMs(enableWebSearch, overrideMs) {
  if (overrideMs != null && Number.isFinite(Number(overrideMs))) {
    const n = Math.floor(Number(overrideMs));
    return n <= 0 ? 0 : Math.min(n, 900_000);
  }
  const raw = process.env.OPENAI_REQUEST_TIMEOUT_MS;
  if (raw !== undefined && String(raw).trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      return n <= 0 ? 0 : Math.min(Math.floor(n), 900_000);
    }
  }
  if (resolveOpenAiWebSearchEnabled(enableWebSearch)) {
    return 600_000;
  }
  return 300_000;
}

/**
 * @param {unknown} err
 */
function isOpenAiTimeoutError(err) {
  return /ETIMEDOUT|ESOCKETTIMEDOUT|timed out|AbortError|aborted/i.test(describeNetworkError(err));
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} init
 * @param {number} timeoutMs
 */
async function fetchOpenAi(url, init, timeoutMs) {
  const ms = timeoutMs ?? resolveOpenAiRequestTimeoutMs(false);
  const isHttps = /^https:/i.test(url);
  /** @type {Record<string, unknown>} */
  const opts = {
    ...init,
    ...(isHttps ? { agent: getOpenAiHttpsAgent() } : {}),
  };
  if (ms <= 0) {
    return fetch(url, opts);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_RESPONSES_URL =
  String(process.env.OPENAI_RESPONSES_URL || "https://api.openai.com/v1/responses").trim() ||
  "https://api.openai.com/v1/responses";

/** Max output tokens for /v1/responses — global ceiling (all profiles clamp to this). */
function resolveOpenAiMaxOutputTokens() {
  const n = Number(process.env.OPENAI_MAX_OUTPUT_TOKENS);
  if (Number.isFinite(n) && n >= 256 && n <= 128_000) return Math.floor(n);
  return 8192;
}

/**
 * Per-call caps for latency (smaller JSON = less generation). Clamped to
 * `resolveOpenAiMaxOutputTokens()` and floor 256.
 *
 * @param {"typography"|"hero"|"integrated"|"sr_hero_fit"|"theme_inject_plan"|"default"} profile
 */
function resolveOpenAiMaxOutputTokensForProfile(profile) {
  const ceiling = resolveOpenAiMaxOutputTokens();
  const p = String(profile || "default");
  const pick = (envKey, fallback) => {
    const n = Number(process.env[envKey]);
    if (Number.isFinite(n) && n >= 256 && n <= 128_000) return Math.floor(n);
    return fallback;
  };
  let target = ceiling;
  if (p === "typography") {
    target = pick("OPENAI_RESPONSES_MAX_OUT_TYPOGRAPHY", 2048);
  } else if (p === "hero") {
    target = pick("OPENAI_RESPONSES_MAX_OUT_HERO", 2048);
  } else if (p === "integrated") {
    target = pick("OPENAI_RESPONSES_MAX_OUT_INTEGRATED", 3072);
  } else if (p === "sr_hero_fit") {
    target = pick("OPENAI_RESPONSES_MAX_OUT_SR_FIT", 3072);
  } else if (p === "theme_inject_plan") {
    target = pick("OPENAI_RESPONSES_MAX_OUT_THEME_PLAN", 4096);
  }
  return Math.min(ceiling, Math.max(256, target));
}

/** `none` | `low` | `medium` | `high` | `xhigh` — omit when env is empty or `off`. */
function resolveResponsesReasoningEffort() {
  const raw = String(process.env.OPENAI_RESPONSES_REASONING_EFFORT ?? "low")
    .trim()
    .toLowerCase();
  if (!raw || raw === "off") {
    return null;
  }
  const allowed = new Set(["none", "low", "medium", "high", "xhigh"]);
  return allowed.has(raw) ? raw : "low";
}

/** `low` | `medium` | `high` — omit when env is `off`. Default `low`. */
function resolveResponsesTextVerbosity() {
  const raw = String(process.env.OPENAI_RESPONSES_TEXT_VERBOSITY ?? "low")
    .trim()
    .toLowerCase();
  if (!raw || raw === "off") {
    return null;
  }
  const allowed = new Set(["low", "medium", "high"]);
  return allowed.has(raw) ? raw : "low";
}

/** Optional Enterprise: `priority` when env set; otherwise omit. */
function resolveResponsesServiceTier() {
  const raw = String(process.env.OPENAI_RESPONSES_SERVICE_TIER || "").trim().toLowerCase();
  if (raw === "priority" || raw === "flex") {
    return raw;
  }
  return null;
}

function modelSupportsResponsesLatencyHints(model) {
  return /^gpt-5/i.test(String(model || ""));
}

/**
 * GPT-5.x *pro* models are routed through the Responses API; chat/completions may return
 * "This is not a chat model…". See https://platform.openai.com/docs/api-reference/responses
 */
function preferOpenAiResponsesApi(model) {
  if (String(process.env.OPENAI_JSON_CHAT_USE_RESPONSES || "").trim() === "1") {
    return true;
  }
  const m = String(model || "");
  // GPT-5 family (e.g. gpt-5.4-mini, gpt-5.5-pro) uses POST /v1/responses, not chat/completions.
  return /^gpt-5/i.test(m);
}

/**
 * @param {unknown} data parsed JSON from POST /v1/responses
 */
function extractResponsesOutputText(data) {
  if (!data || typeof data !== "object") return "";
  const d = /** @type {any} */ (data);
  if (typeof d.output_text === "string" && d.output_text.trim()) return d.output_text;
  const outputs = Array.isArray(d.output) ? d.output : [];
  /** @type {string[]} */
  const texts = [];
  for (const output of outputs) {
    const content = Array.isArray(output?.content) ? output.content : [];
    for (const item of content) {
      if (item?.type === "output_text" && typeof item.text === "string" && item.text.trim()) {
        texts.push(item.text);
      } else if (item?.type === "text" && typeof item.text === "string" && item.text.trim()) {
        texts.push(item.text);
      }
    }
  }
  if (texts.length) return texts[texts.length - 1];
  return "";
}

/**
 * node-fetch / undici often set `message` to "request failed, reason: " with an empty reason.
 * The useful bits are usually on `cause`, `code`, `errno`, `syscall`, or AggregateError.errors.
 * @param {unknown} err
 */
function describeNetworkError(err) {
  if (err == null) return "unknown error";
  const bits = [];
  const seen = new Set();
  function add(s) {
    if (!s || seen.has(s)) return;
    seen.add(s);
    bits.push(s);
  }
  function walk(e, depth) {
    if (!e || depth > 8) return;
    if (typeof e === "string") {
      add(e);
      return;
    }
    if (e instanceof Error) {
      const msg = String(e.message || "").trim();
      if (msg) add(msg);
      if (e.name && e.name !== "Error") add(`[${e.name}]`);
    }
    const any = /** @type {any} */ (e);
    if (any.code) add(`code=${any.code}`);
    if (any.errno != null) add(`errno=${any.errno}`);
    if (any.syscall) add(`syscall=${any.syscall}`);
    if (any.hostname) add(`host=${any.hostname}`);
    if (any.address) add(`address=${any.address}`);
    if (any.port != null) add(`port=${any.port}`);
    if (e instanceof AggregateError && Array.isArray(e.errors)) {
      e.errors.forEach((sub, i) => walk(sub, depth + 1));
    }
    if (any.cause) walk(any.cause, depth + 1);
  }
  walk(err, 0);
  return bits.length ? bits.join(" | ") : String(err);
}

/** Max HTML chars kept for AI (larger = more `<link>` tags included). Env: DITTO_HTML_FETCH_MAX_CHARS */
function resolveHtmlFetchMaxChars(override) {
  if (override != null && Number.isFinite(Number(override))) {
    return Math.min(500_000, Math.max(50_000, Math.floor(Number(override))));
  }
  const n = Number(process.env.DITTO_HTML_FETCH_MAX_CHARS);
  if (Number.isFinite(n) && n >= 50_000 && n <= 500_000) {
    return Math.floor(n);
  }
  return 200_000;
}

/**
 * Scan the **full** HTML string for fonts.googleapis.com URLs (often below the slice cut).
 * @param {string} html
 */
function extractGoogleFontsScanFromText(html) {
  if (!html || typeof html !== "string") return [];
  const found = new Set();
  const re = /https?:\/\/fonts\.googleapis\.com[^"'>\s)\\]+/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let u = m[0].replace(/[,;.)]+$/, "");
    if (u.length > 12 && u.length < 800) found.add(u);
  }
  return [...found].slice(0, 20);
}

/**
 * @param {ReturnType<typeof extractCssSignalsFromHtml>} cssSignals
 * @param {string[]} scanUrls
 */
function mergeGoogleFontScanIntoCssSignals(cssSignals, scanUrls) {
  if (!cssSignals || !Array.isArray(scanUrls) || scanUrls.length === 0) return;
  const s = new Set(cssSignals.google_fonts_links || []);
  scanUrls.forEach((u) => s.add(u));
  cssSignals.google_fonts_links = [...s].slice(0, 20);
}

/** Max wait for downloading page HTML (AI typography + hero-match). Env: DITTO_HTML_FETCH_TIMEOUT_MS */
function resolveHtmlFetchTimeoutMs(override) {
  if (override != null && Number.isFinite(Number(override))) {
    return Math.min(180_000, Math.max(5_000, Math.floor(Number(override))));
  }
  const n = Number(process.env.DITTO_HTML_FETCH_TIMEOUT_MS);
  if (Number.isFinite(n) && n >= 5_000 && n <= 180_000) {
    return Math.floor(n);
  }
  return 90_000;
}

function getTypographyExtractPostUrl() {
  if (process.env.TYPOGRAPHY_EXTRACT_API_URL) {
    return String(process.env.TYPOGRAPHY_EXTRACT_API_URL).trim();
  }
  const base = String(process.env.TYPOGRAPHY_EXTRACT_BASE_URL || "http://127.0.0.1:8787").replace(
    /\/+$/,
    "",
  );
  return `${base}/api/typography`;
}

/**
 * @param {string} websiteUrlAbs
 * @param {{ includeHeroScreenshot?: boolean }} opts
 */
async function extractTypographyPlaywright(websiteUrlAbs, opts = {}) {
  const startedAt = Date.now();
  const payload = { website_url: websiteUrlAbs };
  if (opts.includeHeroScreenshot) {
    payload.include_hero_screenshot = true;
  }
  const response = await fetch(getTypographyExtractPostUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return {
    ok: response.ok && data && (data.success === true || data.typography),
    status: response.status,
    data,
    rawText: text,
    elapsedMs: Date.now() - startedAt,
  };
}

/**
 * Pre-scan raw HTML for CSS evidence so the AI doesn't have to guess from class names.
 * Returns a small structured object the model can reason over reliably.
 *
 * Why this exists: marketing pages put real font/size/color rules in EXTERNAL stylesheets
 * (and a few inline <style> blocks). Without surfacing those, the model latches onto
 * @font-face / preload URLs (e.g. HubSpot's auto-preloaded Poppins woffs) and gets the
 * primary font wrong.
 *
 * @param {string} html
 * @param {string} [baseUrl] used to resolve relative <link href="...">
 */
function extractCssSignalsFromHtml(html, baseUrl) {
  const out = {
    stylesheet_urls: [],
    google_fonts_links: [],
    font_face_families: [],
    preload_font_urls: [],
    inline_style_blocks_chars: 0,
    inline_style_excerpt: "",
    font_family_lines: [],
    font_size_lines: [],
    color_lines: [],
    page_title: null,
    theme_color: null,
  };
  if (!html || typeof html !== "string") return out;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) out.page_title = titleMatch[1].trim().slice(0, 200);

  const themeColorMatch = html.match(
    /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );
  if (themeColorMatch) out.theme_color = themeColorMatch[1].trim();

  const resolveUrl = (href) => {
    try {
      return new URL(href, baseUrl || "https://localhost/").href;
    } catch {
      return href;
    }
  };

  const stylesheets = new Set();
  const googleFonts = new Set();
  const preloadFonts = new Set();
  const linkRegex = /<link\b([^>]+)>/gi;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const attrs = m[1];
    const relMatch = attrs.match(/\brel\s*=\s*["']?([^"'\s>]+)/i);
    const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    const asMatch = attrs.match(/\bas\s*=\s*["']?([^"'\s>]+)/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    const rel = (relMatch?.[1] || "").toLowerCase();
    const asAttr = (asMatch?.[1] || "").toLowerCase();
    const abs = resolveUrl(href);
    if (rel === "stylesheet") {
      if (/fonts\.googleapis\.com/i.test(abs)) {
        googleFonts.add(abs);
      } else {
        stylesheets.add(abs);
      }
    } else if (rel === "preload" && asAttr === "font") {
      preloadFonts.add(abs);
    }
  }
  out.stylesheet_urls = [...stylesheets].slice(0, 20);
  out.google_fonts_links = [...googleFonts].slice(0, 10);
  out.preload_font_urls = [...preloadFonts].slice(0, 20);

  const styleBlocks = [];
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = styleRegex.exec(html)) !== null) {
    styleBlocks.push(m[1]);
  }
  const combinedInlineCss = styleBlocks.join("\n\n").trim();
  out.inline_style_blocks_chars = combinedInlineCss.length;
  out.inline_style_excerpt = combinedInlineCss.slice(0, 16_000);

  const faceFamilies = new Set();
  const faceRegex = /@font-face\s*{[^}]*?font-family\s*:\s*["']?([^"';,}]+)["']?[^}]*?}/gi;
  while ((m = faceRegex.exec(combinedInlineCss)) !== null) {
    const fam = m[1].trim();
    if (fam) faceFamilies.add(fam);
  }
  out.font_face_families = [...faceFamilies].slice(0, 20);

  const seenFf = new Set();
  const ffRegex = /font-family\s*:\s*([^;}\n]+)/gi;
  while ((m = ffRegex.exec(combinedInlineCss)) !== null && out.font_family_lines.length < 30) {
    const v = m[1].trim().replace(/\s+/g, " ").slice(0, 200);
    if (v && !seenFf.has(v)) {
      seenFf.add(v);
      out.font_family_lines.push(v);
    }
  }

  const seenFs = new Set();
  const fsRegex = /font-size\s*:\s*([^;}\n]+)/gi;
  while ((m = fsRegex.exec(combinedInlineCss)) !== null && out.font_size_lines.length < 30) {
    const v = m[1].trim().replace(/\s+/g, " ").slice(0, 60);
    if (v && !seenFs.has(v)) {
      seenFs.add(v);
      out.font_size_lines.push(v);
    }
  }

  const seenCol = new Set();
  const colorRegex = /(?:^|[\s;{])color\s*:\s*([^;}\n]+)/gi;
  while ((m = colorRegex.exec(combinedInlineCss)) !== null && out.color_lines.length < 20) {
    const v = m[1].trim().replace(/\s+/g, " ").slice(0, 60);
    if (v && !seenCol.has(v)) {
      seenCol.add(v);
      out.color_lines.push(v);
    }
  }

  return out;
}

/**
 * @param {string} rawMessage
 * @param {string} websiteUrl
 */
function formatHtmlFetchFailureMessage(rawMessage, websiteUrl) {
  const msg = String(rawMessage || "");
  let host = "";
  try {
    host = new URL(websiteUrl).hostname;
  } catch {
    host = "";
  }
  if (/ENOTFOUND/i.test(msg)) {
    return `DNS lookup failed for ${host || "that host"} (getaddrinfo ENOTFOUND). Ditto never "invented" this — your PC or resolver could not turn the hostname into an IP. Try: open the same URL in Chrome, \`ipconfig /flushdns\`, switch DNS to 1.1.1.1, toggle VPN, retry. Raw: ${msg}`;
  }
  if (/ETIMEDOUT|timeout/i.test(msg)) {
    return `TCP connection or TLS to ${host || "the site"} timed out. Retry, check VPN/firewall, or raise DITTO_HTML_FETCH_TIMEOUT_MS. Raw: ${msg}`;
  }
  return msg;
}

/**
 * Fetches raw HTML for AI typography / RAG prep. Never throws — returns `{ ok: false, error }` on failure.
 *
 * @param {string} websiteUrl
 * @param {{ maxChars?: number, timeoutMs?: number }} [opts]
 */
async function fetchHtmlSnippet(websiteUrl, opts = {}) {
  const maxChars = opts.maxChars ?? resolveHtmlFetchMaxChars();
  const timeoutMs = resolveHtmlFetchTimeoutMs(opts.timeoutMs);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(websiteUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DittoHeroMatch/1.0; +https://github.com/) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
    const text = await res.text();
    const google_font_urls_scanned_global = extractGoogleFontsScanFromText(text);
    return {
      ok: res.ok,
      status: res.status,
      html: text.slice(0, maxChars),
      truncated: text.length > maxChars,
      timeout_ms: timeoutMs,
      max_chars_used: maxChars,
      google_font_urls_scanned_global,
    };
  } catch (e) {
    const name = e && e.name;
    const msg = (e && e.message) || String(e);
    if (name === "AbortError" || /aborted/i.test(msg)) {
      return {
        ok: false,
        status: 0,
        html: "",
        error: `HTML download timed out after ${timeoutMs} ms (slow site, bot protection, or huge response). Set DITTO_HTML_FETCH_TIMEOUT_MS in .env (5000–180000, default 90000) or retry.`,
        timed_out: true,
        timeout_ms: timeoutMs,
      };
    }
    return {
      ok: false,
      status: 0,
      html: "",
      error: formatHtmlFetchFailureMessage(msg, websiteUrl),
      timeout_ms: timeoutMs,
    };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Responses API with `text.format.type: "json_object"` requires the word "json" to appear
 * in input messages (see API error). A bare JSON.stringify({...}) payload often has no "json".
 */
function ensureJsonKeywordInResponsesInput(userText) {
  const s = String(userText || "");
  if (/json/i.test(s)) return s;
  return `Your entire reply must be one valid json object only (no markdown).\n\n${s}`;
}

/**
 * First complete `{ ... }` object in a string (handles trailing prose / second json blobs).
 * @param {string} s
 * @returns {string|null}
 */
function extractFirstBalancedJsonObjectString(s) {
  const start = s.indexOf("{");
  if (start < 0) {
    return null;
  }
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === "\\") {
        escape = true;
      } else if (c === '"') {
        inString = false;
      }
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{") {
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        return s.slice(start, i + 1);
      }
    }
  }
  return null;
}

/**
 * Parse JSON from model output. When web_search is on, OpenAI forbids `json_object` format —
 * the model may return markdown fences or text after the closing `}`.
 * @param {string} raw
 */
function parseJsonObjectFromModelText(raw) {
  let s = String(raw || "").trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/i);
  if (fence) {
    s = fence[1].trim();
  }
  const candidates = [s];
  const balanced = extractFirstBalancedJsonObjectString(s);
  if (balanced && balanced !== s) {
    candidates.push(balanced);
  }
  let lastErr = null;
  for (const cand of candidates) {
    try {
      return JSON.parse(cand);
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(
    `Model output is not valid JSON: ${lastErr && lastErr.message ? lastErr.message : "parse failed"} — ${s.slice(0, 400)}`,
  );
}

/**
 * JSON object mode via POST /v1/responses (required for GPT-5 family models, e.g. gpt-5.4-mini).
 * @param {{
 *   apiKey: string,
 *   model: string,
 *   system: string,
 *   user: string,
 *   latencyProfile?: "typography"|"hero"|"integrated"|"sr_hero_fit"|"theme_inject_plan"|"default",
 *   maxOutputTokens?: number,
 *   enableWebSearch?: boolean
 * }} o
 */
async function openaiJsonChatViaResponses(o) {
  const model = o.model || DEFAULT_MODEL;
  const profile = o.latencyProfile || "default";
  const maxOut =
    typeof o.maxOutputTokens === "number" &&
    Number.isFinite(o.maxOutputTokens) &&
    o.maxOutputTokens >= 256
      ? Math.min(resolveOpenAiMaxOutputTokens(), Math.floor(o.maxOutputTokens))
      : resolveOpenAiMaxOutputTokensForProfile(profile);

  const webSearch = resolveOpenAiWebSearchEnabled(o.enableWebSearch);

  let instructions = String(o.system || "").trim();
  if (!/json/i.test(instructions)) {
    instructions = `${instructions}\n\nAlways respond with a single json object only.`;
  }
  if (webSearch) {
    instructions = `${instructions}\n\n**web_search + json:** OpenAI does not allow json_object mode with web_search. Use the web_search tool first, then output ONLY raw JSON (one object, no markdown code fences, no commentary before or after).`;
  }
  const input = ensureJsonKeywordInResponsesInput(o.user);

  /** @type {Record<string, unknown>} */
  const textBlock = {};
  const verb = resolveResponsesTextVerbosity();
  if (verb && modelSupportsResponsesLatencyHints(model)) {
    textBlock.verbosity = verb;
  }
  // API error: "Web Search cannot be used with JSON mode."
  if (!webSearch) {
    textBlock.format = { type: "json_object" };
  }

  /** @type {Record<string, unknown>} */
  const payload = {
    model,
    instructions,
    input,
    max_output_tokens: maxOut,
    ...(Object.keys(textBlock).length ? { text: textBlock } : {}),
  };

  const effort = resolveResponsesReasoningEffort();
  if (effort && modelSupportsResponsesLatencyHints(model)) {
    payload.reasoning = { effort };
  }

  const tier = resolveResponsesServiceTier();
  if (tier) {
    payload.service_tier = tier;
  }

  if (webSearch) {
    payload.tools = [{ type: "web_search" }];
  }

  const timeoutMs = resolveOpenAiRequestTimeoutMs(webSearch, o.requestTimeoutMs);
  const fetchInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${o.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let res;
  try {
    res = await fetchOpenAi(OPENAI_RESPONSES_URL, fetchInit, timeoutMs);
  } catch (e) {
    if (webSearch && isOpenAiTimeoutError(e)) {
      try {
        await new Promise((r) => setTimeout(r, 1500));
        res = await fetchOpenAi(OPENAI_RESPONSES_URL, fetchInit, timeoutMs);
      } catch (e2) {
        throw new Error(
          `OpenAI Responses + web_search timed out after ${timeoutMs}ms (retry failed): ${describeNetworkError(e2)}. Raise OPENAI_REQUEST_TIMEOUT_MS in .env (e.g. 900000), check VPN/firewall, or retry.`,
        );
      }
    } else {
      throw new Error(
        `OpenAI Responses request failed: ${describeNetworkError(e)}. Same network checks as chat/completions apply.`,
      );
    }
  }
  let text;
  try {
    text = await res.text();
  } catch (e) {
    throw new Error(`OpenAI Responses body read failed: ${describeNetworkError(e)}`);
  }
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`OpenAI Responses non-JSON (${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    throw new Error(
      data?.error?.message || `OpenAI Responses HTTP ${res.status}: ${text.slice(0, 400)}`,
    );
  }
  if (data?.status && data.status !== "completed") {
    throw new Error(
      `OpenAI Responses status=${data.status}: ${JSON.stringify(data.incomplete_details || data.error || {})}`,
    );
  }
  const content = extractResponsesOutputText(data);
  if (!content || !String(content).trim()) {
    throw new Error("OpenAI Responses returned no output text");
  }
  try {
    return parseJsonObjectFromModelText(content);
  } catch (e) {
    throw new Error(
      e.message && /not valid JSON/i.test(e.message)
        ? `OpenAI Responses content not JSON: ${content.slice(0, 300)}`
        : e.message || String(e),
    );
  }
}

/**
 * @param {{
 *   apiKey: string,
 *   model: string,
 *   system: string,
 *   user: string,
 *   latencyProfile?: "typography"|"hero"|"integrated"|"sr_hero_fit"|"theme_inject_plan"|"default",
 *   maxOutputTokens?: number,
 *   enableWebSearch?: boolean
 * }} o
 */
async function openaiJsonChat(o) {
  const model = o.model || DEFAULT_MODEL;
  if (preferOpenAiResponsesApi(model) || resolveOpenAiWebSearchEnabled(o.enableWebSearch)) {
    return openaiJsonChatViaResponses(o);
  }

  const timeoutMs = resolveOpenAiRequestTimeoutMs(o.enableWebSearch, o.requestTimeoutMs);
  let res;
  try {
    res = await fetchOpenAi(
      OPENAI_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${o.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.15,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: o.system },
            { role: "user", content: o.user },
          ],
        }),
      },
      timeoutMs,
    );
  } catch (e) {
    const detail = describeNetworkError(e);
    throw new Error(
      `OpenAI chat request failed: ${detail}. If this repeats: check Wi‑Fi/VPN, firewall, corporate proxy (HTTPS_PROXY), and that api.openai.com resolves (DNS).`,
    );
  }
  let text;
  try {
    text = await res.text();
  } catch (e) {
    throw new Error(`OpenAI response read failed: ${describeNetworkError(e)}`);
  }
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`OpenAI non-JSON response (${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    const errMsg = String(data?.error?.message || "");
    if (res.status === 400 && /not a chat model/i.test(errMsg)) {
      return openaiJsonChatViaResponses(o);
    }
    throw new Error(errMsg || `OpenAI error HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty content");
  }
  try {
    return parseJsonObjectFromModelText(content);
  } catch (e) {
    throw new Error(
      e.message && /not valid JSON/i.test(e.message)
        ? `OpenAI content not JSON: ${content.slice(0, 300)}`
        : e.message || String(e),
    );
  }
}

/**
 * AI typography extraction from raw HTML + pre-scanned CSS signals.
 *
 * The model is told to treat `css_signals.font_family_lines` and `inline_style_excerpt`
 * as ground truth, and to ignore @font-face / preload URLs unless they're confirmed
 * by an actual `body { font-family: ... }` style rule. This avoids the classic
 * HubSpot HCMS trap where Poppins woffs are auto-preloaded but never used.
 *
 * @param {object} o
 * @param {Record<string, unknown>|null} [o.lightragLocalSrKnowledge] graph + vectors + SR docs (theme-inject shape)
 */
async function extractTypographyOpenAI(o) {
  const lr = o.lightragLocalSrKnowledge;
  const systemBase = `You analyze a marketing webpage and infer typography signals as JSON.

INPUTS YOU RECEIVE:
- css_signals: structured CSS evidence pre-extracted by a server-side scanner
  (stylesheet URLs, Google Fonts links, @font-face family names, preload URLs,
  inline <style> excerpt, all font-family/font-size/color CSS lines).
- html: raw HTML body (truncated). Use it for nuance only; css_signals is more reliable.`;

  const systemLr =
    lr && typeof lr === "object"
      ? `

ADDITIONAL INPUT — local_sr_knowledge (read carefully):
- This is **internal SR / HubSpot theme reference** from a local cache: semantic vector hits, SR cheatsheet + theme guideline excerpts, and a capped excerpt of a **LightRAG knowledge graph** (GraphML from disk under cache/lightrag/.lightrag_data/). It describes how Sprocket Rocket themes typically handle fonts — not what this specific live page computes.
- Use it to **compare / contextualize**: e.g. whether inferred fonts align with common SR patterns, or to enrich **heading_style_notes**, **body_style_notes**, or **caveat** with SR-relevant guidance.
- **Non-negotiable:** If css_signals shows an explicit active \`font-family\` rule for body/headings, that beats any generic font name merely mentioned in the graph or cheatsheet. Never replace css_signals evidence with a guess from local_sr_knowledge alone.
- If you used local_sr_knowledge, add one short sentence in **caveat** beginning with "SR cache note:" summarizing what you cross-checked (do not claim you ran a browser).`
      : "";

  const systemRest = `

CRITICAL RULES (read carefully — most extractors get these wrong):
1. The ACTIVE font for headings/body is what an actual CSS rule applies, e.g.
   \`body { font-family: 'X', sans-serif; }\` or \`h1 { font-family: 'Y'; }\` or
   \`:root { --font-heading: 'Z'; }\`. Use those as ground truth.
2. \`@font-face { font-family: 'Foo'; src: url(...); }\` only DEFINES a loadable font.
   It does NOT mean the font is actually applied. List such families in
   \`font_face_only_families\` if they don't also appear in a real style rule.
3. \`<link rel="preload" as="font" href="...">\` is NOISE on most HubSpot HCMS pages
   (HubSpot auto-preloads Poppins/Inter regardless of theme). Ignore preload_font_urls
   unless the same family also shows up in css_signals.font_family_lines or the inline
   style excerpt. List ignored ones under \`evidence.ignored_preloads\`.
4. \`google_fonts_detected\` should ONLY list families served via fonts.googleapis.com
   (i.e. css_signals.google_fonts_links). Self-hosted woffs are NOT Google Fonts.
5. Pixel sizes: only return h1_px / body_px if you can read an explicit
   \`h1 { font-size: NNpx }\` or \`body { font-size: NNpx }\` from the inline style
   excerpt. Otherwise return null. Do NOT guess from class names like .text-h1.
6. **typography_site_estimate** (Playwright-shaped snapshot from **HTML + css_signals only**):
   - Fill this object when you can support at least **headings.h1** or **body** with real \`fontFamily\` strings from CSS evidence, OR populate **font_face_urls** / **google_fonts_urls** with real https URLs from the excerpt / css_signals.
   - Use the **same string style as CSS** for fontSize (e.g. "80px", "1.125rem") and full **font-family stacks** when known.
   - **google_fonts_urls**: only entries from \`css_signals.google_fonts_links\` (not invented).
   - **font_face_urls**: only \`src:\` URLs from @font-face blocks that correspond to families used in active rules.
   - Omit unknown keys; do not fabricate hex colors. If you cannot build a minimally grounded object, set **typography_site_estimate** to null.
7. Confidence calibration:
   - 0.9+ : explicit CSS rule with both family and size found in inline_style_excerpt
   - 0.7  : family confirmed by font_family_lines but sizes unknown
   - 0.5  : family inferred from a single weak signal
   - <0.4 : almost no CSS evidence; the page loads its styles entirely externally

OUTPUT — return ONLY valid JSON, no prose:
{
  "primary_font_family": string | null,
  "body_font_family": string | null,
  "heading_style_notes": string,
  "body_style_notes": string,
  "approximate_scale": { "h1_px": number | null, "body_px": number | null },
  "google_fonts_detected": string[],
  "font_face_only_families": string[],
  "evidence": {
    "primary_font_source": string,
    "body_font_source": string,
    "ignored_preloads": string[]
  },
  "confidence": number,
  "caveat": string,
  "typography_site_estimate": {
    "fonts": { "headings": string, "body": string },
    "headings": {
      "h1": { "fontFamily": string, "fontSize": string, "fontWeight": string, "lineHeight": string, "letterSpacing": string, "color": string }
    },
    "body": { "fontFamily": string, "fontSize": string, "fontWeight": string, "lineHeight": string, "letterSpacing": string, "color": string },
    "links": { "color": string, "textDecoration": string, "fontWeight": string },
    "buttons": { "fontFamily": string, "fontSize": string, "fontWeight": string, "color": string, "backgroundColor": string, "borderRadius": string, "borderColor": string, "borderWidth": string },
    "buttons_secondary": object | null,
    "colors": { "text": string[], "background": string[], "primary": string },
    "google_fonts_urls": string[],
    "font_face_urls": string[],
    "font_stylesheet_urls": string[]
  } | null
}

Omit optional heading tiers (h2–h6) inside typography_site_estimate.headings when unsupported by evidence.`;

  const system = systemBase + systemLr + systemRest;

  const cssSignals = o.cssSignals || {};
  const userPayload = {
    url: o.websiteUrl,
    css_signals: cssSignals,
    html: String(o.htmlSnippet || "").slice(0, 110_000),
  };
  if (lr && typeof lr === "object") {
    userPayload.local_sr_knowledge = lr;
  }
  const user = JSON.stringify(userPayload).slice(0, 190_000);

  const parsed = await openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model || DEFAULT_MODEL,
    system,
    user,
    latencyProfile: "typography",
  });
  return enrichTypographyAiFromOpenAiResponse(/** @type {Record<string, unknown>} */ (parsed));
}

/**
 * Resolve relative asset paths against the page URL.
 * @param {string} raw
 * @param {string} baseUrl
 * @returns {string|null}
 */
function normalizeAssetUrlAgainstPage(raw, baseUrl) {
  const s = String(raw || "").trim();
  if (!s || /^data:/i.test(s)) {
    return null;
  }
  if (/^https?:\/\//i.test(s)) {
    return s;
  }
  try {
    return new URL(s, baseUrl || "https://localhost/").href;
  } catch {
    return null;
  }
}

/**
 * Pull `url(...)` targets from raw HTML so hero backgrounds survive when the LLM only returns colors/gradients.
 * Skips obvious font files. Caps scan size for performance.
 *
 * @param {string} html
 * @param {string} baseUrl
 * @param {number} [limit]
 * @returns {string[]}
 */
function extractBackgroundImageUrlsFromHtml(html, baseUrl, limit = 24) {
  if (!html || typeof html !== "string") {
    return [];
  }
  const slice = html.slice(0, Math.min(html.length, 380_000));
  const candidates = [];
  const seen = new Set();
  const push = (raw) => {
    const abs = normalizeAssetUrlAgainstPage(raw, baseUrl);
    if (!abs || seen.has(abs)) {
      return;
    }
    if (/^data:/i.test(abs)) {
      return;
    }
    if (/\.(woff2?|ttf|eot|otf)(\?|$)/i.test(abs)) {
      return;
    }
    seen.add(abs);
    candidates.push(abs);
  };

  const urlRe = /url\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi;
  let m;
  while ((m = urlRe.exec(slice)) !== null) {
    push(m[1].trim());
  }

  const srcRe =
    /\bsrc\s*=\s*["']([^"']+\.(?:png|jpe?g|webp|gif|svg))(?:\?[^"']*)?["']/gi;
  while ((m = srcRe.exec(slice)) !== null) {
    push(m[1].trim());
  }

  const scoreOf = (u) => {
    let s = 0;
    if (/hubfs|hs-fs|hubspotusercontent|imgix|cloudinary|cloudfront/i.test(u)) {
      s += 6;
    }
    if (/\.(png|jpe?g|webp)(\?|$)/i.test(u)) {
      s += 3;
    }
    if (/background|hero|banner|cover|header|home/i.test(u)) {
      s += 2;
    }
    if (/\.svg(\?|$)/i.test(u)) {
      s += 1;
    }
    return s;
  };

  return [...candidates]
    .map((u) => ({ u, sc: scoreOf(u) }))
    .sort((a, b) => b.sc - a.sc)
    .map((x) => x.u)
    .filter((_, i) => i < limit);
}

/**
 * When the model omits image URLs, merge CSS `url(...)` hits from the same HTML fetch.
 *
 * @param {string} websiteUrl
 * @param {string} htmlSnippet
 * @param {unknown} heroAi
 * @returns {unknown}
 */
function mergeHeroAiWithHtmlBackgroundFallbacks(websiteUrl, htmlSnippet, heroAi) {
  if (!heroAi || typeof heroAi !== "object" || heroAi.error || !heroAi.found) {
    return heroAi;
  }
  const bg =
    heroAi.background && typeof heroAi.background === "object"
      ? heroAi.background
      : {};
  const existing = Array.isArray(bg.image_url_candidates)
    ? bg.image_url_candidates.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
  const resolvedExisting = existing
    .map((u) => normalizeAssetUrlAgainstPage(u, websiteUrl))
    .filter(Boolean);

  const scraped = extractBackgroundImageUrlsFromHtml(htmlSnippet, websiteUrl, 28);
  if (!scraped.length) {
    if (resolvedExisting.length && resolvedExisting.some((x, i) => x !== existing[i])) {
      return {
        ...heroAi,
        background: {
          ...bg,
          image_url_candidates: resolvedExisting,
        },
      };
    }
    return heroAi;
  }

  const merged = [];
  const seen = new Set();
  for (const u of [...resolvedExisting, ...scraped]) {
    const t = String(u || "").trim();
    if (!t || seen.has(t)) {
      continue;
    }
    seen.add(t);
    merged.push(t);
  }

  const prevKey = resolvedExisting.join("\0");
  const nextKey = merged.join("\0");
  if (prevKey === nextKey) {
    return heroAi;
  }

  return {
    ...heroAi,
    background: {
      ...bg,
      image_url_candidates: merged,
    },
    _ditto_html_background_url_fallback: {
      applied: scraped.length > 0,
      added_count: Math.max(0, merged.length - resolvedExisting.length),
      sample: scraped.slice(0, 5),
    },
  };
}

/**
 * Infer above-the-fold hero structure + SR Hero 01 mapping preview from HTML (no Playwright).
 *
 * @param {{
 *   websiteUrl: string,
 *   htmlSnippet: string,
 *   cssSignals?: ReturnType<typeof extractCssSignalsFromHtml>,
 *   typographyAi?: object | null,
 *   apiKey: string,
 *   model?: string
 * }} o
 */
async function extractHeroOpenAI(o) {
  const system = `You analyze raw HTML (and optional css_signals) for the primary marketing **hero** in the first viewport.

Return ONLY valid json (no markdown fences). Use lowercase key "json" in your reasoning only inside string values if needed — the user payload already satisfies json mode.

Output shape:
{
  "found": boolean,
  "confidence": number,
  "evidence_notes": string,
  "text": {
    "title": string | null,
    "title_tag": string,
    "preheading": string | null,
    "subtitle": string | null
  },
  "layout": { "textAlign": "LEFT" | "CENTER" | "RIGHT" | "unknown" },
  "ctas": [{ "label": string, "href": string | null, "inferred_style": string }],
  "background": {
    "type": "image" | "color" | "gradient" | "video" | "unknown",
    "color_hex_candidates": string[],
    "image_url_candidates": string[]
  },
  "sr_hero_01_mapping_preview": {
    "likely_maps": boolean,
    "confidence": number,
    "summary": string,
    "gaps": string[],
    "field_hints": {
      "textAlign": "LEFT" | "CENTER" | "RIGHT" | null,
      "backgroundType": "image" | "color" | "gradient" | "video" | "unknown",
      "ctaCount": number,
      "notes": string
    }
  }
}

Rules:
- Prefer the hero that contains the main H1 or strongest headline above the fold.
- CTAs: primary buttons/links in that same region; label text from anchor text or aria-label when visible in HTML.
- background.image_url_candidates: hero-scoped img src, picture source, or CSS background-image URLs you can read from inline styles or style blocks (absolute URLs preferred).
- **Critical:** Many marketing heroes set background-image:url(...) only on a wrapper section or div inline style attribute. You MUST copy every CSS url(...) you see in the first ~120kb of HTML that looks like a raster or vector asset (png, jpg, webp, svg, or CMS paths like hubfs or hs-fs) into image_url_candidates (resolve relative URLs against the page URL). Do not return only a gradient or solid color if a concrete url(...) image is visible in the HTML.
- If the page is not a classic hero (e.g. app dashboard), found=false.
- sr_hero_01_mapping_preview compares to **SR Hero 01** (Sprocket Rocket): full-width hero, bg image/color/gradient/video, overlay, text align, H1 + body + CTA repeater. If a true two-column split with unrelated side column cannot be one background + text stack, likely_maps=false.

If typography_ai_hints is present, keep font narrative consistent but hero layout is still decided from HTML.`;

  const hints =
    o.typographyAi && typeof o.typographyAi === "object" && !o.typographyAi.error
      ? {
          primary_font_family: o.typographyAi.primary_font_family,
          body_font_family: o.typographyAi.body_font_family,
          confidence: o.typographyAi.confidence,
        }
      : null;

  const css = o.cssSignals || {};
  const userPayload = {
    url: o.websiteUrl,
    typography_ai_hints: hints,
    css_signals_compact: {
      google_fonts_links: css.google_fonts_links || [],
      font_family_lines: (css.font_family_lines || []).slice(0, 15),
      stylesheet_urls: (css.stylesheet_urls || []).slice(0, 10),
      page_title: css.page_title || null,
    },
    html: String(o.htmlSnippet || "").slice(0, 95_000),
  };
  const user = JSON.stringify(userPayload).slice(0, 150_000);

  const raw = await openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model || DEFAULT_MODEL,
    system,
    user,
    latencyProfile: "hero",
  });
  return mergeHeroAiWithHtmlBackgroundFallbacks(
    o.websiteUrl,
    String(o.htmlSnippet || ""),
    raw,
  );
}

/**
 * One JSON object that ties together typography AI, hero AI, and (when present) SR Hero 01 fit.
 * Intended for handoff / PM copy — not a substitute for the structured upstream objects.
 *
 * @param {{
 *   websiteUrl: string,
 *   pageTitle?: string | null,
 *   typographyAi: object,
 *   heroAi: object | null,
 *   srHero01Decision?: object | null,
 *   apiKey: string,
 *   model?: string
 * }} o
 */
async function extractIntegratedThemeAssessmentOpenAI(o) {
  const system = `You are a senior HubSpot + Sprocket Rocket implementer reviewing **AI-only** extracts of a live marketing site (no Playwright).

You receive json with:
- typography_ai — inferred fonts, evidence, confidence
- hero_ai — inferred first-viewport hero + sr_hero_01_mapping_preview
- sr_hero_01_decision — optional; fit/confidence/reason/userMessage/fieldHints from a separate step that used internal SR knowledge (LightRAG). If null, say SR fit was not run.

Task: produce ONE coherent **integrated assessment** for someone migrating the site into an SR theme. Call out contradictions (e.g. low typography confidence vs high hero confidence). Do not invent CSS you did not see in the inputs; you may infer workflow risks.

Return ONLY valid json (no markdown):
{
  "executive_summary": string,
  "overall_readiness": { "score": number, "label": "low" | "medium" | "high", "rationale": string },
  "typography": { "summary": string, "confidence_note": string, "hubspot_actions": string[] },
  "hero_and_sr_hero_01": { "summary": string, "fit_note": string, "hubspot_actions": string[] },
  "cross_cutting": { "tensions": string[], "recommended_sequence": string[] }
}

The word json appears in this system message for response-format compliance.`;

  const userPayload = {
    _meta: { response_kind: "json_object integrated theme assessment" },
    url: o.websiteUrl,
    page_title: o.pageTitle || null,
    typography_ai: o.typographyAi,
    hero_ai: o.heroAi,
    sr_hero_01_decision: o.srHero01Decision || null,
  };
  const user = JSON.stringify(userPayload).slice(0, 120_000);

  return openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model || DEFAULT_MODEL,
    system,
    user,
    latencyProfile: "integrated",
  });
}

/**
 * Concat fallback (when no vector DB present yet).
 * @param {string} projectRoot
 */
function loadLightragSrHeroContextFromFiles(projectRoot) {
  const dir = path.join(projectRoot, "cache", "lightrag", "source");
  const files = [
    "00-index.md",
    "03-sr-expert-skill.md",
    "07-sr-theme-guidelines-core.md",
    "08-sr-modules-selection-cheatsheet.md",
  ];
  let out = "";
  for (const f of files) {
    const direct = path.join(dir, f);
    const enqueued = path.join(dir, "__enqueued__", f);
    const p = fs.existsSync(direct) ? direct : fs.existsSync(enqueued) ? enqueued : null;
    if (p) {
      out += `\n\n--- ${f} ---\n`;
      out += fs.readFileSync(p, "utf8");
    }
  }
  if (!out.trim()) {
    return "(No files in cache/lightrag/source — add SR knowledge chunks for better decisions.)";
  }
  return out.slice(0, 32_000);
}

/**
 * Retrieval order:
 *   1) Real LightRAG server (HKUDS/LightRAG, knowledge graph + hybrid retrieval) — if alive.
 *   2) Naive Ditto vector store (`cache/lightrag/.naive_data/vdb_chunks.json`) — if ingested.
 *   3) File concat from `cache/lightrag/source/*.md` — last resort.
 *
 * @param {{ projectRoot: string, query: string, apiKey: string, k?: number, lightragMode?: string }} opts
 * @returns {Promise<{ contextText: string, mode: string, hits?: any, model?: string, dim?: number, error?: string }>}
 */
async function loadLightragSrHeroContext(opts) {
  const alive = await lightragClient.isAlive();
  if (alive.ok) {
    const lr = await lightragClient.query({
      query: opts.query,
      mode: opts.lightragMode || "hybrid",
      top_k: opts.k || 8,
      only_need_context: true,
    });
    if (lr.ok) {
      const text = lightragClient.extractContextString(lr.data);
      if (text && text.length > 50) {
        return {
          contextText: text.slice(0, 32_000),
          mode: "lightrag_server",
          lightrag_mode: opts.lightragMode || "hybrid",
          server_url: lightragClient.DEFAULT_URL,
          health: alive.info,
          raw_keys: lr.data && typeof lr.data === "object" ? Object.keys(lr.data) : null,
        };
      }
    } else {
      const fallback = await tryNaiveOrConcat(opts);
      return { ...fallback, lightrag_error: lr.error };
    }
  }
  return tryNaiveOrConcat(opts);
}

async function tryNaiveOrConcat(opts) {
  const vdb = loadVdb(opts.projectRoot);
  if (!vdb || !Array.isArray(vdb.chunks) || vdb.chunks.length === 0) {
    return {
      contextText: loadLightragSrHeroContextFromFiles(opts.projectRoot),
      mode: "file_concat_fallback",
    };
  }
  try {
    const r = await retrieveTopK({
      projectRoot: opts.projectRoot,
      query: opts.query,
      k: opts.k || 6,
      apiKey: opts.apiKey,
    });
    if (!r.ok || !r.results) {
      return {
        contextText: loadLightragSrHeroContextFromFiles(opts.projectRoot),
        mode: "file_concat_fallback",
        error: r.error,
      };
    }
    const text = r.results
      .map(
        ({ score, chunk }) =>
          `--- ${chunk.source} :: ${chunk.heading} (score=${score.toFixed(3)}) ---\n${chunk.text}`,
      )
      .join("\n\n");
    return {
      contextText: text.slice(0, 32_000),
      mode: "naive_vector_topk",
      model: r.model,
      dim: r.dim,
      hits: r.results.map(({ score, chunk }) => ({
        score: Number(score.toFixed(4)),
        source: chunk.source,
        heading: chunk.heading,
        id: chunk.id,
      })),
    };
  } catch (e) {
    return {
      contextText: loadLightragSrHeroContextFromFiles(opts.projectRoot),
      mode: "file_concat_fallback",
      error: e.message || String(e),
    };
  }
}

function slimPlaywrightForDecision(data) {
  if (!data || typeof data !== "object") {
    return data;
  }
  if (data.skipped === true) {
    return {
      skipped: true,
      reason: data.reason,
      website_url: data.website_url,
      page_title: data.page_title,
    };
  }
  return {
    website_url: data.website_url,
    page_title: data.page_title,
    typography: data.typography,
    typography_full_page: data.typography_full_page,
    hero: data.hero,
  };
}

/**
 * @param {{
 *   playwrightExtract: object,
 *   aiExtract: object,
 *   aiHeroExtract?: object | null,
 *   ragContext: string,
 *   apiKey: string,
 *   model?: string
 * }} o
 */
async function decideSrHero01Match(o) {
  const system = `You are a HubSpot developer helping map a **source website hero** to **one** target module: **SR Hero 01** (Sprocket Rocket).

You receive:
1) knowledge_excerpt — SR conventions, SR Hero 01 role, and layout cheatsheet (from an internal knowledge base).
2) playwright_extract — structured data from a real browser/computed-style extractor when available. If playwright_extract.skipped is true OR hero is absent, **ignore** it for layout facts.
3) ai_typography_extract — inference from HTML + css_signals; secondary for fonts.
4) ai_hero_extract — HTML-inferred hero (title, CTAs, background, textAlign, sr_hero_01_mapping_preview). **Primary** layout/CTA/background signal when Playwright is skipped or hero is missing.

Conflict rules:
- Font names / px sizes: prefer playwright_extract when present; else ai_typography_extract.
- Hero layout (alignment, CTA count, background type): prefer playwright_extract.hero when present; else ai_hero_extract.

SR Hero 01 (typical capabilities — verify against knowledge_excerpt):
- Full-width hero with background: color, image, gradient, or video; overlay; text color; alignment.
- Heading stack + rich description + CTA repeater (multiple buttons).
- Container width / padding via design_settings pattern.
- Parallax option in some setups.

Set fit=false when the hero **fundamentally** needs a different module (e.g. true two-column split hero with large image column and separate copy column if that cannot be achieved with SR Hero 01 fields alone, or heavy custom layout). When unsure but close, fit=true with lower confidence and explain in userMessage.

Output ONLY valid json:
{
  "fit": boolean,
  "confidence": number,
  "reason": string,
  "userMessage": string,
  "suggestedModule": "SR Hero 01",
  "fieldHints": {
    "textAlign": "LEFT" | "CENTER" | "RIGHT" | null,
    "backgroundType": "image" | "color" | "gradient" | "video" | "unknown",
    "ctaCount": number,
    "notes": string
  }
}`;

  const user = JSON.stringify(
    {
      _meta: { response_kind: "json_object SR Hero 01 fit decision" },
      knowledge_excerpt: o.ragContext,
      playwright_extract: slimPlaywrightForDecision(o.playwrightExtract),
      ai_typography_extract: o.aiExtract,
      ai_hero_extract: o.aiHeroExtract || null,
    },
    null,
    2,
  ).slice(0, 120_000);

  return openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model || DEFAULT_MODEL,
    system,
    user,
    latencyProfile: "sr_hero_fit",
  });
}

/**
 * @param {{
 *   websiteUrl: string,
 *   projectRoot: string,
 *   includeHeroScreenshot?: boolean,
 *   openaiApiKey?: string,
 *   openaiModel?: string
 * }} opts
 */
async function runHeroMatchPipeline(opts) {
  const apiKey = opts.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    return {
      ok: false,
      error:
        "OPENAI_API_KEY is missing. Set it in .env for /api/hero-match (AI extract + SR decision).",
    };
  }

  const model = opts.openaiModel || DEFAULT_MODEL;
  const t0 = Date.now();
  const url = String(opts.websiteUrl || "").trim();

  const [pw, htmlBox] = await Promise.all([
    extractTypographyPlaywright(url, {
      includeHeroScreenshot: Boolean(opts.includeHeroScreenshot),
    }),
    fetchHtmlSnippet(url),
  ]);

  let aiTypography = null;
  let aiHero = null;
  let cssSignals = null;
  if (htmlBox.ok && htmlBox.html && htmlBox.html.length > 200) {
    cssSignals = extractCssSignalsFromHtml(htmlBox.html, url);
    mergeGoogleFontScanIntoCssSignals(cssSignals, htmlBox.google_font_urls_scanned_global);
    try {
      aiTypography = await extractTypographyOpenAI({
        websiteUrl: url,
        htmlSnippet: htmlBox.html,
        cssSignals,
        apiKey,
        model,
      });
    } catch (e) {
      aiTypography = { error: e.message || String(e) };
    }
    try {
      aiHero = await extractHeroOpenAI({
        websiteUrl: url,
        htmlSnippet: htmlBox.html,
        cssSignals,
        typographyAi: aiTypography && !aiTypography.error ? aiTypography : null,
        apiKey,
        model,
      });
    } catch (e) {
      aiHero = { error: e.message || String(e) };
    }
  } else {
    aiTypography = {
      error: htmlBox.error || "HTML fetch failed or empty",
      fetchOk: htmlBox.ok,
      fetchStatus: htmlBox.status,
    };
    aiHero = { error: aiTypography.error };
  }

  const ragQuery = JSON.stringify({
    task: "Decide whether the source website hero fits SR Hero 01 (HubSpot Sprocket Rocket).",
    website_url: url,
    page_title: pw.ok ? pw.data?.page_title : undefined,
    hero_playwright: pw.ok ? pw.data?.hero : undefined,
    hero_ai: aiHero,
    typography: pw.ok ? pw.data?.typography : undefined,
    ai_typography_extract: aiTypography,
  }).slice(0, 6000);

  const rag = await loadLightragSrHeroContext({
    projectRoot: opts.projectRoot,
    query: ragQuery,
    apiKey,
  });

  let decision;
  try {
    decision = await decideSrHero01Match({
      playwrightExtract: pw.ok ? pw.data : { extract_error: true, status: pw.status, raw: pw.rawText?.slice(0, 2000) },
      aiExtract: aiTypography,
      aiHeroExtract: aiHero,
      ragContext: rag.contextText,
      apiKey,
      model,
    });
  } catch (e) {
    decision = { error: e.message || String(e) };
  }

  return {
    ok: true,
    website_url: url,
    elapsed_ms: Date.now() - t0,
    openai_model: model,
    playwright: {
      ok: pw.ok,
      http_status: pw.status,
      elapsed_ms: pw.elapsedMs,
      data: pw.data,
    },
    ai_html_fetch: {
      ok: htmlBox.ok,
      status: htmlBox.status,
      truncated: htmlBox.truncated,
      error: htmlBox.error,
      max_chars_used: htmlBox.max_chars_used,
    },
    css_signals: cssSignals,
    ai_typography_extract: aiTypography,
    ai_hero_extract: aiHero,
    lightrag: {
      mode: rag.mode,
      embedding_model: rag.model,
      embedding_dim: rag.dim,
      context_chars: rag.contextText.length,
      hits: rag.hits,
      source_dir: path.join(opts.projectRoot, "cache", "lightrag", "source"),
      naive_vdb_path: path.join(opts.projectRoot, "cache", "lightrag", ".naive_data", "vdb_chunks.json"),
      lightrag_data_dir: path.join(opts.projectRoot, "cache", "lightrag", ".lightrag_data"),
      lightrag_server_url: rag.server_url,
      lightrag_mode: rag.lightrag_mode,
      lightrag_error: rag.lightrag_error,
      health: rag.health,
      error: rag.error,
    },
    decision,
    next_step:
      "If decision.fit is true, POST /api/theme-clone-slim (or full copy) with the same typographyWebsiteUrl or pass typographyExtract from playwright.data to bake the theme.",
  };
}

module.exports = {
  runHeroMatchPipeline,
  extractTypographyPlaywright,
  fetchHtmlSnippet,
  resolveHtmlFetchTimeoutMs,
  resolveHtmlFetchMaxChars,
  extractGoogleFontsScanFromText,
  mergeGoogleFontScanIntoCssSignals,
  describeNetworkError,
  preferOpenAiResponsesApi,
  extractCssSignalsFromHtml,
  extractBackgroundImageUrlsFromHtml,
  mergeHeroAiWithHtmlBackgroundFallbacks,
  extractTypographyOpenAI,
  extractHeroOpenAI,
  extractIntegratedThemeAssessmentOpenAI,
  loadLightragSrHeroContext,
  decideSrHero01Match,
  getTypographyExtractPostUrl,
  openaiJsonChat,
  resolveOpenAiWebSearchEnabled,
  resolveOpenAiRequestTimeoutMs,
  DEFAULT_MODEL,
};
