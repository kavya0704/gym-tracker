# 🚀 GymTracker — Phase-wise Implementation Plan

> Based on [`architecture.md`](./architecture.md) and [`problem_statement.md`](./problem_statement.md)  
> Total: 5 Phases · 20 Steps · Est. build time: ~4–6 hours

---

## Overview

```
Phase 1 │ Project Foundation          Steps  1–3  │ Config + Data + Storage
Phase 2 │ Design System + Shell       Steps  4–7  │ CSS + Layout + Shared UI
Phase 3 │ Core Feature Pages          Steps  8–13 │ Dashboard + Log + Plan
Phase 4 │ Advanced Features           Steps 14–17 │ Progress + Nutrition + Workout Session
Phase 5 │ AI + PWA + Deploy           Steps 18–20 │ Groq Chatbot + PWA + Vercel
```

---

## ─────────────────────────────────────────
## PHASE 1 — Project Foundation
### *Steps 1–3 · Config · Program Data · Storage*
## ─────────────────────────────────────────

### Step 1 — Project Setup

**Goal:** Scaffold Next.js 14 (App Router) project with all config files.

**Files to create:**
```
package.json
next.config.js
.env.local
.gitignore
```

**Details:**

`package.json` — dependencies:
```json
{
  "name": "gym-tracker",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "chart.js": "4.4.3",
    "react-chartjs-2": "5.2.0",
    "groq-sdk": "0.3.3"
  }
}
```

`.env.local`:
```
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

`.gitignore` must include:
```
.env.local
.next/
node_modules/
```

`next.config.js`:
```js
const nextConfig = {};
module.exports = nextConfig;
```

**Acceptance criteria:**
- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] `.env.local` is gitignored (key never committed)

---

### Step 2 — Hardcoded Program Data (`lib/program.js`)

**Goal:** Full 6-day × 4-phase PPL program. This is the single source of truth for all workout content.

**Exports:**
```js
export const PHASES          // Phase metadata (1–4)
export const PPL_PROGRAM     // 7 day keys with exercises
export const WEEK_ROTATION   // ["push_a","pull_a","legs_a","push_b","pull_b","legs_b","rest"]
export const POSTURE_ROUTINE // Daily posture checklist items
export const ANKLE_MOBILITY  // 4-stage progression
export const MILESTONES      // Monthly weight + strength targets
```

**PPL Program — all 7 day keys:**

| Day Key | Name | Type | Exercises |
|---|---|---|---|
| `push_a` | Push A | Push | Bench Press, Incline DB, Cable Fly, OHP, Lateral Raise, Tricep Pushdown |
| `pull_a` | Pull A | Pull | Pull-ups, Barbell Row, Cable Row, Face Pull, Bicep Curl, Hammer Curl |
| `legs_a` | Legs A | Legs | Squat, Leg Press, Romanian DL, Leg Extension, Calf Raise, Plank |
| `push_b` | Push B | Push | OHP, Arnold Press, Cable Lateral, Incline DB, Tricep Overhead, Skull Crushers |
| `pull_b` | Pull B | Pull | Deadlift, Chest-supported Row, Lat Pulldown, Wrist Curl, Reverse Curl, Shrugs |
| `legs_b` | Legs B | Legs | Romanian DL, Leg Curl, Walking Lunge, Hip Thrust, Ab Wheel, Cable Crunch |
| `rest`   | Rest   | Rest | Active recovery — stretching, posture work |

**Each exercise object:**
```js
{
  name: "Barbell Bench Press",
  muscle: "Chest",
  sets: 4,
  reps: "8–10",
  rest: 90,          // seconds
  rpe: 7,
  cues: "Retract scapula, feet flat, bar to lower chest, full ROM"
}
```

**Phase metadata:**
```js
PHASES = {
  1: { name: "Foundation",          weeks: "1–4",   goal: "Build base strength, fix movement patterns",      macroKey: "phase1" },
  2: { name: "Strength Base",       weeks: "5–8",   goal: "Progressive overload + posture correction",       macroKey: "phase2" },
  3: { name: "Hypertrophy Push",    weeks: "9–16",  goal: "Max muscle growth + aesthetic shaping",           macroKey: "phase3" },
  4: { name: "Aesthetic Refinement",weeks: "17–52", goal: "Lean bulk — size with controlled body fat",       macroKey: "phase4" },
}
```

**Acceptance criteria:**
- [ ] All 6 training days have ≥5 exercises each
- [ ] Every exercise has: name, muscle, sets, reps, rest, rpe, cues
- [ ] `getTodayDayKey()` returns correct day based on `startDate`

---

### Step 3 — Storage + Logic Libraries

**Goal:** All localStorage helpers and pure logic functions used across the app.

**Files to create:**

#### `lib/storage.js`
```js
// GET
getSettings()        → gt_settings object (or defaults)
getWorkouts()        → gt_workouts array
getWeightLog()       → gt_weight_log array
getMeasurements()    → gt_measurements array
getMeals(date)       → gt_meals filtered by date
getSupplements(date) → gt_supplements[date] object
getChecklist(date)   → gt_checklist[date] object
getPRs()             → gt_prs object

