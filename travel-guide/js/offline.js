// offline.js - Service Worker registration and offline functionality

const OfflineManager = {
  /**
   * Initialize offline functionality
   */
  init() {
    console.log('OfflineManager initializing...');

    // Register Service Worker
    this.registerServiceWorker();

    // Setup offline detection
    this.setupOfflineDetection();

    // Setup cache management
    this.setupCacheManagement();

    // Setup periodic sync if supported
    this.setupPeriodicSync();
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
    // Update UI based on online status
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      document.documentElement.classList.toggle('is-offline', !isOnline);
      document.documentElement.classList.toggle('is-online', isOnline);

      console.log('Network status:', isOnline ? 'online' : 'offline');

      // Show offline indicator if offline
      if (!isOnline) {
        this.showOfflineIndicator();
      } else {
        this.hideOfflineIndicator();
      }
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial status
    updateOnlineStatus();
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

// Initialize offline manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  OfflineManager.init();
});

// Export for use in other modules
window.OfflineManager = OfflineManager;