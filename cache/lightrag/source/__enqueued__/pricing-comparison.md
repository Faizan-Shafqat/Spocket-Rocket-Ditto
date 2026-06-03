# Pricing Comparison

**Slug:** `pricing-comparison`
**HubSpot module ID:** 210345399087
**Inferred category:** Pricing
**Documentation:** https://docs.sprocketrocket.co/modules/marketplace/pricing-comparison
**Host templates:** ANY
**Content types:** MEMBERSHIP, LANDING_PAGE, SITE_PAGE, CUSTOMER_PORTAL, BLOG_LISTING, WEB_INTERACTIVE, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/Pricing Comparison.module`

## Top-level groups
- **cf478fc3-3cfd-0c81-1c1a-191b280e5db1** (group) — Styles
  - **style.heading** (group) — Heading
  - **style.pricing_toggle** (group — when enabled_pricing_toggle EQUAL true) — Pricing Toggle
    - **style.pricing_toggle.toggle** (group) — Toggle
      - **style.pricing_toggle.toggle.default** (group) — Default
      - **style.pricing_toggle.toggle.active** (group) — Active
  - **style.plan_card** (group) — Plan Cards
  - **fd8f3244-857c-5d51-990a-37b7cfe3de06** (group) — Buttons
    - **4afc8192-0f7a-e126-06b5-405c54e29ebc** (group) — Default
    - **7a1a49b8-bdb1-9531-6dd2-d53b86cb88b2** (group) — Hover
  - **style.rows** (group) — Rows
    - **style.rows.category** (group) — Category
  - **039e5292-b941-be7c-b0fa-e0a48772c8dc** (group) — Background
- **pricing_toggle** (group) — Plan Toggle
- **table_column_1** (group — repeater(default=4, max=4)) — Plans
  - **plans.button** (group) — Button
  - **737254d9-7140-26ff-1d2b-f3e21ef92254** (group) — Alt Button
- **rows** (group — repeater(default=3, max=∞)) — Rows
  - **rows.features** (group — repeater(default=3, max=∞)) — Features
    - **dd26dd04-9cf3-0285-433c-da40adf623cb** (group — repeater(default=4, max=4)) — Columns

## Fields
- `style.primary_color` (color) — Primary Color — _Set the default color for the module_
- `style.primary_font` (font) — Primary Font — _Configure the default font family and color for other font fields_
- `style.secondary_font` (font) — Secondary Font — _Configure the default font family and color for other font fields_
- `style.heading.text_alignment` (textalignment) — Text Alignment
- `style.pricing_toggle.position` (choice) — Position [required]
- `style.pricing_toggle.padding` (spacing) — Padding
- `style.pricing_toggle.label_font` (font) — Label Font
- `style.pricing_toggle.toggle.default.font` (font) — Font
- `style.pricing_toggle.toggle.default.background` (color) — Background
- `style.pricing_toggle.toggle.active.font` (font) — Font
- `style.pricing_toggle.toggle.active.background` (color) — Background
- `style.plan_card.plan_name` (font) — Plan Name
- `style.plan_card.plan_cost` (font) — Plan Cost
- `style.plan_card.plan_cost_suffix` (font) — Plan Cost Suffix
- `style.plan_card.plan_description` (font) — Plan Description
- `style.plan_card.text_alignment` (textalignment) — Text Alignment — _Sets the alignment of the plan name, cost, and description of the plan cards without label_
- `style.plan_card.plan_description_list` (number) — List Font Zize — _Uses the Plan Description for other styles_
- `style.plan_card.icon_color` (color) — List Check Color
- `style.plan_card.background` (color) — Background
- `9d7d5269-9129-99a9-7150-824243891f31` (border) — Border
- `style.plan_card.corner_radius` (number) — Corner Radius
- `style.plan_card.padding` (spacing) — Padding
- `7363c766-7f12-299b-cc9d-1cfaf102a057` (font) — Font
- `589859a2-2c03-6b6f-84c1-d30d053b3043` (color) — Background
- `ce005cae-09e7-c672-66c2-ef98eda165f7` (border) — Border
- `9717e216-9289-f35d-6155-d376dc50e9e1` (number) — Border Radius
- `43f1efd0-6116-0f63-bfae-bcbf67a3625c` (spacing) — Padding
- `77c78265-b65c-1b79-295f-d4a1face6992` (color) — Background
- `99c4d6bb-e9f9-56f1-a88c-0307d6a4e0ae` (color) — Font Color
- `5ba9fc72-4351-1771-5bc2-7b6a98523830` (color) — Border Color
- `7363c766-7f12-299b-cc9d-1cfaf102a051` (font) — Font
- `style.rows.category.background` (color) — Background
- `style.rows.category.corner_radius` (number) — Corner Radius
- `style.rows.category.padding` (spacing) — Padding
- `style.rows.font` (font) — Font
- `style.rows.odd_background` (color) — Odd Row Background
- `style.rows.even_background` (color) — Even Row Background
- `style.rows.border` (border) — Border
- `style.rows.padding` (spacing) — Padding
- `35b51f96-aeab-6dff-fc86-739df15c8a53` (color) — Background Color
- `9d7d5269-9129-99a9-7150-824243891f3f` (border) — Border — _Adds a border around the form_
- `a27e791f-70fc-7ca0-acf5-5e56de0e800c` (number) — Radius — _Rounds the corners of the form border_
- `745de8b5-3396-5507-04c8-f8be5986cd80` (spacing) — Spacing — _Adds padding around the form_
- `heading` (text) — Heading
- `heading_tag` (choice) — Heading Tag [required] — _Size of the heading can be controlled from the style tab. Under the Secondary Font field_
- `description` (richtext) — Description
- `enabled_pricing_toggle` (boolean) — Enabled
- `pricing_toggle.heading` (text) — Heading
- `pricing_toggle.toggle_left` (text) — Toggle Left
- `pricing_toggle.toggle_right` (text) — Toggle Right
- `plans.accent_color` (color) — Accent Color — _Top border color._
- `plan_name` (text) — Name
- `5fbab19e-ea1f-9b97-7305-47d7e72aebe7` (text) — Symbol — _Displays before the price._
- `4138d182-5f32-e2fa-2c6d-032bd2a60d5d` (text) — Price — _Appears when the toggle is switched to the left position._
- `4138d182-5f32-e2fa-2c6d-032bd2a60e5d` (text) — Alt Price [when enabled_pricing_toggle EQUAL true] — _Appears when the toggle is switched to the right position._
- `plans.suffix` (text) — Suffix — _Displays after the price._
- `plans.alt_suffix` (text) — Alt Suffix [when enabled_pricing_toggle EQUAL true] — _Appears when the toggle is switched to the right position._
- `plan_label` (text) — Label
- `label_background` (color) — Background [when plan_label NOT_EMPTY null]
- `plans.color` (color) — Color [when plan_label NOT_EMPTY null]
- `plans.description` (richtext) — Description
- `btn_type` (choice) — Type [required]
- `plans.button.cta` (cta) — CTA  [when btn_type EQUAL cta]
- `plans.button.text` (text) — Text [when btn_type EQUAL link]
- `3489732f-1367-f966-e7ab-008ae2bb4dee` (link) — Link [when btn_type EQUAL link]
- `plans.button.style` (choice) — Style [when btn_type NOT_EQUAL none] [required] — _Other button styles can be set in the style tab._
- `286fd537-54ba-25a8-eb14-85dbc07696c5` (choice) — Type [required]
- `26b6ab0c-a093-334d-dd76-13a4118aa827` (cta) — CTA  [when 286fd537-54ba-25a8-eb14-85dbc07696c5 EQUAL cta]
- `dbd15dc3-91a6-17f4-8d61-77d809a64307` (text) — Text [when 286fd537-54ba-25a8-eb14-85dbc07696c5 EQUAL link]
- `f118424a-2ee4-b404-1a83-04292942c3c7` (link) — Link [when 286fd537-54ba-25a8-eb14-85dbc07696c5 EQUAL link]
- `30202025-0721-e467-8f83-07bafdb96b7a` (choice) — Style [when 286fd537-54ba-25a8-eb14-85dbc07696c5 NOT_EQUAL none] [required] — _Other button styles can be set in the style tab._
- `row_title.heading` (text) — Category
- `feature_title.heading` (text) — Title
- `rows.features.feature_tooltip` (text) — Tooltip — _Leave blank for no tooltip_
- `959eeca4-6761-3bd0-d2d6-1807c5731db4` (icon) — Icon
- `rows.features.columns.icon_color` (color) — Icon Color
- `rows.features.columns.text` (text) — Text
- `rows.features.columns.text_color` (color) — Text Color [when rows.features.columns.text NOT_EMPTY null]
- `dd26dd04-9cf3-0285-433c-da40adf623cb.purpose` (choice) — Purpose [required] — _The purpose of the icon, used for accessibility. If set to decorative, an additional attribute of aria-hidden="true" will be added to the…_
- `7c09b607-4215-5b83-4a45-99aafd68c3c5` (boolean) — Start Collapsed — _Configure this row's accordion to be collapsed initially. Users are required to click in order to open it._
- `7c09b607-4215-5b83-4a45-99aafd68c3c6` (boolean) — Start Collapsed on Mobile — _Configure this row's accordion to be collapsed initially only on mobile. Users are required to click in order to open it._
