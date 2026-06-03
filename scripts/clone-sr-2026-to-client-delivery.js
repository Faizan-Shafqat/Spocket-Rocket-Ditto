/**
 * One-time / on-demand: copy the read-only SR reference theme (sr-2026) into
 * client-delivery-theme for uploads and optional injection. Never writes to sr-2026.
 *
 * Run: npm run prepare-client-theme
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "sr-2026");
const DEST = path.join(ROOT, "client-delivery-theme");

function main() {
	if (!fs.existsSync(SRC) || !fs.statSync(SRC).isDirectory()) {
		console.error("Missing or invalid source:", SRC);
		process.exit(1);
	}
	if (fs.existsSync(DEST)) {
		console.log("Already exists, removing and recopying:", DEST);
		fs.rmSync(DEST, { recursive: true, force: true });
	}
	fs.mkdirSync(DEST, { recursive: true });
	if (typeof fs.cpSync === "function") {
		fs.cpSync(SRC, DEST, { recursive: true });
	} else {
		// Node < 16.7
		console.error("This script requires Node 16+ (fs.cpSync).");
		process.exit(1);
	}
	const count = walkFileCount(DEST);
	console.log("Wrote", DEST, "files ~", count);
}

function walkFileCount(dir) {
	let n = 0;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) n += walkFileCount(p);
		else n += 1;
	}
	return n;
}

main();
