/**
 * CLI-only: uploads local `sr-2026/` to a NEW Design Manager root folder (never `/sr-2026`).
 * Does not run typography baking — use Ditto `POST /api/theme-upload-reference-copy` for that.
 */
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "sr-2026");
const fs = require("fs");
if (!fs.existsSync(src)) {
  console.error("Missing folder:", src);
  process.exit(1);
}

const token = Date.now().toString(36) + Math.random().toString(16).slice(2, 6);
const dest = `sr-2026-work-${token}`;
const account = process.env.HUBSPOT_ACCOUNT || process.env.HUBSPOT_CLI_ACCOUNT || "";
const accFlag = account ? ` -a "${String(account).replace(/"/g, '\\"')}"` : "";

const cmd = `npx --yes -p @hubspot/cli@8.4.0 hs cms upload "${src}" "/${dest}"${accFlag}`;
console.log("HubSpot destination (new root folder): /" + dest);
console.log("(Local sr-2026 is only read; this does not modify HubSpot /sr-2026 unless you misconfigure dest elsewhere.)\n");

execSync(cmd, { stdio: "inherit", cwd: root, shell: true, env: process.env });
console.log("\nDone. In Design Manager → Search assets, paste exactly:", dest);
