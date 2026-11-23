const PAGE_SIZE = 48;
const IMG_CARD = 'https://image.tmdb.org/t/p/w185';
const IMG_DETAIL = 'https://image.tmdb.org/t/p/w342';
const VIX = 'vixsrc.to';
const VIDSRC = 'vidsrc.sh';
const LANG_KEY = 'moviesrc-lang';
const RECENT_KEY = 'moviesrc-recent';

const I18N = {
  it: {
    title: 'moviesrc — film e serie TV',
    tagline: 'Catalogo film e serie TV: scegli un titolo e guardalo.',
    movies: 'Film',
    tv: 'Serie TV',
    searchPlaceholder: 'Cerca un titolo…',
    searchLabel: 'Cerca per titolo',
    loading: 'Caricamento catalogo…',
    searching: 'Ricerca…',
    results: 'risultati in film e serie',
    titles: 'titoli',
    catalog: 'catalogo',
    movieCatalog: 'film',
    tvCatalog: 'serie TV',
    empty: 'Nessun titolo trovato. Prova con un altro nome o ID.',
    loadError: 'Impossibile caricare il catalogo: ',
    searchError: 'Errore di ricerca: ',
    enSoon: 'Catalogo inglese in preparazione. Riprova tra poco.',
    watch: '▶ Guarda ↗',
    episodes: '▶ Episodi',
    back: '← Torna al catalogo',
    more: 'Mostra altri',
    continueWatching: 'Continua a guardare',
    detailLoading: 'Caricamento…',
    season: 'Stagione',
    episodeOne: '1 episodio',
    episodeMany: '{n} episodi',
    noEpisodes: 'Nessun episodio disponibile per questa serie.',
    error: 'Errore',
    untitled: 'Senza titolo',
    footer1: 'Catalogo aggiornato automaticamente ogni giorno.',
    footer2: 'Fonti: vixsrc (italiano) e vidsrc (inglese). I link si aprono in una nuova scheda.',
  },
  en: {
    title: 'moviesrc — movies and TV shows',
    tagline: 'Movie and TV catalog: pick a title and watch it.',
    movies: 'Movies',
    tv: 'TV Shows',
    searchPlaceholder: 'Search a title…',
    searchLabel: 'Search by title',
    loading: 'Loading catalog…',
    searching: 'Searching…',
    results: 'results in movies and TV shows',
    titles: 'titles',
    catalog: 'catalog',
    movieCatalog: 'movies',
    tvCatalog: 'TV shows',
    empty: 'No titles found. Try another name or ID.',
    loadError: 'Could not load the catalog: ',
    searchError: 'Search error: ',
    enSoon: 'English catalog is being prepared. Try again shortly.',
    watch: '▶ Watch ↗',
    episodes: '▶ Episodes',
    back: '← Back to catalog',
    more: 'Show more',
    continueWatching: 'Continue watching',
    detailLoading: 'Loading…',
    season: 'Season',
    episodeOne: '1 episode',
    episodeMany: '{n} episodes',
    noEpisodes: 'No episodes available for this show.',
    error: 'Error',
    untitled: 'Untitled',
    footer1: 'Catalog refreshed automatically every day.',
    footer2: 'Sources: vixsrc (Italian) and vidsrc (English). Links open in a new tab.',
  },
};

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'it' || saved === 'en') return saved;
  } catch {}
  const primary = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  return /^it\b/i.test(primary) ? 'it' : 'en';
}

