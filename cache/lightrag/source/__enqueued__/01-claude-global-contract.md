# Global HubSpot contract (CLAUDE.md summary)

## Mandatory docs before HubL / fields / modules
1. Read `docs/common-mistakes.md` every session.
2. Read the relevant doc: module-fields-reference, hubl-tags/filters/functions, dnd-areas, theme-structure, global-partials, hubdb.

## Workflow phases
Discovery (`_discovery/`) → Design (`_plans/`, `_figma/`) → Theme scaffold → Modules → DnD templates → CSS polish.

## Non-negotiables
- Pixel-perfect Figma (desktop + mobile); mobile is not “shrunk desktop”.
- Zero hardcoded visible content (text, images, hrefs, SVG). Use fields + icon group pattern.
- Every module fully editable; include Style tab / style_overrides pattern for generic HubSpot modules.
- Templates: always `{% dnd_area %}`; templates are shells.
- Technology: HubL first → vanilla JS → API last (ask user for API plan).
- CSS: mobile-first, no jQuery, breakpoints ~1080 / 768 / 480.
- Figma MCP outputs must be saved under `_figma/`; do not re-fetch same node.
- Folders prefixed `_` are local-only, not uploaded.
- **Never run HubSpot CLI in agent** — show commands for humans (`hs watch`, `hs upload`, `hs auth`).
- Use HubSpot native: `simplemenu` + `{% menu %}`, `form` field + `{% form %}`, font field for Google fonts, blog tags, etc.

## Field access (correct patterns)
- Image: `module.image.src`, `.alt`, `.width`, `.height`
- Link/url object: `module.button.url.url.href`, `open_in_new_tab`
- Color: `.color`, opacity for rgba via `convert_rgb`
- Font: `.font`, `.size`, `.styles['font-weight']`, etc.
- Choice fields: `[["value","Label"],...]`

## Accessibility / SEO / performance (headlines)
- WCAG 2.1 AA: semantics, heading hierarchy, focus visible, skip link, alt text, contrast, reduced motion.
- SEO: one H1 discipline, OG meta pattern, editable heading levels.
- CWV: lazy load non-hero images; width/height on images; `fetchpriority="high"` on LCP hero; defer JS; limit fonts.

## SR-specific (also in CLAUDE.md)
- `templates/macros.html` is **LOCKED** — never edit.
- SR uses **pages** via `dnd_page.html` + Pages API — do not create new `.html` templates for normal marketing pages.
- Import macros: `{% import "../../templates/macros.html" as macros %}`; wrap in `{% if module.enabled %}`.
