// service-worker.js - Service Worker for offline caching with smart strategies
// Part of Phase 2 Week 4: Offline functionality optimization

// Cache configuration
const CACHE_VERSION = 'v2';
const CACHE_NAMES = {
  STATIC: `travel-guide-static-${CACHE_VERSION}`,
  DATA: `travel-guide-data-${CACHE_VERSION}`,
  MEDIA: `travel-guide-media-${CACHE_VERSION}`
};

const OFFLINE_URL = '/offline.html';

// Assets to precache in STATIC cache (App Shell)
const STATIC_ASSETS = [
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
  '/js/offline-db.js',
  '/manifest.json'
];

// Data endpoints to cache in DATA cache
const DATA_ENDPOINTS = [
  '/data.json', // If we add a JSON API endpoint
  // Add other data endpoints here
];

// Media patterns to cache in MEDIA cache
const MEDIA_PATTERNS = [
  /\.(png|jpg|jpeg|gif|webp|svg)$/i,
  /\.(woff|woff2|eot|ttf|otf)$/i
];

// Import CacheStrategy for smart caching
importScripts('./js/services/CacheStrategy.js');
importScripts('./js/services/OfflineSyncManager.js');
importScripts('./js/offline-db.js');
// Create sync manager with offlineDB instance if available
const syncManager = new OfflineSyncManager({
  offlineDB: typeof OfflineDB !== 'undefined' ? OfflineDB : null
});

// Define cache strategies for different resource types
const cacheStrategies = {
  html: new CacheStrategy(CACHE_NAMES.STATIC, {
    strategy: 'cache-first',
    maxAge: 3600000 // 1 hour
  }),
  data: new CacheStrategy(CACHE_NAMES.DATA, {
    strategy: 'cache-first',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }),
  media: new CacheStrategy(CACHE_NAMES.MEDIA, {
    strategy: 'cache-first',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }),
  static: new CacheStrategy(CACHE_NAMES.STATIC, {
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  })
};

// Performance monitoring helper
function sendCacheEvent(type, cacheName) {
  // Send message to clients for performance tracking
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: type,
        cacheName: cacheName,
        timestamp: Date.now()
      });
    });
  });
}


// Install event - precache static assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install - Precaching static assets');

  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell in STATIC cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate - Cleaning up old caches');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches that don't match current version
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[ServiceWorker] Activate failed:', error);
      })
  );
});

// Smart fetch strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Route to appropriate cache strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(cacheStrategies.html.handleRequest(event.request));
  } else if (isDataRequest(url)) {
    event.respondWith(cacheStrategies.data.handleRequest(event.request));
  } else if (isMediaRequest(url)) {
    event.respondWith(cacheStrategies.media.handleRequest(event.request));
  } else {
    event.respondWith(cacheStrategies.static.handleRequest(event.request));
  }
});

/**
 * Determine if request is for data
 */
function isDataRequest(url) {
  return DATA_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
}

/**
 * Determine if request is for media
 */
function isMediaRequest(url) {
  return MEDIA_PATTERNS.some(pattern => pattern.test(url.pathname));
}





// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'sync-all') {
    event.waitUntil(syncManager.startSync());
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

    // Add each favorite to sync queue
    for (const favorite of favorites) {
      await syncManager.addToQueue({
        type: 'favorite',
        action: 'add',
        activityId: favorite.activityId,
        favoriteId: favorite.id, // Include favoriteId for marking as synced
        timestamp: favorite.addedAt
      });
    }

    console.log('[ServiceWorker] Favorites added to sync queue');

  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error;
  }
}

// Update cached content
async function updateCachedContent() {
  console.log('[ServiceWorker] Updating cached content...');

  try {
    // Update static cache
    await updateCache(CACHE_NAMES.STATIC, STATIC_ASSETS);

    // Update data cache if there are data endpoints
    if (DATA_ENDPOINTS.length > 0) {
      await updateCache(CACHE_NAMES.DATA, DATA_ENDPOINTS);
    }

    console.log('[ServiceWorker] Content update complete');
  } catch (error) {
    console.error('[ServiceWorker] Update failed:', error);
  }
}

/**
 * Update a specific cache with fresh network responses
 */
async function updateCache(cacheName, urls) {
  try {
    const cache = await caches.open(cacheName);
    const updatePromises = urls.map(async url => {
      try {
        const networkResponse = await fetch(url);
        if (networkResponse.ok) {
          await cache.put(url, networkResponse.clone());
          console.log(`[ServiceWorker] Updated in ${cacheName}: ${url}`);
        }
      } catch (error) {
        console.warn(`[ServiceWorker] Failed to update ${url} in ${cacheName}:`, error);
      }
    });

    await Promise.all(updatePromises);
    console.log(`[ServiceWorker] ${cacheName} update completed`);
  } catch (error) {
    console.error(`[ServiceWorker] Failed to update ${cacheName}:`, error);
    throw error;
  }
}

// Helper function to get favorites from IndexedDB
async function getFavoritesFromIndexedDB() {
  // Use OfflineDB to get unsynced favorites
  try {
    const unsyncedFavorites = await OfflineDB.getUnsyncedFavorites();
    return unsyncedFavorites;
  } catch (error) {
    console.error('[ServiceWorker] Failed to get unsynced favorites:', error);
    return [];
  }
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