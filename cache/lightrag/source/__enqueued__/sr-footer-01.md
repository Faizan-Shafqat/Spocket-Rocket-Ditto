# SR Footer 01

**Slug:** `sr-footer-01`
**HubSpot module ID:** 210345737830
**Inferred category:** Footer
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Footer 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **2a9bdf6d-055b-0d35-0680-b7436e77cd40** (group) — Layout Options
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **e902f670-19a5-82a0-384e-c2faa3ed70df** (group) — Slogan
- **social_icons** (group) — Social Icons
- **961ce4b7-c7fe-a46f-e2e7-17a44d6c6660** (group — when 151ab520-6689-497f-0e2d-7075f523a6b5 EQUAL true) — Back To Top Button

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `4e18f363-98d9-096d-055f-ad8596c8fe85` (choice) — Column Layout [required]
- `7d637df2-79fb-b684-8963-9520176e0a00` (choice) — Logo and Social Icons Alignment [required]
- `f95e30ad-daae-62a4-d572-0c4f52a831fb` (choice) — Menu Alignment [required]
- `19415edd-9dd6-18cf-08a6-24b30cc85620` (choice) — Menu Text Alignment [required]
- `f36e3eff-a3a7-9c31-2224-233ff6fd3115` (choice) — Menu Layout (Mobile) [required]
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
- `design_settings.border_color` (color) — Border Color
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
- `logo` (image) — Logo
- `logo_link` (link) — Logo Link [when logo NOT_EMPTY null]
- `d44e5325-eb4d-7b88-7960-b4ae20a7126b` (text) — Heading
- `e605795d-8b1c-1292-9e30-ec94c60ab227` (choice) — Size [required]
- `1fb0e80f-f3cf-5830-e00e-327a67d3dfe4` (choice) — Display Size [required]
- `1c62d2f6-030b-ee0b-f7ec-e425d8379a58` (choice) — Color [required]
- `3c8d6bb3-08f6-1bea-85c9-6139c517c9c8` (color) — Color [when 1c62d2f6-030b-ee0b-f7ec-e425d8379a58 EQUAL custom]
- `9893de08-11f0-877b-4fcb-41eadba22c2c` (choice) — Align [required]
- `223f1715-d1ec-ffa3-4f35-f45263c50e9f` (text) — CSS Class
- `menu` (menu) — Menu
- `copyright` (richtext) — Copyright
- `social_icons.type` (choice) — Type [required]
- `icon` (icon) — Icon [when social_icons.type EQUAL icon]
- `social_icons.custom_icon` (image) — Custom Icon [when social_icons.type EQUAL image]
- `link` (link) — Link
- `social_icons.aria_label` (text) — Aria Label — _The aria-label attribute is used on links that have no accessible name to give it meaning to screen readers._
- `social_icons.background_color` (color) — Background Color [when social_icons.type EQUAL icon]
- `social_icons.icon_color` (color) — Icon Color [when social_icons.type EQUAL icon]
- `social_icons.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `151ab520-6689-497f-0e2d-7075f523a6b5` (boolean) — Enable Back To Top Button
- `90fc3199-17ac-f93f-ae2b-56517f55801a` (choice) — Button Color [required]
- `497c962a-afdd-6b09-5f47-a3ef2bb667ab` (color) — Button Color [when 90fc3199-17ac-f93f-ae2b-56517f55801a EQUAL custom]
- `28d3dc8e-c418-e6fe-6b96-1ef1a9e4ad27` (icon) — Icon
- `b62ca1f3-970f-5063-7fd1-6eae2e1219ec` (choice) — Icon Color [required]
- `09b685b2-3070-1eab-c1a3-6fd29be2323f` (color) — Icon Color [when b62ca1f3-970f-5063-7fd1-6eae2e1219ec EQUAL custom]
- `3cec2784-2471-e6a8-ebdd-c0f79a89aedc` (text) — Page Target
- `961ce4b7-c7fe-a46f-e2e7-17a44d6c6660.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
