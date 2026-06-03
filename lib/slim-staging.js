/**
 * Builds a minimal HubSpot theme folder (read-only copies from sr-2026 only).
 * Never writes to sr-2026.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const SR = path.join(__dirname, "..", "sr-2026");

function copyFile(src, dest) {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
	fs.cpSync(src, dest, { recursive: true });
}

/**
 * @param {string} workdir absolute path to empty staging root
 * @param {{ moduleFolderNames: string[], includePreview: boolean }} opts
 *        moduleFolderNames: e.g. ["SR Hero 01.module"] or names without .module
 */
function buildSlimStaging(workdir, opts) {
	const { moduleFolderNames, includePreview } = opts;
	fs.mkdirSync(workdir, { recursive: true });

	for (const base of ["theme.json", "init.json"]) {
		const s = path.join(SR, base);
		if (!fs.existsSync(s)) {
			throw new Error("Missing reference file: " + s);
		}
		copyFile(s, path.join(workdir, base));
	}

	const names = (moduleFolderNames || []).map((n) => (String(n).endsWith(".module") ? String(n) : `${n}.module`));
	if (!names.length) {
		throw new Error("slim-staging: need at least one module");
	}
	for (const folder of names) {
		const src = path.join(SR, "custom-modules", folder);
		if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
			throw new Error("Unknown module folder: " + folder);
		}
		copyDir(src, path.join(workdir, "custom-modules", folder));
	}

	if (includePreview !== false) {
		for (const rel of [
			"templates/preview.html",
			"templates/header.html",
			"templates/footer-includes.html",
			"templates/macros.html",
		]) {
			const s = path.join(SR, rel);
			if (!fs.existsSync(s)) {
				throw new Error("Missing: " + rel);
			}
			copyFile(s, path.join(workdir, rel));
		}
	}

	// `css/base.css` uses {% include %} for ./generic/*, ./objects/*, etc. Copying only
	// base.css + overrides leaves broken HubL → compile failure → blank theme preview.
	const cssRoot = path.join(SR, "css");
	if (fs.existsSync(cssRoot) && fs.statSync(cssRoot).isDirectory()) {
		copyDir(cssRoot, path.join(workdir, "css"));
	}
	for (const f of ["interaction.js", "prototype.js"]) {
		const s = path.join(SR, "js", f);
		if (fs.existsSync(s)) {
			copyFile(s, path.join(workdir, "js", f));
		}
	}
	// jQuery: templates reference `jquery.js`; reference repo may only ship `sr-jquery-3-6-0.js`
	const jqPath = path.join(workdir, "js", "jquery.js");
	if (!fs.existsSync(jqPath) || !fs.statSync(jqPath).isFile() || fs.statSync(jqPath).size < 1) {
		const named = path.join(SR, "js", "sr-jquery-3-6-0.js");
		if (fs.existsSync(named)) {
			copyFile(named, jqPath);
		} else {
			const jFallback = path.join(SR, "js", "jquery.js");
			if (fs.existsSync(jFallback)) {
				copyFile(jFallback, jqPath);
			}
		}
	}
	for (const f of ["fields.json"]) {
		const s = path.join(SR, f);
		if (fs.existsSync(s)) {
			copyFile(s, path.join(workdir, f));
		}
	}
	for (const img of ["sr-app.jpg", "sr-page.jpg"]) {
		const s = path.join(SR, "images", img);
		if (fs.existsSync(s)) {
			copyFile(s, path.join(workdir, "images", img));
		}
	}

	return workdir;
}

function removeStagingQuiet(dir) {
	try {
		if (dir && fs.existsSync(dir)) {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	} catch {
		// ignore
	}
}

module.exports = { buildSlimStaging, removeStagingQuiet, SR_REF_ROOT: SR };
