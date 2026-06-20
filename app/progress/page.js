'use client';
// app/progress/page.js — Progress & PRs Page
import { useState, useEffect } from 'react';
import { getPRs, getMeasurements, getWorkouts, getSettings, toggleChecklist, getChecklist } from '@/lib/storage';
import { KEY_LIFTS, DAILY_CHECKLIST, ANKLE_MOBILITY } from '@/lib/program';
import { getWeeklyVolume, getThisWeekWorkouts } from '@/lib/stats';
import { showToast } from '@/components/shared/Toast';
import MeasurementModal from '@/components/modals/MeasurementModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ── PR Grid ───────────────────────────────
function PRGrid() {
  const [prs, setPRs] = useState({});
  useEffect(() => { setPRs(getPRs()); }, []);

  const isRecent = (dateStr) => {
    if (!dateStr) return false;
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 14 * 24 * 60 * 60 * 1000; // 14 days
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">Personal Records</h2>
      </div>
      <div className="grid-2">
        {KEY_LIFTS.map(({ name, muscle }) => {
          const pr = prs[name];
          return (
            <div key={name} className="card" style={{ padding:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                <span style={{ fontSize:'11px', color:'var(--text-3)', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  {muscle}
                </span>
                {pr && isRecent(pr.date) && (
                  <span style={{ fontSize:'14px' }}>⭐</span>
                )}
              </div>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'15px', fontWeight:700, color:'var(--text-1)', lineHeight:1.2, marginBottom:'8px' }}>
                {name}
              </p>
              {pr ? (
                <div>
                  <p style={{ fontFamily:'var(--font-heading)', fontSize:'26px', fontWeight:800, color:'var(--purple-light)' }}>
                    {pr.unit === 'reps' ? `${pr.weight} reps` : `${pr.weight} kg`}
                  </p>
                  {pr.unit !== 'reps' && (
                    <p style={{ fontSize:'12px', color:'var(--text-3)' }}>× {pr.reps} reps</p>
                  )}
                  <p style={{ fontSize:'11px', color:'var(--text-3)', marginTop:'4px' }}>{pr.date}</p>
                </div>
              ) : (
                <p style={{ fontSize:'14px', color:'var(--text-4)', fontFamily:'var(--font-heading)', fontWeight:700 }}>—</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Volume Chart ──────────────────────────
function VolumeChart() {
  const [data, setData] = useState([]);
  useEffect(() => { setData(getWeeklyVolume(8)); }, []);

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      { label:'Push', data: data.map(d => d.push), backgroundColor:'rgba(168,85,247,0.7)', borderRadius:4, borderSkipped:false },
      { label:'Pull', data: data.map(d => d.pull), backgroundColor:'rgba(96,165,250,0.7)',  borderRadius:4, borderSkipped:false },
      { label:'Legs', data: data.map(d => d.legs), backgroundColor:'rgba(52,211,153,0.7)',  borderRadius:4, borderSkipped:false },
    ],
  };

  const options = {
    responsive:true, maintainAspectRatio:false,
    plugins: {
      legend: { labels: { color:'#94A3B8', font:{ family:"'Barlow Condensed'", size:12, weight:'600' }, boxWidth:10, padding:12 } },
      tooltip: { callbacks: { label: (c) => ` ${c.dataset.label}: ${c.raw.toLocaleString()} kg` } },
    },
    scales: {
      x: { stacked:true, grid:{ color:'rgba(30,30,42,0.8)' }, ticks:{ color:'#475569', font:{ size:11 } } },
      y: { stacked:true, grid:{ color:'rgba(30,30,42,0.8)' }, ticks:{ color:'#475569', font:{ size:11 }, callback:(v) => `${v >= 1000 ? (v/1000).toFixed(1)+'t' : v}` } },
    },
  };

  return (
    <div style={{ marginTop:'24px' }}>
      <h2 className="section-title" style={{ marginBottom:'12px' }}>Weekly Volume (8 Weeks)</h2>
      <div className="card" style={{ padding:'16px' }}>
        {data.some(d => d.total > 0) ? (
          <div className="chart-wrapper"><Bar data={chartData} options={options} /></div>
        ) : (
          <p style={{ textAlign:'center', color:'var(--text-3)', padding:'32px 0', fontSize:'14px' }}>
            No workout data yet — start logging sessions!
          </p>
        )}
      </div>
    </div>
  );
}

// ── Measurement History ───────────────────
function MeasurementHistory({ onUpdate }) {
  const [list, setList] = useState([]);
  useEffect(() => { setList([...getMeasurements()].reverse()); }, []);

  const KEYS = ['chest','waist','shoulders','arms','forearms','thighs'];

  return (
    <div style={{ marginTop:'24px' }}>
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">Measurements</h2>
        <button className="btn-text" onClick={onUpdate}>+ Log</button>
      </div>
      {list.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'32px', color:'var(--text-3)', fontSize:'14px' }}>
          No measurements logged yet
        </div>
      ) : (
        list.slice(0, 4).map((m, i) => {
          const prev = list[i + 1];
          return (
            <div key={m.id} className="card" style={{ marginBottom:'10px' }}>
              <p style={{ fontSize:'12px', color:'var(--text-3)', marginBottom:'10px', fontFamily:'var(--font-heading)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                {m.date}
              </p>
              <div className="grid-3" style={{ gap:'8px' }}>
                {KEYS.map(k => {
                  const val  = m[k];
                  const pval = prev?.[k];
                  const diff = val && pval ? (val - pval).toFixed(1) : null;
                  const isWaist = k === 'waist';
                  const isUp    = diff && parseFloat(diff) > 0;
                  const good    = isWaist ? !isUp : isUp;
                  return val ? (
                    <div key={k} style={{ textAlign:'center' }}>
                      <p style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-1)' }}>
                        {val}
                        <span style={{ fontSize:'11px', color:'var(--text-3)' }}>cm</span>
                      </p>
                      {diff && diff !== '0.0' && (
                        <span style={{ fontSize:'11px', fontWeight:700, color: good ? 'var(--green)' : 'var(--red)' }}>
                          {isUp ? '+' : ''}{diff}
                        </span>
                      )}
                      <p style={{ fontSize:'10px', color:'var(--text-3)', textTransform:'capitalize' }}>{k}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Daily Checklist ───────────────────────
function DailyChecklistSection() {
  const today = new Date().toISOString().split('T')[0];
  const [checked, setChecked] = useState({});
  const [ankleStage, setAnkleStage] = useState(null);

  useEffect(() => {
    setChecked(getChecklist(today));
    
    // Load settings and calculate ankle stage
    const settings = getSettings();
    const startDate = settings?.startDate;
    let weekNum = 1;
    if (startDate) {
      const start = new Date(startDate);
      const todayDate = new Date();
      start.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      const days = Math.floor((todayDate - start) / (1000 * 60 * 60 * 24));
      weekNum = Math.max(1, Math.floor(days / 7) + 1);
    }

    let stage = ANKLE_MOBILITY[0];
    if (weekNum <= 4) stage = ANKLE_MOBILITY[0];
    else if (weekNum <= 8) stage = ANKLE_MOBILITY[1];
    else if (weekNum <= 16) stage = ANKLE_MOBILITY[2];
    else stage = ANKLE_MOBILITY[3];
    setAnkleStage(stage);
  }, [today]);

  function handleToggle(key) {
    const newVal = toggleChecklist(today, key);
    setChecked(prev => ({ ...prev, [key]: newVal }));
    if (newVal) showToast('Habit checked! 🔥', 'success');
  }

  const done  = Object.values(checked).filter(Boolean).length;
  const total = DAILY_CHECKLIST.length;

  return (
    <div style={{ marginTop:'24px', marginBottom:'8px' }}>
      <div className="section-header" style={{ marginBottom:'12px' }}>
        <h2 className="section-title">Daily Habits</h2>
        <span style={{ fontSize:'13px', color: done === total ? 'var(--green)' : 'var(--text-3)', fontWeight:700 }}>
          {done}/{total}
        </span>
      </div>
      <div className="card" style={{ padding:'8px' }}>
        {DAILY_CHECKLIST.map(item => (
          <div
            key={item.key}
            className="check-item"
            onClick={() => handleToggle(item.key)}
            role="checkbox"
            aria-checked={!!checked[item.key]}
            tabIndex={0}
            onKeyDown={(e) => e.key === ' ' && handleToggle(item.key)}
            style={{ alignItems: 'flex-start', paddingTop: '10px', paddingBottom: '10px' }}
          >
            <div className={`check-box${checked[item.key] ? ' checked' : ''}`} style={{ marginTop: '2px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <p className={`check-label${checked[item.key] ? ' checked' : ''}`}>{item.label}</p>
              <p className="check-note">{item.note}</p>
              
              {item.key === 'posture' && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-2)',
                  background: 'var(--surface-2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  borderLeft: '2px solid var(--purple-light)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>1. Chin Tucks</span>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>3 × 15 reps</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>2. Wall Angels</span>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>3 × 10 reps</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>3. Band Pull-Aparts</span>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>3 × 20 reps</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>4. Doorframe Stretch</span>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>60s each side</span>
                  </div>
                </div>
              )}
              
              {item.key === 'mobility' && ankleStage && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-2)',
                  background: 'var(--surface-2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  borderLeft: '2px solid var(--blue)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--blue)' }}>Stage {ankleStage.stage}: {ankleStage.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{ankleStage.duration}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.4, marginTop: '2px' }}>{ankleStage.desc}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────
export default function ProgressPage() {
  const [measureOpen, setMeasureOpen] = useState(false);

  return (
    <div className="page-content">
      <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'28px', fontWeight:800, marginBottom:'20px' }}>Progress</h1>
      <PRGrid />
      <VolumeChart />
      <MeasurementHistory onUpdate={() => setMeasureOpen(true)} />
      <DailyChecklistSection />

      {measureOpen && (
        <MeasurementModal onClose={() => setMeasureOpen(false)} />
      )}
    </div>
  );
}
