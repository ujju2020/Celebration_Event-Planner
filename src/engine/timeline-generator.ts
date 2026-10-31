/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Milestone Timeline & Run-of-Show Engine for CelebraTech AI
 * Generates countdown milestones, critical path tracking, and Day-Of hourly execution schedules.
 */

import { EventRequest, EventType, MilestoneTimeline, TimelinePhase, TimelineTask, DayOfScheduleSlot } from '../types/index.js';

interface RawTaskTemplate {
  id: string;
  title: string;
  description: string;
  offsetDays: number;
  category: string;
  durationHours: number;
  isCriticalPath: boolean;
}

export class TimelineGenerator {
  /**
   * Generates a complete milestone timeline with Day-Of Run of Show
   */
  public static generateTimeline(request: EventRequest): MilestoneTimeline {
    const targetDateObj = new Date(request.targetDate);
    const eventDate = request.targetDate;

    // Build phases and assign calculated target due dates
    const phases = this.buildPhases(request.eventType, targetDateObj);
    
    let totalTasks = 0;
    let criticalPathCount = 0;

    for (const phase of phases) {
      totalTasks += phase.tasks.length;
      criticalPathCount += phase.tasks.filter(t => t.isCriticalPath).length;
    }

    const dayOfRunOfShow = this.buildDayOfRunOfShow(request.eventType);

    return {
      eventDate,
      phases,
      totalTasks,
      criticalPathCount,
      dayOfRunOfShow
    };
  }

