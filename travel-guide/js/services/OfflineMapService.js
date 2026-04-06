// js/services/OfflineMapService.js
/**
 * OfflineMapService - Provides offline map tile caching and fallback functionality
 * Integrates with Google Maps API to cache tiles and provide offline map viewing
 */
class OfflineMapService {
  constructor(options = {}) {
    this.options = {
      cacheName: 'map-tiles',
      maxTiles: 500,
      tileSize: 256,
      defaultZoom: 10,
      defaultCenter: { lat: 47.3769, lng: 8.5417 }, // Zurich
      offlineFallbackZoom: 8,
      ...options
    };

    this.cacheStrategy = null;
    this.isOnline = true;
    this.cachedTiles = new Map();
    this.tileQueue = [];
    this.maxQueueSize = 50;

    // Initialize network monitoring
    this.initNetworkMonitoring();
  }

  /**
   * Initialize the service with cache strategy
   */
  async initialize() {
    console.log('[OfflineMapService] Initializing...');

    try {
      // Initialize cache strategy for map tiles
      this.cacheStrategy = new CacheStrategy(this.options.cacheName, {
        strategy: 'cache-first',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for map tiles
        maxEntries: this.options.maxTiles,
        backgroundUpdate: false
      });

      await this.cacheStrategy.initialize();

      // Pre-cache important areas if online
      if (this.isOnline) {
        this.precacheImportantAreas();
      }

      console.log('[OfflineMapService] Initialized successfully');
    } catch (error) {
      console.error('[OfflineMapService] Initialization failed:', error);
    }
  }

