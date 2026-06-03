# SR Tabs Horizontal 01

**Slug:** `sr-tabs-horizontal-01`
**HubSpot module ID:** 210345441577
**Inferred category:** Tabs / accordion
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Tabs Horizontal 01.module`

## Notable defaults
- 1bda5d30-d934-4e6f-8c7a-4567993c8c07: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **1** (group — repeater(default=5, max=∞)) — Tab Item
  - **fb0bd3eb-5ff7-1d11-8f7e-cd7abbb6a5af** (group) — Styles
    - **2d510706-5d3f-99b4-65e5-226ab7876f9b** (group) — Background
    - **ede8ae98-d204-88b2-52c4-d3f713c5692f** (group) — Heading
    - **20807128-e3eb-4579-6b66-22bf368aa9d0** (group) — Content
  - **heading** (group) — Heading

## Fields
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `c3b3f9d0-afe8-9ad1-2de4-73dace5d511f` (choice) — Layout [required] — _Page: Sets a max-width at each responsive breakpoints Full Width: 100% at all breakpoints_
- `design_settings.top_bottom_padding` (choice) — Top Bottom Padding [required] — _Use default values: Uses any inherit padding valuesNo Padding: Set padding to 0Small: Uses a preset small paddingLarge: Uses a preset lar…_
- `design_settings.spacing` (spacing) — Spacing [when design_settings.top_bottom_padding EQUAL custom]
- `1bda5d30-d934-4e6f-8c7a-4567993c8c07` (choice) — Background Option [required]
- `a700ae1c-9418-06bf-92ec-e6da54894966` (choice) — Background Color [when 1bda5d30-d934-4e6f-8c7a-4567993c8c07 EQUAL color] [required]
- `00bd0a5e-8b47-f485-4490-157b5fb61dc5` (color) — Background Custom [when 1bda5d30-d934-4e6f-8c7a-4567993c8c07 EQUAL custom]
- `3c6a497d-3d7b-bdd6-0760-afc1c66de349` (gradient) — Background Gradient [when 1bda5d30-d934-4e6f-8c7a-4567993c8c07 EQUAL gradient]
- `4961d921-8c51-515a-f769-4d80bd04b97b` (textalignment) — Text Align
- `02fcb156-fab0-3228-52e7-48c6f9566445` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `d65574d0-5117-68f1-ecff-5d08c8a1735c` (color) — Text Color  [when 02fcb156-fab0-3228-52e7-48c6f9566445 EQUAL custom]
- `design_settings.border` (border) — Border
- `design_settings.responsive_settings.tablet.tablet_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.tablet.tablet_spacing` (spacing) — Tablet Spacing [when design_settings.responsive_settings.tablet.tablet_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.tablet.tablet_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.tablet.tablet_background_color` (choice) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.tablet.tablet_background_custom` (color) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video]
- `design_settings.responsive_settings.tablet.tablet_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video]
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `92601cc7-4b56-99d0-9528-b9d3ba63a2bc` (color) — Default
- `45d46097-1cc8-c31a-aa2d-293c3ded18ec` (color) — Active
- `9343fa19-a4f2-8ad6-dac1-e7d8ebf2d726` (color) — Default
- `8f2c6b8a-f60c-2650-cac6-b0392611e978` (color) — Active
- `a66c21ea-6905-d9a3-8ba3-2a5413755184` (color) — Default
- `ddd58d05-d1e3-3dd2-c9f5-291a19ac8319` (color) — Active
- `tab_item.tab_title` (text) — Tab Title
- `tab_item.tab_subtitle` (text) — Tab Subtitle
- `tab_item.tab_image` (image) — Tab Image
- `tab_item.tab_hover_image` (image) — Tab Active Image
- `a3cdabb4-537c-64dc-7256-abc899a34f69` (icon) — Icon
- `1.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `tab_item.heading.class` (text) — CSS Class
- `tab_item.tab_content` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `tab_item.tab_side_image` (image) — Tab Side Image
- `tab_item.image_corner_radius` (number) — Image Corner Radius
