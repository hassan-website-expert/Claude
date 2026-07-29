// ─────────────────────────────────────────────────────────────────────────────
// Homepage.jsx — PLACEHOLDER for the existing Mr. Tendernism homepage.
//
// The brief is explicit: only the hero is being (re)built. This component is a
// deliberately minimal stand-in so the hero has something real to unpin INTO and
// transition toward. In production this whole component is replaced by the live
// site's existing navigation + sections — the hero above is the only deliverable.
//
// The intro copy EMERGES as it scrolls into view so the homepage reads as a
// continuation of the film rather than a hard start.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

export default function Homepage() {
  const introRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = introRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // No observer support — just show it.
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    // Safety net: never leave the copy stuck hidden if something goes wrong.
    const t = setTimeout(() => setVisible(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <main id="story" className="home" aria-label="Mr. Tendernism (existing homepage — placeholder)">
      <div
        ref={introRef}
        className={"home__intro" + (visible ? " is-visible" : "")}
      >
        <span className="home__kicker">The Story Continues</span>
        <p className="home__lead">
          Below the film, the existing Mr.&nbsp;Tendernism homepage begins — the menu,
          the pitmaster’s hours, the reservations. This block is a placeholder so the
          cinematic hero has somewhere to land.
        </p>
      </div>
    </main>
  );
}
