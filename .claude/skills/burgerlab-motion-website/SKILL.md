---
name: burgerlab-motion-website
description: >-
  Production workflow and build rules for a BurgerLab scroll-driven motion website built with
  Claude Code, Higgsfield MCP, GPT Image 2, Seedance 2.0, Vite, React, GSAP, Lenis, and
  ScrollTrigger. Use this skill whenever working on the BurgerLab landing page, its AI-generated
  burger images, exploded burger scroll video, catalog visuals, scroll-scrubbed background video,
  React implementation, video encoding, motion timing, dark premium UI, or asset replacement
  workflow. Triggers: burgerlab, motion website, scroll-driven website, Higgsfield MCP, GSAP,
  Lenis, ScrollTrigger, Seedance 2.0, GPT Image 2, burger landing page.
---

# BurgerLab scroll-driven motion website

A single-page, scroll-driven cinematic landing page for **BurgerLab**, a fictional dark luxury burger brand.

The final website should feel like a premium food campaign, not a generic restaurant template. The main visual hook is an AI-generated burger film used as a full-screen background video. As the visitor scrolls, the video is scrubbed frame-by-frame with GSAP ScrollTrigger and Lenis, making one flagship burger slowly separate into a vertical exploded composition.

The workflow is designed for **Claude Code** working in a local project folder. Claude Code should create the project structure, generate or request media assets through Higgsfield MCP, organize everything locally, build the React/Vite site, encode the final video for scroll scrubbing, and verify the implementation.

The site should be built around one strong idea:

> A premium burger reveal where the scroll controls the product film.

The page can include multiple burger visuals in catalog cards and supporting sections, but the scroll-driven background video should focus on **one flagship BurgerLab burger**.

---

## Project facts

- **Project type:** Scroll-driven cinematic product landing page
- **Brand:** BurgerLab
- **Product focus:** Premium gourmet burgers
- **Flagship product:** The Lab Burger
- **Core interaction:** Scroll-scrubbed AI video background
- **Main video concept:** Finished burger slowly separates vertically into its ingredients as the user scrolls
- **Audience:** food lovers, premium fast-food customers, creators interested in AI website workflows, web developers, designers, and AI tool users
- **Website goal:** Demonstrate a visually impressive AI-built motion website while making BurgerLab feel like a polished premium burger brand
- **Build environment:** Claude Code, local project folder
- **Stack:** Vite + React + GSAP + Lenis + ScrollTrigger
- **Image model:** GPT Image 2 through Higgsfield MCP
- **Video model:** Seedance 2.0 through Higgsfield MCP
- **Background video format:** 16:9, slow, cinematic, all-keyframe H.264 after encoding

---

## Primary video title direction

Use this video positioning as the creative north star:

> **Claude Code Can Now Build Cinematic Motion Websites with AI-Generated Video**

The website workflow should support that title. The point is not only that Claude Code can write React code. The point is that Claude Code can operate like a production assistant: planning the brand, creating assets, generating the video, organizing files, implementing scroll motion, debugging, and preparing a final polished website.

---

## Suggested project root

Claude Code should create a fresh folder for the project. Suggested folder name:

```txt
burgerlab-motion-website/
```

Recommended structure:

```txt
burgerlab-motion-website/
├─ assets/
│  ├─ images/
│  │  ├─ hero-burger.png
│  │  ├─ exploded-burger-reference.png
│  │  ├─ ingredients-detail.png
│  │  ├─ catalog-classic-stack.png
│  │  ├─ catalog-smoky-bacon.png
│  │  ├─ catalog-spicy-lab.png
│  │  └─ catalog-truffle-melt.png
│  ├─ references/
│  │  ├─ burgerlab-ui-reference.png
│  │  ├─ burgerlab-hero-reference.png
│  │  ├─ burgerlab-exploded-reference.png
│  │  └─ burgerlab-video-master-reference.png
│  └─ videos/
│     ├─ burgerlab-scroll-background-raw.mp4
│     └─ burgerlab-scroll-background-all-keyframe.mp4
├─ copy/
│  ├─ brand-kit.md
│  ├─ asset-plan.md
│  ├─ image-prompts.md
│  ├─ video-prompt.md
│  └─ website-brief.md
├─ scripts/
│  └─ swap-bg-video.sh
└─ website/
   ├─ index.html
   ├─ package.json
   ├─ vite.config.js
   ├─ public/
   │  ├─ bg.mp4
   │  └─ img/
   └─ src/
      ├─ App.jsx
      ├─ main.jsx
      ├─ styles.css
      ├─ motion.js
      └─ data/
         └─ burgers.js
```

