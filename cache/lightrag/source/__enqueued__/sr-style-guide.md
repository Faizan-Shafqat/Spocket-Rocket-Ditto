# SR Style Guide

**Slug:** `sr-style-guide`
**HubSpot module ID:** 210345441565
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Style Guide.module`

## Notable defaults
- background_option: default background: color

## Top-level groups
- **design_settings** (group) — Design Settings
- **bba49a25-351e-d0bc-f642-d505faf28be3** (group) — Hero
- **dbf66418-1b1c-6fee-081e-2ca73d6b5066** (group) — Logo
- **e26113f3-c44d-b24d-5ee8-9c1b4599470c** (group) — Colors
  - **b38513aa-3ae6-121d-98cd-9c038d9e8bd2** (group) — Color
- **10615cd7-aaf9-465d-5e55-eb791da8e7f2** (group) — Typography
- **1dedb022-3f43-5945-4c4d-36a004362e32** (group) — Buttons
- **75a3a469-8b54-2d0c-5515-1532dd9ce3b0** (group) — Form
- **8804ce67-a7a1-12c1-bb4e-77da34cf588f** (group) — Custom Sections
  - **5a9b48e5-dc88-db7a-d0cf-7c9c27783bb3** (group) — Custom Section

## Fields
- `design_settings.sr_module_id` (text) — ID
- `design_settings.class` (text) — Class
- `design_settings.layout` (choice) — Layout [required]
- `design_settings.container_width` (choice) — Container Width [required]
- `background_option` (choice) — Background Option [required]
- `design_settings.background_image` (image) — Background Image [when background_option MATCHES_REGEX (image|video)] — _Recommended size: 2880x1920px | Also fallback while the video is loading_
- `design_settings.background_overlay_color` (color) — Background Overlay Color [when background_option MATCHES_REGEX (image|video)] — _Recommended Width: 2880x1920px_
- `design_settings.background_color` (choice) — Background Color [when background_option EQUAL color] [required]
- `design_settings.background_custom` (color) — Background Custom [when background_option EQUAL custom]
- `95dd27fa-501b-ac59-bc9a-4c30fe1358be` (boolean) — Enabled
- `3d1227c9-32d7-481e-b1e9-9b71725e90ce` (richtext) — Hero  [when 95dd27fa-501b-ac59-bc9a-4c30fe1358be EQUAL true]
- `ede12a7f-fd09-cfc4-3fc5-c3ea689e4102` (boolean) — Enabled
- `cdc76b95-5994-6ec2-0f7a-b2264b626bbf` (image) — Logo [when ede12a7f-fd09-cfc4-3fc5-c3ea689e4102 EQUAL true]
- `9eb19f17-d2dc-e25f-4b79-533d4e5a42e6` (richtext) — Rich text [when ede12a7f-fd09-cfc4-3fc5-c3ea689e4102 EQUAL true]
- `d180c5dc-24e9-5eb4-ec9c-eeb07133acef` (boolean) — Enabled
- `a1e6ad10-9b8f-5a62-1afc-a82d2b666ac7` (boolean) — Show Default Color [when d180c5dc-24e9-5eb4-ec9c-eeb07133acef EQUAL true]
- `843f33df-1f19-b103-a6e2-38891c005e86` (text) — Title
- `115f77eb-5d7d-1c35-6a03-91112823a5b5` (color) — Color
- `c39cabc3-79e5-f7f3-1b6b-136ae4fc2f55` (boolean) — Enabled
- `da28b045-469a-d416-1364-a831a233b62e` (richtext) — Typography [when c39cabc3-79e5-f7f3-1b6b-136ae4fc2f55 EQUAL true]
- `4cd2bb63-c770-71ea-ca69-d98e0259ddc7` (richtext) — Display Heading [when c39cabc3-79e5-f7f3-1b6b-136ae4fc2f55 EQUAL true]
- `18d40be2-30c5-f2b7-85b7-362f281dd36f` (boolean) — Enabled
- `58979620-d776-19b2-cf0c-80e2788c1462` (boolean) — Enabled
- `35fd0cc6-508e-1d1a-6b9d-ddf5994ad8b6` (form) — Overwrite Default Form [when 58979620-d776-19b2-cf0c-80e2788c1462 EQUAL true]
- `dd7a4c1e-444a-5eda-25c5-df2be8b05489` (text) — Heading
- `eca70709-d2ac-10d6-3eca-3197b6376c7e` (richtext) — Rich Text
