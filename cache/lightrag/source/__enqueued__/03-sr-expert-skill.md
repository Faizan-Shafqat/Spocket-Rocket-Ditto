# Skill: sr-expert (Sprocket Rocket PRO)

**Stacks on:** hubspot-expert. **Triggers:** SR, Sprocket Rocket, `SR *` modules, `dnd_page.html`, `design_settings`, `/sr-*` commands.

## Five non-negotiables
1. `templates/macros.html` is **LOCKED** — read/import/use only; never Write/Edit.
2. Every module wrapped in `{% if module.enabled %}`.
3. Every module: `{% import "../../templates/macros.html" as macros %}` (path relative to module).
4. Every CSS selector scoped under `.{{ name }}` (HubSpot instance class).
5. **No new `.html` templates** for standard pages — build `custom-modules/` + create pages via HubSpot Pages API using `dnd_page.html`.

## Canonical wrapper classes (order)
`sr-[module-slug]`, `{{ name }}`, `macros.module_background(design_settings)`, `macros.padding(design_settings)`, `text-{{ design_settings.text_color }}`, `prototype-no-background`, optional `module.class`, `sr_module`, optional `data-preview`, optional `sr_module_id` as id.

## Container width → Bootstrap columns
- `min` → `col-lg-6 offset-lg-3`
- `narrow` → `col-lg-8 offset-lg-2`
- `wide` → `col-lg-10 offset-lg-1`
- `max` → no row/col wrapper (full bleed)
- default → `col-md-12`
`design_settings.layout`: `container` or `container-fluid`.

## Macros (must use; do not hand-roll)
- `macros.heading(module.heading)` — heading arrays
- `macros.cta(module.ctas)` — btn/cta/modal/payment CTAs
- `macros.image`, `macros.form`, `macros.video`, `macros.link` (inside `<a>`)
- `macros.color` for color fields in CSS/inline
- `macros.padding`, `macros.text_align`, `macros.module_background`
- `macros.design_settings(name, module.design_settings)` inside `{% require_css %}`
- `macros.col_size`, `macros.slides_to_show`, `macros.module_bg_video`

## CSS pattern
Dynamic field-driven CSS: `{% require_css %}<style>...{% end_require_css %}` with `.{{ name }}` prefix. Prefer theme CSS variables: `--primary`, `--secondary`, etc.

## JS pattern
`require_js` with `defer: true`; GSAP/ScrollTrigger in `position: head` when needed. Load libraries **only if** module uses them (splide, fslightbox, gsap, etc.).

## Required fields.json (SR-style)
`enabled`, `sr_module_id`, `class`, plus **`design_settings` copied from an existing SR module** (background_option, colors, images, layout, container_width, text_color, padding, responsive_settings, etc.).

## Module naming
`SR [Category] [Description] [Number].module`. Client-specific: `[Client] [Desc] [Number].module`.

## Decision hierarchy (Figma → SR)
1. Exact match (fields only)  
2. Field edits  
3. CSS tweaks (scoped)  
4. HTML+CSS (user approval)  
5. New module  

Prefer lowest level; never jump to new module if CSS suffices.

## Workflow commands
`/sr-new-project`, `/sr-init`, `/sr-analyze-figma`, `/sr-build-page`. Always analyze → approved `_plans/*-sr-mapping.md` → build. **Fetch before modify:** show `hs fetch SR-[client] --portal=...` to user.

## System templates
Use shipped templates as-is (`dnd_page.html`, blog, 404/500, membership, etc.). Blog uses `templates/blog/snippet_macros.html` — **not** the same as `templates/macros.html`.

## Pitfall checklist (quick)
enabled wrapper, macros import, `{{ name }}` on wrapper and CSS, `macros.design_settings` in require_css, no macros.html edits, conditional JS loads, design_settings present.
