// pwa-install.js - PWA installation experience optimization
// Part of Phase 2 Week 4: Offline functionality optimization

const PWAInstallManager = {
  // Installation state
  deferredPrompt: null,
  isInstalled: false,
  hasShownPrompt: false,

  // Configuration
  config: {
    minVisits: 2, // Show prompt after 2 visits
    minTimeOnSite: 30, // 30 seconds minimum time on site
    promptDelay: 5000, // 5 seconds delay before showing prompt
    hideAfterInstall: true,
    trackStats: true
  },

  // Statistics
  stats: {
    visits: 0,
    totalTime: 0,
    lastVisit: null,
    promptShown: 0,
    installAccepted: 0,
    installDismissed: 0
  },

  /**
   * Initialize PWA installation manager
   */
  init() {
    console.log('[PWAInstallManager] Initializing...');

    // Check if already installed
    this.checkIfInstalled();

    // Load statistics
    this.loadStats();

    // Set up event listeners
    this.setupEventListeners();

    // Check if we should show install prompt
    this.checkInstallEligibility();

    // Update statistics
    this.updateStats();
  },

  /**
   * Check if the app is already installed
   */
  checkIfInstalled() {
    // Check display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');

    this.isInstalled = isStandalone;

    if (this.isInstalled) {
      console.log('[PWAInstallManager] App is already installed');
      document.documentElement.classList.add('pwa-installed');
    } else {
      document.documentElement.classList.add('pwa-not-installed');
    }

    return this.isInstalled;
  },

  /**
   * Set up event listeners for beforeinstallprompt event
   */
  setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWAInstallManager] beforeinstallprompt event fired');

      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      // Stash the event so it can be triggered later
      this.deferredPrompt = e;

      // Update UI to show install button
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', (e) => {
      console.log('[PWAInstallManager] App installed successfully');
      this.isInstalled = true;
      this.stats.installAccepted++;
      this.saveStats();

      // Hide install button
      this.hideInstallButton();

      // Show post-install guidance
      this.showPostInstallGuide();

      // Pre-cache offline data for better offline experience
      this.precacheOfflineData();
    });

    // Track time on site
    this.startTimeTracking();
  },

  /**
   * Check if user is eligible for install prompt
   */
  checkInstallEligibility() {
    // Don't show if already installed
    if (this.isInstalled) return false;

    // Don't show if no deferred prompt
    if (!this.deferredPrompt) return false;

    // Check visit count
    if (this.stats.visits < this.config.minVisits) {
      console.log(`[PWAInstallManager] Not enough visits (${this.stats.visits}/${this.config.minVisits})`);
      return false;
    }

    // Check time on site
    if (this.stats.totalTime < this.config.minTimeOnSite) {
      console.log(`[PWAInstallManager] Not enough time on site (${this.stats.totalTime}s/${this.config.minTimeOnSite}s)`);
      return false;
    }

    // Don't show too frequently
    if (this.hasShownPrompt && this.stats.promptShown >= 3) {
      console.log('[PWAInstallManager] Prompt shown too many times already');
      return false;
    }

    return true;
  },

  /**
   * Show the install button in the UI
   */
  showInstallButton() {
    // Check if button already exists
    if (document.getElementById('pwa-install-button')) {
      return;
    }

    // Create install button
    const button = document.createElement('button');
    button.id = 'pwa-install-button';
    button.className = 'pwa-install-button';
    button.innerHTML = `
      <span class="pwa-install-icon">📱</span>
      <span class="pwa-install-text">安装应用</span>
    `;
    button.title = '安装瑞士法国旅行指南到主屏幕';
    button.setAttribute('aria-label', '安装应用到主屏幕');

    // Style the button
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: #ff385c;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      animation: slideUp 0.5s ease;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
    });

    // Click handler
    button.addEventListener('click', () => this.showInstallPrompt());

    // Add to page
    document.body.appendChild(button);

    // Add CSS animation if not already present
    if (!document.querySelector('#pwa-install-animations')) {
      const style = document.createElement('style');
      style.id = 'pwa-install-animations';
      style.textContent = `
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .pwa-install-button:hover {
          animation: pulse 1s infinite;
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * Hide the install button
   */
  hideInstallButton() {
    const button = document.getElementById('pwa-install-button');
    if (button && button.parentNode) {
      button.style.animation = 'slideDown 0.5s ease';
      setTimeout(() => {
        if (button.parentNode) {
          button.parentNode.removeChild(button);
        }
      }, 500);
    }
  },

  /**
   * Show the install prompt
   */
  async showInstallPrompt() {
    if (!this.deferredPrompt) {
      console.log('[PWAInstallManager] No deferred prompt available');
      return;
    }

    console.log('[PWAInstallManager] Showing install prompt');

    // Show custom prompt UI first
    const userConfirmed = await this.showCustomPrompt();
    if (!userConfirmed) {
      this.stats.installDismissed++;
      this.saveStats();
      return;
    }

    // Show the native install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await this.deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('[PWAInstallManager] User accepted install');
      this.stats.installAccepted++;
      this.isInstalled = true;
    } else {
      console.log('[PWAInstallManager] User dismissed install');
      this.stats.installDismissed++;
    }

    this.stats.promptShown++;
    this.hasShownPrompt = true;
    this.saveStats();

    // Clear the deferredPrompt variable
    this.deferredPrompt = null;

    // Hide the install button
    this.hideInstallButton();
  },

  /**
   * Show custom install prompt with benefits
   */
  async showCustomPrompt() {
    return new Promise((resolve) => {
      // Create modal overlay
      const modal = document.createElement('div');
      modal.id = 'pwa-install-modal';
      modal.className = 'pwa-install-modal';

      modal.innerHTML = `
        <div class="pwa-install-modal-content">
          <button class="pwa-install-close" aria-label="关闭">×</button>
          <div class="pwa-install-header">
            <div class="pwa-install-icon-large">📱</div>
            <h3 class="pwa-install-title">安装旅行指南应用</h3>
            <p class="pwa-install-subtitle">更好的旅行体验，随时可用</p>
          </div>
          <div class="pwa-install-benefits">
            <div class="pwa-install-benefit">
              <div class="benefit-icon">🚀</div>
              <div class="benefit-text">
                <h4>快速启动</h4>
                <p>像原生应用一样快速启动</p>
              </div>
            </div>
            <div class="pwa-install-benefit">
              <div class="benefit-icon">📶</div>
              <div class="benefit-text">
                <h4>离线使用</h4>
                <p>无网络时查看行程信息</p>
              </div>
            </div>
            <div class="pwa-install-benefit">
              <div class="benefit-icon">🔔</div>
              <div class="benefit-text">
                <h4>及时提醒</h4>
                <p>获取行程提醒和通知</p>
              </div>
            </div>
            <div class="pwa-install-benefit">
              <div class="benefit-icon">🏠</div>
              <div class="benefit-text">
                <h4>主屏幕访问</h4>
                <p>一键访问，无需打开浏览器</p>
              </div>
            </div>
          </div>
          <div class="pwa-install-actions">
            <button class="pwa-install-cancel">稍后再说</button>
            <button class="pwa-install-confirm">安装应用</button>
          </div>
          <div class="pwa-install-footer">
            <p class="pwa-install-note">安装后可从主屏幕直接打开</p>
          </div>
        </div>
      `;

      // Style the modal
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        animation: fadeIn 0.3s ease;
      `;

      const content = modal.querySelector('.pwa-install-modal-content');
      content.style.cssText = `
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 400px;
        padding: 24px;
        position: relative;
        animation: slideUp 0.4s ease;
      `;

      // Add CSS for modal
      if (!document.querySelector('#pwa-install-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'pwa-install-modal-styles';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .pwa-install-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .pwa-install-close:hover {
            background: #f5f5f5;
          }
          .pwa-install-header {
            text-align: center;
            margin-bottom: 24px;
          }
          .pwa-install-icon-large {
            font-size: 48px;
            margin-bottom: 12px;
          }
          .pwa-install-title {
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #1d1d1f;
          }
          .pwa-install-subtitle {
            font-size: 14px;
            color: #666;
            margin: 0;
          }
          .pwa-install-benefits {
            margin-bottom: 24px;
          }
          .pwa-install-benefit {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            background: #f8f9fa;
          }
          .benefit-icon {
            font-size: 24px;
            flex-shrink: 0;
          }
          .benefit-text h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
          }
          .benefit-text p {
            margin: 0;
            font-size: 12px;
            color: #666;
          }
          .pwa-install-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }
          .pwa-install-cancel,
          .pwa-install-confirm {
            flex: 1;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
          }
          .pwa-install-cancel {
            background: #f5f5f7;
            color: #1d1d1f;
          }
          .pwa-install-cancel:hover {
            background: #e5e5e7;
          }
          .pwa-install-confirm {
            background: #ff385c;
            color: white;
          }
          .pwa-install-confirm:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          .pwa-install-footer {
            text-align: center;
          }
          .pwa-install-note {
            font-size: 12px;
            color: #999;
            margin: 0;
          }
        `;
        document.head.appendChild(style);
      }

      // Event listeners for modal
      const closeBtn = modal.querySelector('.pwa-install-close');
      const cancelBtn = modal.querySelector('.pwa-install-cancel');
      const confirmBtn = modal.querySelector('.pwa-install-confirm');

      const closeModal = (result) => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
        resolve(result);
      };

      closeBtn.addEventListener('click', () => closeModal(false));
      cancelBtn.addEventListener('click', () => closeModal(false));
      confirmBtn.addEventListener('click', () => closeModal(true));

      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(false);
        }
      });

      document.body.appendChild(modal);
    });
  },

  /**
   * Show post-install guide
   */
  showPostInstallGuide() {
    const guide = document.createElement('div');
    guide.id = 'pwa-post-install-guide';
    guide.className = 'pwa-post-install-guide';

    guide.innerHTML = `
      <div class="pwa-post-install-content">
        <div class="pwa-post-install-icon">🎉</div>
        <h3 class="pwa-post-install-title">应用已安装！</h3>
        <p class="pwa-post-install-message">
          您现在可以从主屏幕打开旅行指南应用，享受完整的离线体验。
        </p>
        <div class="pwa-post-install-tips">
          <div class="tip">
            <span class="tip-icon">📶</span>
            <span class="tip-text">第一次打开时自动下载离线数据</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🔔</span>
            <span class="tip-text">启用通知获取行程提醒</span>
          </div>
        </div>
        <button class="pwa-post-install-close">知道了</button>
      </div>
    `;

    guide.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20000;
      animation: fadeIn 0.3s ease;
    `;

    const content = guide.querySelector('.pwa-post-install-content');
    content.style.cssText = `
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 400px;
      padding: 24px;
      text-align: center;
      animation: slideUp 0.4s ease;
    `;

    const closeBtn = guide.querySelector('.pwa-post-install-close');
    closeBtn.style.cssText = `
      margin-top: 20px;
      padding: 10px 24px;
      background: #ff385c;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
    `;

    closeBtn.addEventListener('click', () => {
      guide.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        if (guide.parentNode) {
          guide.parentNode.removeChild(guide);
        }
      }, 300);
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (guide.parentNode) {
        guide.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (guide.parentNode) {
            guide.parentNode.removeChild(guide);
          }
        }, 300);
      }
    }, 10000);

    document.body.appendChild(guide);
  },

  /**
   * Start tracking time on site
   */
  startTimeTracking() {
    this.visitStartTime = Date.now();

    // Update time when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.visitStartTime = Date.now();
      } else {
        const timeSpent = (Date.now() - this.visitStartTime) / 1000;
        this.stats.totalTime += timeSpent;
      }
    });

    // Save time when leaving page
    window.addEventListener('beforeunload', () => {
      const timeSpent = (Date.now() - this.visitStartTime) / 1000;
      this.stats.totalTime += timeSpent;
      this.saveStats();
    });
  },

  /**
   * Load statistics from localStorage
   */
  loadStats() {
    try {
      const savedStats = localStorage.getItem('pwaInstallStats');
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
      }

      // Check if this is a new visit
      const today = new Date().toDateString();
      if (this.stats.lastVisit !== today) {
        this.stats.visits++;
        this.stats.lastVisit = today;
      }
    } catch (error) {
      console.warn('[PWAInstallManager] Failed to load stats:', error);
    }
  },

  /**
   * Save statistics to localStorage
   */
  saveStats() {
    try {
      localStorage.setItem('pwaInstallStats', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('[PWAInstallManager] Failed to save stats:', error);
    }
  },

  /**
   * Update statistics
   */
  updateStats() {
    this.saveStats();
  },

  /**
   * Manually trigger install prompt (for testing)
   */
  triggerInstallPrompt() {
    if (this.deferredPrompt) {
      this.showInstallPrompt();
    } else {
      console.log('[PWAInstallManager] No install prompt available');
    }
  },

  /**
   * Check if install prompt is available
   */
  isInstallPromptAvailable() {
    return !!this.deferredPrompt && !this.isInstalled;
  },

  /**
   * Pre-cache offline data after installation
   */
  async precacheOfflineData() {
    console.log('[PWAInstallManager] Pre-caching offline data...');

    // Pre-cache map tiles if OfflineMapService is available
    if (window.offlineMapService && typeof window.offlineMapService.precacheImportantAreas === 'function') {
      try {
        await window.offlineMapService.precacheImportantAreas();
        console.log('[PWAInstallManager] Map tiles pre-cached successfully');
      } catch (error) {
        console.warn('[PWAInstallManager] Failed to pre-cache map tiles:', error);
      }
    }

    // Pre-cache travel data if service worker supports it
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        // Send message to service worker to pre-cache critical resources
        navigator.serviceWorker.controller.postMessage({
          type: 'PRECACHE_OFFLINE_DATA',
          data: { timestamp: Date.now() }
        });
        console.log('[PWAInstallManager] Sent pre-cache request to service worker');
      } catch (error) {
        console.warn('[PWAInstallManager] Failed to send pre-cache message:', error);
      }
    }

    // Trigger background sync for offline data
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('precache-offline-data');
        console.log('[PWAInstallManager] Registered background sync for offline data');
      } catch (error) {
        console.warn('[PWAInstallManager] Failed to register background sync:', error);
      }
    }

    // Update statistics
    this.stats.offlineDataPrecached = true;
    this.saveStats();

    console.log('[PWAInstallManager] Offline data pre-caching initiated');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  PWAInstallManager.init();
});

// Export for use in other modules
window.PWAInstallManager = PWAInstallManager;