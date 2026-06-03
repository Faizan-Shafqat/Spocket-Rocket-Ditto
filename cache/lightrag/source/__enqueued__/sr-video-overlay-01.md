# SR Video Overlay 01

**Slug:** `sr-video-overlay-01`
**HubSpot module ID:** 210349901971
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Video Overlay 01.module`

## Notable defaults
- design_settings.background_option: default background: image

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **ctas** (group) — CTA
  - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
  - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
  - **ctas.icon** (group — when ctas.cta_type NOT_EQUAL cta AND ctas.add_icon EQUAL true) — Icon
- **302080e1-37e7-732a-90e9-2c08aa1ad8b6** (group) — Play Icon
- **video** (group) — Modal Video
  - **style_options** (group) — Style Options
  - **placeholder_fields** (group) — Placeholder text
  - **03ae3fe7-7c27-a26b-cf89-dde2bc3019b9** (group) — Close Icon

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
- `cta.payment` (payment) — Payment link [when ctas.cta_type EQUAL hs_payment]
- `cta.checkout_location` (choice) — Checkout behavior [when cta.payment MATCHES_REGEX id":\d+ AND ctas.cta_type EQUAL hs_payment]
- `ctas.cta_size` (choice) — CTA Size [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.add_icon` (boolean) — Add icon [when ctas.cta_type NOT_EQUAL cta]
- `ctas.icon.icon` (icon) — Icon [required]
- `ctas.icon.position` (choice) — Position [required]
- `ctas.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `play_icon.icon_type` (choice) — Icon Type [required]
- `play_icon.image` (image) — Image [when play_icon.icon_type EQUAL image]
- `play_icon.icon` (icon) — Icon [when play_icon.icon_type EQUAL icon]
- `play_icon.icon_color` (color) — Icon Color [when play_icon.icon_type EQUAL icon]
- `play_icon.icon_background` (color) — Icon Background [when play_icon.icon_type EQUAL icon]
- `play_icon.html` (text) — HTML [when play_icon.icon_type EQUAL custom]
- `play_icon.icon_size` (number) — Icon Size [when play_icon.icon_type NOT_EQUAL none]
- `play_icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `video_type` (choice) — Video type [when null EQUAL null OR video_type EQUAL hubspot_video]
- `hubspot_video` (videoplayer) — HubSpot Video [when video_type EQUAL hubspot_video]
- `embed_field` (embed) — Embed [when video_type EQUAL embed]
- `oembed_thumbnail` (image) — Custom Thumbnail [when video_type EQUAL embed AND embed_field MATCHES_REGEX (?=.*"source_type":"oembed") AND embed_field MATCHES_REGEX (?=.*"oembed_url":"(?!")+)]
- `style_options.oembed_thumbnail_play_button_color` (color) — Play button color
- `placeholder_fields.placeholder_title` (text) — Video placeholder title
- `placeholder_fields.placeholder_description` (text) — Video placeholder description
- `html_video` (file/file) — Video File [when video_type EQUAL html_video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `video_poster` (image) — Video Poster [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `show_controls` (boolean) — Show Controls [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `autoplay` (boolean) — Autoplay [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `loop` (boolean) — Loop [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `muted` (boolean) — Muted [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `95a378f9-e677-2b4e-65ce-6888c52238d4` (icon) — Close Icon
- `3288a8f0-94b3-96f8-21f3-48a9c35ba8d1` (color) — Background
- `7c8cfdca-1ebb-1a57-7d2a-bdfb135b553b` (color) — Icon color
- `03ae3fe7-7c27-a26b-cf89-dde2bc3019b9.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
