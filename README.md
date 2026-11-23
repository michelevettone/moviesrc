# moviesrc

Sito statico per GitHub Pages che usa il catalogo vixsrc e apre film, serie ed episodi in una nuova scheda:

- `https://vixsrc.to/movie/{id}`
- `https://vixsrc.to/tv/{id}/{season}/{episode}`
- `https://vixsrc.to/api/list/{type}?lang=it`

## Perché i dati sono nel repo

L'endpoint `/api/list` non restituisce header CORS, quindi un browser su `github.io` non può chiamarlo direttamente. `.github/workflows/update-catalog.yml` scarica i tre cataloghi ogni giorno e commetta i JSON in `data/`; la pagina legge quei file in same-origin, senza proxy.

## Sviluppo

```sh
TMDB_TOKEN=... node scripts/update-catalog.js   # rigenera data/*.json
python3 -m http.server 8000                     # apri http://localhost:8000
```

Il token TMDB è una v4 Read Access Token. Senza token lo script aggiorna solo i cataloghi e mantiene i metadati già presenti.

## Metadati TMDB

`data/meta.json` contiene titolo, anno e locandina per ogni TMDB ID. Viene popolato in modo incrementale: ai run successivi si scaricano solo gli ID nuovi. Nel repo il token non c'è: il workflow usa il secret `TMDB_TOKEN`.

Questo prodotto usa le API TMDB ma non è approvato né certificato da TMDB.

## Deploy

1. Crea il repo `michelevettone/moviesrc`.
2. Push su `main`.
3. In Settings → Pages, Source: **Deploy from a branch**, Branch: `main` / `/(root)`.
4. Abilita **Actions → Generic workflow permissions → Read and write** se il commit automatico viene rifiutato.

URL finale: `https://michelevettone.github.io/moviesrc/`

## Dominio embed personalizzato

Il campo **Embed domain** in alto cambia l'host dei link generati (default `vixsrc.to`). Se usi la funzione *Custom embed domain* di vixsrc, aggiungi lì il dominio autorizzato; il valore viene salvato in localStorage. I link si aprono sempre in una nuova scheda.
