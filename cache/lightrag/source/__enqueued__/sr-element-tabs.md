# SR Element Tabs

**Slug:** `sr-element-tabs`
**HubSpot module ID:** 210348825680
**Inferred category:** Tabs / accordion
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Tabs.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **tabs** (group — repeater(default=4, max=∞)) — Tabs

## Fields
- `design_settings.spacing` (spacing) — Spacing
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `tabs.tab_label` (text) — Tab Label
- `tabs.tab_content` (richtext) — Tab Content
- `tab_style` (choice) — Tab Style [required]
