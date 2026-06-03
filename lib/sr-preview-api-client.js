/**
 * Sprocket Rocket Renderer Publishing API (Brad preview portal).
 * @see https://preview.sprocketrocket.co/api/docs
 */

const fs = require("fs");
const path = require("path");

function previewApiBaseUrl() {
  return String(process.env.SR_PREVIEW_API_BASE || "https://preview.sprocketrocket.co").replace(
    /\/+$/,
    "",
  );
}

function previewPublishToken() {
  return String(
    process.env.SR_PREVIEW_PUBLISH_TOKEN ||
      process.env.BRAD_PREVIEW_PUBLISH_TOKEN ||
      "",
  ).trim();
}

/**
 * @param {string} raw
 */
function sanitizePreviewSlug(raw) {
  let s = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!s) {
    s = "site";
  }
  if (!/^[a-z0-9]/.test(s)) {
    s = `s-${s}`;
  }
  return s.slice(0, 48);
}

const DEFAULT_PREVIEW_API_TIMEOUT_MS = Number(process.env.SR_PREVIEW_API_TIMEOUT_MS || 25000);

/**
 * @param {string} method
 * @param {string} apiPath
 * @param {{ json?: Record<string, unknown>, formData?: FormData, query?: Record<string, string>, timeoutMs?: number }} [opts]
 */
