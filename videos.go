package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

// The channel's public RSS feed lists its 15 newest uploads, needs no API key,
// and is not reachable from the browser directly (no CORS), so the server
// fetches it and hands the page a small JSON list.
const (
	channelID = "UCxpVTc8xnPcyENZ7KaYG4GQ"
	feedURL   = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID
	feedTTL   = 30 * time.Minute
)

type video struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Published time.Time `json:"published"`
}

type feed struct {
	Entries []struct {
		VideoID   string    `xml:"http://www.youtube.com/xml/schemas/2015 videoId"`
		Title     string    `xml:"title"`
		Published time.Time `xml:"published"`
	} `xml:"entry"`
}

// videoFeed caches the parsed feed. If a refresh fails, the last good copy is
// served instead, so a YouTube hiccup doesn't empty the carousel.
type videoFeed struct {
	client *http.Client

	mu      sync.Mutex
	videos  []video
	fetched time.Time
}

func newVideoFeed() *videoFeed {
	return &videoFeed{client: &http.Client{Timeout: 8 * time.Second}}
}

func (f *videoFeed) get() ([]video, error) {
	f.mu.Lock()
	defer f.mu.Unlock()

	if f.videos != nil && time.Since(f.fetched) < feedTTL {
		return f.videos, nil
	}
	vs, err := f.fetch()
	if err != nil {
		if f.videos != nil {
			log.Printf("videos: refresh failed, serving cached list: %v", err)
			return f.videos, nil
		}
		return nil, err
	}
	f.videos, f.fetched = vs, time.Now()
	return vs, nil
}

func (f *videoFeed) fetch() ([]video, error) {
	resp, err := f.client.Get(feedURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("feed returned %s", resp.Status)
	}

	var fd feed
	if err := xml.NewDecoder(resp.Body).Decode(&fd); err != nil {
		return nil, fmt.Errorf("parse feed: %w", err)
	}
	vs := make([]video, 0, len(fd.Entries))
	for _, e := range fd.Entries {
		if e.VideoID != "" {
			vs = append(vs, video{ID: e.VideoID, Title: strings.TrimSpace(e.Title), Published: e.Published})
		}
	}
	if len(vs) == 0 {
		return nil, fmt.Errorf("feed has no videos")
	}
	return vs, nil
}

func (f *videoFeed) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	vs, err := f.get()
	if err != nil {
		log.Printf("videos: %v", err)
		http.Error(w, "video list unavailable", http.StatusBadGateway)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(vs)
}
