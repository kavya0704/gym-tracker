'use client';
// components/modals/SettingsModal.jsx
import { useState, useEffect } from 'react';
import { getSettings, saveSettings, resetAllData } from '@/lib/storage';
import { showToast } from '@/components/shared/Toast';

export default function SettingsModal({ onClose }) {
  const [form, setForm] = useState({
    name:        '',
    startWeight: '',
    goalWeight:  '',
    height:      '',
    startDate:   '',
    groqApiKey:  '',
  });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setForm({
      name:        s.name        || '',
      startWeight: s.startWeight || '',
      goalWeight:  s.goalWeight  || '',
      height:      s.height      || '',
      startDate:   s.startDate   || new Date().toISOString().split('T')[0],
      groqApiKey:  s.groqApiKey  || '',
    });
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    if (!form.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    saveSettings({
      name:        form.name.trim(),
      startWeight: parseFloat(form.startWeight) || 68,
      goalWeight:  parseFloat(form.goalWeight)  || 76,
      height:      parseFloat(form.height)      || 170,
      startDate:   form.startDate,
      groqApiKey:  form.groqApiKey.trim(),
    });
    window.dispatchEvent(new CustomEvent('settingsUpdated'));
    showToast('Settings saved!', 'success');
    onClose();
  }

  function handleReset() {
    resetAllData();
    showToast('All data reset. Starting fresh.', 'info');
    setShowConfirmReset(false);
    window.location.reload();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Personal */}
          <p className="label" style={{ marginBottom: '12px' }}>Personal Info</p>

          <label className="field-label" htmlFor="s-name">Your Name</label>
          <input
            className="field-input"
            id="s-name" name="name" type="text"
            placeholder="e.g. Kavya"
            value={form.name}
            onChange={handleChange}
            autoComplete="given-name"
          />

          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="s-height">Height (cm)</label>
              <input
                className="field-input"
                id="s-height" name="height" type="number"
                placeholder="170" inputMode="decimal"
                value={form.height} onChange={handleChange}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="s-sw">Start Weight (kg)</label>
              <input
                className="field-input"
                id="s-sw" name="startWeight" type="number"
                placeholder="68" step="0.1" inputMode="decimal"
                value={form.startWeight} onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="s-gw">Goal Weight (kg)</label>
              <input
                className="field-input"
                id="s-gw" name="goalWeight" type="number"
                placeholder="76" step="0.1" inputMode="decimal"
                value={form.goalWeight} onChange={handleChange}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="s-sd">Program Start Date</label>
              <input
                className="field-input"
                id="s-sd" name="startDate" type="date"
                value={form.startDate} onChange={handleChange}
              />
            </div>
          </div>

          {/* Groq API */}
          <div className="divider" />
          <p className="label" style={{ marginBottom: '8px' }}>AI Coach (Groq API)</p>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px' }}>
            Your key is stored only on this device. Never shared with anyone.
          </p>

          <label className="field-label" htmlFor="s-groq">Groq API Key</label>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              className="field-input"
              id="s-groq" name="groqApiKey"
              type={showKey ? 'text' : 'password'}
              placeholder="gsk_..."
              value={form.groqApiKey}
              onChange={handleChange}
              style={{ marginBottom: 0, paddingRight: '52px' }}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-3)',
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Save Settings
          </button>

          {/* Danger zone */}
          <div className="divider" />
          {!showConfirmReset ? (
            <button
              className="btn-danger"
              onClick={() => setShowConfirmReset(true)}
              style={{ marginTop: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
              Reset All Data
            </button>
          ) : (
            <div style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 'var(--r-md)',
              padding: '16px',
              marginTop: '8px',
            }}>
              <p style={{ fontSize: '14px', color: 'var(--red)', marginBottom: '12px', fontWeight: 600 }}>
                ⚠️ This will delete ALL workouts, measurements, weight logs, and progress. Are you sure?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-danger"
                  onClick={handleReset}
                  style={{ flex: 1 }}
                >
                  Yes, Reset Everything
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowConfirmReset(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
