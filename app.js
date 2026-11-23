const PAGE_SIZE = 48;
const IMG = 'https://image.tmdb.org/t/p/w342';
const HOST = 'vixsrc.to';
const els = {
  tabs: [...document.querySelectorAll('.tab')],
  search: document.getElementById('search'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  more: document.getElementById('more'),
  catalog: document.getElementById('catalog'),
  detail: document.getElementById('detail'),
  back: document.getElementById('back'),
  detailTitle: document.getElementById('detail-title'),
  detailMeta: document.getElementById('detail-meta'),
  detailPoster: document.getElementById('detail-poster'),
  detailLinks: document.getElementById('detail-links'),
  seasons: document.getElementById('seasons'),
};

const state = { type: 'movie', query: '', shown: PAGE_SIZE, cache: {}, items: [], meta: null, episodes: null };

function embedUrl(item) {
  const id = item.imdb_id || item.tmdb_id;
  if (state.type === 'movie') return `https://${HOST}/movie/${id}`;
  if (state.type === 'tv') return `#tv/${item.tmdb_id}`;
  return `https://${HOST}/tv/${item.tmdb_id}/${item.s}/${item.e}`;
}

function episodeBadge(item) {
  return `S${String(item.s).padStart(2, '0')}E${String(item.e).padStart(2, '0')}`;
}

function label(item) {
  if (item.title) return item.title;
  return state.type === 'episode' ? `TMDB ${item.tmdb_id} · ${episodeBadge(item)}` : `TMDB ${item.tmdb_id}`;
}

function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function matches(item, q) {
  if (!q) return true;
  const haystack = normalize([item.title, item.year, item.tmdb_id, item.imdb_id,
    item.s && item.e && `s${item.s}e${item.e}`,
    item.s && item.e && episodeBadge(item)]
    .filter(Boolean).join(' ')).replace(/tt(\d+)/g, '$1');
  return haystack.includes(q.replace(/^tt/, ''));
}

function posterNode(item, href, external = true) {
  const link = document.createElement('a');
  link.className = 'poster';
  link.href = href;
  if (external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  if (item.poster) {
    const img = document.createElement('img');
    img.src = `${IMG}${item.poster}`;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    link.append(img);
  } else {
    link.classList.add('is-empty');
    link.textContent = '▶';
  }
  return link;
}

function card(item) {
  const el = document.createElement('article');
  el.className = 'card';
  const isShow = state.type === 'tv' || state.type === 'episode';
  const cardUrl = isShow ? `#tv/${item.tmdb_id}` : embedUrl(item);
  const external = !isShow;
  el.append(posterNode(item, cardUrl, external));

  const body = document.createElement('div');
  body.className = 'card-body';
  const top = document.createElement('div');
  top.className = 'card-top';
  const kind = document.createElement('span');
  kind.className = 'kind';
  kind.textContent = state.type === 'movie' ? 'Film' : state.type === 'tv' ? 'Serie TV' : episodeBadge(item);
  top.append(kind);
  if (item.year) {
    const year = document.createElement('span');
    year.className = 'year';
    year.textContent = item.year;
    top.append(year);
  }

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = cardUrl;
  if (external) {
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
  }
  titleLink.className = 'title-link';
  titleLink.textContent = label(item);
  title.append(titleLink);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = [item.imdb_id, item.tmdb_id && `TMDB ${item.tmdb_id}`].filter(Boolean).join(' · ');

  const links = document.createElement('div');
  links.className = 'card-links';
  const tmdb = document.createElement('a');
  tmdb.href = `https://www.themoviedb.org/${state.type === 'movie' ? 'movie' : 'tv'}/${item.tmdb_id}`;
  tmdb.target = '_blank';
  tmdb.rel = 'noopener noreferrer';
  tmdb.textContent = 'TMDB ↗';
  links.append(tmdb);
  if (item.imdb_id) {
    const imdb = document.createElement('a');
    imdb.href = `https://www.imdb.com/title/${item.imdb_id}/`;
    imdb.target = '_blank';
    imdb.rel = 'noopener noreferrer';
    imdb.textContent = 'IMDb ↗';
    links.append(imdb);
  }

  const play = document.createElement('a');
  play.className = 'play';
  play.href = state.type === 'tv' ? cardUrl : embedUrl(item);
  if (state.type !== 'tv') {
    play.target = '_blank';
    play.rel = 'noopener noreferrer';
  }
  play.textContent = state.type === 'tv' ? '▶ Episodi' : '▶ Guarda ↗';

  body.append(top, title, meta, links, play);
  el.append(body);
  return el;
}

function render() {
  let filtered = state.items.filter(item => matches(item, state.query));
  if (state.query) {
    const first = [];
    const rest = [];
    for (const item of filtered) (normalize(item.title).startsWith(state.query) ? first : rest).push(item);
    filtered = first.concat(rest);
  }
  els.status.textContent = `${filtered.length.toLocaleString('it-IT')} titoli · catalogo ${state.type} · lingua it`;
  els.results.replaceChildren(...filtered.slice(0, state.shown).map(card));
  els.more.hidden = filtered.length <= state.shown;
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Nessun titolo trovato. Prova con un altro nome o ID.';
    els.results.append(empty);
  }
}

function getMeta() {
  if (!state.meta) {
    state.meta = fetch('data/meta.json')
      .then(response => response.ok ? response.json() : {})
      .catch(() => ({}));
  }
  return state.meta;
}

async function load(type) {
  state.type = type;
  state.shown = PAGE_SIZE;
  state.items = [];
  els.status.textContent = 'Caricamento catalogo…';
  try {
    const [rows, meta] = await Promise.all([
      fetch(`data/${type}.json`).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }),
      getMeta(),
    ]);
    const group = type === 'movie' ? meta.movie : meta.tv;
    state.cache[type] = rows.map(row => {
      const info = group && group[row[0]];
      return {
        tmdb_id: row[0],
        imdb_id: row[1],
        ...(type === 'episode' ? { s: row[2], e: row[3] } : {}),
        title: info ? info[0] : '',
        year: info ? info[1] : '',
        poster: info ? info[2] : null,
      };
    });
    state.items = state.cache[type];
    render();
  } catch (error) {
    els.status.textContent = `Impossibile caricare il catalogo: ${error.message}`;
  }
}

