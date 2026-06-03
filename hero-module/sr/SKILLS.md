# SR theme — skills for AI assistants

This repository is a **HubSpot CMS theme** aligned with **Sprocket Rocket (SR) 2.0** / Launchpad-style assets. The file `init.json` maps local paths to upstream template versions under `/launchpad-starter-v2/sr-2.0/`.

This document describes **what to know how to do** in this codebase. For mandatory conventions (deployment safety, field stability, reference modules), see **`RULES.md`**.

---

## HubSpot custom module generator (`hubspot-module` style workflow)

Use this when the user asks to **create**, **tweak**, or **debug** a custom module using SR patterns (similar to a `/hubspot-module` command).

### Prerequisites

1. Theme directory contains **`custom-modules/`** and **`templates/macros.html`**.
2. A **reference module** for `design_settings`: **`SR One Col 01.module`** when present; otherwise use **`SR Hero 01.module`** or the closest rich SR module in the repo.
3. **Optional:** Figma MCP — extract layout, typography, and variables from Figma URLs.
4. **Optional:** HubSpot Dev MCP — docs lookup, validation, deployment.

### MCP integration (optional)

| MCP | Typical tools | Use case |
|-----|----------------|----------|
| Figma | `get_file_info`, `get_node`, `get_file_styles`, `get_file_variables` | Structure, styles, tokens from a frame |
| HubSpot | `search-doc`, `fetch-doc`, project commands | Documentation and portal workflows |

### Supported workflows (examples)

- **New module from description** — e.g. hero with heading, subheading, CTA.
- **New module from Figma** — pass a Figma design URL; map tokens to SR (see below).
- **Debug / tweak existing module** — pass module path + optional Figma URL to compare layout and fields.

### Execution pipeline (condensed)

1. **Parse intent** — Figma URL, module path for debug/tweak, theme root (`--theme` or current directory).
2. **Locate theme** — Confirm `custom-modules/`, `templates/macros.html`, and reference module exist.
3. **Read references** — `fields.json` / `module.html` / `meta.json` from the reference module; scan **`macros.html`**.
4. **Discover similar modules** — Search by type (see table below); align `fields.json` and HubL with existing examples.
5. **Design context** — If Figma: fetch node/styles/variables; map to SR variables and grid classes.
6. **Generate or patch files** — `meta.json`, `fields.json`, `module.html`, `module.css`, `module.js` (only if needed) under `custom-modules/SR [Name].module/`.
7. **Local preview** — Optionally build **`_preview.html`** and/or use a preview server; validate in browser (layout, breakpoints, console). Do not upload `_preview.html` to HubSpot (**`RULES.md`**).

### Similar module search patterns

| Type | Search terms in `custom-modules/` | Examples (names vary by theme) |
|------|-------------------------------------|--------------------------------|
| Slider / carousel | Slider, Carousel | Video slider, testimonial slider |
| Hero | Hero | SR Hero 01, hero video |
| Cards / columns | Card, Col, Column | Card modules, two-col |
| Tabs / accordion | Tab, Accordion | Tab 01, Accordion 01 |
| CTA / offer | CTA, Offer | Offer bar, CTA modules |

### Design token mapping (Figma → SR)

| Figma / design | SR / theme |
|----------------|------------|
| Brand colors | `var(--primary)`, `var(--secondary)`, …; opacity via `rgba(var(--primary_rgb), x)` when the theme exposes RGB pairs |
| Typography | `macros.heading()` with `heading_size`, `heading_display_size`, and theme text classes |
| Layout | Bootstrap-style grid: `container`, `row`, `col-md-*` (and SR container width patterns from reference `module.html`) |
| Spacing | Bootstrap spacing utilities (`m-*`, `p-*`) and SR utilities (`sr-padding-*`, etc.) |
| Buttons / links | `macros.cta()` |
| Images | `macros.image()` |
| Forms | `macros.form()` |
| Video | `macros.video()`, background video fields + `macros.module_bg_video()` where applicable |

### Local preview (skill note)

- **`_preview.html`** — Static preview that pulls theme CSS and sample markup; **not** uploaded to HubSpot.
- If your environment includes **`sr_preview_server.py`**, a typical pattern is: `python sr_preview_server.py --theme [path]`.
- This repo also has **`custom-modules/index.html`** for static wiring; HubSpot runtime behavior still requires a portal preview.

### Browser validation (when doing full visual QA)

Iteratively: open preview → screenshot → compare to design (e.g. Figma) → check backgrounds, type, spacing, hovers, breakpoints and console → fix and repeat until acceptable. Treat as **complete** only after interactions and responsive behavior are sane (**`RULES.md`** still governs what may be deployed).
a
---

## HubSpot HubL and templates

- Read and edit `templates/*.html` with valid **HTML comment annotations** where present (`templateType`, `isAvailableForNewContent`, `label`, etc.).
- Use **`{% include %}`**, **`{% extends %}`** / **`{% block %}`**, **`{% dnd_area %}`**, **`{% global_partial %}`**, and HubSpot **field tags** (`{% boolean %}`, etc.) consistently with existing pages (see `dnd_page.html`).
- **`{% import "../../templates/macros.html" as macros %}`** from custom modules (path depth matches folder layout under `custom-modules/`).

