'use client';
// app/nutrition/page.js — Macros & Nutrition Page
import { useState, useEffect, useCallback } from 'react';
import { getSettings, getMeals, deleteMeal, toggleSupplement, getSupplements, getTodayMealTotals } from '@/lib/storage';
import { getCurrentPhase } from '@/lib/phases';
import { getMacroTargets } from '@/lib/macros';
import { SUPPLEMENTS } from '@/lib/program';
import { showToast } from '@/components/shared/Toast';
import ProgressRing from '@/components/shared/ProgressRing';
import MealModal from '@/components/modals/MealModal';

const today = new Date().toISOString().split('T')[0];

// ── Macro Rings ───────────────────────────
function MacroRings({ totals, targets }) {
  const macros = [
    { key:'protein', label:'Protein', color:'var(--purple)',  unit:'g' },
    { key:'carbs',   label:'Carbs',   color:'var(--blue)',    unit:'g' },
    { key:'fat',     label:'Fat',     color:'var(--amber)',   unit:'g' },
  ];

  return (
    <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px 0' }}>
      {macros.map(({ key, label, color }) => {
        const consumed = Math.round(totals[key] || 0);
        const target   = targets[key] || 1;
        const pct      = Math.min(Math.round((consumed / target) * 100), 100);
        return (
          <div key={key} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
            <ProgressRing
              size={90} strokeWidth={7}
              percent={pct}
              color={color}
              label={`${pct}%`}
              labelStyle={{ fontSize:'14px', fontWeight:800 }}
              animated
            />
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'17px', fontWeight:700, color:'var(--text-1)' }}>
                {consumed}<span style={{ fontSize:'12px', color:'var(--text-3)' }}>g</span>
              </p>
              <p style={{ fontSize:'11px', color:'var(--text-3)' }}>/ {target}g</p>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'11px', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-3)', marginTop:'2px' }}>{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Meal List ─────────────────────────────
function MealList({ meals, onDelete, onAdd }) {
  const total = meals.reduce((a, m) => ({
    protein: a.protein + m.protein,
    carbs:   a.carbs   + m.carbs,
    fat:     a.fat     + m.fat,
    kcal:    a.kcal    + m.kcal,
  }), { protein:0, carbs:0, fat:0, kcal:0 });

  return (
    <div style={{ marginTop:'24px' }}>
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">Today's Meals</h2>
        <button className="btn-text" onClick={onAdd}>+ Log Meal</button>
      </div>

      {meals.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'28px', color:'var(--text-3)', fontSize:'14px' }}>
          No meals logged today.<br/>Tap "+ Log Meal" to start.
        </div>
      ) : (
        <>
          {meals.map(m => (
            <div key={m.id} className="card" style={{ marginBottom:'8px', padding:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:'15px', color:'var(--text-1)' }} className="truncate">{m.name}</p>
                  <div style={{ display:'flex', gap:'10px', marginTop:'6px', flexWrap:'wrap' }}>
                    {[
                      { label:'P', val:m.protein, color:'var(--purple-light)' },
                      { label:'C', val:m.carbs,   color:'var(--blue)' },
                      { label:'F', val:m.fat,      color:'var(--amber)' },
                    ].map(({ label, val, color }) => (
                      <span key={label} style={{ fontSize:'12px', fontWeight:600, color }}>
                        {label} {Math.round(val)}g
                      </span>
                    ))}
                    <span style={{ fontSize:'12px', color:'var(--text-3)' }}>· {m.kcal} kcal</span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(m.id)}
                  className="btn-icon"
                  style={{ color:'var(--text-3)', marginLeft:'8px' }}
                  aria-label="Delete meal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:18, height:18 }}>
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            background:'var(--surface-2)', border:'1px solid var(--border-2)',
            borderRadius:'var(--r-md)', padding:'12px 16px',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'13px', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-3)' }}>
              Total Today
            </span>
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'17px', fontWeight:700, color:'var(--amber)' }}>
              {Math.round(total.kcal)} kcal
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Supplement Checklist ──────────────────
function SupplementChecklist() {
  const [checked, setChecked] = useState({});

  useEffect(() => { setChecked(getSupplements(today)); }, []);

  function handleToggle(key) {
    const newVal = toggleSupplement(today, key);
    setChecked(prev => ({ ...prev, [key]: newVal }));
    const sup = SUPPLEMENTS.find(s => s.key === key);
    if (newVal && sup) showToast(`${sup.name} ✓`, 'success');
  }

  const done  = Object.values(checked).filter(Boolean).length;
  const total = SUPPLEMENTS.length;

  return (
    <div style={{ marginTop:'24px', marginBottom:'8px' }}>
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">Supplements</h2>
        <span style={{ fontSize:'13px', color: done === total ? 'var(--green)' : 'var(--text-3)', fontWeight:700 }}>
          {done}/{total}
        </span>
      </div>
      <div className="card" style={{ padding:'8px' }}>
        {SUPPLEMENTS.map(sup => (
          <div
            key={sup.key}
            className="check-item"
            onClick={() => handleToggle(sup.key)}
            role="checkbox"
            aria-checked={!!checked[sup.key]}
            tabIndex={0}
            onKeyDown={(e) => e.key === ' ' && handleToggle(sup.key)}
          >
            <div className={`check-box${checked[sup.key] ? ' checked' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span>{sup.icon}</span>
                <p className={`check-label${checked[sup.key] ? ' checked' : ''}`}>{sup.name}</p>
                <span style={{ fontSize:'11px', color:'var(--text-3)' }}>{sup.dose}</span>
                {!sup.required && <span style={{ fontSize:'10px', color:'var(--text-3)', background:'var(--surface-3)', padding:'1px 6px', borderRadius:'4px' }}>optional</span>}
              </div>
              <p className="check-note">{sup.timing}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────
export default function NutritionPage() {
  const [targets,   setTargets]   = useState({ protein:150, carbs:200, fat:55, kcal:1895 });
  const [totals,    setTotals]    = useState({ protein:0, carbs:0, fat:0, kcal:0 });
  const [meals,     setMeals]     = useState([]);
  const [mealOpen,  setMealOpen]  = useState(false);
  const [phaseInfo, setPhaseInfo] = useState(null);

  const loadData = useCallback(() => {
    const s = getSettings();
    const p = getCurrentPhase(s.startDate);
    const t = getMacroTargets(p.phaseNum);
    setPhaseInfo(p);
    setTargets(t);
    setMeals(getMeals(today));
    setTotals(getTodayMealTotals(today));
  }, []);

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener('mealsUpdated', handler);
    return () => window.removeEventListener('mealsUpdated', handler);
  }, [loadData]);

  function handleDelete(id) {
    deleteMeal(id);
    showToast('Meal removed', 'info');
    loadData();
  }

  return (
    <div className="page-content">
      <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800, marginBottom:'16px' }}>Nutrition</h1>

      {/* Phase macro targets card */}
      <div className="card card-glow">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
          <p className="label">Phase {phaseInfo?.phaseNum} Target</p>
          <span style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--amber)' }}>
            {targets.kcal} kcal
          </span>
        </div>
        <p style={{ fontSize:'13px', color:'var(--text-2)', marginBottom:'12px' }}>
          {phaseInfo?.name} — Week {phaseInfo?.weekNum}
        </p>
        <div style={{ display:'flex', gap:'16px' }}>
          {[
            { label:'Protein', val:targets.protein, color:'var(--purple-light)' },
            { label:'Carbs',   val:targets.carbs,   color:'var(--blue)' },
            { label:'Fat',     val:targets.fat,      color:'var(--amber)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ flex:1 }}>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'22px', fontWeight:700, color }}>
                {val}<span style={{ fontSize:'12px', color:'var(--text-3)' }}>g</span>
              </p>
              <p style={{ fontSize:'11px', color:'var(--text-3)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Macro rings */}
        <MacroRings totals={totals} targets={targets} />

        {/* Calorie progress bar */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'12px', color:'var(--text-3)' }}>
            <span>Calories consumed</span>
            <span style={{ fontWeight:700, color:'var(--text-1)' }}>{Math.round(totals.kcal)} / {targets.kcal}</span>
          </div>
          <div style={{ height:'6px', background:'var(--border)', borderRadius:'999px', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:'999px',
              width: `${Math.min((totals.kcal / targets.kcal) * 100, 100)}%`,
              background:'linear-gradient(90deg, var(--purple-dark), var(--purple))',
              transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>
      </div>

      <MealList meals={meals} onDelete={handleDelete} onAdd={() => setMealOpen(true)} />
      <SupplementChecklist />

      {mealOpen && (
        <MealModal onClose={() => setMealOpen(false)} onSaved={loadData} />
      )}
    </div>
  );
}
