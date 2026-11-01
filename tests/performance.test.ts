/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Performance, Memoization, Strategy Pattern & Error Hierarchy Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Memoizer } from '../src/engine/memoizer.js';
import {
  BudgetAllocator,
  WeddingAllocationStrategy,
  BirthdayAllocationStrategy,
  CommunityAllocationStrategy,
  IBudgetAllocationStrategy
} from '../src/engine/budget-allocator.js';
import { EventCopilot } from '../src/engine/event-copilot.js';
import { CelebraTechPlanner } from '../src/index.js';
import {
  ValidationError,
  BudgetOutOfBoundsError,
  GuardrailViolationError,
  PlannerStateError
} from '../src/errors/index.js';
import { EventRequest, PlannerDossier } from '../src/types/index.js';

describe('High-Performance O(1) LRU Memoizer Engine', () => {
  let cache: Memoizer<string, number>;

  beforeEach(() => {
    cache = new Memoizer<string, number>(3);
  });

  it('should store and retrieve values in O(1) time', () => {
    cache.set('item1', 100);
    expect(cache.get('item1')).toBe(100);
    expect(cache.get('nonexistent')).toBeUndefined();

    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRatio).toBe(0.5);
  });

  it('should evict least-recently-used item when maxCapacity is reached', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.getStats().size).toBe(3);

    // Access 'a' to make it recently used
    cache.get('a');

    // Add 'd', which should evict 'b' (since 'b' is now the least recently used)
    cache.set('d', 4);
    expect(cache.getStats().size).toBe(3);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });

  it('should update existing keys without exceeding capacity', () => {
    cache.set('a', 1);
    cache.set('a', 99);
    expect(cache.get('a')).toBe(99);
    expect(cache.getStats().size).toBe(1);
  });

  it('should compute on cache miss and retrieve on cache hit via getOrCompute', () => {
    let callCount = 0;
    const expensiveOperation = () => {
      callCount++;
      return 42 * 10;
    };

    const first = cache.getOrCompute('mathKey', expensiveOperation);
    expect(first).toBe(420);
    expect(callCount).toBe(1);

    const second = cache.getOrCompute('mathKey', expensiveOperation);
    expect(second).toBe(420);
    expect(callCount).toBe(1); // Factory was NOT called again
    expect(cache.getStats().hits).toBe(1);
  });

  it('should reset telemetry counters on clear()', () => {
    cache.set('x', 99);
    cache.get('x');
    cache.clear();

    const stats = cache.getStats();
    expect(stats.size).toBe(0);
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(0);
    expect(stats.hitRatio).toBe(0);
  });
});

