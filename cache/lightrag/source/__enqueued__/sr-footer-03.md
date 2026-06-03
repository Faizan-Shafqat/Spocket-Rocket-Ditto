# SR Footer 03

**Slug:** `sr-footer-03`
**HubSpot module ID:** 210345399182
**Inferred category:** Footer
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Footer 03.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **14bcde05-866d-d38a-1ceb-353a1f82877e** (group) — Layout Options
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **e902f670-19a5-82a0-384e-c2faa3ed70df** (group) — Slogan
- **social_icons** (group — repeater(default=5, max=∞)) — Social Icons
- **fd27ce3c-29bf-b68f-07e7-9712b3175b6c** (group — when 783ebf04-7a65-f2dd-932e-0f76b39f7a4d EQUAL true) — Back To Top Button

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `c10b7ecc-10ae-607c-e23b-64e53d99ffe5` (choice) — Column Layout [required]
- `c2dd7fd0-0860-79b1-dd8e-1b3fd1f9b411` (choice) — Width Ratio [when c10b7ecc-10ae-607c-e23b-64e53d99ffe5 EQUAL multi_col] [required]
- `e7ec0b01-5790-5d7d-d80a-7de2c6dcdb5d` (choice) — Logo Alignment [required]
- `eb5800c5-acb0-71ef-902a-93ce77b1c43d` (choice) — Social Alignment [when c10b7ecc-10ae-607c-e23b-64e53d99ffe5 EQUAL multi_col] [required]
- `61460170-5043-bad4-f910-9aa1a64063e4` (number) — Navigation Column [when c10b7ecc-10ae-607c-e23b-64e53d99ffe5 EQUAL multi_col] [required]
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
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_hover` (choice) — Text Color Hover [required]
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.text_color_hover_custom` (color) — Text Color Hover [when design_settings.text_color_hover EQUAL custom]
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
- `small_text` (richtext) — Copyright Text
- `783ebf04-7a65-f2dd-932e-0f76b39f7a4d` (boolean) — Enable Back To Top Button
- `618a73d5-a8b8-f06d-4e12-d9914f096848` (choice) — Button Color [required]
- `5adcb7e4-e7f0-bc46-32dc-fa3ef92bc7cf` (color) — Button Color [when 618a73d5-a8b8-f06d-4e12-d9914f096848 EQUAL custom]
- `17f7da8a-7f59-6330-2f28-db539fac57c3` (icon) — Icon
- `3cf9d9a3-df37-1128-fb5f-1d3215a2ee5c` (choice) — Icon Color [required]
- `b663f13b-09f4-0dcd-0048-a16cba2aa3a8` (color) — Icon Color [when 3cf9d9a3-df37-1128-fb5f-1d3215a2ee5c EQUAL custom]
- `4a9b8261-ef73-8e9d-8237-ddb42b065a2b` (text) — Page Target
- `fd27ce3c-29bf-b68f-07e7-9712b3175b6c.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
