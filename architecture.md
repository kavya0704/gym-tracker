# 🏗️ GymTracker — Architecture Document

> Derived from [`problem_statement.md`](./problem_statement.md)  
> Stack: Next.js 14 · Vanilla CSS · Chart.js · Groq API · Vercel

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER DEVICE                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Next.js App (Browser)                  │  │
│  │                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │Dashboard │  │  Log     │  │  Plan          │  │  │
│  │  └──────────┘  └──────────┘  └────────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │  │
│  │  │Progress  │  │Nutrition │  │  AI Chatbot    │  │  │
│  │  └──────────┘  └──────────┘  └────────────────┘  │  │
│  │                                                   │  │
│  │            localStorage (all user data)           │  │
│  └───────────────────────┬───────────────────────────┘  │
└──────────────────────────│──────────────────────────────┘
                           │ fetch /api/chat
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Route (Vercel Edge)             │
│                  /api/chat/route.js                      │
│                                                         │
│   reads GROQ_API_KEY from env  →  calls Groq API        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Groq Cloud API                          │
│              Model: llama3-8b-8192                       │
│           Streaming chat completions                     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Project File Structure

```
gym-tracker/
│
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout: fonts, metadata, BottomNav, TopHeader, AIChat
│   ├── globals.css               # Full design system (tokens, resets, utilities)
│   ├── page.js                   # Route: / → Dashboard
│   ├── log/
│   │   └── page.js               # Route: /log → Workout Log
│   ├── plan/
│   │   └── page.js               # Route: /plan → 12-Month Plan
│   ├── progress/
│   │   └── page.js               # Route: /progress → Progress & PRs
│   ├── nutrition/
│   │   └── page.js               # Route: /nutrition → Macros & Meals
│   └── api/
│       └── chat/
│           └── route.js          # POST /api/chat → Groq API proxy
│
├── components/
│   ├── layout/
│   │   ├── TopHeader.jsx         # App bar: logo + settings icon
│   │   ├── BottomNav.jsx         # Mobile tab bar (5 items)
│   │   └── PageWrapper.jsx       # Scroll container + safe area insets
│   │
│   ├── dashboard/
│   │   ├── GreetingBlock.jsx     # Good morning + name + streak badge
│   │   ├── PhaseBanner.jsx       # Phase name + progress ring (auto from startDate)
│   │   ├── StatsRow.jsx          # 4 stat cards (workouts / sets / PRs / hours)
│   │   ├── TodayWorkoutCard.jsx  # Today's exercises preview + Start button
│   │   ├── WeekGrid.jsx          # Mon–Sun completion indicators
│   │   ├── WeightChart.jsx       # Chart.js line chart (body weight over time)
│   │   └── MeasurementSummary.jsx # 6-part body measurement cards + deltas
│   │
│   ├── log/
│   │   ├── FilterTabs.jsx        # All / Push / Pull / Legs / Core
│   │   ├── WorkoutEntry.jsx      # Collapsible log entry card
│   │   └── EmptyState.jsx        # No workouts yet illustration
│   │
│   ├── plan/
│   │   ├── PhaseTabs.jsx         # Phase 1–4 selector
│   │   ├── PhaseDetailCard.jsx   # Phase info + milestones table
│   │   └── DayProgramCard.jsx    # Day name + exercises + expandable form cues
│   │
│   ├── progress/
│   │   ├── PRGrid.jsx            # Personal records grid (8 lifts)
│   │   ├── VolumeChart.jsx       # Stacked bar chart (8 weeks)
│   │   ├── MeasurementHistory.jsx # Timeline of logged measurements
│   │   └── DailyChecklist.jsx    # Posture / mobility / hydration / sleep
│   │
│   ├── nutrition/
│   │   ├── MacroTargetsCard.jsx  # Phase-aware target macros
│   │   ├── MacroRings.jsx        # 3 animated donut rings (P/C/F)
│   │   ├── MealList.jsx          # Today's meals + delete
│   │   └── SupplementChecklist.jsx # 5 supplements with daily reset
│   │
│   ├── modals/
│   │   ├── WorkoutSessionModal.jsx  # Full-screen active session
│   │   ├── RestTimerModal.jsx       # Circular rest countdown
│   │   ├── WorkoutSummaryModal.jsx  # Post-workout summary + PR detection
│   │   ├── WeightModal.jsx          # Log body weight
│   │   ├── MeasurementModal.jsx     # Log 6 body measurements
│   │   ├── MealModal.jsx            # Log meal + macros
│   │   └── SettingsModal.jsx        # Name / weights / start date / Groq key
│   │
│   ├── ai/
│   │   ├── AIChatButton.jsx      # Floating purple brain button
│   │   └── AIChatPanel.jsx       # Slide-up chat panel (70vh)
│   │
│   └── shared/
│       ├── Toast.jsx             # Auto-dismiss toast (3–5s)
│       ├── ConfettiEffect.jsx    # PR celebration confetti
│       └── ProgressRing.jsx      # Reusable SVG circular progress
│
├── lib/
│   ├── program.js               # HARDCODED: full 6-day × 4-phase plan data
│   ├── storage.js               # localStorage get/set/update helpers
│   ├── phases.js                # getCurrentPhase(startDate) → phase object
│   ├── macros.js                # getMacroTargets(phase) → { protein, carbs, fat, kcal }
│   ├── stats.js                 # Aggregate workouts → stats (streak, volume, PRs)
│   └── groqContext.js           # Build system prompt from user data for AI
│
├── public/
│   ├── manifest.json            # PWA manifest (icons, theme, display: standalone)
│   ├── icon-192.png             # PWA icon 192×192
│   └── icon-512.png             # PWA icon 512×512
│
├── .env.local                   # GROQ_API_KEY=gsk_... (local dev, gitignored)
├── next.config.js               # Next.js config
└── package.json
```

