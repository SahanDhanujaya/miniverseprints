'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollSlideXProps {
  children: ReactNode;
  /** How far off-screen to start (positive = from right, negative = from left) */
  from?: string;
  /**
   * When the animation begins and ends relative to the viewport.
   * Default: starts moving the moment the element enters the bottom of the viewport,
   * finishes when the element's center reaches the viewport center.
   */
  offset?: [string, string];
  className?: string;
}

export default function ScrollSlideX({
  children,
  from = '72vw',
  offset,
  className,
}: ScrollSlideXProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollOffset: [string, string] = offset
    ? [offset[0], offset[1]]
    : ['start end', 'center center'];

  const { scrollYProgress } = useScroll({
    target: ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: scrollOffset as any,
  });

  // Raw scroll-driven x position
  const xRaw = useTransform(scrollYProgress, [0, 1], [from, '0vw']);

  // Gentle spring smoothing so the motion feels organic, not mechanical
  const x = useSpring(xRaw, { stiffness: 60, damping: 20, mass: 0.8 });

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
