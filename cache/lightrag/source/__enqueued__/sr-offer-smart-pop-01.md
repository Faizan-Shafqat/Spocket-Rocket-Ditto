# SR Offer Smart Pop 01

**Slug:** `sr-offer-smart-pop-01`
**HubSpot module ID:** 210345737905
**Inferred category:** Offer
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Offer Smart Pop 01.module`

## Notable defaults
- design_settings.background_option: default background: image

## Top-level groups
- **design_settings** (group) — Design Settings
- **form** (group) — Form
  - **form.styles** (group) — Styles
    - **form.styles.button** (group) — Button
      - **form.styles.button.default** (group — when form.styles.button.style EQUAL custom) — Default
      - **form.styles.button.hover** (group — when form.styles.button.style EQUAL custom) — Hover
    - **form.styles.padding** (group) — Padding
    - **form.styles.border** (group) — Border
  - **form_heading** (group) — Heading

## Fields
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `design_settings.layout` (choice) — Layout [required]
- `design_settings.container_width` (choice) — Container Width [required] — _Maximum: 100% of the container Wide: 83% of the container Narrow: 66% of the container Minimum: 50% of the container_
- `design_settings.background_option` (choice) — Background Option [required]
- `design_settings.background_image` (backgroundimage) — Background Image [when design_settings.background_option EQUAL image] — _Source for background image or before the video loads_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `b2775136-cbf8-999c-2281-662e175a3ff5` (boolean) — Fixed Background [when design_settings.background_option EQUAL image]
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `popup_teaser` (text) — Popup Teaser
- `popup_image` (image) — Popup Image — _Recommended size: 300x400px_
- `form.enabled` (boolean) — Enabled
- `form.lazy_load` (boolean) — Lazy Load — _To use this feature, you must have either Marketing Hub or Content Hub Professional or Enterprise, and you need to enable the "Set as raw…_
- `form.form_height` (number) — Form Height [when form.lazy_load EQUAL true]
- `form.styles.background_color` (color) — Background Color
- `form.styles.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `form.styles.text_color_custom` (color) — Text Color [when form.styles.text_color EQUAL custom]
- `form.styles.hide_label` (boolean) — Hide Field Labels
- `form.styles.button.style` (choice) — Style [required]
- `form.styles.button.default.background` (color) — Background
- `form.styles.button.default.text` (color) — Text
- `form.styles.button.default.border` (color) — Border
- `form.styles.button.hover.background` (color) — Background
- `form.styles.button.hover.text` (color) — Text
- `form.styles.button.hover.border` (color) — Border Color
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
- `tease_image` (boolean) — Tease Image  — _Show a portion of the image_
- `open_once` (boolean) — Open Once
- `auto_show_timer` (number) — Auto Show Popup Timer (In seconds)
