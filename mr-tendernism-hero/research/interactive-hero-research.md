# Mr. Tendernism — Interactive Hero Research

**Purpose:** Replace the heavy scroll-controlled frame-sequence hero with a **lightweight, interactive** direction that still feels premium and is unmistakably *Mr. Tendernism* (smoke, fire, BBQ craft, Southern hospitality, the pitmaster personality).

**Trigger:** Joe's feedback — *"taking too long to load… consider a whole other direction… maybe a hover mouse effect with smoke. Framer — Tanweer AI is one reference."*

**How this was researched:** Gathered via web search (Awwwards, Codrops/Tympanus, GSAP, Framer, Godly, GitHub, WordPress.org). This environment's network policy blocked me from opening each page directly, so **treat every URL as "click to confirm current live state."** I've labelled which links are *live interactive engines/demos* vs. *Awwwards inspiration captures* (those are often video recordings of a site, not the live site itself — use them for the idea, then find the live build).

**Practicality key (WordPress + Elementor):**
`✅ Easy` = drop-in plugin or a small `<canvas>`/JS snippet in an HTML widget ·
`⚠️ Moderate` = one custom script + a bit of wiring ·
`⛔ Heavy` = bespoke WebGL/Three.js dev (doable, but a build task, not a plugin).

---

## A. Mouse-following smoke / fluid effects  *(the core of Joe's ask)*

### 1. Tanweer AI  *(Joe's reference)*
- **URL:** https://tanweer.framer.ai/ *(live, Framer)*
- **Interaction to study:** Dark, cinematic AI-filmmaker site built in Framer; hero leans on atmospheric motion + cursor-reactive smoke/fluid ambience and smooth type reveals. This is the *mood* Joe is pointing at.
- **Adapt for Mr. Tendernism:** Same cinematic-dark treatment but warm (ash-white smoke over charcoal/ember tones instead of cool AI blues). Hero = one still of Mr. Tendernism at the smoker with smoke that reacts to the cursor.
- **WP/Elementor:** `⚠️ Moderate` — Framer effect itself isn't portable, but the look is reproducible with a fluid-smoke canvas (see #3) behind an Elementor hero.

### 2. Advanced (Advanced Team)
- **URL:** https://advanced.team/ *(live)*
- **Interaction to study:** The canonical **WebGL fluid-simulation cursor** — moving the mouse disturbs a colorful smoke/liquid field in real time (canvas + GLSL shaders, not CSS). Buttery at 60fps.
- **Adapt:** This *is* the "hover mouse effect with smoke." Recolor the fluid to smoke-grey/ember-orange and run it as the hero background layer; Mr. Tendernism's portrait sits on top, so it reads as *he's standing in living smoke he controls.*
- **WP/Elementor:** `⚠️ Moderate` — one canvas script in an HTML widget; see engine #3.

### 3. WebGL Fluid Simulation — Pavel Dobryakov  *(the open-source engine)*
- **URL (live demo):** https://paveldogreat.github.io/WebGL-Fluid-Simulation/ · **Code (MIT):** https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- **Interaction to study:** The actual open-source Navier–Stokes fluid solver most "smoke cursor" sites are built on. 16k★, works on mobile, fully tunable (density, dissipation, color, splat radius).
- **Adapt:** Our lowest-risk path to the smoke-cursor hero: embed it, set a warm monochrome palette (white→grey smoke with faint ember glow), lower density so it's elegant not "rainbow toy," pin it behind the hero copy. No frame sequence, ~tens of KB of JS.
- **WP/Elementor:** `✅ Easy` — MIT canvas library, paste into an HTML widget. **Recommended engine.**

### 4. Fluid Cursor (Framer/productized)
- **URL:** https://fluidcursorv2.framer.website/ *(live component demo)*
- **Interaction to study:** A packaged, "premium WebGL fluid + smoke that responds to move/click" — shows how restrained/branded the effect can look versus the raw demo.
- **Adapt:** Reference for *tasteful* tuning (opacity, fade, single-hue smoke) so ours feels luxury, not gimmick.
- **WP/Elementor:** `✅ Easy` if we replicate with #3; the Framer package itself is Framer-only.

