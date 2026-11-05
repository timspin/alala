## Why

ALALA — an independent multi-genre music platform and collective from Almaty — lives across three separate platforms (SoundCloud, YouTube, Instagram) with no single place of its own. A landing page gives ALALA one front door to point people to: it presents the collective in its own visual identity and routes visitors to wherever the music actually lives. Releases are frequent (ALALA PODCAST went from 044 to 048 in one week), so the page must stay current without anyone editing it.

## What Changes

- Add a single-page static landing site (`site/`) with sections: **Hero**, **Listen**, **Watch**, **Live**, **About**, **Footer**.
- Hero uses ALALA's existing YouTube banner (film photo of clouds over the Tien Shan) with the ALALA wordmark in white, a one-line tagline, and links to all three platforms.
- **Listen** embeds the SoundCloud user widget for ALALA, so new uploads appear automatically.
- **Watch** shows a carousel of the YouTube channel's newest uploads (read from the channel's RSS feed by the local server), newest first; a card plays inline when clicked.
- **Live** shows a small curated set of Instagram photos supplied by the team, linking to `@alalasound`; falls back to a link card when no photos are present.
- **About** uses ALALA's own bio ("Hello World! We are ALALA! …"); footer shows contact e-mail `alalalasound@gmail.com`.
- All page copy available in **Russian, Kazakh and English** via an in-page language switch (no build step).
- Visual identity derived from existing channels: cobalt wordmark `#2B438C`, sky `#204D6B` / `#3D6C81`, mountain `#1F2C34`, cloud white.
- Brand assets (logo, banner) stored in the repository rather than hot-linked.
- Add a minimal Go program (`go run .`) that serves `site/` on localhost — required because YouTube embeds refuse to play from `file://`.

Explicitly out of scope: artist roster, podcast archive, public deployment / domain, build-time feed fetching (RSS), analytics.

## Capabilities

### New Capabilities

- `landing-page`: The public-facing single page — its sections, content, embeds, language switching, branding, responsiveness and accessibility.
- `local-preview`: Serving the site on localhost via a Go program so it can be viewed locally with working embeds.

### Modified Capabilities

_None — no existing specs._

## Impact

- New files: `go.mod`, `main.go`, `site/index.html`, `site/styles.css`, `site/i18n.js` (or inline), `site/assets/` (logo, banner, `live/` photos).
- New runtime dependencies: none beyond the Go standard library. The page depends at view time on third-party embeds from `w.soundcloud.com` and `www.youtube-nocookie.com`, video thumbnails from `i.ytimg.com`, and (server-side) the YouTube channel RSS feed.
- Content dependency: the team supplies 3–6 Instagram photos into `site/assets/live/`; Russian and Kazakh copy is drafted and needs review by a native speaker.
