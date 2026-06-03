/**
 * One-way sync: copy SR Hero 01 from read-only reference (sr-2026) into
 * my-theme/custom-modules (owned copy), then embed those files into
 * my-theme/installer.functions/theme.js for HubSpot deploy.
 *
 * Run: node scripts/sync-client-hero-into-theme.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REF = path.join(
	ROOT,
	"sr-2026",
	"custom-modules",
	"SR Hero 01.module",
);
const OWNED = path.join(
	ROOT,
	"my-theme",
	"custom-modules",
	"SR Hero 01.module",
);
const THEME_JS = path.join(ROOT, "my-theme", "installer.functions", "theme.js");
const REF_ROOT = path.join(ROOT, "sr-2026");
const FILES = ["fields.json", "meta.json", "module.css", "module.html", "module.js"];

/**
 * SR Hero 01 module references these (relative to theme root) — copy from
 * reference into my-theme so Design Manager / CLI validation passes. Read-only: sr-2026.
 */
const REF_THEME_DEPS = [
	["templates", "macros.html"],
	["js", "gsap.js"],
	["js", "ScrollTrigger.js"],
];

const MYTHEME = path.join(ROOT, "my-theme");

/** Safety: this workflow never mutates the read-only company reference in sr-2026. */
function mustNotBeUnderRef(absolutePath, label) {
	const norm = path.resolve(absolutePath);
	const root = path.resolve(REF_ROOT);
	if (norm === root || norm.startsWith(root + path.sep)) {
		throw new Error(`Refused (${label}): would write under sr-2026 — ${norm}`);
	}
}

function main() {
	if (!fs.existsSync(REF)) {
		console.error("Reference not found:", REF);
		process.exit(1);
	}
	mustNotBeUnderRef(OWNED, "owned module dir");
	fs.mkdirSync(OWNED, { recursive: true });
	for (const f of FILES) {
		const src = path.join(REF, f);
		const dest = path.join(OWNED, f);
		if (!fs.existsSync(src)) {
			console.error("Missing source file:", src);
			process.exit(1);
		}
		mustNotBeUnderRef(dest, "copy destination");
		fs.copyFileSync(src, dest);
		console.log("Copied", f);
	}

	for (const parts of REF_THEME_DEPS) {
		const src = path.join(REF_ROOT, ...parts);
		const dest = path.join(MYTHEME, ...parts);
		if (!fs.existsSync(src)) {
			console.error("Missing reference file:", src);
			process.exit(1);
		}
		mustNotBeUnderRef(dest, "theme dependency copy");
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(src, dest);
		console.log("Copied", path.join("my-theme", ...parts).replace(/\\/g, "/"));
	}

	let t = fs.readFileSync(THEME_JS, "utf8");
	for (const f of FILES) {
		const relPath = `custom-modules/SR Hero 01.module/${f}`;
		const text = fs.readFileSync(path.join(OWNED, f), "utf8");
		const esc = JSON.stringify(text);
		const re = new RegExp(
			`(\\n\\s*path:\\s*"${relPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",\\s*\\n\\s*content:\\s*)([\\s\\S]*?)(,\\s*\\n\\s*isBinary:)`,
			"m",
		);
		if (!re.test(t)) {
			console.error("Pattern not found for", relPath);
			process.exit(1);
		}
		// $3 is already `,\\n...isBinary:` — do not add a comma after ${esc} (would produce `",,` = syntax error)
		t = t.replace(re, `$1\n      ${esc}$3`);
	}
	mustNotBeUnderRef(THEME_JS, "theme.js write");
	fs.writeFileSync(THEME_JS, t, "utf8");
	console.log("Updated", THEME_JS);
}

main();
