# SR Cards Articles 01

**Slug:** `sr-cards-articles-01`
**HubSpot module ID:** 210345399111
**Inferred category:** Cards
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Cards Articles 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.slide_styles** (group) — Slider Styles
    - **slide_styles.slides_to_show** (group) — Slides To Show
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **readmore** (group) — Button
  - **readmore.default** (group — when readmore.cta_style EQUAL custom) — Default
  - **readmore.hover** (group — when readmore.cta_style EQUAL custom) — Hover
  - **readmore.icon** (group — when readmore.cta_type NOT_EQUAL cta AND readmore.add_icon EQUAL true) — Icon

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `slides_to_show.xl` (number) — XL
- `slides_to_show.lg` (number) — Desktop
- `slides_to_show.md` (number) — Tablet
- `slides_to_show.sm` (number) — Mobile
- `slide_styles.arrow_left` (icon) — Arrow Left Icon [when arrows EQUAL true]
- `slide_styles.arrow_right` (icon) — Arrow Right Icon [when arrows EQUAL true]
- `slide_styles.arrow_color` (color) — Arrows Color [when arrows EQUAL true]
- `slide_styles.dots_color` (color) — Dots Color [when dots EQUAL true]
- `slide_styles.dots_color_default` (color) — Dots Color(Default) [when dots EQUAL true]
- `design_settings.slide_styles.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
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
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.card_background_color` (choice) — Card Background Color [required]
- `design_settings.card_background_custom` (color) — Card Background Color [when design_settings.card_background_color EQUAL custom] — _For transparent images or before the image/video loads_
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
- `e834db44-19cf-1c7e-dc5f-414c50b087e4` (boolean) — Manually Select posts
- `e4b8bc40-934c-bc55-16b2-1078f27ecd76` (blog) — Blog [when manually_select_posts NOT_EQUAL true]
- `ec81940b-8e42-1b9a-0cfa-1bee032fdd94` (tag) — Tag [when manually_select_posts NOT_EQUAL true]
- `b983c30c-20b1-1a6f-983b-4140d6f9e925` (page) — Blog Post [when manually_select_posts EQUAL true] — _Select the blog post you want to display_
- `readmore.cta_type` (choice) — CTA Type [required]
- `readmore.cta_style` (choice) — CTA Style [when readmore.cta_type NOT_EQUAL none] [required]
- `readmore.default.background` (color) — Background
- `readmore.default.text` (color) — Text
- `readmore.default.border` (color) — Border
- `readmore.hover.background` (color) — Background
- `readmore.hover.text` (color) — Text
- `readmore.hover.border` (color) — Border Color
- `readmore.button_text` (text) — Button Text [when readmore.cta_type MATCHES_REGEX btn|modal]
- `readmore.link` (link) — Link [when readmore.cta_type EQUAL btn]
- `cta.cta_size` (choice) — CTA Size [when readmore.cta_type NOT_EQUAL none] [required]
- `readmore.add_icon` (boolean) — Add icon [when readmore.cta_type NOT_EQUAL cta]
- `readmore.icon.icon` (icon) — Icon [required]
- `readmore.icon.position` (choice) — Position [required]
- `readmore.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `e73c2d40-6f89-db0b-a368-752f4027bbb6` (number) — Number of Posts
- `blog_summary` (choice) — Blog Summary — _Use the meta description option if there are issues pulling in the summary, as the summary can contain HTML and/or modules._
- `99598ee5-3e1e-375f-05ed-46c60260842d` (boolean) — Show Author
- `eefe03ca-ea49-7afc-c5b0-8efd823befbe` (boolean) — Show Tags
- `33f086c7-41dd-a4f0-8dfb-e9be22b017c7` (boolean) — Dots
- `63a50d0a-0c8d-4689-34d2-38a614f13206` (boolean) — Arrows
- `dbf95792-1f00-b43e-7ade-43aca35a2bfb` (boolean) — Autoplay
- `e4e91ff5-7fa2-3356-c2c6-d8acb86697ff` (number) — Autoplay Speed [when dbf95792-1f00-b43e-7ade-43aca35a2bfb EQUAL true]
