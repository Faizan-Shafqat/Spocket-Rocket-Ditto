/**
 * Upload local theme files to a NEW folder in the same HubSpot account (copy as new theme).
 * Uses global `hs` v8+ : hs cms upload <local> <remote>
 *
 * Usage: node tools/publish-new-theme.cjs <RemoteFolderName>
 *   THEME_SOURCE=path/to/sr  (default: hubspot-fetched/sr)
 *   HS_ACCOUNT=fake-demo-account
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const destName = process.argv[2];
if (!destName || /[/\\]/.test(destName)) {
  console.error("Usage: node tools/publish-new-theme.cjs <NewThemeFolderName>");
  console.error('Example: node tools/publish-new-theme.cjs "Testing-hardcoded-01"');
  process.exit(1);
}

const root = path.join(__dirname, "..");
const src = process.env.THEME_SOURCE || path.join(root, "hubspot-fetched", "sr");
const acct = process.env.HS_ACCOUNT || "fake-demo-account";

if (!fs.existsSync(path.join(src, "theme.json"))) {
  console.warn("Warning: no theme.json in " + src + " — upload may still work.");
}

// Remote path: no leading slash in some CLIs; HubSpot v8 accepts ./Name
const remote = destName;

const cmd = `hs cms upload ${JSON.stringify(src)} ${JSON.stringify(remote)} -a ${JSON.stringify(acct)} -o`;
console.log("Running from " + root + ":\n" + cmd + "\n");
execSync(cmd, { stdio: "inherit", shell: true, cwd: root });
console.log("\nDone. New theme folder in Design Manager:", remote);
