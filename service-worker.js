const CACHE_NAME = 'puzzle-game-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-512.png',
  './assets/image1.png',
  './assets/image2.png',
  './assets/image3.png',
  './assets/image4.png',
  './assets/image5.png',
  './assets/image6.png',
];

// Install Event - Pre-caches all main resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleans up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Intercepts requests with Cache-First strategy
self.addEventListener('fetch', (event) => {
  // Only intercept requests to our own origin to avoid errors with chrome-extension or external domains
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});
