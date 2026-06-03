"use strict";

/**
 * Detect font-related CSS values that rely on HubSpot/theme tokens; they do not resolve in SR staging preview.
 * @param {Record<string, unknown>|null|undefined} typography
 * @returns {boolean}
 */
function typographyHasNonPortableHubspotFontVars(typography) {
  if (!typography || typeof typography !== "object") {
    return false;
  }
  /** @type {unknown[]} */
  const stack = [typography];
  while (stack.length) {
    const cur = stack.pop();
    if (cur == null) {
      continue;
    }
    if (typeof cur === "string") {
      if (/var\s*\(\s*--/i.test(cur)) {
        return true;
      }
      continue;
    }
    if (typeof cur !== "object") {
      continue;
    }
    if (Array.isArray(cur)) {
      for (const x of cur) {
        stack.push(x);
      }
      continue;
    }
    for (const v of Object.values(cur)) {
      stack.push(v);
    }
  }
  return false;
}

/**
 * When the AI snapshot indicates weak SR mapping, missing hero, or SR fit=false, keep HubSpot SR Hero 01
 * preview defaults instead of baking uncertain extract copy, CTAs, and backgrounds.
 *
 * @param {Record<string, unknown>} snapshot typography-extract-ai or theme-inject-plan root JSON (before envelope merge)
 * @returns {{ active: boolean, reasons: string[] }}
 */
function evaluateAiSnapshotPrototypeFallback(snapshot) {
  const reasons = [];
  if (!snapshot || typeof snapshot !== "object") {
    return { active: false, reasons };
  }

  const heroAi = snapshot.hero_ai;
  if (heroAi && typeof heroAi === "object" && !heroAi.error) {
    if (heroAi.found === false) {
      reasons.push("hero_ai.found=false");
    }
    const c = heroAi.confidence;
    if (typeof c === "number" && Number.isFinite(c) && c < 0.72) {
      reasons.push(`hero_ai.confidence=${c}<0.72`);
    }
    const gaps = Array.isArray(heroAi.gaps) ? heroAi.gaps : [];
    for (const g of gaps) {
      const s = String(g || "").toLowerCase();
      if (
        /not visible|missing hero|hero section|above-the-fold|minimal excerpt|snippet only|cannot be assessed|dom is missing|does not expose|payload does not expose/i.test(
          s,
        )
      ) {
        reasons.push("hero_ai.gaps:visibility_or_coverage");
        break;
      }
    }
    const mp = heroAi.sr_hero_01_mapping_preview;
    if (mp && typeof mp === "object") {
      const mc = mp.confidence;
      if (typeof mc === "number" && Number.isFinite(mc) && mc < 0.4) {
        reasons.push(`sr_hero_01_mapping_preview.confidence=${mc}<0.4`);
      }
      if (mp.likely_maps === false) {
        if (typeof mc !== "number" || !Number.isFinite(mc) || mc < 0.55) {
          reasons.push("sr_hero_01_mapping_preview.likely_maps=false");
        }
      }
    }
  }

  const sr = snapshot.sr_hero_01;
  if (sr && typeof sr === "object" && !sr.error && sr.decision && typeof sr.decision === "object") {
    if (sr.decision.fit === false) {
      reasons.push("sr_hero_01.decision.fit=false");
    }
    const dc = sr.decision.confidence;
    if (
      sr.decision.fit !== true &&
      typeof dc === "number" &&
      Number.isFinite(dc) &&
      dc < 0.5
    ) {
      reasons.push(`sr_hero_01.decision.confidence=${dc}<0.5`);
    }
  }

  const tip = snapshot.theme_inject_plan;
  if (tip && typeof tip === "object" && Array.isArray(tip.hero_risks)) {
    const joined = tip.hero_risks.map((x) => String(x || "")).join(" ").toLowerCase();
    if (/not visible|inferr|snippet|minimal|cannot confirm|missing hero/i.test(joined)) {
      reasons.push("theme_inject_plan.hero_risks");
    }
  }

  return { active: reasons.length > 0, reasons: [...new Set(reasons)] };
}

module.exports = {
  evaluateAiSnapshotPrototypeFallback,
  typographyHasNonPortableHubspotFontVars,
};
