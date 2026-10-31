# Main Problem Statement Video Submission Guide

**Challenge:** [Challenge 5] Celebration & Event Planner  
**Project:** CelebraTech AI (GenAI-Powered Celebration & Event Planning Assistant)  
**Repository:** [https://github.com/ujju2020/Celebration_Event-Planner.git](https://github.com/ujju2020/Celebration_Event-Planner.git)  
**Developer:** Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)  
**Copyright:** (c) 2026 Ujjwal Kumar Bhowmick. All rights reserved.  

---

## 1. Overview & Guidelines

Per the competition instructions in `README.md`:
> *"The video submission is mandatory. Please make sure after every submission, you create a video & submit. Only the submission you are confident in - create a proper video for that. It should highlight all the aspects of our project. You can refer to the video guide."*

### Key Requirements
* **Duration:** 2 to 3 minutes (concise, professional, thorough).
* **Format:** Landscape (16:9, 1080p).
* **Hosting Platforms:** YouTube (Unlisted or Public), Loom, or Google Drive (Ensure link access is set to *"Anyone with the link can view"*).
* **Evaluation Criteria Highlighted:**
  * **Code Quality & Architecture** (modular engine structure, strict TypeScript).
  * **Testing & Security** (99.37% automated test coverage, PII masking, prompt injection defense).
  * **Problem Alignment & Usability** (Weddings, Birthdays, Community Galas).
  * **Practical Real-World Impact** (Dynamic budgeting, vendor RFPs, run of show).

---

## 2. 3-Minute Walkthrough Script

### Section 1: Introduction & Problem Context (0:00 - 0:30)
* **Visual:** Camera on speaker or sleek title slide showing **CelebraTech AI** and PromptWars Challenge 5 details.
* **Script:**
  > *"Hello everyone! My name is Ujjwal Kumar Bhowmick, and today I'm presenting **CelebraTech AI**, our GenAI-powered Celebration & Event Planning Assistant built for PromptWars Challenge 5. Organizing high-stakes events like weddings, milestone birthdays, and community festivals is notoriously overwhelming. Planners juggle fragmented vendor contracts, inflexible budgets, and unpredictable timelines. CelebraTech AI solves this by unifying intelligent algorithmic budgeting, dynamic milestone timelines, vendor negotiation assistance, creative thematic content, and an interactive AI Copilot into a single, high-performance platform."*

### Section 2: Live Prototype Demonstration (0:30 - 1:45)
* **Visual:** Screen recording of `index.html`.
* **Script:**
  > *"Let's explore the live application.
  > 
  > 1. **Instant Presets & Custom Configuration:** We support three distinct event verticals: Weddings, Milestone Birthdays, and Community Galas. With one click on our 'Grand Royal Wedding' preset in Jaipur, the platform populates verified benchmarks.
  > 
  > 2. **Dynamic Budget Allocator:** Notice how it allocates the total budget into industry-standard categories with an explicit 8% emergency contingency buffer and real-time cost-per-guest metrics. It warns if catering proportions risk overspend.
  > 
  > 3. **Milestone Timeline & Run of Show:** The system computes calendar-accurate due dates backwards from the event date across 4 strategic phases, tracking critical path items. Additionally, it generates a granular Day-Of Run of Show from morning vendor load-in to midnight send-off.
  > 
  > 4. **Vendor Hub & Intelligent RFPs:** Under the Vendor Hub, each category provides standard interview questions, an automated RFP draft ready to transmit to venues and caterers, and critical contract red flags to protect clients.
  > 
  > 5. **GenAI Theme & Speech Studio:** Our creative engine provides cohesive color swatches with hex codes, decor ideas, and personalized formal invitations, as well as customized host welcome speeches and heartfelt celebration toasts.
  > 
  > 6. **Context-Aware Event Copilot:** In the Copilot tab, we can interactively simulate changes. If we ask 'Our guest count increased to 250', the Copilot immediately recalculates our spending power per guest and recommends actionable budget shifts."*

### Section 3: Architecture, Security & 99.37% Test Coverage (1:45 - 2:30)
* **Visual:** VS Code / Terminal showing code structure, security guardrails, and test execution.
* **Script:**
  > *"Under the hood, CelebraTech AI is architected with strict engineering discipline:
  > - **Lightweight Footprint:** The entire repository is only ~210 KB, massively below the 10 MB competition limit, and runs cleanly on a single main branch.
  > - **Security & Guardrails:** Our `SafetyGuardrails` engine redacts sensitive PII (emails, phone numbers, payment cards, government IDs) and sanitizes prompt injection attempts.
  > - **Automated Testing:** We run a comprehensive Vitest suite. As you can see on screen, all 17 tests across 6 suites pass in under 1.5 seconds, delivering **99.37% statement and line coverage** with 100% function coverage."*

### Section 4: Export, Usability & Conclusion (2:30 - 3:00)
* **Visual:** Show printable dossier view and JSON export download, then return to GitHub repository view.
* **Script:**
  > *"Finally, users can export their complete event dossier as structured JSON or print a clean, executive dossier with one click. CelebraTech AI demonstrates the power of pairing generative AI with rigorous domain logic to make event planning accessible, reliable, and stress-free. Thank you for your time!"*

---

## 3. Pre-Recording Checklist

- [ ] Test the web application locally by opening `index.html` in your browser.
- [ ] Run `npm run test:coverage` in your terminal so the output is ready to showcase.
- [ ] Record in 1080p landscape (1920x1080) at 30 or 60 fps using OBS or Loom.
- [ ] Upload to YouTube as Unlisted/Public or Loom/Google Drive.
- [ ] Test that the video link can be opened in an Incognito window without requiring login permissions.

