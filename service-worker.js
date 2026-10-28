/* ==========================================================================
   Kryptownic Consultants PWA Service Worker
   Enables offline functionality, caching, and push notifications
   ========================================================================== */

const CACHE_NAME = 'kryptownic-v2';
const BASE_URL = '.';

const FILES_TO_CACHE = [
  BASE_URL,
  'index.html',
  'manifest.json',
  'assets/css/styles.css',
  'assets/js/app.js',
  'assets/icons/icon-72x72.png',
  'assets/icons/icon-96x96.png',
  'assets/icons/icon-128x128.png',
  'assets/icons/icon-144x144.png',
  'assets/icons/icon-152x152.png',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-384x384.png',
  'assets/icons/icon-512x512.png',
  'assets/icons/icon-maskable.png',
  'assets/icons/badge.png',
  'assets/icons/logo_cropped.png'
];

// Install: cache all core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return a simple offline fallback for HTML
        if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match(BASE_URL);
        }
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new message from Kryptownic Consultants.',
    icon: 'assets/icons/icon-192x192.png',
    badge: 'assets/icons/badge.png',
    tag: data.tag || 'kryptownic-notification',
    data: { url: data.url || BASE_URL },
    actions: [
      { action: 'open', title: 'Open App', icon: 'assets/icons/icon-96x96.png' },
      { action: 'reply', title: 'Quick Reply', icon: 'assets/icons/icon-96x96.png' }
    ],
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Kryptownic Consultants', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url || BASE_URL));
  }
});
