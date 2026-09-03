'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSlideBottomToTopProps {
  children: React.ReactNode;
}

export default function ScrollSlideBottomToTop({
  children,
}: ScrollSlideBottomToTopProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress as the section enters the bottom of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Emerge from bottom (translateY: 120px to 0px)
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);

  // Subtle depth scale (0.92 to 1)
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  // Smooth fade-in
  const opacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

  return (
    <div ref={containerRef} className="w-full">
      <motion.div style={{ y, scale, opacity }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}