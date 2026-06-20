'use client';
// app/page.js — Dashboard (full implementation)
import { useState, useEffect, useCallback } from 'react';
import { getSettings, getWeightLog, getPRs, getWorkouts } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/phases';
import { getMacroTargets } from '@/lib/macros';
import { getTodayDayKey, PPL_PROGRAM } from '@/lib/program';
import {
  getTotalWorkouts, getTotalSets, getTotalHours,
  getTotalPRs, getCurrentStreak, getThisWeekWorkouts,
} from '@/lib/stats';
import ProgressRing from '@/components/shared/ProgressRing';
import WeightModal from '@/components/modals/WeightModal';
import MeasurementModal from '@/components/modals/MeasurementModal';
import WorkoutSessionModal from '@/components/modals/WorkoutSessionModal';
import { showToast } from '@/components/shared/Toast';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// ── Greeting ─────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// ── Greeting Block ────────────────────────
function GreetingBlock({ name, streak }) {
  return (
    <div style={{ marginBottom:'20px' }}>
      <p style={{ fontSize:'14px', color:'var(--text-3)', marginBottom:'2px' }}>
        {getGreeting()} 👋
      </p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'32px', fontWeight:800, color:'var(--text-1)', lineHeight:1.1 }}>
          {name}
        </h1>
        {streak > 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:'4px',
            background:'rgba(249,115,22,0.12)', border:'1px solid rgba(249,115,22,0.3)',
            borderRadius:'999px', padding:'6px 12px',
          }}>
            <span>🔥</span>
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'16px', fontWeight:800, color:'var(--orange)' }}>
              {streak}
            </span>
            <span style={{ fontSize:'11px', color:'var(--orange)', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              day streak
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phase Banner ──────────────────────────
function PhaseBanner({ phase }) {
  if (!phase) return null;
  return (
    <div className="card card-glow" style={{ marginBottom:'16px', padding:'18px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ flex:1 }}>
          <p className="label" style={{ marginBottom:'4px', color:'rgba(192,132,252,0.7)' }}>
            Current Phase
          </p>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'22px', fontWeight:800, color:'var(--text-1)', lineHeight:1.1 }}>
            Phase {phase.phaseNum} — {phase.name}
          </h2>
          <p style={{ fontSize:'13px', color:'var(--text-2)', marginTop:'4px' }}>
            Week {phase.weekNum} of 52 · {phase.weeks}
          </p>
          <p style={{ fontSize:'13px', color:'var(--text-2)', marginTop:'4px', lineHeight:1.5 }}>
            {phase.goal}
          </p>
        </div>
        <ProgressRing
          size={72} strokeWidth={5}
          percent={phase.progressPct}
          color="var(--purple)"
          label={`${phase.progressPct}%`}
          labelStyle={{ fontSize:'12px', fontWeight:800 }}
          animated
        />
      </div>

      {/* Phase progress bar */}
      <div style={{ marginTop:'14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'11px', color:'var(--text-3)' }}>
          <span>Phase progress</span>
          <span>Wk {phase.weeksIntoPhase} of {phase.totalPhaseWeeks}</span>
        </div>
        <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'999px', overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:'999px',
            width:`${phase.progressPct}%`,
            background:'var(--purple)',
            transition:'width 1s cubic-bezier(0.16,1,0.3,1)',
          }}/>
        </div>
      </div>
    </div>
  );
}

// ── Stats Row ─────────────────────────────
function StatsRow() {
  const stats = [
    { label:'Workouts', val:getTotalWorkouts(), icon:'💪' },
    { label:'Sets',     val:getTotalSets(),     icon:'🔁' },
    { label:'PRs',      val:getTotalPRs(),      icon:'⭐' },
    { label:'Hours',    val:`${getTotalHours()}h`, icon:'⏱' },
  ];
  return (
    <div className="grid-4" style={{ marginBottom:'16px' }}>
      {stats.map(({ label, val, icon }) => (
        <div key={label} className="card" style={{ padding:'12px', textAlign:'center' }}>
          <div style={{ fontSize:'18px', marginBottom:'4px' }}>{icon}</div>
          <p style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:800, color:'var(--text-1)', lineHeight:1 }}>{val}</p>
          <p style={{ fontSize:'10px', color:'var(--text-3)', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:'3px' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Today Workout Card ────────────────────
function TodayWorkoutCard({ dayKey, onStart }) {
  const day = PPL_PROGRAM[dayKey];
  if (!day) return null;

  const isRest = day.type === 'Rest';
  const TYPE_COLORS = {
    Push: 'var(--purple-light)', Pull: 'var(--blue)', Legs: 'var(--green)', Rest: 'var(--text-3)',
  };

  return (
    <div className="card" style={{ marginBottom:'16px', padding:'18px', border: isRest ? '1px solid var(--border)' : '1px solid rgba(168,85,247,0.2)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div>
          <p className="label" style={{ marginBottom:'4px' }}>Today's Workout</p>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'22px', fontWeight:800, color:'var(--text-1)' }}>
            {day.name}
          </h2>
          <p style={{ fontSize:'13px', color:'var(--text-2)' }}>{day.label}</p>
        </div>
        <span style={{
          width:'48px', height:'48px', borderRadius:'12px', flexShrink:0,
          background: isRest ? 'var(--surface-2)' : 'var(--purple-glow)',
          border: isRest ? '1px solid var(--border)' : '1px solid rgba(168,85,247,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'22px',
        }}>
          {isRest ? '😴' : day.type === 'Push' ? '💪' : day.type === 'Pull' ? '🏋️' : '🦵'}
        </span>
      </div>

      {isRest ? (
        <p style={{ fontSize:'14px', color:'var(--text-3)', lineHeight:1.6 }}>
          Active recovery day. Do your posture routine, ankle mobility work, and get 7–8h sleep tonight.
        </p>
      ) : (
        <>
          <div style={{ marginBottom:'14px' }}>
            {day.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:'13px' }}>
                <span style={{ color:'var(--text-1)', fontWeight:500 }}>{ex.name}</span>
                <span style={{ color:'var(--text-3)' }}>{ex.sets} × {ex.reps}</span>
              </div>
            ))}
            {day.exercises.length > 3 && (
              <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'6px' }}>
                +{day.exercises.length - 3} more exercises
              </p>
            )}
          </div>
          <button className="btn-primary btn-pulse" onClick={onStart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start Session
          </button>
        </>
      )}
    </div>
  );
}

// ── Week Grid ─────────────────────────────
function WeekGrid() {
  const week = getThisWeekWorkouts();
  const days = ['mon','tue','wed','thu','fri','sat','sun'];
  const labels = ['M','T','W','T','F','S','S'];

  return (
    <div style={{ marginBottom:'16px' }}>
      <p className="label" style={{ marginBottom:'10px' }}>This Week</p>
      <div style={{ display:'flex', gap:'6px', justifyContent:'space-between' }}>
        {days.map((d, i) => {
          const info = week[d];
          return (
            <div key={d} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:'36px', borderRadius:'8px',
                background: info?.hasWorkout
                  ? 'rgba(52,211,153,0.15)'
                  : info?.isToday
                  ? 'rgba(168,85,247,0.12)'
                  : 'var(--surface-2)',
                border: info?.isToday
                  ? '1.5px solid rgba(168,85,247,0.4)'
                  : info?.hasWorkout
                  ? '1px solid rgba(52,211,153,0.3)'
                  : '1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'4px',
              }}>
                {info?.hasWorkout
                  ? <span style={{ fontSize:'14px' }}>✓</span>
                  : <span style={{ fontSize:'11px', color:'var(--text-3)', fontFamily:'var(--font-heading)', fontWeight:700 }}>{info?.dayNum}</span>
                }
              </div>
              <span style={{ fontSize:'10px', color: info?.isToday ? 'var(--purple-light)' : 'var(--text-3)', fontFamily:'var(--font-heading)', fontWeight: info?.isToday ? 700 : 400 }}>
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Weight Chart ──────────────────────────
function WeightChart({ weightLog, onLog }) {
  const hasData = weightLog.length >= 2;
  const sorted  = [...weightLog].sort((a,b) => a.date.localeCompare(b.date)).slice(-14);

  const chartData = {
    labels: sorted.map(w => {
      const d = new Date(w.date + 'T00:00:00');
      return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
    }),
    datasets: [{
      data: sorted.map(w => w.weight),
      borderColor:'#A855F7',
      backgroundColor:'rgba(168,85,247,0.08)',
      borderWidth:2, pointRadius:4,
      pointBackgroundColor:'#A855F7',
      pointBorderColor:'#050508',
      pointBorderWidth:2,
      fill:true,
      tension:0.4,
    }],
  };

  const chartOptions = {
    responsive:true, maintainAspectRatio:false,
    plugins: { legend:{ display:false }, tooltip:{ callbacks:{ label:(c) => ` ${c.raw} kg` } } },
    scales: {
      x: { grid:{ color:'rgba(30,30,42,0.8)' }, ticks:{ color:'#475569', font:{ size:11 } } },
      y: { grid:{ color:'rgba(30,30,42,0.8)' }, ticks:{ color:'#475569', font:{ size:11 }, callback:(v) => `${v}kg` } },
    },
  };

  return (
    <div style={{ marginBottom:'16px' }}>
      <div className="section-header" style={{ marginBottom:'10px' }}>
        <h2 className="section-title">Body Weight</h2>
        <button className="btn-text" onClick={onLog}>+ Log</button>
      </div>
      <div className="card">
        {hasData ? (
          <div className="chart-wrapper"><Line data={chartData} options={chartOptions} /></div>
        ) : (
          <div style={{ textAlign:'center', padding:'28px', color:'var(--text-3)', fontSize:'14px' }}>
            <p>No weight data yet</p>
            <button className="btn-secondary" style={{ marginTop:'12px', width:'auto', padding:'8px 20px' }} onClick={onLog}>
              Log First Weight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────
export default function DashboardPage() {
  const [settings,     setSettings]     = useState(null);
  const [phase,        setPhase]        = useState(null);
  const [weightLog,    setWeightLog]    = useState([]);
  const [todayDayKey,  setTodayDayKey]  = useState('push_a');
  const [weightOpen,   setWeightOpen]   = useState(false);
  const [sessionOpen,  setSessionOpen]  = useState(false);
  const [streak,       setStreak]       = useState(0);

  const load = useCallback(() => {
    const s   = getSettings();
    const p   = getCurrentPhase(s.startDate);
    const key = getTodayDayKey(s.startDate);
    setSettings(s);
    setPhase(p);
    setWeightLog(getWeightLog());
    setTodayDayKey(key);
    setStreak(getCurrentStreak());
  }, []);

  useEffect(() => {
    load();
    const handlers = ['settingsUpdated','weightUpdated','workoutCompleted'];
    handlers.forEach(e => window.addEventListener(e, load));
    return () => handlers.forEach(e => window.removeEventListener(e, load));
  }, [load]);

  if (!settings) return null;

  return (
    <div className="page-content">
      <GreetingBlock name={settings.name} streak={streak} />
      <PhaseBanner phase={phase} />
      <StatsRow />
      <WeekGrid />
      <TodayWorkoutCard dayKey={todayDayKey} onStart={() => setSessionOpen(true)} />
      <WeightChart weightLog={weightLog} onLog={() => setWeightOpen(true)} />

      {weightOpen  && <WeightModal  onClose={() => setWeightOpen(false)}  onSaved={load} />}
      {sessionOpen && (
        <WorkoutSessionModal
          onClose={() => setSessionOpen(false)}
          onFinished={() => { setSessionOpen(false); load(); }}
        />
      )}
    </div>
  );
}
