# SR Two Col 10

**Slug:** `sr-two-col-10`
**HubSpot module ID:** 210344001589
**Inferred category:** Multi-column section
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Two Col 10.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **1** (group) — Media
  - **column.video** (group — when media_type EQUAL video) — Video
    - **style_options** (group) — Style Options
    - **placeholder_fields** (group) — Placeholder text
- **2** (group) — Content
  - **content.video** (group — when content_media_type EQUAL video) — Video
    - **content_style_options** (group) — Style Options
    - **content_placeholder_fields** (group) — Placeholder text
  - **content_heading** (group — repeater(default=2, max=∞)) — Heading
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
- `media_type` (choice) — Media Type [required]
- `column.image` (image) — Image [when media_type EQUAL image]
- `video_type` (choice) — Video type [when null EQUAL null OR video_type EQUAL hubspot_video]
- `hubspot_video` (videoplayer) — HubSpot Video [when video_type EQUAL hubspot_video]
- `embed_field` (embed) — Embed [when video_type EQUAL embed]
- `oembed_thumbnail` (image) — Custom Thumbnail [when video_type EQUAL embed AND embed_field MATCHES_REGEX (?=.*"source_type":"oembed") AND embed_field MATCHES_REGEX (?=.*"oembed_url":"(?!")+)]
- `content_style_options.oembed_thumbnail_play_button_color` (color) — Play button color
- `placeholder_fields.placeholder_title` (text) — Video placeholder title
- `placeholder_fields.placeholder_description` (text) — Video placeholder description
- `html_video` (file/file) — Video File [when video_type EQUAL html_video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `video_poster` (image) — Video Poster [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `show_controls` (boolean) — Show Controls [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `autoplay` (boolean) — Autoplay [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `loop` (boolean) — Loop [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `muted` (boolean) — Muted [when video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `content_media_type` (choice) — Media Type [required]
- `column.content_image` (image) — Image [when content_media_type EQUAL image]
- `content_video_type` (choice) — Video type [when null EQUAL null OR content_video_type EQUAL hubspot_video]
- `content_hubspot_video` (videoplayer) — HubSpot Video [when content_video_type EQUAL hubspot_video]
- `content_embed_field` (embed) — Embed [when content_video_type EQUAL embed]
- `content_oembed_thumbnail` (image) — Custom Thumbnail [when content_video_type EQUAL embed AND embed_field MATCHES_REGEX (?=.*"source_type":"oembed") AND embed_field MATCHES_REGEX (?=.*"oembed_url":"(?!")+)]
- `style_options.oembed_thumbnail_play_button_color` (color) — Play button color
- `content_placeholder_fields.placeholder_title` (text) — Video placeholder title
- `content_placeholder_fields.placeholder_description` (text) — Video placeholder description
- `content_html_video` (file/file) — Video File [when content_video_type EQUAL html_video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `content_video_poster` (image) — Video Poster [when content_video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `content_show_controls` (boolean) — Show Controls [when content_video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `content_autoplay` (boolean) — Autoplay [when content_video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `content_loop` (boolean) — Loop [when content_video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `content_muted` (boolean) — Muted [when content_video_type EQUAL html_video AND html_video NOT_EMPTY null]
- `column.lottie_embed_code` (text) — Lottie Embed Code [when content_media_type EQUAL lottie]
- `content_heading_heading` (text) — Heading
- `content_heading_size` (choice) — Size [required] — _HTML heading size_
- `content_heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `content_heading_color` (choice) — Color [required]
- `content.heading.heading_color_custom` (color) — Color [when content_heading_color EQUAL custom]
- `content_heading.heading_align` (choice) — Align [required]
- `content.heading.class` (text) — CSS Class
- `column.description` (richtext) — Description
- `column.lead_text` (boolean) — Lead Text — _Turn on to make the content text larger_
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
- `column.text_align` (choice) — Text Align [required]
- `column.text_color` (choice) — Text Color [required]
- `colum_order` (choice) — Column Order [required]