Rules:

- Do not place generated assets randomly in downloads or temporary folders.
- Every final media asset must be saved inside the project structure.
- Keep raw AI outputs in `assets/` and production-ready site files in `website/public/`.
- Keep all prompts in `copy/` so the workflow can be reused or shown in the video description.

---

## Required stack

Use this stack unless the user explicitly changes it:

- Vite
- React
- JavaScript, not TypeScript, unless explicitly requested
- GSAP
- `gsap/ScrollTrigger`
- Lenis for smooth scrolling
- CSS variables for brand tokens
- Higgsfield MCP for GPT Image 2 and Seedance 2.0 generations
- `ffmpeg` for all-keyframe H.264 video encoding

Install expected dependencies inside `website/`:

```bash
npm create vite@latest website -- --template react
cd website
npm install
npm install gsap lenis
npm run dev
```

Portable static build:

```bash
npm run build -- --base=./
```

Preview production build over HTTP, not `file://`:

```bash
npx serve dist
```

---

## Claude Code operating rules

Claude Code should behave like a careful production assistant, not an uncontrolled generator.

Before generating media or spending credits, Claude Code must:

1. Read this skill.
2. Create or inspect the project folder.
3. Create the copy files and asset plan.
4. Return a short plan listing exactly what it intends to generate (plan mode is a good fit for this step).
5. Ask the user for explicit approval before running any Higgsfield MCP generation tool (`generate_image`, `generate_video`).

Claude Code must not:

- Generate random assets without a plan.
- Use credits before approval.
- Generate more variations than requested.
- Open unrelated browser tabs or apps.
- Use real restaurant logos or real food brand names.
- Bake website text into images or video.
- Replace the requested React/Vite/GSAP/Lenis/ScrollTrigger stack with another framework.
- Build the website before the key media plan exists.

Claude Code should:

- Keep the workflow organized in files.
- Save prompts and generation notes in `copy/` before running generations.
- Use consistent naming.
- Download every Higgsfield MCP result into the correct `assets/` path immediately after generation.
- Build the site after the core media assets are ready.
- Run the app locally and verify it (dev server + browser check).
- Run a production build before considering the project complete.

### Higgsfield MCP usage notes

- Use the `generate_image` tool with the GPT Image 2 model for all still images.
- Use the `generate_video` tool with the Seedance 2.0 model for the background video.
- Check credit balance with the `balance` tool before large generation batches if available.
- Image-to-video generations should reference the hero and exploded burger images; upload them with `media_upload` / `media_confirm` if the tool requires hosted references.
- If a generation job is asynchronous, poll its status and report progress to the user instead of silently waiting.

---

## Brand identity

Use the BurgerLab brand kit as the source of truth. If `copy/brand-kit.md` exists, read it before editing the site or generating media.

### Core identity

- **Name:** BurgerLab
- **Flagship burger:** The Lab Burger
- **Positioning:** A dark luxury burger brand built around cinematic presentation, premium ingredients, and experimental flavor combinations.
- **Tone:** confident, bold, premium, visual, modern, direct.
- **Avoid:** childish fast-food styling, cheap red/yellow chain-restaurant design, generic diner visuals, overly playful cartoon UI.

### Brand personality

BurgerLab should feel like a premium burger studio: part restaurant, part product launch, part cinematic food campaign.

The brand should communicate:

- premium ingredients
- fire-grilled craft
- bold flavor
- dark cinematic atmosphere
- modern ordering experience
- refined fast-food energy

---

## Visual reference direction

The uploaded UI reference defines the website mood:

- dark mobile-app inspired composition
- black and charcoal surfaces
- rounded cards
- premium amber/yellow accent dots
- food photography as the visual focus
- soft shadows and depth
- floating panels
- clean modern UI hierarchy

Do not copy the reference directly. Use it as a design direction.

Translate the reference into a premium desktop landing page:

- dark graphite background
- floating burger cards
- subtle circular background shapes
- warm amber accent elements
- elevated product panels
- rounded UI containers
- clean typographic hierarchy
- minimal glass treatment only where useful
- high contrast food imagery

The old NOXÉ glass-heavy style should be reduced. BurgerLab can use subtle translucent panels, but the dominant style should be **premium dark food-commerce UI**, not generic glassmorphism.

