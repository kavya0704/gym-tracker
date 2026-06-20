// ═══════════════════════════════════════════════════════════════
// lib/program.js — Full 6-Day × 4-Phase PPL Program (Hardcoded)
// Source of truth for all workout content in the app
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────
// PHASE DEFINITIONS
// ─────────────────────────────────────────
export const PHASES = {
  1: {
    num: 1,
    name: "Foundation",
    weeks: "1–4",
    weekStart: 1,
    weekEnd: 4,
    goal: "Build base strength & fix movement patterns",
    focus: [
      "Learn correct form on all compound lifts",
      "Fix posture — chin tucks, wall angels daily",
      "Ankle mobility stage 1 (heel-elevated squats)",
      "Establish consistent 6-day training habit",
    ],
    macroKey: "phase1",
  },
  2: {
    num: 2,
    name: "Strength Base",
    weeks: "5–8",
    weekStart: 5,
    weekEnd: 8,
    goal: "Progressive overload + posture correction",
    focus: [
      "Add 2.5kg to compound lifts every week",
      "Flat-footed squats (ankle mobility stage 2)",
      "Improve upper-back strength for V-taper",
      "Track bodyweight weekly, aim for +0.5kg/week",
    ],
    macroKey: "phase2",
  },
  3: {
    num: 3,
    name: "Hypertrophy Push",
    weeks: "9–16",
    weekStart: 9,
    weekEnd: 16,
    goal: "Maximum muscle growth + aesthetic shaping",
    focus: [
      "Volume increase — prioritise Mind-Muscle Connection",
      "Deload every 4th week (reduce load 40%)",
      "Forearm training added (wrist curls + reverse curls)",
      "Waist stays controlled — no dirty bulk",
    ],
    macroKey: "phase3",
  },
  4: {
    num: 4,
    name: "Aesthetic Refinement",
    weeks: "17–52",
    weekStart: 17,
    weekEnd: 52,
    goal: "Lean bulk — size with low body fat for visible abs",
    focus: [
      "Strength PRs every 2–3 weeks on main lifts",
      "Visible abs: waist stays ≤32 inches",
      "V-taper: shoulder width grows, waist controlled",
      "Maintain 6-day PPL indefinitely",
    ],
    macroKey: "phase4",
  },
};

// ─────────────────────────────────────────
// MONTHLY MILESTONES
// ─────────────────────────────────────────
export const MILESTONES = [
  { month: 1, week: "1–4",  targetWeight: 69,   bench: 55,  ohp: 40,  pullups: 4,  squat: 60  },
  { month: 2, week: "5–8",  targetWeight: 70,   bench: 62,  ohp: 45,  pullups: 6,  squat: 70  },
  { month: 3, week: "9–12", targetWeight: 71,   bench: 67,  ohp: 50,  pullups: 8,  squat: 80  },
  { month: 4, week: "13–16",targetWeight: 71.5, bench: 72,  ohp: 52,  pullups: 10, squat: 87  },
  { month: 5, week: "17–20",targetWeight: 72,   bench: 77,  ohp: 55,  pullups: 12, squat: 95  },
  { month: 6, week: "21–24",targetWeight: 72.5, bench: 80,  ohp: 57,  pullups: 13, squat: 100 },
  { month: 9, week: "33–36",targetWeight: 74,   bench: 90,  ohp: 65,  pullups: 15, squat: 115 },
  { month: 12,week: "49–52",targetWeight: 76,   bench: 100, ohp: 72,  pullups: 18, squat: 130 },
];

