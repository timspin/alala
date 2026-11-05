// ALALA — motion layer (GSAP + ScrollTrigger, vendored in ./vendor).
//
// Progressive enhancement: the page is complete without this file.
// - Header state and active-nav highlighting run for everyone.
// - Everything animated is skipped when prefers-reduced-motion is set or GSAP
//   failed to load (CSS then reveals the hero via a failsafe animation).
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Always on ---------- */

  function headerState() {
    const header = document.querySelector(".site-header");
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function activeNav() {
    const links = new Map(
      [...document.querySelectorAll(".nav a[href^='#']")].map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const link = links.get(e.target.id);
        if (!link) return;
        link.classList.toggle("is-active", e.isIntersecting);
        if (e.isIntersecting) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Motion ---------- */

  function intro() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__sky", { scale: 1.18, duration: 2.8, ease: "power2.out" }, 0)
      .from(".hero__ridge--far", { yPercent: 35, duration: 1.8 }, 0.1)
      .from(".hero__ridge--near", { yPercent: 55, duration: 1.6 }, 0.15)
      .from(".hero__kicker", { y: 16, opacity: 0, duration: 0.8 }, 0.3)
      .from(".hero__letter", {
        y: 300, opacity: 0, scale: 0.75,
        rotation: (i) => [-14, 10, -8, 12, -10][i % 5],
        duration: 1.15, ease: "back.out(1.9)", stagger: 0.09,
      }, 0.4)
      .from(".hero__tagline", { y: 20, opacity: 0, duration: 0.9 }, 1.0)
      .from(".platforms li", { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.1)
      .from(".hero__cue", { opacity: 0, duration: 1 }, 1.5);
  }

  function heroScroll() {
    const st = (end = "bottom top") => ({ trigger: ".hero", start: "top top", end, scrub: true });
    // Layers move at different speeds -> depth. Different properties from intro() to avoid conflicts.
    gsap.to(".hero__sky", { yPercent: 16, ease: "none", scrollTrigger: st() });
    gsap.to(".hero__ridge--far", { y: -40, ease: "none", scrollTrigger: st() });
    gsap.to(".hero__ridge--near", { y: -110, ease: "none", scrollTrigger: st() });
    gsap.to(".hero__inner", { y: 160, opacity: 0, ease: "none", scrollTrigger: st("75% top") });
  }

  function reveals() {
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    const figs = gsap.utils.toArray(".live-grid figure");
    if (figs.length) {
      gsap.set(figs, { y: 50, opacity: 0 });
      ScrollTrigger.batch(figs, {
        start: "top 88%", once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 }),
      });
    }
  }

  function chapters() {
    gsap.utils.toArray(".chapter").forEach((ch) => {
      const title = ch.querySelector(".mask > span");
      const num = ch.querySelector(".chapter__num");
      gsap.from(title, {
        yPercent: 110, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ch, start: "top 80%", once: true },
      });
      gsap.from(num, {
        x: -40, opacity: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ch, start: "top 80%", once: true },
      });
      gsap.to(num, {
        y: -50, ease: "none",
        scrollTrigger: { trigger: ch, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  function vinyl() {
    const disc = document.querySelector(".vinyl__disc");
    if (!disc) return;
    gsap.from(".vinyl", {
      xPercent: 35, opacity: 0, duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: ".listen__stage", start: "top 80%", once: true },
    });
    // The record "scratches" with the scroll.
    gsap.to(disc, {
      rotation: 720, ease: "none",
      scrollTrigger: { trigger: "#listen", start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  }

  // The Watch carousel (or its playlist fallback) is built after a fetch, so
  // it is animated when videos.js announces it with "alala:reel".
  function screen() {
    document.addEventListener("alala:reel", (e) => {
      if (e.detail && e.detail.fallback) {
        gsap.fromTo(".screen",
          { scale: 0.88, rotation: -2.5, transformOrigin: "50% 100%" },
          { scale: 1, rotation: 0, ease: "none",
            scrollTrigger: { trigger: ".screen", start: "top bottom", end: "top 35%", scrub: true } });
      } else {
        // Animate each card's contents, not the cards: scroll-snap measures
        // transformed boxes, so moving the snap targets would shift scrollLeft.
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".reel", start: "top 82%", once: true } });
        document.querySelectorAll(".reel__item").forEach((item, i) => {
          tl.from(item.children, {
            x: 120, opacity: 0, rotation: 1.5, transformOrigin: "0% 100%",
            duration: 1.1, ease: "power3.out", stagger: 0.06,
          }, i * 0.09);
        });
        gsap.from(".reel__bar", {
          opacity: 0, y: 20, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".reel", start: "top 75%", once: true },
        });
      }
      ScrollTrigger.refresh();
    });
  }

  function marquee() {
    const track = document.querySelector(".marquee__track");
    const anim = track && track.getAnimations && track.getAnimations()[0];
    if (!anim) return;
    const state = { rate: 1 };
    const setRate = () => { anim.playbackRate = state.rate; };
    ScrollTrigger.create({
      trigger: ".marquee", start: "top bottom", end: "bottom top",
      onUpdate(self) {
        const v = self.getVelocity();
        const target = gsap.utils.clamp(-6, 6, (v >= 0 ? 1 : -1) * (1 + Math.abs(v) / 350));
        gsap.killTweensOf(state);
        state.rate = target; setRate();
        gsap.to(state, { rate: target >= 0 ? 1 : -1, duration: 1.2, ease: "power2.out", onUpdate: setRate });
      },
    });
    gsap.from(".marquee", {
      rotation: -7, yPercent: 60, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "top 55%", scrub: true },
    });
  }

  // Word-by-word light-up of the manifesto; rebuilt whenever the language changes.
  let manifestoCtx;
  function manifesto() {
    if (manifestoCtx) manifestoCtx.revert();
    const paras = document.querySelectorAll("[data-split]");
    paras.forEach((p) => {
      const words = p.textContent.trim().split(/\s+/);
      p.textContent = "";
      words.forEach((w, i) => {
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = w;
        p.append(s);
        if (i < words.length - 1) p.append(" ");
      });
    });
    manifestoCtx = gsap.context(() => {
      paras.forEach((p) => {
        gsap.fromTo(p.querySelectorAll(".w"), { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 50%", scrub: true },
        });
      });
    });
  }

  function manifestoHello() {
    gsap.from(".manifesto__hello", {
      y: 50, opacity: 0, rotation: -2, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".manifesto", start: "top 85%", once: true },
    });
  }

  function footer() {
    gsap.from(".site-footer__mark", {
      yPercent: 45, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: true },
    });
  }

  function magnetic() {
    if (!finePointer) return;
    document.querySelectorAll(".btn").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    headerState();
    activeNav();

    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("motion-ready"); // lifts the CSS pre-hide; from() tweens take over in the same tick

    intro();
    heroScroll();
    reveals();
    chapters();
    vinyl();
    screen();
    marquee();
    manifesto();
    manifestoHello();
    footer();
    magnetic();

    document.addEventListener("alala:lang", () => { manifesto(); ScrollTrigger.refresh(); });
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  });
})();
