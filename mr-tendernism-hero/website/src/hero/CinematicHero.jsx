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

import { useCallback, useRef, useState } from "react";
import { scenes } from "./scenes";
import SceneCopy from "./SceneCopy";
import useCinematicHero from "./useCinematicHero";

// The scene that carries his spoken line.
const VOICE_SCENE = scenes.findIndex((s) => s.audio);

export default function CinematicHero() {
  const voiceRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);
  const activeIdxRef = useRef(0);

  const playVoice = () => {
    const a = voiceRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.muted = false;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  };

  // Called by the scroll controller whenever the active scene changes.
  const handleSceneChange = useCallback((idx) => {
    activeIdxRef.current = idx;
    const a = voiceRef.current;
    if (!a) return;
    if (idx === VOICE_SCENE) {
      if (soundOnRef.current) playVoice();
    } else if (!a.paused) {
      // Leaving his beat — stop the line so it never bleeds into another shot.
      a.pause();
    }
  }, []);

  const { rootRef } = useCinematicHero({
    sceneCount: scenes.length,
    enabled: true,
    onSceneChange: handleSceneChange,
  });

  const toggleSound = () => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    if (!next) {
      if (voiceRef.current) voiceRef.current.pause();
      return;
    }
    // Turning sound on IS the user gesture that unlocks audio. If his beat is
    // already on screen, start the line now; otherwise it plays when reached.
    if (activeIdxRef.current === VOICE_SCENE) playVoice();
  };

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

        {/* ── Sound toggle — his voice on the philosophy beat ──────────────
            Off by default (browsers block autoplay with sound); one click
            unlocks and, on his beat, plays the spoken line. */}
        <button
          type="button"
          className={"hero__sound" + (soundOn ? " is-on" : "")}
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        >
          <span className="hero__sound-bars" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="hero__sound-label">{soundOn ? "Sound On" : "Sound"}</span>
        </button>

        {/* Preloaded so his line is ready the instant sound is enabled. */}
        <audio
          ref={voiceRef}
          data-hero-voice
          src={scenes[VOICE_SCENE] && scenes[VOICE_SCENE].audio}
          preload="auto"
          playsInline
        />
      </div>
    </section>
  );
}