const els = {
  tabs: [...document.querySelectorAll('.tab')],
  langButton: document.getElementById('lang-button'),
  langMenu: document.getElementById('lang-menu'),
  langOptions: [...document.querySelectorAll('.lang-option')],
  langCurrent: document.getElementById('lang-current'),
  search: document.getElementById('search'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  more: document.getElementById('more'),
  loading: document.getElementById('loading'),
  recent: document.getElementById('recent'),
  recentTrack: document.getElementById('recent-track'),
  catalog: document.getElementById('catalog'),
  detail: document.getElementById('detail'),
  back: document.getElementById('back'),
  detailTitle: document.getElementById('detail-title'),
  detailMeta: document.getElementById('detail-meta'),
  detailPoster: document.getElementById('detail-poster'),
  seasons: document.getElementById('seasons'),
};

const state = {
  lang: detectLang(),
  type: 'movie',
  query: '',
  shown: PAGE_SIZE,
  cache: {},
  items: [],
  meta: null,
  episodes: {},
  detailId: null,
  searchSeq: 0,
  loadSeq: 0,
};

function t(key) {
  return I18N[state.lang][key];
}

function applyI18n() {
  document.documentElement.lang = state.lang;
  document.title = t('title');
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll('[data-i18n-placeholder]')) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  }
  els.langCurrent.textContent = state.lang.toUpperCase();
  for (const option of els.langOptions) {
    const active = option.dataset.lang === state.lang;
    option.classList.toggle('is-active', active);
    option.setAttribute('aria-selected', String(active));
  }
  renderRecent();
}

function closeLangMenu() {
  els.langMenu.hidden = true;
  els.langButton.setAttribute('aria-expanded', 'false');
}

function readRecent() {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function remember(item) {
  const key = `${state.lang}:${item.mediaType}:${item.tmdb_id}`;
  const entry = {
    key,
    lang: state.lang,
    tmdb_id: item.tmdb_id,
    imdb_id: item.imdb_id || null,
    mediaType: item.mediaType,
    title: item.title || '',
    year: item.year || '',
    poster: item.poster || null,
    s: item.s,
    e: item.e,
    at: Date.now(),
  };
  const list = readRecent().filter(item => item.key !== key);
  list.unshift(entry);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 20))); } catch {}
  renderRecent();
}

function recentHref(entry) {
  if (entry.mediaType === 'movie') {
    return entry.lang === 'it'
      ? `https://${VIX}/movie/${entry.imdb_id || entry.tmdb_id}?lang=it`
      : `https://${VIDSRC}/embed/movie/${entry.tmdb_id}`;
  }
  if (!entry.s || !entry.e) return `#tv/${entry.tmdb_id}`;
  return episodeUrl(entry.tmdb_id, entry.s, entry.e);
}

function recentCard(entry) {
  const link = document.createElement('a');
  link.className = 'recent-card';
  link.href = recentHref(entry);
  if (!link.getAttribute('href').startsWith('#')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  if (entry.poster) {
    const img = document.createElement('img');
    img.src = `${IMG_CARD}${entry.poster}`;
    img.alt = '';
    img.loading = 'eager';
    img.decoding = 'async';
    link.append(img);
  } else {
    const thumb = document.createElement('span');
    thumb.className = 'recent-thumb';
    thumb.textContent = '▶';
    link.append(thumb);
  }

  const text = document.createElement('span');
  text.className = 'recent-text';
  const kind = document.createElement('span');
  kind.className = 'recent-kind';
  kind.textContent = entry.mediaType === 'tv'
    ? `${t('tv')}${entry.s ? ` · S${String(entry.s).padStart(2, '0')}E${String(entry.e).padStart(2, '0')}` : ''}`
    : t('movies');
  const title = document.createElement('span');
  title.className = 'recent-title';
  title.textContent = entry.title || t('untitled');
  text.append(kind, title);
  link.append(text);
  return link;
}

function renderRecent() {
  const entries = readRecent()
    .filter(entry => entry.lang === state.lang)
    .slice(0, 12);
  els.recent.hidden = !entries.length;
  els.recentTrack.replaceChildren(...entries.map(recentCard));
}

function providerUrl(item) {
  if (item.mediaType === 'tv') return `#tv/${item.tmdb_id}`;
  if (state.lang === 'it') return `https://${VIX}/movie/${item.imdb_id || item.tmdb_id}?lang=it`;
  return `https://${VIDSRC}/embed/movie/${item.tmdb_id}`;
}

function episodeUrl(showId, season, episode) {
  return state.lang === 'it'
    ? `https://${VIX}/tv/${showId}/${season}/${episode}?lang=it`
    : `https://${VIDSRC}/embed/tv/${showId}/${season}/${episode}`;
}

function label(item) {
  return item.title || t('untitled');
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
    img.src = `${IMG_CARD}${item.poster}`;
    img.alt = '';
    img.loading = 'eager';
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
  const url = providerUrl(item);
  const poster = posterNode(item, url, !isTv);
  if (!isTv) poster.addEventListener('click', () => remember(item));
  el.append(poster);

  const top = document.createElement('div');
  top.className = 'card-top';
  const kind = document.createElement('span');
  kind.className = 'kind';
  kind.textContent = isTv ? t('tv') : t('movies');
  top.append(kind);
  if (item.year) {
    const year = document.createElement('span');
    year.className = 'year';
    year.textContent = item.year;
    top.append(year);
  }

  const body = document.createElement('div');
  body.className = 'card-body';
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
  play.textContent = isTv ? t('episodes') : t('watch');

  if (!isTv) {
    titleLink.addEventListener('click', () => remember(item));
    play.addEventListener('click', () => remember(item));
  }

  body.append(title, play);
  el.append(top, body);
  return el;
}

function showLoading(on) {
  els.loading.hidden = !on;
  els.results.hidden = on;
  if (on) {
    els.status.textContent = '';
    els.more.hidden = true;
  }
}

function render() {
  els.results.hidden = false;
  let filtered = state.items.filter(item => matches(item, state.query)).sort(byDate);
  const count = filtered.length.toLocaleString(state.lang === 'it' ? 'it-IT' : 'en-US');
  els.status.textContent = state.query
    ? `${count} ${t('results')}`
    : `${count} ${t('titles')} · ${t('catalog')} ${state.type === 'movie' ? t('movieCatalog') : t('tvCatalog')}`;
  els.results.replaceChildren(...filtered.slice(0, state.shown).map(card));
  els.more.hidden = filtered.length <= state.shown;
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = t('empty');
    els.results.append(empty);
  }
}

