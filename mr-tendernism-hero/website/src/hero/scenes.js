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
  man: `${CDN}/hf_20260728_193032_6ac77b87-1f96-4c3d-8730-7d257b72ae91.mp4`,
  fire: `${CDN}/hf_20260728_193101_35d7264b-1e2a-44d9-ae17-a1022685104e.mp4`,
  // The knife-through-brisket "craft" shot. Falls back to the pull-apart beef
  // until the knife render is wired in.
  craft: `${CDN}/hf_20260722_164510_dbaf0ea4-9bd0-4be4-b869-1b54651a0e40.mp4`,
};

// Mr. Tendernism's spoken philosophy (Seedance/Seed-Audio, warm low read).
// Played once when the Philosophy scene is on screen — only after the visitor
// clicks the sound toggle (browsers block autoplay with sound).
export const VOICE = {
  philosophy: `${CDN}/hf_20260724_102414_4638f174-aecc-4cd5-b015-0c0268d9c61e.wav`,
};

export const scenes = [
  {
    id: "smoke",
    chapter: "I",
    label: "Smoke",
    video: VIDEO.smoke,
    align: "center",
    // Warm, experiential hook — we're selling a NIGHT, not a legacy. Lands on
    // pure smoke first, then the line rises.
    lines: ["Some nights", "you never forget."],
    revealAt: 0.44,
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
    // Personality up front — pitmaster, but also host and good company.
    subtitle: "Pitmaster · Host · Good company",
    variant: "name",
  },
  {
    id: "philosophy",
    chapter: "III",
    label: "The Philosophy",
    // Stay with him — his words land over the same held portrait, as if spoken.
    video: VIDEO.man,
    align: "start",
    // His voice. The ellipsis is a held breath; the last line is the turn.
    lines: ["People think", "it’s about the meat…", "", "but it never was."],
    variant: "quote",
    // Placeholder read — swap for his REAL recorded voice for production.
    audio: VOICE.philosophy,
    revealAt: 0.3,
  },
  {
    id: "fire",
    chapter: "IV",
    label: "The Fire",
    video: VIDEO.fire,
    align: "start",
    // Energy, not solemnity — it all kicks off here.
    lines: ["It all begins", "with fire."],
  },
  {
    id: "craft",
    chapter: "V",
    label: "The Craft",
    video: VIDEO.craft,
    align: "end",
    // Concrete craft = respect + hunger, warmer than "every cut is earned".
    lines: ["Sixteen hours.", "Worth every one."],
    // Land the words AFTER the knife finishes the slice.
    revealAt: 0.5,
  },
  {
    id: "invitation",
    chapter: "VI",
    label: "The Invitation",
    video: VIDEO.man, // reuse the hero portrait, reframed + graded to hold
    align: "center",
    // Invitation, not eulogy. "Come hungry" flips the whole ending warm.
    eyebrow: "Come hungry",
    lines: ["Mr. Tendernism"],
    subtitle: "Good Energy. Real Moments. Good Food.",
    cta: "Book Mr. Tendernism",
    variant: "finale",
  },
];

export default scenes;
