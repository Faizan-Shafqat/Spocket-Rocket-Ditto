# SR Hero Two Col 01

**Slug:** `sr-hero-two-col-01`
**HubSpot module ID:** 210345737860
**Inferred category:** Hero (two column)
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Hero Two Col 01.module`

## Notable defaults
- left_column.design_settings.background_option: default background: color
- right_column.design_settings.background_option: default background: custom

## Top-level groups
- **design_settings** (group) — Design Settings
- **left_column** (group) — Left Column
  - **left_column.design_settings** (group) — Design Settings
    - **63d0f74e-8e8a-e7eb-0523-803cefdb01c4** (group) — Padding
  - **left_column_heading** (group — repeater(default=2, max=∞)) — Heading
  - **left_column_cta** (group) — CTA
    - **left_column_cta.default** (group — when left_column_cta.cta_style EQUAL custom) — Default
    - **left_column_cta.hover** (group — when left_column_cta.cta_style EQUAL custom) — Hover
    - **left_column_cta.icon** (group — when left_column_cta.cta_type NOT_EQUAL cta AND left_column_cta.add_icon EQUAL true) — Icon
- **right_column** (group) — Right Column
  - **right_column.design_settings** (group) — Design Settings
    - **right_column.design_settings.padding** (group) — Padding
  - **right_column_heading** (group) — Heading
  - **right_column_cta** (group — repeater(default=2, max=∞)) — CTA
    - **right_column_cta.default** (group — when right_column_cta.cta_style EQUAL custom) — Default
    - **right_column_cta.hover** (group — when right_column_cta.cta_style EQUAL custom) — Hover
    - **right_column_cta.icon** (group — when right_column_cta.cta_type NOT_EQUAL cta AND right_column_cta.add_icon EQUAL true) — Icon

## Fields
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `design_settings.layout` (choice) — Layout [required]
- `design_settings.container_width` (choice) — Container Width [required]
- `left_column.design_settings.background_option` (choice) — Background Option [required]
- `left_column.design_settings.background_gradient_from` (color) — Background Gradient From [when left_column.design_settings.background_option EQUAL gradient]
- `left_column.design_settings.background_gradient_to` (color) — Background Gradient To [when left_column.design_settings.background_option EQUAL gradient]
- `left_column.design_settings.background_image` (image) — Background Image [when left_column.design_settings.background_option EQUAL image]
- `left_column.design_settings.background_overlay_color` (color) — Background Overlay Color [when left_column.design_settings.background_option EQUAL image]
- `left_column.design_settings.background_color` (choice) — Background Color [when left_column.design_settings.background_option EQUAL color] [required]
- `left_column.design_settings.background_custom` (color) — Background Custom [when left_column.design_settings.background_option EQUAL custom]
- `8557dd26-72ce-e3b3-aa50-9bfd074738ab` (number) — Top
- `8a94bfb0-85dd-31cd-077f-462db2d64ede` (number) — Bottom
- `8b33a7fe-88f3-947e-b9b9-e9cfc63af6cc` (number) — Left
- `bdbc3381-e584-bcda-ca8d-94e9e470e2fd` (number) — Right
- `left_column.design_settings.padding.units` (choice) — Units [required]
- `left_column.design_settings.column_size` (text) — Column Size — _Documentation_
- `left_column_media_type` (choice) — Media Type [required]
- `left_column.image_` (image) — Image [when left_column_media_type EQUAL image]
- `left_column.video` (file/file) — Video [when left_column_media_type EQUAL video]
- `left_column.video_max_height` (number) — Video Max Height [when left_column_media_type EQUAL video]
- `left_column.loop` (boolean) — Loop Video [when left_column_media_type EQUAL video]
- `left_column_heading.heading` (text) — Heading
- `left_column_heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `left_column_heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `left_column_heading.heading_color` (choice) — Color
- `left_column_heading.heading_color_custom` (color) — Color [when left_column_heading.heading_color EQUAL custom]
- `left_column_heading.heading_align` (choice) — Align [required]
- `left_column.heading.class` (text) — CSS Class
- `left_column.description` (richtext) — Description
- `left_column.lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `left_column_cta.cta_type` (choice) — CTA Type [required]
- `left_column_cta.cta_style` (choice) — CTA Style [when left_column_cta.cta_type NOT_EQUAL none] [required]
- `left_column.ctas.default.background` (color) — Background
- `left_column.ctas.default.text` (color) — Text
- `left_column.ctas.default.border` (color) — Border
- `left_column.ctas.hover.background` (color) — Background
- `left_column.ctas.hover.text` (color) — Text
- `left_column.ctas.hover.border` (color) — Border Color
- `left_column_cta.cta` (cta) — CTA [when left_column_cta.cta_type EQUAL cta]
- `left_column_cta.button_text` (text) — Button Text [when left_column_cta.cta_type MATCHES_REGEX btn|modal]
- `left_column_cta.modal_target` (text) — Modal Target [when left_column_cta.cta_type EQUAL modal]
- `left_column_cta.link` (link) — Link [when left_column_cta.cta_type EQUAL btn]
- `left_column_cta.payment` (payment) — Payment link [when left_column_cta.cta_type EQUAL hs_payment]
- `left_column_cta.checkout_location` (choice) — Checkout behavior [when left_column_cta.payment MATCHES_REGEX id":\d+ AND left_column_cta.cta_type EQUAL hs_payment]
- `left_column_cta.cta_size` (choice) — CTA Size [when left_column_cta.cta_type NOT_EQUAL none] [required]
- `left_column_cta.add_icon` (boolean) — Add icon [when left_column_cta.cta_type NOT_EQUAL cta]
- `left_column_cta.icon.icon` (icon) — Icon [required]
- `left_column_cta.icon.position` (choice) — Position [required]
- `left_column_cta.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `left_column.text_align` (choice) — Text Align [required]
- `left_column.text_color` (choice) — Text Color [required]
- `right_column.design_settings.background_option` (choice) — Background Option [required]
- `right_column.design_settings.background_gradient_from` (color) — Background Gradient From [when right_column.design_settings.background_option EQUAL gradient]
- `right_column.design_settings.background_gradient_to` (color) — Background Gradient To [when right_column.design_settings.background_option EQUAL gradient]
- `right_column.design_settings.background_image` (image) — Background Image [when right_column.design_settings.background_option EQUAL image]
- `right_column.design_settings.background_overlay_color` (color) — Background Overlay Color [when right_column.design_settings.background_option EQUAL image]
- `right_column.design_settings.background_color` (choice) — Background Color [when right_column.design_settings.background_option EQUAL color] [required]
- `right_column.design_settings.background_custom` (color) — Background Custom [when right_column.design_settings.background_option EQUAL custom]
- `right_column.design_settings.padding.top` (number) — Top
- `right_column.design_settings.padding.bottom` (number) — Bottom
- `right_column.design_settings.padding.left` (number) — Left
- `right_column.design_settings.padding.right` (number) — Right
- `right_column.design_settings.padding.units` (choice) — Units [required]
- `right_column.design_settings.column_size` (text) — Column Size — _Documentation_
- `right_column_media_type` (choice) — Media Type [required]
- `right_column.image_` (image) — Image [when right_column_media_type EQUAL image]
- `right_column.video` (file/file) — Video [when right_column_media_type EQUAL video]
- `right_column.video_max_height` (number) — Video Max Height [when right_column_media_type EQUAL video]
- `right_column.loop` (boolean) — Loop Video [when right_column_media_type EQUAL video]
- `right_column_heading.heading` (text) — Heading
- `right_column_heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `right_column_heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `right_column_heading.heading_color` (choice) — Color
- `right_column_heading.heading_color_custom` (color) — Color [when right_column_heading.heading_color EQUAL custom]
- `right_column_heading.heading_align` (choice) — Align [required]
- `right_column.heading.class` (text) — CSS Class
- `right_column.description` (richtext) — Description
- `right_column.lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `right_column_cta.cta_type` (choice) — CTA Type [required]
- `right_column_cta.cta_style` (choice) — CTA Style [when right_column_cta.cta_type NOT_EQUAL none] [required]
- `right_column.ctas.default.background` (color) — Background
- `right_column.ctas.default.text` (color) — Text
- `right_column.ctas.default.border` (color) — Border
- `right_column.ctas.hover.background` (color) — Background
- `right_column.ctas.hover.text` (color) — Text
- `right_column.ctas.hover.border` (color) — Border Color
- `right_column_cta.cta` (cta) — CTA [when right_column_cta.cta_type EQUAL cta]
- `right_column_cta.button_text` (text) — Button Text [when right_column_cta.cta_type MATCHES_REGEX btn|modal]
- `right_column_cta.modal_target` (text) — Modal Target [when right_column_cta.cta_type EQUAL modal]
- `right_column_cta.link` (link) — Link [when right_column_cta.cta_type EQUAL btn]
- `right_column_cta.payment` (payment) — Payment link [when right_column_cta.cta_type EQUAL hs_payment]
- `right_column_cta.checkout_location` (choice) — Checkout behavior [when right_column_cta.payment MATCHES_REGEX id":\d+ AND right_column_cta.cta_type EQUAL hs_payment]
- `right_column_cta.cta_size` (choice) — CTA Size [when right_column_cta.cta_type NOT_EQUAL none] [required]
- `right_column_cta.add_icon` (boolean) — Add icon [when right_column_cta.cta_type NOT_EQUAL cta]
- `right_column_cta.icon.icon` (icon) — Icon [required]
- `right_column_cta.icon.position` (choice) — Position [required]
- `right_column_cta.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `right_column.text_align` (choice) — Text Align [required]
- `right_column.text_color` (choice) — Text Color [required]
