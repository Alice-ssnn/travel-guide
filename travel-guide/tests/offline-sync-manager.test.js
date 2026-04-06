// tests/offline-sync-manager.test.js
const { OfflineSyncManager } = require('../js/services/OfflineSyncManager.js');

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
      this.ok = this.status >= 200 && this.status < 300;
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

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('OfflineSyncManager', () => {
  test('should create instance with default options', () => {
    const syncManager = new OfflineSyncManager();
    expect(syncManager.queue).toEqual([]);
    expect(syncManager.isSyncing).toBe(false);
    expect(syncManager.options.retryAttempts).toBe(3);
    expect(syncManager.options.retryDelay).toBe(5000);
  });

  test('should sync favorite actions to server', async () => {
    const syncManager = new OfflineSyncManager();

    // Mock server API
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }))
    );

    // Add favorite action
    await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      timestamp: Date.now()
    });

    // Wait for sync to process
    // Note: sync runs asynchronously, we need to wait for queue to be processed
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalled();
    // After successful sync, item should be removed from queue
    expect(syncManager.queue.length).toBe(0);
  });
});