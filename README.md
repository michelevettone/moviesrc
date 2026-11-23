# moviesrc

Sito statico per GitHub Pages che espone le API vixsrc:

- `https://vixsrc.to/movie/{id}`
- `https://vixsrc.to/tv/{id}/{season}/{episode}`
- `https://vixsrc.to/api/list/{type}?lang=it`

## Perché i dati sono nel repo

L'endpoint `/api/list` non restituisce header CORS, quindi un browser su `github.io` non può chiamarlo direttamente. `.github/workflows/update-catalog.yml` scarica i tre cataloghi ogni giorno e commetta i JSON in `data/`; la pagina legge quei file in same-origin, senza proxy.

## Sviluppo

```sh
node scripts/update-catalog.js   # rigenera data/*.json
python3 -m http.server 8000      # apri http://localhost:8000
```

## Deploy

1. Crea il repo `michelevettone/moviesrc`.
2. Push su `main`.
3. In Settings → Pages, Source: **Deploy from a branch**, Branch: `main` / `/(root)`.
4. Abilita **Actions → Generic workflow permissions → Read and write** se il commit automatico viene rifiutato.

URL finale: `https://michelevettone.github.io/moviesrc/`

## Dominio embed personalizzato

Il campo **Embed domain** in alto cambia l'host degli URL generati (default `vixsrc.to`). Se usi la funzione *Custom embed domain* di vixsrc, aggiungi li il dominio autorizzato; il valore viene salvato in localStorage.
