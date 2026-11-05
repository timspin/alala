package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

// skipExport lists paths under the site directory that the page never uses
// and that should not be published.
var skipExport = map[string]bool{
	"assets/source": true, // original brand files, kept for provenance only
}

// export writes a static copy of the site to out: every file from dir, plus
// api/videos.json holding the current YouTube feed, so the Watch carousel
// works on a plain static host. It fails if the feed can't be read, so a
// scheduled rebuild never replaces a good deployment with an empty list.
func export(dir, out string) error {
	vs, err := newVideoFeed().fetch()
	if err != nil {
		return fmt.Errorf("read video feed: %w", err)
	}

	if err := os.RemoveAll(out); err != nil {
		return err
	}
	err = filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(dir, path)
		if err != nil {
			return err
		}
		if skipExport[filepath.ToSlash(rel)] {
			return filepath.SkipDir
		}
		if d.Name() == ".DS_Store" {
			return nil
		}
		dst := filepath.Join(out, rel)
		if d.IsDir() {
			return os.MkdirAll(dst, 0o755)
		}
		return copyFile(path, dst)
	})
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Join(out, "api"), 0o755); err != nil {
		return err
	}
	data, err := json.Marshal(vs)
	if err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(out, "api", "videos.json"), data, 0o644); err != nil {
		return err
	}
	// Tell GitHub Pages to serve the files as they are (no Jekyll processing).
	if err := os.WriteFile(filepath.Join(out, ".nojekyll"), nil, 0o644); err != nil {
		return err
	}
	fmt.Printf("exported %s to %s (%d videos)\n", dir, out, len(vs))
	return nil
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	o, err := os.Create(dst)
	if err != nil {
		return err
	}
	if _, err := io.Copy(o, in); err != nil {
		o.Close()
		return err
	}
	return o.Close()
}
