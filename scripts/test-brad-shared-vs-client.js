/**
 * DIAGNOSTIC ONLY — not used by Ditto UI.
 *
 * Runs the same path as "Publish to SR Preview": POST /api/sr-preview-publish
 * with cached Playwright extract (no hardcoded hero copy).
 *
 * Usage:
 *   node scripts/test-brad-shared-vs-client.js https://www.prialto.com/
 *
 * Requires: npm run dev on :3000, SR_PREVIEW_PUBLISH_TOKEN, prior Extract Typography.
 *
 * Optional env: DITTO_BASE_URL=http://localhost:3000
 */

require("dotenv").config();
const path = require("path");
const { findCachedWebsiteTypography } = require("../lib/typography-website-cache");

const BASE = String(process.env.DITTO_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

function parseWebsiteUrl(argv) {
  for (const arg of argv) {
    if (arg.startsWith("--website=")) {
      return arg.slice("--website=".length).trim();
    }
    if (/^https?:\/\//i.test(arg)) {
      return arg.trim();
    }
  }
  return "";
}

async function main() {
  const websiteUrl = parseWebsiteUrl(process.argv.slice(2));
  if (!websiteUrl) {
    console.error(
      "Usage: node scripts/test-brad-shared-vs-client.js <website_url>\n" +
        "  e.g. node scripts/test-brad-shared-vs-client.js https://www.prialto.com/",
    );
    process.exit(1);
  }

  const projectRoot = path.join(__dirname, "..");
  const hit = findCachedWebsiteTypography(projectRoot, websiteUrl);
  if (!hit.cache_hit || !hit.playwright_extract) {
    console.error("No cached extract. Run Extract Typography in Ditto first.");
    process.exit(1);
  }

  const extract = hit.playwright_extract;
  const hero = extract.hero;
  const expectedTitle = String(hero?.text?.title || "").trim();
  const expectedPre = String(hero?.text?.preheading || "").trim();

  console.log("Using cached extract (not hardcoded):", {
    websiteUrl,
    strategy: hero?.strategy,
    title: expectedTitle.slice(0, 80),
    preheading: expectedPre,
    bg: hero?.background?.recommendedImageUrl || hero?.background?.backgroundColor,
  });

  const res = await fetch(`${BASE}/api/sr-preview-publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      typographyWebsiteUrl: websiteUrl,
      typographyExtract: extract,
      sr_preview_skip_template: true,
    }),
  });

  const data = await res.json().catch(() => ({}));
  console.log("publish status", res.status, "ok", data.ok, "status", data.status);
  console.log("moduleUrl", data.moduleUrl);
  console.log("bradModuleHtmlBaked", data.bradModuleHtmlBaked);
  console.log("hint", data.previewUrlHint);

  if (!data.moduleUrl) {
    process.exit(res.ok ? 0 : 1);
  }

  const html = await fetch(data.moduleUrl).then((r) => r.text());
  const checks = {
    "sr-hero-01": html.includes("sr-hero-01"),
    "widget missing": html.includes("custom widget definition not found"),
    "title in page": expectedTitle ? html.includes(expectedTitle.slice(0, 40)) : null,
    "preheading in page": expectedPre ? html.includes(expectedPre) : null,
    "DITTO SMUVES test pollution": html.includes("DITTO SMUVES"),
  };
  console.log("live /m/ checks:", checks);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
