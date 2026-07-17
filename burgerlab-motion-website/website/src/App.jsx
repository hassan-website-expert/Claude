import { useEffect } from "react";
import { initMotion } from "./motion.js";
import { burgers, ingredients } from "./data/burgers.js";

const splitLine1 = "Built layer by layer.".split(" ");
const splitLine2 = "Every ingredient earns its place.".split(" ");

function Star() {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
      <path
        d="M10 1.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L10 14.2 4.9 17l1.1-5.6L1.8 7.5l5.7-.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function App() {
  useEffect(() => initMotion(), []);

  return (
    <>
      <video
        id="bgv"
        className="bg-video"
        muted
        playsInline
        preload="auto"
        poster="img/hero-burger.png"
      >
        <source src="bg.mp4" type="video/mp4" />
        <source src="bg.webm" type="video/webm" />
      </video>
      <div className="mobile-poster" aria-hidden="true" />
      <div className="bg-tint" aria-hidden="true" />
      <div className="ambient-dots" aria-hidden="true">
        <i /> <i /> <i /> <i /> <i />
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress__track">
          <span className="scroll-progress__fill" />
        </span>
        <span className="scroll-progress__pct mono">00</span>
      </div>

      <div className="page">
        <nav className="nav">
          <a className="nav__logo" href="#home">
            Burger<span>Lab</span>
          </a>
          <div className="nav__links">
            <a href="#split">The Reveal</a>
            <a href="#ingredients">Ingredients</a>
            <a href="#catalog">Menu</a>
            <a href="#experience">Experience</a>
          </div>
          <a className="btn btn--primary btn--sm" href="#cta">
            Order now
          </a>
        </nav>

        {/* 1 — HERO */}
        <header className="hero" id="home">
          <div className="hero__inner" data-reveal data-reveal-stagger>
            <p className="tag mono">
              <i className="dot" /> The Lab Burger — Nº 001
            </p>
            <h1 className="hero__title">
              Scroll to open
              <br />
              the burger.
            </h1>
            <p className="hero__sub">
              BurgerLab is a dark-kitchen studio for people who take flavor
              seriously. One flagship burger, filmed like a product launch —
              and your scroll is the director.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#cta">
                Order The Lab Burger
              </a>
              <a className="btn btn--ghost" href="#split">
                Watch the reveal
              </a>
            </div>
            <ul className="chips mono">
              <li>Crafted fresh</li>
              <li>30 min delivery</li>
              <li>
                <Star /> 4.9 rating
              </li>
            </ul>
          </div>
          <div className="hero__hint mono" aria-hidden="true">
            <span className="hero__hint-line" />
            scroll
          </div>
        </header>

        {/* 2 — SPLIT (pinned reveal) */}
        <section className="split" id="split">
          <div className="split__pin">
            <div className="split__copy">
              <p className="tag mono">
                <i className="dot" /> The reveal
              </p>
              <h2 className="impact__line">
                {splitLine1.map((w, i) => (
                  <span className="split-word" key={`a${i}`}>
                    {w}&nbsp;
                  </span>
                ))}
                <br />
                {splitLine2.map((w, i) => (
                  <span className="split-word split-word--muted" key={`b${i}`}>
                    {w}&nbsp;
                  </span>
                ))}
              </h2>
            </div>
            <div className="split__labels" aria-hidden="true">
              <span className="ingredient-label mono" style={{ top: "18%", left: "12%" }}>
                brioche crown
              </span>
              <span className="ingredient-label mono" style={{ top: "34%", right: "14%" }}>
                aged cheddar
              </span>
              <span className="ingredient-label mono" style={{ top: "52%", left: "10%" }}>
                flame-grilled patty
              </span>
              <span className="ingredient-label mono" style={{ top: "66%", right: "12%" }}>
                lab sauce
              </span>
              <span className="ingredient-label mono" style={{ top: "82%", left: "16%" }}>
                toasted base
              </span>
            </div>
          </div>
        </section>

        {/* 3 — INGREDIENTS */}
        <section className="section ingredients" id="ingredients">
          <div className="section__head" data-reveal>
            <p className="tag mono">
              <i className="dot" /> Inside the stack
            </p>
            <h2 className="section-title">Every layer, engineered.</h2>
          </div>
          <div className="ingredients__grid" data-reveal data-reveal-stagger>
            {ingredients.map((it) => (
              <article className="panel ingredient-card" key={it.label}>
                <span className="ingredient-card__num mono">{it.label}</span>
                <h3 className="spec__value">{it.name}</h3>
                <p className="muted">{it.desc}</p>
              </article>
            ))}
            <figure className="panel ingredient-card ingredient-card--photo">
              <img
                src="img/ingredients-detail.png"
                alt="Macro detail of The Lab Burger ingredients"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        {/* 4 — CATALOG */}
        <section className="section catalog" id="catalog">
          <div className="section__head" data-reveal>
            <p className="tag mono">
              <i className="dot" /> The menu
            </p>
            <h2 className="section-title">Beyond the flagship.</h2>
            <p className="muted section__lead">
              Four more experiments that made it out of the lab.
            </p>
          </div>
          <div className="catalog-grid" data-reveal data-reveal-stagger>
            {burgers.map((b) => (
              <article className="panel burger-card" key={b.name}>
                <div className="burger-card__media">
                  <img src={b.image} alt={`${b.name} burger`} loading="lazy" />
                </div>
                <div className="burger-card__body">
                  <header className="burger-card__row">
                    <h3 className="burger-card__name">{b.name}</h3>
                    <span className="burger-card__price mono">{b.price}</span>
                  </header>
                  <p className="muted">{b.desc}</p>
                  <footer className="burger-card__row burger-card__meta mono">
                    <span className="rating">
                      <Star /> {b.rating}
                    </span>
                    <span>{b.time}</span>
                    <button className="btn btn--ghost btn--sm" type="button">
                      Add
                    </button>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5 — EXPERIENCE */}
        <section className="section experience" id="experience">
          <div className="experience__grid">
            <div className="experience__copy" data-reveal>
              <p className="tag mono">
                <i className="dot" /> The experience
              </p>
              <h2 className="section-title">
                Designed for late-night cravings and premium flavor.
              </h2>
              <p className="muted">
                Order from the couch, track the grill in real time, and meet
                your burger at the door — still steaming. No queues, no
                fluorescent lighting, no compromises.
              </p>
              <ul className="chips mono">
                <li>Live grill tracking</li>
                <li>Night kitchen · until 3am</li>
                <li>Contactless drop-off</li>
              </ul>
            </div>
            <aside className="panel order-card" data-reveal>
              <header className="order-card__head">
                <span className="mono muted">Order #048</span>
                <span className="order-card__status mono">
                  <i className="dot dot--green" /> on the grill
                </span>
              </header>
              <div className="order-card__item">
                <img src="img/hero-burger.png" alt="" aria-hidden="true" />
                <div>
                  <p className="spec__value">The Lab Burger</p>
                  <p className="muted mono">x1 · medium · extra sauce</p>
                </div>
                <span className="mono">$15.90</span>
              </div>
              <div className="order-card__item">
                <img src="img/catalog-classic-stack.png" alt="" aria-hidden="true" />
                <div>
                  <p className="spec__value">Classic Stack</p>
                  <p className="muted mono">x1 · well done</p>
                </div>
                <span className="mono">$12.90</span>
              </div>
              <footer className="order-card__foot">
                <span className="muted mono">est. 24 min</span>
                <span className="spec__value mono">$28.80</span>
              </footer>
            </aside>
          </div>
        </section>

        {/* 6 — CTA */}
        <section className="section cta" id="cta">
          <div className="panel cta__panel" data-reveal>
            <p className="tag mono">
              <i className="dot" /> Tonight&apos;s the night
            </p>
            <h2 className="cta__title">Order The Lab Burger.</h2>
            <p className="muted">
              Flagship burger, lab fries and smoked lemonade —{" "}
              <span className="cta__price mono">$19.90</span> the bundle.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#home">
                Order The Lab Burger
              </a>
              <a className="btn btn--ghost" href="#catalog">
                View full menu
              </a>
            </div>
          </div>
        </section>

        {/* 7 — FOOTER */}
        <footer className="footer">
          <p className="footer__brand">
            Burger<span>Lab</span>
          </p>
          <p className="muted mono footer__note">
            A fictional brand. Built with scroll, steam and amber light.
          </p>
        </footer>
      </div>
    </>
  );
}
