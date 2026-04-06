// tests/network-monitor.test.js
/**
 * @jest-environment jsdom
 */
const NetworkMonitor = require('../js/utils/network-monitor.js');

describe('NetworkMonitor', () => {
  let networkMonitor;
  let mockFetch;

  beforeEach(() => {
    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true
    });

    // Mock performance.now
    global.performance = {
      now: jest.fn(() => Date.now())
    };

    // Create NetworkMonitor instance with autoStart disabled for testing
    networkMonitor = new NetworkMonitor({ autoStart: false });

    // Clear any intervals that might be set
    if (networkMonitor.intervals) {
      networkMonitor.intervals.forEach(clearInterval);
    }
  });

  afterEach(() => {
    // Clean up intervals
    if (networkMonitor.intervals) {
      networkMonitor.intervals.forEach(clearInterval);
    }
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    expect(networkMonitor.latencyMeasurements).toEqual([]);
    expect(networkMonitor.bandwidthSamples).toEqual([]);
    expect(networkMonitor.reliabilityScore).toBe(1.0);
    expect(networkMonitor.maxSamples).toBe(10);
    expect(networkMonitor.eventListeners).toEqual([]);
    expect(networkMonitor.networkQuality).toBeDefined();
    expect(networkMonitor.previousNetworkQuality).toBeDefined();
  });

  test('should add event listener', () => {
    const listener = jest.fn();
    networkMonitor.addEventListener(listener);
    expect(networkMonitor.eventListeners).toContain(listener);
  });

  test('should remove event listener', () => {
    const listener = jest.fn();
    networkMonitor.addEventListener(listener);
    expect(networkMonitor.eventListeners).toContain(listener);
    networkMonitor.removeEventListener(listener);
    expect(networkMonitor.eventListeners).not.toContain(listener);
  });

  test('should throw TypeError when adding non-function event listener', () => {
    expect(() => networkMonitor.addEventListener('not a function')).toThrow(TypeError);
    expect(() => networkMonitor.addEventListener(null)).toThrow(TypeError);
    expect(() => networkMonitor.addEventListener(123)).toThrow(TypeError);
    expect(() => networkMonitor.addEventListener({})).toThrow(TypeError);
  });

  test('should notify listeners when network quality changes', () => {
    const listener = jest.fn();
    networkMonitor.addEventListener(listener);

    // Mock a quality change
    const newQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };

    // Trigger notification
    networkMonitor.notifyListeners(newQuality);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(newQuality);
  });

  test('should not notify listeners when quality does not change significantly', () => {
    // First set up initial quality
    networkMonitor.networkQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };
    networkMonitor.previousNetworkQuality = { ...networkMonitor.networkQuality };
    // Set reliability score to match
    networkMonitor.reliabilityScore = 0.9;

    const listener = jest.fn();
    networkMonitor.addEventListener(listener);

    // Mock getAverageLatency and getAverageBandwidth to return same values
    networkMonitor.getAverageLatency = jest.fn(() => 100);
    networkMonitor.getAverageBandwidth = jest.fn(() => 5000000);

    // Mock navigator.onLine to be true
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

    networkMonitor.checkQuality();

    // Listener should not be called because quality hasn't changed significantly
    expect(listener).not.toHaveBeenCalled();
  });

  test('should handle listener errors gracefully', () => {
    const errorListener = jest.fn(() => {
      throw new Error('Listener error');
    });
    const goodListener = jest.fn();

    networkMonitor.addEventListener(errorListener);
    networkMonitor.addEventListener(goodListener);

    const newQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };

    // Should not throw
    expect(() => networkMonitor.notifyListeners(newQuality)).not.toThrow();

    // Both listeners should have been called
    expect(errorListener).toHaveBeenCalledTimes(1);
    expect(goodListener).toHaveBeenCalledTimes(1);
  });

  test('should detect significant quality changes', () => {
    // Test online/offline change
    networkMonitor.previousNetworkQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };

    const newQualityOffline = {
      online: false,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };

    expect(networkMonitor.hasQualityChanged(newQualityOffline)).toBe(true);

    // Test type change
    const newQualityTypeChange = {
      online: true,
      latency: 100,
      bandwidth: 100000, // Would change type to 'slow-2g'
      reliability: 0.9,
      type: 'slow-2g'
    };

    expect(networkMonitor.hasQualityChanged(newQualityTypeChange)).toBe(true);
  });

  test('should load appropriate content based on network quality', () => {
    // Mock checkQuality to return specific quality
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 50,
      bandwidth: 10000, // Slow 2G
      reliability: 0.9,
      type: 'slow-2g'
    }));

    const contentTypes = {
      offline: 'offline',
      lowBandwidth: 'low',
      mediumBandwidth: 'medium',
      cachedFirst: 'cached',
      full: 'full'
    };

    const result = networkMonitor.loadContentBasedOnNetwork(contentTypes);
    expect(result).toBe('low');
  });

  test('should check suitability for media download', () => {
    // Suitable
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 50,
      bandwidth: 2000000, // 2 Mbps > 1 Mbps
      reliability: 0.9,
      type: '4g'
    }));
    expect(networkMonitor.isSuitableForMediaDownload()).toBe(true);

    // Not suitable - offline
    networkMonitor.checkQuality = jest.fn(() => ({
      online: false,
      latency: 50,
      bandwidth: 2000000,
      reliability: 0.9,
      type: '4g'
    }));
    expect(networkMonitor.isSuitableForMediaDownload()).toBe(false);

    // Not suitable - low bandwidth
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 50,
      bandwidth: 500000, // 0.5 Mbps < 1 Mbps
      reliability: 0.9,
      type: '3g'
    }));
    expect(networkMonitor.isSuitableForMediaDownload()).toBe(false);
  });

  test('should check suitability for real-time updates', () => {
    // Suitable
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 100, // < 500
      bandwidth: 5000000,
      reliability: 0.9, // > 0.8
      type: 'wifi'
    }));
    expect(networkMonitor.isSuitableForRealTime()).toBe(true);

    // Not suitable - high latency
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 600, // > 500
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    }));
    expect(networkMonitor.isSuitableForRealTime()).toBe(false);

    // Not suitable - low reliability
    networkMonitor.checkQuality = jest.fn(() => ({
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.7, // < 0.8
      type: 'wifi'
    }));
    expect(networkMonitor.isSuitableForRealTime()).toBe(false);
  });

  test('should get current quality without triggering check', () => {
    const initialQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };
    networkMonitor.networkQuality = initialQuality;

    const currentQuality = networkMonitor.getCurrentQuality();
    expect(currentQuality).toEqual(initialQuality);
    // Should be a copy, not the same reference
    expect(currentQuality).not.toBe(networkMonitor.networkQuality);
  });

  test('should handle Infinity bandwidth in quality change detection', () => {
    networkMonitor.previousNetworkQuality = {
      online: true,
      latency: 100,
      bandwidth: Infinity,
      reliability: 0.9,
      type: 'wifi'
    };

    const newQuality = {
      online: true,
      latency: 100,
      bandwidth: 5000000,
      reliability: 0.9,
      type: 'wifi'
    };

    // Changing from Infinity to finite value should be detected
    expect(networkMonitor.hasQualityChanged(newQuality)).toBe(true);
  });

  test('should calculate average latency correctly', () => {
    networkMonitor.latencyMeasurements = [100, 200, 300];
    expect(networkMonitor.getAverageLatency()).toBe(200);

    networkMonitor.latencyMeasurements = [];
    expect(networkMonitor.getAverageLatency()).toBe(0);
  });

  test('should calculate average bandwidth correctly', () => {
    networkMonitor.bandwidthSamples = [1000000, 2000000, 3000000];
    expect(networkMonitor.getAverageBandwidth()).toBe(2000000);

    networkMonitor.bandwidthSamples = [];
    expect(networkMonitor.getAverageBandwidth()).toBe(Infinity);
  });
});