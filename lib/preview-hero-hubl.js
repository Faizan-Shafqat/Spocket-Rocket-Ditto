/**
 * HubL helpers for SR Hero preview templates (DnD module_attribute defaults).
 */

/**
 * Leading whitespace on the line that contains `needle` (not text before needle on that line).
 *
 * @param {string} html
 * @param {number} needleIndex index of substring within html
 * @returns {string}
 */
function lineIndentAtIndex(html, needleIndex) {
  const lineStart = html.lastIndexOf("\n", needleIndex) + 1;
  const lineEnd = html.indexOf("\n", needleIndex);
  const line = html.slice(lineStart, lineEnd === -1 ? html.length : lineEnd);
  const m = line.match(/^\s*/);
  return m ? m[0] : "";
}

/**
 * HubL default for color fields: `hero_*_custom|default('{"color":"#hex","opacity":100}')`
 *
 * @param {string} queryKey e.g. hero_text_color_custom
 * @param {string} hex e.g. #ffffff
 * @param {number} [opacity]
 * @returns {string}
 */
function hubLColorCustomDefault(queryKey, hex, opacity = 100) {
  const safeHex = String(hex || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const inner = `{"color":"${safeHex}","opacity":${opacity}}`;
  const esc = inner.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return `{{ request.query_dict.${queryKey}|default('${esc}') }}`;
}

/**
 * Fix broken `text_color_custom` lines produced by slicing indent through `hero_text_color`.
 *
 * @param {string} html
 * @returns {string}
 */
function repairMalformedPreviewHeroHubL(html) {
  return html.replace(
    /\{\{\s*request\.query_dict\.\{"color":"([^"]+)","opacity":(\d+)\s*\}\}?/g,
    (_, hex, op) => hubLColorCustomDefault("hero_text_color_custom", hex, Number(op)),
  );
}

module.exports = {
  lineIndentAtIndex,
  hubLColorCustomDefault,
  repairMalformedPreviewHeroHubL,
};
