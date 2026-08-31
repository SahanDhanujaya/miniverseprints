'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSlideInProps {
  galleryContent: React.ReactNode;
  craftsmanContent: React.ReactNode;
}

export default function ScrollSlideIn({
  galleryContent,
  craftsmanContent,
}: ScrollSlideInProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within a sticky 200vh height section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Slide Inquiry in from Left to Right: -100% (hidden on left) to 0% (full view)
  const inquiryX = useTransform(scrollYProgress, [0.1, 0.85], ['-100%', '0%']);
  
  // Slide Craftsman out to the Right simultaneously: 0% to 100%
  const craftsmanX = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%']);

  // Smooth cross-fade to prevent visual artifacts
  const craftsmanOpacity = useTransform(scrollYProgress, [0.5, 0.85], [1, 0]);
  const inquiryOpacity = useTransform(scrollYProgress, [0.1, 0.45], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[220vh] w-full">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Craftsman Section (Slides out to right) */}
          <motion.div
            style={{ x: craftsmanX, opacity: craftsmanOpacity }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {galleryContent}
          </motion.div>

          {/* Inquiry Section (Slides in from left to right) */}
          <motion.div
            style={{ x: inquiryX, opacity: inquiryOpacity }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {craftsmanContent}
          </motion.div>

        </div>
      </div>
    </div>
  );
}