// ─────────────────────────────────────────
// 6-DAY PPL PROGRAM
// ─────────────────────────────────────────
export const PPL_PROGRAM = {

  // ── DAY 1: PUSH A ─────────────────────
  push_a: {
    dayKey: "push_a",
    name: "Push A",
    label: "Chest & Shoulders",
    type: "Push",
    colorVar: "--purple",
    exercises: [
      {
        name: "Barbell Bench Press",
        muscle: "Chest",
        sets: 4, reps: "8–10", rest: 90, rpe: 7,
        cues: "Retract scapula, feet flat on floor, slight natural arch. Bar touches lower chest. Full ROM — don't bounce. Drive feet into floor on push.",
      },
      {
        name: "Incline Dumbbell Press",
        muscle: "Upper Chest",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Bench at 30–45°. Dumbbells at chest level, elbows slightly tucked (60°). Squeeze upper chest at top. Controlled 2s eccentric.",
      },
      {
        name: "Cable Fly",
        muscle: "Chest",
        sets: 3, reps: "12–15", rest: 60, rpe: 8,
        cues: "Slight forward lean. Arms slightly bent (soft elbow). Bring handles together in arc motion, squeeze at centre. Don't let weight pull you back.",
      },
      {
        name: "Overhead Press",
        muscle: "Shoulders",
        sets: 4, reps: "8–10", rest: 90, rpe: 7,
        cues: "Stand, feet hip-width. Bar at upper chest, grip just outside shoulders. Press straight up, slightly back at top. Don't lean back excessively.",
      },
      {
        name: "Dumbbell Lateral Raise",
        muscle: "Side Delts",
        sets: 3, reps: "15–20", rest: 45, rpe: 8,
        cues: "Slight forward lean. Lead with elbow, not wrist. Stop at shoulder height. Slow eccentric (3s down). Don't shrug.",
      },
      {
        name: "Tricep Pushdown",
        muscle: "Triceps",
        sets: 3, reps: "12–15", rest: 60, rpe: 7,
        cues: "Elbows pinned to sides. Full extension at bottom, don't let elbows flare. Squeeze tricep hard at lockout.",
      },
    ],
  },

  // ── DAY 2: PULL A ─────────────────────
  pull_a: {
    dayKey: "pull_a",
    name: "Pull A",
    label: "Back & Biceps",
    type: "Pull",
    colorVar: "--blue",
    exercises: [
      {
        name: "Pull-ups",
        muscle: "Back / Lats",
        sets: 4, reps: "Max (aim 6–10)", rest: 90, rpe: 8,
        cues: "Dead hang start. Pull elbows to hips, chest to bar. Retract scapula at top. Full hang at bottom. Use band assistance if needed early on.",
      },
      {
        name: "Barbell Row",
        muscle: "Mid Back",
        sets: 4, reps: "8–10", rest: 90, rpe: 7,
        cues: "Hinge at hips (45° torso). Pull bar to lower chest/upper abdomen. Drive elbows back, not up. Squeeze shoulder blades at top.",
      },
      {
        name: "Seated Cable Row",
        muscle: "Mid Back",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Sit upright. Full stretch at start. Pull to belly button. Squeeze shoulder blades together for 1s. Don't lean back to cheat the weight.",
      },
      {
        name: "Face Pull",
        muscle: "Rear Delts / Rotator Cuff",
        sets: 3, reps: "15–20", rest: 45, rpe: 7,
        cues: "Rope at head height. Pull to face, elbows flare out/up. External rotation at end position. Key for posture and rounded-shoulder correction.",
      },
      {
        name: "EZ Bar Bicep Curl",
        muscle: "Biceps",
        sets: 3, reps: "10–12", rest: 60, rpe: 7,
        cues: "Elbows stay at sides. Full ROM — dead hang to full squeeze. Slow eccentric (2s down). Don't swing body.",
      },
      {
        name: "Hammer Curl",
        muscle: "Biceps / Brachialis",
        sets: 3, reps: "12–15", rest: 45, rpe: 7,
        cues: "Neutral grip (thumbs up). Curl both arms simultaneously or alternating. Brachialis and brachioradialis emphasis — key for forearm thickness.",
      },
    ],
  },

  // ── DAY 3: LEGS A ─────────────────────
  legs_a: {
    dayKey: "legs_a",
    name: "Legs A",
    label: "Quad-Dominant",
    type: "Legs",
    colorVar: "--green",
    exercises: [
      {
        name: "Barbell Squat",
        muscle: "Quads / Glutes",
        sets: 4, reps: "8–10", rest: 120, rpe: 7,
        cues: "Bar on traps (not neck). Feet shoulder-width, toes out 30°. Sit back AND down. Knees track over toes. Break parallel. Drive through full foot on way up.",
      },
      {
        name: "Leg Press",
        muscle: "Quads / Glutes",
        sets: 3, reps: "10–12", rest: 90, rpe: 7,
        cues: "Feet high = more glutes. Feet low = more quads. Full ROM — don't lock knees. Don't let lower back lift off pad at bottom.",
      },
      {
        name: "Romanian Deadlift",
        muscle: "Hamstrings / Glutes",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Hinge at hip, soft knees. Bar stays close to legs. Feel hamstring stretch at bottom. Drive hips forward to stand. No lower-back rounding.",
      },
      {
        name: "Leg Extension",
        muscle: "Quads",
        sets: 3, reps: "12–15", rest: 60, rpe: 8,
        cues: "Slow eccentric (3s down). Pause and squeeze at top. Don't use momentum. Seated position — back straight, no arching.",
      },
      {
        name: "Standing Calf Raise",
        muscle: "Calves",
        sets: 4, reps: "15–20", rest: 45, rpe: 8,
        cues: "Full stretch at bottom (heel below platform). Slow up (2s), pause at top, slow down (3s). High reps work best for calves.",
      },
      {
        name: "Plank",
        muscle: "Core",
        sets: 3, reps: "45–60s", rest: 45, rpe: 7,
        cues: "Straight line from head to heels. Squeeze glutes, abs braced. Don't let hips sag or pike up. Breathe normally.",
      },
    ],
  },

  // ── DAY 4: PUSH B ─────────────────────
  push_b: {
    dayKey: "push_b",
    name: "Push B",
    label: "Shoulders & Triceps",
    type: "Push",
    colorVar: "--purple",
    exercises: [
      {
        name: "Seated Dumbbell OHP",
        muscle: "Shoulders",
        sets: 4, reps: "8–10", rest: 90, rpe: 7,
        cues: "Seated, back supported. Dumbbells at ear level. Press overhead, slight arc inward at top. Don't flare elbows excessively. Full lockout.",
      },
      {
        name: "Arnold Press",
        muscle: "All 3 Delt Heads",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Start with palms facing you at chin level. Rotate and press up simultaneously. Reverse on way down. Great for full shoulder development.",
      },
      {
        name: "Cable Lateral Raise",
        muscle: "Side Delts",
        sets: 3, reps: "15–20", rest: 45, rpe: 8,
        cues: "Cable at lowest setting, cross-body. Raise to shoulder height, elbow slightly bent. More constant tension than dumbbells. Great mind-muscle connection.",
      },
      {
        name: "Incline DB Fly",
        muscle: "Upper Chest",
        sets: 3, reps: "12–15", rest: 60, rpe: 7,
        cues: "Wide arc motion, slight bend in elbow throughout. Stretch at bottom, squeeze at top. Feel the stretch across pecs. Don't go too heavy.",
      },
      {
        name: "Overhead Tricep Extension",
        muscle: "Triceps (Long Head)",
        sets: 3, reps: "12–15", rest: 60, rpe: 7,
        cues: "EZ bar or rope overhead. Elbows stay pointing forward. Lower behind head, full stretch. Extend to lockout. Long head emphasis = more tricep size.",
      },
      {
        name: "Skull Crushers",
        muscle: "Triceps",
        sets: 3, reps: "10–12", rest: 60, rpe: 7,
        cues: "EZ bar. Lie flat. Lower bar to forehead (hence the name). Elbows stay vertical, don't flare. Full extension at top. Great for tricep size.",
      },
    ],
  },

  // ── DAY 5: PULL B ─────────────────────
  pull_b: {
    dayKey: "pull_b",
    name: "Pull B",
    label: "Back Thickness & Forearms",
    type: "Pull",
    colorVar: "--blue",
    exercises: [
      {
        name: "Conventional Deadlift",
        muscle: "Full Posterior Chain",
        sets: 4, reps: "5–6", rest: 120, rpe: 8,
        cues: "Bar over mid-foot, hip-width stance. Hinge to bar. Chest up, proud. Push floor away, then lock hips at top. Bar stays in contact with legs. No jerking.",
      },
      {
        name: "Chest-Supported Row",
        muscle: "Mid Back",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Chest on incline bench. Pulls with elbows, not biceps. Full stretch at bottom. Squeeze shoulder blades hard at top. Removes lower-back fatigue from rows.",
      },
      {
        name: "Lat Pulldown",
        muscle: "Lats",
        sets: 3, reps: "10–12", rest: 75, rpe: 7,
        cues: "Slight lean back. Pull bar to upper chest. Drive elbows to hips. Squeeze lats at bottom. Full arm extension at top (stretch lats).",
      },
      {
        name: "Barbell Shrug",
        muscle: "Traps",
        sets: 3, reps: "12–15", rest: 60, rpe: 7,
        cues: "Straight arms. Shrug straight up (not rolling). Hold for 1s at top. Slow eccentric. Traps = important for V-taper upper back appearance.",
      },
      {
        name: "Wrist Curl",
        muscle: "Forearms (Flexors)",
        sets: 3, reps: "15–20", rest: 30, rpe: 7,
        cues: "Sit on bench, forearms resting on thighs, palms up. Let bar roll to fingertips, then curl up. Full ROM. Essential for forearm thickness.",
      },
      {
        name: "Reverse Wrist Curl",
        muscle: "Forearms (Extensors)",
        sets: 3, reps: "15–20", rest: 30, rpe: 7,
        cues: "Same position, palms facing down. Curl bar up with extensor muscles on top of forearm. Balances forearm development, improves wrist health.",
      },
    ],
  },

  // ── DAY 6: LEGS B ─────────────────────
  legs_b: {
    dayKey: "legs_b",
    name: "Legs B",
    label: "Hamstrings & Abs",
    type: "Legs",
    colorVar: "--green",
    exercises: [
      {
        name: "Romanian Deadlift",
        muscle: "Hamstrings / Glutes",
        sets: 4, reps: "8–10", rest: 90, rpe: 8,
        cues: "Heavy hinge pattern. Feel deep hamstring stretch at bottom. Drive hips forward hard at top. Glutes squeeze at lockout. Bar stays close to legs.",
      },
      {
        name: "Leg Curl",
        muscle: "Hamstrings",
        sets: 3, reps: "12–15", rest: 60, rpe: 8,
        cues: "Seated or lying. Full ROM — extend completely, curl fully. Slow eccentric (3s down). Don't lift hips off pad. Key for hamstring isolation.",
      },
      {
        name: "Walking Lunge",
        muscle: "Quads / Glutes",
        sets: 3, reps: "12 each leg", rest: 75, rpe: 7,
        cues: "Big step forward. Back knee to inch off floor. Front shin vertical. Keep torso upright. Drive off front heel to step through.",
      },
      {
        name: "Hip Thrust",
        muscle: "Glutes",
        sets: 3, reps: "12–15", rest: 75, rpe: 7,
        cues: "Upper back on bench, bar over hips. Drive hips up, squeeze glutes hard at top. Chin tucked. Posterior pelvic tilt at top (don't hyperextend back).",
      },
      {
        name: "Ab Wheel Rollout",
        muscle: "Core / Abs",
        sets: 3, reps: "8–12", rest: 60, rpe: 8,
        cues: "Kneel. Roll out until body is near parallel, brace core hard. Roll back using abs — don't collapse. Start with partial range if needed. Build to full.",
      },
      {
        name: "Cable Crunch",
        muscle: "Abs",
        sets: 3, reps: "15–20", rest: 45, rpe: 7,
        cues: "Kneel, rope at top. Hold rope at sides of head. Crunch elbows to knees — SPINE FLEXION, not hip flexion. Squeeze abs hard at bottom.",
      },
    ],
  },

  // ── DAY 7: REST ───────────────────────
  rest: {
    dayKey: "rest",
    name: "Rest",
    label: "Active Recovery",
    type: "Rest",
    colorVar: "--text-3",
    exercises: [],
  },
};

