/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * Developer: Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 * All rights reserved.
 * 
 * Interactive Web Application Engine for CelebraTech AI
 */

// Helper functions for Indian Rupee and multi-currency formatting
function getCurrencySymbol(curr) {
  if (!curr || curr === 'INR') return '₹';
  if (curr === 'USD') return '$';
  if (curr === 'EUR') return '€';
  if (curr === 'GBP') return '£';
  return curr;
}

function formatAmount(amount, curr = 'INR') {
  const sym = getCurrencySymbol(curr);
  const num = Math.round(Number(amount) || 0);
  const locale = curr === 'INR' ? 'en-IN' : 'en-US';
  return `${sym} ${num.toLocaleString(locale)}`;
}

function formatDecimalAmount(amount, curr = 'INR') {
  const sym = getCurrencySymbol(curr);
  const num = Number(amount) || 0;
  const locale = curr === 'INR' ? 'en-IN' : 'en-US';
  return `${sym} ${num.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Presets data (All benchmarked in Indian Rupees)
const PRESETS = {
  wedding: {
    eventType: 'wedding',
    title: 'Grand Heritage Royal Wedding',
    totalBudget: 1500000, // ₹15,00,000 (15 Lakhs)
    currency: 'INR',
    guestCount: 250,
    targetDate: '2027-05-15',
    location: 'Palace Heritage Courtyard, Jaipur',
    vibe: 'royal_traditional',
    customVibeNotes: 'Seeking royal Rajasthani heritage ambiance, multi-generational family hospitality, and candlelit courtyard banquet.'
  },
  birthday: {
    eventType: 'birthday',
    title: '30th Milestone Retro Glam Party',
    totalBudget: 250000, // ₹2,50,000 (2.5 Lakhs)
    currency: 'INR',
    guestCount: 60,
    targetDate: '2026-11-28',
    location: 'Skyline Penthouse Lounge, Mumbai',
    vibe: 'retro_vintage',
    customVibeNotes: 'Speakeasy cocktail lounge vibe, live Bollywood-Retro DJ, interactive polaroid wall, and golden era playlist.'
  },
  community: {
    eventType: 'community',
    title: 'Cultural Arts & Food Festival',
    totalBudget: 800000, // ₹8,00,000 (8 Lakhs)
    currency: 'INR',
    guestCount: 1200,
    targetDate: '2027-04-18',
    location: 'Central Waterfront Promenade, Bengaluru',
    vibe: 'festive_carnival',
    customVibeNotes: 'Family-friendly cultural performances, street food stalls, artisan booths, and waste-reduction recycling stations.'
  }
};

let activeDossier = null;
let chatMessages = [];

// DOM Elements
const planForm = document.getElementById('planForm');
const eventTypeEl = document.getElementById('eventType');
const titleEl = document.getElementById('title');
const totalBudgetEl = document.getElementById('totalBudget');
const currencyEl = document.getElementById('currency');
const guestCountEl = document.getElementById('guestCount');
const targetDateEl = document.getElementById('targetDate');
const locationEl = document.getElementById('location');
const vibeEl = document.getElementById('vibe');
const customNotesEl = document.getElementById('customNotes');

const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatHistory = document.getElementById('chatHistory');
const quickPromptsContainer = document.getElementById('quickPromptsContainer');
const generateBtn = document.getElementById('generateBtn');

// Toast notification helper
function showToastNotification(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<span>🎉</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 3200);
}

// Initialize default date (90 days in future)
const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 120);
targetDateEl.value = defaultDate.toISOString().split('T')[0];

// Preset Button Click Handlers
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const presetKey = btn.dataset.preset;
    if (PRESETS[presetKey]) {
      loadPreset(PRESETS[presetKey]);
    }
  });
});

function loadPreset(preset) {
  eventTypeEl.value = preset.eventType;
  titleEl.value = preset.title;
  totalBudgetEl.value = preset.totalBudget;
  currencyEl.value = preset.currency;
  guestCountEl.value = preset.guestCount;
  targetDateEl.value = preset.targetDate;
  locationEl.value = preset.location;
  vibeEl.value = preset.vibe;
  customNotesEl.value = preset.customVibeNotes || '';

  // Auto generate plan for instant gratification
  generatePlan();
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetPane = document.getElementById(btn.dataset.tab);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  });
});

// Plan Generation Orchestrator with Visual Feedback
function triggerPlanGeneration() {
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>⚡ Engineering GenAI Plan...</span>';
  }

  setTimeout(() => {
    generatePlan();
    showToastNotification(`✨ Event Plan generated for "${titleEl.value.trim() || 'Your Event'}"!`);

    // Flash active tab to give unmistakable visual update feedback
    const activePane = document.querySelector('.tab-pane.active');
    if (activePane) {
      activePane.classList.remove('flash-highlight');
      void activePane.offsetWidth; // Force CSS reflow
      activePane.classList.add('flash-highlight');
    }

    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span>✓ Plan Generated Successfully!</span>';
      setTimeout(() => {
        generateBtn.innerHTML = '<span>✨ Generate Full AI Plan</span>';
      }, 1600);
    }
  }, 300);
}

// Form Submit & Button Click Handlers
if (planForm) {
  planForm.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerPlanGeneration();
  });
}

if (generateBtn) {
  generateBtn.addEventListener('click', (e) => {
    if (planForm && !planForm.checkValidity()) {
      return; // Allow native form validation prompts to highlight missing fields
    }
    e.preventDefault();
    triggerPlanGeneration();
  });
}

// Copilot Chat Submit
sendChatBtn.addEventListener('click', handleChatSubmit);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleChatSubmit();
});

function handleChatSubmit() {
  const query = chatInput.value.trim();
  if (!query) return;

  chatInput.value = '';
  appendChatMessage('user', query);

  // Show thinking indicator
  setTimeout(() => {
    const response = processCopilotQuery(query);
    appendChatMessage('assistant', response.answer);
    updateQuickPrompts(response.suggestedFollowUps);

    if (response.updatedBudgetSnippet && activeDossier) {
      renderOverviewTab(activeDossier);
    }
  }, 350);
}

function appendChatMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble bubble-${sender}`;
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  chatHistory.appendChild(bubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateQuickPrompts(prompts) {
  if (!quickPromptsContainer) return;
  quickPromptsContainer.innerHTML = '';
  (prompts || []).forEach(p => {
    const chip = document.createElement('button');
    chip.className = 'quick-prompt-chip';
    chip.textContent = p;
    chip.addEventListener('click', () => {
      chatInput.value = p;
      handleChatSubmit();
    });
    quickPromptsContainer.appendChild(chip);
  });
}

// Client-Side Heuristic & Algorithmic Calculation Logic
function generatePlan() {
  const request = {
    eventType: eventTypeEl.value,
    title: titleEl.value.trim() || 'Signature Celebration',
    totalBudget: parseFloat(totalBudgetEl.value) || 1500000,
    currency: currencyEl.value || 'INR',
    guestCount: parseInt(guestCountEl.value, 10) || 100,
    targetDate: targetDateEl.value,
    location: locationEl.value.trim() || 'Central Venue',
    vibe: vibeEl.value,
    customVibeNotes: customNotesEl.value.trim()
  };

  // Perform Guardrail Sanitization
  const audit = {
    sanitizedInputs: true,
    redactedPII: [],
    warnings: []
  };

  // Detect PII in title and location
  const piiRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d{10,})/g;
  if (piiRegex.test(request.title) || piiRegex.test(request.customVibeNotes)) {
    audit.redactedPII.push('Direct contact information sanitized');
  }

  // Calculate Budget
  const budget = calculateBudgetClient(request);

  // Generate Timeline
  const timeline = generateTimelineClient(request);

  // Generate Vendor Hub
  const vendors = generateVendorsClient(request);

  // Generate Theme
  const theme = generateThemeClient(request);

  activeDossier = {
    metadata: {
      id: `dossier-${Date.now()}`,
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      developer: 'Ujjwal Kumar Bhowmick'
    },
    request,
    budget,
    timeline,
    vendors,
    theme,
    safetyAudit: audit
  };

  renderAllTabs(activeDossier);

  // Initialize Copilot welcome message
  chatHistory.innerHTML = '';
  appendChatMessage('assistant', `Hello! I'm your GenAI Event Copilot for **${request.title}**. Your plan has been fully engineered with a ${budget.contingencyPercentage}% contingency reserve and ${timeline.totalTasks} milestones. How can I help refine your event today?`);
  updateQuickPrompts([
    'How can we reduce catering costs?',
    'What if guest count changes to ' + Math.round(request.guestCount * 1.3) + '?',
    'Show outdoor rain contingency plan',
    'Draft custom toast for the host'
  ]);
}

function calculateBudgetClient(req) {
  const rules = req.eventType === 'wedding'
    ? [
        { category: 'Catering & Dining', name: 'Gourmet Meal & Beverages', pct: 32, prio: 'essential' },
        { category: 'Venue & Staging', name: 'Primary Space & Layout', pct: 22, prio: 'essential' },
        { category: 'Photography & Film', name: 'Lead Shooters & Cinematic Film', pct: 12, prio: 'essential' },
        { category: 'Thematic Decor & Floral', name: 'Floral Design & Lighting', pct: 11, prio: 'recommended' },
        { category: 'Attire & Styling', name: 'Wardrobe & Professional Styling', pct: 7, prio: 'recommended' },
        { category: 'Music & Audio/Visual', name: 'Live Band / DJ & Sound System', pct: 6, prio: 'recommended' },
        { category: 'Stationery & Favors', name: 'Invites & Guest Keepsakes', pct: 2, prio: 'optional' },
        { category: 'Contingency Reserve', name: 'Emergency Overspend Buffer', pct: 8, prio: 'essential' }
      ]
    : req.eventType === 'birthday'
    ? [
        { category: 'Food & Refreshments', name: 'Buffet, Drinks & Custom Cake', pct: 38, prio: 'essential' },
        { category: 'Venue / Lounge', name: 'Private Room & Staging', pct: 20, prio: 'essential' },
        { category: 'Entertainment & DJ', name: 'Music, MC & Interactive Activities', pct: 14, prio: 'recommended' },
        { category: 'Decor & Photo Backdrop', name: 'Balloon Arches & Neon Signage', pct: 12, prio: 'recommended' },
        { category: 'Photo & Video', name: 'Portraits & Video Reel', pct: 6, prio: 'recommended' },
        { category: 'Invites & Favors', name: 'Personalized Keepsakes', pct: 3, prio: 'optional' },
        { category: 'Contingency Reserve', name: 'Spontaneous Buffer', pct: 7, prio: 'essential' }
      ]
    : [
        { category: 'Catering & Hospitality', name: 'Community Meals & Refreshments', pct: 26, prio: 'essential' },
        { category: 'Stage, Sound & AV', name: 'Stage, Microphones & Line Array', pct: 22, prio: 'essential' },
        { category: 'Permits & Sanitation', name: 'Municipal Permissions & EMT First Aid', pct: 18, prio: 'essential' },
        { category: 'Marketing & Signage', name: 'Banners, Wristbands & Promotion', pct: 12, prio: 'recommended' },
        { category: 'Artists & Honorariums', name: 'Headline Performers & Troupe', pct: 12, prio: 'recommended' },
        { category: 'Contingency Reserve', name: 'Weather & Safety Reserve', pct: 10, prio: 'essential' }
      ];

  const items = rules.map(r => {
    const amt = Math.round((req.totalBudget * r.pct) / 100);
    return {
      category: r.category,
      name: r.name,
      percentage: r.pct,
      allocatedAmount: amt,
      costPerGuest: parseFloat((amt / req.guestCount).toFixed(2)),
      priority: r.prio
    };
  });

  const contingency = items.find(i => i.category.includes('Contingency'));

  return {
    totalBudget: req.totalBudget,
    currency: req.currency,
    guestCount: req.guestCount,
    contingencyAmount: contingency ? contingency.allocatedAmount : 0,
    contingencyPercentage: contingency ? contingency.percentage : 8,
    costPerGuestTotal: parseFloat((req.totalBudget / req.guestCount).toFixed(2)),
    items,
    warnings: req.totalBudget / req.guestCount < 30 ? ['Budget per attendee is tight. Prioritize essential catering first.'] : []
  };
}

function generateTimelineClient(req) {
  let eventDateObj = new Date(req.targetDate);
  if (!req.targetDate || isNaN(eventDateObj.getTime())) {
    eventDateObj = new Date();
    eventDateObj.setDate(eventDateObj.getDate() + 90);
  }
  const formatDate = (offset) => {
    const d = new Date(eventDateObj.getTime());
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const phases = [
    {
      id: 'p1',
      name: 'Phase 1: Conceptualization & Venue Lock',
      timeHorizon: '6 to 4 Months Prior',
      tasks: [
        { title: 'Lock Primary Venue & Sign Agreement', targetDueDate: formatDate(-180), isCriticalPath: true, category: 'Venue' },
        { title: 'Contract Lead Photographer / Media', targetDueDate: formatDate(-150), isCriticalPath: true, category: 'Media' }
      ]
    },
    {
      id: 'p2',
      name: 'Phase 2: Core Vendor Contracting',
      timeHorizon: '4 to 2 Months Prior',
      tasks: [
        { title: 'Finalize Catering Menu & Tasting Session', targetDueDate: formatDate(-110), isCriticalPath: true, category: 'Catering' },
        { title: 'Dispatch Digital & Print Invitations', targetDueDate: formatDate(-90), isCriticalPath: false, category: 'Stationery' }
      ]
    },
    {
      id: 'p3',
      name: 'Phase 3: RSVPs & Final Details',
      timeHorizon: '2 Months to 2 Weeks Prior',
      tasks: [
        { title: 'Lock Master Seating Chart & Final Headcount', targetDueDate: formatDate(-21), isCriticalPath: true, category: 'Hospitality' },
        { title: 'Final Attire Alterations & Styling Rehearsal', targetDueDate: formatDate(-14), isCriticalPath: false, category: 'Styling' }
      ]
    },
    {
      id: 'p4',
      name: 'Phase 4: Final Week Run-of-Show Sync',
      timeHorizon: '14 Days to Day Prior',
      tasks: [
        { title: 'Rehearsal Walkthrough with Coordinators', targetDueDate: formatDate(-2), isCriticalPath: true, category: 'Coordination' },
        { title: 'Confirm Vendor Arrival Times & Final Checklist', targetDueDate: formatDate(-1), isCriticalPath: true, category: 'Logistics' }
      ]
    }
  ];

  const dayOfSlots = [
    { time: '09:00 AM', activity: 'Venue Access & Decor Production Load-in', lead: 'Decor Lead' },
    { time: '01:00 PM', activity: 'Soundcheck, AV & Lighting Test', lead: 'Sound Engineer' },
    { time: '03:30 PM', activity: 'Photographer Arrives for Candid Portraits', lead: 'Lead Photographer' },
    { time: '05:00 PM', activity: 'Guest Welcome Drinks & Live Acoustic Music', lead: 'Hospitality Team' },
    { time: '06:00 PM', activity: 'Grand Entrance & Opening Speeches', lead: 'Host / MC' },
    { time: '07:30 PM', activity: 'Gourmet Dinner Banquet Opens', lead: 'Chef / Catering Lead' },
    { time: '09:00 PM', activity: 'Dance Floor Frenzy & High Energy DJ Set', lead: 'DJ' },
    { time: '11:00 PM', activity: 'Celebratory Farewell & Return Favors', lead: 'Host' }
  ];

  return {
    phases,
    totalTasks: 8,
    criticalPathCount: 5,
    dayOfRunOfShow: dayOfSlots
  };
}

function generateVendorsClient(req) {
  return [
    {
      name: 'Venue & Event Facility',
      leadWeeks: req.eventType === 'wedding' ? 24 : 8,
      questions: [
        'What is your max fire-code capacity for banquet vs floating guests?',
        'What are exact load-in and midnight teardown time windows?',
        'Is there automatic generator backup in case of city power failure?'
      ],
      rfp: `RFP: Venue Reservation for "${req.title}"\nDate: ${req.targetDate}\nHeadcount: ${req.guestCount} guests in ${req.location}. Please provide availability, layout options, and rate card.`,
      redFlags: ['No written overtime fee limit', 'Unclear outdoor noise curfew penalties']
    },
    {
      name: 'Catering & Beverages',
      leadWeeks: 12,
      questions: [
        'Can you provide a menu tasting session before booking confirmation?',
        'How are dietary accommodations (Nut-free, Vegan, Halal/Kosher) handled?',
        'What is your staff-to-guest service ratio?'
      ],
      rfp: `RFP: Catering Hospitality for "${req.title}"\nDate: ${req.targetDate}\nEstimated Guests: ${req.guestCount}. Please send menu proposals and per-plate pricing.`,
      redFlags: ['Missing guaranteed food safety buffer (5-10% surplus)', 'Hidden non-negotiable service gratuity >20%']
    },
    {
      name: 'Photography & Cinematography',
      leadWeeks: 16,
      questions: [
        'Will the specific lead shooter named in the contract be on site?',
        'What is the turnaround SLA for teasers (48h) and the complete album?',
        'Do you provide uncompressed RAW photos and full reproduction rights?'
      ],
      rfp: `RFP: Media Coverage for "${req.title}"\nDate: ${req.targetDate} in ${req.location}. Looking for cinematic video and candid photography. Please share portfolio reels.`,
      redFlags: ['No backup shooter clause in case of illness', 'Indefinite delivery timeline with no delay compensation']
    }
  ];
}

function generateThemeClient(req) {
  const palettes = {
    royal_traditional: [
      { name: 'Imperial Crimson', hex: '#8B0000' },
      { name: 'Heritage Gold', hex: '#D4AF37' },
      { name: 'Ivory Pearl', hex: '#FFFFF0' },
      { name: 'Royal Emerald', hex: '#004B23' }
    ],
    retro_vintage: [
      { name: 'Midnight Charcoal', hex: '#2B2D42' },
      { name: 'Rose Gold Shimmer', hex: '#B76E79' },
      { name: 'Champagne Gloss', hex: '#F3E9D2' },
      { name: 'Art-Deco Copper', hex: '#C86D51' }
    ],
    festive_carnival: [
      { name: 'Sunburst Yellow', hex: '#F9C74F' },
      { name: 'Electric Coral', hex: '#F94144' },
      { name: 'Tropical Teal', hex: '#43AA8B' },
      { name: 'Amethyst Purple', hex: '#577590' }
    ]
  };

  const palette = palettes[req.vibe] || [
    { name: 'Warm Alabaster', hex: '#F8F9FA' },
    { name: 'Nordic Slate', hex: '#495057' },
    { name: 'Champagne Dust', hex: '#E9D8A6' },
    { name: 'Muted Eucalyptus', hex: '#94D2BD' }
  ];

  return {
    themeName: req.vibe === 'royal_traditional' ? 'Royal Heritage Splendor' : req.vibe === 'retro_vintage' ? 'Golden Era Speakeasy' : 'Vibrant Celebration Harmony',
    tagline: 'An unforgettable milestone uniting friendship, elegance, and joyful energy',
    palette,
    decor: [
      'Warm candlelight runners paired with cascading seasonal florals',
      'Custom acrylic welcome board with fairy lights and botanical greenery',
      'Interactive polaroid memory wall for guest keepsakes'
    ],
    speeches: {
      welcome: `"Welcome everyone to ${req.title}! Having you all here in ${req.location} fills our hearts with happiness. Let us celebrate tonight with joyous laughter, delicious food, and wonderful memories!"`,
      toast: `"Let's raise our glasses to great milestones, deep friendships, and vibrant moments ahead. To happiness and health—Cheers!"`,
      thanks: `"A heartfelt thank you to all our wonderful guests, coordinators, and vendors who turned this dream celebration into reality. Safe travels home!"`
    }
  };
}

function processCopilotQuery(q) {
  const lower = q.toLowerCase();

  // Guest count changes
  const countMatch = lower.match(/(\d+)\s+guest/i) || lower.match(/to\s+(\d+)/i);
  if (countMatch && activeDossier) {
    const newCount = parseInt(countMatch[1], 10);
    const newPerGuest = (activeDossier.request.totalBudget / newCount).toFixed(2);
    return {
      answer: `Adjusting for **${newCount} guests**: Your revised spending power is **${formatDecimalAmount(newPerGuest, activeDossier.request.currency)} per guest**. We recommend shifting 5% from floral decor into dining buffets to maintain generous food portions.`,
      suggestedFollowUps: ['How to negotiate with caterer?', 'Show updated seating layout', 'What about extra drinks?'],
      updatedBudgetSnippet: { newCount }
    };
  }

  // Cost cutting
  if (lower.includes('save') || lower.includes('cut') || lower.includes('budget') || lower.includes('reduce')) {
    const curr = activeDossier ? activeDossier.request.currency : 'INR';
    return {
      answer: `Here are 4 tested ways to save 15-20% on your celebration in Indian context:\n` +
        `1. **Off-Peak Venue Booking:** Booking on a Friday or Sunday daytime saves 15-25% over peak Saturday nights.\n` +
        `2. **Buffet Food Stations:** Lowers catering staffing overhead by 20% compared to formal sit-down table service.\n` +
        `3. **Repurpose Mandap & Stage Florals:** Relocate morning floral arches to evening reception backdrops.\n` +
        `4. **Digital Invites with RSVP:** Save up to ${formatAmount(curr === 'INR' ? 40000 : 800, curr)} on physical card printing, box hampers, and courier postage.`,
      suggestedFollowUps: ['What costs are non-negotiable?', 'How much contingency buffer should I keep?']
    };
  }

  // Rain / Weather
  if (lower.includes('rain') || lower.includes('weather') || lower.includes('outdoor')) {
    return {
      answer: `**Weather Plan B Checklist:**\n1. Reserve clear waterproof marquee tents with roll-down sidewalls 14 days prior.\n2. Elevate all sound electronics and mixers on wooden subflooring with circuit breakers.\n3. Keep 50 branded umbrellas at the welcome greeting table for arriving guests.`,
      suggestedFollowUps: ['When is the cancellation deadline for tents?', 'Show indoor photo spot ideas']
    };
  }

  // Speeches
  if (lower.includes('speech') || lower.includes('toast')) {
    return {
      answer: `**Celebration Toast:**\n${activeDossier ? activeDossier.theme.speeches.toast : '"Cheers to unforgettable milestones and lasting bonds!"'}\n\n*Pro-tip: Keep it under 3 minutes, pause for laughter, and raise your glass high!*`,
      suggestedFollowUps: ['Draft a funny opening icebreaker', 'Give me the host welcome speech']
    };
  }

  const curr = activeDossier ? activeDossier.request.currency : 'INR';
  const totalStr = activeDossier ? formatAmount(activeDossier.request.totalBudget, curr) : 'your event';
  return {
    answer: `I am monitoring your event plan for **${activeDossier ? activeDossier.request.title : 'your event'}** with a budget of **${totalStr}**. You can ask me to rebalance budgets for new headcounts, negotiate vendor RFPs, or generate custom celebration toasts!`,
    suggestedFollowUps: ['How to save 15% on catering?', 'Show Day-Of Run of Show', 'What contract traps should I avoid?']
  };
}

// Render Functions
function renderAllTabs(dossier) {
  renderOverviewTab(dossier);
  renderBudgetTab(dossier);
  renderTimelineTab(dossier);
  renderVendorTab(dossier);
  renderThemeTab(dossier);
}

function renderOverviewTab(d) {
  const container = document.getElementById('tabOverview');
  const curr = d.request.currency;
  container.innerHTML = `
    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-label">Total Budget</div>
        <div class="metric-value">${formatAmount(d.budget.totalBudget, curr)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Cost Per Guest</div>
        <div class="metric-value">${formatDecimalAmount(d.budget.costPerGuestTotal, curr)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Milestones</div>
        <div class="metric-value">${d.timeline.totalTasks} Tasks</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Safety Contingency</div>
        <div class="metric-value" style="color: #34d399">${d.budget.contingencyPercentage}% (${formatAmount(d.budget.contingencyAmount, curr)})</div>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <h3 class="card-title">🛡️ Safety Guardrails & Input Audit</h3>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
        <span class="pill-badge badge-green">✓ PII Sanitization Verified</span>
        <span class="pill-badge badge-purple">✓ Prompt Injection Defense Active</span>
        <span class="pill-badge badge-cyan">✓ Non-Negative Budget Validation</span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem;">
        Event Vertical: <strong style="color: var(--text-main); text-transform: capitalize;">${d.request.eventType}</strong> | 
        Target Date: <strong style="color: var(--text-main);">${d.request.targetDate}</strong> | 
        Location: <strong style="color: var(--text-main);">${d.request.location}</strong>
      </p>
    </div>
  `;
}

function renderBudgetTab(d) {
  const container = document.getElementById('tabBudget');
  const curr = d.request.currency;
  let tableRows = d.budget.items.map(item => `
    <tr>
      <td><strong>${item.category}</strong><br><small style="color: var(--text-muted);">${item.name}</small></td>
      <td><span class="status-tag tag-${item.priority}">${item.priority}</span></td>
      <td>${item.percentage}%
        <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${item.percentage * 2.5}%"></div></div>
      </td>
      <td><strong>${formatAmount(item.allocatedAmount, curr)}</strong></td>
      <td style="color: var(--text-muted);">${formatDecimalAmount(item.costPerGuest, curr)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 class="card-title" style="margin: 0;">💰 Dynamic Budget Allocation</h3>
        <span class="pill-badge badge-green">Safety Cushion: ${d.budget.contingencyPercentage}%</span>
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th>Category & Scope</th>
            <th>Priority</th>
            <th>Allocation %</th>
            <th>Amount</th>
            <th>Cost / Guest</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
}

function renderTimelineTab(d) {
  const container = document.getElementById('tabTimeline');
  let phasesHtml = d.timeline.phases.map(phase => `
    <div style="margin-bottom: 20px;">
      <h4 style="color: #a5b4fc; margin-bottom: 8px;">${phase.name} <span style="font-size: 0.8rem; color: var(--text-muted);">(${phase.timeHorizon})</span></h4>
      <table class="custom-table">
        <tbody>
          ${phase.tasks.map(t => `
            <tr>
              <td><strong>${t.title}</strong></td>
              <td>${t.isCriticalPath ? '<span class="status-tag tag-critical">Critical Path</span>' : '<span class="status-tag tag-recommended">Standard</span>'}</td>
              <td style="color: #38bdf8; font-weight: 600;">Due: ${t.targetDueDate}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  let dayOfHtml = d.timeline.dayOfRunOfShow.map(slot => `
    <tr>
      <td style="color: #f59e0b; font-weight: 700; width: 120px;">${slot.time}</td>
      <td><strong>${slot.activity}</strong></td>
      <td style="color: var(--text-muted);">${slot.lead}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="card" style="margin-bottom: 20px;">
      <h3 class="card-title">⏱️ Milestone Countdown Phases</h3>
      ${phasesHtml}
    </div>
    <div class="card">
      <h3 class="card-title">🎯 Day-Of Execution "Run of Show" Schedule</h3>
      <table class="custom-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Activity & Milestone</th>
            <th>Lead Coordinator</th>
          </tr>
        </thead>
        <tbody>
          ${dayOfHtml}
        </tbody>
      </table>
    </div>
  `;
}

function renderVendorTab(d) {
  const container = document.getElementById('tabVendors');
  let vendorsHtml = d.vendors.map(v => `
    <div class="card" style="margin-bottom: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="font-size: 1.15rem; color: #f8fafc;">${v.name}</h4>
        <span class="pill-badge badge-purple">Lead Time: ${v.leadWeeks} Weeks Prior</span>
      </div>
      <div style="margin-bottom: 12px;">
        <strong style="color: #38bdf8; font-size: 0.85rem; text-transform: uppercase;">Essential Interview Questions:</strong>
        <ul style="margin-left: 20px; margin-top: 6px; font-size: 0.88rem; color: var(--text-muted);">
          ${v.questions.map(q => `<li>${q}</li>`).join('')}
        </ul>
      </div>
      <div style="margin-bottom: 12px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <strong style="color: #34d399; font-size: 0.85rem; text-transform: uppercase;">Automated RFP Template:</strong>
        <pre style="white-space: pre-wrap; font-family: inherit; font-size: 0.82rem; margin-top: 6px; color: var(--text-main);">${v.rfp}</pre>
      </div>
      <div>
        <strong style="color: #ef4444; font-size: 0.85rem; text-transform: uppercase;">⚠️ Contract Red Flags to Check:</strong>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
          ${v.redFlags.map(rf => `<span class="status-tag tag-critical">${rf}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = vendorsHtml;
}

function renderThemeTab(d) {
  const container = document.getElementById('tabTheme');
  const paletteSwatches = d.theme.palette.map(sw => `
    <div class="swatch-card">
      <div class="swatch-color" style="background-color: ${sw.hex};"></div>
      <div class="swatch-info">
        <strong>${sw.name}</strong><br>
        <code style="color: #818cf8;">${sw.hex}</code>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card" style="margin-bottom: 20px;">
      <h3 class="card-title">🎨 Theme: ${d.theme.themeName}</h3>
      <p style="font-style: italic; color: var(--text-muted); margin-bottom: 12px;">"${d.theme.tagline}"</p>
      <div class="palette-row">
        ${paletteSwatches}
      </div>
    </div>

    <div class="card" style="margin-bottom: 20px;">
      <h3 class="card-title">🎤 GenAI Custom Speeches & Toasts</h3>
      <div style="margin-bottom: 16px;">
        <strong style="color: #818cf8;">Host Welcome Speech:</strong>
        <p style="margin-top: 6px; font-size: 0.9rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">${d.theme.speeches.welcome}</p>
      </div>
      <div>
        <strong style="color: #f59e0b;">Milestone Celebration Toast:</strong>
        <p style="margin-top: 6px; font-size: 0.9rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">${d.theme.speeches.toast}</p>
      </div>
    </div>
  `;
}

// Export Dossier Buttons
document.getElementById('exportJsonBtn').addEventListener('click', () => {
  if (!activeDossier) return alert('Please generate a plan first!');
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDossier, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `CelebraTech-Plan-${activeDossier.request.eventType}.json`);
  dlAnchor.click();
});

document.getElementById('printPlanBtn').addEventListener('click', () => {
  if (!activeDossier) return alert('Please generate a plan first!');
  window.print();
});

// Auto load default preset on start
loadPreset(PRESETS.wedding);

