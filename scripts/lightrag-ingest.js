#!/usr/bin/env node
/**
 * CLI: chunk + embed `cache/lightrag/source/*.md` with OpenAI embeddings,
 * write `cache/lightrag/.lightrag_data/vdb_chunks.json` (and friends).
 *
 * Usage:
 *   npm run ingest:lightrag
 *   node scripts/lightrag-ingest.js --force
 *   node scripts/lightrag-ingest.js --model text-embedding-3-small
 */

require("dotenv").config();
const path = require("path");
const { ingestSourceDir, DEFAULT_EMBED_MODEL } = require("../lib/embeddings-store");

function parseArgs(argv) {
  const args = { force: false, model: undefined };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") args.force = true;
    else if (a === "--model" && argv[i + 1]) {
      args.model = argv[++i];
    } else if (a.startsWith("--model=")) {
      args.model = a.slice("--model=".length);
    }
  }
  return args;
}

(async function main() {
  const args = parseArgs(process.argv);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY missing in .env");
    process.exit(1);
  }
  const model = args.model || process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBED_MODEL;
  const projectRoot = path.resolve(__dirname, "..");
  console.log(`[ingest] root=${projectRoot}`);
  console.log(`[ingest] model=${model} force=${args.force}`);
  try {
    const r = await ingestSourceDir({
      projectRoot,
      apiKey,
      model,
      force: args.force,
      log: (m) => console.log(m),
    });
    console.log("[ingest] DONE", JSON.stringify(r, null, 2));
  } catch (e) {
    console.error("[ingest] FAILED:", e.message || e);
    process.exit(2);
  }
})();
