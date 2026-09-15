# Mr. Tendernism — Cinematic Hero

A pinned, scroll-driven documentary hero for the official Mr. Tendernism website.
The visitor doesn't browse a page — they watch a short film. Five approved video
chapters dissolve into one another as the viewport stays pinned, editorial serif
typography rises and fades in silence, and the sequence finally unpins and
dissolves into the existing homepage.

> Not every fire tells a story.

This project **only replaces the hero section**. The navigation and the rest of
the homepage are intentionally left untouched — `src/sections/Homepage.jsx` is a
minimal placeholder that stands in for the existing site so the hero has
somewhere to land.

---

## Stack

- **React + Vite** — component architecture, fast build
- **GSAP + ScrollTrigger** — pinning + the scrubbed master timeline
- **Lenis** — long, weighted smooth scroll
- Self-hosted **Cormorant Garamond** (display) + **Inter** (UI) — no third-party font dependency

## The five chapters

| # | Scene | Video | Copy |
|---|-------|-------|------|
| I | Smoke | `01-smoke-intro.mp4` | *Not every fire tells a story.* |
| II | The Man | `02-mr-tendernism-arrival.mp4` | *Meet Mr. Tendernism* |
| III | Fire | `03-the-fire.mp4` | *It doesn't start with the meat. It starts with the fire.* |
| IV | Craft | `04-the-craft.mp4` | *Every cut is earned. Not rushed. Perfected over time.* |
| V | Legend | `05-the-legend.mp4` | *Welcome to Tendernism* + CTA |

## Architecture

Animation logic is fully separated from markup so it can be reused — and later
re-created inside Elementor with the same math.

```
website/src/
├─ App.jsx                     Composition root; picks animated vs reduced-motion hero
├─ hero/
│  ├─ scenes.js                Single source of truth: video + copy per chapter
│  ├─ heroTimeline.js          Pure GSAP timeline builders (no React, no ScrollTrigger)
│  ├─ useCinematicHero.js      Pin + scrub + responsible video play/pause & preload
│  ├─ useLenis.js              Smooth scroll wired to GSAP ticker + ScrollTrigger
│  ├─ usePrefersReducedMotion.js
│  ├─ SceneCopy.jsx            Shared, crawlable typography for every scene
│  ├─ CinematicHero.jsx        Pinned, scroll-scrubbed presentation (markup only)
│  └─ StaticHero.jsx           prefers-reduced-motion presentation (no pin/scrub)
└─ sections/Homepage.jsx       Placeholder for the existing homepage
```

### How the motion works

- One full-viewport **stage is pinned** for ~460vh (one slow breath per chapter).
- A single **paused master timeline** (duration = 5 units, one per scene) is
  **scrubbed** by scroll. Each scene owns its own nested text timeline.
- Videos **crossfade** across shared boundaries (opacity dissolves) — never a cut.
- A near-imperceptible ken-burns settle (1.06 → 1.0) is the only camera move.
- Only the active video (plus its crossfade neighbours) decodes frames; the rest
  are paused. Clips are preloaded just before they are needed.

### Accessibility & SEO

- All headings and copy are **real HTML** (crawlable) — nothing important is
  baked into the videos. One `<h1>` (the finale wordmark); scenes use `<h2>`.
- Full **`prefers-reduced-motion`** path: no pinning, no scrubbing, no scale
  drift — calm full-height panels that fade in, with only the in-view clip playing.
- Text contrast is held by a fixed grade/vignette layer independent of the footage.

## Run it

```bash
cd website
npm install
npm run dev            # development
npm run build          # production build (base: ./ — portable to any subpath)
npm run preview        # preview the production build over HTTP
```

## Assets

The five approved videos are the source of truth (`assets/videos/`, served from
`website/public/videos/`). They are used as-is — not cropped, re-encoded, or
filtered. No `logo.png` was supplied, so the wordmark is set in Cormorant
Garamond; drop a `logo.png` into `website/public/images/` and swap the `.nav__brand`
markup if a raster mark is preferred later.

> **Note on video codec:** the clips are H.264/MP4 and play in all real browsers
> (Chrome, Edge, Safari, Firefox). The sandbox's headless Chromium ships without
> the proprietary H.264 decoder, so automated screenshots show the type over
> black — the footage itself is unaffected.
