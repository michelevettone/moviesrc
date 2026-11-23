const ORIGIN = 'https://michelevettone.github.io';
const BASE = '/moviesrc';

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
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
