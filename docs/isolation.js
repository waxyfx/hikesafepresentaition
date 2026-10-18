// GitHub Pages cannot configure response headers. This same-origin worker adds
// the isolation headers required by the existing Expo SQLite WASM implementation.
// It does not cache requests or intercept other origins.
if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', event => {
    const request = event.request;
    if (new URL(request.url).origin !== self.location.origin ||
        (request.cache === 'only-if-cached' && request.mode !== 'same-origin')) return;
    event.respondWith(fetch(request).then(response => {
      if (response.status === 0) return response;
      const headers = new Headers(response.headers);
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
      headers.set('Cross-Origin-Resource-Policy', 'same-origin');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }));
  });
} else if ('serviceWorker' in navigator && !window.crossOriginIsolated) {
  const script = document.currentScript;
  const url = new URL(script.src);
  navigator.serviceWorker.register(url.href, { scope: new URL('.', url).pathname }).then(() => {
    const reload = () => {
      const key = `hike-isolation:${url.pathname}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        location.reload();
      }
    };
    if (navigator.serviceWorker.controller) reload();
    else navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
  }).catch(error => console.error('HIKE SAFE preview setup:', error.message));
}
