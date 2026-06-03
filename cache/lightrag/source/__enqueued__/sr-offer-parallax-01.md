# SR Offer Parallax 01

**Slug:** `sr-offer-parallax-01`
**HubSpot module ID:** 210345737900
**Inferred category:** Offer
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Offer Parallax 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.card_styles** (group) — Card Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
      - **d47b5364-8593-d60a-2dcf-25404d82f513** (group) — Card Styles
    - **design_settings.responsive_settings.mobile** (group) — Mobile
      - **design_settings.responsive_settings.mobile.card_styles** (group) — Card Styles
- **heading** (group) — Heading
- **cta** (group) — CTA

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
- `design_settings.background_image` (backgroundimage) — Background Image [when design_settings.background_option EQUAL image] — _Source for background image or before the video loads_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `b2775136-cbf8-999c-2281-662e175a3ff5` (boolean) — Fixed Background [when design_settings.background_option EQUAL image]
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `design_settings.border` (border) — Border
- `9ef3ce9a-c12f-9603-482b-3e374421a715` (choice) — Background Color [required]
- `fa1f3d72-f1c3-c6a4-5f59-58093182f3e6` (color) — Background Color [when 9ef3ce9a-c12f-9603-482b-3e374421a715 EQUAL custom]
- `24a6a323-3493-95f5-3c54-6d2b01373f03` (gradient) — Gradient [when 9ef3ce9a-c12f-9603-482b-3e374421a715 EQUAL gradient]
- `445c9aa0-bf19-a7c0-ea6b-2bba19b4b707` (backgroundimage) — Background image [when design_settings.responsive_settings.tablet.card_styles.background_color EQUAL image]
- `e11fd7f1-1c9e-cde0-9cac-fe39299841c2` (spacing) — Spacing
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
- `design_settings.responsive_settings.mobile.card_styles.background_color` (choice) — Background Color [required]
- `design_settings.responsive_settings.mobile.card_styles.background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.card_styles.background_color EQUAL custom]
- `design_settings.responsive_settings.mobile.card_styles.background_gradient` (gradient) — Gradient [when design_settings.responsive_settings.mobile.card_styles.background_color EQUAL gradient]
- `design_settings.responsive_settings.mobile.card_styles.background_image` (backgroundimage) — Background image [when design_settings.responsive_settings.mobile.card_styles.background_color EQUAL image]
- `design_settings.responsive_settings.mobile.card_styles.spacing` (spacing) — Spacing
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
- `cta.cta_type` (choice) — CTA Type [required]
- `cta.cta_style` (choice) — CTA Style [when cta.cta_type NOT_EQUAL none] [required]
- `cta.cta` (cta) — CTA [when cta.cta_type EQUAL cta]
- `cta.button_text` (text) — Button Text [when cta.cta_type MATCHES_REGEX btn|modal]
- `cta.modal_target` (text) — Modal Target [when cta.cta_type EQUAL modal]
- `cta.link` (link) — Link [when cta.cta_type EQUAL btn]
- `cta.payment` (payment) — Payment link [when cta.cta_type EQUAL hs_payment]
- `cta.checkout_location` (choice) — Checkout behavior [when cta.payment MATCHES_REGEX id":\d+ AND cta.cta_type EQUAL hs_payment]
- `cta.cta_size` (choice) — CTA Size [when cta.cta_type NOT_EQUAL none] [required]
- `parallax_image` (image) — Parallax Image — _Recommended size: 2880x1920px_
