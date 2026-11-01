/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Dynamic Budget Allocator Engine for CelebraTech AI
 * Features Strategy Pattern, O(1) Memoization Caching, and Real-time Analytics.
 */

import { EventRequest, EventType, BudgetBreakdown, BudgetItem, PriorityLevel } from '../types/index.js';
import { Memoizer, CacheStats } from './memoizer.js';

export interface AllocationRule {
  readonly category: string;
  readonly name: string;
  readonly percentage: number;
  readonly priority: PriorityLevel;
  readonly notes: string;
}

/**
 * Strategy interface for vertical-specific budget distribution models.
 */
export interface IBudgetAllocationStrategy {
  readonly eventType: EventType;
  readonly rules: readonly AllocationRule[];
}

export class WeddingAllocationStrategy implements IBudgetAllocationStrategy {
  public readonly eventType: EventType = 'wedding';
  public readonly rules: readonly AllocationRule[] = [
    { category: 'Catering & Drinks', name: 'Multi-course Dining, Hors d’oeuvres & Bar', percentage: 32, priority: 'essential', notes: 'Primary guest hospitality experience' },
    { category: 'Venue & Rentals', name: 'Ceremony & Reception Space with Furniture', percentage: 22, priority: 'essential', notes: 'Core location booking and basic layout' },
    { category: 'Photo & Video', name: 'Full-day Coverage, Drone, & Cinematic Film', percentage: 12, priority: 'essential', notes: 'Preserving lifelong memories' },
    { category: 'Decor & Floral', name: 'Stage, Mandap/Altar, Centerpieces & Lighting', percentage: 11, priority: 'recommended', notes: 'Thematic ambiance and floral styling' },
    { category: 'Attire & Styling', name: 'Bridal/Groom Outfits, Hair & Makeup Artists', percentage: 7, priority: 'recommended', notes: 'Wardrobe, jewelry, and professional styling' },
    { category: 'Music & AV', name: 'Live Band / DJ, Sound System & Emcee', percentage: 6, priority: 'recommended', notes: 'Dance floor energy and sound engineering' },
    { category: 'Invitations & Gifts', name: 'Digital & Print Invites, Guest Favors', percentage: 2, priority: 'optional', notes: 'Keepsakes and welcome hampers' },
    { category: 'Emergency Contingency', name: 'Unexpected Overages & Tip Buffer', percentage: 8, priority: 'essential', notes: 'Mandatory buffer for last-minute adjustments' }
  ];
}

export class BirthdayAllocationStrategy implements IBudgetAllocationStrategy {
  public readonly eventType: EventType = 'birthday';
  public readonly rules: readonly AllocationRule[] = [
    { category: 'Food & Refreshments', name: 'Buffet/Bites, Signature Drinks & Master Cake', percentage: 38, priority: 'essential', notes: 'Gourmet meal, snacks and customized cake' },
    { category: 'Venue / Party Hall', name: 'Private Room, Lounge or Outdoor Lawn', percentage: 20, priority: 'essential', notes: 'Exclusive party space and setup' },
    { category: 'Entertainment & DJ', name: 'DJ, Party Host/Emcee & Fun Activities/Games', percentage: 14, priority: 'recommended', notes: 'Interactive activities and music' },
    { category: 'Decor & Theme', name: 'Balloon Arches, Backdrop, Photo Booth & Props', percentage: 12, priority: 'recommended', notes: 'Visual theme immersion and Instagram spots' },
    { category: 'Photo & Video', name: 'Event Photographer & Digital Highlight Reel', percentage: 6, priority: 'recommended', notes: 'Candid portraits and highlight reel' },
    { category: 'Invites & Favors', name: 'Custom Return Gifts & Digital Invites', percentage: 3, priority: 'optional', notes: 'Personalized souvenirs for attendees' },
    { category: 'Emergency Contingency', name: 'Spontaneous Add-ons & Extra Guests Buffer', percentage: 7, priority: 'essential', notes: 'Buffer for walk-ins or extra hours' }
  ];
}

