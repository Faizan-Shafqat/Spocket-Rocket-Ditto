/**
 * Thin HTTP client for the (real) LightRAG server.
 *
 * Default URL: http://127.0.0.1:9621 (set in .env.lightrag).
 * Override via LIGHTRAG_SERVER_URL or LIGHTRAG_API_KEY in `.env`.
 *
 * If the server isn't running we return { ok: false, ... } so callers can
 * gracefully fall back to naive top-K retrieval.
 */

const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const DEFAULT_URL = process.env.LIGHTRAG_SERVER_URL || "http://127.0.0.1:9621";
const API_KEY = process.env.LIGHTRAG_API_KEY || "";
const HEALTH_TIMEOUT_MS = 1500;
const QUERY_TIMEOUT_MS = 60_000;

function authHeaders() {
  return API_KEY ? { "X-API-Key": API_KEY } : {};
}

function withTimeout(ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, cancel: () => clearTimeout(t) };
}

/**
 * Lightweight health check (returns quickly even when server is down).
 */
async function isAlive(baseUrl = DEFAULT_URL) {
  const t = withTimeout(HEALTH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/health`, {
      headers: authHeaders(),
      signal: t.signal,
    });
    if (!res.ok) return { ok: false, status: res.status };
    let info = null;
    try {
      info = await res.json();
    } catch {
      info = null;
    }
    return { ok: true, status: res.status, info };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    t.cancel();
  }
}

/**
 * Calls LightRAG's /query.
 *
 * @param {{
 *   query: string,
 *   mode?: "naive"|"local"|"global"|"hybrid"|"mix",
 *   top_k?: number,
 *   only_need_context?: boolean,
 *   response_type?: string,
 *   baseUrl?: string,
 * }} opts
 *
 * `only_need_context: true` makes LightRAG return retrieved context (chunks +
 * entities + relations) WITHOUT a generated answer — perfect for feeding into
 * our existing decideSrHero01Match LLM call.
 */
async function query(opts) {
  const baseUrl = opts.baseUrl || DEFAULT_URL;
  const body = {
    query: opts.query,
    mode: opts.mode || "hybrid",
    only_need_context: opts.only_need_context !== false,
  };
  if (typeof opts.top_k === "number") body.top_k = opts.top_k;
  if (opts.response_type) body.response_type = opts.response_type;

  const t = withTimeout(QUERY_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
      signal: t.signal,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return {
        ok: false,
        status: res.status,
        error: `LightRAG non-JSON response: ${text.slice(0, 300)}`,
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data?.detail || data?.message || `LightRAG HTTP ${res.status}`,
      };
    }
    return { ok: true, status: res.status, data };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  } finally {
    t.cancel();
  }
}

/**
 * Best-effort string extraction. LightRAG's /query response shape varies by
 * version; we accept several known fields and fall back to JSON-stringify.
 */
function extractContextString(queryResponseData) {
  if (!queryResponseData) return "";
  if (typeof queryResponseData === "string") return queryResponseData;
  if (typeof queryResponseData.response === "string") return queryResponseData.response;
  if (typeof queryResponseData.context === "string") return queryResponseData.context;
  if (typeof queryResponseData.data === "string") return queryResponseData.data;
  if (queryResponseData.data && typeof queryResponseData.data === "object") {
    return JSON.stringify(queryResponseData.data);
  }
  return JSON.stringify(queryResponseData);
}

module.exports = {
  isAlive,
  query,
  extractContextString,
  DEFAULT_URL,
};