### 5. PANAMÆRA — "Cursor with smoke effect / distortion"
- **URL:** https://www.awwwards.com/inspiration/cursor-with-smoke-effect-distortion *(Awwwards inspiration capture)*
- **Interaction to study:** Cursor drags a **smoke + image-distortion** wake across the hero — smoke that also *warps what's behind it.*
- **Adapt:** Cursor smoke that subtly distorts the hero image beneath = "heat haze coming off the pit." Very on-brand.
- **WP/Elementor:** `⛔ Heavy` — custom shader; treat as inspiration, approximate with #3 + a displacement pass.

### 6. House of Dreamers — "Mouse move fluid effect"
- **URL:** https://www.awwwards.com/inspiration/mouse-move-fluid-effect-house-of-dreamers *(Awwwards inspiration)*
- **Interaction to study:** WebGL + GSAP fluid that reveals imagery through the mouse-driven fluid mask.
- **Adapt:** Mouse-fluid acts as a *mask* — smoke clears where you move to reveal the hero shot / headline underneath.
- **WP/Elementor:** `⛔ Heavy` (custom) — but the *masking* idea is reused cheaply in Concept 3 (fog-glass wipe).

---

## B. Image trails / motion trails  *(personality + appetite, zero video)*

### 7. Codrops — Image Trail Effects (live demo)
- **URL:** https://tympanus.net/Development/ImageTrailEffects/ · article: https://tympanus.net/codrops/2019/08/07/image-trail-effects/
- **Interaction to study:** Moving the mouse leaves a **trail of images** that appear along the path and fade — several disappear styles.
- **Adapt:** Trail a curated set of ~6 signature shots (brisket slice, ribs, the crown logo, glowing coals) as the cursor moves across the hero. Playful, memorable, appetite-forward.
- **WP/Elementor:** `✅ Easy` — self-contained JS + our own images in an HTML widget.

### 8. Codrops — Ideas for Image Motion Trail Animations
- **URL:** https://tympanus.net/codrops/2023/10/18/ideas-for-image-motion-trail-animations/ *(live demos)*
- **Interaction to study:** Newer, smoother trail variants incl. a *persistent* "painted" trail.
- **Adapt:** A persistent smoke-smudge trail that paints a subtle path as visitors explore — like dragging a finger through smoke.
- **WP/Elementor:** `✅ Easy`.

### 9. Codrops — Gravity-Based Mouse Trail (GSAP)
- **URL:** https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/ *(live)*
- **Interaction to study:** Images spawn at the cursor, **fall and bounce** off the bottom with physics.
- **Adapt:** Embers/spark chips or mini menu items that spill from the cursor and settle — tactile, fun, light.
- **WP/Elementor:** `✅ Easy` (needs GSAP, which we already use).

### 10. GSAP Demo Hub — Cursor Trail
- **URL:** https://demos.gsap.com/demo/cursor-trail/ · hub: https://demos.gsap.com/
- **Interaction to study:** Official, copy-pasteable cursor-trail + cursor-tracking image-preview patterns.
- **Adapt:** Baseline for any of our trail/cursor ideas; lowest-risk code source.
- **WP/Elementor:** `✅ Easy`.

---

## C. Hover-triggered reveals & image distortion  *(replace "opening the lid")*

### 11. Codrops — WebGL Distortion Hover Effects
- **URL:** https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/ *(live demos)*
- **Interaction to study:** Hover an item and a **displacement map** melts/ripples between two images.
- **Adapt:** Hover the closed smoker → it dissolves via a smoke-shaped displacement map into the open smoker / the food. The original "lift the lid" beat, as a 2-image hover, not 210 frames.
- **WP/Elementor:** `⚠️ Moderate` — small Three.js/hover-distortion lib + 2 images.

