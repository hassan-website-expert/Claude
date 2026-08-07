// ─────────────────────────────────────────────────────────────────────────────
// CinematicHero.jsx — the single-clip documentary hero.
//
// Layer stack (bottom → top):
//   1. TWO stacked <video> layers of the SAME clip — the seamless crossfade loop
//      (see useCinematicHero): the action plays once, then the smoke-filled tail
//      loops forever with an invisible dissolve so the hero never freezes.
//   2. Unified tone / haze / grade / grain overlays (constant film atmosphere)
//   3. One scene copy block (wordmark + tagline + CTA) animating in on load
//   4. Persistent thin frame + scroll cue + sound toggle
//
// All motion lives in useCinematicHero / heroTimeline. This file is markup +
// the ambient-audio controller only.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { scenes } from "./scenes";
import SceneCopy from "./SceneCopy";
import useCinematicHero from "./useCinematicHero";

// The single hero scene (one continuous cookout moment).
const HERO = scenes[0];

// Continuous ambient bed (fire crackle + evening room tone) that plays UNDER the
// hero and never cuts. Points at the licensed loop in public/audio/; the toggle
// self-hides until the file is actually playable, so there is never a dead
// control on the page. (The filename has spaces, hence the %20 encoding.)
const AMBIENT_SRC =
  "./audio/28102%20Countryside%20evening%20campfire%20ambience%20loop-full.mp3";
const AMBIENT_VOLUME = 0.5;

// Pick the portrait clip on phones and the landscape clip on everything else.
// Decided ONCE at mount (not reactive) so we never swap src mid-session, which
// would reload the video and cause a flash / layout shift.
function pickInitialMobile() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

export default function CinematicHero() {
  const ambientRef = useRef(null);
  const fadeRef = useRef(0);
  const [soundOn, setSoundOn] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  // Frozen for the life of the component — the correct clip is chosen before the
  // first paint, so the right aspect ratio loads with no swap later.
  const [isMobile] = useState(pickInitialMobile);

  const { rootRef } = useCinematicHero({
    loopTail: HERO.loopTail,
    crossfade: HERO.crossfade,
    enabled: true,
  });

  const src = isMobile && HERO.videoMobile ? HERO.videoMobile : HERO.video;

  // Gentle fade so the bed swells in / eases out rather than snapping.
  const fadeTo = (target, onDone) => {
    const a = ambientRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const step = () => {
      const delta = target - a.volume;
      if (Math.abs(delta) < 0.02) {
        a.volume = target;
        if (onDone) onDone();
        return;
      }
      a.volume = Math.max(0, Math.min(1, a.volume + delta * 0.08));
      fadeRef.current = requestAnimationFrame(step);
    };
    step();
  };

  const toggleSound = () => {
    const a = ambientRef.current;
    if (!a) return;
    if (soundOn) {
      setSoundOn(false);
      fadeTo(0, () => a.pause());
      return;
    }
    // The click IS the gesture that unlocks audio — start muted-low and swell.
    setSoundOn(true);
    a.volume = 0;
    const p = a.play();
    if (p && p.catch) p.catch(() => setSoundOn(false));
    fadeTo(AMBIENT_VOLUME);
  };

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), []);

  return (
    <section
      ref={rootRef}
      className="hero"
      aria-label="Mr. Tendernism — cinematic introduction"
    >
      <div className="hero__stage" data-hero-stage>
        {/* ── Video layers — two copies of ONE clip for the seamless loop ─── */}
        <div className="hero__videos">
          {[0, 1].map((i) => (
            <video
              key={i}
              className="hero__video"
              data-hero-video
              src={src}
              muted
              playsInline
              // Both layers must be decode-ready for the crossfade loop; the
              // first frame is also preloaded in <head> for a fast LCP.
              preload="auto"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* ── Continuity film layer (constant colour, haze, grain) ───────── */}
        <div className="hero__tone" aria-hidden="true" />   {/* unified warm grade */}
        <div className="hero__haze" aria-hidden="true" />   {/* ever-present smoke drift */}
        <div className="hero__grade" aria-hidden="true" />  {/* readability vignette */}
        <div className="hero__grain" aria-hidden="true" />

        {/* ── Single scene copy — animates in on load, fades out on scroll ─ */}
        <div className="hero__scenes">
          <div className="hero__scene" data-scene data-hero-copy>
            <SceneCopy scene={HERO} index={0} />
          </div>
        </div>

        {/* ── Persistent film frame + scroll cue ───────────────────────── */}
        <div className="hero__frame" aria-hidden="true" />
        <div className="hero__cue" aria-hidden="true">
          <span className="hero__cue-label">Scroll</span>
          <span className="hero__cue-line" />
        </div>

        {/* ── Ambient sound toggle ─────────────────────────────────────────
            Off by default (browsers block autoplay with sound). One click
            unlocks and swells the fire+room-tone bed. Only rendered once the
            audio file is actually playable, so a missing file never leaves a
            dead control on the page. */}
        {audioReady && (
          <button
            type="button"
            className={"hero__sound" + (soundOn ? " is-on" : "")}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}
          >
            <span className="hero__sound-bars" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="hero__sound-label">{soundOn ? "Sound On" : "Sound"}</span>
          </button>
        )}

        <audio
          ref={ambientRef}
          data-hero-ambient
          src={AMBIENT_SRC}
          loop
          preload="auto"
          onCanPlayThrough={() => setAudioReady(true)}
          playsInline
        />
      </div>
    </section>
  );
}
