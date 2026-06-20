# 🏋️ GymTracker — Aesthetic Transformation Companion

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![CSS](https://img.shields.io/badge/Styling-Vanilla_CSS-blue?style=flat-square)](#design-system)
[![AI Assistant](https://img.shields.io/badge/AI_Coach-Groq_%2F_Llama_3.1-orange?style=flat-square)](#ai-coaching-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**GymTracker** is a premium, mobile-first Progressive Web App (PWA) designed to act as a personal coach companion for a comprehensive 12-month aesthetic physique transformation program. 

Tailored for cross-device usage (optimized for iOS/Android, and fully responsive on iPads and Desktop), it runs completely client-side utilizing `localStorage` for data persistence, requiring no account sign-ups or databases.

---

## 🌟 Key Features

### 1. 🏠 Core Dashboard (`/`)
*   **Dynamic Greeting & Streak Counter:** High-energy greeting based on the time of day, displaying your current training streak.
*   **Phase Progress Ring:** An interactive progress ring showing exactly how far along you are in the current 12-month program.
*   **Today's Workout Preview:** Instantly see today's day (e.g. *Push A — Chest & Shoulders*) and exercises with target sets/reps. One-tap to start the session.
*   **Interactive Trend Charts:** View body weight fluctuation over time.
*   **Body Measurement Summaries:** Track changes across 6 major muscle groups (Chest, Waist, Arms, Forearms, Thighs, Shoulders) with deltas calculated from your initial logs.

### 2. 📅 12-Month Pre-loaded Program (`/plan`)
*   Includes a hardcoded, structured **6-Day PPL (Push-Pull-Legs) routine** spanning 4 progression phases:
    1.  **Phase 1: Foundation (Weeks 1–4):** Build strength base, perfect movement patterns.
    2.  **Phase 2: Strength Base (Weeks 5–8):** Progressive overload focus + posture correction.
    3.  **Phase 3: Hypertrophy Push (Weeks 9–16):** Maximum muscle hypertrophy and aesthetic shaping.
    4.  **Phase 4: Aesthetic Refinement (Weeks 17–52):** Lean bulk phase with controlled body fat.
*   Each exercise is pre-loaded with target sets, rep ranges, RPE targets, rest timers, and form cues.

### 3. 📋 Workout Logger & Active Session Modal
*   **Active Workout Mode:** A full-screen logging interface with a live stopwatch, volume tracker (kg), and structured set-by-set inputs.
*   **Dynamic Rest Timer:** Custom countdown overlay featuring quick-select intervals (60s, 90s, 2m, 3m) and sound/vibration alerts.
*   **PR Detection:** Automatically compares logs to previous sessions, flagging personal records (PRs) with a confetti celebration.
*   **Workout Logs (`/log`):** View past sessions, filtered by training day, with complete detail breakdowns.

### 4. 🥗 Nutrition Tracker (`/nutrition`)
*   **Phase-Aware Macros:** Automatically adjusts protein, carb, fat, and calorie targets depending on your active phase.
*   **Intake Rings:** Visual rings showcasing consumed vs. target macronutrients.
*   **Daily Supplement Checklist:** Keep track of daily supplements (Creatine, Vitamin D, Omega-3, Magnesium Glycinate, Ashwagandha) resetting automatically at midnight.

### 5. 📈 Progress & Daily Checklist (`/progress`)
*   **PR Archive:** Track lifetime personal records on main lifts (Bench Press, OHP, Pull-ups, Deadlift, etc.) with gold star indicators for recent achievements.
*   **Weekly Volume Charts:** Stacked bar chart showing total tonnage lifted split by Push, Pull, and Legs.
*   **Wellness Checklist:** Track sleep, water intake, and daily posture/ankle mobility routines.

### 6. 🤖 AI Coach Chatbot (Floating Pane)
*   Integrated **Llama 3.1 AI coach** powered by the **Groq API**.
*   **Context-Aware:** Automatically references your current phase, today's workout, logged weight, and PR history to answer form, nutrition, or recovery questions.
*   **Streaming Responses:** Real-time typewriter streaming effect for instant feedback.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | For clean page structures and routing. |
| **Language** | **JavaScript (React 18)** | Client-side reactive logic. |
| **Styling** | **Vanilla CSS** | Highly optimized, custom design tokens, dark OLED-friendly design. |
| **Data Viz** | **Chart.js** | Renders weight trends and weekly volume history. |
| **AI LLM Engine** | **Groq SDK (Llama 3.1 8B)** | Proxy API route `/api/chat` with server-side API Key storage. |
| **Data Storage** | **Browser LocalStorage** | Full offline functionality, zero login/backend database required. |

---

## 🎨 Design System & Aesthetics

The application features a sleek, **OLED-friendly dark forest/emerald theme** engineered with glassmorphism panels, glow effects, and buttery transitions:

*   **Background:** `#06130E` (Deep Forest Green)
*   **Card Surfaces:** `#0C2219` (Sage Green) / `#122D22` (Medium Sage)
*   **Primary Accent:** `#10B981` (Emerald Green) / `#34D399` (Mint Green)
*   **Borders:** `#19392C` (Pine Border)
*   **Fonts:** `Barlow Condensed` (headings, badges) + `Barlow` (body)
*   **Animations:** Smooth `150ms-250ms` ease-out transitions for modals and buttons.

---

## 🚀 Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or later) installed.

### 1. Clone & Install
```bash
# Navigate into the project folder
cd "gym-tracker"

# Install dependencies
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root of the project:
```env
GROQ_API_KEY=your_groq_api_key_here
```
> **Note:** The app also supports user-provided API keys entered directly in the Settings modal (persisted in local storage and sent via a secure request header), which overrides the default server-side key.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
# Verify typechecking, linting, and compile production build
npm run build

# Start the compiled production app locally
npm start
```

---

## 🌐 Deployment to Vercel

GymTracker is fully optimized for **Vercel** deployment:

1.  Connect your GitHub repository to [Vercel](https://vercel.com).
2.  Add your `GROQ_API_KEY` under the project **Environment Variables** in Vercel's settings.
3.  Deploy! Vercel will automatically build the Next.js app using the `Edge` runtime for the `/api/chat` route, ensuring high-speed chatbot responses.

---

## 📂 Project Structure

```
├── app/
│   ├── api/chat/route.js     # Server-side Groq Chat API (Edge Runtime)
│   ├── log/                  # Workout Logs page
│   ├── nutrition/            # Macro & Supplement tracker page
│   ├── plan/                 # 12-Month PPL Program breakdown page
│   ├── progress/             # PRs, volume charts, and wellness checklist
│   ├── globals.css           # Premium Dark Green design system & variables
│   ├── layout.js             # Navigation shell and app wrapper
│   └── page.js               # Dashboard & Body weight tracker
├── components/
│   ├── ai/                   # AI Chat button & sliding panel components
│   ├── layout/               # Header and bottom navigation components
│   ├── modals/               # Settings, Meal, Weight, Workout, Rest modals
│   └── shared/               # Progress rings, Toasts, Confetti effects
├── lib/
│   ├── groqContext.js        # Compiles dynamic prompt templates for the AI
│   ├── macros.js             # Phase-aware macro calculators
│   ├── phases.js             # Current phase & week calculations
│   ├── program.js            # Hardcoded 6-Day PPL routine workout database
│   ├── stats.js              # LocalStorage statistics aggregator (volume, streak)
│   └── storage.js            # Getters & setters for LocalStorage
├── public/
│   ├── manifest.json         # PWA Manifest (Standalone Mode)
│   ├── icon-192.png          # PWA App Icon (192x192)
│   └── icon-512.png          # PWA App Icon (512x512)
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