### 12. Codrops — Interactive WebGL Hover Effects
- **URL:** https://tympanus.net/codrops/2020/04/14/interactive-webgl-hover-effects/ *(live)*
- **Interaction to study:** Hover reveals where the cursor's velocity drives the distortion strength.
- **Adapt:** The faster you move over the hero, the more the smoke/heat ripples — rewards interaction.
- **WP/Elementor:** `⚠️ Moderate`.

### 13. Codrops — Mouse Flowmap Deformation (OGL)
- **URL:** https://tympanus.net/codrops/2019/09/25/mouse-flowmap-deformation-with-ogl/ *(live)*
- **Interaction to study:** The cursor paints a **flowmap** that warps the image like moving liquid/air.
- **Adapt:** **Heat-haze over the coals** — a single hero image shimmers where the cursor passes, like the air above a fire. Subtle, premium, one image. (Basis for Concept 6.)
- **WP/Elementor:** `⚠️ Moderate` — OGL is tiny (~a few KB).

---

## D. Fire / ember / steam / fog

### 14. Foggy Glass + Rain-on-Glass  *(steam-on-glass wipe-to-reveal)*
- **URLs:** https://github.com/Rajath-KR/foggyglass · https://github.com/Hixly/rain-on-glass *(open-source, live builds linked in repos)*
- **Interaction to study:** The screen is **fogged like a steamy window**; drag the cursor to **wipe a clear streak** and reveal what's behind, then it slowly re-fogs.
- **Adapt:** Hero starts as fogged pit-smoke; visitors wipe to reveal Mr. Tendernism / the headline / today's cut. Re-fogs on idle. *Extremely* on-brand for BBQ smoke and dirt-cheap to run. (Concept 3.)
- **WP/Elementor:** `✅ Easy` — one canvas + 2 layers.

### 15. Vanta.js — FOG (and CLOUDS/TRUNK)
- **URL:** https://www.vantajs.com/?effect=fog *(live, configurable)*
- **Interaction to study:** Drop-in animated **fog/smoke background** that drifts and reacts subtly to the mouse; pick colors live.
- **Adapt:** Fastest possible "smoke atmosphere" behind the hero if we want ambience without a custom build — tune to warm smoke/ember.
- **WP/Elementor:** `✅ Easy` — Vanta + three.min.js, two `<script>`s in an HTML widget.

### 16. Particle Love (Edan Kwan)
- **URL:** https://www.awwwards.com/sites/particle-love *(WebGL particle showcase)*
- **Interaction to study:** Large-scale **interactive particle fields** that swirl toward/away from the cursor.
- **Adapt:** Ember/spark particle field that drifts up like a fire and scatters from the cursor.
- **WP/Elementor:** `⚠️ Moderate` (curated particle lib) to `⛔ Heavy` (bespoke).

### 17. Interactive Particle Effect — "Nature Beyond Technology"
- **URL:** https://www.awwwards.com/inspiration/interactive-particle-effect-nature-beyond-technology *(Awwwards inspiration; three.js/glsl/mousemove)*
- **Interaction to study:** Mouse pushes/pulls a dense particle cloud.
- **Adapt:** Same, themed as floating ash/embers around the logo.
- **WP/Elementor:** `⚠️ Moderate`.

---

## E. Interactive food / meat brands  *(direct category peers)*

### 18. Promeat
- **URL:** https://www.awwwards.com/sites/promeat *(Awwwards Honorable Mention → live meat brand)*
- **Interaction to study:** Editorial layout + **WebGL storytelling** + crafted hover UI for a premium meat brand — proof the "premium meat" space rewards interaction.
- **Adapt:** Tone/structure model for a craft BBQ brand: big type, tactile hovers, restrained motion.
- **WP/Elementor:** `⚠️ Moderate` overall; individual hovers are `✅ Easy`.

### 19. GOOD Meat
- **URL:** https://www.awwwards.com/inspiration/good-meat-digital-experience *(three.js / glsl / scroll nav food brand)*
- **Interaction to study:** Full 3D/WebGL scroll-navigated food experience with sound design + storytelling.
- **Adapt:** Cherry-pick one signature moment (a hero cut rendered with depth + mouse parallax) rather than a whole 3D site.
- **WP/Elementor:** `⛔ Heavy` as a whole; one lifted moment is `⚠️ Moderate`.

