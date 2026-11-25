const PAGE_SIZE = 48;
const IMG_CARD = 'https://image.tmdb.org/t/p/w185';
const IMG_DETAIL = 'https://image.tmdb.org/t/p/w342';
const VIX = 'vixsrc.to';
const VIDSRC = 'vidsrc.sh';
const VIDLINK = 'vidlink.pro';
const FILMEZ = 'filmez.club';
const WORKER = 'https://moviesrc.michelevettone.com';
const LANG_KEY = 'moviesrc-lang';
const RECENT_KEY = 'moviesrc-recent';
const BROWSER_KEY = 'moviesrc-browser';
const INSTALL_KEY = 'moviesrc-install-dismissed';
const SCRIPTABLE_STORE = 'https://apps.apple.com/app/scriptable/id1405459188';
const BROWSERS = new Set(['chrome', 'safari', 'brave', 'brave-beta', 'firefox', 'edge', 'wvc', 'system']);
const BROWSER_LABELS = { chrome: 'Chrome', safari: 'Safari', brave: 'Brave', 'brave-beta': 'Brave Beta', firefox: 'Firefox', edge: 'Microsoft Edge', wvc: 'Web Video Cast' };

const I18N = {
  it: {
    title: 'moviesrc — film e serie TV',
    tagline: 'Catalogo film e serie TV: scegli un titolo e guardalo.',
    movies: 'Film',
    tv: 'Serie TV',
    searchPlaceholder: 'Cerca un titolo…',
    searchLabel: 'Cerca per titolo',
    clearSearch: 'Cancella ricerca',
    settings: 'Impostazioni',
    openWith: 'Apri i link con',
    browserHint: 'Su iOS i link esterni si aprono con l’app scelta. Se non è installata, si usa il browser di sistema.',
    systemBrowser: 'Browser di sistema',
    installTitle: 'Installa moviesrc',
    installBody: 'Tocca {icon} Condividi e scegli Aggiungi alla schermata Home.',
    installAndroid: 'Apri il menu del browser e scegli Installa app (o Aggiungi alla schermata Home).',
    installDesktop: 'Installa moviesrc come app.',
    installNow: 'Installa',
    installHow: 'Come si fa',
    installHelpTitle: 'Aggiungi alla schermata Home',
    installHelpIOS: '1. Tocca {icon} Condividi.\n2. Scegli Aggiungi alla schermata Home.\n3. Tocca Aggiungi.',
    installHelpAndroid: '1. Apri il menu ⋮ del browser.\n2. Scegli Installa app o Aggiungi alla schermata Home.',
    installHelpDesktop: 'Clicca l’icona Installa nella barra degli indirizzi del browser.',
    installClose: 'Chiudi',
    scriptLabel: 'Scriptable',
    scriptWhy: 'Niente ads: risolve il flusso diretto e lo apre nel browser (AirPlay) o VLC.',
    scriptAdd: 'Aggiungi script',
    scriptModalTitle: 'Aggiungi script',
    scriptModalBody: 'Script copiato. Nella pagina che si apre, incolla e rinomina Moviesrc. Se Scriptable non è installato, OK apre l’App Store.',
    scriptModalError: 'Copia non riuscita. Riprova.',
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
    watch: '▶ Guarda',
    watchTitle: 'Guarda',
    watchOpen: 'Apri',
    watchScriptable: 'Senza ads (Scriptable)',
    watchFilmez: 'Filmez',
    watchCancel: 'Annulla',
    details: '▶ Dettagli',
    trailer: '▶ Trailer',
    episodes: '▶ Episodi',
    plotLoading: 'Caricamento trama…',
    plotUnavailable: 'Trama non disponibile.',
    back: '← Torna al catalogo',
    more: 'Mostra altri',
    continueWatching: 'Continua a guardare',
    resumeLast: '▶ Riprendi da {ep}',
    resumeNext: '▶ Continua con {ep}',
    lastWatched: 'Ultimo aperto',
    detailLoading: 'Caricamento…',
    season: 'Stagione',
    episodeOne: '1 episodio',
    episodeMany: '{n} episodi',
    noEpisodes: 'Nessun episodio disponibile per questa serie.',
    error: 'Errore',
    untitled: 'Senza titolo',
    footer1: 'Catalogo aggiornato automaticamente ogni giorno.',
    footer2: 'Fonti: vixsrc (italiano), vidsrc (inglese), VidLink (alternativa inglese) e Filmez (film, solo italiano). I link si aprono in una nuova scheda.',
  },
  en: {
    title: 'moviesrc — movies and TV shows',
    tagline: 'Movie and TV catalog: pick a title and watch it.',
    movies: 'Movies',
    tv: 'TV Shows',
    searchPlaceholder: 'Search a title…',
    searchLabel: 'Search by title',
    clearSearch: 'Clear search',
    settings: 'Settings',
    openWith: 'Open links with',
    browserHint: 'On iOS external links open in the selected app. If it is not installed, the system browser is used.',
    systemBrowser: 'System browser',
    installTitle: 'Install moviesrc',
    installBody: 'Tap {icon} Share and choose Add to Home Screen.',
    installAndroid: 'Open the browser menu and choose Install app (or Add to Home Screen).',
    installDesktop: 'Install moviesrc as an app.',
    installNow: 'Install',
    installHow: 'How to',
    installHelpTitle: 'Add to Home Screen',
    installHelpIOS: '1. Tap {icon} Share.\n2. Choose Add to Home Screen.\n3. Tap Add.',
    installHelpAndroid: '1. Open the browser ⋮ menu.\n2. Choose Install app or Add to Home Screen.',
    installHelpDesktop: 'Click the Install icon in the browser’s address bar.',
    installClose: 'Close',
    scriptLabel: 'Scriptable',
    scriptWhy: 'No ads: resolves the direct stream and opens it in the browser (AirPlay) or VLC.',
    scriptAdd: 'Add script',
    scriptModalTitle: 'Add script',
    scriptModalBody: 'Script copied. In the page that opens, paste and rename it Moviesrc. If Scriptable is not installed, OK opens the App Store.',
    scriptModalError: 'Copy failed. Try again.',
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
    watch: '▶ Watch',
    watchTitle: 'Watch',
    watchOpen: 'Open',
    watchScriptable: 'No ads (Scriptable)',
    watchFilmez: 'Filmez',
    watchCancel: 'Cancel',
    vidlink: '▶ VidLink ↗',
    vidlinkLoading: 'VidLink',
    details: '▶ Details',
    trailer: '▶ Trailer',
    episodes: '▶ Episodes',
    plotLoading: 'Loading plot…',
    plotUnavailable: 'Plot unavailable.',
    back: '← Back to catalog',
    more: 'Show more',
    continueWatching: 'Continue watching',
    resumeLast: '▶ Resume {ep}',
    resumeNext: '▶ Continue with {ep}',
    lastWatched: 'Last opened',
    detailLoading: 'Loading…',
    season: 'Season',
    episodeOne: '1 episode',
    episodeMany: '{n} episodes',
    noEpisodes: 'No episodes available for this show.',
    error: 'Error',
    untitled: 'Untitled',
    footer1: 'Catalog refreshed automatically every day.',
    footer2: 'Sources: vixsrc (Italian), vidsrc (English), VidLink (English alternative) and Filmez (movies, Italian only). Links open in a new tab.',
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
  settingsButton: document.getElementById('settings-button'),
  settingsMenu: document.getElementById('settings-menu'),
  browserSetting: document.getElementById('browser-setting'),
  scriptAdd: document.getElementById('script-add'),
  scriptModal: document.getElementById('script-modal'),
  scriptModalOk: document.getElementById('script-modal-ok'),
  scriptModalBody: document.getElementById('script-modal-body'),
  installBanner: document.getElementById('install-banner'),
  installBody: document.getElementById('install-body'),
  installClose: document.getElementById('install-close'),
  installAction: document.getElementById('install-action'),
  installHelp: document.getElementById('install-help'),
  installHelpBody: document.getElementById('install-help-body'),
  installHelpOk: document.getElementById('install-help-ok'),
  browserSelect: document.getElementById('browser-select'),
  appVersion: document.getElementById('app-version'),
  search: document.getElementById('search'),
  searchClear: document.getElementById('search-clear'),
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
  detailWatch: document.getElementById('detail-watch'),
  detailVidlink: document.getElementById('detail-vidlink'),
  watchMenu: document.getElementById('watch-menu'),
  watchSubtitle: document.getElementById('watch-subtitle'),
  watchOpen: document.getElementById('watch-open'),
  watchScriptable: document.getElementById('watch-scriptable'),
  watchFilmez: document.getElementById('watch-filmez'),
  watchCancel: document.getElementById('watch-cancel'),
  detailTrailerWrap: document.getElementById('detail-trailer-wrap'),

  detailLast: document.getElementById('detail-last'),
  detailResume: document.getElementById('detail-resume'),
  detailOverview: document.getElementById('detail-overview'),
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
  routeHash: null,
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
  for (const el of document.querySelectorAll('[data-i18n-aria]')) {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  }
  els.langCurrent.textContent = state.lang.toUpperCase();
  for (const option of els.langOptions) {
    const active = option.dataset.lang === state.lang;
    option.classList.toggle('is-active', active);
    option.setAttribute('aria-selected', String(active));
  }
  renderRecent();
  updateInstallBannerText();
}

let deferredPrompt = null;
const SHARE_ICON = '<svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11M8 7l4-4 4 4"/><path d="M6 10H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1"/></svg>';

function updateInstallBannerText() {
  if (!els.installBanner || els.installBanner.hidden) return;
  const ua = navigator.userAgent;
  let key = 'installBody';
  if (/Android/i.test(ua)) key = deferredPrompt ? 'installDesktop' : 'installAndroid';
  else if (!isIOS() && deferredPrompt) key = 'installDesktop';
  const text = t(key);
  if (key === 'installBody') els.installBody.innerHTML = text.replace('{icon}', SHARE_ICON);
  else els.installBody.textContent = text;
  els.installAction.textContent = deferredPrompt ? t('installNow') : t('installHow');
}

function showInstallBanner() {
  if (isStandalone()) return;
  if (!isIOS() && !/Android/i.test(navigator.userAgent) && !deferredPrompt) return;
  try { if (localStorage.getItem(INSTALL_KEY) === '1') return; } catch {}
  els.installBanner.hidden = false;
  updateInstallBannerText();
}

function hideInstallBanner(dismiss) {
  els.installBanner.hidden = true;
  if (dismiss) {
    try { localStorage.setItem(INSTALL_KEY, '1'); } catch {}
  }
}

async function handleInstallAction() {
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (result && result.outcome === 'accepted') hideInstallBanner(true);
      else updateInstallBannerText();
      return;
    } catch {
      deferredPrompt = null;
    }
  }
  openInstallHelp();
}

