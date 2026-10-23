/* Ancestral Peaks — offline shell + audio caching */
const SHELL = 'ap-shell-v2';
const MEDIA = 'ap-media-v1';
const CORE = ['./','./index.html','./sessions.json','./readings.json','./gates.json','./manifest.webmanifest',
              './icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== SHELL && k !== MEDIA).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // audio: cache-first and keep it, so a 45 minute session never restreams on cellular
  if (/\.(mp3|m4a|ogg|wav)$/i.test(url.pathname)) {
    e.respondWith(caches.open(MEDIA).then(async cache => {
      const hit = await cache.match(req, {ignoreSearch:true});
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    }));
    return;
  }

  // everything else: network first, fall back to the cached shell when offline
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});

// let the page ask us to pre-download a session for offline use
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'cache-audio' && e.data.url) {
    e.waitUntil(caches.open(MEDIA).then(c => c.add(e.data.url)).then(
      () => e.source && e.source.postMessage({type:'cached', url:e.data.url}),
      () => e.source && e.source.postMessage({type:'cache-failed', url:e.data.url})
    ));
  }
});
