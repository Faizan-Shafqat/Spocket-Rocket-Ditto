/**
 * HubSpot CMS Site Pages API — optional draft page after theme upload.
 * Uses a Private App token (Bearer). Scopes typically include `cms.pages.sites.write`.
 */

const HUBSPOT_API = "https://api.hubapi.com";

async function getFetch() {
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }
  const { default: f } = await import("node-fetch");
  return f;
}

function resolveCmsPat() {
  const t =
    process.env.HUBSPOT_CMS_PAT ||
    process.env.HUBSPOT_PRIVATE_APP_TOKEN ||
    process.env.HUBSPOT_INSTALLER_PAT ||
    process.env.DEMO_TOKEN ||
    "";
  return String(t || "").trim();
}

/**
 * @param {string} path  e.g. /cms/v3/pages/site-pages
 * @param {{ method?: string, token: string, body?: object }} opts
 */
async function hubspotJson(path, opts) {
  const fetch = await getFetch();
  const url = path.startsWith("http") ? path : `${HUBSPOT_API}${path}`;
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/json",
    },
    ...(opts.body != null ? { body: JSON.stringify(opts.body) } : {}),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

function sanitizeSlug(s) {
  const x = String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return x || `sr-hero-${Date.now()}`;
}

/**
 * Build optional query string for preview.html (`request.query_dict.*` in HubL).
 * @param {{ heroHeading?: string, heroDescription?: string, heroCtaText?: string }} q
 */
function previewQueryFromBody(q) {
  const params = new URLSearchParams();
  if (q.heroHeading || q.hero_heading) {
    params.set("hero_heading", String(q.heroHeading || q.hero_heading).trim());
  }
  if (q.heroDescription || q.hero_description) {
    params.set(
      "hero_description",
      String(q.heroDescription || q.hero_description).trim(),
    );
  }
  if (q.heroCtaText || q.ctaText) {
    params.set("hero_cta_text", String(q.heroCtaText || q.ctaText).trim());
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

/**
 * @param {string} portalId
 * @param {string} token
 * @param {{ themeFolder: string, pageName?: string, slug?: string, language?: string }} opts
 */
async function createDraftSitePage(portalId, token, opts) {
  const themeFolder = String(opts.themeFolder || "")
    .replace(/^\//, "")
    .replace(/\/+$/, "");
  if (!themeFolder) {
    return { ok: false, error: "themeFolder is required" };
  }
  const templatePath = `${themeFolder}/templates/preview.html`;
  const slug = sanitizeSlug(opts.slug || `sr-hero-${Date.now()}`);
  const name =
    (opts.pageName && String(opts.pageName).trim()) ||
    `SR Hero Preview — ${themeFolder}`;

  const { ok, status, json } = await hubspotJson("/cms/v3/pages/site-pages", {
    method: "POST",
    token,
    body: {
      name,
      slug,
      templatePath,
      language: opts.language || "en",
      state: "DRAFT",
    },
  });

  if (!ok) {
    const msg =
      json &&
      (json.message ||
        (Array.isArray(json.errors) && json.errors[0] && json.errors[0].message));
    return {
      ok: false,
      status,
      error: msg || JSON.stringify(json).slice(0, 800),
      hubspot: json,
    };
  }

  const id = json.id;
  const p = String(portalId);
  const editorUrlCandidates = [
    `https://app.hubspot.com/content/${p}/edit/${id}`,
    `https://app.hubspot.com/pages/${p}/content/${id}`,
  ];

  return {
    ok: true,
    page: {
      id,
      slug: json.slug,
      name: json.name,
      templatePath: json.templatePath || templatePath,
      state: json.state,
      url: json.url || json.publicUrl || null,
    },
    editorUrlCandidates,
    hubspotCreateResponse: {
      id: json.id,
      slug: json.slug,
      name: json.name,
      state: json.state,
      url: json.url,
    },
  };
}

/**
 * If body.createDraftPage is true, creates a draft site page using `preview.html` in the uploaded theme.
 * @param {string} portalId
 * @param {object} body  request body (clone endpoints)
 * @param {string} themeFolder  Design Manager folder segment (no leading slash)
 */
async function maybeCreateDraftPreviewPage(portalId, body, themeFolder) {
  const b = body || {};
  const want =
    b.createDraftPage === true ||
    b.createDraftPreviewPage === true ||
    b.createPage === true;
  if (!want) {
    return {};
  }

  const token = resolveCmsPat();
  if (!token) {
    return {
      draftPageApi: {
        attempted: true,
        skipped: true,
        reason:
          "No CMS token: set HUBSPOT_CMS_PAT (recommended) or HUBSPOT_PRIVATE_APP_TOKEN on a private app with cms.pages.sites.write (and read). Installer PAT may lack these scopes.",
      },
    };
  }

  try {
    const slugBase =
      (b.pageSlug && String(b.pageSlug).trim()) ||
      (b.newThemeName && sanitizeSlug(b.newThemeName)) ||
      null;
    const r = await createDraftSitePage(portalId, token, {
      themeFolder,
      pageName: b.pageName || b.draftPageName,
      slug: slugBase ? `${slugBase}-${Date.now().toString(36)}` : undefined,
    });

    if (!r.ok) {
      return {
        draftPageApi: {
          attempted: true,
          ok: false,
          status: r.status,
          error: r.error,
        },
      };
    }

    const q = previewQueryFromBody(b);
    const appendQuery = (u, qStr) => {
      if (!u || !qStr) {
        return u;
      }
      return u.includes("?") ? `${u}&${qStr.slice(1)}` : `${u}${qStr}`;
    };

    return {
      draftPageApi: { attempted: true, ok: true },
      draftPage: r.page,
      pageEditorUrlCandidates: r.editorUrlCandidates,
      previewQueryString: q || null,
      pageUrlWithQueryParams: r.page.url ? appendQuery(r.page.url, q) : null,
      previewWorkflowNote:
        "Open an editor URL, then Preview. Optional URL query params map to request.query_dict in preview.html.",
    };
  } catch (e) {
    return {
      draftPageApi: {
        attempted: true,
        ok: false,
        error: e && e.message ? e.message : String(e),
      },
    };
  }
}

module.exports = {
  resolveCmsPat,
  createDraftSitePage,
  maybeCreateDraftPreviewPage,
  previewQueryFromBody,
};
