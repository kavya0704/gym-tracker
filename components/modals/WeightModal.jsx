'use client';
// components/modals/WeightModal.jsx
import { useState } from 'react';
import { addWeightEntry } from '@/lib/storage';
import { showToast } from '@/components/shared/Toast';

export default function WeightModal({ onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0];
  const [weight, setWeight] = useState('');
  const [date,   setDate]   = useState(today);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 250) {
      showToast('Enter a valid weight (30–250 kg)', 'error'); return;
    }
    setSaving(true);
    addWeightEntry({ date, weight: w });
    showToast(`Weight logged: ${w} kg ✓`, 'success');
    window.dispatchEvent(new CustomEvent('weightUpdated'));
    onSaved?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxHeight: '60dvh' }}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <h2 className="modal-title">Log Body Weight</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label" htmlFor="w-kg">Weight (kg)</label>
          <input
            className="field-input"
            id="w-kg" type="number" inputMode="decimal"
            placeholder="e.g. 68.5" step="0.1" min="30" max="250"
            value={weight} onChange={(e) => setWeight(e.target.value)}
            autoFocus
          />
          <label className="field-label" htmlFor="w-date">Date</label>
          <input
            className="field-input"
            id="w-date" type="date"
            value={date} onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSave} disabled={saving || !weight}>
            {saving ? 'Saving...' : 'Save Weight'}
          </button>
        </div>
      </div>
    </div>
  );
}
