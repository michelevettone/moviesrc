const PAGE_SIZE = 48;
const IMG = 'https://image.tmdb.org/t/p/w342';
const els = {
  tabs: [...document.querySelectorAll('.tab')],
  search: document.getElementById('search'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  more: document.getElementById('more'),
  domain: document.getElementById('domain'),
};

const state = { type: 'movie', query: '', shown: PAGE_SIZE, cache: {}, items: [], meta: null };

function embedDomain() {
  const raw = els.domain.value.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  try {
    const url = new URL(`https://${raw}`);
    return /^[a-z0-9.-]+$/i.test(url.hostname) ? url.hostname : 'vixsrc.to';
  } catch {
    return 'vixsrc.to';
  }
}

function embedUrl(item) {
  const host = embedDomain();
  const id = item.imdb_id || item.tmdb_id;
  if (state.type === 'movie') return `https://${host}/movie/${id}`;
  if (state.type === 'tv') return `https://${host}/tv/${id}`;
  return `https://${host}/tv/${item.tmdb_id}/${item.s}/${item.e}`;
}

function episodeBadge(item) {
  return `S${String(item.s).padStart(2, '0')}E${String(item.e).padStart(2, '0')}`;
}

function label(item) {
  if (item.title) return item.title;
  return state.type === 'episode' ? `TMDB ${item.tmdb_id} · ${episodeBadge(item)}` : `TMDB ${item.tmdb_id}`;
}

function matches(item, q) {
  if (!q) return true;
  const haystack = [item.title, item.year, item.tmdb_id, item.imdb_id,
    item.s && item.e && `s${item.s}e${item.e}`,
    item.s && item.e && episodeBadge(item)]
    .filter(Boolean).join(' ').toLowerCase().replace(/tt(\d+)/, '$1');
  return haystack.includes(q.replace(/^tt/, ''));
}

function posterNode(item, href) {
  const link = document.createElement('a');
  link.className = 'poster';
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
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
  const url = embedUrl(item);
  el.append(posterNode(item, url));

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
  titleLink.href = url;
  titleLink.target = '_blank';
  titleLink.rel = 'noopener noreferrer';
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
  play.href = url;
  play.target = '_blank';
  play.rel = 'noopener noreferrer';
  play.textContent = '▶ Guarda ↗';

  body.append(top, title, meta, links, play);
  el.append(body);
  return el;
}

function render() {
  const filtered = state.items.filter(item => matches(item, state.query));
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

els.tabs.forEach(tab => tab.addEventListener('click', () => {
  els.tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
  load(tab.dataset.type);
}));

els.search.addEventListener('input', () => {
  state.query = els.search.value.trim().toLowerCase();
  state.shown = PAGE_SIZE;
  render();
});

els.more.addEventListener('click', () => {
  state.shown += PAGE_SIZE;
  render();
});

const savedDomain = localStorage.getItem('moviesrc-domain');
if (savedDomain) els.domain.value = savedDomain;
els.domain.addEventListener('change', () => {
  const domain = els.domain.value.trim();
  localStorage.setItem('moviesrc-domain', domain);
  render();
});

load('movie');
