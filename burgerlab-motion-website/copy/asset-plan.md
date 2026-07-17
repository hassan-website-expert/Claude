# BurgerLab — Asset Plan

Every media asset the project needs, its exact path, purpose, and generation model. No asset may be generated before this plan and the matching prompt are approved.

**Models:** GPT Image 2 (stills) and Seedance 2.0 (video), both via Higgsfield MCP.
**Global rules:** 16:9, high quality, dark premium cinematic style, no text, no real logos, no people, no hands.

## Asset groups

### 1. Hero burger image

| | |
|---|---|
| File | `assets/images/hero-burger.png` |
| Model | GPT Image 2 |
| Status | ⏳ pending approval |

Defines the final flagship burger appearance. Used as hero poster, loading image, mobile fallback poster, and master visual reference for everything else. Direction: one premium burger centered, dark cinematic background, golden sesame bun, juicy patty, melted cheddar, lettuce/tomato/pickles/sauce, subtle steam, reflective black surface, warm rim light.

### 2. Exploded burger reference

| | |
|---|---|
| File | `assets/images/exploded-burger-reference.png` |
| Model | GPT Image 2 |
| Status | ⏳ pending approval |

Defines the vertical ingredient separation. **The most important reference for the Seedance 2.0 video.** Direction: same burger as hero, ingredients separated vertically in clean order (top bun → cheese → patty → lettuce → tomato → sauce → pickles → bottom bun), premium dark background, elegant — not a messy explosion.

### 3. Ingredients / product detail image

| | |
|---|---|
| File | `assets/images/ingredients-detail.png` |
| Model | GPT Image 2 |
| Status | ⏳ pending approval |

Used in the product-detail section and ingredient cards. Direction: macro food details — grilled patty texture, melted cheese pull, fresh lettuce and tomato, sauce detail — dark premium studio lighting, shallow depth of field.

### 4. Catalog burger images (4)

| File | Burger |
|---|---|
| `assets/images/catalog-classic-stack.png` | Classic Stack — balanced classic cheeseburger |
| `assets/images/catalog-smoky-bacon.png` | Smoky Bacon Lab — bacon, smoked sauce, double cheese |
| `assets/images/catalog-spicy-lab.png` | Spicy Lab — jalapeño, spicy sauce, charred patty |
| `assets/images/catalog-truffle-melt.png` | Truffle Melt — mushroom/truffle-style, melted cheese |

Model: GPT Image 2 · Status: ⏳ pending approval

Used in the catalog/menu card grid. All four must share the same camera angle, dark background, and warm amber lighting so the catalog feels coherent.

### 5. Scroll background video

| | |
|---|---|
| Raw file | `assets/videos/burgerlab-scroll-background-raw.mp4` |
| Production file | `website/public/bg.mp4` (all-keyframe H.264 re-encode) |
| Model | Seedance 2.0 (image-to-video, referencing assets 1 and 2) |
| Duration | 12–16 seconds |
| Status | ⏳ blocked until hero + exploded images are approved |

Full-screen fixed background scrubbed by scroll progress. Three slow phases: assembled hero burger → controlled vertical ingredient separation → fully exploded vertical stack. Slow, stable, no cuts, no shake, dark negative space preserved for overlaid HTML text.

## Generation order and gates

1. **Gate 1 — user approves plan + prompts** → generate the 7 still images, save to `assets/images/`.
2. **Gate 2 — user reviews and approves images** → upload hero + exploded references, generate Seedance 2.0 video, save raw file to `assets/videos/`.
3. **Gate 3 — user approves video** → re-encode with `scripts/swap-bg-video.sh` and begin website build.

Rules:

- Generate exactly the listed assets. No extra variations unless requested.
- Check Higgsfield credit balance with the `balance` tool before each batch.
- Download every result into the correct `assets/` path immediately after generation.
- If a job is asynchronous, poll status and report progress.