---

## Shared macros (`templates/macros.html`)

Prefer macros instead of duplicating markup or CSS logic:

| Macro | Use for |
|--------|---------|
| `macros.color(value)` | RGBA from HubSpot color + opacity |
| `macros.text_align(settings)` | Responsive text alignment utility classes |
| `macros.padding(settings)` | Responsive `sr-padding-*` classes |
| `macros.module_background(settings)` | Background utility classes (`bg-*`, responsive variants) |
| `macros.design_settings(module, settings, custom_bg)` | Scoped CSS for backgrounds, overlays, video, custom spacing |
| `macros.link(link)` | Safe `href`, `mailto:`, `tel:`, `target`, `rel` |
| `macros.cta(ctas, class)` | CTA groups: HubSpot CTA, button, modal, payments overlay |
| `macros.heading(headings, class)` | Heading tags, display sizes, theme colors |
| `macros.image(image, options)` | Images with loading, dimensions, alt fallback |
| `macros.video(video, class)` | Embed, HubSpot player, HTML5 video, play button |
| `macros.form(...)` | HubSpot forms, lazy load containers, scoped form CSS |
| `macros.col_size(cols)` | Bootstrap-style column / offset / order classes |
| `macros.grid_size` / `macros.flex_layout` | Grid and flex layout attributes |
| `macros.module_bg_video(module)` | Responsive background video sources |

HubL style in this project: **`&&` / `||`**, ternary **`? :`**, filters like **`|lower`**, and tags such as **`{% require_css %}`, `{% scope_css %}`, `{% icon %}`, `{% form %}`, `require_js(get_asset_url(...))`**.

---

## Custom modules (`custom-modules/*.module/`)

Each module is a folder ending in `.module` containing:

- **`module.html`** — HubL markup; wrap feature content in **`{% if module.enabled %}`** when the module supports disable.
- **`fields.json`** — HubSpot field definitions (groups, visibility, defaults). Keep **`id` / `name`** paths stable when editors already use the module.
- **`meta.json`** — `label`, `content_types`, `host_template_types`, `is_available_for_new_content`, optional docs links.
- **`module.css`** — module-scoped styles when used.
- **`module.js`** — optional; defer via `meta` / `require_js` patterns as in existing modules.

**Module root classes:** use a stable BEM-like prefix (e.g. `sr-hero-01`) plus **`{{ name }}`** (module instance class), **`sr_module`**, and design macros for backgrounds and alignment. **`module_preview`** is used for editor-safe height/behavior where applicable.

---

## CSS architecture (`css/`)

- **`base.css`** defines **`@layer`** order: `base`, `base-overrides`, `modules`, `custom-styles`, then **`{% include %}`** partials in order: generic reset → objects (layout, grid) → elements (typography, buttons, forms, tables, modals, cards, modules) → utilities.
- **Element partials** live under `css/elements/_*.css`; **objects** under `css/objects/`; **utilities** under `css/utilities/`.
- **`base-overrides.css`** — theme overrides (referenced from theme/header setup; do not break layer ordering without intent).
- Prefer **theme utility classes** (`sr-padding-*`, `bg-*`, `text-*`, Bootstrap-compatible grid classes) already used in modules before adding one-off global CSS.

---

## JavaScript (`js/`)

- **`interaction.js`** — modals, cookies, forms, accessibility behaviors; ES5-style `var` / functions in places for broad compatibility.
- **`prototype.js`** / **`prototype.css`** — local prototyping (placeholders, etc.).
- **`gsap.js`**, **`ScrollTrigger.js`** — loaded when modules need parallax/animation (`require_js` + `defer`, often `position: head`).
- **`hs_payments.js`**, **`video_embed.js`** — integrations used from macros/modules.
- Use **`get_asset_url('../../js/...')`** (adjust `../` depth from the calling file) with HubSpot **`require_js`**.

---

## Local preview

- **`custom-modules/index.html`** — static preview wiring for modules; not the HubSpot runtime.

---

## Quick directory map

| Path | Role |
|------|------|
| `templates/` | Page templates, partials, **`macros.html`** |
| `custom-modules/` | DnD custom modules (`*.module/`) |
| `css/` | Layered theme CSS + `prototype.css`, `custom-styles.css` |
| `js/` | Theme and integration scripts |
| `init.json` | Custom module / file manifest vs upstream SR 2.0 |

---

## Portal reference (multi-repo / agency setups)

Use only when your workspace matches these HubSpot accounts. Paths are examples from a typical local layout.

| Portal | Hub ID | Example local path | Notes |
|--------|--------|--------------------|--------|
| POS Nation | 7578225 | `hubspot/pos-nation/` | SBU brands (example from org playbook) |
| Rain Retail | 21506358 | `hubspot/rain-retail/` | XBU brands (example) |
| 1517 | 5475273 | `hubspot/1517/` | Example |

Adjust table to your machine; **`RULES.md`** deployment rules apply on every portal.

---

*See also: [`RULES.md`](RULES.md)*
