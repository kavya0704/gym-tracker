'use client';
// components/modals/WorkoutSessionModal.jsx — Full-screen active workout logging

import { useState, useEffect, useRef } from 'react';
import { getSettings, addWorkout, updatePR, getPreviousBest } from '@/lib/storage';
import { getTodayDayKey, PPL_PROGRAM } from '@/lib/program';
import { showToast } from '@/components/shared/Toast';
import RestTimerModal from './RestTimerModal';
import WorkoutSummaryModal from './WorkoutSummaryModal';

function formatTimer(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function SetRow({ set, onUpdate, onDone, isPR }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px',
      opacity: set.done ? 0.7 : 1,
      transition:'opacity 200ms',
    }}>
      <span style={{ width:'24px', fontSize:'12px', color:'var(--text-3)', fontVariantNumeric:'tabular-nums', flexShrink:0, textAlign:'center' }}>
        {set.setNum}
      </span>
      <input
        className="set-input"
        type="number" inputMode="decimal"
        placeholder="kg" step="2.5" min="0"
        value={set.weight}
        onChange={(e) => onUpdate({ ...set, weight: e.target.value })}
        disabled={set.done}
        aria-label={`Set ${set.setNum} weight`}
      />
      <span style={{ color:'var(--text-3)', fontSize:'14px' }}>×</span>
      <input
        className="set-input"
        type="number" inputMode="numeric"
        placeholder="reps" min="1"
        value={set.reps}
        onChange={(e) => onUpdate({ ...set, reps: e.target.value })}
        disabled={set.done}
        aria-label={`Set ${set.setNum} reps`}
      />
      <button
        onClick={() => !set.done && onDone(set)}
        style={{
          width:'36px', height:'36px', borderRadius:'8px', flexShrink:0,
          background: set.done ? 'var(--green)' : 'var(--surface-3)',
          border: set.done ? 'none' : '1.5px solid var(--border-3)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor: set.done ? 'default' : 'pointer',
          transition:'all 200ms var(--ease-spring)',
        }}
        aria-label={set.done ? 'Set completed' : 'Complete set'}
      >
        {set.done ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>
      {isPR && <span style={{ fontSize:'11px', color:'var(--amber)', fontWeight:700, flexShrink:0 }}>⭐ PR</span>}
    </div>
  );
}

