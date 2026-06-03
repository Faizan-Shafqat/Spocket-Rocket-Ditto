/* Usage: node tools/run-fetch.cjs "/remote/path/Module.module"  (HubSpot 8: hs cms fetch) */
const { execSync } = require("child_process");
const path = require("path");
const remote = process.argv[2];
if (!remote) {
  console.error("Missing argument. Example:");
  console.error('  node tools/run-fetch.cjs "/@hubspot/YourName.module"');
  console.error("  (Use global) hs cms fetch ...");
  process.exit(1);
}
const name = path.basename(remote.replace(/[\\/]+$/, "")) || "fetched-module";
const local = path.join("hubspot-pulled", name);
const acct = process.env.HS_ACCOUNT || "fake-demo-account";
const cmd = `hs cms fetch ${JSON.stringify(remote)} ${JSON.stringify(local)} -a ${JSON.stringify(acct)} -o`;
console.log("Running:\n" + cmd + "\n");
execSync(cmd, { stdio: "inherit", shell: true, cwd: path.join(__dirname, "..") });
console.log("\nOK -> " + local);