describe('Budget Allocator Strategy Pattern & Memoized Performance', () => {
  beforeEach(() => {
    BudgetAllocator.clearCache();
  });

  const baseRequest: EventRequest = {
    eventType: 'wedding',
    title: 'Luxury Palace Nuptials',
    totalBudget: 2000000,
    currency: 'INR',
    guestCount: 200,
    targetDate: '2026-12-10',
    location: 'Udaipur, Rajasthan',
    vibe: 'royal_traditional'
  };

  it('should employ WeddingAllocationStrategy correctly', () => {
    const strategy = new WeddingAllocationStrategy();
    expect(strategy.eventType).toBe('wedding');
    expect(strategy.rules.length).toBeGreaterThanOrEqual(7);

    const breakdown = BudgetAllocator.allocate(baseRequest);
    expect(breakdown.totalAllocated).toBe(2000000);
    expect(breakdown.contingencyPercentage).toBe(8);
  });

  it('should employ BirthdayAllocationStrategy correctly', () => {
    const strategy = new BirthdayAllocationStrategy();
    expect(strategy.eventType).toBe('birthday');

    const breakdown = BudgetAllocator.allocate({
      ...baseRequest,
      eventType: 'birthday',
      totalBudget: 300000,
      guestCount: 50
    });
    expect(breakdown.totalAllocated).toBe(300000);
    expect(breakdown.costPerGuestTotal).toBe(6000);
  });

  it('should employ CommunityAllocationStrategy correctly', () => {
    const strategy = new CommunityAllocationStrategy();
    expect(strategy.eventType).toBe('community');

    const breakdown = BudgetAllocator.allocate({
      ...baseRequest,
      eventType: 'community',
      totalBudget: 800000,
      guestCount: 500
    });
    expect(breakdown.totalAllocated).toBe(800000);
    expect(breakdown.items.some(i => i.category.includes('Stage'))).toBe(true);
  });

  it('should support dynamic registration of custom allocation strategies', () => {
    class CorporateGalaStrategy implements IBudgetAllocationStrategy {
      public readonly eventType = 'community' as const;
      public readonly rules = [
        { category: 'Keynote & Production', name: 'Stage & LED Screens', percentage: 40, priority: 'essential' as const, notes: 'Corporate branding' },
        { category: 'VIP Dining & Cocktails', name: 'Executive Banquet', percentage: 40, priority: 'essential' as const, notes: 'High-end hospitality' },
        { category: 'Safety & Contingency', name: 'Reserve', percentage: 20, priority: 'essential' as const, notes: 'Safety' }
      ];
    }

    BudgetAllocator.registerStrategy('community', new CorporateGalaStrategy());
    const breakdown = BudgetAllocator.allocate({
      ...baseRequest,
      eventType: 'community',
      totalBudget: 1000000
    });

    expect(breakdown.items.length).toBe(3);
    expect(breakdown.items[0].category).toBe('Keynote & Production');

    // Restore standard strategy
    BudgetAllocator.registerStrategy('community', new CommunityAllocationStrategy());
  });

  it('should memoize subsequent budget calculations with sub-millisecond execution', () => {
    // First run (computes and caches)
    const t0 = performance.now();
    const first = BudgetAllocator.allocate(baseRequest);
    const duration1 = performance.now() - t0;

    // Second run (cache hit)
    const t1 = performance.now();
    const second = BudgetAllocator.allocate(baseRequest);
    const duration2 = performance.now() - t1;

    expect(second).toEqual(first);
    expect(BudgetAllocator.getCacheStats().hits).toBe(1);
    expect(duration2).toBeLessThanOrEqual(5); // Ultra-fast sub-5ms memoized execution
  });

  it('should trigger warnings for tight birthday budget and oversized catering', () => {
    // Tight birthday budget
    const tightBirthday = BudgetAllocator.allocate({
      ...baseRequest,
      eventType: 'birthday',
      totalBudget: 10000,
      guestCount: 100 // 100/guest < 400 INR
    });
    expect(tightBirthday.overspendWarnings.some(w => w.includes('Budget Warning'))).toBe(true);

    // Custom strategy with > 45% catering
    class HeavyCateringStrategy implements IBudgetAllocationStrategy {
      public readonly eventType = 'wedding' as const;
      public readonly rules = [
        { category: 'Catering & Feasts', name: 'Grand Feast', percentage: 55, priority: 'essential' as const, notes: 'Feast' },
        { category: 'Other', name: 'Other', percentage: 45, priority: 'essential' as const, notes: 'Other' }
      ];
    }
    BudgetAllocator.registerStrategy('wedding', new HeavyCateringStrategy());
    const heavyCatering = BudgetAllocator.allocate(baseRequest);
    expect(heavyCatering.overspendWarnings.some(w => w.includes('Catering exceeds 45%'))).toBe(true);

    // Restore standard wedding strategy
    BudgetAllocator.registerStrategy('wedding', new WeddingAllocationStrategy());
  });

  it('should manage EventCopilot cache telemetry and clearing', () => {
    EventCopilot.clearCache();
    const statsInitial = EventCopilot.getCacheStats();
    expect(statsInitial.size).toBe(0);
  });
});

describe('Domain-Driven Error Hierarchy & Planner State Guard', () => {
  it('should construct ValidationError with field metadata and error code', () => {
    const err = new ValidationError('guestCount', 'Cannot be zero');
    expect(err.errorCode).toBe('ERR_VALIDATION');
    expect(err.field).toBe('guestCount');
    expect(err.message).toContain("Validation failed on 'guestCount'");
    expect(err.timestamp).toBeDefined();
    expect(err.name).toBe('ValidationError');
  });

  it('should construct BudgetOutOfBoundsError inheriting from ValidationError', () => {
    const err = new BudgetOutOfBoundsError('totalBudget', -100, 100, 1000000);
    expect(err instanceof ValidationError).toBe(true);
    expect(err.errorCode).toBe('ERR_VALIDATION');
    expect(err.field).toBe('totalBudget');
    expect(err.message).toContain('out of allowable range');
  });

  it('should construct GuardrailViolationError with detected patterns', () => {
    const err = new GuardrailViolationError(['SELECT * FROM users', 'DROP TABLE'], 'SQL Injection Attempt');
    expect(err.errorCode).toBe('ERR_GUARDRAIL_VIOLATION');
    expect(err.detectedPatterns).toEqual(['SELECT * FROM users', 'DROP TABLE']);
    expect(err.message).toContain('SQL Injection Attempt');
  });

  it('should throw PlannerStateError when askCopilot is called before planEvent()', () => {
    const planner = new CelebraTechPlanner();
    expect(() => planner.askCopilot('What is our catering budget?')).toThrow(PlannerStateError);
    expect(() => planner.askCopilot('What is our catering budget?')).toThrowError(/No active event plan found/);
  });
});