function ExerciseCard({ exercise, exIndex, onUpdateSets }) {
  const prevBest = getPreviousBest(exercise.name);

  function handleSetUpdate(updatedSet) {
    const newSets = exercise.sets.map(s => s.setNum === updatedSet.setNum ? updatedSet : s);
    onUpdateSets(exIndex, newSets);
  }

  function addSet() {
    const last = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      setNum: exercise.sets.length + 1,
      weight: last?.weight || '',
      reps:   last?.reps   || '',
      done:   false,
    };
    onUpdateSets(exIndex, [...exercise.sets, newSet]);
  }

  function checkIsPR(set) {
    if (!prevBest || !set.weight) return false;
    return parseFloat(set.weight) > prevBest.weight;
  }

  return (
    <div className="card" style={{ marginBottom:'12px' }}>
      <div style={{ marginBottom:'12px' }}>
        <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-1)' }}>
          {exercise.name}
        </h3>
        <div style={{ display:'flex', gap:'8px', alignItems:'center', marginTop:'4px' }}>
          <span style={{ fontSize:'12px', color:'var(--text-3)' }}>{exercise.muscle}</span>
          <span style={{ fontSize:'12px', color:'var(--text-3)' }}>·</span>
          <span style={{ fontSize:'12px', color:'var(--text-3)' }}>{exercise.sets.length}×{exercise.reps}</span>
          {prevBest && (
            <>
              <span style={{ fontSize:'12px', color:'var(--text-3)' }}>·</span>
              <span style={{ fontSize:'12px', color:'var(--purple-light)' }}>
                Best: {prevBest.weight}kg × {prevBest.reps}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Set header */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'6px', paddingLeft:'30px' }}>
        <span style={{ width:'72px', fontSize:'11px', color:'var(--text-3)', textAlign:'center', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase' }}>KG</span>
        <span style={{ width:'16px' }} />
        <span style={{ width:'72px', fontSize:'11px', color:'var(--text-3)', textAlign:'center', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase' }}>REPS</span>
      </div>

      {exercise.sets.map(set => (
        <SetRow
          key={set.setNum}
          set={set}
          onUpdate={handleSetUpdate}
          onDone={(s) => {
            if (!s.weight || !s.reps) { showToast('Enter weight and reps first', 'error'); return; }
            handleSetUpdate({ ...s, done: true });
          }}
          isPR={set.done && checkIsPR(set)}
        />
      ))}

      <button
        onClick={addSet}
        className="btn-ghost"
        style={{ marginTop:'8px', fontSize:'13px', color:'var(--text-3)', gap:'6px' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add Set
      </button>
    </div>
  );
}

export default function WorkoutSessionModal({ onClose, onFinished, dayKeyOverride }) {
  const [elapsedSecs,  setElapsedSecs]  = useState(0);
  const [exercises,    setExercises]    = useState([]);
  const [dayInfo,      setDayInfo]      = useState(null);
  const [restOpen,     setRestOpen]     = useState(false);
  const [restSecs,     setRestSecs]     = useState(90);
  const [summaryData,  setSummaryData]  = useState(null);
  const startTimeRef = useRef(Date.now());

  // Init: load today's workout
  useEffect(() => {
    const s      = getSettings();
    const dayKey = dayKeyOverride || getTodayDayKey(s.startDate);
    const day    = PPL_PROGRAM[dayKey];
    setDayInfo({ dayKey, ...day });

    // Build exercise list with empty sets
    const exList = (day.exercises || []).map(ex => ({
      ...ex,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNum: i + 1,
        weight: '',
        reps:   '',
        done:   false,
      })),
    }));
    setExercises(exList);
  }, [dayKeyOverride]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSecs(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live volume
  const totalVolume = exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => {
      return sAcc + (s.done ? (parseFloat(s.weight)||0) * (parseInt(s.reps)||0) : 0);
    }, 0);
  }, 0);

  function handleUpdateSets(exIndex, newSets) {
    const updated = [...exercises];
    updated[exIndex] = { ...updated[exIndex], sets: newSets };
    setExercises(updated);

    // Auto-open rest timer when a set is just checked
    const justDone = newSets.find((s, i) => s.done && !exercises[exIndex].sets[i]?.done);
    if (justDone) {
      setRestSecs(exercises[exIndex].rest || 90);
      setRestOpen(true);
    }
  }

  function handleFinish() {
    const durationMins = Math.round(elapsedSecs / 60);
    const cleanedExercises = exercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => s.done && s.weight && s.reps).map(s => ({
        ...s, weight: parseFloat(s.weight), reps: parseInt(s.reps),
      })),
    })).filter(ex => ex.sets.length > 0);

    if (!cleanedExercises.length) {
      showToast('Log at least one set before finishing', 'error'); return;
    }

    // Detect new PRs
    const newPRs = [];
    cleanedExercises.forEach(ex => {
      const maxSet = ex.sets.reduce((best, s) => (!best || s.weight > best.weight ? s : best), null);
      if (maxSet) {
        const isNew = updatePR(ex.name, maxSet.weight, maxSet.reps);
        if (isNew) newPRs.push(ex.name);
      }
    });

    const workout = addWorkout({
      dayKey:       dayInfo.dayKey,
      name:         `${dayInfo.name} — ${dayInfo.label}`,
      type:         dayInfo.type,
      startTime:    startTimeRef.current,
      endTime:      Date.now(),
      durationMins,
      totalVolume:  Math.round(totalVolume),
      exercises:    cleanedExercises,
      newPRs,
    });

    window.dispatchEvent(new CustomEvent('workoutCompleted', { detail: workout }));
    setSummaryData({ workout, newPRs, durationMins, totalVolume });
  }

  if (summaryData) {
    return (
      <WorkoutSummaryModal
        data={summaryData}
        onClose={onFinished}
      />
    );
  }

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.panel}>
          {/* Header */}
          <div style={styles.header}>
            <button className="btn-ghost" onClick={onClose} style={{ padding:'8px', color:'var(--text-2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'17px', fontWeight:700, color:'var(--text-1)' }}>
                {dayInfo?.name || 'Session'}
              </p>
              <p style={{ fontSize:'12px', color:'var(--text-3)' }}>{dayInfo?.label}</p>
            </div>
            <button className="btn-primary-sm" onClick={handleFinish}>
              Finish
            </button>
          </div>

          {/* Stats bar */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statVal}>{formatTimer(elapsedSecs)}</span>
              <span style={styles.statLbl}>TIME</span>
            </div>
            <div style={{ width:'1px', background:'var(--border)', height:'28px' }} />
            <div style={styles.statItem}>
              <span style={styles.statVal}>{Math.round(totalVolume).toLocaleString()} kg</span>
              <span style={styles.statLbl}>VOLUME</span>
            </div>
            <div style={{ width:'1px', background:'var(--border)', height:'28px' }} />
            <div style={styles.statItem}>
              <span style={styles.statVal}>
                {exercises.reduce((a,ex) => a + ex.sets.filter(s => s.done).length, 0)}
              </span>
              <span style={styles.statLbl}>SETS</span>
            </div>
          </div>

          {/* Exercise list */}
          <div style={styles.scroll}>
            {exercises.map((ex, i) => (
              <ExerciseCard
                key={i}
                exercise={ex}
                exIndex={i}
                onUpdateSets={handleUpdateSets}
              />
            ))}
            <div style={{ height:'24px' }} />
          </div>
        </div>
      </div>

      {restOpen && (
        <RestTimerModal
          initialSecs={restSecs}
          onClose={() => setRestOpen(false)}
        />
      )}
    </>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'var(--bg)',
    zIndex:200,
    display:'flex', flexDirection:'column',
    maxWidth:'var(--max-width)',
    margin:'0 auto',
  },
  panel: {
    display:'flex', flexDirection:'column',
    height:'100dvh',
    paddingTop:'env(safe-area-inset-top, 0px)',
    paddingBottom:'env(safe-area-inset-bottom, 0px)',
  },
  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'12px 16px',
    borderBottom:'1px solid var(--border)',
    flexShrink:0,
  },
  statsBar: {
    display:'flex', alignItems:'center', justifyContent:'space-around',
    padding:'10px 16px',
    background:'var(--surface)',
    borderBottom:'1px solid var(--border)',
    flexShrink:0,
  },
  statItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' },
  statVal:  { fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:700, color:'var(--text-1)', fontVariantNumeric:'tabular-nums' },
  statLbl:  { fontFamily:'var(--font-heading)', fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-3)' },
  scroll:   { flex:1, overflowY:'auto', padding:'16px' },
};
