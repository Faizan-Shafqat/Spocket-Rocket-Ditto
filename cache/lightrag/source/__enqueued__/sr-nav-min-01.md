# SR Nav Min 01

**Slug:** `sr-nav-min-01`
**HubSpot module ID:** 210345737870
**Inferred category:** Navigation
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Nav Min 01.module`

## Top-level groups
- **styles** (group) — Styles
  - **styles.top_bar** (group) — Top bar
    - **styles.top_bar.background** (group) — Background
    - **styles.top_bar.text** (group) — Text
  - **styles.menu** (group) — Menu
    - **styles.menu.background** (group) — Background
    - **275c661b-40c7-e311-f135-234e583fc780** (group) — Shadow
- **settings** (group) — Settings
- **top_bar** (group) — Top bar
- **logo** (group) — Logo
- **button** (group) — Button
  - **ctas** (group) — CTA
    - **ctas.default** (group — when ctas.cta_style EQUAL custom) — Default
    - **ctas.hover** (group — when ctas.cta_style EQUAL custom) — Hover
    - **ctas.icon** (group — when ctas.cta_type NOT_EQUAL cta AND ctas.add_icon EQUAL true) — Icon

## Fields
- `styles.top_bar.spacing` (spacing) — Spacing
- `styles.top_bar.background.color` (color) — Color
- `text.font` (font) — Font [when styles.custom_fonts EQUAL false]
- `styles.top_bar.text.size` (number) — Size [when styles.custom_fonts EQUAL true]
- `styles.top_bar.text.color` (color) — Color [when styles.custom_fonts EQUAL true]
- `text.align` (textalignment) — Algin [when top_bar.type EQUAL announcement]
- `styles.menu.spacing` (spacing) — Spacing
- `styles.menu.background.background` (color) — Background
- `styles.menu.background.background_on_scroll` (color) — Background on Scroll [when settings.fixed EQUAL true]
- `fa8b1089-370e-0570-d4e6-2c8de2a6e7e7` (color) — Shadow
- `b297b779-1b39-c12c-f75c-788c814d609e` (color) — Shadow on Scroll
- `styles.custom_fonts` (boolean) — Custom Fonts — _When enabling custom fonts, all font fields will be disabled. You will need to apply the desired font styles to specific elements using CSS._
- `settings.width` (choice) — Width [required]
- `settings.fixed` (boolean) — Fixed — _By checking this option additional fields for a logo (Content -> Logo), background color (Style -> Menu -> Background), and font color (S…_
- `settings.scroll` (boolean) — Hide on Scroll Down [when settings.fixed EQUAL true] — _Make the navigation disappear as the user scrolls down the page, and reappear when they scroll up._
- `top_bar.type` (choice) — Type [required]
- `top_bar.rich_text` (richtext) — Rich Text [when top_bar.type EQUAL announcement]
- `logo.link` (link) — Link
- `logo.logo` (image) — Logo
- `logo.logo_on_scroll` (image) — Logo on Scroll [when settings.fixed EQUAL true]
- `logo.logo_on_mobile` (boolean) — Use separate Logo on Mobile
- `logo.mobile_logo` (image) — Mobile Logo [when logo.logo_on_mobile EQUAL true]
- `logo.mobile_logo_on_scroll` (image) — Mobile Logo on Scroll [when settings.fixed EQUAL true AND logo.logo_on_mobile EQUAL true]
- `ctas.cta_type` (choice) — CTA Type [required]
- `ctas.cta_style` (choice) — CTA Style [when ctas.cta_type NOT_EQUAL none] [required]
- `button.ctas.default.background` (color) — Background
- `button.ctas.default.text` (color) — Text
- `button.ctas.default.border` (color) — Border
- `button.ctas.hover.background` (color) — Background
- `button.ctas.hover.text` (color) — Text
- `button.ctas.hover.border` (color) — Border Color
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
