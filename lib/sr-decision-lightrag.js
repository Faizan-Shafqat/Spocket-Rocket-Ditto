/**
 * SR Hero 01 + module fit: compares **all cached typography extracts** (Playwright / green URL /
 * purple HTML+AI) against local LightRAG cache. Does not run extractors — client or
 * `website-typography-index.json` supplies payloads.
 */

const {
  openaiJsonChat,
  decideSrHero01Match,
  DEFAULT_MODEL,
  resolveOpenAiWebSearchEnabled,
  preferOpenAiResponsesApi,
} = require("./hero-match-pipeline");
const { loadLightragLocalBundle } = require("./lightrag-local-bundle");
const {
  isUsablePlaywrightExtract,
  buildTypographyAiFromPlaywright,
  buildHeroAiFromPlaywright,
} = require("./playwright-typography-to-ai");
const { sameWebsiteUrl } = require("./typography-website-urls");

function normUrl(u) {
  return String(u || "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();
}

function slimPlaywrightForDecision(data) {
  if (!data || typeof data !== "object") {
    return data;
  }
  return {
    website_url: data.website_url,
    page_title: data.page_title,
    typography: data.typography,
    typography_full_page: data.typography_full_page,
    hero: data.hero,
  };
}

/**
 * @param {Record<string, unknown>|null} urlExtractResponse full POST /api/typography-extract-url json
 */
function aiTypographyFromUrlExtractResponse(urlExtractResponse) {
  if (!urlExtractResponse || typeof urlExtractResponse !== "object") {
    return null;
  }
  const ta = urlExtractResponse.typography_ai;
  if (ta && typeof ta === "object" && !ta.error) {
    return ta;
  }
  return null;
}

/**
 * @param {Record<string, unknown>|null} purpleSnap full POST /api/typography-extract-ai json
 */
function aiTypographyFromPurpleExtractResponse(purpleSnap) {
  if (!purpleSnap || typeof purpleSnap !== "object") {
    return null;
  }
  const ta = purpleSnap.typography_ai;
  if (ta && typeof ta === "object" && !ta.error) {
    return ta;
  }
  return null;
}

/**
 * @param {Record<string, unknown>|null} heroAi
 */
function heroAiFromPurpleExtractResponse(purpleSnap) {
  if (!purpleSnap || typeof purpleSnap !== "object") {
    return null;
  }
  const h = purpleSnap.hero_ai;
  return h && typeof h === "object" ? /** @type {Record<string, unknown>} */ (h) : null;
}

/**
 * @param {"playwright_only"|"ai_web_only"|"ai_purple_only"|"both"|"playwright+web"|"playwright+purple"|"web+purple"|"all_three"} inputMode
 */
function decisionSourceBlock(inputMode) {
  if (inputMode === "playwright_only") {
    return `You receive **one extract**: playwright_extract (browser ground truth or cached typography envelope) plus local_cache. No separate green/purple AI typography payloads.`;
  }
  if (inputMode === "ai_web_only") {
    return `You receive **one extract**: ai_typography_web (OpenAI + web_search / HTML css_signals — **not** Playwright). playwright_extract.skipped is true.`;
  }
  if (inputMode === "ai_purple_only") {
    return `You receive **one extract**: ai_typography_purple (HTML + OpenAI; optional Playwright merge in that path). playwright_extract.skipped is true.`;
  }
  if (inputMode === "all_three") {
    return `You receive **three independent typography extracts** for the same URL plus local_cache:

1) playwright_extract — browser-computed styles (or cached envelope); ground truth for px/colors when typography_full_page is present.
2) ai_typography_web — green path: OpenAI + web_search / HTML css_signals (no Playwright in that path).
3) ai_typography_purple — purple path: HTML + OpenAI (may include typography_site_estimate).

**Conflict rules:** prefer playwright_extract for px sizes and computed colors when typography_full_page exists; else prefer purple typography_site_estimate over web approximate_scale; use web search notes to fill gaps. Compare all three and state discrepancies in typography_resolution.`;
  }
  return `You receive **multiple typography extracts** (${inputMode}) for the same URL plus local_cache.

**Conflict rules:** prefer playwright_extract when typography_full_page or a rich typography envelope is present; use ai_typography_web and ai_typography_purple to fill gaps and note discrepancies. hero_playwright vs hero_ai: prefer playwright hero when found; else purple hero_ai.`;
}

/**
 * @param {{
 *   websiteUrl: string,
 *   playwrightExtract: Record<string, unknown>,
 *   aiTypographyWeb?: Record<string, unknown>|null,
 *   aiTypographyPurple?: Record<string, unknown>|null,
 *   heroPlaywright: Record<string, unknown>|null,
 *   heroAi: Record<string, unknown>|null,
 *   localCacheForPrompt: Record<string, unknown>,
 *   apiKey: string,
 *   model?: string,
 *   enableWebSearch?: boolean
 * }} o
 */
async function decideSrModulesWithLightragOpenAI(o) {
  const webSearch = resolveOpenAiWebSearchEnabled(o.enableWebSearch);
  const inputMode = o.inputMode || "both";
  const sourceBlock = decisionSourceBlock(inputMode);

  const system = `You are a HubSpot CMS + Sprocket Rocket (SR) implementer.

${sourceBlock}

Cross-check available extracts against local_cache. Cite SR module names from vector hits or graph excerpt.

${
  webSearch
    ? "You MAY use web_search to verify the live hero/layout if the extracts conflict or hero is missing."
    : ""
}

Return ONLY valid json:
{
  "plain_english_summary": string,
  "typography_resolution": {
    "preferred_source": "playwright" | "ai_web" | "ai_purple" | "blended",
    "notes": string
  },
  "sr_hero_01": {
    "fit": boolean,
    "confidence": number,
    "reason": string,
    "userMessage": string,
    "suggestedModule": "SR Hero 01",
    "fieldHints": {
      "textAlign": "LEFT" | "CENTER" | "RIGHT" | null,
      "backgroundType": "image" | "color" | "gradient" | "video" | "unknown",
      "ctaCount": number,
      "notes": string
    }
  },
  "module_plan": [
    {
      "sr_module_name": string,
      "role_on_page": string,
      "why": string,
      "confidence": number,
      "inject_order": number
    }
  ],
  "how_local_cache_was_used": string,
  "risks_or_unknowns": string[],
  "web_search_used_for_verification": boolean
}`;

  const user = JSON.stringify(
    {
      _meta: {
        response_kind: "json_object SR decision + LightRAG",
        input_mode: inputMode,
      },
      website_url: o.websiteUrl,
      playwright_extract: slimPlaywrightForDecision(o.playwrightExtract),
      ai_typography_web: o.aiTypographyWeb ?? null,
      ai_typography_purple: o.aiTypographyPurple ?? null,
      hero_playwright: o.heroPlaywright,
      hero_ai: o.heroAi,
      local_cache: o.localCacheForPrompt,
    },
    null,
    2,
  ).slice(0, 120_000);

  return openaiJsonChat({
    apiKey: o.apiKey,
    model: o.model,
    system,
    user,
    latencyProfile: "sr_hero_fit",
    enableWebSearch: webSearch,
  });
}

/**
 * @param {{
 *   projectRoot: string,
 *   websiteUrl: string,
 *   apiKey: string,
 *   model?: string,
 *   vectorK?: number,
 *   playwrightExtract: Record<string, unknown>,
 *   typographyExtractUrl?: Record<string, unknown>|null,
 *   typographyExtractAi?: Record<string, unknown>|null,
 *   aiTypography?: Record<string, unknown>|null,
 *   enableWebSearch?: boolean,
 *   includeLegacySrHeroPipeline?: boolean,
 * }} opts
 */
async function runSrDecisionLightrag(opts) {
  const websiteUrl = String(opts.websiteUrl || "").trim();
  const apiKey = opts.apiKey;
  const model = opts.model || DEFAULT_MODEL;
  const webSearch = resolveOpenAiWebSearchEnabled(opts.enableWebSearch);

  const pw = opts.playwrightExtract;
  const hasPw = Boolean(pw && typeof pw === "object" && isUsablePlaywrightExtract(pw, websiteUrl));

  let aiWeb =
    opts.aiTypography && typeof opts.aiTypography === "object" && !opts.aiTypography.error
      ? opts.aiTypography
      : null;
  if (!aiWeb && opts.typographyExtractUrl) {
    aiWeb = aiTypographyFromUrlExtractResponse(opts.typographyExtractUrl);
  }

  let aiPurple = aiTypographyFromPurpleExtractResponse(opts.typographyExtractAi || null);
  let heroAiPurple = heroAiFromPurpleExtractResponse(opts.typographyExtractAi || null);

  if (!hasPw && !aiWeb && !aiPurple) {
    return {
      ok: false,
      http_status: 400,
      error:
        "No typography for this URL. Run dark (Playwright), green (URL typography), and/or purple (HTML+AI) once, or ensure typography-extract-cache/website-typography-index.json has an entry — then retry amber. Pass force_refresh: true to ignore the index.",
    };
  }

  const inputMode = (() => {
    const n = (hasPw ? 1 : 0) + (aiWeb ? 1 : 0) + (aiPurple ? 1 : 0);
    if (n >= 3) return "all_three";
    if (hasPw && aiWeb && !aiPurple) return "playwright+web";
    if (hasPw && aiPurple && !aiWeb) return "playwright+purple";
    if (aiWeb && aiPurple && !hasPw) return "web+purple";
    if (hasPw && aiWeb) return "both";
    if (hasPw) return "playwright_only";
    if (aiWeb) return "ai_web_only";
    return "ai_purple_only";
  })();

  /** Primary bundle for LightRAG vector query + legacy pipeline */
  let aiTypography = aiWeb || aiPurple || null;

  /** @type {Record<string, unknown>|null} */
  let typographyAiPlaywright = null;
  /** @type {Record<string, unknown>|null} */
  let heroPlaywright = null;
  const pwForDecision = hasPw
    ? pw
    : {
        skipped: true,
        website_url: websiteUrl,
        reason: "no_playwright_extract_passed",
      };

  if (hasPw) {
    const pwUrl = String(
      pw.requested_website_url || pw.website_url || pw.websiteUrl || "",
    ).trim();
    if (pwUrl && !sameWebsiteUrl(pwUrl, websiteUrl)) {
      return {
        ok: false,
        http_status: 400,
        error: `playwright_extract URL (${pwUrl}) does not match website_url (${websiteUrl}). Re-run Extract typography for this URL.`,
      };
    }
    typographyAiPlaywright = buildTypographyAiFromPlaywright(pw);
    try {
      heroPlaywright = buildHeroAiFromPlaywright(pw);
    } catch {
      heroPlaywright =
        pw.hero && typeof pw.hero === "object"
          ? { found: Boolean(pw.hero.found), ...pw.hero }
          : null;
    }
    if (!aiTypography) {
      aiTypography = typographyAiPlaywright;
    } else if (typographyAiPlaywright && inputMode !== "playwright_only") {
      aiTypography = {
        ...aiTypography,
        playwright_typography_full_page:
          typographyAiPlaywright.playwright_typography_full_page ||
          typographyAiPlaywright.typography_site_estimate,
        _ditto_playwright_mirror: typographyAiPlaywright,
      };
    }
  }

  const bundle = await loadLightragLocalBundle({
    projectRoot: opts.projectRoot,
    websiteUrl,
    apiKey,
    vectorK: opts.vectorK,
    typographyAi: {
      ...(aiTypography || {}),
      ...(hasPw
        ? {
            playwright_typography_full_page:
              pw.typography_full_page ||
              pw.typography ||
              typographyAiPlaywright?.playwright_typography_full_page,
          }
        : {}),
    },
    heroAi: heroPlaywright || heroAiPurple,
    mode: "decision",
  });

  let legacyDecision = null;
  if (opts.includeLegacySrHeroPipeline !== false) {
    try {
      legacyDecision = await decideSrHero01Match({
        playwrightExtract: pwForDecision,
        aiExtract: aiTypography,
        aiHeroExtract: heroPlaywright,
        ragContext: JSON.stringify(bundle.local_cache_for_prompt).slice(0, 48_000),
        apiKey,
        model,
      });
    } catch (e) {
      legacyDecision = { error: e.message || String(e) };
    }
  }

  let combined = null;
  try {
    combined = await decideSrModulesWithLightragOpenAI({
      websiteUrl,
      playwrightExtract: pwForDecision,
      aiTypographyWeb: aiWeb,
      aiTypographyPurple: aiPurple,
      heroPlaywright,
      heroAi: heroAiPurple,
      localCacheForPrompt: bundle.local_cache_for_prompt,
      enableWebSearch: webSearch,
      apiKey,
      model,
      inputMode,
    });
  } catch (e) {
    combined = { error: e.message || String(e) };
  }

  const srFromCombined =
    combined && typeof combined === "object" && !combined.error && combined.sr_hero_01
      ? combined.sr_hero_01
      : null;

  return {
    ok: Boolean(combined && !combined.error),
    website_url: websiteUrl,
    openai_model: model,
    openai_transport: preferOpenAiResponsesApi(model) ? "responses" : "chat_completions",
    web_search_enabled: webSearch,
    inputs: {
      decision_input_mode: inputMode,
      playwright_present: hasPw,
      ai_web_present: Boolean(aiWeb),
      ai_purple_present: Boolean(aiPurple),
      playwright_page_title: hasPw ? pw.page_title || null : null,
      ai_typography_web_source: aiWeb?._ditto_source || null,
      ai_typography_purple_source: aiPurple?._ditto_source || null,
      ai_confidence: aiWeb?.confidence ?? aiPurple?.confidence ?? null,
    },
    typography_ai_playwright: typographyAiPlaywright,
    typography_ai_web: aiWeb,
    typography_ai_purple: aiPurple,
    hero_playwright: heroPlaywright,
    local_cache_meta: bundle.meta,
    local_cache_for_response: {
      cache_summary: bundle.local_cache_for_prompt.cache_summary_for_model,
      vector_hits: bundle.local_cache_for_prompt.vector_search?.hits || [],
      lightrag_data_inventory: bundle.local_cache_for_prompt.lightrag_data_inventory,
    },
    sr_hero_01_decision: srFromCombined || legacyDecision,
    sr_hero_01_legacy_pipeline: legacyDecision,
    theme_style_decision: combined,
    error: combined?.error || null,
  };
}

module.exports = {
  runSrDecisionLightrag,
  decideSrModulesWithLightragOpenAI,
  aiTypographyFromUrlExtractResponse,
  aiTypographyFromPurpleExtractResponse,
};
