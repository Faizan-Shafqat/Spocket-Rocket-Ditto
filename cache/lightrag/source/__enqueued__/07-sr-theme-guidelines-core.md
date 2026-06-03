# SR theme guidelines — core (from docs/sr-theme-guidelines.md)

## Mandatory module structure
```html
{% if module.enabled %}
  {% import "../../templates/macros.html" as macros %}
  {# module HTML #}
  {% require_css %}
  <style>
    {{ macros.design_settings(name, module.design_settings) }}
  </style>
  {% end_require_css %}
{% endif %}
```

## `{{ name }}`
HubSpot injects unique instance class. Wrapper and **all** CSS selectors must use `.{{ name }}` to avoid cross-instance bleed.

## Standard wrapper attributes
Include: `sr-[slug]`, `{{ name }}`, `macros.module_background(design_settings)`, `macros.padding(design_settings)`, `text-{{ design_settings.text_color }}`, `prototype-no-background`, optional `module.class`, `sr_module`, optional `id` from `sr_module_id`, optional `data-preview`.

## Container width pattern
Same mapping as sr-expert: min/narrow/wide/max/default → specific `col-*` and optional row/col omission for `max`.

## Macro purposes (do not duplicate in custom CSS)
- `macros.design_settings` emits background, overlay, border, responsive padding, etc.
- Use `macros.color` for any color field output in CSS blocks.
- Headings only through `macros.heading`; CTAs only through `macros.cta`.

## CSS scoping rules
Inline `{% require_css %}` for field-driven styles; prefix `.{{ name }}`. Static non-field CSS may live in `module.css` when appropriate.

## JavaScript loading
Defer by default; parallax/GSAP load in head when feature enabled; avoid loading unused SR libraries (splide, fslightbox, isotope, aos, tippy, etc.).

## Locked file
`templates/macros.html` must not be modified — shared across 170+ modules.