---

## 3. Data Flow

### 3a. Workout Logging Flow

```
User taps "Start Session"
        │
        ▼
WorkoutSessionModal opens
  → loads today's program from lib/program.js
  → loads previous bests from gt_workouts (localStorage)
        │
User logs sets (weight + reps + ✓)
  → running volume totals updated live
  → each ✓ triggers Rest Timer
        │
User taps "Finish"
        │
        ▼
WorkoutSummaryModal
  → compares logged weights vs gt_prs
  → NEW PR? → update gt_prs + fire confetti
  → saves workout object to gt_workouts[]
  → updates streak logic
```

### 3b. AI Chat Flow

```
User types message
        │
        ▼
AIChatPanel.jsx
  → reads user context from localStorage:
      { name, phase, todayWorkout, PRs, currentWeight, goalWeight }
  → calls lib/groqContext.js to build system prompt
        │
        ▼
POST /api/chat
  { messages: [...], systemPrompt: "...", apiKey?: "from-localstorage" }
        │
        ▼
app/api/chat/route.js
  → uses req.headers["x-groq-key"] || process.env.GROQ_API_KEY
  → calls Groq API (llama3-8b-8192) with streaming
  → returns ReadableStream
        │
        ▼
AIChatPanel.jsx
  → reads stream chunks → typewriter effect
  → appends to chat history (session memory)
```

### 3c. Phase Detection Flow

```
lib/phases.js

getCurrentPhase(startDate):
  daysSinceStart = today - startDate
  weekNumber = Math.floor(daysSinceStart / 7) + 1

  Phase 1 → weeks  1–4   (Foundation / Hypertrophy Base)
  Phase 2 → weeks  5–8   (Progressive Overload / Posture Fix)
  Phase 3 → weeks  9–16  (Strength + Size Push)
  Phase 4 → weeks 17–52  (Aesthetic Refinement / Lean Bulk)

returns: { phase, name, weekRange, goal, macroKey, progressPct }
```

---

## 4. localStorage Schema

| Key | Type | Description |
|---|---|---|
| `gt_settings` | Object | name, startWeight, goalWeight, height, startDate, groqApiKey |
| `gt_workouts` | Array | Completed workout sessions |
| `gt_weight_log` | Array | `{ date, weight }` entries |
| `gt_measurements` | Array | `{ date, chest, waist, arms, forearms, thighs, shoulders }` |
| `gt_meals` | Array | `{ date, name, protein, carbs, fat }` |
| `gt_supplements` | Object | `{ "2026-06-20": { creatine: true, vitD: false, ... } }` |
| `gt_checklist` | Object | `{ "2026-06-20": { posture: true, mobility: false, ... } }` |
| `gt_prs` | Object | `{ "Bench Press": { weight: 80, date: "2026-06-20" } }` |

