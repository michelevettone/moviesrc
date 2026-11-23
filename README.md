# moviesrc

A static movie and TV catalog for GitHub Pages with two providers:

- **Italian** → vixsrc catalog and player (`?lang=it`)
- **English** → full vidsrc catalog and player

The initial language comes from the system (`it*` → Italian, anything else → English) and can be changed from the dropdown in the top-right corner. The choice is persisted in `localStorage`.

Each TV show has an internal page with every available episode (`#tv/{tmdbId}`); episode buttons use the provider of the active language.

## Features

- Bilingual UI (IT/EN) with localized titles, tabs, buttons, status messages and search.
- Global search across movies and TV shows in the active catalog.
- Lists sorted by release date, newest first.
- "Continue watching" carousel based on the last opened movies/episodes (stored in `localStorage`; no playback position yet). TV entries open the show page, highlight the last opened episode and offer a quick "resume from next episode" button.
- Responsive card grid, poster overlays, lazy-free eager thumbnails at the correct size.
- Installable PWA with service worker, manifest, icons and safe-area support.
- `no-referrer` policy so vixsrc does not block navigation from GitHub Pages.

## Why the data lives in the repo

The catalog APIs are not browser-friendly (CORS, rate limits), so `.github/workflows/update-catalog.yml` downloads them daily and commits the JSON under `data/`. The site reads those files same-origin, with no proxy.

Data files:

| File | Contents |
| --- | --- |
| `data/movie.json`, `data/tv.json`, `data/episode.json`, `data/meta.json` | vixsrc catalog + TMDB metadata (IT) |
| `data/movie-en.json` | full vidsrc movie catalog with English metadata (EN) |
| `data/tv-en.json` | vidsrc TV catalog with English metadata (EN) |
| `data/episode-en.json` | vidsrc episode index (EN) |

English metadata is populated incrementally: only new IDs are fetched on later runs.

## Development

```sh
TMDB_TOKEN=... node scripts/update-catalog.js   # regenerate data/*.json
python3 -m http.server 8000                     # open http://localhost:8000
```

`TMDB_TOKEN` is a TMDB v4 Read Access Token. Without it, the script updates the ID catalogs but keeps existing metadata.

The GitHub Actions workflow uses the repository secret `TMDB_TOKEN`; the token is never committed.

## Providers and limitations

- **vixsrc (IT)**: supports `?lang=it` for Italian audio/subtitles.
- **vidsrc (EN)**: embeds (`/embed/movie/{id}`, `/embed/tv/{id}/{s}/{e}`) accept IMDb or TMDB IDs.
- vidsrc does **not** expose audio-track selection; English mode uses the original/English audio. Subtitle language can be selected in the player.
- vidsrc serves ads and is embedded directly from `vidsrc.sh` (not the `vidsrc.mov` wrapper).
- AirPlay from the vixsrc player may send audio only; use screen mirroring for video.
- "Continue watching" tracks what was opened, not the exact playback position.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Deploy

1. Push to `main`.
2. In **Settings → Pages**, choose **Deploy from a branch**, then `main` / `/(root)`.
3. If the scheduled workflow cannot push, enable **Settings → Actions → General → Workflow permissions → Read and write**.

Live URL: `https://michelevettone.github.io/moviesrc/`

## PWA

The site is installable via `manifest.webmanifest`, `sw.js` and the icons in `icons/`.

- Android/Chrome: **Install app** or menu → **Add to Home screen**
- iPhone/Safari: Share → **Add to Home Screen**

The service worker keeps the app shell and data available offline after the first visit; HTML and catalog JSON are fetched network-first so updates appear on the next launch.
