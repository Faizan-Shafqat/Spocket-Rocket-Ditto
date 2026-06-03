/**
 * One-off smoke test: bake slim staging → publish to SR preview portal.
 * Usage: SR_PREVIEW_PUBLISH_TOKEN=... node scripts/test-sr-preview-publish.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { buildSlimStaging, removeStagingQuiet } = require("../lib/slim-staging");
const { publishBakedThemeToSrPreview } = require("../lib/sr-preview-publish");

async function main() {
  const workdir = path.join(
    __dirname,
    "..",
    "hs-upload-tmp",
    `test-preview-${Date.now()}`,
  );
  fs.mkdirSync(workdir, { recursive: true });
  buildSlimStaging(workdir, {
    moduleFolderNames: ["SR Hero 01.module"],
    includePreview: true,
  });
  const out = await publishBakedThemeToSrPreview({
    workdir,
    websiteUrl: "https://www.smuves.com/",
    body: {
      sr_preview_client: "ditto-test",
      sr_preview_project: `smuves-${Date.now().toString(36)}`,
    },
    typography: {
      colors: { primary: "#112233" },
      body: { fontFamily: '"Inter", sans-serif' },
      headings: { h1: { fontFamily: '"Oswald", sans-serif' } },
    },
  });
  console.log(JSON.stringify(out, null, 2));
  removeStagingQuiet(workdir);
  if (!out.uploadOk) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
