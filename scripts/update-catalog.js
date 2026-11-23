const { mkdir, readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'data');
const TMDB = 'https://api.themoviedb.org/3';
const TOKEN = process.env.TMDB_TOKEN;
const CONCURRENCY = 16;

async function request(url, asText = false, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const headers = url.startsWith(TMDB) && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
      if (response.status === 429 || response.status >= 500) {
        if (attempt >= attempts) throw new Error(`${response.status} ${url}`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1500));
        continue;
      }
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      return asText ? response.text() : response.json();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(path.join(OUT, file), 'utf8'));
  } catch {
    return fallback;
  }
}

async function fetchVixList(type) {
  const rows = await request(`https://vixsrc.to/api/list/${type}/?lang=it`);
  if (!Array.isArray(rows)) throw new Error(`${type}: risposta inattesa`);
  return rows.map(row => type === 'episode'
    ? [row.tmdb_id, row.imdb_id, row.s, row.e]
    : [row.tmdb_id, row.imdb_id]);
}

function metaEntry(data, isTv) {
  if (!data) return null;
  const title = (isTv ? data.name : data.title) || (isTv ? data.original_name : data.original_title) || '';
  const date = (isTv ? data.first_air_date : data.release_date) || '';
  return [title, date.slice(0, 4), data.poster_path || null, date];
}

function needsDate(entry) {
  return entry !== null && (!Array.isArray(entry) || entry.length < 4);
}

async function fetchAll(ids, isTv, meta, label) {
  const queue = ids.filter(id => !(String(id) in meta) || needsDate(meta[String(id)]));
  if (!queue.length) return;
  if (!TOKEN) {
    console.warn(`${label}: TMDB_TOKEN assente, salto ${queue.length} metadati`);
    return;
  }
  console.log(`${label}: recupero ${queue.length} metadati TMDB`);
  let done = 0;
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      const id = queue[next++];
      const data = await request(`${TMDB}/${isTv ? 'tv' : 'movie'}/${id}?language=it-IT`);
      meta[String(id)] = metaEntry(data, isTv);
      if (++done % 500 === 0) console.log(`${label}: ${done}/${queue.length}`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
}

async function loadMeta() {
  const parsed = await readJson('meta.json', {});
  return { movie: parsed.movie || {}, tv: parsed.tv || {} };
}

async function fetchText(url) {
  const text = await request(url, true);
  return (text || '').split(/\s+/).filter(Boolean);
}

function parseEpisodeLine(line) {
  const [show, code] = line.split('_');
  const [s, e] = (code || '').split('x').map(Number);
  if (!show || !s || !e) return null;
  return [Number(show), s, e];
}

function enEntry(data, isTv) {
  if (!data) return null;
  const title = (isTv ? data.name : data.title) || (isTv ? data.original_name : data.original_title) || '';
  const date = (isTv ? data.first_air_date : data.release_date) || '';
  return [data.id, title, date.slice(0, 4), data.poster_path || null, date];
}

async function buildEnCatalog(ids, isTv, label) {
  const file = isTv ? 'tv-en.json' : 'movie-en.json';
  const existingRows = await readJson(file, []);
  const cache = new Map(existingRows.filter(row => Array.isArray(row) && row[0] != null).map(row => [String(row[0]), row]));
  const queue = ids.filter(id => !cache.has(String(id)));
  if (queue.length && !TOKEN) {
    console.warn(`${label}: TMDB_TOKEN assente, salto ${queue.length} metadati`);
  } else if (queue.length) {
    console.log(`${label}: recupero ${queue.length} metadati TMDB (en-US)`);
    let done = 0;
    let next = 0;
    const worker = async () => {
      while (next < queue.length) {
        const id = queue[next++];
        const data = await request(`${TMDB}/${isTv ? 'tv' : 'movie'}/${id}?language=en-US`);
        const entry = enEntry(data, isTv);
        if (entry) cache.set(String(id), entry);
        if (++done % 500 === 0) console.log(`${label}: ${done}/${queue.length}`);
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  }
  const rows = ids.map(id => cache.get(String(id))).filter(Boolean);
  await writeFile(path.join(OUT, file), JSON.stringify(rows));
  console.log(`${label}: ${rows.length} titoli`);
}

(async () => {
  await mkdir(OUT, { recursive: true });

  const [movies, shows, episodes] = await Promise.all(['movie', 'tv', 'episode'].map(fetchVixList));
  const meta = await loadMeta();
  await fetchAll(movies.map(row => row[0]), false, meta.movie, 'it-movie');
  const showIds = new Set([...shows.map(row => row[0]), ...episodes.map(row => row[0])]);
  await fetchAll([...showIds], true, meta.tv, 'it-tv');

  await Promise.all([
    writeFile(path.join(OUT, 'movie.json'), JSON.stringify(movies)),
    writeFile(path.join(OUT, 'tv.json'), JSON.stringify(shows)),
    writeFile(path.join(OUT, 'episode.json'), JSON.stringify(episodes)),
    writeFile(path.join(OUT, 'meta.json'), JSON.stringify(meta)),
  ]);

  const [enMovies, enShows, enEpisodesRaw] = await Promise.all([
    fetchText('https://vidsrc.sh/ids/movie_tmdb.txt'),
    fetchText('https://vidsrc.sh/ids/tv_tmdb.txt'),
    fetchText('https://vidsrc.sh/ids/eps_tmdb.txt'),
  ]);
  const enMovieIds = [...new Set(enMovies.map(Number).filter(Boolean))];
  const enShowIds = [...new Set(enShows.map(Number).filter(Boolean))];
  const enEpisodes = enEpisodesRaw.map(parseEpisodeLine).filter(Boolean);

  await buildEnCatalog(enMovieIds, false, 'en-movie');
  await buildEnCatalog(enShowIds, true, 'en-tv');
  await writeFile(path.join(OUT, 'episode-en.json'), JSON.stringify(enEpisodes));

  console.log(`it: ${movies.length} film, ${shows.length} serie, ${episodes.length} episodi`);
  console.log(`en: ${enMovieIds.length} film, ${enShowIds.length} serie, ${enEpisodes.length} episodi`);
})().catch(error => { console.error(error); process.exitCode = 1; });
