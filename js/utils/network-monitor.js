// js/utils/network-monitor.js
/**
 * NetworkMonitor - Advanced network quality detection and adaptive loading
 * Enhanced with event listener system for network quality change notifications
 */
class NetworkMonitor {
  constructor(options = {}) {
    // Options with defaults
    this.options = {
      autoStart: true,
      ...options
    };

    // Network measurements
    this.latencyMeasurements = [];
    this.bandwidthSamples = [];
    this.reliabilityScore = 1.0;
    this.maxSamples = 10;
    this.networkQuality = this.getInitialQuality();
    this.previousNetworkQuality = { ...this.networkQuality };

    // Event listeners
    this.eventListeners = [];

    // Timer IDs for cleanup
    this.intervals = [];

    // Start monitoring if autoStart is true
    if (this.options.autoStart) {
      this.startMonitoring();
    }
  }

  getInitialQuality() {
    return {
      online: navigator.onLine,
      latency: 0,
      bandwidth: Infinity,
      reliability: 1.0,
      type: 'unknown'
    };
  }

  /**
   * Start continuous network monitoring
   */
  startMonitoring() {
    // Clear any existing intervals
    this.stopMonitoring();

    // Measure latency periodically
    this.intervals.push(setInterval(() => this.measureLatency(), 30000)); // Every 30 seconds

    // Measure bandwidth less frequently
    this.intervals.push(setInterval(() => this.estimateBandwidth(), 120000)); // Every 2 minutes

    // Update reliability score
    this.intervals.push(setInterval(() => this.calculateReliability(), 60000)); // Every minute

    // Periodically check for quality changes
    this.intervals.push(setInterval(() => this.checkQuality(), 30000)); // Every 30 seconds
  }

  /**
   * Stop network monitoring and clear all intervals
   */
  stopMonitoring() {
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.intervals = [];
  }

  /**
   * Measure network latency by fetching a small resource
   */
  async measureLatency() {
    if (!navigator.onLine) return 0;

    const startTime = performance.now();

    try {
      // Fetch a small resource from our own domain
      const response = await fetch('/?measure-latency=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      // Add to measurements
      this.latencyMeasurements.push(latency);
      if (this.latencyMeasurements.length > this.maxSamples) {
        this.latencyMeasurements.shift();
      }

      return latency;
    } catch (error) {
      console.log('[NetworkMonitor] Latency measurement failed:', error);
      return Infinity;
    }
  }

  /**
   * Estimate bandwidth by downloading a known-size resource
   */
  async estimateBandwidth() {
    if (!navigator.onLine) return 0;

    // Use a small image or file to measure bandwidth
    const testUrl = '/?bandwidth-test=' + Date.now();
    const fileSize = 1024; // 1KB dummy file

    const startTime = performance.now();

    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      // Read the response
      await response.blob();

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 0) {
        const bandwidth = (fileSize * 8) / (duration / 1000); // bits per second
        this.bandwidthSamples.push(bandwidth);
        if (this.bandwidthSamples.length > this.maxSamples) {
          this.bandwidthSamples.shift();
        }
        return bandwidth;
      }
    } catch (error) {
      console.log('[NetworkMonitor] Bandwidth estimation failed:', error);
    }

