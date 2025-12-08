/**
 * Data Caching Utility
 * Provides in-memory caching for API responses
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: number | null;

  constructor() {
    this.cache = new Map();
    this.cleanupInterval = null;
    this.startCleanupTimer();
  }

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data with TTL (time to live)
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;

    this.cache.forEach(entry => {
      const isExpired = now - entry.timestamp > entry.ttl;
      if (isExpired) {
        expiredEntries++;
      } else {
        validEntries++;
      }
      totalSize++;
    });

    return {
      totalEntries: totalSize,
      validEntries,
      expiredEntries,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = window.setInterval(() => {
      this.clearExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop automatic cleanup timer
   */
  stopCleanupTimer(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Create singleton instance
const cacheInstance = new DataCache();

/**
 * Get cached data
 */
export function getCachedData<T>(key: string): T | null {
  return cacheInstance.get<T>(key);
}

/**
 * Set cached data
 */
export function setCachedData<T>(key: string, data: T, ttl: number): void {
  cacheInstance.set(key, data, ttl);
}

/**
 * Check if cache has key
 */
export function hasCachedData(key: string): boolean {
  return cacheInstance.has(key);
}

/**
 * Delete cached data
 */
export function deleteCachedData(key: string): boolean {
  return cacheInstance.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cacheInstance.clear();
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  cacheInstance.clearExpired();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cacheInstance.getStats();
}

/**
 * Get cache instance (for advanced usage)
 */
export function getCacheInstance(): DataCache {
  return cacheInstance;
}

// Export the class for testing purposes
export { DataCache };
















