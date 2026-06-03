# SR Element Video

**Slug:** `sr-element-video`
**HubSpot module ID:** 210349901954
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Video.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **style_options** (group) — Style Options
- **placeholder_fields** (group) — Placeholder text

## Fields
- `design_settings.spacing` (spacing) — Spacing
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
