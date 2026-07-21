// ─────────────────────────────────────────────────────────────────────────────
// scenes.js — the single source of truth for the cinematic hero.
//
// Each scene owns:
//  • its approved video asset
//  • its editorial copy (kept as real HTML text, never baked into the video — SEO + a11y)
//  • an `align` hint so typography can breathe against the calmest part of the footage
//
// Copy is intentionally minimal. Silence and negative space carry the rest.
// ─────────────────────────────────────────────────────────────────────────────

export const scenes = [
  {
    id: "smoke",
    chapter: "I",
    label: "Smoke",
    video: "./videos/01-smoke-intro.mp4",
    align: "center",
    // Line breaks are authored so the phrasing lands with cinematic timing.
    lines: ["Not every fire", "tells a story."],
  },
  {
    id: "the-man",
    chapter: "II",
    label: "The Man",
    video: "./videos/02-mr-tendernism-arrival.mp4",
    align: "center",
    eyebrow: "Meet",
    lines: ["Mr. Tendernism"],
    // This scene uses the wordmark treatment rather than plain lines.
    variant: "name",
  },
  {
    id: "fire",
    chapter: "III",
    label: "Fire",
    video: "./videos/03-the-fire.mp4",
    align: "start",
    lines: ["It doesn’t start", "with the meat.", "", "It starts", "with the fire."],
  },
  {
    id: "craft",
    chapter: "IV",
    label: "Craft",
    video: "./videos/04-the-craft.mp4",
    align: "end",
    lines: ["Every cut", "is earned.", "", "Not rushed.", "", "Perfected", "over time."],
  },
  {
    id: "legend",
    chapter: "V",
    label: "The Legend",
    video: "./videos/05-the-legend.mp4",
    align: "center",
    eyebrow: "Welcome to",
    lines: ["Tendernism"],
    subtitle: "Crafted Through Fire. Perfected Through Patience.",
    cta: "Explore the Experience",
    variant: "finale",
  },
];

export default scenes;