### 20. Middle Child — Restaurant menu dish preview
- **URL:** https://www.awwwards.com/inspiration/restaurant-menu-dish-preview-middle-child *(hovers/cursor/cute interactions)*
- **Interaction to study:** Hovering a menu line **pops a preview image of the dish** near the cursor.
- **Adapt:** Menu/section where hovering "Brisket / Ribs / Pulled Pork" flashes a mouth-watering preview by the cursor — appetite + interactivity, very light.
- **WP/Elementor:** `✅ Easy` — cursor-follow image on hover.

### 21. Interactive Horizontal Menu w/ 3D Illustrations
- **URL:** https://www.awwwards.com/inspiration/interactive-horizontal-menu-with-3d-illustrations *(drag/scroll/3D menu)*
- **Interaction to study:** **Drag-scrub** horizontal menu with 3D dish illustrations.
- **Adapt:** A draggable "pit board" of signature plates for the menu section.
- **WP/Elementor:** `⚠️ Moderate`.

---

## F. 3D reacts to mouse / interactive storytelling  *(premium, optional weight)*

### 22. Lusion (studio) — physics 3D hero
- **URL:** https://lusion.co/ *(live; Awwwards SOTD-caliber studio)*
- **Interaction to study:** A single **3D hero object with real weight/inertia** that reacts to the mouse — heavy-feeling, tactile, no video.
- **Adapt:** A lightweight 3D **cast-iron smoker / cleaver / crown** that tilts toward the cursor with inertia, smoke wisping off it. (Concept 7.)
- **WP/Elementor:** `⛔ Heavy` — Three.js + a compressed glTF model.

### 23. WMF — coffee craftsmanship scrollytelling
- **URL (ref list):** https://www.utsubo.com/blog/best-threejs-websites-2026 · category: https://www.awwwards.com/awwwards/collections/storytelling/
- **Interaction to study:** Each scroll reveals a step of the craft in 3D — "tactile sense of quality."
- **Adapt:** *Below* the hero (not the hero), a light scrollytelling strip: wood → fire → smoke → plate = Mr. Tendernism's method. Keeps the hero itself instant.
- **WP/Elementor:** `⚠️ Moderate` with GSAP ScrollTrigger + images (no heavy video).

---

## G. Ready-made WordPress / Elementor building blocks (so we don't hand-build everything)

These directly answer "practical for WP + Elementor" and are worth trialling before custom dev:

- **Unlimited Elements — Smoke Background Effect for Elementor:** https://unlimited-elements.com/docs/smoke-background-effect-for-elementor/ — animated smoke background widget. `✅`
- **CursorCraft – Cursor Builder for Elementor** (Volumetric Smoke background): https://wordpress.org/plugins/cursorcraft-cursor-builder-for-elementor/ — canvas smoke cursor, scoped per section. `✅`
- **WDesignKit — Background Smoking Cursor Effect:** https://wdesignkit.com/widgets/background-smoking-cursor-effect/11316 — smoke trail follows the pointer, per-section scope. `✅`
- **Xpro Elementor Addons — Smoke Effect:** https://elementor.wpxpro.com/docs/xpro-elementor-addons-pro/extensions/smoke-effect/ `✅`
- **Element Pack / Essential Addons — Cursor Effects widgets:** https://www.elementpack.pro/demo/element/cursor-effects/ · https://essential-addons.com/creative-cursor-effects-on-elementor/ `✅`

> Caveat: most stock smoke-cursor plugins default to the "rainbow toy" look. We'd tune them to a **single warm smoke hue** (or just use the MIT fluid engine #3 in an HTML widget) so it reads *luxury pit smoke*, not novelty.

---

## Concepts — 7 lightweight interactive heroes for Mr. Tendernism

All avoid frame-by-frame video. Each = **one still (or one small model) + a real-time effect**, typically **< 300 KB** of JS/assets vs. the old ~10 MB+ sequence.

