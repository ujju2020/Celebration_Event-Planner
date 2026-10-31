/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Vendor Manager & Intelligent RFP Engine for CelebraTech AI
 * Generates category checklists, interview questionnaires, RFP templates, and contract red flags.
 */

import { EventRequest, EventType, VendorChecklistCategory } from '../types/index.js';

export class VendorManager {
  /**
   * Generates tailored vendor management checklists and RFPs for the event
   */
  public static generateVendorHub(request: EventRequest): VendorChecklistCategory[] {
    const list: VendorChecklistCategory[] = [];
    const eventType = request.eventType;
    const currency = request.currency || 'USD';

    // 1. Venue & Facilities
    list.push({
      id: 'ven-venue',
      name: 'Venue & Banquet Management',
      requiredLeadTimeWeeks: eventType === 'wedding' ? 24 : eventType === 'community' ? 16 : 8,
      status: 'not_started',
      budgetAllocationRef: 'Venue & Rentals',
      standardQuestions: [
        'What is the maximum fire-code capacity for seated banquets vs floating guests?',
        'What are the load-in and teardown hours allowed for outside decorators and AV teams?',
        'Are there in-house restrictions on outside caterers, alcohol corkage, or live decibel limits?',
        'Is there guaranteed power backup / generator on-site in case of grid outages?',
        'What is your written cancellation, rescheduling, and force-majeure refund policy?'
      ],
      rfpTemplate: `RFP: Venue Inquiry for ${request.title}\n` +
        `Date of Event: ${request.targetDate}\n` +
        `Guest Count: ${request.guestCount} attendees\n` +
        `Scope: We require a dedicated venue space in ${request.location} accommodating our guests with catering staging, sound/light clearance, and parking. Please reply with availability, rate sheet, and inclusions.`,
      contractRedFlags: [
        'Missing clause detailing exact penalty fees for exceeding reserved time by 30-60 minutes.',
        'Unclear overtime staffing fees or compulsory in-house vendor surcharges.',
        'No clear written guarantee of air conditioning / climate control maintenance on event day.'
      ]
    });

    // 2. Catering & Beverage
    list.push({
      id: 'ven-catering',
      name: 'Catering, Beverages & Cake',
      requiredLeadTimeWeeks: eventType === 'wedding' ? 18 : 6,
      status: 'not_started',
      budgetAllocationRef: 'Catering & Drinks',
      standardQuestions: [
        'Can you provide a licensed tasting session prior to final menu sign-off?',
        'How do you accommodate specialized dietary needs (Vegan, Gluten-free, Nut-free, Halal/Kosher)?',
        'What is the server-to-guest ratio included in the quote (ideal is 1 server per 10-15 guests)?',
        'Do your quotes include dinnerware, glassware, linens, warming chafers, and waste disposal?',
        'What is the latest cutoff date for submitting final guest headcounts?'
      ],
      rfpTemplate: `RFP: Catering & Hospitality for ${request.title}\n` +
        `Target Date: ${request.targetDate}\n` +
        `Estimated Headcount: ${request.guestCount} persons\n` +
        `Style: Buffet/Plated service with welcome drinks, appetizers, main courses, and dessert. Please share sample menus and per-plate pricing options.`,
      contractRedFlags: [
        'Contract lacking guaranteed surplus food buffer (standard is 5-10% extra food prepared).',
        'Vague language regarding left-over food packaging and disposal responsibilities.',
        'Unexpected mandatory service gratuities (>20%) not itemized in the initial quote.'
      ]
    });

    // 3. Photography & Videography
    list.push({
      id: 'ven-photo',
      name: 'Photography & Cinematography',
      requiredLeadTimeWeeks: eventType === 'wedding' ? 20 : 6,
      status: 'not_started',
      budgetAllocationRef: 'Photo & Video',
      standardQuestions: [
        'Who will be the specific lead photographer shooting on the day (not just the agency name)?',
        'What is the contingency protocol if the lead shooter experiences medical emergencies?',
        'What are the exact delivery timelines for teasers (e.g. 48 hours) and full edited albums (e.g. 4-6 weeks)?',
        'Do you provide raw unedited footage/files, and who retains full non-commercial copyright?',
        'What backup camera bodies, lenses, and dual-card recording redundancy do you carry?'
      ],
      rfpTemplate: `RFP: Media & Visual Coverage for ${request.title}\n` +
        `Date: ${request.targetDate}\n` +
        `Location: ${request.location}\n` +
        `Requirements: Seeking professional candid and cinematic video coverage for ${request.guestCount} guests. Please provide portfolio links, shooter count, and package quotes.`,
      contractRedFlags: [
        'Absence of a guaranteed named backup shooter clause.',
        'Indefinite delivery turnaround times without late delivery penalty remedies.',
        'Restrictive usage rights preventing client from sharing photos on social media without watermarks.'
      ]
    });

    // 4. Decor, Floral & Production
    list.push({
      id: 'ven-decor',
      name: 'Thematic Decor, Floral & Lighting',
      requiredLeadTimeWeeks: 12,
      status: 'not_started',
      budgetAllocationRef: 'Decor & Theme',
      standardQuestions: [
        'Will you provide 3D renders or detailed moodboards before fabrication begins?',
        'What fresh flower species will be used, and what are the backup alternatives if seasonal supply drops?',
        'Are setup, transport, and complete midnight teardown labor included in the quote?',
        'Are high-grade flame-retardant materials utilized for drapery and stage setups?'
      ],
      rfpTemplate: `RFP: Decor & Aesthetic Production for ${request.title}\n` +
        `Date: ${request.targetDate}\n` +
        `Vibe: ${request.vibe}\n` +
        `Scope: Entrance arches, stage/backdrop, guest table centerpieces, and ambient mood lighting. Please provide visual conceptual lookbook and quotation.`,
      contractRedFlags: [
        'No replacement clause for wilting or non-available premium flowers.',
        'Extra hidden fees for late-night post-event teardown past 11 PM.'
      ]
    });

    // 5. Entertainment, DJ & Sound
    list.push({
      id: 'ven-entertainment',
      name: 'Music, Sound (AV) & Entertainment',
      requiredLeadTimeWeeks: 10,
      status: 'not_started',
      budgetAllocationRef: 'Music & AV',
      standardQuestions: [
        'Do you provide complete PA sound systems, wireless handheld mics, and monitor speakers?',
        'Can we provide a "Must Play" and strict "Do Not Play" playlist?',
        'Does the DJ/artist act as an interactive emcee to guide announcements and transitions?',
        'What is your equipment backup plan if an amplifier or mixing console fails during the party?'
      ],
      rfpTemplate: `RFP: Entertainment & Audio Production for ${request.title}\n` +
        `Date: ${request.targetDate}\n` +
        `Audience Size: ${request.guestCount}\n` +
        `Scope: DJ, sound engineering, microphones for toasts, and dancefloor ambient lighting. Please submit performance reel and equipment rider.`,
      contractRedFlags: [
        'Vendor not carrying public liability insurance for electrical/sound installations.',
        'Strict volume clauses conflicting with venue local sound ordinances.'
      ]
    });

    return list;
  }
}

