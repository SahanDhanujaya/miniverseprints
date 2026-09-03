'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // -1 to 1. Negative = drifts up as you scroll down, positive = down.
  className?: string;
}

/**
 * Moves its contents at a different rate than the page scroll, based on the
 * element's own position relative to the viewport (not a global --scroll
 * value) so it works correctly no matter where on the page it sits.
 * No-ops for touch / prefers-reduced-motion.
 */
export default function Parallax({ children, speed = 0.15, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportMid = window.innerHeight / 2;
      const elMid = rect.top + rect.height / 2;
      const offset = (viewportMid - elMid) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}