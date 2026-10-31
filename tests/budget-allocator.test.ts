/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { BudgetAllocator } from '../src/engine/budget-allocator.js';
import { EventRequest } from '../src/types/index.js';

describe('BudgetAllocator', () => {
  it('calculates wedding budget with correct percentages and contingency', () => {
    const request: EventRequest = {
      eventType: 'wedding',
      title: 'Royal Heritage Wedding',
      totalBudget: 100000,
      currency: 'USD',
      guestCount: 200,
      targetDate: '2026-12-25',
      location: 'Grand Palace, Udaipur',
      vibe: 'royal_traditional'
    };

    const budget = BudgetAllocator.calculateBudget(request);

    expect(budget.totalBudget).toBe(100000);
    expect(budget.guestCount).toBe(200);
    expect(budget.costPerGuestTotal).toBe(500);
    expect(budget.contingencyPercentage).toBe(8);
    expect(budget.contingencyAmount).toBe(8000);

    const catering = budget.items.find(i => i.category === 'Catering & Drinks');
    expect(catering).toBeDefined();
    expect(catering?.allocatedAmount).toBe(32000); // 32%
    expect(catering?.costPerGuest).toBe(160);
  });

  it('calculates birthday budget correctly', () => {
    const request: EventRequest = {
      eventType: 'birthday',
      title: '30th Milestone Birthday Bash',
      totalBudget: 5000,
      currency: 'USD',
      guestCount: 50,
      targetDate: '2026-11-15',
      location: 'Skyline Lounge',
      vibe: 'retro_vintage'
    };

    const budget = BudgetAllocator.calculateBudget(request);

    expect(budget.totalBudget).toBe(5000);
    expect(budget.costPerGuestTotal).toBe(100);
    const venue = budget.items.find(i => i.category.includes('Venue'));
    expect(venue?.percentage).toBe(20);
    expect(venue?.allocatedAmount).toBe(1000);
  });

  it('calculates community event budget with permits and stage AV', () => {
    const request: EventRequest = {
      eventType: 'community',
      title: 'City Cultural Street Festival',
      totalBudget: 50000,
      currency: 'USD',
      guestCount: 1000,
      targetDate: '2026-10-31',
      location: 'Central Park Plaza',
      vibe: 'festive_carnival'
    };

    const budget = BudgetAllocator.calculateBudget(request);

    expect(budget.totalBudget).toBe(50000);
    expect(budget.contingencyPercentage).toBe(10);
    expect(budget.contingencyAmount).toBe(5000);
    const permits = budget.items.find(i => i.category.includes('Permits'));
    expect(permits).toBeDefined();
    expect(permits?.percentage).toBe(18);
  });

  it('generates warnings for extremely tight per-guest budgets', () => {
    const request: EventRequest = {
      eventType: 'wedding',
      title: 'Budget Wedding',
      totalBudget: 2000,
      currency: 'USD',
      guestCount: 100, // $20/guest
      targetDate: '2026-12-01',
      location: 'Local Hall',
      vibe: 'modern_minimalist'
    };

    const budget = BudgetAllocator.calculateBudget(request);
    expect(budget.overspendWarnings.length).toBeGreaterThan(0);
    expect(budget.overspendWarnings[0]).toContain('tight for full-scale wedding hospitality');
  });
});

