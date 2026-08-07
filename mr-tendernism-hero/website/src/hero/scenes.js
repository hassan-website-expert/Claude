// ─────────────────────────────────────────────────────────────────────────────
// scenes.js — single source of truth for the cinematic hero.
//
// DIRECTION (client reset → ONE iconic moment): the hero is now a SINGLE
// continuous documentary clip. No multi-scene scrubbing, no clip switching. The
// camera sits behind the real offset smoker (~30°); Mr. Tendernism walks in — we
// see only his back and side profile, never a full frontal face — reaches the
// smoker and slowly lifts the lid; a thick cloud of natural white smoke rolls out
// and fills the frame, settling into a calm hold. The homepage headline + CTA
// animate over this same shot.
//
// The clip plays its action ONCE, then the player seamlessly loops its
// smoke-filled tail (two stacked layers crossfading at the seam) so the hero
// never freezes if the visitor pauses before scrolling.
//
// `scenes` stays a one-element array so the reduced-motion StaticHero keeps
// working unchanged; CinematicHero reads scenes[0].
// ─────────────────────────────────────────────────────────────────────────────

// Higgsfield CDN sources (Path A — stream now, self-host later).
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2";

// Approved "Variation A" — behind the offset smoker, back/side profile, lid lift,
// white smoke roll, calm ambient hold. 16:9. Streams at 720p for now; swap this
// to the Topaz 4K master once Higgsfield credits allow (just a URL change).
export const HERO_VIDEO = `${CDN}/hf_20260807_113431_a7b7c8de-de25-4946-8874-fbca101e4c8c.mp4`;

// Seamless ambient loop tuning (seconds).
//   loopTail  — length of the clip's end segment that loops (the settled,
//               smoke-filled hold after the lid is open).
//   crossfade — dissolve at the loop seam; sits inside the smoke so it's unseen.
export const LOOP_TAIL = 2.0;
export const CROSSFADE = 0.6;

export const scenes = [
  {
    id: "cookout",
    video: HERO_VIDEO,
    // TODO: point at a dedicated 9:16 reframe once generated; until then the 16:9
    // clip is cover-cropped to portrait on phones (subject stays ~centered).
    videoMobile: HERO_VIDEO,
    align: "center",
    variant: "finale",
    eyebrow: "Come hungry",
    lines: ["Mr. Tendernism"],
    subtitle: "Good Energy. Real Moments. Good Food.",
    cta: "Book Mr. Tendernism",
    // Do NOT loop/replay the clip — it plays through once and holds. The frame
    // stays alive because the smoke haze layer keeps drifting upward over it.
    ambientLoop: false,
    loopTail: LOOP_TAIL,
    crossfade: CROSSFADE,
  },
];

export default scenes;
