/**
 * Shared OpenAI HTTPS fetch (timeouts, keep-alive agent, readable network errors).
 */

const https = require("https");

const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

let openAiHttpsAgent = null;

function resolveOpenAiRequestTimeoutMs(overrideMs) {
  if (overrideMs != null && Number.isFinite(Number(overrideMs))) {
    const n = Math.floor(Number(overrideMs));
    return n <= 0 ? 0 : Math.min(n, 900_000);
  }
  const raw = process.env.OPENAI_REQUEST_TIMEOUT_MS;
  if (raw !== undefined && String(raw).trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      return n <= 0 ? 0 : Math.min(Math.floor(n), 900_000);
    }
  }
  return 120_000;
}

function getOpenAiHttpsAgent() {
  if (!openAiHttpsAgent) {
    const socketMs = resolveOpenAiRequestTimeoutMs();
    openAiHttpsAgent = new https.Agent({
      keepAlive: true,
      timeout: socketMs > 0 ? socketMs : 120_000,
    });
  }
  return openAiHttpsAgent;
}

/**
 * @param {unknown} err
 */
function describeNetworkError(err) {
  if (err == null) return "unknown error";
  const bits = [];
  const seen = new Set();
  function add(s) {
    if (!s || seen.has(s)) return;
    seen.add(s);
    bits.push(s);
  }
  function walk(e, depth) {
    if (!e || depth > 8) return;
    if (typeof e === "string") {
      add(e);
      return;
    }
    if (e instanceof Error) {
      const msg = String(e.message || "").trim();
      if (msg && !/^request to .+ failed, reason:\s*$/i.test(msg)) {
        add(msg);
      }
      if (e.name && e.name !== "Error") add(`[${e.name}]`);
    }
    const any = /** @type {any} */ (e);
    if (any.code) add(`code=${any.code}`);
    if (any.errno != null) add(`errno=${any.errno}`);
    if (any.syscall) add(`syscall=${any.syscall}`);
    if (any.hostname) add(`host=${any.hostname}`);
    if (any.address) add(`address=${any.address}`);
    if (any.port != null) add(`port=${any.port}`);
    if (e instanceof AggregateError && Array.isArray(e.errors)) {
      e.errors.forEach((sub) => walk(sub, depth + 1));
    }
    if (any.cause) walk(any.cause, depth + 1);
  }
  walk(err, 0);
  if (!bits.length) {
    const msg = err instanceof Error ? String(err.message || "").trim() : String(err);
    if (msg) return msg;
    return "network error (no detail from client — check VPN/firewall/DNS to api.openai.com)";
  }
  return bits.join(" | ");
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} init
 * @param {number} [timeoutMs]
 */
async function fetchOpenAi(url, init, timeoutMs) {
  const ms = timeoutMs ?? resolveOpenAiRequestTimeoutMs();
  const isHttps = /^https:/i.test(url);
  /** @type {Record<string, unknown>} */
  const opts = {
    ...init,
    ...(isHttps ? { agent: getOpenAiHttpsAgent() } : {}),
  };
  if (ms <= 0) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      throw new Error(`OpenAI request failed: ${describeNetworkError(e)}`);
    }
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } catch (e) {
    throw new Error(`OpenAI request failed: ${describeNetworkError(e)}`);
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  fetchOpenAi,
  describeNetworkError,
  resolveOpenAiRequestTimeoutMs,
};
