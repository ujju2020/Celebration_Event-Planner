/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Domain-Driven Custom Error Hierarchy for CelebraTech AI
 */

/**
 * Base abstract error class for all CelebraTech domain exceptions.
 */
export abstract class CelebraTechError extends Error {
  public readonly timestamp: string;

  constructor(message: string, public readonly errorCode: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an input parameter fails domain validation constraints.
 */
export class ValidationError extends CelebraTechError {
  constructor(public readonly field: string, message: string) {
    super(`Validation failed on '${field}': ${message}`, 'ERR_VALIDATION');
  }
}

/**
 * Thrown when budget numerical boundaries are exceeded or invalid.
 */
export class BudgetOutOfBoundsError extends ValidationError {
  constructor(field: string, value: number, min: number, max: number) {
    super(field, `Value ${value} is out of allowable range [${min}, ${max}]`);
  }
}

/**
 * Thrown when input contains malicious prompt injection or unauthorized code payloads.
 */
export class GuardrailViolationError extends CelebraTechError {
  constructor(public readonly detectedPatterns: string[], message: string = 'Security guardrail violation detected') {
    super(`${message}: [${detectedPatterns.join(', ')}]`, 'ERR_GUARDRAIL_VIOLATION');
  }
}

/**
 * Thrown when an event planning operation is requested in an invalid lifecycle state.
 */
export class PlannerStateError extends CelebraTechError {
  constructor(message: string) {
    super(message, 'ERR_PLANNER_STATE');
  }
}
