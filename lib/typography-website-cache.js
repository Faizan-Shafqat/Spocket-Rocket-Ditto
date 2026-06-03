/**
 * Persistent typography cache keyed by website URL (timestamp ignored on lookup).
 *
 * Index file: `typography-extract-cache/website-typography-index.json`
 * Audit snapshots: `typography-extract-cache/*.json` (upload/extract history; also scanned to seed index)
 */

const fs = require("fs");
const path = require("path");

const { siteSlugFromUrl, siteRecordForUpload } = require("./typography-sites-bundle");
const {
  websiteUrlCacheKey,
  websiteHostnameKey,
  sameWebsiteUrl,
} = require("./typography-website-urls");

const INDEX_FILENAME = "website-typography-index.json";

/**
 * @param {unknown} pw
 */
function playwrightEnvelopeUsable(pw) {
  if (!pw || typeof pw !== "object") {
    return false;
  }
  const p = /** @type {Record<string, unknown>} */ (pw);
  if (p.success !== true && p.ok !== true) {
    return false;
  }
  return (
    envelopeHasUsableTypography(p.typography) ||
    envelopeHasUsableTypography(p.typography_full_page)
  );
}

/**
 * @param {unknown} typography
 */
function envelopeHasUsableTypography(typography) {
  if (!typography || typeof typography !== "object") {
    return false;
  }
  const body = typography.body;
  const heads = typography.headings;
  if (body && typeof body === "object" && String(body.fontFamily || "").trim()) {
    return true;
  }
  if (heads && typeof heads === "object") {
    for (const h of Object.values(heads)) {
      if (h && typeof h === "object" && String(/** @type {Record<string, unknown>} */ (h).fontFamily || "").trim()) {
        return true;
      }
    }
  }
  const g = typography.google_fonts_urls;
  return Array.isArray(g) && g.some((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim()));
}

/**
 * @param {Record<string, unknown>|null|undefined} ai
 */
function typographyAiHasUsableFonts(ai) {
  if (!ai || typeof ai !== "object" || ai.error) {
    return false;
  }
  if (String(ai.primary_font_family || "").trim() || String(ai.body_font_family || "").trim()) {
    return true;
  }
  const est = ai.typography_site_estimate;
  return Boolean(est && typeof est === "object" && !Array.isArray(est));
}

function indexPath(projectRoot) {
  return path.join(projectRoot, "typography-extract-cache", INDEX_FILENAME);
}

function cacheDir(projectRoot) {
  return path.join(projectRoot, "typography-extract-cache");
}

/**
 * @param {string} projectRoot
 */
function loadIndex(projectRoot) {
  const p = indexPath(projectRoot);
  if (!fs.existsSync(p)) {
    return { version: 1, updated_at: null, entries: {} };
  }
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    if (!data || typeof data !== "object") {
      return { version: 1, updated_at: null, entries: {} };
    }
    if (!data.entries || typeof data.entries !== "object") {
      data.entries = {};
    }
    data.version = 1;
    return data;
  } catch {
    return { version: 1, updated_at: null, entries: {} };
  }
}

/**
 * @param {string} projectRoot
 * @param {Record<string, unknown>} index
 */
function saveIndex(projectRoot, index) {
  const dir = cacheDir(projectRoot);
  fs.mkdirSync(dir, { recursive: true });
  index.updated_at = new Date().toISOString();
  index.version = 1;
  fs.writeFileSync(indexPath(projectRoot), JSON.stringify(index, null, 2), "utf8");
}

/**
 * @param {Record<string, unknown>} entry
 * @param {Record<string, unknown>} patch
 */
function mergeEntry(entry, patch) {
  const out = { ...entry, ...patch };
  out.website_url = patch.website_url || entry.website_url;
  out.website_url_key = websiteUrlCacheKey(String(out.website_url || ""));
  out.saved_at = patch.saved_at || entry.saved_at || new Date().toISOString();
  return out;
}

/**
 * @param {{
 *   projectRoot: string,
 *   websiteUrl: string,
 *   source: string,
 *   playwrightEnvelope?: Record<string, unknown>|null,
 *   typographyExtractUrl?: Record<string, unknown>|null,
 *   typographyExtractAi?: Record<string, unknown>|null,
 *   auditFile?: string|null,
 * }} opts
 */
