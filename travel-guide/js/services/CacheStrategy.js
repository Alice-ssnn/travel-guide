// js/services/CacheStrategy.js
class CacheStrategy {
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
        throw new Error(`Unknown cache strategy: ${this.options.strategy}`);
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


  async handleNetworkFirst(request) {
    throw new Error('Network-first strategy not implemented');
  }

  async handleStaleWhileRevalidate(request) {
    throw new Error('Stale-while-revalidate strategy not implemented');
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

if (typeof self !== 'undefined') {
  self.CacheStrategy = CacheStrategy;
}

module.exports = { CacheStrategy };