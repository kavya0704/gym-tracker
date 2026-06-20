# 🏋️ GymTracker — Problem Statement & Feature Specification

## Overview

A **mobile-first progressive web app (PWA)** that acts as a personal coach companion for a 12-month aesthetic physique transformation program. The user (5'6"–5'7", non-vegetarian diet, full commercial gym access) follows a structured PPL (Push-Pull-Legs) 6-day program. The app must be accessible cross-device — phone, tablet, laptop — via a **Vercel deployment**, with all data persisted in `localStorage` (no backend DB required). An **AI coaching chatbot** powered by the **Groq API** (Llama 3) is integrated as a floating assistant.

---

## Goals

- Replace paper/Word-doc tracking with a beautiful, fast mobile interface
- Pre-load the entire 12-month plan so the user never has to set up manually
- Let the user log workouts at 6 AM with minimal friction (3 taps to start)
- Visualise progress (weight, volume, measurements) in clean charts
- Provide AI coaching answers in-context (knows the plan, knows the phase)
- Deploy to Vercel so the same URL works on phone and laptop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Vanilla CSS (no Tailwind) |
| Charts | Chart.js |
| AI Chatbot | Groq API (`llama3-8b-8192`) via Next.js API Route |
| Data Storage | `localStorage` (client-side only) |
| Deployment | Vercel |
| Fonts | Barlow Condensed + Barlow (Google Fonts) |
| Icons | Inline SVG (Lucide-style, no emoji) |

---

## Design System

- **Mode:** Dark only (OLED-friendly deep blacks)
- **Primary accent:** Purple (`#A855F7` / `#C084FC`)
- **Secondary accents:** Green for success (`#34D399`), Amber for PRs (`#FBBF24`), Blue for time (`#60A5FA`), Orange for streaks (`#F97316`)
- **Background:** `#050508` (near-black)
- **Card surface:** `#0F0F14`
- **Border:** `#1E1E2A`
- **Typography:** Barlow Condensed (headings/labels), Barlow (body)
- **Style:** Glassmorphism cards + subtle glow on active elements
- **Animations:** 150–300ms ease-out, transform/opacity only

---

## Pages & Features

### 1. 🏠 Dashboard (`/`)

**Header:**
- App logo + name "GYMTRACKER"
- Settings icon (opens settings modal)

**Greeting block:**
- Dynamic greeting (Good morning / afternoon / evening)
- User's name (from settings)
- Current day streak with fire icon

**Phase Banner:**
- Shows current phase name, week range, goal
- Circular progress ring showing % through the phase
- Auto-calculated from program start date

**Stats Row (4 cards):**
- Total workouts logged
- Total sets completed
- Personal records (PRs) hit
- Total training hours

**Today's Workout Card:**
- Shows today's day (e.g. "Push A — Chest & Shoulders")
- Lists exercises with sets × reps targets
- "Start Session" button opens active workout modal

**Weekly Grid:**
- Mon–Sun pill indicators
- Green = completed, Purple = today, Grey = upcoming/rest

**Body Weight Chart:**
- Line chart of logged body weight over time
- "Log Weight" button opens weight modal

**Measurements Summary:**
- 6 body part cards: Chest, Waist, Arms, Forearms, Thighs, Shoulders
- Shows latest value + delta from first log

---

### 2. 📋 Workout Log (`/log`)

**Header:**
- "Workout Log" title + "New" button

**Filter Tabs:**
- All / Push / Pull / Legs / Core

**Log List:**
- Each entry: date, workout name, duration, total volume
- Tap to expand → shows full exercise breakdown with sets/reps/kg

**Empty state** when no logs exist.

---

### 3. 📅 Plan (`/plan`)

**Phase Selector Tabs:** Phase 1 / Phase 2 / Phase 3 / Phase 4

**Phase Detail Card (per phase):**
- Duration (e.g. Weeks 1–4)
- Goal description
- Key metrics to hit by end of phase
- Monthly weight milestones table

**6-Day PPL Program Cards:**
- Day 1: Push A (Chest & Shoulders)
- Day 2: Pull A (Back & Biceps)
- Day 3: Legs A (Quad-dominant)
- Day 4: Push B (Shoulders & Triceps)
- Day 5: Pull B (Back Thickness + Forearms)
- Day 6: Legs B (Hamstring-dominant + Abs)
- Day 7: Rest / Active Recovery

Each day card shows:
- Day name + muscle groups
- Exercise list with sets × reps × rest targets
- Form cues (expandable)

---

### 4. 📈 Progress (`/progress`)

**Personal Records Grid:**
- Cards for: Bench Press, Overhead Press, Pull-ups, Barbell Row, Squat, Deadlift, Incline DB Press, Cable Fly
- Shows current PR + date achieved
- Gold star badge on recent PRs (within last 2 weeks)

**Weekly Volume Chart:**
- Bar chart (last 8 weeks)
- Stacked by Push / Pull / Legs

**Measurements History:**
- Timeline entries of each measurement log
- Delta highlights (green = gain, amber = loss)

**Daily Checklist:**
- Posture routine (chin tucks, wall angels, band pull-aparts, doorframe stretch)
- Ankle mobility (4-stage progression)
- Hydration (2.5–3L water)
- Sleep 7–8 hrs
- Saves check state per day in localStorage

---

### 5. 🥗 Nutrition (`/nutrition`)

**Macro Targets Card:**
- Phase-aware macros (Protein / Carbs / Fat / Calories)
- Shows current phase targets automatically

**Today's Intake:**
- 3 macro rings: Protein / Carbs / Fat
- Shows consumed vs target (animated ring)
- "Log Meal" button opens meal modal

**Meal Log List:**
- Entries for today with macro breakdown
- Tap to delete

**Supplement Checklist:**
- Creatine 5g (daily)
- Vitamin D 1000 IU
- Omega-3 (2 caps)
- Magnesium Glycinate (night)
- Ashwagandha (optional)
- Reset daily at midnight

---

### 6. 🤖 AI Coach Chatbot (floating, all pages)

**UI:**
- Floating button (bottom-right, above nav bar) with brain/sparkle icon
- Opens a slide-up chat panel (70% screen height)
- "GymCoach AI" header with Groq / Llama 3 badge
- Scrollable message history
- Text input + send button

**Behaviour:**
- Calls `/api/chat` Next.js route (Groq API server-side)
- System prompt pre-loads: current phase, today's workout, the user's PRs, current weight, goal weight
- Knows the full 12-month plan context
- Answers fitness, nutrition, form, recovery questions
- Streaming responses (typewriter effect)
- Persists chat history for the session

**Example questions it should handle:**
- "What should I eat today for muscle gain?"
- "My shoulder hurts on OHP, what to do?"
- "How many calories do I need this week?"
- "Am I on track for Phase 1 goals?"
- "Give me a posture routine I can do now"

---

## Active Workout Session Modal

Triggered by "Start Session" or "New" button.

**Layout:**
- Full-screen overlay (not a small modal)
- Session name + live elapsed timer (HH:MM:SS)
- Running total volume (kg)
- "Finish" button top-right

**Exercise Cards (per exercise):**
- Exercise name + muscle group tag
- Previous session's best (shown in grey for reference)
- Set rows: Set # | Weight (kg input) | Reps (input) | check-off
- "Start Rest Timer" button after checking a set
- "+ Add Set" button per exercise

**Rest Timer (slide-up overlay):**
- Circular countdown ring
- Preset buttons: 60s / 90s / 2min / 3min
- Current countdown large in center
- "Skip" button

**On Finish:**
- Summary modal: Duration, total volume, sets, exercises
- Auto-detect PRs (new max weight for any exercise)
- Confetti animation on PR
- Save to localStorage

---

## Data Models (localStorage keys)

```json
{
  "gt_settings": {
    "name": "Kavya",
    "startWeight": 68,
    "goalWeight": 75,
    "height": 170,
    "startDate": "2026-06-20",
    "groqApiKey": "gsk_..."
  },
  "gt_workouts": [],
  "gt_weight_log": [],
  "gt_measurements": [],
  "gt_meals": [],
  "gt_supplements": {},
  "gt_checklist": {},
  "gt_prs": {}
}
```

---

## Pre-loaded Program Data

The full 6-day × 4-phase program is **hardcoded in the app** (not user-entered). This includes:
- All exercises, sets, reps, rest times, RPE targets
- Phase goals and milestone weights
- Macro targets per phase
- Posture & mobility routines

---

## Vercel Deployment Requirements

- `GROQ_API_KEY` stored as a **Vercel environment variable** (never exposed to browser)
- The `/api/chat` route reads `process.env.GROQ_API_KEY`
- The user can also enter their own Groq API key in Settings (stored in localStorage, sent from client to API route as a header override)
- PWA manifest (`manifest.json`) so it can be "Add to Home Screen" on iPhone

---

## Non-Functional Requirements

- **Performance:** First load < 2s on mobile (4G)
- **Offline:** Core UI works offline; AI chat shows "offline" message gracefully
- **Responsive:** Optimised for 375px–430px (iPhone). Also works on 768px (iPad) and 1440px (desktop)
- **No login required:** All data stays local
- **No horizontal scroll** anywhere
- **Touch targets:** Minimum 44×44px for all interactive elements
- **Animations:** Respect `prefers-reduced-motion`

---

## Out of Scope (v1)

- Cloud sync / user accounts
- Social features
- Video form guides
- Barcode scanner for food
- Apple Health / Google Fit integration

---

## Success Criteria

- User can open the app on phone at 6 AM and log a full workout in under 5 minutes
- Weight and measurement trends are visible at a glance
- AI coach answers basic fitness & nutrition questions in < 3 seconds
- App works identically on phone browser and laptop browser via the same Vercel URL
