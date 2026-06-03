/**
 * Lightweight local "vector DB" over `cache/lightrag/source/*.md`, using OpenAI embeddings
 * (default `text-embedding-3-large`, 3072 dims). Writes `cache/lightrag/.lightrag_data/`
 * artifacts in a LightRAG-ish layout so it can be swapped out for the real LightRAG later.
 *
 * Files written:
 *   .lightrag_data/vdb_chunks.json       — {model, dim, created_at, chunks:[{id, source, heading, text, hash, embedding}]}
 *   .lightrag_data/kv_store_doc_status.json — per-source-file hashes (skip unchanged on re-ingest)
 *   .lightrag_data/.lightrag_ingest_meta.json — last run stats
 *
 * Env: OPENAI_API_KEY (required), OPENAI_EMBEDDING_MODEL (optional, default text-embedding-3-large)
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { fetchOpenAi, describeNetworkError } = require("./openai-http");

const DEFAULT_EMBED_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-large";
const OPENAI_EMBED_URL = "https://api.openai.com/v1/embeddings";

const EMBED_BATCH = 64;
const TARGET_CHARS = 1800;
const OVERLAP_CHARS = 200;

function paths(projectRoot) {
  const root = path.join(projectRoot, "cache", "lightrag");
  // Naive (Ditto-owned) store lives in `.naive_data/` so it never collides with
  // the real LightRAG (Python) store at `.lightrag_data/`.
  return {
    sourceDir: path.join(root, "source"),
    dataDir: path.join(root, ".naive_data"),
    vdb: path.join(root, ".naive_data", "vdb_chunks.json"),
    docStatus: path.join(root, ".naive_data", "kv_store_doc_status.json"),
    meta: path.join(root, ".naive_data", ".lightrag_ingest_meta.json"),
  };
}

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function readJsonSafe(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Split markdown into chunks. Strategy:
 *  - Split first on top-level `\n## ` boundaries (heading-aware).
 *  - Then any chunk over TARGET_CHARS is window-split with OVERLAP_CHARS overlap.
 *
 * @param {string} text
 * @param {string} sourceFile  filename only, e.g. "08-sr-modules-selection-cheatsheet.md"
 * @returns {Array<{id: string, source: string, heading: string, text: string}>}
 */
function chunkMarkdown(text, sourceFile) {
  const normalized = text.replace(/\r\n/g, "\n");
  const sections = [];
  const headingRe = /^##\s+(.+)$/gm;
  let lastIdx = 0;
  let lastHeading = sourceFile.replace(/\.md$/i, "");
  let m;
  while ((m = headingRe.exec(normalized)) !== null) {
    if (m.index > lastIdx) {
      sections.push({
        heading: lastHeading,
        text: normalized.slice(lastIdx, m.index).trim(),
      });
    }
    lastHeading = m[1].trim();
    lastIdx = m.index;
  }
  if (lastIdx < normalized.length) {
    sections.push({ heading: lastHeading, text: normalized.slice(lastIdx).trim() });
  }
  if (sections.length === 0) {
    sections.push({ heading: lastHeading, text: normalized.trim() });
  }

  const out = [];
  let chunkIdx = 0;
  for (const sec of sections) {
    if (!sec.text) continue;
    if (sec.text.length <= TARGET_CHARS) {
      out.push({
        id: `${sourceFile}::chunk-${chunkIdx++}`,
        source: sourceFile,
        heading: sec.heading,
        text: sec.text,
      });
    } else {
      let start = 0;
      while (start < sec.text.length) {
        const end = Math.min(start + TARGET_CHARS, sec.text.length);
        out.push({
          id: `${sourceFile}::chunk-${chunkIdx++}`,
          source: sourceFile,
          heading: sec.heading,
          text: sec.text.slice(start, end),
        });
        if (end >= sec.text.length) break;
        start = end - OVERLAP_CHARS;
      }
    }
  }
  return out;
}

/**
 * Batched OpenAI embeddings call.
 * @param {string[]} inputs
 * @param {{ apiKey: string, model?: string }} o
 * @returns {Promise<{ embeddings: number[][], dim: number }>}
 */
async function embedTexts(inputs, o) {
  if (!o.apiKey) throw new Error("OPENAI_API_KEY missing for embeddings");
  const model = o.model || DEFAULT_EMBED_MODEL;
  const all = [];
  let dim = 0;
  for (let i = 0; i < inputs.length; i += EMBED_BATCH) {
    const batch = inputs.slice(i, i + EMBED_BATCH);
    let res;
    try {
      res = await fetchOpenAi(
        OPENAI_EMBED_URL,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${o.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, input: batch }),
        },
        Number(process.env.OPENAI_EMBEDDING_TIMEOUT_MS) || 120_000,
      );
    } catch (e) {
      const detail = e instanceof Error ? e.message : describeNetworkError(e);
      throw new Error(
        `OpenAI embeddings (${model}) unreachable: ${detail}. Chat may still work; vector search needs embeddings. Check OPENAI_API_KEY, VPN/firewall, and HTTPS_PROXY.`,
      );
    }
    let text;
    try {
      text = await res.text();
    } catch (e) {
      throw new Error(`OpenAI embeddings body read failed: ${describeNetworkError(e)}`);
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `OpenAI embeddings non-JSON (HTTP ${res.status}): ${text.slice(0, 400)}`,
      );
    }
    if (!res.ok) {
      throw new Error(
        data.error?.message ||
          `OpenAI embeddings HTTP ${res.status}: ${text.slice(0, 300)}`,
      );
    }
    if (!Array.isArray(data.data)) {
      throw new Error("OpenAI embeddings response missing data[]");
    }
    data.data.sort((a, b) => a.index - b.index);
    for (const row of data.data) {
      if (!Array.isArray(row.embedding)) throw new Error("missing embedding[]");
      if (!dim) dim = row.embedding.length;
      all.push(row.embedding);
    }
  }
  return { embeddings: all, dim };
}

