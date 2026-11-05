## ADDED Requirements

### Requirement: Hero section presents ALALA identity
The page SHALL open with a full-viewport hero showing ALALA's banner photograph (clouds over the Tien Shan) as background, the ALALA wordmark in white, a one-line tagline, and links to SoundCloud, YouTube and Instagram.

#### Scenario: First view on desktop
- **WHEN** a visitor opens the page in a 1440×900 viewport
- **THEN** the banner photo fills the viewport, the white ALALA wordmark and tagline are visible without scrolling, and three platform links are visible

#### Scenario: Platform links target ALALA accounts
- **WHEN** a visitor activates the SoundCloud, YouTube or Instagram link in the hero
- **THEN** a new tab opens to `https://soundcloud.com/alalalasound`, `https://www.youtube.com/@alalasound` or `https://www.instagram.com/alalasound/` respectively

### Requirement: Listen section embeds ALALA on SoundCloud
The page SHALL include a Listen section containing the SoundCloud user widget for ALALA (user id `951407119`) and a link to the SoundCloud profile.

#### Scenario: New SoundCloud upload appears without page edits
- **WHEN** ALALA publishes a new track on SoundCloud
- **THEN** the embedded widget lists it on next page load with no change to the site's files

#### Scenario: Widget does not autoplay
- **WHEN** the Listen section scrolls into view
- **THEN** the widget loads but no audio plays until the visitor presses play

### Requirement: Watch section shows a carousel of ALALA's YouTube videos
The page SHALL include a Watch section with a horizontally scrolling carousel of the ALALA channel's newest uploads (from `/api/videos.json`, see local-preview), each card showing the thumbnail, title, publish date and a link to the video on YouTube, with previous/next controls and a position counter, plus a link to the channel.

#### Scenario: Newest video shown first
- **WHEN** ALALA publishes a new video (e.g. a new ALALA PODCAST episode)
- **THEN** it appears as the first card on next page load (within the server's 30-minute cache) with no change to the site's files

#### Scenario: Playing a video
- **WHEN** a visitor activates a card's play button
- **THEN** that card alone loads the video via `youtube-nocookie.com` and starts playing; any other playing card returns to its thumbnail
- **AND** no YouTube player is loaded before a card is activated

#### Scenario: Browsing the carousel
- **WHEN** a visitor uses the next/previous buttons, arrow keys on the focused carousel, or swipes/scrolls horizontally
- **THEN** the carousel moves one card per step, snaps to a card, updates the counter (e.g. `03 / 15`), and disables the button at either end

#### Scenario: Video list unavailable
- **WHEN** `/api/videos.json` cannot be loaded, or JavaScript is disabled
- **THEN** the section shows the channel's uploads-playlist player (`UUxpVTc8xnPcyENZ7KaYG4GQ`) via `youtube-nocookie.com` in a 16:9 frame instead

### Requirement: Live section shows curated Instagram photos
The page SHALL include a Live section displaying the photos listed from `site/assets/live/` in a responsive grid, each with alt text and an optional caption, and a link to `@alalasound` on Instagram.

#### Scenario: Photos present
- **WHEN** one or more photos are listed in the Live section
- **THEN** they render in a grid, load lazily, and the section links to `https://www.instagram.com/alalasound/`

#### Scenario: No photos yet
- **WHEN** no photos are listed
- **THEN** the section shows a single link card inviting the visitor to follow ALALA on Instagram, with no broken images

### Requirement: About section uses ALALA's own bio
The page SHALL include an About section presenting ALALA's bio text ("Hello World! We are ALALA! …") in the active language.

#### Scenario: About content in English
- **WHEN** the active language is English
- **THEN** the About section contains the bio as published on ALALA's YouTube and SoundCloud profiles

### Requirement: Footer provides contact
The page SHALL end with a footer containing a `mailto:alalalasound@gmail.com` link and links to all three platforms.

#### Scenario: Contact via e-mail
- **WHEN** a visitor activates the e-mail link
- **THEN** the default mail client opens addressed to `alalalasound@gmail.com`

### Requirement: Trilingual content with language switch
All page copy (navigation, headings, tagline, bio, link labels, footer, alt text) SHALL be available in English, Russian and Kazakh, switchable in place via an `EN · РУ · ҚАЗ` control without reloading.

#### Scenario: Switching language
- **WHEN** a visitor selects РУ
- **THEN** all page copy changes to Russian, `<html lang>` becomes `ru`, and the РУ control is marked active (`aria-pressed="true"`)

#### Scenario: Choice is remembered
- **WHEN** a visitor who selected ҚАЗ reloads the page
- **THEN** the page renders in Kazakh with `<html lang="kk">`

#### Scenario: Default from browser language
- **WHEN** a first-time visitor's browser language is `ru-RU`
- **THEN** the page renders in Russian; for `kk-KZ` it renders in Kazakh; for any other language it renders in English

#### Scenario: JavaScript unavailable
- **WHEN** JavaScript is disabled
- **THEN** the page renders fully readable in English

### Requirement: Visual identity follows ALALA brand
The page SHALL use the ALALA palette (`#2B438C` cobalt, `#204D6B` sky, `#3D6C81` sky-mid, `#1F2C34` mountain, `#FFFFFF` cloud), the ALALA wordmark from repository-stored assets, and SHALL NOT hot-link brand images from third-party CDNs.

#### Scenario: Assets load from the repository
- **WHEN** the page is loaded
- **THEN** the wordmark and banner are requested from the site's own `assets/` path, not from `sndcdn.com` or `googleusercontent.com`

### Requirement: Responsive layout
The page SHALL be usable from 360 px to 2560 px viewport widths without horizontal scrolling, with embeds scaling to the available width.

#### Scenario: Mobile viewport
- **WHEN** the page is viewed at 360×740
- **THEN** there is no horizontal scroll, the wordmark fits the width, the photo grid collapses to a single or two-column layout, and embeds span the content width

### Requirement: Accessible markup
The page SHALL use semantic landmarks (`header`, `main`, `section`s with headings, `footer`), give every embed iframe a descriptive `title`, every photo an `alt`, keep text contrast at WCAG AA or better, and keep all controls keyboard-operable with a visible focus indicator.

#### Scenario: Keyboard navigation
- **WHEN** a visitor tabs through the page
- **THEN** each link, language button and embed receives focus in document order with a visible focus ring

### Requirement: External links open safely
All links to external sites SHALL open in a new tab with `rel="noopener noreferrer"`.

#### Scenario: Opening an external link
- **WHEN** a visitor activates any link to SoundCloud, YouTube or Instagram
- **THEN** it opens in a new tab and the new page has no `window.opener` access to the landing page
