## Context

The repository (`github.com/timspin/alala`) is empty apart from OpenSpec. ALALA's presence today:

| Platform   | Handle / ID                                   | Used for                          |
|------------|-----------------------------------------------|-----------------------------------|
| YouTube    | `@alalasound`, channel `UCxpVTc8xnPcyENZ7KaYG4GQ` | ALALA PODCAST videos, ON AIR      |
| SoundCloud | `alalalasound`, user id `951407119`           | sets, podcasts, tracks (140)      |
| Instagram  | `@alalasound`                                 | live vinyl sets, events           |

Brand material found on the channels:

- **Wordmark**: custom soft, bulbous "ALALA" lettering, cobalt on white. Highest-resolution source: SoundCloud original avatar, 2362×2362 px — `https://i1.sndcdn.com/avatars-b5CCcIlEEJVFkUXG-nTU2XA-original.jpg`.
- **Banner**: grainy film photograph of cumulus clouds over the Tien Shan ridge. Source at 2560 px wide — `https://yt3.googleusercontent.com/n4f0S2GqMORAOXDHULsIJhgPj6wJi-378XLt2ycXdkLDH7Cj8XfrBfDknks7YatmgvNprQV_=w2560`.
- **Bio** (identical on YouTube and SoundCloud): "Hello World! We are ALALA! ALALA is an independent multi-genre music platform that was born in Almaty, Kazakhstan. ALALA is a small group of enthusiasts that strive to share and collect some good music, appreciate wild dances, and believe in the unity of like-minded people. We are hoping to spread joyful vibes for every listener that is tuning to our platform. Tune in and Enjoy! Best, ALALA"
- **Contact**: `alalalasound@gmail.com`.

Constraints: run by a small volunteer team (near-zero maintenance), viewed locally only for now, no domain.

## Goals / Non-Goals

**Goals:**
- One self-contained static page that never goes stale, because the "latest" content comes from live embeds.
- Faithful to the existing ALALA look (banner photo + cobalt wordmark), not a new identity.
- Trilingual (RU / KZ / EN) with no build step.
- Viewable locally with a single command.

**Non-Goals:**
- Artist roster, podcast archive, per-episode pages.
- Build-time content generation from RSS (possible future "option B").
- Custom domain, analytics, cookie banners. (Deployment was added later; see D11.)
- Live Instagram feed (needs the Graph API and expiring tokens).

## Decisions

### D1. Plain static HTML/CSS/JS, no framework or bundler
A single `site/index.html` + `site/styles.css` + `site/main.js`. 
- *Why*: one page, a few sections, a language switch — a framework adds tooling the team would have to maintain. 
- *Alternatives*: Astro/Hugo (good for option B later, overkill now); a Go `html/template` generator (that is option B, deferred).

### D2. Content freshness via platform embeds
- **SoundCloud**: user widget, visual mode 
  `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/951407119&visual=true&show_artwork=true&auto_play=false`
- **YouTube**: uploads playlist (channel id with `UC` → `UU`), via the privacy-enhanced domain 
  `https://www.youtube-nocookie.com/embed/videoseries?list=UUxpVTc8xnPcyENZ7KaYG4GQ`
