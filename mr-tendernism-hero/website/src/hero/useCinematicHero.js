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

export function useCinematicHero({ sceneCount, enabled = true }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector("[data-hero-stage]");
    const videoEls = Array.from(root.querySelectorAll("[data-hero-video]"));
    const sceneEls = Array.from({ length: sceneCount }, (_, i) => ({
      textItems: Array.from(
        root.querySelectorAll(`[data-scene="${i}"] [data-hero-text]`)
      ),
    }));

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
      const live = new Set([idx - 1, idx, idx + 1]);
      videoEls.forEach((v, i) => {
        if (live.has(i)) {
          ensureLoaded(i);
          // play() may reject if not yet ready; that's fine — it retries on scroll.
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    };

    let lastActive = -1;
    const onUpdate = (self) => {
      const idx = activeSceneIndex(self.progress, sceneCount);
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
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
      // ~460vh of travel — long and unhurried, one slow breath per scene.
      end: () => "+=" + window.innerHeight * (sceneCount - 0.05),
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
      videoEls.forEach((v) => v.pause());
    };
  }, [sceneCount, enabled]);

  return { rootRef };
}

export default useCinematicHero;
