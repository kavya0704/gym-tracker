'use client';
// app/plan/page.js — 12-Month Plan Page
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/phases';
import { PHASES, PPL_PROGRAM, WEEK_ROTATION, MILESTONES, getTodayDayKey } from '@/lib/program';

const TYPE_COLORS = {
  Push: { color:'var(--purple-light)', bg:'rgba(168,85,247,0.1)', border:'rgba(168,85,247,0.25)' },
  Pull: { color:'var(--blue)',         bg:'rgba(96,165,250,0.1)', border:'rgba(96,165,250,0.25)' },
  Legs: { color:'var(--green)',        bg:'rgba(52,211,153,0.1)', border:'rgba(52,211,153,0.25)' },
  Rest: { color:'var(--text-3)',       bg:'var(--surface-3)',     border:'var(--border)' },
};

function ExerciseRow({ ex, todayDayKey, parentKey }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
      onClick={() => setOpen(v => !v)}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', gap:'8px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:'14px', fontWeight:600, color:'var(--text-1)' }} className="truncate">{ex.name}</p>
          <p style={{ fontSize:'12px', color:'var(--text-3)', marginTop:'2px' }}>{ex.muscle}</p>
        </div>
        <div style={{ display:'flex', gap:'6px', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontSize:'12px', color:'var(--text-2)', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>
            {ex.sets}×{ex.reps}
          </span>
          <span style={{ fontSize:'11px', color:'var(--text-3)', background:'var(--surface-3)', padding:'2px 6px', borderRadius:'4px', whiteSpace:'nowrap' }}>
            {ex.rest}s
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 200ms', flexShrink:0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      {open && ex.cues && (
        <div style={{
          background:'var(--surface-2)', borderRadius:'var(--r-sm)', padding:'10px 12px',
          marginBottom:'10px', borderLeft:'2px solid var(--purple)', fontSize:'13px',
          color:'var(--text-2)', lineHeight:1.6,
        }}>
          💡 {ex.cues}
        </div>
      )}
    </div>
  );
}

