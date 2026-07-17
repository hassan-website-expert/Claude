import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const isTouch = () =>
  window.matchMedia("(hover: none)").matches || window.innerWidth <= 768;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupLenis() {
  const lenis = new Lenis({
    duration: 1.12,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function setupVideoScrub(bgVideo) {
  let lastVideoT = -1;

  const updateVideo = () => {
    if (!bgVideo.duration) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, scrollTop / Math.max(1, maxScroll))
    );
    const t = progress * (bgVideo.duration - 0.05);

    if (Math.abs(t - lastVideoT) > 0.008) {
      bgVideo.currentTime = t;
      lastVideoT = t;
    }
  };

  bgVideo.pause();
  bgVideo.currentTime = 0;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: updateVideo,
  });

  bgVideo.addEventListener("loadedmetadata", updateVideo);
}

function setupIngredientReveal() {
  const section = document.querySelector("#split");
  if (!section) return;
  const pin = section.querySelector(".split__pin");
  const words = [...section.querySelectorAll(".split-word")];
  const labels = [...section.querySelectorAll(".ingredient-label")];

  function render(p) {
    words.forEach((word, i) => {
      const start = (i / words.length) * 0.62;
      const o = gsap.utils.clamp(0, 1, (p - start) / 0.14);
      word.style.opacity = 0.12 + o * 0.88;
      word.style.filter = `blur(${(1 - o) * 8}px)`;
      word.style.transform = `translateY(${(1 - o) * 18}px)`;
    });

    labels.forEach((label, i) => {
      const start = 0.28 + i * 0.08;
      const o = gsap.utils.clamp(0, 1, (p - start) / 0.12);
      label.style.opacity = o;
      label.style.transform = `translateY(${(1 - o) * 14}px)`;
    });
  }

  render(0);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => "+=" + innerHeight * 1.8,
    pin,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => render(self.progress),
  });
}

function setupReveals() {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const children = el.hasAttribute("data-reveal-stagger")
      ? [...el.children]
      : [el];
    gsap.fromTo(
      children,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      }
    );
  });
}

function setupProgressDots() {
  const bar = document.querySelector(".scroll-progress__fill");
  const pct = document.querySelector(".scroll-progress__pct");
  if (!bar) return;
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      bar.style.transform = `scaleY(${self.progress})`;
      if (pct) pct.textContent = String(Math.round(self.progress * 100)).padStart(2, "0");
    },
  });
}

export function initMotion() {
  const touch = isTouch();
  const reduced = prefersReducedMotion();
  const bgVideo = document.querySelector("#bgv");

  const lenis = reduced ? null : setupLenis();

  if (bgVideo && !touch && !reduced) {
    setupVideoScrub(bgVideo);
  }

  if (!touch && !reduced) {
    setupIngredientReveal();
  }

  if (!reduced) {
    setupReveals();
  }
  setupProgressDots();

  if (import.meta.env.DEV) {
    window.__lenis = lenis;
    window.__ST = ScrollTrigger;
    window.__bgv = bgVideo;
  }

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    lenis?.destroy();
  };
}
