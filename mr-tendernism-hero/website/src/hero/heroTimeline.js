// ─────────────────────────────────────────────────────────────────────────────
// heroTimeline.js — pure, framework-agnostic GSAP timeline construction.
//
// This module knows nothing about React or ScrollTrigger. It builds a paused
// master timeline (total duration = number of scenes, i.e. 1 time-unit / scene)
// which the scroll layer scrubs. Keeping it pure makes the motion easy to test,
// reuse, and — importantly — port into Elementor later with the same math.
//
// Motion philosophy encoded here:
//   • Long fades, slow eases. No bounce, no spin, no aggressive parallax.
//   • Videos CROSSFADE across a shared boundary — they never hard-cut.
//   • A near-imperceptible ken-burns settle (1.06 → 1.0) gives the frame life
//     without ever calling attention to itself.
// ─────────────────────────────────────────────────────────────────────────────

import gsap from "gsap";

// Overlap window (in time-units) over which two adjacent videos dissolve.
// Widened so every seam (all engineered on smoke/steam) dissolves as one
// continuous roll — the joins should be nearly impossible to spot.
const CROSSFADE = 0.66;

// Default point in a scene (0..1) at which its copy begins to reveal. Late,
// so the footage establishes first and the words never race the image.
const REVEAL_AT = 0.26;

// Signature ease for the whole piece — a slow, weighted settle.
const CINEMATIC_EASE = "power2.inOut";

/**
 * Build the timeline for a single scene's TEXT (eyebrow, lines, subtitle, cta).
 * Each scene genuinely owns its own timeline, which the master nests in place.
 *
 * Local time 0 == the scene's window start. Duration is 1 unit.
 *
 * @param {object} els - resolved DOM nodes for this scene
 * @param {boolean} isFinale - the last scene holds on screen (no fade-out)
 */
function buildSceneTextTimeline(els, isFinale) {
  const tl = gsap.timeline();
  const { textItems, crownPaths, revealAt } = els;
  if (!textItems.length) return tl;

  // Per-scene reveal point (e.g. the Craft headline lands AFTER the knife
  // completes its slice — the image speaks first, the words confirm it).
  const start = typeof revealAt === "number" ? revealAt : REVEAL_AT;

  // Crown line-draw — the logo completing itself at the finale.
  if (crownPaths && crownPaths.length) {
    crownPaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 200;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(path, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" }, start);
    });
  }

  // Reveal: a slow rise out of soft focus, line by line, like a held breath.
  tl.fromTo(
    textItems,
    { autoAlpha: 0, y: 40, filter: "blur(9px)" },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.34,
      ease: "power2.out",
      stagger: 0.07,
    },
    start
  );

  // Hold briefly, then release — tightened so there is no dead scroll between
  // moments; the words clear a touch earlier to keep the journey moving.
  if (!isFinale) {
    tl.to(
      textItems,
      {
        autoAlpha: 0,
        y: -30,
        filter: "blur(9px)",
        duration: 0.24,
        ease: "power2.in",
        stagger: 0.04,
      },
      0.7
    );
  }

  return tl;
}

/**
 * Assemble the master timeline: video crossfades + nested per-scene text.
 *
 * @param {object} params
 * @param {HTMLVideoElement[]} params.videoEls   - stacked <video> layers
 * @param {object[]}           params.sceneEls    - [{ textItems: HTMLElement[] }]
 * @returns {gsap.core.Timeline} paused master timeline (duration === scene count)
 */
export function buildMasterTimeline({ videoEls, sceneEls }) {
  const count = videoEls.length;

  // gsap.timeline with no defaults; scrubbed externally.
  const master = gsap.timeline({ paused: true, defaults: { ease: CINEMATIC_EASE } });

  // Initial state: only the first frame is visible; all layers pre-scaled in.
  videoEls.forEach((v, i) => {
    gsap.set(v, { autoAlpha: i === 0 ? 1 : 0, scale: 1.06, transformOrigin: "50% 50%" });
  });

  videoEls.forEach((video, i) => {
    const sceneStart = i;

    // ── Video crossfade ──────────────────────────────────────────────────
    // Every scene after the first dissolves IN across the boundary it shares
    // with the previous scene, so there is never a black gap or hard cut.
    if (i > 0) {
      master.to(video, { autoAlpha: 1, duration: CROSSFADE }, sceneStart - CROSSFADE / 2);
    }
    // Every scene except the last dissolves OUT into the next.
    if (i < count - 1) {
      master.to(
        video,
        { autoAlpha: 0, duration: CROSSFADE },
        sceneStart + 1 - CROSSFADE / 2
      );
    }

    // ── Ken-burns settle ─────────────────────────────────────────────────
    // A single, very slow scale relaxation across the scene. GPU transform only.
    master.to(video, { scale: 1.0, duration: 1, ease: "none" }, sceneStart);

    // ── Nested per-scene text timeline ───────────────────────────────────
    const isFinale = i === count - 1;
    master.add(buildSceneTextTimeline(sceneEls[i], isFinale), sceneStart);
  });

  return master;
}

/**
 * Given normalized scroll progress (0..1) and scene count, return the index of
 * the scene currently on screen. Used to drive play/pause so only the active
 * video decodes frames.
 */
export function activeSceneIndex(progress, count) {
  const raw = Math.floor(progress * count);
  return Math.min(count - 1, Math.max(0, raw));
}

export { CROSSFADE, CINEMATIC_EASE };