---

## Brand tokens

Recommended CSS variables:

```css
:root {
  --bg: #10100F;          /* Deep Charcoal */
  --bg-2: #181816;        /* Smoked Graphite */
  --surface: #20201D;     /* Card Black */
  --surface-2: #2A2924;   /* Warm Graphite */
  --surface-soft: rgba(32, 32, 29, 0.76);
  --text: #F8F4EA;        /* Warm Cream */
  --muted: #A9A193;       /* Toasted Gray */
  --accent: #F5B31A;      /* BurgerLab Amber */
  --accent-2: #FF6A2A;    /* Flame Orange */
  --green: #4CD36F;       /* Fresh Herb Green */
  --line: #35332D;        /* Carbon Border */
  --danger: #F04438;      /* Small like/favorite accents only */
}
```

Rules:

- Amber is the primary accent. Use it for CTAs, active states, small dots, rating stars, section tags, and progress indicators.
- Flame Orange is a secondary accent for heat, grill, and hover details.
- Fresh Herb Green should appear only in tiny food-related accents.
- The design must stay mostly dark.
- Avoid large flat yellow backgrounds.
- Avoid neon gradients.
- Avoid glossy casino-style UI.

---

## Typography

Use Google Fonts:

- **Headings:** `Space Grotesk`
- **Body:** `Inter`
- **Labels / prices / counters:** `JetBrains Mono` or `Space Mono`

Recommended CSS variables:

```css
:root {
  --font: "Inter", system-ui, sans-serif;
  --font-head: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

Apply heading typography to:

```css
.nav__logo,
.hero__title,
.section-title,
.impact__line,
.burger-card__name,
.spec__value,
.cta__title,
.footer__brand,
.preloader__word {
  font-family: var(--font-head);
}
```

Use mono typography for:

- price labels
- cooking time
- spice level
- rating numbers
- ingredient chips
- scroll progress indicators
- technical labels such as "Seedance 2.0 background film" if visible in dev overlay

---

## Media asset plan

The site needs five asset groups.

### 1. Hero burger image

File:

```txt
assets/images/hero-burger.png
```

Purpose:

- Defines the final flagship burger appearance.
- Used as the hero poster, loading image, and master visual reference.
- Can also be copied into `website/public/img/`.

Visual direction:

- one premium burger, centered
- dark cinematic background
- golden sesame bun
- juicy patty
- melted cheddar
- lettuce, tomato, pickles, sauce
- subtle steam
- reflective black surface
- warm rim light
- no text
- no logos

### 2. Exploded burger image

File:

```txt
assets/images/exploded-burger-reference.png
```

Purpose:

- Defines the vertical ingredient separation for the scroll video.
- Used as the most important reference for Seedance 2.0.

Visual direction:

- same burger from the hero image
- vertically separated ingredients
- top bun floating above
- cheese, patty, lettuce, tomato, sauce, pickles, bottom bun stacked in clean vertical order
- premium dark background
- cinematic food advertising style
- no text
- no hands
- no plate unless minimal and unobtrusive

### 3. Ingredients / product detail image

File:

```txt
assets/images/ingredients-detail.png
```

Purpose:

- Used in product-detail section and ingredient cards.
- Adds visual support for freshness and premium ingredient story.

Visual direction:

- macro food details
- grilled patty texture
- melted cheese pull
- fresh lettuce and tomato
- sauce detail
- dark premium studio lighting
- shallow depth of field

### 4. Burger catalog images

Files:

```txt
assets/images/catalog-classic-stack.png
assets/images/catalog-smoky-bacon.png
assets/images/catalog-spicy-lab.png
assets/images/catalog-truffle-melt.png
```

Purpose:

- Used in catalog/menu cards or product grid.
- Shows that BurgerLab has multiple burgers while keeping the main background film focused on one flagship burger.

Recommended catalog burgers:

1. **Classic Stack** — balanced classic cheeseburger
2. **Smoky Bacon Lab** — bacon, smoked sauce, double cheese
3. **Spicy Lab** — jalapeño, spicy sauce, charred patty
4. **Truffle Melt** — premium mushroom/truffle-style burger, melted cheese

Visual direction:

- each burger photographed consistently
- dark background
- warm amber highlights
- clean isolated composition
- no text in the image
- no real brand marks
- use similar camera angle and lighting so the catalog feels coherent

### 5. Final scroll video background

Raw file:

```txt
assets/videos/burgerlab-scroll-background-raw.mp4
```

Production file:

```txt
website/public/bg.mp4
```

Purpose:

- Full-screen fixed video background.
- Scrubbed by scroll progress.
- Main visual experience of the site.

Video concept:

A fully assembled cinematic burger starts as the hero object. As the camera slowly pushes in and the user scrolls, the burger begins to separate vertically into its ingredients. The motion should feel smooth, premium, and controlled. At the end, the burger is fully exploded in a clean vertical layout, with ingredients suspended in space, surrounded by subtle steam, tiny sesame seeds, sauce particles, and warm cinematic highlights.

---

## Image generation model rules

Use **GPT Image 2** through Higgsfield MCP for all still images.

Default image settings:

- aspect ratio: 16:9 for hero, exploded, ingredients, and section images
- quality: high
- style: realistic cinematic food advertising
- no text baked into images
- no logos unless a fictional BurgerLab logo is intentionally generated as a separate asset
- consistent dark premium lighting
- maintain ingredient realism

Before generation, write the prompts into:

```txt
copy/image-prompts.md
```

Claude Code should generate only the approved list of images. Do not generate extra alternatives unless requested.

---

## Recommended image prompts

### Hero burger image prompt

```txt
Create a premium cinematic hero image for a fictional dark luxury burger brand called BurgerLab.

