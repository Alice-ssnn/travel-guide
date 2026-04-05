// service-worker.js - Service Worker for offline caching

const CACHE_NAME = 'travel-guide-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/day.html',
  '/offline.html',
  '/css/style.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/data.js',
  '/js/app.js',
  '/js/timeline.js',
  '/js/map.js',
  '/js/search.js',
  '/js/offline.js',
  '/manifest.json',
  // Add more assets as needed
];

// Install event - precache assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');

  // Precache critical assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');

  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and Chrome extensions
  if (event.request.method !== 'GET' ||
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For HTML pages, try network first, fallback to cache
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fetched response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, show offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For other assets (CSS, JS, images), try cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a successful response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache the fetched response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });

            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            // For CSS/JS, return empty response rather than failing
            if (event.request.url.match(/\.(css|js)$/)) {
              return new Response('', {
                headers: { 'Content-Type': 'text/css' }
              });
            }
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Periodic sync for updates
self.addEventListener('periodicsync', event => {
  console.log('[ServiceWorker] Periodic sync:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateCachedContent());
  }
});

// Sync favorites from IndexedDB to server
async function syncFavorites() {
  console.log('[ServiceWorker] Syncing favorites...');

  try {
    // Get favorites from IndexedDB
    const favorites = await getFavoritesFromIndexedDB();

    if (favorites.length === 0) {
      console.log('[ServiceWorker] No favorites to sync');
      return;
    }

    // In a real app, you would send to your server
    console.log('[ServiceWorker] Would sync favorites:', favorites);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[ServiceWorker] Favorites synced successfully');

  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error; // Will retry on next sync
  }
}

// Update cached content
async function updateCachedContent() {
  console.log('[ServiceWorker] Updating cached content...');

  try {
    // Open cache
    const cache = await caches.open(CACHE_NAME);

    // Check for updates to critical assets
    const updatePromises = PRECACHE_ASSETS.map(async assetUrl => {
      try {
        const networkResponse = await fetch(assetUrl);
        if (networkResponse.ok) {
          await cache.put(assetUrl, networkResponse.clone());
          console.log(`[ServiceWorker] Updated: ${assetUrl}`);
        }
      } catch (error) {
        console.warn(`[ServiceWorker] Failed to update ${assetUrl}:`, error);
      }
    });

    await Promise.all(updatePromises);
    console.log('[ServiceWorker] Content update complete');

  } catch (error) {
    console.error('[ServiceWorker] Update failed:', error);
  }
}

// Helper function to get favorites from IndexedDB
async function getFavoritesFromIndexedDB() {
  // This is a simplified example
  // In a real app, you would use IndexedDB
  return new Promise(resolve => {
    setTimeout(() => {
      const favorites = JSON.parse(localStorage.getItem('travelGuideFavorites') || '[]');
      resolve(favorites);
    }, 100);
  });
}

// Push notifications (optional)
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push received:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || '旅行指南';
  const options = {
    body: data.body || '您有新的旅行提醒',
    icon: '/images/icon-192.png',
    badge: '/images/icon-72.png',
    tag: 'travel-guide-notification',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notification click:', event.notification.tag);

  event.notification.close();

  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if app is already open
      for (const client of windowClients) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if app not open
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data || '/');
      }
    })
  );
});