// SET
saveSettings(obj)
addWorkout(obj)
addWeightEntry(obj)
addMeasurement(obj)
addMeal(obj)
toggleSupplement(date, key)
toggleChecklist(date, key)
updatePR(exercise, weight, date)
```

#### `lib/phases.js`
```js
getCurrentPhase(startDate)
// Returns: { phaseNum, name, weekNum, totalWeeks, progressPct, goal, macroKey }

getPhaseForWeek(weekNum)
// Returns phase number (1–4) for any given week

getTodayDayKey(startDate)
// Returns: "push_a" | "pull_a" | "legs_a" | "push_b" | "pull_b" | "legs_b" | "rest"
```

#### `lib/macros.js`
```js
MACRO_TARGETS = {
  phase1: { protein: 150, carbs: 200, fat: 55,  kcal: 1895 },
  phase2: { protein: 160, carbs: 220, fat: 60,  kcal: 2040 },
  phase3: { protein: 175, carbs: 250, fat: 65,  kcal: 2265 },
  phase4: { protein: 180, carbs: 270, fat: 70,  kcal: 2430 },
}
getMacroTargets(phaseNum) → macro object
```

#### `lib/stats.js`
```js
getTotalWorkouts()       → number
getTotalSets()           → number
getTotalHours()          → number (rounded to 1dp)
getCurrentStreak()       → number (days)
getWeeklyVolume(weeks)   → [{ week, push, pull, legs }] for chart
getLatestWeight()        → number | null
getLatestMeasurements()  → object | null
```

#### `lib/groqContext.js`
```js
buildSystemPrompt(userData)
// userData = { settings, currentPhase, todayWorkout, prs, latestWeight }
// Returns: full system prompt string for Groq API
```

**Acceptance criteria:**
- [ ] `getSettings()` returns defaults if localStorage is empty
- [ ] `getCurrentStreak()` correctly counts consecutive days with workouts
- [ ] `getTodayDayKey()` rotates correctly across weekdays from startDate
- [ ] All functions handle `null`/empty localStorage gracefully

---

## ─────────────────────────────────────────
## PHASE 2 — Design System + Shell
### *Steps 4–7 · CSS · Layout · Shared Components*
## ─────────────────────────────────────────

### Step 4 — Global Design System (`app/globals.css`)

**Goal:** Complete CSS design system — tokens, resets, typography, utilities, animations.

**Sections:**
1. **CSS Custom Properties (design tokens)**
   - Colors: `--bg`, `--surface`, `--surface-2`, `--border`, all accent colors
   - Typography: `--font-heading`, `--font-body`
   - Spacing: `--sp-1` through `--sp-12` (4px grid)
   - Radius: `--r-sm` through `--r-xl`
   - Glow effects: `--glow-purple`, `--glow-green`
   - Animation: `--ease-out`, `--dur-fast`, `--dur-base`, `--dur-slow`
   - Layout: `--nav-height: 72px`, `--header-height: 56px`

2. **Reset & Base**
   - Box-sizing, margin/padding reset
   - `body`: `background: var(--bg)`, `color: var(--text-1)`, Barlow font
   - Smooth scrolling, -webkit-tap-highlight-color: transparent

3. **Typography classes**
   - `.heading-xl` (Barlow Condensed 700, 32px)
   - `.heading-lg` (Barlow Condensed 700, 24px)
   - `.heading-md` (Barlow Condensed 600, 20px)
   - `.label` (Barlow Condensed 500, 13px, letter-spacing 0.08em, uppercase)
   - `.body-md` (Barlow 400, 16px, line-height 1.6)
   - `.body-sm` (Barlow 400, 14px)

4. **Card styles**
   - `.card` — glassmorphism base (background: surface, border, border-radius, backdrop-filter)
   - `.card-glow` — purple glow variant for active states
   - `.card-hover` — scale(1.01) on hover with transition

5. **Button styles**
   - `.btn-primary` — purple gradient, glow on hover, 44px min height
   - `.btn-secondary` — outline style
   - `.btn-ghost` — text only, subtle hover
   - `.btn-danger` — red variant for destructive actions
   - `.btn-icon` — square icon button (44×44px)

6. **Input styles**
   - `.input` — dark surface, purple focus ring, 44px height
   - `.input-group` — label + input stacked

7. **Utility classes**
   - `.hidden` — `display: none`
   - `.mt-{n}` — margin-top utilities
   - `.flex`, `.flex-col`, `.items-center`, `.justify-between`
   - `.text-purple`, `.text-green`, `.text-amber`, `.text-blue`, `.text-red`
   - `.truncate` — text overflow ellipsis

8. **Animations (keyframes)**
   - `@keyframes fadeIn` — opacity 0→1
   - `@keyframes slideUp` — translateY(20px)→0 + fadeIn
   - `@keyframes pulse` — scale glow for CTA buttons
   - `@keyframes spin` — for loading spinners
   - `@keyframes confetti` — for PR celebration
   - `@keyframes shimmer` — skeleton loading

9. **Scrollbar styling** — thin, dark, purple thumb

10. **`prefers-reduced-motion`** — all animations disabled

**Acceptance criteria:**
- [ ] Design tokens match architecture.md Section 8 exactly
- [ ] All buttons meet 44×44px touch target minimum
- [ ] No hardcoded hex values in component styles (use tokens only)
- [ ] Dark background confirmed (#050508)

---

### Step 5 — Root Layout (`app/layout.js`)

**Goal:** Wraps all pages. Loads fonts, sets metadata, renders persistent shell (TopHeader, BottomNav, AIChat button).

**Contents:**
```jsx
// Metadata
export const metadata = {
  title: "GymTracker — Aesthetic Physique",
  description: "12-Month transformation tracker for aesthetic physique",
  manifest: "/manifest.json",
  themeColor: "#A855F7",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover"
}