function upsertWebsiteTypographyCache(opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const key = websiteUrlCacheKey(websiteUrl);
  if (!key) {
    return { ok: false, error: "website_url required" };
  }

  const index = loadIndex(opts.projectRoot);
  const prev = index.entries[key] && typeof index.entries[key] === "object"
    ? /** @type {Record<string, unknown>} */ (index.entries[key])
    : {};

  /** @type {Record<string, unknown>} */
  const entry = mergeEntry(prev, {
    website_url: websiteUrl,
    website_url_key: key,
    saved_at: new Date().toISOString(),
    source: opts.source,
  });

  if (opts.auditFile) {
    entry.audit_file = opts.auditFile;
  }

  const pw = opts.playwrightEnvelope;
  if (pw && typeof pw === "object" && playwrightEnvelopeUsable(pw)) {
    entry.playwright_extract = pw;
    entry.has_playwright = true;
    const resolved = String(pw.website_url || pw.websiteUrl || "").trim();
    if (resolved && !sameWebsiteUrl(resolved, websiteUrl)) {
      entry.playwright_resolved_url = resolved;
    }
  }

  const urlSnap = opts.typographyExtractUrl;
  if (urlSnap && typeof urlSnap === "object" && typographyAiHasUsableFonts(urlSnap.typography_ai)) {
    entry.typography_extract_url = urlSnap;
    entry.has_typography_extract_url = true;
  }

  const aiSnap = opts.typographyExtractAi;
  if (aiSnap && typeof aiSnap === "object" && typographyAiHasUsableFonts(aiSnap.typography_ai)) {
    entry.typography_extract_ai = aiSnap;
    entry.has_typography_extract_ai = true;
  }

  if (!entry.has_playwright && !entry.has_typography_extract_url && !entry.has_typography_extract_ai) {
    return { ok: false, error: "nothing usable to cache" };
  }

  index.entries[key] = entry;
  saveIndex(opts.projectRoot, index);
  return {
    ok: true,
    website_url: websiteUrl,
    website_url_key: key,
    index_file: path.relative(opts.projectRoot, indexPath(opts.projectRoot)).replace(/\\/g, "/"),
    audit_file: entry.audit_file || null,
  };
}

/**
 * Write one audit JSON per site extract + update the website index.
 *
 * @param {string} projectRoot
 * @param {{
 *   websiteUrl: string,
 *   source: "typography_extract_playwright"|"typography_extract_url"|"typography_extract_ai",
 *   response: Record<string, unknown>,
 * }} opts
 */
