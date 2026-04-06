// offline-performance.js - Performance monitoring for offline functionality
// Part of Phase 2 Week 4: Offline functionality optimization

const OfflinePerformanceMonitor = {
  // Monitoring state
  isMonitoring: false,
  startTime: null,

  // Performance metrics
  metrics: {
    // Cache performance
    cacheHits: 0,
    cacheMisses: 0,
    cacheHitRate: 0,

    // Network performance
    onlineTime: 0,
    offlineTime: 0,
    networkSwitches: 0,

    // IndexedDB performance
    dbReads: 0,
    dbWrites: 0,
    dbReadTime: 0,
    dbWriteTime: 0,

    // Storage usage
    storageUsage: 0,
    storageQuota: 0,
    storagePercentage: 0,

    // User engagement
    offlineSessions: 0,
    offlineSessionDuration: 0,
    featuresUsed: {
      favorites: 0,
      search: 0,
      timeline: 0,
      map: 0
    }
  },

  // Configuration
  config: {
    samplingInterval: 30000, // 30 seconds
    saveInterval: 300000, // 5 minutes
    maxSamples: 1000
  },

  // History of metrics
  history: [],

  /**
   * Start performance monitoring
   */
  start() {
    if (this.isMonitoring) return;

    console.log('[OfflinePerformanceMonitor] Starting monitoring...');
    this.isMonitoring = true;
    this.startTime = Date.now();

    // Start periodic sampling
    this.samplingInterval = setInterval(() => this.sampleMetrics(), this.config.samplingInterval);

    // Start periodic saving
    this.saveInterval = setInterval(() => this.saveMetrics(), this.config.saveInterval);

    // Set up event listeners
    this.setupEventListeners();

    // Initial sample
    this.sampleMetrics();

    console.log('[OfflinePerformanceMonitor] Monitoring started');
  },

  /**
   * Stop performance monitoring
   */
  stop() {
    if (!this.isMonitoring) return;

    console.log('[OfflinePerformanceMonitor] Stopping monitoring...');

    clearInterval(this.samplingInterval);
    clearInterval(this.saveInterval);
    this.isMonitoring = false;

    // Final sample
    this.sampleMetrics();
    this.saveMetrics();

    console.log('[OfflinePerformanceMonitor] Monitoring stopped');
  },

  /**
   * Set up event listeners for performance tracking
   */
  setupEventListeners() {
    // Track online/offline switches
    window.addEventListener('online', () => {
      this.metrics.networkSwitches++;
      this.trackNetworkStatus('online');
    });

    window.addEventListener('offline', () => {
      this.metrics.networkSwitches++;
      this.trackNetworkStatus('offline');
      this.metrics.offlineSessions++;
    });

    // Track Service Worker events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'cache-hit') {
          this.metrics.cacheHits++;
          this.updateCacheHitRate();
        } else if (event.data && event.data.type === 'cache-miss') {
          this.metrics.cacheMisses++;
          this.updateCacheHitRate();
        }
      });
    }

    // Track IndexedDB operations (if OfflineDB is available)
    this.setupIndexedDBTracking();

    // Track user interactions
    this.setupUserInteractionTracking();
  },

  /**
   * Set up IndexedDB operation tracking
   */
  setupIndexedDBTracking() {
    // This would be implemented to intercept OfflineDB operations
    // For now, we'll use a proxy approach
    if (window.OfflineDB) {
      const originalMethods = {};

      // Wrap key methods to track performance
      ['getDay', 'searchActivities', 'addToFavorites', 'setPreference'].forEach(method => {
        if (typeof window.OfflineDB[method] === 'function') {
          originalMethods[method] = window.OfflineDB[method].bind(window.OfflineDB);

          window.OfflineDB[method] = async (...args) => {
            const startTime = performance.now();
            const result = await originalMethods[method](...args);
            const endTime = performance.now();
            const duration = endTime - startTime;

            if (method.startsWith('get') || method.includes('search')) {
              this.metrics.dbReads++;
              this.metrics.dbReadTime += duration;
            } else {
              this.metrics.dbWrites++;
              this.metrics.dbWriteTime += duration;
            }

            return result;
          };
        }
      });

      console.log('[OfflinePerformanceMonitor] IndexedDB tracking enabled');
    }
  },

  /**
   * Set up user interaction tracking
   */
  setupUserInteractionTracking() {
    // Track feature usage
    document.addEventListener('click', (event) => {
      const target = event.target;

      // Check for feature-specific elements
      if (target.closest('[data-feature="favorite"]')) {
        this.metrics.featuresUsed.favorites++;
      } else if (target.closest('[data-feature="search"]')) {
        this.metrics.featuresUsed.search++;
      } else if (target.closest('[data-feature="timeline"]')) {
        this.metrics.featuresUsed.timeline++;
      } else if (target.closest('[data-feature="map"]')) {
        this.metrics.featuresUsed.map++;
      }
    }, true);

    // Track offline session duration
    let offlineStartTime = null;

    window.addEventListener('offline', () => {
      offlineStartTime = Date.now();
    });

    window.addEventListener('online', () => {
      if (offlineStartTime) {
        const offlineDuration = (Date.now() - offlineStartTime) / 1000; // seconds
        this.metrics.offlineSessionDuration += offlineDuration;
        offlineStartTime = null;
      }
    });
  },

  /**
   * Track network status changes
   */
  trackNetworkStatus(status) {
    const now = Date.now();

    if (status === 'online' && this.lastOfflineTime) {
      const offlineDuration = (now - this.lastOfflineTime) / 1000;
      this.metrics.offlineTime += offlineDuration;
      this.lastOfflineTime = null;
    } else if (status === 'offline') {
      this.lastOfflineTime = now;
    }

    if (status === 'offline' && this.lastOnlineTime) {
      const onlineDuration = (now - this.lastOnlineTime) / 1000;
      this.metrics.onlineTime += onlineDuration;
      this.lastOnlineTime = null;
    } else if (status === 'online') {
      this.lastOnlineTime = now;
    }
  },

  /**
   * Update cache hit rate
   */
  updateCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    this.metrics.cacheHitRate = total > 0 ?
      (this.metrics.cacheHits / total * 100).toFixed(2) : 0;
  },

  /**
   * Sample current performance metrics
   */
  async sampleMetrics() {
    if (!this.isMonitoring) return;

    try {
      // Get storage usage
      await this.sampleStorageUsage();

      // Get current network status
      this.sampleNetworkStatus();

      // Create snapshot
      const snapshot = {
        timestamp: Date.now(),
        metrics: { ...this.metrics },
        online: navigator.onLine
      };

      // Add to history
      this.history.push(snapshot);

      // Keep history size limited
      if (this.history.length > this.config.maxSamples) {
        this.history.shift();
      }

      // Dispatch event for other components
      this.dispatchMetricsUpdate(snapshot);

    } catch (error) {
      console.warn('[OfflinePerformanceMonitor] Failed to sample metrics:', error);
    }
  },

  /**
   * Sample storage usage
   */
  async sampleStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        this.metrics.storageUsage = estimate.usage || 0;
        this.metrics.storageQuota = estimate.quota || 0;
        this.metrics.storagePercentage = estimate.usage && estimate.quota ?
          (estimate.usage / estimate.quota * 100).toFixed(2) : 0;
      } catch (error) {
        console.warn('[OfflinePerformanceMonitor] Failed to get storage estimate:', error);
      }
    }
  },

  /**
   * Sample network status
   */
  sampleNetworkStatus() {
    // Network status is tracked via event listeners
    // This method can be extended to include more detailed network info
  },

  /**
   * Save metrics to persistent storage
   */
  saveMetrics() {
    try {
      const data = {
        metrics: this.metrics,
        history: this.history.slice(-100), // Last 100 samples
        lastUpdated: Date.now(),
        totalMonitoringTime: this.startTime ? (Date.now() - this.startTime) / 1000 : 0
      };

      localStorage.setItem('offlinePerformanceMetrics', JSON.stringify(data));
      console.log('[OfflinePerformanceMonitor] Metrics saved');
    } catch (error) {
      console.warn('[OfflinePerformanceMonitor] Failed to save metrics:', error);
    }
  },

  /**
   * Load metrics from persistent storage
   */
  loadMetrics() {
    try {
      const saved = localStorage.getItem('offlinePerformanceMetrics');
      if (saved) {
        const data = JSON.parse(saved);
        this.metrics = data.metrics || this.metrics;
        this.history = data.history || this.history;
        console.log('[OfflinePerformanceMonitor] Metrics loaded');
        return true;
      }
    } catch (error) {
      console.warn('[OfflinePerformanceMonitor] Failed to load metrics:', error);
    }
    return false;
  },

  /**
   * Dispatch metrics update event
   */
  dispatchMetricsUpdate(snapshot) {
    const event = new CustomEvent('offline-metrics-update', {
      detail: { snapshot }
    });
    window.dispatchEvent(event);
  },

  /**
   * Get performance report
   */
  getReport() {
    const totalTime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
    const onlinePercentage = totalTime > 0 ?
      (this.metrics.onlineTime / totalTime * 100).toFixed(1) : 0;
    const offlinePercentage = totalTime > 0 ?
      (this.metrics.offlineTime / totalTime * 100).toFixed(1) : 0;

    const avgDbReadTime = this.metrics.dbReads > 0 ?
      (this.metrics.dbReadTime / this.metrics.dbReads).toFixed(2) : 0;
    const avgDbWriteTime = this.metrics.dbWrites > 0 ?
      (this.metrics.dbWriteTime / this.metrics.dbWrites).toFixed(2) : 0;

    return {
      summary: {
        monitoringDuration: totalTime,
        onlinePercentage,
        offlinePercentage,
        cacheHitRate: this.metrics.cacheHitRate,
        networkSwitches: this.metrics.networkSwitches,
        offlineSessions: this.metrics.offlineSessions,
        averageOfflineSessionDuration: this.metrics.offlineSessions > 0 ?
          (this.metrics.offlineSessionDuration / this.metrics.offlineSessions).toFixed(1) : 0
      },
      performance: {
        dbReads: this.metrics.dbReads,
        dbWrites: this.metrics.dbWrites,
        avgDbReadTime: `${avgDbReadTime}ms`,
        avgDbWriteTime: `${avgDbWriteTime}ms`
      },
      storage: {
        usage: this.formatBytes(this.metrics.storageUsage),
        quota: this.formatBytes(this.metrics.storageQuota),
        percentage: this.metrics.storagePercentage
      },
      features: this.metrics.featuresUsed,
      recommendations: this.generateRecommendations()
    };
  },

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Cache hit rate recommendations
    if (this.metrics.cacheHitRate < 50) {
      recommendations.push({
        type: 'cache',
        priority: 'high',
        message: '缓存命中率较低，考虑优化缓存策略',
        suggestion: '增加静态资源的缓存时间，预缓存更多数据'
      });
    } else if (this.metrics.cacheHitRate < 70) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        message: '缓存命中率有待提高',
        suggestion: '检查缓存策略，确保常用资源被正确缓存'
      });
    }

    // Storage recommendations
    if (this.metrics.storagePercentage > 80) {
      recommendations.push({
        type: 'storage',
        priority: 'high',
        message: '存储空间使用率较高',
        suggestion: '清理旧缓存或优化存储策略'
      });
    } else if (this.metrics.storagePercentage > 60) {
      recommendations.push({
        type: 'storage',
        priority: 'medium',
        message: '存储空间使用率适中',
        suggestion: '监控存储使用，考虑定期清理'
      });
    }

    // Database performance recommendations
    const avgReadTime = this.metrics.dbReads > 0 ?
      this.metrics.dbReadTime / this.metrics.dbReads : 0;

    if (avgReadTime > 100) {
      recommendations.push({
        type: 'database',
        priority: 'medium',
        message: '数据库读取速度较慢',
        suggestion: '优化数据库索引或减少读取数据量'
      });
    }

    // Network recommendations
    if (this.metrics.networkSwitches > 10) {
      recommendations.push({
        type: 'network',
        priority: 'low',
        message: '网络切换频繁',
        suggestion: '增强离线功能，减少对网络的依赖'
      });
    }

    return recommendations;
  },

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      cacheHitRate: 0,
      onlineTime: 0,
      offlineTime: 0,
      networkSwitches: 0,
      dbReads: 0,
      dbWrites: 0,
      dbReadTime: 0,
      dbWriteTime: 0,
      storageUsage: 0,
      storageQuota: 0,
      storagePercentage: 0,
      offlineSessions: 0,
      offlineSessionDuration: 0,
      featuresUsed: {
        favorites: 0,
        search: 0,
        timeline: 0,
        map: 0
      }
    };

    this.history = [];
    this.startTime = Date.now();

    console.log('[OfflinePerformanceMonitor] Metrics reset');
  },

  /**
   * Show performance dashboard
   */
  showDashboard() {
    const report = this.getReport();

    const dashboard = document.createElement('div');
    dashboard.id = 'offline-performance-dashboard';
    dashboard.className = 'offline-performance-dashboard';

    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h3>离线性能监控</h3>
        <button class="dashboard-close">×</button>
      </div>
      <div class="dashboard-content">
        <div class="dashboard-section">
          <h4>性能概览</h4>
          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-value">${report.summary.cacheHitRate}%</div>
              <div class="metric-label">缓存命中率</div>
            </div>
            <div class="metric">
              <div class="metric-value">${report.summary.offlineSessions}</div>
              <div class="metric-label">离线会话</div>
            </div>
            <div class="metric">
              <div class="metric-value">${report.summary.networkSwitches}</div>
              <div class="metric-label">网络切换</div>
            </div>
            <div class="metric">
              <div class="metric-value">${report.storage.percentage}%</div>
              <div class="metric-label">存储使用</div>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <h4>功能使用</h4>
          <div class="features-grid">
            <div class="feature">
              <span class="feature-name">收藏夹</span>
              <span class="feature-count">${report.features.favorites}</span>
            </div>
            <div class="feature">
              <span class="feature-name">搜索</span>
              <span class="feature-count">${report.features.search}</span>
            </div>
            <div class="feature">
              <span class="feature-name">时间轴</span>
              <span class="feature-count">${report.features.timeline}</span>
            </div>
            <div class="feature">
              <span class="feature-name">地图</span>
              <span class="feature-count">${report.features.map}</span>
            </div>
          </div>
        </div>

        ${report.recommendations.length > 0 ? `
        <div class="dashboard-section">
          <h4>优化建议</h4>
          <div class="recommendations">
            ${report.recommendations.map(rec => `
              <div class="recommendation recommendation-${rec.priority}">
                <div class="recommendation-type">${rec.type.toUpperCase()}</div>
                <div class="recommendation-message">${rec.message}</div>
                <div class="recommendation-suggestion">${rec.suggestion}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="dashboard-actions">
          <button class="btn btn-refresh">刷新数据</button>
          <button class="btn btn-reset">重置统计</button>
          <button class="btn btn-export">导出报告</button>
        </div>
      </div>
    `;

    // Style the dashboard
    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100%;
      background: white;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 30000;
      display: flex;
      flex-direction: column;
      animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(dashboard);

    // Add event listeners
    const closeBtn = dashboard.querySelector('.dashboard-close');
    const refreshBtn = dashboard.querySelector('.btn-refresh');
    const resetBtn = dashboard.querySelector('.btn-reset');
    const exportBtn = dashboard.querySelector('.btn-export');

    closeBtn.addEventListener('click', () => this.hideDashboard());
    refreshBtn.addEventListener('click', () => this.refreshDashboard());
    resetBtn.addEventListener('click', () => {
      if (confirm('确定要重置所有性能统计数据吗？')) {
        this.reset();
        this.refreshDashboard();
      }
    });
    exportBtn.addEventListener('click', () => this.exportReport());

    // Close on background click
    dashboard.addEventListener('click', (e) => {
      if (e.target === dashboard) {
        this.hideDashboard();
      }
    });
  },

  /**
   * Hide performance dashboard
   */
  hideDashboard() {
    const dashboard = document.getElementById('offline-performance-dashboard');
    if (dashboard && dashboard.parentNode) {
      dashboard.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (dashboard.parentNode) {
          dashboard.parentNode.removeChild(dashboard);
        }
      }, 300);
    }
  },

  /**
   * Refresh dashboard data
   */
  refreshDashboard() {
    this.hideDashboard();
    this.showDashboard();
  },

  /**
   * Export performance report
   */
  exportReport() {
    const report = this.getReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `offline-performance-report-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log('[OfflinePerformanceMonitor] Report exported');
  }
};

// Auto-start monitoring when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  OfflinePerformanceMonitor.loadMetrics();
  OfflinePerformanceMonitor.start();
});

// Export for use in other modules
window.OfflinePerformanceMonitor = OfflinePerformanceMonitor;