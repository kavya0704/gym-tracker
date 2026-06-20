'use client';
// components/modals/MealModal.jsx
import { useState } from 'react';
import { addMeal } from '@/lib/storage';
import { showToast } from '@/components/shared/Toast';

export default function MealModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', protein: '', carbs: '', fat: '' });

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  const p    = parseFloat(form.protein) || 0;
  const c    = parseFloat(form.carbs)   || 0;
  const f    = parseFloat(form.fat)     || 0;
  const kcal = Math.round(p * 4 + c * 4 + f * 9);

  function handleSave() {
    if (!form.name.trim()) { showToast('Enter a meal name', 'error'); return; }
    if (!p && !c && !f)    { showToast('Enter at least one macro', 'error'); return; }
    const today = new Date().toISOString().split('T')[0];
    addMeal({ date: today, name: form.name.trim(), protein: p, carbs: c, fat: f });
    showToast(`${form.name} logged — ${kcal} kcal`, 'success');
    window.dispatchEvent(new CustomEvent('mealsUpdated'));
    onSaved?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxHeight: '80dvh' }}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <h2 className="modal-title">Log Meal</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label" htmlFor="ml-name">Meal Name</label>
          <input
            className="field-input" id="ml-name" name="name" type="text"
            placeholder="e.g. Chicken Rice Bowl"
            value={form.name} onChange={handleChange} autoFocus
          />
          <div className="field-group-3">
            {[
              { key: 'protein', label: 'Protein (g)', ph: '0', color: 'var(--purple-light)' },
              { key: 'carbs',   label: 'Carbs (g)',   ph: '0', color: 'var(--blue)' },
              { key: 'fat',     label: 'Fat (g)',     ph: '0', color: 'var(--amber)' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="field-label" htmlFor={`ml-${key}`}>{label}</label>
                <input
                  className="field-input" id={`ml-${key}`} name={key}
                  type="number" inputMode="decimal" placeholder={ph} min="0"
                  value={form[key]} onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Calorie preview */}
          {kcal > 0 && (
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border-2)',
              borderRadius: 'var(--r-md)', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Estimated Calories</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--amber)' }}>
                {kcal} kcal
              </span>
            </div>
          )}

          <button className="btn-primary" onClick={handleSave}>Save Meal</button>
        </div>
      </div>
    </div>
  );
}
