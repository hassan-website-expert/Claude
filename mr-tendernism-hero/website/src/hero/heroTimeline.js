// ─────────────────────────────────────────────────────────────────────────────
// heroTimeline.js — pure, framework-agnostic GSAP timeline construction.
//
// The hero is now ONE continuous shot rather than a scrubbed multi-scene stack,
// so this module builds a single on-LOAD intro timeline: the copy (crown draw,
// eyebrow, wordmark, tagline, CTA) rises out of soft focus over the footage a
// beat after the lid opens. It is paused; the controller plays it once.
//
// Kept framework-agnostic (no React, no ScrollTrigger) so the same math ports
// straight into the Elementor widget.
// ─────────────────────────────────────────────────────────────────────────────

import gsap from "gsap";

/**
 * Build the paused intro timeline for the single hero scene's copy.
 *
 * @param {HTMLElement} sceneEl - the element containing [data-hero-text] nodes
 * @returns {gsap.core.Timeline} paused timeline (play it once on load)
 */
export function buildIntroTimeline(sceneEl) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  if (!sceneEl) return tl;

  const items = Array.from(sceneEl.querySelectorAll("[data-hero-text]"));
  if (!items.length) return tl;

  // Crown line-draw — the logo completing itself under the wordmark.
  const crownPaths = Array.from(sceneEl.querySelectorAll("[data-hero-crown] path"));
  crownPaths.forEach((path) => {
    const len = path.getTotalLength ? path.getTotalLength() : 200;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 0);
  });

  // A slow rise out of soft focus, line by line — a held breath, not a snap.
  tl.fromTo(
    items,
    { autoAlpha: 0, y: 34, filter: "blur(8px)" },
    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.14 },
    0.1
  );

  return tl;
}

export default buildIntroTimeline;
