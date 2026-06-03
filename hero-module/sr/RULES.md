# SR theme — rules for AI assistants

Mandatory **conventions** for this HubSpot / Sprocket Rocket (SR) 2.0 style theme. For capabilities, macros, and the full **hubspot-module** workflow, see **`SKILLS.md`**.

---

## How this differs from the `hubspot-module` Cursor skill

| `RULES.md` (this file) | `hubspot-module` skill (e.g. `cursorrules` in Downloads) |
|------------------------|----------------------------------------------------------|
| **Must-follow** conventions for any edit in the theme | **End-to-end playbook** for *generating* or *debugging* modules (argument parsing, MCPs, 7-step pipeline) |
| Repo-specific: HubL hygiene, CSS layers, paths, field renames | Adds: Figma extraction, similar-module discovery, `_preview.html`, optional browser validation loop |
| Stable for day-to-day coding | Optional tooling: Figma MCP, HubSpot Dev MCP, `sr_preview_server.py` |

Both should agree on **deployment safety** and **SR patterns** below.

---

## Production and HubSpot deployment safety

- **Live production themes** — Upload only the **specific files** you changed (e.g. `fields.json`, `module.html`, `module.css`, `module.js` one at a time). Do **not** replace the entire theme as a bulk upload unless that is an explicit, controlled process.
- **Never upload local-only artifacts** — Files such as **`_preview.html`** (or any standalone preview HTML) are for local/dev use only and must **not** be deployed to HubSpot.
- **Publish path** — Test in **HubSpot preview** before publishing dependent pages or relying on changes in production.

---

## New and edited custom modules

- Do not rename **`fields.json`** field **`name`** values without a migration plan; it breaks existing page data.
- **Reference module for `design_settings`** — When creating a new module, copy the **`design_settings`** group (including **`responsive_settings`**) **verbatim** from the theme’s canonical layout module:
  - Prefer **`SR One Col 01.module`** when it exists in `custom-modules/`.
  - If it is missing (minimal or partial themes), use the richest available SR module in the repo (e.g. **`SR Hero 01.module`**) for `design_settings` / responsive background and spacing patterns.
- **Recommended field order** in `fields.json` (when the module has video + standard SR chrome): top-level items such as **`background_video`** (and related video fields if any) → **`enabled`** → **`sr_module_id`** → **`class`** → **`design_settings`** → then **module-specific** content fields. Keep parity with similar existing modules in the theme.
- **Discover similar modules first** — Before adding a new module, search `custom-modules/` for the same *type* (hero, slider, card, tabs, offer, etc.) and align `fields.json` completeness and HubL patterns with those examples.
- Scope **per-instance CSS** with **`.{{ name }}`** inside `{% require_css %}` when styles are instance-specific.
- **`module.css`** — Prefer **theme CSS variables** (`var(--primary)`, etc.) over one-off hardcoded brand hex values unless the design explicitly requires an exception.

---

## HubL and HTML

- Preserve HubSpot **annotation comments** at the top of templates when editing.
- Use **`resize_image_url`** for performance-sensitive background images where macros already do.
- Keep **accessibility** patterns used in macros: alt text fallbacks, `aria-label`, `role`, payment overlay focus traps, etc.
- **`module.html`** — Use **`{% import "../../templates/macros.html" as macros %}`** (adjust depth if the folder structure differs), wrap feature output in **`{% if module.enabled %}`** when the module supports disable, and apply **`macros.module_background`**, **`macros.text_align`**, **`macros.padding`**, **`macros.design_settings`**, etc., consistent with the reference module.

---

## CSS

- Respect **`@layer`** in `base.css`; add new global styles in the appropriate layer file or `custom-styles.css` as the rest of the theme does.
- Avoid increasing specificity unnecessarily; utilities and existing element styles should win predictably.

---

## JavaScript

- Match the **existing style** of the file you edit (ES5 vs classes). Do not modernize entire files as a drive-by.
- Load scripts through HubSpot **`require_js`** from modules/templates when adding dependencies, with **`defer`** unless a comment or pattern says otherwise.
- **`module.js`** — Keep **minimal**; add only when behavior requires it (sliders, accordions, etc.).

---

## Paths

- From `custom-modules/Some Name.module/module.html`, shared templates are typically **`../../templates/`** and shared JS/CSS **`../../js/`**, **`../../css/`**.

---

## Third-party / upstream

- `init.json` references remote paths under **`launchpad-starter-v2/sr-2.0`**; treat this workspace as a **subset** of the full theme. If a file is missing locally, it may still exist upstream.

---

## Change discipline

- Edit only what the task requires; avoid large refactors across unrelated modules, templates, or vendor-like JS bundles.

---

## Optional: Cursor project rules

To auto-attach these conventions in Cursor, copy or summarize this file into `.cursor/rules/*.mdc` with suitable `globs` (e.g. `custom-modules/**/*`, `templates/**/*.html`, `css/**/*.css`, `js/**/*.js`) or `alwaysApply: true`. See [Cursor Rules](https://docs.cursor.com/context/rules) for `.mdc` frontmatter.

---

*See also: [`SKILLS.md`](SKILLS.md)*
