# SR Image Hotspot 01

**Slug:** `sr-image-hotspot-01`
**HubSpot module ID:** 210345399195
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Image Hotspot 01.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **1be220d1-7fba-791d-c823-1473bb553625** (group — repeater(default=3, max=∞)) — Points
  - **987cf74f-da77-1974-d707-0b2eb2bbaab3** (group) — Icon
  - **column.heading** (group) — Heading
- **design_settings** (group) — Design Settings
  - **design_settings.tooltip_styles** (group) — Tooltip Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **0fbf8a23-acc8-053b-8840-87fa7bd6e1fb** (group) — Tooltip Settings

## Fields
- `enabled` (boolean) — Enabled
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `dfc3f950-015e-4926-fd4b-9c606bc650d1` (color) — Image Overlay Color
- `7b444c4e-e5e8-1d93-bf65-29c23c751210` (image) — Image
- `edit_mode` (boolean) — Edit Mode — _This doesn't actually adjust the position of the points, it just allows you to see their coordinates. You'll need to adjust the coordinat…_
- `c25c115c-de91-5815-59dd-855093b0b4cb` (choice) — Icon Type [required]
- `dff60e47-fb33-d3d7-0ccd-aeedd234e18e` (image) — Image [when points.icon.icon_type EQUAL image]
- `90b41165-2d71-d1c9-6f24-b7338bf9ec8c` (icon) — Icon [when points.icon.icon_type EQUAL icon]
- `5aa5a209-4c45-1aed-cb1e-8ee1e41295d2` (text) — SVG Code [when points.icon.icon_type EQUAL svg]
- `0eb8945d-4b0c-7b02-3494-01abd3d0d60b` (color) — Icon Color [when points.icon.icon_type NOT_EQUAL image]
- `6ae778b0-a33d-4d26-6ce8-40e76cf1f5df` (color) — Icon Background [when points.icon.icon_type NOT_EQUAL image]
- `6ae778b0-a33d-4d26-6ce8-40e76cf1f5dd` (color) — Icon Background Hover [when points.icon.icon_type NOT_EQUAL image]
- `905c4d24-5a8c-b845-a577-d2367f3d4fe9` (number) — Icon Size [when points.icon.icon_type NOT_EQUAL image]
- `987cf74f-da77-1974-d707-0b2eb2bbaab3.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `e4bc1f7a-96a1-3cba-8d60-02d73a71f9ae` (number) — X Coordinates
- `25cae72e-364d-60ef-f07a-9923a6e59fb5` (number) — Y Coordinates — _Starting from the bottom_
- `43240aa9-cefa-fcc7-e2b6-b9493577f6e2` (choice) — Tooltip Placement [required] — _Auto will place the tooltips on the side with most space_
- `heading` (text) — Heading
- `heading_size` (choice) — Heading Size [required] — _HTML heading size_
- `heading_display_size` (choice) — Display Size [required] — _Size that heading is displayed at_
- `heading_color` (choice) — Heading Color [required]
- `column.heading.heading_color_custom` (color) — Heading Color [when heading_color EQUAL custom]
- `col_heading.heading_align` (choice) — Heading Align [required]
- `column.col_content` (richtext) — Content
- `column.lead_text` (boolean) — Lead Text — _Turn on to make the content text larger_
- `b62275fe-1ef0-b452-40de-b323c4e4b1eb` (number) — Width — _Specifies the maximum width of the tooltips._
- `tooltip_styles.background_color` (choice) — Background Color [required]
- `tooltip_styles.background_gradient` (gradient) — Gradient [when tooltip_styles.background_color EQUAL gradient]
- `tooltip_styles.background_custom` (color) — Background Color [when tooltip_styles.background_color EQUAL custom]
- `tooltip_styles.text_color` (choice) — Text Color [required]
- `tooltip_styles.text_color_custom` (color) — Text Color [when tooltip_styles.text_color EQUAL custom]
- `tooltip_styles.spacing` (spacing) — Spacing
- `design_settings.tooltip_styles.border` (border) — Border
- `design_settings.tooltip_styles.border_radius` (number) — Border Radius
- `design_settings.tooltip_styles.shadow` (boolean) — Shadow
- `design_settings.tooltip_styles.horizontal` (number) — Horizontal [when design_settings.tooltip_styles.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `design_settings.tooltip_styles.vertical` (number) — Vertical [when design_settings.tooltip_styles.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `design_settings.tooltip_styles.blur` (number) — Blur [when design_settings.tooltip_styles.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `design_settings.tooltip_styles.spread` (number) — Spread [when design_settings.tooltip_styles.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `design_settings.tooltip_styles.inset` (boolean) — Inset [when design_settings.tooltip_styles.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `design_settings.tooltip_styles.color` (color) — Color [when design_settings.tooltip_styles.shadow EQUAL true] — _The color of the shadow_
- `1c0f49cd-9693-9a05-5f58-cca402aec3b4` (textalignment) — Text Alignment
- `design_settings.layout` (choice) — Layout [required] — _Page: Sets a max-width at each responsive breakpoints Full Width: 100% at all breakpoints_
- `design_settings.container_width` (choice) — Container Width [required] — _Maximum: 100% of the container Wide: 83% of the container Narrow: 66% of the container Minimum: 50% of the container_
- `design_settings.top_bottom_padding` (choice) — Top Bottom Padding [required] — _Use default values: Uses any inherit padding valuesNo Padding: Set padding to 0Small: Uses a preset small paddingLarge: Uses a preset lar…_
- `design_settings.spacing` (spacing) — Spacing [when design_settings.top_bottom_padding EQUAL custom]
- `design_settings.background_option` (choice) — Background Option [required]
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.background_color` (choice) — Background Color [when design_settings.background_option EQUAL color] [required]
- `design_settings.background_custom` (color) — Background Color [when design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.background_gradient` (gradient) — Background Gradient [when design_settings.background_option EQUAL gradient]
- `design_settings.responsive_settings.tablet.tablet_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.tablet.tablet_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.tablet.tablet_spacing` (spacing) — Tablet Spacing [when design_settings.responsive_settings.tablet.tablet_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.tablet.tablet_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.tablet.tablet_background_color` (choice) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color]
- `design_settings.responsive_settings.tablet.tablet_background_custom` (color) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.tablet.tablet_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `design_settings.responsive_settings.mobile.mobile_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `d604ee0b-b522-a001-fc7a-c50813211d22` (choice) — Animation [required] — _The type of transition animation_
- `d365aba2-4868-a77b-cf92-4d12b559c810` (number) — Animation Duration — _Duration in ms of the transition animation._
- `6e5067ab-38a1-2c2e-f21b-c4e85c710711` (boolean) — Arrow — _Determines if the tooltip has an arrow._
