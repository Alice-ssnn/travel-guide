// tests/cache-strategy.test.js
const { CacheStrategy } = require('../js/services/CacheStrategy.js');

// Mock caches API
let mockCacheStorage;
let mockCaches = {};

// Mock Request and Response if not defined
if (!global.Request) {
  global.Request = class Request {
    constructor(url) {
      this.url = url;
    }
  };
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init = {}) {
      this._body = body;
      this.headers = new Map();
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }

    text() {
      return Promise.resolve(this._body);
    }

    clone() {
      return new Response(this._body, {
        status: this.status,
        statusText: this.statusText,
        headers: Object.fromEntries(this.headers)
      });
    }
  };
}

function createMockCache() {
  const store = new Map();
  return {
    put: jest.fn(async (request, response) => {
      store.set(request.url, { request, response });
    }),
    match: jest.fn(async (request) => {
      const entry = store.get(request.url);
      return entry ? entry.response : undefined;
    }),
    keys: jest.fn(async () => {
      return Array.from(store.values()).map(entry => entry.request);
    }),
    delete: jest.fn(async (request) => {
      return store.delete(request.url);
    })
  };
}

beforeEach(() => {
  mockCacheStorage = {
    open: jest.fn(async (cacheName) => {
      if (!mockCaches[cacheName]) {
        mockCaches[cacheName] = createMockCache();
      }
      return mockCaches[cacheName];
    })
  };
  global.caches = mockCacheStorage;
});

afterEach(() => {
  mockCaches = {};
  jest.clearAllMocks();
});

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
      strategy: 'cache-first',
      maxAge: 3600000,
      maxEntries: 50
    });
    expect(strategy.options.strategy).toBe('cache-first');
    expect(strategy.options.maxAge).toBe(3600000);
    expect(strategy.options.maxEntries).toBe(50);
  });

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


  test('should cleanup expired cache entries', async () => {
    const strategy = new CacheStrategy('test-cache', { maxAge: 1000 }); // 1 second
    await strategy.initialize();

    // Add an expired entry
    const request = new Request('https://example.com/expired');
    const response = new Response('expired data', {
      headers: { 'date': new Date(Date.now() - 2000).toUTCString() }
    });
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
});