function persistTypographyExtractToCache(projectRoot, opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const response = opts.response && typeof opts.response === "object" ? opts.response : {};
  const slug = siteSlugFromUrl(websiteUrl);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const channel = String(opts.source || "extract").replace(/^typography_extract_/, "");
  const dir = cacheDir(projectRoot);
  fs.mkdirSync(dir, { recursive: true });
  const fileName = `${channel}-${slug}-${stamp}.json`;
  const outPath = path.join(dir, fileName);
  const payload = {
    timestamp: new Date().toISOString(),
    source: opts.source,
    website_url: websiteUrl,
    website_url_key: websiteUrlCacheKey(websiteUrl),
    response,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  const rel = path.relative(projectRoot, outPath).replace(/\\/g, "/");

  const cacheOpts = {
    projectRoot,
    websiteUrl,
    source: opts.source,
    auditFile: rel,
  };
  if (opts.source === "typography_extract_playwright") {
    cacheOpts.playwrightEnvelope = response;
  } else if (opts.source === "typography_extract_url") {
    cacheOpts.typographyExtractUrl = response;
  } else if (opts.source === "typography_extract_ai") {
    cacheOpts.typographyExtractAi = response;
  }
  return { ...upsertWebsiteTypographyCache(cacheOpts), audit_file: rel };
}

/**
 * @param {string} projectRoot
 * @param {string} websiteUrl
 */
function findCachedWebsiteTypography(projectRoot, websiteUrl) {
  const key = websiteUrlCacheKey(websiteUrl);
  if (!key) {
    return { ok: false, cache_hit: false, error: "website_url required" };
  }
  const index = loadIndex(projectRoot);
  let entry = index.entries[key];
  if ((!entry || typeof entry !== "object") && websiteUrl) {
    const host = websiteHostnameKey(websiteUrl);
    if (host) {
      for (const e of Object.values(index.entries)) {
        if (
          e &&
          typeof e === "object" &&
          websiteHostnameKey(
            String(/** @type {Record<string, unknown>} */ (e).website_url || ""),
          ) === host
        ) {
          entry = e;
          break;
        }
      }
    }
  }
  if (!entry || typeof entry !== "object") {
    return {
      ok: true,
      cache_hit: false,
      website_url: websiteUrl,
      website_url_key: key,
      index_file: path.relative(projectRoot, indexPath(projectRoot)).replace(/\\/g, "/"),
    };
  }

  const e = /** @type {Record<string, unknown>} */ (entry);
  const hasPw = Boolean(e.has_playwright && e.playwright_extract);
  const hasUrl = Boolean(e.has_typography_extract_url && e.typography_extract_url);
  const hasAi = Boolean(e.has_typography_extract_ai && e.typography_extract_ai);

  if (!hasPw && !hasUrl && !hasAi) {
    return {
      ok: true,
      cache_hit: false,
      website_url: websiteUrl,
      website_url_key: key,
    };
  }

  return {
    ok: true,
    cache_hit: true,
    website_url: String(e.website_url || websiteUrl),
    website_url_key: key,
    saved_at: e.saved_at || null,
    source: e.source || null,
    audit_file: e.audit_file || null,
    playwright_extract: hasPw ? e.playwright_extract : null,
    typography_extract_url: hasUrl ? e.typography_extract_url : null,
    typography_extract_ai: hasAi ? e.typography_extract_ai : null,
    index_file: path.relative(projectRoot, indexPath(projectRoot)).replace(/\\/g, "/"),
  };
}

/**
 * Scan `typography-extract-cache/*.json` audit files and merge into index (keeps newest per URL).
 *
 * @param {string} projectRoot
 */
function rebuildIndexFromAuditFiles(projectRoot) {
  const dir = cacheDir(projectRoot);
  if (!fs.existsSync(dir)) {
    return { ok: true, merged: 0, files: 0 };
  }
  const index = loadIndex(projectRoot);
  let merged = 0;
  let files = 0;

  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json") || name === INDEX_FILENAME) {
      continue;
    }
    const fp = path.join(dir, name);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      continue;
    }
    files += 1;
    const websiteUrl = String(data.website_url || data.response?.website_url || "").trim();
    if (!websiteUrl) {
      continue;
    }
    const key = websiteUrlCacheKey(websiteUrl);
    const ts = String(data.timestamp || "");
    const prev = index.entries[key];
    if (prev && typeof prev === "object" && String(prev.saved_at || "") > ts) {
      continue;
    }

    const resp = data.response;
    if (resp && typeof resp === "object" && envelopeHasUsableTypography(resp.typography)) {
      index.entries[key] = mergeEntry(
        prev && typeof prev === "object" ? /** @type {Record<string, unknown>} */ (prev) : {},
        {
          website_url: websiteUrl,
          saved_at: ts || new Date().toISOString(),
          source: String(data.mode || "audit") + "_playwright",
          audit_file: path.relative(projectRoot, fp).replace(/\\/g, "/"),
          playwright_extract: resp,
          has_playwright: true,
        },
      );
      merged += 1;
    }
  }

  if (merged > 0) {
    saveIndex(projectRoot, index);
  }
  return { ok: true, merged, files, entries: Object.keys(index.entries).length };
}

/**
 * @param {string} projectRoot
 */
function ensureTypographyWebsiteIndex(projectRoot) {
  const p = indexPath(projectRoot);
  if (!fs.existsSync(p)) {
    return rebuildIndexFromAuditFiles(projectRoot);
  }
  const index = loadIndex(projectRoot);
  if (!Object.keys(index.entries || {}).length) {
    return rebuildIndexFromAuditFiles(projectRoot);
  }
  return { ok: true, skipped: true, entries: Object.keys(index.entries).length };
}

/**
 * Fill missing playwright/green/purple per site from `website-typography-index.json`.
 *
 * @param {string} projectRoot
 * @param {Array<Record<string, unknown>>} sites
 * @returns {Array<Record<string, unknown>>}
 */
function hydrateTypographySitesFromCache(projectRoot, sites) {
  const list = Array.isArray(sites) ? sites : [];
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const raw of list) {
    const base = raw && typeof raw === "object" ? { ...raw } : {};
    const url = String(base.website_url || base.websiteUrl || "").trim();
    if (!url) {
      continue;
    }
    base.website_url = url;
    if (!base.slug) {
      base.slug = siteSlugFromUrl(url);
    }
    const prelim = siteRecordForUpload(base);
    if (!prelim.typography) {
      const hit = findCachedWebsiteTypography(projectRoot, url);
      if (hit.cache_hit && hit.playwright_extract) {
        base.playwright = hit.playwright_extract;
      }
    }
    out.push(base);
  }
  return out;
}

module.exports = {
  INDEX_FILENAME,
  websiteUrlCacheKey,
  sameWebsiteUrl,
  loadIndex,
  findCachedWebsiteTypography,
  upsertWebsiteTypographyCache,
  persistTypographyExtractToCache,
  rebuildIndexFromAuditFiles,
  ensureTypographyWebsiteIndex,
  envelopeHasUsableTypography,
  typographyAiHasUsableFonts,
  hydrateTypographySitesFromCache,
};
