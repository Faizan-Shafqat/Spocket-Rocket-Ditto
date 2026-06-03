# SR Offer Two Col 02

**Slug:** `sr-offer-two-col-02`
**HubSpot module ID:** 210345441543
**Inferred category:** Multi-column section
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Offer Two Col 02.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **form** (group) — Form
  - **form.styles** (group) — Styles
    - **form.styles.fields** (group) — Fields
    - **form.styles.button** (group) — Button
    - **form.styles.padding** (group) — Padding
    - **form.styles.border** (group) — Border
    - **column.form.styles.shadow** (group) — Shadow
  - **form_heading** (group) — Heading

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
- `image` (image) — Image
- `image_corner_radius` (number) — Image Corner Radius
- `form.enabled` (boolean) — Enabled
- `form.lazy_load` (boolean) — Lazy Load — _To use this feature, you must have either Marketing Hub or Content Hub Professional or Enterprise, and you need to enable the "Set as raw…_
- `form.form_height` (number) — Form Height [when form.lazy_load EQUAL true]
- `form.styles.background_color` (color) — Background Color
- `form.styles.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `form.styles.text_color_custom` (color) — Text Color [when form.styles.text_color EQUAL custom]
- `form.styles.hide_label` (boolean) — Hide Field Labels
- `form.styles.fields.style` (choice) — Style [required]
- `form.styles.fields.height` (number) — Height [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.background_color` (color) — Background Color [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.border_color` (color) — Border Color [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.size` (number) — Size [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.radius` (number) — Radius [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.focus` (color) — Focus [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.field_color` (color) — Field Color [when form.styles.fields.style EQUAL custom]
- `form.styles.fields.placeholder` (color) — Placeholder [when form.styles.fields.style EQUAL custom]
- `form.styles.button.style` (choice) — Style [required]
- `form.styles.button.size` (choice) — Size [required]
- `form.styles.button.align` (choice) — Align [when form.styles.button.block EQUAL false] [required]
- `form.styles.button.block` (boolean) — Full Width
- `form.styles.padding.top` (number) — Top 
- `form.styles.padding.bottom` (number) — Bottom 
- `form.styles.padding.left` (number) — Left
- `form.styles.padding.right` (number) — Right 
- `form.styles.border.style` (choice) — Style [required]
- `form.styles.border.color` (color) — Color [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.width` (number) — Width [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.radius` (number) — Radius [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.top` (boolean) — Top [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.bottom` (boolean) — Bottom [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.left` (boolean) — Left [when form.styles.border.style NOT_EQUAL none]
- `form.styles.border.right` (boolean) — Right [when form.styles.border.style NOT_EQUAL none]
- `column.shadow` (boolean) — Shadow
- `column.shadow.horizontal` (number) — Horizontal [when column.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `column.shadow.vertical` (number) — Vertical [when column.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `column.shadow.blur` (number) — Blur [when column.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `column.shadow.spread` (number) — Spread [when column.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `column.shadow.inset` (boolean) — Inset [when column.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `column.shadow.color` (color) — Color [when column.shadow EQUAL true] — _The color of the shadow_
- `form_heading.heading` (text) — Heading
- `form_heading.heading_size` (choice) — Heading Size [required] — _HTML heading size_
- `form_heading.heading_display_size` (choice) — Heading Display Size [required] — _Size that heading is displayed at_
- `form_heading.heading_color` (choice) — Heading Color [required]
- `form_heading.heading_color_custom` (color) — Heading Color [when form_heading.heading_color EQUAL custom]
- `form_heading.heading_align` (choice) — Heading Align [required]
- `form.form_heading.class` (text) — CSS Class
- `form.description` (richtext) — Description
- `form.lead_text` (boolean) — Lead Text [when form.description EQUAL null] — _Turn on to make the Description text larger_
- `form.form` (form) — Form
- `form.notifications_are_overridden` (boolean) — Send form notifications to specified email addresses instead of the form defaults [when form.form MATCHES_REGEX ^((?!\"form_type\":\"TICKET_FORM\").)*$]
- `form.notifications_override_email_addresses` (email) — Email Addresses [when form.notifications_are_overridden MATCHES_REGEX true]
- `form.sfdc_campaign` (salesforcecampaign) — Salesforce campaign
