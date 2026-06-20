'use client';
// components/ai/AIChatButton.jsx — Floating brain button that opens the AI chat panel

import { useState } from 'react';
import AIChatPanel from './AIChatPanel';

export default function AIChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={styles.button}
        aria-label="Open AI Coach chat"
        title="GymCoach AI"
      >
        {/* Brain / sparkle icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C9.5 2 7.5 3.5 7 5.5C5.3 5.8 4 7.3 4 9C4 10.1 4.5 11.1 5.2 11.8C5.1 12.2 5 12.6 5 13C5 15.2 6.8 17 9 17H15C17.2 17 19 15.2 19 13C19 12.6 18.9 12.2 18.8 11.8C19.5 11.1 20 10.1 20 9C20 7.3 18.7 5.8 17 5.5C16.5 3.5 14.5 2 12 2Z"
            fill="var(--purple-glow)"
            stroke="var(--purple-light)"
            strokeWidth="1.5"
          />
          <path d="M9 17v3M15 17v3M12 17v4" stroke="var(--purple-light)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9.5"  cy="10" r="1" fill="var(--purple-light)"/>
          <circle cx="14.5" cy="10" r="1" fill="var(--purple-light)"/>
          <path d="M9.5 13c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1" stroke="var(--purple-light)" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Sparkles */}
          <circle cx="19" cy="4"  r="1"   fill="#FBBF24"/>
          <circle cx="5"  cy="5"  r="0.7" fill="#34D399"/>
          <circle cx="21" cy="13" r="0.7" fill="#60A5FA"/>
        </svg>

        {/* Pulse ring */}
        <span style={styles.pulseRing} aria-hidden="true" />
      </button>

      {open && <AIChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}

const styles = {
  button: {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 16px)',
    right: '16px',
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'var(--purple-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px var(--purple-glow-strong)',
    zIndex: 150,
    cursor: 'pointer',
    border: 'none',
    animation: 'pulse-glow 3s ease-in-out infinite',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 150ms ease-out',
  },
  pulseRing: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    border: '2px solid var(--purple-glow-strong)',
    animation: 'pulse-glow 2s ease-in-out infinite',
    pointerEvents: 'none',
  },
};
