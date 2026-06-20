'use client';
// components/modals/MeasurementModal.jsx
import { useState } from 'react';
import { addMeasurement } from '@/lib/storage';
import { showToast } from '@/components/shared/Toast';

const FIELDS = [
  { key: 'chest',     label: 'Chest',     placeholder: 'e.g. 96' },
  { key: 'waist',     label: 'Waist',     placeholder: 'e.g. 78' },
  { key: 'shoulders', label: 'Shoulders', placeholder: 'e.g. 112' },
  { key: 'arms',      label: 'Arms (Bicep)', placeholder: 'e.g. 34' },
  { key: 'forearms',  label: 'Forearms',  placeholder: 'e.g. 28' },
  { key: 'thighs',    label: 'Thighs',    placeholder: 'e.g. 54' },
];

export default function MeasurementModal({ onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ chest:'', waist:'', shoulders:'', arms:'', forearms:'', thighs:'' });
  const [date, setDate] = useState(today);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    const hasAny = Object.values(form).some((v) => v && parseFloat(v) > 0);
    if (!hasAny) { showToast('Enter at least one measurement', 'error'); return; }
    addMeasurement({ ...form, date });
    showToast('Measurements saved! 📏', 'success');
    window.dispatchEvent(new CustomEvent('measurementsUpdated'));
    onSaved?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <h2 className="modal-title">Log Measurements</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label" htmlFor="m-date">Date</label>
          <input className="field-input" id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <p className="label" style={{ marginBottom: '12px' }}>All measurements in cm</p>
          <div className="field-group">
            {FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="field-label" htmlFor={`m-${key}`}>{label}</label>
                <input
                  className="field-input"
                  id={`m-${key}`} name={key} type="number" inputMode="decimal"
                  placeholder={placeholder} step="0.1"
                  value={form[key]} onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={handleSave}>Save Measurements</button>
        </div>
      </div>
    </div>
  );
}
