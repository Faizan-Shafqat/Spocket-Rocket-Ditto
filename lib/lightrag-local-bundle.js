/**
 * Loads Ditto's on-disk LightRAG artifacts under `cache/lightrag/` for AI prompts:
 * graphml excerpt, naive vector hits, SR markdown slices, and a compact inventory of
 * `.lightrag_data/kv_store_*.json` / `vdb_*.json` files (not full dumps).
 */

const fs = require("fs");
const path = require("path");
const { retrieveTopK, loadVdb } = require("./embeddings-store");

function resolveGraphmlMaxBytes() {
  const n = parseInt(String(process.env.DITTO_GRAPHML_PROMPT_MAX_BYTES || "280000"), 10);
  if (Number.isFinite(n) && n >= 20_000 && n <= 900_000) return n;
  return 280_000;
}

function resolveThemeInjectGraphmlPromptMaxBytes() {
  const n = parseInt(String(process.env.DITTO_THEME_INJECT_GRAPHML_PROMPT_MAX_BYTES || "56000"), 10);
  if (Number.isFinite(n) && n >= 4000 && n <= 250000) return n;
  return 56000;
}

function lightragDataDir(projectRoot) {
  return path.join(projectRoot, "cache", "lightrag", ".lightrag_data");
}

function loadGraphmlExcerpt(projectRoot) {
  const p = path.join(lightragDataDir(projectRoot), "graph_chunk_entity_relation.graphml");
  if (!fs.existsSync(p)) {
    return {
      ok: false,
      error: "missing_file",
      path: p,
      excerpt: "",
      file_size_bytes: 0,
      bytes_read: 0,
      approx_nodes_in_excerpt: 0,
      truncated: false,
    };
  }
  const st = fs.statSync(p);
  const maxBytes = Math.min(resolveGraphmlMaxBytes(), st.size);
  const fd = fs.openSync(p, "r");
  const buf = Buffer.allocUnsafe(maxBytes);
  fs.readSync(fd, buf, 0, maxBytes, 0);
  fs.closeSync(fd);
  const excerpt = buf.toString("utf8");
  const m = excerpt.match(/<node id="/g);
  return {
    ok: true,
    path: p,
    excerpt,
    file_size_bytes: st.size,
    bytes_read: maxBytes,
    approx_nodes_in_excerpt: m ? m.length : 0,
    truncated: st.size > maxBytes,
  };
}

function readMdSlice(projectRoot, relUnderSource, maxChars) {
  const sourceDir = path.join(projectRoot, "cache", "lightrag", "source");
  const candidates = [
    path.join(sourceDir, relUnderSource),
    path.join(sourceDir, "__enqueued__", relUnderSource),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const s = fs.readFileSync(p, "utf8");
    return { ok: true, path: p, text: s.slice(0, maxChars), truncated: s.length > maxChars };
  }
  return {
    ok: false,
    path: candidates[0],
    text: "",
    truncated: false,
    tried_paths: candidates,
  };
}

async function retrieveTopKFromProjectCache(projectRoot, query, k, apiKey) {
  const naive = await retrieveTopK({ projectRoot, query, k, apiKey });
  if (naive.ok) {
    return { ...naive, vdb_source: "cache/lightrag/.naive_data/vdb_chunks.json" };
  }
  return {
    ok: false,
    error: naive.error || "no_naive_vdb",
    vdb_source: null,
    results: [],
    hint: "Run `npm run ingest:lightrag` so cache/lightrag/.naive_data/vdb_chunks.json exists.",
  };
}

function slimVectorHit(row) {
  const ch = row.chunk || {};
  const text = String(ch.text || "").replace(/\s+/g, " ").trim();
  return {
    score: Number(row.score.toFixed(4)),
    source: ch.source,
    heading: ch.heading,
    id: ch.id,
    text_preview: text.slice(0, 700),
  };
}

/**
 * @param {string} filePath
 * @param {number} maxKeys
 */
function summarizeJsonStoreFile(filePath, maxKeys = 6) {
  if (!fs.existsSync(filePath)) {
    return { present: false, path: filePath };
  }
  const st = fs.statSync(filePath);
  let parsed = null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    parsed = JSON.parse(raw);
  } catch (e) {
    return {
      present: true,
      path: filePath,
      bytes: st.size,
      parse_error: e.message || String(e),
    };
  }
  if (Array.isArray(parsed)) {
    return {
      present: true,
      path: filePath,
      bytes: st.size,
      type: "array",
      length: parsed.length,
      sample: parsed.slice(0, 2),
    };
  }
  if (parsed && typeof parsed === "object") {
    const keys = Object.keys(parsed);
    const sample_keys = keys.slice(0, maxKeys);
    const sample_entries = {};
    for (const k of sample_keys) {
      sample_entries[k] = JSON.stringify(parsed[k]).slice(0, 240);
    }
    return {
      present: true,
      path: filePath,
      bytes: st.size,
      type: "object",
      key_count: keys.length,
      sample_keys,
      sample_entries,
    };
  }
  return { present: true, path: filePath, bytes: st.size, type: typeof parsed };
}

