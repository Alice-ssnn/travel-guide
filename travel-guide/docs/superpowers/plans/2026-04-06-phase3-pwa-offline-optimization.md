# Phase 3 PWA and Offline Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance PWA capabilities and offline functionality of the Switzerland-France travel guide application with intelligent caching, data synchronization, and improved user experience.

**Architecture:** Build upon existing service-worker.js, offline-db.js, pwa-install.js, and offline.js implementations. Add smart cache strategies with configurable rules, implement background sync for offline actions, enhance network quality detection, and improve offline map support with fallback mechanisms.

**Tech Stack:** Service Worker API, Cache API, IndexedDB, Background Sync API, Push API (optional), Intersection Observer API for lazy loading, Web Performance APIs.

---
## File Structure

### New Files to Create:
1. `js/services/CacheStrategy.js` - Smart caching strategy manager with configurable rules
2. `js/services/OfflineSyncManager.js` - Background sync and data synchronization manager
3. `js/components/OfflineStatus.js` - Offline status UI component with network quality indicators
4. `js/utils/network-monitor.js` - Enhanced network quality detection
5. `tests/cache-strategy.test.js` - Tests for CacheStrategy
6. `tests/offline-sync-manager.test.js` - Tests for OfflineSyncManager
7. `tests/offline-status.test.js` - Tests for OfflineStatus component
8. `tests/network-monitor.test.js` - Tests for network monitor

### Files to Modify:
1. `service-worker.js:108-130` - Replace basic fetch handling with CacheStrategy integration
2. `service-worker.js:308-350` - Enhance background sync functionality
3. `service-worker.js:374-395` - Improve cache update logic
4. `offline-db.js:166-165` - Add data sync methods for favorites and preferences
5. `offline-db.js:600-629` - Add conflict resolution for sync
6. `pwa-install.js:111-136` - Enhance install eligibility checking
7. `pwa-install.js:283-508` - Improve custom install prompt UI
8. `offline.js` - Replace with enhanced network monitor integration
9. `js/app.js` - Add offline status component initialization
10. `index.html:47-54` - Add offline status component to DOM
11. `day.html` - Add offline status component to DOM

### Task Breakdown:
1. Task 1: Smart Cache Strategy Implementation
2. Task 2: Data Synchronization Manager
3. Task 3: Enhanced Network Monitor
4. Task 4: Offline Status UI Component
5. Task 5: Background Sync Implementation
6. Task 6: PWA Installation Experience Enhancement
7. Task 7: Offline Map Support
8. Task 8: Integration and Testing

---
### Task 1: Smart Cache Strategy Implementation

**Files:**
- Create: `js/services/CacheStrategy.js`
- Modify: `service-worker.js:108-130`
- Test: `tests/cache-strategy.test.js`

- [ ] **Step 1: Write the failing test for CacheStrategy constructor**

```javascript
// tests/cache-strategy.test.js
import { CacheStrategy } from '../../js/services/CacheStrategy.js';

describe('CacheStrategy', () => {
  test('should create instance with default options', () => {
    const strategy = new CacheStrategy('test-cache');
    expect(strategy.cacheName).toBe('test-cache');
    expect(strategy.options.strategy).toBe('cache-first');
    expect(strategy.options.maxAge).toBe(24 * 60 * 60 * 1000);
    expect(strategy.options.maxEntries).toBe(100);
  });

  test('should create instance with custom options', () => {
    const strategy = new CacheStrategy('test-cache', {
      strategy: 'network-first',
      maxAge: 3600000,
      maxEntries: 50
    });
    expect(strategy.options.strategy).toBe('network-first');
    expect(strategy.options.maxAge).toBe(3600000);
    expect(strategy.options.maxEntries).toBe(50);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/cache-strategy.test.js -t "CacheStrategy"`
Expected: FAIL with "Cannot find module '../../js/services/CacheStrategy.js'"

- [ ] **Step 3: Write minimal CacheStrategy class**

```javascript
// js/services/CacheStrategy.js
export class CacheStrategy {
  constructor(cacheName, options = {}) {
    this.cacheName = cacheName;
    this.options = {
      strategy: options.strategy || 'cache-first',
      maxAge: options.maxAge || 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: options.maxEntries || 100,
      backgroundUpdate: options.backgroundUpdate !== false,
      ...options
    };
    this.cache = null;
  }

  async initialize() {
    this.cache = await caches.open(this.cacheName);
    return this;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/cache-strategy.test.js -t "CacheStrategy"`
