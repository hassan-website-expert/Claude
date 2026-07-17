# BurgerLab — Website Brief

Single-page, scroll-driven cinematic landing page for BurgerLab. The core idea:

> A premium burger reveal where the scroll controls the product film.

A full-screen AI-generated burger film sits fixed behind the page. As the visitor scrolls, the video is scrubbed frame-by-frame; the flagship Lab Burger slowly separates vertically into its ingredients. Page content floats above it in dark premium panels.

## Stack

- **Vite + React** (JavaScript, not TypeScript)
- **GSAP** + `gsap/ScrollTrigger` for scroll motion and pinning
- **Lenis** for smooth scrolling (driven from the GSAP ticker, `lagSmoothing(0)`)
- CSS variables for brand tokens (see `brand-kit.md`)
- `ffmpeg` all-keyframe H.264 encode for the scrubbed background video

The app lives in `website/`. Portable static build: `npm run build -- --base=./`, previewed over HTTP with `npx serve dist` (never `file://`).

## Section plan

| # | Section | Video phase | Content |
|---|---|---|---|
| 1 | `#home` — Hero | Assembled burger | Headline, subheadline, CTA buttons, chips ("Crafted fresh", "30 min delivery", "4.9 rating"), floating order card. Hero text placed over the calmest video area. |
| 2 | `#split` — Ingredient split | Separation begins | Pinned section; scroll drives the reveal. Copy: "Built layer by layer." / "Every ingredient earns its place." Word-by-word text reveal, HTML ingredient labels (never baked into video). |
| 3 | `#ingredients` — Detail cards | Separation continues | Cards: toasted brioche, flame-grilled patty, melted cheddar, fresh greens, signature sauce. Floating dark panels around a calm zone of the video, amber dots, mono labels. |
| 4 | `#catalog` — Burger catalog | Exploded stack | 4 cards (Classic Stack, Smoky Bacon Lab, Spicy Lab, Truffle Melt): image, name, description, price, rating, cooking time, small CTA. |
| 5 | `#experience` — Ordering experience | Exploded stack | App-like ordering concept: featured order summary card, meal category chips, favorite/rating micro-interactions. "Designed for late-night cravings and premium flavor." |
| 6 | `#cta` — Final order | Exploded stack | Headline, short line, price/bundle offer, primary CTA "Order The Lab Burger", secondary "View full menu". |
| 7 | `footer` | — | Gradient dissolve to black, minimal brand signature. |

## Layer architecture

| Element | z-index | Role |
|---|---:|---|
| `.bg-video` / `#bgv` | 0 | Fixed full-screen video, object-fit cover, scrubbed by scroll |
| `.bg-tint` | 1 | Radial darkening / contrast layer for readability |
| `.grain` / `.ambient-dots` | 2 | Subtle texture and amber dots |
| `#root` / `.page` | 10 | React page sections |
| `.floating-ui` | 20 | Catalog / order cards |
| `.custom-cursor` | 100 | Optional cursor ring, desktop only |

Gradient dissolve above the footer, not a fixed black overlay.

## Motion implementation

- **Video scrub:** one ScrollTrigger spanning the whole document (`start: "top top"`, `end: "bottom bottom"`, `scrub: true`); scroll progress maps to `bgVideo.currentTime` with a small delta threshold (~0.008s) to avoid redundant seeks. Video is paused; scroll is the only clock.
- **Lenis bridge:** `lenis.on("scroll", ScrollTrigger.update)`; Lenis `raf` driven from `gsap.ticker`; `gsap.ticker.lagSmoothing(0)`.
- **Pinned split section:** ScrollTrigger pin over ~1.8 viewport heights; progress drives word opacity/blur/translate and staggered ingredient label reveals.
- **Dev hooks (DEV only):** `window.__bgv`, `window.__lenis`, `window.__ST`.

## Video pipeline

1. Raw Seedance 2.0 output → `assets/videos/burgerlab-scroll-background-raw.mp4`
2. `scripts/swap-bg-video.sh <raw>` re-encodes to all-keyframe H.264 (`-g 1 -keyint_min 1`, CRF 18, no audio, faststart) → `website/public/bg.mp4`
3. Verify in browser console: `window.__bgv.readyState === 4` and `window.__bgv.duration` is set.

All-keyframe encoding is required — raw AI MP4s seek too slowly for smooth scrubbing.

## Mobile behavior

- Hide `.bg-video` on touch / ≤768px; show fixed `hero-burger.png` poster instead.
- Reduce or remove pinned sections on small screens.
- Catalog grid collapses to a vertical stack.
- No custom cursor on touch devices.
- No tiny ingredient labels on mobile.

## Build workflow (with approval gates)

1. ✅ Project structure + planning files (this phase)
2. ⛔ **Gate:** user approves plan → generate 7 stills with GPT Image 2
3. ⛔ **Gate:** user approves images → generate Seedance 2.0 video
4. ⛔ **Gate:** user approves video → re-encode, build website (hero → split → ingredients → catalog → experience → cta → footer → mobile fallback → polish)
5. Verify: dev server + browser check, then `npm run build -- --base=./` must pass

## Definition of done

The full verification checklist lives in the project skill; headline items: all planning files and media assets exist in their exact paths, the app runs and builds cleanly, video scrubs smoothly, text stays readable over the video, mobile fallback works, and no real logos or baked-in text appear in any media.
