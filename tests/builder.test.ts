/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Unit Tests for EventRequestBuilder & Domain Validation Errors
 */

import { describe, it, expect } from 'vitest';
import { EventRequestBuilder } from '../src/builder/event-builder.js';
import { ValidationError, BudgetOutOfBoundsError } from '../src/errors/index.js';

describe('EventRequestBuilder (Builder Pattern)', () => {
  it('should build a valid EventRequest with default values', () => {
    const builder = new EventRequestBuilder();
    const req = builder.build();

    expect(req.eventType).toBe('wedding');
    expect(req.totalBudget).toBe(1500000);
    expect(req.currency).toBe('INR');
    expect(req.guestCount).toBe(100);
    expect(req.title).toBe('Grand Celebration');
    expect(req.location).toBe('Central Venue');
    expect(req.vibe).toBe('royal_traditional');
    expect(req.targetDate).toBeDefined();
  });

  it('should fluently configure all fields correctly', () => {
    const req = new EventRequestBuilder()
      .setEventType('birthday')
      .setTitle('Aarav 10th Birthday Bash')
      .setTotalBudget(250000, 'INR')
      .setGuestCount(60)
      .setTargetDate('2026-12-25')
      .setLocation('Taj Banquet, Mumbai')
      .setVibe('neon_cyberpunk')
      .setCustomNotes('Laser tag and galactic cake')
      .build();

    expect(req.eventType).toBe('birthday');
    expect(req.title).toBe('Aarav 10th Birthday Bash');
    expect(req.totalBudget).toBe(250000);
    expect(req.currency).toBe('INR');
    expect(req.guestCount).toBe(60);
    expect(req.targetDate).toBe('2026-12-25');
    expect(req.location).toBe('Taj Banquet, Mumbai');
    expect(req.vibe).toBe('neon_cyberpunk');
    expect(req.customVibeNotes).toBe('Laser tag and galactic cake');
  });

  it('should throw ValidationError when title is empty', () => {
    const builder = new EventRequestBuilder();
    expect(() => builder.setTitle('   ')).toThrow(ValidationError);
    expect(() => builder.setTitle('')).toThrowError(/Validation failed on 'title'/);
  });

  it('should throw BudgetOutOfBoundsError when budget is zero or negative', () => {
    const builder = new EventRequestBuilder();
    expect(() => builder.setTotalBudget(0)).toThrow(BudgetOutOfBoundsError);
    expect(() => builder.setTotalBudget(-5000)).toThrow(BudgetOutOfBoundsError);
    expect(() => builder.setTotalBudget(NaN)).toThrow(BudgetOutOfBoundsError);
  });

  it('should throw ValidationError when guest count is less than 1', () => {
    const builder = new EventRequestBuilder();
    expect(() => builder.setGuestCount(0)).toThrow(ValidationError);
    expect(() => builder.setGuestCount(-10)).toThrowError(/Validation failed on 'guestCount'/);
  });

  it('should throw ValidationError on invalid target date', () => {
    const builder = new EventRequestBuilder();
    expect(() => builder.setTargetDate('invalid-date-format')).toThrow(ValidationError);
    expect(() => builder.setTargetDate('')).toThrow(ValidationError);
  });

  it('should throw ValidationError on empty location', () => {
    const builder = new EventRequestBuilder();
    expect(() => builder.setLocation('  ')).toThrow(ValidationError);
  });
});

