// ─────────────────────────────────────────────────────────────────────────────
// useCinematicHero.js — controller for the single-clip cinematic hero.
//
// Responsibilities:
//   • Play ONE continuous clip: the action (walk-in → lid lift → smoke) runs
//     once, then the smoke-filled tail loops FOREVER via a crossfade between two
//     stacked <video> layers — so the hero never freezes on a final frame and the
//     loop seam is invisible (it lives inside drifting smoke).
//   • Play the copy intro (crown, wordmark, tagline, CTA) once on load, a beat
//     after the lid opens, so the footage reads first.
//   • Hand off to the next section on scroll by gently fading the copy out — no
//     pin, no scrubbed clip switching, no hard cut.
//
// Reduced-motion visitors never reach this hook — App renders StaticHero instead.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildIntroTimeline } from "./heroTimeline";

gsap.registerPlugin(ScrollTrigger);

// Real-time playback — the moment is meant to feel calm and documentary, and
// real time keeps the crossfade loop math (which advances in wall-clock seconds)
// perfectly in sync with the video clock.
const PLAYBACK_RATE = 1.0;

// How long after playback starts the copy rises in (seconds) — after the lid is
// open and smoke is filling the frame, so the image speaks before the words.
const COPY_DELAY = 1.4;

// How long after the clip ends before the gentle auto-scroll nudge (ms).
const NUDGE_DELAY = 2500;

export function useCinematicHero({
  loopTail = 2.0,
  crossfade = 0.6,
  ambientLoop = true,
  enabled = true,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    // Two stacked layers of the SAME clip (browser serves the 2nd from cache).
    const layers = Array.from(root.querySelectorAll("[data-hero-video]"));
    if (layers.length < 2) return;

    const sceneEl = root.querySelector("[data-scene]");
    const copyEl = root.querySelector("[data-hero-copy]");

    // ── Copy intro (plays once, on load) ─────────────────────────────────────
    const intro = buildIntroTimeline(sceneEl);
    let introCall = null;

    // ── Seamless crossfade loop engine ───────────────────────────────────────
    // `front` is the visible layer; `back` is prepared just before the seam and
    // dissolved in. Each cycle: the outgoing layer plays its final `crossfade`
    // seconds while the incoming layer plays the same length from `loopStart`, so
    // both show near-identical drifting smoke through the dissolve.
    let front = layers[0];
    let back = layers[1];
    let swapping = false;
    let rafId = 0;
    let started = false;

    const play = (v) => {
      v.playbackRate = PLAYBACK_RATE;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    // ── Post-clip auto-nudge ─────────────────────────────────────────────────
    // ~2.5s after the clip settles, gently scroll the section down a touch to
    // hint there's more below. Fires ONCE, only if the visitor is still at the
    // top (hasn't scrolled), and any manual scroll cancels it — we never hijack
    // someone who's already reading or interacting.
    let nudged = false;
    let nudgeTimer = 0;
    const doNudge = () => {
      if (nudged || window.scrollY > 8) return;
      nudged = true;
      const targetY = Math.round(window.innerHeight * 0.4);
      if (window.__lenis && window.__lenis.scrollTo) {
        window.__lenis.scrollTo(targetY, { duration: 1.4 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    };
    const cancelNudge = () => {
      nudged = true;
      clearTimeout(nudgeTimer);
    };
    const scheduleNudge = () => {
      if (nudged) return;
      nudgeTimer = setTimeout(doNudge, NUDGE_DELAY);
    };
    window.addEventListener("wheel", cancelNudge, { passive: true });
    window.addEventListener("touchmove", cancelNudge, { passive: true });
    window.addEventListener("keydown", cancelNudge);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const v = front;
      const d = v.duration;
      if (swapping || !isFinite(d) || d <= 0) return;

      if (v.currentTime >= d - crossfade) {
        swapping = true;
        const loopStart = Math.max(0, d - loopTail);
        try { back.currentTime = loopStart; } catch (e) { /* metadata race */ }
        play(back);
        gsap.to(front, { autoAlpha: 0, duration: crossfade, ease: "none" });
        gsap.to(back, {
          autoAlpha: 1,
          duration: crossfade,
          ease: "none",
          onComplete: () => {
            const prev = front;
            front = back;
            back = prev;
            back.pause(); // hold the just-outgoing layer until it's next needed
            swapping = false;
          },
        });
      }
    };

    const begin = () => {
      if (started) return;
      started = true;
      gsap.set(front, { autoAlpha: 1 });
      gsap.set(back, { autoAlpha: 0 });
      try { front.currentTime = 0; } catch (e) { /* no-op */ }
      play(front);
      // When ambientLoop is off, the clip plays through ONCE and simply holds on
      // its final frame — no video loop, no replay. The sense of continued life
      // comes from the ever-present smoke haze rising over the frame (CSS), which
      // is what "no loop, but smoke still going up" asks for.
      if (ambientLoop) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Clip plays once and holds — schedule the nudge when it finishes.
        front.addEventListener("ended", scheduleNudge, { once: true });
      }
      introCall = gsap.delayedCall(COPY_DELAY, () => intro.play(0));
    };

    // Start as soon as the first layer has enough data (first frame decoded).
    const first = layers[0];
    if (first.readyState >= 2) begin();
    else {
      first.addEventListener("loadeddata", begin, { once: true });
      first.addEventListener("canplay", begin, { once: true });
    }

    // ── Scroll handoff — fade the copy as the hero leaves, no pin, no cut ─────
    let st = null;
    if (copyEl) {
      st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(copyEl, { autoAlpha: 1 - self.progress, y: -self.progress * 60 });
        },
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(nudgeTimer);
      window.removeEventListener("wheel", cancelNudge);
      window.removeEventListener("touchmove", cancelNudge);
      window.removeEventListener("keydown", cancelNudge);
      layers.forEach((v) => v.removeEventListener("ended", scheduleNudge));
      if (introCall) introCall.kill();
      intro.kill();
      if (st) st.kill();
      layers.forEach((v) => v.pause());
    };
  }, [enabled, loopTail, crossfade, ambientLoop]);

  return { rootRef };
}

export default useCinematicHero;