/**
 * Compact inventory of LightRAG working files (for the decision API prompt).
 * @param {string} projectRoot
 */
function buildLightragDataInventory(projectRoot) {
  const dir = lightragDataDir(projectRoot);
  const names = [
    "kv_store_doc_status.json",
    "kv_store_entity_chunks.json",
    "kv_store_full_docs.json",
    "kv_store_full_entities.json",
    "kv_store_full_relations.json",
    "kv_store_llm_response_cache.json",
    "kv_store_relation_chunks.json",
    "kv_store_text_chunks.json",
    "vdb_chunks.json",
    "vdb_entities.json",
    "vdb_relationships.json",
  ];
  const files = {};
  for (const name of names) {
    files[name] = summarizeJsonStoreFile(path.join(dir, name));
  }
  const readmePath = path.join(dir, "README.md");
  let readme = "";
  if (fs.existsSync(readmePath)) {
    readme = fs.readFileSync(readmePath, "utf8").slice(0, 1200);
  }
  return {
    lightrag_data_dir: dir,
    readme_excerpt: readme,
    files,
  };
}

/**
 * @param {object} lc
 */
function buildLocalCacheForOpenAiPrompt(lc) {
  const graphExcerpt = String(lc.graphml?.excerpt || "");
  const cap = resolveThemeInjectGraphmlPromptMaxBytes();
  const excerpt = graphExcerpt.slice(0, cap);
  const hits = Array.isArray(lc.vector_search?.hits) ? lc.vector_search.hits : [];
  const cs = String(lc.cheatsheet || "");
  const gl = String(lc.theme_guidelines || "");
  return {
    cache_summary_for_model: {
      vector_hit_count: hits.length,
      cheatsheet_chars: cs.length,
      theme_guidelines_chars: gl.length,
      graphml_file_bytes_on_disk: lc.graphml?.file_size_bytes ?? null,
      graphml_excerpt_chars_in_this_prompt: excerpt.length,
      graphml_excerpt_capped_for_prompt: graphExcerpt.length > cap,
      lightrag_kv_files_present: lc.lightrag_data_inventory
        ? Object.values(lc.lightrag_data_inventory.files || {}).filter((f) => f && f.present).length
        : null,
    },
    lightrag_data_inventory: lc.lightrag_data_inventory || null,
    vector_search: lc.vector_search,
    cheatsheet_excerpt: cs.slice(0, 32_000),
    theme_guidelines_excerpt: gl.slice(0, 26_000),
    cheatsheet_meta: lc.cheatsheet_meta,
    theme_guidelines_meta: lc.theme_guidelines_meta,
    graphml: {
      ok: lc.graphml?.ok,
      error: lc.graphml?.error || null,
      approx_nodes_in_excerpt: lc.graphml?.approx_nodes_in_excerpt,
      truncated_on_disk_read: lc.graphml?.truncated,
      excerpt,
    },
  };
}

function buildTypographyLightragQuery(websiteUrl, cssSignals, typographyAi) {
  const parts = [
    String(websiteUrl || "").trim(),
    cssSignals?.page_title ? String(cssSignals.page_title) : "",
    typographyAi?.primary_font_family ? String(typographyAi.primary_font_family) : "",
    typographyAi?.body_font_family ? String(typographyAi.body_font_family) : "",
    "Sprocket Rocket SR Hero 01 typography fonts HubSpot theme",
  ];
  return parts.filter(Boolean).join(" \n ");
}

