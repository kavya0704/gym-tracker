'use client';
// components/modals/RestTimerModal.jsx — Circular countdown rest timer

import { useState, useEffect, useRef } from 'react';
import { showToast } from '@/components/shared/Toast';
import ProgressRing from '@/components/shared/ProgressRing';

const PRESETS = [45, 60, 90, 120, 180];

export default function RestTimerModal({ initialSecs = 90, onClose }) {
  const [totalSecs,   setTotalSecs]   = useState(initialSecs);
  const [remaining,   setRemaining]   = useState(initialSecs);
  const [running,     setRunning]     = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // Vibrate on completion
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
            showToast('Rest done — next set!', 'success');
            setTimeout(onClose, 1200);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, onClose]);

  function changePreset(secs) {
    clearInterval(intervalRef.current);
    setTotalSecs(secs);
    setRemaining(secs);
    setRunning(true);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2,'0')}`;
  }

  const pct = totalSecs > 0 ? ((totalSecs - remaining) / totalSecs) * 100 : 100;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.panel}>
        <div style={styles.dragHandle} />

        <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'22px', fontWeight:700, textAlign:'center', marginBottom:'24px' }}>
          Rest Timer
        </h2>

        {/* Big ring + countdown */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'24px' }}>
          <div style={{ position:'relative' }}>
            <ProgressRing
              size={160}
              strokeWidth={6}
              percent={pct}
              color={remaining <= 10 ? 'var(--amber)' : 'var(--purple)'}
              bgColor="var(--border)"
              animated={false}
            />
            <div style={{
              position:'absolute', inset:0,
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:'4px',
            }}>
              <span style={{
                fontFamily:'var(--font-heading)', fontSize:'48px', fontWeight:800,
                color: remaining <= 10 ? 'var(--amber)' : 'var(--text-1)',
                fontVariantNumeric:'tabular-nums',
                transition:'color 300ms',
              }}>
                {formatTime(remaining)}
              </span>
              <span style={{ fontSize:'12px', color:'var(--text-3)' }}>of {formatTime(totalSecs)}</span>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'20px', flexWrap:'wrap' }}>
          {PRESETS.map(s => (
            <button
              key={s}
              onClick={() => changePreset(s)}
              style={{
                padding:'8px 14px', borderRadius:'999px',
                fontFamily:'var(--font-heading)', fontSize:'13px', fontWeight:700, letterSpacing:'0.04em',
                background: totalSecs === s ? 'var(--purple-glow)' : 'var(--surface-2)',
                color:      totalSecs === s ? 'var(--purple-light)' : 'var(--text-2)',
                border: `1.5px solid ${totalSecs === s ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
                cursor:'pointer', transition:'all 150ms',
                whiteSpace:'nowrap',
              }}
            >
              {s < 60 ? `${s}s` : `${s/60}m`}
            </button>
          ))}
        </div>

        {/* Skip button */}
        <button
          className="btn-ghost"
          onClick={onClose}
          style={{ width:'100%', justifyContent:'center', color:'var(--text-3)', fontSize:'14px' }}
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'rgba(5,5,8,0.6)',
    zIndex:300,
    display:'flex', alignItems:'flex-end',
    animation:'fadeIn 200ms ease-out',
  },
  panel: {
    width:'100%', maxWidth:'var(--max-width)', margin:'0 auto',
    background:'var(--surface)',
    border:'1px solid var(--border-2)',
    borderRadius:'20px 20px 0 0',
    padding:'0 24px 32px',
    paddingBottom:'calc(32px + env(safe-area-inset-bottom, 0px))',
    animation:'slideUp 300ms cubic-bezier(0.16,1,0.3,1)',
  },
  dragHandle: {
    width:'36px', height:'4px',
    background:'var(--border-3)',
    borderRadius:'9999px',
    margin:'12px auto 20px',
  },
};
