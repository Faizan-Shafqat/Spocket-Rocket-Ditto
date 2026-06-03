# SR Locations 01

**Slug:** `sr-locations-01`
**HubSpot module ID:** 210345737864
**Inferred category:** Locations
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Locations 01.module`

## Notable defaults
- design_settings.map_styles.background_option: default background: color
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **map_styles** (group) — Map Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **5567da39-f175-1ff0-983c-59c716b20cc6** (group) — Heading

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `a7e1e220-7167-f1f2-14c9-39dd7bea5605` (color) — Dot Color
- `design_settings.map_styles.background_option` (choice) — Background Option [required]
- `design_settings.map_styles.background_color` (choice) — Background Color [when design_settings.map_styles.background_option EQUAL color] [required]
- `design_settings.map_styles.background_custom` (color) — Background Color [when design_settings.map_styles.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.map_styles.background_gradient` (gradient) — Background Gradient [when design_settings.map_styles.background_option EQUAL gradient]
- `design_settings.map_styles.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.map_styles.text_color_custom` (color) — Text Color [when design_settings.map_styles.text_color EQUAL custom]
- `design_settings.map_styles.border` (border) — Border
- `0a9b3d7e-00c6-a5f7-a48b-e11359d02d2a` (number) — Border Radius
- `ctas.cta_style` (choice) — CTA Style [required]
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
- `21e21b0c-dcb6-e065-e62a-4423ed80f9ea` (hubdbtable) — HubDB table
- `0c2b55ea-538f-4c82-b936-84bd4de265b3` (text) — Heading
- `8e0807de-b957-9563-fafd-7b873fcd03e9` (choice) — Heading Size [required] — _HTML heading size_
- `5cd51cb9-37a9-d1ba-7d46-b6f58f3b6877` (choice) — Heading Display Size — _Size that heading is displayed at_
- `45ee84fb-6a77-3c0a-4039-fdc7a5a8db22` (choice) — Heading Color [required]
- `58cf0f57-2f1d-528c-03e7-39eb3d71d23f` (color) — Heading Color [when 45ee84fb-6a77-3c0a-4039-fdc7a5a8db22 EQUAL custom]
- `1ce809a4-6fc3-0c19-49ce-ff8cb20ffcec` (choice) — Heading Align
- `e74543de-011a-a848-d530-a799854b5822` (richtext) — Description
- `8100d0b7-566c-0c50-4779-678e745a32df` (boolean) — Lead Text — _Turn on to make the Description text larger_
