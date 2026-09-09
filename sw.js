const CACHE = 'vandira-static-v143';
const STATIC = [
  './','./index.html','./ai.html','./assets/style.css','./assets/ai-screen.css',
  './assets/app.js','./assets/language-ui.js','./assets/mobile-runtime.js',
  './assets/top-analytica-logo.jpg','./manifest.webmanifest'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API/data responses: intelligence must remain network-first and current.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/data/')) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    return res;
  })));
});