### Workout Object Shape
```json
{
  "id": "uuid",
  "date": "2026-06-20",
  "dayKey": "push_a",
  "name": "Push A — Chest & Shoulders",
  "type": "Push",
  "startTime": 1718859000000,
  "endTime":   1718862600000,
  "durationMins": 60,
  "totalVolume": 4200,
  "exercises": [
    {
      "name": "Barbell Bench Press",
      "muscleGroup": "Chest",
      "sets": [
        { "setNum": 1, "weight": 60, "reps": 10, "done": true },
        { "setNum": 2, "weight": 62.5, "reps": 9, "done": true }
      ]
    }
  ],
  "newPRs": ["Barbell Bench Press"]
}
```

---

## 5. Hardcoded Program Structure (`lib/program.js`)

```js
export const PHASES = {
  1: { name: "Foundation", weeks: "1–4", goal: "Build base strength & fix movement patterns" },
  2: { name: "Strength Base", weeks: "5–8", goal: "Progressive overload + posture correction" },
  3: { name: "Hypertrophy Push", weeks: "9–16", goal: "Max muscle growth + aesthetic shaping" },
  4: { name: "Aesthetic Refinement", weeks: "17–52", goal: "Lean bulk — size with low body fat" },
};

export const PPL_PROGRAM = {
  push_a: {
    name: "Push A",
    label: "Chest & Shoulders",
    type: "Push",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8–10", rest: 90, rpe: 7, muscle: "Chest",
        cues: "Retract scapula, feet flat, slight arch, bar to lower chest" },
      { name: "Incline DB Press",    sets: 3, reps: "10–12", rest: 75, rpe: 7, muscle: "Upper Chest" },
      { name: "Cable Fly",           sets: 3, reps: "12–15", rest: 60, rpe: 8, muscle: "Chest" },
      { name: "Overhead Press",      sets: 4, reps: "8–10",  rest: 90, rpe: 7, muscle: "Shoulders" },
      { name: "Lateral Raise",       sets: 3, reps: "15–20", rest: 45, rpe: 8, muscle: "Side Delts" },
      { name: "Tricep Pushdown",     sets: 3, reps: "12–15", rest: 60, rpe: 7, muscle: "Triceps" },
    ]
  },
  pull_a: { ... },   // Pull A: Back & Biceps
  legs_a: { ... },   // Legs A: Quad-dominant
  push_b: { ... },   // Push B: Shoulders & Triceps
  pull_b: { ... },   // Pull B: Back Thickness + Forearms
  legs_b: { ... },   // Legs B: Hamstrings + Abs
  rest:   { name: "Rest", label: "Active Recovery", type: "Rest", exercises: [] }
};

// Weekly rotation: Mon=push_a, Tue=pull_a, Wed=legs_a, Thu=push_b, Fri=pull_b, Sat=legs_b, Sun=rest
export const WEEK_ROTATION = ["push_a","pull_a","legs_a","push_b","pull_b","legs_b","rest"];
```

---

## 6. Groq API Route (`app/api/chat/route.js`)

```
POST /api/chat
Headers:
  Content-Type: application/json
  x-groq-key: <optional user key from localStorage>

Body:
  { messages: Message[], systemPrompt: string }

Logic:
  1. Read API key: req.headers["x-groq-key"] || process.env.GROQ_API_KEY
  2. If no key → 401 { error: "No API key configured" }
  3. Call https://api.groq.com/openai/v1/chat/completions
     with stream: true, model: "llama3-8b-8192"
  4. Return ReadableStream (text/event-stream)

Error handling:
  - Groq rate limit → 429 with retry message
  - Network error → 503 with offline message
  - Invalid key → 401 with setup instructions
```

---

## 7. AI System Prompt Context (`lib/groqContext.js`)

The system prompt injected per request:

```
You are GymCoach AI — a personal fitness coach for {name}.

CURRENT STATUS:
- Program Phase: {phase} — {phaseName} (Week {weekNum} of 52)
- Today's Workout: {todayWorkoutName}
- Current Body Weight: {currentWeight}kg → Goal: {goalWeight}kg
- Today's Macro Targets: {protein}g protein / {carbs}g carbs / {fat}g fat

PERSONAL RECORDS:
{prList}

PLAN CONTEXT:
{name} follows a 6-day PPL program (Push-Pull-Legs). 
Phase {phase} goal: {phaseGoal}
Key exercises: Bench Press, OHP, Pull-ups, Barbell Row, Squat, Deadlift.
Diet: Non-vegetarian. No whey protein. Eats chicken, eggs, fish.

RULES:
- Keep answers concise and practical (under 150 words unless asked for detail)
- Always be encouraging and evidence-based
- If asked about pain/injury, recommend seeing a physio for serious issues
- Use metric units (kg, cm)
```

---

## 8. CSS Design Tokens (`app/globals.css`)

