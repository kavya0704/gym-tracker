// ═══════════════════════════════════════════════════════════════
// lib/stats.js — Aggregate statistics from localStorage data
// ═══════════════════════════════════════════════════════════════
import {
  getWorkouts,
  getWeightLog,
  getPRs,
} from "./storage";

/**
 * Total number of completed workouts.
 */
export function getTotalWorkouts() {
  return getWorkouts().length;
}

/**
 * Total number of completed sets across all workouts.
 */
export function getTotalSets() {
  return getWorkouts().reduce((acc, w) => {
    return acc + (w.exercises || []).reduce((eAcc, e) => {
      return eAcc + (e.sets || []).filter((s) => s.done).length;
    }, 0);
  }, 0);
}

/**
 * Total training hours (rounded to 1 decimal place).
 */
export function getTotalHours() {
  const totalMins = getWorkouts().reduce((acc, w) => {
    return acc + (w.durationMins || 0);
  }, 0);
  return Math.round((totalMins / 60) * 10) / 10;
}

/**
 * Total number of PRs set.
 */
export function getTotalPRs() {
  return Object.keys(getPRs()).length;
}

/**
 * Current consecutive training day streak.
 * Counts back from today, each day must have at least 1 workout.
 * Rest days (type === "Rest") count toward streak.
 */
export function getCurrentStreak() {
  const workouts = getWorkouts();
  if (!workouts.length) return 0;

  // Build set of dates that have workouts
  const workoutDates = new Set(workouts.map((w) => w.date));

  let streak = 0;
  const today = new Date();

  for (let i = 0; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    if (workoutDates.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      // If today has no workout, check yesterday to start streak
      continue;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get weekly volume data for the last N weeks.
 * Returns array: [{ week, label, push, pull, legs, total }]
 */
export function getWeeklyVolume(numWeeks = 8) {
  const workouts = getWorkouts();
  const result = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let w = numWeeks - 1; w >= 0; w--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr   = weekEnd.toISOString().split("T")[0];

    const weekWorkouts = workouts.filter(
      (wo) => wo.date >= weekStartStr && wo.date <= weekEndStr
    );

    let push = 0, pull = 0, legs = 0;
    weekWorkouts.forEach((wo) => {
      const vol = getWorkoutVolume(wo);
      if (wo.type === "Push") push += vol;
      else if (wo.type === "Pull") pull += vol;
      else if (wo.type === "Legs") legs += vol;
    });

    // Short label: "Jun 14"
    const label = weekEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    result.push({
      week: numWeeks - w,
      label,
      push:  Math.round(push),
      pull:  Math.round(pull),
      legs:  Math.round(legs),
      total: Math.round(push + pull + legs),
    });
  }

  return result;
}

/**
 * Calculate total volume for a single workout object.
 * Volume = sum of (weight × reps) for all completed sets.
 */
export function getWorkoutVolume(workout) {
  return (workout.exercises || []).reduce((acc, ex) => {
    return acc + (ex.sets || []).reduce((sAcc, s) => {
      return sAcc + (s.done ? (s.weight || 0) * (s.reps || 0) : 0);
    }, 0);
  }, 0);
}

/**
 * Get workouts for the current week (Mon–Sun).
 * Returns { mon, tue, wed, thu, fri, sat, sun } each = workout or null
 */
export function getThisWeekWorkouts() {
  const workouts = getWorkouts();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const week = {};
  const dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayWorkouts = workouts.filter((w) => w.date === dateStr);
    week[dayNames[i]] = {
      date: dateStr,
      dayNum: d.getDate(),
      workouts: dayWorkouts,
      hasWorkout: dayWorkouts.length > 0,
      isToday: dateStr === today.toISOString().split("T")[0],
      isFuture: d > today,
    };
  }

  return week;
}

/**
 * Get previous best sets for an exercise from workout history.
 * Used to show grey reference numbers in active session.
 */
export function getPreviousSessionSets(exerciseName) {
  const workouts = getWorkouts();
  for (const workout of workouts) {
    const ex = (workout.exercises || []).find(
      (e) => e.name === exerciseName
    );
    if (ex && ex.sets && ex.sets.length > 0) {
      return ex.sets.filter((s) => s.done);
    }
  }
  return [];
}