The main subject is one flagship gourmet burger called The Lab Burger, centered as the dominant focal point. It should look realistic, sharp, premium, and extremely appetizing: golden sesame brioche bun, juicy grilled beef patty, melted cheddar, crisp lettuce, tomato slices, pickles, glossy house sauce, subtle steam rising, and tiny sesame seeds in the air.

Style: ultra-cinematic food advertising, premium restaurant campaign, dark luxury fast-food brand, modern website hero visual.

Composition: place the burger slightly elevated above a dark reflective surface, centered in a strong 3/4 perspective. Keep the background minimal and dark with warm amber rim light, soft atmospheric haze, controlled highlights, and enough negative space for website text overlays.

Lighting: dramatic low-key studio lighting, warm amber key light, subtle orange flame highlights, deep shadows, realistic reflections, shallow depth of field.

Restrictions: no text, no real logos, no packaging, no people, no hands, no extra UI elements, no plates with busy decoration.

Aspect ratio: 16:9. High quality.
```

### Exploded burger reference prompt

```txt
Create a premium cinematic exploded-view image of the same BurgerLab flagship burger, The Lab Burger.

The burger ingredients should be separated vertically in a clean, dramatic stack: top sesame brioche bun floating at the top, sauce layer, melted cheddar, grilled beef patty, lettuce, tomato, pickles, bottom bun below. The ingredients should look realistic, fresh, and premium, suspended in mid-air as if the burger is being deconstructed for a luxury food commercial.

Style: ultra-cinematic food advertising, dark luxury burger brand, realistic materials, premium website campaign visual.

Composition: vertical ingredient separation centered in the frame, strong dark negative space around the burger, subtle floating sesame seeds, tiny sauce droplets, gentle steam, warm amber rim light, dark reflective base.

Lighting: dramatic low-key studio lighting, warm amber highlights, controlled shadows, shallow depth of field, rich texture detail.

Restrictions: no text, no real logos, no hands, no people, no cartoon style, no messy ingredient explosion. Keep the separation elegant and readable.

Aspect ratio: 16:9. High quality.
```

### Ingredients detail prompt

```txt
Create a premium cinematic macro image for BurgerLab showing the ingredient detail of The Lab Burger.

Focus on close-up textures: grilled beef patty crust, melted cheddar, glossy sauce, crisp lettuce, tomato, pickles, toasted brioche bun edge, and subtle steam. The image should feel tactile, realistic, appetizing, and premium.

Style: high-end food photography, dark luxury restaurant campaign, cinematic macro detail, shallow depth of field.

Lighting: warm amber highlights, deep soft shadows, dark background, controlled reflections.

Restrictions: no text, no logos, no hands, no people, no plate clutter.

Aspect ratio: 16:9. High quality.
```

### Catalog burger prompt template

Use this template for each catalog burger, changing only the burger details.

```txt
Create a premium catalog image for BurgerLab, a fictional dark luxury burger brand.

Subject: [BURGER NAME AND INGREDIENTS].

