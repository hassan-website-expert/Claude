# Winged Solar Solutions — Linktree

A single-file, self-contained "link in bio" landing page for
[Winged Solar Solutions](https://wingedsolar.com/) — makers of patented,
modular solar-generation and battery-storage systems (the **Sparrow**,
**Hawk**, and **Eagle** platforms) for mobile, rapidly deployable, and
permanent off-grid power.

## Files

- `index.html` — the whole page. No build step, no dependencies, no external
  assets. Everything (styles, SVG logo/icons, fonts) is inline, so it works
  offline and can be dropped onto any static host.

## Using it

Open `index.html` in a browser, or deploy it to any static host:

- **GitHub Pages** — enable Pages for this folder/branch.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or point at the repo.
- Rename to `index.html` at the root of a domain like `links.wingedsolar.com`.

## Editing the links

All buttons live in one place — the `BUTTONS` array inside the `<script>` tag
at the bottom of `index.html`. No other code needs to change.

```js
const BUTTONS = [
  { label: "Winged Solar Website", url: "https://wingedsolar.com/", icon: "globe" },
  { label: "Request a Consultation", url: "https://wingedsolar.com/", icon: "quote", cta: true },
  // ...
];
```

- `icon` — one of: `globe, grid, solutions, water, quote, faq, about,
  linkedin, instagram, x, facebook, youtube, mail`
- `cta: true` — renders the button as the highlighted gold call-to-action.

To remove a button, delete its line. To reorder, move the lines.

## Logo

The header loads the official logo from `winged-solar-logo.png` in this folder.
**Add that exact file here** (same folder as `index.html`) and it appears on a
clean white plate. Until the file is present, the page falls back to a drawn
eagle-and-sun emblem automatically, so it never looks broken. To use a
different filename or a hosted URL, edit the `src` on the `.logo-img` tag.

## ⚠️ Confirm the URLs

The homepage (`https://wingedsolar.com/`) is correct. The **product**,
**contact**, and **social** URLs are best-guess placeholders — the live site
was not reachable from the environment where this page was built. Update them
to the real page and profile URLs before publishing.

## Design

A clean pill-list "link in bio" page, matched to the Winged Solar brand:

- Full-bleed steel-blue → navy brand background with a soft solar glow.
- Full-width rounded pill buttons with a left icon and centered label, plus a
  highlighted gold "Request a Consultation" call-to-action.
- Brand palette: steel blue (`#2f8fb0` / `#17506a` / `#0e2f3d`) and gold
  (`#f6a623` / `#e07d10`).
- An inline-SVG recreation of the eagle-with-solar-panel-wings + rising-sun
  logo on a clean white plate, so the whole page stays self-contained (no
  image files).
- Buttons mirror the real site nav (Platforms, Solutions, Power + Water, FAQs,
  About Us) followed by social links.
- Fully responsive, keyboard-accessible, and honors `prefers-reduced-motion`.
