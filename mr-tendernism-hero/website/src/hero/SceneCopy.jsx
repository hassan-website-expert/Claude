// ─────────────────────────────────────────────────────────────────────────────
// SceneCopy.jsx — shared, consistent typography for every scene.
//
// Rendered identically by both the animated and reduced-motion hero paths, so
// the words, headings, and reading order stay crawlable and stable. Elements
// carry [data-hero-text] so the GSAP timeline can find and animate them; in the
// static path they simply render visible.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render a scene's editorial copy.
 * The visual heading level is chosen per scene, but only ONE h1 exists on the
 * page (the finale wordmark) to keep the document outline clean for SEO.
 */
export default function SceneCopy({ scene, index }) {
  const isFinale = scene.variant === "finale";
  const isName = scene.variant === "name";
  const Heading = isFinale ? "h1" : "h2";

  return (
    <div className={`scene-copy scene-copy--${scene.align}`}>
      {scene.eyebrow && (
        <span className="scene-copy__eyebrow" data-hero-text>
          {scene.eyebrow}
        </span>
      )}

      <Heading
        className={
          "scene-copy__title" +
          (isName ? " scene-copy__title--name" : "") +
          (isFinale ? " scene-copy__title--finale" : "")
        }
      >
        {scene.lines.map((line, i) =>
          line === "" ? (
            // An intentional beat of silence between phrases.
            <span key={i} className="scene-copy__gap" aria-hidden="true" data-hero-text />
          ) : (
            <span key={i} className="scene-copy__line" data-hero-text>
              {line}
            </span>
          )
        )}
      </Heading>

      {scene.subtitle && (
        <p className="scene-copy__subtitle" data-hero-text>
          {scene.subtitle}
        </p>
      )}

      {scene.cta && (
        <div className="scene-copy__cta-wrap" data-hero-text>
          <a className="scene-copy__cta" href="#story">
            {scene.cta}
            <span className="scene-copy__cta-line" aria-hidden="true" />
          </a>
        </div>
      )}

      <span className="scene-copy__chapter" aria-hidden="true" data-hero-text>
        {scene.chapter} · {scene.label}
      </span>
    </div>
  );
}
