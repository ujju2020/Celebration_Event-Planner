/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Enterprise Fluent Builder Pattern for Event Requests
 */

import { EventRequest, EventType, VibeType } from '../types/index.js';
import { ValidationError, BudgetOutOfBoundsError } from '../errors/index.js';

export interface IEventRequestBuilder {
  setEventType(type: EventType): this;
  setTitle(title: string): this;
  setTotalBudget(amount: number, currency?: string): this;
  setGuestCount(count: number): this;
  setTargetDate(dateStr: string): this;
  setLocation(location: string): this;
  setVibe(vibe: VibeType): this;
  setCustomNotes(notes: string): this;
  build(): EventRequest;
}

/**
 * Fluent Builder class for constructing strongly-typed, validated EventRequest instances.
 */
export class EventRequestBuilder implements IEventRequestBuilder {
  private eventType: EventType = 'wedding';
  private title: string = 'Grand Celebration';
  private totalBudget: number = 1500000;
  private currency: string = 'INR';
  private guestCount: number = 100;
  private targetDate: string = '';
  private location: string = 'Central Venue';
  private vibe: VibeType = 'royal_traditional';
  private customVibeNotes?: string;

  constructor() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 90);
    this.targetDate = defaultDate.toISOString().split('T')[0];
  }

  public setEventType(type: EventType): this {
    this.eventType = type;
    return this;
  }

  public setTitle(title: string): this {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('title', 'Event title cannot be empty.');
    }
    this.title = title.trim();
    return this;
  }

  public setTotalBudget(amount: number, currency: string = 'INR'): this {
    if (isNaN(amount) || amount <= 0) {
      throw new BudgetOutOfBoundsError('totalBudget', amount, 100, 100_000_000);
    }
    this.totalBudget = amount;
    this.currency = currency;
    return this;
  }

  public setGuestCount(count: number): this {
    if (isNaN(count) || count < 1) {
      throw new ValidationError('guestCount', 'Guest count must be at least 1.');
    }
    this.guestCount = Math.floor(count);
    return this;
  }

  public setTargetDate(dateStr: string): this {
    if (!dateStr || isNaN(Date.parse(dateStr))) {
      throw new ValidationError('targetDate', 'Target date must be a valid ISO date string.');
    }
    this.targetDate = dateStr;
    return this;
  }

  public setLocation(location: string): this {
    if (!location || location.trim().length === 0) {
      throw new ValidationError('location', 'Location cannot be empty.');
    }
    this.location = location.trim();
    return this;
  }

  public setVibe(vibe: VibeType): this {
    this.vibe = vibe;
    return this;
  }

  public setCustomNotes(notes: string): this {
    this.customVibeNotes = notes.trim();
    return this;
  }

  /**
   * Finalizes and builds the immutable EventRequest object.
   * @returns Complete validated EventRequest
   */
  public build(): EventRequest {
    return {
      eventType: this.eventType,
      title: this.title,
      totalBudget: this.totalBudget,
      currency: this.currency,
      guestCount: this.guestCount,
      targetDate: this.targetDate,
      location: this.location,
      vibe: this.vibe,
      customVibeNotes: this.customVibeNotes
    };
  }
}
