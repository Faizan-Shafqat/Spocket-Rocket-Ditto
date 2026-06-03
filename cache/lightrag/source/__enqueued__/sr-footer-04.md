# SR Footer 04

**Slug:** `sr-footer-04`
**HubSpot module ID:** 210345399184
**Inferred category:** Footer
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Footer 04.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **e902f670-19a5-82a0-384e-c2faa3ed70df** (group) — Slogan
- **social_icons** (group — repeater(default=5, max=∞)) — Social Icons
- **9e177cdf-4a1a-3939-dbd1-75cd8114b70c** (group — when 7765022b-d985-9756-09ce-cf9d23063e19 EQUAL true) — Back To Top Button

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
- `design_settings.background_image` (backgroundimage) — Background Image [when design_settings.background_option EQUAL image] — _Source for background image or before the video loads_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `55dae192-52b3-3761-a0c8-9db877e521c7` (color) — Top Link Color [when design_settings.text_color EQUAL custom]
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `15504392-e1ec-75a4-726c-2ba3ac471e1f` (color) — Link Hover Color [when design_settings.text_color EQUAL custom]
- `design_settings.border` (border) — Border
- `design_settings.responsive_settings.tablet.tablet_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.tablet.tablet_spacing` (spacing) — Tablet Spacing [when design_settings.responsive_settings.tablet.tablet_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.tablet.tablet_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.tablet.tablet_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.tablet.tablet_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.tablet.tablet_background_color` (choice) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.tablet.tablet_background_custom` (color) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.tablet.tablet_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `design_settings.responsive_settings.tablet.tablet_fixed_background` (boolean) — Fixed Background [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video]
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.mobile.mobile_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color] [required]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `logo` (image) — Logo — _Recommended Minimum Size: 440x102px_
- `logo_link` (link) — Logo Link [when logo NOT_EMPTY null]
- `d44e5325-eb4d-7b88-7960-b4ae20a7126b` (text) — Heading
- `e605795d-8b1c-1292-9e30-ec94c60ab227` (choice) — Size [required]
- `1fb0e80f-f3cf-5830-e00e-327a67d3dfe4` (choice) — Display Size [required]
- `1c62d2f6-030b-ee0b-f7ec-e425d8379a58` (choice) — Color [required]
- `3c8d6bb3-08f6-1bea-85c9-6139c517c9c8` (color) — Color [when 1c62d2f6-030b-ee0b-f7ec-e425d8379a58 EQUAL custom]
- `9893de08-11f0-877b-4fcb-41eadba22c2c` (choice) — Align [required]
- `223f1715-d1ec-ffa3-4f35-f45263c50e9f` (text) — CSS Class
- `logo_align` (choice) — Logo Align [when logo NOT_EMPTY null] [required]
- `show_menu` (boolean) — Show Menu
- `menu` (menu) — Menu [when show_menu EQUAL true]
- `menu_align` (choice) — Menu Align [when show_menu EQUAL true] [required]
- `menu_depth` (number) — Menu Depth
- `copyright` (richtext) — Copyright
- `social_icons.type` (choice) — Type [required]
- `icon` (icon) — Icon [when social_icons.type EQUAL icon]
- `social_icons.custom_icon` (image) — Custom Icon [when social_icons.type EQUAL image]
- `link` (link) — Link
- `social_icons.aria_label` (text) — Aria Label — _The aria-label attribute is used on links that have no accessible name to give it meaning to screen readers._
- `social_icons.background_color` (color) — Background Color [when social_icons.type EQUAL icon]
- `social_icons.icon_color` (color) — Icon Color [when social_icons.type EQUAL icon]
- `social_icons.background_color_hover` (color) — Background Color Hover [when social_icons.type EQUAL icon]
- `social_icons.icon_color_hover` (color) — Icon Color Hover [when social_icons.type EQUAL icon]
- `social_icons.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `7765022b-d985-9756-09ce-cf9d23063e19` (boolean) — Enable Back To Top Button
- `6eead708-ddb4-c78b-f7bf-9b0d358c5490` (choice) — Button Color [required]
- `3e97da3d-059d-91d4-f3c1-e03bb07ea504` (color) — Button Color [when 6eead708-ddb4-c78b-f7bf-9b0d358c5490 EQUAL custom]
- `24a440ad-defc-dd5e-ff8e-fc6ddacc5a24` (icon) — Icon
- `be896d2d-e67f-627d-6a26-312222267c73` (choice) — Icon Color [required]
- `ce4e377c-ec45-f849-7b39-a4ddc60550b5` (color) — Icon Color [when be896d2d-e67f-627d-6a26-312222267c73 EQUAL custom]
- `38add721-b672-5215-2edb-0844bf54cdd6` (text) — Page Target
- `9e177cdf-4a1a-3939-dbd1-75cd8114b70c.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
