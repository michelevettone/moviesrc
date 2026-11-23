const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'data');

async function fetchList(type) {
  const response = await fetch(`https://vixsrc.to/api/list/${type}/?lang=it`);
  if (!response.ok) throw new Error(`${type}: HTTP ${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error(`${type}: ${JSON.stringify(rows)}`);
  return rows.map(row => type === 'episode'
    ? [row.tmdb_id, row.imdb_id, row.s, row.e]
    : [row.tmdb_id, row.imdb_id]);
}

(async () => {
  await mkdir(OUT, { recursive: true });
  for (const type of ['movie', 'tv', 'episode']) {
    const rows = await fetchList(type);
    await writeFile(path.join(OUT, `${type}.json`), JSON.stringify(rows));
    console.log(`${type}: ${rows.length} elementi`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