function openInstallHelp() {
  const ua = navigator.userAgent;
  let key = 'installHelpDesktop';
  if (isIOS()) key = 'installHelpIOS';
  else if (/Android/i.test(ua)) key = 'installHelpAndroid';
  const text = t(key);
  if (key === 'installHelpIOS') els.installHelpBody.innerHTML = text.replace('{icon}', SHARE_ICON);
  else els.installHelpBody.textContent = text;
  els.installHelp.hidden = false;
  document.body.classList.add('modal-open');
  els.installHelpOk.focus();
}

function closeInstallHelp() {
  els.installHelp.hidden = true;
  document.body.classList.remove('modal-open');
}

function closeLangMenu() {
  els.langMenu.hidden = true;
  els.langButton.setAttribute('aria-expanded', 'false');
}

function getBrowser() {
  try {
    const saved = localStorage.getItem(BROWSER_KEY);
    return BROWSERS.has(saved) ? saved : 'chrome';
  } catch {
    return 'chrome';
  }
}

function currentBrowserLabel() {
  const ua = navigator.userAgent;
  if (/Brave/i.test(ua)) return 'Brave';
  if (/EdgiOS|Edg\//i.test(ua)) return 'Microsoft Edge';
  if (/OPiOS|OPR\//i.test(ua)) return 'Opera';
  if (/CriOS/i.test(ua)) return 'Chrome';
  if (/FxiOS/i.test(ua)) return 'Firefox';
  if (/Chrome\//i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  return t('systemBrowser');
}

function browserLabel() {
  if (isIOS() && isStandalone()) {
    const key = getBrowser();
    return key === 'system' ? t('systemBrowser') : (BROWSER_LABELS[key] || key);
  }
  return currentBrowserLabel();
}

function closeSettings() {
  els.settingsMenu.hidden = true;
  els.settingsButton.setAttribute('aria-expanded', 'false');
}

function braveQuery(url) {
  return encodeURI(url).replace(/[?=&]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function browserScheme(url, browser) {
  if (browser === 'chrome') return url.replace(/^https:/, 'googlechromes:');
  if (browser === 'safari') return `x-safari-${url}`;
  if (browser === 'brave') return `brave://open-url?url=${braveQuery(url)}`;
  if (browser === 'brave-beta') return `brave-beta://open-url?url=${braveQuery(url)}`;
  if (browser === 'firefox') return `firefox://open-url?url=${braveQuery(url)}`;
  if (browser === 'edge') return url.replace(/^https:/, 'microsoft-edge-https:');
  if (browser === 'wvc') return `wvc-x-callback://open?url=${encodeURIComponent(url)}`;
  return null;
}

function launchBrowser(url, browser) {
  const scheme = browserScheme(url, browser);
  if (!scheme) return false;

  let fallback = setTimeout(() => { location.href = url; }, 1800);
  const clearFallback = () => {
    if (!document.hidden) return;
    clearTimeout(fallback);
    document.removeEventListener('visibilitychange', clearFallback);
  };
  document.addEventListener('visibilitychange', clearFallback);
  location.href = scheme;
  return true;
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
  if (entry.mediaType === 'movie') return `#movie/${entry.tmdb_id}`;
  return `#tv/${entry.tmdb_id}`;
}

function recentCard(entry) {
  const link = document.createElement('a');
  link.className = 'recent-card';
  link.href = recentHref(entry);
  if (!link.getAttribute('href').startsWith('#')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.referrerPolicy = 'no-referrer';
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

let scriptText = '';

function launchScriptable(url) {
  let left = false;
  const onVisibility = () => { if (document.hidden) left = true; };
  document.addEventListener('visibilitychange', onVisibility);
  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibility);
    if (!left && !document.hidden) location.href = SCRIPTABLE_STORE;
  }, 1500);
  location.href = url;
}

// Lancia lo script Scriptable: legge l'HTML come testo, niente RTF.
function playWithScriptable(url) {
  if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
  launchScriptable(`scriptable:///run?scriptName=Moviesrc&url=${encodeURIComponent(url)}`);
}

let watchContext = null;
let watchMenuOpen = false;

function openProvider(url) {
  if (!url) return;
  if (isIOS() && isStandalone()) {
    const browser = getBrowser();
    if (browser !== 'system' && !(browser === 'chrome' && /CriOS/.test(navigator.userAgent))) {
      launchBrowser(url, browser);
      return;
    }
  }
  window.open(url, '_blank', 'noopener');
}

function openWatchMenu(context) {
  watchContext = context;
  watchMenuOpen = true;
  els.watchSubtitle.textContent = context.subtitle || '';
  els.watchOpen.textContent = `${t('watchOpen')} (${browserLabel()})`;
  els.watchScriptable.hidden = !(isIOS() && state.lang === 'it');
  els.watchFilmez.hidden = !context.filmezUrl;
  els.watchMenu.hidden = false;
  document.body.classList.add('modal-open');
  els.watchOpen.focus();
}

function closeWatchMenu() {
  els.watchMenu.hidden = true;
  document.body.classList.remove('modal-open');
  watchMenuOpen = false;
  watchContext = null;
}

function chooseWatch(kind) {
  const context = watchContext;
  if (!context) return;
  closeWatchMenu();
  if (context.onChoose) context.onChoose();
  if (kind === 'open') openProvider(context.providerUrl);
  else if (kind === 'scriptable') playWithScriptable(context.providerUrl);
  else if (kind === 'filmez') openProvider(context.filmezUrl);
}

async function loadScriptText() {
  if (scriptText) return scriptText;
  const response = await fetch('scriptable/Moviesrc.script?v=7', { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  scriptText = await response.text();
  return scriptText;
}

function openScriptModal() {
  els.scriptModal.hidden = false;
  document.body.classList.add('modal-open');
  els.scriptModalOk.focus();
}

function closeScriptModal(openApp) {
  els.scriptModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (openApp) launchScriptable('scriptable:///add');
}

function addScript() {
  els.scriptModalBody.textContent = t('scriptModalBody');
  openScriptModal();
  const fail = () => {
    els.scriptModalBody.textContent = t('scriptModalError');
  };
  const copy = text => {
    if (!navigator.clipboard) { fail(new Error('Clipboard')); return; }
    navigator.clipboard.writeText(text).catch(fail);
  };
  if (scriptText) { copy(scriptText); return; }
  loadScriptText().then(text => {
    scriptText = text;
    copy(text);
  }).catch(fail);
}

if (isIOS()) {
  fetch('scriptable/Moviesrc.script?v=7')
    .then(response => response.ok ? response.text() : '')
    .then(text => { scriptText = text; })
    .catch(() => {});
}

const VIDLINK_CACHE = new Map();

async function vidlinkAvailable(item) {
  const id = String(item.tmdb_id);
  if (VIDLINK_CACHE.has(id)) return VIDLINK_CACHE.get(id);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${WORKER}/providers/movie/${id}`, { signal: controller.signal });
    if (!response.ok) return null;
    const data = await response.json();
    const available = data.vidlink === true;
    VIDLINK_CACHE.set(id, available);
    return available;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const FILMEZ_CACHE = new Map();

function filmzKey(value) {
  const text = new DOMParser().parseFromString(String(value ?? ''), 'text/html').body.textContent;
  return normalize(text).replace(/[^a-z0-9]+/g, ' ').trim();
}

function filmzEntry(row) {
  const key = filmzKey(row.title && row.title.rendered);
  const match = key.match(/^(.*?)\s+((?:19|20)\d{2})(?:\s+(?:sub\s+)?ita)?$/);
  let link = null;
  try {
    const url = new URL(row.link);
    if (url.protocol === 'https:' && url.hostname === FILMEZ) link = url.href;
  } catch {}
  return { link, title: match ? match[1] : key, year: match ? Number(match[2]) : 0 };
}

async function filmzDirectLink(item) {
  const id = String(item.tmdb_id);
  if (FILMEZ_CACHE.has(id)) return FILMEZ_CACHE.get(id);
  const query = filmzKey(item.title);
  if (query.length < 2) return null;
  const params = new URLSearchParams({
    search: query,
    search_columns: 'post_title',
    per_page: '10',
    _fields: 'link,title',
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`https://${FILMEZ}/wp-json/wp/v2/movie?${params}`, { signal: controller.signal });
    if (!response.ok) return null;
    const rows = await response.json();
    const year = Number(item.year) || 0;
    const queryWords = new Set(query.split(' '));
    let best = null;
    for (const row of rows) {
      const entry = filmzEntry(row);
      if (!entry.link) continue;
      const diff = year && entry.year ? Math.abs(entry.year - year) : 0;
      if (year && entry.year && diff > 1) continue;
      const words = new Set(entry.title.split(' '));
      const shared = [...queryWords].filter(word => words.has(word)).length;
      const jaccard = shared / new Set([...queryWords, ...words]).size;
      const score = entry.title === query ? 3
        : entry.title.startsWith(`${query} `) || query.startsWith(`${entry.title} `) ? 2
        : jaccard >= 0.6 ? 1
        : 0;
      if (!score) continue;
      const rank = score * 10 - diff;
      if (!best || rank > best.rank) best = { rank, link: entry.link };
    }
    const link = best ? best.link : null;
    FILMEZ_CACHE.set(id, link);
    return link;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function isIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function externalLink(url) {
  return url;
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
    link.referrerPolicy = 'no-referrer';
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
  const url = isTv ? `#tv/${item.tmdb_id}` : `#movie/${item.tmdb_id}`;
  const poster = posterNode(item, url, false);
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
  titleLink.className = 'title-link';
  titleLink.textContent = label(item);
  title.append(titleLink);

  const play = document.createElement('a');
  play.className = 'play';
  play.href = url;
  play.textContent = isTv ? t('episodes') : t('details');

  body.append(title, play);
  el.append(top, body);
  return el;
}

let trailerFrame = null;

function removeTrailerFrame() {
  if (trailerFrame) {
    trailerFrame.remove();
    trailerFrame = null;
  }
}

function resetTrailer() {
  els.detailTrailerWrap.hidden = true;
  removeTrailerFrame();
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
  closeWatchMenu();
  state.detailId = `tv:${id}`;
  document.body.classList.add('detail-open');
  els.catalog.hidden = true;
  els.detail.hidden = false;
  els.detailTitle.textContent = t('detailLoading');
  els.detailMeta.textContent = '';
  els.detailPoster.replaceChildren();
  els.detailPoster.classList.remove('is-empty');
  els.detailWatch.hidden = true;
  els.detailWatch.removeAttribute('href');
  els.detailWatch.onclick = null;
  els.detailOverview.hidden = true;
  els.detailOverview.textContent = '';
  resetTrailer();
  els.detailLast.hidden = true;
  els.detailLast.removeAttribute('href');
  els.detailLast.onclick = null;
  els.detailLast.textContent = '';
  els.detailResume.hidden = true;
  els.detailResume.removeAttribute('href');
  els.detailResume.onclick = null;
  els.detailResume.textContent = '';
  els.detailVidlink.hidden = true;
  els.detailVidlink.removeAttribute('href');
  els.detailVidlink.removeAttribute('aria-busy');
  els.detailVidlink.removeAttribute('aria-disabled');
  els.detailVidlink.classList.remove('is-loading');
  els.detailVidlink.textContent = '';
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

    const previous = readRecent().find(entry =>
      entry.lang === state.lang && entry.mediaType === 'tv' && String(entry.tmdb_id) === id);
    let lastEpisode = previous && previous.s && previous.e
      ? { s: Number(previous.s), e: Number(previous.e) }
      : null;

    function badge(episode) {
      return `S${String(episode.s).padStart(2, '0')}E${String(episode.e).padStart(2, '0')}`;
    }

    function setResume(last) {
      const index = last ? episodes.findIndex(episode => episode.s === last.s && episode.e === last.e) : -1;
      const current = index >= 0 ? episodes[index] : null;
      const next = index >= 0 ? episodes[index + 1] : null;

      els.detailLast.hidden = !current;
      if (current) {
        els.detailLast.href = externalLink(episodeUrl(id, current.s, current.e));
        els.detailLast.textContent = t('resumeLast').replace('{ep}', badge(current));
        els.detailLast.onclick = event => { event.preventDefault(); openEpisodeWatch(current); };
      }

      els.detailResume.hidden = !next;
      if (next) {
        els.detailResume.href = externalLink(episodeUrl(id, next.s, next.e));
        els.detailResume.textContent = t('resumeNext').replace('{ep}', badge(next));
        els.detailResume.onclick = event => { event.preventDefault(); openEpisodeWatch(next); };
      }
    }

    function openEpisodeWatch(episode) {
      openWatchMenu({
        kind: 'episode',
        subtitle: `${title} · ${badge(episode)}`,
        providerUrl: externalLink(episodeUrl(id, episode.s, episode.e)),
        filmezUrl: null,
        onChoose: () => {
          remember({
            mediaType: 'tv',
            tmdb_id: Number(id),
            imdb_id: null,
            title,
            year: info && info.year ? info.year : '',
            poster: info && info.poster ? info.poster : null,
            s: episode.s,
            e: episode.e,
          });
          lastEpisode = episode;
          markCurrent(episode);
          setResume(episode);
        },
      });
    }

    function markCurrent(episode) {
      for (const link of els.seasons.querySelectorAll('.episode.is-current')) {
        link.classList.remove('is-current');
        link.removeAttribute('aria-current');
      }
      if (!episode) return;
      const link = els.seasons.querySelector(`.episode[data-s="${episode.s}"][data-e="${episode.e}"]`);
      if (link) {
        link.classList.add('is-current');
        link.setAttribute('aria-current', 'true');
        link.title = `${t('season')} ${episode.s} — E${episode.e} · ${t('lastWatched')}`;
      }
    }

    setResume(lastEpisode);

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
        link.href = externalLink(episodeUrl(id, episode.s, episode.e));
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.referrerPolicy = 'no-referrer';
        link.textContent = `E${String(episode.e).padStart(2, '0')}`;
        link.title = `${t('season')} ${episode.s} — E${episode.e}`;
        link.setAttribute('aria-label', `${t('season')} ${episode.s} E${episode.e}`);
        link.dataset.s = episode.s;
        link.dataset.e = episode.e;
        if (lastEpisode && lastEpisode.s === episode.s && lastEpisode.e === episode.e) {
          link.classList.add('is-current');
          link.setAttribute('aria-current', 'true');
          link.title = `${t('season')} ${episode.s} — E${episode.e} · ${t('lastWatched')}`;
        }
        link.addEventListener('click', event => {
          event.preventDefault();
          openEpisodeWatch(episode);
        });
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

async function showMovieDetail(id) {
  closeWatchMenu();
  const movieKey = `movie:${id}`;
  let movieFilmezLink = null;
  state.detailId = movieKey;
  document.body.classList.add('detail-open');
  els.catalog.hidden = true;
  els.detail.hidden = false;
  els.detailTitle.textContent = t('detailLoading');
  els.detailMeta.textContent = '';
  els.detailPoster.replaceChildren();
  els.detailPoster.classList.remove('is-empty');
  els.detailWatch.hidden = true;
  els.detailWatch.removeAttribute('href');
  els.detailWatch.onclick = null;
  els.detailVidlink.hidden = true;
  els.detailVidlink.removeAttribute('href');
  els.detailVidlink.removeAttribute('aria-busy');
  els.detailVidlink.removeAttribute('aria-disabled');
  els.detailVidlink.classList.remove('is-loading');
  els.detailVidlink.textContent = '';
  els.detailLast.hidden = true;
  els.detailResume.hidden = true;
  els.detailOverview.hidden = true;
  els.detailOverview.textContent = '';
  resetTrailer();
  els.seasons.replaceChildren();
  window.scrollTo({ top: 0 });

  try {
    const movies = await getCatalog('movie');
    if (state.detailId !== movieKey) return;
    const item = movies.find(movie => String(movie.tmdb_id) === id) || null;
    const title = item && item.title ? item.title : t('untitled');
    document.title = `${title} — moviesrc`;
    els.detailTitle.textContent = title;
    els.detailMeta.textContent = item && item.year ? item.year : '';

    if (item && item.poster) {
      const img = document.createElement('img');
      img.src = `${IMG_DETAIL}${item.poster}`;
      img.alt = title;
      els.detailPoster.append(img);
    } else {
      els.detailPoster.textContent = '▶';
      els.detailPoster.classList.add('is-empty');
    }

    if (item) {
      const watchUrl = providerUrl(item);
      els.detailWatch.hidden = false;
      els.detailWatch.href = externalLink(watchUrl);
      els.detailWatch.textContent = t('watch');
      els.detailWatch.onclick = event => {
        event.preventDefault();
        openWatchMenu({
          kind: 'movie',
          id: movieKey,
          subtitle: [title, item.year].filter(Boolean).join(' · '),
          providerUrl: watchUrl,
          filmezUrl: movieFilmezLink,
          onChoose: () => remember(item),
        });
      };
    }

    if (item && state.lang === 'it' && item.title) {
      filmzDirectLink(item).then(link => {
        if (state.detailId !== movieKey) return;
        movieFilmezLink = link;
        if (watchMenuOpen && watchContext && watchContext.kind === 'movie' && watchContext.id === movieKey) {
          watchContext.filmezUrl = link;
          els.watchFilmez.hidden = !link;
        }
      });
    }

    if (item && state.lang === 'en') {
      els.detailVidlink.hidden = false;
      els.detailVidlink.removeAttribute('href');
      els.detailVidlink.setAttribute('aria-busy', 'true');
      els.detailVidlink.setAttribute('aria-disabled', 'true');
      els.detailVidlink.classList.add('is-loading');
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      els.detailVidlink.textContent = t('vidlinkLoading');
      els.detailVidlink.append(spinner);
      vidlinkAvailable(item).then(available => {
        if (state.detailId !== movieKey) return;
        els.detailVidlink.classList.remove('is-loading');
        els.detailVidlink.removeAttribute('aria-busy');
        els.detailVidlink.removeAttribute('aria-disabled');
        if (!available) {
          els.detailVidlink.hidden = true;
          els.detailVidlink.textContent = '';
          return;
        }
        els.detailVidlink.href = `https://${VIDLINK}/movie/${item.tmdb_id}`;
        els.detailVidlink.textContent = t('vidlink');
      });
    }

    els.detailOverview.hidden = false;
    els.detailOverview.textContent = t('plotLoading');

    const response = await fetch(`${WORKER}/tmdb/movie/${id}?lang=${state.lang}`);
    if (state.detailId !== movieKey) return;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const meta = [item && item.year, data.runtime ? `${data.runtime} min` : '', (data.genres || []).join(', ')]
      .filter(Boolean).join(' · ');
    if (meta) els.detailMeta.textContent = meta;
    els.detailOverview.textContent = data.overview || t('plotUnavailable');
    if (data.trailer && data.trailer.key && data.trailer.official) {
      removeTrailerFrame();
      const origin = encodeURIComponent(location.origin);
      const player = `https://www.youtube-nocookie.com/embed/${data.trailer.key}?playsinline=1&rel=0&origin=${origin}`;
      trailerFrame = document.createElement('iframe');
      trailerFrame.title = 'Trailer';
      trailerFrame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      trailerFrame.allowFullscreen = true;
      trailerFrame.setAttribute('playsinline', '');
      trailerFrame.referrerPolicy = 'origin';
      trailerFrame.srcdoc = `<!doctype html><style>html,body{margin:0;height:100%;background:#000}iframe{display:block;width:100%;height:100%;border:0}</style><iframe src="${player}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen playsinline referrerpolicy="origin"></iframe>`;
      els.detailTrailerWrap.append(trailerFrame);
      els.detailTrailerWrap.hidden = false;
    }
  } catch (error) {
    if (state.detailId !== movieKey) return;
    els.detailOverview.hidden = false;
    els.detailOverview.textContent = t('plotUnavailable');
  }
}

function showCatalog(restore = true) {
  closeWatchMenu();
  state.detailId = null;
  state.routeHash = location.hash;
  resetTrailer();
  document.body.classList.remove('detail-open');
  els.detail.hidden = true;
  els.catalog.hidden = false;
  document.title = t('title');
  if (restore && !state.items.length) load(state.type);
}

function route() {
  if (location.hash === state.routeHash) return;
  state.routeHash = location.hash;
  const show = location.hash.match(/^#tv\/(\d+)$/);
  if (show) {
    showDetail(show[1]);
    return;
  }
  const movie = location.hash.match(/^#movie\/(\d+)$/);
  if (movie) {
    showMovieDetail(movie[1]);
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
  updateSearchClear();
  state.shown = PAGE_SIZE;
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  showCatalog(false);
  await load(state.type);
}

document.addEventListener('click', event => {
  const detailLink = event.target.closest('a[href^="#movie/"], a[href^="#tv/"]');
  if (!detailLink) return;
  event.preventDefault();
  const hash = detailLink.getAttribute('href');
  if (location.hash === hash) return;
  history.pushState(null, '', hash);
  route();
});

document.addEventListener('click', event => {
  if (!isIOS() || !isStandalone()) return;
  if (event.defaultPrevented) return;
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || !/^https:\/\/(vixsrc\.to|vidsrc\.sh|vidlink\.pro|filmez\.club)\//.test(href)) return;
  const browser = getBrowser();
  if (browser === 'system') return;
  if (browser === 'chrome' && /CriOS/.test(navigator.userAgent)) return;
  event.preventDefault();
  launchBrowser(href, browser);
});

function updateSearchClear() {
  els.searchClear.hidden = !els.search.value;
}

els.searchClear.addEventListener('click', event => {
  event.preventDefault();
  event.stopPropagation();
  els.search.value = '';
  els.search.dispatchEvent(new Event('input'));
  els.search.focus();
});

els.back.addEventListener('click', event => {
  event.preventDefault();
  if (history.length > 1) {
    history.back();
  } else {
    history.replaceState(null, '', location.pathname + location.search);
    showCatalog(false);
  }
});

els.langButton.addEventListener('click', event => {
  event.stopPropagation();
  closeSettings();
  const open = els.langMenu.hidden;
  els.langMenu.hidden = !open;
  els.langButton.setAttribute('aria-expanded', String(open));
});

els.installClose.addEventListener('click', () => hideInstallBanner(true));
els.installAction.addEventListener('click', handleInstallAction);
els.installHelpOk.addEventListener('click', closeInstallHelp);
els.installHelp.addEventListener('click', event => {
  if (event.target === els.installHelp) closeInstallHelp();
});

els.scriptAdd.addEventListener('click', event => {
  event.preventDefault();
  addScript();
});

els.scriptModalOk.addEventListener('click', () => closeScriptModal(true));

els.scriptModal.addEventListener('click', event => {
  if (event.target === els.scriptModal) closeScriptModal(false);
});

els.watchOpen.addEventListener('click', () => chooseWatch('open'));
els.watchScriptable.addEventListener('click', () => chooseWatch('scriptable'));
els.watchFilmez.addEventListener('click', () => chooseWatch('filmez'));
els.watchCancel.addEventListener('click', closeWatchMenu);

els.watchMenu.addEventListener('click', event => {
  if (event.target === els.watchMenu) closeWatchMenu();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!els.scriptModal.hidden) closeScriptModal(false);
  if (!els.watchMenu.hidden) closeWatchMenu();
  if (!els.installHelp.hidden) closeInstallHelp();
});

els.settingsButton.addEventListener('click', event => {
  event.stopPropagation();
  closeLangMenu();
  const open = els.settingsMenu.hidden;
  els.settingsMenu.hidden = !open;
  els.settingsButton.setAttribute('aria-expanded', String(open));
});

els.browserSelect.addEventListener('change', () => {
  try { localStorage.setItem(BROWSER_KEY, els.browserSelect.value); } catch {}
  closeSettings();
});

els.langOptions.forEach(option => option.addEventListener('click', () => {
  closeLangMenu();
  setLang(option.dataset.lang);
}));

document.addEventListener('click', event => {
  if (!event.target.closest('.lang-select')) closeLangMenu();
  if (!event.target.closest('.settings')) closeSettings();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeLangMenu();
    closeSettings();
  }
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
  updateSearchClear();
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
  updateSearchClear();
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

if (new URLSearchParams(location.search).get('reset') === '1') {
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } finally {
      const params = new URLSearchParams(location.search);
      params.delete('reset');
      location.replace(location.pathname + (params.toString() ? `?${params}` : '') + location.hash);
    }
  })();
}

els.browserSelect.value = getBrowser();
const appScript = document.querySelector('script[src*="app.js"]');
const appVersion = appScript && appScript.src.match(/[?&]v=(\d+)/);
if (appVersion) els.appVersion.textContent = `build ${appVersion[1]}`;
const showSettings = isIOS();
els.settingsButton.hidden = !showSettings;
els.browserSetting.hidden = !isStandalone();
els.settingsMenu.classList.toggle('no-browser', !isStandalone());
if (!showSettings) closeSettings();
showInstallBanner();
updateSearchClear();
applyI18n();
window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);
if (location.hash.startsWith('#tv/') || location.hash.startsWith('#movie/')) route();
else load('movie');

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  showInstallBanner();
  updateInstallBannerText();
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  hideInstallBanner(true);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

// iOS ignora user-scalable=no: blocca il pinch-zoom a livello di gesture.
for (const eventName of ['gesturestart', 'gesturechange']) {
  document.addEventListener(eventName, event => event.preventDefault(), { passive: false });
}
