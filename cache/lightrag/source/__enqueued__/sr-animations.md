# SR Animations

**Slug:** `sr-animations`
**HubSpot module ID:** 210345737648
**Inferred category:** Other
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/SR Animations.module`

## Top-level groups
- **7821a3d5-ef52-04bf-bdc9-b71ad3b519a8** (group) — Scroll Animation
  - **07bfacf0-f6f8-0ee8-9b2e-8b57b8ff7b69** (group — when e868a59b-03b8-71c6-f118-0d16112e23eb EQUAL true) — Advanced Options
- **hover_animation** (group) — Hover Animation
- **b442337f-eb36-57e4-9180-62311255a430** (group) — Advanced Styling
  - **aab83008-e99d-a91b-4952-444303e92e02** (group) — Styles
  - **bd79a4e8-6f00-a2f6-50fd-5f5db10d8e9e** (group) — Styles Settings
  - **a2b2661b-76b8-425c-396d-01a7c7e00752** (group) — CSS Animations
    - **be7f57c1-6d36-fc22-bc60-6589028b564f** (group) — Keyframes

## Fields
- `enabled` (boolean) — Enabled
- `element` (text) — Element Selector — _Enter the CSS selector for the element you want to animate (e.g., #myElement or .myClass)_
- `3ac9036b-2eaa-0dbc-11ac-1cda711b3932` (choice) — Animation Category [required]
- `dbe94e81-6441-4014-0867-3ff3e27ea3d7` (choice) — Fade Options [when 3ac9036b-2eaa-0dbc-11ac-1cda711b3932 EQUAL fade] [required]
- `52dc03db-1939-ee79-2e9d-b65abbf1b93a` (choice) — Flip Options [when 3ac9036b-2eaa-0dbc-11ac-1cda711b3932 EQUAL flip] [required]
- `be089f93-32df-e1bd-ca93-442b22e5d244` (choice) — Slide Options [when 3ac9036b-2eaa-0dbc-11ac-1cda711b3932 EQUAL slide] [required]
- `4691874a-a868-b49a-e69a-29c870d5dfa7` (choice) — Zoom Options [when 3ac9036b-2eaa-0dbc-11ac-1cda711b3932 EQUAL zoom] [required]
- `89244d3c-d8eb-02ef-80e6-4ab0797ddb56` (boolean) — Start Hidden — _Apply this class to hide the element initially_
- `e868a59b-03b8-71c6-f118-0d16112e23eb` (boolean) — Show Advanced Options
- `333b4757-e069-814f-8b54-27ac6b7eea25` (boolean) — Animate Once — _Select whether the animation should trigger only once or each time you scroll to the element_
- `eb7c09b9-4241-1df7-db6c-168baed75b22` (number) — Animation Delay — _Animation delay (ms)_
- `4d7c7a6e-b60b-492e-31eb-237e4f169566` (number) — Animation Duration — _Animation duration (ms)_
- `8035aaa6-d6fd-b50b-2da1-8d73952d6133` (number) — Trigger Offset — _Adjust the offset to trigger animations earlier or later (in pixels)_
- `844aafea-bf23-59fa-8d56-29e46daaeca6` (choice) — Easing Functions — _Choose one of these timing functions to animate elements smoothly_
- `ccb66285-674f-f842-0fde-998efa298397` (choice) — Anchor Placement — _You can set different placement options for each element. Each anchor-placement option has two words, like 'top-center', meaning the anim…_
- `2c7e2413-73f5-137d-700f-586b75a8156b` (text) — Anchor Selector — _Anchor element, whose offset will be used to trigger the animation instead of the actual element's offset_
- `ebd1194e-ca1f-504b-d0fa-3367c4ec5fdf` (boolean) — Disable Scroll Animations On Mobile — _This option will prevent all elements from animating on mobile_
- `hover_element` (text) — Hover Element Selector
- `animation_type` (choice) — Animation Type [required]
- `css_html` (html) — CSS on Element [when animation_type EQUAL custom]
- `css_html_hover` (html) — CSS on Element Hover [when animation_type EQUAL custom]
- `scale_amount` (number) — Scale Size [when animation_type EQUAL scale]
- `hover_animation.animation_speed` (number) — Animation Speed [when animation_type NOT_EQUAL custom] — _Duration of the animation (ms)_
- `hover_animation.hover_easing_functions` (choice) — Easing Functions [when animation_type NOT_EQUAL custom] — _Choose one of these timing functions to animate elements smoothly_
- `7975834e-8339-b7df-56c6-069902496226` (text) — Element Selector — _Enter the CSS selector for the element you want to style (e.g., #myElement or .myClass)_
- `e2035a76-7ece-1396-1929-3a4817fb635e` (choice) — Type [required] — _Choose when the styles should be applied_
- `3f0fcd5e-755d-0f82-ebe2-94646cbacd4c` (number) — Opacity — _Set the transparency of the element (0% is fully transparent, 100% is fully opaque)_
- `5e2e340c-a826-8a47-81be-06304d7cb25c` (text) — Position X — _Set the horizontal position of the element. You can use any CSS length unit, such as px, %, rem, em, vw, vh, etc_
- `2ca41880-ffc3-6cf8-c8bc-c846fdcbc570` (text) — Position Y — _Set the vertical position of the element. You can use any CSS length unit, such as px, %, rem, em, vw, vh, etc_
- `029863b1-9609-cb15-e3d3-e369563f91b5` (number) — Scale — _Set the size of the element as a percentage of its original size_
- `b3f81c75-4a04-6c14-f823-3bf96cc25c95` (number) — Rotate — _Rotate the element (0-360 degrees)_
- `sr_styles.background_color` (choice) — Background Color [required]
- `sr_styles.background_custom` (color) — Background Color [when sr_styles.background_color EQUAL custom]
- `sr_styles.text_color` (choice) — Text Color [required]
- `sr_styles.text_color_custom` (color) — Text Color [when sr_styles.text_color EQUAL custom]
- `design_settings.sr_styles.border_radius` (number) — Border Radius
- `design_settings.sr_styles.shadow` (boolean) — Shadow
- `design_settings.sr_styles.horizontal` (number) — Horizontal [when design_settings.sr_styles.shadow EQUAL true] — _A positive value puts the shadow on the right side of the box, a negative value puts the shadow on the left side of the box_
- `design_settings.sr_styles.vertical` (number) — Vertical [when design_settings.sr_styles.shadow EQUAL true] — _The vertical offset of the shadow. A positive value puts the shadow below the box, a negative value puts the shadow above the box_
- `design_settings.sr_styles.blur` (number) — Blur [when design_settings.sr_styles.shadow EQUAL true] — _The blur radius. The higher the number, the more blurred the shadow will be_
- `design_settings.sr_styles.spread` (number) — Spread [when design_settings.sr_styles.shadow EQUAL true] — _The spread radius. A positive value increases the size of the shadow, a negative value decreases the size of the shadow_
- `design_settings.sr_styles.inset` (boolean) — Inset [when design_settings.sr_styles.shadow EQUAL true] — _Changes the shadow to an inner shadow_
- `design_settings.sr_styles.color` (color) — Color [when design_settings.sr_styles.shadow EQUAL true] — _The color of the shadow_
- `6915bafa-29e1-d10b-fcec-399f94c0e540` (number) — Duration  — _Set how long the style transition should take_
- `2a60f671-4611-4433-96a2-36845dd8f009` (number) — Delay — _Set a delay before the style transition starts_
- `0556c99b-ae58-02a2-e3d0-d7457e292140` (boolean) — Animate Out — _For 'Scroll in view' animations, choose to animate out when the element leaves the viewport_
- `f293b6c7-0e99-c120-9da6-b65d7a6f0467` (choice) — Transform Origin — _Set the origin point for transformations like scale and rotate_
- `f7f75f85-abe3-3e39-0bf1-033b22fa1e76` (number) — Keyframe — _Set the percentage point of the animation where this keyframe occurs_
- `be06bfe7-d07a-21fd-34b2-d9506e24f435` (number) — Opacity — _Set the transparency of the element at this keyframe_
- `a49375c5-8f6a-795c-b93a-a9c1d2010d7d` (text) — Position X — _Set the horizontal position at this keyframe. You can use any CSS length unit, such as px, %, rem, em, vw, vh, etc_
- `b7d68da1-c097-6401-54de-7faabce68304` (text) — Position Y — _Set the vertical position at this keyframe. You can use any CSS length unit, such as px, %, rem, em, vw, vh, etc_
- `2bbc121d-939c-5495-474f-8ee3fe5b2716` (number) — Scale — _Set the size of the element at this keyframe as a percentage of its original size_
- `03769797-9c0f-c4f4-1e1c-900bfca50640` (number) — Rotate — _Set the rotation of the element at this keyframe (0-360 degrees)_
- `d9656332-fe32-a9e4-b6fa-0f7198c8cbbb` (number) — Delay — _Set a delay before the animation starts_
- `0665c65e-85dc-4bed-55a7-9e60d1b802b6` (number) — Duration — _Set how long the animation should take to complete one cycle_
- `8fd63437-1427-8120-0146-a6b04e8903d3` (number) — Iterations — _Set the number of times the animation should run. Use '0' to make the animation continue forever_
- `748d8000-9655-4b42-9952-9b6d6e195b81` (choice) — Easing Functions — _Choose one of these timing functions to animate elements smoothly_
- `a56d1b1e-1d17-6498-d05f-4795e7292cd1` (choice) — Direction [required] — _Whether an animation should play forward, backward, or alternate back and forth between playing the sequence forward and backward._
- `aa6936c6-2c6a-626d-dfdc-8db144126a83` (choice) — Fill Mode [required] — _Sets how a CSS animation applies styles to its target before and after its execution._
