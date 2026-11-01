---
name: celebratech-ai-builder
description: Generates or reconstructs the entire CelebraTech AI GenAI Celebration & Event Planner platform in a single prompt across any AI assistant.
---

# CelebraTech AI One-Shot Generator Skill

Use this skill whenever a user or agent asks to generate, rebuild, scaffold, or reproduce the **CelebraTech AI (PromptWars Challenge 5: Celebration & Event Planner)** platform from scratch in one single prompt.

---

## ⚡ The One-Shot Master Prompt

Copy and paste the exact prompt block below into any modern AI model (Claude Code, ChatGPT 4o/o1, Gemini 1.5/2.0, Cursor Composer, Antigravity, or DeepSeek):

```text
Act as a Principal Full-Stack Software Architect and GenAI Specialist. Your objective is to scaffold, code, test, and deliver the complete, production-grade codebase for "CelebraTech AI" (GenAI Celebration & Event Planner for PromptWars Challenge 5) in a single response with zero omitted files.

### 1. Developer & Attribution Header (MANDATORY on every single file)
/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 */

### 2. Core Functional Requirements
1. **Event Verticals & Currencies:**
   - Primary Currency: Indian Rupees (INR / ₹) with standard `en-IN` numbering (e.g. ₹ 15,00,000).
   - Three Verticals:
     * Wedding (Weddings & Receptions): Catering (32%), Venue & Rentals (22%), Photo/Film (12%), Decor & Florals (11%), Attire & Styling (7%), Music & AV (6%), Invites & Gifts (2%), Emergency Contingency (8%).
     * Milestone Birthday: Food & Cake (38%), Venue / Lounge (20%), Entertainment & DJ (14%), Decor & Photo Backdrop (12%), Photo/Video (6%), Favors (3%), Contingency (7%).
     * Community / Festival / Gala: Food Stalls & Hospitality (26%), Stage, Sound & AV (22%), Permits & Security (18%), Marketing & Signage (12%), Artists & Speakers (12%), Weather & Safety Contingency (10%).

2. **Safety & Guardrail Engine (`src/safety/guardrails.ts`):**
   - Automatically redact PII: Emails, phone numbers, credit cards, government IDs (SSN / Aadhaar format).
   - Defend against prompt injections (e.g. "ignore previous instructions", "system prompt", script tags).
   - Boundary sanitization for budget (>0, capped at 100M) and guest counts (1 to 50,000).

3. **Enterprise Design Patterns & Computational Efficiency:**
   - `src/engine/memoizer.ts`: Generic high-performance $O(1)$ LRU Cache with sub-millisecond retrieval, hit/miss telemetry, and capacity eviction.
   - `src/builder/event-builder.ts`: Fluent Builder Pattern (`EventRequestBuilder`) with compile/runtime validation contracts.
   - `src/engine/budget-allocator.ts`: Strategy Pattern (`IBudgetAllocationStrategy`, `WeddingAllocationStrategy`, `BirthdayAllocationStrategy`, `CommunityAllocationStrategy`) with $O(1)$ memoization caching.
   - `src/errors/index.ts`: Typed domain error hierarchy (`CelebraTechError`, `ValidationError`, `BudgetOutOfBoundsError`, `GuardrailViolationError`, `PlannerStateError`).

4. **Planning & Intelligence Engines:**
   - `src/engine/budget-allocator.ts`: Algorithmic distribution, cost-per-guest calculations, overspend warnings if catering > 45% or per-guest budget is tight, and actionable cost-saving tips.
   - `src/engine/timeline-generator.ts`: 4 backwards countdown phases from target date (-180d to -1d) with critical-path flags, and an hour-by-hour Day-Of "Run of Show" schedule.
   - `src/engine/vendor-manager.ts`: Category checklists with lead times, interview questions, automated RFP templates, and contract red-flag warnings.
   - `src/engine/theme-ideator.ts`: 4-swatch hex color palettes, aesthetic decor concepts, formal/casual/social invite copy, host welcome speech, celebration toast, and vote of thanks.
   - `src/engine/event-copilot.ts`: Context-aware conversational copilot that dynamically rebalances budget when guest counts change, gives weather contingency tips, drafts speeches, and uses $O(1)$ query memoization.
   - `src/ai/provider.ts` & `src/index.ts`: Pluggable provider architecture with zero-latency deterministic heuristic engine and optional live LLM API support.

5. **Self-Contained Browser Application (`index.html`, `src/ui/style.css`, `src/ui/app.js`):**
   - Modern dark-mode responsive dashboard (Inter & Outfit typography, glassmorphism, glowing accents).
   - 1-Click Demo Presets in INR:
     * 💍 Grand Royal Wedding (Jaipur - ₹15 Lakhs, 250 guests)
     * 🎂 30th Milestone Birthday (Mumbai - ₹2.5 Lakhs, 60 guests)
     * 🎪 Cultural Food Fest (Bengaluru - ₹8 Lakhs, 1200 guests)
   - Dynamic button states on "✨ Generate Full AI Plan" (pulses "⚡ Engineering GenAI Plan...", displays floating toast notification "🎉 ✨ Event Plan generated!", flashes the active tab, and reverts to "✓ Plan Generated Successfully!").
   - Safe date fallback (never throws RangeError on empty/invalid dates).
   - One-click "💾 Export JSON" and "🖨️ Printable Dossier".

6. **Automated Test Suite with Vitest (`tests/`):**
   - Write 41 unit tests across 8 test suites (`budget-allocator.test.ts`, `guardrails.test.ts`, `timeline-generator.test.ts`, `vendor-manager.test.ts`, `theme-ideator.test.ts`, `event-copilot.test.ts`, `builder.test.ts`, `performance.test.ts`).
   - Deliver 100% statement, function, and line coverage with >91% branch coverage.
   - Verify all tests pass deterministically offline in < 200 ms.

7. **Repository & Submission Discipline:**
   - Single branch (`main`).
   - Total repository footprint strictly under 10 MB (exclude node_modules via `.gitignore`).
   - Comprehensive `README.md` and complete MIT `LICENSE`.

Generate the complete file tree and code for all files now.
```

