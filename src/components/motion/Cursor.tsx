'use client';

import { useEffect, useRef } from 'react';

/**
 * A soft accent-colored glow that trails the pointer, and expands slightly
 * over anything marked data-cursor="hover" (links, buttons, cards). Mount
 * once near the root. Disabled on touch devices and for reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduceMotion) return;

    document.body.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="hover"]')) {
        dotRef.current?.classList.add('cursor-hover');
      } else {
        dotRef.current?.classList.remove('cursor-hover');
      }
    };

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return <div ref={dotRef} className="site-cursor" aria-hidden="true" />;
}