// app/layout.js — Root layout for GymTracker
import './globals.css';
import TopHeader from '@/components/layout/TopHeader';
import BottomNav from '@/components/layout/BottomNav';
import AIChatButton from '@/components/ai/AIChatButton';
import Toast from '@/components/shared/Toast';

export const viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'GymTracker — Aesthetic Physique',
  description: '12-Month aesthetic physique transformation tracker. Log workouts, track progress, get AI coaching.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GymTracker',
  },
  icons: {
    apple: '/icon-192.png',
    icon: '/icon-192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <div className="app-root">
          <TopHeader />
          <main className="page-main">
            {children}
          </main>
          <BottomNav />
          <AIChatButton />
          <Toast />
        </div>
      </body>
    </html>
  );
}
