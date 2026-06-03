require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { previewPublishTemplateFile } = require("../lib/sr-preview-api-client");

const CLIENT = "smuves-com";
const PROJECT = "site-mpvb2qjx";

function buildHome(modulePath) {
  return `<!--
  templateType: page
  isAvailableForNewContent: false
-->

{% set client_theme_overrides = '../adapters/clients/${CLIENT}/${PROJECT}/theme-overrides.css' %}
{% include '../../../header.hubl.html' %}

<body class="body_dnd_area">
  {% module "hero" path="${modulePath}" %}
  {% include '../../../footer-includes.hubl.html' %}
</body>
</html>
`;
}

async function testPath(modulePath, slug) {
  const html = buildHome(modulePath);
  const fp = path.join(__dirname, "..", "hs-upload-tmp", `path-test-${slug}.html`);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, html);
  const r = await previewPublishTemplateFile(CLIENT, PROJECT, slug, fp);
  console.log(JSON.stringify({ slug, modulePath, status: r.status, ok: r.ok, data: r.data }));
}

async function verifyTemplate(slug) {
  const url = `https://preview.sprocketrocket.co/t/${CLIENT}/${PROJECT}/${slug}`;
  const res = await fetch(url);
  const html = await res.text();
  const notFound = html.includes("custom widget definition not found");
  const h1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.exec(html);
  return { url, notFound, h1: h1 ? h1[0].replace(/\s+/g, " ").trim() : null };
}

async function main() {
  const paths = process.argv.slice(2);
  const candidates =
    paths.length > 0
      ? paths
      : [
          "../../../../hubl-modules/_shared/SR Hero 01.module",
          "../../../../clients/smuves-com/site-mpvb2qjx/SR Hero 01.module",
          "clients/smuves-com/site-mpvb2qjx/SR Hero 01.module",
          "../../../../clients/acme/starter/SR Hero 01.module",
          "../custom-modules/SR Hero 01.module",
          "../../../../hubl-modules/clients/smuves-com/site-mpvb2qjx/SR Hero 01.module",
        ];

  for (let i = 0; i < candidates.length; i++) {
    const modulePath = candidates[i];
    const slug = `path-${i}`;
    await testPath(modulePath, slug);
    const v = await verifyTemplate(slug);
    console.log(JSON.stringify({ modulePath, ...v }));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
