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

// Mock OfflineDB for persistent queue
const mockOfflineDB = {
  getPendingSyncItems: jest.fn(() => Promise.resolve([])),
  addToSyncQueue: jest.fn((item) => Promise.resolve(item.id || 'test-id')),
  updateSyncItemStatus: jest.fn(() => Promise.resolve()),
  removeFromSyncQueue: jest.fn(() => Promise.resolve()),
  markFavoriteAsSynced: jest.fn(() => Promise.resolve()),
  markPreferenceAsSynced: jest.fn(() => Promise.resolve()),
  getUnsyncedFavorites: jest.fn(() => Promise.resolve([]))
};

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
  // Reset all mocks
  jest.clearAllMocks();
  // Setup default mock implementations
  mockOfflineDB.getPendingSyncItems.mockResolvedValue([]);
  mockOfflineDB.addToSyncQueue.mockImplementation((item) => Promise.resolve(item.id || 'test-id'));
  mockOfflineDB.updateSyncItemStatus.mockResolvedValue();
  mockOfflineDB.removeFromSyncQueue.mockResolvedValue();
  mockOfflineDB.markFavoriteAsSynced.mockResolvedValue();
  mockOfflineDB.markPreferenceAsSynced.mockResolvedValue();
  mockOfflineDB.getUnsyncedFavorites.mockResolvedValue([]);
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
    expect(syncManager.options.maxQueueSize).toBe(100);
  });

  test('should create instance with custom options', () => {
    const syncManager = new OfflineSyncManager({
      retryAttempts: 5,
      retryDelay: 10000,
      maxQueueSize: 50
    });
    expect(syncManager.options.retryAttempts).toBe(5);
    expect(syncManager.options.retryDelay).toBe(10000);
    expect(syncManager.options.maxQueueSize).toBe(50);
  });

  test('should use provided offlineDB instance', () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    expect(syncManager.offlineDB).toBe(mockOfflineDB);
  });

  test('should load pending items from storage on initialization', async () => {
    const mockItems = [
      { id: 'item1', type: 'favorite', status: 'pending', attempts: 0, createdAt: Date.now() },
      { id: 'item2', type: 'preference', status: 'pending', attempts: 0, createdAt: Date.now() }
    ];
    mockOfflineDB.getPendingSyncItems.mockResolvedValue(mockItems);

    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    // loadQueueFromStorage is called in constructor, but async so we need to wait
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockOfflineDB.getPendingSyncItems).toHaveBeenCalled();
    expect(syncManager.queue).toEqual(mockItems);
  });

  test('should add item to queue and persistent storage', async () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    const item = {
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      timestamp: Date.now()
    };

    const itemId = await syncManager.addToQueue(item);
    expect(itemId).toBeDefined();
    expect(mockOfflineDB.addToSyncQueue).toHaveBeenCalled();
    expect(syncManager.queue).toHaveLength(1);
    expect(syncManager.queue[0].type).toBe('favorite');
    expect(syncManager.queue[0].status).toBe('pending');
  });

  test('should throw error when queue is full', async () => {
    const syncManager = new OfflineSyncManager({ maxQueueSize: 2 });
    // Add two items
    await syncManager.addToQueue({ type: 'favorite', activityId: '1' });
    await syncManager.addToQueue({ type: 'favorite', activityId: '2' });

    // Third should fail
    await expect(syncManager.addToQueue({ type: 'favorite', activityId: '3' }))
      .rejects.toThrow('Sync queue is full');
  });

  test('should process favorite sync successfully', async () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    global.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    // Add favorite with favoriteId
    const itemId = await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      favoriteId: 'fav-123',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalledWith('/api/favorites', expect.anything());
    expect(mockOfflineDB.markFavoriteAsSynced).toHaveBeenCalledWith('fav-123');
    expect(mockOfflineDB.removeFromSyncQueue).toHaveBeenCalled();
    expect(syncManager.queue).toHaveLength(0);
  });

  test('should process preference sync successfully', async () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    global.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'preference',
      key: 'theme',
      value: 'dark',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalledWith('/api/preferences', expect.anything());
    expect(mockOfflineDB.markPreferenceAsSynced).toHaveBeenCalledWith('theme');
    expect(mockOfflineDB.removeFromSyncQueue).toHaveBeenCalled();
  });

  test('should process note sync successfully', async () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    global.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'note',
      noteId: 'note-123',
      content: 'Sample note',
      activityId: 'activity-123',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalledWith('/api/notes', expect.anything());
    expect(mockOfflineDB.removeFromSyncQueue).toHaveBeenCalled();
  });

  test('should retry failed sync with exponential backoff', async () => {
    const syncManager = new OfflineSyncManager({
      offlineDB: mockOfflineDB,
      retryAttempts: 2,
      retryDelay: 10 // Short delay for testing
    });

    // First call fails, second succeeds
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      favoriteId: 'fav-123',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(mockOfflineDB.updateSyncItemStatus).toHaveBeenCalledWith(expect.anything(), {
      attempts: 1,
      updatedAt: expect.any(Number)
    });
    expect(mockOfflineDB.markFavoriteAsSynced).toHaveBeenCalled();
  });

  test('should mark item as failed after max retries', async () => {
    const syncManager = new OfflineSyncManager({
      offlineDB: mockOfflineDB,
      retryAttempts: 1,
      retryDelay: 10
    });

    global.fetch.mockRejectedValue(new Error('Network error'));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      favoriteId: 'fav-123',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockOfflineDB.updateSyncItemStatus).toHaveBeenCalledWith(expect.anything(), {
      status: 'failed',
      error: 'Network error',
      attempts: 1,
      updatedAt: expect.any(Number)
    });
    expect(mockOfflineDB.removeFromSyncQueue).toHaveBeenCalled();
  });

  test('should handle missing favoriteId by looking up via activityId', async () => {
    const syncManager = new OfflineSyncManager({ offlineDB: mockOfflineDB });
    global.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Mock unsynced favorites lookup
    const mockFavorite = { id: 'found-fav-id', activityId: 'activity-123' };
    mockOfflineDB.getUnsyncedFavorites.mockResolvedValue([mockFavorite]);

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      // No favoriteId provided
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(mockOfflineDB.getUnsyncedFavorites).toHaveBeenCalled();
    expect(mockOfflineDB.markFavoriteAsSynced).toHaveBeenCalledWith('found-fav-id');
  });

  test('should handle unknown sync type gracefully', async () => {
    const syncManager = new OfflineSyncManager({
      offlineDB: mockOfflineDB,
      retryAttempts: 1,
      retryDelay: 10 // Short delay for test
    });

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'unknown',
      data: 'test'
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync(); // Should complete (item marked as failed)

    // Check that item was marked as failed in storage
    expect(mockOfflineDB.updateSyncItemStatus).toHaveBeenCalledWith(expect.anything(), {
      status: 'failed',
      error: expect.stringContaining('Unknown sync type'),
      attempts: 1,
      updatedAt: expect.any(Number)
    });
  });

  test('should not start sync if already syncing', async () => {
    const syncManager = new OfflineSyncManager();
    syncManager.isSyncing = true;
    const processQueueSpy = jest.spyOn(syncManager, 'processQueue').mockResolvedValue();

    await syncManager.startSync();

    expect(processQueueSpy).not.toHaveBeenCalled();
  });

  test('should work without offlineDB (fallback to in-memory)', async () => {
    const syncManager = new OfflineSyncManager(); // No offlineDB provided
    global.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    // Prevent auto-start of sync
    syncManager.isSyncing = true;

    await syncManager.addToQueue({
      type: 'favorite',
      action: 'add',
      activityId: 'activity-123',
      timestamp: Date.now()
    });

    // Now manually trigger sync
    syncManager.isSyncing = false;
    await syncManager.startSync();

    expect(global.fetch).toHaveBeenCalled();
    expect(syncManager.queue).toHaveLength(0);
  });
});