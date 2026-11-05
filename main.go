// Command alala serves the ALALA landing page from ./site for local preview.
//
// YouTube embeds refuse to play when index.html is opened via file://,
// so the page must be viewed over HTTP. Files are read from disk on every
// request, so edits show up on browser refresh without a restart.
//
// It also serves /api/videos.json, the channel's newest YouTube uploads, for
// the "Watch" carousel (see videos.go).
//
// With -export DIR it instead writes a static copy of the site, including a
// snapshot of the video list, for hosting on GitHub Pages (see export.go).
package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
)

func main() {
	addr := flag.String("addr", "localhost:8080", "listen address")
	dir := flag.String("dir", "site", "directory to serve")
	out := flag.String("export", "", "write a static copy of the site to this directory and exit")
	flag.Parse()

	if fi, err := os.Stat(*dir); err != nil || !fi.IsDir() {
		log.Fatalf("site directory %q not found (run from the repository root)", *dir)
	}

	if *out != "" {
		if err := export(*dir, *out); err != nil {
			log.Fatalf("export: %v", err)
		}
		return
	}

	ln, err := net.Listen("tcp", *addr)
	if err != nil {
		log.Fatalf("cannot listen on %s: %v", *addr, err)
	}

	fmt.Printf("ALALA preview: http://%s\n", *addr)
	mux := http.NewServeMux()
	mux.Handle("/api/videos.json", newVideoFeed())
	mux.Handle("/", http.FileServer(http.Dir(*dir)))
	log.Fatal(http.Serve(ln, noCache(mux)))
}

// noCache stops the browser from caching files, so edits are always visible.
func noCache(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		h.ServeHTTP(w, r)
	})
}