- **YouTube carousel (revised during implementation, replaces the playlist player):** the Go server reads the channel RSS feed (15 newest uploads, no API key; browsers can't fetch it directly because of CORS) and serves `/api/videos.json`, cached 30 min and served stale if a refresh fails. `site/videos.js` renders one card per video: a thumbnail (`i.ytimg.com`, `maxresdefault` → `hqdefault` fallback) behind a play button, the title split into kicker ("ALALA PODCAST 048") and name, and the date in the active language. Clicking a card swaps in a `youtube-nocookie.com` player for that card only, so no YouTube player loads until someone asks for one. Native `scroll-snap` scrolling with prev/next buttons, arrow keys, a counter and a progress bar; no carousel library. If the list fails to load (or JS is off) the original playlist iframe is shown instead. *Trade-off:* the page now needs the Go server for the carousel; a pure static host would get the playlist fallback, and a later deploy would need a build-time `videos.json` (option B) or a small function.
- Both iframes use `loading="lazy"`, a descriptive `title`, and sit in a fixed aspect-ratio wrapper so the layout doesn't jump.
- *Why*: zero maintenance; newest upload appears first automatically. 
- *Alternative*: hard-coded "latest episode" card — rejected, would be stale within days.

### D3. Local preview through a tiny Go file server
`main.go` at repo root (`package main`, module `github.com/timspin/alala`) serves `./site` with `http.FileServer`, default address `localhost:8080`, overridable with `-addr`, and prints the URL on start. It also serves `/api/videos.json` for the Watch carousel (D2). Files are served from disk (not `go:embed`) so edits show up on browser refresh without restarting.
- *Why*: YouTube embeds fail from `file://` (no referrer → player configuration error 153). Go is already implied by the repo path and leaves room for option B.
- *Alternatives*: `python3 -m http.server` (works, but undocumented and not "in" the project); `go:embed` (needs a rebuild per edit; revisit if a single-binary deploy is wanted).

### D4. Wordmark as a traced SVG, coloured with `currentColor`
Vectorise the 2362 px SoundCloud avatar into `site/assets/alala-wordmark.svg` (threshold → trace, e.g. potrace or a manual/online trace, then hand-cleaned), with `fill="currentColor"` so it renders white in the hero and cobalt elsewhere. Also store the original raster as `site/assets/source/alala-avatar.jpg` for provenance.
- *Why*: sharp at any size, recolourable, tiny file. 
- *Fallback*: if tracing quality is poor, generate a transparent PNG (alpha from darkness) at ~1600 px wide and colour it with CSS `mask-image` + `background-color`. The earlier `mix-blend-mode` idea is rejected: it only works on light backgrounds, and the hero is dark.

### D5. Hero composition
Full-viewport-height section with the banner as a `cover` background, positioned toward the bottom so the mountain ridge stays visible; a subtle gradient from `#204D6B` at the top (behind the wordmark) and into the page's base colour at the bottom, so the mountains "fade into" the next section. Banner stored in the repo as `site/assets/banner.jpg` (2560 w) plus `banner-1280.jpg`, served via `image-set()`/`srcset`. Keep the film grain — don't denoise.

### D6. Palette and typography
CSS custom properties:

```
--alala-cobalt:   #2B438C   /* wordmark, links, accents        */
--alala-sky:      #204D6B   /* hero top, dark surfaces         */
--alala-sky-mid:  #3D6C81   /* secondary surfaces, borders     */
--alala-mountain: #1F2C34   /* page base / footer background   */
--alala-cloud:    #FFFFFF   /* primary text on dark            */
```

The page is dark overall (mountain base, cloud-white text), with cobalt as the accent and the wordmark colour.

**Typography (revised during implementation):** self-hosted **Unbounded** (display — wide, rounded, echoes the bulbous wordmark) and **Inter** (body), latin + latin-ext + cyrillic + cyrillic-ext subsets in `site/fonts/` (SIL OFL, ~390 KB total, loaded per `unicode-range`). Both verified to cover all Kazakh letters (ә ғ қ ң ө ұ ү һ і). The original choice — a system font stack — was replaced because the page read as too plain.

### D7. i18n: one dictionary, `data-i18n` attributes
Every translatable element carries `data-i18n="key"`; `main.js` holds `{ en: {...}, ru: {...}, kk: {...} }` and swaps `textContent` on switch. English text is also present in the HTML itself so the page reads correctly even if JS fails.
- Initial language: saved choice in `localStorage` → else browser language (`ru*` → ru, `kk*` → kk) → else `en`.
- On switch: update `<html lang>` (`en` / `ru` / `kk`), persist choice, mark the active button with `aria-pressed="true"`.
- Switch labels: `EN · РУ · ҚАЗ`.
- *Why*: no build step, trivial to edit. *Alternative*: three separate HTML files — rejected, content would drift.

### D8. Live section fed by a hand-maintained list
Photos live in `site/assets/live/`. Since there is no build step, the page lists them explicitly in HTML (`<figure>` with `<img loading="lazy" alt="…">` and optional `<figcaption>`). Adding a photo = drop file + add one `<figure>`. Layout: responsive grid, first photo optionally spans two columns. Whole section links to `https://www.instagram.com/alalasound/`. If no photos are listed, the section renders a single styled link card instead. Photos are resized to ≤1600 px on the long side before committing.

### D9. Page structure

```
<header>  wordmark (small) · nav: Listen Watch Live About · EN|РУ|ҚАЗ
<section id="hero">    banner · wordmark · tagline · 3 platform buttons
<section id="listen">  heading · SoundCloud iframe · "More on SoundCloud →"
<section id="watch">   heading · video carousel (playlist iframe fallback) · "More on YouTube →"
<section id="live">    heading · photo grid / link card · "Follow on Instagram →"
<section id="about">   heading · bio paragraphs
<footer>  e-mail (mailto:) · platform icons · © ALALA, Almaty
```

Platform icons are inline SVG (no icon font / CDN). External links use `target="_blank" rel="noopener noreferrer"`.

### D10. Motion layer (added during implementation)
`site/motion.js` with **GSAP 3.13 + ScrollTrigger vendored in `site/vendor/`** (no CDN). Progressive enhancement:
- An inline `<head>` script sets `html.motion` (or `no-motion` under `prefers-reduced-motion`). Only the hero is pre-hidden, and only under `.motion`; a CSS failsafe reveals it after 2.5 s if `motion.js` never runs.
- Effects: hero intro (sky zoom, the five wordmark letters bounce in), layered parallax (photo, two generated Tien Shan ridge silhouettes, content), a cobalt marquee whose speed follows scroll velocity, masked chapter-title reveals with outlined chapter numbers (01–04), a vinyl record behind the SoundCloud player that rotates with scroll, cards sliding into the video carousel (their contents are animated, not the snap targets, so snapping isn't thrown off), a word-by-word light-up of the About manifesto (re-split on language change via an `alala:lang` event), magnetic hero buttons (fine pointers only), and animated film grain.
- No scroll hijacking or pinning; native scrolling is untouched.
- Header state (transparent over the hero, glass when scrolled) and active-nav highlighting run without GSAP.

### D11. Static export and GitHub Pages (added during implementation)
`go run . -export dist` copies `site/` (minus `assets/source/`) and writes the current feed to `dist/api/videos.json`; since `videos.js` fetches the relative path `api/videos.json`, the same page works on the Go server and on any static host, including under a sub-path. A GitHub Action exports and deploys to Pages on push, every 3 hours and on demand, so new uploads appear within about 3 hours. The export fails if the feed can't be read, so a bad run never replaces a good deployment.
- *Alternatives*: a serverless function per host (live list, but ties the site to one provider); copying `site/` as is (works, but Watch falls back to the playlist player).

## Risks / Trade-offs

- **Motion cost on low-end phones** → transform/opacity only, lazy embeds, everything off under reduced motion; grain is a single composited layer.
- **Vendored GSAP must be updated by hand** → pinned version in the file header; it is only an enhancement.

- **Embed appearance is not ours to style** → place them on neutral dark cards with generous padding; accept platform chrome as the price of zero maintenance.
- **Embeds need network & third-party JS; page is heavy-ish** → `loading="lazy"`, nothing loads above the fold except the banner.
- **YouTube playlist embed may show "unavailable" for some videos (e.g. age/region restrictions)** → "More on YouTube" link is always present beneath it.
- **Wordmark trace imperfect** → D4 fallback (masked transparent PNG).
- **RU/KZ machine-drafted copy may read awkwardly** → marked as draft; a native speaker reviews before anyone outside the team sees it.
- **Hand-maintained photo list drifts** → acceptable for 3–6 photos; revisit with option B.
- **Banner and logo rights** → they are ALALA's own assets, used on ALALA's own page.

## Migration Plan

Not applicable — new project. "Rollback" is deleting `site/` and `main.go`.

## Open Questions

- Which Instagram photo leads the grid, and which captions (if any)? — to be provided with the files.
- Who reviews the Russian and Kazakh copy?
- Tagline under the wordmark: default to "independent multi-genre music platform · Almaty" unless the team prefers something else (e.g. "Tune in and Enjoy!").
