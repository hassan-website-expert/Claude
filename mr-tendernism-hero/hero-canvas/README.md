# Mr. Tendernism — Canvas Scroll Hero (GSAP + ScrollTrigger)

A lightweight, self-contained Canvas **frame-sequence** hero that scrubs an
80-frame WebP sequence on scroll. It mounts as the **background** of your
existing Elementor hero section — your headline, script line, paragraph and CTAs
stay exactly as they are (they are **not** baked into the frames).

It only ever **draws** the locked frame assets. It never regenerates, resizes,
recompresses or otherwise modifies them.

## Files

- `hero-canvas-embed.html` — the whole thing (HTML + inline CSS + inline JS).
  Paste it into one Elementor **HTML** widget.

## 1. Host the frame assets (unchanged)

Upload the two locked sequences and the two poster stills to your site (or a
CDN). Suggested layout under `wp-content/uploads/tendernism-hero/`:

```
frames/desktop/0001.webp … 0080.webp     (1152×648, ~6.4 MB total)
frames/mobile/0001.webp  … 0080.webp     (720×900,  ~4.1 MB total)
poster-start.webp                        (frame 0001 — the loading poster)
fallback-end.webp                        (frame 0080 — reduced-motion / no-JS / failure)
```

Do not re-encode them; upload the exact WebP files.

## 2. Place the widget

Add an **HTML** widget as the **first element inside your existing hero
Section/Container**, and paste `hero-canvas-embed.html` into it. The script walks
up to the closest Elementor section/container and turns it into the pinned host,
inserting the canvas *behind* your existing content.

If auto-detection picks the wrong element, set an explicit host selector:

```html
data-thc-host="#hero"      <!-- or ".elementor-element-abc123", etc. -->
```

## 3. Point it at your assets

Edit the `data-*` attributes on the `.thc` element:

| Attribute | Purpose | Example |
|---|---|---|
| `data-thc-desktop` | Desktop frame base URL | `/wp-content/uploads/tendernism-hero/frames/desktop/` |
| `data-thc-mobile`  | Mobile frame base URL  | `/wp-content/uploads/tendernism-hero/frames/mobile/` |
| `data-thc-poster`  | Start-frame poster     | `/wp-content/uploads/tendernism-hero/poster-start.webp` |
| `data-thc-fallback`| End-frame fallback     | `/wp-content/uploads/tendernism-hero/fallback-end.webp` |

Optional tuning: `data-thc-count` (80), `data-thc-pad` (4), `data-thc-ext`
(webp), `data-thc-breakpoint` (768), `data-thc-pin-desktop` (250 vh),
`data-thc-pin-mobile` (150 vh), `data-thc-preload` (15), `data-thc-host`.

## How it behaves

- **Desktop loads only the desktop frames; mobile loads only the mobile
  frames.** The device is chosen once at load from `data-thc-breakpoint`; the
  other sequence is never requested.
- **Poster-first:** the start poster paints immediately and covers the canvas
  until the first real frame decodes — the canvas is never seen blank.
- **Progressive loading:** frame 1 first (initial state), then the first ~15
  frames, then the remainder in the background. The page is never blocked.
- **Scrub:** ScrollTrigger pins the hero and maps scroll → frame index linearly
  (`scrub: true`, `ease: 'none'` — no artificial easing). Frame 1 at the start,
  frame 80 at the end; the final frame stays visible after the pin releases.
  While a wanted frame is still loading, the nearest decoded frame is shown, so
  there is no flicker.
- **Cover draw:** frames are drawn to fill the hero with their exact aspect
  ratio preserved (centered, overflow cropped) — no CSS stretching, no
  distortion. Desktop uses the 16:9 sequence, mobile the 4:5 sequence.
- **`prefers-reduced-motion: reduce`:** no ScrollTrigger, no scrubbing — the
  static end-state image is shown and all content/CTAs stay usable.
- **No JavaScript / GSAP fails / frames fail to load:** the poster (or the
  end-state fallback) is shown; the hero is never blank and stays readable.
- **No horizontal overflow:** the canvas layer clips overflow and the host is
  guarded with `overflow-x: clip`.

## Notes

- Requires GSAP 3 + ScrollTrigger (loaded from cdnjs by the embed). No other
  framework, no extra plugin.
- Clicks pass through the canvas layer (`pointer-events: none`) so your CTA
  buttons remain clickable.
- The embed is idempotent (guards against double-init if the widget is
  duplicated).
