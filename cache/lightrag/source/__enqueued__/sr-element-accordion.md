# SR Element Accordion

**Slug:** `sr-element-accordion`
**HubSpot module ID:** 210349901914
**Inferred category:** Tabs / accordion
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Accordion.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **1** (group — repeater(default=6, max=∞)) — Accordion Item
  - **heading** (group) — Heading
- **ctas** (group — when number_of_accordions_to_show EQUAL null) — Button
  - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
  - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
  - **ctas.icon** (group — when ctas.cta_type NOT_EQUAL cta AND ctas.add_icon EQUAL true) — Icon

## Fields
- `design_settings.spacing` (spacing) — Spacing
- `design_settings.background_color` (choice) — Background Color [required]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_color MATCHES_REGEX custom]
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.icon_color` (choice) — Icon Color [required]
- `design_settings.icon_color_custom` (color) — Icon Color [when design_settings.icon_color EQUAL custom]
- `design_settings.border` (border) — Border
- `design_settings.border_radius` (number) — Border Radius
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `tab_item.heading.class` (text) — CSS Class
- `tab_item.description` (richtext) — Content
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `tab_item.expanded` (boolean) — Expanded
- `number_of_accordions_to_show` (number) — Number of Accordions to Show — _Use this to only show a certain number of accordions. Adds a load more button. Leave blank to show all_
- `ctas.position` (choice) — Position [required]
- `ctas.cta_type` (choice) — CTA Type [required]
- `ctas.cta_style` (choice) — CTA Style [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.default.background` (color) — Background
- `ctas.default.text` (color) — Text
- `ctas.default.border` (color) — Border
- `ctas.hover.background` (color) — Background
- `ctas.hover.text` (color) — Text
- `ctas.hover.border` (color) — Border Color
- `ctas.button_text` (text) — Button Text [when ctas.cta_type MATCHES_REGEX btn|modal]
- `ctas.cta_size` (choice) — CTA Size [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.add_icon` (boolean) — Add icon [when ctas.cta_type NOT_EQUAL cta]
- `ctas.icon.icon` (icon) — Icon [required]
- `ctas.icon.position` (choice) — Position [required]
- `ctas.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