  private static calculateDueDate(eventDate: Date, offsetDays: number): string {
    const d = new Date(eventDate.getTime());
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  private static buildPhases(eventType: EventType, eventDate: Date): TimelinePhase[] {
    const rawTemplates = this.getTaskTemplates(eventType);

    const phaseMap: Record<string, { name: string; horizon: string; tasks: TimelineTask[] }> = {
      p1: { name: 'Phase 1: Conceptualization & Venue Lock', horizon: '6 to 4 Months Prior', tasks: [] },
      p2: { name: 'Phase 2: Vendor Contracting & Invitations', horizon: '4 to 2 Months Prior', tasks: [] },
      p3: { name: 'Phase 3: Final Details & RSVP Cutoffs', horizon: '2 Months to 2 Weeks Prior', tasks: [] },
      p4: { name: 'Phase 4: Final Week Countdown & Rehearsals', horizon: '14 Days to 1 Day Prior', tasks: [] }
    };

    for (const t of rawTemplates) {
      let phaseKey = 'p1';
      if (t.offsetDays > -45 && t.offsetDays <= -14) {
        phaseKey = 'p3';
      } else if (t.offsetDays > -14) {
        phaseKey = 'p4';
      } else if (t.offsetDays > -120 && t.offsetDays <= -45) {
        phaseKey = 'p2';
      } else {
        phaseKey = 'p1';
      }

      const calculatedDueDate = this.calculateDueDate(eventDate, t.offsetDays);

      phaseMap[phaseKey].tasks.push({
        id: t.id,
        title: t.title,
        description: t.description,
        phaseId: phaseKey,
        dueDateOffsetDays: t.offsetDays,
        targetDueDate: calculatedDueDate,
        category: t.category,
        estimatedDurationHours: t.durationHours,
        isCriticalPath: t.isCriticalPath,
        status: 'pending'
      });
    }

    return Object.entries(phaseMap).map(([id, p]) => ({
      id,
      name: p.name,
      timeHorizon: p.horizon,
      tasks: p.tasks
    }));
  }

  private static getTaskTemplates(eventType: EventType): RawTaskTemplate[] {
    if (eventType === 'wedding') {
      return [
        { id: 'wed-01', title: 'Lock Primary Venue & Ceremony Date', description: 'Confirm deposit and sign contract with venue for ceremony & reception', offsetDays: -180, category: 'Venue', durationHours: 6, isCriticalPath: true },
        { id: 'wed-02', title: 'Hire Lead Photographer & Videographer', description: 'Review portfolios, lock package hours, and sign contracts', offsetDays: -150, category: 'Media', durationHours: 4, isCriticalPath: true },
        { id: 'wed-03', title: 'Select Catering Menu & Tasting Session', description: 'Finalize dietary accommodations, appetizers, main course, and cake', offsetDays: -120, category: 'Catering', durationHours: 5, isCriticalPath: true },
        { id: 'wed-04', title: 'Design & Dispatch Formal Invitations', description: 'Send digital/printed invites with online RSVP link and travel details', offsetDays: -90, category: 'Stationery', durationHours: 8, isCriticalPath: false },
        { id: 'wed-05', title: 'Wardrobe & Attire Final Fittings', description: 'Ensure bride, groom, and bridal party alterations are complete', offsetDays: -45, category: 'Attire', durationHours: 4, isCriticalPath: false },
        { id: 'wed-06', title: 'Lock Master Seating Chart & Final Headcount', description: 'Transmit final dietary count to caterer and create printed seating board', offsetDays: -14, category: 'Hospitality', durationHours: 6, isCriticalPath: true },
        { id: 'wed-07', title: 'Ceremony Rehearsal & Vendor Run-of-Show Sync', description: 'Conduct rehearsal walk-through with wedding party and coordinator', offsetDays: -1, category: 'Coordination', durationHours: 3, isCriticalPath: true }
      ];
    } else if (eventType === 'birthday') {
      return [
        { id: 'bday-01', title: 'Select Party Theme & Reserve Venue', description: 'Confirm private dining room or outdoor patio with deposit', offsetDays: -45, category: 'Venue', durationHours: 4, isCriticalPath: true },
        { id: 'bday-02', title: 'Book Entertainment, DJ & Emcee', description: 'Finalize music genre preferences, dance tracks, and activity schedule', offsetDays: -30, category: 'Entertainment', durationHours: 3, isCriticalPath: false },
        { id: 'bday-03', title: 'Custom Cake & Gourmet Menu Ordering', description: 'Select signature tiered cake design, flavors, and snack stations', offsetDays: -21, category: 'Food', durationHours: 3, isCriticalPath: true },
        { id: 'bday-04', title: 'Send Personalized Invitations & Collect RSVPs', description: 'Send calendar invite with dress code and gift preference notes', offsetDays: -18, category: 'Invites', durationHours: 2, isCriticalPath: true },
        { id: 'bday-05', title: 'Order Theme Decor, Balloon Arches & Props', description: 'Procure customized photo booth backdrops, lighting, and favors', offsetDays: -10, category: 'Decor', durationHours: 4, isCriticalPath: false },
        { id: 'bday-06', title: 'Compile Birthday Highlight Slide & Toast', description: 'Collect childhood photos, curate video montage, and write host toast', offsetDays: -3, category: 'Program', durationHours: 4, isCriticalPath: false },
        { id: 'bday-07', title: 'Pre-event Setup & Cake Delivery Confirmation', description: 'Inspect venue layout, test sound system, and confirm baker arrival', offsetDays: -1, category: 'Logistics', durationHours: 2, isCriticalPath: true }
      ];
    } else {
      // Community
      return [
        { id: 'com-01', title: 'Submit Municipal Permits & Park/Road Clearances', description: 'Liaise with local council for sound permits, parking, and hygiene certificates', offsetDays: -90, category: 'Legal', durationHours: 12, isCriticalPath: true },
        { id: 'com-02', title: 'Contract Stage, Sound, Lighting & Generators', description: 'Select audio-visual contractor with full line-array setup and backup power', offsetDays: -60, category: 'Technical', durationHours: 8, isCriticalPath: true },
        { id: 'com-03', title: 'Confirm Performers, Speakers & Cultural Groups', description: 'Sign speaker agreements and collect rider/stage technical requirements', offsetDays: -45, category: 'Program', durationHours: 10, isCriticalPath: false },
        { id: 'com-04', title: 'Launch Public Marketing & Volunteer Enrolment', description: 'Deploy social posters, press release, and mobilize volunteer committees', offsetDays: -30, category: 'Marketing', durationHours: 14, isCriticalPath: false },
        { id: 'com-05', title: 'Finalize Security, Medical EMT & Waste Management', description: 'Contract first aid tent, certified security guards, and trash recycling bins', offsetDays: -15, category: 'Safety', durationHours: 5, isCriticalPath: true },
        { id: 'com-06', title: 'Site Layout Marking & Stall Allocation', description: 'Mark vendor booth spots, emergency exits, and handicap accessibility paths', offsetDays: -2, category: 'Logistics', durationHours: 6, isCriticalPath: true },
        { id: 'com-07', title: 'Technical Sound Check & Volunteer Briefing', description: 'Conduct microphone checks, safety protocol briefing, and badge handovers', offsetDays: -1, category: 'Coordination', durationHours: 4, isCriticalPath: true }
      ];
    }
  }

  private static buildDayOfRunOfShow(eventType: EventType): DayOfScheduleSlot[] {
    if (eventType === 'wedding') {
      return [
        { time: '08:00 AM', activity: 'Hair, Makeup & Styling Begins', leadPerson: 'Lead Stylist & Bridal Party', location: 'Bridal Suite', notes: 'Ensure breakfast and steam outfits' },
        { time: '11:00 AM', activity: 'Florist & Decorator Venue Access', leadPerson: 'Decor Lead & Event Coordinator', location: 'Ceremony Hall', notes: 'Stage mandap/altar and floral setups' },
        { time: '01:30 PM', activity: 'Photographer Arrives for First Look & Family Portraits', leadPerson: 'Lead Photographer', location: 'Garden / Courtyard', notes: 'Capture candid family groups before ceremony' },
        { time: '03:30 PM', activity: 'Guest Arrival, Welcome Drinks & Music Prelude', leadPerson: 'Hospitality Team & Quartet/DJ', location: 'Foyer', notes: 'Distribute program fans and programs' },
        { time: '04:00 PM', activity: 'Main Ceremony Commences', leadPerson: 'Officiant / Priest', location: 'Ceremony Hall', notes: 'Full audio recording active' },
        { time: '05:30 PM', activity: 'Cocktail Hour & Hors d’oeuvres', leadPerson: 'Catering Lead', location: 'Veranda / Terrace', notes: 'Acoustic background music' },
        { time: '07:00 PM', activity: 'Grand Entrance & Welcome Speeches', leadPerson: 'Emcee & Hosts', location: 'Grand Ballroom', notes: 'Followed by Champagne Toast' },
        { time: '07:45 PM', activity: 'Dinner Banquet Served', leadPerson: 'Head Chef', location: 'Grand Ballroom', notes: 'VIP tables served first' },
        { time: '09:00 PM', activity: 'First Dance & Dance Floor Opens', leadPerson: 'DJ / Band', location: 'Center Dance Floor', notes: 'Party lights and dance music' },
        { time: '11:30 PM', activity: 'Grand Farewell / Sparkler Send-Off', leadPerson: 'Coordinator', location: 'Main Exit Portico', notes: 'Safety precautions for sparklers' }
      ];
    } else if (eventType === 'birthday') {
      return [
        { time: '03:00 PM', activity: 'Venue Access, Balloon Arches & Banner Installation', leadPerson: 'Host & Decorator', location: 'Party Lounge', notes: 'Setup photo booth and props' },
        { time: '04:30 PM', activity: 'DJ Soundcheck & Cake Delivery Inspection', leadPerson: 'Sound Tech & Host', location: 'DJ Booth & Dessert Table', notes: 'Keep cake in cool temperature' },
        { time: '05:30 PM', activity: 'Guest Arrival, Welcome Mocktails & Polaroid Station', leadPerson: 'Host & Greeting Crew', location: 'Entrance', notes: 'Guests sign memory book' },
        { time: '06:30 PM', activity: 'Icebreaker Games & Trivia Challenge', leadPerson: 'Emcee', location: 'Main Floor', notes: 'Prize giveaways for winners' },
        { time: '07:30 PM', activity: 'Cake Cutting Ceremony, Birthday Song & Toast', leadPerson: 'Guest of Honor & Family', location: 'Center Stage', notes: 'Capture wide video of confetti & song' },
        { time: '08:00 PM', activity: 'Buffet Dinner & Dessert Bar Open', leadPerson: 'Catering Team', location: 'Dining Area', notes: 'Soft upbeat background playlist' },
        { time: '09:00 PM', activity: 'Dance Floor Frenzy & High Energy DJ Set', leadPerson: 'DJ', location: 'Dance Floor', notes: 'Crowd favorites and special requests' },
        { time: '11:00 PM', activity: 'Party Wrap-up & Return Favors Distribution', leadPerson: 'Host', location: 'Exit Foyer', notes: 'Distribute personalized favor bags' }
      ];
    } else {
      // Community
      return [
        { time: '06:00 AM', activity: 'Site Logistics Open, Generator & Stage Setup', leadPerson: 'Production Manager', location: 'Main Field', notes: 'Verify safety clearances & electrical' },
        { time: '08:00 AM', activity: 'Food Stalls & Artisan Vendors Check-in', leadPerson: 'Vendor Coordinator', location: 'Market Alley', notes: 'Distribute power cords & waste bins' },
        { time: '09:30 AM', activity: 'Emergency Services / EMT & Security Stationed', leadPerson: 'Chief Security Officer', location: 'First Aid Tent', notes: 'Radio communications check' },
        { time: '10:00 AM', activity: 'Gates Open to Public & Welcome Address', leadPerson: 'Festival Director', location: 'Main Stage', notes: 'Ribbon cutting & program announcement' },
        { time: '11:30 AM', activity: 'Cultural Dance Performances & Youth Talent Showcase', leadPerson: 'Stage Manager', location: 'Main Stage', notes: 'Continuous MC announcements' },
        { time: '02:00 PM', activity: 'Community Interactive Workshops & Competitions', leadPerson: 'Activity Leads', location: 'Workshop Pavilions', notes: 'Art contest, cooking demo, sports' },
        { time: '05:00 PM', activity: 'Headline Musical Concert & Keynote Address', leadPerson: 'Lead Artists', location: 'Main Stage', notes: 'Lighting effects active' },
        { time: '08:00 PM', activity: 'Closing Ceremony & Volunteer Recognition Awards', leadPerson: 'Organizing Committee', location: 'Main Stage', notes: 'Trophy presentations & sponsor thanks' },
        { time: '09:00 PM', activity: 'Event Concludes, Crowd Dispersal & Site Clean-up', leadPerson: 'Sanitation Team', location: 'Entire Venue', notes: 'Waste collection and gear pack-down' }
      ];
    }
  }
}

