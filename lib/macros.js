// ═══════════════════════════════════════════════════════════════
// lib/macros.js — Phase-aware macro targets
// Based on 12-month manual for non-vegetarian, no-whey diet
// ═══════════════════════════════════════════════════════════════

export const MACRO_TARGETS = {
  phase1: {
    label:   "Phase 1 — Foundation",
    protein: 150,  // g — ~2.2g per kg bodyweight (68kg)
    carbs:   200,  // g
    fat:     55,   // g
    kcal:    1895, // Slight surplus for muscle gain without fat
    notes:   "Focus on hitting protein first. Carbs around training. Don't dirty bulk.",
    meals: [
      { time: "Pre-workout (6am)", desc: "2 whole eggs + 1 banana + black coffee" },
      { time: "Post-workout (8am)", desc: "150g chicken breast + 1 cup rice + greens" },
      { time: "Lunch (1pm)", desc: "150g fish (tuna/salmon) + 2 chapatis + sabzi" },
      { time: "Snack (4pm)", desc: "3 boiled eggs OR paneer 100g + fruits" },
      { time: "Dinner (7pm)", desc: "150g chicken + dal + 1 cup rice/roti" },
    ],
  },
  phase2: {
    label:   "Phase 2 — Strength Base",
    protein: 160,
    carbs:   220,
    fat:     60,
    kcal:    2040,
    notes:   "Increase carbs on heavy training days. More rice/roti pre/post workout.",
    meals: [
      { time: "Pre-workout (6am)", desc: "3 whole eggs + oats 50g + banana" },
      { time: "Post-workout (8am)", desc: "200g chicken breast + 1.5 cups rice + greens" },
      { time: "Lunch (1pm)", desc: "150g fish + 2 rotis + dal" },
      { time: "Snack (4pm)", desc: "4 boiled eggs + apple" },
      { time: "Dinner (7pm)", desc: "200g chicken + veggies + 1 cup rice" },
    ],
  },
  phase3: {
    label:   "Phase 3 — Hypertrophy Push",
    protein: 175,
    carbs:   250,
    fat:     65,
    kcal:    2265,
    notes:   "Volume is high — fuel it. Pre-workout carb meal is non-negotiable.",
    meals: [
      { time: "Pre-workout (6am)", desc: "4 eggs + 60g oats + banana + black coffee" },
      { time: "Post-workout (8am)", desc: "200g chicken + 2 cups rice + dal" },
      { time: "Lunch (1pm)", desc: "200g fish + 2 rotis + salad" },
      { time: "Snack (4pm)", desc: "4 boiled eggs + nuts 30g + fruit" },
      { time: "Dinner (7pm)", desc: "200g chicken + 2 rotis + sabzi" },
    ],
  },
  phase4: {
    label:   "Phase 4 — Aesthetic Refinement",
    protein: 180,
    carbs:   270,
    fat:     70,
    kcal:    2430,
    notes:   "Lean bulk phase. Track bodyweight weekly. +0.25–0.5kg/week is ideal.",
    meals: [
      { time: "Pre-workout (6am)", desc: "4 eggs + 70g oats + banana + coffee" },
      { time: "Post-workout (8am)", desc: "250g chicken + 2 cups rice + greens" },
      { time: "Lunch (1pm)", desc: "200g salmon/fish + 3 rotis + dal" },
      { time: "Snack (4pm)", desc: "5 boiled eggs OR 200g paneer + fruits" },
      { time: "Dinner (7pm)", desc: "250g chicken + veggies + 1.5 cups rice" },
    ],
  },
};

/**
 * Get macro targets for a given phase number.
 * @param {number} phaseNum — 1, 2, 3, or 4
 * @returns {object} Macro targets
 */
export function getMacroTargets(phaseNum) {
  const key = `phase${phaseNum}`;
  return MACRO_TARGETS[key] || MACRO_TARGETS.phase1;
}

/**
 * Calculate macros as percentage of calories.
 * @param {object} macros — { protein, carbs, fat }
 */
export function getMacroPercentages(macros) {
  const { protein, carbs, fat } = macros;
  const total = protein * 4 + carbs * 4 + fat * 9;
  return {
    protein: Math.round(((protein * 4) / total) * 100),
    carbs:   Math.round(((carbs   * 4) / total) * 100),
    fat:     Math.round(((fat     * 9) / total) * 100),
  };
}
