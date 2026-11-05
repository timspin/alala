// ALALA — language switch (EN / RU / KK).
//
// Elements carry data-i18n="key" (text) and/or data-i18n-attr="attr:key;attr:key".
// English text is also written in index.html so the page reads without JS.
//
// NOTE: the `ru` and `kk` dictionaries are DRAFTS and need review by a
// native speaker before the page is shown outside the team.
(() => {
  "use strict";

  const STRINGS = {
    en: {
      "skip": "Skip to content",
      "lang": "Language",
      "nav.listen": "Listen",
      "nav.watch": "Watch",
      "nav.live": "Live",
      "nav.about": "About",
      "tagline": "Independent multi-genre music platform · Almaty",
      "cue": "Tune in",
      "listen.title": "Listen",
      "listen.lead": "Sets, podcasts and tracks from Almaty and beyond.",
      "listen.frame": "ALALA on SoundCloud",
      "listen.more": "More on SoundCloud",
      "watch.title": "Watch",
      "watch.lead": "ALALA PODCAST, live sessions and ALALA ON AIR.",
      "watch.frame": "Latest ALALA videos on YouTube",
      "watch.more": "More on YouTube",
      "watch.carousel": "Latest ALALA videos",
      "watch.play": "Play",
      "watch.prev": "Previous videos",
      "watch.next": "Next videos",
      "watch.open": "Open on YouTube",
      "live.title": "Live",
      "live.lead": "Vinyl sets and nights around the city.",
      "live.card": "Live sets, vinyl nights and community events — follow along on Instagram.",
      "live.more": "Follow @alalasound on Instagram",
      "about.title": "About",
      "about.p1": "Hello World! We are ALALA!",
      "about.p2": "ALALA is an independent multi-genre music platform that was born in Almaty, Kazakhstan.",
      "about.p3": "ALALA is a small group of enthusiasts that strive to share and collect some good music, appreciate wild dances, and believe in the unity of like-minded people.",
      "about.p4": "We are hoping to spread joyful vibes for every listener that is tuning to our platform.",
      "about.p5": "Tune in and Enjoy!",
      "about.sign": "Best, ALALA",
      "footer.contact": "Get in touch",
      "footer.copy": "© ALALA · Almaty, Kazakhstan",
    },

    // DRAFT — needs native-speaker review
    ru: {
      "skip": "Перейти к содержимому",
      "lang": "Язык",
      "nav.listen": "Слушать",
      "nav.watch": "Смотреть",
      "nav.live": "Вживую",
      "nav.about": "О нас",
      "tagline": "Независимая мультижанровая музыкальная платформа · Алматы",
      "cue": "Настраивайтесь",
      "listen.title": "Слушать",
      "listen.lead": "Сеты, подкасты и треки из Алматы и не только.",
      "listen.frame": "ALALA на SoundCloud",
      "listen.more": "Больше на SoundCloud",
      "watch.title": "Смотреть",
      "watch.lead": "ALALA PODCAST, live-сессии и ALALA ON AIR.",
      "watch.frame": "Последние видео ALALA на YouTube",
      "watch.more": "Больше на YouTube",
      "watch.carousel": "Последние видео ALALA",
      "watch.play": "Смотреть",
      "watch.prev": "Предыдущие видео",
      "watch.next": "Следующие видео",
      "watch.open": "Открыть на YouTube",
      "live.title": "Вживую",
      "live.lead": "Виниловые сеты и вечеринки по всему городу.",
      "live.card": "Живые сеты, виниловые вечера и события сообщества — следите за нами в Instagram.",
      "live.more": "Следите за @alalasound в Instagram",
      "about.title": "О нас",
      "about.p1": "Hello World! Мы — ALALA!",
      "about.p2": "ALALA — независимая мультижанровая музыкальная платформа, родившаяся в Алматы, Казахстан.",
      "about.p3": "ALALA — это небольшая группа энтузиастов, которые стремятся собирать хорошую музыку и делиться ею, ценят безудержные танцы и верят в единство единомышленников.",
      "about.p4": "Мы надеемся дарить радостное настроение каждому, кто настраивается на нашу волну.",
      "about.p5": "Подключайтесь и наслаждайтесь!",
      "about.sign": "С теплом, ALALA",
      "footer.contact": "Связаться с нами",
      "footer.copy": "© ALALA · Алматы, Казахстан",
    },

    // DRAFT — needs native-speaker review
    kk: {
      "skip": "Мазмұнға өту",
      "lang": "Тіл",
      "nav.listen": "Тыңдау",
      "nav.watch": "Көру",
      "nav.live": "Тікелей",
      "nav.about": "Біз туралы",
      "tagline": "Тәуелсіз көпжанрлы музыкалық платформа · Алматы",
      "cue": "Қосылыңыз",
      "listen.title": "Тыңдау",
      "listen.lead": "Алматыдан және одан тыс жерлерден сеттер, подкасттар мен тректер.",
      "listen.frame": "ALALA SoundCloud-та",
      "listen.more": "SoundCloud-та толығырақ",
      "watch.title": "Көру",
      "watch.lead": "ALALA PODCAST, live-сессиялар және ALALA ON AIR.",
      "watch.frame": "ALALA-ның YouTube-тағы соңғы бейнелері",
      "watch.more": "YouTube-та толығырақ",
      "watch.carousel": "ALALA-ның соңғы бейнелері",
      "watch.play": "Көру",
      "watch.prev": "Алдыңғы бейнелер",
      "watch.next": "Келесі бейнелер",
      "watch.open": "YouTube-та ашу",
      "live.title": "Тікелей",
      "live.lead": "Қала бойынша винил сеттер мен кештер.",
      "live.card": "Жанды сеттер, винил кештері және қауымдастық іс-шаралары — бізді Instagram-да бақылаңыз.",
      "live.more": "Instagram-да @alalasound парақшасына жазылыңыз",
      "about.title": "Біз туралы",
      "about.p1": "Hello World! Біз — ALALA!",
      "about.p2": "ALALA — Алматыда, Қазақстанда дүниеге келген тәуелсіз көпжанрлы музыкалық платформа.",
      "about.p3": "ALALA — жақсы музыканы жинап, бөлісуге ұмтылатын, еркін билерді бағалайтын және пікірлес адамдардың бірлігіне сенетін шағын энтузиастар тобы.",
      "about.p4": "Біз платформамызды тыңдайтын әрбір адамға қуанышты көңіл-күй сыйлауға үміттенеміз.",
      "about.p5": "Қосылыңыз және ләззат алыңыз!",
      "about.sign": "Ізгі тілекпен, ALALA",
      "footer.contact": "Бізбен байланыс",
      "footer.copy": "© ALALA · Алматы, Қазақстан",
    },
  };

  const LANGS = Object.keys(STRINGS);
  const STORAGE_KEY = "alala.lang";

  function storedLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function initialLang() {
    const saved = storedLang();
    if (LANGS.includes(saved)) return saved;
    for (const l of navigator.languages || [navigator.language || ""]) {
      const code = l.toLowerCase().slice(0, 2);
      if (code === "ru" || code === "kk") return code;
      if (code === "en") return "en";
    }
    return "en";
  }

  let current = "en";

  // Lets other scripts (videos.js) translate the elements they build.
  window.alalaI18n = {
    get lang() { return current; },
    t: (key) => (STRINGS[current] || STRINGS.en)[key] ?? STRINGS.en[key],
  };

  function apply(lang) {
    const dict = STRINGS[lang] || STRINGS.en;
    const t = (key) => dict[key] ?? STRINGS.en[key];
    current = STRINGS[lang] ? lang : "en";

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.dataset.i18n);
      if (v != null) el.textContent = v;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        const v = attr && key ? t(key) : null;
        if (v != null) el.setAttribute(attr, v);
      });
    });

    document.querySelectorAll(".lang [data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    document.dispatchEvent(new CustomEvent("alala:lang", { detail: { lang } }));
  }

  function setLang(lang) {
    apply(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang [data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
    apply(initialLang());
    document.documentElement.classList.add("js-ready");
  });
})();