// ─────────────────────────────────────────
// WEEKLY ROTATION (Mon=0 … Sun=6)
// ─────────────────────────────────────────
export const WEEK_ROTATION = [
  "push_a",   // Monday
  "pull_a",   // Tuesday
  "legs_a",   // Wednesday
  "push_b",   // Thursday
  "pull_b",   // Friday
  "legs_b",   // Saturday
  "rest",     // Sunday
];

// ─────────────────────────────────────────
// POSTURE ROUTINE (Daily)
// ─────────────────────────────────────────
export const POSTURE_ROUTINE = [
  {
    key: "chin_tuck",
    name: "Chin Tucks",
    sets: "3 × 15 reps",
    note: "Retract chin — create a double chin. Lengthens cervical spine.",
  },
  {
    key: "wall_angels",
    name: "Wall Angels",
    sets: "3 × 10 reps",
    note: "Back flat against wall. Slide arms up and down like a snow angel. Fixes rounded shoulders.",
  },
  {
    key: "band_pull_aparts",
    name: "Band Pull-Aparts",
    sets: "3 × 20 reps",
    note: "Hold resistance band at chest. Pull apart to T position. Squeezes rear delts and mid-back.",
  },
  {
    key: "doorframe_stretch",
    name: "Doorframe Chest Stretch",
    sets: "60s each side",
    note: "Forearm on doorframe, lean through. Opens chest, counteracts desk posture.",
  },
];

