/* MEDUCA English Planner – Service Worker */
const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = `meduca-planner-${CACHE_VERSION}`;
const ASSETS = [
  './', './index.html', './app.js', './vocab_map.json', './md2doc.js', './md2pdf.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => { if (key.startsWith('meduca-planner-') && key !== CACHE_NAME) { return caches.delete(key); } }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (event) => {
  const { request } = event; if (request.method !== 'GET') { return; }
  event.respondWith(caches.match(request).then((cached) => {
    const networkFetch = fetch(request).then((response) => { if (response && response.status === 200 && (request.url.startsWith(self.location.origin) || request.url.includes('github.io'))) { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)); } return response; }).catch(() => { if (request.mode === 'navigate') { return caches.match('./index.html'); } return cached; });
    return cached || networkFetch;
  }));
});
