'use client';
// components/layout/BottomNav.jsx
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="2"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    href: '/plan',
    label: 'Plan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    href: '/nutrition',
    label: 'Nutrition',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <nav style={styles.nav} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href);

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={styles.item}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Active indicator bar */}
            <span style={{
              ...styles.activeBar,
              opacity:    isActive ? 1 : 0,
              background: 'var(--purple)',
              boxShadow:  isActive ? '0 0 8px var(--purple)' : 'none',
            }} />

            {/* Icon */}
            <span style={{
              ...styles.iconWrap,
              color: isActive ? 'var(--purple-light)' : 'var(--text-3)',
              transform: isActive ? 'translateY(-1px)' : 'none',
            }}>
              {item.icon}
            </span>

            {/* Label */}
            <span style={{
              ...styles.label,
              color: isActive ? 'var(--purple-light)' : 'var(--text-3)',
              fontWeight: isActive ? 700 : 500,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--max-width)',
    height: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '8px',
    background: 'rgba(5,5,8,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    zIndex: 100,
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0',
    minHeight: '44px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 150ms ease-out',
    WebkitTapHighlightColor: 'transparent',
    background: 'none',
    border: 'none',
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '3px',
    borderRadius: '0 0 3px 3px',
    transition: 'all 250ms ease-out',
  },
  iconWrap: {
    width: '24px',
    height: '24px',
    transition: 'all 200ms ease-out',
  },
  label: {
    fontFamily: 'var(--font-heading)',
    fontSize: '10px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: 1,
    transition: 'all 150ms ease-out',
  },
};
