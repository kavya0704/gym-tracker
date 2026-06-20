'use client';
// components/shared/ProgressRing.jsx
// Reusable animated SVG circular progress ring

export default function ProgressRing({
  size       = 44,
  strokeWidth = 3,
  percent    = 0,
  color      = 'var(--purple)',
  bgColor    = 'var(--border)',
  label      = null,
  labelStyle = {},
  animated   = true,
}) {
  const radius      = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped     = Math.min(Math.max(percent, 0), 100);
  const offset      = circumference - (clamped / 100) * circumference;
  const cx          = size / 2;
  const cy          = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated
              ? 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)'
              : 'none',
          }}
        />
      </svg>

      {/* Center label */}
      {label !== null && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: size < 60 ? '11px' : '14px',
          fontWeight: 700,
          color: 'var(--text-1)',
          ...labelStyle,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