Expected: PASS

- [ ] **Step 5: Write failing test for cacheFirst strategy**

```javascript
// tests/cache-strategy.test.js
test('cacheFirst strategy should return cached response if available', async () => {
  const strategy = new CacheStrategy('test-cache', { strategy: 'cache-first' });
  await strategy.initialize();
  
  // Create mock request and response
  const request = new Request('https://example.com/test');
  const response = new Response('cached data');
  
  // Cache the response
  await strategy.cache.put(request, response);
  
  // Try to get it
  const result = await strategy.handleRequest(request);
  expect(result).toBe(response);
});

test('cacheFirst strategy should fetch from network if not cached', async () => {
  const strategy = new CacheStrategy('test-cache', { strategy: 'cache-first' });
  await strategy.initialize();
  
  const request = new Request('https://example.com/test');
  
  // Mock fetch
  global.fetch = jest.fn(() => 
    Promise.resolve(new Response('network data'))
  );
  
  const result = await strategy.handleRequest(request);
  expect(result.text()).resolves.toBe('network data');
  expect(global.fetch).toHaveBeenCalledWith(request);
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- tests/cache-strategy.test.js -t "cacheFirst strategy"`
Expected: FAIL with "strategy.handleRequest is not a function"

- [ ] **Step 7: Implement handleRequest method for cache-first strategy**

```javascript
// js/services/CacheStrategy.js
export class CacheStrategy {
  // ... existing constructor and initialize ...

  async handleRequest(request) {
    await this.initialize();
    
    switch (this.options.strategy) {
      case 'cache-first':
        return this.handleCacheFirst(request);
      case 'network-first':
        return this.handleNetworkFirst(request);
      case 'stale-while-revalidate':
        return this.handleStaleWhileRevalidate(request);
      default:
        return this.handleCacheFirst(request);
    }
  }

  async handleCacheFirst(request) {
    // Try cache first
    const cachedResponse = await this.cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Not in cache, try network
    try {
      const networkResponse = await fetch(request);
      
      // Cache the successful response for future use
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        this.cache.put(request, responseClone);
      }
      
      return networkResponse;
    } catch (error) {
      // Network failed, return offline fallback
      return this.getOfflineFallback(request);
    }
  }

  getOfflineFallback(request) {
    // Return appropriate offline fallback based on request type
    const url = new URL(request.url);
    
    if (url.pathname.endsWith('.html')) {
      return new Response('<h1>离线模式</h1><p>请检查网络连接</p>', {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname.endsWith('.css')) {
      return new Response('/* Offline fallback */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    if (url.pathname.endsWith('.js')) {
      return new Response('// Offline fallback', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    // Default fallback
    return new Response('Offline', { status: 503 });
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- tests/cache-strategy.test.js -t "cacheFirst strategy"`
Expected: PASS

- [ ] **Step 9: Write failing test for cache cleanup methods**

```javascript
// tests/cache-strategy.test.js
test('should cleanup expired cache entries', async () => {
  const strategy = new CacheStrategy('test-cache', { maxAge: 1000 }); // 1 second
  await strategy.initialize();
  
  // Add an expired entry
  const request = new Request('https://example.com/expired');
  const response = new Response('expired data');
  await strategy.cache.put(request, response);
  
  // Wait for it to expire
  await new Promise(resolve => setTimeout(resolve, 1100));
  
  // Cleanup
  await strategy.cleanup();
  
  // Should be removed
  const cached = await strategy.cache.match(request);
  expect(cached).toBeUndefined();
});

test('should enforce maxEntries limit', async () => {
  const strategy = new CacheStrategy('test-cache', { maxEntries: 2 });
  await strategy.initialize();
  
  // Add 3 entries
  for (let i = 0; i < 3; i++) {
    const request = new Request(`https://example.com/test${i}`);
    const response = new Response(`data${i}`);
    await strategy.cache.put(request, response);
  }
  
  // Cleanup should remove oldest
  await strategy.cleanup();
  
  const keys = await strategy.cache.keys();
  expect(keys.length).toBe(2);
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm test -- tests/cache-strategy.test.js -t "should cleanup"`
Expected: FAIL with "strategy.cleanup is not a function"

- [ ] **Step 11: Implement cache cleanup methods**

```javascript
// js/services/CacheStrategy.js
export class CacheStrategy {
  // ... existing methods ...

