'use client';
// app/log/page.js — Workout Log Page
import { useState, useEffect } from 'react';
import { getWorkouts } from '@/lib/storage';
import WorkoutSessionModal from '@/components/modals/WorkoutSessionModal';

const TYPE_COLORS = {
  Push: { bg: 'rgba(168,85,247,0.12)', color: 'var(--purple-light)', border: 'rgba(168,85,247,0.25)' },
  Pull: { bg: 'rgba(96,165,250,0.12)', color: 'var(--blue)',          border: 'rgba(96,165,250,0.25)' },
  Legs: { bg: 'rgba(52,211,153,0.12)', color: 'var(--green)',         border: 'rgba(52,211,153,0.25)' },
  Rest: { bg: 'rgba(71,85,105,0.1)',   color: 'var(--text-3)',        border: 'var(--border)' },
};

function formatDuration(mins) {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatVolume(kg) {
  if (!kg) return '—';
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)} kg`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today     = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  if (d.getTime() === today.getTime())     return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function WorkoutEntry({ workout }) {
  const [expanded, setExpanded] = useState(false);
  const c = TYPE_COLORS[workout.type] || TYPE_COLORS.Rest;

  return (
    <div
      className="card"
      style={{ marginBottom: '12px', cursor: 'pointer' }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            <span style={{
              padding:'2px 10px', borderRadius:'999px', fontSize:'11px', fontWeight:700,
              fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase',
              background:c.bg, color:c.color, border:`1px solid ${c.border}`,
            }}>
              {workout.type}
            </span>
            {workout.newPRs?.length > 0 && (
              <span style={{ fontSize:'11px', color:'var(--amber)', fontWeight:700 }}>
                ⭐ {workout.newPRs.length} PR{workout.newPRs.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-1)' }} className="truncate">
            {workout.name}
          </p>
          <p style={{ fontSize:'13px', color:'var(--text-3)', marginTop:'2px' }}>
            {formatDate(workout.date)}
          </p>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <p style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:700, color:'var(--text-1)' }}>
            {formatVolume(workout.totalVolume)}
          </p>
          <p style={{ fontSize:'12px', color:'var(--text-3)' }}>{formatDuration(workout.durationMins)}</p>
        </div>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"
          style={{ flexShrink:0, transform: expanded ? 'rotate(180deg)' : 'none', transition:'transform 200ms' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Expanded exercises */}
      {expanded && (
        <div style={{ marginTop:'16px', borderTop:'1px solid var(--border)', paddingTop:'16px' }}>
          {(workout.exercises || []).map((ex, i) => (
            <div key={i} style={{ marginBottom:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                <span style={{ fontFamily:'var(--font-heading)', fontSize:'15px', fontWeight:700, color:'var(--text-1)' }}>
                  {ex.name}
                </span>
                <span style={{ fontSize:'11px', color:'var(--text-3)', background:'var(--surface-2)', padding:'1px 7px', borderRadius:'4px' }}>
                  {ex.muscle}
                </span>
              </div>
              {(ex.sets || []).filter(s => s.done).map((s, si) => (
                <div key={si} style={{ display:'flex', gap:'12px', fontSize:'13px', color:'var(--text-2)', marginBottom:'3px', paddingLeft:'4px' }}>
                  <span style={{ color:'var(--text-3)', fontVariantNumeric:'tabular-nums' }}>Set {s.setNum}</span>
                  <span style={{ fontWeight:600, color:'var(--text-1)' }}>{s.weight} kg</span>
                  <span>×</span>
                  <span style={{ fontWeight:600 }}>{s.reps} reps</span>
                  {workout.newPRs?.includes(ex.name) && s.setNum === 1 && (
                    <span style={{ color:'var(--amber)', fontWeight:700 }}>⭐ PR</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const FILTERS = ['All', 'Push', 'Pull', 'Legs'];

export default function LogPage() {
  const [workouts,       setWorkouts]       = useState([]);
  const [filter,         setFilter]         = useState('All');
  const [sessionOpen,    setSessionOpen]    = useState(false);

  function loadWorkouts() {
    setWorkouts(getWorkouts());
  }

  useEffect(() => {
    loadWorkouts();
    const handler = () => loadWorkouts();
    window.addEventListener('workoutCompleted', handler);
    return () => window.removeEventListener('workoutCompleted', handler);
  }, []);

  const filtered = filter === 'All' ? workouts : workouts.filter(w => w.type === filter);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="section-header" style={{ marginBottom:'16px' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800 }}>Workout Log</h1>
        <button className="btn-primary-sm" onClick={() => setSessionOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log list */}
      {filtered.length > 0 ? (
        filtered.map(w => <WorkoutEntry key={w.id} workout={w} />)
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          <h3>{filter === 'All' ? 'No workouts yet' : `No ${filter} workouts yet`}</h3>
          <p>{filter === 'All' ? 'Tap New to log your first session' : `Complete a ${filter} day to see it here`}</p>
          {filter === 'All' && (
            <button className="btn-secondary" style={{ marginTop:'16px' }} onClick={() => setSessionOpen(true)}>
              Start First Workout →
            </button>
          )}
        </div>
      )}

      {sessionOpen && (
        <WorkoutSessionModal
          onClose={() => setSessionOpen(false)}
          onFinished={() => { setSessionOpen(false); loadWorkouts(); }}
        />
      )}
    </div>
  );
}
