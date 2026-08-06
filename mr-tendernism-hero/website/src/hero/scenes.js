// ─────────────────────────────────────────────────────────────────────────────
// scenes.js — single source of truth for the cinematic hero.
//
// DIRECTION (client reset): the hero is now built entirely from footage that
// recreates Mr. Tendernism's REAL cookout — his exact face (locked to reference
// frames from his reel), his real dark steel offset smoker under the pergola,
// and the real rolling smoke. No invented BBQ scenes, no meat close-ups. The
// experience is deliberately SHORT: two authentic beats, then the homepage.
//
//   Beat I  — Anticipation. Opens behind the smoker (smoke already off the
//             stack); he walks in and lifts the lid, smoke fills the frame, the
//             camera slides to a 3/4 angle. The chamber is never revealed.
//   Beat II — The Pitmaster (finale). He's at the open smoker and looks to
//             camera with a warm, confident, welcoming smile — the brand line
//             and booking CTA land here.
//
// Clips are 16:9 (desktop hero) and play a touch faster than real-time for a
// snappier, less languid feel (see PLAYBACK_RATE in useCinematicHero).
// ─────────────────────────────────────────────────────────────────────────────

// Higgsfield CDN sources (Path A — stream now, self-host later).
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2";
export const VIDEO = {
  // Beat 1 — anticipation. Behind the offset smoker, smoke off the stack; he
  // walks in from the side, lifts the lid, smoke rolls up and fills frame while
  // the camera slides to 3/4. Never reveals the chamber (6 reel refs: face +
  // real smoker/environment/smoke).
  anticipation: `${CDN}/hf_20260806_162553_768d6c90-a6fb-4ec3-afaa-60b0217f661a.mp4`,
  // Beat 2 (finale) — reel-faithful: at the open smoker he lifts the lid and
  // looks to camera with a relaxed, warm smile (same 6-reference lock).
  pitmaster: `${CDN}/hf_20260806_160825_722e6fa6-12c8-4c3d-b745-632bdefdf6ed.mp4`,
};

export const scenes = [
  {
    id: "anticipation",
    chapter: "I",
    label: "The Smoker",
    video: VIDEO.anticipation,
    align: "center",
    // MOMENT 1 — mood over the building smoke, before he's fully revealed.
    lines: ["Some things", "can’t be rushed."],
    revealAt: 0.52,
  },
  {
    id: "pitmaster",
    chapter: "II",
    label: "The Pitmaster",
    // He turns to camera at the open smoker — the finale lives here: the name,
    // the brand line, the booking CTA.
    video: VIDEO.pitmaster,
    align: "center",
    eyebrow: "Come hungry",
    lines: ["Mr. Tendernism"],
    subtitle: "Good Energy. Real Moments. Good Food.",
    cta: "Book Mr. Tendernism",
    variant: "finale",
    revealAt: 0.42,
  },
];

export default scenes;