### ⭐ Concept 1 — "The Smoke You Command"  *(closest to Joe's ask; recommended lead)*
Hero = a single portrait of Mr. Tendernism at the smoker. A **WebGL fluid-smoke layer** (engine #3, tuned warm/monochrome) sits over it; the cursor stirs living smoke that drifts and dissipates. Headline + CTA float above.
*Why it's him:* he literally commands the smoke. *Refs:* #1, #2, #3, #4. *Weight:* tiny (MIT canvas lib + 1 image). *Elementor:* `✅ Easy`.

### ⭐ Concept 2 — "Lift the Lid" (hover displacement reveal)  *(keeps the original story, cheaply)*
Hero shows the **closed smoker**. On hover / press-drag, a **smoke-shaped displacement** dissolves it into the **open smoker + food** (or into Mr. Tendernism himself). Two images, one shader.
*Why:* preserves the beloved "opening the pit" narrative with 2 stills, not 210 frames. *Refs:* #11, #12. *Weight:* small. *Elementor:* `⚠️ Moderate`.

### ⭐ Concept 3 — "Wipe the Pit-Smoke" (steam-on-glass reveal)  *(most distinctive)*
The hero loads **fogged like a smoky window**; visitors **wipe with the cursor** to reveal Mr. Tendernism / the headline / today's cut, and it **slowly re-fogs** when idle.
*Why:* smoke is the interaction *and* the reveal; unforgettable and unmistakably BBQ. *Refs:* #14. *Weight:* one canvas + 2 layers, negligible. *Elementor:* `✅ Easy`.

### Concept 4 — "Ember Cursor & Spark Trail"
Replace the cursor with a **glowing ember**; moving it throws a short **spark/ember particle trail**; the primary CTA ("Start the Fire") has a **magnetic pull**.
*Why:* fire personality in every mouse move; works over any hero image. *Refs:* #9, #10, #16. *Weight:* light canvas particles. *Elementor:* `✅ Easy`.

### Concept 5 — "The Meat Trail" (signature image trail)
Moving across the hero **trails ~6 curated shots** — brisket slice, ribs, glowing coals, the crown — that fade like smoke.
*Why:* appetite + playfulness + brand marks in one gesture. *Refs:* #7, #8. *Weight:* light (our images + JS). *Elementor:* `✅ Easy`.

### Concept 6 — "Heat-Haze Portrait" (flowmap shimmer)
A **single hero portrait** of Mr. Tendernism with a subtle **heat-shimmer/flowmap distortion** that intensifies where the cursor passes — the air above the coals.
*Why:* premium and restrained; "you can feel the heat." *Refs:* #13. *Weight:* OGL is a few KB + 1 image. *Elementor:* `⚠️ Moderate`.

### Concept 7 — "3D Smoker on the Coals" (mouse-reactive object)  *(premium, heaviest — optional)*
A **compressed 3D model** (smoker, cleaver, or crown) that **tilts toward the cursor with inertia**, smoke wisping off it.
*Why:* flagship-product feel, craftsmanship on display. *Refs:* #19, #22. *Weight:* moderate (one optimized glTF). *Elementor:* `⛔ Heavy` (build task).

---

## Recommendation

1. **Lead with Concept 1** (fluid-smoke cursor) — it's exactly Joe's "hover mouse effect with smoke," matches the Tanweer mood, and is genuinely lightweight via the MIT engine (#3).
2. **Pitch Concept 3** (wipe-the-smoke) as the distinctive alternative — nothing else in BBQ looks like it, and it's the lightest of all.
3. **Hold Concept 2** (lift-the-lid reveal) as the "we keep the original story" option that reuses two of our already-generated stills instead of the whole sequence.

Fastest path to a click-through demo: build **Concept 1 and Concept 3** as two small HTML-widget prototypes (one hero image each, no video) and let Joe compare them live.

*Verification note: links gathered via search; open each to confirm current live state. Awwwards "inspiration" entries may be video captures — the live-interactive, reusable sources are #2, #3, #4, #7–#14, #15, and the Elementor plugins in section G.*
