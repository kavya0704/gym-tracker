'use client';
// components/shared/ConfettiEffect.jsx
// Canvas-based confetti burst on PR detection

import { useEffect, useRef } from 'react';

const COLORS = [
  '#A855F7', '#C084FC', '#FBBF24', '#34D399',
  '#60A5FA', '#F97316', '#ffffff', '#F472B6',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function ConfettiEffect({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone?.();
      return;
    }

    const canvas  = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const particles = Array.from({ length: 90 }, () => ({
      x:      randomBetween(canvas.width * 0.2, canvas.width * 0.8),
      y:      randomBetween(-20, -canvas.height * 0.1),
      vx:     randomBetween(-4, 4),
      vy:     randomBetween(3, 8),
      size:   randomBetween(6, 12),
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, 360),
      rotationSpeed: randomBetween(-6, 6),
      shape:  Math.random() > 0.5 ? 'rect' : 'circle',
      gravity: randomBetween(0.15, 0.35),
      opacity: 1,
    }));

    let frame;
    let elapsed = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      particles.forEach((p) => {
        p.x        += p.vx;
        p.y        += p.vy;
        p.vy       += p.gravity;
        p.vx       *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity   = Math.max(0, 1 - elapsed / 120);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < 140) {
        frame = requestAnimationFrame(animate);
      } else {
        onDone?.();
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
