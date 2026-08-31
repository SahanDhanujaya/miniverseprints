'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSlideRightToLeftProps {
  children: React.ReactNode;
}

export default function ScrollSlideRightToLeft({
  children,
}: ScrollSlideRightToLeftProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress while scrolling past this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Slide content from Right (+100%) to Center (0%) as user scrolls into view
  const x = useTransform(scrollYProgress, [1, 0], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      <motion.div style={{ x, opacity }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}