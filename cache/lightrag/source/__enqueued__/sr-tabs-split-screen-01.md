# SR Tabs Split Screen 01

**Slug:** `sr-tabs-split-screen-01`
**HubSpot module ID:** 210345738029
**Inferred category:** Tabs / accordion
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Tabs Split Screen 01.module`

## Top-level groups
- **23162831-736e-df1d-4bfa-5028cbeb3ebc** (group — repeater(default=3, max=∞)) — Tabs
  - **58ff6122-da96-d65d-621a-1472b0a533d9** (group) — Styles
  - **heading** (group) — Heading
  - **cta** (group) — CTA
    - **d9c99fd3-9582-08e7-456e-6e4149f6960e** (group — when cta.cta_style EQUAL custom) — Default
    - **cb1eae09-89d7-b2c4-b3b3-c252b2bd2970** (group — when cta.cta_style EQUAL custom) — Hover
  - **32164d41-793c-7399-8628-deea88ed8173** (group) — Image Heading
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile

## Fields
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `3620c7f9-f11f-70ba-ffa7-f67115dad0da` (choice) — Column Alignment [required]
- `design_settings.content_background_option` (choice) — Content Background Option [required]
- `9ab71491-3c1a-dd7c-1034-7a4386d7c426` (image) — Content Background Image [when design_settings.content_background_option EQUAL image]
- `design_settings.content_background_color` (choice) — Content Background Color [when design_settings.content_background_option EQUAL color] [required]
- `4cbb8f51-86ad-0f60-2862-a72c76e939e0` (color) — Content Background Color [when design_settings.content_background_option EQUAL custom]
- `1911cf44-bb79-b30f-915b-75039a207564` (text) — Menu Title
- `fdeec0dc-e59c-22dc-15f6-4bce407e70a8` (choice) — Menu Title Color [required]
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `heading.class` (text) — CSS Class
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `81a6a8e3-b33d-a937-514d-13a70ca69bee` (choice) — Text Color [required]
- `cta.cta_type` (choice) — CTA Type [required]
- `cta.cta_style` (choice) — CTA Style [when cta.cta_type NOT_EQUAL none] [required]
- `014fc65d-0f21-b7a4-b2b6-82a68c93c2d2` (color) — Background
- `39ae7cf4-7538-9211-4d0c-6cd70e8e2bd2` (color) — Text
- `307a28e0-1fd7-05b8-5bca-5dc0a39d0fd0` (color) — Border
- `4c0d845e-4323-d811-ee70-ef9669bb7e7d` (color) — Background
- `b31e466d-7e6c-405e-facf-86aa542363bc` (color) — Text
- `9509621e-f195-2665-21bb-6db2ab686647` (color) — Border
- `cta.cta` (cta) — CTA [when cta.cta_type EQUAL cta]
- `cta.button_text` (text) — Button Text [when cta.cta_type MATCHES_REGEX btn|modal]
- `cta.modal_target` (text) — Modal Target [when cta.cta_type EQUAL modal]
- `cta.link` (link) — Link [when cta.cta_type EQUAL btn]
- `cta.payment` (payment) — Payment link [when cta.cta_type EQUAL hs_payment]
- `cta.checkout_location` (choice) — Checkout behavior [when cta.payment MATCHES_REGEX id":\d+ AND cta.cta_type EQUAL hs_payment]
- `cta.cta_size` (choice) — CTA Size [when cta.cta_type NOT_EQUAL none] [required]
- `d10891ff-707a-692d-c4a8-7de9e16318a2` (text) — Heading
- `5219851b-2aad-df3c-cb21-2915e04b4534` (choice) — Size [required] — _HTML heading size_
- `83db1b2b-acf8-d0a8-439f-03171b6d7cb7` (choice) — Display Size [required] — _Size that heading is displayed at_
- `04dbec50-012c-91d2-5a2e-590a49952475` (choice) — Color [required]
- `eb01de96-dbce-da16-d19f-b40024ea11b2` (color) — Color [when 04dbec50-012c-91d2-5a2e-590a49952475 EQUAL custom]
- `e66c1480-a981-ea20-808e-b26d4d9f3a5b` (choice) — Align [required]
- `1dadd4fe-a376-1819-6e04-c96f405c02a4` (text) — CSS Class
- `parallax_image` (image) — Image
- `1647b1c9-2988-63e2-9c94-201f9a9e1be0` (boolean) — Image Overlay
- `9618e598-d3e1-146c-daa0-4c119f60760f` (color) — Image Overlay Color [when 1647b1c9-2988-63e2-9c94-201f9a9e1be0 EQUAL true]
- `design_settings.layout` (choice) — Layout [required]
- `design_settings.container_width` (choice) — Container Width [required] — _Maximum: 100% of the container Wide: 83% of the container Narrow: 66% of the container Minimum: 50% of the container_
- `design_settings.top_bottom_padding` (choice) — Top Bottom Padding [required] — _Use default values: Uses any inherit padding valuesNo Padding: Set padding to 0Small: Uses a preset small paddingLarge: Uses a preset lar…_
- `design_settings.spacing` (spacing) — Spacing [when design_settings.top_bottom_padding EQUAL custom]
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.border` (border) — Border
- `design_settings.responsive_settings.tablet.tablet_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.tablet.tablet_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.tablet.tablet_spacing` (spacing) — Tablet Spacing [when design_settings.responsive_settings.tablet.tablet_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
