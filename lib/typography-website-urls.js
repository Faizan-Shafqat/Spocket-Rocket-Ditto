/**
 * Parse one or many website URLs from API bodies / query strings.
 */

/**
 * @param {string} websiteUrl
 */
function websiteUrlCacheKey(websiteUrl) {
  const raw = String(websiteUrl || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const u = new URL(raw);
    u.hash = "";
    u.search = "";
    let href = u.href.replace(/\/+$/, "");
    if (u.pathname === "" || u.pathname === "/") {
      href = href.replace(/\/$/, "");
    }
    return href.toLowerCase();
  } catch {
    return raw.replace(/\/+$/, "").toLowerCase();
  }
}

/**
 * @param {string} websiteUrl
 */
function websiteHostnameKey(websiteUrl) {
  try {
    return new URL(String(websiteUrl || "").trim())
      .hostname.replace(/^www\./i, "")
      .toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Same page or same site (hostname) — handles HubSpot-style redirects to /homepage-4.
 *
 * @param {string} a
 * @param {string} b
 */
function sameWebsiteUrl(a, b) {
  const ka = websiteUrlCacheKey(a);
  const kb = websiteUrlCacheKey(b);
  if (ka && kb && ka === kb) {
    return true;
  }
  const ha = websiteHostnameKey(a);
  const hb = websiteHostnameKey(b);
  return Boolean(ha && hb && ha === hb);
}

/**
 * Split a string or mixed list into raw URL tokens (newline, comma, semicolon, whitespace).
 * @param {unknown} value
 * @returns {string[]}
 */
function splitUrlList(value) {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      out.push(...splitUrlList(item));
    }
    return out;
  }
  const s = String(value).trim();
  if (!s) {
    return [];
  }
  return s
    .split(/[\n\r,;]+|\s+(?=https?:\/\/)/i)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * @param {Record<string, unknown>} body
 * @param {(raw: string) => { ok: boolean, websiteUrl?: string, error?: string }} validateOne
 * @param {{ maxUrls?: number }} [opts]
 */
function parseTypographyWebsiteUrlsFromBody(body, validateOne, opts = {}) {
  const maxUrls = Math.min(50, Math.max(1, opts.maxUrls ?? 15));
  const b = body && typeof body === "object" ? body : {};
  const rawTokens = [];

  for (const key of [
    "website_urls",
    "websiteUrls",
    "typography_website_urls",
    "typographyWebsiteUrls",
    "urls",
  ]) {
    if (b[key] != null) {
      rawTokens.push(...splitUrlList(b[key]));
    }
  }

  for (const key of [
    "website_url",
    "websiteUrl",
    "typographyWebsiteUrl",
    "typography_website_url",
    "url",
  ]) {
    if (typeof b[key] === "string" && b[key].trim()) {
      rawTokens.push(...splitUrlList(b[key]));
    }
  }

  const seen = new Set();
  const urls = [];
  const invalid = [];
  let truncated = false;

  for (const raw of rawTokens) {
    const v = validateOne(raw);
    if (!v.ok) {
      invalid.push({ raw, error: v.error || "Invalid URL" });
      continue;
    }
    const key = String(v.websiteUrl || raw)
      .trim()
      .replace(/\/+$/, "")
      .toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    if (urls.length >= maxUrls) {
      truncated = true;
      break;
    }
    urls.push({ websiteUrl: v.websiteUrl, raw });
  }

  return {
    ok: urls.length > 0,
    urls,
    invalid,
    truncated,
    error:
      urls.length === 0
        ? invalid.length
          ? "No valid website URLs after validation."
          : "No website URL provided. Use website_url or website_urls (array or newline/comma-separated)."
        : null,
  };
}

/**
 * @param {Record<string, unknown>|import('express').Request['query']} query
 * @param {(raw: string) => { ok: boolean, websiteUrl?: string, error?: string }} validateOne
 * @param {{ maxUrls?: number }} [opts]
 */
function parseTypographyWebsiteUrlsFromQuery(query, validateOne, opts = {}) {
  const q = query && typeof query === "object" ? query : {};
  const rawTokens = [];

  for (const key of ["website_urls", "websiteUrls", "urls"]) {
    if (q[key] != null) {
      rawTokens.push(...splitUrlList(q[key]));
    }
  }
  if (typeof q.website_url === "string") {
    rawTokens.push(...splitUrlList(q.website_url));
  } else if (Array.isArray(q.website_url)) {
    rawTokens.push(...splitUrlList(q.website_url));
  }
  if (typeof q.url === "string") {
    rawTokens.push(...splitUrlList(q.url));
  }

  return parseTypographyWebsiteUrlsFromBody(
    { website_urls: rawTokens.length ? rawTokens : undefined },
    validateOne,
    opts,
  );
}

module.exports = {
  splitUrlList,
  websiteUrlCacheKey,
  websiteHostnameKey,
  sameWebsiteUrl,
  parseTypographyWebsiteUrlsFromBody,
  parseTypographyWebsiteUrlsFromQuery,
};
