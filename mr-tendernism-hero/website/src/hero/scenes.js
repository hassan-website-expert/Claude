// ─────────────────────────────────────────────────────────────────────────────
// scenes.js — single source of truth for the cinematic hero (V3).
//
// V3 CREATIVE RESET: the hero is no longer a montage of independent clips. It is
// ONE CONTINUOUS DOCUMENTARY JOURNEY — the visitor arrives at Mr. Tendernism's
// cookout and quietly walks through his world. We can't generate a true 40s
// one-shot with today's AI models (identity drifts past ~8s), so we fake the
// "oner" the way real cinema does (1917, Birdman): every clip is engineered to
// END and START on a shared OCCLUDER — dense smoke or steam — and the seam is
// hidden inside it. Smoke→smoke never reads as a montage dissolve.
//
// Glue that turns 6 clips into one film:
//   • Occluder seams  — every join happens inside smoke / steam / dark.
//   • Persistent overlay (hero__tone/haze/grade/grain) — never resets.
//   • One continuous ambient audio bed — fire crackle + room tone (to come).
//   • Scroll IS the camera move — clips push slowly; the WALK is the scroll.
//
// Copy is reduced to a MAXIMUM OF 4 MOMENTS. Visuals tell the story; the words
// only reinforce emotion, appear naturally, and disappear naturally.
// ─────────────────────────────────────────────────────────────────────────────

// Higgsfield CDN sources (Path A — stream now, self-host later).
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2";
export const VIDEO = {
  // Beat 1 — opens in black w/ ember glow, camera pushes forward, frame fills
  // with dense oak smoke by the final frame (the seam into The Man).
  opener: `${CDN}/hf_20260729_113143_cdba3681-3bd9-4f61-bc64-e8c08e9764f8.mp4`,
  // Beat 2 — emerges FROM smoke, he lifts the lid, smoke billows at camera
  // (v3 documentary regen, 6 reference images locked for identity).
  man: `${CDN}/hf_20260728_201223_03bc1e3a-dae9-4895-b2ff-a0cd1043440a.mp4`,
  // Beats 3–6 still point at V2 footage as PLACEHOLDERS until the seam test is
  // approved and we produce fire / brisket / gathering / handoff with matched
  // smoke+steam in/out frames.
  fire: `${CDN}/hf_20260728_193101_35d7264b-1e2a-44d9-ae17-a1022685104e.mp4`,
  craft: `${CDN}/hf_20260728_193714_e21cf188-ae2e-4bbf-a1df-fee67c6aa6cb.mp4`,
};

export const scenes = [
  {
    id: "opener",
    chapter: "I",
    label: "Arrival",
    video: VIDEO.opener,
    align: "center",
    // MOMENT 1 — lands late, on the smoke, once atmosphere has taken hold.
    lines: ["Some things", "can’t be rushed."],
    revealAt: 0.5,
  },
  {
    id: "the-man",
    chapter: "II",
    label: "The Man",
    // Emerges from the opener's smoke — the hidden cut lives here.
    video: VIDEO.man,
    align: "center",
    // MOMENT 2 — a quiet introduction, no eyebrow, no subtitle clutter.
    lines: ["Meet", "Mr. Tendernism."],
    variant: "name",
    revealAt: 0.42,
  },
  {
    id: "fire",
    chapter: "III",
    label: "The Fire",
    // No text beat — the fire and its sound carry patience on their own.
    video: VIDEO.fire,
    align: "start",
  },
  {
    id: "craft",
    chapter: "IV",
    label: "The Craft",
    video: VIDEO.craft,
    align: "end",
    // MOMENT 3 — lands after the brisket has shown its own tenderness.
    lines: ["Crafted", "with patience."],
    revealAt: 0.52,
  },
  {
    id: "gathering",
    chapter: "V",
    label: "The Gathering",
    // PLACEHOLDER clip — to become the pull-back to bokeh-implied guests.
    video: VIDEO.man,
    align: "center",
    // No text — warmth and community read through image + ambient laughter.
  },
  {
    id: "invitation",
    chapter: "VI",
    label: "The Invitation",
    // PLACEHOLDER clip — to become the settle that hands off to the homepage.
    video: VIDEO.man,
    align: "center",
    // MOMENT 4 — the only place the brand voice states itself, as we resolve.
    lines: ["Good Energy.", "Real Moments.", "Good Food."],
    cta: "Book Mr. Tendernism",
    variant: "finale",
    revealAt: 0.4,
  },
];

export default scenes;
