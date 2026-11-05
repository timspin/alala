## ADDED Requirements

### Requirement: Serve the site locally with one command
The repository SHALL provide a Go program at the module root that, when run with `go run .`, serves the contents of `site/` over HTTP on `localhost:8080` and prints the URL to stdout. It SHALL use only the Go standard library.

#### Scenario: Start the preview
- **WHEN** a developer runs `go run .` from the repository root
- **THEN** the program logs `http://localhost:8080` and a browser request to that URL returns `site/index.html`

#### Scenario: Embeds work in preview
- **WHEN** the page is opened through the local server
- **THEN** both the SoundCloud widget and the YouTube player load and play (unlike opening `index.html` via `file://`)

### Requirement: Configurable listen address
The program SHALL accept an `-addr` flag to override the listen address.

#### Scenario: Custom port
- **WHEN** a developer runs `go run . -addr localhost:3000`
- **THEN** the site is served at `http://localhost:3000`

#### Scenario: Port already in use
- **WHEN** the chosen address is already bound
- **THEN** the program exits with a non-zero status and an error message naming the address

### Requirement: Edits visible without restart
The server SHALL also answer `GET /api/videos.json` with the channel's newest uploads as a JSON array of `{id, title, published}`, newest first, read from the public channel RSS feed (`https://www.youtube.com/feeds/videos.xml?channel_id=UCxpVTc8xnPcyENZ7KaYG4GQ`, no API key) and cached in memory for 30 minutes. If a refresh fails it SHALL serve the last good list, and respond `502` only if it has never fetched one.

The server SHALL read files from disk on each request so that changes to files in `site/` appear on browser refresh without restarting the program.

#### Scenario: Editing copy
- **WHEN** a developer edits `site/index.html` while the server is running and refreshes the browser
- **THEN** the updated content is shown
