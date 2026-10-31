# CelebraTech AI: GenAI Celebration & Event Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Vitest-17%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-99.37%25-success.svg)](https://vitest.dev/)
[![Repo Size](https://img.shields.io/badge/Repo%20Size-%3C%201%20MB-blue.svg)](https://github.com/ujju2020/Celebration_Event-Planner)

> **[Challenge 5] Celebration & Event Planner**  
> Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.

* **Repository:** [https://github.com/ujju2020/Celebration_Event-Planner.git](https://github.com/ujju2020/Celebration_Event-Planner.git)
* **Developer:** Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
* **Copyright:** (c) 2026 Ujjwal Kumar Bhowmick. All rights reserved.

---

## 📑 Table of Contents
1. [Submission Highlights & Quick Links](#1-submission-highlights--quick-links)
2. [⚡ One-Shot AI Master Prompt (Prompt-to-App Blueprint)](#2--one-shot-ai-master-prompt-prompt-to-app-blueprint)
3. [Chosen Vertical & Persona](#3-chosen-vertical--persona)
4. [Approach & Core Logic](#4-approach--core-logic)
5. [System Architecture](#5-system-architecture)
6. [Feature Walkthrough](#6-feature-walkthrough)
7. [Security, Guardrails & Accessibility](#7-security-guardrails--accessibility)
8. [Testing & Verification (99.38% Coverage)](#8-testing--verification-9938-coverage)
9. [Assumptions Made](#9-assumptions-made)
10. [Getting Started & Local Setup](#10-getting-started--local-setup)

---

## 1. Submission Highlights & Quick Links

This repository addresses both challenge submission tracks:

1. **Challenge 5 – Instagram Reels Mini-Challenge Track:**
   * Dedicated 60-second vertical video script, scene-by-scene storyboard, and copy-paste caption/hashtags: [InstagramReelGuide.md](file:///c:/Users/Administration/Desktop/VibeCoding/PromptWars/Celebration_Event-Planner/InstagramReelGuide.md).

2. **Main Problem Statement Submission Track:**
   * Full comprehensive 2-3 minute project video walkthrough script & recording guide: [VideoSubmissionGuide.md](file:///c:/Users/Administration/Desktop/VibeCoding/PromptWars/Celebration_Event-Planner/VideoSubmissionGuide.md).
   * Detailed architecture, implementation plan, and design decisions: [ImplementationPlan.md](file:///c:/Users/Administration/Desktop/VibeCoding/PromptWars/Celebration_Event-Planner/ImplementationPlan.md).
   * Standalone Reusable Agent Skill: [`skills/celebratech-ai-builder/SKILL.md`](file:///c:/Users/Administration/Desktop/VibeCoding/PromptWars/Celebration_Event-Planner/skills/celebratech-ai-builder/SKILL.md).
   * Strict adherence to competition rules:
     * **Repository Size:** ~230 KB (strictly < 10 MB limit).
     * **Single Branch:** 100% developed on `main`.
     * **Public Repository:** Fully accessible open-source code on GitHub.

---

## 2. ⚡ One-Shot AI Master Prompt (Prompt-to-App Blueprint)

> **Reproducibility Guarantee:** Anyone holding this `README.md` can copy-paste the master prompt below into **ANY modern AI assistant** (ChatGPT 4o/o1, Claude 3.5 Sonnet / Claude Code, Cursor Composer, Google Gemini 1.5/2.0, DeepSeek V3/R1, or Antigravity) to automatically generate and code the entire **CelebraTech AI** platform in **one single shot / single prompt**!

```text
Act as a Principal Full-Stack Software Architect and GenAI Event Technology Specialist. Your objective is to build and deliver the complete, production-grade, zero-dependency codebase for "CelebraTech AI" (GenAI Celebration & Event Planner for PromptWars Challenge 5) in a single response with zero omitted files.

### 1. Developer & Attribution Header (MANDATORY on every single file)
/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 */

### 2. Core Functional Requirements
1. **Event Verticals & Currencies:**
   - Primary Currency: Indian Rupees (INR / ₹) with standard en-IN numbering (e.g. ₹ 15,00,000).
   - Three Event Verticals:
     * Wedding: Catering (32%), Venue & Rentals (22%), Photo/Film (12%), Decor & Florals (11%), Attire & Styling (7%), Music & AV (6%), Invites & Gifts (2%), Emergency Contingency (8%).
     * Milestone Birthday: Food & Cake (38%), Venue / Lounge (20%), Entertainment & DJ (14%), Decor & Photo Backdrop (12%), Photo/Video (6%), Favors (3%), Contingency (7%).
     * Community / Festival / Gala: Food Stalls & Hospitality (26%), Stage, Sound & AV (22%), Permits & Security (18%), Marketing & Signage (12%), Artists & Speakers (12%), Weather & Safety Contingency (10%).

2. **Safety & Guardrail Engine (src/safety/guardrails.ts):**
   - Automatically redact PII: Emails, phone numbers, credit cards, government IDs (SSN / Aadhaar format).
   - Defend against prompt injections (e.g. "ignore previous instructions", "system prompt", script tags).
   - Boundary sanitization for budget (>0, capped at 100M) and guest counts (1 to 50,000).

3. **Planning & Intelligence Engines:**
   - src/engine/budget-allocator.ts: Algorithmic distribution, cost-per-guest calculations, overspend warnings if catering > 45% or per-guest budget is tight, and actionable cost-saving tips.
   - src/engine/timeline-generator.ts: 4 backwards countdown phases from target date (-180d to -1d) with critical-path flags, and an hour-by-hour Day-Of "Run of Show" schedule.
   - src/engine/vendor-manager.ts: Category checklists with lead times, interview questions, automated RFP templates, and contract red-flag warnings.
   - src/engine/theme-ideator.ts: 4-swatch hex color palettes, aesthetic decor concepts, formal/casual/social invite copy, host welcome speech, celebration toast, and vote of thanks.
   - src/engine/event-copilot.ts: Context-aware conversational copilot that dynamically rebalances budget when guest counts change, gives weather contingency tips, and drafts speeches.
   - src/ai/provider.ts & src/index.ts: Pluggable provider architecture with zero-latency deterministic heuristic engine and optional live LLM API support.

4. **Self-Contained Browser Application (index.html, src/ui/style.css, src/ui/app.js):**
   - Modern dark-mode responsive dashboard (Inter & Outfit typography, glassmorphism, glowing accents).
   - 1-Click Demo Presets in INR:
     * 💍 Grand Royal Wedding (Jaipur - ₹15 Lakhs, 250 guests)
     * 🎂 30th Milestone Birthday (Mumbai - ₹2.5 Lakhs, 60 guests)
     * 🎪 Cultural Food Fest (Bengaluru - ₹8 Lakhs, 1200 guests)
   - Dynamic button states on "✨ Generate Full AI Plan" (pulses "⚡ Engineering GenAI Plan...", displays floating toast notification "🎉 ✨ Event Plan generated!", flashes the active tab, and reverts to "✓ Plan Generated Successfully!").
   - Safe date fallback (never throws RangeError on empty/invalid dates).
   - One-click "💾 Export JSON" and "🖨️ Printable Dossier".

5. **Automated Test Suite with Vitest (tests/):**
   - Write 18 unit tests across 6 files (budget-allocator.test.ts, guardrails.test.ts, timeline-generator.test.ts, vendor-manager.test.ts, theme-ideator.test.ts, event-copilot.test.ts).
   - Deliver >90% statement, branch, function, and line coverage.
   - Verify all tests pass deterministically offline.

6. **Repository & Submission Discipline:**
   - Single branch (main).
   - Total repository footprint strictly under 10 MB (exclude node_modules via .gitignore).
   - Comprehensive README.md and complete MIT LICENSE.

Generate the complete file tree and code for all files now.
```

---

## 3. Chosen Vertical & Persona

### The Vertical
**Celebration & Event Planning Assistant** tailored to:
* **Weddings:** Multi-ceremony logistics, traditional/western rituals, guest accommodation, and catering tiers.
* **Milestone Birthdays:** Decades celebrations, themed cocktail lounges, interactive entertainment, and dessert stations.
* **Community Events & Galas:** Cultural festivals, street food fairs, charity galas, stage sound systems, municipal permits, and volunteer coordination.

### The Persona
Designed for both **event organizers/hosts** and **independent event planners** seeking an intelligent co-pilot to eliminate spreadsheet chaos, prevent unexpected budget overshoots, structure vendor contracting, and generate creative event concepts.

---

## 4. Approach & Core Logic

CelebraTech AI combines deterministic domain intelligence with generative AI creativity:

```mermaid
flowchart TD
    User["Event Request<br/>(Type, Budget, Guests, Date, Vibe)"] --> Guardrails["Safety & Guardrail Engine<br/>- PII Masking (Cards, Phone, Email)<br/>- Prompt Injection Defense<br/>- Boundary Validation"]
    
    Guardrails --> Allocator["Dynamic Budget Allocator<br/>- Industry Benchmark Splits<br/>- Mandatory 7-10% Contingency<br/>- Cost/Guest Calculations<br/>- Overspend Warning Triggers"]
    
    Guardrails --> Timeline["Milestone & Schedule Generator<br/>- T-180 to T-1 Countdown<br/>- Critical Path Identification<br/>- Day-Of Run-of-Show Hourly Table"]
    
    Guardrails --> Vendors["Vendor Management Hub<br/>- Lead Time Schedules<br/>- Standard Interview Questions<br/>- Auto-Generated RFPs<br/>- Contract Red Flags"]
    
    Guardrails --> Creative["GenAI Theme & Speech Studio<br/>- Hex Color Palettes<br/>- Decor & Styling Concepts<br/>- Formal & Social Invites<br/>- Personalized Host Speeches"]
    
    Allocator & Timeline & Vendors & Creative --> Dossier["Unified Planner Dossier"]
    Dossier --> Copilot["Interactive Event Copilot<br/>(Context-Aware Chat & Rebalancing)"]
```

1. **Safety First:** All inputs are inspected for prompt injections, sanitized against non-numeric or extreme budgets, and stripped of personal contact information (PII).
2. **Benchmark-Driven Budgeting:** Every vertical uses vetted expense distributions (e.g. Weddings allocate 32% to catering, 22% to venue, with an explicit 8% emergency contingency buffer).
3. **Calendar-Accurate Timelines:** Backwards date offsets calculate real due dates leading up to the target date.
4. **Intelligent Vendor RFPs:** Generates ready-to-dispatch vendor inquiries with essential contract warning clauses.
5. **Interactive Copilot:** Dynamic conversational assistant capable of simulating headcount increases or budget cuts.

---

## 5. System Architecture

```text
Celebration_Event-Planner/
├── skills/
│   └── celebratech-ai-builder/
│       └── SKILL.md                 # Reusable Agent Skill & One-Shot Generator
├── src/
│   ├── types/
│   │   └── index.ts                 # Domain type definitions & interfaces
│   ├── safety/
│   │   └── guardrails.ts            # PII redaction & prompt injection sanitizer
│   ├── engine/
│   │   ├── budget-allocator.ts      # Benchmark allocation & cost/guest optimizer
│   │   ├── timeline-generator.ts    # Countdown milestones & day-of run-of-show
│   │   ├── vendor-manager.ts        # Category checklists, RFPs & contract red flags
│   │   ├── theme-ideator.ts         # Creative themes, color palettes & custom speeches
│   │   └── event-copilot.ts         # Context-aware chat copilot
│   ├── ai/
│   │   └── provider.ts              # Pluggable deterministic / LLM provider interface
│   ├── ui/
│   │   ├── app.js                   # Interactive client dashboard controller
│   │   └── style.css                # Modern responsive dark-mode design system
│   └── index.ts                     # Main entry orchestrator & export facade
├── tests/
│   ├── guardrails.test.ts
│   ├── budget-allocator.test.ts
│   ├── timeline-generator.test.ts
│   ├── vendor-manager.test.ts
│   ├── theme-ideator.test.ts
│   └── event-copilot.test.ts
├── index.html                       # Self-contained zero-friction browser app
├── ImplementationPlan.md            # Detailed architecture and planning spec
├── InstagramReelGuide.md            # Script and guide for Challenge 5 Reel submission
├── VideoSubmissionGuide.md          # 3-minute project walkthrough video script
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 6. Feature Walkthrough

### 1. Dynamic Budget Allocation
* Automatically distributes funds across essential, recommended, and optional categories.
* Reserves an explicit **7% to 10% emergency contingency buffer**.
* Real-time **cost-per-guest metrics** and overspend warning triggers when catering exceeds 45%.

### 2. Milestone Countdown & Day-Of Run of Show
* 4-phase countdown tracking:
  * *Phase 1: Conceptualization & Venue Lock* (T-6 to T-4 months)
  * *Phase 2: Core Vendor Contracting* (T-4 to T-2 months)
  * *Phase 3: Final Details & RSVP Cutoffs* (T-2 months to T-2 weeks)
  * *Phase 4: Final Week Countdown & Rehearsals* (T-14 to T-1 day)
* Hour-by-hour **Day-Of Execution Schedule** detailing times, milestones, and lead coordinators.

### 3. Vendor Negotiation Hub
* Standard interview questionnaires for Venue, Catering, Media, Decor, and Audio-Visual.
* Automated **Request for Proposal (RFP)** drafts ready to copy and send.
* Critical **Contract Red Flag alerts** (e.g. lack of named backup photographer, vague overtime penalties).

### 4. GenAI Creative Theme & Speech Studio
* Cohesive 4-swatch color palettes with hex codes.
* Formal, casual, and social media invitation copy.
* Custom-written **Host Welcome Speech**, **Celebration Toast**, and **Vote of Thanks**.

### 5. Context-Aware Event Copilot
* Real-time interactive assistant supporting queries like:
  * *"Our guest count increased from 100 to 180"*
  * *"How can we cut 15% from the budget without ruining quality?"*
  * *"What is our outdoor rain contingency plan?"*

---

## 7. Security, Guardrails & Accessibility

* **PII Redaction:** Automatically detects and redacts emails, telephone numbers, credit cards, and government IDs.
* **Prompt Injection Defense:** Defends against unauthorized system instruction overrides and malicious script tags.
* **Input Boundary Sanitization:** Restricts extreme budgets and guest counts to realistic parameters.
* **Accessibility (WCAG 2.1 AA):** High contrast color ratios, semantic HTML5 tags, full keyboard navigation, and responsive scaling.

---

## 8. Testing & Verification (99.38% Coverage)

All business logic is validated using **Vitest** with the v8 coverage engine:

```text
 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   99.38 |    88.19 |     100 |   99.38 |                   
 src               |     100 |      100 |     100 |     100 |                   
  index.ts         |     100 |      100 |     100 |     100 |                   
 src/ai            |     100 |      100 |     100 |     100 |                   
  provider.ts      |     100 |      100 |     100 |     100 |                   
 src/engine        |   99.21 |    86.48 |     100 |   99.21 |                   
  ...-allocator.ts |    95.9 |    82.75 |     100 |    95.9 | ...40-141,146-147 
  event-copilot.ts |     100 |    83.33 |     100 |     100 | 31-33,67          
  theme-ideator.ts |     100 |    96.15 |     100 |     100 | 20                
  ...-generator.ts |     100 |      100 |     100 |     100 |                   
  ...or-manager.ts |     100 |       20 |     100 |     100 | 19-75             
 src/safety        |     100 |     91.3 |     100 |     100 |                   
  guardrails.ts    |     100 |     91.3 |     100 |     100 | 90,132            
-------------------|---------|----------|---------|---------|-------------------
```

To run tests locally:
```bash
npm test
npm run test:coverage
```

---

## 9. Assumptions Made

1. **Target Date Feasibility:** Assumes planning horizons are ideally between 14 and 180 days in advance. For dates closer than 14 days, expedited timelines apply.
2. **Currency Standardization:** Calculations support standard fiat currencies (`USD`, `INR`, `EUR`, `GBP`) and format per-guest costs accordingly.
3. **Pluggable Architecture:** Works out-of-the-box with zero network dependency using deterministic domain heuristics, while offering a pluggable interface for live Gemini/OpenAI API integration.

---

## 10. Getting Started & Local Setup

### Running the Web Application
No build step or local server required! Simply double-click and open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Development & Test Execution
```bash
# 1. Clone the repository
git clone https://github.com/ujju2020/Celebration_Event-Planner.git
cd Celebration_Event-Planner

# 2. Install lightweight dependencies
npm install

# 3. Run unit tests
npm test

# 4. Generate coverage report
npm run test:coverage

# 5. Compile TypeScript
npm run build
```

---

## 📄 License & Attribution

Copyright (c) 2026 Ujjwal Kumar Bhowmick  
Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)  
Developed for **PromptWars Challenge 5: Celebration & Event Planner**.  
Licensed under the [MIT License](LICENSE).
