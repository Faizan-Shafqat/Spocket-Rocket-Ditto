# SR Two Col TOC 01

**Slug:** `sr-two-col-toc-01`
**HubSpot module ID:** 210345738071
**Inferred category:** Multi-column section
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Two Col TOC 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **aa9d2493-f13e-67cb-f7d0-e33b1c80ea82** (group) — TOC Styles
  - **design_settings.card_styles** (group) — Tab Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **section** (group — repeater(default=7, max=∞)) — Sections
  - **section.item** (group) — Item
    - **section.item.video** (group — when item_type EQUAL video) — Video
      - **style_options** (group) — Style Options
      - **placeholder_fields** (group) — Placeholder text
    - **cta** (group — when item_type EQUAL cta) — CTA
      - **cta.icon** (group — when cta.cta_type NOT_EQUAL cta AND cta.add_icon EQUAL true) — Icon
- **columns** (group) — Columns
  - **left_column** (group — repeater(default=1, max=4)) — TOC
  - **right_column** (group — repeater(default=1, max=4)) — Content

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `row_styles.enable_gap` (boolean) — Enable Card Gap
- `90ae2a8d-7970-cf38-9ca3-09ee8637c9f3` (choice) — Background Color [required]
- `39d49fc3-8745-4b49-6337-a797daad9465` (color) — Background Color [when 90ae2a8d-7970-cf38-9ca3-09ee8637c9f3 EQUAL custom]
- `133572b5-bdcf-521a-ed58-f4d99ccb5c21` (gradient) — Gradient [when 90ae2a8d-7970-cf38-9ca3-09ee8637c9f3 EQUAL gradient]
- `3e6c42d2-2110-623c-ef21-ca9094201cc6` (spacing) — Spacing
- `b190ece6-70a9-641d-248a-855618e8c49c` (border) — Border
- `707a4cb9-5c79-f562-99b1-63d3fca13fd6` (number) — Border Radius
- `ffbcd946-5d30-5287-49e3-bdec17f48029` (boolean) — Shadow
- `acad8277-8748-8191-a4e3-ad1d62b0e691` (number) — Horizontal [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `0766ae52-1129-8c5f-8a7d-2779b641d977` (number) — Vertical [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `6e798a11-4672-d9cb-0a49-2c2ce6b1cc99` (number) — Blur [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `3b280199-1541-c0a6-1b0a-2c2eb3728bf2` (number) — Spread [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `2b1cf631-a613-8440-0a1d-8bc7d8d3b413` (boolean) — Inset [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _Changes the shadow to an inner shadow_
- `227579cc-9c65-f1fd-48a6-b1e92070b79a` (color) — Color [when ffbcd946-5d30-5287-49e3-bdec17f48029 EQUAL true] — _The color of the shadow_
- `card_styles.background_color` (choice) — Background Color [required]
- `card_styles.background_gradient` (gradient) — Gradient [when card_styles.background_color EQUAL gradient]
- `card_styles.background_custom` (color) — Background Color [when card_styles.background_color EQUAL custom]
- `card_styles.text_color` (choice) — Text Color [required]
- `card_styles.text_color_custom` (color) — Text Color [when card_styles.text_color EQUAL custom]
- `card_styles.background_color_hover` (choice) — Background Color (Hover) [required]
- `card_styles.background_gradient_hover` (gradient) — Gradient [when card_styles.background_color_hover EQUAL gradient]
- `card_styles.background_custom_hover` (color) — Background Color (Hover) [when card_styles.background_color_hover EQUAL custom]
- `card_styles.text_color_hover` (choice) — Text Color (Hover) [required]
- `card_styles.text_color_custom_hover` (color) — Text Color (Hover) [when card_styles.text_color_hover EQUAL custom]
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
- `section.title` (text) — Title
- `item_type` (choice) — Item Type [required]
- `section.item.image` (image) — Image [when item_type EQUAL image]
- `section.item.image_link` (link) — Image Link [when item_type EQUAL image]
- `section.item.image_align` (choice) — Image Align [when item_type EQUAL image] [required]
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
- `section.rich_text` (richtext) — Rich Text [when item_type EQUAL rich_text]
- `cta.cta_type` (choice) — CTA Type [required]
- `cta.cta_style` (choice) — CTA Style [when cta.cta_type NOT_EQUAL none] [required]
- `cta.cta` (cta) — CTA [when cta.cta_type EQUAL cta]
- `cta.button_text` (text) — Button Text [when cta.cta_type MATCHES_REGEX btn|modal]
- `cta.modal_target` (text) — Modal Target [when cta.cta_type EQUAL modal]
- `cta.link` (link) — Link [when cta.cta_type EQUAL btn]
- `cta.payment` (payment) — Payment link [when cta.cta_type EQUAL hs_payment]
- `cta.checkout_location` (choice) — Checkout behavior [when cta.payment MATCHES_REGEX id":\d+ AND cta.cta_type EQUAL hs_payment]
- `cta.cta_size` (choice) — CTA Size [when cta.cta_type NOT_EQUAL none] [required]
- `cta.add_icon` (boolean) — Add icon [when cta.cta_type NOT_EQUAL cta]
- `cta.icon.icon` (icon) — Icon [required]
- `cta.icon.position` (choice) — Position [required]
- `cta.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `section.item.cta_align` (choice) — CTA Align [when item_type EQUAL cta] [required]
- `section.item.quote_name` (text) — Name [when item_type EQUAL quote]
- `section.item.quote_title` (text) — Title [when item_type EQUAL quote]
- `section.item.quote_image` (image) — Image [when item_type EQUAL quote]
- `section.item.quote_quote` (richtext) — Quote [when item_type EQUAL quote]
- `section.item.html` (text) — HTML [when item_type EQUAL html]
- `left_column.column_breakpoint` (choice) — Column Breakpoint [required]
- `left_column.column_width` (choice) — Column Width [required]
- `left_column.column_offset` (choice) — Column Offset [required]
- `left_column.column_order` (number) — Column Order
- `right_column.column_breakpoint` (choice) — Column Breakpoint [required]
- `right_column.column_width` (choice) — Column Width [required]
- `right_column.column_offset` (choice) — Column Offset [required]
- `right_column.column_order` (number) — Column Order
