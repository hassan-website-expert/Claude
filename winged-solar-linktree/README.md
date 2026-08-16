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

All links live in one place — the `LINKS` and `SOCIALS` arrays inside the
`<script>` tag at the bottom of `index.html`. No other code needs to change.

```js
const LINKS = [
  {
    group: "Our platforms",     // optional heading above the link
    title: "Sparrow",
    sub: "Compact, portable solar + storage",
    url: "https://wingedsolar.com/",
    icon: "sparrow",            // globe, sparrow, hawk, eagle, water, quote, mail, doc
    accent: "#ffd166"           // any CSS color
  },
  // ...
];
```

To hide a social button, set its `url` to `""`.

## ⚠️ Confirm the URLs

The homepage (`https://wingedsolar.com/`) is correct. The **product**,
**contact**, and **social** URLs are best-guess placeholders — the live site
was not reachable from the environment where this page was built. Update them
to the real page and profile URLs before publishing.

## Design

Matched to the Winged Solar Solutions brand:

- Light theme with the site's steel-blue → navy hero band and a diagonal
  white cut, echoing the homepage hero.
- Brand palette: steel blue (`#2f8fb0` / `#21607d` / `#163a4d`) and gold
  (`#ef8f1c` / `#f6a623`).
- An inline-SVG recreation of the eagle-with-solar-panel-wings + rising-sun
  logo, so the whole page stays self-contained (no image files).
- Links mirror the real site nav (Platforms, Solutions, Power + Water, FAQs,
  About Us) plus a "Request Consultation" CTA, with a social row.
- Fully responsive, keyboard-accessible, and honors `prefers-reduced-motion`.
