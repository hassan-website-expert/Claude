=== Tendernism Single Hero ===
Requires at least: 6.0
Requires PHP: 7.4
Requires Elementor: 3.5+
Stable tag: 1.0.0

The "one iconic moment" cinematic hero for Mr. Tendernism, delivered as a fully
editable Elementor widget. ONE continuous documentary clip — the camera behind
the smoker, the pitmaster stepping in, the lid lifting, white smoke rolling out —
plays once, then EITHER seamlessly loops its smoke-filled tail (so it never
freezes) OR holds on the settled frame while a smoke haze keeps rising over it.
The headline and CTA animate in on load over the same shot, and a gentle
auto-scroll nudge can hint at what's below.

This is a SEPARATE plugin from "Tendernism Cinematic Hero" (the multi-scene
version). Every symbol is namespaced (ths- prefix), so both can be installed —
even activated at the same time — with no conflict. Use whichever hero the page
needs.

== Installation ==

1. Zip the `tendernism-hero-single` folder (the folder that contains
   `tendernism-hero-single.php`) and upload it via Plugins → Add New → Upload
   Plugin, OR copy the folder into `wp-content/plugins/`.
2. Activate "Tendernism Single Hero". Elementor must already be active.
3. Edit a page with Elementor. In the widget panel, open the "Tendernism"
   category and drag in "Single Hero". Best placed as the first section of the
   page (a full-width / no-padding section, no container gaps).

The widget ships pre-filled with the approved single clip streaming from the
current CDN, so it works the moment it is dropped in.

== Editing (everything is in the Elementor panel) ==

* Content → The Moment: the desktop video URL (16:9) and optional mobile URL
  (9:16), plus the copy — style variant (Finale renders the page's only H1,
  draws the crown, and styles the tagline in gold), alignment, eyebrow, headline
  (one line per row; a blank row is a deliberate beat), subtitle, and a button +
  link.
* Content → Motion & timing: the "Seamless tail loop" switch (Loop = the clip's
  smoke-filled tail loops forever behind an invisible crossfade; Hold = the clip
  plays once and holds while the rising smoke haze keeps it alive), the loop tail
  and crossfade lengths (loop mode only), how long after the clip starts the copy
  reveals, and the playback speed.
* Content → Auto-scroll nudge: whether to gently scroll the page down a touch a
  beat after the clip settles (hint that there's more below), the delay before it
  fires, and the distance. It fires once, only if the visitor is still at the
  top, and any manual scroll cancels it.
* Content → Ambient sound: a looping ambience URL, its volume, and whether to
  show the sound toggle. The toggle self-hides until the file is playable.
* Content → Chrome & fonts: the scroll cue, the film frame, and whether to load
  the brand fonts (Bebas Neue, Space Grotesk, Great Vibes) from Google Fonts —
  turn this off if your theme already provides them.
* Style → Colours: every brand colour (background, headline, gold, etc.) maps to
  a CSS variable, so the whole hero can be re-themed visually.

== Behaviour notes ==

* The video streams directly from its URL (e.g. the Higgsfield CDN). Nothing is
  re-hosted in WordPress. Two stacked <video> layers of the SAME clip drive the
  seamless loop; the browser serves the second copy from cache.
* On phones (≤640px) the mobile (portrait) URL is used if provided, chosen once
  at load — no mid-session src swap, so no layout shift.
* The copy rises in on load (not on scroll); scrolling away gently fades it out.
  There is no pinning — the hero is a single full-viewport section.
* In the Elementor editor the hero holds on the clip with the copy shown, so you
  can edit content; the full experience runs on the live front end.
* Visitors with "reduce motion" enabled get a calm static hold (looping clip,
  copy shown) instead of the timed reveal and auto-nudge.
* GSAP, ScrollTrigger and Lenis are bundled locally (no third-party CDN) and are
  only enqueued on pages that actually use the widget.

== Bundled libraries ==

* GSAP 3.15.0 + ScrollTrigger (GreenSock standard license)
* Lenis 1.3.25 (MIT)
