'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  items: string[];
  speed?: number; // seconds for one full loop
  className?: string;
}

/**
 * Continuous horizontal ticker. Only animates while on screen (paused
 * outside the viewport via IntersectionObserver) to avoid burning cycles
 * on an off-screen animation. Reduced-motion users get a static row.
 */
export default function Marquee({ items, speed = 28, className = '' }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const track = [...items, ...items]; // duplicated for a seamless loop

  if (reduceMotion) {
    return (
      <div className={`flex flex-wrap gap-x-8 gap-y-2 justify-center ${className}`}>
        {items.map((item, i) => (
          <span key={i} className="text-sm uppercase tracking-widest text-foreground-muted">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max gap-10 whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationPlayState: playing ? 'running' : 'paused',
        }}
      >
        {track.map((item, i) => (
          <span key={i} className="text-sm uppercase tracking-widest text-foreground-muted flex items-center gap-10">
            {item}
            <span className="text-accent">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}