function getItMeta() {
  if (!state.meta) {
    state.meta = fetch('data/meta.json')
      .then(response => response.ok ? response.json() : {})
      .catch(() => ({}));
  }
  return state.meta;
}

async function getCatalog(type) {
  const key = `${state.lang}:${type}`;
  if (state.cache[key]) return state.cache[key];
  let items;
  if (state.lang === 'en') {
    const rows = await fetch(`data/${type}-en.json`).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
    items = rows.map(row => ({
      tmdb_id: row[0],
      imdb_id: null,
      mediaType: type,
      title: row[1],
      year: row[2],
      poster: row[3],
      date: row[4],
    }));
  } else {
    const [rows, meta] = await Promise.all([
      fetch(`data/${type}.json`).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }),
      getItMeta(),
    ]);
    const group = type === 'movie' ? meta.movie : meta.tv;
    items = rows.map(row => {
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
  }
  state.cache[key] = items;
  return items;
}

async function load(type) {
  const token = ++state.loadSeq;
  state.type = type;
  state.shown = PAGE_SIZE;
  state.items = [];
  showLoading(true);
  try {
    const items = await getCatalog(type);
    if (token !== state.loadSeq) return;
    if (state.query) {
      showLoading(false);
      return;
    }
    state.items = items;
    showLoading(false);
    render();
  } catch (error) {
    if (token !== state.loadSeq) return;
    showLoading(false);
    els.status.textContent = state.lang === 'en' && /404/.test(error.message)
      ? t('enSoon')
      : t('loadError') + error.message;
  }
}

function getEpisodes() {
  if (!state.episodes[state.lang]) {
    const file = state.lang === 'it' ? 'data/episode.json' : 'data/episode-en.json';
    state.episodes[state.lang] = fetch(file)
      .then(response => response.ok ? response.json() : [])
      .catch(() => []);
  }
  return state.episodes[state.lang];
}