```css
:root {
  /* Colors */
  --bg:          #050508;
  --surface:     #0F0F14;
  --surface-2:   #16161F;
  --border:      #1E1E2A;
  --border-2:    #2A2A3A;

  --purple:      #A855F7;
  --purple-light:#C084FC;
  --purple-glow: rgba(168, 85, 247, 0.15);

  --green:       #34D399;
  --amber:       #FBBF24;
  --blue:        #60A5FA;
  --orange:      #F97316;
  --red:         #F87171;

  --text-1:      #F1F5F9;   /* Primary text */
  --text-2:      #94A3B8;   /* Secondary text */
  --text-3:      #475569;   /* Muted text */

  /* Typography */
  --font-heading: 'Barlow Condensed', sans-serif;
  --font-body:    'Barlow', sans-serif;

  /* Spacing (8dp grid) */
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;
  --sp-4: 16px;  --sp-5: 20px;  --sp-6: 24px;
  --sp-8: 32px;  --sp-10: 40px; --sp-12: 48px;

  /* Radius */
  --r-sm: 8px;   --r-md: 12px;  --r-lg: 16px;  --r-xl: 24px;

  /* Shadows / Glow */
  --glow-purple: 0 0 20px rgba(168, 85, 247, 0.3);
  --glow-green:  0 0 12px rgba(52, 211, 153, 0.2);

  /* Animation */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 350ms;

  /* Nav */
  --nav-height: 72px;
  --header-height: 56px;
}
```

---

## 9. Component Communication Pattern

Since this is Next.js with no global state library, components share data via:

| Pattern | Used For |
|---|---|
| `localStorage` read on mount | All data (workouts, weight, PRs, settings) |
| Custom events (`window.dispatchEvent`) | Cross-component updates (e.g. workout saved → dashboard refresh) |
| URL query params | Filter state in Log page |
| React `useState` + prop drilling | Modal open/close, form state |
| `useEffect` + localStorage write | Persisting user actions |

---

## 10. Vercel Deployment Config

### Environment Variables (set in Vercel dashboard)
```
GROQ_API_KEY = gsk_...   ← server-side only, never in browser bundle
```

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // No static export — we need /api routes
  // Vercel handles Node.js runtime automatically
};
module.exports = nextConfig;
```

### PWA Manifest (`public/manifest.json`)
```json
{
  "name": "GymTracker",
  "short_name": "GymTracker",
  "description": "12-Month Aesthetic Physique Tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050508",
  "theme_color": "#A855F7",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 11. Build Order (Implementation Sequence)

```
Step 1 │ Project setup: package.json, next.config.js, .env.local
Step 2 │ lib/program.js — full 6-day × 4-phase hardcoded data
Step 3 │ lib/storage.js — localStorage CRUD helpers
Step 4 │ lib/phases.js + lib/macros.js + lib/stats.js
Step 5 │ lib/groqContext.js — system prompt builder
Step 6 │ app/globals.css — complete design system
Step 7 │ app/layout.js — root layout + TopHeader + BottomNav
Step 8 │ Shared components: Toast, ProgressRing, ConfettiEffect
Step 9 │ Modals: Settings, Weight, Measurement, Meal
Step 10│ Dashboard page + all dashboard components
Step 11│ WorkoutSessionModal + RestTimerModal + SummaryModal
Step 12│ Log page + FilterTabs + WorkoutEntry
Step 13│ Plan page + PhaseDetailCard + DayProgramCard
Step 14│ Progress page + PRGrid + VolumeChart + DailyChecklist
Step 15│ Nutrition page + MacroRings + MealList + Supplements
Step 16│ app/api/chat/route.js — Groq streaming API route
Step 17│ AIChatButton + AIChatPanel — floating chatbot
Step 18│ public/manifest.json + PWA icons
Step 19│ Test on 375px mobile + 1440px desktop
Step 20│ Deploy to Vercel + set GROQ_API_KEY env var
```

---

## 12. Security Considerations

| Risk | Mitigation |
|---|---|
| Groq API key exposed in browser | Key lives in `process.env.GROQ_API_KEY` (server-only). User's key from localStorage is sent as a request header, never in the JS bundle. |
| localStorage data loss | All data is local by design (v1 scope). User should export periodically (future feature). |
| XSS via AI response | AI output rendered as plain text (not `dangerouslySetInnerHTML`). |
| Rate limiting | Groq API errors caught and shown to user with retry option. |

---

*Architecture version: 1.0 · Last updated: 2026-06-20*
