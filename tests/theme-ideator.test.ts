/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 */

import { describe, it, expect } from 'vitest';
import { ThemeIdeator } from '../src/engine/theme-ideator.js';
import { EventRequest } from '../src/types/index.js';

describe('ThemeIdeator', () => {
  it('generates cohesive theme palettes, invitation copies, and custom speeches for wedding', () => {
    const request: EventRequest = {
      eventType: 'wedding',
      title: 'Aarav & Maya Wedding',
      totalBudget: 60000,
      currency: 'USD',
      guestCount: 200,
      targetDate: '2026-12-18',
      location: 'Jaipur Heritage Fort',
      vibe: 'royal_traditional'
    };

    const concept = ThemeIdeator.generateConcept(request);

    expect(concept.themeName).toBeDefined();
    expect(concept.colorPalette.length).toBe(4);
    expect(concept.colorPalette[0].hex.startsWith('#')).toBe(true);

    // Invitations
    expect(concept.invitationCopy.formal).toContain('Aarav & Maya Wedding');
    expect(concept.invitationCopy.casual).toContain('Jaipur Heritage Fort');
    expect(concept.invitationCopy.socialInvite).toContain('SAVE THE DATE');

    // Speeches
    expect(concept.speeches.welcomeSpeech).toContain('Good evening');
    expect(concept.speeches.hostToast).toContain('raise our glasses');
    expect(concept.speeches.voteOfThanks).toContain('gratitude');

    // Playlist
    expect(concept.curatedPlaylistVibe.length).toBeGreaterThan(0);
  });

  it('generates thematic concepts for all vibe variations', () => {
    const vibes = ['bohemian_chic', 'festive_carnival', 'retro_vintage', 'corporate_gala', 'modern_minimalist'] as const;

    for (const vibe of vibes) {
      const concept = ThemeIdeator.generateConcept({
        eventType: vibe === 'corporate_gala' ? 'community' : 'birthday',
        title: `Celebration - ${vibe}`,
        totalBudget: 15000,
        currency: 'USD',
        guestCount: 80,
        targetDate: '2027-02-14',
        location: 'Downtown Hall',
        vibe
      });

      expect(concept.colorPalette.length).toBe(4);
      expect(concept.tagline).toBeDefined();
      expect(concept.curatedPlaylistVibe.length).toBeGreaterThan(0);
    }
  });
});
