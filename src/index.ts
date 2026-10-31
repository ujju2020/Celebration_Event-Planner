/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * - Developer: Ujjwal Kumar Bhowmick
 * - Email: ujjwalkumarbhowmick30@gmail.com
 * - All rights reserved.
 * 
 * Main Entry Point & Orchestrator for CelebraTech AI
 */

export * from './types/index.js';
export * from './safety/guardrails.js';
export * from './engine/budget-allocator.js';
export * from './engine/timeline-generator.js';
export * from './engine/vendor-manager.js';
export * from './engine/theme-ideator.js';
export * from './engine/event-copilot.js';
export * from './ai/provider.js';

import { EventRequest, PlannerDossier } from './types/index.js';
import { CelebraTechAIProvider } from './ai/provider.js';
import { EventCopilot, CopilotResponse } from './engine/event-copilot.js';

export class CelebraTechPlanner {
  private provider: CelebraTechAIProvider;
  private currentDossier: PlannerDossier | null = null;

  constructor(apiKey?: string) {
    this.provider = new CelebraTechAIProvider({ apiKey });
  }

  /**
   * Plans an entire event end-to-end
   */
  public async planEvent(request: EventRequest): Promise<PlannerDossier> {
    this.currentDossier = await this.provider.generateDossier(request);
    return this.currentDossier;
  }

  /**
   * Queries the interactive Copilot
   */
  public askCopilot(query: string): CopilotResponse {
    if (!this.currentDossier) {
      throw new Error('No active event plan found. Please call planEvent() first.');
    }
    return EventCopilot.processQuery(query, this.currentDossier);
  }

  /**
   * Returns current active dossier
   */
  public getDossier(): PlannerDossier | null {
    return this.currentDossier;
  }
}
