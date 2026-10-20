/* Service worker portofolio: cache dasar agar website bisa dibuka offline. */
var CACHE = 'portfolio-v1';
var CORE = ['./', './index.html', './css/style.css', './css/sections.css', './css/features.css', './js/data.js', './js/render.js', './js/main.js', './js/ui.js', './js/game.js', './js/palette.js', './js/blog.js', './js/github.js', './js/visitor.js', './assets/favicon.svg'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(CORE).catch(function () {});
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function () {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
