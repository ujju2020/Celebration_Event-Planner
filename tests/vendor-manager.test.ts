/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * - Developer: Ujjwal Kumar Bhowmick
 * - Email: ujjwalkumarbhowmick30@gmail.com
 * - All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { VendorManager } from '../src/engine/vendor-manager.js';
import { EventRequest } from '../src/types/index.js';

describe('VendorManager', () => {
  it('generates vendor categories with standard questions and contract red flags', () => {
    const request: EventRequest = {
      eventType: 'wedding',
      title: 'Grand Coastal Wedding',
      totalBudget: 80000,
      currency: 'USD',
      guestCount: 150,
      targetDate: '2027-04-10',
      location: 'Seaside Resort, Goa',
      vibe: 'modern_minimalist'
    };

    const vendors = VendorManager.generateVendorHub(request);

    expect(vendors.length).toBeGreaterThanOrEqual(5);

    const venue = vendors.find(v => v.id === 'ven-venue');
    expect(venue).toBeDefined();
    expect(venue?.requiredLeadTimeWeeks).toBe(24);
    expect(venue?.standardQuestions.length).toBeGreaterThanOrEqual(3);
    expect(venue?.contractRedFlags.length).toBeGreaterThanOrEqual(2);
    expect(venue?.rfpTemplate).toContain('Grand Coastal Wedding');

    const photo = vendors.find(v => v.id === 'ven-photo');
    expect(photo).toBeDefined();
    expect(photo?.standardQuestions.some(q => q.toLowerCase().includes('backup'))).toBe(true);
  });
});
