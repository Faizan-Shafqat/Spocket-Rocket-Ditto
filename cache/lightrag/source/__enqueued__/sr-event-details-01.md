# SR Event Details 01

**Slug:** `sr-event-details-01`
**HubSpot module ID:** 210348825682
**Inferred category:** Events
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Event Details 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **column.stars** (group) — Stars
- **features** (group — repeater(default=6, max=∞)) — Listing Features
  - **features.icon** (group) — Icon
  - **features.heading** (group) — Heading
- **07e700a4-1da1-1c64-4096-3bbc38cc6b81** (group — repeater(default=5, max=∞)) — Listing Sections
  - **4b85a83b-15f0-797c-08df-5565c4c1b0f6** (group) — Heading
  - **7a782eb4-95cb-8d72-3f4e-47179a03877a** (group — repeater(default=1, max=3)) — Section Items
    - **67506963-0cf1-3aef-51a0-0af801f54777** (group) — Heading
    - **cta** (group) — CTA
      - **column.cta.default** (group — when column.cta.cta_style EQUAL custom) — Default
      - **column.cta.hover** (group — when column.cta.cta_style EQUAL custom) — Hover
      - **column.cta.icon** (group — when cta_type NOT_EQUAL cta AND column.cta.add_icon EQUAL true) — Icon

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
- `design_settings.background_option` (choice) — Background Option [required]
- `design_settings.background_image` (backgroundimage) — Background Image [when design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color] [required]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `b2775136-cbf8-999c-2281-662e175a3ff5` (boolean) — Fixed Background [when design_settings.background_option EQUAL image]
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
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `heading.class` (text) — CSS Class
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `column.col_image` (image) — Image
- `column.image_corner_radius` (number) — Image Corner Radius
- `column.length` (text) — Length
- `column.location` (text) — Location
- `column.price` (text) — Price
- `column.promo_price` (text) — Promo Price
- `column.stars.stars` (number) — Stars
- `column.stars.color` (color) — Color
- `features.icon.icon_type` (choice) — Icon Type [required]
- `features.icon.image` (image) — Image [when features.icon.icon_type EQUAL image]
- `features.icon.icon` (icon) — Icon [when features.icon.icon_type EQUAL icon]
- `features.icon.icon_color` (color) — Icon Color [when features.icon.icon_type EQUAL icon]
- `features.icon.icon_background` (color) — Icon Background [when features.icon.icon_type EQUAL icon]
- `listing_features.icon.icon_size` (number) — Icon Size
- `features.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `features.heading.heading` (text) — Heading
- `features.heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `features.heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `features.heading.heading_color` (choice) — Color [required]
- `features.heading.heading_color_custom` (color) — Color [when features.heading.heading_color EQUAL custom]
- `features.heading.heading_align` (choice) — Align [required]
- `column.features.heading.class` (text) — CSS Class
- `description.lead_text` (richtext) — Description
- `features.lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `d212b24c-86c2-b7c0-ccb8-2e45164b9c90` (text) — Heading
- `32de62d8-4d0c-4cd1-1a14-e5100395ddc5` (choice) — Size [required] — _HTML heading size_
- `d1b3087d-0e61-4c37-b34d-0a67841a68a6` (choice) — Display Size [required] — _Size that heading is displayed at_
- `08c4754b-5fa2-763e-1b3c-b895819b3740` (choice) — Color [required]
- `aa881728-598e-232c-db51-d8f90670f828` (color) — Color [when 08c4754b-5fa2-763e-1b3c-b895819b3740 EQUAL custom]
- `7d7d5db3-0866-9299-7763-4ff980aba6a2` (choice) — Align [required]
- `593ba110-4876-72a7-3c97-c64a286cf13f` (text) — CSS Class
- `22f048cb-0b29-d8a3-d88f-7ee867fd3d27` (text) — Heading
- `529a362b-a3f2-60e3-fcee-e739635063f3` (choice) — Size [required] — _HTML heading size_
- `41964aff-3b1c-b6e9-1b3d-521952be5e6a` (choice) — Display Size [required] — _Size that heading is displayed at_
- `d4d9562a-4655-0e6e-07f6-90e7c2de864b` (choice) — Color [required]
- `9c973b7f-35e9-988a-55ab-80bd1c169638` (color) — Color [when d4d9562a-4655-0e6e-07f6-90e7c2de864b EQUAL custom]
- `405e5129-25a9-bb09-96f9-deacd8e2fc51` (choice) — Align [required]
- `cabf8c43-ba4f-2f18-2c6d-32aabd5a27f2` (text) — CSS Class
- `93b44572-b672-d3da-a3e0-07d65664e78c` (richtext) — Description
- `50b511cb-1340-51b9-222a-e1b12081cc96` (boolean) — Lead Text
- `cta_type` (choice) — CTA Type [required]
- `column.cta.cta_style` (choice) — CTA Style [when cta_type NOT_EQUAL none] [required]
- `column.ctas.default.background` (color) — Background
- `column.ctas.default.text` (color) — Text
- `column.ctas.default.border` (color) — Border
- `column.ctas.hover.background` (color) — Background
- `column.ctas.hover.text` (color) — Text
- `column.ctas.hover.border` (color) — Border Color
- `column.cta.cta` (cta) — CTA [when cta_type EQUAL cta]
- `column.cta.button_text` (text) — Button Text [when cta_type MATCHES_REGEX btn|modal]
- `column.cta.modal_target` (text) — Modal Target [when cta_type EQUAL modal]
- `column.ctas.link` (link) — Link [when cta_type EQUAL btn]
- `column.cta.payment` (payment) — Payment link [when cta_type EQUAL hs_payment]
- `column.cta.checkout_location` (choice) — Checkout behavior [when column.cta.payment MATCHES_REGEX id":\d+ AND cta_type EQUAL hs_payment]
- `column.ctas.cta_size` (choice) — CTA Size [when cta_type NOT_EQUAL none] [required]
- `column.cta.add_icon` (boolean) — Add icon [when cta_type NOT_EQUAL cta]
- `column.cta.icon.icon` (icon) — Icon [required]
- `column.cta.icon.position` (choice) — Position [required]
- `column.cta.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