function getEpisodes() {
  if (!state.episodes) {
    state.episodes = fetch('data/episode.json')
      .then(response => response.ok ? response.json() : [])
      .catch(() => []);
  }
  return state.episodes;
}

async function showDetail(id) {
  els.catalog.hidden = true;
  els.detail.hidden = false;
  els.detailTitle.textContent = 'Caricamento…';
  els.detailMeta.textContent = '';
  els.detailPoster.replaceChildren();
  els.detailPoster.classList.remove('is-empty');
  els.detailLinks.replaceChildren();
  els.seasons.replaceChildren();
  window.scrollTo({ top: 0 });

  try {
    const [meta, rows] = await Promise.all([getMeta(), getEpisodes()]);
    const info = meta.tv && meta.tv[id];
    const title = info ? info[0] : `TMDB ${id}`;
    document.title = `${title} — moviesrc`;
    els.detailTitle.textContent = title;
    els.detailMeta.textContent = [info && info[1], `TMDB ${id}`].filter(Boolean).join(' · ');

    if (info && info[2]) {
      const img = document.createElement('img');
      img.src = `${IMG}${info[2]}`;
      img.alt = title;
      els.detailPoster.append(img);
    } else {
      els.detailPoster.textContent = '▶';
      els.detailPoster.classList.add('is-empty');
    }

    const tmdb = document.createElement('a');
    tmdb.href = `https://www.themoviedb.org/tv/${id}`;
    tmdb.target = '_blank';
    tmdb.rel = 'noopener noreferrer';
    tmdb.textContent = 'TMDB ↗';
    els.detailLinks.append(tmdb);

    const episodes = rows
      .filter(row => String(row[0]) === id)
      .map(row => ({ s: row[2], e: row[3] }))
      .sort((a, b) => a.s - b.s || a.e - b.e);

    if (!episodes.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'Nessun episodio disponibile per questa serie.';
      els.seasons.append(empty);
      return;
    }

    const seasons = new Map();
    for (const episode of episodes) {
      if (!seasons.has(episode.s)) seasons.set(episode.s, []);
      seasons.get(episode.s).push(episode);
    }

    for (const [season, list] of seasons) {
      const section = document.createElement('section');
      section.className = 'season';
      const heading = document.createElement('h2');
      heading.textContent = `Stagione ${season}`;
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = list.length === 1 ? '1 episodio' : `${list.length} episodi`;
      heading.append(count);
      const grid = document.createElement('div');
      grid.className = 'episode-grid';
      for (const episode of list) {
        const link = document.createElement('a');
        link.className = 'episode';
        link.href = `https://${HOST}/tv/${id}/${episode.s}/${episode.e}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `E${String(episode.e).padStart(2, '0')}`;
        link.title = `Guarda S${season} E${episode.e}`;
        link.setAttribute('aria-label', `Guarda stagione ${season} episodio ${episode.e}`);
        grid.append(link);
      }
      section.append(heading, grid);
      els.seasons.append(section);
    }
  } catch (error) {
    els.detailTitle.textContent = 'Errore';
    els.detailMeta.textContent = error.message;
  }
}

function showCatalog(restore = true) {
  els.detail.hidden = true;
  els.catalog.hidden = false;
  document.title = 'moviesrc — catalogo vixsrc';
  if (restore && !state.items.length) load('movie');
}

function route() {
  const match = location.hash.match(/^#tv\/(\d+)$/);
  if (match) {
    showDetail(match[1]);
    return;
  }
  showCatalog();
  if (!state.items.length) load('movie');
}

els.tabs.forEach(tab => tab.addEventListener('click', () => {
  els.tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
  showCatalog(false);
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  load(tab.dataset.type);
}));

els.search.addEventListener('input', () => {
  state.query = normalize(els.search.value).trim();
  state.shown = PAGE_SIZE;
  render();
});

els.more.addEventListener('click', () => {
  state.shown += PAGE_SIZE;
  render();
});

window.addEventListener('hashchange', route);
if (location.hash.startsWith('#tv/')) route();
else load('movie');
