# BurgerLab — Seedance 2.0 Background Video Prompt (v2, approved)

Final approved prompt for the scroll-scrubbed background film. Supersedes the v1 draft (which used both hero and exploded references and a 12–16s slow-motion concept).

## Generation settings (user-approved)

| Setting | Value |
|---|---|
| Model | Seedance 2.0 (`seedance_2_0`), mode `std` (high quality) |
| Product reference | Hero burger only — job `fce2602f-823a-4e7d-845b-e51b94eee580` as `image_references` |
| Aspect ratio | 16:9 |
| Resolution | 720p |
| Duration | 8–12 s (12 s preferred if credits allow: 54cr at 12s, 36cr at 8s) |
| Audio | none (`generate_audio: false`) — video is scroll-scrubbed and muted |

**Status:** ⏸ waiting on credit top-up (balance 6, need 36–54). Generate immediately once balance is confirmed.

**Output:** save raw result as `assets/videos/burgerlab-scroll-background-raw.mp4` (local save currently blocked by egress policy — record URL in `generation-log.md`). Do not re-encode or build the website until the video is reviewed.

## Prompt

```txt
Create a dynamic hyper-motion cinematic video for a premium BurgerLab landing page.

Use the provided hero burger image as the only product reference. The video should feature the exact same BurgerLab flagship burger from the reference image, in the same dark luxury food-commercial style.

This video will be used as a full-screen website background controlled by scroll progress with GSAP ScrollTrigger, Lenis, and frame-by-frame video scrubbing. The motion should be dynamic, cinematic, and visually impressive, but still readable when scrubbed manually by scroll.

Core concept:
A single continuous hyper-motion burger reveal. The video starts with the assembled hero burger, uses bold cinematic camera movement around the product, and in the second half the existing visible layers of the burger separate vertically into a clean exploded-view composition.

Important:
This must be one continuous uninterrupted shot. No cuts, no scene changes, no montage, no jump cuts, no separate camera angles stitched together. The full video must feel like one seamless camera move around the same burger in the same environment.

Critical product consistency rule:
Do not add any new ingredients that are not already visible in the reference burger image. Do not invent extra lettuce, tomato, onion, bacon, jalapeños, sauce layers, extra patties, extra cheese, or additional buns. The second half should only separate the existing visible layers of the reference burger. The burger must keep the same ingredient count, same visual identity, same colors, same proportions, and same overall look from start to finish.

Visual style:
- hyper-motion food advertising
- premium cinematic burger commercial
- dark luxury restaurant campaign
- dramatic amber and orange lighting
- deep charcoal background
- glossy reflective black surface
- realistic burger textures
- subtle steam rising from the burger
- controlled sesame seed particles, tiny sauce droplets, spice particles, and grill sparks as minimal accents
- high-end product reveal energy
- premium website hero background

Camera and motion direction:
Start with the burger centered in a dramatic hero position on a dark reflective surface. Begin with a cinematic push-in toward the burger, then smoothly transition into an orbiting camera move around the product. The camera should rotate around the burger in a premium product-commercial style, revealing the glossy bun, melted cheese, grilled patty texture, sauce, pickles, and the visible layers from the reference image.

Use dynamic camera movement: orbit, parallax, slight roll, controlled rotation, fast-but-smooth push-ins, and elegant pull-backs. The motion should feel energetic and expensive, not chaotic. The burger should remain the clear focal point at all times.

First half of the video:
Show the assembled BurgerLab hero burger as a premium product reveal. Keep the burger fully intact while the camera moves around it with cinematic energy. Use moving amber light sweeps, steam, controlled particles, sesame seeds, and subtle sparks to create a hyper-motion commercial look.

Second half of the video:
Transition into a controlled vertical separation effect. The burger should not explode randomly. Instead, the exact existing visible layers from the reference image should gently separate upward and downward into a clean floating stack.

Separate only what already exists in the reference burger:
- top bun
- visible sauce layer
- visible pickles/onion layer if present in the reference
- visible cheese layer
- visible beef patty or patties
- bottom bun

Do not add lettuce, tomato, bacon, jalapeños, extra patties, extra cheese, extra sauce, or any other new ingredient unless it is clearly visible in the original hero reference image.

The separation should feel like premium motion design, as if the burger is being carefully deconstructed by invisible precision. It should not look like a messy food explosion. The ingredients should move smoothly into a vertical stack while preserving the original burger's shape, materials, and proportions.

Environmental motion:
- warm amber light sweeps across the burger
- steam moves naturally upward
- tiny sesame seeds float in slow motion
- minimal sauce droplets and spice particles pass through the foreground
- soft sparks or grill embers appear in the background
- reflective surface catches the moving light
- during the separation moment, particles should support the motion but never overpower the product

The burger must remain visually consistent with the reference image. The assembled burger and the separated burger must clearly be the same product. Preserve the same premium bun, same patty texture, same cheese color, same sauce, same visible toppings, same lighting style, and same dark luxury environment.

Sequence:
1. Start with the assembled BurgerLab hero burger in a dark cinematic studio setup.
2. Camera pushes in toward the burger with strong premium lighting.
3. Camera begins a smooth orbit around the burger, showing the existing visible layers and textures.
4. Add controlled hyper-motion energy: light sweeps, parallax particles, steam, subtle sparks, and elegant food-commercial motion.
5. In the second half, the same burger begins to separate vertically into its existing visible layers.
6. Camera slightly pulls back or continues a controlled orbit to reveal the full separated burger stack.
7. End on a powerful centered exploded-view hero frame, with only the original burger layers floating cleanly in vertical order.

Motion requirements:
- One continuous uninterrupted shot
- Dynamic hyper-motion camera movement
- Smooth orbit and rotation around the burger
- Controlled vertical separation effect in the second half
- Stable enough for scroll scrubbing
- No jump cuts
- No scene cuts
- No abrupt camera teleporting
- No extreme distortion
- No chaotic motion blur
- No flicker
- No product inconsistency
- No messy or random ingredient explosion
- No new ingredients added during the video

Important constraints:
- Use only the assembled hero burger reference as the product identity
- The burger should separate only in the second half of the video
- Keep the separation elegant, vertical, readable, and premium
- Do not add any ingredient that is not already visible in the reference image
- Do not increase the number of layers
- Do not change the burger into a different burger
- No text inside the video
- No logos
- No people
- No hands
- No packaging
- No plate clutter
- No cartoon style
- Keep the burger realistic, premium, and appetizing
- Keep enough dark negative space around the burger for website text and UI overlays
```

## Acceptance criteria

- One continuous shot, no cuts or scene changes.
- Assembled → orbit/hyper-motion first half; controlled vertical separation second half only.
- Ingredient count and identity match the hero reference exactly — no invented ingredients.
- Readable when scrubbed both directions; no flicker or chaotic motion blur.
- Dark negative space preserved for HTML overlays; no text/logos/people/hands.
