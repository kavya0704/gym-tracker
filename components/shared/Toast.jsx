'use client';
// components/shared/Toast.jsx
// Global toast notification system via window custom events

import { useState, useEffect, useCallback } from 'react';

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  pr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

const COLORS = {
  success: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)',  color: 'var(--green)' },
  error:   { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', color: 'var(--red)'   },
  info:    { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)',  color: 'var(--purple-light)' },
  pr:      { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', color: 'var(--amber)'  },
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    const handler = (e) => addToast(e.detail);
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div
      style={styles.container}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const c = COLORS[toast.type] || COLORS.info;
        return (
          <div
            key={toast.id}
            style={{
              ...styles.toast,
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.color,
              animation: 'slideUp 0.25s ease-out',
            }}
            role="alert"
          >
            <span style={{ flexShrink: 0 }}>{ICONS[toast.type]}</span>
            <span style={styles.message}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// Helper to fire toasts from anywhere
export function showToast(message, type = 'info', duration = 3500) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type, duration } }));
  }
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 12px)',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '380px',
    zIndex: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pointerEvents: 'none',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  message: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
    color: 'var(--text-1)',
    flex: 1,
  },
};
