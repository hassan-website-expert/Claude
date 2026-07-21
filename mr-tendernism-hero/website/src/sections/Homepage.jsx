// ─────────────────────────────────────────────────────────────────────────────
// Homepage.jsx — PLACEHOLDER for the existing Mr. Tendernism homepage.
//
// The brief is explicit: only the hero is being (re)built. This component is a
// deliberately minimal stand-in so the hero has something real to unpin INTO and
// transition toward. In production this whole component is replaced by the live
// site's existing navigation + sections — the hero above is the only deliverable.
// ─────────────────────────────────────────────────────────────────────────────

export default function Homepage() {
  return (
    <main id="story" className="home" aria-label="Mr. Tendernism (existing homepage — placeholder)">
      <div className="home__intro">
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
