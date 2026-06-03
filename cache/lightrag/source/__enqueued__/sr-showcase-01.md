# SR Showcase 01

**Slug:** `sr-showcase-01`
**HubSpot module ID:** 210345737996
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Showcase 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **13174d0b-4e49-2970-f79a-f1e4070b5ba0** (group) — Heading
- **a0e2aeed-5415-5628-ac65-b088d15713e7** (group — repeater(default=9, max=∞)) — Items
  - **ad38e77f-3174-73f5-76d6-2675d5600b6f** (group) — Card
  - **cd4f9f4e-b9fb-fe76-2887-ef48aad7c6d5** (group) — Modal
    - **ctas2** (group — repeater(default=2, max=2)) — CTA
      - **ctas2.default** (group — when ctas2.cta_style EQUAL custom) — Default
      - **ctas2.hover** (group — when ctas2.cta_style EQUAL custom) — Hover
      - **ctas2.icon** (group — when ctas2.cta_type NOT_EQUAL cta AND ctas2.add_icon EQUAL true) — Icon
- **ctas** (group) — CTA
  - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
  - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
  - **ctas.icon** (group — when ctas.cta_type NOT_EQUAL cta AND ctas.add_icon EQUAL true) — Icon

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `design_settings.layout` (choice) — Layout [required] — _Page: Sets a max-width at each responsive breakpoints Full Width: 100% at all breakpoints_
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
- `heading` (text) — Heading
- `heading_size` (choice) — Heading Size [when heading NOT_EMPTY null] [required]
- `heading_display_size` (choice) — Heading Display Size [when heading NOT_EMPTY null] [required]
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `heading.class` (text) — CSS Class
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `391dc4e9-5872-465e-85f4-f7eebf5de6ee` (text) — Title
- `29bd6a9e-8d58-1b57-5fd2-174106a180f4` (image) — Background
- `7e422af4-4e99-f4bb-e4bb-2d3f803121fe` (boolean) — Scroll
- `d5fa18b5-7056-b974-1466-b3b989bb55d2` (text) — Button Text
- `15506932-7fe3-d29c-8e5c-82a50c8f52a5` (image) — Image [repeater(default=3, max=∞)]
- `43e6808f-bbf8-e84a-3c58-3e9e8caaa65b` (text) — Title
- `256f11a8-2432-bd89-df64-e034ae5bd29b` (richtext) — Rich Text
- `506f75cf-7844-f899-5849-7355177bc763` (text) — Text
- `cd01ed3d-8224-32ba-fa1f-d8eaf525bd5b` (text) — Industry
- `fa9fc206-d837-a8fb-6aea-f4e088621726` (text) — Text
- `456862b7-a7c0-c59a-2c9d-5c4dfab09ddc` (text) — Features [repeater(default=2, max=∞)]
- `ctas2.cta_type` (choice) — CTA Type [required]
- `ctas2.cta_style` (choice) — CTA Style [when ctas2.cta_type NOT_EQUAL none] [required]
- `item.modal.ctas2.default.background` (color) — Background
- `item.modal.ctas2.default.text` (color) — Text
- `item.modal.ctas2.default.border` (color) — Border
- `item.modal.ctas2.hover.background` (color) — Background
- `item.modal.ctas2.hover.text` (color) — Text
- `item.modal.ctas2.hover.border` (color) — Border Color
- `ctas2.cta` (cta) — CTA [when ctas2.cta_type EQUAL cta]
- `ctas2.button_text` (text) — Button Text [when ctas2.cta_type MATCHES_REGEX btn|modal]
- `ctas2.modal_target` (text) — Modal Target [when ctas2.cta_type EQUAL modal]
- `ctas2.link` (link) — Link [when ctas2.cta_type EQUAL btn]
- `ctas2.payment` (payment) — Payment link [when ctas2.cta_type EQUAL hs_payment]
- `ctas2.checkout_location` (choice) — Checkout behavior [when ctas2.payment MATCHES_REGEX id":\d+ AND ctas2.cta_type EQUAL hs_payment]
- `ctas2.cta_size` (choice) — CTA Size [when ctas2.cta_type NOT_EQUAL none] [required]
- `ctas2.add_icon` (boolean) — Add icon [when ctas2.cta_type NOT_EQUAL cta]
- `ctas2.icon.icon` (icon) — Icon [required]
- `ctas2.icon.position` (choice) — Position [required]
- `ctas2.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `ctas.cta_type` (choice) — CTA Type [required]
- `ctas.cta_style` (choice) — CTA Style [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.default.background` (color) — Background
- `ctas.default.text` (color) — Text
- `ctas.default.border` (color) — Border
- `ctas.hover.background` (color) — Background
- `ctas.hover.text` (color) — Text
- `ctas.hover.border` (color) — Border Color
- `ctas.cta` (cta) — CTA [when ctas.cta_type EQUAL cta]
- `ctas.button_text` (text) — Button Text [when ctas.cta_type MATCHES_REGEX btn|modal]
- `ctas.modal_target` (text) — Modal Target [when ctas.cta_type EQUAL modal]
- `ctas.link` (link) — Link [when ctas.cta_type EQUAL btn]
- `ctas.payment` (payment) — Payment link [when ctas.cta_type EQUAL hs_payment]
- `ctas.checkout_location` (choice) — Checkout behavior [when ctas.payment MATCHES_REGEX id":\d+ AND ctas.cta_type EQUAL hs_payment]
- `ctas.cta_size` (choice) — CTA Size [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.add_icon` (boolean) — Add icon [when ctas.cta_type NOT_EQUAL cta]
- `ctas.icon.icon` (icon) — Icon [required]
- `ctas.icon.position` (choice) — Position [required]
- `ctas.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
