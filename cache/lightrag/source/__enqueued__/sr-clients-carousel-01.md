# SR Clients Carousel 01

**Slug:** `sr-clients-carousel-01`
**HubSpot module ID:** 210349901910
**Inferred category:** Clients / logos
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Clients Carousel 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.slider_styles** (group) — Slider Styles
  - **15db38ae-f716-b71b-9177-1c48a450770c** (group) — Logo Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
      - **d47b5364-8593-d60a-2dcf-25404d82f513** (group) — Slider Styles
    - **design_settings.responsive_settings.mobile** (group) — Mobile
      - **d47b5364-8593-d60a-2dcf-25404d82f511** (group) — Slider Styles
- **heading** (group) — Heading
- **1** (group — repeater(default=5, max=∞)) — Logos
- **76aa0be2-6300-07b4-597c-c7df91cf6ee7** (group — when carousel EQUAL true) — Carousel Settings

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `slider_styles.dots_color` (color) — Dots Color [when carousel_settings.dots EQUAL true]
- `b4563a04-7102-18e8-5a88-8fb4c8236c78` (color) — Dots Color (Default) [when carousel_settings.dots EQUAL true]
- `column_styles.background_color` (choice) — Background Color [required]
- `column_styles.background_custom` (color) — Background Color [when column_styles.background_color EQUAL custom]
- `column_styles.background_gradient` (gradient) — Gradient [when column_styles.background_color EQUAL gradient]
- `column_styles.spacing` (spacing) — Spacing
- `column_styles.border` (border) — Border
- `design_settings.column_styles.border_radius` (number) — Border Radius
- `design_settings.column_styles.shadow` (boolean) — Shadow
- `design_settings.column_styles.horizontal` (number) — Horizontal [when design_settings.column_styles.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `design_settings.column_styles.vertical` (number) — Vertical [when design_settings.column_styles.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `design_settings.column_styles.blur` (number) — Blur [when design_settings.column_styles.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `design_settings.column_styles.spread` (number) — Spread [when design_settings.column_styles.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `design_settings.column_styles.inset` (boolean) — Inset [when design_settings.column_styles.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `design_settings.column_styles.color` (color) — Color [when design_settings.column_styles.shadow EQUAL true] — _The color of the shadow_
- `logos_per_row` (choice) — Logos Per Row [when carousel EQUAL false] [required]
- `df872a6d-b3b5-5242-d81f-a15af7a099d9` (choice) — Alignment [when carousel EQUAL false] [required]
- `grayscale` (choice) — Grayscale [required]
- `ac769cfb-3ea9-af55-3aa9-dc20b49d42ae` (number) — Column Gap [when carousel EQUAL false]
- `73f8bc27-0782-bfb4-88b9-78ea7a0d1d81` (number) — Row Gap [when carousel EQUAL false]
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
- `e11fd7f1-1c9e-cde0-9cac-fe39299841c2` (spacing) — Spacing
- `design_settings.responsive_settings.mobile.mobile_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.mobile.mobile_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `e11fd7f1-1c9e-cde0-9cac-fe39299841c1` (spacing) — Spacing
- `heading.heading` (text) — Heading
- `heading.heading_size` (choice) — Size [required] — _HTML heading size_
- `heading.heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading.heading_color` (choice) — Color [required]
- `heading.heading_color_custom` (color) — Color [when heading.heading_color EQUAL custom]
- `heading.heading_align` (choice) — Align [required]
- `heading.class` (text) — CSS Class
- `description` (richtext) — Description
- `lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `logos.image` (image) — Image
- `1ff0795a-dd41-5247-845f-d74396e073fd` (link) — Link
- `logos.aria_label` (text) — Aria Label — _The aria-label attribute is used on links that have no accessible name to give it meaning to screen readers._
- `carousel` (boolean) — Carousel
- `33f086c7-41dd-a4f0-8dfb-e9be22b017c7` (boolean) — Dots
- `dbf95792-1f00-b43e-7ade-43aca35a2bfb` (boolean) — Autoplay
- `dbf95792-1f00-b43e-7ade-43aca35a2bf1` (boolean) — Auto Scroll [when dbf95792-1f00-b43e-7ade-43aca35a2bfb EQUAL true] — _Continuously scrolls the carousel_
- `e4e91ff5-7fa2-3356-c2c6-d8acb86697fe` (number) — Scroll Speed [when dbf95792-1f00-b43e-7ade-43aca35a2bfb EQUAL true AND dbf95792-1f00-b43e-7ade-43aca35a2bf1 EQUAL true] — _Adjust the scroll speed: lower numbers are slower. Negative numbers reverse the scroll direction._
- `e4e91ff5-7fa2-3356-c2c6-d8acb86697ff` (number) — Autoplay Speed [when dbf95792-1f00-b43e-7ade-43aca35a2bfb EQUAL true AND dbf95792-1f00-b43e-7ade-43aca35a2bf1 EQUAL false] — _Set to 0 for continuous autoplay_
- `f1347616-f6b0-261e-f13f-4578c563ef1c` (number) — Logos to Show
