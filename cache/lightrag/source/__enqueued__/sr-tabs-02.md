# SR Tabs 02

**Slug:** `sr-tabs-02`
**HubSpot module ID:** 210345399307
**Inferred category:** Tabs / accordion
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Tabs 02.module`

## Notable defaults
- design_settings.background_option: default background: image

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.card_styles** (group) — Card Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **37786223-c32e-0c26-05e7-11cfce517acf** (group — repeater(default=5, max=5)) — Tabs
  - **1997a043-db73-59c8-da56-dede64571f08** (group — repeater(default=2, max=2)) — Column
    - **video** (group — when 2c71112e-e262-62b9-d99b-24a35fb67d26 EQUAL video) — Video
      - **style_options** (group) — Style Options
      - **placeholder_fields** (group) — Placeholder text
    - **4c6354c7-7ceb-64ef-6c44-97df6136d8a1** (group) — Heading
    - **ctas** (group) — CTA
      - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
      - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
      - **ctas.icon** (group — when ctas.add_icon EQUAL true) — Icon
    - **column.column_size** (group — repeater(default=1, max=4) ; when column.custom_column_size EQUAL true) — Colum Size

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `card_styles.background_color` (choice) — Background Color [required]
- `card_styles.background_gradient` (gradient) — Gradient [when card_styles.background_color EQUAL gradient]
- `card_styles.background_custom` (color) — Background Color [when card_styles.background_color EQUAL custom]
- `card_styles.text_color` (choice) — Text Color [required]
- `card_styles.text_color_custom` (color) — Text Color [when card_styles.text_color EQUAL custom]
- `card_styles.spacing` (spacing) — Spacing
- `design_settings.card_styles.border` (border) — Border
- `design_settings.card_styles.border_radius` (number) — Border Radius
- `design_settings.card_styles.shadow` (boolean) — Shadow
- `design_settings.card_styles.horizontal` (number) — Horizontal [when design_settings.card_styles.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `design_settings.card_styles.vertical` (number) — Vertical [when design_settings.card_styles.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `design_settings.card_styles.blur` (number) — Blur [when design_settings.card_styles.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `design_settings.card_styles.spread` (number) — Spread [when design_settings.card_styles.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `design_settings.card_styles.inset` (boolean) — Inset [when design_settings.card_styles.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `design_settings.card_styles.color` (color) — Color [when design_settings.card_styles.shadow EQUAL true] — _The color of the shadow_
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
- `f5e912fe-79e0-66bb-ba0b-30bcf9f68510` (choice) — Tabs Alignment [required]
- `939935fa-e015-154a-64fd-14450c513e2b` (text) — Label
- `21536181-af0c-e24b-2a01-bc066dca8cd3` (image) — Label Image
- `01620806-7194-89eb-32a4-11aebf6758c9` (image) — Label Image Hover
- `label_default_color` (choice) — Label Default Color [required]
- `label_default_custom` (color) — Label Default Color [when label_default_color EQUAL custom]
- `6880f3da-c965-491a-a9b9-d85943152fd7` (choice) — Label Hover Color [required]
- `d9c9ba84-21b7-20b3-7af6-3e811ddb911a` (color) — Label Hover Color [when 6880f3da-c965-491a-a9b9-d85943152fd7 EQUAL custom]
- `2c71112e-e262-62b9-d99b-24a35fb67d26` (choice) — Media Type [required]
- `815626e7-b4b9-375f-4223-57146d4c7dcb` (image) — Image [when 2c71112e-e262-62b9-d99b-24a35fb67d26 EQUAL image]
- `edb6920d-63cc-e9a7-af42-d4c8d905c7d8` (link) — Image Link [when 2c71112e-e262-62b9-d99b-24a35fb67d26 EQUAL image]
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
- `ba71cedb-a185-8b2c-4656-b032a9ae467d` (text) — Lottie Embed Code [when 2c71112e-e262-62b9-d99b-24a35fb67d26 EQUAL lottie]
- `cafddad6-f749-2ebf-bf8b-267457c50897` (text) — Heading
- `1aac198f-7a2e-1453-0c09-30b5a1988524` (choice) — Heading Size [required] — _HTML heading size_
- `dfde5cad-b0a9-5d8a-7c4e-36e30accbf09` (choice) — Heading Display Size [required]
- `4b219e32-2a05-3242-be6d-037a8f67a0e2` (choice) — Heading Color [required]
- `c012eed8-8310-d8dd-4878-3c1fdf4c7c5a` (color) — Heading Color [when 4b219e32-2a05-3242-be6d-037a8f67a0e2 EQUAL custom]
- `fe71f16b-f250-233f-f3b0-eeb583b250fd` (choice) — Heading Align [required]
- `tabs.column.heading.class` (text) — CSS Class
- `4f089731-adbd-a583-c1d0-309bd43d639b` (richtext) — Content
- `274f1730-18a0-aaa7-22e0-0be99653cae6` (boolean) — Lead Text
- `ctas.cta_type` (choice) — CTA Type [required]
- `ctas.cta_style` (choice) — CTA Style [when ctas.cta_type NOT_EQUAL none] [required]
- `tabs.column.ctas.default.background` (color) — Background
- `tabs.column.ctas.default.text` (color) — Text
- `tabs.column.ctas.default.border` (color) — Border
- `tabs.column.ctas.hover.background` (color) — Background
- `tabs.column.ctas.hover.text` (color) — Text
- `tabs.column.ctas.hover.border` (color) — Border Color
- `ctas.cta` (cta) — CTA [when ctas.cta_type EQUAL cta]
- `ctas.button_text` (text) — Button Text [when ctas.cta_type MATCHES_REGEX btn|modal]
- `ctas.modal_target` (text) — Modal Target [when ctas.cta_type EQUAL modal]
- `ctas.link` (link) — Link [when ctas.cta_type EQUAL btn]
- `ctas.cta_size` (choice) — CTA Size [when ctas.cta_type NOT_EQUAL none] [required]
- `ctas.add_icon` (boolean) — Add icon
- `ctas.icon.icon` (icon) — Icon [required]
- `ctas.icon.position` (choice) — Position [required]
- `ctas.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `column.custom_column_size` (boolean) — Custom Column Size
- `column.column_mobile_order` (number) — Column Mobile Order [when column.custom_column_size EQUAL false] — _Column are sorted by ascending order._
- `column.column_size.column_breakpoint` (choice) — Column Breakpoint
- `column.column_size.column_width` (choice) — Column Width [required]
- `column.column_size.column_offset` (choice) — Column Offset [required]
- `column.column_size.column_order` (number) — Column Order
- `tabs.column.class` (text) — CSS Class — _Assign a CLASS to the column_
- `e93fd421-6582-fcb1-c07f-1da6e503f7cf` (choice) — Column Vertical Align [required]