The burger should be isolated as the main object, realistic, sharp, premium, and appetizing. Use the same dark luxury visual language as the BurgerLab hero image: charcoal background, warm amber highlights, subtle atmospheric haze, shallow depth of field, and a clean modern product-photography composition.

Composition: centered burger on a dark minimal surface, 3/4 angle, enough clean space around it so it can fit inside a website card.

Restrictions: no text, no real logos, no hands, no people, no packaging, no busy restaurant background.

Aspect ratio: 16:9. High quality.
```

---

## Video generation model rules

Use **Seedance 2.0** through Higgsfield MCP for the final background video.

Default video settings:

- aspect ratio: 16:9
- duration: 12 to 16 seconds
- quality: high
- no dialogue
- no text
- no real logos
- no people
- no fast cuts
- no shaky camera
- no heavy flicker
- no abrupt scene changes
- designed for scroll scrubbing, not normal autoplay

The video should be generated only after the hero image and exploded burger reference image exist.

Before generation, write the final prompt into:

```txt
copy/video-prompt.md
```

---

## Final Seedance 2.0 background video prompt

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

---

## Background video requirements

The main background video must be designed for a scroll-driven website, not just as a standalone cinematic clip.

### Raw generated file

```txt
assets/videos/burgerlab-scroll-background-raw.mp4
```

### Final scrubbed file

```txt
website/public/bg.mp4
```

### Creative direction

The video should feel like one continuous premium food commercial with three slow phases:

1. **Hero burger reveal**
   The fully assembled Lab Burger is centered, dark background, warm amber highlights, subtle steam.

2. **Ingredient separation**
   The burger slowly opens and separates vertically. The motion is elegant and controlled.

3. **Exploded product display**
   The final frame shows the burger as a premium floating ingredient stack, suitable for the later website sections.

### Constraints

- 16:9
- 12–16 seconds
- dark, premium, minimal, cinematic
- slow and smooth movement
- suitable for scroll scrubbing
- enough negative space for text overlays
- no readable text baked into the video
- no real brand logos
- no third-party marks
- no busy background
- no fast cuts
- no overdone particles
- no shaky camera
- no flickering UI elements
- burger design should stay consistent with reference images

---

## Re-encode the video for scroll scrubbing

Raw AI-generated MP4 files often seek poorly during scroll scrubbing. Re-encode the final background video to all-keyframe H.264.

Create this helper script:

```bash
mkdir -p scripts
cat > scripts/swap-bg-video.sh <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

INPUT="$1"
OUTPUT="website/public/bg.mp4"

mkdir -p website/public

ffmpeg -y -i "$INPUT" -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"

echo "Encoded all-keyframe background video to $OUTPUT"
SCRIPT

chmod +x scripts/swap-bg-video.sh
```

Run:

```bash
scripts/swap-bg-video.sh "assets/videos/burgerlab-scroll-background-raw.mp4"
```

After swapping, confirm in the browser console:

```js
window.__bgv.readyState === 4
window.__bgv.duration
```

---

## Website section plan

The section plan should support the burger opening motion.

### 1. `#home` — Hero / finished burger

Purpose:

- Start on the fully assembled burger.
- Establish BurgerLab as a premium dark burger brand.
- Show headline, short subheadline, CTA buttons, rating / delivery chips.

Suggested layout:

- fixed video background behind everything
- hero text on the left or right depending on the calmest video area
- floating order card inspired by the uploaded UI reference
- small chips: "Crafted fresh", "30 min delivery", "4.9 rating"

### 2. `#split` — Scroll-controlled ingredient split

Purpose:

- Make the user feel that scroll is controlling the burger reveal.
- Use pinned text and progress indicators.

Suggested copy direction:

- "Built layer by layer."
- "Every ingredient earns its place."

Motion:

- section pinned while the background video moves through the ingredient separation phase
- text appears word-by-word or line-by-line
- small ingredient labels can appear as HTML overlays, not baked into the video

### 3. `#ingredients` — Ingredient detail cards

Purpose:

- Explain the premium ingredient story.
- Match the exploded burger state in the video.

Cards:

- toasted brioche
- flame-grilled patty
- melted cheddar
- fresh greens
- signature sauce

Layout:

- floating cards around a calm zone of the video
- use subtle dark panels, not heavy glass
- use amber dots and mono labels

### 4. `#catalog` — Burger catalog

Purpose:

