# SR Element Stat

**Slug:** `sr-element-stat`
**HubSpot module ID:** 210349901950
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Stat.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **stat** (group) — Stat

## Fields
- `design_settings.spacing` (spacing) — Spacing
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `stats.prefix` (text) — Prefix
- `stat.heading` (number) — Heading
- `stat.heading_size` (choice) — Size [required] — _HTML heading size_
- `stat.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `stat.heading_color` (choice) — Color [required]
- `stat.heading_color_custom` (color) — Color [when stat.heading_color EQUAL custom]
- `stat.heading_align` (choice) — Align [required]
- `stats.stat.class` (text) — CSS Class
- `stats.suffix` (text) — Suffix
- `stats.description` (text) — Description
- `stats.lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `stats.format` (boolean) — Format Number — _Format the number with commas_
- `animate_stats` (boolean) — Animate Stats
- `animation_speed` (number) — Animation Speed [when animate_stats EQUAL true] — _Time to animate in seconds_
