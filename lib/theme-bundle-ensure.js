/**
 * Ensures a local folder has minimum HubSpot theme files before CLI upload.
 * Reads only from `refRoot` (sr-2026 or same); never writes refRoot.
 * @param {string} themeRoot  Absolute path to the folder being uploaded
 * @param {string} refRoot    Read-only reference (e.g. sr-2026)
 * @returns {{ label: string, version: string }}
 */
const fs = require("fs");
const path = require("path");

const REQUIRED_ROOT = ["theme.json", "init.json", "fields.json"];
const SR_HERO_REL = path.join("custom-modules", "SR Hero 01.module");
const TEMPLATE_RELS = [
	"templates/preview.html",
	"templates/header.html",
	"templates/footer-includes.html",
	"templates/macros.html",
];
const CSS_FOR_PROTOTYPE = "prototype.css";
const JS_MIN = ["interaction.js", "prototype.js"];
const IMAGE_RELS = ["images/sr-app.jpg", "images/sr-page.jpg"];

/** Min size (bytes) to treat jquery.js as real jQuery, not a stub. */
const JQUERY_MIN_BYTES = 5000;

function copyFile(src, dest) {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.cpSync(src, dest, { recursive: true });
}

function copyIfMissingFromRef(themeRoot, refRoot, rel) {
	const target = path.join(themeRoot, rel);
	if (fs.existsSync(target)) {
		const st = fs.statSync(target);
		if (st.isDirectory()) {
			const sub = fs.readdirSync(target);
			if (sub && sub.length) {
				return;
			}
			fs.rmSync(target, { recursive: true, force: true });
		} else if (st.isFile() && st.size > 0) {
			return;
		} else if (st.isFile() && st.size === 0) {
			try {
				fs.unlinkSync(target);
			} catch {
				// will overwrite
			}
		}
	}
	const src = path.join(refRoot, rel);
	if (!fs.existsSync(src)) {
		throw new Error(`theme-bundle-ensure: missing in reference: ${rel}`);
	}
	if (fs.statSync(src).isDirectory()) {
		copyDir(src, target);
	} else {
		copyFile(src, target);
	}
}

/**
 * Single canonical jQuery for HubL: `js/jquery.js` (see templates/footer-includes).
 * `sr-jquery-3-6-0.js` in the ref is the same library; we do not leave a second full copy
 * in the upload bundle (avoids two large identical assets). init.json may reference
 * historical paths; Hub serves theme assets from the uploaded tree.
 */
function ensureJqueryAlias(themeRoot, refRoot) {
	const jq = path.join(themeRoot, "js", "jquery.js");
	const needsCopy =
		!fs.existsSync(jq) || !fs.statSync(jq).isFile() || fs.statSync(jq).size < JQUERY_MIN_BYTES;
	if (needsCopy) {
		const fromNamed = path.join(refRoot, "js", "sr-jquery-3-6-0.js");
		if (fs.existsSync(fromNamed) && fs.statSync(fromNamed).size >= JQUERY_MIN_BYTES) {
			copyFile(fromNamed, jq);
		} else if (fs.existsSync(path.join(refRoot, "js", "jquery.js"))) {
			copyFile(path.join(refRoot, "js", "jquery.js"), jq);
		} else {
			throw new Error("theme-bundle-ensure: jQuery (js/jquery.js) not available in reference");
		}
	}
	// One library, one filename in the bundle (footer order: jquery → interaction)
	const legacyNamed = path.join(themeRoot, "js", "sr-jquery-3-6-0.js");
	if (fs.existsSync(legacyNamed) && fs.statSync(legacyNamed).isFile()) {
		const j1 = fs.readFileSync(jq);
		const j2 = fs.readFileSync(legacyNamed);
		if (j1.length === j2.length && Buffer.compare(j1, j2) === 0) {
			try {
				fs.unlinkSync(legacyNamed);
			} catch {
				// keep both if remove fails; upload still valid
			}
		}
	}
}

/**
 * Normalize `theme.json` path values like `.\/images\/x.jpg` for disk checks.
 * @param {string} s
 * @returns {string}
 */
