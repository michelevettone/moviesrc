# moviesrc

Sito statico per GitHub Pages con due cataloghi:

- **Italiano** → catalogo vixsrc, player vixsrc (`?lang=it`).
- **Inglese** → catalogo completo vidsrc, player vidsrc.

La lingua iniziale viene dal sistema (`it*` → italiano, altrimenti inglese) e può essere cambiata dal picker IT/EN in alto a destra. La scelta è salvata in localStorage. Ogni serie TV ha una pagina interna con tutti gli episodi (`#tv/{tmdbId}`); i pulsanti episodio usano il provider della lingua attiva.

## Perché i dati sono nel repo

Le API dei cataloghi non sono pensate per il browser (CORS/rate limit), quindi `.github/workflows/update-catalog.yml` scarica i cataloghi ogni giorno e commette i JSON in `data/`; la pagina legge quei file in same-origin, senza proxy.

File principali:

- `data/movie.json`, `data/tv.json`, `data/episode.json`, `data/meta.json` — catalogo e metadati vixsrc (IT)
- `data/movie-en.json`, `data/tv-en.json`, `data/episode-en.json` — catalogo vidsrc (EN), metadati inclusi
- `data/` viene aggiornata da `scripts/update-catalog.js`

## Sviluppo

```sh
TMDB_TOKEN=... node scripts/update-catalog.js   # rigenera data/*.json
python3 -m http.server 8000                     # apri http://localhost:8000
```

Il token TMDB è una v4 Read Access Token. Senza token lo script aggiorna solo i cataloghi e mantiene i metadati già presenti.

## Metadati TMDB

`data/meta.json` contiene titolo, anno, locandina e data di uscita per ogni TMDB ID vixsrc. I cataloghi vidsrc includono già titolo, anno, locandina e data in inglese. Tutto viene popolato in modo incrementale: ai run successivi si scaricano solo gli ID nuovi. Nel repo il token non c'è: il workflow usa il secret `TMDB_TOKEN`.

La ricerca cerca in tutto il catalogo della lingua attiva (film e serie) e le liste sono ordinate per data di uscita più recente.

Vidsrc non espone una selezione audio: in inglese usa l'audio originale/inglese e supporta i sottotitoli. Il player vixsrc gestisce l'italiano con `?lang=it`.

Questo prodotto usa le API TMDB ma non è approvato né certificato da TMDB.

## Deploy

1. Crea il repo `michelevettone/moviesrc`.
2. Push su `main`.
3. In Settings → Pages, Source: **Deploy from a branch**, Branch: `main` / `/(root)`.
4. Abilita **Actions → Generic workflow permissions → Read and write** se il commit automatico viene rifiutato.

URL finale: `https://michelevettone.github.io/moviesrc/`

## PWA

Il sito è installabile: `manifest.webmanifest`, service worker (`sw.js`) e icone in `icons/`. Su Android/Chrome usa “Installa app” o il menu → “Aggiungi alla schermata Home”; su iPhone Safari usa Condividi → “Aggiungi alla schermata Home”.