async function showDetail(id) {
  state.detailId = id;
  els.catalog.hidden = true;
  els.detail.hidden = false;
  els.detailTitle.textContent = t('detailLoading');
  els.detailMeta.textContent = '';
  els.detailPoster.replaceChildren();
  els.detailPoster.classList.remove('is-empty');
  els.seasons.replaceChildren();
  window.scrollTo({ top: 0 });

  try {
    let info = null;
    if (state.lang === 'en') {
      const shows = await getCatalog('tv');
      info = shows.find(show => String(show.tmdb_id) === id) || null;
    } else {
      const meta = await getItMeta();
      const entry = meta.tv && meta.tv[id];
      if (entry) info = { title: entry[0], year: entry[1], poster: entry[2] };
    }
    const rows = await getEpisodes();
    const title = info && info.title ? info.title : t('untitled');
    document.title = `${title} — moviesrc`;
    els.detailTitle.textContent = title;
    els.detailMeta.textContent = info && info.year ? info.year : '';

    if (info && info.poster) {
      const img = document.createElement('img');
      img.src = `${IMG_DETAIL}${info.poster}`;
      img.alt = title;
      els.detailPoster.append(img);
    } else {
      els.detailPoster.textContent = '▶';
      els.detailPoster.classList.add('is-empty');
    }

    const episodes = rows
      .filter(row => String(row[0]) === id)
      .map(row => state.lang === 'it' ? { s: row[2], e: row[3] } : { s: row[1], e: row[2] })
      .sort((a, b) => a.s - b.s || a.e - b.e);

    if (!episodes.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = t('noEpisodes');
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
      heading.textContent = `${t('season')} ${season}`;
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = list.length === 1 ? t('episodeOne') : t('episodeMany').replace('{n}', list.length);
      heading.append(count);
      const grid = document.createElement('div');
      grid.className = 'episode-grid';
      for (const episode of list) {
        const link = document.createElement('a');
        link.className = 'episode';
        link.href = episodeUrl(id, episode.s, episode.e);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `E${String(episode.e).padStart(2, '0')}`;
        link.title = `${t('season')} ${episode.s} — E${episode.e}`;
        link.setAttribute('aria-label', `${t('season')} ${episode.s} E${episode.e}`);
        link.addEventListener('click', () => remember({
          mediaType: 'tv',
          tmdb_id: Number(id),
          imdb_id: null,
          title,
          year: info && info.year ? info.year : '',
          poster: info && info.poster ? info.poster : null,
          s: episode.s,
          e: episode.e,
        }));
        grid.append(link);
      }
      section.append(heading, grid);
      els.seasons.append(section);
    }
  } catch (error) {
    els.detailTitle.textContent = t('error');
    els.detailMeta.textContent = error.message;
  }
}

function showCatalog(restore = true) {
  state.detailId = null;
  els.detail.hidden = true;
  els.catalog.hidden = false;
  document.title = t('title');
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

async function setLang(lang) {
  if (lang === state.lang) return;
  state.lang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  applyI18n();
  state.searchSeq++;
  state.query = '';
  els.search.value = '';
  state.shown = PAGE_SIZE;
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  showCatalog(false);
  await load(state.type);
}

els.langButton.addEventListener('click', event => {
  event.stopPropagation();
  const open = els.langMenu.hidden;
  els.langMenu.hidden = !open;
  els.langButton.setAttribute('aria-expanded', String(open));
});

els.langOptions.forEach(option => option.addEventListener('click', () => {
  closeLangMenu();
  setLang(option.dataset.lang);
}));

document.addEventListener('click', event => {
  if (!event.target.closest('.lang-select')) closeLangMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLangMenu();
});

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

els.search.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  els.search.blur();
});

els.search.addEventListener('input', async () => {
  const token = ++state.searchSeq;
  state.query = normalize(els.search.value).trim();
  state.shown = PAGE_SIZE;
  if (!state.query) {
    state.items = state.cache[`${state.lang}:${state.type}`] || [];
    render();
    return;
  }
  showLoading(false);
  els.status.textContent = t('searching');
  try {
    const [movies, shows] = await Promise.all([getCatalog('movie'), getCatalog('tv')]);
    if (token !== state.searchSeq) return;
    state.items = movies.concat(shows);
    render();
  } catch (error) {
    if (token === state.searchSeq) els.status.textContent = t('searchError') + error.message;
  }
});

els.more.addEventListener('click', () => {
  state.shown += PAGE_SIZE;
  render();
});

applyI18n();
window.addEventListener('hashchange', route);
if (location.hash.startsWith('#tv/')) route();
else load('movie');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

// iOS ignora user-scalable=no: blocca il pinch-zoom a livello di gesture.
for (const eventName of ['gesturestart', 'gesturechange']) {
  document.addEventListener(eventName, event => event.preventDefault(), { passive: false });
}
