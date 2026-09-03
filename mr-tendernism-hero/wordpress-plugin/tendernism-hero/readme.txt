=== Tendernism Cinematic Hero ===
Requires at least: 6.0
Requires PHP: 7.4
Requires Elementor: 3.5+
Stable tag: 1.4.0

A scroll-driven cinematic hero for Mr. Tendernism, delivered as a fully editable
Elementor widget. It recreates the pinned, scrubbed film experience — video
crossfades, per-scene copy reveals, a "living hold" so clips never freeze,
ambient sound, and portrait clips on phones — natively inside WordPress.

== Installation ==

1. Zip the `tendernism-hero` folder (the folder that contains
   `tendernism-hero.php`) and upload it via Plugins → Add New → Upload Plugin,
   OR copy the folder into `wp-content/plugins/`.
2. Activate "Tendernism Cinematic Hero". Elementor must already be active.
3. Edit a page with Elementor. In the widget panel, open the "Tendernism"
   category and drag in "Cinematic Hero". Best placed as the first section of
   the page (a full-width / no-padding section, no container gaps).

The widget ships pre-filled with the approved two-beat cut streaming from the
current CDN, so it works the moment it is dropped in.

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
