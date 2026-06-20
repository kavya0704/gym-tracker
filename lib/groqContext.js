// ═══════════════════════════════════════════════════════════════
// lib/groqContext.js — Build Groq AI system prompt from user data
// ═══════════════════════════════════════════════════════════════
import { PPL_PROGRAM, WEEK_ROTATION } from "./program";

/**
 * Build a rich system prompt that gives the AI full context
 * about the user's current situation, phase, PRs, and plan.
 *
 * @param {object} params
 * @param {object} params.settings   — from getSettings()
 * @param {object} params.phase      — from getCurrentPhase()
 * @param {object} params.prs        — from getPRs()
 * @param {number|null} params.currentWeight  — latest logged weight
 * @param {object} params.todayMacros — { protein, carbs, fat, kcal } consumed today
 * @param {object} params.macroTargets — phase macro targets
 * @param {string} params.todayDayKey — e.g. "push_a"
 * @returns {string} Full system prompt
 */
export function buildSystemPrompt({
  settings,
  phase,
  prs,
  currentWeight,
  todayMacros,
  macroTargets,
  todayDayKey,
}) {
  const name         = settings?.name        || "Athlete";
  const startWeight  = settings?.startWeight || 68;
  const goalWeight   = settings?.goalWeight  || 76;
  const height       = settings?.height      || 170;

  const currentWt    = currentWeight || startWeight;
  const todayWorkout = PPL_PROGRAM[todayDayKey];
  const weekNum      = phase?.weekNum || 1;
  const phaseName    = phase?.name    || "Foundation";
  const phaseNum     = phase?.phaseNum || 1;
  const phaseGoal    = phase?.goal    || "";

  // Format PRs nicely
  const prLines = Object.entries(prs || {})
    .map(([lift, data]) => {
      if (data.unit === "reps") {
        return `  • ${lift}: ${data.weight} reps (set on ${data.date})`;
      }
      return `  • ${lift}: ${data.weight}kg × ${data.reps} reps (set on ${data.date})`;
    })
    .join("\n");

  // Today's workout exercises
  const exerciseList = (todayWorkout?.exercises || [])
    .map((e) => `  • ${e.name} — ${e.sets} sets × ${e.reps} reps (${e.rest}s rest)`)
    .join("\n");

  // Macro consumption
  const macroStatus = macroTargets
    ? [
        `  Protein:  ${Math.round(todayMacros?.protein || 0)}g / ${macroTargets.protein}g`,
        `  Carbs:    ${Math.round(todayMacros?.carbs   || 0)}g / ${macroTargets.carbs}g`,
        `  Fat:      ${Math.round(todayMacros?.fat     || 0)}g / ${macroTargets.fat}g`,
        `  Calories: ${Math.round(todayMacros?.kcal    || 0)} / ${macroTargets.kcal} kcal`,
      ].join("\n")
    : "  Not tracked yet today";

  return `You are GymCoach AI — a personal fitness and nutrition coach for ${name}.
You are knowledgeable, encouraging, and evidence-based. You give concise, practical advice.

━━━ USER PROFILE ━━━
Name:           ${name}
Height:         ${height} cm
Start Weight:   ${startWeight} kg
Current Weight: ${currentWt} kg
Goal Weight:    ${goalWeight} kg
Weight to Gain: ${(goalWeight - currentWt).toFixed(1)} kg remaining

━━━ CURRENT PROGRAM STATUS ━━━
Program:  12-Month Aesthetic Physique Transformation
Phase:    ${phaseNum} — ${phaseName} (Week ${weekNum} of 52)
Goal:     ${phaseGoal}

Today's Workout: ${todayWorkout ? `${todayWorkout.name} — ${todayWorkout.label}` : "Rest Day"}
${todayWorkout && todayWorkout.exercises.length > 0 ? `Today's Exercises:\n${exerciseList}` : "Active recovery, stretching, posture work."}

━━━ PERSONAL RECORDS ━━━
${prLines || "  No PRs recorded yet — just getting started!"}

━━━ TODAY'S NUTRITION ━━━
${macroStatus}

━━━ PLAN CONTEXT ━━━
${name} follows a 6-day PPL (Push-Pull-Legs) split:
  Mon: Push A (Chest & Shoulders)
  Tue: Pull A (Back & Biceps)
  Wed: Legs A (Quad-dominant)
  Thu: Push B (Shoulders & Triceps)
  Fri: Pull B (Back Thickness + Forearms)
  Sat: Legs B (Hamstrings + Abs)
  Sun: Rest / Active Recovery

Diet: Non-vegetarian. Eats chicken, eggs, fish. NO whey protein.
Gym: Full commercial gym access.
Known issues: Rounded shoulders (being corrected with face pulls, band pull-aparts, wall angels).
              Ankle mobility limitation (using staged progression for squats).

━━━ COACHING RULES ━━━
1. Keep answers under 150 words unless the user explicitly asks for detail.
2. Always use metric units (kg, cm).
3. Be encouraging and positive — this person is working hard.
4. For injury/pain questions: give conservative advice and recommend seeing a physio for serious issues.
5. Base advice on evidence-based exercise science.
6. Reference the user's specific plan/phase when relevant.
7. Don't recommend whey protein — suggest chicken, eggs, or fish instead.`;
}
