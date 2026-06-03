/**
 * Run typography extract handlers for multiple URLs with bounded concurrency.
 */

const { parseTypographyWebsiteUrlsFromBody } = require("./typography-website-urls");

/**
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<unknown>} fn
 */
async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Math.min(Math.max(1, concurrency), items.length || 1);

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: workers }, () => worker()));
  return results;
}

/**
 * @param {{
 *   urls: { websiteUrl: string }[],
 *   invalid: { raw: string, error: string }[],
 *   truncated?: boolean,
 * }} parsed
 * @param {Record<string, unknown>[]} results
 * @param {number} elapsedMs
 */
function buildBatchExtractResponse(parsed, results, elapsedMs) {
  const succeeded = results.filter((r) => r && r.ok !== false).length;
  const failed = results.length - succeeded;
  const fromCache = results.filter((r) => r && r.from_website_cache).length;

  return {
    ok: succeeded > 0,
    multi: true,
    website_urls: parsed.urls.map((u) => u.websiteUrl),
    invalid: parsed.invalid.length ? parsed.invalid : undefined,
    truncated: parsed.truncated || undefined,
    summary: {
      total: results.length,
      succeeded,
      failed,
      from_cache: fromCache,
    },
    results,
    elapsed_ms: elapsedMs,
  };
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {(websiteUrl: string, body: Record<string, unknown>) => Promise<{ status: number, body: Record<string, unknown> }>} handlerOne
 * @param {{
 *   validateOne: (raw: string) => { ok: boolean, websiteUrl?: string, error?: string },
 *   maxUrls?: number,
 *   concurrency?: number,
 * }} opts
 */
async function dispatchTypographyExtract(req, res, handlerOne, opts) {
  const b = /** @type {Record<string, unknown>} */ (req.body || {});
  const parsed = parseTypographyWebsiteUrlsFromBody(b, opts.validateOne, {
    maxUrls: opts.maxUrls,
  });

  if (!parsed.urls.length) {
    return res.status(400).json({
      ok: false,
      error: parsed.error || "No valid website URL",
      invalid: parsed.invalid.length ? parsed.invalid : undefined,
      truncated: parsed.truncated || undefined,
    });
  }

  if (parsed.urls.length === 1) {
    const one = await handlerOne(parsed.urls[0].websiteUrl, b);
    return res.status(one.status).json(one.body);
  }

  const t0 = Date.now();
  const results = await mapWithConcurrency(
    parsed.urls,
    opts.concurrency || 2,
    async (entry) => {
      try {
        const one = await handlerOne(entry.websiteUrl, b);
        const body = one.body && typeof one.body === "object" ? one.body : {};
        const ok =
          one.status >= 200 &&
          one.status < 300 &&
          body.ok !== false &&
          !body.error;
        const resolvedUrl = String(
          body.website_url || body.websiteUrl || entry.websiteUrl,
        ).trim();
        return {
          ...body,
          website_url: entry.websiteUrl,
          requested_website_url: entry.websiteUrl,
          resolved_website_url: resolvedUrl,
          http_status: one.status,
          ok,
        };
      } catch (e) {
        return {
          website_url: entry.websiteUrl,
          ok: false,
          error: e.message || String(e),
        };
      }
    },
  );

  const batch = buildBatchExtractResponse(parsed, results, Date.now() - t0);
  const status =
    batch.summary.succeeded === 0
      ? 400
      : batch.summary.failed > 0
        ? 207
        : 200;
  return res.status(status).json(batch);
}

module.exports = {
  mapWithConcurrency,
  buildBatchExtractResponse,
  dispatchTypographyExtract,
};
