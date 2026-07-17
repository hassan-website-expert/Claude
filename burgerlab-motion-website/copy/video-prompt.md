# BurgerLab — Seedance 2.0 Background Video Prompt

Final prompt for the scroll-scrubbed background film. Model: **Seedance 2.0** via Higgsfield MCP.

**Preconditions:** `assets/images/hero-burger.png` and `assets/images/exploded-burger-reference.png` must exist and be approved. Both are uploaded as references for the image-to-video generation (`media_upload` / `media_confirm` if hosted references are required).

**Settings:** 16:9 · 12–16 seconds · high quality · no dialogue.

**Output:** save raw result as `assets/videos/burgerlab-scroll-background-raw.mp4`, then re-encode to all-keyframe H.264 with `scripts/swap-bg-video.sh` → `website/public/bg.mp4`.

## Prompt

```txt
Create a cinematic scroll-driven background video for a premium BurgerLab landing page.

This video will be used as a full-screen website background controlled by scroll progress with GSAP ScrollTrigger, Lenis, and frame-by-frame video scrubbing. The motion must be slow, stable, smooth, and readable when the user manually scrolls.

Use the provided reference images:
1. The assembled BurgerLab flagship burger reference
2. The exploded burger vertical ingredient reference

The video should show one premium flagship burger called The Lab Burger.

Sequence:
1. Start with the burger fully assembled, centered in the frame, slightly elevated above a dark reflective surface. The burger looks premium, realistic, juicy, and cinematic, with warm amber rim light, soft steam, and subtle haze.
2. The camera slowly pushes in with a gentle cinematic movement. Keep the burger centered and stable.
3. As the motion progresses, the top bun slowly rises. Then the cheese, patty, lettuce, tomato, pickles, sauce, and bottom bun separate vertically in a controlled elegant motion.
4. The ingredients should not explode randomly. They should separate into a clean vertical exploded-view layout, like a premium product reveal.
5. End with the burger fully deconstructed vertically, each ingredient floating in a clear layered stack, still centered and readable.

Visual style:
- ultra-cinematic food advertising
- dark luxury burger brand
- warm amber highlights
- deep charcoal background
- realistic food textures
- subtle steam
- tiny sesame seeds and sauce particles only as minimal accents
- shallow depth of field but keep the burger readable
- premium website hero background

Important constraints:
- No text inside the video
- No logo inside the video
- No people
- No hands
- No plates with distracting decoration
- No fast cuts
- No camera shake
- No chaotic ingredient explosion
- No messy particles
- No extreme zooms
- Keep enough dark negative space around the burger for website text and cards
- The product must stay visually consistent from assembled burger to exploded burger

Duration: 12 to 16 seconds.
Aspect ratio: 16:9.
Quality: high.
```

## The three phases (mapped to scroll)

| Phase | Video content | Site sections over it |
|---|---|---|
| 1. Hero burger reveal | Assembled Lab Burger, centered, subtle steam | `#home` |
| 2. Ingredient separation | Burger slowly opens vertically, controlled motion | `#split` (pinned), `#ingredients` |
| 3. Exploded product display | Clean floating vertical ingredient stack | `#catalog`, `#experience`, `#cta` |

## Acceptance criteria

- One continuous shot, no cuts, no scene changes.
- Motion slow and monotonic enough that scrubbing backward/forward reads naturally.
- Burger stays centered with dark negative space on the sides for HTML overlays.
- The burger design matches the approved hero and exploded reference images.
- No flicker, no shake, no text, no logos, no people.
