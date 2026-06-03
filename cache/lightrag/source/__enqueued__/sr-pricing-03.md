# SR Pricing 03

**Slug:** `sr-pricing-03`
**HubSpot module ID:** 210345441551
**Inferred category:** Pricing
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Pricing 03.module`

## Notable defaults
- design_settings.background_option: default background: color
- 35b9d26c-424b-0230-6c76-c9b2c9cf06b9: default background: gradient

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **1** (group — repeater(default=3, max=3)) — Column
  - **column.features** (group — repeater(default=4, max=∞)) — Features
    - **features.icon** (group) — Icon
  - **cta** (group) — CTA
  - **8d78ee71-3bb6-da71-3b72-959606aa1e1d** (group — when show_price_toggle EQUAL true AND enable_secondary_button EQUAL true) — CTA

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `design_settings.layout` (choice) — Layout [required]
- `design_settings.container_width` (choice) — Container Width [required] — _Maximum: 100% of the container Wide: 83% of the container Narrow: 66% of the container Minimum: 50% of the container_
- `design_settings.top_bottom_padding` (choice) — Top Bottom Padding [required] — _Use default values: Uses any inherit padding valuesNo Padding: Set padding to 0Small: Uses a preset small paddingLarge: Uses a preset lar…_
- `design_settings.spacing` (spacing) — Spacing [when design_settings.top_bottom_padding EQUAL custom]
- `design_settings.background_option` (choice) — Background Option [required] — _For the Video option, return to the 🖉 Content tab to edit the video source_
- `design_settings.background_image` (backgroundimage) — Background Image [when design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color] [required]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.border` (border) — Border
- `design_settings.responsive_settings.tablet.tablet_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.tablet.tablet_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.tablet.tablet_spacing` (spacing) — Tablet Spacing [when design_settings.responsive_settings.tablet.tablet_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.tablet.tablet_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.tablet.tablet_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.tablet.tablet_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.tablet.tablet_background_color` (choice) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.tablet.tablet_background_custom` (color) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.tablet.tablet_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `design_settings.responsive_settings.tablet.tablet_fixed_background` (boolean) — Fixed Background [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video]
- `design_settings.responsive_settings.mobile.mobile_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.mobile.mobile_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Heading Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Heading Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Heading Color
- `heading.heading_color_custom` (color) — Heading Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Heading Align [required]
- `heading.class` (text) — Class — _Add a class to the module_
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `show_price_toggle` (boolean) — Show Price Toggle
- `label_1` (text) — Label 1 [when show_price_toggle EQUAL true]
- `label_2` (text) — Label 2 [when show_price_toggle EQUAL true]
- `toggle_color` (color) — Toggle Color [when show_price_toggle EQUAL true]
- `toggle_bar_color` (color) — Toggle Bar Color [when show_price_toggle EQUAL true]
- `f7448e24-c875-f89b-2ddc-4c28ad20ac72` (boolean) — Recommended
- `b0150794-fc7d-cf30-7f96-759dfe07a76e` (color) — Recommended Background Color [when f7448e24-c875-f89b-2ddc-4c28ad20ac72 EQUAL true]
- `b0150794-fc7d-cf30-7f96-759dfe07a76r` (color) — Recommended Text Color [when f7448e24-c875-f89b-2ddc-4c28ad20ac72 EQUAL true]
- `column.pricing_name` (text) — Name
- `column.price` (text) — Price
- `39bf6c5f-7eeb-2517-9e4b-10db81bafd98` (text) — Annual Price
- `column.description` (richtext) — Description
- `features.icon.icon_type` (choice) — Icon Type [required]
- `features.icon.image` (image) — Image [when features.icon.icon_type EQUAL image]
- `features.icon.icon` (icon) — Icon [when features.icon.icon_type EQUAL icon]
- `features.icon.icon_color` (color) — Icon Color [when features.icon.icon_type EQUAL icon]
- `features.icon.icon_background` (color) — Icon Background [when features.icon.icon_type EQUAL icon]
- `column.features.icon.html` (text) — HTML [when features.icon.icon_type EQUAL custom]
- `column.features.icon.icon_size` (number) — Icon Size [when features.icon.icon_type NOT_EQUAL none]
- `features.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `column.features.feature` (richtext) — Feature
- `cta.cta_type` (choice) — CTA Type [required]
- `cta.cta_style` (choice) — CTA Style [when cta.cta_type NOT_EQUAL none] [required]
- `cta.cta` (cta) — CTA [when cta.cta_type EQUAL cta]
- `cta.button_text` (text) — Button Text [when cta.cta_type MATCHES_REGEX btn|modal]
- `cta.modal_target` (text) — Modal Target [when cta.cta_type EQUAL modal]
- `cta.link` (link) — Link [when cta.cta_type EQUAL btn]
- `cta.payment` (payment) — Payment link [when cta.cta_type EQUAL hs_payment]
- `cta.checkout_location` (choice) — Checkout behavior [when cta.payment MATCHES_REGEX id":\d+ AND cta.cta_type EQUAL hs_payment]
- `cta.cta_size` (choice) — CTA Size [when cta.cta_type NOT_EQUAL none] [required]
- `enable_secondary_button` (boolean) — Enable Secondary Button [when show_price_toggle EQUAL true]
- `66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a` (choice) — CTA Type [required]
- `7d24724b-ffdf-e320-54e9-c78a88ba70a9` (choice) — CTA Style [when 66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a NOT_EQUAL none] [required]
- `7e4c44fe-a6ac-ecc0-34c0-7ad967c2d7dd` (text) — Button Text [when 66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a MATCHES_REGEX btn|modal]
- `2268d2d6-534c-1e74-0d3c-e4037093fd34` (text) — Modal Target [when 66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a EQUAL modal]
- `eb6c5046-4b91-7968-df0c-39b4955748fc` (link) — Link [when 66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a EQUAL btn]
- `911060c2-215c-7300-dd2e-60982d987385` (choice) — CTA Size [when 66e24e0d-1eb4-9056-7f60-54ad4ecd2e3a NOT_EQUAL none] [required]
- `35b9d26c-424b-0230-6c76-c9b2c9cf06b9` (choice) — Background Option [required] — _For the Video option, return to the 🖉 Content tab to edit the video source_
- `4ec68ddb-053f-80ca-ce2d-1fed2e817cfc` (color) — Background Gradient From [when 35b9d26c-424b-0230-6c76-c9b2c9cf06b9 EQUAL gradient]
- `7291ee55-c545-33e6-5a20-e87608a25ed9` (color) — Background Gradient To [when 35b9d26c-424b-0230-6c76-c9b2c9cf06b9 EQUAL gradient]
- `352811b6-82c8-187c-c9eb-e98b7418917b` (choice) — Background Color [when 35b9d26c-424b-0230-6c76-c9b2c9cf06b9 EQUAL color] [required]
- `66e08332-c195-bc91-94dd-044d5ad65e57` (color) — Background Color [when 35b9d26c-424b-0230-6c76-c9b2c9cf06b9 EQUAL custom] — _For transparent images or before the image/video loads_
- `6c6dc095-ee51-efe2-e07e-0919fee5c292` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `36cfa98c-9c7a-bd61-c25b-f9ed58f4577b` (color) — Text Color [when 6c6dc095-ee51-efe2-e07e-0919fee5c292 EQUAL custom]
