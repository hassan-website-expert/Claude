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
      {/* Header mirrors officialmrtendernism.com/homepage-v4 so the hero reads as
          one site: logo lockup, HOME/MOMENTS/ABOUT, cart, ghost + gold buttons. */}
      <header className="nav" aria-label="Primary">
        <div className="nav__bar">
          <a className="nav__brand" href="#top" aria-label="Mr. Tendernism — home">
            <svg className="nav__crown" viewBox="0 0 120 74" aria-hidden="true">
              <path d="M8 66 L20 22 L42 50 L60 12 L78 50 L100 22 L112 66 Z" />
            </svg>
            <span className="nav__brand-name">Mr. Tendernism</span>
            <span className="nav__brand-tag">Good Energy · Real Moments · Good Food</span>
          </a>

          <nav className="nav__links" aria-label="Primary menu">
            <a href="#top">Home</a>
            <a href="#story">Moments</a>
            <a href="#story">About</a>
          </nav>

          <div className="nav__actions">
            <button className="nav__cart" type="button" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <a className="btn btn--ghost" href="#story">Merch Shop</a>
            <a className="btn btn--gold" href="#story">Book Mr. Tendernism</a>
          </div>
        </div>
      </header>

      <div id="top">
        {reduced ? <StaticHero /> : <CinematicHero />}
        <Homepage />
      </div>
    </>
  );
}
