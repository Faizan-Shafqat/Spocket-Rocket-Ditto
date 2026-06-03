# SR Element Social

**Slug:** `sr-element-social`
**HubSpot module ID:** 210348825677
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Element Social.module`

## Top-level groups
- **design_settings** (group) — Design Settings
- **2d69b990-48be-cfc0-d48a-cb65549cafa6** (group — repeater(default=4, max=∞)) — Icons

## Fields
- `design_settings.spacing` (spacing) — Spacing
- `design_settings.style` (choice) — Style [required]
- `design_settings.vertical_alignment` (alignment) — Alignment [when design_settings.style EQUAL vertical]
- `design_settings.horizontal_alignment` (alignment) — Alignment [when design_settings.style EQUAL horizontal]
- `bde00217-8904-3367-263e-06d582bdbbdf` (choice) — Type [required]
- `a7f776b8-b857-a6ca-3bbb-8a8c9e93c31f` (icon) — Icon [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL icon]
- `7a018851-6a6f-b756-a735-03780f232063` (image) — Image [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL image]
- `e94d2d59-ad2a-b61f-3a54-fd902212c533` (text) — SVG [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL svg]
- `b51bdfec-c41f-58e4-ff6a-3364b51183da` (number) — Size [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL icon]
- `9ffbdf21-cd1d-4871-1f95-700f6e1b2845` (color) — Color [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL icon]
- `d5885ab8-618b-2c14-212d-b8b93356a02f` (color) — Background [when bde00217-8904-3367-263e-06d582bdbbdf EQUAL icon]
- `be6e663b-2a35-b54f-eae5-b4ecad7d76f2` (link) — Link
- `icons.aria_label` (text) — Aria Label — _The aria-label attribute is used on links that have no accessible name to give it meaning to screen readers._
- `2d69b990-48be-cfc0-d48a-cb65549cafa6.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
