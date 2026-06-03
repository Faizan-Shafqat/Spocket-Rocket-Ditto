#!/usr/bin/env node
/**
 * Walks `sr-2026/custom-modules/*.module/` and writes one focused markdown per module
 * into `cache/lightrag/source/modules/<slug>.md` so LightRAG can build a knowledge graph
 * of every SR module's CAPABILITIES (not implementation details).
 *
 * Each output md is small and high-signal:
 *   - Module label + slug + ID + doc URL + host templates
 *   - Inferred category (Hero, Cards, Hero Form, Footer, Nav, etc.)
 *   - Top-level groups
 *   - Flat field list with type, label, repeater max, and visibility predicate
 *   - Notable defaults (background type, layout hints)
 *
 * Run:  node scripts/distill-sr-modules.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "sr-2026", "custom-modules");
// Flat layout — LightRAG's scan is non-recursive (only picks up the top level
// of INPUT_DIR). Re-runs are safe: LightRAG dedupes by content hash, so
// unchanged distillations don't re-trigger LLM extraction.
const OUT = path.join(ROOT, "cache", "lightrag", "source");

if (!fs.existsSync(SRC)) {
  console.error(`Source folder missing: ${SRC}`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

function slugify(label) {
  return String(label)
    .toLowerCase()
    .replace(/\.module$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferCategory(label) {
  const l = label.toLowerCase();
  if (/\bhero\b.*\bform\b/.test(l)) return "Hero (form variant)";
  if (/\bhero\b.*\bcard\b/.test(l)) return "Hero (card variant)";
  if (/\bhero\b.*\bvideo\b/.test(l)) return "Hero (video bg)";
  if (/\bhero\b.*\bparallax\b/.test(l)) return "Hero (parallax)";
  if (/\bhero\b.*\btwo\s*col\b/.test(l)) return "Hero (two column)";
  if (/\bhero\b.*\b(404|500)\b/.test(l)) return "Hero (error page)";
  if (/\bhero\b/.test(l)) return "Hero";
  if (/\bnavigation\b|\bnav\b/.test(l)) return "Navigation";
  if (/\bfooter\b/.test(l)) return "Footer";
  if (/\bcards?\b.*\btestimonial\b/.test(l)) return "Cards (testimonials)";
  if (/\bcards?\b.*\bpricing\b/.test(l)) return "Cards (pricing)";
  if (/\bcards?\b.*\barticle\b/.test(l)) return "Cards (articles)";
  if (/\bcards?\b.*\bfeature\b/.test(l)) return "Cards (features)";
  if (/\bcards?\b/.test(l)) return "Cards";
  if (/\bbento\b/.test(l)) return "Bento";
  if (/\bpricing\b/.test(l)) return "Pricing";
  if (/\bstats\b/.test(l)) return "Stats";
  if (/\bclients\b|\blogos\b/.test(l)) return "Clients / logos";
  if (/\btestimonial\b/.test(l)) return "Testimonials";
  if (/\bgallery\b/.test(l)) return "Gallery";
  if (/\btabs?\b|\baccordion\b/.test(l)) return "Tabs / accordion";
  if (/\bfaq\b/.test(l)) return "FAQ";
  if (/\bblog\b/.test(l)) return "Blog";
  if (/\bevents?\b/.test(l)) return "Events";
  if (/\blocations?\b/.test(l)) return "Locations";
  if (/\bmodal\b|\bnotification\b|\boff\s*canvas\b/.test(l)) return "Overlay (modal/notification/off-canvas)";
  if (/\bform\b/.test(l)) return "Form";
  if (/\b(one|two|three|four|five)\s*col\b/.test(l)) return "Multi-column section";
  if (/\bbling\b|\banimation\b/.test(l)) return "Decorative / animation";
  if (/\bhtml\b|\bembed\b/.test(l)) return "Raw embed (last resort)";
  if (/\boffer\b/.test(l)) return "Offer";
  return "Other";
}

function extractDocUrl(meta) {
  const t = String(meta.inline_help_text || "");
  const m = t.match(/href=['"]?(https?:\/\/docs\.sprocketrocket\.co[^'" >]+)/i);
  return m ? m[1] : null;
}

function fieldTypeLabel(f) {
  const base = f.type || "unknown";
  if (f.picker) return `${base}/${f.picker}`;
  return base;
}

function visibilityPredicate(f) {
  if (f.visibility && f.visibility.controlling_field_path) {
    const op = f.visibility.operator || "EQUAL";
    return `${f.visibility.controlling_field_path} ${op} ${f.visibility.controlling_value_regex}`;
  }
  if (f.visibility && f.visibility.controlling_field) {
    const op = f.visibility.operator || "EQUAL";
    return `${f.visibility.controlling_field} ${op} ${f.visibility.controlling_value_regex}`;
  }
  if (f.visibility_rules === "ADVANCED" && f.advanced_visibility) {
    const c = (f.advanced_visibility.criteria || [])
      .map((x) => `${x.controlling_field_path || x.controlling_field} ${x.operator || "EQUAL"} ${x.controlling_value_regex}`)
      .join(` ${f.advanced_visibility.boolean_operator || "AND"} `);
    return c || null;
  }
  return null;
}

function repeaterInfo(f) {
  const o = f.occurrence;
  if (!o) return null;
  if ((o.max && o.max !== 1) || (o.default && o.default > 1)) {
    return `repeater(default=${o.default ?? "?"}, max=${o.max ?? "∞"})`;
  }
  return null;
}

function shortHelp(f) {
  const t = String(f.help_text || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  return t.length > 140 ? t.slice(0, 137) + "…" : t;
}

function defaultHint(f) {
  if (f.id === "background_option" || f.name === "background_option") {
    if (typeof f.default === "string") return `default background: ${f.default}`;
  }
  if (/^text_align/.test(f.id || "") && typeof f.default === "string") {
    return `default align: ${f.default}`;
  }
  return null;
}

function walkFields(fields, out, depth = 0) {
  for (const f of fields) {
    if (!f || !f.id) continue;
    // HubSpot fields.json stores fully-qualified ids on nested children, so we
    // use f.id directly instead of prefix-joining (which would double-stack).
    const fpath = f.id;
    if (f.type === "group" && Array.isArray(f.children) && f.children.length) {
      const rep = repeaterInfo(f);
      const vis = visibilityPredicate(f);
      const tag = [
        rep ? rep : null,
        vis ? `when ${vis}` : null,
      ]
        .filter(Boolean)
        .join(" ; ");
      out.groups.push(`${"  ".repeat(depth)}- **${fpath}** (group${tag ? ` — ${tag}` : ""}) — ${f.label || ""}`);
      walkFields(f.children, out, depth + 1);
      continue;
    }
    const parts = [
      `\`${fpath}\``,
      `(${fieldTypeLabel(f)})`,
      f.label ? `— ${f.label}` : "",
    ];
    const vis = visibilityPredicate(f);
    if (vis) parts.push(`[when ${vis}]`);
    const rep = repeaterInfo(f);
    if (rep) parts.push(`[${rep}]`);
    if (f.required) parts.push("[required]");
    const help = shortHelp(f);
    if (help) parts.push(`— _${help}_`);
    out.flat.push(`- ${parts.join(" ")}`);
    const hint = defaultHint(f);
    if (hint) out.hints.push(`- ${fpath}: ${hint}`);
  }
}

function distillModule(modDir) {
  const meta = JSON.parse(fs.readFileSync(path.join(modDir, "meta.json"), "utf8"));
  const fields = JSON.parse(fs.readFileSync(path.join(modDir, "fields.json"), "utf8"));
  const label = meta.label || path.basename(modDir).replace(/\.module$/i, "");
  const slug = slugify(label);
  const cat = inferCategory(label);
  const docUrl = extractDocUrl(meta);
  const out = { groups: [], flat: [], hints: [] };
  walkFields(Array.isArray(fields) ? fields : [], out, 0);

  const lines = [];
  lines.push(`# ${label}`);
  lines.push("");
  lines.push(`**Slug:** \`${slug}\``);
  if (meta.module_id) lines.push(`**HubSpot module ID:** ${meta.module_id}`);
  lines.push(`**Inferred category:** ${cat}`);
  if (docUrl) lines.push(`**Documentation:** ${docUrl}`);
  if (Array.isArray(meta.host_template_types) && meta.host_template_types.length)
    lines.push(`**Host templates:** ${meta.host_template_types.join(", ")}`);
  if (Array.isArray(meta.content_types) && meta.content_types.length)
    lines.push(`**Content types:** ${meta.content_types.join(", ")}`);
  lines.push(`**Available for new content:** ${meta.is_available_for_new_content ? "yes" : "no"}`);
  if (meta.smart_type) lines.push(`**Smart type:** ${meta.smart_type}`);
  lines.push("");
  lines.push(`**Module path:** \`sr-2026/custom-modules/${path.basename(modDir)}\``);
  lines.push("");

  if (out.hints.length) {
    lines.push("## Notable defaults");
    lines.push(...out.hints);
    lines.push("");
  }

  if (out.groups.length) {
    lines.push("## Top-level groups");
    lines.push(...out.groups);
    lines.push("");
  }

  if (out.flat.length) {
    lines.push("## Fields");
    lines.push(...out.flat);
    lines.push("");
  }

  return { slug, label, cat, content: lines.join("\n") };
}

function writeIndex(rows) {
  const byCat = new Map();
  for (const r of rows) {
    if (!byCat.has(r.cat)) byCat.set(r.cat, []);
    byCat.get(r.cat).push(r);
  }
  const lines = [];
  lines.push("# SR 2026 — module index (auto-generated by scripts/distill-sr-modules.js)");
  lines.push("");
  lines.push(`**Total modules:** ${rows.length}`);
  lines.push("");
  for (const [cat, list] of [...byCat.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${cat} (${list.length})`);
    for (const r of list.sort((a, b) => a.label.localeCompare(b.label))) {
      lines.push(`- **${r.label}** — \`${r.slug}\``);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const dirs = fs
    .readdirSync(SRC, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /\.module$/i.test(e.name))
    .map((e) => path.join(SRC, e.name))
    .sort();

  console.log(`[distill] discovering ${dirs.length} modules under ${SRC}`);
  const rows = [];
  let written = 0;
  let skipped = 0;
  for (const d of dirs) {
    try {
      const r = distillModule(d);
      const file = path.join(OUT, `${r.slug}.md`);
      fs.writeFileSync(file, r.content);
      rows.push(r);
      written++;
    } catch (e) {
      skipped++;
      console.warn(`[distill] SKIP ${path.basename(d)}: ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(OUT, "_index.md"), writeIndex(rows));
  console.log(`[distill] wrote ${written} module md(s) + _index.md to ${OUT}`);
  if (skipped) console.log(`[distill] skipped ${skipped}`);
}

main();
