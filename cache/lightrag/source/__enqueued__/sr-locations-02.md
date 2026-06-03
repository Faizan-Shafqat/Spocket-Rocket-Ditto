# SR Locations 02

**Slug:** `sr-locations-02`
**HubSpot module ID:** 210345737866
**Inferred category:** Locations
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Locations 02.module`

## Notable defaults
- design_settings.background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
  - **map_styles** (group) — Map Styles
  - **design_settings.responsive_settings** (group) — Responsive Settings
    - **design_settings.responsive_settings.tablet** (group) — Tablet
    - **design_settings.responsive_settings.mobile** (group) — Mobile
- **5567da39-f175-1ff0-983c-59c716b20cc6** (group) — Heading
- **9e323ad3-8bba-99f6-efc7-8e7189acc6fb** (group — repeater(default=5, max=∞)) — Points
  - **4b183013-54d4-f17b-057a-12ff92a4f7c2** (group — repeater(default=2, max=∞)) — Heading
  - **cta** (group) — CTA
- **5a791f12-632d-5185-8220-7c8221f29757** (group) — Tooltip Settings

## Fields
- `enabled` (boolean) — Enabled
- `background_video` (file/video) — Background Video [when design_settings.background_option EQUAL video] — _Add multiple file formats in order to provide compatibility with a broad range of browsers_
- `background_video_md` (file/video) — Background Video Tablet [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on tablet devices_
- `background_video_sm` (file/video) — Background Video Mobile [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX video] — _This background video will only be used on mobile devices_
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `b62275fe-1ef0-b452-40de-b323c4e4b1eb` (number) — Tooltip Width — _Specifies the maximum width of the tooltips._
- `c329a76c-ae28-9e8b-5a5e-0a908ee75db6` (color) — Dot Color
- `map_styles.dot_size` (number) — Dot Size
- `map_styles.background_color` (choice) — Background Color [required]
- `map_styles.background_gradient` (gradient) — Gradient [when map_styles.background_color EQUAL gradient]
- `map_styles.background_custom` (color) — Background Color [when map_styles.background_color EQUAL custom]
- `map_styles.text_color` (choice) — Text Color [required]
- `map_styles.text_color_custom` (color) — Text Color [when map_styles.text_color EQUAL custom]
- `map_styles.spacing` (spacing) — Spacing
- `design_settings.map_styles.border` (border) — Border
- `design_settings.map_styles.border_radius` (number) — Border Radius
- `design_settings.map_styles.shadow` (boolean) — Shadow
- `design_settings.map_styles.horizontal` (number) — Horizontal [when design_settings.map_styles.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `design_settings.map_styles.vertical` (number) — Vertical [when design_settings.map_styles.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `design_settings.map_styles.blur` (number) — Blur [when design_settings.map_styles.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `design_settings.map_styles.spread` (number) — Spread [when design_settings.map_styles.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `design_settings.map_styles.inset` (boolean) — Inset [when design_settings.map_styles.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `design_settings.map_styles.color` (color) — Color [when design_settings.map_styles.shadow EQUAL true] — _The color of the shadow_
- `1c0f49cd-9693-9a05-5f58-cca402aec3b4` (textalignment) — Text Alignment
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
- `design_settings.responsive_settings.tablet.tablet_background_color` (choice) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color]
- `design_settings.responsive_settings.tablet.tablet_background_custom` (color) — Background Color [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.tablet.tablet_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `design_settings.responsive_settings.tablet.tablet_fixed_background` (boolean) — Fixed Background [when design_settings.responsive_settings.tablet.tablet_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video]
- `design_settings.responsive_settings.mobile.mobile_text_align` (textalignment) — Text Align
- `design_settings.responsive_settings.mobile.mobile_top_bottom_padding` (choice) — Top Bottom Padding [required]
- `design_settings.responsive_settings.mobile.mobile_spacing` (spacing) — Mobile Spacing [when design_settings.responsive_settings.mobile.mobile_top_bottom_padding EQUAL custom]
- `design_settings.responsive_settings.mobile.mobile_background_option` (choice) — Background Option [required]
- `design_settings.responsive_settings.mobile.mobile_background_image` (backgroundimage) — Background Image [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Source for background image or before the video loads_
- `design_settings.responsive_settings.mobile.mobile_background_overlay_color` (color) — Background Overlay Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX image|video] — _Overlay color on top of the image/video_
- `design_settings.responsive_settings.mobile.mobile_background_color` (choice) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX color]
- `design_settings.responsive_settings.mobile.mobile_background_custom` (color) — Background Color [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX custom|image|video] — _For transparent images or before the image/video loads_
- `design_settings.responsive_settings.mobile.mobile_background_gradient` (gradient) — Background Gradient [when design_settings.responsive_settings.mobile.mobile_background_option EQUAL custom AND design_settings.background_option MATCHES_REGEX gradient]
- `0c2b55ea-538f-4c82-b936-84bd4de265b3` (text) — Heading
- `8e0807de-b957-9563-fafd-7b873fcd03e9` (choice) — Heading Size [required] — _HTML heading size_
- `5cd51cb9-37a9-d1ba-7d46-b6f58f3b6877` (choice) — Heading Display Size — _Size that heading is displayed at_
- `45ee84fb-6a77-3c0a-4039-fdc7a5a8db22` (choice) — Heading Color [required]
- `58cf0f57-2f1d-528c-03e7-39eb3d71d23f` (color) — Heading Color [when 45ee84fb-6a77-3c0a-4039-fdc7a5a8db22 EQUAL custom]
- `1ce809a4-6fc3-0c19-49ce-ff8cb20ffcec` (choice) — Heading Align
- `e74543de-011a-a848-d530-a799854b5822` (richtext) — Description
- `8100d0b7-566c-0c50-4779-678e745a32df` (boolean) — Lead Text — _Turn on to make the Description text larger_
- `53a55a24-9d39-554a-4187-759fe47434e4` (image) — Map
- `edit_mode` (boolean) — Edit Mode — _This doesn't actually add the dots to the map, it just allows you to see their coordinates. You'll need to add the dots to the map in the…_
- `94e17aef-d439-30a4-b541-31ad26a344b5` (number) — X Coordinates
- `2764e741-2de6-37dc-b4c4-4770cbe1bca5` (number) — Y Coordinates
- `42665b08-e612-fe54-315e-50fbe5a830d7` (choice) — Tooltip Placement [required] — _Auto will place the tooltips on the side with most space_
- `fca7d602-afdd-9521-73b3-49a6a9fdf886` (image) — Image
- `7a7ca128-4c2a-7afb-f8d9-7eaba57a870a` (text) — Heading
- `35fc9c48-93cd-36d7-ff8b-281261961da1` (choice) — Heading Size [required] — _HTML heading size_
- `c2526014-afcd-43e1-4be0-371dd78a5e4a` (choice) — Heading Display Size — _Size that heading is displayed at_
- `33f7e7a7-7250-e82b-b3ae-0e48e926c208` (choice) — Heading Color [required]
- `46694038-6aa3-d5e1-2fa1-7e59f2ee3b10` (color) — Heading Color [when 33f7e7a7-7250-e82b-b3ae-0e48e926c208 EQUAL custom]
- `c1fa645f-5146-c87d-f94d-b05313ce5398` (choice) — Heading Align
- `10d68e50-6486-7852-6e5c-24462ed01241` (text) — Class
- `18e26cd2-d8db-a25b-ab36-9d9fbc17ea3f` (richtext) — Content
- `63ac2c21-c1c6-4e8d-95d0-57cc22b4eaab` (boolean) — Lead Text — _Turn on to make the content text larger_
- `cta_type` (choice) — CTA Type [required]
- `column.cta.cta_style` (choice) — CTA Style [when cta_type NOT_EQUAL none] [required]
- `column.cta.cta` (cta) — CTA [when cta_type EQUAL cta]
- `column.cta.button_text` (text) — Button Text [when cta_type MATCHES_REGEX btn|modal]
- `column.cta.link` (text) — Link [when cta_type EQUAL btn]
- `column.cta.modal_target` (text) — Modal Target [when cta_type EQUAL modal]
- `7a95da91-00c2-2add-af9b-8a3f3da347df` (choice) — Animation [required] — _The type of transition animation_
- `e3ff5cea-e859-8d3d-5cb6-a93f24734e86` (number) — Animation Duration — _Duration in ms of the transition animation._
- `6cc1a518-e0f2-719a-aaf0-8ddf0296069c` (boolean) — Arrow — _Determines if the tooltip has an arrow._
