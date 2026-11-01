/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Safety & Guardrails Engine for CelebraTech AI
 * Enforces PII redaction, prompt injection defense, and input boundary validation.
 */

import { EventRequest, SafetyAudit } from '../types/index.js';

export interface GuardrailResult {
  isValid: boolean;
  sanitizedRequest: EventRequest;
  audit: SafetyAudit;
}

export class SafetyGuardrails {
  // Regex patterns for sensitive PII
  private static readonly EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  private static readonly PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  private static readonly CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  private static readonly SSN_OR_GOV_ID = /\b\d{3}-\d{2}-\d{4}\b|\b\d{4}\s\d{4}\s\d{4}\b/g;
  private static readonly PAN_CARD_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;

  // Prompt injection signatures & malicious payloads
  private static readonly INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|directives)/i,
    /disregard\s+(all\s+)?(previous|prior)\s+(instructions|prompts|directives)/i,
    /system\s+prompt/i,
    /reveal\s+(system|hidden|initial)\s+(prompt|instructions)/i,
    /you\s+are\s+now\s+in\s+developer\s+mode/i,
    /jailbreak/i,
    /dan\s+mode/i,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /<iframe\b/i,
    /<img\s+[^>]*onerror/i,
    /onload\s*=/i,
    /drop\s+table/i,
    /union\s+select/i,
    /exec\s*\(/i,
    /__proto__/i
  ];

  /**
   * Encodes HTML entities to protect against DOM Cross-Site Scripting (XSS).
   * @param text Raw unencoded text
   * @returns Sanitized HTML-safe string
   */
  public static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Redacts sensitive personally identifiable information (PII)
   */
  public static redactPII(text: string): { redactedText: string; foundItems: string[] } {
    const foundItems: string[] = [];

    let cleaned = text.replace(this.CREDIT_CARD_REGEX, () => {
      foundItems.push(`Credit Card: [REDACTED]`);
      return '[PAYMENT_INFO_REDACTED]';
    });

    cleaned = cleaned.replace(this.SSN_OR_GOV_ID, () => {
      foundItems.push(`Gov ID/Aadhaar: [REDACTED]`);
      return '[GOV_ID_REDACTED]';
    });

    cleaned = cleaned.replace(this.PAN_CARD_REGEX, (match) => {
      foundItems.push(`PAN Card: ${match}`);
      return '[GOV_ID_REDACTED]';
    });

    cleaned = cleaned.replace(this.EMAIL_REGEX, (match) => {
      foundItems.push(`Email: ${match}`);
      return '[EMAIL_REDACTED]';
    });

    cleaned = cleaned.replace(this.PHONE_REGEX, (match) => {
      foundItems.push(`Phone: ${match}`);
      return '[PHONE_REDACTED]';
    });

    return { redactedText: cleaned, foundItems };
  }

  /**
   * Detects prompt injection attempts
   */
  public static checkPromptInjection(text: string): { hasInjection: boolean; detectedPatterns: string[] } {
    const detectedPatterns: string[] = [];
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(text)) {
        detectedPatterns.push(pattern.source);
      }
    }
    return {
      hasInjection: detectedPatterns.length > 0,
      detectedPatterns
    };
  }

  /**
   * Sanitizes and validates the full EventRequest
   */
  public static sanitizeAndValidate(raw: EventRequest): GuardrailResult {
    const redactedPII: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    // Validate and sanitize title
    let sanitizedTitle = (raw.title || 'Special Celebration').trim().slice(0, 120);
    const titlePii = this.redactPII(sanitizedTitle);
    sanitizedTitle = titlePii.redactedText;
    redactedPII.push(...titlePii.foundItems);

    const titleInjection = this.checkPromptInjection(sanitizedTitle);
    if (titleInjection.hasInjection) {
      warnings.push(`Warning: Potential injection detected in title. Sanitized.`);
      sanitizedTitle = sanitizedTitle.replace(/[<>'"`;]/g, '');
    }

    // Validate budget
    let sanitizedBudget = Number(raw.totalBudget);
    if (isNaN(sanitizedBudget) || sanitizedBudget <= 0) {
      warnings.push('Budget must be a positive number. Defaulted to minimum threshold (1000).');
      sanitizedBudget = 1000;
    } else if (sanitizedBudget > 100_000_000) {
      warnings.push('Budget capped at maximum allowable limit of 100,000,000.');
      sanitizedBudget = 100_000_000;
    }

    // Validate guest count
    let sanitizedGuestCount = Math.floor(Number(raw.guestCount));
    if (isNaN(sanitizedGuestCount) || sanitizedGuestCount < 1) {
      warnings.push('Guest count must be at least 1. Defaulted to 20.');
      sanitizedGuestCount = 20;
    } else if (sanitizedGuestCount > 50_000) {
      warnings.push('Guest count capped at 50,000 for realistic planning.');
      sanitizedGuestCount = 50_000;
    }

    // Validate date
    let sanitizedDate = raw.targetDate;
    if (!sanitizedDate || isNaN(Date.parse(sanitizedDate))) {
      // Default to 90 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 90);
      sanitizedDate = defaultDate.toISOString().split('T')[0];
      warnings.push(`Invalid or missing target date. Defaulted to 90 days ahead: ${sanitizedDate}`);
    }

    // Validate location
    let sanitizedLocation = (raw.location || 'Local City Venue').trim().slice(0, 100);
    const locPii = this.redactPII(sanitizedLocation);
    sanitizedLocation = locPii.redactedText;
    redactedPII.push(...locPii.foundItems);

    // Sanitize custom notes if any
    let sanitizedNotes = raw.customVibeNotes ? raw.customVibeNotes.slice(0, 500) : '';
    if (sanitizedNotes) {
      const notesPii = this.redactPII(sanitizedNotes);
      sanitizedNotes = notesPii.redactedText;
      redactedPII.push(...notesPii.foundItems);
      const notesInjection = this.checkPromptInjection(sanitizedNotes);
      if (notesInjection.hasInjection) {
        warnings.push('Prompt injection patterns removed from custom notes.');
        sanitizedNotes = sanitizedNotes.replace(/[<>'"`;]/g, '');
      }
    }

    const sanitizedRequest: EventRequest = {
      ...raw,
      title: sanitizedTitle,
      totalBudget: sanitizedBudget,
      guestCount: sanitizedGuestCount,
      targetDate: sanitizedDate,
      location: sanitizedLocation,
      customVibeNotes: sanitizedNotes
    };

    return {
      isValid,
      sanitizedRequest,
      audit: {
        sanitizedInputs: true,
        redactedPII,
        warnings
      }
    };
  }
}

