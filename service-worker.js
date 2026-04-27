// ============================================================
//  service-worker.js — Cache offline per Il Mio Apiario
// ============================================================

const CACHE_NAME = 'apiario-v1';

// File da mettere in cache per uso offline
const ASSETS = [
  '/apiario/',
  '/apiario/index.html',
  '/apiario/inserimento_rapido.html',
  '/apiario/shared.js',
  '/apiario/style-main.css',
  '/apiario/style-mobile.css',
  '/apiario/manifest.json',
  '/apiario/icons/icon-192.png',
  '/apiario/icons/icon-512.png'
];

// ===== INSTALL — pre-carica tutti gli asset =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE — elimina cache vecchie =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH — strategia "Cache first, poi rete" =====
// Per le API Google (Drive, OAuth) passa sempre dalla rete.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Lascia passare sempre le richieste a Google (Drive, OAuth, GSI)
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('accounts.google.com') ||
    url.hostname.includes('oauth2.googleapis.com')
  ) {
    return; // fetch normale, senza cache
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Non in cache: prendi dalla rete e metti in cache per dopo
      return fetch(event.request).then(response => {
        // Metti in cache solo risposte valide e non-opache
        if (
          response &&
          response.status === 200 &&
          response.type !== 'opaque'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline e non in cache: per le pagine HTML mostra index
        if (event.request.destination === 'document') {
          return caches.match('/apiario/index.html');
        }
      });
    })
  );
});
