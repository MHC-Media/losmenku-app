/* LOSMENKU service worker: aplikasi tetap terbuka saat offline. Naikkan versi V saat merilis pembaruan. */
const V = 'losmenku-v1', CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const LUCIDE = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js';
const store = (r, x) => { if (x.ok || x.type === 'opaque') { const c = x.clone(); caches.open(V).then(h => h.put(r, c)); } return x; };
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(async c => {
  await c.addAll(CORE);
  try { await c.put(LUCIDE, await fetch(new Request(LUCIDE, { mode: 'no-cors' }))); } catch (x) {}
}).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || /(^|\.)google(usercontent)?\.com$/.test(u.hostname) && u.hostname.startsWith('script')) return; // API tidak di-cache
  if (u.origin === location.origin)
    return e.respondWith(fetch(r).then(x => store(r, x)).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('index.html'))));
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(x => store(r, x))));
});