    return 0;
  }

  /**
   * Calculate network reliability based on recent success/failure rate
   */
  calculateReliability() {
    // Simplified reliability calculation
    // In a real app, you would track successful vs failed requests
    const recentLatency = this.getAverageLatency();

    if (recentLatency > 1000) {
      this.reliabilityScore = Math.max(0.1, this.reliabilityScore - 0.1);
    } else if (recentLatency < 100) {
      this.reliabilityScore = Math.min(1.0, this.reliabilityScore + 0.05);
    }

    return this.reliabilityScore;
  }

  /**
   * Get average latency from recent measurements
   */
  getAverageLatency() {
    if (this.latencyMeasurements.length === 0) return 0;

    const sum = this.latencyMeasurements.reduce((a, b) => a + b, 0);
    return sum / this.latencyMeasurements.length;
  }

  /**
   * Get average bandwidth from recent samples
   */
  getAverageBandwidth() {
    if (this.bandwidthSamples.length === 0) return Infinity;

    const sum = this.bandwidthSamples.reduce((a, b) => a + b, 0);
    return sum / this.bandwidthSamples.length;
  }

  /**
   * Check current network quality
   */
  checkQuality() {
    const latency = this.getAverageLatency();
    const bandwidth = this.getAverageBandwidth();

    // Determine network type based on bandwidth
    let type = 'unknown';
    if (bandwidth < 100000) { // < 100 kbps
      type = 'slow-2g';
    } else if (bandwidth < 500000) { // < 500 kbps
      type = '2g';
    } else if (bandwidth < 1500000) { // < 1.5 Mbps
      type = '3g';
    } else if (bandwidth < 5000000) { // < 5 Mbps
      type = '4g';
    } else {
      type = 'wifi';
    }

    const newQuality = {
      online: navigator.onLine,
      latency,
      bandwidth,
      reliability: this.reliabilityScore,
      type
    };

    // Check if quality has changed significantly
    const hasChanged = this.hasQualityChanged(newQuality);

    this.networkQuality = newQuality;

    // Notify listeners if quality changed
    if (hasChanged) {
      this.notifyListeners(newQuality);
      this.previousNetworkQuality = { ...newQuality };
    }

    return this.networkQuality;
  }

  /**
   * Determine if network quality has changed significantly
   * @param {Object} newQuality - New quality object
   * @returns {boolean} True if quality changed significantly
   */
  hasQualityChanged(newQuality) {
    const old = this.previousNetworkQuality;
    const current = newQuality;

    // Check for major changes
    if (old.online !== current.online) return true;
    if (old.type !== current.type) return true;

    // Check latency change > 20%
    if (old.latency > 0 && Math.abs(old.latency - current.latency) / old.latency > 0.2) return true;

    // Check bandwidth change > 30% (but handle Infinity values)
    if (old.bandwidth !== Infinity && current.bandwidth !== Infinity) {
      if (Math.abs(old.bandwidth - current.bandwidth) / old.bandwidth > 0.3) return true;
    } else if (old.bandwidth !== current.bandwidth) {
      // One is Infinity, the other is not
      return true;
    }

    // Check reliability change > 0.1
    if (Math.abs(old.reliability - current.reliability) > 0.1) return true;

    return false;
  }

  /**
   * Adaptive content loading based on network quality
   */
  loadContentBasedOnNetwork(contentTypes) {
    const quality = this.checkQuality();

    if (!quality.online) {
      return contentTypes.offline || contentTypes.lowBandwidth;
    }

    if (quality.bandwidth < 100000) { // Slow 2G
      return contentTypes.lowBandwidth;
    } else if (quality.bandwidth < 500000) { // 2G
      return contentTypes.mediumBandwidth;
    } else if (quality.latency > 1000) { // High latency
      return contentTypes.cachedFirst;
    } else {
      return contentTypes.full;
    }
  }

  /**
   * Check if network is suitable for media downloads
   */
  isSuitableForMediaDownload() {
    const quality = this.checkQuality();
    return quality.online && quality.bandwidth > 1000000; // > 1 Mbps
  }

  /**
   * Check if network is suitable for real-time updates
   */
  isSuitableForRealTime() {
    const quality = this.checkQuality();
    return quality.online && quality.latency < 500 && quality.reliability > 0.8;
  }

  /**
   * Event listener system
   */

  /**
   * Add event listener for network quality changes
   * @param {Function} listener - Function to call when network quality changes
   */
  addEventListener(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('EventListener must be a function');
    }
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   * @param {Function} listener - Function to remove
   */
  removeEventListener(listener) {
    const index = this.eventListeners.indexOf(listener);
    if (index !== -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners about network quality change
   * @param {Object} quality - Current network quality object
   */
  notifyListeners(quality) {
    // Create a copy to prevent mutation
    const qualityCopy = { ...quality };

    // Call each listener, catching errors to prevent one listener from breaking others
    this.eventListeners.forEach(listener => {
      try {
        listener(qualityCopy);
      } catch (error) {
        console.error('[NetworkMonitor] Error in event listener:', error);
      }
    });
  }

  /**
   * Get current network quality (without triggering check)
   */
  getCurrentQuality() {
    return { ...this.networkQuality };
  }
}

// Make NetworkMonitor globally available
if (typeof window !== 'undefined') {
  window.NetworkMonitor = NetworkMonitor;
}

// Compatibility with CommonJS module system (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetworkMonitor;
}