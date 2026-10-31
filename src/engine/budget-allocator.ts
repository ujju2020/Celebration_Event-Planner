/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * - Developer: Ujjwal Kumar Bhowmick
 * - Email: ujjwalkumarbhowmick30@gmail.com
 * - All rights reserved.
 * 
 * Dynamic Budget Allocator Engine for CelebraTech AI
 * Implements benchmarked allocation models, contingency reserves, and cost-per-guest analytics.
 */

import { EventRequest, EventType, BudgetBreakdown, BudgetItem, PriorityLevel } from '../types/index.js';

interface AllocationRule {
  category: string;
  name: string;
  percentage: number;
  priority: PriorityLevel;
  notes: string;
}

export class BudgetAllocator {
  // Standard benchmark allocation tables per event vertical
  private static readonly WEDDING_RULES: AllocationRule[] = [
    { category: 'Catering & Drinks', name: 'Multi-course Dining, Hors d’oeuvres & Bar', percentage: 32, priority: 'essential', notes: 'Primary guest hospitality experience' },
    { category: 'Venue & Rentals', name: 'Ceremony & Reception Space with Furniture', percentage: 22, priority: 'essential', notes: 'Core location booking and basic layout' },
    { category: 'Photo & Video', name: 'Full-day Coverage, Drone, & Cinematic Film', percentage: 12, priority: 'essential', notes: 'Preserving lifelong memories' },
    { category: 'Decor & Floral', name: 'Stage, Mandap/Altar, Centerpieces & Lighting', percentage: 11, priority: 'recommended', notes: 'Thematic ambiance and floral styling' },
    { category: 'Attire & Styling', name: 'Bridal/Groom Outfits, Hair & Makeup Artists', percentage: 7, priority: 'recommended', notes: 'Wardrobe, jewelry, and professional styling' },
    { category: 'Music & AV', name: 'Live Band / DJ, Sound System & Emcee', percentage: 6, priority: 'recommended', notes: 'Dance floor energy and sound engineering' },
    { category: 'Invitations & Gifts', name: 'Digital & Print Invites, Guest Favors', percentage: 2, priority: 'optional', notes: 'Keepsakes and welcome hampers' },
    { category: 'Emergency Contingency', name: 'Unexpected Overages & Tip Buffer', percentage: 8, priority: 'essential', notes: 'Mandatory buffer for last-minute adjustments' }
  ];

  private static readonly BIRTHDAY_RULES: AllocationRule[] = [
    { category: 'Food & Refreshments', name: 'Buffet/Bites, Signature Drinks & Master Cake', percentage: 38, priority: 'essential', notes: 'Gourmet meal, snacks and customized cake' },
    { category: 'Venue / Party Hall', name: 'Private Room, Lounge or Outdoor Lawn', percentage: 20, priority: 'essential', notes: 'Exclusive party space and setup' },
    { category: 'Entertainment & DJ', name: 'DJ, Party Host/Emcee & Fun Activities/Games', percentage: 14, priority: 'recommended', notes: 'Interactive activities and music' },
    { category: 'Decor & Theme', name: 'Balloon Arches, Backdrop, Photo Booth & Props', percentage: 12, priority: 'recommended', notes: 'Visual theme immersion and Instagram spots' },
    { category: 'Photo & Video', name: 'Event Photographer & Digital Highlight Reel', percentage: 6, priority: 'recommended', notes: 'Candid portraits and highlight reel' },
    { category: 'Invites & Favors', name: 'Custom Return Gifts & Digital Invites', percentage: 3, priority: 'optional', notes: 'Personalized souvenirs for attendees' },
    { category: 'Emergency Contingency', name: 'Spontaneous Add-ons & Extra Guests Buffer', percentage: 7, priority: 'essential', notes: 'Buffer for walk-ins or extra hours' }
  ];

