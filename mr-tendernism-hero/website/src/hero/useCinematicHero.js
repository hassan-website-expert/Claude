// ─────────────────────────────────────────────────────────────────────────────
// useCinematicHero.js — the scroll controller for the pinned hero.
//
// Responsibilities:
//   • Pin the full-viewport stage for the length of the piece (~460vh).
//   • Scrub the pure master timeline (from heroTimeline.js) with scroll.
//   • Decode responsibly: only the active video (and its crossfade neighbours)
//     ever plays — everything else is paused.
//   • Preload progressively: the first frame is already warm from <link preload>;
//     each subsequent clip is fetched just before it is needed.
//
// The hook owns NO markup. It reads the DOM by data-attributes under `rootRef`,
// which keeps the JSX declarative and this logic testable in isolation.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildMasterTimeline, activeSceneIndex } from "./heroTimeline";

gsap.registerPlugin(ScrollTrigger);

// Play the clips a touch faster than real-time so the hero feels snappier and
// the visitor reaches the homepage sooner (client asked to speed things up).
const PLAYBACK_RATE = 1.3;

// Because playback is real-time but the jump to the next scene is gated on
// scroll, a visitor who parks and lets a clip finish would otherwise be left
// staring at a frozen final frame until they scroll. Instead, when a clip ends
// while it is still the active scene, we loop ONLY its tail — the final stretch
// of rolling smoke after the lid-lift — so the frame keeps breathing. The seam
// lives inside homogeneous smoke, so the loop is essentially invisible, and the
// subject's action (his walk-in, the lift) is never repeated while idling.
const TAIL_LOOP = 1.2; // seconds of the clip's end to loop while parked

export function useCinematicHero({ sceneCount, enabled = true, onSceneChange }) {
  const rootRef = useRef(null);
  // Keep the latest callback in a ref so the scroll effect never rebuilds when it
  // changes identity between renders.
  const onSceneChangeRef = useRef(onSceneChange);
  onSceneChangeRef.current = onSceneChange;

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector("[data-hero-stage]");
    const videoEls = Array.from(root.querySelectorAll("[data-hero-video]"));
    const sceneEls = Array.from({ length: sceneCount }, (_, i) => {
      const sceneEl = root.querySelector(`[data-scene="${i}"]`);
      const rawReveal = sceneEl && sceneEl.getAttribute("data-reveal");
      return {
        textItems: Array.from(
          root.querySelectorAll(`[data-scene="${i}"] [data-hero-text]`)
        ),
        crownPaths: Array.from(
          root.querySelectorAll(`[data-scene="${i}"] [data-hero-crown] path`)
        ),
        revealAt: rawReveal != null && rawReveal !== "" ? parseFloat(rawReveal) : undefined,
      };
    });

    // ── Build the (paused) master motion timeline ────────────────────────────
    const master = buildMasterTimeline({ videoEls, sceneEls });

    // ── Video decode management ──────────────────────────────────────────────
    // Keep a 1-scene window live around the active scene so crossfades never
    // reveal a frozen frame. Everything else is paused to protect 60fps.
    const warmed = new Set([0]);
    const ensureLoaded = (i) => {
      const v = videoEls[i];
      if (!v || warmed.has(i)) return;
      warmed.add(i);
      v.preload = "auto";
      v.load();
    };

    const setActive = (idx) => {
      // Warm the immediate neighbours so their first frame is decoded before the
      // crossfade — but only the ACTIVE clip actually plays.
      ensureLoaded(idx - 1);
      ensureLoaded(idx);
      ensureLoaded(idx + 1);
      videoEls.forEach((v, i) => {
        if (i === idx) {
          // Restart the clip from its first frame every time this scene becomes
          // active — including when scrolling back UP into a scene we already
          // passed. Re-entering a moment then replays it (you feel the beat
          // again) instead of showing a frozen final frame. Playback is real-time,
          // not scrubbed, so the clip simply rolls once from the top on each entry.
          try {
            v.currentTime = 0;
          } catch (e) {
            /* seeking before metadata is ready is a no-op; it's already at 0 */
          }
          v.playbackRate = PLAYBACK_RATE;
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else if (!v.paused) {
          // Everything else holds its current frame (the last frame if it ended).
          v.pause();
        }
      });
    };

    let lastActive = -1;

    // ── Living hold (no frozen final frame) ──────────────────────────────────
    // When a clip finishes while its scene is still parked on screen, seek back
    // by TAIL_LOOP and replay — a seamless loop of the smoke-filled tail. If a
    // newer scene already owns the screen, let the clip rest (it's faded out).
    const endedHandlers = videoEls.map((v, i) => {
      const handler = () => {
        if (i !== lastActive) return;
        const d = v.duration;
        if (!isFinite(d) || d <= 0) return;
        try {
          v.currentTime = Math.max(0, d - TAIL_LOOP);
        } catch (e) {
          /* metadata not ready yet — bail; the next scene entry restarts cleanly */
        }
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };
      v.addEventListener("ended", handler);
      return handler;
    });

    const onUpdate = (self) => {
      const idx = activeSceneIndex(self.progress, sceneCount);
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
        if (onSceneChangeRef.current) onSceneChangeRef.current(idx);
      }
    };

    // Prime the opening frame immediately.
    ensureLoaded(0);
    setActive(0);

    // ── Pin + scrub ──────────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      animation: master,
      trigger: root,
      start: "top top",
      // Short travel (~0.5 viewport/scene). The hero is now just two authentic
      // beats and the client asked to cut the scrolling further, so the visitor
      // reaches the homepage quickly.
      end: () => "+=" + window.innerHeight * (sceneCount * 0.5),
      pin: stage,
      pinSpacing: true,
      scrub: 1, // a touch of catch-up smoothing on top of Lenis
      invalidateOnRefresh: true,
      onUpdate,
    });

    if (import.meta.env.DEV) {
      window.__heroTL = master;
      window.__heroST = st;
    }

    // Recompute once fonts settle to avoid pin math drifting.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      st.kill();
      master.kill();
      endedHandlers.forEach((h, i) => {
        if (videoEls[i]) videoEls[i].removeEventListener("ended", h);
      });
      videoEls.forEach((v) => v.pause());
    };
  }, [sceneCount, enabled]);

  return { rootRef };
}

export default useCinematicHero;
