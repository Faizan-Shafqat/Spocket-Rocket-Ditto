# Multistep Form

**Slug:** `multistep-form`
**HubSpot module ID:** 210345399080
**Inferred category:** Form
**Documentation:** https://docs.sprocketrocket.co/
**Host templates:** PAGE, BLOG_POST, BLOG_LISTING
**Content types:** LANDING_PAGE, SITE_PAGE, BLOG_LISTING, BLOG_POST
**Available for new content:** yes

**Module path:** `sr-2026/custom-modules/Multistep Form.module`

## Notable defaults
- 0981a92d-df04-a8e3-645d-417c142e4711: default background: color
- 0981a92d-df04-a8e3-645d-417c142e471e: default background: color

## Top-level groups
- **cf478fc3-3cfd-0c81-1c1a-191b280e5db1** (group) — Styles
  - **style.intro** (group — when show_intro EQUAL true) — Intro Overlay
    - **039e5292-b941-be7c-b0fa-e0a48772c8d1** (group) — Background
    - **10c94dd8-b8a6-ea99-eee8-eb2156868701** (group — when intro.content.label_ NOT_EMPTY null) — Label
    - **10c94dd8-b8a6-ea99-eee8-eb2156868709** (group — when intro.content.heading NOT_EMPTY null) — Heading
    - **10c94dd8-b8a6-ea99-eee8-eb2156868703** (group — when intro.content.description NOT_EMPTY null) — Description
    - **3af453c3-1f35-9bb6-15d9-3c5a11064424** (group) — Button
      - **4afc8192-0f7a-e126-06b5-405c54e29eb4** (group) — Default
      - **7a1a49b8-bdb1-9531-6dd2-d53b86cb88b9** (group) — Hover
  - **039e5292-b941-be7c-b0fa-e0a48772c8dc** (group) — Background
  - **5c003eca-ac8d-a61d-db1c-edbc6917d5f9** (group) — Tabs
    - **1d7ed856-f44b-ff1b-8086-715b1ab56c2a** (group) — Progress Bar
    - **5a26631c-7ff1-e1f5-86f6-1fe4129efb40** (group) — Label
    - **ecdce9e9-7c58-6e5b-77d4-546da8f708cb** (group) — Name
  - **cbfe9522-3bc3-e52d-31a8-4201ad498574** (group) — Fields
    - **04cb321d-361a-d005-53ab-3b3bcd386f9f** (group) — Label
      - **69f8cbb2-e515-9207-bebb-04f71b5f1952** (group) — Description
    - **69f8cbb2-e515-9207-bebb-04f71b5f1954** (group) — Input
      - **a21b0ec4-57a3-4d5a-f583-435f36e1c1e6** (group) — Checkbox/Radio
    - **7a83ec9d-9a85-cd0c-5608-19f17dce9e30** (group) — Border
    - **cb7001c4-225d-8092-8cb9-41ac10369476** (group) — Error
  - **fd8f3244-857c-5d51-990a-37b7cfe3de06** (group) — Buttons
    - **3af453c3-1f35-9bb6-15d9-3c5a11064425** (group) — Next Step
      - **4afc8192-0f7a-e126-06b5-405c54e29ebc** (group) — Default
      - **7a1a49b8-bdb1-9531-6dd2-d53b86cb88b2** (group) — Hover
    - **94a5dec1-2e11-0fe5-6a9c-3642edbd41a4** (group) — Previous Step
      - **8ea56378-f8e1-9f48-d5de-2e6020cf1ef2** (group) — Default
      - **295f02ad-b8d4-017e-6879-dc8e250b4b02** (group) — Hover
- **intro** (group — when show_intro EQUAL true) — Intro Overlay
  - **intro.content** (group) — Content
- **fde3d0c5-548d-6585-25f5-09ded862550d** (group — repeater(default=3, max=∞)) — Steps
  - **4bb312e5-cb2f-e2e5-8a4b-f80d426ed40e** (group — repeater(default=3, max=∞)) — Field Group
    - **23b9898e-b7f7-18b5-42f1-d084f62da8a6** (group — repeater(default=1, max=3)) — Field
      - **b14f155b-7d08-54ab-3073-72e2edb5e560** (group — repeater(default=6, max=∞) ; when steps.field_group.field.field_type MATCHES_REGEX dropdown|checkbox|radio) — Choices
  - **80f7e626-66c4-bb7a-69ec-9fa5e8509121** (group) — Buttons

