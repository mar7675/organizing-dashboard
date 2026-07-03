/* Organizing Dashboard service worker — makes the shell open offline (plan v4 Step 5).
   Strategy: stale-while-revalidate for same-origin GETs. The cached shell is served
   instantly (no-signal school buildings), and a background fetch refreshes the cache,
   so a pushed code update arrives by the second launch after it lands on Pages.
   Data never touches this cache — imports live in localStorage on the device. */
var CACHE = 'dash-shell-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () {
      return caches.open(CACHE);
    }).then(function (c) {
      // Pre-warm what we can; individual failures are fine (e.g. previewing from a
      // path where './' does not resolve). Runtime caching below covers the rest.
      return Promise.all(['./', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'].map(function (u) {
        return c.add(u)['catch'](function () {});
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') { return; }
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) { return; }
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (hit) {
        var refresh = fetch(req).then(function (res) {
          if (res && res.ok) { c.put(req, res.clone()); }
          return res;
        })['catch'](function () { return hit; });
        if (hit) { return hit; }
        return refresh;
      });
    })
  );
});
