# SR Element Features

**Slug:** `sr-element-features`
**HubSpot module ID:** 210348825655
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Features.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **d81719d0-a19f-b284-cd4c-8df832129b7e** (group — repeater(default=5, max=∞)) — Feature
  - **80e5142b-7854-5c34-1891-4fb2c3a97908** (group) — Icon
  - **heading** (group) — Heading

## Fields
- `design_settings.spacing` (spacing) — Spacing
- `design_settings.list_spacing` (number) — List Spacing
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `678ad9f5-afae-7a05-60a4-b5a89b218d7d` (icon) — Icon
- `223b2e28-3a33-3dc3-02d5-0a861f407787` (color) — Color
- `0a839249-63f5-b366-482c-8e96691040d0` (color) — Background
- `feature.icon.icon_size` (number) — Icon Size
- `feature.icon.icon_on_top` (boolean) — Icon on Top
- `80e5142b-7854-5c34-1891-4fb2c3a97908.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `feature.heading.class` (text) — CSS Class
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text [when description EQUAL null] — _Turn on to make the Description text larger_
- `feature.algin_content` (choice) — Align Content [required]
