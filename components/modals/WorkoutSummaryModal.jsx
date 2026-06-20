'use client';
// components/modals/WorkoutSummaryModal.jsx — Post-workout summary + PR celebration

import { useState } from 'react';
import ConfettiEffect from '@/components/shared/ConfettiEffect';

function StatBox({ label, value, sub }) {
  return (
    <div style={{
      flex:1, textAlign:'center',
      padding:'16px 8px',
      background:'var(--surface-2)',
      borderRadius:'var(--r-md)',
      border:'1px solid var(--border)',
    }}>
      <p style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800, color:'var(--text-1)' }}>{value}</p>
      {sub && <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'1px' }}>{sub}</p>}
      <p style={{ fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-3)', marginTop:'4px' }}>{label}</p>
    </div>
  );
}

export default function WorkoutSummaryModal({ data, onClose }) {
  const { workout, newPRs, durationMins, totalVolume } = data;
  const [confetti, setConfetti] = useState(newPRs?.length > 0);
  const hasPRs = newPRs?.length > 0;

  const sets = (workout.exercises || []).reduce((a, ex) => a + ex.sets.length, 0);
  const vol  = totalVolume >= 1000
    ? `${(totalVolume / 1000).toFixed(1)}t`
    : `${Math.round(totalVolume)} kg`;

  return (
    <>
      {confetti && <ConfettiEffect onDone={() => setConfetti(false)} />}

      <div style={styles.overlay}>
        <div style={styles.panel}>
          <div style={styles.dragHandle} />

          {/* Headline */}
          <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
            <div style={{ fontSize:'48px', marginBottom:'8px' }}>
              {hasPRs ? '🏆' : '💪'}
            </div>
            <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800, color:'var(--text-1)' }}>
              {hasPRs ? 'New PRs!' : 'Workout Complete!'}
            </h2>
            <p style={{ fontSize:'14px', color:'var(--text-2)', marginTop:'4px' }}>
              {workout.name}
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
            <StatBox label="Time"    value={`${durationMins}m`}            />
            <StatBox label="Volume"  value={vol}                            />
            <StatBox label="Sets"    value={sets}                           />
            <StatBox label="Exercises" value={workout.exercises?.length||0} />
          </div>

          {/* PRs */}
          {hasPRs && (
            <div style={{
              background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)',
              borderRadius:'var(--r-lg)', padding:'16px', marginBottom:'20px',
            }}>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'10px' }}>
                ⭐ New Personal Records
              </p>
              {newPRs.map(lift => (
                <div key={lift} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                  <span style={{ fontSize:'20px' }}>🏅</span>
                  <span style={{ fontWeight:700, color:'var(--text-1)', fontSize:'15px' }}>{lift}</span>
                </div>
              ))}
            </div>
          )}

          {/* Exercises logged */}
          <div style={{ marginBottom:'20px' }}>
            <p style={{ fontFamily:'var(--font-heading)', fontSize:'13px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'10px' }}>
              Exercises Logged
            </p>
            {(workout.exercises || []).map((ex, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:'14px', fontWeight:600, color:'var(--text-1)' }}>{ex.name}</span>
                <span style={{ fontSize:'13px', color:'var(--text-3)' }}>{ex.sets.length} sets</span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={onClose}>
            {hasPRs ? '🎉 Save & Celebrate!' : 'Save & Exit'}
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'rgba(5,5,8,0.85)',
    zIndex:250,
    display:'flex', alignItems:'flex-end',
    animation:'fadeIn 200ms ease-out',
  },
  panel: {
    width:'100%', maxWidth:'var(--max-width)', margin:'0 auto',
    background:'var(--surface)',
    border:'1px solid var(--border-2)',
    borderRadius:'20px 20px 0 0',
    padding:'0 20px',
    paddingBottom:'calc(24px + env(safe-area-inset-bottom, 0px))',
    maxHeight:'90dvh', overflowY:'auto',
    animation:'slideUp 350ms cubic-bezier(0.16,1,0.3,1)',
  },
  dragHandle: {
    width:'36px', height:'4px',
    background:'var(--border-3)',
    borderRadius:'9999px',
    margin:'12px auto 0',
  },
};
