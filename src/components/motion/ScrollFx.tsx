'use client';

import { useEffect, useRef } from 'react';

/**
 * Mount this once, near the top of the page.
 * - Writes --scroll (0→1 progress through the whole page) onto <html>,
 *   which the background video / scrims read from in CSS (see globals-additions.css).
 * - Renders a thin top progress bar styled as a "print head" traveling
 *   across the page — ties the scroll position to the site's own subject
 *   (a 3D print job in progress) instead of being decoration.
 */
export default function ScrollFX() {
  const barRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty('--scroll', progress.toFixed(4));
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[100] bg-border/30 pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-accent transition-[width] duration-100 ease-out"
        style={{ width: 0, boxShadow: '0 0 12px var(--accent, currentColor)' }}
      />
    </div>
  );
}