/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * - Developer: Ujjwal Kumar Bhowmick
 * - Email: ujjwalkumarbhowmick30@gmail.com
 * - All rights reserved.
 * 
 * Domain Type Definitions for CelebraTech AI (GenAI Celebration & Event Planner)
 */

export type EventType = 'wedding' | 'birthday' | 'community';

export type VibeType = 
  | 'royal_traditional'
  | 'modern_minimalist'
  | 'bohemian_chic'
  | 'festive_carnival'
  | 'retro_vintage'
  | 'corporate_gala'
  | 'custom';

export interface EventRequest {
  id?: string;
  eventType: EventType;
  title: string;
  totalBudget: number;
  currency: string;
  guestCount: number;
  targetDate: string; // ISO date YYYY-MM-DD
  location: string;
  vibe: VibeType;
  customVibeNotes?: string;
  dietaryRestrictions?: string[];
  specialRequirements?: string[];
}

export type PriorityLevel = 'essential' | 'recommended' | 'optional';

export interface BudgetItem {
  category: string;
  name: string;
  allocatedAmount: number;
  percentage: number;
  priority: PriorityLevel;
  notes: string;
  costPerGuest: number;
}

export interface BudgetBreakdown {
  totalBudget: number;
  currency: string;
  guestCount: number;
  contingencyAmount: number;
  contingencyPercentage: number;
  totalAllocated: number;
  costPerGuestTotal: number;
  items: BudgetItem[];
  overspendWarnings: string[];
  savingsRecommendations: string[];
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  phaseId: string;
  dueDateOffsetDays: number; // Negative means days before event, e.g. -180 = 6 months before
  targetDueDate: string;
  category: string;
  estimatedDurationHours: number;
  isCriticalPath: boolean;
  status: TaskStatus;
}

export interface TimelinePhase {
  id: string;
  name: string;
  timeHorizon: string; // e.g. "6 to 4 Months Prior"
  tasks: TimelineTask[];
}

export interface DayOfScheduleSlot {
  time: string;
  activity: string;
  leadPerson: string;
  location: string;
  notes: string;
}

export interface MilestoneTimeline {
  eventDate: string;
  phases: TimelinePhase[];
  totalTasks: number;
  criticalPathCount: number;
  dayOfRunOfShow: DayOfScheduleSlot[];
}

export interface VendorChecklistCategory {
  id: string;
  name: string;
  requiredLeadTimeWeeks: number;
  status: 'not_started' | 'shortlisting' | 'contacted' | 'booked';
  standardQuestions: string[];
  rfpTemplate: string;
  contractRedFlags: string[];
  budgetAllocationRef: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ThematicConcept {
  themeName: string;
  tagline: string;
  colorPalette: ColorSwatch[];
  decorIdeas: string[];
  attireCode: string;
  invitationCopy: {
    formal: string;
    casual: string;
    socialInvite: string;
  };
  speeches: {
    welcomeSpeech: string;
    hostToast: string;
    voteOfThanks: string;
  };
  curatedPlaylistVibe: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  suggestedAction?: string;
  adjustmentSummary?: string;
}

export interface SafetyAudit {
  sanitizedInputs: boolean;
  redactedPII: string[];
  warnings: string[];
}

export interface PlannerDossier {
  metadata: {
    id: string;
    createdAt: string;
    version: string;
    developer: string;
  };
  request: EventRequest;
  budget: BudgetBreakdown;
  timeline: MilestoneTimeline;
  vendors: VendorChecklistCategory[];
  theme: ThematicConcept;
  safetyAudit: SafetyAudit;
}
