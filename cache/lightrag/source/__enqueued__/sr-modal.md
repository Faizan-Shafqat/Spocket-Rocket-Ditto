# SR Modal

**Slug:** `sr-modal`
**HubSpot module ID:** 210345737868
**Inferred category:** Overlay (modal/notification/off-canvas)
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Modal.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
- **heading** (group) — Heading
- **cta** (group) — CTA
  - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
  - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
  - **cta.icon** (group — when cta.cta_type NOT_EQUAL cta AND cta.add_icon EQUAL true) — Icon
- **form** (group) — Form
  - **form.styles** (group) — Styles
    - **form.styles.fields** (group) — Fields
    - **form.styles.button** (group) — Button
      - **form.styles.button.default** (group — when form.styles.button.style EQUAL custom) — Default
      - **form.styles.button.hover** (group — when form.styles.button.style EQUAL custom) — Hover
    - **form.styles.padding** (group) — Padding
    - **form.styles.border** (group) — Border
  - **form_heading** (group) — Heading

## Fields
- `design_settings.modal_width` (number) — Modal Width
- `design_settings.background_option` (choice) — Background Option [required]
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `design_settings.overlay_option` (choice) — Overlay Option [required]
- `design_settings.overlay_custom` (color) — Overlay Color [when design_settings.overlay_option MATCHES_REGEX custom]
- `design_settings.overlay_gradient` (gradient) — Overlay Gradient [when design_settings.overlay_option EQUAL gradient]
- `design_settings.text_align` (textalignment) — Text Align
- `design_settings.text_color` (choice) — Text Color [required] — _Set to Auto to use the default text colorSet to Custom to set a custom text color_
- `design_settings.text_color_custom` (color) — Text Color [when design_settings.text_color EQUAL custom]
- `modal_target` (text) — Modal Target
- `image` (image) — Image
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
- `ctas.cta_style` (choice) — CTA Style [when cta.cta_type NOT_EQUAL none] [required]
- `ctas.default.background` (color) — Background
- `ctas.default.text` (color) — Text
- `ctas.default.border` (color) — Border
- `ctas.hover.background` (color) — Background
- `ctas.hover.text` (color) — Text
- `ctas.hover.border` (color) — Border Color
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