- Show several BurgerLab burgers while the flagship video remains in the background.
- Use GPT Image 2-generated catalog images.

Recommended cards:

- Classic Stack
- Smoky Bacon Lab
- Spicy Lab
- Truffle Melt

Each card should include:

- burger image
- name
- short description
- price
- rating
- cooking time or spice level
- small CTA

### 5. `#experience` — Dark premium ordering experience

Purpose:

- Use the uploaded reference design direction.
- Show the site/app-like ordering concept with floating panels.

Possible content:

- "Designed for late-night cravings and premium flavor."
- A featured order summary card
- meal category chips
- favorite / rating micro-interactions

### 6. `#cta` — Final order section

Purpose:

- Finish with a strong final call to action.
- Use the final exploded or reassembled burger poster as supporting visual if needed.

Content:

- headline
- short line
- price or bundle offer
- CTA button: "Order The Lab Burger"
- secondary CTA: "View full menu"

### 7. `footer`

Purpose:

- Dissolve to black.
- Minimal brand signature.

---

## Layer architecture

Background is fixed. Content scrolls over it.

Keep this stack intact:

| Element | z-index | Role |
|---|---:|---|
| `.bg-video` / `#bgv` | 0 | Fixed full-screen video, object-fit cover, scrubbed by scroll |
| `.bg-tint` | 1 | Radial darkening and contrast layer for readability |
| `.grain` / `.ambient-dots` | 2 | Very subtle texture and BurgerLab amber dots |
| `#root` / `.page` | 10 | React page sections |
| `.floating-ui` | 20 | Optional catalog or order cards |
| `.custom-cursor` | 100 | Optional cursor ring on desktop only |

Use a gradient dissolve above the footer rather than a fixed black overlay.

---

## Scroll-scrubbed video implementation

The video should be controlled by scroll position, not autoplay timing.

Expected pattern:

```js
const bgVideo = document.querySelector("#bgv");
let lastVideoT = -1;

function setupVideoScrub() {
  const updateVideo = () => {
    if (!bgVideo.duration) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, scrollTop / Math.max(1, maxScroll)));
    const t = progress * (bgVideo.duration - 0.05);

    if (Math.abs(t - lastVideoT) > 0.008) {
      bgVideo.currentTime = t;
      lastVideoT = t;
    }
  };

  bgVideo.pause();
  bgVideo.currentTime = 0;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: updateVideo,
  });

  bgVideo.addEventListener("loadedmetadata", updateVideo);
}
```

If using Lenis, connect Lenis to GSAP/ScrollTrigger:

```js
const lenis = new Lenis({
  duration: 1.12,
  smoothWheel: true,
  wheelMultiplier: 0.9,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

Expose dev hooks in development:

```js
if (import.meta.env.DEV) {
  window.__lenis = lenis;
  window.__ST = ScrollTrigger;
  window.__bgv = bgVideo;
}
```

---

## Pinned ingredient reveal section

Use the ingredient split section as the main pinned section.

Example pattern:

```js
function setupIngredientReveal() {
  const section = document.querySelector("#split");
  const pin = section.querySelector(".split__pin");
  const words = [...section.querySelectorAll(".split-word")];
  const labels = [...section.querySelectorAll(".ingredient-label")];

  function render(p) {
    words.forEach((word, i) => {
      const start = (i / words.length) * 0.62;
      const o = gsap.utils.clamp(0, 1, (p - start) / 0.14);
      word.style.opacity = 0.12 + o * 0.88;
      word.style.filter = `blur(${(1 - o) * 8}px)`;
      word.style.transform = `translateY(${(1 - o) * 18}px)`;
    });

    labels.forEach((label, i) => {
      const start = 0.28 + i * 0.08;
      const o = gsap.utils.clamp(0, 1, (p - start) / 0.12);
      label.style.opacity = o;
      label.style.transform = `translateY(${(1 - o) * 14}px)`;
    });
  }

  render(0);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => "+=" + innerHeight * 1.8,
    pin,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: self => render(self.progress),
  });
}
```

Ingredient labels must be HTML/CSS overlays. Do not bake labels into the generated video.

---

## Catalog cards interaction

The catalog section should feel like a premium app-like food catalog inspired by the reference image.

Recommended card data structure:

```js
export const burgers = [
  {
    name: "Classic Stack",
    desc: "Double cheddar, pickles, onion, BurgerLab sauce.",
    price: "$12.90",
    rating: "4.8",
    time: "25 min",
    image: "/img/catalog-classic-stack.png",
  },
  {
    name: "Smoky Bacon Lab",
    desc: "Crispy bacon, smoked sauce, grilled onion, cheddar.",
    price: "$14.90",
    rating: "4.9",
    time: "30 min",
    image: "/img/catalog-smoky-bacon.png",
  },
  {
    name: "Spicy Lab",
    desc: "Jalapeño, chili glaze, pepper jack, flame-grilled patty.",
    price: "$13.90",
    rating: "4.7",
    time: "28 min",
    image: "/img/catalog-spicy-lab.png",
  },
  {
    name: "Truffle Melt",
    desc: "Mushroom, truffle-style cream, Swiss melt, soft brioche.",
    price: "$16.90",
    rating: "4.9",
    time: "32 min",
    image: "/img/catalog-truffle-melt.png",
  },
];
```

Card design rules:

- dark rounded cards
- burger image large enough to be appetizing
- small amber stars or rating
- price in mono or bold display
- avoid crowded text
- use hover lift and subtle border glow
- keep cards readable over the video background

---

## Dark premium UI components

Use panels that feel tactile and premium.

Recommended panel style:

```css
.panel {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(32,32,29,0.88), rgba(18,18,16,0.78));
  border: 1px solid rgba(245, 179, 26, 0.12);
  border-radius: 28px;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.38);
}

