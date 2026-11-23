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

export default {
  async fetch(request) {
    const incoming = new URL(request.url);

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