async function previewApiRequest(method, apiPath, opts = {}) {
  const token = previewPublishToken();
  if (!token) {
    const err = new Error(
      "SR_PREVIEW_PUBLISH_TOKEN missing in .env (Bearer token from Brad / preview API).",
    );
    err.code = "PREVIEW_TOKEN_MISSING";
    throw err;
  }

  let url = `${previewApiBaseUrl()}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
  if (opts.query && typeof opts.query === "object") {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(opts.query)) {
      if (v != null && String(v).trim()) {
        q.set(k, String(v));
      }
    }
    const qs = q.toString();
    if (qs) {
      url += (url.includes("?") ? "&" : "?") + qs;
    }
  }

  /** @type {Record<string, string>} */
  const headers = { Authorization: `Bearer ${token}` };
  /** @type {RequestInit} */
  const init = { method, headers };

  if (opts.formData) {
    init.body = opts.formData;
  } else if (opts.json != null) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(opts.json);
  }

  const timeoutMs =
    Number(opts.timeoutMs) > 0 ? Number(opts.timeoutMs) : DEFAULT_PREVIEW_API_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  init.signal = controller.signal;

  try {
    const res = await fetch(url, init);
    const text = await res.text();
    clearTimeout(timer);
    /** @type {Record<string, unknown>} */
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      url,
    };
  } catch (e) {
    clearTimeout(timer);
    const aborted = e && typeof e === "object" && e.name === "AbortError";
    return {
      ok: false,
      status: aborted ? 408 : 0,
      data: {
        error: aborted ? `Preview API timed out after ${timeoutMs}ms` : e.message || String(e),
        timedOut: aborted,
      },
      url,
    };
  }
}

/**
 * @param {string} client
 * @param {string} project
 * @param {{ seed?: "minimal"|"none", settings?: Record<string, unknown> }} [opts]
 */
async function previewOnboard(client, project, opts = {}) {
  const r = await previewApiRequest("POST", "/api/onboard", {
    json: {
      client,
      project,
      seed: opts.seed || "none",
      ...(opts.settings ? { settings: opts.settings } : {}),
    },
  });
  if (r.status === 409) {
    return { ...r, ok: true, alreadyExists: true };
  }
  return r;
}

/**
 * @param {string} client
 * @param {string} project
 * @param {Record<string, unknown>} settingsPartial
 */
async function previewPatchThemeSettings(client, project, settingsPartial) {
  return previewApiRequest("PATCH", "/api/theme-settings", {
    json: {
      client,
      project,
      settings: settingsPartial,
    },
  });
}

/**
 * @param {string} client
 * @param {string} project
 */
async function previewGetManifest(client, project) {
  return previewApiRequest("GET", "/api/manifest", {
    query: { client, project },
  });
}

/**
 * @param {string} client
 * @param {string} project
 * @param {string} moduleName label e.g. SR Hero 01
 * @param {string} moduleDir absolute path to *.module folder
 */
async function previewPublishModuleFromDir(client, project, moduleName, moduleDir) {
  const form = new FormData();
  form.append("client", client);
  form.append("project", project);
  form.append("name", moduleName);

  const parts = [
    ["module.html", "module.html", "text/html"],
    ["module.css", "module.css", "text/css"],
    ["module.js", "module.js", "text/javascript"],
    ["fields.json", "fields.json", "application/json"],
    ["meta.json", "meta.json", "application/json"],
  ];

  for (const [formKey, fileName, mime] of parts) {
    const fp = path.join(moduleDir, fileName);
    if (fs.existsSync(fp)) {
      const buf = fs.readFileSync(fp);
      form.append(formKey, new Blob([buf], { type: mime }), fileName);
    }
  }

  if (!fs.existsSync(path.join(moduleDir, "module.html"))) {
    const err = new Error(`Module HTML missing: ${path.join(moduleDir, "module.html")}`);
    err.code = "MODULE_HTML_MISSING";
    throw err;
  }

  return previewApiRequest("POST", "/api/publish-module", {
    formData: form,
    timeoutMs: Number(process.env.SR_PREVIEW_MODULE_TIMEOUT_MS || 45000),
  });
}

/**
 * @param {string} client
 * @param {string} project
 * @param {string} templateName slug e.g. home
 * @param {string} templateHtmlPath absolute path to preview.html
 */
async function previewPublishTemplateFile(client, project, templateName, templateHtmlPath) {
  if (!fs.existsSync(templateHtmlPath)) {
    const err = new Error(`Template HTML missing: ${templateHtmlPath}`);
    err.code = "TEMPLATE_HTML_MISSING";
    throw err;
  }
  const form = new FormData();
  form.append("client", client);
  form.append("project", project);
  form.append("name", templateName);
  const buf = fs.readFileSync(templateHtmlPath);
  form.append("template.html", new Blob([buf], { type: "text/html" }), "template.html");
  return previewApiRequest("POST", "/api/publish-template", { formData: form });
}

/**
 * Upload client theme-overrides.css (referenced by Brad home templates).
 *
 * @param {string} client
 * @param {string} project
 * @param {string} cssPath absolute path to CSS file
 */
async function previewPublishThemeOverrides(client, project, cssPath) {
  if (!fs.existsSync(cssPath)) {
    return { ok: false, status: 400, skipped: true, reason: "css_missing" };
  }

  const buf = fs.readFileSync(cssPath);
  const attempts = [
    {
      path: "/api/publish-theme-overrides",
      form: () => {
        const form = new FormData();
        form.append("client", client);
        form.append("project", project);
        form.append("theme-overrides.css", new Blob([buf], { type: "text/css" }), "theme-overrides.css");
        return form;
      },
    },
    {
      path: "/api/publish-asset",
      form: () => {
        const form = new FormData();
        form.append("client", client);
        form.append("project", project);
        form.append(
          "path",
          `adapters/clients/${client}/${project}/theme-overrides.css`,
        );
        form.append("file", new Blob([buf], { type: "text/css" }), "theme-overrides.css");
        return form;
      },
    },
  ];

  /** @type {Array<Record<string, unknown>>} */
  const tried = [];
  const themeOverridesTimeoutMs = Number(process.env.SR_PREVIEW_THEME_OVERRIDES_TIMEOUT_MS || 8000);
  for (const attempt of attempts) {
    const r = await previewApiRequest("POST", attempt.path, {
      formData: attempt.form(),
      timeoutMs: themeOverridesTimeoutMs,
    });
    tried.push({ path: attempt.path, ok: r.ok, status: r.status, data: r.data });
    if (r.ok) {
      return { ...r, tried, endpoint: attempt.path };
    }
    if (r.status === 404 || r.status === 405 || r.status === 408 || r.data?.timedOut) {
      continue;
    }
  }

  return {
    ok: false,
    status: tried[tried.length - 1]?.status || 404,
    skipped: true,
    reason: "no_theme_overrides_endpoint",
    tried,
  };
}

async function previewHealthCheck() {
  return previewApiRequest("GET", "/api/health");
}

module.exports = {
  previewApiBaseUrl,
  previewPublishToken,
  sanitizePreviewSlug,
  previewApiRequest,
  previewOnboard,
  previewPatchThemeSettings,
  previewGetManifest,
  previewPublishModuleFromDir,
  previewPublishTemplateFile,
  previewPublishThemeOverrides,
  previewHealthCheck,
};