.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 0%, rgba(245,179,26,0.12), transparent 34%),
    linear-gradient(135deg, rgba(255,255,255,0.05), transparent 42%);
  pointer-events: none;
}

.panel > * {
  position: relative;
  z-index: 1;
}
```

Primary button:

```css
.btn--primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #161006;
  border: 0;
  box-shadow: 0 18px 48px rgba(245, 179, 26, 0.22);
}
```

Secondary button:

```css
.btn--ghost {
  color: var(--text);
  border: 1px solid rgba(248, 244, 234, 0.16);
  background: rgba(255, 255, 255, 0.04);
}
```

---

## Footer dissolve-to-black

```css
.footer {
  position: relative;
  margin-top: 24vh;
  padding: 16vh clamp(1.25rem, 5vw, 6rem) 8vh;
  background: var(--bg);
}

.footer::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 45vh;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
}
```

---

## Mobile behavior

Scroll-scrubbed video can be heavy on mobile. Provide a fallback.

Recommended:

- keep the video on larger screens
- use `hero-burger.png` or a mobile poster image on touch devices
- reduce or remove pinned sections on small screens
- convert catalog cards into a vertical stack
- disable custom cursor on touch devices
- avoid tiny ingredient labels on mobile

CSS example:

```css
@media (hover: none), (max-width: 768px) {
  .bg-video {
    display: none;
  }

  .mobile-poster {
    display: block;
    position: fixed;
    inset: 0;
    background-image: url("/img/hero-burger.png");
    background-size: cover;
    background-position: center;
    z-index: 0;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Verification checklist

Before considering the site complete:

- [ ] `copy/brand-kit.md` exists and matches BurgerLab
- [ ] `copy/asset-plan.md` exists
- [ ] `copy/image-prompts.md` exists
- [ ] `copy/video-prompt.md` exists
- [ ] hero burger image exists
- [ ] exploded burger reference exists
- [ ] ingredients detail image exists
- [ ] catalog burger images exist
- [ ] raw Seedance 2.0 video exists in `assets/videos`
- [ ] all-keyframe video exists at `website/public/bg.mp4`
- [ ] Vite React app runs with `npm run dev`
- [ ] GSAP and ScrollTrigger are installed and registered
- [ ] Lenis smooth scroll works
- [ ] video scrubs smoothly on scroll
- [ ] hero text remains readable over the video
- [ ] ingredient split pinned section works
- [ ] catalog cards are readable and responsive
- [ ] mobile fallback exists
- [ ] `npm run build -- --base=./` passes
- [ ] no real logos or third-party marks appear in media
- [ ] no text is baked into images or video
- [ ] generated assets are saved in the correct folders

---

## Preferred build philosophy

Start simple, then add motion.

Recommended order:

1. Create project folder
2. Create brand kit
3. Create asset plan
4. Write image prompts
5. Generate reference images with GPT Image 2
6. Review images
7. Write Seedance 2.0 video prompt
8. Generate scroll-friendly background video
9. Re-encode video to all-keyframe H.264
10. Create Vite + React app
11. Add fixed video background and basic scrub mapping
12. Add hero section
13. Add pinned ingredient split section
14. Add ingredient cards
15. Add catalog section
16. Add CTA and footer
17. Add mobile fallback
18. Polish typography, spacing, motion, and contrast
19. Run production build
20. Document final usage notes

The final website should feel like a premium product launch page and a practical AI production workflow, not a generic coding demo.

---

## First prompt for Claude Code

Use this as the first instruction when starting the project in Claude Code:

```txt
We are starting a new project called burgerlab-motion-website.

Read and follow the BurgerLab motion website skill.

The goal is to build a scroll-driven cinematic burger landing page using Vite, React, GSAP, Lenis, and ScrollTrigger.

The website is for BurgerLab, a fictional dark luxury burger brand. The main visual experience should be a full-screen background video generated with Higgsfield MCP using Seedance 2.0. The video should show one flagship burger starting fully assembled and then separating vertically into its ingredients as the user scrolls.

Before generating any media or spending credits, create only the project structure and planning files:

- assets/images
- assets/videos
- assets/references
- copy
- scripts

Create these files:

- copy/brand-kit.md
- copy/asset-plan.md
- copy/image-prompts.md
- copy/video-prompt.md
- copy/website-brief.md
- README.md

In the planning files, define the BurgerLab brand kit, color palette, visual direction, required image assets, video concept, and website section plan.

Use GPT Image 2 for images later and Seedance 2.0 for the final video later, but do not generate media yet.

After creating the files, summarize the planned workflow and ask for approval before running any Higgsfield MCP generation.
```

---

## Media generation approval prompt

Use this after the planning files are reviewed:

```txt
The BurgerLab planning files are approved.

Now use Higgsfield MCP to generate the approved still image assets with GPT Image 2 only.

Generate exactly these images and save them in the correct folders:

1. assets/images/hero-burger.png
2. assets/images/exploded-burger-reference.png
3. assets/images/ingredients-detail.png
4. assets/images/catalog-classic-stack.png
5. assets/images/catalog-smoky-bacon.png
6. assets/images/catalog-spicy-lab.png
7. assets/images/catalog-truffle-melt.png

Use the prompts from copy/image-prompts.md.
Use high quality.
Use 16:9 aspect ratio.
Do not generate extra variations.
Do not generate video yet.
After generation, report the saved files and wait for review.
```

---

## Video generation approval prompt

Use this after the still image references are approved:

```txt
The BurgerLab image references are approved.

Now use Higgsfield MCP with Seedance 2.0 to generate the final scroll-driven background video.

Use these references:

- assets/images/hero-burger.png
- assets/images/exploded-burger-reference.png

Use the final prompt from copy/video-prompt.md.

The video must be 16:9, 12 to 16 seconds, dark, cinematic, slow, stable, and suitable for frame-by-frame scroll scrubbing.

Save the raw generated video as:

assets/videos/burgerlab-scroll-background-raw.mp4

Do not build the website yet. After the video is generated, report the file path and wait for approval.
```

---

## Website build prompt

Use this after the video is approved:

```txt
The BurgerLab images and scroll background video are approved.

Now build the website inside the website folder using Vite + React + GSAP + Lenis + ScrollTrigger.

Requirements:

1. Re-encode assets/videos/burgerlab-scroll-background-raw.mp4 to all-keyframe H.264 and save it as website/public/bg.mp4.
2. Copy the final image assets into website/public/img.
3. Create a polished single-page BurgerLab landing page with these sections:
   - home
   - split
   - ingredients
   - catalog
   - experience
   - cta
   - footer
4. Use the fixed video background as the main motion layer.
5. Map scroll progress to the background video currentTime.
6. Use GSAP ScrollTrigger for pinned ingredient reveal and section animations.
7. Use Lenis for smooth scrolling.
8. Use dark premium BurgerLab styling based on the uploaded UI reference direction: charcoal surfaces, amber accents, rounded panels, food catalog cards, and cinematic spacing.
9. Keep all website text as HTML/CSS, not baked into images or videos.
10. Add mobile fallback using the hero burger poster.
11. Expose dev hooks for the video, Lenis, and ScrollTrigger in development.
12. Run npm run build -- --base=./ and fix any errors.

After the build, summarize what was created and explain how to run and preview the project.
```
