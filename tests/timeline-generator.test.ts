/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { TimelineGenerator } from '../src/engine/timeline-generator.js';
import { EventRequest } from '../src/types/index.js';

describe('TimelineGenerator', () => {
  it('generates milestone phases with critical path tracking for wedding', () => {
    const request: EventRequest = {
      eventType: 'wedding',
      title: 'Romantic Garden Wedding',
      totalBudget: 40000,
      currency: 'USD',
      guestCount: 120,
      targetDate: '2027-06-15',
      location: 'Napa Valley Vineyards',
      vibe: 'bohemian_chic'
    };

    const timeline = TimelineGenerator.generateTimeline(request);

    expect(timeline.eventDate).toBe('2027-06-15');
    expect(timeline.phases.length).toBe(4);
    expect(timeline.totalTasks).toBeGreaterThanOrEqual(7);
    expect(timeline.criticalPathCount).toBeGreaterThan(0);

    // Verify task targetDueDate computation
    const phase1 = timeline.phases.find(p => p.id === 'p1');
    expect(phase1).toBeDefined();
    const venueTask = phase1?.tasks.find(t => t.id === 'wed-01');
    expect(venueTask).toBeDefined();
    expect(venueTask?.isCriticalPath).toBe(true);
    expect(venueTask?.targetDueDate).toBeDefined();
    expect(venueTask?.targetDueDate.length).toBe(10);
  });

  it('generates Day-Of Run of Show with scheduled slots for birthday', () => {
    const request: EventRequest = {
      eventType: 'birthday',
      title: '21st Birthday Gala',
      totalBudget: 3000,
      currency: 'USD',
      guestCount: 40,
      targetDate: '2026-11-20',
      location: 'Rooftop Bar',
      vibe: 'retro_vintage'
    };

    const timeline = TimelineGenerator.generateTimeline(request);

    expect(timeline.dayOfRunOfShow.length).toBeGreaterThan(5);
    const firstSlot = timeline.dayOfRunOfShow[0];
    expect(firstSlot.time).toBeDefined();
    expect(firstSlot.activity).toBeDefined();
    expect(firstSlot.leadPerson).toBeDefined();
  });

  it('generates community festival timeline with municipal permits and stage run-of-show', () => {
    const request: EventRequest = {
      eventType: 'community',
      title: 'Tech Expo & Festival',
      totalBudget: 75000,
      currency: 'USD',
      guestCount: 1500,
      targetDate: '2027-03-25',
      location: 'City Convention Grounds',
      vibe: 'corporate_gala'
    };

    const timeline = TimelineGenerator.generateTimeline(request);
    expect(timeline.phases.length).toBe(4);
    expect(timeline.dayOfRunOfShow.some(s => s.activity.toLowerCase().includes('clean-up'))).toBe(true);
  });
});
