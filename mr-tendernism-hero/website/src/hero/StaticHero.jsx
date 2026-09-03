// ─────────────────────────────────────────────────────────────────────────────
// StaticHero.jsx — the prefers-reduced-motion presentation.
//
// No pinning, no scrubbing, no scale drift. Each chapter is a calm full-height
// panel that fades in gently as it enters the viewport. The approved footage is
// still shown, but only the panel in view decodes frames (IntersectionObserver),
// and a single quiet fade replaces all scroll-driven motion.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { scenes } from "./scenes";
import SceneCopy from "./SceneCopy";

export default function StaticHero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll("[data-static-scene]"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (video) {
              video.preload = "auto";
              const p = video.play();
              if (p && p.catch) p.catch(() => {});
            }
          } else if (video && !video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero hero--static"
      aria-label="Mr. Tendernism — cinematic introduction"
    >
      {scenes.map((scene, i) => (
        <div key={scene.id} className="static-scene" data-static-scene>
          <video
            className="hero__video"
            src={scene.video}
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "none"}
            aria-hidden="true"
          />
          <div className="hero__grade" aria-hidden="true" />
          <div className="static-scene__copy">
            <SceneCopy scene={scene} index={i} />
          </div>
        </div>
      ))}
    </section>
  );
}
