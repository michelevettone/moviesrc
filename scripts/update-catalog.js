const { mkdir, readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'data');
const TMDB = 'https://api.themoviedb.org/3';
const TOKEN = process.env.TMDB_TOKEN;
const CONCURRENCY = 12;

async function fetchJson(url, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
        signal: AbortSignal.timeout(15000),
      });
      if (response.status === 429 || response.status >= 500) {
        if (attempt >= attempts) throw new Error(`${response.status} ${url}`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      return await response.json();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
}

async function fetchList(type) {
  const rows = await fetchJson(`https://vixsrc.to/api/list/${type}/?lang=it`);
  if (!Array.isArray(rows)) throw new Error(`${type}: ${JSON.stringify(rows)}`);
  return rows.map(row => type === 'episode'
    ? [row.tmdb_id, row.imdb_id, row.s, row.e]
    : [row.tmdb_id, row.imdb_id]);
}

function metaEntry(data, isTv) {
  if (!data) return null;
  const title = (isTv ? data.name : data.title) || (isTv ? data.original_name : data.original_title) || '';
  const date = isTv ? data.first_air_date : data.release_date;
  return [title, (date || '').slice(0, 4), data.poster_path || null];
}

async function fetchAll(ids, isTv, meta, label) {
  const queue = ids.filter(id => !(String(id) in meta));
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
      const data = await fetchJson(`${TMDB}/${isTv ? 'tv' : 'movie'}/${id}?language=it-IT`);
      meta[String(id)] = metaEntry(data, isTv);
      if (++done % 500 === 0) console.log(`${label}: ${done}/${queue.length}`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
}

async function loadMeta() {
  try {
    const parsed = JSON.parse(await readFile(path.join(OUT, 'meta.json'), 'utf8'));
    return { movie: parsed.movie || {}, tv: parsed.tv || {} };
  } catch {
    return { movie: {}, tv: {} };
  }
}

(async () => {
  await mkdir(OUT, { recursive: true });
  const [movies, shows, episodes] = await Promise.all(['movie', 'tv', 'episode'].map(fetchList));
  const meta = await loadMeta();

  await fetchAll(movies.map(row => row[0]), false, meta.movie, 'movie');
  const showIds = new Set([...shows.map(row => row[0]), ...episodes.map(row => row[0])]);
  await fetchAll([...showIds], true, meta.tv, 'tv');

  await Promise.all([
    writeFile(path.join(OUT, 'movie.json'), JSON.stringify(movies)),
    writeFile(path.join(OUT, 'tv.json'), JSON.stringify(shows)),
    writeFile(path.join(OUT, 'episode.json'), JSON.stringify(episodes)),
    writeFile(path.join(OUT, 'meta.json'), JSON.stringify(meta)),
  ]);
  console.log(`movie: ${movies.length}, tv: ${shows.length}, episode: ${episodes.length}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
