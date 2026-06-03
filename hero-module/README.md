# Hero Module for HubSpot CMS

A simple static hero module with hardcoded typography values for HubSpot CMS.

## 📁 File Structure

```
hero-module/
├── meta.json          # Module metadata (label, categories, etc.)
├── fields.json        # Module field definitions
├── module.html        # HubSpot template markup
├── module.css         # Module styles (hardcoded typography)
└── module.js          # JavaScript functionality
```

## 📤 HubSpot Pe Upload Karna

### Method 1: HubSpot CLI (Recommended)

1. **Install HubSpot CLI** (agar pehle se installed nahi hai):
   ```bash
   npm install -g @hubspot/cli
   ```

2. **Project mein authenticate karo**:
   ```bash
   hs init
   ```

3. **Module upload karo**:
   ```bash
   hs upload hero-module your-theme/modules/hero-module
   ```

### Method 2: Manual Upload via HubSpot Design Manager

1. **HubSpot Account** → **Marketing** → **Files and Templates** → **Design Tools**
2. **File** → **New** → **Module**
3. Module ke saare files manually copy-paste karo

## 📝 Module Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `hero_headline` | Text | "Welcome to Our Website" | Main headline text |
| `hero_subheadline` | Text | "Discover amazing solutions..." | Subheadline text |
| `hero_button_text` | Text | "Get Started" | CTA button text |
| `hero_button_url` | Text | "#contact" | Button link URL |
| `hero_background_image` | Image | - | Background image (optional) |
| `hero_alignment` | Choice | "center" | Content alignment (left/center/right) |
| `hero_overlay_opacity` | Number | 50 | Overlay opacity (0-100) |

## 🔤 Hardcoded Typography Values

### Headline
- **Font Size**: 56px (Desktop), 42px (Tablet), 32px (Mobile), 28px (Small Mobile)
- **Font Weight**: 700 (Bold)
- **Line Height**: 1.2
- **Letter Spacing**: -0.02em
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Color**: #ffffff (White)

### Subheadline
- **Font Size**: 24px (Desktop), 20px (Tablet), 18px (Mobile), 16px (Small Mobile)
- **Font Weight**: 400 (Normal)
- **Line Height**: 1.6
- **Letter Spacing**: 0
- **Font Family**: Same as headline
- **Color**: rgba(255, 255, 255, 0.9)

### Button
- **Font Size**: 18px (Desktop), 16px (Tablet/Mobile), 14px (Small Mobile)
- **Font Weight**: 600 (Semi-bold)
- **Line Height**: 1
- **Letter Spacing**: 0.5px
- **Text Transform**: Uppercase
- **Font Family**: Same as headline
- **Color**: #ffffff
- **Background**: #ff6b6b

## 🎨 Features

- ✅ Responsive design (4 breakpoints)
- ✅ Background image support with overlay
- ✅ Gradient fallback (agar image nahi ho)
- ✅ Content alignment options (Left, Center, Right)
- ✅ Smooth scroll animations
- ✅ Button hover effects
- ✅ Parallax effect on desktop

## 🛠️ Customization

Typography values change karne ke liye `module.css` mein hardcoded values edit karo:

```css
.hero-headline {
  font-size: 56px;  /* Change this value */
  font-weight: 700; /* Change this value */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: > 991px
- **Tablet**: 768px - 991px
- **Mobile**: <= 767px
- **Small Mobile**: <= 479px
