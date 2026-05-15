// Service Worker — GenSync
const CACHE_NAME = 'gensync-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/labs.html',
  '/404.html',
  '/favicon.png',
  '/src/styles/design-system.css',
  '/src/styles/animations.css',
  '/src/styles/sections.css',
  '/src/styles/labs.css',
  '/src/main.js',
  '/src/labs.js',
];

// Install — cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network-first for HTML, cache-first for assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // HTML pages: network first, fallback to cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .catch(() => caches.match(e.request))
        .then((response) => response || caches.match('/') || new Response('Offline', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        }))
    );
    return;
  }

  // Assets: cache first, fallback to network
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
