// ─────────────────────────────────────────────────────────────────────────────
// CinematicHero.jsx — the pinned, scroll-scrubbed documentary hero.
//
// Layer stack (bottom → top):
//   1. Stacked <video> layers (crossfaded by the timeline)
//   2. Grade + vignette overlay (readability, film contrast)
//   3. Fine grain (atmosphere)
//   4. Scene copy layers (one per scene, absolutely stacked)
//   5. Persistent thin frame + scroll cue
//
// All motion lives in useCinematicHero / heroTimeline. This file is markup only.
// ─────────────────────────────────────────────────────────────────────────────

import { scenes } from "./scenes";
import SceneCopy from "./SceneCopy";
import useCinematicHero from "./useCinematicHero";

export default function CinematicHero() {
  const { rootRef } = useCinematicHero({ sceneCount: scenes.length, enabled: true });

  return (
    <section
      ref={rootRef}
      className="hero"
      aria-label="Mr. Tendernism — cinematic introduction"
    >
      {/* The single element that stays pinned in the viewport while we scroll. */}
      <div className="hero__stage" data-hero-stage>
        {/* ── Video layers ─────────────────────────────────────────────── */}
        <div className="hero__videos">
          {scenes.map((scene, i) => (
            <video
              key={scene.id}
              className="hero__video"
              data-hero-video
              src={scene.video}
              muted
              // No loop: each clip plays once and freezes on its final frame.
              playsInline
              // First frame is preloaded in <head>; the rest are warmed on demand.
              preload={i === 0 ? "auto" : "none"}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* ── Continuity film layer ────────────────────────────────────────
            These sit ABOVE the videos and are CONSTANT across every chapter, so
            the atmosphere (colour, haze, grain) never resets between shots — the
            single biggest lever for "one continuous film" vs. five clips. */}
        <div className="hero__tone" aria-hidden="true" />   {/* unified warm grade */}
        <div className="hero__haze" aria-hidden="true" />   {/* smoke that never stops */}
        <div className="hero__grade" aria-hidden="true" />  {/* readability vignette */}
        <div className="hero__grain" aria-hidden="true" />

        {/* ── Scene copy layers ────────────────────────────────────────── */}
        <div className="hero__scenes">
          {scenes.map((scene, i) => (
            <div
              key={scene.id}
              className="hero__scene"
              data-scene={i}
              data-reveal={scene.revealAt}
            >
              <SceneCopy scene={scene} index={i} />
            </div>
          ))}
        </div>

        {/* ── Persistent film frame + scroll cue ───────────────────────── */}
        <div className="hero__frame" aria-hidden="true" />
        <div className="hero__cue" aria-hidden="true">
          <span className="hero__cue-label">Scroll</span>
          <span className="hero__cue-line" />
        </div>
      </div>
    </section>
  );
}
