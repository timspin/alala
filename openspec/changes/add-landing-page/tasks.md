## 1. Project setup & local preview

- [x] 1.1 Initialise Go module `github.com/timspin/alala` (`go.mod`)
- [x] 1.2 Write `main.go`: serve `./site` via `http.FileServer` from disk, default `localhost:8080`, `-addr` flag, print URL on start, exit non-zero with message if the address is in use
- [x] 1.3 Create `site/` skeleton: `index.html`, `styles.css`, `main.js`, `assets/`, `assets/live/`, `assets/source/`
- [x] 1.4 Add a short `README.md` with "run `go run .` and open http://localhost:8080" (and why `file://` won't play YouTube)

## 2. Brand assets

- [x] 2.1 Download the SoundCloud original avatar (2362 px) to `site/assets/source/alala-avatar.jpg`
- [x] 2.2 Download the YouTube banner (2560 w) to `site/assets/banner.jpg` and produce `site/assets/banner-1280.jpg` (keep grain, moderate JPEG quality)
- [x] 2.3 Trace the wordmark into `site/assets/alala-wordmark.svg` with `fill="currentColor"`, cropped tight to the lettering; verify at small (120 px) and large (900 px) widths
- [x] 2.4 If the trace is poor, fall back to a transparent PNG (~1600 px wide) coloured with CSS `mask-image` (design D4) — not needed: trace is clean at 120–900 px
- [x] 2.5 Inline SVG icons for SoundCloud, YouTube, Instagram and e-mail

## 3. Page structure & styling

- [x] 3.1 Define palette custom properties and the system font stack in `styles.css`; base dark theme (mountain background, cloud text)
- [x] 3.2 Build the header: small wordmark, in-page nav (Listen / Watch / Live / About), language switch `EN · РУ · ҚАЗ`
- [x] 3.3 Build the hero: full-viewport banner (`image-set` 1280/2560, bottom-anchored), sky→mountain gradient, white wordmark, tagline, three platform buttons
- [x] 3.4 Build the Listen section: SoundCloud user widget iframe (user 951407119, visual, no autoplay, lazy, titled) + "More on SoundCloud" link
- [x] 3.5 Build the Watch section: `youtube-nocookie.com` uploads-playlist iframe (`UUxpVTc8xnPcyENZ7KaYG4GQ`) in a 16:9 wrapper, lazy, titled + "More on YouTube" link
- [x] 3.5a Replace the Watch player with a video carousel: `videos.go` serves `/api/videos.json` from the channel RSS feed (30 min cache, stale-on-error); `site/videos.js` builds snap-scrolling cards (thumbnail, title, date, YouTube link) with prev/next, counter and progress bar, plays a card inline via `youtube-nocookie.com` on click; playlist iframe kept as the no-JS / feed-down fallback
- [x] 3.6 Build the Live section: responsive photo grid of `<figure>`s with alt text and optional captions; link card fallback when empty; link to `@alalasound`
- [x] 3.7 Build the About section with the ALALA bio
- [x] 3.8 Build the footer: `mailto:alalalasound@gmail.com`, platform icon links, "© ALALA · Almaty"
- [x] 3.9 Apply `target="_blank" rel="noopener noreferrer"` to all external links
- [x] 3.10 Responsive pass at 360, 768, 1440 and 2560 px widths; no horizontal scroll

## 4. Internationalisation

- [x] 4.1 Add `data-i18n` keys to every translatable element (including alt text and iframe titles via attribute keys); English default text stays in the HTML
- [x] 4.2 Write the `en` dictionary from the existing bio and page copy
- [x] 4.3 Draft the `ru` and `kk` dictionaries; mark them as drafts needing native-speaker review (comment at top of dictionary)
- [x] 4.4 Implement the switch in `main.js`: localStorage → browser language → `en`; update `<html lang>`, `aria-pressed`, persist choice
- [ ] 4.5 Check Kazakh-specific glyphs (ә ғ қ ң ө ұ ү һ і) render correctly in the system font stack on macOS, Windows, Android — verified on macOS Chrome only; Windows/Android not yet checked

## 5. Live photos (team-supplied content)

- [ ] 5.1 Receive 3–6 Instagram photos (plus which one leads, and captions) from the team into `site/assets/live/`
- [ ] 5.2 Resize to ≤1600 px long side, strip EXIF, list them in the Live section with alt text in all three languages

## 6. Verification

- [x] 6.0a Add `go run . -export DIR` (static copy of `site/` without `assets/source`, plus `api/videos.json` snapshot and `.nojekyll`; fails if the feed can't be read) and `.github/workflows/pages.yml` (deploy to GitHub Pages on push to `main`, every 3 h, and on demand)
- [x] 6.1 Run `go run .`; confirm SoundCloud widget and YouTube player both load and play at http://localhost:8080
- [x] 6.2 Confirm the newest YouTube upload (currently ALALA PODCAST 048) appears first in the Watch carousel
- [x] 6.3 Walk through every scenario in `specs/landing-page/spec.md` and `specs/local-preview/spec.md` ("Photos present" re-check belongs to 5.2)
- [x] 6.4 Keyboard-only pass (focus order, visible focus) and contrast check (WCAG AA) on hero and body text
- [x] 6.5 Confirm in the network panel that no brand images are requested from `sndcdn.com` / `googleusercontent.com`
- [x] 6.6 Disable JavaScript and confirm the page reads correctly in English
