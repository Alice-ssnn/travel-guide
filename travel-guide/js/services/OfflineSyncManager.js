// js/services/OfflineSyncManager.js
class OfflineSyncManager {
  constructor(options = {}) {
    this.queue = []; // In-memory cache of pending items
    this.isSyncing = false;
    this.options = {
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 5000,
      maxQueueSize: options.maxQueueSize || 100,
      ...options
    };
    this.offlineDB = options.offlineDB ||
      (typeof self !== 'undefined' && self.OfflineDB) ||
      (typeof window !== 'undefined' && window.OfflineDB) ||
      null;

    // Load pending items from IndexedDB if available
    if (this.offlineDB) {
      this.loadQueueFromStorage();
    }
  }

  async loadQueueFromStorage() {
    try {
      if (this.offlineDB && this.offlineDB.getPendingSyncItems) {
        const pendingItems = await this.offlineDB.getPendingSyncItems();
        this.queue = pendingItems;
        console.log(`[OfflineSyncManager] Loaded ${pendingItems.length} pending items from storage`);
      }
    } catch (error) {
      console.error('[OfflineSyncManager] Failed to load queue from storage:', error);
    }
  }

  async saveItemToStorage(item) {
    if (!this.offlineDB || !this.offlineDB.addToSyncQueue) {
      return item.id; // Fallback to in-memory only
    }
    try {
      return await this.offlineDB.addToSyncQueue(item);
    } catch (error) {
      console.error('[OfflineSyncManager] Failed to save item to storage:', error);
      return item.id;
    }
  }

  async updateItemInStorage(itemId, updates) {
    if (!this.offlineDB || !this.offlineDB.updateSyncItemStatus) {
      return; // Fallback to in-memory only
    }
    try {
      await this.offlineDB.updateSyncItemStatus(itemId, updates);
    } catch (error) {
      console.error('[OfflineSyncManager] Failed to update item in storage:', error);
    }
  }

  async removeItemFromStorage(itemId) {
    if (!this.offlineDB || !this.offlineDB.removeFromSyncQueue) {
      return; // Fallback to in-memory only
    }
    try {
      await this.offlineDB.removeFromSyncQueue(itemId);
    } catch (error) {
      console.error('[OfflineSyncManager] Failed to remove item from storage:', error);
    }
  }

  async addToQueue(item) {
    // Check queue size (including pending items in storage)
    if (this.queue.length >= this.options.maxQueueSize) {
      throw new Error('Sync queue is full');
    }

    const queueItem = {
      ...item,
      id: item.id || `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      attempts: 0,
      createdAt: item.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    // Save to persistent storage if available
    await this.saveItemToStorage(queueItem);

    // Add to in-memory queue
    this.queue.push(queueItem);

    // Trigger sync if not already syncing
    if (!this.isSyncing) {
      this.startSync();
    }

    return queueItem.id;
  }

  async startSync() {
    if (this.isSyncing || this.queue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      await this.processQueue();
    } catch (error) {
      console.error('[OfflineSyncManager] Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async processQueue() {
    // Ensure we have the latest pending items from storage
    if (this.offlineDB) {
      await this.loadQueueFromStorage();
    }

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        await this.processItem(item);
        // Remove successfully processed item from storage and memory
        await this.removeItemFromStorage(item.id);
        this.queue.shift();
      } catch (error) {
        console.error(`[OfflineSyncManager] Failed to process item ${item.id}:`, error);

        // Update attempt count
        const newAttempts = item.attempts + 1;

        if (newAttempts >= this.options.retryAttempts) {
          // Max attempts reached, move to failed
          await this.updateItemInStorage(item.id, {
            status: 'failed',
            error: error.message,
            attempts: newAttempts,
            updatedAt: Date.now()
          });
          await this.removeItemFromStorage(item.id); // Remove from pending queue
          this.queue.shift();
        } else {
          // Update attempt count in storage and wait before retry
          await this.updateItemInStorage(item.id, {
            attempts: newAttempts,
            updatedAt: Date.now()
          });
          item.attempts = newAttempts;
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
        }
      }
    }
  }

  async processItem(item) {
    switch (item.type) {
      case 'favorite':
        await this.syncFavorite(item);
        break;
      case 'preference':
        await this.syncPreference(item);
        break;
      case 'note':
        await this.syncNote(item);
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }

    item.status = 'completed';
    item.completedAt = Date.now();
  }

  async syncFavorite(item) {
    // In a real app, this would send to your server API
    // For now, simulate API call
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        activityId: item.activityId,
        action: item.action,
        timestamp: item.timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to sync favorite: ${response.status}`);
    }

    // Mark favorite as synced in local database
    if (item.favoriteId && this.offlineDB && this.offlineDB.markFavoriteAsSynced) {
      try {
        await this.offlineDB.markFavoriteAsSynced(item.favoriteId);
        console.log(`[OfflineSyncManager] Marked favorite ${item.favoriteId} as synced`);
      } catch (error) {
        console.error(`[OfflineSyncManager] Failed to mark favorite ${item.favoriteId} as synced:`, error);
        // Don't throw - sync succeeded, just logging issue
      }
    } else if (item.activityId && this.offlineDB && this.offlineDB.getUnsyncedFavorites) {
      // Try to find favorite by activityId if favoriteId not provided
      try {
        const unsyncedFavorites = await this.offlineDB.getUnsyncedFavorites();
        const favorite = unsyncedFavorites.find(fav => fav.activityId === item.activityId);
        if (favorite && favorite.id) {
          await this.offlineDB.markFavoriteAsSynced(favorite.id);
          console.log(`[OfflineSyncManager] Marked favorite ${favorite.id} as synced via activityId lookup`);
        }
      } catch (error) {
        console.error('[OfflineSyncManager] Failed to find and mark favorite:', error);
      }
    }
  }

  async syncPreference(item) {
    // In a real app, this would send to your server API
    // For now, simulate API call
    const response = await fetch('/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: item.key,
        value: item.value,
        timestamp: item.timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to sync preference: ${response.status}`);
    }

    // Mark preference as synced in local database
    if (item.key && this.offlineDB && this.offlineDB.markPreferenceAsSynced) {
      try {
        await this.offlineDB.markPreferenceAsSynced(item.key);
        console.log(`[OfflineSyncManager] Marked preference ${item.key} as synced`);
      } catch (error) {
        console.error(`[OfflineSyncManager] Failed to mark preference ${item.key} as synced:`, error);
        // Don't throw - sync succeeded, just logging issue
      }
    }
  }

  async syncNote(item) {
    // In a real app, this would send to your server API
    // For now, simulate API call
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        noteId: item.noteId,
        content: item.content,
        activityId: item.activityId,
        timestamp: item.timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to sync note: ${response.status}`);
    }

    // Note: Currently no note storage in OfflineDB, so no markAsSynced needed
    // If notes are added to OfflineDB in future, add markNoteAsSynced call here
    console.log(`[OfflineSyncManager] Note synced successfully: ${item.noteId || 'unknown'}`);
  }
}

// Export for Node.js / Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OfflineSyncManager };
}

// Export for browser
if (typeof self !== 'undefined') {
  self.OfflineSyncManager = OfflineSyncManager;
}