function cosineSim(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Walk source/, chunk, embed only new/changed chunks (by sha256), write artifacts.
 *
 * @param {{ projectRoot: string, apiKey: string, model?: string, log?: (m:string)=>void, force?: boolean }} opts
 */
async function ingestSourceDir(opts) {
  const log = opts.log || (() => {});
  const p = paths(opts.projectRoot);
  if (!fs.existsSync(p.sourceDir)) {
    throw new Error(`source dir not found: ${p.sourceDir}`);
  }
  ensureDir(p.dataDir);
  const model = opts.model || DEFAULT_EMBED_MODEL;

  const files = fs
    .readdirSync(p.sourceDir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();

  const newChunks = [];
  const docStatus = {};
  for (const f of files) {
    const full = path.join(p.sourceDir, f);
    const text = fs.readFileSync(full, "utf8");
    const fileHash = sha256(text);
    docStatus[f] = { hash: fileHash, bytes: text.length };
    const chunks = chunkMarkdown(text, f);
    for (const c of chunks) {
      c.hash = sha256(`${model}::${c.id}::${c.text}`);
      newChunks.push(c);
    }
  }
  log(`[ingest] ${files.length} source files → ${newChunks.length} chunks`);

  const prevVdb = opts.force ? null : readJsonSafe(p.vdb);
  const prevByHash = new Map();
  if (prevVdb && prevVdb.model === model && Array.isArray(prevVdb.chunks)) {
    for (const c of prevVdb.chunks) {
      if (c.hash) prevByHash.set(c.hash, c);
    }
  }

  const toEmbed = [];
  const reused = [];
  for (const c of newChunks) {
    const hit = prevByHash.get(c.hash);
    if (hit && Array.isArray(hit.embedding)) {
      reused.push({ ...c, embedding: hit.embedding });
    } else {
      toEmbed.push(c);
    }
  }
  log(`[ingest] reuse ${reused.length}, embed new ${toEmbed.length}`);

  let dim = prevVdb && prevVdb.dim ? prevVdb.dim : 0;
  if (toEmbed.length > 0) {
    const { embeddings, dim: d } = await embedTexts(
      toEmbed.map((c) => `${c.source} — ${c.heading}\n\n${c.text}`),
      { apiKey: opts.apiKey, model },
    );
    dim = d || dim;
    toEmbed.forEach((c, i) => {
      c.embedding = embeddings[i];
    });
  }

  const allChunks = [...reused, ...toEmbed];
  allChunks.sort((a, b) => a.id.localeCompare(b.id));

  const vdb = {
    model,
    dim,
    chunk_count: allChunks.length,
    created_at: new Date().toISOString(),
    chunks: allChunks,
  };
  fs.writeFileSync(p.vdb, JSON.stringify(vdb));
  fs.writeFileSync(p.docStatus, JSON.stringify(docStatus, null, 2));
  fs.writeFileSync(
    p.meta,
    JSON.stringify(
      {
        last_run_at: new Date().toISOString(),
        model,
        dim,
        files: files.length,
        chunks: allChunks.length,
        embedded_now: toEmbed.length,
        reused: reused.length,
      },
      null,
      2,
    ),
  );

  return {
    ok: true,
    model,
    dim,
    files: files.length,
    chunks: allChunks.length,
    embedded_now: toEmbed.length,
    reused: reused.length,
    paths: { vdb: p.vdb, docStatus: p.docStatus, meta: p.meta },
  };
}

/**
 * Load VDB JSON if present.
 * @param {string} projectRoot
 */
function loadVdb(projectRoot) {
  const p = paths(projectRoot);
  return readJsonSafe(p.vdb);
}

/**
 * Embed query and return top-K chunks by cosine similarity.
 *
 * @param {{ projectRoot: string, query: string, k?: number, apiKey: string, model?: string }} opts
 * @returns {Promise<{ ok: boolean, model?: string, dim?: number, results?: Array<{score:number, chunk:any}>, error?: string }>}
 */
async function retrieveTopK(opts) {
  const vdb = loadVdb(opts.projectRoot);
  if (!vdb || !Array.isArray(vdb.chunks) || vdb.chunks.length === 0) {
    return {
      ok: false,
      error: "VDB not found — run `npm run ingest:lightrag` first.",
    };
  }
  const model = vdb.model || opts.model || DEFAULT_EMBED_MODEL;
  let embeddings;
  try {
    ({ embeddings } = await embedTexts([opts.query], {
      apiKey: opts.apiKey,
      model,
    }));
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : describeNetworkError(e),
    };
  }
  const qv = embeddings[0];
  const scored = vdb.chunks.map((c) => ({
    score: cosineSim(qv, c.embedding),
    chunk: c,
  }));
  scored.sort((a, b) => b.score - a.score);
  return {
    ok: true,
    model,
    dim: vdb.dim,
    results: scored.slice(0, opts.k || 6),
  };
}

module.exports = {
  paths,
  chunkMarkdown,
  embedTexts,
  cosineSim,
  ingestSourceDir,
  loadVdb,
  retrieveTopK,
  DEFAULT_EMBED_MODEL,
};
