// js/services/OfflineSyncManager.js
class OfflineSyncManager {
  constructor(options = {}) {
    this.queue = [];
    this.isSyncing = false;
    this.options = {
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 5000,
      maxQueueSize: options.maxQueueSize || 100,
      ...options
    };
  }

  async addToQueue(item) {
    if (this.queue.length >= this.options.maxQueueSize) {
      throw new Error('Sync queue is full');
    }

    this.queue.push({
      ...item,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      attempts: 0,
      createdAt: Date.now()
    });

    // Trigger sync if not already syncing
    if (!this.isSyncing) {
      this.startSync();
    }
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
    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        await this.processItem(item);
        // Remove successfully processed item
        this.queue.shift();
      } catch (error) {
        console.error(`[OfflineSyncManager] Failed to process item ${item.id}:`, error);

        // Update attempt count
        item.attempts++;

        if (item.attempts >= this.options.retryAttempts) {
          // Max attempts reached, move to failed
          item.status = 'failed';
          item.error = error.message;
          this.queue.shift();
        } else {
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
  }

  async syncPreference(item) {
    // TODO: implement preference sync
    throw new Error('Preference sync not implemented');
  }

  async syncNote(item) {
    // TODO: implement note sync
    throw new Error('Note sync not implemented');
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