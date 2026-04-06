// offline.js - Service Worker registration and offline functionality
// Part of Phase 2 Week 4: Offline functionality optimization

/**
 * NetworkMonitor class has been extracted to js/utils/network-monitor.js
 * Make sure to include it before this script in your HTML.
 */
// NetworkMonitor is now available globally from network-monitor.js

/**
 * OfflineManager - Main offline functionality controller
 */
const OfflineManager = {
  // Network monitor instance
  networkMonitor: null,

  // IndexedDB instance
  offlineDB: null,

  /**
   * Initialize offline functionality
   */
  init() {
    console.log('OfflineManager initializing...');

    // Initialize network monitor
    this.networkMonitor = new NetworkMonitor();

    // Register Service Worker
    this.registerServiceWorker();

    // Setup offline detection
    this.setupOfflineDetection();

    // Setup cache management
    this.setupCacheManagement();

    // Setup periodic sync if supported
    this.setupPeriodicSync();

    // Initialize IndexedDB
    this.initIndexedDB();
  },

  /**
   * Register Service Worker
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.log('Service Worker supported, registering...');

      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found:', newWorker);

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available
                  this.showUpdateNotification();
                } else {
                  // First install
                  console.log('Service Worker first install completed');
                }
              }
            });
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed, reloading page...');
        window.location.reload();
      });
    } else {
      console.warn('Service Worker not supported');
    }
  },

  /**
   * Setup offline detection
   */
  setupOfflineDetection() {
    // Update UI based on online status and network quality
    const updateNetworkStatus = async () => {
      const isOnline = navigator.onLine;
      document.documentElement.classList.toggle('is-offline', !isOnline);
      document.documentElement.classList.toggle('is-online', isOnline);

      if (this.networkMonitor) {
        const quality = this.networkMonitor.checkQuality();
        console.log('Network quality:', quality);

        // Update data attribute for CSS styling
        document.documentElement.setAttribute('data-network-type', quality.type);
        document.documentElement.setAttribute('data-network-latency',
          quality.latency < 100 ? 'low' : quality.latency < 500 ? 'medium' : 'high');

        // Show network quality indicator
        this.showNetworkQualityIndicator(quality);
      } else {
        console.log('Network status:', isOnline ? 'online' : 'offline');
      }

      // Show offline indicator if offline
      if (!isOnline) {
        this.showOfflineIndicator();
      } else {
        this.hideOfflineIndicator();
      }

      // Trigger adaptive content loading
      this.triggerAdaptiveContentLoading();
    };

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Also update periodically to reflect changing network conditions
    setInterval(() => {
      if (navigator.onLine) {
        updateNetworkStatus();
      }
    }, 60000); // Update every minute when online

    // Initial status
    updateNetworkStatus();
  },

  /**
   * Show network quality indicator
   */
  showNetworkQualityIndicator(quality) {
    // Remove existing indicator
    this.hideNetworkQualityIndicator();

    if (!quality.online || quality.type === 'wifi' || quality.type === '4g') {
      return; // Don't show for good connections
    }

    // Create quality indicator
    const indicator = document.createElement('div');
    indicator.id = 'network-quality-indicator';
    indicator.className = `network-quality network-quality-${quality.type}`;

    let message = '';
    let icon = '📶';

    switch (quality.type) {
      case 'slow-2g':
        message = '网络缓慢，正在优化内容';
        icon = '🐌';
        break;
      case '2g':
        message = '网络较慢，部分内容已简化';
        icon = '🚲';
        break;
      case '3g':
        message = '网络一般';
        icon = '🚗';
        break;
      default:
        message = '网络质量一般';
    }

    indicator.innerHTML = `
      <div class="network-quality-content">
        <span class="network-quality-icon">${icon}</span>
        <span class="network-quality-text">${message}</span>
      </div>
    `;

    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(10px);
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(indicator);

    // Auto-hide after 5 seconds for non-critical warnings
    if (quality.type !== 'slow-2g') {
      setTimeout(() => this.hideNetworkQualityIndicator(), 5000);
    }
  },

  /**
   * Hide network quality indicator
   */
  hideNetworkQualityIndicator() {
    const indicator = document.getElementById('network-quality-indicator');
    if (indicator && indicator.parentNode) {
      indicator.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  },

  /**
   * Trigger adaptive content loading based on network quality
   */
  triggerAdaptiveContentLoading() {
    if (!this.networkMonitor) return;

    const quality = this.networkMonitor.checkQuality();

    // Dispatch custom event for other parts of the app
    const event = new CustomEvent('network-quality-change', {
      detail: { quality }
    });
    window.dispatchEvent(event);

    // Update image loading strategy
    this.updateImageLoadingStrategy(quality);

    // Update data loading strategy
    this.updateDataLoadingStrategy(quality);
  },

  /**
   * Update image loading strategy based on network quality
   */
  updateImageLoadingStrategy(quality) {
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');

    images.forEach(img => {
      if (quality.bandwidth < 500000) { // Less than 500 kbps
        // Use low-quality images
        const lowResSrc = img.getAttribute('data-lowres-src');
        if (lowResSrc && !img.src.includes(lowResSrc)) {
          img.src = lowResSrc;
        }
      } else {
        // Use normal images
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc && !img.src.includes(dataSrc)) {
          img.src = dataSrc;
        }
      }
    });
  },

  /**
   * Update data loading strategy based on network quality
   */
  updateDataLoadingStrategy(quality) {
    // This would be implemented based on your app's data loading needs
    // For example, you might load less data on slow connections
    console.log('[OfflineManager] Updating data loading strategy for', quality.type);
  },

  /**
   * Setup cache management UI
   */
  setupCacheManagement() {
    // Create cache management button in dev mode
    if (process.env.NODE_ENV === 'development') {
      this.createCacheManagementUI();
    }
  },

  /**
   * Setup periodic background sync if supported
   */
  setupPeriodicSync() {
    if ('periodicSync' in window && 'serviceWorker' in navigator) {
      // Request permission
      navigator.serviceWorker.ready.then(registration => {
        if ('periodicSync' in registration) {
          registration.periodicSync.register('update-content', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          }).then(() => {
            console.log('Periodic sync registered');
          }).catch(error => {
            console.warn('Periodic sync registration failed:', error);
          });
        }
      });
    }
  },

  /**
   * Show update notification
   */
  showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <div class="update-text">新版本可用</div>
        <button class="btn btn-primary btn-small update-reload">重新加载</button>
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary, #667eea);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    const updateContent = notification.querySelector('.update-content');
    updateContent.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    const updateText = notification.querySelector('.update-text');
    updateText.style.cssText = `
      font-weight: 500;
      font-size: 14px;
    `;

    const reloadBtn = notification.querySelector('.update-reload');
    reloadBtn.style.cssText = `
      padding: 4px 12px;
      font-size: 12px;
      background: white;
      color: var(--primary, #667eea);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    `;

    reloadBtn.addEventListener('click', () => {
      window.location.reload();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 10000);

    document.body.appendChild(notification);

    // Add CSS animations
    if (!document.querySelector('#update-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'update-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * Show offline indicator
   */
  showOfflineIndicator() {
    // Create or update offline indicator
    let indicator = document.getElementById('offline-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.innerHTML = `
        <div class="offline-content">
          <div class="offline-icon">📶</div>
          <div class="offline-text">离线模式</div>
        </div>
      `;

      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--text-primary, #1d1d1f);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
      `;

      const offlineContent = indicator.querySelector('.offline-content');
      offlineContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      document.body.appendChild(indicator);

      // Add CSS animation
      if (!document.querySelector('#offline-indicator-styles')) {
        const style = document.createElement('style');
        style.id = 'offline-indicator-styles';
        style.textContent = `
          @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  },

  /**
   * Hide offline indicator
   */
  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator && indicator.parentNode) {
      indicator.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  },

  /**
   * Create cache management UI (for development)
   */
  createCacheManagementUI() {
    // Add cache management button to header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      const cacheBtn = document.createElement('button');
      cacheBtn.className = 'btn btn-secondary btn-cache';
      cacheBtn.innerHTML = '🔄';
      cacheBtn.title = '管理缓存';
      cacheBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        padding: 0;
        font-size: 18px;
      `;

      cacheBtn.addEventListener('click', () => {
        this.showCacheManagement();
      });

      headerActions.appendChild(cacheBtn);
    }
  },

  /**
   * Show cache management dialog
   */
  async showCacheManagement() {
    if (!('caches' in window)) {
      alert('浏览器不支持缓存管理');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async name => {
          const cache = await caches.open(name);
          const requests = await cache.keys();
          return {
            name,
            size: requests.length,
            urls: requests.map(req => req.url)
          };
        })
      );

      const cacheInfoText = cacheInfo.map(info =>
        `• ${info.name}: ${info.size} 个文件\n${info.urls.slice(0, 5).map(url => `  - ${url.substring(0, 60)}...`).join('\n')}${info.urls.length > 5 ? '\n  - ...' : ''}`
      ).join('\n\n');

      const action = confirm(
        `缓存管理\n\n${cacheInfoText}\n\n操作:\n1. 确定 - 清除所有缓存\n2. 取消 - 关闭`
      );

      if (action) {
        await this.clearAllCaches();
        alert('缓存已清除，页面将重新加载');
        window.location.reload();
      }
    } catch (error) {
      console.error('Cache management error:', error);
      alert('缓存管理失败: ' + error.message);
    }
  },

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
  },

  /**
   * Check if app is running offline
   */
  isOffline() {
    return !navigator.onLine;
  },

  /**
   * Get storage usage estimate
   */
  async getStorageEstimate() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage,
          quota: estimate.quota,
          percentage: estimate.usage && estimate.quota ?
            (estimate.usage / estimate.quota * 100).toFixed(1) : 0
        };
      } catch (error) {
        console.error('Storage estimate failed:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Initialize IndexedDB and import trip data
   */
  async initIndexedDB() {
    try {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported');
        return;
      }

      // Initialize OfflineDB
      if (window.OfflineDB) {
        this.offlineDB = window.OfflineDB;
        console.log('[OfflineManager] IndexedDB initialized');

        // Import trip data if not already imported
        await this.importTripDataIfNeeded();
      } else {
        console.warn('[OfflineManager] OfflineDB module not loaded');
      }
    } catch (error) {
      console.error('[OfflineManager] IndexedDB initialization failed:', error);
    }
  },

  /**
   * Import trip data to IndexedDB if not already imported
   */
  async importTripDataIfNeeded() {
    try {
      // Check if data is already imported
      const stats = await this.offlineDB.getStats();
      const tripCount = stats.stores.trips || 0;

      if (tripCount < 2) { // Less than trip metadata + at least one day
        console.log('[OfflineManager] Importing trip data to IndexedDB...');

        // Get trip data from data.js
        if (window.TripData) {
          const tripData = window.TripData;
          const allDays = tripData.getAllDays();
          const tripInfo = tripData.getTripInfo();

          // Create a mock tripData object for import
          const mockTripData = {
            days: allDays,
            getTripInfo: () => tripInfo
          };

          await this.offlineDB.importTripData(mockTripData);
          console.log('[OfflineManager] Trip data imported successfully');
        } else {
          console.warn('[OfflineManager] TripData not available for import');
        }
      } else {
        console.log('[OfflineManager] Trip data already imported');
      }
    } catch (error) {
      console.error('[OfflineManager] Failed to import trip data:', error);
    }
  },

  /**
   * Get network quality information
   */
  getNetworkQuality() {
    return this.networkMonitor ? this.networkMonitor.checkQuality() : {
      online: navigator.onLine,
      latency: 0,
      bandwidth: Infinity,
      reliability: 1.0,
      type: 'unknown'
    };
  },

  /**
   * Adaptive content loading based on network quality
   */
  loadContentAdaptively(contentTypes) {
    if (!this.networkMonitor) {
      return contentTypes.full || contentTypes;
    }

    return this.networkMonitor.loadContentBasedOnNetwork(contentTypes);
  },

  /**
   * Check if network is suitable for media downloads
   */
  isNetworkSuitableForMedia() {
    return this.networkMonitor ? this.networkMonitor.isSuitableForMediaDownload() : navigator.onLine;
  },

  /**
   * Check if network is suitable for real-time updates
   */
  isNetworkSuitableForRealTime() {
    return this.networkMonitor ? this.networkMonitor.isSuitableForRealTime() : false;
  },

  /**
   * Request persistent storage
   */
  async requestPersistentStorage() {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const persisted = await navigator.storage.persist();
        console.log('Persistent storage:', persisted ? 'granted' : 'denied');
        return persisted;
      } catch (error) {
        console.error('Persistent storage request failed:', error);
        return false;
      }
    }
    return false;
  }
};

// Add CSS animations for network quality indicators
if (!document.querySelector('#network-quality-styles')) {
  const style = document.createElement('style');
  style.id = 'network-quality-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }

    /* Network quality CSS classes */
    .is-offline .online-only { display: none !important; }
    .is-online .offline-only { display: none !important; }

    [data-network-type="slow-2g"] img:not([data-essential]) {
      opacity: 0.5;
      filter: blur(1px);
    }

    [data-network-type="2g"] .low-priority-content {
      display: none;
    }

    .network-quality {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: none;
    }

    .network-quality-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .network-quality-icon {
      font-size: 14px;
    }

    .network-quality-text {
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}

// Initialize offline manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  OfflineManager.init();
});

// Export for use in other modules
window.OfflineManager = OfflineManager;