#!/usr/bin/env node
/**
 * Converts LightRAG `graph_chunk_entity_relation.graphml` from this repo's cache
 * into `lightrag-d3-kit/lightrag-d3-kit/data.json` for the D3 visualizer.
 *
 * Usage:
 *   node scripts/graphml-to-d3-graph.cjs
 *   node scripts/graphml-to-d3-graph.cjs --max-nodes 800
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_GRAPHML = path.join(
  ROOT,
  "cache",
  "lightrag",
  ".lightrag_data",
  "graph_chunk_entity_relation.graphml",
);
const OUT_JSON = path.join(ROOT, "lightrag-d3-kit", "lightrag-d3-kit", "data.json");

function parseArgs() {
  const a = { maxNodes: 0 };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--max-nodes" && process.argv[i + 1]) {
      a.maxNodes = parseInt(process.argv[++i], 10) || 0;
    }
  }
  return a;
}

function extractData(block, key) {
  const m = block.match(new RegExp(`<data key="${key}">([\\s\\S]*?)</data>`));
  if (!m) {
    return "";
  }
  return m[1].trim().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function mapEntityTypeToGroup(entityType) {
  const g = String(entityType || "").toLowerCase().trim();
  if (g === "person") {
    return "person";
  }
  if (g === "organization" || g === "organisation") {
    return "organization";
  }
  if (g === "event") {
    return "event";
  }
  if (g === "concept" || g === "method" || g === "guideline" || g === "standard" || g === "technology") {
    return "concept";
  }
  if (
    g === "document" ||
    g === "content" ||
    g === "tool" ||
    g === "artifact" ||
    g === "product" ||
    g === "data" ||
    g === "location"
  ) {
    return "artifact";
  }
  return "concept";
}

function main() {
  const { maxNodes } = parseArgs();
  if (!fs.existsSync(DEFAULT_GRAPHML)) {
    console.error("Missing:", DEFAULT_GRAPHML);
    console.error("Run LightRAG ingest on cache/lightrag/source first.");
    process.exit(1);
  }
  const xml = fs.readFileSync(DEFAULT_GRAPHML, "utf8");

  const rawNodes = [];
  const parts = xml.split("<node id=\"");
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const q = p.indexOf('"');
    if (q < 0) {
      continue;
    }
    const id = p.slice(0, q);
    const rest = p.slice(q + 2);
    const end = rest.indexOf("</node>");
    if (end < 0) {
      continue;
    }
    const inner = rest.slice(0, end);
    const entityType = extractData(inner, "d1");
    const desc = extractData(inner, "d2").replace(/<SEP>/g, "\n\n");
    const created = parseInt(extractData(inner, "d5"), 10) || 0;
    rawNodes.push({ id, entityType, desc, created });
  }

  const links = [];
  const edgeRe = /<edge source="([^"]+)" target="([^"]+)">([\s\S]*?)<\/edge>/g;
  let em;
  while ((em = edgeRe.exec(xml)) !== null) {
    const inner = em[3];
    const w = parseFloat(extractData(inner, "d7")) || 1;
    const desc = extractData(inner, "d8");
    const keywords = extractData(inner, "d9");
    links.push({
      source: em[1],
      target: em[2],
      weight: w,
      desc: desc.slice(0, 500),
      keywords,
    });
  }

  const degree = new Map();
  for (const l of links) {
    degree.set(l.source, (degree.get(l.source) || 0) + 1);
    degree.set(l.target, (degree.get(l.target) || 0) + 1);
  }

  let nodes = rawNodes.map((n) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const ageHours = n.created ? Math.max(0, (nowSec - n.created) / 3600) : 0;
    const descShort = n.desc.slice(0, 900);
    return {
      id: n.id,
      group: mapEntityTypeToGroup(n.entityType),
      degree: degree.get(n.id) || 0,
      desc: descShort,
      ageHours: Math.round(ageHours * 10) / 10,
      isNew: ageHours < 24,
      isRecent: ageHours < 168,
    };
  });

  nodes.sort((a, b) => b.degree - a.degree);
  if (maxNodes > 0 && nodes.length > maxNodes) {
    const keep = new Set(nodes.slice(0, maxNodes).map((n) => n.id));
    nodes = nodes.filter((n) => keep.has(n.id));
    const filteredLinks = links.filter((l) => keep.has(l.source) && keep.has(l.target));
    links.length = 0;
    links.push(...filteredLinks);
  }

  const out = { nodes, links };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out), "utf8");
  console.log("Wrote", OUT_JSON, "nodes=", nodes.length, "links=", links.length);
}

main();