export class CommunityAllocationStrategy implements IBudgetAllocationStrategy {
  public readonly eventType: EventType = 'community';
  public readonly rules: readonly AllocationRule[] = [
    { category: 'Catering & Food Stalls', name: 'Community Meals, Refreshment Kiosks & Water', percentage: 26, priority: 'essential', notes: 'Mass catering or vendor logistics' },
    { category: 'Stage, Sound & AV', name: 'Main Stage, Professional Line Array Sound & Screens', percentage: 22, priority: 'essential', notes: 'Acoustics, mics, amplifiers and projection' },
    { category: 'Permits & Security', name: 'Municipal Permissions, Private Security, First Aid & Sanitation', percentage: 18, priority: 'essential', notes: 'Legal compliance, crowd management & restrooms' },
    { category: 'Marketing & Signage', name: 'Flyers, Directional Banners, Badges & Wristbands', percentage: 12, priority: 'recommended', notes: 'Crowd guidance, registrations & sponsorships' },
    { category: 'Artists & Speakers', name: 'Guest Performers, Honorariums & Accommodations', percentage: 12, priority: 'recommended', notes: 'Headline acts and cultural troupes' },
    { category: 'Emergency Contingency', name: 'Weather Protection & Incident Reserve', percentage: 10, priority: 'essential', notes: 'Crucial for large gathering risk mitigation' }
  ];
}

/**
 * High-performance budget allocation engine with constant-time O(1) caching.
 */
export class BudgetAllocator {
  // O(1) Memoization cache for calculated budgets
  private static readonly cache = new Memoizer<string, BudgetBreakdown>(256);

  // Strategy Registry indexed by EventType for O(1) lookup
  private static readonly strategies = new Map<EventType, IBudgetAllocationStrategy>([
    ['wedding', new WeddingAllocationStrategy()],
    ['birthday', new BirthdayAllocationStrategy()],
    ['community', new CommunityAllocationStrategy()]
  ]);

  /**
   * Registers or replaces an allocation strategy for a specific event type.
   */
  public static registerStrategy(type: EventType, strategy: IBudgetAllocationStrategy): void {
    this.strategies.set(type, strategy);
    this.cache.clear();
  }

  /**
   * Alias for calculateBudget.
   */
  public static allocate(request: EventRequest): BudgetBreakdown {
    return this.calculateBudget(request);
  }

  /**
   * Generates a fully calculated budget breakdown with O(1) memoization caching.
   * @param request Validated event parameters
   * @returns Complete calculated BudgetBreakdown
   * @example
   * const budget = BudgetAllocator.calculateBudget({
   *   eventType: 'wedding',
   *   totalBudget: 1500000,
   *   currency: 'INR',
   *   guestCount: 200, ...
   * });
   */
  public static calculateBudget(request: EventRequest): BudgetBreakdown {
    const totalBudget = request.totalBudget;
    const guestCount = Math.max(1, request.guestCount);
    const currency = request.currency || 'INR';
    const eventType = request.eventType;

    // Cache key for sub-millisecond retrieval
    const cacheKey = `${eventType}:${totalBudget}:${guestCount}:${currency}`;

    return this.cache.getOrCompute(cacheKey, () => {
      const strategy = this.strategies.get(eventType) || this.strategies.get('wedding')!;
      const rules = strategy.rules;

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
      const overspendWarnings = this.generateWarnings(eventType, totalBudget, guestCount, items, currency);
      const savingsRecommendations = this.generateSavings(eventType, items);

      return {
        totalBudget,
        currency,
        guestCount,
        contingencyAmount,
        contingencyPercentage,
        totalAllocated,
        costPerGuestTotal,
        items,
        overspendWarnings,
        savingsRecommendations
      };
    });
  }

  /**
   * Returns live memoization cache statistics.
   */
  public static getCacheStats(): CacheStats {
    return this.cache.getStats();
  }

  /**
   * Clears the internal budget cache.
   */
  public static clearCache(): void {
    this.cache.clear();
  }

  private static generateWarnings(
    eventType: EventType,
    totalBudget: number,
    guestCount: number,
    items: BudgetItem[],
    currency: string = 'INR'
  ): string[] {
    const warnings: string[] = [];
    const perGuest = totalBudget / guestCount;
    const sym = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    const weddingMin = currency === 'INR' ? 1000 : 50;
    const birthdayMin = currency === 'INR' ? 400 : 20;

    if (eventType === 'wedding' && perGuest < weddingMin) {
      warnings.push(`High Alert: Total budget of ${sym} ${perGuest.toFixed(1)}/guest is extremely tight for full-scale wedding hospitality.`);
    }

    if (eventType === 'birthday' && perGuest < birthdayMin) {
      warnings.push(`Budget Warning: ${sym} ${perGuest.toFixed(1)}/guest may require finger foods rather than a plated banquet.`);
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
