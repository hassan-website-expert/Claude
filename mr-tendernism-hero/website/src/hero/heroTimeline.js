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
// Wide enough to feel like a dissolve, never a cut.
const CROSSFADE = 0.5;

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
  const { textItems } = els;
  if (!textItems.length) return tl;

  // Reveal: rise + fade in, gently staggered so lines arrive like breath.
  tl.fromTo(
    textItems,
    { autoAlpha: 0, y: 34, filter: "blur(6px)" },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.26,
      ease: "power2.out",
      stagger: 0.05,
    },
    0.16 // let the video settle in before words appear
  );

  // Hold in silence, then release — unless this is the finale, which stays.
  if (!isFinale) {
    tl.to(
      textItems,
      {
        autoAlpha: 0,
        y: -26,
        filter: "blur(6px)",
        duration: 0.22,
        ease: "power2.in",
        stagger: 0.03,
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