## Fields
- `sr_module_id` (text) — ID — _Assign a ID to the module_
- `class` (text) — Class — _Assign a CLASS to the module_
- `style.accent_color` (color) — Accent Color
- `style.base_font` (font) — Base Font
- `0981a92d-df04-a8e3-645d-417c142e4711` (choice) — Background Option [required]
- `style.intro.background.background_image` (backgroundimage) — Background Image  [when style.intro.background.background_option EQUAL image]
- `style.intro.background.background_overlay_color` (color) — Background Overlay Color [when style.intro.background.background_option EQUAL image]
- `515ebe35-13cb-921b-ea6b-48fe21b1bcd1` (gradient) — Background Gradient [when style.intro.background.background_option EQUAL gradient]
- `35b51f96-aeab-6dff-fc86-739df15c8a51` (color) — Background Color
- `9d7d5269-9129-99a9-7150-824243891f31` (border) — Border — _Adds a border around the overlay_
- `a27e791f-70fc-7ca0-acf5-5e56de0e800e` (number) — Radius — _Rounds the corners of the overlay border_
- `745de8b5-3396-5507-04c8-f8be5986cd81` (spacing) — Spacing — _Adds padding around the overlay_
- `2bf08825-b530-93bf-113a-4c67c22fb6d1` (font) — Font
- `3658dfd0-17e2-a644-bfd5-18ba91f48fe1` (textalignment) — Text Align
- `2bf08825-b530-93bf-113a-4c67c22fb6d2` (font) — Font
- `3658dfd0-17e2-a644-bfd5-18ba91f48fec` (textalignment) — Text Align
- `2bf08825-b530-93bf-113a-4c67c22fb6d3` (font) — Font
- `3658dfd0-17e2-a644-bfd5-18ba91f48fe2` (textalignment) — Text Align
- `7363c766-7f12-299b-cc9d-1cfaf102a054` (font) — Font
- `589859a2-2c03-6b6f-84c1-d30d053b3044` (color) — Background
- `ce005cae-09e7-c672-66c2-ef98eda165f4` (border) — Border
- `9717e216-9289-f35d-6155-d376dc50e9e4` (number) — Border Radius
- `43f1efd0-6116-0f63-bfae-bcbf67a36252` (spacing) — Padding
- `77c78265-b65c-1b79-295f-d4a1face6996` (color) — Background
- `99c4d6bb-e9f9-56f1-a88c-0307d6a4e0a1` (color) — Font Color
- `5ba9fc72-4351-1771-5bc2-7b6a98523832` (color) — Border Color
- `0981a92d-df04-a8e3-645d-417c142e471e` (choice) — Background Option [required]
- `515ebe35-13cb-921b-ea6b-48fe21b1bcda` (gradient) — Background Gradient [when style.background.background_option EQUAL gradient]
- `35b51f96-aeab-6dff-fc86-739df15c8a53` (color) — Background Color
- `9d7d5269-9129-99a9-7150-824243891f3f` (border) — Border — _Adds a border around the form_
- `a27e791f-70fc-7ca0-acf5-5e56de0e800c` (number) — Radius — _Rounds the corners of the form border_
- `745de8b5-3396-5507-04c8-f8be5986cd80` (spacing) — Spacing — _Adds padding around the form_
- `1b13acd6-9a2c-7c80-85a9-7c5bdeafd530` (number) — Height
- `35702efd-31a5-cb1d-145a-419fc7dbf567` (color) — Color
- `e56bd8e7-5c04-5dc4-cef0-b7740aa6b6d3` (color) — Active Color
- `9044f68e-355a-2048-347e-72dfd21595fe` (font) — Font
- `a836de3d-4299-741a-e872-07f0530c1d36` (color) — Font Active Color
- `4dc7bdc3-fd10-9b1f-e97f-b6ebaf7314ef` (font) — Font
- `00e71c9b-b14c-bc19-03eb-fbdc59483cce` (color) — Font Active Color
- `303b8d0f-a33b-c76d-5e43-91e4f0bcc08a` (font) — Font
- `a6a66396-0f64-e736-c54b-e1f6d85c786d` (number) — Letter Spacing
- `74b7f5c3-1c44-afce-4562-d149409163f1` (font) — Font
- `style.fields.field_label.field_description.text_alignment` (textalignment) — Text Alignment 
- `74b7f5c3-1c44-afce-4562-d149409163f8` (font) — Font
- `0a67219e-c84c-1a77-52b7-ad7e80cd4d1c` (number) — Letter Spacing
- `ea896073-3724-01c8-681b-63595994b7e2` (number) — Height
- `4b210a19-c066-5522-f45b-6630f13f9d78` (color) — Background
- `1f07deb7-84a6-baad-f2d7-cd7f63470977` (color) — Background
- `fa11ceb7-20c0-b9d3-7c1b-777345c8cb6f` (border) — Border
- `1c690bb9-d52d-f195-6cb8-14ca77eabe50` (color) — Border Focus
- `f02d0f53-a172-2dd9-9db7-ca0161508e87` (number) — Border Radius
- `909d7f43-c752-88dd-6261-b10f5abded63` (font) — Font
- `7363c766-7f12-299b-cc9d-1cfaf102a057` (font) — Font
- `589859a2-2c03-6b6f-84c1-d30d053b3043` (color) — Background
- `ce005cae-09e7-c672-66c2-ef98eda165f7` (border) — Border
- `9717e216-9289-f35d-6155-d376dc50e9e1` (number) — Border Radius
- `43f1efd0-6116-0f63-bfae-bcbf67a3625c` (spacing) — Padding
- `77c78265-b65c-1b79-295f-d4a1face6992` (color) — Background
- `99c4d6bb-e9f9-56f1-a88c-0307d6a4e0ae` (color) — Font Color
- `5ba9fc72-4351-1771-5bc2-7b6a98523830` (color) — Border Color
- `79c16a29-563b-f320-4c9b-ee24627d181e` (font) — Font
- `e1c50038-a804-0a7f-3122-15b474c020b2` (color) — Background
- `bb66a1d4-805e-f8a2-8956-12ef795b935b` (border) — Border
- `2f50b5fb-7b2b-9c69-dcff-b2f12a7fadaa` (spacing) — Padding
- `0c6c484f-0fa5-ca7e-a6a7-e5249c0b7f53` (color) — Background
- `727db260-da58-0c1c-16e3-af099d916886` (color) — Font Color
- `46c7601d-5f75-d1b9-890f-3bf40cf96e31` (color) — Border Color
- `style.buttons.alignment` (alignment) — Alignment
- `show_intro` (boolean) — Show Intro Overlay — _This is the overlay that will be displayed to the user when they first visit the page. It will be displayed on top of the form and will b…_
- `intro.content.label_` (text) — Label
- `intro.content.heading` (text) — Heading
- `intro.content.description` (richtext) — Description
- `intro.content.button_text` (text) — Button Text [required]
- `6edc07e5-743b-b92b-93fc-3323c095cb52` (text) — Label — _The name of the step. This will appear below the progress bar_
- `395a0924-77fc-5f17-89f1-038d3fe51629` (text) — Name — _The name of the step. This will appear below the progress bar_
- `48a35528-d0ea-0830-dcce-f348138a566b` (choice) — Field Type [required] — _The type of field that will be displayed to the user._
- `37867bf1-1e54-1ede-f1ab-9c8d8ebd275b` (text) — Label — _The label that will be displayed to the user._
- `97e1812b-bdbc-a5f5-c0cc-cf6a0bb24d54` (text) — Form Property
- `87a35963-2d48-f704-e68a-f63d9f8ec692` (richtext) — Description — _The description that will be displayed to the user. This will appear below the field label_
- `fed23228-bd8c-0532-5d72-d6cf79f923a0` (text) — Placeholder [when steps.field_group.field.field_type MATCHES_REGEX text|email|rich_text|phone_number] — _The placeholder text that will be displayed in the field. This will disappear on focus_
- `bb0fa189-b021-74c8-ad75-510424a8f299` (text) — Default Value [when steps.field_group.field.field_type MATCHES_REGEX text|email|rich_text|phone_number] — _The default value of the field. This will be pre-filled in the form_
- `6c81a9a9-bc4a-a3b3-9bf9-59a31994aaf2` (text) — Text — _The text that will be displayed to the user_
- `7b52719d-fc2f-a6d7-1d53-8fc083931f4e` (text) — Value — _The value of the choice. This is what is sent to the form_
- `313571d0-7199-2fef-55f2-2e46f1a5d68e` (boolean) — Checked [when steps.field_group.field.field_type EQUAL boolean] — _The checkbox will be checked default_
- `19b967a6-5d13-2b66-5d09-a526965c509c` (boolean) — Required [when steps.field_group.field.field_type MATCHES_REGEX text|email|rich_text|phone_number|dropdown|checkbox|radio] — _Make this field required_
- `steps.field_group.field.hidden` (boolean) — Hidden
- `steps.field_group.field.conditional_logic` (boolean) — Conditional Logic
- `steps.field_group.field.validation_type` (choice) — If this field [when steps.field_group.field.conditional_logic EQUAL true] [required]
- `steps.field_group.field.validation_text` (text) — value [when steps.field_group.field.validation_type MATCHES_REGEX EQUAL|NOT_EQUAL|GREATER_THAN|LESS_THAN AND steps.field_group.field.conditional_logic EQUAL true] — _Multiple values can be specified by separating each with a comma (e.g. value1, value2). Each value corresponds to the respective property…_
- `steps.field_group.field.property_to_show` (text) — then show [when steps.field_group.field.conditional_logic EQUAL true] — _The form property to show. Multiple properties can be specified by separating each with a comma (e.g. name1,name2)_
- `steps.field_group.margin` (number) — Top Margin
- `2963d4ea-adf4-b259-4a3b-eb7d99b72452` (text) — Previous
- `7980679c-d79d-c0e6-75ea-e569828ec468` (text) — Next
- `11985ca0-91ac-d379-122b-d93c9b921430` (form) — Form
- `exit_intent` (boolean) — Exit Intent Form Submission
