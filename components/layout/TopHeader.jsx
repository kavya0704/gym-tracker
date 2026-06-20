'use client';
// components/layout/TopHeader.jsx
import { useState, useEffect } from 'react';
import SettingsModal from '@/components/modals/SettingsModal';

// Dumbbell SVG icon
function DumbbellIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="1"  y="12" width="5" height="8" rx="2.5" fill="var(--purple-light)"/>
      <rect x="26" y="12" width="5" height="8" rx="2.5" fill="var(--purple-light)"/>
      <rect x="6"  y="9"  width="5" height="14" rx="2"  fill="var(--purple)"/>
      <rect x="21" y="9"  width="5" height="14" rx="2"  fill="var(--purple)"/>
      <rect x="11" y="14" width="10" height="4" rx="2"  fill="#ffffff"/>
    </svg>
  );
}

export default function TopHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.left}>
          <DumbbellIcon />
          <span style={styles.title}>GYMTRACKER</span>
        </div>
        <button
          className="btn-icon"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </header>

      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--max-width)',
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    background: 'var(--overlay)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: 'var(--purple-light)',
    WebkitTextFillColor: 'initial',
  },
};
