/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Interactive Event Copilot Engine for CelebraTech AI
 * Context-aware AI assistant that parses user prompts, provides intelligent triage,
 * and dynamically recommends event adjustments.
 */

import { PlannerDossier, EventRequest } from '../types/index.js';
import { BudgetAllocator } from './budget-allocator.js';

export interface CopilotResponse {
  answer: string;
  suggestedAction?: string;
  suggestedFollowUps: string[];
  updatedBudgetSnippet?: {
    newCostPerGuest: number;
    deltaNote: string;
  };
}

export class EventCopilot {
  /**
   * Evaluates user queries and provides context-aware event planning assistance
   */
  public static processQuery(query: string, dossier: PlannerDossier): CopilotResponse {
    const q = query.toLowerCase();

    const currency = dossier.request.currency || 'INR';
    const sym = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';

    // 1. Guest count change
    const guestMatch = q.match(/(?:guest(?:s)?\s*(?:count|list)?|headcount|people)\s*(?:increased|grew|decreased|to|by|expanded|is|are)?\s*(?:to|by)?\s*(\d+)/i) ||
                       q.match(/(\d+)\s+guests/i);
    if (guestMatch) {
      const newCount = parseInt(guestMatch[1], 10);
      if (newCount > 0 && newCount !== dossier.request.guestCount) {
        const currentPerGuest = dossier.budget.costPerGuestTotal;
        const projectedPerGuest = parseFloat((dossier.request.totalBudget / newCount).toFixed(2));
        const diff = projectedPerGuest - currentPerGuest;

        const advice = diff < 0
          ? `Increasing guest count from ${dossier.request.guestCount} to ${newCount} compresses your spending power to ${sym} ${projectedPerGuest}/guest (a decrease of ${Math.abs(diff).toFixed(2)}/guest). To accommodate this, we recommend shifting 5-8% from decor and printed stationery into catering, or opting for family-style/buffet dining rather than plated service.`
          : `Decreasing guest count to ${newCount} frees up spending room to ${sym} ${projectedPerGuest}/guest (an increase of ${diff.toFixed(2)}/guest). You can upgrade your catering menu tiers or enhance live musical entertainment!`;

        return {
          answer: advice,
          suggestedAction: `Update guest count to ${newCount}`,
          suggestedFollowUps: [
            'How can we reduce catering cost per plate?',
            'What seating arrangements work best for this headcount?',
            'Show updated timeline milestones'
          ],
          updatedBudgetSnippet: {
            newCostPerGuest: projectedPerGuest,
            deltaNote: `Revised for ${newCount} guests.`
          }
        };
      }
    }

    // 2. Budget cuts and savings
    if (q.includes('save') || q.includes('cut budget') || q.includes('reduce cost') || q.includes('cheap') || q.includes('discount')) {
      const savingsStr = currency === 'INR' ? '₹40,000–₹1,20,000' : '$500–$1,500';
      return {
        answer: `Here are 4 high-impact ways to optimize your ${dossier.request.eventType} budget without sacrificing quality:\n` +
          `1. **Venue Timing:** Booking on Friday evening or Sunday afternoon usually secures 15-20% discounts compared to Saturday primes.\n` +
          `2. **Catering Strategy:** Switch from a 5-course plated banquet to elevated action food stations or buffet, which reduces staffing overhead by ~25%.\n` +
          `3. **Floral Repurposing:** Have your coordinator relocate ceremony floral arches to the reception photo booth and sweetheart table.\n` +
          `4. **Digital Invites & RSVP:** Save up to ${savingsStr} on fine stationery printing and courier postage by using digital invitations with automated RSVP tracking.`,
        suggestedAction: 'Apply 15% budget reduction across optional categories',
        suggestedFollowUps: [
          'What are non-negotiable essential costs?',
          'How much should we allocate for unexpected emergencies?',
          'Give me a vendor negotiation script'
        ]
      };
    }

    // 3. Weather / Rainy Day contingency
    if (q.includes('rain') || q.includes('weather') || q.includes('outdoor') || q.includes('tent')) {
      return {
        answer: `For outdoor celebrations, weather contingency ('Plan B') must be locked 14 days in advance:\n` +
          `1. **Tent Rental Reservation:** Put a 25% non-refundable deposit on a clear-span marquee tent with side walls.\n` +
          `2. **Flooring & Drainage:** Ensure raised wooden sub-flooring so water run-off doesn't soak guest footwear.\n` +
          `3. **Sound & Electric Shielding:** AV mixers and speaker amplifiers must be elevated and covered under waterproof tarps with GFCI circuit breakers.\n` +
          `4. **Guest Comfort Amenities:** Provide branded umbrellas at arrival and basket of warm pashminas or handheld mist fans depending on temperature.`,
        suggestedAction: 'Allocate 8% from contingency fund for weather shielding',
        suggestedFollowUps: [
          'When is the deadline to call Plan B?',
          'What indoor venue alternatives exist nearby?',
          'Adjust run of show for weather delays'
        ]
      };
    }

    // 4. Speeches / Toasts request
    if (q.includes('speech') || q.includes('toast') || q.includes('words') || q.includes('script')) {
      return {
        answer: `Here is a custom speech framework for ${dossier.request.title}:\n\n` +
          `**Host Welcome:**\n${dossier.theme.speeches.welcomeSpeech}\n\n` +
          `**Celebration Toast:**\n${dossier.theme.speeches.hostToast}\n\n` +
          `**Pro Tip:** Keep speeches between 3 to 4 minutes maximum. Speak slowly, make eye contact across all tables, and end with an energetic prompt for applause!`,
        suggestedAction: 'Copy speech draft to clipboard',
        suggestedFollowUps: [
          'Write a funny maid of honor / best man toast',
          'Draft a vote of thanks for volunteers and vendors',
          'How to schedule speeches in the Day-Of timeline'
        ]
      };
    }

    // 5. Vendor negotiation
    if (q.includes('vendor') || q.includes('photographer') || q.includes('negotiat') || q.includes('contract')) {
      return {
        answer: `When contracting vendors for your ${dossier.request.eventType}, keep these golden negotiation rules in mind:\n` +
          `1. **Never accept the first price sheet:** Inquire if they offer bundled discounts (e.g., photo + video combo, or lighting + DJ package).\n` +
          `2. **Protect your deposit:** Never pay more than 25-30% upfront as a booking retainer. Ensure the final balance is payable only after or on event day.\n` +
          `3. **Clear delivery SLAs:** Ensure photo/video contracts specify maximum delivery turnaround (e.g., 30 days) and raw file access.\n` +
          `4. **Force Majeure & Rescheduling:** Ensure a fair clause permitting one reschedule date without losing 100% of your deposit.`,
        suggestedAction: 'View Vendor Checklist & RFPs',
        suggestedFollowUps: [
          'What questions should I ask my caterer?',
          'Show contract red flags for venue rentals',
          'Generate RFP for DJ and lighting'
        ]
      };
    }

    // Default general advice
    return {
      answer: `I've analyzed your event setup for "${dossier.request.title}" (${dossier.request.eventType.toUpperCase()}) in ${dossier.request.location}. ` +
        `Your budget of ${sym} ${dossier.request.totalBudget.toLocaleString(locale)} is balanced across ${dossier.budget.items.length} key categories with a ${dossier.budget.contingencyPercentage}% safety cushion. ` +
        `We have mapped ${dossier.timeline.totalTasks} milestone tasks with ${dossier.timeline.criticalPathCount} critical path deadlines. How would you like to refine the plan today?`,
      suggestedFollowUps: [
        'How can we optimize our budget?',
        'What should we do if guest count changes?',
        'Show me the Day-Of Run of Show',
        'Review vendor contract tips'
      ]
    };
  }
}
