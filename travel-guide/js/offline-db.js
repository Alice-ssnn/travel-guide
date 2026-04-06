// offline-db.js - IndexedDB storage for offline data access
// Part of Phase 2 Week 4: Offline functionality optimization

const OfflineDB = {
  // Database configuration
  DB_NAME: 'TravelGuideDB',
  DB_VERSION: 3,

  // Store names
  STORES: {
    TRIPS: 'trips',
    ACTIVITIES: 'activities',
    FAVORITES: 'favorites',
    USER_PREFERENCES: 'user_preferences',
    CACHE_METADATA: 'cache_metadata'
  },

  // Database instance
  db: null,

  /**
   * Initialize the database
   */
  async init() {
    console.log('[OfflineDB] Initializing IndexedDB...');

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error('[OfflineDB] Failed to open database:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('[OfflineDB] Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        console.log('[OfflineDB] Upgrading database schema...');
        const db = event.target.result;
        this.createStores(db, event.oldVersion);
      };
    });
  },

  /**
   * Create database stores
   */
  createStores(db, oldVersion) {
    // Create trips store
    if (!db.objectStoreNames.contains(this.STORES.TRIPS)) {
      const tripsStore = db.createObjectStore(this.STORES.TRIPS, { keyPath: 'id' });
      tripsStore.createIndex('dayIndex', 'day', { unique: false });
      tripsStore.createIndex('dateIndex', 'date', { unique: false });
      console.log(`[OfflineDB] Created ${this.STORES.TRIPS} store`);
    }

    // Create activities store
    if (!db.objectStoreNames.contains(this.STORES.ACTIVITIES)) {
      const activitiesStore = db.createObjectStore(this.STORES.ACTIVITIES, { keyPath: 'id' });
      activitiesStore.createIndex('dayIndex', 'day', { unique: false });
      activitiesStore.createIndex('categoryIndex', 'category', { unique: false });
      activitiesStore.createIndex('timeIndex', 'time', { unique: false });
      console.log(`[OfflineDB] Created ${this.STORES.ACTIVITIES} store`);
    }

    // Create favorites store
    if (!db.objectStoreNames.contains(this.STORES.FAVORITES)) {
      const favoritesStore = db.createObjectStore(this.STORES.FAVORITES, { keyPath: 'id' });
      favoritesStore.createIndex('activityIdIndex', 'activityId', { unique: true });
      favoritesStore.createIndex('addedAtIndex', 'addedAt', { unique: false });
      console.log(`[OfflineDB] Created ${this.STORES.FAVORITES} store`);
    }

    // Create user preferences store
    if (!db.objectStoreNames.contains(this.STORES.USER_PREFERENCES)) {
      const prefsStore = db.createObjectStore(this.STORES.USER_PREFERENCES, { keyPath: 'key' });
      console.log(`[OfflineDB] Created ${this.STORES.USER_PREFERENCES} store`);
    }

    // Create cache metadata store
    if (!db.objectStoreNames.contains(this.STORES.CACHE_METADATA)) {
      const cacheStore = db.createObjectStore(this.STORES.CACHE_METADATA, { keyPath: 'key' });
      console.log(`[OfflineDB] Created ${this.STORES.CACHE_METADATA} store`);
    }

    // Migration from version 1 to 2: Add search index
    if (oldVersion < 2) {
      // Migration logic if needed
    }

    // Migration from version 2 to 3: Add timestamps
    if (oldVersion < 3) {
      // Migration logic if needed
    }
  },

  /**
   * Import trip data from data.js into IndexedDB
   */
  async importTripData(tripData) {
    if (!this.db) await this.init();

    console.log('[OfflineDB] Importing trip data...');

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.TRIPS, this.STORES.ACTIVITIES], 'readwrite');

      transaction.onerror = (event) => {
        console.error('[OfflineDB] Import transaction failed:', event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        console.log('[OfflineDB] Trip data import completed');
        resolve();
      };

      // Store each day in trips store
      const tripsStore = transaction.objectStore(this.STORES.TRIPS);
      const activitiesStore = transaction.objectStore(this.STORES.ACTIVITIES);

      tripData.days.forEach(day => {
        // Store day summary
        const daySummary = {
          id: `day-${day.day}`,
          day: day.day,
          date: day.date,
          title: day.title,
          city: day.city,
          color: day.color,
          summary: day.summary,
          tags: day.tags,
          overview: day.overview,
          route: day.route,
          lastUpdated: Date.now()
        };

        tripsStore.put(daySummary);

        // Store each activity
        day.timeline.forEach(activity => {
          const activityRecord = {
            id: activity.id,
            day: day.day,
            ...activity,
            lastUpdated: Date.now()
          };
          activitiesStore.put(activityRecord);
        });
      });

      // Store trip metadata
      const tripInfo = {
        id: 'trip-metadata',
        ...tripData.getTripInfo(),
        totalDays: tripData.days.length,
        lastUpdated: Date.now()
      };
      tripsStore.put(tripInfo);
    });
  },

  /**
   * Get trip metadata
   */
  async getTripInfo() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.TRIPS], 'readonly');
      const store = transaction.objectStore(this.STORES.TRIPS);
      const request = store.get('trip-metadata');

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get all days
   */
  async getAllDays() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.TRIPS], 'readonly');
      const store = transaction.objectStore(this.STORES.TRIPS);
      const index = store.index('dayIndex');
      const request = index.getAll();

      request.onsuccess = () => {
        // Filter out trip-metadata and sort by day
        const days = request.result
          .filter(item => item.id.startsWith('day-'))
          .sort((a, b) => a.day - b.day);
        resolve(days);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get specific day by day number
   */
  async getDay(dayNumber) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.TRIPS, this.STORES.ACTIVITIES], 'readonly');
      const tripsStore = transaction.objectStore(this.STORES.TRIPS);
      const activitiesStore = transaction.objectStore(this.STORES.ACTIVITIES);

      // Get day summary
      const dayRequest = tripsStore.get(`day-${dayNumber}`);

      dayRequest.onsuccess = () => {
        const daySummary = dayRequest.result;
        if (!daySummary) {
          reject(new Error(`Day ${dayNumber} not found`));
          return;
        }

        // Get activities for this day
        const activitiesIndex = activitiesStore.index('dayIndex');
        const activitiesRequest = activitiesIndex.getAll(dayNumber);

        activitiesRequest.onsuccess = () => {
          daySummary.timeline = activitiesRequest.result;
          resolve(daySummary);
        };

        activitiesRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };

      dayRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Search across all activities
   */
  async searchActivities(query) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.ACTIVITIES], 'readonly');
      const store = transaction.objectStore(this.STORES.ACTIVITIES);
      const request = store.getAll();

      request.onsuccess = () => {
        const searchLower = query.toLowerCase();
        const results = request.result.filter(activity =>
          activity.title.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower) ||
          (activity.location && activity.location.name.toLowerCase().includes(searchLower))
        );
        resolve(results);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get activities by category
   */
  async getActivitiesByCategory(category) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.ACTIVITIES], 'readonly');
      const store = transaction.objectStore(this.STORES.ACTIVITIES);
      const index = store.index('categoryIndex');
      const request = index.getAll(category);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Add activity to favorites
   */
  async addToFavorites(activityId, activityData = null) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);

      const favorite = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        activityId,
        activityData,
        addedAt: Date.now(),
        lastAccessed: Date.now(),
        synced: false
      };

      const request = store.put(favorite);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Added activity ${activityId} to favorites`);
        resolve(favorite.id);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Remove activity from favorites
   */
  async removeFromFavorites(activityId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const index = store.index('activityIdIndex');

      const request = index.getKey(activityId);

      request.onsuccess = () => {
        const key = request.result;
        if (key) {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => {
            console.log(`[OfflineDB] Removed activity ${activityId} from favorites`);
            resolve(true);
          };
          deleteRequest.onerror = (event) => {
            reject(event.target.error);
          };
        } else {
          resolve(false); // Not found
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get all favorites
   */
  async getFavorites() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readonly');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const index = store.index('addedAtIndex');
      const request = index.getAll();

      request.onsuccess = () => {
        // Sort by addedAt (newest first)
        const favorites = request.result.sort((a, b) => b.addedAt - a.addedAt);
        resolve(favorites);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Check if activity is favorited
   */
  async isFavorited(activityId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readonly');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const index = store.index('activityIdIndex');
      const request = index.getKey(activityId);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get unsynced favorites
   */
  async getUnsyncedFavorites() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readonly');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.getAll();

      request.onsuccess = () => {
        const unsynced = request.result.filter(fav => fav.synced === false);
        resolve(unsynced);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Mark favorite as synced
   */
  async markFavoriteAsSynced(favoriteId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const getRequest = store.get(favoriteId);

      getRequest.onsuccess = () => {
        const favorite = getRequest.result;
        if (!favorite) {
          reject(new Error(`Favorite ${favoriteId} not found`));
          return;
        }

        favorite.synced = true;
        favorite.lastSyncedAt = Date.now();
        const putRequest = store.put(favorite);

        putRequest.onsuccess = () => {
          console.log(`[OfflineDB] Marked favorite ${favoriteId} as synced`);
          resolve();
        };

        putRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };

      getRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get unsynced preferences
   */
  async getUnsyncedPreferences() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readonly');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const request = store.getAll();

      request.onsuccess = () => {
        const unsynced = request.result.filter(pref => pref.synced === false);
        resolve(unsynced);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Mark preference as synced
   */
  async markPreferenceAsSynced(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readwrite');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const preference = getRequest.result;
        if (!preference) {
          reject(new Error(`Preference ${key} not found`));
          return;
        }

        preference.synced = true;
        preference.lastSyncedAt = Date.now();
        const putRequest = store.put(preference);

        putRequest.onsuccess = () => {
          console.log(`[OfflineDB] Marked preference ${key} as synced`);
          resolve();
        };

        putRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };

      getRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get user preference
   */
  async getPreference(key, defaultValue = null) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readonly');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : defaultValue);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Set user preference
   */
  async setPreference(key, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readwrite');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);

      const preference = {
        key,
        value,
        updatedAt: Date.now(),
        synced: false
      };

      const request = store.put(preference);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Set preference ${key} = ${value}`);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Clear all user preferences
   */
  async clearPreferences() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readwrite');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[OfflineDB] Cleared all user preferences');
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get cache metadata
   */
  async getCacheMetadata(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.CACHE_METADATA], 'readonly');
      const store = transaction.objectStore(this.STORES.CACHE_METADATA);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Set cache metadata
   */
  async setCacheMetadata(key, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.CACHE_METADATA], 'readwrite');
      const store = transaction.objectStore(this.STORES.CACHE_METADATA);

      const metadata = {
        key,
        value,
        updatedAt: Date.now()
      };

      const request = store.put(metadata);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Set cache metadata ${key}`);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Resolve sync conflict between local and server data
   */
  async resolveSyncConflict(conflict) {
    if (!this.db) await this.init();

    // Conflict object should have { store, key, localData, serverData, resolution }
    // resolution can be 'local', 'server', 'merge'
    const { store, key, localData, serverData, resolution } = conflict;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);

      let resolvedData;
      switch (resolution) {
        case 'local':
          resolvedData = localData;
          break;
        case 'server':
          resolvedData = serverData;
          break;
        case 'merge':
          // Simple merge: prefer server data, but keep local synced flag
          resolvedData = { ...serverData, ...localData, synced: true };
          break;
        default:
          reject(new Error(`Invalid conflict resolution: ${resolution}`));
          return;
      }

      // Update the record
      const request = objectStore.put(resolvedData);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Resolved conflict for ${store}.${key} with ${resolution} resolution`);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get sync status statistics
   */
  async getSyncStatus() {
    if (!this.db) await this.init();

    const stats = {
      favorites: { total: 0, synced: 0, unsynced: 0 },
      preferences: { total: 0, synced: 0, unsynced: 0 }
    };

    // Count favorites
    const favorites = await this.getUnsyncedFavorites();
    const allFavorites = await this.getFavorites();
    stats.favorites.total = allFavorites.length;
    stats.favorites.unsynced = favorites.length;
    stats.favorites.synced = stats.favorites.total - stats.favorites.unsynced;

    // Count preferences - we need to get all preferences
    const allPreferences = await this.getAllPreferences();
    const unsyncedPreferences = allPreferences.filter(p => p.synced === false);
    stats.preferences.total = allPreferences.length;
    stats.preferences.unsynced = unsyncedPreferences.length;
    stats.preferences.synced = stats.preferences.total - stats.preferences.unsynced;

    return stats;
  },

  /**
   * Get all preferences
   */
  async getAllPreferences() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readonly');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Reset sync status for all records
   */
  async resetSyncStatus() {
    if (!this.db) await this.init();

    // Reset favorites
    const favorites = await this.getFavorites();
    for (const favorite of favorites) {
      favorite.synced = false;
      delete favorite.lastSyncedAt;
      await this.updateFavorite(favorite);
    }

    // Reset preferences
    const preferences = await this.getAllPreferences();
    for (const preference of preferences) {
      preference.synced = false;
      delete preference.lastSyncedAt;
      await this.updatePreference(preference);
    }

    console.log('[OfflineDB] Sync status reset for all records');
  },

  /**
   * Update favorite record
   */
  async updateFavorite(favorite) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.FAVORITES], 'readwrite');
      const store = transaction.objectStore(this.STORES.FAVORITES);
      const request = store.put(favorite);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Updated favorite ${favorite.id}`);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Update preference record
   */
  async updatePreference(preference) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORES.USER_PREFERENCES], 'readwrite');
      const store = transaction.objectStore(this.STORES.USER_PREFERENCES);
      const request = store.put(preference);

      request.onsuccess = () => {
        console.log(`[OfflineDB] Updated preference ${preference.key}`);
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Get database statistics
   */
  async getStats() {
    if (!this.db) await this.init();

    const stats = {
      stores: {}
    };

    // Count records in each store
    for (const storeName of Object.values(this.STORES)) {
      try {
        const count = await this.getStoreCount(storeName);
        stats.stores[storeName] = count;
      } catch (error) {
        console.warn(`[OfflineDB] Failed to count ${storeName}:`, error);
        stats.stores[storeName] = -1;
      }
    }

    // Get storage estimate
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        stats.storage = {
          usage: estimate.usage,
          quota: estimate.quota,
          percentage: estimate.usage && estimate.quota ?
            (estimate.usage / estimate.quota * 100).toFixed(2) : 0
        };
      } catch (error) {
        console.warn('[OfflineDB] Failed to get storage estimate:', error);
      }
    }

    return stats;
  },

  /**
   * Count records in a store
   */
  async getStoreCount(storeName) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(Object.values(this.STORES), 'readwrite');

      let completed = 0;
      const total = Object.values(this.STORES).length;

      transaction.onerror = (event) => {
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        console.log('[OfflineDB] Cleared all data');
        resolve();
      };

      // Clear each store
      Object.values(this.STORES).forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          console.log(`[OfflineDB] Cleared ${storeName}`);
        };
      });
    });
  }
};

// Initialize when imported
(async function() {
  try {
    await OfflineDB.init();
    console.log('[OfflineDB] Auto-initialized successfully');
  } catch (error) {
    console.warn('[OfflineDB] Auto-initialization failed:', error);
  }
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OfflineDB;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.OfflineDB = OfflineDB;
}
if (typeof self !== 'undefined') {
  self.OfflineDB = OfflineDB;
}