/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * High-Performance O(1) Memoization & LRU Cache Engine for CelebraTech AI
 * Eliminates redundant recalculations and enforces sub-millisecond query latency.
 */

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxCapacity: number;
  hitRatio: number;
}

/**
 * Generic O(1) Least-Recently-Used (LRU) In-Memory Cache.
 */
export class Memoizer<K, V> {
  private readonly store: Map<K, V>;
  private hits: number = 0;
  private misses: number = 0;

  constructor(private readonly maxCapacity: number = 128) {
    this.store = new Map<K, V>();
  }

  /**
   * Retrieves a cached value in O(1) constant time, refreshing its LRU order.
   * @param key Cache key
   * @returns Cached value or undefined
   */
  public get(key: K): V | undefined {
    if (!this.store.has(key)) {
      this.misses++;
      return undefined;
    }

    this.hits++;
    // Re-insert to mark as most recently used in Map iteration order
    const val = this.store.get(key)!;
    this.store.delete(key);
    this.store.set(key, val);
    return val;
  }

  /**
   * Inserts or updates an entry in O(1) constant time with automated LRU eviction.
   * @param key Cache key
   * @param value Value to store
   */
  public set(key: K, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxCapacity) {
      // Evict the least recently used item (the first key in insertion order)
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
      }
    }
    this.store.set(key, value);
  }

  /**
   * Wraps an expensive computation with transparent O(1) memoization.
   * @param key Unique cache key
   * @param factory Computation factory function
   */
  public getOrCompute(key: K, factory: () => V): V {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const computed = factory();
    this.set(key, computed);
    return computed;
  }

  /**
   * Returns live performance telemetry and hit ratio.
   */
  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.store.size,
      maxCapacity: this.maxCapacity,
      hitRatio: total === 0 ? 0 : parseFloat((this.hits / total).toFixed(4))
    };
  }

  /**
   * Clears the cache and resets telemetry counters.
   */
  public clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

