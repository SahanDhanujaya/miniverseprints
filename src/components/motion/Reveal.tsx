'use client';

import { useEffect, useRef, useState, ReactNode, JSX } from 'react';

type Variant = 'fade-up' | 'clip' | 'scale' | 'tilt';

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number; // ms
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const variantClass: Record<Variant, string> = {
  'fade-up': 'reveal',
  clip: 'reveal-clip',
  scale: 'reveal-scale',
  tilt: 'reveal-tilt',
};

/**
 * Wraps any block of content and animates it in once, the first time it
 * crosses ~15% into the viewport. Respects prefers-reduced-motion via CSS
 * (see globals-additions.css) rather than duplicating that logic here.
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`${variantClass[variant]} ${isIn ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}