// Layout renders:
<html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="Barlow+Condensed|Barlow" rel="stylesheet" />
  </head>
  <body>
    <TopHeader />
    <main className="page-main">{children}</main>
    <BottomNav />
    <AIChatButton />   {/* floating */}
    <AIChatPanel />    {/* slide-up, hidden by default */}
    <Toast />          {/* global toast */}
  </body>
</html>
```

---

### Step 6 — Layout Components

**Goal:** TopHeader + BottomNav + PageWrapper.

#### `components/layout/TopHeader.jsx`
- Left: dumbbell SVG icon + "GYMTRACKER" in Barlow Condensed
- Right: settings icon button (opens SettingsModal)
- Fixed top, `z-index: 100`, `height: 56px`
- Blurred background (`backdrop-filter: blur(12px)`)

#### `components/layout/BottomNav.jsx`
- 5 tab items: Home / Log / Plan / Progress / Nutrition
- Each: SVG icon (24px) + text label (10px)
- Active state: purple icon + label + top indicator line
- `position: fixed; bottom: 0; height: 72px`
- Safe area aware: `padding-bottom: env(safe-area-inset-bottom)`
- Uses `usePathname()` from Next.js to highlight active tab

#### `components/layout/PageWrapper.jsx`
- `padding-top: 56px` (header clearance)
- `padding-bottom: 88px` (nav clearance)
- `min-height: 100dvh`
- `max-width: 430px; margin: 0 auto` (mobile-first centering)
- `padding: 0 16px`

**Acceptance criteria:**
- [ ] Active nav item highlighted on each route
- [ ] No content hidden behind header or nav bar
- [ ] Bottom nav visible on all 5 pages
- [ ] Works correctly at 375px, 430px, 768px widths

---

### Step 7 — Shared Components

**Goal:** Reusable utility components used across multiple pages.

#### `components/shared/ProgressRing.jsx`
```jsx
// Props: size, strokeWidth, percent, color, label
// SVG circle with stroke-dashoffset animation
// Used in: PhaseBanner, MacroRings, RestTimer
```

#### `components/shared/Toast.jsx`
```jsx
// Global toast via window event: window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))
// Types: success (green), error (red), info (purple), pr (amber)
// Auto-dismiss after 3500ms
// Slide-up animation from bottom
// aria-live="polite" for accessibility
```

#### `components/shared/ConfettiEffect.jsx`
```jsx
// Canvas-based confetti burst (80 particles)
// Colors: purple, amber, green, white
// Triggered on PR detection
// Auto-removes after 3 seconds
// Respects prefers-reduced-motion (skips if reduced motion)
```

---

## ─────────────────────────────────────────
## PHASE 3 — Core Feature Pages
### *Steps 8–13 · Dashboard · Log · Plan · Modals*
## ─────────────────────────────────────────

### Step 8 — Settings Modal + Data Modals

**Goal:** All data entry modals. Must be built before pages (pages use them).

#### `components/modals/SettingsModal.jsx`
Fields: Name, Start Weight (kg), Goal Weight (kg), Height (cm), Program Start Date, Groq API Key  
On save: `saveSettings()` + `window.dispatchEvent('settingsUpdated')` + toast "Settings saved"  
On "Reset All Data": confirmation dialog → clear all `gt_*` localStorage keys

#### `components/modals/WeightModal.jsx`
Fields: Weight (kg, step 0.1), Date (defaults to today)  
On save: `addWeightEntry({ date, weight })` + toast "Weight logged" + fire `weightUpdated` event

#### `components/modals/MeasurementModal.jsx`
Fields (all in cm): Chest, Waist, Arms (bicep), Forearms, Thighs, Shoulders  
On save: `addMeasurement(obj)` + toast "Measurements saved"

#### `components/modals/MealModal.jsx`
Fields: Meal name, Protein (g), Carbs (g), Fat (g)  
Auto-calculates calories: `(P × 4) + (C × 4) + (F × 9)`  
Shows calorie preview before save

**Modal pattern (shared):**
- `position: fixed; inset: 0` scrim (rgba 0,0,0,0.7)
- Modal slides up from bottom: `translateY(100%) → translateY(0)`, 300ms ease-out
- Dismiss: tap scrim or × button
- `max-height: 90vh; overflow-y: auto`
- Rounded top corners: `border-radius: 20px 20px 0 0`
- Safe area bottom padding

---

### Step 9 — Dashboard Page (`app/page.js`)

**Goal:** Main landing page. The most important page — user sees this every morning.

**Component tree:**
```
DashboardPage
├── GreetingBlock        (name + time greeting + streak badge)
├── PhaseBanner          (current phase + progress ring)
├── StatsRow             (4 stat cards)
├── TodayWorkoutCard     (today's exercises + Start button)
├── WeekGrid             (Mon–Sun completion pills)
├── WeightChart          (Chart.js line, empty state)
├── MeasurementSummary   (6 body part cards + deltas)
├── WeightModal          (conditional render when open)
└── MeasurementModal     (conditional render when open)
```

**Component details:**

`GreetingBlock`:
- Greeting: "Good morning" (5–11), "Good afternoon" (12–17), "Good evening" (18+)
- Name from `getSettings().name` (default "Athlete")
- Streak: count consecutive days with `gt_workouts` entry
- Orange fire SVG icon + streak number + "day streak"

`PhaseBanner`:
- Purple gradient card with glow
- Auto-detects phase from `settings.startDate` via `getCurrentPhase()`
- Circular progress ring: % through current phase weeks
- Phase name, week range, goal text

`StatsRow`:
- 4 cards in 2×2 grid
- Workouts: `getTotalWorkouts()`
- Sets: `getTotalSets()`
- PRs: `Object.keys(getPRs()).length`
- Hours: `getTotalHours()` → "12.5h"

`TodayWorkoutCard`:
- Gets `getTodayDayKey(startDate)` → loads from `PPL_PROGRAM`
- Shows: day name, muscle groups, first 3 exercises preview
- "Start Session" button → opens WorkoutSessionModal
- If today is Rest day: shows recovery card with checklist link

`WeekGrid`:
- 7 pill buttons Mon–Sun
- Green = date has workout in `gt_workouts`
- Purple ring = today
- Grey = no workout / future
- Shows abbreviated day name + date number

`WeightChart`:
- Chart.js line chart
- Data: `getWeightLog()` sorted by date
- Purple line with gradient fill
- Empty state SVG if no data

`MeasurementSummary`:
- 6 cards: Chest, Waist, Arms, Forearms, Thighs, Shoulders
- Each: current value (cm) + delta from first log (green = up, red = down for waist)
- "Update" button opens MeasurementModal

**Acceptance criteria:**
- [ ] Greeting changes correctly by time of day
- [ ] Phase auto-detects from startDate with correct progressPct
- [ ] TodayWorkoutCard shows correct day based on weekday rotation
- [ ] WeekGrid highlights today correctly

---

### Step 10 — Workout Log Page (`app/log/page.js`)

**Goal:** Chronological list of all completed workouts. Filterable by type.

**Component tree:**
```
LogPage
├── FilterTabs       (All / Push / Pull / Legs / Core)
├── WorkoutEntry[]   (one per workout, collapsible)
└── EmptyState       (if no workouts)
```

**WorkoutEntry card:**
- Header (always visible): Date | Workout name + type badge | Duration | Volume (kg)
- Tap to expand → shows exercise list:
  - Exercise name + muscle
  - Set rows: Set 1: 60kg × 10 · Set 2: 62.5kg × 9
  - PR badges on sets that were PRs
- Expand/collapse with smooth 250ms height animation
- Badge color by type: Push=purple, Pull=blue, Legs=green

**FilterTabs:**
- `useSearchParams` to persist filter in URL
- Filters `gt_workouts` array by `type` field
- "All" shows everything

**EmptyState:**
- SVG illustration (dumbbell + sparkles)
- "No workouts logged yet"
- "Start your first session →" button

**Acceptance criteria:**
- [ ] Filter tabs correctly filter by type
- [ ] Expand/collapse is smooth and doesn't cause layout shift
- [ ] Empty state shows when no workouts match filter
- [ ] Most recent workout shown first

---

### Step 11 — Plan Page (`app/plan/page.js`)

**Goal:** Full 12-month plan overview + 6-day PPL program reference.

**Component tree:**
```
PlanPage
├── PhaseTabs            (Phase 1 / 2 / 3 / 4)
├── PhaseDetailCard      (selected phase info)
│   ├── Goal text
│   ├── Week range + duration
│   ├── Key focus points (3 bullet points)
│   └── Milestone table  (monthly weight + strength targets)
└── DayProgramCard[]     (7 cards: push_a, pull_a, … rest)
    ├── Day label + type badge
    ├── Muscle groups
    └── ExerciseRow[]    (name + sets × reps + rest)
        └── Expandable form cues
```

**PhaseDetailCard — milestone table:**
| Month | Target Weight | Bench | OHP | Pull-ups |
|---|---|---|---|---|
| Month 1 | 69kg | 60kg | 45kg | 5 reps |
| Month 2 | 70kg | 65kg | 47.5kg | 7 reps |
| ... | ... | ... | ... | ... |

**DayProgramCard:**
- Header: "PUSH A · Chest & Shoulders" + Push badge
- Exercise list with sets × reps + rest time chip
- Tap exercise → expands to show form cue text
- Active day (today's rotation) gets purple glow border

**Acceptance criteria:**
- [ ] Phase tab switch updates milestone table instantly
- [ ] Form cues expand/collapse correctly per exercise
- [ ] Today's workout day is visually highlighted
- [ ] All 7 day cards render (including Rest day)

---

### Step 12 — Active Workout Session Modal

**Goal:** Full-screen workout logging experience. The most feature-rich component.

**File:** `components/modals/WorkoutSessionModal.jsx`

**Layout:**
```
┌──────────────────────────────────┐
│ ← Push A · Chest & Shoulders  [Finish] │
│ ⏱ 00:45:12  ·  Vol: 4,200 kg          │
├──────────────────────────────────┤
│ [Exercise Card: Bench Press]     │
│   Previous best: 65kg × 8       │
│   Set 1: [60 kg] × [10 reps] [✓]│
│   Set 2: [62  ] × [9      ] [✓] │
│   Set 3: [ --  ] × [ --   ] [ ] │
│   [+ Add Set]                    │
├──────────────────────────────────┤
│ [Exercise Card: Incline DB ...]  │
│ ...                              │
├──────────────────────────────────┤
│ [+ Add Exercise]                 │
└──────────────────────────────────┘
```

**Set row behavior:**
- Tap ✓ → marks set as done (green) + auto-opens RestTimerModal
- Weight/reps inputs: numeric keyboard on mobile (`inputMode="decimal"`)
- Weight field: shows previous best weight as placeholder
- Empty inputs auto-filled from previous set on `+ Add Set`
- Running volume total: sum of (weight × reps) for all completed sets

**Timer:**
- `useEffect` + `setInterval` counting elapsed seconds since modal open
- Format: `MM:SS` under 1 hour, `HH:MM:SS` over 1 hour
- Stops when modal closed

**On "Finish":**
1. Stops timer
2. Filters out uncompleted sets
3. Calculates `totalVolume`
4. Detects new PRs (vs `getPRs()`)
5. Saves to `gt_workouts` via `addWorkout()`
6. Updates `gt_prs` for any new PRs
7. Dispatches `workoutCompleted` event
8. Opens WorkoutSummaryModal

**Acceptance criteria:**
- [ ] Timer counts up correctly and doesn't reset on re-render
- [ ] ✓ tap immediately opens rest timer
- [ ] Volume updates live as sets are checked
- [ ] PRs correctly detected (new max weight for exercise)
- [ ] Keyboard doesn't cause layout shift (use `position: fixed` not `absolute`)

---

### Step 13 — Rest Timer Modal + Summary Modal

**File:** `components/modals/RestTimerModal.jsx`

**Layout:**
- Dark scrim overlay (but workout modal still visible faintly behind)
- Large circular SVG progress ring (120px diameter)
- Countdown number in center (bold, 40px)
- Preset buttons: 60s / 90s / 2min / 3min (active preset highlighted)
- "Skip" button
- Counts down, ring drains clockwise
- On complete: vibrate (if supported) + toast "Rest complete — next set!"
- Auto-closes on complete

**File:** `components/modals/WorkoutSummaryModal.jsx`

**Layout:**
- Slides up over workout modal
- "🎉 Workout Complete!" heading
- Stats: Duration | Volume | Exercises | Sets
- PR section: lists any new PRs with gold star + confetti trigger
- "Save & Exit" button → fires `ConfettiEffect` if any PRs, closes all modals

---

## ─────────────────────────────────────────
## PHASE 4 — Advanced Feature Pages
### *Steps 14–17 · Progress · Nutrition · Workout Flow Polish*
## ─────────────────────────────────────────

### Step 14 — Progress Page (`app/progress/page.js`)

**Component tree:**
```
ProgressPage
├── PRGrid               (8 lift PR cards)
├── VolumeChart          (stacked bar, 8 weeks)
├── MeasurementHistory   (timeline entries)
├── DailyChecklist       (posture / mobility / hydration / sleep)
└── MeasurementModal     (conditional)
```

**PRGrid:**
- 2-column grid of 8 cards
- Lifts: Bench Press, OHP, Pull-ups, Barbell Row, Squat, Deadlift, Incline DB Press, Romanian DL
- Each card: exercise name + current PR weight/reps + date
- Gold star badge if PR set within last 14 days
- "—" shown for lifts with no PR yet

**VolumeChart:**
- `getWeeklyVolume(8)` → last 8 weeks of volume data
- Stacked bar chart: Push (purple) + Pull (blue) + Legs (green)
- Chart.js with custom dark theme (bg transparent, grid lines `#1E1E2A`)
- Legend below chart
- Responsive: `maintainAspectRatio: false`, container height 200px

**MeasurementHistory:**
- Reverse-chronological timeline
- Each entry: date header + 6 measurement values
- Delta from previous entry: green if gained, amber if lost (for waist: inverted)

**DailyChecklist:**
- Saves to `gt_checklist[today]` in localStorage
- Resets automatically each new day (key = date string)
- Items:
  - Posture: Chin Tucks (3×15), Wall Angels (3×10), Band Pull-Aparts (3×20), Doorframe Stretch (60s each)
  - Ankle: Stage 1/2/3/4 based on progression
  - Hydration: 2.5–3L water
  - Sleep: 7–8 hours
- Tap to check/uncheck, shows completion % ring

**Acceptance criteria:**
- [ ] PRs update immediately after a workout is saved
- [ ] Volume chart shows correct stacked data
- [ ] Checklist state persists across page navigations but resets next day

---

### Step 15 — Nutrition Page (`app/nutrition/page.js`)

**Component tree:**
```
NutritionPage
├── MacroTargetsCard    (phase-aware targets)
├── MacroRings          (3 animated donut rings)
├── MealList            (today's meals + delete)
├── SupplementChecklist (5 supplements)
└── MealModal           (conditional)
```

**MacroTargetsCard:**
- Uses `getCurrentPhase()` + `getMacroTargets()` to show phase-specific targets
- Purple card with: Phase label, Protein / Carbs / Fat / Calories
- E.g. "Phase 1: 150g protein · 200g carbs · 55g fat · 1895 kcal"

**MacroRings:**
- 3 side-by-side ProgressRing components
- Protein (purple ring), Carbs (blue ring), Fat (amber ring)
- Each ring: consumed / target below
- Percentage filled based on today's meals from `getMeals(today)`
- Animate on mount (0 → actual %) with 600ms ease-out

**MealList:**
- Shows today's meals from `getMeals(today)`
- Each entry: meal name + macro chips (Pg Cg Fg) + kcal
- Swipe-to-delete or × button (with confirm)
- Running total row at bottom: "Total: 142g / 200g protein..."

**SupplementChecklist:**
- 5 items with icons and notes:
  - Creatine 5g — "Take any time, with water"
  - Vitamin D 1000 IU — "With food (fat-soluble)"
  - Omega-3 2 caps — "With meals"
  - Magnesium Glycinate — "Before bed"
  - Ashwagandha — "Optional / with food"
- Saves per day in `gt_supplements[date]`
- Resets at midnight

**Acceptance criteria:**
- [ ] Macro rings animate from 0 on page load
- [ ] Logging a meal updates rings immediately without page refresh
- [ ] Supplement checkboxes persist correctly today but are blank tomorrow

---

### Step 16 — Add Exercise Modal + Empty State Polish

**Goal:** Allow adding custom exercises to an active workout session.

**Add Exercise flow (inside WorkoutSessionModal):**
- "Add Exercise" button → slide-up mini modal
- Searchable list of all program exercises (grouped by muscle)
- Or: "Custom" tab with free-text name + muscle group selector
- Tap exercise → adds to current session's exercise list

**Empty State improvements across all pages:**
- Each page's empty state has a unique SVG illustration
- Clear CTA button (e.g. "Start First Workout" on Log page)
- Consistent animation: fadeIn 300ms

---

## ─────────────────────────────────────────
## PHASE 5 — AI Coach + PWA + Deploy
### *Steps 17–20 · Groq Chatbot · PWA · Vercel*
## ─────────────────────────────────────────

### Step 17 — Groq API Route (`app/api/chat/route.js`)

**Goal:** Server-side proxy for Groq API. Key never touches the browser.

```js
// POST /api/chat
export async function POST(req) {
  const body = await req.json();
  const { messages, systemPrompt } = body;

  // Key priority: user's key (from settings) > env var
  const apiKey = req.headers.get('x-groq-key') || process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'No API key configured' }, { status: 401 });
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: true,
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  // Pipe the stream back to the client
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

**Error handling:**
- 401 (invalid key) → "Invalid API key. Check Settings."
- 429 (rate limit) → "Rate limited. Wait 60 seconds."
- 503 (network) → "Can't reach AI. Check connection."
- Timeout 15s → auto-abort with message

---

### Step 18 — AI Chatbot UI

**Files:** `components/ai/AIChatButton.jsx` + `components/ai/AIChatPanel.jsx`

**AIChatButton:**
- Fixed position: `bottom: calc(72px + 16px + env(safe-area-inset-bottom))`
- Right: 16px
- 52×52px circular button, purple gradient background + glow
- Brain/sparkle SVG icon (white)
- Pulse animation when chat is closed
- Red dot badge when new message received while panel is closed
- Tap → opens AIChatPanel with slide-up animation

**AIChatPanel:**
- `height: 70vh`, slides up from bottom, `border-radius: 20px 20px 0 0`
- Header: "GymCoach AI" + "Llama 3 · Groq" badge + × close button
- Message area: scrollable, auto-scrolls to latest
- Message bubbles:
  - User: right-aligned, purple background
  - AI: left-aligned, surface-2 background with subtle purple left border
  - Timestamps below each message
- Typewriter effect: stream chunks appended in real time
- Loading state: 3-dot animated indicator while waiting for first token
- Input row: text field + send button (disabled while AI is responding)
- Suggested prompts on first open:
  - "What should I eat today?"
  - "How do I fix bad posture?"
  - "Am I on track for my goals?"

**System prompt context (built by `lib/groqContext.js`):**
- Current phase + week number
- Today's workout
- All PRs (formatted as list)
- Current weight + goal weight
- Today's macro intake vs targets
- Program type (PPL, non-veg, no whey)

**Acceptance criteria:**
- [ ] Streaming works — tokens appear as they arrive
- [ ] Panel does not cover bottom nav when typing on mobile
- [ ] Context (phase, PRs, weight) correctly injected in system prompt
- [ ] Graceful error messages for API failures
- [ ] Chat history survives page navigation (stored in sessionStorage)

---

### Step 19 — PWA Manifest + Icons

**Files:**

`public/manifest.json`:
```json
{
  "name": "GymTracker",
  "short_name": "GymTracker",
  "description": "12-Month Aesthetic Physique Transformation Tracker",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#050508",
  "theme_color": "#A855F7",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

`app/layout.js` — add to `<head>`:
```html
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

PWA icons: Generate a 512×512 dumbbell icon (purple on dark bg) using the `generate_image` tool → resize to 192×192 and 512×512.

---

### Step 20 — Vercel Deployment

**Goal:** Deploy to Vercel with Groq API key as environment variable.

**Steps:**

1. Create `vercel.json` (optional — Next.js auto-detected):
```json
{
  "framework": "nextjs"
}
```

2. Push to GitHub (`.env.local` excluded by `.gitignore`)

3. Connect repo to Vercel:
   - Import from GitHub
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`

4. Add environment variable in Vercel dashboard:
   ```
   Name:  GROQ_API_KEY
   Value: gsk_ss8GE6...  ← your key
   Scope: Production + Preview
   ```

5. Deploy → get URL like `https://gym-tracker-xyz.vercel.app`

6. Test on phone:
   - Open URL in Safari (iOS)
   - "Share → Add to Home Screen" → app icon appears
   - Opens in standalone mode (no browser chrome)

**Post-deploy checklist:**
- [ ] Dashboard loads in <2s on 4G
- [ ] AI chat works from phone
- [ ] Workout can be logged and persists on page refresh
- [ ] Bottom nav works correctly on all 5 routes
- [ ] "Add to Home Screen" creates standalone app icon

---

## Summary Table

| Phase | Steps | What Gets Built | Est. Time |
|---|---|---|---|
| **Phase 1** | 1–3 | Project setup, full program data, all storage/logic libs | ~45 min |
| **Phase 2** | 4–7 | Complete CSS design system, root layout, nav, shared components | ~60 min |
| **Phase 3** | 8–13 | Modals, Dashboard, Log, Plan, Workout Session + Rest Timer | ~120 min |
| **Phase 4** | 14–16 | Progress, Nutrition, Add Exercise, empty state polish | ~60 min |
| **Phase 5** | 17–20 | Groq API route, AI chatbot UI, PWA manifest, Vercel deploy | ~45 min |
| **Total** | 20 | Full working app on Vercel, usable on phone at 6 AM | **~6 hrs** |

---

*Implementation Plan v1.0 · Derived from architecture.md · 2026-06-20*
