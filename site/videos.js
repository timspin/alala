// ALALA — "Watch" carousel.
//
// Builds a scrollable row of the channel's newest uploads from
// /api/videos.json (served by main.go from the YouTube RSS feed).
// A card shows only a thumbnail until it is clicked; then that card alone
// swaps in a youtube-nocookie player. If the list can't be loaded, the
// original playlist player from <template id="reel-fallback"> is used instead.
(() => {
  "use strict";

  const ENDPOINT = "api/videos.json";
  const i18n = () => window.alalaI18n || { lang: "en", t: (k) => k };

  // "ALALA PODCAST 048: Nurboogie" → { kicker: "ALALA PODCAST 048", name: "Nurboogie" }
  function splitTitle(title) {
    const m = /^(.{3,40}?):\s+(.+)$/.exec(title);
    return m ? { kicker: m[1], name: m[2] } : { kicker: "", name: title };
  }

  function formatDate(iso, lang) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    try {
      return new Intl.DateTimeFormat(lang === "kk" ? "kk-KZ" : lang, { day: "numeric", month: "short", year: "numeric" }).format(d);
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }

  const el = (tag, cls, attrs = {}) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  const icon = (id) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  };

  // Thumbnail: try the 1280px frame; older uploads without one fall back to 480px.
  function thumb(id) {
    const img = el("img", "reel__thumb", { alt: "", loading: "lazy", decoding: "async", width: "1280", height: "720" });
    const fallback = () => {
      if (img.dataset.fallback) return;
      img.dataset.fallback = "1";
      img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    };
    img.addEventListener("error", fallback);
    img.addEventListener("load", () => { if (img.naturalWidth <= 120) fallback(); }); // YouTube's grey placeholder
    img.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    return img;
  }

  function playButton(v) {
    const btn = el("button", "reel__play", { type: "button" });
    btn.append(thumb(v.id), el("span", "reel__shade"));
    const badge = el("span", "reel__icon");
    badge.append(icon("i-play"));
    btn.append(badge);
    btn.addEventListener("click", () => play(btn.closest(".reel__item"), v));
    return btn;
  }

  function card(v, i) {
    const { kicker, name } = splitTitle(v.title);
    const item = el("article", "reel__item", { role: "listitem" });
    item.dataset.id = v.id;

    const media = el("div", "reel__media");
    media.append(playButton(v));

    const meta = el("div", "reel__meta");
    const top = el("p", "reel__kicker");
    top.textContent = kicker || "ALALA";
    if (i === 0) top.append(el("span", "reel__new"));

    const h = el("h3", "reel__title");
    const a = el("a", "", { href: `https://www.youtube.com/watch?v=${v.id}`, target: "_blank", rel: "noopener noreferrer" });
    a.textContent = name;
    h.append(a);

    const time = el("time", "reel__date", { datetime: v.published });
    meta.append(top, h, time);
    item.append(media, meta);
    return item;
  }

  let playing = null;

  function play(item, v) {
    if (playing && playing !== item) stop(playing);
    const media = item.querySelector(".reel__media");
    const frame = el("iframe", "", {
      src: `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`,
      title: v.title,
      allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
      referrerpolicy: "strict-origin-when-cross-origin",
    });
    media.replaceChildren(frame);
    item.classList.add("is-playing");
    playing = item;
    frame.focus();
  }

  function stop(item) {
    const v = item._video;
    item.querySelector(".reel__media").replaceChildren(playButton(v));
    item.classList.remove("is-playing");
    relabel(item);
  }

  // Labels and dates that depend on the current language.
  function relabel(item) {
    const { t, lang } = i18n();
    const v = item._video;
    const btn = item.querySelector(".reel__play");
    if (btn) btn.setAttribute("aria-label", `${t("watch.play")}: ${v.title}`);
    const a = item.querySelector(".reel__title a");
    a.setAttribute("aria-label", `${v.title} — ${t("watch.open")}`);
    item.querySelector(".reel__date").textContent = formatDate(v.published, lang);
  }

  function controls(reel, track) {
    const prev = reel.querySelector("[data-reel-prev]");
    const next = reel.querySelector("[data-reel-next]");
    const count = reel.querySelector("[data-reel-count]");
    const bar = reel.querySelector("[data-reel-progress]");
    const items = [...track.children];
    const pad = (n) => String(n).padStart(2, "0");

    const step = () => {
      const a = items[0], b = items[1];
      return b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
    };
    const current = () => Math.min(items.length - 1, Math.round(track.scrollLeft / step()));

    // While a smooth scroll is still running, scrollLeft lags behind, so
    // repeated clicks step from the pending target rather than the live position.
    let target = null, settle = 0;
    const go = (dir) => {
      const max = track.scrollWidth - track.clientWidth;
      const from = target ?? current();
      target = Math.max(0, Math.min(items.length - 1, from + dir));
      const left = Math.min(max, items[target].offsetLeft - items[0].offsetLeft);
      if (left >= max) target = Math.min(target, Math.round(max / step()));
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      clearTimeout(settle);
      settle = setTimeout(() => { target = null; }, 700);
    };
    track.addEventListener("scrollend", () => { target = null; });

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("keydown", (e) => {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      const x = track.scrollLeft;
      const index = x >= max - 2 ? items.length - 1 : current();
      prev.disabled = x <= 2;
      next.disabled = x >= max - 2;
      count.textContent = `${pad(index + 1)} / ${pad(items.length)}`;
      bar.style.transform = `scaleX(${max > 0 ? Math.max(0.04, x / max) : 1})`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    track.addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
  }

  function fallback(reel) {
    const tpl = document.getElementById("reel-fallback");
    if (!tpl) return;
    const node = tpl.content.cloneNode(true);
    const frame = node.querySelector("iframe");
    if (frame) frame.title = i18n().t("watch.frame");
    reel.replaceWith(node);
    document.dispatchEvent(new CustomEvent("alala:reel", { detail: { fallback: true } }));
  }

  async function init() {
    const reel = document.querySelector("[data-reel]");
    if (!reel) return;
    const track = reel.querySelector("[data-reel-track]");

    let videos;
    try {
      const res = await fetch(ENDPOINT, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.status);
      videos = (await res.json()).filter((v) => v && v.id && v.title);
      if (!videos.length) throw new Error("empty");
    } catch {
      fallback(reel);
      return;
    }

    videos.forEach((v, i) => {
      const item = card(v, i);
      item._video = v;
      relabel(item);
      track.append(item);
    });
    reel.hidden = false;
    controls(reel, track);

    document.addEventListener("alala:lang", () => track.querySelectorAll(".reel__item").forEach(relabel));
    document.dispatchEvent(new CustomEvent("alala:reel", { detail: { fallback: false } }));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