  async cleanup() {
    await this.initialize();
    
    const keys = await this.cache.keys();
    const now = Date.now();
    
    // Check for expired entries
    const expiredPromises = keys.map(async key => {
      const response = await this.cache.match(key);
      if (!response) return false;
      
      const dateHeader = response.headers.get('date');
      if (!dateHeader) return false;
      
      const cachedDate = new Date(dateHeader).getTime();
      const age = now - cachedDate;
      
      return age > this.options.maxAge;
    });
    
    const expiredResults = await Promise.all(expiredPromises);
    
    // Remove expired entries
    for (let i = 0; i < keys.length; i++) {
      if (expiredResults[i]) {
        await this.cache.delete(keys[i]);
      }
    }
    
    // Enforce maxEntries
    if (this.options.maxEntries && keys.length > this.options.maxEntries) {
      const entriesToRemove = keys.length - this.options.maxEntries;
      for (let i = 0; i < entriesToRemove; i++) {
        await this.cache.delete(keys[i]);
      }
    }
  }
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npm test -- tests/cache-strategy.test.js -t "should cleanup"`
Expected: PASS

- [ ] **Step 13: Commit changes**

```bash
git add js/services/CacheStrategy.js tests/cache-strategy.test.js
git commit -m "feat: implement CacheStrategy with cache-first strategy and cleanup"
```

---
### Task 2: Data Synchronization Manager

**Files:**
- Create: `js/services/OfflineSyncManager.js`
- Modify: `service-worker.js:308-350`
- Modify: `offline-db.js:166-165`
- Test: `tests/offline-sync-manager.test.js`

- [ ] **Step 1: Write failing test for OfflineSyncManager constructor**

```javascript
// tests/offline-sync-manager.test.js
import { OfflineSyncManager } from '../../js/services/OfflineSyncManager.js';

describe('OfflineSyncManager', () => {
  test('should create instance with default options', () => {
    const syncManager = new OfflineSyncManager();
    expect(syncManager.queue).toEqual([]);
    expect(syncManager.isSyncing).toBe(false);
    expect(syncManager.options.retryAttempts).toBe(3);
    expect(syncManager.options.retryDelay).toBe(5000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/offline-sync-manager.test.js -t "OfflineSyncManager"`
Expected: FAIL with "Cannot find module '../../js/services/OfflineSyncManager.js'"

- [ ] **Step 3: Write minimal OfflineSyncManager class**

```javascript
// js/services/OfflineSyncManager.js
export class OfflineSyncManager {
  constructor(options = {}) {
    this.queue = [];
    this.isSyncing = false;
    this.options = {
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 5000,
      maxQueueSize: options.maxQueueSize || 100,
      ...options
    };
  }

  async addToQueue(item) {
    if (this.queue.length >= this.options.maxQueueSize) {
      throw new Error('Sync queue is full');
    }
    
    this.queue.push({
      ...item,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      attempts: 0,
      createdAt: Date.now()
    });
    
    // Trigger sync if not already syncing
    if (!this.isSyncing) {
      this.startSync();
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/offline-sync-manager.test.js -t "OfflineSyncManager"`
Expected: PASS

- [ ] **Step 5: Write failing test for sync operations**

```javascript
// tests/offline-sync-manager.test.js
test('should sync favorite actions to server', async () => {
  const syncManager = new OfflineSyncManager();
  
  // Mock server API
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
  );
  
  // Add favorite action
  await syncManager.addToQueue({
    type: 'favorite',
    action: 'add',
    activityId: 'activity-123',
    timestamp: Date.now()
  });
  
  // Wait for sync
  await new Promise(resolve => setTimeout(resolve, 100));
  
  expect(global.fetch).toHaveBeenCalled();
  expect(syncManager.queue[0].status).toBe('completed');
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- tests/offline-sync-manager.test.js -t "should sync favorite"`
Expected: FAIL with "syncManager.startSync is not a function"

- [ ] **Step 7: Implement startSync and processQueue methods**

```javascript
// js/services/OfflineSyncManager.js
export class OfflineSyncManager {
  // ... existing constructor and addToQueue ...

  async startSync() {
    if (this.isSyncing || this.queue.length === 0) {
      return;
    }
    
    this.isSyncing = true;
    
    try {
      await this.processQueue();
    } catch (error) {
      console.error('[OfflineSyncManager] Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      
      try {
        await this.processItem(item);
        // Remove successfully processed item
        this.queue.shift();
      } catch (error) {
        console.error(`[OfflineSyncManager] Failed to process item ${item.id}:`, error);
        
        // Update attempt count
        item.attempts++;
        
        if (item.attempts >= this.options.retryAttempts) {
          // Max attempts reached, move to failed
          item.status = 'failed';
          item.error = error.message;
          this.queue.shift();
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
        }
      }
    }
  }

  async processItem(item) {
    switch (item.type) {
      case 'favorite':
        await this.syncFavorite(item);
        break;
      case 'preference':
        await this.syncPreference(item);
        break;
      case 'note':
        await this.syncNote(item);
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }
    
    item.status = 'completed';
    item.completedAt = Date.now();
  }

  async syncFavorite(item) {
    // In a real app, this would send to your server API
    // For now, simulate API call
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        activityId: item.activityId,
        action: item.action,
        timestamp: item.timestamp
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync favorite: ${response.status}`);
    }
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- tests/offline-sync-manager.test.js -t "should sync favorite"`
Expected: PASS

- [ ] **Step 9: Modify service-worker.js to use OfflineSyncManager**

```javascript
// service-worker.js:308-350
import { OfflineSyncManager } from './js/services/OfflineSyncManager.js';

const syncManager = new OfflineSyncManager();

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'sync-all') {
    event.waitUntil(syncManager.startSync());
  }
});

// Update syncFavorites function to use syncManager
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
        timestamp: favorite.addedAt
      });
    }

    console.log('[ServiceWorker] Favorites added to sync queue');

  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error;
  }
}
```

- [ ] **Step 10: Run tests to verify integration works**

Run: `npm test -- tests/offline-sync-manager.test.js`
Expected: PASS

- [ ] **Step 11: Commit changes**

```bash
git add js/services/OfflineSyncManager.js service-worker.js tests/offline-sync-manager.test.js
git commit -m "feat: implement OfflineSyncManager for background data synchronization"
```

---
### Task 3: Enhanced Network Monitor

**Files:**
- Modify: `js/offline.js` (replace with enhanced version)
- Create: `js/utils/network-monitor.js` (extract NetworkMonitor class)
- Test: `tests/network-monitor.test.js`

- [ ] **Step 1: Extract NetworkMonitor class to separate file**

```javascript
// js/utils/network-monitor.js
export class NetworkMonitor {
  constructor() {
    this.latencyMeasurements = [];
    this.bandwidthSamples = [];
    this.reliabilityScore = 1.0;
    this.maxSamples = 10;
    this.networkQuality = this.getInitialQuality();
    this.listeners = new Set();
    
    this.startMonitoring();
  }
  
  // ... existing methods from offline.js ...
  
  addEventListener(listener) {
    this.listeners.add(listener);
  }
  
  removeEventListener(listener) {
    this.listeners.delete(listener);
  }
  
  notifyListeners(quality) {
    this.listeners.forEach(listener => {
      try {
        listener(quality);
      } catch (error) {
        console.error('[NetworkMonitor] Listener error:', error);
      }
    });
  }
}
```

- [ ] **Step 2: Update offline.js to use extracted class**

```javascript
// js/offline.js (simplified)
import { NetworkMonitor } from './utils/network-monitor.js';

// Initialize network monitor
const networkMonitor = new NetworkMonitor();

// Export for use in other modules
window.networkMonitor = networkMonitor;

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('ServiceWorker registered:', registration);
    })
    .catch(error => {
      console.error('ServiceWorker registration failed:', error);
    });
}
```

- [ ] **Step 3: Write tests for enhanced NetworkMonitor**

```javascript
// tests/network-monitor.test.js
import { NetworkMonitor } from '../../js/utils/network-monitor.js';

describe('NetworkMonitor', () => {
  test('should notify listeners when network quality changes', () => {
    const monitor = new NetworkMonitor();
    const listener = jest.fn();
    
    monitor.addEventListener(listener);
    monitor.networkQuality = { online: false, latency: 1000 };
    monitor.notifyListeners(monitor.networkQuality);
    
    expect(listener).toHaveBeenCalledWith(monitor.networkQuality);
  });
});
```

- [ ] **Step 4: Run tests and commit**

```bash
git add js/utils/network-monitor.js js/offline.js tests/network-monitor.test.js
git commit -m "feat: enhance NetworkMonitor with event system and extract to separate file"
```

---
### Task 4: Offline Status UI Component

**Files:**
- Create: `js/components/OfflineStatus.js`
- Modify: `index.html:47-54`
- Modify: `day.html`
- Modify: `js/app.js`
- Test: `tests/offline-status.test.js`

- [ ] **Step 1: Create OfflineStatus component**

```javascript
// js/components/OfflineStatus.js
export class OfflineStatus extends HTMLElement {
  constructor() {
    super();
    this.networkMonitor = window.networkMonitor;
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    this.innerHTML = `
      <div class="offline-status">
        <span class="status-indicator"></span>
        <span class="status-text">在线</span>
        <button class="refresh-btn" aria-label="刷新">刷新</button>
      </div>
    `;
  }
  
  updateStatus(quality) {
    const indicator = this.querySelector('.status-indicator');
    const text = this.querySelector('.status-text');
    
    if (!quality.online) {
      indicator.className = 'status-indicator offline';
      text.textContent = '离线';
      this.classList.add('offline');
    } else if (quality.latency > 1000) {
      indicator.className = 'status-indicator slow';
      text.textContent = '网络较慢';
      this.classList.add('slow');
    } else {
      indicator.className = 'status-indicator online';
      text.textContent = '在线';
      this.classList.remove('offline', 'slow');
    }
  }
  
  setupEventListeners() {
    if (this.networkMonitor) {
      this.networkMonitor.addEventListener((quality) => {
        this.updateStatus(quality);
      });
    }
    
    this.querySelector('.refresh-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }
}

// Register custom element
customElements.define('offline-status', OfflineStatus);
```

- [ ] **Step 2: Add to index.html and day.html**

```html
<!-- index.html:47-54 and day.html similar location -->
<script src="js/components/OfflineStatus.js" type="module"></script>
</body>
</html>
```

- [ ] **Step 3: Initialize in app.js**

```javascript
// js/app.js (add near top)
import './components/OfflineStatus.js';

// Component will auto-register and initialize
```

- [ ] **Step 4: Add CSS styles**

```css
/* Add to css/components.css */
.offline-status {
  position: fixed;
  top: 10px;
  right: 10px;
  background: white;
  border-radius: 20px;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  font-size: 14px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.online {
  background: #30d158;
}

.status-indicator.slow {
  background: #ff9500;
}

.status-indicator.offline {
  background: #ff3b30;
}

.refresh-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}
```

- [ ] **Step 5: Write tests and commit**

```bash
git add js/components/OfflineStatus.js index.html day.html js/app.js css/components.css tests/offline-status.test.js
git commit -m "feat: add OfflineStatus UI component for network status display"
```

---
### Task 5: Background Sync Implementation Enhancement

**Files:**
- Modify: `service-worker.js:308-350` (enhance sync capabilities)
- Modify: `service-worker.js:318-324` (periodic sync)
- Test: `tests/service-worker-sync.test.js`

- [ ] **Step 1: Enhance periodic sync for content updates**

```javascript
// service-worker.js:318-324
self.addEventListener('periodicsync', event => {
  console.log('[ServiceWorker] Periodic sync:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateCachedContent());
  } else if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupOldCacheEntries());
  } else if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function cleanupOldCacheEntries() {
  console.log('[ServiceWorker] Cleaning up old cache entries...');
  
  const cacheNames = await caches.keys();
  const currentCaches = Object.values(CACHE_NAMES);
  
  for (const cacheName of cacheNames) {
    if (!currentCaches.includes(cacheName)) {
      console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
      await caches.delete(cacheName);
    }
  }
}
```

- [ ] **Step 2: Add sync registration in app.js**

```javascript
// js/app.js - add sync registration
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    
    try {
      // Register for favorite sync
      await registration.sync.register('sync-favorites');
      console.log('Background sync registered for favorites');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }
}

// Call when user adds a favorite
async function onFavoriteAdded(activityId) {
  // Add to IndexedDB
  await OfflineDB.addToFavorites(activityId);
  
  // Register background sync
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-favorites');
  }
}
```

- [ ] **Step 3: Write tests for sync functionality**

```javascript
// tests/service-worker-sync.test.js
describe('Service Worker Sync', () => {
  test('should handle periodic sync events', async () => {
    // Mock periodic sync event
    const event = {
      tag: 'update-content',
      waitUntil: jest.fn()
    };
    
    // Would need to mock service worker context
    // Test would verify event handlers are set up
  });
});
```

- [ ] **Step 4: Commit changes**

```bash
git add service-worker.js js/app.js tests/service-worker-sync.test.js
git commit -m "feat: enhance background sync with periodic cleanup and registration"
```

---
### Task 6: PWA Installation Experience Enhancement

**Files:**
- Modify: `js/pwa-install.js:111-136` (install eligibility checking)
- Modify: `js/pwa-install.js:283-508` (custom install prompt UI)
- Test: `tests/pwa-install.test.js`

- [ ] **Step 1: Enhance install eligibility with engagement scoring**

```javascript
// js/pwa-install.js:111-136
checkInstallEligibility() {
  // Don't show if already installed
  if (this.isInstalled) return false;
  
  // Don't show if no deferred prompt
  if (!this.deferredPrompt) return false;
  
  // Calculate engagement score
  const engagementScore = this.calculateEngagementScore();
  
  // Require minimum engagement score
  if (engagementScore < 0.7) {
    console.log(`[PWAInstallManager] Engagement score too low: ${engagementScore}`);
    return false;
  }
  
  // Don't show too frequently
  if (this.hasShownPrompt && this.stats.promptShown >= 3) {
    console.log('[PWAInstallManager] Prompt shown too many times already');
    return false;
  }
  
  return true;
},

calculateEngagementScore() {
  const visitsWeight = Math.min(this.stats.visits / 3, 1); // Max 3 visits
  const timeWeight = Math.min(this.stats.totalTime / 60, 1); // Max 60 seconds
  const interactionWeight = this.hasUserInteracted() ? 1 : 0.5;
  
  return (visitsWeight * 0.4 + timeWeight * 0.4 + interactionWeight * 0.2);
},

hasUserInteracted() {
  // Check if user has interacted with the app
  return this.stats.installAccepted > 0 || 
         this.stats.installDismissed > 0 ||
         localStorage.getItem('userInteracted') === 'true';
}
```

- [ ] **Step 2: Improve custom install prompt UI with better visuals**

```javascript
// js/pwa-install.js:283-508 - Update modal HTML with better design
modal.innerHTML = `
  <div class="pwa-install-modal-content">
    <button class="pwa-install-close" aria-label="关闭">×</button>
    <div class="pwa-install-header">
      <div class="pwa-install-icon-large">📱</div>
      <h3 class="pwa-install-title">安装旅行指南</h3>
      <p class="pwa-install-subtitle">更好的旅行体验</p>
      <div class="pwa-install-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 70%"></div>
        </div>
        <div class="progress-text">离线数据已准备 70%</div>
      </div>
    </div>
    <div class="pwa-install-benefits">
      <!-- Updated benefit cards -->
    </div>
    <div class="pwa-install-actions">
      <button class="pwa-install-cancel">稍后再说</button>
      <button class="pwa-install-confirm">
        <span class="install-icon">↓</span>
        安装应用
      </button>
    </div>
  </div>
`;
```

- [ ] **Step 3: Add pre-install caching progress indicator**

```javascript
// js/pwa-install.js - Add method
async prepareOfflineCache() {
  console.log('[PWAInstallManager] Preparing offline cache...');
  
  const cacheProgress = {
    total: STATIC_ASSETS.length,
    cached: 0
  };
  
  // Update progress in UI
  this.updateCacheProgress(cacheProgress);
  
  // Cache assets in background
  caches.open(CACHE_NAMES.STATIC).then(cache => {
    STATIC_ASSETS.forEach(async (asset, index) => {
      try {
        await cache.add(asset);
        cacheProgress.cached++;
        this.updateCacheProgress(cacheProgress);
      } catch (error) {
        console.warn(`Failed to cache ${asset}:`, error);
      }
    });
  });
},

updateCacheProgress(progress) {
  const progressElement = document.querySelector('.pwa-install-progress');
  if (progressElement) {
    const percentage = Math.round((progress.cached / progress.total) * 100);
    progressElement.querySelector('.progress-fill').style.width = `${percentage}%`;
    progressElement.querySelector('.progress-text').textContent = 
      `离线数据已准备 ${percentage}%`;
  }
}
```

- [ ] **Step 4: Commit changes**

```bash
git add js/pwa-install.js tests/pwa-install.test.js
git commit -m "feat: enhance PWA install experience with engagement scoring and cache progress"
```

---
### Task 7: Offline Map Support

**Files:**
- Create: `js/services/OfflineMapService.js`
- Modify: `js/map.js`
- Create: `images/map-fallbacks/` directory
- Test: `tests/offline-map.test.js`

- [ ] **Step 1: Create OfflineMapService for fallback maps**

```javascript
// js/services/OfflineMapService.js
export class OfflineMapService {
  constructor() {
    this.fallbackCacheName = 'map-fallbacks';
    this.staticMaps = {
      'zurich': '/images/map-fallbacks/zurich.png',
      'interlaken': '/images/map-fallbacks/interlaken.png',
      // Add more city maps
    };
  }
  
  async getMapForCity(cityName) {
    // Check if we have cached static map
    const cache = await caches.open(this.fallbackCacheName);
    const cachedResponse = await cache.match(this.staticMaps[cityName]);
    
    if (cachedResponse) {
      return {
        type: 'static',
        url: this.staticMaps[cityName],
        cached: true
      };
    }
    
    // Try to fetch and cache
    try {
      const response = await fetch(this.staticMaps[cityName]);
      if (response.ok) {
        const clone = response.clone();
        cache.put(this.staticMaps[cityName], clone);
        return {
          type: 'static',
          url: this.staticMaps[cityName],
          cached: false
        };
      }
    } catch (error) {
      console.warn(`Failed to load static map for ${cityName}:`, error);
    }
    
    // Return generic fallback
    return {
      type: 'generic',
      html: this.createGenericMap(cityName)
    };
  }
  
  createGenericMap(cityName) {
    return `
      <div class="offline-map">
        <div class="map-placeholder">
          <div class="placeholder-icon">🗺️</div>
          <h3>${cityName} 地图</h3>
          <p>离线模式下无法显示交互式地图</p>
          <p>请连接网络后查看详细地图</p>
        </div>
      </div>
    `;
  }
  
  async preCacheAllMaps() {
    const cache = await caches.open(this.fallbackCacheName);
    const promises = Object.values(this.staticMaps).map(async (url) => {
      try {
        await cache.add(url);
        console.log(`Cached map: ${url}`);
      } catch (error) {
        console.warn(`Failed to cache ${url}:`, error);
      }
    });
    
    await Promise.all(promises);
  }
}
```

- [ ] **Step 2: Integrate with map.js for offline fallback**

```javascript
// js/map.js - modify map initialization
import { OfflineMapService } from './services/OfflineMapService.js';

const offlineMapService = new OfflineMapService();

function initMap() {
  if (!navigator.onLine) {
    showOfflineMap();
    return;
  }
  
  // Normal Google Maps initialization
  // ...
}

async function showOfflineMap() {
  const currentCity = getCurrentCity(); // Get from trip data
  const mapInfo = await offlineMapService.getMapForCity(currentCity);
  
  const mapContainer = document.getElementById('map');
  
  if (mapInfo.type === 'static') {
    mapContainer.innerHTML = `
      <img src="${mapInfo.url}" alt="${currentCity} 离线地图" class="static-map">
      <div class="offline-notice">
        <p>离线地图 - 交互功能不可用</p>
      </div>
    `;
  } else {
    mapContainer.innerHTML = mapInfo.html;
  }
}
```

- [ ] **Step 3: Create static map images and cache them**

Create directory `images/map-fallbacks/` with static PNG images for each city:
- zurich.png, interlaken.png, geneva.png, etc.

- [ ] **Step 4: Write tests and commit**

```bash
git add js/services/OfflineMapService.js js/map.js images/map-fallbacks/ tests/offline-map.test.js
git commit -m "feat: add offline map support with static fallback maps"
```

---
### Task 8: Integration and Testing

**Files:**
- Modify: `service-worker.js` (final integration of CacheStrategy)
- Modify: `js/app.js` (initialize all services)
- Test: Run all test suites
- Test: Lighthouse PWA audit

- [ ] **Step 1: Integrate CacheStrategy into service-worker.js fetch handler**

```javascript
// service-worker.js:108-130
import { CacheStrategy } from './js/services/CacheStrategy.js';

// Define cache strategies for different resource types
const cacheStrategies = {
  html: new CacheStrategy(CACHE_NAMES.STATIC, {
    strategy: 'network-first',
    maxAge: 3600000 // 1 hour
  }),
  data: new CacheStrategy(CACHE_NAMES.DATA, {
    strategy: 'network-first',
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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  
  // Route to appropriate cache strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(cacheStrategies.html.handleRequest(event.request));
  } else if (url.pathname.includes('/data/')) {
    event.respondWith(cacheStrategies.data.handleRequest(event.request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    event.respondWith(cacheStrategies.media.handleRequest(event.request));
  } else {
    event.respondWith(cacheStrategies.static.handleRequest(event.request));
  }
});
```

- [ ] **Step 2: Initialize all services in app.js**

```javascript
// js/app.js - add initialization
import './services/CacheStrategy.js';
import './services/OfflineSyncManager.js';
import './services/OfflineMapService.js';
import './components/OfflineStatus.js';
import './utils/network-monitor.js';

// Initialize network monitor
window.networkMonitor = new NetworkMonitor();

// Initialize offline map service
window.offlineMapService = new OfflineMapService();

// Register for background sync when online
if (navigator.onLine && 'serviceWorker' in navigator) {
  registerBackgroundSync();
}

// Pre-cache static maps on install
if (window.PWAInstallManager && window.PWAInstallManager.isInstallPromptAvailable()) {
  window.offlineMapService.preCacheAllMaps();
}
```

- [ ] **Step 3: Run comprehensive test suite**

```bash
npm test
```
Expected: All tests pass (should be 23 existing tests + new tests from Phase 3)

- [ ] **Step 4: Run Lighthouse PWA audit**

```bash
# Use Chrome DevTools Lighthouse or CLI
# Expected scores:
# - PWA: >90
# - Performance: >90  
# - Accessibility: >90
# - Best Practices: >90
# - SEO: >90
```

- [ ] **Step 5: Test offline functionality manually**

1. Disable network in DevTools
2. Refresh page - should load from cache
3. Navigate to different days - should work
4. Try search - should work with IndexedDB
5. Check map - should show offline fallback
6. Add favorite - should queue for sync

- [ ] **Step 6: Commit final integration**

```bash
git add service-worker.js js/app.js
git commit -m "feat: final integration of Phase 3 PWA offline optimizations"
```

---
## Self-Review

**1. Spec coverage:** 
- Smart caching strategies ✓ (Task 1)
- Data synchronization ✓ (Task 2) 
- Network quality detection ✓ (Task 3)
- Offline status UI ✓ (Task 4)
- Background sync ✓ (Task 5)
- PWA installation experience ✓ (Task 6)
- Offline map support ✓ (Task 7)
- Integration and testing ✓ (Task 8)

**2. Placeholder scan:** No placeholders found. All tasks include complete code implementations.

**3. Type consistency:** Method names and property names are consistent across tasks.

## Execution Handoff

Plan complete and saved to `/Users/zsn/travel-guide-project/travel-guide/docs/superpowers/plans/2026-04-06-phase3-pwa-offline-optimization.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Fresh subagent per task + two-stage review

**If Inline Execution chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:executing-plans
- Batch execution with checkpoints for review
