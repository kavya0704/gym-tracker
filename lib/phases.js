// ═══════════════════════════════════════════════════════════════
// lib/phases.js — Phase detection and progress calculation
// ═══════════════════════════════════════════════════════════════
import { PHASES } from "./program";

/**
 * Get the current phase and progress based on program start date.
 * @param {string} startDate — ISO date string e.g. "2026-06-20"
 * @returns {object} Current phase data
 */
export function getCurrentPhase(startDate) {
  if (!startDate) {
    return buildPhaseResult(1, 1);
  }

  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const weekNum = Math.max(1, Math.floor(daysSinceStart / 7) + 1);

  let phaseNum = 4;
  if (weekNum <= 4)  phaseNum = 1;
  else if (weekNum <= 8)  phaseNum = 2;
  else if (weekNum <= 16) phaseNum = 3;
  else phaseNum = 4;

  return buildPhaseResult(phaseNum, weekNum);
}

function buildPhaseResult(phaseNum, weekNum) {
  const phase = PHASES[phaseNum];
  const phaseWeekStart = phase.weekStart;
  const phaseWeekEnd   = phase.weekEnd;
  const totalPhaseWeeks = phaseWeekEnd - phaseWeekStart + 1;
  const weeksIntoPhase  = Math.min(
    Math.max(weekNum - phaseWeekStart + 1, 0),
    totalPhaseWeeks
  );
  const progressPct = Math.min(
    Math.round((weeksIntoPhase / totalPhaseWeeks) * 100),
    100
  );

  return {
    phaseNum,
    name:        phase.name,
    weeks:       phase.weeks,
    weekNum:     Math.min(weekNum, 52),
    goal:        phase.goal,
    focus:       phase.focus,
    macroKey:    phase.macroKey,
    progressPct,
    weeksIntoPhase,
    totalPhaseWeeks,
    weekStart:   phaseWeekStart,
    weekEnd:     phaseWeekEnd,
  };
}

/**
 * Get phase number for any given week number (1–52+).
 */
export function getPhaseForWeek(weekNum) {
  if (weekNum <= 4)  return 1;
  if (weekNum <= 8)  return 2;
  if (weekNum <= 16) return 3;
  return 4;
}

/**
 * Get the week number from a start date.
 */
export function getWeekNumber(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const days = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(days / 7) + 1);
}