function buildHeroDecisionLightragQuery(websiteUrl, typographyAi, heroAi) {
  const parts = [
    String(websiteUrl || "").trim(),
    "SR Hero 01 module fit hero background CTA alignment",
    heroAi?.layout?.textAlign ? String(heroAi.layout.textAlign) : "",
    heroAi?.background?.type ? String(heroAi.background.type) : "",
    typographyAi?.primary_font_family ? String(typographyAi.primary_font_family) : "",
  ];
  return parts.filter(Boolean).join(" \n ");
}

/**
 * @param {{
 *   projectRoot: string,
 *   websiteUrl: string,
 *   apiKey: string,
 *   vectorK?: number,
 *   cssSignals?: Record<string, unknown>|null,
 *   typographyAi?: Record<string, unknown>|null,
 *   heroAi?: Record<string, unknown>|null,
 *   mode?: "typography"|"decision"
 * }} opts
 */
async function loadLightragLocalBundle(opts) {
  const projectRoot = opts.projectRoot;
  const websiteUrl = opts.websiteUrl;
  const apiKey = opts.apiKey;
  const vectorK = Math.min(
    24,
    Math.max(4, parseInt(String(opts.vectorK || opts.vector_k || "10"), 10) || 10),
  );
  const cssSignals = opts.cssSignals && typeof opts.cssSignals === "object" ? opts.cssSignals : {};
  const typographyAi =
    opts.typographyAi && typeof opts.typographyAi === "object" ? opts.typographyAi : null;
  const heroAi = opts.heroAi && typeof opts.heroAi === "object" ? opts.heroAi : null;

  const graph = loadGraphmlExcerpt(projectRoot);
  const q =
    opts.mode === "decision"
      ? buildHeroDecisionLightragQuery(websiteUrl, typographyAi, heroAi)
      : buildTypographyLightragQuery(websiteUrl, cssSignals, typographyAi);
  const vec = await retrieveTopKFromProjectCache(projectRoot, q, vectorK, apiKey);
  const cheatsheet = readMdSlice(projectRoot, "08-sr-modules-selection-cheatsheet.md", 18_000);
  const guidelines = readMdSlice(projectRoot, "07-sr-theme-guidelines-core.md", 20_000);
  const inventory = buildLightragDataInventory(projectRoot);

  const localCache = {
    graphml: {
      ok: graph.ok,
      path: graph.path,
      file_size_bytes: graph.file_size_bytes,
      bytes_read: graph.bytes_read,
      approx_nodes_in_excerpt: graph.approx_nodes_in_excerpt,
      truncated: graph.truncated,
      error: graph.error || null,
      excerpt: graph.excerpt || "",
    },
    vector_search: {
      ok: vec.ok,
      vdb_source: vec.vdb_source || null,
      query_used: q.slice(0, 2000),
      model: vec.model,
      dim: vec.dim,
      error: vec.error || null,
      hits: (vec.results || []).map(slimVectorHit),
    },
    cheatsheet: cheatsheet.text,
    cheatsheet_meta: { ok: cheatsheet.ok, truncated: cheatsheet.truncated, path: cheatsheet.path },
    theme_guidelines: guidelines.text,
    theme_guidelines_meta: { ok: guidelines.ok, truncated: guidelines.truncated, path: guidelines.path },
    lightrag_data_inventory: inventory,
  };

  const naivePresent = Boolean(loadVdb(projectRoot)?.chunks?.length);

  return {
    local_cache_raw: localCache,
    local_cache_for_prompt: buildLocalCacheForOpenAiPrompt(localCache),
    meta: {
      graphml_path: graph.path,
      graphml_ok: graph.ok,
      vector_hits: (vec.results || []).length,
      naive_vdb_present: naivePresent,
      vdb_source: vec.vdb_source || null,
      vector_error: vec.error || null,
      query_used: q.slice(0, 2000),
      cheatsheet_chars: (cheatsheet.text || "").length,
      guidelines_chars: (guidelines.text || "").length,
      lightrag_data_dir: inventory.lightrag_data_dir,
    },
  };
}

module.exports = {
  loadLightragLocalBundle,
  buildLocalCacheForOpenAiPrompt,
  loadGraphmlExcerpt,
  buildLightragDataInventory,
  buildTypographyLightragQuery,
  buildHeroDecisionLightragQuery,
};
