// ─────────────────────────────────────────────────────────────────────────────
// scenes.js — single source of truth for the cinematic hero.
//
// Footage: warm-noir Seedance shots of the REAL Mr. Tendernism + fire / smoke /
// the knife-through-brisket "craft" shot. Streamed from Higgsfield's CDN for now
// (Path A). For production, download each clip into /public/videos and swap CDN[…]
// for the local "./videos/…" path — nothing else changes.
//
// Copy is person-first and minimal. Silence and negative space carry the rest.
// ─────────────────────────────────────────────────────────────────────────────

// Higgsfield CDN sources (Path A — stream now, self-host later).
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2";
export const VIDEO = {
  smoke: `${CDN}/hf_20260722_163934_7a956190-f7f8-47c0-911b-cd9c20eba252.mp4`,
  man: `${CDN}/hf_20260722_163300_3b7f5b20-eb4e-4762-8600-e1b9ee8a6a28.mp4`,
  fire: `${CDN}/hf_20260722_163937_0d7433b3-69ed-4234-8168-5529d887ee75.mp4`,
  // The knife-through-brisket "craft" shot. Falls back to the pull-apart beef
  // until the knife render is wired in.
  craft: `${CDN}/hf_20260722_164510_dbaf0ea4-9bd0-4be4-b869-1b54651a0e40.mp4`,
};

export const scenes = [
  {
    id: "smoke",
    chapter: "I",
    label: "Smoke",
    video: VIDEO.smoke,
    align: "center",
    lines: ["Some things", "can’t be rushed."],
  },
  {
    id: "the-man",
    chapter: "II",
    label: "The Man",
    video: VIDEO.man,
    // He sits right-of-frame; keep the type in the calm space on the left.
    align: "start",
    eyebrow: "Meet",
    lines: ["Mr. Tendernism"],
    variant: "name", // gold-script wordmark treatment
  },
  {
    id: "fire",
    chapter: "III",
    label: "The Fire",
    video: VIDEO.fire,
    align: "start",
    lines: ["It starts with fire.", "And patience."],
  },
  {
    id: "craft",
    chapter: "IV",
    label: "The Craft",
    video: VIDEO.craft,
    align: "end",
    lines: ["Every cut", "is earned."],
    subtitle: "Tender. Slow. Perfected.",
  },
  {
    id: "legend",
    chapter: "V",
    label: "The Legend",
    video: VIDEO.man, // reuse the hero portrait, reframed + graded to hold
    align: "center",
    eyebrow: "Welcome to",
    lines: ["Mr. Tendernism"],
    subtitle: "Good Energy. Real Moments. Good Food.",
    cta: "Book Mr. Tendernism",
    variant: "finale",
  },
];

export default scenes;