// ─────────────────────────────────────────
// ANKLE MOBILITY PROGRESSION (4 Stages)
// ─────────────────────────────────────────
export const ANKLE_MOBILITY = [
  {
    stage: 1,
    name: "Heel-Elevated Squat",
    duration: "Weeks 1–4",
    desc: "Place 2.5kg plates under heels. Perform all squats with elevation. Focus on hitting depth.",
  },
  {
    stage: 2,
    name: "Partial Flat-Foot Squat",
    duration: "Weeks 5–8",
    desc: "Remove plates, but only descend as far as flat-foot allows. Gradually increase depth each week.",
  },
  {
    stage: 3,
    name: "Full Depth Flat-Foot",
    duration: "Weeks 9–16",
    desc: "Full depth squat, flat-footed. May still need slight stance width adjustment.",
  },
  {
    stage: 4,
    name: "Narrow Stance Squat",
    duration: "Week 17+",
    desc: "Narrow stance, full depth, flat-foot. Optimal squat mechanics achieved.",
  },
];

// ─────────────────────────────────────────
// SUPPLEMENT LIST
// ─────────────────────────────────────────
export const SUPPLEMENTS = [
  {
    key: "creatine",
    name: "Creatine Monohydrate",
    dose: "5g",
    timing: "Any time — consistency matters more than timing",
    icon: "💪",
    required: true,
  },
  {
    key: "vitd",
    name: "Vitamin D3",
    dose: "1000–2000 IU",
    timing: "With a fatty meal (fat-soluble)",
    icon: "☀️",
    required: true,
  },
  {
    key: "omega3",
    name: "Omega-3 Fish Oil",
    dose: "2 capsules",
    timing: "With meals — reduces soreness, improves recovery",
    icon: "🐟",
    required: true,
  },
  {
    key: "magnesium",
    name: "Magnesium Glycinate",
    dose: "400mg",
    timing: "30 min before bed — improves sleep quality",
    icon: "🌙",
    required: true,
  },
  {
    key: "ashwagandha",
    name: "Ashwagandha KSM-66",
    dose: "300–600mg",
    timing: "With food — reduces cortisol, optional but beneficial",
    icon: "🌿",
    required: false,
  },
];