function DayCard({ dayKey, isToday }) {
  const day = PPL_PROGRAM[dayKey];
  const c   = TYPE_COLORS[day.type] || TYPE_COLORS.Rest;
  const DAY_LABELS = { push_a:'Monday', pull_a:'Tuesday', legs_a:'Wednesday', push_b:'Thursday', pull_b:'Friday', legs_b:'Saturday', rest:'Sunday' };

  return (
    <div className="card" style={{
      marginBottom:'12px',
      ...(isToday ? { border:'1px solid rgba(168,85,247,0.4)', boxShadow:'var(--glow-purple)' } : {}),
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            {isToday && (
              <span style={{ fontSize:'10px', fontFamily:'var(--font-heading)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--purple-light)', background:'rgba(168,85,247,0.15)', padding:'2px 8px', borderRadius:'999px' }}>
                TODAY
              </span>
            )}
            <span style={{ fontSize:'11px', color:'var(--text-3)' }}>{DAY_LABELS[dayKey]}</span>
          </div>
          <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:700, color:'var(--text-1)' }}>
            {day.name}
          </h3>
          <p style={{ fontSize:'13px', color:'var(--text-2)' }}>{day.label}</p>
        </div>
        <span style={{
          padding:'4px 12px', borderRadius:'999px', fontSize:'12px', fontWeight:700,
          fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase',
          background:c.bg, color:c.color, border:`1px solid ${c.border}`,
        }}>
          {day.type}
        </span>
      </div>
      {day.exercises.map((ex, i) => (
        <ExerciseRow key={i} ex={ex} />
      ))}
      {day.type === 'Rest' && (
        <div style={{ padding:'8px 0', fontSize:'13px', color:'var(--text-2)', display:'flex', flexDirection:'column', gap:'12px' }}>
          <p style={{ fontSize:'14px', color:'var(--text-3)' }}>
            Active recovery day. Perform your posture routine and ankle mobility drills:
          </p>
          
          <div style={{ background:'var(--surface-2)', borderRadius:'var(--r-sm)', padding:'12px', borderLeft:'2.5px solid var(--purple-light)' }}>
            <p style={{ fontWeight:700, color:'var(--purple-light)', marginBottom:'8px', fontSize:'11px', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-heading)' }}>
              Posture Routine
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', fontSize:'12px', lineHeight:1.4 }}>
              <div>• <strong>Chin Tucks</strong>: 3 × 15 reps (Retract chin to lengthen neck)</div>
              <div>• <strong>Wall Angels</strong>: 3 × 10 reps (Slide arms up wall, flat back)</div>
              <div>• <strong>Band Pull-Aparts</strong>: 3 × 20 reps (Hold band, pull to chest)</div>
              <div>• <strong>Doorframe Stretch</strong>: 60s each side (Opens chest chest muscles)</div>
            </div>
          </div>
          
          <div style={{ background:'var(--surface-2)', borderRadius:'var(--r-sm)', padding:'12px', borderLeft:'2.5px solid var(--blue)' }}>
            <p style={{ fontWeight:700, color:'var(--blue)', marginBottom:'8px', fontSize:'11px', letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:'var(--font-heading)' }}>
              Ankle Mobility Work
            </p>
            <p style={{ fontSize:'12px', lineHeight:1.4 }}>
              Spend 5–10 mins doing stage-appropriate squat stance mobility exercises (heel elevation or flat-foot depth progression).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [todayDayKey,   setTodayDayKey]   = useState('push_a');
  const [currentPhase,  setCurrentPhase]  = useState(null);

  useEffect(() => {
    const s = getSettings();
    const p = getCurrentPhase(s.startDate);
    setCurrentPhase(p);
    setSelectedPhase(p.phaseNum);
    setTodayDayKey(getTodayDayKey(s.startDate));
  }, []);

  const phase = PHASES[selectedPhase];

  return (
    <div className="page-content">
      <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800, marginBottom:'16px' }}>
        12-Month Plan
      </h1>

      {/* Phase selector tabs */}
      <div className="filter-tabs" style={{ marginBottom:'16px' }}>
        {[1,2,3,4].map(n => (
          <button
            key={n}
            className={`filter-tab${selectedPhase === n ? ' active' : ''}`}
            onClick={() => setSelectedPhase(n)}
          >
            Phase {n}
            {currentPhase?.phaseNum === n && <span style={{ marginLeft:'4px' }}>●</span>}
          </button>
        ))}
      </div>

      {/* Phase detail card */}
      <div className="card card-glow" style={{ marginBottom:'20px' }}>
        <div style={{ marginBottom:'12px' }}>
          <p className="label" style={{ marginBottom:'6px' }}>Phase {selectedPhase}</p>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'24px', fontWeight:700, color:'var(--text-1)' }}>
            {phase.name}
          </h2>
          <p style={{ fontSize:'13px', color:'var(--text-2)', marginTop:'2px' }}>Weeks {phase.weeks}</p>
        </div>
        <p style={{ fontSize:'14px', color:'var(--text-2)', marginBottom:'16px', lineHeight:1.6 }}>{phase.goal}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {phase.focus.map((f,i) => (
            <div key={i} style={{ display:'flex', gap:'8px', fontSize:'13px', color:'var(--text-2)' }}>
              <span style={{ color:'var(--purple-light)', flexShrink:0 }}>→</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Milestone table */}
        <div style={{ marginTop:'16px', borderTop:'1px solid var(--border)', paddingTop:'16px' }}>
          <p className="label" style={{ marginBottom:'10px' }}>Strength Milestones</p>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px', minWidth:'340px' }}>
              <thead>
                <tr style={{ color:'var(--text-3)' }}>
                  {['Month','Weight','Bench','OHP','Pull-ups','Squat'].map(h => (
                    <th key={h} style={{ padding:'6px 8px', textAlign:'left', fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600, borderBottom:'1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MILESTONES.filter(m => {
                  if (selectedPhase === 1) return m.month <= 1;
                  if (selectedPhase === 2) return m.month <= 2;
                  if (selectedPhase === 3) return m.month <= 4;
                  return true;
                }).map(m => (
                  <tr key={m.month} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'8px', color:'var(--text-2)', fontWeight:600 }}>M{m.month}</td>
                    <td style={{ padding:'8px', color:'var(--text-1)', fontWeight:600 }}>{m.targetWeight}kg</td>
                    <td style={{ padding:'8px', color:'var(--text-2)' }}>{m.bench}kg</td>
                    <td style={{ padding:'8px', color:'var(--text-2)' }}>{m.ohp}kg</td>
                    <td style={{ padding:'8px', color:'var(--text-2)' }}>{m.pullups}</td>
                    <td style={{ padding:'8px', color:'var(--text-2)' }}>{m.squat}kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6-Day Program Cards */}
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">6-Day PPL Program</h2>
      </div>
      {WEEK_ROTATION.map(key => (
        <DayCard key={key} dayKey={key} isToday={key === todayDayKey} />
      ))}
    </div>
  );
}
