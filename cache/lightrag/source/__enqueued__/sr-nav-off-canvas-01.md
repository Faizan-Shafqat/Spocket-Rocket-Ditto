# SR Nav Off Canvas 01

**Slug:** `sr-nav-off-canvas-01`
**HubSpot module ID:** 210345737872
**Inferred category:** Navigation
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Nav Off Canvas 01.module`

## Top-level groups
- **design_settings** (group) — Design Settings
  - **3635d389-6f68-3149-3921-aca9d3738b64** (group) — Overlay
  - **1e109a2b-975c-a09b-c2c4-03c6bc121ebb** (group) — Menu Toggle Icon
  - **9876cda3-1bb1-7dd5-5323-cb2aeab14d13** (group) — Links
  - **5575147d-afbb-4453-b672-27b3cfdae4f2** (group — when search_results.enable_search EQUAL true) — Search Bar
  - **941dfa81-7273-e7cd-e451-c17fc5ecb66e** (group — when enable_lang_switcher EQUAL true) — Language Switcher
    - **1b920e92-0b2c-1b21-d4ca-e1e3730b988d** (group) — Default
    - **3b7df103-7302-7242-091d-3558118e5b8d** (group) — Active
- **2503ac1f-91ea-cf8a-12ab-46c7dbfb88c5** (group) — Settings
- **42252a1f-e45d-044e-e53d-9b5548fd64c3** (group) — Logo
- **2edc9e2f-7006-88f4-c8f6-dec89e0cc21f** (group) — Menu
  - **d399c56d-33b8-327d-ebb6-96e5f95094fa** (group — repeater(default=4, max=∞)) — Nav Link
- **cta** (group) — CTA
  - **column.cta.default** (group — when column.cta.cta_style EQUAL custom) — Default
  - **column.cta.hover** (group — when column.cta.cta_style EQUAL custom) — Hover
  - **column.cta.icon** (group — when cta_type NOT_EQUAL cta AND column.cta.add_icon EQUAL true) — Icon
- **8df2a823-9eb9-c9ff-db9f-a75153bb6fe8** (group) — Search Results
  - **results** (group) — Results
  - **346180f5-0d36-e8df-aca9-a74bfa2d79a4** (group) — Search results include

## Fields
- `design_settings.background` (color) — Background
- `830d38b9-08b4-7c24-ab7a-4e71223096e1` (number) — Blur Amount
- `5ee079a5-8f4a-d44e-8ce9-4672703d1357` (color) — Default Background
- `d05f9b9b-37d0-0bbf-a211-c32c0789e361` (color) — Active Background
- `0d22d9a5-0982-60b0-66d7-a7ecd95a6070` (font) — Font [when design_settings.custom_fonts NOT_EQUAL true]
- `b60475cc-e9e7-e6c3-e04b-ff66f2e2983a` (color) — Border Color
- `b0f1ae03-83df-d5d7-8131-c4732c272f16` (color) — Hover Color
- `691bbd4f-ca4a-3677-e702-b274c079a973` (boolean) — Separate Font Size For Mobile [when design_settings.custom_fonts NOT_EQUAL true]
- `2637f356-c020-7209-fc7b-37ebc294119d` (number) — Mobile Font Size [when design_settings.links.enable_mobile_size EQUAL true]
- `8737db36-f873-8488-a140-b8753033f78c` (number) — Font Size [required]
- `c3c131bc-1799-d8ea-ee5a-9ac6c65ba634` (color) — Color
- `f3efa639-f6ec-0006-245e-58b5ddd0bcfe` (boolean) — Separate Font Size For Mobile [when design_settings.custom_fonts NOT_EQUAL true]
- `25ced6af-72ff-9f55-af71-0ca679418097` (number) — Mobile Font Size [when design_settings.search_bar.enable_mobile_size EQUAL true] — _To prevent automatic zooming on iOS, the font size must be larger than 16px_
- `c92f6949-bdb0-2b42-ca94-278faa727427` (number) — Font Size [when design_settings.custom_fonts NOT_EQUAL true] [required]
- `9d65a000-058f-b041-8afb-b00ff1331153` (number) — Border Radius [required]
- `04bb0716-45c2-6039-8865-d8de20a62355` (color) — Background Color
- `598920b5-4d6f-bbc1-47d4-217a83c34f37` (color) — Border Color
- `f13fcf35-5551-bbbc-1b59-71b6e56a0d5d` (color) — Font Color
- `8b8b1f4b-efcc-89dc-bcae-ef2f9679683a` (color) — Background Color
- `38e2b1a9-33e1-ed50-73ef-9e11ee065758` (color) — Border Color
- `02e1d685-f8f4-b544-f1a8-d8cf607bbb97` (color) — Font Color
- `148c1668-70d4-1ded-1073-f9bded5a6a3f` (boolean) — Custom Fonts
- `d57622af-793b-51dc-5b65-f9e2a8e682dd` (choice) — Layout [required]
- `1814eab2-13e6-366f-f0f1-14119b0e50a7` (boolean) — Fixed
- `874243c8-e3b8-47a3-d3ec-c2063ad18fb4` (number) — Mobile Breakpoint [required] — _Breakpoint at which the navigation layout changes to the mobile view._
- `c57c2e7c-fed5-1131-0e35-c8302b4c8054` (number) — Max Width [required] — _Maximum width at which the navigation overlay container will be set at._
- `logo_default` (image) — Logo Default
- `logo_link` (link) — Logo Link
- `2c844c37-4d63-f842-5772-a98452829841` (text) — Link Name
- `3d36b38e-0626-c738-93c9-658d47c60274` (link) — Link
- `7a51576d-97ed-8dbb-6c8a-f18e12c95c11` (boolean) — Show Numbers
- `cta_type` (choice) — CTA Type [required]
- `column.cta.cta_style` (choice) — CTA Style [when cta_type NOT_EQUAL none] [required]
- `column.ctas.default.background` (color) — Background
- `column.ctas.default.text` (color) — Text
- `column.ctas.default.border` (color) — Border
- `column.ctas.hover.background` (color) — Background
- `column.ctas.hover.text` (color) — Text
- `column.ctas.hover.border` (color) — Border Color
- `column.cta.cta` (cta) — CTA [when cta_type EQUAL cta]
- `column.cta.button_text` (text) — Button Text [when cta_type MATCHES_REGEX btn|modal]
- `column.cta.modal_target` (text) — Modal Target [when cta_type EQUAL modal]
- `column.ctas.link` (link) — Link [when cta_type EQUAL btn]
- `column.cta.payment` (payment) — Payment link [when cta_type EQUAL hs_payment]
- `column.cta.checkout_location` (choice) — Checkout behavior [when column.cta.payment MATCHES_REGEX id":\d+ AND cta_type EQUAL hs_payment]
- `column.ctas.cta_size` (choice) — CTA Size [when cta_type NOT_EQUAL none] [required]
- `column.cta.add_icon` (boolean) — Add icon [when cta_type NOT_EQUAL cta]
- `column.cta.icon.icon` (icon) — Icon [required]
- `column.cta.icon.position` (choice) — Position [required]
- `column.cta.icon.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `7a51576d-97ed-8dbb-6c8a-f18e12c95c1b` (boolean) — Enable Search
- `e75bef76-6568-6550-8840-1d97bfc93c0b` (text) — Placeholder text
- `results.user_custom_search_results_template` (boolean) — Use custom search results page
- `results.path_id` (page) — Search results page [when results.user_custom_search_results_template EQUAL true]
- `71d525ff-37c4-6c64-1f96-d99dbb529816` (boolean) — Website pages
- `d6212113-19b5-c9b9-2f92-12dfc122d00c` (boolean) — Landing pages
- `7535615c-ed26-2e34-87ef-21c5c87ccbcb` (boolean) — Blog posts
- `307d0eed-0cf9-7465-5715-a75c378ec61f` (boolean) — Knowledge articles
- `3968240d-1b5c-e7be-5e20-3e125df079c0` (boolean) — Enable Language Switcher — _By adding a language switcher you can allow your visitors to select their preferred language. Custom multi-language content will not be t…_