  /**
   * Initialize network monitoring
   */
  initNetworkMonitoring() {
    // Use global network monitor if available
    if (window.networkMonitor) {
      window.networkMonitor.addEventListener((quality) => {
        this.isOnline = quality.online;
        this.onNetworkStatusChange(quality);
      });

      // Initial status
      const initialQuality = window.networkMonitor.checkQuality();
      this.isOnline = initialQuality.online;
    } else {
      // Fallback to navigator.onLine
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.onNetworkStatusChange({ online: true });
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.onNetworkStatusChange({ online: false });
      });
    }
  }

  /**
   * Handle network status changes
   */
  onNetworkStatusChange(quality) {
    console.log(`[OfflineMapService] Network status changed: online=${quality.online}`);

    if (quality.online) {
      // When coming back online, refresh critical tiles
      this.refreshCriticalTiles();
    } else {
      // When going offline, ensure we have enough cached tiles
      this.ensureOfflineCoverage();
    }
  }

  /**
   * Get map tile URL for Google Maps Static API
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} zoom - Zoom level
   * @param {number} width - Tile width
   * @param {number} height - Tile height
   * @returns {string} Tile URL
   */
  getTileUrl(lat, lng, zoom, width = this.options.tileSize, height = this.options.tileSize) {
    // Google Maps Static API URL
    const apiKey = window.MapManager?.config?.apiKey || '';
    const center = `${lat},${lng}`;
    const size = `${width}x${height}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&scale=2&maptype=roadmap&key=${apiKey}`;
  }

  /**
   * Cache a map tile
   * @param {string} tileUrl - Tile URL to cache
   * @param {string} tileKey - Unique key for the tile
   */
  async cacheTile(tileUrl, tileKey) {
    if (!this.cacheStrategy || !this.isOnline) {
      return false;
    }

    try {
      const request = new Request(tileUrl);
      const response = await fetch(request);

      if (response.ok) {
        // Cache the tile
        await this.cacheStrategy.cache.put(request, response.clone());
        this.cachedTiles.set(tileKey, {
          url: tileUrl,
          cachedAt: Date.now(),
          zoom: this.extractZoomFromUrl(tileUrl)
        });

        // Manage cache size
        this.manageCacheSize();

        return true;
      }
    } catch (error) {
      console.warn('[OfflineMapService] Failed to cache tile:', error);
    }

    return false;
  }

  /**
   * Get a map tile from cache or network
   * @param {string} tileUrl - Tile URL
   * @param {string} tileKey - Unique key for the tile
   * @returns {Promise<Response>} Tile response
   */
  async getTile(tileUrl, tileKey) {
    if (!this.cacheStrategy) {
      throw new Error('OfflineMapService not initialized');
    }

    const request = new Request(tileUrl);

    try {
      // Use cache strategy to handle the request
      const response = await this.cacheStrategy.handleRequest(request);
      return response;
    } catch (error) {
      console.error('[OfflineMapService] Failed to get tile:', error);

      // Return offline fallback tile
      return this.getOfflineTile();
    }
  }

  /**
   * Get offline fallback tile
   * @returns {Response} Offline tile response
   */
  getOfflineTile() {
    // Create a simple gray tile as fallback
    const canvas = document.createElement('canvas');
    canvas.width = this.options.tileSize;
    canvas.height = this.options.tileSize;
    const ctx = canvas.getContext('2d');

    // Draw gray background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= canvas.height; i += 32) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i <= canvas.width; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    // Draw offline text
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('离线地图', canvas.width / 2, canvas.height / 2);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new Response(blob, {
          headers: { 'Content-Type': 'image/png' }
        }));
      }, 'image/png');
    });
  }

  /**
   * Pre-cache important areas (travel locations)
   */
  async precacheImportantAreas() {
    if (!this.isOnline) {
      return;
    }

    console.log('[OfflineMapService] Pre-caching important areas...');

    // Get travel locations from data
    const locations = this.getTravelLocations();

    for (const location of locations) {
      const { lat, lng, zoom = this.options.defaultZoom } = location;
      const tileUrl = this.getTileUrl(lat, lng, zoom);
      const tileKey = this.generateTileKey(lat, lng, zoom);

      // Queue for caching
      this.queueTileForCaching(tileUrl, tileKey);
    }

    // Process queue
    await this.processTileQueue();
  }

  /**
   * Get travel locations from app data
   */
  getTravelLocations() {
    // Try to get locations from global data
    if (window.travelData && window.travelData.locations) {
      return window.travelData.locations;
    }

    // Fallback to default locations from the trip
    return [
      { lat: 47.3769, lng: 8.5417, name: 'Zurich', zoom: 12 },
      { lat: 46.2044, lng: 6.1432, name: 'Geneva', zoom: 12 },
      { lat: 48.8566, lng: 2.3522, name: 'Paris', zoom: 12 },
      { lat: 45.4642, lng: 9.1900, name: 'Milan', zoom: 12 },
      { lat: 46.5197, lng: 6.6323, name: 'Lausanne', zoom: 12 }
    ];
  }

  /**
   * Queue a tile for caching
   */
  queueTileForCaching(tileUrl, tileKey) {
    if (this.tileQueue.length >= this.maxQueueSize) {
      this.tileQueue.shift(); // Remove oldest
    }

    this.tileQueue.push({ tileUrl, tileKey });
  }

  /**
   * Process tile caching queue
   */
  async processTileQueue() {
    const queue = [...this.tileQueue];
    this.tileQueue = [];

    for (const item of queue) {
      await this.cacheTile(item.tileUrl, item.tileKey);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Refresh critical tiles when back online
   */
  async refreshCriticalTiles() {
    console.log('[OfflineMapService] Refreshing critical tiles...');

    // Refresh recently viewed tiles
    const recentTiles = Array.from(this.cachedTiles.entries())
      .sort((a, b) => b[1].cachedAt - a[1].cachedAt)
      .slice(0, 20); // Top 20 most recent

    for (const [tileKey, tileData] of recentTiles) {
      await this.cacheTile(tileData.url, tileKey);
    }
  }

  /**
   * Ensure offline coverage for current viewport
   */
  ensureOfflineCoverage() {
    // This would be called when the map viewport changes
    // For now, just log
    console.log('[OfflineMapService] Ensuring offline coverage...');
  }

  /**
   * Manage cache size
   */
  manageCacheSize() {
    if (this.cachedTiles.size > this.options.maxTiles) {
      // Remove oldest tiles
      const sortedTiles = Array.from(this.cachedTiles.entries())
        .sort((a, b) => a[1].cachedAt - b[1].cachedAt);

      const tilesToRemove = sortedTiles.slice(0, this.cachedTiles.size - this.options.maxTiles);

      for (const [tileKey] of tilesToRemove) {
        this.cachedTiles.delete(tileKey);
      }
    }
  }

  /**
   * Generate unique tile key
   */
  generateTileKey(lat, lng, zoom) {
    return `tile_${lat.toFixed(4)}_${lng.toFixed(4)}_${zoom}`;
  }

  /**
   * Extract zoom level from URL
   */
  extractZoomFromUrl(url) {
    const match = url.match(/zoom=(\d+)/);
    return match ? parseInt(match[1], 10) : this.options.defaultZoom;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedTiles: this.cachedTiles.size,
      maxTiles: this.options.maxTiles,
      isOnline: this.isOnline,
      tileQueue: this.tileQueue.length
    };
  }

  /**
   * Clear all cached tiles
   */
  async clearCache() {
    if (this.cacheStrategy && this.cacheStrategy.cache) {
      const keys = await this.cacheStrategy.cache.keys();
      for (const key of keys) {
        await this.cacheStrategy.cache.delete(key);
      }
    }

    this.cachedTiles.clear();
    this.tileQueue = [];

    console.log('[OfflineMapService] Cache cleared');
  }
}

// Export for browser
if (typeof self !== 'undefined') {
  self.OfflineMapService = OfflineMapService;
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OfflineMapService };
}