// ═══════════════════════════════════════════════════════════════
// lib/storage.js — localStorage CRUD helpers
// All data lives in the browser. No backend DB required.
// ═══════════════════════════════════════════════════════════════

const KEYS = {
  SETTINGS:     "gt_settings",
  WORKOUTS:     "gt_workouts",
  WEIGHT_LOG:   "gt_weight_log",
  MEASUREMENTS: "gt_measurements",
  MEALS:        "gt_meals",
  SUPPLEMENTS:  "gt_supplements",
  CHECKLIST:    "gt_checklist",
  PRS:          "gt_prs",
};

// ─── Safe JSON helpers ────────────────────
function safeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage write failed:", e);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── SETTINGS ─────────────────────────────
export const DEFAULT_SETTINGS = {
  name: "Athlete",
  startWeight: 68,
  goalWeight: 76,
  height: 170,
  startDate: new Date().toISOString().split("T")[0],
  groqApiKey: "",
};

export function getSettings() {
  const saved = safeGet(KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...saved };
}

export function saveSettings(obj) {
  const current = getSettings();
  safeSet(KEYS.SETTINGS, { ...current, ...obj });
}

// ─── WORKOUTS ─────────────────────────────
export function getWorkouts() {
  return safeGet(KEYS.WORKOUTS, []);
}

export function addWorkout(workoutObj) {
  const workouts = getWorkouts();
  const newWorkout = {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    ...workoutObj,
  };
  workouts.unshift(newWorkout); // newest first
  safeSet(KEYS.WORKOUTS, workouts);
  return newWorkout;
}

export function deleteWorkout(id) {
  const workouts = getWorkouts().filter((w) => w.id !== id);
  safeSet(KEYS.WORKOUTS, workouts);
}

export function getWorkoutsForDate(date) {
  return getWorkouts().filter((w) => w.date === date);
}

export function getWorkoutsInRange(startDate, endDate) {
  return getWorkouts().filter((w) => w.date >= startDate && w.date <= endDate);
}

// ─── WEIGHT LOG ───────────────────────────
export function getWeightLog() {
  return safeGet(KEYS.WEIGHT_LOG, []);
}

export function addWeightEntry({ date, weight }) {
  const log = getWeightLog();
  // Replace entry for same date if exists
  const idx = log.findIndex((e) => e.date === date);
  const entry = { date, weight: parseFloat(weight) };
  if (idx >= 0) {
    log[idx] = entry;
  } else {
    log.push(entry);
  }
  // Sort chronologically
  log.sort((a, b) => a.date.localeCompare(b.date));
  safeSet(KEYS.WEIGHT_LOG, log);
}

export function getLatestWeight() {
  const log = getWeightLog();
  if (!log.length) return null;
  return log[log.length - 1].weight;
}

// ─── MEASUREMENTS ─────────────────────────
export function getMeasurements() {
  return safeGet(KEYS.MEASUREMENTS, []);
}

export function addMeasurement(obj) {
  const list = getMeasurements();
  const entry = {
    id: generateId(),
    date: obj.date || new Date().toISOString().split("T")[0],
    chest:      parseFloat(obj.chest)      || 0,
    waist:      parseFloat(obj.waist)      || 0,
    arms:       parseFloat(obj.arms)       || 0,
    forearms:   parseFloat(obj.forearms)   || 0,
    thighs:     parseFloat(obj.thighs)     || 0,
    shoulders:  parseFloat(obj.shoulders)  || 0,
  };
  list.push(entry);
  list.sort((a, b) => a.date.localeCompare(b.date));
  safeSet(KEYS.MEASUREMENTS, list);
}

export function getLatestMeasurements() {
  const list = getMeasurements();
  return list.length ? list[list.length - 1] : null;
}

export function getFirstMeasurements() {
  const list = getMeasurements();
  return list.length ? list[0] : null;
}

// ─── MEALS ────────────────────────────────
export function getMeals(date) {
  const all = safeGet(KEYS.MEALS, []);
  if (date) return all.filter((m) => m.date === date);
  return all;
}

export function addMeal({ date, name, protein, carbs, fat }) {
  const all = safeGet(KEYS.MEALS, []);
  const p = parseFloat(protein) || 0;
  const c = parseFloat(carbs)   || 0;
  const f = parseFloat(fat)     || 0;
  const entry = {
    id: generateId(),
    date: date || new Date().toISOString().split("T")[0],
    name,
    protein: p,
    carbs:   c,
    fat:     f,
    kcal:    Math.round(p * 4 + c * 4 + f * 9),
  };
  all.push(entry);
  safeSet(KEYS.MEALS, all);
  return entry;
}

export function deleteMeal(id) {
  const all = safeGet(KEYS.MEALS, []).filter((m) => m.id !== id);
  safeSet(KEYS.MEALS, all);
}

export function getTodayMealTotals(date) {
  const meals = getMeals(date);
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + m.protein,
      carbs:   acc.carbs   + m.carbs,
      fat:     acc.fat     + m.fat,
      kcal:    acc.kcal    + m.kcal,
    }),
    { protein: 0, carbs: 0, fat: 0, kcal: 0 }
  );
}

// ─── SUPPLEMENTS ──────────────────────────
export function getSupplements(date) {
  const all = safeGet(KEYS.SUPPLEMENTS, {});
  return all[date] || {};
}

export function toggleSupplement(date, key) {
  const all = safeGet(KEYS.SUPPLEMENTS, {});
  if (!all[date]) all[date] = {};
  all[date][key] = !all[date][key];
  safeSet(KEYS.SUPPLEMENTS, all);
  return all[date][key];
}

// ─── DAILY CHECKLIST ──────────────────────
export function getChecklist(date) {
  const all = safeGet(KEYS.CHECKLIST, {});
  return all[date] || {};
}

export function toggleChecklist(date, key) {
  const all = safeGet(KEYS.CHECKLIST, {});
  if (!all[date]) all[date] = {};
  all[date][key] = !all[date][key];
  safeSet(KEYS.CHECKLIST, all);
  return all[date][key];
}

export function getChecklistCompletion(date) {
  const checklist = getChecklist(date);
  const total = 5; // hardcoded 5 items
  const done = Object.values(checklist).filter(Boolean).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

// ─── PERSONAL RECORDS ─────────────────────
export function getPRs() {
  return safeGet(KEYS.PRS, {});
}

export function updatePR(exerciseName, weight, reps, date) {
  const prs = getPRs();
  const existing = prs[exerciseName];
  const isNew = !existing || weight > existing.weight;
  if (isNew) {
    prs[exerciseName] = {
      weight: parseFloat(weight),
      reps:   parseInt(reps) || 1,
      date:   date || new Date().toISOString().split("T")[0],
    };
    safeSet(KEYS.PRS, prs);
  }
  return isNew;
}

export function getPreviousBest(exerciseName) {
  const prs = getPRs();
  return prs[exerciseName] || null;
}

// ─── RESET ALL DATA ───────────────────────
export function resetAllData() {
  Object.values(KEYS).forEach((key) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  });
}
