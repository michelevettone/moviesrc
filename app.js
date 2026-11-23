const PAGE_SIZE = 48;
const els = {
  tabs: [...document.querySelectorAll('.tab')],
  search: document.getElementById('search'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  more: document.getElementById('more'),
  domain: document.getElementById('domain'),
};

const state = { type: 'movie', query: '', shown: PAGE_SIZE, cache: {}, items: [] };

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
  if (state.type === 'tv') return `https://${host}/tv/${id}/${item.s}/${item.e}`;
  return `https://${host}/tv/${item.tmdb_id}/${item.s}/${item.e}`;
}

function label(item) {
  if (state.type === 'episode') return `S${String(item.s).padStart(2, '0')}E${String(item.e).padStart(2, '0')}`;
  return item.imdb_id || `TMDB ${item.tmdb_id}`;
}

function matches(item, q) {
  if (!q) return true;
  const haystack = [item.tmdb_id, item.imdb_id, item.s && item.e && `s${item.s}e${item.e}`, item.s && item.e && `S${String(item.s).padStart(2, '0')}E${String(item.e).padStart(2, '0')}`]
    .filter(Boolean).join(' ').toLowerCase().replace(/tt(\d+)/, '$1');
  return haystack.includes(q.replace(/^tt/, ''));
}

function card(item) {
  const el = document.createElement('article');
  el.className = 'card';
  const top = document.createElement('div');
  top.className = 'card-top';
  const kind = document.createElement('span');
  kind.className = 'kind';
  kind.textContent = state.type === 'movie' ? 'Film' : state.type === 'tv' ? 'Serie' : 'Episodio';
  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = embedUrl(item);
  titleLink.target = '_blank';
  titleLink.rel = 'noopener noreferrer';
  titleLink.className = 'title-link';
  titleLink.textContent = label(item);
  title.append(titleLink);
  top.append(kind, title);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = state.type === 'episode'
    ? `tmdb ${item.tmdb_id}${item.imdb_id ? ` · ${item.imdb_id}` : ''} · S${item.s}E${item.e}`
    : `tmdb ${item.tmdb_id} · ${item.imdb_id || 'no IMDb'}`;

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
  play.href = embedUrl(item);
  play.target = '_blank';
  play.rel = 'noopener noreferrer';
  play.textContent = '▶ Guarda ↗';

  el.append(top, meta, links, play);
  return el;
}

function render() {
  const filtered = state.items.filter(item => matches(item, state.query));
  els.status.textContent = `${filtered.length.toLocaleString('it-IT')} elementi · catalogo ${state.type} · lingua it`;
  els.results.replaceChildren(...filtered.slice(0, state.shown).map(card));
  els.more.hidden = filtered.length <= state.shown;
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Nessun elemento trovato. Prova con un altro ID.';
    els.results.append(empty);
  }
}

async function load(type) {
  state.type = type;
  state.shown = PAGE_SIZE;
  state.items = [];
  els.status.textContent = 'Caricamento catalogo…';
  try {
    if (!state.cache[type]) {
      const response = await fetch(`data/${type}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      state.cache[type] = rows.map(row => type === 'episode'
        ? { tmdb_id: row[0], imdb_id: row[1], s: row[2], e: row[3] }
        : { tmdb_id: row[0], imdb_id: row[1] });
    }
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
