const CACHE = 'mein-begleiter-persoenlich-cache-v1-9-1-2-5-10-pc-abschluss-10';
const BASIS = '/Mein-Begleiter-Persoenlich/';
const PFLICHTDATEIEN = [
  BASIS,
  BASIS + 'index.html',
  BASIS + 'v19124.css',
  BASIS + 'v19124.js',
  BASIS + 'v1912510.css?v=pc-abschluss-10',
  BASIS + 'v1912510.js?v=pc-abschluss-10',
  BASIS + 'manifest.webmanifest',
  BASIS + 'offline.html'
];
const OPTIONALE_DATEIEN = [
  BASIS + 'icons/icon-192.png',
  BASIS + 'icons/icon-512.png',
  BASIS + 'icons/icon-maskable-512.png',
  BASIS + 'icons/apple-touch-icon-180.png',
  BASIS + 'icons/favicon-64.png',
  BASIS + 'icons/logo-persoenlich.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PFLICHTDATEIEN);
    await Promise.allSettled(OPTIONALE_DATEIEN.map(datei => cache.add(datei)));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(namen
      .filter(name => name.startsWith('mein-begleiter-persoenlich-cache') && name !== CACHE)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASIS)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const antwort = await fetch(event.request);
        const cache = await caches.open(CACHE);
        cache.put(BASIS + 'index.html', antwort.clone());
        return antwort;
      } catch {
        return (await caches.match(BASIS + 'index.html')) ||
          (await caches.match(BASIS + 'offline.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const antwort = await fetch(event.request);
      if (antwort.ok) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, antwort.clone());
      }
      return antwort;
    } catch {
      return (await caches.match(event.request)) || (await caches.match(BASIS + 'offline.html'));
    }
  })());
});
