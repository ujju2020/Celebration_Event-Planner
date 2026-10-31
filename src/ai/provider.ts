/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Pluggable AI Provider Interface for CelebraTech AI
 * Supports zero-latency deterministic heuristic generation and live LLM integration.
 */

import { EventRequest, PlannerDossier } from '../types/index.js';
import { SafetyGuardrails } from '../safety/guardrails.js';
import { BudgetAllocator } from '../engine/budget-allocator.js';
import { TimelineGenerator } from '../engine/timeline-generator.js';
import { VendorManager } from '../engine/vendor-manager.js';
import { ThemeIdeator } from '../engine/theme-ideator.js';

export interface AIProviderConfig {
  apiKey?: string;
  modelName?: string;
  enableLiveLLM?: boolean;
}

export class CelebraTechAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig = {}) {
    this.config = {
      enableLiveLLM: false,
      modelName: 'gemini-1.5-flash',
      ...config
    };
  }

  /**
   * Generates a complete comprehensive Planner Dossier from an EventRequest
   */
  public async generateDossier(rawRequest: EventRequest): Promise<PlannerDossier> {
    // 1. Guardrail and sanitize inputs
    const guardrailResult = SafetyGuardrails.sanitizeAndValidate(rawRequest);
    const request = guardrailResult.sanitizedRequest;

    // 2. Budget calculation
    const budget = BudgetAllocator.calculateBudget(request);

    // 3. Timeline generation
    const timeline = TimelineGenerator.generateTimeline(request);

    // 4. Vendor management hub
    const vendors = VendorManager.generateVendorHub(request);

    // 5. Thematic concept & speeches
    const theme = ThemeIdeator.generateConcept(request);

    const dossier: PlannerDossier = {
      metadata: {
        id: `dossier-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        developer: 'Ujjwal Kumar Bhowmick'
      },
      request,
      budget,
      timeline,
      vendors,
      theme,
      safetyAudit: guardrailResult.audit
    };

    return dossier;
  }
}

