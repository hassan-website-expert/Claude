=== Tendernism Cinematic Hero ===
Requires at least: 6.0
Requires PHP: 7.4
Requires Elementor: 3.5+
Stable tag: 1.5.0

Scroll-driven cinematic heroes for Mr. Tendernism, delivered as fully editable
Elementor widgets. This one plugin ships TWO hero options you can trial side by
side:

* "Cinematic Hero" — the clips PLAY (and gently loop) as the pinned, scrubbed
  timeline runs: video crossfades, per-scene copy reveals, a "living hold" so a
  parked clip never freezes, ambient sound, portrait clips on phones.
* "Cinematic Hero — Scroll" — the footage ITSELF is scrubbed by scroll. Every
  frame is tied to the scroll position, so the film plays forward as you scroll
  down and rewinds as you scroll up — it never "ends" and never loops. It is
  intentionally text-light (the opening beat is copy-free; only the finale
  carries the wordmark, tagline and CTA) and is tuned for maximum smoothness on
  phones.

Both are separate widgets with distinct CSS prefixes (`.th-` and `.thx-`) and
their own engines, so you can even drop both on one page while comparing.

== Installation ==

1. Zip the `tendernism-hero` folder (the folder that contains
   `tendernism-hero.php`) and upload it via Plugins → Add New → Upload Plugin,
   OR copy the folder into `wp-content/plugins/`.
2. Activate "Tendernism Cinematic Hero". Elementor must already be active.
3. Edit a page with Elementor. In the widget panel, open the "Tendernism"
   category and drag in either "Cinematic Hero" (play/loop) or
   "Cinematic Hero — Scroll" (scroll-scrubbed). Best placed as the first section
   of the page (a full-width / no-padding section, no container gaps).

Both widgets ship pre-filled with the approved two-beat cut streaming from the
current CDN, so they work the moment they are dropped in. The scroll-scrubbed
widget uses ALL-KEYFRAME re-encodes of those clips so seeking to any frame is
instant.

== The scroll-scrubbed widget ("Cinematic Hero — Scroll") ==

* The video is never played in real time — it is SEEKED to the frame that
  matches the scroll position. Because the clips are re-encoded all-keyframe,
  that seek is instant, so the footage transports smoothly frame-by-frame.
* Lenis smooths the scroll, ScrollTrigger maps it to progress, and a small
  requestAnimationFrame loop eases the applied video time toward it — so even a
  jerky finger drag on a phone becomes a silky, weighted film transport.
* Motion & timing controls: "Scroll length per scene" (how much scrolling
  transports each clip end-to-end), "Finale hold length" (extra scroll where the
  finale holds fully on screen at the end), "Crossfade amount", and "Scrub
  smoothing" (lower = silkier/weightier, higher = tracks the finger tighter).
* It is text-light by default: leave a scene's headline empty for a copy-free,
  footage-only beat. The finale reveals its copy (and draws the crown) in sync
  with the scrub, then holds.
* Same device-correct opening poster and full typography / colour / button /
  crown Style controls as the play/loop widget.
* On iOS the decoder is "warmed" (a muted play immediately paused, plus a warm
  on first touch) so the very first scroll-seek paints a real frame rather than
  a black one.

== Editing (everything is in the Elementor panel) ==

* Content → Scenes: a repeater of "beats". Per scene you set the desktop video
  URL (16:9) and optional mobile URL (9:16), optional poster stills for desktop
  and mobile (shown instantly while the clip decodes), the copy (eyebrow,
  headline — one line per row, subtitle), a button + link, the chapter
  mark/label, the alignment, a style variant (Finale renders the page's only H1
  and holds on screen), a per-scene "Show crown icon" switch on the Finale
  variant, and how far into the scene the words reveal.
* Style → Headline / Eyebrow / Subtitle / Button: full Elementor typography
  (font, size, weight, letter-spacing, line-height), colours, the headline
  outline thickness + text shadow, and complete button styling (normal/hover
  colours, border, radius, padding, shadow).
* Style → Crown icon: colour and size for the finale crown.
* Content → Motion & timing: playback speed, scroll length per scene, crossfade
  width, "Keep clip alive when parked" (any value above 0 loops the whole clip
  seamlessly when a scene is held on screen; 0 freezes on the last frame), and an
  "Auto-scroll when the clip
  ends" switch with its delay and distance — a beat after the opening clip
  finishes the page smoothly glides down a touch to hint that scrolling drives
  the story (fires once, only if still at the top, cancelled by any manual
  scroll).
* Content → Ambient sound: a looping ambience URL, its volume, and whether to
  show the sound toggle. The toggle self-hides until the file is playable.
* Content → Chrome & fonts: the scroll cue, the film frame, and whether to load
  the brand fonts (Bebas Neue, Space Grotesk, Great Vibes) from Google Fonts —
  turn this off if your theme already provides them.
* Style → Colours: every brand colour (background, headline, gold, etc.) maps to
  a CSS variable, so the whole hero can be re-themed visually.

== Behaviour notes ==

* Videos stream directly from their URLs (e.g. the Higgsfield CDN). Nothing is
  re-hosted in WordPress.
* On phones (≤640px) each scene uses its mobile (portrait) URL if provided,
  chosen once at load — no mid-session src swap, so no layout shift.
* The opening poster is a device-correct layer chosen by a CSS media query, so
  phones reliably show the mobile still (not the desktop one) with no flash, then
  it fades out the moment the opening clip starts playing. (A plain <video poster>
  attribute cannot be media-queried, which is why the desktop still used to leak
  onto phones.)
* When a clip finishes while its scene is still parked, the whole clip loops
  seamlessly instead of jump-cutting the last couple of seconds; set "Keep clip
  alive when parked" to 0 to freeze on the final frame instead.
* Scrolling is smoothed on touch devices too (not just the mouse wheel), and the
  pinned timeline no longer re-jerks when the mobile browser's address bar shows
  or hides — so the scrubbed film stays smooth on phones. If the theme omits the
  mobile viewport meta tag, the widget adds a standard one when it is missing.
* Mobile performance pass: on phones (≤640px) the per-frame text blur, the
  always-on video/haze drift animations, and the sound button's backdrop blur are
  switched off (they are the main causes of scroll stutter on touch GPUs); the
  scroll-driven crossfades, per-scene scale and copy reveals are unchanged. Each
  scene is also given ~40% more scroll room on phones so a short swipe glides
  through a beat instead of skipping it, and touch inertia is tuned for a more
  natural fling.
* In the Elementor editor the hero shows the opening frame statically so you can
  edit content; the full scrubbed experience runs on the live front end.
* Visitors with "reduce motion" enabled get a static hold on the finale (the
  brand payoff and call to action) instead of the scrubbed film.
* GSAP, ScrollTrigger and Lenis are bundled locally (no third-party CDN) and are
  only enqueued on pages that actually use the widget.

== Bundled libraries ==

* GSAP 3.15.0 + ScrollTrigger (GreenSock standard license)
* Lenis 1.3.25 (MIT)