  private static readonly COMMUNITY_RULES: AllocationRule[] = [
    { category: 'Catering & Food Stalls', name: 'Community Meals, Refreshment Kiosks & Water', percentage: 26, priority: 'essential', notes: 'Mass catering or vendor logistics' },
    { category: 'Stage, Sound & AV', name: 'Main Stage, Professional Line Array Sound & Screens', percentage: 22, priority: 'essential', notes: 'Acoustics, mics, amplifiers and projection' },
    { category: 'Permits & Security', name: 'Municipal Permissions, Private Security, First Aid & Sanitation', percentage: 18, priority: 'essential', notes: 'Legal compliance, crowd management & restrooms' },
    { category: 'Marketing & Signage', name: 'Flyers, Directional Banners, Badges & Wristbands', percentage: 12, priority: 'recommended', notes: 'Crowd guidance, registrations & sponsorships' },
    { category: 'Artists & Speakers', name: 'Guest Performers, Honorariums & Accommodations', percentage: 12, priority: 'recommended', notes: 'Headline acts and cultural troupes' },
    { category: 'Emergency Contingency', name: 'Weather Protection & Incident Reserve', percentage: 10, priority: 'essential', notes: 'Crucial for large gathering risk mitigation' }
  ];

  /**
   * Generates a fully calculated budget breakdown
   */
  public static calculateBudget(request: EventRequest): BudgetBreakdown {
    const rules = this.getRulesForEvent(request.eventType);
    const totalBudget = request.totalBudget;
    const guestCount = Math.max(1, request.guestCount);

    const items: BudgetItem[] = [];
    let contingencyAmount = 0;
    let contingencyPercentage = 0;
    let totalAllocated = 0;

    for (const rule of rules) {
      const allocated = Math.round((totalBudget * rule.percentage) / 100);
      const costPerGuest = parseFloat((allocated / guestCount).toFixed(2));
      totalAllocated += allocated;

      if (rule.category.toLowerCase().includes('contingency')) {
        contingencyAmount = allocated;
        contingencyPercentage = rule.percentage;
      }

      items.push({
        category: rule.category,
        name: rule.name,
        allocatedAmount: allocated,
        percentage: rule.percentage,
        priority: rule.priority,
        notes: rule.notes,
        costPerGuest
      });
    }

    // Cost per guest total
    const costPerGuestTotal = parseFloat((totalBudget / guestCount).toFixed(2));

    // Intelligence: Analyze warnings and savings
    const overspendWarnings = this.generateWarnings(request.eventType, totalBudget, guestCount, items);
    const savingsRecommendations = this.generateSavings(request.eventType, items);

    return {
      totalBudget,
      currency: request.currency || 'USD',
      guestCount,
      contingencyAmount,
      contingencyPercentage,
      totalAllocated,
      costPerGuestTotal,
      items,
      overspendWarnings,
      savingsRecommendations
    };
  }

  private static getRulesForEvent(eventType: EventType): AllocationRule[] {
    switch (eventType) {
      case 'wedding':
        return this.WEDDING_RULES;
      case 'birthday':
        return this.BIRTHDAY_RULES;
      case 'community':
        return this.COMMUNITY_RULES;
      default:
        return this.WEDDING_RULES;
    }
  }

  private static generateWarnings(
    eventType: EventType,
    totalBudget: number,
    guestCount: number,
    items: BudgetItem[]
  ): string[] {
    const warnings: string[] = [];
    const perGuest = totalBudget / guestCount;

    if (eventType === 'wedding' && perGuest < 50) {
      warnings.push(`High Alert: Total budget of ${perGuest.toFixed(1)}/guest is extremely tight for full-scale wedding hospitality.`);
    }

    if (eventType === 'birthday' && perGuest < 20) {
      warnings.push(`Budget Warning: ${perGuest.toFixed(1)}/guest may require finger foods rather than a plated banquet.`);
    }

    // Check catering proportion
    const catering = items.find(i => i.category.toLowerCase().includes('catering') || i.category.toLowerCase().includes('food'));
    if (catering && catering.allocatedAmount > totalBudget * 0.45) {
      warnings.push(`Catering exceeds 45% of total budget. Consider streamlining meal courses or drink packages.`);
    }

    return warnings;
  }

  private static generateSavings(eventType: EventType, items: BudgetItem[]): string[] {
    const recommendations: string[] = [
      'Reserve off-peak weekdays or Sunday daytime to negotiate 15-25% venue discounts.',
      'Opt for a curated signature mocktail/cocktail menu instead of an open premium bar.',
      'Use high-impact digital multimedia invitations with RSVP tracking to save printing & postage.',
      'Repurpose ceremony floral arches and centerpieces for reception stage decoration.'
    ];

    if (eventType === 'wedding') {
      recommendations.push('Bundle photography and videography with a single studio for 10-15% combo packages.');
    } else if (eventType === 'community') {
      recommendations.push('Leverage local community sponsors to underwrite stage AV or volunteer refreshment costs.');
    }

    return recommendations;
  }
}
