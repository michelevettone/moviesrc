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
  seasons: document.getElementById('seasons'),
};

const state = {
  type: 'movie',
  query: '',
  shown: PAGE_SIZE,
  cache: {},
  items: [],
  meta: null,
  episodes: null,
  searchSeq: 0,
};

function embedUrl(item) {
  if (item.mediaType === 'tv') return `#tv/${item.tmdb_id}`;
  return `https://${HOST}/movie/${item.imdb_id || item.tmdb_id}?lang=it`;
}

function label(item) {
  return item.title || 'Senza titolo';
}

function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function matches(item, q) {
  if (!q) return true;
  const haystack = normalize([item.title, item.year, item.date, item.tmdb_id, item.imdb_id]
    .filter(Boolean).join(' ')).replace(/tt(\d+)/g, '$1');
  return haystack.includes(q.replace(/^tt/, ''));
}

function byDate(a, b) {
  return (b.date || '').localeCompare(a.date || '');
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
  const isTv = item.mediaType === 'tv';
  const url = embedUrl(item);
  el.append(posterNode(item, url, !isTv));

  const body = document.createElement('div');
  body.className = 'card-body';
  const top = document.createElement('div');
  top.className = 'card-top';
  const kind = document.createElement('span');
  kind.className = 'kind';
  kind.textContent = isTv ? 'Serie TV' : 'Film';
  top.append(kind);
  if (item.year) {
    const year = document.createElement('span');
    year.className = 'year';
    year.textContent = item.year;
    top.append(year);
  }

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = url;
  if (!isTv) {
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
  }
  titleLink.className = 'title-link';
  titleLink.textContent = label(item);
  title.append(titleLink);

  const play = document.createElement('a');
  play.className = 'play';
  play.href = url;
  if (!isTv) {
    play.target = '_blank';
    play.rel = 'noopener noreferrer';
  }
  play.textContent = isTv ? '▶ Episodi' : '▶ Guarda ↗';

  body.append(top, title, play);
  el.append(body);
  return el;
}

function render() {
  let filtered = state.items.filter(item => matches(item, state.query)).sort(byDate);
  els.status.textContent = state.query
    ? `${filtered.length.toLocaleString('it-IT')} risultati in film e serie`
    : `${filtered.length.toLocaleString('it-IT')} titoli · catalogo ${state.type === 'movie' ? 'film' : 'serie TV'}`;
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

async function getCatalog(type) {
  if (state.cache[type]) return state.cache[type];
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
      mediaType: type,
      title: info ? info[0] : '',
      year: info ? info[1] : '',
      poster: info ? info[2] : null,
      date: info ? info[3] || '' : '',
    };
  });
  return state.cache[type];
}

async function load(type) {
  state.type = type;
  state.shown = PAGE_SIZE;
  state.items = [];
  els.status.textContent = 'Caricamento catalogo…';
  try {
    state.items = await getCatalog(type);
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
  els.seasons.replaceChildren();
  window.scrollTo({ top: 0 });

  try {
    const [meta, rows] = await Promise.all([getMeta(), getEpisodes()]);
    const info = meta.tv && meta.tv[id];
    const title = info ? info[0] : 'Senza titolo';
    document.title = `${title} — moviesrc`;
    els.detailTitle.textContent = title;
    els.detailMeta.textContent = info && info[1] ? info[1] : '';

    if (info && info[2]) {
      const img = document.createElement('img');
      img.src = `${IMG}${info[2]}`;
      img.alt = title;
      els.detailPoster.append(img);
    } else {
      els.detailPoster.textContent = '▶';
      els.detailPoster.classList.add('is-empty');
    }

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
        link.href = `https://${HOST}/tv/${id}/${episode.s}/${episode.e}?lang=it`;
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
  if (restore && !state.items.length) load(state.type);
}

function route() {
  const match = location.hash.match(/^#tv\/(\d+)$/);
  if (match) {
    showDetail(match[1]);
    return;
  }
  showCatalog();
}

els.tabs.forEach(tab => tab.addEventListener('click', () => {
  els.tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
  state.searchSeq++;
  state.query = '';
  els.search.value = '';
  showCatalog(false);
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  load(tab.dataset.type);
}));

els.search.addEventListener('input', async () => {
  const token = ++state.searchSeq;
  state.query = normalize(els.search.value).trim();
  state.shown = PAGE_SIZE;
  if (!state.query) {
    state.items = state.cache[state.type] || [];
    render();
    return;
  }
  els.status.textContent = 'Ricerca…';
  try {
    const [movies, shows] = await Promise.all([getCatalog('movie'), getCatalog('tv')]);
    if (token !== state.searchSeq) return;
    state.items = movies.concat(shows);
    render();
  } catch (error) {
    if (token === state.searchSeq) els.status.textContent = `Errore di ricerca: ${error.message}`;
  }
});

els.more.addEventListener('click', () => {
  state.shown += PAGE_SIZE;
  render();
});

window.addEventListener('hashchange', route);
if (location.hash.startsWith('#tv/')) route();
else load('movie');
