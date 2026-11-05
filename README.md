# ALALA

Landing page for **ALALA**, an independent multi-genre music platform from Almaty, Kazakhstan.

## Preview locally

```sh
go run .                       # http://localhost:8080
go run . -addr localhost:3000  # different port
```

Open the printed URL in a browser. The page has to be served over HTTP:
if you open `site/index.html` straight from disk (`file://`), the YouTube player
won't play (it shows "Error 153"). Edits under `site/` show up when you refresh.

The "Watch" carousel lists the channel's 15 newest uploads. `main.go` reads them
from YouTube's public RSS feed and serves them at `/api/videos.json`, cached for
30 minutes, so new videos appear without editing anything. If the feed can't be
reached, the page falls back to the YouTube playlist player.

## Deploy (GitHub Pages)

The site is published as static files. `go run . -export dist` writes the
site to `dist/` with a snapshot of the video list at `dist/api/videos.json`.

`.github/workflows/pages.yml` runs that export and deploys `dist/` to GitHub
Pages on every push to `main`, every 3 hours (so new YouTube uploads show up on
their own), and on demand from the repository's **Actions** tab. If YouTube's
feed can't be read, the run fails and the previous version stays live.

One-time setup: in the repository's **Settings → Pages**, set **Source** to
**GitHub Actions**.

GitHub pauses scheduled workflows in repositories with no activity for 60 days;
re-enable it from the Actions tab (or push any commit) if new videos stop appearing.

## Layout

```
site/
├── index.html          page markup (English text is the no-JS default)
├── styles.css          palette, layout, CSS animations
├── main.js             language switch + RU/KZ/EN dictionaries
├── videos.js           "Watch" carousel (reads /api/videos.json)
├── motion.js           GSAP scroll/intro animations (optional layer)
├── vendor/             GSAP 3.13 + ScrollTrigger (vendored, no CDN)
├── fonts/              Unbounded + Inter (self-hosted, SIL OFL)
└── assets/
    ├── alala-wordmark.svg, favicon.svg
    ├── banner.jpg, banner-1280.jpg
    ├── live/           Instagram photos for the "Live" section
    └── source/         original brand files (not used by the page)
```

## Adding a Live photo

1. Resize to ≤1600 px on the long side and save as `site/assets/live/<name>.jpg`.
2. Add a `<figure>` to the `#live` section in `site/index.html` (copy an existing one).
3. Add its alt text / caption keys to all three dictionaries in `site/main.js`.

## Motion

All animation lives in `site/motion.js` and is skipped for visitors with
"reduce motion" enabled. If GSAP fails to load, the page still renders fully.
