const ORIGIN = 'https://michelevettone.github.io';
const BASE = '/moviesrc';
const ALLOWED = new Set(['vixsrc.to', 'vidsrc.sh']);

function redirectPage(target) {
  const escaped = target.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const script = JSON.stringify(target).replace(/</g, '\\u003c');
  return new Response(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting…</title>
<script>location.replace(${script});</script>
</head><body style="background:#0b0d12;color:#eef1f7;font:15px system-ui;display:grid;place-items:center;height:100vh;margin:0">
<a href="${escaped}" style="color:#ff6b4a">Continua →</a>
</body></html>`, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

function json(body, status = 200, ttl = 86400) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${ttl}`, ...CORS },
  });
}

const CHECK_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

async function vidlinkAvailable(id) {
  try {
    const response = await fetch(`https://vidlink.pro/movie/${id}`, {
      method: 'HEAD',
      headers: { 'User-Agent': CHECK_UA },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.pathname.startsWith('/tmdb/movie/')) {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
      const id = incoming.pathname.split('/').pop();
      if (!/^\d+$/.test(id)) return json({ error: 'invalid id' }, 400);
      if (!env.TMDB_TOKEN) return json({ error: 'missing token' }, 500);
      const lang = incoming.searchParams.get('lang') === 'en' ? 'en-US' : 'it-IT';
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=${lang}&append_to_response=videos`, {
        headers: { Authorization: `Bearer ${env.TMDB_TOKEN}` },
        cf: { cacheTtl: 86400, cacheEverything: true },
      });
      if (!response.ok) return json({ error: 'upstream error' }, 502);
      const data = await response.json();
      const videos = (data.videos && data.videos.results ? data.videos.results : []).filter(video => video.site === 'YouTube');
      const trailer = videos.find(video => video.type === 'Trailer' && video.official)
        || videos.find(video => video.type === 'Trailer')
        || videos.find(video => video.type === 'Teaser')
        || null;
      return json({
        overview: data.overview || '',
        tagline: data.tagline || '',
        runtime: data.runtime || null,
        rating: data.vote_average || null,
        genres: (data.genres || []).map(genre => genre.name),
        trailer: trailer ? { key: trailer.key, name: trailer.name, official: trailer.official === true } : null,
      });
    }

    if (incoming.pathname.startsWith('/providers/movie/')) {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
      const id = incoming.pathname.split('/').pop();
      if (!/^\d+$/.test(id)) return json({ error: 'invalid id' }, 400);
      const vidlink = await vidlinkAvailable(id);
      return json({ vidlink }, 200, 3600);
    }

    if (incoming.pathname === '/go' || incoming.pathname === '/go/') {
      const raw = incoming.searchParams.get('u');
      let target = null;
      try {
        const url = new URL(raw);
        if (url.protocol === 'https:' && ALLOWED.has(url.hostname)) target = url.toString();
      } catch {}
      if (!target) return new Response('Invalid target', { status: 400 });
      return redirectPage(target);
    }

    const target = new URL(ORIGIN);
    target.pathname = incoming.pathname.startsWith(`${BASE}/`) || incoming.pathname === BASE
      ? incoming.pathname
      : BASE + (incoming.pathname === '/' ? '/' : incoming.pathname);
    target.search = incoming.search;

    const headers = new Headers(request.headers);
    headers.delete('host');

    const init = { method: request.method, headers, redirect: 'manual' };
    if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body;

    const response = await fetch(target.toString(), init);
    const output = new Response(response.body, response);

    const location = output.headers.get('Location');
    if (location) {
      const redirected = new URL(location, ORIGIN);
      if (redirected.origin === ORIGIN && redirected.pathname.startsWith(BASE)) {
        redirected.protocol = 'https:';
        redirected.host = incoming.host;
        redirected.pathname = redirected.pathname.slice(BASE.length) || '/';
        output.headers.set('Location', redirected.toString());
      }
    }

    return output;
  },
};
