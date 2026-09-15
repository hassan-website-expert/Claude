=== Tendernism Preloader ===
Requires at least: 5.2
Requires PHP: 7.0
Stable tag: 1.1.0

A premium, branded full-screen site preloader — the kind you see on high-end
sites. It shows a cinematic Mr. Tendernism loading screen (line-drawn crown, gold
wordmark, script tagline, drifting smoke and an animated gold loader) the instant
a page starts loading, then fades it out once the page is ready.

This is a completely STANDALONE plugin. It does not require Elementor, the
Tendernism hero widgets, or any other plugin — it works on any theme.

== Installation ==

1. Zip the `tendernism-preloader` folder (the folder that contains
   `tendernism-preloader.php`) and upload it via Plugins → Add New → Upload
   Plugin, OR copy the folder into `wp-content/plugins/`.
2. Activate "Tendernism Preloader".
3. Configure it under Settings → Preloader.

It works immediately on activation with the Mr. Tendernism branding; the settings
just let you tailor it.

== How it works ==

* The overlay's critical CSS is printed inline in the page `<head>`, and the
  overlay markup is printed at the very top of `<body>` (via `wp_body_open`, with
  a footer fallback for older themes). So it covers the page on the FIRST paint —
  no flash of unstyled content.
* The overlay is removed on the browser's `load` event (once images, fonts and
  other resources are in), after a configurable minimum on-screen time so the
  brand never merely flashes.
* A hard "Maximum wait" cap removes it after a set time even if the page never
  finishes loading, so a slow or failed asset can never trap visitors behind it.
* Optional "Show once per visit" remembers (via sessionStorage, pre-paint) that a
  visitor has already seen it and skips it for the rest of their session — with
  no flash on the repeat views.
* Respects `prefers-reduced-motion` (animations off, no draw-in).
* Never runs in the admin, the Customizer preview, or Elementor/Beaver Builder
  editor previews.

== Settings (Settings → Preloader) ==

* Enable preloader on/off.
* Where to show: every page, or homepage only.
* Show once per visit.
* Title / wordmark, tagline, and a small loading label.
* Crown on/off.
* Loader style: gold sweeping bar, spinning ring, pulsing dots, or a number
  counter that climbs to 100% as the page loads (with a thin progress fill).
* Colours: background, gold, gold highlight, text (all hex).
* Maximum wait (ms) and Minimum on screen (ms).

== Notes ==

* Brand fonts (Bebas Neue, Great Vibes, Space Grotesk) are loaded from Google
  Fonts for the wordmark/tagline; the CSS falls back to system fonts if they are
  blocked.
* Self-contained: one small stylesheet and one small script, only enqueued on the
  front end when the preloader is enabled for the current page.
* The number counter is a smooth, eased estimate (browsers expose no exact
  "page is N% loaded" figure): it crawls up over time, speeds up once the DOM is
  parsed, and always lands on exactly 100% at the instant the page is ready.