// ─────────────────────────────────────────
// CHECKLIST ITEMS
// ─────────────────────────────────────────
export const DAILY_CHECKLIST = [
  { key: "posture",   label: "Posture Routine Done",    note: "Chin tucks + wall angels + band pull-aparts + doorframe stretch" },
  { key: "mobility",  label: "Ankle Mobility Work",     note: "Stage-appropriate squat practice (5–10 min)" },
  { key: "hydration", label: "2.5–3L Water Consumed",   note: "Spread throughout day, more on training days" },
  { key: "sleep",     label: "7–8 Hours Sleep",         note: "Most muscle growth happens while you sleep" },
  { key: "steps",     label: "7,000+ Steps Today",      note: "Active recovery, keeps metabolism healthy" },
];

// ─────────────────────────────────────────
// KEY LIFT LIST (for PR tracking)
// ─────────────────────────────────────────
export const KEY_LIFTS = [
  { name: "Barbell Bench Press",  muscle: "Chest",       unit: "kg"   },
  { name: "Overhead Press",       muscle: "Shoulders",   unit: "kg"   },
  { name: "Pull-ups",             muscle: "Back / Lats", unit: "reps" },
  { name: "Barbell Row",          muscle: "Mid Back",    unit: "kg"   },
  { name: "Barbell Squat",        muscle: "Quads",       unit: "kg"   },
  { name: "Conventional Deadlift",muscle: "Full Body",   unit: "kg"   },
  { name: "Incline Dumbbell Press",muscle: "Upper Chest",unit: "kg"   },
  { name: "Romanian Deadlift",    muscle: "Hamstrings",  unit: "kg"   },
];

// ─────────────────────────────────────────
// HELPER: Get today's day key from start date
// ─────────────────────────────────────────
export function getTodayDayKey(startDate) {
  if (!startDate) return "push_a";
  const start = new Date(startDate);
  const today = new Date();
  // Reset to start of day
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const idx = ((daysSinceStart % 7) + 7) % 7; // handles negative
  return WEEK_ROTATION[idx];
}

// ─────────────────────────────────────────
// HELPER: Get day key for specific date
// ─────────────────────────────────────────
export function getDayKeyForDate(startDate, targetDate) {
  if (!startDate) return "push_a";
  const start = new Date(startDate);
  const target = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const daysSinceStart = Math.floor((target - start) / (1000 * 60 * 60 * 24));
  const idx = ((daysSinceStart % 7) + 7) % 7;
  return WEEK_ROTATION[idx];
}
