// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — composition root.
//
// Chooses the hero presentation based on motion preference, wires smooth scroll,
// and hands off to the (placeholder) existing homepage. The minimal, non-invasive
// nav is preserved as-is per the brief — only the hero is the deliverable.
// ─────────────────────────────────────────────────────────────────────────────

import CinematicHero from "./hero/CinematicHero";
import StaticHero from "./hero/StaticHero";
import usePrefersReducedMotion from "./hero/usePrefersReducedMotion";
import useLenis from "./hero/useLenis";
import Homepage from "./sections/Homepage";

export default function App() {
  const reduced = usePrefersReducedMotion();

  // Smooth scroll only when motion is welcome.
  useLenis(!reduced);

  return (
    <>
      {/* Existing navigation — intentionally untouched, kept minimal & fixed. */}
      <header className="nav" aria-label="Primary">
        <a className="nav__brand" href="#top">
          Mr.&nbsp;<span className="nav__brand-accent">Tendernism</span>
        </a>
        <nav className="nav__links">
          <a href="#story">Story</a>
          <a href="#story">Menu</a>
          <a href="#story">Visit</a>
        </nav>
      </header>

      <div id="top">
        {reduced ? <StaticHero /> : <CinematicHero />}
        <Homepage />
      </div>
    </>
  );
}
