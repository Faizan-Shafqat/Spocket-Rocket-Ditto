# SR Cards Flip 01

**Slug:** `sr-cards-flip-01`
**HubSpot module ID:** 210348825643
**Inferred category:** Cards
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Cards Flip 01.module`

## Notable defaults
- design_settings.background_option: default background: image

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.column_styles** (group) — Card Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **heading** (group) — Heading
- **card_details** (group — repeater(default=6, max=∞)) — Cards
  - **48019608-dc0d-4db1-599a-7c00dbfcdfbe** (group) — Default
    - **bd7a565f-0627-c959-5a84-481884432f87** (group) — Heading
  - **749530cd-a716-0251-90f9-6c0d8e3ecd9b** (group) — Active
    - **card_heading** (group) — Heading
    - **ctas** (group) — CTA
      - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
      - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
      - **ctas.icon** (group — when ctas.cta_type NOT_EQUAL cta AND ctas.add_icon EQUAL true) — Icon
- **col_size** (group — repeater(default=3, max=4)) — Column Size

## Fields
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `card_styles.trigger_type` (choice) — Trigger Type [required]
- `column_styles.background_color` (choice) — Background Color [required]
- `column_styles.background_custom` (color) — Background Color [when column_styles.background_color EQUAL custom]
- `column_styles.background_gradient` (gradient) — Gradient [when column_styles.background_color EQUAL gradient]
- `column_styles.background_color_active` (choice) — Background Color (Active) [required]
- `column_styles.background_custom_active` (color) — Background Color (Active) [when column_styles.background_color_active EQUAL custom]
- `column_styles.background_gradient_active` (gradient) — Gradient (Active) [when column_styles.background_color_active EQUAL gradient]
- `column_styles.text_color` (choice) — Text Color [required]
- `column_styles.text_color_custom` (color) — Text Color [when column_styles.text_color EQUAL custom]
- `column_styles.text_color_active` (choice) — Text Color (Active) [required]
- `column_styles.text_color_custom_active` (color) — Text Color (Active) [when column_styles.text_color_active EQUAL custom]
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
- `column_styles.text_alignment` (textalignment) — Text Alignment
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
- `card_details.card_image` (image) — Image
- `92aaeacb-22ae-6839-0d40-40aa7695bc39` (text) — Card Heading
- `d2fbe2d1-853d-b103-3443-5f37353ec5e8` (choice) — Card Heading Size [required] — _HTML heading size_
- `c678a591-8eb0-7fd3-a68c-812edfd85086` (choice) — Card Heading Display Size [required] — _Size that heading is displayed at_
- `c080389e-f605-640f-4eb4-e2847297db2e` (choice) — Card Heading Color
- `1943c8ec-a860-5515-d324-dae3cd9a3cec` (color) — Card Heading Color [when c080389e-f605-640f-4eb4-e2847297db2e EQUAL custom]
- `4cf0e3e1-c5d9-d88c-1e40-c76232072040` (choice) — Card Heading Align [required]
- `1551d9a4-b753-089e-f17f-7c3f57fdd102` (text) — CSS Class
- `15aab630-d34a-a0b3-3644-636dc573d80f` (richtext) — Description
- `38f690a1-1954-8cf5-c2c0-ded97d386119` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `card_heading.heading` (text) — Card Heading
- `card_heading.heading_size` (choice) — Card Heading Size [required] — _HTML heading size_
- `card_heading.heading_display_size` (choice) — Card Heading Display Size [required] — _Size that heading is displayed at_
- `card_heading.heading_color` (choice) — Card Heading Color
- `card_heading.heading_color_custom` (color) — Card Heading Color [when card_heading.heading_color EQUAL custom]
- `card_heading.heading_align` (choice) — Card Heading Align [required]
- `card_details.card_heading.class` (text) — CSS Class
- `card_details.card_description` (richtext) — Description
- `card_details.lead_text` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `ctas.cta_type` (choice) — CTA Type [required]
- `ctas.cta_style` (choice) — CTA Style [when ctas.cta_type NOT_EQUAL none] [required]
- `card_details.active.ctas.default.background` (color) — Background
- `card_details.active.ctas.default.text` (color) — Text
- `card_details.active.ctas.default.border` (color) — Border
- `card_details.active.ctas.hover.background` (color) — Background
- `card_details.active.ctas.hover.text` (color) — Text
- `card_details.active.ctas.hover.border` (color) — Border Color
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
- `column.column_size.column_breakpoint` (choice) — Column Breakpoint
- `column.column_size.column_width` (choice) — Column Width [required]
- `column.column_size.column_offset` (choice) — Column Offset [required]
- `column.column_size.column_order` (number) — Column Order
- `ece894b9-1f1f-baa5-4c36-87b90213b670` (choice) — Column Vertical Align [required]
