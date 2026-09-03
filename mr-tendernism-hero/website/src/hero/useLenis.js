// ─────────────────────────────────────────────────────────────────────────────
// useLenis.js — smooth scroll, wired to GSAP's ticker and ScrollTrigger.
//
// Lenis drives the "everything is slow and intentional" feel. We route its RAF
// through GSAP's ticker (single loop, no double-RAF jank) and forward its scroll
// events to ScrollTrigger so pinning stays perfectly in sync.
//
// Skipped entirely under prefers-reduced-motion — native scrolling is honoured.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.25, // long, weighted glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Exposed so the hero controller can drive Lenis's own smooth scrollTo for
    // the post-clip auto-nudge (rather than a native scroll that would fight it).
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [enabled]);
}

export default useLenis;
