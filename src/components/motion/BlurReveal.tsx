'use client';

import { motion } from 'framer-motion';
import { cardReveal, VIEWPORT } from './variants';

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * BlurReveal — hardware-accelerated section card reveal.
 * Uses framer-motion whileInView for smooth, non-janky blur+slide entry.
 * Only animates opacity/transform/filter — no layout reflows.
 */
export default function BlurReveal({ children, className = '', delay = 0 }: BlurRevealProps) {
  return (
    <motion.div
      className={className}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      style={{ willChange: 'transform, opacity, filter' }}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
