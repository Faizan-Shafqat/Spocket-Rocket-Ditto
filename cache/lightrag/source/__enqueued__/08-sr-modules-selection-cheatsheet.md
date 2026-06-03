# SR modules — selection cheatsheet (from sr-expert + sr-modules-inventory)

**Full list:** 172 modules in `docs/sr-modules-inventory.md` (Heroes, Nav, One/Two/Three/Five col, Bento, Cards, Stats, Pricing, Tabs, Testimonials, Clients, Blog, Gallery, Locations, Events, Footer, FAQ, Offers, etc.).

## Heroes (inventory excerpt)
| Module | Layout | Best for |
|--------|--------|----------|
| SR Hero 01 | Single col centered | Standard hero — bg image/video/color, parallax, heading array, CTAs, overlay |
| SR Hero 02 | Single col | Cleaner, no parallax |
| SR Hero 03 | Single col | Hero + form below heading |
| SR Hero 04 | Single col | Minimal text-only |
| SR Hero Card 01 | Two col | Hero + card panel |
| SR Hero Form 01 | Two col | Left text, right form |
| SR Hero Parallax 01 | Single col | GSAP parallax |
| SR Hero Two Col 01 | Two col | Split hero text + image |
| SR Hero Video 01 | Single col | Video background |
| SR Hero 404 / 500 | Single col | Error pages |

## sr-expert quick Figma → SR mapping (abbrev)
- Full-width hero + CTA → SR Hero 01 (fallback SR Hero 02)
- Hero + form panel → SR Hero Form 01 (fallback SR Hero Card 01)
- Video bg hero → SR Hero Video 01 (fallback SR Hero Parallax 01)
- Text left, image right → SR Two Col 01 (flip via fields) (fallback SR Two Col 02)
- Three feature cards → SR Cards Features 01 (fallback SR Three Col 01)
- Five-up icons → SR Five Col 01
- Bento grid → SR Bento Grid 01 (else new module)
- Logo row → SR Clients 01 / Carousel
- Testimonial → SR Cards Testimonial Slider / Grid
- Stats → SR Stats 01 / 04
- Pricing → SR Cards Pricing 01 / SR Pricing 01
- FAQ → SR FAQ 01 / Tabs Accordion
- Blog cards → SR Cards Articles 01/02
- Gallery → SR Gallery 01/02
- Footer → SR Footer 01 / Min
- Nav mega → SR Navigation 01 / Nav Min / Off Canvas
- Raw embed last resort → SR HTML

When choosing: read full `sr-modules-inventory.md` for variants and niche modules (events, jobs, meetings, gated content, notifications, modals).