function cleanThemePathForDisk(s) {
	if (!s || typeof s !== "string") {
		return "";
	}
	return s.replace(/^\.\//, "").replace(/\\+/g, "/");
}

/**
 * Assert theme.json is parseable, has HubSpot-expected fields, and screenshot file exists.
 * (Screenshot drives theme card / listing visuals in HubSpot when present.)
 * @param {string} themeRoot
 * @returns {{ label: string, version: string, screenshotOk: boolean }}
 */
function validateLocalThemeForUpload(themeRoot) {
	const fp = path.join(themeRoot, "theme.json");
	let data;
	try {
		data = JSON.parse(fs.readFileSync(fp, "utf8"));
	} catch (e) {
		throw new Error("theme.json must be valid JSON: " + e.message);
	}
	if (typeof data.label !== "string" || !String(data.label).trim()) {
		throw new Error('theme.json: "label" (string) is required so HubSpot can name the theme in the UI');
	}
	if (data.version == null || String(data.version).trim() === "") {
		throw new Error('theme.json: "version" is required (HubSpot theme version)');
	}
	const label = String(data.label).trim();
	const version = String(data.version).trim();
	let screenshotOk = false;
	const sp = data.screenshot_path;
	if (sp != null && String(sp).length) {
		const rel = cleanThemePathForDisk(String(sp));
		if (!rel) {
			throw new Error('theme.json: "screenshot_path" could not be read');
		}
		const segs = rel.split("/").filter(Boolean);
		const imagePath = path.join(themeRoot, ...segs);
		if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
			throw new Error(
				`theme.json: "screenshot_path" points to a missing file (${rel}) — add the image to the theme or fix the path`,
			);
		}
		screenshotOk = true;
	}
	return { label, version, screenshotOk };
}

/**
 * @param {string} themeRoot
 * @param {string} refRoot
 * @returns {{ label: string, version: string, screenshotOk: boolean }}
 */
function ensureValidThemeBundle(themeRoot, refRoot) {
	if (!refRoot || !fs.existsSync(refRoot)) {
		throw new Error("theme-bundle-ensure: invalid refRoot");
	}
	for (const f of REQUIRED_ROOT) {
		copyIfMissingFromRef(themeRoot, refRoot, f);
	}
	if (!fs.existsSync(path.join(themeRoot, SR_HERO_REL)) || !fs.statSync(path.join(themeRoot, SR_HERO_REL)).isDirectory()) {
		copyIfMissingFromRef(themeRoot, refRoot, SR_HERO_REL);
	} else {
		const heroFiles = fs.readdirSync(path.join(themeRoot, SR_HERO_REL));
		if (!heroFiles.length) {
			fs.rmSync(path.join(themeRoot, SR_HERO_REL), { recursive: true, force: true });
			copyIfMissingFromRef(themeRoot, refRoot, SR_HERO_REL);
		}
	}
	for (const rel of TEMPLATE_RELS) {
		copyIfMissingFromRef(themeRoot, refRoot, rel);
	}
	const cssReset = path.join(themeRoot, "css", "generic", "_reset.css");
	const cssGrid = path.join(themeRoot, "css", "objects", "_grid.css");
	if (!fs.existsSync(cssReset) || !fs.existsSync(cssGrid)) {
		copyDir(path.join(refRoot, "css"), path.join(themeRoot, "css"));
	} else {
		for (const c of ["base.css", "base-overrides.css", CSS_FOR_PROTOTYPE]) {
			copyIfMissingFromRef(themeRoot, refRoot, path.join("css", c));
		}
	}
	for (const j of JS_MIN) {
		copyIfMissingFromRef(themeRoot, refRoot, path.join("js", j));
	}
	ensureJqueryAlias(themeRoot, refRoot);
	for (const img of IMAGE_RELS) {
		copyIfMissingFromRef(themeRoot, refRoot, img);
	}
	return validateLocalThemeForUpload(themeRoot);
}

module.exports = { ensureValidThemeBundle, validateLocalThemeForUpload };
